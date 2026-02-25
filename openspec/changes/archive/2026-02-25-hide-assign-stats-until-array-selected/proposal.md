## Why

Step 3 currently shows the Assign Stats controls before a stat array is selected, and users can re-select the placeholder option after making a valid choice. This creates a confusing flow and produces noisy validation by surfacing individual stat errors when the real issue is that no stat array has been chosen.

## What Changes

- Hide the Assign Stats section until a valid stat array is selected.
- Prevent re-selecting the placeholder option ("Select a stat array...") after a valid stat array has been chosen.
- Adjust Step 3 validation precedence so missing stat array emits only `statArrayId` error and suppresses individual stat assignment errors in that state.
- Add/update tests to cover gated rendering behavior and validation suppression rules.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `creator-step-three-stats-skills`: Refine Step 3 requirements for stat-array-first UX gating and validation behavior when no array is selected.

## Impact

- Affected specs: `openspec/specs/creator-step-three-stats-skills/spec.md`
- Affected UI logic: `src/lib/creator/stats-skills-form.tsx`
- Affected validation logic: `src/lib/creator/stats-skills-validation.ts`
- Affected tests: Step 3 form and validation test coverage in `__tests__/creator/`
