## MODIFIED Requirements

### Requirement: Creator context supports full-form reset
The system SHALL provide a `resetAll` function in the creator context that resets all step data to initial empty values and clears the touched-steps set.

#### Scenario: resetAll clears all steps
- **WHEN** `resetAll` is called
- **THEN** all four step data groups (`characterBasics`, `statsSkills`, `ancestryBackground`, `languagesEquipment`) are reset to their initial empty values

#### Scenario: resetAll clears touched state
- **WHEN** `resetAll` is called
- **THEN** the touched-steps set is emptied

#### Scenario: resetAll clears validation errors display
- **WHEN** `resetAll` is called
- **THEN** showErrors is set to false

### Requirement: Creator draft is persisted and restored
The system SHALL persist in-progress creator draft data and restore it when the user returns to the flow, using semantic draft field names while preserving compatibility with older persisted shapes.

#### Scenario: Draft persists after refresh
- **WHEN** a user enters Character Basics values and refreshes the page
- **THEN** previously entered values are restored into Character Basics fields and the accordion opens to the first incomplete step

#### Scenario: Stats & Skills draft persists after refresh
- **WHEN** a user enters stats assignments and skill allocations, then refreshes the page
- **THEN** the previously entered values are restored and the accordion opens to the first incomplete step

#### Scenario: Languages & Equipment draft persists after refresh
- **WHEN** a user selects languages or equipment choices on Languages & Equipment and refreshes the page
- **THEN** the previously selected values are restored and the accordion opens to the first incomplete step

#### Scenario: Legacy stepOne field is migrated
- **WHEN** a persisted draft includes `stepOne` and omits `characterBasics`
- **THEN** the draft is migrated so `stepOne` maps to `characterBasics` and loads without error

#### Scenario: Legacy stepFour field is migrated
- **WHEN** a persisted draft includes `stepFour` and omits `languagesEquipment`
- **THEN** the draft is migrated so `stepFour` maps to `languagesEquipment` and loads without error

#### Scenario: V3 draft is migrated to use semantic field names
- **WHEN** a persisted draft from schema version 3 (with `stepTwo`/`stepThree` fields) is loaded
- **THEN** the draft is migrated so `stepTwo` maps to `ancestryBackground` and `stepThree` maps to `statsSkills`, and the draft loads without error

#### Scenario: Invalid persisted draft is safely ignored
- **WHEN** persisted draft data is malformed or incompatible with the current draft schema
- **THEN** the flow loads without crashing and starts from a clean draft state
