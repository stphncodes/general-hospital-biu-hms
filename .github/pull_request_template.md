## Summary

<!-- What does this change do, and why? Link the issue. -->

## Type

- [ ] Feature
- [ ] Fix
- [ ] Documentation
- [ ] Refactor / chore

## Checklist

- [ ] `npm run check` passes
- [ ] No real patient, staff or hospital data anywhere (code, tests, screenshots)
- [ ] No invented clinical rules; any clinical logic cites a reviewed source
- [ ] Server-side input validation (Zod) for new inputs
- [ ] Permission checks (`authorize`) for new actions/pages — no role-name checks
- [ ] New tables have Row Level Security in the same migration
- [ ] No secrets committed; no sensitive data logged
- [ ] Accessible UI (labels, keyboard, focus) for UI changes
- [ ] Docs / ADR updated where behaviour or architecture changed
