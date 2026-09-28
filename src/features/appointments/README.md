# Appointments

> **Status: not implemented.** This directory reserves the module's place in
> the architecture. No appointments functionality exists yet.

## Responsibility

Scheduling of outpatient clinic appointments, clinician availability and queue management.

## Open questions for domain modelling

These must be answered with hospital stakeholders before implementation.
Do not guess clinical or operational rules in code.

- Clinic structure and session templates
- Walk-in vs booked flows
- Reminder channels (SMS, none) and consent

## Structure (when implemented)

Follow the feature-module pattern described in [`../README.md`](../README.md):

```text
features/appointments/
├── components/   # UI specific to this module
├── actions/      # Server Actions (validate → authorize → execute → audit)
├── queries/      # server-side data access (RLS-scoped Supabase client)
├── schemas/      # Zod schemas shared by forms and actions
├── types/
└── index.ts      # public API — other modules import only from here
```
