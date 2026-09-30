-- =============================================================================
-- Access control
--
-- Facilities (tenants), staff profiles, roles, permissions and role
-- assignments, plus the helper functions the application and RLS policies
-- use. Implements the model in docs/security/README.md#authorization:
--
--   User ──< role_assignments >── roles ──< role_permissions >── permissions
--                  │
--                  └── scope: tenant (facility), optionally a department
--
-- Principles: deny by default, no superuser flag (an administrator is a role
-- with explicit permissions), every table has RLS enabled in this migration.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Shared helpers
-- ---------------------------------------------------------------------------

create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table public.tenants (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(btrim(name)) between 1 and 200),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
comment on table public.tenants is
  'A hospital or facility. Staff profiles and role grants belong to exactly one.';

create table public.permissions (
  key text primary key check (key ~ '^[a-z_]+\.[a-z_]+$'),
  description text not null
);
comment on table public.permissions is
  'Permission catalogue. Keys must match src/lib/permissions/catalog.ts.';

create table public.roles (
  id uuid primary key default gen_random_uuid(),
  key text not null unique check (key ~ '^[a-z_]+$'),
  name text not null check (char_length(btrim(name)) between 1 and 100),
  description text not null default '',
  -- System roles are created by migrations and must not be edited in the UI.
  is_system boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.role_permissions (
  role_id uuid not null references public.roles (id) on delete cascade,
  permission_key text not null
    references public.permissions (key) on update cascade on delete cascade,
  primary key (role_id, permission_key)
);
create index role_permissions_permission_key_idx
  on public.role_permissions (permission_key);

-- A fixed technical state, so a Postgres enum is appropriate.
create type public.staff_status as enum ('active', 'deactivated');

create table public.staff_profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  tenant_id uuid not null references public.tenants (id),
  full_name text not null check (char_length(btrim(full_name)) between 1 and 200),
  job_title text check (job_title is null or char_length(job_title) <= 120),
  status public.staff_status not null default 'active',
  created_at timestamptz not null default now(),
  created_by uuid default auth.uid() references auth.users (id) on delete set null,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null
);
create index staff_profiles_tenant_id_idx on public.staff_profiles (tenant_id);

create table public.role_assignments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  role_id uuid not null references public.roles (id) on delete restrict,
  tenant_id uuid not null references public.tenants (id),
  -- Department scope. Null means the whole facility. A foreign key will be
  -- added when the departments table exists.
  department_id uuid,
  created_at timestamptz not null default now(),
  created_by uuid default auth.uid() references auth.users (id) on delete set null,
  unique nulls not distinct (user_id, role_id, tenant_id, department_id)
);
create index role_assignments_user_id_idx on public.role_assignments (user_id);
create index role_assignments_role_id_idx on public.role_assignments (role_id);
create index role_assignments_tenant_id_idx on public.role_assignments (tenant_id);

create trigger tenants_set_updated_at
  before update on public.tenants
  for each row execute function public.set_updated_at();
create trigger roles_set_updated_at
  before update on public.roles
  for each row execute function public.set_updated_at();
create trigger staff_profiles_set_updated_at
  before update on public.staff_profiles
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Authorization helpers
--
-- SECURITY DEFINER so they can read the access tables regardless of the
-- caller's RLS, but they only ever answer questions about the caller
-- (auth.uid()) or refuse unless the caller holds the needed permission.
-- ---------------------------------------------------------------------------

-- The caller's effective grants. Deactivated staff have none.
create function public.current_user_grants()
returns table (permission text, tenant_id uuid, department_id uuid)
language sql
stable
security definer
set search_path = ''
as $$
  select distinct rp.permission_key, ra.tenant_id, ra.department_id
  from public.role_assignments ra
  join public.staff_profiles sp
    on sp.user_id = ra.user_id
   and sp.tenant_id = ra.tenant_id
   and sp.status = 'active'
  join public.role_permissions rp on rp.role_id = ra.role_id
  where ra.user_id = (select auth.uid());
$$;

-- True if the caller holds `p_permission` for the whole facility. Mirrors
-- `can()` in src/lib/permissions/check.ts for use in RLS policies.
create function public.has_permission(p_permission text, p_tenant_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.current_user_grants() g
    where g.permission = p_permission
      and g.tenant_id = p_tenant_id
      and g.department_id is null
  );
$$;

create function public.current_user_tenant_ids()
returns setof uuid
language sql
stable
security definer
set search_path = ''
as $$
  select sp.tenant_id
  from public.staff_profiles sp
  where sp.user_id = (select auth.uid())
    and sp.status = 'active';
$$;

