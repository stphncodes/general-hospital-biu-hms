# Encounters

> **Status: not implemented.** This directory reserves the module's place in
> the architecture. No encounters functionality exists yet.

## Responsibility

Clinical encounters (visits): the context in which observations, diagnoses, orders and notes are recorded.

## Open questions for domain modelling

These must be answered with hospital stakeholders before implementation.
Do not guess clinical or operational rules in code.

- Encounter types (outpatient, emergency, inpatient, …)
- Relationship between a visit, an encounter and an admission
- Clinical coding system for diagnoses (e.g. ICD-10/ICD-11)

## Structure (when implemented)

Follow the feature-module pattern described in [`../README.md`](../README.md):

```text
features/encounters/
├── components/   # UI specific to this module
├── actions/      # Server Actions (validate → authorize → execute → audit)
├── queries/      # server-side data access (RLS-scoped Supabase client)
├── schemas/      # Zod schemas shared by forms and actions
├── types/
└── index.ts      # public API — other modules import only from here
```
