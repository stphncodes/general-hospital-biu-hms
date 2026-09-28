# Architecture Decision Records

Significant, hard-to-reverse decisions are recorded here as short ADRs so
future contributors understand _why_ the system is the way it is.

Create a new ADR by copying [`template.md`](./template.md) to
`NNNN-short-title.md`. ADRs are immutable once accepted; to change a
decision, write a new ADR that supersedes the old one.

| #    | Decision                                                                                             | Status   |
| ---- | ---------------------------------------------------------------------------------------------------- | -------- |
| 0001 | [Next.js App Router with Server Components by default](./0001-nextjs-app-router.md)                  | Accepted |
| 0002 | [Supabase for auth and PostgreSQL, with RLS as the final boundary](./0002-supabase-and-rls.md)       | Accepted |
| 0003 | [Scoped, permission-based authorization with no superuser](./0003-permission-based-authorization.md) | Accepted |
| 0004 | [Server-first data fetching; TanStack Query only where needed](./0004-data-fetching.md)              | Accepted |
| 0005 | [Server-driven data tables with URL state](./0005-server-driven-tables.md)                           | Accepted |
| 0006 | [shadcn/ui on Radix primitives with CSS-variable theming](./0006-ui-system.md)                       | Accepted |
