## ADDED Requirements

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

### Requirement: Conditional modifiers include tooltip descriptions
The system SHALL represent conditional modifiers (bonuses that apply only in specific circumstances) as a separate array of objects, each with a `field` indicating which sheet value is affected, a `description` providing human-readable tooltip text, and an optional `type` field indicating whether the conditional is a simple advantage or disadvantage.

When `type` is `"advantage"` or `"disadvantage"`, renderers SHALL display the conditional as a compact symbol (`▲` for advantage, `▼` for disadvantage) rather than verbose text. The full description SHALL remain available as a hover tooltip. When `type` is absent, renderers SHALL use the existing tooltip icon behavior.

Only verifiably simple conditionals (e.g., "Advantage on Initiative") SHALL be tagged with a `type`. Complex conditionals with caveats or conditions (e.g., "+3 to Influence vs friendly characters") SHALL omit the `type` field.

#### Scenario: Kobold influence conditional
- **WHEN** the modifier map is queried for ancestry ID `"kobold"`
- **THEN** it includes a conditional `{ field: "influence", description: "+3 to Influence vs friendly characters" }` with no `type` field

#### Scenario: Ratfolk armor conditional
- **WHEN** the modifier map is queried for ancestry ID `"ratfolk"`
- **THEN** it includes a conditional `{ field: "armor", description: "+2 Armor if you moved on your last turn" }` with no `type` field

#### Scenario: Elf initiative advantage conditional
- **WHEN** the modifier map is queried for ancestry ID `"elf"`
- **THEN** it includes a conditional `{ field: "initiative", description: "Advantage on Initiative", type: "advantage" }`

### Requirement: Background modifiers can grant languages
The system SHALL support a `languages` field on `TraitModifiers` containing an array of language IDs that the background unconditionally grants to the character.

#### Scenario: Raised by Goblins grants Goblin language
- **WHEN** the modifier map is queried for background ID `"raised-by-goblins"`
- **THEN** it returns `{ languages: ["goblin"] }`

#### Scenario: Backgrounds without language grants
- **WHEN** the modifier map is queried for a background that does not grant languages (e.g., `"acrobat"`)
- **THEN** no `languages` field is present (or it is an empty array)

### Requirement: Derived values include background-granted languages
The system SHALL merge background-granted languages into the computed languages list, after Common and ancestry language but before manually selected languages.

#### Scenario: Raised by Goblins adds Goblin to language list
- **WHEN** a Human character with the "Raised by Goblins" background selects Infernal as an additional language
- **THEN** the computed languages list is `["Common", "Goblin", "Infernal"]`

#### Scenario: Background language does not duplicate ancestry language
- **WHEN** a Goblin ancestry character (who already knows Goblin from ancestry) has the "Raised by Goblins" background
- **THEN** Goblin appears only once in the computed languages list

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

### Requirement: Orc ancestry modifier encodes +1 Might
The system SHALL encode Orc ancestry flat skill modifiers as `skills: { might: 1 }` in the ancestry modifier map.

#### Scenario: Orc ancestry modifier map value
- **WHEN** the modifier map is queried for ancestry ID `"orc"`
- **THEN** it includes a flat Might skill bonus of `+1` (not `+2`)

### Requirement: Derived Orc Might totals use +1 ancestry modifier
The system SHALL include Orc's `+1` flat Might modifier when computing final Might totals from governing stat + allocated points + flat modifiers.

#### Scenario: Orc Might total computation
- **WHEN** an Orc character has STR `+2` and allocates 2 points to Might
- **THEN** the computed Might total is `+5` (`2 + 2 + 1`)
