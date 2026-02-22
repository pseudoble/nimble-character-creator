## Why

The application currently has zero styling — no CSS files, no styling dependencies, no design tokens. Components render as unstyled HTML. As the app grows from a few screens to a larger tool, we need a styling foundation that establishes visual identity, scales with complexity, and makes the app something worth showing off.

## What Changes

- Install and configure **Tailwind CSS v4** as the utility-first styling foundation
- Install and configure **shadcn/ui** for accessible, ownable UI primitives
- Define a **cyberpunk-flavored design token system** using CSS custom properties: dark layered surfaces, neon cyan/magenta/amber accents, cool-tinted text hierarchy
- Configure **Geist Sans + Geist Mono** typography via `next/font`
- Establish a **glow effect system** reserved for interactive/active states (focus rings, hover, active indicators)
- Style the existing **CreatorWizard** and **StepOneForm** components as the first consumers of the new system
- Create foundational **layout styling** for the app shell (dark background, centered content)

## Capabilities

### New Capabilities
- `design-system`: Core design tokens (colors, typography, spacing, effects), Tailwind v4 theme configuration, and shared CSS utilities for the cyberpunk visual identity
- `ui-primitives`: shadcn/ui component integration — Button, Input, Select, Textarea as styled, accessible building blocks

### Modified Capabilities
- `creator-wizard-shell`: Wizard shell gains visual styling (step progress indicator, card layout, actions bar) using the new design system
- `creator-step-one-character-basics`: Step one form gains styled form controls, field layout, and error states using UI primitives

## Impact

- **New dependencies**: `tailwindcss` (v4), `@tailwindcss/postcss` or built-in Next.js support, shadcn/ui CLI + Radix UI packages, `class-variance-authority`, `clsx`, `tailwind-merge`
- **New files**: Tailwind CSS entry point, shadcn component files under `src/components/ui/`, global CSS with design tokens
- **Modified files**: `layout.tsx` (font setup, global styles import), wizard and form components (add Tailwind classes, swap native elements for shadcn primitives)
- **No breaking changes** — this is additive styling on top of existing unstyled markup
