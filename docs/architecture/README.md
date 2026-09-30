# Architecture

> This document describes the **foundation** as built. Detailed module and
> data architecture will evolve as requirements and the domain model are
> defined. Significant decisions are recorded in [`../decisions`](../decisions).

## System overview

```text
Browser ──► Next.js (App Router, React Server Components)
              │  src/proxy.ts  — session refresh, coarse route gating
              │  Server Components — reads
              │  Server Actions   — mutations
              │  Route Handlers   — genuine HTTP endpoints only
              ▼
            Supabase
              ├── Auth       (staff identity, sessions, MFA)
              ├── PostgreSQL (data + Row Level Security)
              └── Storage    (future: documents, images)
```

The Next.js server is the primary data path. The browser talks to Supabase
directly only where a client-side feature genuinely needs it, and then only
with the publishable key under Row Level Security.

## Source layout

| Path                   | Contains                                                           |
| ---------------------- | ------------------------------------------------------------------ |
| `src/app/`             | Routes only: layouts, pages, boundaries, route handlers. Thin.     |
| `src/app/(public)/`    | Unauthenticated pages (start page).                                |
| `src/app/(auth)/`      | Sign-in and future auth pages.                                     |
| `src/app/(dashboard)/` | The authenticated application shell and every module page.         |
| `src/features/<name>/` | Business logic per domain module. See `src/features/README.md`.    |
| `src/components/ui/`   | shadcn/ui primitives (vendored; re-sync with the shadcn CLI).      |
| `src/components/*`     | Generic app components: layout, navigation, forms, tables, shared. |
| `src/lib/`             | Cross-cutting infrastructure (below). No business logic.           |
| `src/config/`          | Validated environment and site configuration.                      |
| `src/hooks/`           | Generic React hooks.                                               |
| `src/types/`           | Shared and (future) generated database types.                      |
| `supabase/`            | Local Supabase config, migrations, seeds, edge functions.          |
| `tests/`               | `unit/`, `integration/` (Vitest), `e2e/` (Playwright).             |

### `src/lib`

| Module                 | Purpose                                                                 |
| ---------------------- | ----------------------------------------------------------------------- |
| `supabase/`            | Browser, server, proxy and admin clients (see its README).              |
| `auth/`                | `getCurrentUser`, `requireUser`, `getPrincipal` (server-only).          |
| `permissions/`         | Permission catalogue, principal/scope model, `can` / `authorize`.       |
| `errors/`              | `AppError` hierarchy, PostgREST mapping, `toPublicError`.               |
| `validation/`          | Shared Zod primitives, `parseInput`, URL list-param parsing.            |
| `api/`                 | `ActionResult`, `runAction`, `withErrorHandling`, Query client factory. |
| `logger/`              | Structured, redacting server logger.                                    |
| `utils/`, `constants/` | `cn`, date formatting, `safeRedirectPath`; routes.                      |

### Dependency direction

```text
app/  ──►  features/  ──►  components/  ──►  lib/, config/
  └────────────────────────────┘
```

`components/` never imports `features/`; `lib/` never imports either.
Feature modules import each other only through their `index.ts`.

## Rendering and data fetching

**Server Components are the default.** A component becomes a Client
Component (`"use client"`) only when it needs state, effects, event handlers
or browser APIs — and the boundary is pushed as far down the tree as
possible (e.g. `NavLink` is a client leaf inside the server-rendered sidebar).

### When to use what

| Need                                                                                                                        | Use                                      |
| --------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| Render data for a page                                                                                                      | Server Component calling a feature query |
| Create / update / delete from a form or button                                                                              | Server Action (returns `ActionResult`)   |
| Webhook, health check, third-party integration                                                                              | Route Handler (`withErrorHandling`)      |
| Client-side data that must poll, refetch, or be shared across interactive widgets (e.g. a live bed board, typeahead search) | **TanStack Query**                       |
| UI state local to one component                                                                                             | `useState`                               |
| State shared across a subtree                                                                                               | Props, composition, or a small context   |

**Rule: do not use TanStack Query for data a Server Component can render.**
Query is provided only inside the authenticated shell (`QueryProvider` in the
dashboard layout), so public pages do not ship it. On the server a fresh
`QueryClient` is created per request so cached data cannot leak between users.

No global state library is installed. One will be added only when a
demonstrated requirement cannot be met by the options above.

## Tables

Hospital lists (patients, orders, invoices) can grow to hundreds of
thousands of rows, so **tables are server-driven**:

1. Sort, page, page size and search live in the URL (`?page=2&sort=…&q=…`).
2. The page (a Server Component) parses them with `parseListParams`,
   checks `sort` against an allow-list, and queries **one page** from
   PostgreSQL (`.range(from, to)` with `count: "exact"` or an estimate).
3. `<DataTable>` (TanStack Table v9, `src/components/tables/`) renders that
   page with manual sorting/pagination and writes changes back to the URL
   via `useTableUrlState`.

