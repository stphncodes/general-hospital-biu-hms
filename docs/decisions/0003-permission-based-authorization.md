# 0003. Scoped, permission-based authorization with no superuser

- **Status:** Accepted (the permission catalogue and scope kinds are provisional)
- **Date:** 2026-09-28

## Context

Hospital roles vary between facilities and change over time. Checks such as
`role === "admin"` scattered through the code become impossible to audit
and tend to grow into all-powerful accounts.

## Decision

Model **User → Role → Permission → Scope**. Code checks permissions only
(`can`, `authorize` in `src/lib/permissions`), always against a resource
context (tenant, optionally department). Deny by default. No wildcard
permission and no superuser flag: administrators hold explicit grants.

## Consequences

- Roles become configuration, not code.
- Every privileged capability is enumerable and reviewable.
- Some verbosity: an administrator role needs many grants (mitigated by
  role templates).
- The RLS layer must implement the same model in SQL.

## Alternatives considered

- **Role checks in code:** simple initially, unmaintainable at scale.
- **ABAC policy engine (e.g. OPA):** powerful but premature; may be revisited.
