# Reports

> **Status: not implemented.** This directory reserves the module's place in
> the architecture. No reports functionality exists yet.

## Responsibility

Operational and statutory reporting (e.g. aggregate returns), built on database-side aggregation.

## Open questions for domain modelling

These must be answered with hospital stakeholders before implementation.
Do not guess clinical or operational rules in code.

- Required statutory reports and their definitions
- Export formats

## Structure (when implemented)

Follow the feature-module pattern described in [`../README.md`](../README.md):

```text
features/reports/
├── components/   # UI specific to this module
├── actions/      # Server Actions (validate → authorize → execute → audit)
├── queries/      # server-side data access (RLS-scoped Supabase client)
├── schemas/      # Zod schemas shared by forms and actions
├── types/
└── index.ts      # public API — other modules import only from here
```
