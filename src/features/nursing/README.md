# Nursing

> **Status: not implemented.** This directory reserves the module's place in
> the architecture. No nursing functionality exists yet.

## Responsibility

Nursing documentation: observations, care plans, medication administration records and handover.

## Open questions for domain modelling

These must be answered with hospital stakeholders before implementation.
Do not guess clinical or operational rules in code.

- Observation sets and frequency
- Medication administration recording requirements

## Structure (when implemented)

Follow the feature-module pattern described in [`../README.md`](../README.md):

```text
features/nursing/
├── components/   # UI specific to this module
├── actions/      # Server Actions (validate → authorize → execute → audit)
├── queries/      # server-side data access (RLS-scoped Supabase client)
├── schemas/      # Zod schemas shared by forms and actions
├── types/
└── index.ts      # public API — other modules import only from here
```
