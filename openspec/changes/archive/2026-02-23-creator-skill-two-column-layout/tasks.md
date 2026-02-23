## 1. Step 3 Skill Layout Refactor

- [x] 1.1 Refactor the Step 3 skills section in `src/lib/creator/step-three-form.tsx` to render each skill as a row with two logical columns.
- [x] 1.2 Render skill name, stat tag, and skill description in the left column for each skill row.
- [x] 1.3 Render assigned point input and live computed total (`stat bonus + assigned points`) in the right column for each skill row.
- [x] 1.4 Ensure the two-column layout remains usable on mobile by stacking row content responsively.

## 2. Allocation Constraint Enforcement

- [x] 2.1 Ensure `src/lib/creator/constants.ts` defines and exports the per-skill max allocation value (`4`) used by Step 3.
- [x] 2.2 Apply the per-skill max constraint in `src/lib/creator/step-three-form.tsx` using input max/clamping logic so users cannot assign more than 4 points to one skill.
- [x] 2.3 Enforce the same per-skill max constraint in `src/lib/creator/step-three-validation.ts` so invalid payloads fail validation even if UI guards are bypassed.
- [x] 2.4 Confirm wizard advancement remains blocked when active-step validation fails due to max-allocation violations.

## 3. Test and Verification Updates

- [x] 3.1 Update `__tests__/creator/step-three-validation.test.ts` to cover per-skill max rejection (allocation greater than 4 is invalid).
- [x] 3.2 Update any affected creator wizard tests to ensure finish gating behavior remains correct with max-allocation validation failures.
- [x] 3.3 Run `npm test` and resolve any regressions related to Step 3 layout or validation changes.
