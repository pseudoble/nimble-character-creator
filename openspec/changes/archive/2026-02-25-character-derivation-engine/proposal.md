## Why

Derived character values (armor, speed, max HP, mana, skill totals, initiative, etc.) are currently computed with ad-hoc logic scattered across components. There is no unified system to collect bonus sources, resolve formulas, or produce auditable breakdowns showing where each number comes from. As more game content is added (classes, ancestries, boons, equipment), this becomes increasingly fragile and hard to verify.

## What Changes

- Introduce a derivation engine that resolves all derived character values from constants + bonus sources
- Define TypeScript interfaces (contracts) for game content definitions: classes, ancestries, backgrounds, boons, equipment
- Every resolved value returns a `Breakdown` (labeled entries + total) for tooltip display
- Game content is authored as TypeScript files satisfying the contracts — `number` for flat bonuses, `(ctx) => number` for formulas
- Engine uses a simple two-pass resolution: first-order values, then second-order values that depend on them
- Conditional/situational bonuses (raging, hunter's mark, etc.) are out of scope — player handles those at the table

## Capabilities

### New Capabilities
- `derivation-engine`: Core engine that resolves character constants + bonus sources into Breakdown values via a two-pass pipeline
- `game-content-contracts`: TypeScript interfaces defining the shape of classes, ancestries, backgrounds, boons, and equipment as bonus source providers

### Modified Capabilities
- `ancestry-background-modifiers`: Ancestry and background modifier maps will be superseded by the new game content contract system, which uses the same flat-modifier pattern but in a unified interface

## Impact

- New `src/engine/` directory for derivation logic, contracts, and content definitions
- Existing ancestry/background modifier maps in `src/lib/` will be migrated to the new contract shape
- Character sheet components will consume `Breakdown` objects instead of raw numbers, enabling tooltip breakdowns
- No external dependency changes — pure TypeScript, no new packages
