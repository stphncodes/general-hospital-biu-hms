# 0001. Next.js App Router with Server Components by default

- **Status:** Accepted
- **Date:** 2026-09-28

## Context

The system will contain dozens of modules and data-heavy screens used on
modest hardware and variable networks. Sensitive data and business rules
must stay on the server.

## Decision

Use Next.js 16 with the App Router and TypeScript. Components are Server
Components unless they need interactivity. Mutations use Server Actions;
Route Handlers are reserved for genuine HTTP endpoints. Route groups separate
public, auth and authenticated areas. Next 16's `proxy.ts` handles session
refresh.

## Consequences

- Less client JavaScript; data access and secrets stay server-side.
- Contributors must understand the server/client boundary (e.g. column
  definitions with render functions belong in client modules).
- Server Actions are public endpoints: each must validate and authorize.

## Alternatives considered

- **SPA + separate REST API:** more surface to secure and version, more
  client JavaScript, duplicated validation.
- **Pages Router:** legacy model without Server Components.
