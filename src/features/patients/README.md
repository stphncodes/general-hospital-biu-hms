# Patients

> **Status: not implemented.** This directory reserves the module's place in
> the architecture. No patients functionality exists yet.

## Responsibility

Patient registration and the master patient index: identity, demographics, contact details, next of kin and hospital numbers, including duplicate detection and record merging.

## Open questions for domain modelling

These must be answered with hospital stakeholders before implementation.
Do not guess clinical or operational rules in code.

- Hospital number format and issuing rules
- Identity documents accepted (NIN, others) and whether they are optional
- Duplicate-detection and merge policy
- Handling of patients with unknown identity (e.g. unconscious arrivals)

## Structure (when implemented)

Follow the feature-module pattern described in [`../README.md`](../README.md):

```text
features/patients/
├── components/   # UI specific to this module
├── actions/      # Server Actions (validate → authorize → execute → audit)
├── queries/      # server-side data access (RLS-scoped Supabase client)
├── schemas/      # Zod schemas shared by forms and actions
├── types/
└── index.ts      # public API — other modules import only from here
```
