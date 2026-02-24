## ADDED Requirements

### Requirement: Ancestry modifiers are defined as structured data
The system SHALL provide a TypeScript map keyed by ancestry ID that encodes all numeric sheet modifiers for each ancestry. Each entry SHALL include flat bonuses for speed, armor, max wounds, max hit dice, initiative, and skills, as well as a hit die increment flag and conditional effects.

#### Scenario: Human ancestry modifiers
- **WHEN** the modifier map is queried for ancestry ID `"human"`
- **THEN** it returns `{ initiative: 1, skills: { all: 1 } }`

#### Scenario: Dwarf ancestry modifiers
- **WHEN** the modifier map is queried for ancestry ID `"dwarf"`
- **THEN** it returns `{ speed: -1, maxWounds: 1, maxHitDice: 2 }`

#### Scenario: Elf ancestry modifiers
- **WHEN** the modifier map is queried for ancestry ID `"elf"`
- **THEN** it returns `{ speed: 1 }` with a conditional `{ field: "initiative", description: "Advantage on Initiative" }`

#### Scenario: Turtlefolk ancestry modifiers
- **WHEN** the modifier map is queried for ancestry ID `"turtlefolk"`
- **THEN** it returns `{ speed: -2, armor: 4 }`

#### Scenario: Oozeling ancestry modifiers
- **WHEN** the modifier map is queried for ancestry ID `"oozeling-construct"`
- **THEN** it returns `{ hitDieIncrement: true }`

#### Scenario: Ancestry with no numeric modifiers
- **WHEN** the modifier map is queried for an ancestry with only narrative traits (e.g., `"bunbun"`)
- **THEN** it returns an empty modifiers object

### Requirement: Background modifiers are defined as structured data
The system SHALL provide a TypeScript map keyed by background ID that encodes all numeric sheet modifiers for each background. Backgrounds with only narrative effects SHALL have empty modifier entries.

#### Scenario: Fearless background modifiers
- **WHEN** the modifier map is queried for background ID `"fearless"`
- **THEN** it returns `{ armor: -1, initiative: 1 }`

#### Scenario: Wild One background modifiers
- **WHEN** the modifier map is queried for background ID `"wild-one"`
- **THEN** it returns `{ skills: { naturecraft: 1 } }`

#### Scenario: Survivalist background modifiers
- **WHEN** the modifier map is queried for background ID `"survivalist"`
- **THEN** it returns `{ maxHitDice: 1 }`

#### Scenario: Back Out of Retirement background modifiers
- **WHEN** the modifier map is queried for background ID `"back-out-of-retirement"`
- **THEN** it returns `{ maxWounds: -1 }`

#### Scenario: Background with no numeric modifiers
- **WHEN** the modifier map is queried for a background with only narrative effects (e.g., `"acrobat"`)
- **THEN** it returns an empty modifiers object

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
The system SHALL provide pure functions that accept the `CreatorDraft` and resolved core data (classes, ancestries, backgrounds, skills, gear, languages) and return a fully computed sheet data object. Computation SHALL apply flat ancestry and background modifiers to base values.

#### Scenario: Final skill score computation
- **WHEN** a Human Berserker has stats STR +2, DEX +2, INT +0, WIL -1 and allocates 2 points to Might
- **THEN** the computed Might score is +5 (STR +2 + allocated 2 + Human +1 to all skills)

#### Scenario: Speed computation with ancestry modifier
- **WHEN** a Dwarf character is created
- **THEN** the computed speed is 5 (base 6 + Dwarf -1)

#### Scenario: Max wounds computation with ancestry modifier
- **WHEN** a Dwarf character is created
- **THEN** the computed max wounds is 7 (base 6 + Dwarf +1)

#### Scenario: Initiative computation with ancestry modifier
- **WHEN** a Human character has DEX +2
- **THEN** the computed initiative is +3 (DEX +2 + Human +1)

#### Scenario: Inventory slots computation
- **WHEN** a character has STR +2
- **THEN** the computed inventory slots is 12 (10 + STR 2)

#### Scenario: Hit die increment for Oozeling
- **WHEN** an Oozeling character has a class with hit die d6
- **THEN** the computed hit die size is d8 (incremented one step)

#### Scenario: Armor computation from equipment
- **WHEN** a character has equipped armor with value `"3+DEX"` and DEX +2
- **THEN** the computed armor is 5 (3 + DEX 2)

#### Scenario: Armor computation with max DEX cap
- **WHEN** a character has equipped armor with value `"6+DEX (max 2)"` and DEX +3
- **THEN** the computed armor is 8 (6 + min(DEX 3, max 2) = 6 + 2)

#### Scenario: Gold amount when gold is chosen
- **WHEN** a character's equipment choice is `"gold"`
- **THEN** the computed gold value is 50

#### Scenario: Languages include Common plus ancestry and selections
- **WHEN** an Elf character with INT +2 selects Goblin and Infernal
- **THEN** the computed languages list is `["Common", "Elvish", "Goblin", "Infernal"]`