Column visibility and row selection are local UI state. Column definitions
live in a client module inside the feature (they contain render functions).
Never fetch a whole table and filter in the browser.

## Forms

- `useZodForm(schema)` — React Hook Form with the Zod resolver.
- `FormTextField` (and future field components) — label, required marker,
  description, error message and ARIA wiring in one place.
- `FormSection` — `<fieldset>`/`<legend>` groups with a responsive grid, for
  long clinical forms.
- Submit calls a Server Action; failures map back onto the form with
  `applyActionError`, and `FormRootError` shows the summary.

The **same schema** is validated again on the server with `parseInput`.

## Error handling

| Kind                 | Represented as                             | User sees                         |
| -------------------- | ------------------------------------------ | --------------------------------- |
| Invalid input        | `ValidationError` (field errors)           | Messages on the fields            |
| Not signed in        | `AuthenticationError` / redirect           | Sign-in page                      |
| Not permitted        | `AuthorizationError`                       | "You do not have permission…"     |
| Missing record       | `NotFoundError`                            | Not-found message                 |
| Conflict / duplicate | `ConflictError`                            | Specific, safe message            |
| Database failure     | `DatabaseError` (via `fromPostgrestError`) | Generic message                   |
| Anything unexpected  | plain `Error`                              | Generic message + error reference |

Server Actions return errors as values (`ActionResult`). Route Handlers
return `{ error: { code, message } }` with the matching HTTP status. Route
`error.tsx` boundaries show a generic message and the Next.js digest, never
`error.message`. Raw database errors are logged server-side only.

## Logging

`src/lib/logger` writes structured JSON lines in production and readable
lines in development. Events are named `domain.action.outcome`
(`auth.sign_in.succeeded`). Context passes through `redact()`, which masks
credentials, personal identifiers and clinical fields — but the primary
rule is to log **identifiers and outcomes, never record contents**. See
[security](../security/README.md#logging).

Logging is not auditing: the clinical audit trail will be a database table
with its own design (see [database](../database/README.md)).

## Design system

Visual and writing rules (what the UI may and may not do) are in
[docs/design/README.md](../design/README.md). This section covers the
technical implementation.

- shadcn/ui (Radix primitives, "Nova" preset) with Lucide icons.
- All colour comes from CSS variables in `src/app/globals.css`, in two layers:
  - **HMS brand palette** (`--hms-primary`, `--hms-navy`, `--hms-primary-soft`,
    …): the only place raw colour values exist. Identity is clinical green
    (#15803D) + white + dark navy + soft green.
  - **Semantic tokens** (`--primary`, `--primary-hover`, `--primary-soft`,
    `--heading`, `--muted-foreground`, `--border`, …) that reference the
    palette and switch between light and dark themes.
- Components use semantic utilities (`bg-primary`, `hover:bg-primary-hover`,
  `text-muted-foreground`, `bg-warning`). Brand utilities (`fill-hms-navy`)
  are for theme-independent artwork such as illustrations only.
- Brand components live in `src/components/brand` (`HMSLogo`, `HMSMark`,
  `HealthcareIllustration`).
- Motion uses the `motion` library through `src/components/motion`
  (`Reveal`, `RevealGroup`/`RevealItem`, `Float`, `PageTransition`)
  with timing from `motion/tokens.ts`. Rules: calm ease-out entrances, short
  distances, no bounce; animate one or two key elements per view; loops only
  for decorative artwork; `MotionProvider` honours `prefers-reduced-motion`.
  Use `m.*` components (`LazyMotion` strict mode), not `motion.*`.
  Scroll-linked `style` values bypass `MotionConfig`, so components using
  `useScroll` must check `useReducedMotion()` and render the static state.
- Light is the default theme. Every surface follows the active theme: never
  force a section into dark mode with a scoped `dark` class. Differentiate
  sections with `bg-background` / `bg-card` / `bg-primary-soft` instead.
- Never show invented figures in the authenticated app.
- Light, dark and system themes via `next-themes` (class strategy).
- Modest radius and tabular numerals for dense, data-heavy screens.
- Status colours (`success`, `warning`, `info`, `destructive`) carry meaning
  only; never decorative.
- Desktop-first layouts; the sidebar becomes an off-canvas sheet on mobile.

## Accessibility baseline

Semantic landmarks and one `<h1>` per page; skip link; visible focus rings;
labelled controls with `aria-invalid` / `aria-describedby`; `aria-sort` on
sortable headers; Radix primitives for dialogs and menus (focus trapping,
keyboard support); `prefers-reduced-motion` respected. Target: WCAG 2.2 AA.

## Dates and times

Store instants as `timestamptz` (UTC) and calendar dates (e.g. date of birth)
as `date`. Format only at the presentation edge with `formatDate` /
`formatDateTime` (unambiguous `5 Mar 2026`, 24-hour clock). The display time
zone (Africa/Lagos) will be made explicit when multi-facility support lands.
