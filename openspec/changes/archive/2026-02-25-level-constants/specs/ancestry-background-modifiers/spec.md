## MODIFIED Requirements

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

#### Scenario: Hit dice count at level 1 with no modifiers
- **WHEN** a level 1 character has no ancestry or background that modifies max hit dice
- **THEN** the computed hit dice count is 1 (CHARACTER_LEVEL)

#### Scenario: Hit dice count at level 1 with ancestry and background modifiers
- **WHEN** a level 1 Dwarf character with the Survivalist background is created
- **THEN** the computed hit dice count is 4 (CHARACTER_LEVEL 1 + Dwarf +2 + Survivalist +1)

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
