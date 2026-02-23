## Why

The creator currently stops after Step 2, so players cannot complete core mechanical setup (stat assignment and skill points) inside the guided flow. Step 3 is needed now to unblock full character creation and enforce valid distributions before final submission.

## What Changes

- Add a Step 3 data model for selected stat array, assigned values for `STR`/`DEX`/`INT`/`WIL`, and per-skill allocation.
- Add a Step 3 form that lets users pick a stat array, assign array values to each stat, and allocate skill points.
- Guard stat assignment dropdowns so unavailable array values cannot be selected more times than they appear in the selected array.
- Validate Step 3 on submit: legal stat distribution from the selected array and legal skill allocation totals.
- Add automated tests for Step 3 validation success/failure paths and wizard gating with Step 3.

## Capabilities

### New Capabilities
- `creator-step-three-stats-skills`: Step 3 stat-array selection, stat assignment, skill allocation, validation, and test coverage.

### Modified Capabilities
- `creator-wizard-shell`: Extend wizard progression and validation gating to include Step 3 before finish.

## Impact

- `src/lib/creator/types.ts` - add `StepThreeData` and include `stepThree` in `CreatorDraft`
- `src/lib/creator/constants.ts` - add Step 3 ID and Step 3 validation constants
- `src/lib/creator/draft-persistence.ts` - include default/backfill behavior for `stepThree`
- `src/lib/creator/step-three-form.tsx` - new Step 3 UI
- `src/lib/creator/step-three-validation.ts` - new Step 3 validation logic
- `src/lib/creator/wizard-shell.tsx` - register/render Step 3 and gate final submit on Step 3 validity
- `__tests__/creator/step-three-validation.test.ts` - new validation tests
- `__tests__/creator/wizard-navigation.test.ts` - add Step 3 navigation/gating coverage
