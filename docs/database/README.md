# Database

> **No hospital schema exists yet — intentionally.** The data model is the
> most consequential design decision in this project and will be designed
> and reviewed as a dedicated phase before any migration is written.

## Platform

- PostgreSQL (major version 17 locally) managed by Supabase.
- Schema changes only through migrations in `supabase/migrations/`.
- Local stack: `npx supabase start` (requires Docker). See
  [workflows](../workflows/README.md).

## Domain-modelling phase: what must be decided

A first sketch of the core aggregates, to be validated with stakeholders:

```text
Hospital (tenant)
 ├── Departments / Units / Wards
 ├── Staff  ── user account, cadre, department memberships
 ├── Roles & Permissions (scoped)
 └── Services & Tariffs

Patient
 ├── Visits
 │    └── Encounters
 │          ├── Observations & Notes
 │          ├── Diagnoses
 │          ├── Orders ── Results (lab, radiology)
 │          └── Prescriptions ── Dispensing
 ├── Admissions ── Bed assignments ── Transfers ── Discharge
 └── Billing ── Charges ── Invoices ── Payments ── Claims
```

Key questions include: the exact meaning of _visit_ vs _encounter_ vs
_admission_; patient identity and duplicate management; which coding systems
are used (e.g. ICD for diagnoses); how orders, results and prescriptions are
versioned and corrected; and how every row is attributed to a tenant.

## Conventions (proposed; confirm during modelling)

| Topic         | Convention                                                                                                                     |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Naming        | `snake_case`, plural table names                                                                                               |
| Keys          | `uuid` primary keys (`gen_random_uuid()`); human-readable numbers (hospital number, invoice number) as separate unique columns |
| Tenancy       | `tenant_id uuid not null` on every tenant-owned table, indexed                                                                 |
| Time          | `timestamptz` for instants, `date` for calendar dates                                                                          |
| Audit columns | `created_at`, `created_by`, `updated_at`, `updated_by`                                                                         |
| Deletion      | Clinical records are never hard-deleted; use status/correction records                                                         |
| Money         | `numeric(14,2)` with an explicit currency; never floating point                                                                |
| Enumerations  | Lookup tables for data stakeholders maintain; Postgres enums only for fixed technical states                                   |
| Security      | RLS enabled on every exposed table in the same migration                                                                       |

## Performance principles

- Filter, sort and paginate in the database; never fetch whole tables.
- Index foreign keys, `tenant_id`, and columns used in list filters/sorts.
- Consider keyset pagination for very large, append-heavy lists.
- Aggregate reports in SQL (views/functions), not in application code.

## Generated types

After the schema exists:

```bash
npx supabase gen types typescript --local > src/types/database.ts
```

Then parameterise the clients in `src/lib/supabase/` with `Database`.
