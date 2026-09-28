# Workflows

Two kinds of workflow are documented here:

1. **Development workflows** — how to work on the codebase (below).
2. **Hospital workflows** — how patients, staff and information move through
   the hospital. These are **not yet documented**: they must be gathered from
   hospital staff during requirements analysis, not invented. Each will get
   its own file (e.g. `outpatient-visit.md`) describing actors, steps,
   decision points and the data captured at each step.

## Local development

```bash
npm install
cp .env.example .env.local        # fill in values
npm run dev                        # http://localhost:3000
```

### Local Supabase (optional, requires Docker)

```bash
npx supabase start                 # prints the local URL and publishable key
npx supabase status                # show them again
npx supabase db reset              # re-apply migrations + seeds
npx supabase stop
```

Use the printed API URL and publishable key in `.env.local`. Local auth
emails are captured by the Mailpit UI shown by `supabase status`.

Because public sign-up is disabled, create a local test user from the local
Studio UI (Authentication → Add user) with an obviously fake address.

## Quality gates

| Command                | What it does                                       |
| ---------------------- | -------------------------------------------------- |
| `npm run typecheck`    | Generate route types, then `tsc --noEmit` (strict) |
| `npm run lint`         | ESLint (Next.js, TypeScript, React Compiler rules) |
| `npm run format:check` | Prettier (with Tailwind class sorting)             |
| `npm test`             | Vitest unit + integration tests                    |
| `npm run test:e2e`     | Playwright against a production build              |
| `npm run check`        | typecheck + lint + format:check + test             |

CI (`.github/workflows/ci.yml`) runs all of these on every push and pull
request.

### Tests

- `tests/unit/` — pure logic, Node environment (fast).
- `tests/integration/` — components with React Testing Library; add
  `// @vitest-environment jsdom` at the top of DOM tests.
- `tests/e2e/` — Playwright. The config builds and starts the app itself
  (`npx playwright install chromium` once). Smoke tests need no live
  Supabase project.

Write tests for behaviour that matters (security rules, validation,
workflows), not for every file.

## Git workflow

- Branch from `main`: `feat/…`, `fix/…`, `docs/…`, `chore/…`.
- Conventional Commit messages (`feat(auth): add password reset page`).
- Open a pull request; CI must pass; at least one review before merge.
- Schema changes require a reviewed migration and updated docs.
