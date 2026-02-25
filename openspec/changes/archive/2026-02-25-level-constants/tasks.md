## 1. Create shared constants module

- [x] 1.1 Create `src/lib/constants.ts` with `CHARACTER_LEVEL = 1`, `STARTING_SKILL_POINTS = 4`, `SKILL_POINTS_PER_LEVEL = 1`, and `MAX_SKILL_TOTAL_BONUS = 12` (with a TODO comment on `CHARACTER_LEVEL` noting it should be replaced when leveling is implemented)

## 2. Remove old constants

- [x] 2.1 Remove `REQUIRED_SKILL_POINTS` and `MAX_SKILL_TOTAL_BONUS` from `src/lib/creator/constants.ts` and delete the TODO comment on `MAX_SKILL_TOTAL_BONUS`

## 3. Update creator references

- [x] 3.1 Update `src/lib/creator/stats-skills-validation.ts` to import `MAX_SKILL_TOTAL_BONUS` from `src/lib/constants.ts` instead of `creator/constants.ts`
- [x] 3.2 Update `src/lib/creator/stats-skills-form.tsx` to import `MAX_SKILL_TOTAL_BONUS` from `src/lib/constants.ts` and `STARTING_SKILL_POINTS` from `src/lib/constants.ts` (replacing `REQUIRED_SKILL_POINTS`)

## 4. Fix sheet computation

- [x] 4.1 Update `src/lib/sheet/compute-sheet-data.ts` to import `CHARACTER_LEVEL` and `MAX_SKILL_TOTAL_BONUS` from `src/lib/constants.ts`
- [x] 4.2 Replace `const baseHitDiceCount = 2` with `CHARACTER_LEVEL` in the hit dice count calculation
- [x] 4.3 Apply `Math.min(..., MAX_SKILL_TOTAL_BONUS)` to the skill `total` field in `computedSkills`

## 5. Update tests

- [x] 5.1 Update the hit dice count test in `__tests__/sheet/compute-sheet-data.test.ts` — dwarf + survivalist at level 1 should expect `4` (not `5`)
- [x] 5.2 Verify no other test assertions reference the old hardcoded hit dice base of `2`
