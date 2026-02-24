## 1. Rename types and constants

- [x] 1.1 In `types.ts`, rename `StepTwoData` → `AncestryBackgroundData`, `StepThreeData` → `StatsSkillsData`, `StepThreeStats` → `StatValues`. Update `CreatorDraft` fields from `stepTwo`/`stepThree` to `ancestryBackground`/`statsSkills`.
- [x] 1.2 In `constants.ts`, rename `STEP_THREE_REQUIRED_SKILL_POINTS` → `REQUIRED_SKILL_POINTS`, `STEP_THREE_MIN_SKILL_POINTS_PER_SKILL` → `MIN_SKILL_POINTS_PER_SKILL`, `STEP_THREE_MAX_SKILL_POINTS_PER_SKILL` → `MAX_SKILL_POINTS_PER_SKILL`.

## 2. Rename files

- [x] 2.1 Rename `step-two-form.tsx` → `ancestry-background-form.tsx`, `step-three-form.tsx` → `stats-skills-form.tsx`
- [x] 2.2 Rename `step-two-validation.ts` → `ancestry-background-validation.ts`, `step-three-validation.ts` → `stats-skills-validation.ts`
- [x] 2.3 Rename test files: `step-two-validation.test.ts` → `ancestry-background-validation.test.ts`, `step-three-validation.test.ts` → `stats-skills-validation.test.ts`

## 3. Update imports and references

- [x] 3.1 Update all imports in `creator-shell.tsx` to use new file names and type names
- [x] 3.2 Update all imports in `context.tsx` to use new type names and field names (`draft.ancestryBackground`, `draft.statsSkills`)
- [x] 3.3 Update `step-four-form.tsx` references from `draft.stepThree.stats.int` → `draft.statsSkills.stats.int` and `draft.stepTwo.ancestryId` → `draft.ancestryBackground.ancestryId`
- [x] 3.4 Update `step-four-validation.ts` references from `draft.stepThree.stats.int` → `draft.statsSkills.stats.int`
- [x] 3.5 Update renamed validation files internally to reference new type names and field paths
- [x] 3.6 Update test files to use new imports, type names, and field paths
- [x] 3.7 Update any remaining references in `compute-sheet-data.ts` or other consumers of the draft type

## 4. Swap step order

- [x] 4.1 In `creator-shell.tsx`, swap the order in the `STEP_ORDER` array so Stats & Skills comes before Ancestry & Background

## 5. Draft migration

- [x] 5.1 Bump `DRAFT_SCHEMA_VERSION` to 4 in `constants.ts`
- [x] 5.2 Add migration logic in `context.tsx` to map `stepTwo` → `ancestryBackground` and `stepThree` → `statsSkills` when loading v3 drafts

## 6. Verify

- [x] 6.1 Run all tests and confirm they pass
- [x] 6.2 Build succeeds with no compile errors
