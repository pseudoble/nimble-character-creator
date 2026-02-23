## Why

Step 1 collects class, name, and description. The character creator needs a second step where the player chooses an ancestry and background — two core identity choices that grant mechanical traits and narrative flavor. Core data for both already exists; we need validation logic, tests, and the step wired into the wizard.

## What Changes

- Add `StepTwoData` interface with required `ancestryId`, required `backgroundId`, and optional `motivation` (free-text, max 200 chars)
- Add `stepTwo` to `CreatorDraft`
- Add `validateStepTwo()` following the same Zod + field-level error pattern as Step 1
- Ancestry must reference a valid ID from `ancestries.json`
- Background must reference a valid ID from `backgrounds.json`
- Background requirement filtering is **out of scope** for this change (all backgrounds selectable regardless of stats, since stats aren't chosen yet)
- Automated tests mirroring Step 1 patterns: valid payload, missing ancestry, missing background, invalid IDs, overlong motivation

## Capabilities

### New Capabilities
- `creator-step-two-ancestry-background`: Ancestry and background selection with validation, motivation field, and test coverage

### Modified Capabilities
- `creator-wizard-shell`: Step 2 added to step registry so the wizard recognizes and gates it

## Impact

- `src/lib/creator/types.ts` — new `StepTwoData`, updated `CreatorDraft`
- `src/lib/creator/step-two-validation.ts` — new validation function
- `src/lib/creator/constants.ts` — new constants (max motivation length, step ID)
- `__tests__/creator/step-two-validation.test.ts` — new test file
- Draft persistence will automatically pick up new `stepTwo` field
- No API or dependency changes
