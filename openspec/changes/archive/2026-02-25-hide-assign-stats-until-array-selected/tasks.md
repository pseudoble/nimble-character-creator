## 1. Update Step 3 stat-array UX gating

- [x] 1.1 Update `src/lib/creator/stats-skills-form.tsx` to render `Assign Stats` only when a valid stat array is selected
- [x] 1.2 Update the stat-array `<select>` placeholder option so `Select a stat array...` is not selectable after a valid selection exists
- [x] 1.3 Confirm stat-array switching between valid arrays still resets assigned stats while preserving skill allocations via existing context behavior

## 2. Implement validation precedence for missing stat array

- [x] 2.1 Update `src/lib/creator/stats-skills-validation.ts` so empty `statArrayId` emits only `errors.statArrayId`
- [x] 2.2 Suppress `stats.*` and aggregate `errors.stats` when `statArrayId` is empty
- [x] 2.3 Preserve normal stat-assignment and array-multiset validation once `statArrayId` is valid

## 3. Add and update test coverage

- [x] 3.1 Add/extend Step 3 form tests to verify `Assign Stats` is hidden before array selection and shown after valid selection
- [x] 3.2 Add/extend tests to verify placeholder option cannot be re-selected after selecting a valid stat array
- [x] 3.3 Add/extend validation tests to verify missing `statArrayId` suppresses individual stat errors and aggregate stat mismatch errors
- [x] 3.4 Run `npm test` and ensure all creator-related tests pass
