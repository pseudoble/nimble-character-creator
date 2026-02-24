## ADDED Requirements

### Requirement: Sheet preview derivation uses canonical creator draft fields
The system SHALL compute character sheet preview values from the canonical creator draft fields `characterBasics` and `languagesEquipment`. Persisted legacy draft shapes SHALL be migrated before derivation so preview rendering remains stable.

#### Scenario: Canonical fields drive Step 1 derivation
- **WHEN** a draft includes `characterBasics.classId` and `characterBasics.name`
- **THEN** class-based and header-derived preview values are computed without requiring `stepOne`

#### Scenario: Canonical fields drive Step 4 derivation
- **WHEN** a draft includes `languagesEquipment.equipmentChoice` and `languagesEquipment.selectedLanguages`
- **THEN** equipment, gold, and language preview values are computed without requiring `stepFour`

#### Scenario: Legacy persisted shape still renders preview after migration
- **WHEN** a persisted draft contains legacy `stepOne` and `stepFour` keys
- **THEN** migration maps those values to `characterBasics` and `languagesEquipment` before preview derivation executes
