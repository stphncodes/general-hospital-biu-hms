# Admissions

> **Status: not implemented.** This directory reserves the module's place in
> the architecture. No admissions functionality exists yet.

## Responsibility

Inpatient admission, bed management, transfers between wards and discharge.

## Open questions for domain modelling

These must be answered with hospital stakeholders before implementation.
Do not guess clinical or operational rules in code.

- Ward and bed model
- Transfer and discharge workflow and required sign-offs

## Structure (when implemented)

Follow the feature-module pattern described in [`../README.md`](../README.md):

```text
features/admissions/
├── components/   # UI specific to this module
├── actions/      # Server Actions (validate → authorize → execute → audit)
├── queries/      # server-side data access (RLS-scoped Supabase client)
├── schemas/      # Zod schemas shared by forms and actions
├── types/
└── index.ts      # public API — other modules import only from here
```
