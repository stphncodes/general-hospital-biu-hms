# Migrations

**Empty by design.** The hospital schema has not been designed yet. It will be
produced during the domain-modelling phase and reviewed before any migration
is written. See [docs/database/README.md](../../docs/database/README.md).

## Conventions (for when migrations begin)

- Create with `npx supabase migration new <descriptive_name>`; never edit a
  migration that has been applied to a shared environment — add a new one.
- Every table in an exposed schema **must** enable Row Level Security in the
  same migration that creates it, with explicit policies. No table ships
  without RLS.
- Use `uuid` primary keys, `timestamptz` for instants, `date` for calendar
  dates, and `created_at` / `updated_at` columns.
- Prefer soft-deletion or status transitions for clinical records; clinical
  history must not be silently destroyed.
- After schema changes, regenerate TypeScript types into
  `src/types/database.ts` (see docs/database/README.md).
