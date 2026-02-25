## Context

Several game-rule values that scale with character level are either hardcoded incorrectly or missing the level concept entirely:

- `baseHitDiceCount = 2` in `compute-sheet-data.ts` — should be `CHARACTER_LEVEL` (currently 1 at level 1)
- `REQUIRED_SKILL_POINTS = 4` in `creator/constants.ts` — misleading name; this is the starting allocation at level 1, not a fixed requirement
- `MAX_SKILL_TOTAL_BONUS = 12` enforced in creator validation but not applied in sheet computation
- No shared constants file — level-gated values are scattered across `creator/constants.ts` and inlined in `compute-sheet-data.ts`

Leveling is not yet implemented, but the correct formulas and naming should be in place before that work begins.

## Goals / Non-Goals

**Goals:**
- Create `src/lib/constants.ts` as the single home for game-wide constants that span creator and sheet modules
- Introduce `CHARACTER_LEVEL = 1` as a documented placeholder for the future leveling system
- Correct the hit dice count formula to use `CHARACTER_LEVEL`
- Rename `REQUIRED_SKILL_POINTS` to `STARTING_SKILL_POINTS` and add `SKILL_POINTS_PER_LEVEL = 1`
- Move `MAX_SKILL_TOTAL_BONUS` to the shared constants file
- Apply `Math.min(total, MAX_SKILL_TOTAL_BONUS)` in sheet skill score computation

**Non-Goals:**
- Implementing leveling (level selection, level-up flow, storing level on character)
- Changing how skill points are spent or validated in the creator beyond the import rename
- Adding boon modifiers to the hit dice or skill score calculations

## Decisions

### Shared `src/lib/constants.ts` over module-local constants

`MAX_SKILL_TOTAL_BONUS` is already consumed by both `creator/` and `sheet/`. `CHARACTER_LEVEL` will also be needed in both once leveling is implemented. A shared file at `src/lib/constants.ts` prevents circular imports and makes the coupling explicit. `creator/constants.ts` retains creator-workflow-specific constants (storage keys, step IDs, form limits) that have no relevance to the sheet.

### `CHARACTER_LEVEL` as a module-level constant (not a runtime value)

Since leveling is not implemented, `CHARACTER_LEVEL = 1` is a compile-time constant. When leveling lands, it will be replaced by a value read from the character draft/store. Using a named constant rather than the literal `1` makes every usage site a clear TODO for that future work.

### Enforce skill cap in `compute-sheet-data.ts` via `Math.min`

The `+12` cap is a game rule that applies to the final derived score, not just to creator input. Enforcing it in `compute-sheet-data.ts` means the sheet always reflects the capped value regardless of how the draft was produced (creator, migration, future API). The creator validation remains as a user-facing error; the sheet computation is the authoritative enforcement.

## Risks / Trade-offs

- **Test expectations shift**: The existing test for dwarf + survivalist expects `hitDiceCount = 5`; it becomes `4` (correct per rule). Any snapshot or assertion relying on the old incorrect value must be updated.
  → Mitigation: Update tests as part of this change; the test correction documents the rule fix.

- **`REQUIRED_SKILL_POINTS` rename is a find-and-replace**: All usages must be caught.
  → Mitigation: TypeScript will surface any missed references at compile time.

## Open Questions

None — scope is fully defined.
