## Context

Step 3 currently has a hard per-skill allocation limit (`4`) implemented in UI input clamping and zod validation. That rule is not part of the game system and conflicts with source rules that define only:

- a level-based skill point pool (4 at level 1), and
- a maximum final skill bonus of `+12`.

In this codebase, final displayed skill totals also include flat ancestry/background skill modifiers, so the cap check must include those contributors as well.

This change is cross-cutting across creator validation, Step 3 interaction guards, and creator state updates triggered by ancestry/background edits.

## Goals / Non-Goals

**Goals:**

- Remove the per-skill allocation max constraint from Step 3 behavior and validation.
- Enforce `final skill bonus <= +12` using: stat assignment + allocated points + flat ancestry/background skill modifiers.
- Keep the existing level-1 pool rule (`allocate exactly 4 total points`) unchanged.
- Ensure Stats & Skills validity is recomputed when ancestry/background changes can alter skill modifiers.
- Keep validation and UI guard math aligned to avoid contradictory behavior.

**Non-Goals:**

- Introducing leveling-up point pools or level-aware allocation budgets.
- Reworking skill conditional modifiers into numeric calculations.
- Redesigning sheet skill allocation visualization (for example, fixed 4-dot display behavior).
- Changing rule text outside the targeted Step 3 capabilities.

## Decisions

### 1) Replace per-skill max with final-total soft cap

Decision:

- Remove `MAX_SKILL_POINTS_PER_SKILL` checks.
- Add a shared `MAX_SKILL_TOTAL_BONUS = 12`.
- Validate each skill against `stat + allocated + flatModifier <= MAX_SKILL_TOTAL_BONUS`.

Rationale:

- Matches system rules and avoids encoding a non-existent per-skill allocation cap.

Alternatives considered:

- Keep per-skill max and add +12 check: rejected because the per-skill max remains incorrect domain behavior.
- Apply cap only in sheet rendering: rejected because invalid drafts could pass creator validation.

### 2) Count ancestry/background flat skill modifiers in cap computation

Decision:

- Compute flat skill modifier contributions in creator validation and Step 3 UI guard using the same logic currently used by sheet totals (`skills.all` plus per-skill entries from ancestry/background modifiers).

Rationale:

- Ensures the cap is applied to the actual final skill total the user sees.

Alternatives considered:

- Cap only `stat + allocation`: rejected because it can still produce displayed totals above +12 once trait bonuses are added.

### 3) Keep total pool gating; change per-row max guard source

Decision:

- Preserve `REQUIRED_SKILL_POINTS` total rule for Step 3.
- Replace input `max` calculation with the minimum of:
  - points available from remaining pool for that row, and
  - points available before hitting the +12 total cap for that skill.

Rationale:

- Prevents UI from offering values that validation would reject while preserving existing total-pool behavior.

Alternatives considered:

- Remove input guard and rely only on submit validation: rejected due to poorer UX and inconsistent immediate feedback.

### 4) Revalidate Step 3 on ancestry/background updates

Decision:

- After `updateAncestryBackground`, recompute Stats & Skills validation in creator context in addition to ancestry/background validation.

Rationale:

- Step 3 validity now depends on step 2 modifiers; without this, completion state can become stale until the user revisits Step 3.

Alternatives considered:

- Revalidate Step 3 only when user enters Step 3: rejected due to stale invalid states during normal flow.

### 5) Add defensive sheet-level cap handling tests

Decision:

- Add test coverage ensuring skill totals do not exceed +12 in creator validation pathways.
- Keep sheet computation deterministic and aligned with creator validation math; if defensive clamping is added, it must be explicitly tested and documented.

Rationale:

- Prevents silent divergence between creator and sheet totals as leveling features are introduced.

Alternatives considered:

- No additional tests beyond Step 3: rejected due to cross-module total computation.

## Risks / Trade-offs

- [Rule/math drift between creator and sheet] -> Use shared helper math for flat skill modifier contribution and cover with unit tests.
- [Cross-step validation complexity] -> Explicitly revalidate Step 3 in ancestry/background update path and verify in tests.
- [Soft cap rarely triggered at level 1] -> Add focused tests with synthetic draft values to verify behavior now and prevent regressions later.
- [Future conditional modifiers interpreted as numeric bonuses] -> Limit cap math to flat numeric modifiers only; document this in requirements.

## Migration Plan

1. Update Step 3 specs (skill layout + stats/skills validation semantics).
2. Remove per-skill max constant/validation and add soft-cap constant/helper.
3. Update Step 3 form input guards to use remaining-pool and soft-cap headroom.
4. Revalidate Step 3 when ancestry/background changes.
5. Update/add tests for validation and UI capping logic.
6. Run creator + sheet test suites.

Rollback:

- Revert this change set to restore previous per-skill max behavior if unexpected validation regressions are found.

Data migration:

- None. Existing drafts continue to load; validation semantics only change at runtime.

## Open Questions

- Should we surface a dedicated aggregated error message for soft-cap violations (for example, naming the offending skill) in addition to field-level errors?
