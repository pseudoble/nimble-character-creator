## Purpose
Define a unified, pure derivation engine that computes character derived values from constants and content-provided bonuses with auditable breakdowns.

## ADDED Requirements

### Requirement: Breakdown type for all derived values
The system SHALL represent every derived character value as a `Breakdown` object containing a `total` (number) and an `entries` array. Each entry SHALL have a `label` (string) and `value` (number) identifying the source and its contribution. The sum of all entry values SHALL equal the total.

#### Scenario: Speed with multiple bonus sources
- **WHEN** a Dwarf character with Boots of Speed (+1) is resolved
- **THEN** the speed Breakdown is `{ total: 6, entries: [{ label: "Base", value: 6 }, { label: "Dwarf", value: -1 }, { label: "Boots of Speed", value: 1 }] }`

#### Scenario: Simple derived value with no bonuses
- **WHEN** a Human character with no speed modifiers is resolved
- **THEN** the speed Breakdown is `{ total: 6, entries: [{ label: "Base", value: 6 }] }`

### Requirement: Two-pass resolution of derived values
The system SHALL resolve derived values in two passes. The first pass SHALL resolve all first-order values (those depending only on character constants). The second pass SHALL resolve second-order values (those depending on first-order results). The engine SHALL make the first-pass results available as context for second-order computations.

#### Scenario: Defend damage reduction depends on armor
- **WHEN** a character's armor resolves to 5 in the first pass
- **THEN** the second pass resolves defend damage reduction using the armor Breakdown total of 5

#### Scenario: First-order values do not depend on other derived values
- **WHEN** mana max is computed as `(INT * 3) + level`
- **THEN** it uses only character constants (INT stat value, level), not other derived values

### Requirement: Bonus source collection across all content sources
The engine SHALL collect bonus sources from all registered content providers (class, ancestry, background, boons, equipment) for each derived value target. Bonuses targeting the same derived value from different sources SHALL all appear as separate entries in the Breakdown.

#### Scenario: Armor from equipment plus ancestry bonus
- **WHEN** a Turtlefolk character wearing leather armor (base 3 + DEX) with DEX +2 is resolved
- **THEN** the armor Breakdown includes entries from both equipment (base + DEX contribution) and ancestry (Turtlefolk +4)

#### Scenario: No bonuses targeting a derived value
- **WHEN** no content source provides a bonus targeting inventory slots
- **THEN** the inventory slots Breakdown contains only the base entry (`10 + STR`)

### Requirement: Bonus values support static and computed forms
The engine SHALL accept bonus values as either a plain `number` or a function `(ctx: CharacterConstants) => number`. When resolving, the engine SHALL call function-type values with the current character constants to produce the numeric result.

#### Scenario: Static flat bonus
- **WHEN** an ancestry defines `{ target: "speed", label: "Dwarf", value: -1 }`
- **THEN** the engine adds an entry `{ label: "Dwarf", value: -1 }` to the speed Breakdown

#### Scenario: Computed bonus using stats
- **WHEN** a class defines `{ target: "manaMax", label: "Mage Mana", value: (ctx) => (ctx.int * 3) + ctx.level }`
- **THEN** the engine calls the function with character constants and adds the resulting number as the entry value

### Requirement: Resolve function is pure
The resolve function SHALL be a pure function accepting character constants and all content source definitions, returning a record of `DerivedValueKey` to `Breakdown`. It SHALL have no side effects and SHALL produce identical output for identical input.

#### Scenario: Deterministic output
- **WHEN** the resolve function is called twice with the same character constants and content sources
- **THEN** both calls return identical Breakdown records

### Requirement: React hook wraps the engine
The system SHALL provide a `useCharacterSheet` hook that accepts a character draft, resolves it through the derivation engine, and returns all Breakdowns. The hook SHALL memoize results so that re-renders only occur when input values change.

#### Scenario: Hook returns breakdowns
- **WHEN** a component calls `useCharacterSheet(draft)` with a valid draft
- **THEN** it receives a record mapping each derived value key to its Breakdown

#### Scenario: Hook memoizes on stable input
- **WHEN** a component re-renders but the draft has not changed
- **THEN** the hook returns the same Breakdown reference without recomputing