-- Staff list for the admin console: one page, searched and sorted in SQL.
-- Joins auth.users (email, invitation and sign-in times), which is why it is
-- SECURITY DEFINER; it refuses callers without `staff.read` in the facility.
create function public.staff_directory(
  p_tenant_id uuid,
  p_search text default null,
  p_sort text default 'full_name',
  p_ascending boolean default true,
  p_limit integer default 25,
  p_offset integer default 0
)
returns table (
  user_id uuid,
  full_name text,
  email text,
  job_title text,
  status public.staff_status,
  roles text[],
  invited_at timestamptz,
  last_sign_in_at timestamptz,
  total_count bigint
)
language plpgsql
stable
security definer
set search_path = ''
as $$
#variable_conflict use_column
declare
  v_pattern text;
begin
  if not public.has_permission('staff.read', p_tenant_id) then
    raise exception 'permission denied' using errcode = '42501';
  end if;
  if p_sort not in ('full_name', 'email', 'last_sign_in_at', 'invited_at') then
    raise exception 'invalid sort column' using errcode = '22023';
  end if;

  -- Escape LIKE wildcards so the search is literal.
  v_pattern := case
    when nullif(btrim(p_search), '') is null then null
    -- E'' strings: the same meaning whatever standard_conforming_strings is.
    else '%' || replace(replace(replace(btrim(p_search), E'\\', E'\\\\'), '%', E'\\%'), '_', E'\\_') || '%'
  end;

  return query
  with base as (
    select
      sp.user_id,
      sp.full_name,
      u.email::text as email,
      sp.job_title,
      sp.status,
      coalesce(
        (
          select array_agg(r.name order by r.name)
          from public.role_assignments ra
          join public.roles r on r.id = ra.role_id
          where ra.user_id = sp.user_id
            and ra.tenant_id = sp.tenant_id
        ),
        '{}'::text[]
      ) as roles,
      coalesce(u.invited_at, u.created_at) as invited_at,
      u.last_sign_in_at
    from public.staff_profiles sp
    join auth.users u on u.id = sp.user_id
    where sp.tenant_id = p_tenant_id
      and (
        v_pattern is null
        or sp.full_name ilike v_pattern
        or u.email ilike v_pattern
      )
  )
  select
    b.user_id,
    b.full_name,
    b.email,
    b.job_title,
    b.status,
    b.roles,
    b.invited_at,
    b.last_sign_in_at,
    count(*) over () as total_count
  from base b
  order by
    case when p_sort = 'full_name' and p_ascending then b.full_name end asc nulls last,
    case when p_sort = 'full_name' and not p_ascending then b.full_name end desc nulls last,
    case when p_sort = 'email' and p_ascending then b.email end asc nulls last,
    case when p_sort = 'email' and not p_ascending then b.email end desc nulls last,
    case when p_sort = 'last_sign_in_at' and p_ascending then b.last_sign_in_at end asc nulls last,
    case when p_sort = 'last_sign_in_at' and not p_ascending then b.last_sign_in_at end desc nulls last,
    case when p_sort = 'invited_at' and p_ascending then b.invited_at end asc nulls last,
    case when p_sort = 'invited_at' and not p_ascending then b.invited_at end desc nulls last,
    b.user_id
  limit least(greatest(p_limit, 1), 100)
  offset greatest(p_offset, 0);
end;
$$;

-- Headline counts for the admin overview.
create function public.staff_summary(p_tenant_id uuid)
returns table (
  total bigint,
  active bigint,
  pending_invitations bigint,
  administrators bigint
)
language plpgsql
stable
security definer
set search_path = ''
as $$
#variable_conflict use_column
begin
  if not public.has_permission('staff.read', p_tenant_id) then
    raise exception 'permission denied' using errcode = '42501';
  end if;

  return query
  select
    count(*),
    count(*) filter (where sp.status = 'active'),
    count(*) filter (where u.last_sign_in_at is null),
    count(*) filter (
      where exists (
        select 1
        from public.role_assignments ra
        join public.roles r on r.id = ra.role_id
        where ra.user_id = sp.user_id
          and ra.tenant_id = sp.tenant_id
          and r.key = 'administrator'
      )
    )
  from public.staff_profiles sp
  join auth.users u on u.id = sp.user_id
  where sp.tenant_id = p_tenant_id;
end;
$$;

-- Creates the profile and first role for a newly invited user in one
-- transaction. SECURITY INVOKER: the insert policies below decide whether the
-- caller may do this (`staff.invite` and `roles.assign` in the facility).
create function public.provision_staff(
  p_user_id uuid,
  p_tenant_id uuid,
  p_full_name text,
  p_job_title text,
  p_role_id uuid
)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
begin
  insert into public.staff_profiles (user_id, tenant_id, full_name, job_title)
  values (p_user_id, p_tenant_id, btrim(p_full_name), nullif(btrim(p_job_title), ''));

  insert into public.role_assignments (user_id, role_id, tenant_id)
  values (p_user_id, p_role_id, p_tenant_id);
end;
$$;

-- ---------------------------------------------------------------------------
-- Privileges: nothing for anonymous visitors; RLS governs signed-in users.
-- ---------------------------------------------------------------------------

revoke all on table
  public.tenants,
  public.permissions,
  public.roles,
  public.role_permissions,
  public.staff_profiles,
  public.role_assignments
