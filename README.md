# General Hospital Biu — Hospital Information System

An open-source Hospital Information System designed as an independent software
project inspired by the operational context of General Hospital Biu, Borno
State, Nigeria.

> [!IMPORTANT]
> **Project status: early development — foundation only.**
>
> - This is an **independent** open-source project. It is **not officially
>   affiliated with, endorsed by, or operated by General Hospital Biu**.
> - It is **not approved for clinical use** and makes no claim of regulatory
>   compliance or clinical safety.
> - It is **development / demonstration software**.
> - **Do not use real patient data** with this software — not in
>   development, testing or demonstrations.

## Overview

The goal is a modular Hospital Information System (HIS) suited to the
realities of a secondary-care general hospital in North-East Nigeria:
constrained connectivity and hardware, paper-to-digital transition, and
staff with diverse accessibility needs.

The repository currently contains the **engineering foundation** only:
architecture, authentication, the application shell, and reusable patterns
for validation, forms, tables, errors, logging and authorization. **No
clinical or administrative module has been implemented.** The next phase is
requirements analysis and database/domain modelling.

## Goals

- **Safety first** — no invented clinical logic; rules are defined with
  clinical stakeholders and reviewed.
- **Security and privacy by design** — deny-by-default, scoped permissions,
  Row Level Security, audit logging, minimal data exposure.
- **Built for the context** — fast on modest devices and slow networks;
  server-rendered, paginated, lean.
- **Accessible** — keyboard-friendly, screen-reader-friendly, WCAG 2.2 AA
  as the target.
- **Maintainable in the open** — clear module boundaries, documented
  decisions, meaningful tests.

## Planned modules

None of these exist yet; each has a placeholder `README.md` in
[`src/features/`](./src/features) describing its future responsibility.

Patients · Appointments · Encounters · Admissions · Nursing · Laboratory ·
Pharmacy · Radiology · Billing · Insurance · Inventory · Theatre · Maternity ·
Blood Bank · Staff · Departments · Reports · Notifications · Administration

## Architecture

- **Next.js App Router** with React Server Components by default; Server
  Actions for mutations; Route Handlers only for real HTTP endpoints.
- **Feature-based modules** in `src/features/<module>` with a public
  `index.ts`; shared infrastructure in `src/lib`.
- **Supabase** (Auth + PostgreSQL) with **Row Level Security** as the final
  authorization layer.
- **Authorization:** User → Role → Permission → Scope, permission checks
  only, no superuser bypass.
- **Server-driven tables**: sorting, paging and search in the URL and
  executed by the database.

Read more: [architecture](./docs/architecture/README.md) ·
[security](./docs/security/README.md) · [database](./docs/database/README.md) ·
[workflows](./docs/workflows/README.md) · [API](./docs/api/README.md) ·
[decision records](./docs/decisions/README.md)

```text
src/
├── app/            # routes: (public), (auth), (dashboard), api, auth/confirm
├── features/       # domain modules (auth implemented; others planned)
├── components/     # ui (shadcn), layout, navigation, forms, tables, shared
├── lib/            # supabase, auth, permissions, errors, validation, api, logger, utils
├── config/         # validated environment + site config
├── hooks/  types/  styles/
└── proxy.ts        # session refresh + route gating (Next.js 16 proxy)
supabase/           # config.toml, migrations/, seed/, functions/
docs/               # architecture, security, database, workflows, api, decisions
tests/              # unit/, integration/ (Vitest), e2e/ (Playwright)
```

## Technology stack

| Area          | Choice                                                        |
| ------------- | ------------------------------------------------------------- |
| Framework     | Next.js 16 (App Router), React 19, TypeScript (strict)        |
| Styling / UI  | Tailwind CSS v4, shadcn/ui (Radix), Lucide icons, next-themes |
| Backend       | Supabase: Auth, PostgreSQL 17, Row Level Security             |
| Validation    | Zod 4                                                         |
| Forms         | React Hook Form + @hookform/resolvers                         |
| Data          | TanStack Query (selectively), TanStack Table v9               |
| Dates         | date-fns                                                      |
| Notifications | Sonner (toasts)                                               |
| Testing       | Vitest, React Testing Library, Playwright                     |
| Quality       | ESLint, Prettier (+ Tailwind plugin), TypeScript strict       |

## Development setup

Prerequisites: **Node.js 22.12+** (24 recommended, see `.nvmrc`), npm, and —
optionally, for a local database — Docker.

```bash
git clone https://github.com/stphncodes/general-hospital-biu-hms.git
cd general-hospital-biu-hms
npm install
cp .env.example .env.local
```

Then either create a free Supabase project, or run one locally with
`npx supabase start` and copy the printed URL and publishable key.

## Environment variables

All variables are documented in [`.env.example`](./.env.example) and
validated at runtime.

| Variable                               | Required | Exposed to browser | Purpose                                  |
| -------------------------------------- | -------- | ------------------ | ---------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`                 | yes      | yes                | Base URL for auth email redirects        |
| `NEXT_PUBLIC_SUPABASE_URL`             | yes      | yes                | Supabase project URL                     |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | yes      | yes                | Publishable key (safe only with RLS)     |
| `SUPABASE_SECRET_KEY`                  | no       | **never**          | Bypasses RLS; privileged server ops only |
| `LOG_LEVEL`                            | no       | no                 | `debug` · `info` · `warn` · `error`      |

Never commit `.env` / `.env.local`. Only `.env.example` is tracked.

## Running locally

```bash
npm run dev      # development server at http://localhost:3000
npm run build    # production build
npm run start    # serve the production build
```

Public sign-up is disabled by design; create a test user in the Supabase
dashboard (Authentication → Users) using an obviously fake email address.

## Testing

```bash
npm run typecheck       # route types + tsc --noEmit
npm run lint            # ESLint
npm run format:check    # Prettier
npm test                # Vitest unit + integration
npm run test:e2e        # Playwright (run `npx playwright install chromium` once)
npm run check           # typecheck + lint + format:check + test
```

## Contributing

Contributions are welcome — see [CONTRIBUTING.md](./CONTRIBUTING.md). Please
read the disclaimer above: contributions must never include real patient data
or invented clinical rules.

## Security

Please report vulnerabilities privately as described in
[SECURITY.md](./SECURITY.md). The security architecture is documented in
[docs/security](./docs/security/README.md).

## Roadmap

1. ✅ **Foundation** — architecture, auth, shell, tooling, documentation
2. ⏭ **Requirements analysis** — hospital workflows gathered with staff
3. **Domain & database modelling** — tenants, departments, staff, RBAC,
   patients, visits/encounters, orders/results, prescriptions, admissions,
   billing; RLS and audit-log design
4. **Core platform** — RBAC schema, audit log, staff administration, MFA
5. **First clinical workflows** — patient registration and outpatient visits
6. Further modules, prioritised with stakeholders

## License

Licensed under the [Apache License 2.0](./LICENSE). See also [NOTICE](./NOTICE).

## Disclaimer

This software is provided "as is", without warranty of any kind. It is an
independent project and is **not affiliated with, endorsed by, or operated
by General Hospital Biu** or any government body. It has **not** been
evaluated or approved for clinical use, and it does not claim compliance with
any health, data-protection or medical-device regulation. It must not be used
to make clinical decisions or to store or process real patient information.
Any real-world deployment would require independent clinical-safety,
security, privacy and regulatory assessment.
