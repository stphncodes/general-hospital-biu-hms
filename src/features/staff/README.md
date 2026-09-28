# Staff

> **Status: not implemented.** This directory reserves the module's place in
> the architecture. No staff functionality exists yet.

## Responsibility

Staff records and user accounts: profile, cadre, department membership and account provisioning.

## Open questions for domain modelling

These must be answered with hospital stakeholders before implementation.
Do not guess clinical or operational rules in code.

- Relationship between a staff record and an auth user
- Account lifecycle (invite, suspend, deactivate)

## Structure (when implemented)

Follow the feature-module pattern described in [`../README.md`](../README.md):

```text
features/staff/
├── components/   # UI specific to this module
├── actions/      # Server Actions (validate → authorize → execute → audit)
├── queries/      # server-side data access (RLS-scoped Supabase client)
├── schemas/      # Zod schemas shared by forms and actions
├── types/
└── index.ts      # public API — other modules import only from here
```
