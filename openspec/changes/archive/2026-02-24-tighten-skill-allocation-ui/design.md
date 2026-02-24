## Context

The Step 3 skill allocation list renders 10 skill rows, each ~3 lines tall due to inline descriptions and repeated "Assigned Points" labels. The rows use a 3-column CSS grid: `[minmax(0,1fr)_11rem_4rem]`. The project follows the shadcn/ui pattern with Radix primitives (`@radix-ui/react-label`, `@radix-ui/react-select`, `@radix-ui/react-slot` already installed).

## Goals / Non-Goals

**Goals:**
- Reduce each skill row to a single line by moving descriptions into tooltips
- Eliminate repeated "Assigned Points" labels with a single column header
- Add a reusable Tooltip primitive to the UI component library

**Non-Goals:**
- Mobile-specific layout changes (deferred to a future mobilization pass)
- Changing the total column or its existing `title` tooltip behavior
- Modifying skill point logic, validation, or data

## Decisions

### 1. Use `@radix-ui/react-tooltip` with shadcn wrapper

**Rationale:** Consistent with existing pattern (Label wraps `@radix-ui/react-label`, Select wraps `@radix-ui/react-select`). Radix Tooltip handles positioning, collision detection, accessibility (aria-describedby), and keyboard support out of the box.

**Alternatives considered:**
- Native `title` attribute: poor UX (slow to appear, unstyled, no mobile support)
- Custom CSS tooltip: more work, worse accessibility, no collision detection

### 2. Info icon trigger for description tooltips

Use a small `ⓘ` (info circle) icon inline after the skill name and stat badge. The icon serves as the tooltip trigger. This is a recognizable pattern — users understand info icons reveal additional detail.

**Alternatives considered:**
- Tooltip on skill name hover: could interfere with the label's `htmlFor` association and feels less discoverable
- Expandable accordion per row: defeats the purpose of tightening

### 3. Column header row above the skill list

Add a header row with three labels ("Skill", "Assigned Points", "Total") using the same grid template as the data rows. This replaces the per-row labels and provides clear column context.

The existing "Skill Allocation" section title and "Remaining: X" indicator stay in place above the header row.

### 4. Tooltip styling

Style the tooltip content with the cyberpunk design tokens: `bg-surface-2` background, `border-surface-3` border, `text-text-med` text, with a subtle glow on the arrow/border matching the existing design language.

## Risks / Trade-offs

- [Tooltip not discoverable on touch devices] → Acceptable for now; mobile is explicitly a non-goal. The info icon provides a visual affordance that something is interactive.
- [Added dependency] → `@radix-ui/react-tooltip` is small and from the same ecosystem already in use. Minimal risk.
