# Styles

Global styles and design tokens live in [`src/app/globals.css`](../app/globals.css)
(the location the Next.js App Router and the shadcn/ui CLI expect).

This folder is reserved for additional stylesheets that genuinely cannot be
expressed with Tailwind utilities (for example print stylesheets for clinical
documents). Component styling belongs in the component via Tailwind classes
that reference the semantic tokens — never hard-coded colours.
