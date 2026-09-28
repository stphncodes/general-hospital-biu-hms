# Security architecture

> Security is a first-class requirement. This document records the model the
> foundation implements and the work that remains. It will be extended as
> the domain model is designed. To report a vulnerability, see
> [SECURITY.md](../../SECURITY.md).

This software is **not approved for clinical use** and makes no claim of
compliance with any regulation (including the Nigeria Data Protection Act
2023). Compliance requires an assessment of a real deployment, not just code.

## Defence in depth

Every request passes several independent checks. Each must hold on its own.

| Layer                            | Responsibility                                             | Where                |
| -------------------------------- | ---------------------------------------------------------- | -------------------- |
| 1. Proxy                         | Refresh session; redirect signed-out users (UX, fast path) | `src/proxy.ts`       |
| 2. Page / layout                 | `requireUser()`; render only what the principal may see    | each `page.tsx`      |
| 3. Server Action / Route Handler | Validate input, `authorize()` the specific operation       | `features/*/actions` |
| 4. **PostgreSQL RLS**            | Final enforcement on every row, regardless of caller       | migrations           |

The proxy is explicitly **not** the security boundary; RLS is the last line.

## Authentication

- Supabase Auth, email + password, cookie-based sessions via `@supabase/ssr`.
- Server code identifies users with `supabase.auth.getClaims()`, which
  verifies the JWT signature. `getSession()` must never be used for
  authorization decisions on the server.
- No public sign-up: staff accounts are provisioned by administrators
  (`enable_signup = false` in `supabase/config.toml`; mirror this in the
  hosted project settings).
- Local policy: minimum 12-character passwords with mixed character classes,
  email confirmation, secure password change, TOTP MFA available.
- Sign-in errors do not reveal whether an account exists.
- All user-controlled redirects go through `safeRedirectPath`.

**Planned:** MFA enrolment UI and an `aal2` requirement for sensitive areas;
password reset page; session listing/revocation; idle-session timeout
appropriate to shared ward workstations.

## Authorization

### Model

```text
User ──< RoleAssignment >── Role ──< RolePermission >── Permission
             │
             └── Scope (tenant [hospital] → department)
```

At runtime this is flattened into a `Principal` with a list of **grants**,
each a `(permission, scope)` pair. Code checks permissions, never roles:

```ts
authorize(principal, "billing.refund", { tenantId, departmentId });
```

### Principles

- **Deny by default.** `getPrincipal()` currently returns _no grants_ for
  every user, because the RBAC schema does not exist yet. Nothing is
  accessible by accident.
- **No superuser bypass.** There is no wildcard permission and no
  `isAdmin` flag. An administrator is a role with many explicit
  permissions — every privileged capability is visible and reviewable.
- **Scoped grants.** A grant applies within a tenant (a hospital — enabling
  future multi-hospital deployments) and optionally only within one
  department. Grants never cross tenants.
- **UI hiding is not access control.** `hasPermissionInAnyScope` may hide a
  navigation link; the page and the action must still `authorize`.
- Permission keys are `<resource>.<action>` and live in
  `src/lib/permissions/catalog.ts`. The current list is **provisional**.

### To be designed (domain modelling)

- Final permission catalogue and default role templates.
- Separation of duties (e.g. who may grant roles; approval for refunds).
- How grants reach the app: a database lookup per request (cached per
  request with React `cache`), or a Supabase custom access-token hook that
  embeds them in the JWT. Trade-off: freshness vs. performance.
- RLS policy helpers that mirror `can()` in SQL (e.g. a `has_permission()`
  security-definer function), so the database enforces the same model.
- "Break-glass" emergency access, if required: time-limited, justified,
  and prominently audited.

## Data isolation

- Every clinical table will carry a `tenant_id` (hospital/facility) and RLS
  policies that restrict rows to the principal's tenant(s).
- The publishable key is safe in the browser **only because** RLS is on for
  every exposed table. A table without RLS is a data breach.
- The secret key (`SUPABASE_SECRET_KEY`) bypasses RLS. It is read only in
  `src/lib/supabase/admin.ts`, guarded by `server-only`, and reserved for
  operations without a user context. Never use it to serve a user request.

## Input validation

All untrusted input — form data, action arguments, route params, search
params, headers, webhook bodies — is parsed with Zod on the server
(`parseInput`, `parseListParams`). Client-side validation is UX only.
Sort columns and similar identifiers are checked against allow-lists.

## Secrets

- Only `.env.example` is committed; `.gitignore` excludes every other
  `.env*` file plus key/certificate formats.
- Nothing secret is prefixed `NEXT_PUBLIC_`.
- Environment values are validated at runtime; error messages name the
  variable but never echo its value.

## Logging

Logs must not contain passwords, tokens, cookies, personal identifiers or
clinical content. Log identifiers (record IDs, user IDs) and outcomes.
`redact()` is a safety net that masks sensitive keys at any depth and strips
PostgreSQL `details` (which can echo row values) from errors. The logger is
`server-only`.

## Audit logging (planned)

An append-only audit table recording _who_ did _what_ to _which record_,
_when_, from _where_, and _why_ (for sensitive access). It must be written
in the same transaction as the change (or by trigger), be immutable to
application roles, and record reads of sensitive records, not only writes.
Design is part of domain modelling.

## HTTP hardening

Set in `next.config.ts`: `X-Content-Type-Options`, `X-Frame-Options: DENY`,
`Referrer-Policy`, `Permissions-Policy`, HSTS (without `preload`), and no
`X-Powered-By`. **Planned:** a nonce-based Content-Security-Policy generated
in `src/proxy.ts`.

## Rate limiting (planned)

Supabase Auth applies its own rate limits to auth endpoints. Application-level
limits for expensive or sensitive actions (search, exports, bulk operations)
need a shared store (e.g. Redis/Upstash or a Postgres-backed limiter); the
`RateLimitError` type already exists for this.

## File access (planned)

Supabase Storage with private buckets only, RLS-style storage policies keyed
on tenant and permission, short-lived signed URLs, content-type and size
validation, and no user-controlled paths.

## Open follow-ups

- [ ] Content-Security-Policy with nonces
- [ ] MFA enrolment and enforcement
- [ ] RBAC schema, RLS helpers, grant loading
- [ ] Audit log
- [ ] Application rate limiting
- [ ] Dependency and secret scanning in CI (e.g. Dependabot, gitleaks)
- [ ] Threat model once core workflows are defined
