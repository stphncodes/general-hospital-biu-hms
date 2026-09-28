# Contributing

Thank you for helping build an open Hospital Information System. Because this
software is designed for healthcare, a few rules are stricter than in a
typical open-source project.

## Non-negotiable rules

1. **No real patient data.** Never commit, paste into issues, or use in
   tests any real patient, staff or hospital information — including
   screenshots and "anonymised" extracts. Synthetic data must be obviously
   synthetic (`Test Patient 001`).
2. **No invented clinical logic.** Do not implement clinical rules, dosing,
   reference ranges, triage scores or treatment logic unless the source is
   documented and reviewed. Open an issue to discuss first.
3. **No secrets in code.** Use environment variables; never commit `.env*`
   files other than `.env.example`.
4. **No authorization shortcuts.** Check permissions with `authorize()` /
   `can()` against a resource context — never `role === "admin"`, never a
   bypass flag, never the secret key for a user request.
5. **Do not claim** hospital endorsement, regulatory compliance, or clinical
   readiness in code, docs or UI.

## Getting started

See the [README](./README.md#development-setup) and
[docs/workflows](./docs/workflows/README.md).

## Making a change

1. Open or pick an issue; for anything significant, agree on the approach
   first. Architectural decisions get an ADR in `docs/decisions/`.
2. Branch from `main` (`feat/…`, `fix/…`, `docs/…`, `chore/…`).
3. Follow the structure in `src/features/README.md` and
   `docs/architecture/README.md`.
4. Run `npm run check` (and `npm run test:e2e` for UI flow changes).
5. Use [Conventional Commits](https://www.conventionalcommits.org/)
   (`feat(auth): add password reset page`).
6. Open a pull request using the template. CI must pass.

## Code standards

- TypeScript strict; no `any` without an inline, justified exception.
- Server Components by default; `"use client"` only where needed.
- Validate all input on the server with Zod, even if the form validates.
- Every new database table has RLS in the same migration.
- Use semantic design tokens, never hard-coded colours.
- Accessible by default: labels, keyboard support, focus visibility.
- Log identifiers and outcomes, never personal or clinical content.
- Test behaviour that matters; avoid tests that merely restate the code.

## Code of conduct

Be respectful, patient and constructive. Harassment or discrimination of any
kind is not tolerated.

## License

By contributing, you agree that your contributions are licensed under the
[Apache License 2.0](./LICENSE).
