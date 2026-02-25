## Why

Several game rules that scale with character level are hardcoded with incorrect values or missing the concept of level entirely. Introducing a `CHARACTER_LEVEL` placeholder constant and cleaning up related constants now establishes the correct formulas and naming before leveling is implemented.

## What Changes

- Introduce `src/lib/constants.ts` as the canonical home for game-wide constants that span modules
- Add `CHARACTER_LEVEL = 1` placeholder (to be replaced when leveling is implemented)
- Add `STARTING_SKILL_POINTS = 4` and `SKILL_POINTS_PER_LEVEL = 1` to replace the misnamed `REQUIRED_SKILL_POINTS`
- Move `MAX_SKILL_TOTAL_BONUS` from `creator/constants.ts` to `src/lib/constants.ts` (used by both creator and sheet)
- Fix hit dice count formula: base is `CHARACTER_LEVEL` (not hardcoded `2`)
- Enforce the `+12` skill score cap in sheet computation (`Math.min(total, MAX_SKILL_TOTAL_BONUS)`), not just in creator validation
- Remove `REQUIRED_SKILL_POINTS` from `creator/constants.ts` and update all references

## Capabilities

### New Capabilities

- `level-constants`: A shared constants module (`src/lib/constants.ts`) that owns level-gated game constants: `CHARACTER_LEVEL`, `STARTING_SKILL_POINTS`, `SKILL_POINTS_PER_LEVEL`, and `MAX_SKILL_TOTAL_BONUS`

### Modified Capabilities

- `ancestry-background-modifiers`: Hit dice pool size formula changes — base is `CHARACTER_LEVEL` (currently `1`) instead of hardcoded `2`
- `character-sheet-page`: Sheet-computed skill scores are capped at `+12` (previously only enforced during creator validation)

## Impact

- `src/lib/constants.ts` — new file
- `src/lib/creator/constants.ts` — remove `REQUIRED_SKILL_POINTS` and `MAX_SKILL_TOTAL_BONUS`
- `src/lib/sheet/compute-sheet-data.ts` — fix hit dice base, apply skill score cap
- `src/lib/creator/stats-skills-validation.ts` — update import of `MAX_SKILL_TOTAL_BONUS`
- `src/lib/creator/stats-skills-form.tsx` — update import of `MAX_SKILL_TOTAL_BONUS`
- `src/lib/creator/stats-skills-form.tsx` — update reference from `REQUIRED_SKILL_POINTS` to `STARTING_SKILL_POINTS`
- `__tests__/` — update hit dice test expectations (dwarf + survivalist: `5` → `4`)
