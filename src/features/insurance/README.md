# Insurance

> **Status: not implemented.** This directory reserves the module's place in
> the architecture. No insurance functionality exists yet.

## Responsibility

Health insurance schemes, eligibility, pre-authorisation and claims.

## Open questions for domain modelling

These must be answered with hospital stakeholders before implementation.
Do not guess clinical or operational rules in code.

- Schemes in scope (e.g. NHIA, state schemes, HMOs)
- Claim formats and submission channels

## Structure (when implemented)

Follow the feature-module pattern described in [`../README.md`](../README.md):

```text
features/insurance/
├── components/   # UI specific to this module
├── actions/      # Server Actions (validate → authorize → execute → audit)
├── queries/      # server-side data access (RLS-scoped Supabase client)
├── schemas/      # Zod schemas shared by forms and actions
├── types/
└── index.ts      # public API — other modules import only from here
```
