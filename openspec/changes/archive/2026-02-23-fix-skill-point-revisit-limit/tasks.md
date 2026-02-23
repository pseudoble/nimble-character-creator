## 1. Skill Point Calculation and Capping

- [x] 1.1 Update `StepThreeForm` to calculate `remainingSkillPoints` correctly on every render.
- [x] 1.2 Update the skill point `Input` component's `max` attribute to be dynamically capped by `allocatedPoints + remainingSkillPoints`.
- [x] 1.3 Update the `onChange` handler for skill points to prevent values that exceed the `remainingSkillPoints` pool.

## 2. Verification

- [x] 2.1 Add a new test case to `__tests__/creator/step-three-validation.test.ts` (or create a new test file) to verify that over-allocation is prevented in the UI logic.
- [x] 2.2 Manually verify the fix in the browser (if possible) or via a reproduction script.
