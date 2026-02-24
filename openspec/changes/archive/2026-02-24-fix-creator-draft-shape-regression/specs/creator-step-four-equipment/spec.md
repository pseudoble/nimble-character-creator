## MODIFIED Requirements

### Requirement: Step 4 choice is persisted in draft state
The system SHALL store the equipment choice in the `CreatorDraft` under `languagesEquipment.equipmentChoice` with values `"gear"`, `"gold"`, or `""` (no choice). The system SHALL also store selected bonus languages in `languagesEquipment.selectedLanguages` as a string array.

#### Scenario: Selecting gear updates draft
- **WHEN** the user selects the starting gear option
- **THEN** `draft.languagesEquipment.equipmentChoice` is set to `"gear"`

#### Scenario: Selecting gold updates draft
- **WHEN** the user selects the starting gold option
- **THEN** `draft.languagesEquipment.equipmentChoice` is set to `"gold"`

#### Scenario: Legacy stepFour field is migrated
- **WHEN** a persisted draft includes `stepFour` and omits `languagesEquipment`
- **THEN** `stepFour` is migrated to `languagesEquipment` before the draft is restored

#### Scenario: Draft persists after refresh
- **WHEN** the user selects an equipment choice and refreshes the page
- **THEN** the previously selected choice is restored

### Requirement: Step 4 validates that a choice has been made
The system SHALL treat Step 4 as invalid when no equipment choice has been made OR when language selection is incomplete, preventing wizard advancement.

#### Scenario: No choice is invalid
- **WHEN** `languagesEquipment.equipmentChoice` is `""`
- **THEN** Step 4 validation fails

#### Scenario: Gear choice with complete languages is valid
- **WHEN** `languagesEquipment.equipmentChoice` is `"gear"` and language selection is complete
- **THEN** Step 4 validation succeeds

#### Scenario: Gold choice with complete languages is valid
- **WHEN** `languagesEquipment.equipmentChoice` is `"gold"` and language selection is complete
- **THEN** Step 4 validation succeeds
