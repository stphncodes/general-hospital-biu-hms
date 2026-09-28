# Shared types

Types used across several features. Feature-specific types live in
`src/features/<module>/types`, and types derived from Zod schemas should use
`z.infer` rather than being written by hand.

## Planned

- `database.ts` — generated from the PostgreSQL schema once it exists:

  ```bash
  npx supabase gen types typescript --local > src/types/database.ts
  ```

  The Supabase clients in `src/lib/supabase/` will then be parameterised
  with `Database` for end-to-end type safety. Generated files are never
  edited by hand.
