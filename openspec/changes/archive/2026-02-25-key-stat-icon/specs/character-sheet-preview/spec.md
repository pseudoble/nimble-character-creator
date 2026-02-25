## ADDED Requirements

### Requirement: Key stats are decorated with a key icon in the preview
The system SHALL display a 🔑 (U+1F511) icon immediately after each key stat label (STR, DEX, INT, WIL) in the stats section of the character sheet preview. The two key stats are determined by the character's class. The icon is decorative and not interactive.

#### Scenario: Key stats show icon in preview
- **WHEN** a user has selected a class whose key stats are STR and WIL
- **THEN** the STR and WIL stat labels in the preview stats section each display a 🔑 icon
- **AND** the DEX and INT stat labels display no icon

#### Scenario: No key stat icons before class is selected
- **WHEN** the user has not yet selected a class
- **THEN** the stats section (if visible) renders no 🔑 icons on any stat label
