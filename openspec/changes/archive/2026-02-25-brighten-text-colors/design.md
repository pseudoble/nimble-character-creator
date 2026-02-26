## Context

The app uses three semantic text color tokens (`text-high`, `text-med`, `text-low`) defined as OKLCH values in `src/app/globals.css` via Tailwind v4's `@theme` block. All components reference these tokens through Tailwind utility classes, so changing the token values propagates everywhere automatically.

## Goals / Non-Goals

**Goals:**
- Improve readability of secondary and muted text by increasing lightness values
- Meet WCAG AA contrast ratio (4.5:1) for all text tiers against the darkest surface

**Non-Goals:**
- Changing the number of text tiers or adding new tokens
- Adjusting surface colors, accent colors, or any non-text tokens
- Modifying individual component styles

## Decisions

**Update token values in-place rather than adding new tokens**
The existing three-tier hierarchy is well-structured. The issue is just the lightness values, not the architecture. Changing two numbers in `globals.css` is the simplest path.

- `text-low`: 0.45 → 0.65 (was below WCAG AA, now comfortably above)
- `text-med`: 0.65 → 0.80 (improved readability for secondary content)
- `text-high`: 0.93 (unchanged)

## Risks / Trade-offs

**Compressed hierarchy** — `text-low` moves to where `text-med` was, and `text-med` approaches `text-high`. The visual distinction between tiers is reduced. → Acceptable because readability outweighs subtle hierarchy. The three tiers remain visually distinct (0.65 / 0.80 / 0.93).
