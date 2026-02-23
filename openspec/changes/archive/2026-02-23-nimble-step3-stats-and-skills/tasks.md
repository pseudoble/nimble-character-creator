## 1. Step 3 Data Model and Constants

- [x] 1.1 Add `StepThreeData` to `src/lib/creator/types.ts` and include `stepThree` on `CreatorDraft`
- [x] 1.2 Add Step 3 identifiers/constants to `src/lib/creator/constants.ts` (step ID plus skill-point rule constants)
- [x] 1.3 Update `src/lib/creator/draft-persistence.ts` to initialize and backfill `stepThree` safely for older drafts

## 2. Step 3 Validation Logic

- [x] 2.1 Create `src/lib/creator/step-three-validation.ts` with static valid ID lists for stat arrays and skills
- [x] 2.2 Implement schema validation for required `statArrayId`, `STR/DEX/INT/WIL` assignment fields, and skill allocation shape
- [x] 2.3 Implement domain validation for stat-array multiset matching (including duplicate value counts)
- [x] 2.4 Implement domain validation for legal skill allocation totals using configured constants
- [x] 2.5 Export validation helpers used by both Step 3 form and tests (e.g., remaining-value availability logic)

## 3. Step 3 Form UI

- [x] 3.1 Create `src/lib/creator/step-three-form.tsx` with stat-array selector, stat assignment controls, and skill allocation controls
- [x] 3.2 Wire stat assignment dropdown guards so values cannot be selected more times than available in the chosen array
- [x] 3.3 Render Step 3 validation errors at field-level and summary-level for distribution/point-total failures

## 4. Wizard Integration

- [x] 4.1 Register Step 3 (`Stats & Skills`) in `src/lib/creator/wizard-shell.tsx` after Step 2
- [x] 4.2 Add `updateStepThree` state updates and render `StepThreeForm` for the active Step 3 view
- [x] 4.3 Extend wizard validation gating so finish is blocked when Step 3 is invalid and allowed when Step 3 is valid
- [x] 4.4 Include `stepThree` in draft save-change detection to keep persistence behavior consistent

## 5. Automated Tests

- [x] 5.1 Create `__tests__/creator/step-three-validation.test.ts` with a `makeDraft()` helper including Step 1-3 defaults
- [x] 5.2 Add Step 3 validation tests for valid payload, missing stat array, incomplete assignments, illegal multiset usage, and invalid skill totals
- [x] 5.3 Add tests that verify duplicate array values are allowed only up to their available count
- [x] 5.4 Add tests that `getValidStatArrayIds()` and valid skill ID lists match `stat-arrays.json` and `skills.json`
- [x] 5.5 Update `__tests__/creator/wizard-navigation.test.ts` to cover Step 3 gating, finish behavior, and back navigation from Step 3
