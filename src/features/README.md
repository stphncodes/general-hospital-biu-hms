# Features

Business logic lives next to the feature it belongs to, not in the shared
`components/`, `lib/` or `app/` folders.

## Module layout

```text
features/<module>/
├── components/   # UI used only by this module
├── actions/      # Server Actions ("use server")
├── queries/      # server-side reads (Server Components call these)
├── schemas/      # Zod schemas shared by forms (client) and actions (server)
├── types/        # module types (prefer z.infer over hand-written duplicates)
├── utils/        # pure helpers specific to the module
└── index.ts      # PUBLIC API
```

Only create the folders a module actually needs.

## Rules

1. **Public API only.** Other code imports from `@/features/<module>`, never
   from a module's internal files. This keeps modules replaceable.
2. **Modules do not import each other's internals.** Cross-module needs go
   through the public API; if two modules need the same thing, it probably
   belongs in `lib/`.
3. **`app/` routes are thin.** A page parses params, calls a module query,
   and renders module components. It does not contain business logic.
4. **Every Server Action follows the same order:**
   1. `parseInput(schema, input)` — validate
   2. `getPrincipal()` + `authorize(principal, permission, ctx)` — authorize
   3. perform the operation with the RLS-scoped Supabase client
   4. record an audit event (once the audit log exists)
   5. return an `ActionResult`, wrapped in `runAction(...)`
5. **Generic UI stays generic.** `components/` may not import from
   `features/`. Pass feature UI into layouts through props or slots, as the
   dashboard layout does with `UserMenu`.

## Status

| Module                                   | Status                                                 |
| ---------------------------------------- | ------------------------------------------------------ |
| [auth](./auth)                           | Foundation: sign-in, sign-out, email-link confirmation |
| All other modules (see each `README.md`) | **Not implemented.** Awaiting domain modelling         |
