## 1. Core Types and Contracts

- [x] 1.1 Define `Breakdown`, `Bonus`, `CharacterConstants`, `DerivedValueKey`, and `StatKey` types in `src/engine/types.ts`
- [x] 1.2 Define `Ancestry` interface with `id`, `name`, `bonuses`, and `traits` fields
- [x] 1.3 Define `ClassDef` interface with `id`, `name`, `keyStats`, `hitDie`, `startingHp`, `saveProfile`, `proficiencies`, and `derivations`
- [x] 1.4 Define `Background` interface with `id`, `name`, `bonuses`, and optional `languages`

## 2. Derivation Engine

- [x] 2.1 Implement `resolveBonus` helper that evaluates a bonus value (number or function) against CharacterConstants
- [x] 2.2 Implement `collectBonuses` that gathers all Bonus objects targeting a given DerivedValueKey from all content sources
- [x] 2.3 Implement first-pass resolution for all first-order derived values (speed, armor, maxHp, maxWounds, maxHitDice, hitDieSize, initiative, inventorySlots, manaMax, heroEffectDc, skill totals)
- [x] 2.4 Implement second-pass resolution for second-order derived values (defend damage reduction from armor, death threshold from maxWounds)
- [x] 2.5 Implement top-level `resolve` function that runs both passes and returns `Record<DerivedValueKey, Breakdown>`
- [x] 2.6 Write Vitest tests for the resolve function covering scenarios from the derivation-engine spec

## 3. Migrate Game Content to Contracts

- [x] 3.1 Migrate ancestry modifier maps to individual Ancestry contract objects (or a single registry file) with Bonus arrays
- [x] 3.2 Migrate background modifier maps to Background contract objects with Bonus arrays and language grants
- [x] 3.3 Create ClassDef definitions for all classes with keyStats, hitDie, startingHp, and class-specific derivations (mana formulas, etc.)
- [x] 3.4 Write Vitest tests verifying each ancestry and background produces expected bonuses per the ancestry-background-modifiers spec

## 4. React Integration

- [x] 4.1 Implement `useCharacterSheet` hook that accepts a draft, builds CharacterConstants, calls resolve, and memoizes results
- [x] 4.2 Update character sheet components to consume Breakdown objects instead of raw numbers
- [x] 4.3 Add breakdown tooltip display to derived value cells (show labeled entries on hover)

## 5. Cleanup

- [x] 5.1 Remove old `src/lib/ancestry-modifiers.ts` and `src/lib/background-modifiers.ts` after migration is verified
- [x] 5.2 Remove old ad-hoc derived value computation from `src/lib/derived-values.ts` (or refactor to delegate to engine)
