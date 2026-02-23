## Context

Each skill row in Step 3 currently uses a two-column CSS grid (`[minmax(0,1fr)_11rem]`). The right column contains the "Assigned Points" label, a number input, an inline total line (`Total: +N (INT +2 + Points 1)`), and any validation error. The total is visually subordinate and interleaved with controls, making it easy to overlook.

## Goals / Non-Goals

**Goals:**
- Make the computed skill total the most scannable element in each row
- Provide calculation breakdown on hover without cluttering the default view
- Keep the assigned-points column focused solely on its input

**Non-Goals:**
- Changing the point allocation mechanics or validation logic
- Redesigning the overall skill row card or left column
- Adding mobile-specific interactions (tooltip works via hover/focus)

## Decisions

### 1. Three-column grid layout

Expand the skill row grid from `sm:grid-cols-[minmax(0,1fr)_11rem]` to `sm:grid-cols-[minmax(0,1fr)_11rem_4rem]`. The new third column is a fixed-width cell for the total integer. On mobile (below `sm`), columns stack naturally.

**Rationale:** A fixed narrow column keeps the total aligned across all rows and visually distinct from the input area. 4rem is wide enough for signed two-digit values (`+12`) with padding.

### 2. Native `title` attribute for tooltip

Use the HTML `title` attribute on the total cell to show the calculation breakdown (e.g., `"INT +2 + Points 1 = +3"`).

**Rationale:** Zero-dependency, works everywhere, no additional component or state needed. A custom tooltip component would be over-engineered for a single static text line. Can be upgraded later if richer formatting is needed.

### 3. Total display styling

Render the total as a large `font-mono text-lg font-bold` integer with the existing `formatSignedValue` helper. Use `text-neon-cyan` when fully allocated or stat-driven, keeping consistent with the design system.

**Rationale:** Font size and weight create immediate visual hierarchy over the smaller input and labels.

## Risks / Trade-offs

- **`title` tooltip not visible on touch devices** → Acceptable for now; the total integer itself is always visible, and the breakdown is supplementary context. A future change could add a tap-to-reveal or always-visible breakdown on mobile.
- **Grid column count change may affect existing test snapshots** → Tests should target semantic content (total value, tooltip text) rather than layout classes.
