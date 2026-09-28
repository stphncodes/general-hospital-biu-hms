# Departments

> **Status: not implemented.** This directory reserves the module's place in
> the architecture. No departments functionality exists yet.

## Responsibility

Organisational structure: departments, units, wards and clinics. Departments are expected to act as authorization scopes.

## Open questions for domain modelling

These must be answered with hospital stakeholders before implementation.
Do not guess clinical or operational rules in code.

- Department hierarchy
- Which structures are permission scopes

## Structure (when implemented)

Follow the feature-module pattern described in [`../README.md`](../README.md):

```text
features/departments/
├── components/   # UI specific to this module
├── actions/      # Server Actions (validate → authorize → execute → audit)
├── queries/      # server-side data access (RLS-scoped Supabase client)
├── schemas/      # Zod schemas shared by forms and actions
├── types/
└── index.ts      # public API — other modules import only from here
```
