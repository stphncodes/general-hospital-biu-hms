/**
 * Database tests for supabase/migrations/*_access_control.sql.
 *
 * Runs the real migration in PGlite (in-process PostgreSQL) against a minimal
 * stand-in for Supabase's `auth` schema and API roles, then checks the
 * security behaviour as different users. No Docker or network needed.
 */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { PGlite } from "@electric-sql/pglite";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const MIGRATIONS_DIR = join(process.cwd(), "supabase", "migrations");
const migrationFile = readdirSync(MIGRATIONS_DIR).find((f) =>
  f.endsWith("_access_control.sql"),
);

const ADMIN = "00000000-0000-4000-8000-00000000000a";
const NURSE = "00000000-0000-4000-8000-00000000000b";
const NEWBIE = "00000000-0000-4000-8000-00000000000c";
const OTHER_ADMIN = "00000000-0000-4000-8000-00000000000d";
const T1 = "10000000-0000-4000-8000-000000000001";
const T2 = "10000000-0000-4000-8000-000000000002";

let db: PGlite;

/** Run the following queries as `role`, signed in as `userId` (JWT `sub`). */
async function as(role: "authenticated" | "anon", userId: string | null) {
  await db.exec(
    `reset role; select set_config('request.jwt.claim.sub', '${userId ?? ""}', false);`,
  );
  await db.exec(`set role ${role}`);
}
async function asSuperuser() {
  await db.exec("reset role");
}

beforeAll(async () => {
  expect(migrationFile, "access-control migration exists").toBeDefined();
  db = new PGlite();

  // Minimal stand-in for Supabase: API roles, auth.users and auth.uid().
  await db.exec(`
    create role anon nologin;
    create role authenticated nologin;
    create role service_role nologin bypassrls;
    create schema auth;
    grant usage on schema auth to anon, authenticated, service_role;
    create table auth.users (
      id uuid primary key,
      email text,
      invited_at timestamptz,
      created_at timestamptz not null default now(),
      last_sign_in_at timestamptz
    );
    create function auth.uid() returns uuid language sql stable as $$
      select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid
    $$;
    grant execute on function auth.uid() to anon, authenticated;
    alter default privileges in schema public grant all on tables to anon, authenticated, service_role;
    alter default privileges in schema public grant all on functions to anon, authenticated, service_role;
    grant usage on schema public to anon, authenticated, service_role;
  `);

  await db.exec(readFileSync(join(MIGRATIONS_DIR, migrationFile!), "utf8"));

  await db.exec(`
    insert into auth.users (id, email, last_sign_in_at) values
      ('${ADMIN}', 'admin@example.test', now()),
      ('${NURSE}', 'nurse@example.test', now()),
      ('${NEWBIE}', 'new_person@example.test', null),
      ('${OTHER_ADMIN}', 'other@example.test', now());
    insert into public.tenants (id, name) values
      ('${T1}', 'Test Facility'), ('${T2}', 'Other Facility');
    insert into public.staff_profiles (user_id, tenant_id, full_name) values
      ('${ADMIN}', '${T1}', 'Test Admin 001'),
      ('${NURSE}', '${T1}', 'Test Nurse 001'),
      ('${OTHER_ADMIN}', '${T2}', 'Test Admin 002');
    insert into public.role_assignments (user_id, role_id, tenant_id)
      select '${ADMIN}', id, '${T1}' from public.roles where key = 'administrator';
    insert into public.role_assignments (user_id, role_id, tenant_id)
      select '${NURSE}', id, '${T1}' from public.roles where key = 'nurse';
    insert into public.role_assignments (user_id, role_id, tenant_id)
      select '${OTHER_ADMIN}', id, '${T2}' from public.roles where key = 'administrator';
  `);
}, 60_000);

afterAll(async () => {
  await db?.close();
});

const permissionsOf = async () =>
  (
    await db.query<{ permission: string }>(
      "select permission from public.current_user_grants() order by 1",
    )
  ).rows.map((r) => r.permission);

