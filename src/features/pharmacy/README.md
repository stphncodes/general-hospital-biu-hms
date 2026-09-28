# Pharmacy

> **Status: not implemented.** This directory reserves the module's place in
> the architecture. No pharmacy functionality exists yet.

## Responsibility

Prescription handling, dispensing and pharmacy stock linkage.

## Open questions for domain modelling

These must be answered with hospital stakeholders before implementation.
Do not guess clinical or operational rules in code.

- Drug formulary source
- Dispensing workflow and controlled-drug rules
- Interaction checking: out of scope unless a validated knowledge source is adopted

## Structure (when implemented)

Follow the feature-module pattern described in [`../README.md`](../README.md):

```text
features/pharmacy/
├── components/   # UI specific to this module
├── actions/      # Server Actions (validate → authorize → execute → audit)
├── queries/      # server-side data access (RLS-scoped Supabase client)
├── schemas/      # Zod schemas shared by forms and actions
├── types/
└── index.ts      # public API — other modules import only from here
```
