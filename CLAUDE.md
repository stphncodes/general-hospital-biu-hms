# CLAUDE.md

Guidance for AI coding assistants working in this repository.

## Working rules

- **Ask before building new features.** Before implementing any new feature or
  significant addition, ask the maintainer clarifying questions (scope,
  behaviour, trade-offs) with concrete options. Bug fixes and small tweaks to
  agreed work do not need this.
- Run `npm run check` (types, lint, format, tests) and `npm run build` before
  reporting work as done.

## Design rules (summary)

The full rules are in [docs/design/README.md](docs/design/README.md). The brand
colour is clinical green (`--hms-primary`, #15803D). `/` is the staff sign-in
(no landing page); the admin console is at `/admin` (sign-in `/admin/login`,
not linked from staff pages). The UI
must not look AI-generated. It should read like an institutional public health
service (NHS / GOV.UK style).

- **Surfaces:** solid palette tokens only. No glows, blurred blobs, light
  beams, gradients (including gradient text), grid/dot textures, glassmorphism
  (`backdrop-blur`, translucent surfaces) or coloured shadows. Shadow at most
  `shadow-sm`; radius at most `rounded-lg` for cards.
- **Colour:** tokens from `src/app/globals.css` only. Never raw hex or Tailwind
  palette colours (`bg-blue-500`, `shadow-black`).
- **Theme:** light is the default. Every surface follows the active theme;
  never force a section dark with a scoped `dark` class.
- **Type:** `font-bold tracking-tight` headings, sentence case, `h1` at most
  `text-5xl`, no small coloured eyebrow labels above headings.
- **Layout:** regular grids; no bento grids; do not default to rows of three
  icon cards.
- **Copy:** plain, specific, honest. No slogans ("Better X. Smarter Y."), no
  marketing filler (seamless, empower, next-gen, smart, AI-powered), no
  rhetorical triplets, no emoji. Label planned features as planned.
- **Data:** never show invented figures in the app. Sample UI on public pages
  must be labelled "Sample data"; no fake dashboards or floating status cards.
- **Imagery:** project illustrations only (`HealthcareIllustration`); no stock
  or AI-generated images.
- **Motion:** only the primitives in `src/components/motion`; no new effect
  types without agreement; always respect `prefers-reduced-motion`.
