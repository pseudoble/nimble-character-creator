## 1. Skill Cap Model and Shared Math

- [x] 1.1 Replace the per-skill allocation max constant with a shared `MAX_SKILL_TOTAL_BONUS` constant (`12`) in creator constants.
- [x] 1.2 Add a shared helper for flat skill modifier contribution (`all` + per-skill ancestry/background bonuses) so creator validation and UI guard logic use the same formula.
- [x] 1.3 Remove remaining references to `MAX_SKILL_POINTS_PER_SKILL` in creator code paths.

## 2. Validation and State Revalidation

- [x] 2.1 Update `validateStatsSkills` to remove per-skill allocation max checks while keeping non-negative integer and total-pool validation rules.
- [x] 2.2 Add final-bonus soft-cap validation (`stat + allocated + flat ancestry/background modifier <= 12`) with field-level errors on violating skills.
- [x] 2.3 Update creator context so ancestry/background updates also recompute Stats & Skills validation immediately.

## 3. Step 3 Interaction Guard Updates

- [x] 3.1 Update Step 3 skill input `max`/clamping logic to combine remaining-pool headroom with soft-cap headroom based on final skill total.
- [x] 3.2 Ensure Step 3 interaction guard math includes flat ancestry/background skill modifiers in the same way as validation.
- [x] 3.3 Preserve existing Step 3 live-total and remaining-points behavior while removing any fixed `4 per skill` assumptions.

## 4. Tests and Verification

- [x] 4.1 Replace per-skill-max validation tests with soft-cap tests in `__tests__/creator/stats-skills-validation.test.ts`, including ancestry/background all-skills and per-skill modifier cases.
- [x] 4.2 Update `__tests__/creator/step-three-skill-total.test.ts` to assert new effective-max/clamping behavior under soft-cap and pool constraints.
- [x] 4.3 Add or update creator context/wizard tests to verify ancestry/background changes can invalidate or restore Step 3 without re-entering Step 3.
- [x] 4.4 Run the relevant creator and sheet test suites and confirm no regressions.