from anon;

revoke all on function public.set_updated_at() from public, anon, authenticated;

revoke all on function
  public.current_user_grants(),
  public.has_permission(text, uuid),
  public.current_user_tenant_ids(),
  public.staff_directory(uuid, text, text, boolean, integer, integer),
  public.staff_summary(uuid),
  public.provision_staff(uuid, uuid, text, text, uuid)
from public, anon;

grant execute on function
  public.current_user_grants(),
  public.has_permission(text, uuid),
  public.current_user_tenant_ids(),
  public.staff_directory(uuid, text, text, boolean, integer, integer),
  public.staff_summary(uuid),
  public.provision_staff(uuid, uuid, text, text, uuid)
to authenticated;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table public.tenants enable row level security;
alter table public.permissions enable row level security;
alter table public.roles enable row level security;
alter table public.role_permissions enable row level security;
alter table public.staff_profiles enable row level security;
alter table public.role_assignments enable row level security;

create policy "Staff can read their own facility"
  on public.tenants for select to authenticated
  using (id in (select public.current_user_tenant_ids()));

create policy "Signed-in users can read the permission catalogue"
  on public.permissions for select to authenticated
  using (true);

create policy "Signed-in users can read roles"
  on public.roles for select to authenticated
  using (true);

create policy "Signed-in users can read role permissions"
  on public.role_permissions for select to authenticated
  using (true);

create policy "Staff read their own profile; staff readers read their facility"
  on public.staff_profiles for select to authenticated
  using (
    user_id = (select auth.uid())
    or public.has_permission('staff.read', tenant_id)
  );

create policy "Staff inviters create profiles in their facility"
  on public.staff_profiles for insert to authenticated
  with check (
    public.has_permission('staff.invite', tenant_id)
    and created_by = (select auth.uid())
  );

create policy "Staff read their own roles; staff readers read their facility"
  on public.role_assignments for select to authenticated
  using (
    user_id = (select auth.uid())
    or public.has_permission('staff.read', tenant_id)
  );

create policy "Role assigners assign roles in their facility"
  on public.role_assignments for insert to authenticated
  with check (
    public.has_permission('roles.assign', tenant_id)
    and created_by = (select auth.uid())
  );

-- No update or delete policies yet: changing or removing access is done by
-- a future, audited admin feature.

-- ---------------------------------------------------------------------------
-- Reference data
-- ---------------------------------------------------------------------------

insert into public.permissions (key, description) values
  ('admin.access', 'Open the administration console'),
  ('staff.read', 'View staff accounts in the facility'),
  ('staff.invite', 'Invite new staff accounts'),
  ('roles.assign', 'Assign roles to staff'),
  ('patients.read', 'View patient records'),
  ('patients.create', 'Register patients'),
  ('patients.update', 'Update patient details'),
  ('clinical.read', 'View clinical notes, observations and results'),
  ('clinical.write', 'Record clinical notes and observations'),
  ('billing.read', 'View bills and payments'),
  ('billing.create', 'Create bills and record payments'),
  ('billing.refund', 'Issue refunds'),
  ('pharmacy.read', 'View prescriptions and stock'),
  ('pharmacy.dispense', 'Dispense medicines');

-- The Administrator manages accounts and access only; it deliberately has no
-- clinical or billing permissions. The other roles are PROVISIONAL templates
-- so staff can be invited; they will be finalised during domain modelling.
insert into public.roles (key, name, description, is_system) values
  ('administrator', 'Administrator', 'Manages staff accounts and access. No clinical access.', true),
  ('doctor', 'Doctor', 'Provisional template for medical staff.', false),
  ('nurse', 'Nurse', 'Provisional template for nursing staff.', false),
  ('records_officer', 'Records officer', 'Provisional template for health records staff.', false),
  ('pharmacist', 'Pharmacist', 'Provisional template for pharmacy staff.', false),
  ('billing_officer', 'Billing officer', 'Provisional template for accounts staff.', false);

insert into public.role_permissions (role_id, permission_key)
select r.id, v.permission_key
from (
  values
    ('administrator', 'admin.access'),
    ('administrator', 'staff.read'),
    ('administrator', 'staff.invite'),
    ('administrator', 'roles.assign'),
    ('doctor', 'patients.read'),
    ('doctor', 'clinical.read'),
    ('doctor', 'clinical.write'),
    ('nurse', 'patients.read'),
    ('nurse', 'clinical.read'),
    ('nurse', 'clinical.write'),
    ('records_officer', 'patients.read'),
    ('records_officer', 'patients.create'),
    ('records_officer', 'patients.update'),
    ('pharmacist', 'patients.read'),
    ('pharmacist', 'pharmacy.read'),
    ('pharmacist', 'pharmacy.dispense'),
    ('billing_officer', 'patients.read'),
    ('billing_officer', 'billing.read'),
    ('billing_officer', 'billing.create')
) as v (role_key, permission_key)
join public.roles r on r.key = v.role_key;
