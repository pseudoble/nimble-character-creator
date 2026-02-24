## Why

The skill allocation list in Step 3 is vertically bloated. Each of the 10 skill rows repeats the "Assigned Points" label and displays the full skill description inline, making the list much taller than necessary. This makes it harder to scan and compare skills at a glance.

## What Changes

- Add a Tooltip UI primitive (`@radix-ui/react-tooltip` + shadcn-style wrapper) to the component library
- Replace inline skill descriptions with an info icon that shows the description in a tooltip on hover
- Remove per-row "Assigned Points" labels and add a single column header row above the skill list
- Each skill row becomes a single tight line instead of 2-3 lines

## Capabilities

### New Capabilities
- `tooltip-primitive`: A reusable Tooltip UI component following the existing shadcn/Radix pattern, styled with the cyberpunk design system

### Modified Capabilities
- `creator-step-three-skill-layout`: Skill rows use a column header instead of per-row labels, and descriptions move to tooltips
- `ui-primitives`: Add Tooltip to the set of available UI primitives

## Impact

- New dependency: `@radix-ui/react-tooltip`
- New file: `src/components/ui/tooltip.tsx`
- Modified file: `src/lib/creator/step-three-form.tsx` (skill allocation section)
