# 0006. shadcn/ui on Radix primitives with CSS-variable theming

- **Status:** Accepted
- **Date:** 2026-09-28

## Context

The UI must be accessible, keyboard-friendly, themeable (light/dark/system)
and maintainable by an open-source community over many years.

## Decision

Use shadcn/ui (components vendored into `src/components/ui`) built on Radix
primitives, Lucide icons, Tailwind CSS v4, and design tokens as CSS variables
in `globals.css`. Components use semantic token utilities only. Radix was
chosen over Base UI / React Aria for maturity and ecosystem breadth.

## Consequences

- Full ownership of component code; no opaque dependency upgrades.
- Vendored components must be re-synced deliberately with the shadcn CLI.
- The theme can evolve (or be rebranded per facility) by editing tokens.

## Alternatives considered

- **MUI / Ant Design:** heavier, harder to make feel purpose-built.
- **Hand-rolled components:** accessibility would be costly to get right.
