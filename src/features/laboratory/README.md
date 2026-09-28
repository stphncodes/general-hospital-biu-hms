# Laboratory

> **Status: not implemented.** This directory reserves the module's place in
> the architecture. No laboratory functionality exists yet.

## Responsibility

Laboratory test ordering, specimen tracking, result entry, verification and reporting.

## Open questions for domain modelling

These must be answered with hospital stakeholders before implementation.
Do not guess clinical or operational rules in code.

- Test catalogue and reference ranges (source of truth)
- Result verification workflow
- Critical-result notification process

## Structure (when implemented)

Follow the feature-module pattern described in [`../README.md`](../README.md):

```text
features/laboratory/
├── components/   # UI specific to this module
├── actions/      # Server Actions (validate → authorize → execute → audit)
├── queries/      # server-side data access (RLS-scoped Supabase client)
├── schemas/      # Zod schemas shared by forms and actions
├── types/
└── index.ts      # public API — other modules import only from here
```
