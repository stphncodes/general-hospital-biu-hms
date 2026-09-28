# Maternity

> **Status: not implemented.** This directory reserves the module's place in
> the architecture. No maternity functionality exists yet.

## Responsibility

Antenatal, delivery and postnatal records.

## Open questions for domain modelling

These must be answered with hospital stakeholders before implementation.
Do not guess clinical or operational rules in code.

- Antenatal record structure
- Newborn registration and linkage to the mother

## Structure (when implemented)

Follow the feature-module pattern described in [`../README.md`](../README.md):

```text
features/maternity/
├── components/   # UI specific to this module
├── actions/      # Server Actions (validate → authorize → execute → audit)
├── queries/      # server-side data access (RLS-scoped Supabase client)
├── schemas/      # Zod schemas shared by forms and actions
├── types/
└── index.ts      # public API — other modules import only from here
```
