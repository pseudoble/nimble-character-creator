## Why

Step 3 currently enforces an incorrect per-skill allocation cap of 4 points, which conflicts with the game rules and blocks valid distributions. We need to remove that rule now and replace it with the actual cap semantics (`final skill bonus <= +12`) before leveling-up work introduces larger point pools.

## What Changes

- Remove the Step 3 per-skill allocation maximum of 4 from interaction guards and validation.
- Keep the total allocation pool rule (`allocate exactly 4 points`) for level-1 creation unchanged.
- Add a soft-cap rule that each skill's final total bonus must be at most `+12`.
- Define final total bonus as governing stat + allocated points + any flat ancestry/background skill modifiers.
- Ensure Step 3 validity is recalculated when ancestry/background selections change, because those modifiers can affect the skill soft cap.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `creator-step-three-skill-layout`: Replace per-skill allocation max behavior with soft-cap-aware point assignment behavior tied to final skill total.
- `creator-step-three-stats-skills`: Update Step 3 validation requirements to enforce `final skill bonus <= +12` using stat, allocation, and ancestry/background flat skill modifiers.

## Impact

- Affected code:
  - `src/lib/creator/constants.ts`
  - `src/lib/creator/stats-skills-validation.ts`
  - `src/lib/creator/stats-skills-form.tsx`
  - `src/lib/creator/context.tsx`
  - `__tests__/creator/stats-skills-validation.test.ts`
  - `__tests__/creator/step-three-skill-total.test.ts`
  - `__tests__/sheet/compute-sheet-data.test.ts` (soft-cap guard coverage if needed)
- Affected specs:
  - `openspec/specs/creator-step-three-skill-layout/spec.md`
  - `openspec/specs/creator-step-three-stats-skills/spec.md`
- No external API or dependency changes.
