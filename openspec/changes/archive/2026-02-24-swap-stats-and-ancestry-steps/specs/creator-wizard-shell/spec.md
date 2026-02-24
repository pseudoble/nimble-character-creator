## MODIFIED Requirements

### Requirement: Wizard advancement is gated by active-step validity
The system SHALL allow expanding any accordion section at any time. Navigation is not gated by step validity.

#### Scenario: Can expand Stats & Skills with invalid Character Basics
- **WHEN** Character Basics has missing or invalid required data
- **THEN** the Stats & Skills accordion section can be expanded

#### Scenario: Can expand Ancestry & Background with invalid Stats & Skills
- **WHEN** Stats & Skills has invalid stat or skill allocations
- **THEN** the Ancestry & Background accordion section can be expanded

#### Scenario: Can expand Languages & Equipment with invalid Ancestry & Background
- **WHEN** Ancestry & Background has missing or invalid ancestry/background selections
- **THEN** the Languages & Equipment accordion section can be expanded

### Requirement: Creator context supports full-form reset
The system SHALL provide a `resetAll` function in the creator context that resets all step data to initial empty values and clears the touched-steps set.

#### Scenario: resetAll clears all steps
- **WHEN** `resetAll` is called
- **THEN** all four steps (stepOne, statsSkills, ancestryBackground, stepFour) are reset to their initial empty values

#### Scenario: resetAll clears touched state
- **WHEN** `resetAll` is called
- **THEN** the touched-steps set is emptied

#### Scenario: resetAll clears validation errors display
- **WHEN** `resetAll` is called
- **THEN** showErrors is set to false

### Requirement: Creator draft is persisted and restored
The system SHALL persist in-progress creator draft data and restore it when the user returns to the flow.

#### Scenario: Draft persists after refresh
- **WHEN** a user enters Step 1 values and refreshes the page
- **THEN** previously entered values are restored into Step 1 fields and the accordion opens to the first incomplete step

#### Scenario: Stats & Skills draft persists after refresh
- **WHEN** a user enters stats assignments and skill allocations, then refreshes the page
- **THEN** the previously entered values are restored and the accordion opens to the first incomplete step

#### Scenario: Languages & Equipment draft persists after refresh
- **WHEN** a user selects an equipment choice on Languages & Equipment and refreshes the page
- **THEN** the previously selected equipment choice is restored and the accordion opens to the first incomplete step

#### Scenario: V3 draft is migrated to use semantic field names
- **WHEN** a persisted draft from schema version 3 (with `stepTwo`/`stepThree` fields) is loaded
- **THEN** the draft is migrated so `stepTwo` maps to `ancestryBackground` and `stepThree` maps to `statsSkills`, and the draft loads without error

#### Scenario: Invalid persisted draft is safely ignored
- **WHEN** persisted draft data is malformed or incompatible with the current draft schema
- **THEN** the flow loads without crashing and starts from a clean draft state

## RENAMED Requirements

### Requirement: V1 draft is migrated to include Step 4 defaults
- **FROM:** V1 draft is migrated to include Step 4 defaults
- **TO:** V1 draft is migrated to include equipment defaults

### Requirement: V2 draft is migrated to include language defaults
- **FROM:** V2 draft is migrated to include language defaults
- **TO:** V2 draft is migrated to include language defaults
