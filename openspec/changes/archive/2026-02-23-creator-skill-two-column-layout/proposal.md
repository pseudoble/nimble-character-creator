## Why

Step 3 skill allocation currently renders as card-style controls that make it harder to scan many skills and compare allocations quickly. A two-column layout with clear descriptions and point assignment controls improves readability and reduces allocation mistakes during character setup.

## What Changes

- Update Step 3 skill allocation UI to render each skill in a two-column structure (table/grid row): skill identity + description on the left, point assignment on the right.
- Show skill description inline with each skill row to improve decision context while allocating points.
- Show live per-skill totals using stat bonus plus assigned points.
- Guard assignment controls against over-allocation per skill (maximum 4 points) while preserving existing total-point validation.

## Capabilities

### New Capabilities
- `creator-step-three-skill-layout`: Two-column Step 3 skill presentation with descriptions, live totals, and per-skill allocation guards.

### Modified Capabilities
- `creator-wizard-shell`: Clarify that Step 3 completion rules continue to enforce skill allocation constraints, including per-skill maximums.

## Impact

- `src/lib/creator/step-three-form.tsx`
- `src/lib/creator/step-three-validation.ts`
- `src/lib/creator/constants.ts`
- `__tests__/creator/step-three-validation.test.ts`
