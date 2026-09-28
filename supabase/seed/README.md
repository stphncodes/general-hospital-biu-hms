# Seed data

SQL files in this folder (`*.sql`, applied in name order) run after
migrations on `npx supabase db reset` — **local development only**.

## Rules

- **Never** put real patient, staff or hospital data here — not even
  "anonymised" extracts.
- Synthetic records must be _obviously_ synthetic: use names like
  `Test Patient 001`, phone numbers such as `+234 000 000 0000`, and
  placeholder identifiers that cannot collide with real ones.
- Reference data (e.g. permission keys, lookup lists) may be seeded once its
  source and ownership are agreed during domain modelling.

No seed files exist yet because no schema exists yet.
