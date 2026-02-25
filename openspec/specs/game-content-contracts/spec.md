## Purpose
Define strongly typed TypeScript contracts for game content (ancestries, classes, backgrounds, and bonuses) used by the derivation engine.

## ADDED Requirements

### Requirement: Ancestry contract interface
The system SHALL define an `Ancestry` TypeScript interface that each ancestry file must satisfy. The interface SHALL include `id` (string), `name` (string), `bonuses` (array of Bonus objects), and `traits` (array of Trait objects). Each Bonus SHALL specify a `target` (DerivedValueKey), `label` (string for breakdown attribution), and `value` (number or function of CharacterConstants).

#### Scenario: Orc ancestry satisfies contract
- **WHEN** the Orc ancestry file is compiled
- **THEN** TypeScript accepts it as a valid `Ancestry` with bonuses `[{ target: "might", label: "Orc Might", value: 1 }]`

#### Scenario: Ancestry with computed bonus satisfies contract
- **WHEN** an ancestry defines a bonus with `value: (ctx) => ctx.str + 1`
- **THEN** TypeScript accepts it as a valid `Ancestry` because `value` accepts `number | ((ctx: CharacterConstants) => number)`

### Requirement: Class definition contract interface
The system SHALL define a `ClassDef` TypeScript interface. The interface SHALL include `id` (string), `name` (string), `keyStats` (tuple of two StatKey values), `hitDie` (die size string), `startingHp` (number), `saveProfile` (save advantage/disadvantage mapping), `proficiencies` (weapons/armor), and `derivations` (array of Bonus objects representing class-specific derived value formulas).

#### Scenario: Mage class satisfies contract with mana formula
- **WHEN** the Mage class file defines `derivations: [{ target: "manaMax", label: "Mage Mana", value: (ctx) => (ctx.int * 3) + ctx.level }]`
- **THEN** TypeScript accepts it as a valid `ClassDef`

#### Scenario: Berserker class satisfies contract
- **WHEN** the Berserker class file defines `keyStats: ["str", "dex"]` and `hitDie: "d12"`
- **THEN** TypeScript accepts it as a valid `ClassDef`

### Requirement: Background contract interface
The system SHALL define a `Background` TypeScript interface. The interface SHALL include `id` (string), `name` (string), `bonuses` (array of Bonus objects), and optional `languages` (array of language ID strings).

#### Scenario: Fearless background satisfies contract
- **WHEN** the Fearless background file defines `bonuses: [{ target: "armor", label: "Fearless", value: -1 }, { target: "initiative", label: "Fearless", value: 1 }]`
- **THEN** TypeScript accepts it as a valid `Background`

#### Scenario: Background with languages satisfies contract
- **WHEN** the Raised by Goblins background defines `languages: ["goblin"]`
- **THEN** TypeScript accepts it as a valid `Background`

### Requirement: Bonus type definition
The system SHALL define a `Bonus` type with fields: `target` (DerivedValueKey — a string union of all derived value keys), `label` (string for breakdown attribution), and `value` (number or `(ctx: CharacterConstants) => number`).

#### Scenario: Flat bonus type-checks
- **WHEN** a bonus is defined as `{ target: "speed", label: "Dwarf", value: -1 }`
- **THEN** TypeScript accepts it as a valid `Bonus`

#### Scenario: Invalid target is caught at compile time
- **WHEN** a bonus is defined with `target: "nonexistent"`
- **THEN** TypeScript reports a compile error because `"nonexistent"` is not in `DerivedValueKey`

### Requirement: CharacterConstants context type
The system SHALL define a `CharacterConstants` type that is passed to computed bonus functions. It SHALL include all four stats (`str`, `dex`, `int`, `wil` as numbers), `level` (number), `classId` (string), and `keyStats` (tuple of two StatKey values). This type represents the resolved constant inputs that formulas can reference.

#### Scenario: Mana formula accesses INT and level
- **WHEN** a computed bonus function receives `{ str: 0, dex: 1, int: 3, wil: 2, level: 3, classId: "mage", keyStats: ["int", "wil"] }`
- **THEN** evaluating `(ctx) => (ctx.int * 3) + ctx.level` returns `12`

### Requirement: DerivedValueKey enumerates all derived values
The system SHALL define a `DerivedValueKey` string union type covering all supported derived values: `armor`, `speed`, `maxHp`, `maxWounds`, `maxHitDice`, `hitDieSize`, `initiative`, `inventorySlots`, `manaMax`, `heroEffectDc`, and skill-based keys. Bonus targets SHALL be constrained to this union.

#### Scenario: All core derived values are representable
- **WHEN** game content targets `"armor"`, `"speed"`, `"maxHp"`, `"manaMax"`, `"initiative"`
- **THEN** all are valid `DerivedValueKey` values accepted by the type system
