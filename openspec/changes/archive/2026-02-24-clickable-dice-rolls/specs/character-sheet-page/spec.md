## ADDED Requirements

### Requirement: Stat modifier values are clickable on the full sheet
The system SHALL render stat modifier values (STR, DEX, INT, WIL) as clickable elements on the `/sheet` page that trigger a `1d20+X` dice roll where X is the stat modifier.

#### Scenario: Clicking a stat modifier triggers a roll
- **WHEN** a user clicks a stat modifier value (e.g., "+2") on the full character sheet
- **THEN** the system triggers a dice roll of `1d20+X` where X is that stat's modifier value
- **AND** the roll is labeled with the stat name (e.g., "STR Check")

#### Scenario: Stat values are not clickable in preview variant
- **WHEN** the character sheet renders in `preview` variant
- **THEN** stat modifier values render as plain text with no click behavior

### Requirement: Skill total values are clickable on the full sheet
The system SHALL render skill total modifier values as clickable elements on the `/sheet` page that trigger a `1d20+X` dice roll where X is the skill total.

#### Scenario: Clicking a skill total triggers a roll
- **WHEN** a user clicks a skill total value (e.g., "+3") on the full character sheet
- **THEN** the system triggers a dice roll of `1d20+X` where X is that skill's total modifier
- **AND** the roll is labeled with the skill name (e.g., "Stealth")

#### Scenario: Skill values are not clickable in preview variant
- **WHEN** the character sheet renders in `preview` variant
- **THEN** skill total values render as plain text with no click behavior

### Requirement: Clickable modifiers have visual affordance
The system SHALL visually indicate that stat and skill modifier values are clickable on the full sheet.

#### Scenario: Hover state on clickable modifier
- **WHEN** a user hovers over a clickable stat or skill modifier on the full sheet
- **THEN** the value displays a visual hover state (e.g., cursor change, highlight) indicating it is interactive