describe("access-control migration", () => {
  it("gives the Administrator exactly the admin permissions", async () => {
    await as("authenticated", ADMIN);
    expect(await permissionsOf()).toEqual([
      "admin.access",
      "roles.assign",
      "staff.invite",
      "staff.read",
    ]);
  });

  it("gives a nurse no admin permissions", async () => {
    await as("authenticated", NURSE);
    const permissions = await permissionsOf();
    expect(permissions.length).toBeGreaterThan(0);
    expect(permissions.some((p) => /^(admin|staff|roles)\./.test(p))).toBe(false);
  });

  it("lists, searches and sorts staff for an admin's own facility only", async () => {
    await as("authenticated", ADMIN);
    const all = await db.query<{
      full_name: string;
      roles: string[];
      total_count: number;
    }>("select * from public.staff_directory($1)", [T1]);
    expect(all.rows.map((r) => r.full_name)).toEqual([
      "Test Admin 001",
      "Test Nurse 001",
    ]);
    expect(all.rows[0]!.roles).toEqual(["Administrator"]);
    expect(Number(all.rows[0]!.total_count)).toBe(2);

    const search = await db.query<{ full_name: string }>(
      "select full_name from public.staff_directory($1, 'nurse')",
      [T1],
    );
    expect(search.rows.map((r) => r.full_name)).toEqual(["Test Nurse 001"]);

    const wildcard = await db.query("select 1 from public.staff_directory($1, '%')", [
      T1,
    ]);
    expect(wildcard.rows).toHaveLength(0);

    const desc = await db.query<{ full_name: string }>(
      "select full_name from public.staff_directory($1, null, 'full_name', false)",
      [T1],
    );
    expect(desc.rows[0]!.full_name).toBe("Test Nurse 001");

    await expect(
      db.query("select * from public.staff_directory($1, null, 'password')", [T1]),
    ).rejects.toThrow(/invalid sort column/);
    await expect(
      db.query("select * from public.staff_directory($1)", [T2]),
    ).rejects.toThrow(/permission denied/);
  });

  it("refuses the directory to staff without staff.read", async () => {
    await as("authenticated", NURSE);
    await expect(
      db.query("select * from public.staff_directory($1)", [T1]),
    ).rejects.toThrow(/permission denied/);
    const own = await db.query<{ user_id: string }>(
      "select user_id from public.staff_profiles",
    );
    expect(own.rows.map((r) => r.user_id)).toEqual([NURSE]);
  });

  it("lets an admin provision staff and enforces it with RLS", async () => {
    const nurseRole = (
      await db.query<{ id: string }>("select id from public.roles where key = 'nurse'")
    ).rows[0]!.id;

    await as("authenticated", NURSE);
    await expect(
      db.query("select public.provision_staff($1, $2, 'Test Person 003', null, $3)", [
        NEWBIE,
        T1,
        nurseRole,
      ]),
    ).rejects.toThrow(/row-level security/);

    await as("authenticated", ADMIN);
    await expect(
      db.query("select public.provision_staff($1, $2, 'X', null, $3)", [
        NEWBIE,
        T2,
        nurseRole,
      ]),
    ).rejects.toThrow(/row-level security/);

    await db.query(
      "select public.provision_staff($1, $2, '  Test Person 003  ', '', $3)",
      [NEWBIE, T1, nurseRole],
    );
    const created = await db.query<{
      full_name: string;
      job_title: string | null;
      created_by: string;
    }>(
      "select full_name, job_title, created_by from public.staff_profiles where user_id = $1",
      [NEWBIE],
    );
    expect(created.rows[0]).toEqual({
      full_name: "Test Person 003",
      job_title: null,
      created_by: ADMIN,
    });

    const summary = await db.query<Record<string, number>>(
      "select * from public.staff_summary($1)",
      [T1],
    );
    expect(Number(summary.rows[0]!.total)).toBe(3);
    expect(Number(summary.rows[0]!.pending_invitations)).toBe(1);
    expect(Number(summary.rows[0]!.administrators)).toBe(1);
  });

  it("has no update policy: changes silently affect zero rows", async () => {
    await as("authenticated", ADMIN);
    const updated = await db.query(
      "update public.staff_profiles set full_name = 'Changed' where user_id = $1 returning 1",
      [NURSE],
    );
    expect(updated.rows).toHaveLength(0);
  });

  it("removes all access from deactivated staff", async () => {
    await asSuperuser();
    await db.query(
      "update public.staff_profiles set status = 'deactivated' where user_id = $1",
      [OTHER_ADMIN],
    );
    await as("authenticated", OTHER_ADMIN);
    expect(await permissionsOf()).toEqual([]);
  });

  it("gives anonymous visitors no access at all", async () => {
    await as("anon", null);
    await expect(db.query("select * from public.staff_profiles")).rejects.toThrow(
      /permission denied/,
    );
    await expect(
      db.query("select * from public.staff_directory($1)", [T1]),
    ).rejects.toThrow(/permission denied/);
    await expect(db.query("select * from public.current_user_grants()")).rejects.toThrow(
      /permission denied/,
    );
  });
});
