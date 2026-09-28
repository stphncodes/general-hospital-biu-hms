# Notifications

> **Status: not implemented.** This directory reserves the module's place in
> the architecture. No notifications functionality exists yet.

## Responsibility

In-app notifications and, later, outbound messages. Backs the notifications menu in the application header.

## Open questions for domain modelling

These must be answered with hospital stakeholders before implementation.
Do not guess clinical or operational rules in code.

- Notification types and recipients
- Delivery channels and retention

## Structure (when implemented)

Follow the feature-module pattern described in [`../README.md`](../README.md):

```text
features/notifications/
├── components/   # UI specific to this module
├── actions/      # Server Actions (validate → authorize → execute → audit)
├── queries/      # server-side data access (RLS-scoped Supabase client)
├── schemas/      # Zod schemas shared by forms and actions
├── types/
└── index.ts      # public API — other modules import only from here
```
