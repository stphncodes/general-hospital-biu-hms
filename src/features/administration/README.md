# Administration

> **Status: not implemented.** This directory reserves the module's place in
> the architecture. No administration functionality exists yet.

## Responsibility

System administration: roles, permission assignment, facility settings and audit-log review.

## Open questions for domain modelling

These must be answered with hospital stakeholders before implementation.
Do not guess clinical or operational rules in code.

- Role catalogue and default permission sets
- Who may grant which permissions (separation of duties)

## Structure (when implemented)

Follow the feature-module pattern described in [`../README.md`](../README.md):

```text
features/administration/
├── components/   # UI specific to this module
├── actions/      # Server Actions (validate → authorize → execute → audit)
├── queries/      # server-side data access (RLS-scoped Supabase client)
├── schemas/      # Zod schemas shared by forms and actions
├── types/
└── index.ts      # public API — other modules import only from here
```
