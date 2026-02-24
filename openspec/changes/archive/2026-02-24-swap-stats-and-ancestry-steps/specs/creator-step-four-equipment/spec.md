## MODIFIED Requirements

### Requirement: Step 4 choice is persisted in draft state
The system SHALL store the equipment choice in the `CreatorDraft` under `stepFour.equipmentChoice` with values `"gear"`, `"gold"`, or `""` (no choice). The system SHALL also store selected bonus languages in `stepFour.selectedLanguages` as a string array.

#### Scenario: Selecting gear updates draft
- **WHEN** the user selects the starting gear option
- **THEN** `draft.stepFour.equipmentChoice` is set to `"gear"`

#### Scenario: Selecting gold updates draft
- **WHEN** the user selects the starting gold option
- **THEN** `draft.stepFour.equipmentChoice` is set to `"gold"`

#### Scenario: Draft persists after refresh
- **WHEN** the user selects an equipment choice and refreshes the page
- **THEN** the previously selected choice is restored
