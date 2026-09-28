# 0002. Supabase for auth and PostgreSQL, with RLS as the final boundary

- **Status:** Accepted
- **Date:** 2026-09-28

## Context

We need relational data with strong integrity, authentication with MFA, and
file storage, operated by a small team, with an option to self-host.

## Decision

Use Supabase (PostgreSQL, Auth, Storage) through `@supabase/ssr` with the
publishable key for user-context clients and the secret key only in a
`server-only` admin client. Every exposed table has Row Level Security;
RLS is treated as the final authorization layer, not the only one.
Server-side identity uses `getClaims()` (verified JWT).

## Consequences

- Authorization is enforced even if application code has a bug.
- RLS policies must be designed, reviewed and tested with the same care as
  application code.
- Supabase is open source and can be self-hosted if data-residency
  requirements demand it.

## Alternatives considered

- **ORM + custom auth on a plain Postgres host:** more to build and secure.
- **Firebase / document stores:** poor fit for relational clinical data.
