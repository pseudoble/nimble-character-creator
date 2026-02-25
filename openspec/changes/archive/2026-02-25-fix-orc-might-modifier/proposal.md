## Why

The Orc ancestry modifier is currently encoded as `+2` to Might in implementation, but Nimble core rules define it as `+1` Might. This creates incorrect skill totals and sheet output for Orc characters.

## What Changes

- Correct Orc ancestry flat skill modifier from `+2 Might` to `+1 Might`.
- Add regression coverage to ensure Orc Might totals remain aligned with rules.
- Update spec requirements to explicitly assert Orc ancestry modifier values.

## Capabilities

### New Capabilities
- None.

### Modified Capabilities
- `ancestry-background-modifiers`: Add explicit Orc modifier requirement (`skills: { might: 1 }`) and derived-skill outcome scenario coverage.

## Impact

- Affected code:
  - `src/lib/core-data/trait-modifiers.ts`
  - `__tests__/sheet/compute-sheet-data.test.ts` (and/or related skill derivation tests)
- Affected behavior:
  - Orc characters' Might totals and any downstream computed views using that modifier.
- No API or dependency changes.
