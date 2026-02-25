## ADDED Requirements

### Requirement: Key stats are decorated with a key icon on the full sheet
The system SHALL display a 🔑 (U+1F511) icon immediately after each key stat label (STR, DEX, INT, WIL) in the stats section of the full character sheet. The two key stats are determined by the character's class. The icon is decorative and not interactive.

#### Scenario: Key stats show icon on full sheet
- **WHEN** a user views the `/sheet` page for a character whose class has key stats STR and WIL
- **THEN** the STR and WIL stat labels each display a 🔑 icon
- **AND** the DEX and INT stat labels display no icon

#### Scenario: All four stats render when none are key stats
- **WHEN** a user views the `/sheet` page for a character with no class selected
- **THEN** all four stat boxes render without a 🔑 icon
