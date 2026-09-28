# API

## Current endpoints

| Method | Path            | Auth | Purpose                                                   |
| ------ | --------------- | ---- | --------------------------------------------------------- |
| GET    | `/api/health`   | none | Liveness probe. Returns `{"status":"ok"}`.                |
| GET    | `/auth/confirm` | none | Verifies Supabase email links (token hash) and redirects. |

## Approach

The application's own UI does **not** use a REST API. Reads happen in Server
Components and mutations in Server Actions, which keeps business logic on
the server without a separate API layer to secure and version.

Route Handlers (`src/app/api/**/route.ts`) are created only for real HTTP
consumers: health checks, webhooks, and future integrations (e.g. laboratory
analysers, insurance/claims systems, national reporting).

## Conventions for future endpoints

- Wrap handlers with `withErrorHandling(name, handler)` from
  `src/lib/api/route-handler.ts`.
- Validate params, query and body with Zod before use.
- Authenticate every non-public endpoint; machine-to-machine integrations
  get dedicated credentials and scoped permissions, never a user's session.
- Error body shape:

  ```json
  {
    "error": {
      "code": "VALIDATION_FAILED",
      "message": "…",
      "fieldErrors": { "field": ["…"] }
    }
  }
  ```

  Codes and statuses: `VALIDATION_FAILED` 422, `UNAUTHENTICATED` 401,
  `FORBIDDEN` 403, `NOT_FOUND` 404, `CONFLICT` 409, `RATE_LIMITED` 429,
  `DATABASE_ERROR` / `INTERNAL_ERROR` 500.

- Version external APIs in the path (`/api/v1/…`) once one exists.
- Interoperability standards (e.g. HL7 FHIR) will be evaluated when
  integration requirements are known.
