# Design guidelines

HMS should look and read like a real public health service that staff can
trust, not like a template or a generated landing page. The reference points
are institutional services such as the NHS and GOV.UK design systems:
information first, plain language, solid surfaces, honest status.

These rules apply to every screen: public pages, auth pages and every module
inside the application. The colour tokens live in
[`src/app/globals.css`](../../src/app/globals.css); the component and motion
conventions are in [`docs/architecture/README.md`](../architecture/README.md#design-system).

## Principles

1. **Honest.** Say what exists and what is planned. Never imply a feature,
   integration, customer or statistic that is not real.
2. **Specific.** Name the task, the person and the outcome ("Ward staff
   admit a patient to a free bed"), not an abstraction ("Smarter care").
3. **Plain.** Short sentences, common words, sentence case. Write for a
   tired nurse at the end of a night shift.
4. **Calm.** Solid colour, clear hierarchy and whitespace do the work. Nothing
   competes with the content for attention.

## Visual rules

### Surfaces

- Use solid token colours only: `bg-background`, `bg-card`, `bg-primary-soft`,
  `bg-primary`. Separate sections with alternating surfaces and borders.
- **Banned:** glows and blurred colour blobs, light beams, radial or mesh
  gradients, grid or dot textures, noise, glassmorphism (`backdrop-blur`,
  translucent `bg-*/NN` surfaces), coloured shadows, "aurora" backgrounds.
  The utilities for these were removed from `globals.css` on purpose; do not
  reintroduce them.
- Shadows: at most `shadow-sm`, only to lift something above the page (a
  menu, a sticky header). Prefer a border.
- Radius: `rounded-md` for controls, `rounded-lg` for cards and panels. No
  `rounded-2xl`/`rounded-3xl`. `rounded-full` only for avatars, dots and
  circular icons.
- A thick coloured edge (`border-t-4`, `border-l-4 border-l-primary`) is the
  preferred way to add emphasis to a panel.

### Colour

- Palette tokens only (never raw hex or Tailwind palette colours such as
  `bg-blue-500` or `shadow-black`).
- Blue is for interactive elements and emphasis. Status colours (success,
  warning, info, destructive) carry meaning only.
- No gradients, including gradient text.

### Typography

- Geist, weights 400, 600 and 700 only.
- Headings: `font-bold tracking-tight`. No tighter letter-spacing than
  `tracking-tight`, no `leading` below `leading-tight`.
- Size caps: page `h1` up to `text-5xl` (`3.5rem` on the landing hero);
  section `h2` up to `text-4xl`. Giant display type is a template tell.
- Sentence case everywhere. Uppercase only for tiny status tags
  (`Development`, `Sample data`).
- **Do not** put a small coloured "eyebrow" label above every heading. A
  heading that needs a label above it needs a better heading.

### Layout

- Regular grids with consistent columns. Avoid bento grids with mixed tile
  sizes.
- Do not default to "three icons in soft rounded squares with a title and
  one line". If content is a list, make it a list.
- Describe status honestly in the copy itself (for example "Planned" on
  modules that are not built yet).

### Imagery

- Use only the project's own illustrations (`HealthcareIllustration`).
- No stock photos, AI-generated images, emoji or 3D renders.
- No fake product screenshots, dashboards or floating "notification" cards on
  public pages. Product walkthroughs may show UI with sample data only when
  clearly labelled "Sample data", and must never present sample figures as
  real statistics. The authenticated app never shows invented figures.

## Writing rules

- Lead with what the person can do or needs to know.
- Prefer verbs and nouns people use at work: register, admit, discharge,
  prescribe, dispense, request a test, bill.
- Mark planned work as planned ("being built", "Planned"), and say what is in
  place now.

### Words and patterns to avoid

| Avoid                                                                                 | Why                               |
| ------------------------------------------------------------------------------------- | --------------------------------- |
| seamless, effortless, revolutionise, transform, empower, unlock, supercharge, elevate | Marketing filler with no meaning  |
| next-generation, cutting-edge, state-of-the-art, AI-powered, smart/smarter            | Unverifiable claims               |
| "Better X. Smarter Y.", "Ready when you are.", "Everything you need"                  | Generic slogan templates          |
| Rhetorical triplets ("Fast. Secure. Reliable.")                                       | Template rhythm, says nothing     |
| "in seconds", "real-time", "live" (unless measured and true)                          | Unverified promises               |
| Exclamation marks, emoji                                                              | Not the voice of a health service |

## Motion

Motion uses only the primitives in `src/components/motion` (entrance reveals,
the gentle illustration float, hover highlight, scroll-linked progress and
page transitions), with timing from `motion/tokens.ts`.

- Do not add new effect types (parallax backgrounds, particles, typewriter or
  scramble text, 3D tilt, magnetic buttons, confetti, marquees) without
  agreeing it first.
- Every effect must respect `prefers-reduced-motion`.

## Review checklist

Before merging UI work, check:

- [ ] No glow, beam, gradient, texture, glass or coloured shadow.
- [ ] Radius and shadow within the limits above.
- [ ] Only palette tokens; status colours used for meaning only.
- [ ] Headings in sentence case, no eyebrow labels, sizes within caps.
- [ ] Copy is plain and specific; nothing from the "avoid" table.
- [ ] Planned features are labelled as planned; no invented figures.
- [ ] Sample UI is labelled "Sample data".
- [ ] Works in light (default) and dark themes; no section forced into one.
- [ ] Keyboard, focus, contrast and reduced-motion checks pass.
