## Context

Character-sheet skill totals are derived from governing stat + allocated points + flat ancestry/background modifiers. The Orc ancestry modifier is currently encoded as `+2` Might in the modifier map, while Nimble core rules specify `+1` Might. This mismatch propagates into preview/sheet totals and can produce incorrect validation outcomes for edge cases near the skill soft cap.

## Goals / Non-Goals

**Goals:**
- Align Orc ancestry skill modifier with Nimble rules (`+1` Might).
- Ensure derived skill totals reflect the corrected modifier.
- Add regression coverage so the mismatch cannot recur silently.

**Non-Goals:**
- Refactoring the ancestry/background modifier architecture.
- Broad re-audit of all ancestry/background modifiers.
- Changes to unrelated class, equipment, or rendering behavior.

## Decisions

### Decision: Correct the source-of-truth modifier entry
Update Orc in `trait-modifiers` from `skills: { might: 2 }` to `skills: { might: 1 }`.

Rationale:
- This map is the single source used by both sheet computation and creator-side skill validation.
- A single data correction fixes all dependent surfaces without branching logic.

Alternatives considered:
- Patch totals in compute/validation logic conditionally for Orc. Rejected: introduces special-case logic and leaves incorrect source data.

### Decision: Add a focused regression test for Orc Might totals
Add an explicit test case that exercises Orc skill derivation and asserts `STR + allocated + 1`.

Rationale:
- Existing tests validate the formula generally, but an explicit Orc fixture prevents regressions in trait data.

Alternatives considered:
- Rely only on generic formula tests. Rejected: does not catch wrong ancestry constants.

## Risks / Trade-offs

- [Risk] Other ancestry constants may still be incorrect without targeted tests.  
  → Mitigation: keep this change narrow, then consider a follow-up audit/change for full ancestry constant verification.

- [Trade-off] Added test increases maintenance slightly.  
  → Mitigation: test is small and validates a high-value rule constant.

## Migration Plan

1. Update Orc modifier constant.
2. Add regression test covering Orc Might total.
3. Run targeted test suites for sheet/skill derivation.
4. Ship as a non-breaking patch (no data migration required).

Rollback:
- Revert the modifier and test changes in the same commit if unexpected behavior appears.

## Open Questions

- None for this scoped fix.
