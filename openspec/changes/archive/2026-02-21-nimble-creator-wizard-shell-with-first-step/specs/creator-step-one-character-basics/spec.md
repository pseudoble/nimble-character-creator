## ADDED Requirements

### Requirement: Step 1 collects class, character name, and description
The system SHALL provide Step 1 inputs for class selection, character name, and character description in the `/create` flow.

#### Scenario: Step 1 fields are present
- **WHEN** Step 1 is rendered
- **THEN** users can interact with a class selector, a character name input, and a character description input

#### Scenario: Class options are sourced from core creator data
- **WHEN** Step 1 class selection is displayed
- **THEN** selectable classes correspond to valid class entries from core data

### Requirement: Step 1 enforces validation rules for required data
The system SHALL validate Step 1 data and treat the step as invalid when required values are missing or malformed.

#### Scenario: Missing class selection is invalid
- **WHEN** Step 1 has no selected class
- **THEN** Step 1 validation fails

#### Scenario: Blank character name is invalid
- **WHEN** the character name is empty after trimming whitespace
- **THEN** Step 1 validation fails

#### Scenario: Overlong character description is invalid
- **WHEN** the character description exceeds the configured maximum length
- **THEN** Step 1 validation fails

### Requirement: Step 1 validation feedback is actionable
The system SHALL expose validation feedback so users can identify and correct invalid Step 1 fields.

#### Scenario: Field-level feedback appears for invalid fields
- **WHEN** Step 1 validation fails
- **THEN** validation output identifies which field constraints are violated

#### Scenario: Validation feedback clears after correction
- **WHEN** a user corrects previously invalid Step 1 input
- **THEN** validation output no longer marks that field as invalid

### Requirement: Step 1 validation logic is covered by automated tests
The project SHALL include automated tests for Step 1 validation success and failure paths.

#### Scenario: Valid Step 1 payload passes tests
- **WHEN** tests evaluate a valid Step 1 payload
- **THEN** validation succeeds

#### Scenario: Invalid Step 1 payloads fail tests
- **WHEN** tests evaluate missing class, blank name, and overlong description inputs
- **THEN** validation fails for each invalid payload
