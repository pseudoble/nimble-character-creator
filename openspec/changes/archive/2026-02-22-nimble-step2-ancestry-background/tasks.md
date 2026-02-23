## 1. Types and Constants

- [x] 1.1 Add `StepTwoData` interface to `src/lib/creator/types.ts` with `ancestryId: string`, `backgroundId: string`, `motivation: string`
- [x] 1.2 Add `stepTwo: StepTwoData` to `CreatorDraft` interface
- [x] 1.3 Add `ANCESTRY_BACKGROUND: "ancestry-background"` to `STEP_IDS` and `MAX_MOTIVATION_LENGTH = 200` to `src/lib/creator/constants.ts`

## 2. Validation Logic

- [x] 2.1 Create `src/lib/creator/step-two-validation.ts` with `getValidAncestryIds()` returning static ID array matching `ancestries.json`
- [x] 2.2 Add `getValidBackgroundIds()` returning static ID array matching `backgrounds.json`
- [x] 2.3 Define `StepTwoSchema` with Zod: `ancestryId` required, `backgroundId` required, `motivation` optional with max length
- [x] 2.4 Implement `validateStepTwo()` following `validateStepOne()` pattern — parse with Zod, then verify IDs exist in valid lists

## 3. Wizard Shell Integration

- [x] 3.1 Register Step 2 in the wizard step list so the shell recognizes it and gates advancement on `validateStepTwo()`

## 4. Tests

- [x] 4.1 Create `__tests__/creator/step-two-validation.test.ts` with `makeDraft()` helper
- [x] 4.2 Test valid payload passes validation
- [x] 4.3 Test missing ancestry fails with `ancestryId` error
- [x] 4.4 Test missing background fails with `backgroundId` error
- [x] 4.5 Test non-existent ancestry ID fails validation
- [x] 4.6 Test non-existent background ID fails validation
- [x] 4.7 Test overlong motivation fails with `motivation` error
- [x] 4.8 Test empty motivation passes validation
- [x] 4.9 Test `getValidAncestryIds()` matches IDs from `ancestries.json`
- [x] 4.10 Test `getValidBackgroundIds()` matches IDs from `backgrounds.json`
