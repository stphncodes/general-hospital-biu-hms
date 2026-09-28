# Theatre

> **Status: not implemented.** This directory reserves the module's place in
> the architecture. No theatre functionality exists yet.

## Responsibility

Operating theatre scheduling, surgical safety checklists and procedure records.

## Open questions for domain modelling

These must be answered with hospital stakeholders before implementation.
Do not guess clinical or operational rules in code.

- Theatre list workflow
- Checklist content (to be agreed with clinical staff, not invented)

## Structure (when implemented)

Follow the feature-module pattern described in [`../README.md`](../README.md):

```text
features/theatre/
├── components/   # UI specific to this module
├── actions/      # Server Actions (validate → authorize → execute → audit)
├── queries/      # server-side data access (RLS-scoped Supabase client)
├── schemas/      # Zod schemas shared by forms and actions
├── types/
└── index.ts      # public API — other modules import only from here
```
