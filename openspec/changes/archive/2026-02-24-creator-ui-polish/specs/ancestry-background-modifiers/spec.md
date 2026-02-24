## MODIFIED Requirements

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

## ADDED Requirements

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
