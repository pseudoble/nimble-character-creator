## MODIFIED Requirements

### Requirement: Ancestry modifiers are defined as structured data
The system SHALL define each ancestry as a TypeScript file satisfying the `Ancestry` contract interface. Each ancestry SHALL export its bonuses as an array of `Bonus` objects with `target`, `label`, and `value` fields, replacing the current flat modifier map keyed by ancestry ID. Conditional effects SHALL remain as a separate traits array on the ancestry definition.

#### Scenario: Human ancestry modifiers
- **WHEN** the Human ancestry definition is loaded
- **THEN** it includes bonuses `[{ target: "initiative", label: "Human", value: 1 }]` and skill bonuses for all skills

#### Scenario: Dwarf ancestry modifiers
- **WHEN** the Dwarf ancestry definition is loaded
- **THEN** it includes bonuses `[{ target: "speed", label: "Dwarf", value: -1 }, { target: "maxWounds", label: "Dwarf", value: 1 }, { target: "maxHitDice", label: "Dwarf", value: 2 }]`

#### Scenario: Turtlefolk ancestry modifiers
- **WHEN** the Turtlefolk ancestry definition is loaded
- **THEN** it includes bonuses `[{ target: "speed", label: "Turtlefolk", value: -2 }, { target: "armor", label: "Turtlefolk", value: 4 }]`

#### Scenario: Ancestry with no numeric modifiers
- **WHEN** the Bunbun ancestry definition is loaded
- **THEN** it has an empty bonuses array

### Requirement: Background modifiers are defined as structured data
The system SHALL define each background as a TypeScript file satisfying the `Background` contract interface. Each background SHALL export its bonuses as an array of `Bonus` objects, replacing the current flat modifier map keyed by background ID. Language grants SHALL remain as a `languages` array on the background definition.

#### Scenario: Fearless background modifiers
- **WHEN** the Fearless background definition is loaded
- **THEN** it includes bonuses `[{ target: "armor", label: "Fearless", value: -1 }, { target: "initiative", label: "Fearless", value: 1 }]`

#### Scenario: Survivalist background modifiers
- **WHEN** the Survivalist background definition is loaded
- **THEN** it includes bonuses `[{ target: "maxHitDice", label: "Survivalist", value: 1 }]`

#### Scenario: Raised by Goblins background with languages
- **WHEN** the Raised by Goblins background definition is loaded
- **THEN** it includes `languages: ["goblin"]` alongside its bonuses array

#### Scenario: Background with no numeric modifiers
- **WHEN** the Acrobat background definition is loaded
- **THEN** it has an empty bonuses array

### Requirement: Derived values are computed as pure functions
The system SHALL compute derived values through the derivation engine's resolve function, which collects bonuses from all content sources (ancestry, background, class, boons, equipment) and returns Breakdowns. This replaces the current ad-hoc computation that only applies ancestry and background flat modifiers.

#### Scenario: Final skill score computation
- **WHEN** a Human Berserker has stats STR +2, DEX +2, INT +0, WIL -1 and allocates 2 points to Might
- **THEN** the computed Might Breakdown total is +5 (STR +2 + allocated 2 + Human +1 to all skills) with labeled entries

#### Scenario: Speed computation with ancestry modifier
- **WHEN** a Dwarf character is created
- **THEN** the speed Breakdown is `{ total: 5, entries: [{ label: "Base", value: 6 }, { label: "Dwarf", value: -1 }] }`

#### Scenario: Initiative computation with ancestry modifier
- **WHEN** a Human character has DEX +2
- **THEN** the initiative Breakdown is `{ total: 3, entries: [{ label: "DEX", value: 2 }, { label: "Human", value: 1 }] }`

#### Scenario: Inventory slots computation
- **WHEN** a character has STR +2
- **THEN** the inventory slots Breakdown is `{ total: 12, entries: [{ label: "Base", value: 10 }, { label: "STR", value: 2 }] }`
