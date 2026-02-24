## MODIFIED Requirements

### Requirement: Step 1 enforces validation rules for required data
The system SHALL validate Step 1 data from `CreatorDraft.characterBasics` and treat the step as invalid when required values are missing or malformed.

#### Scenario: Missing class selection is invalid
- **WHEN** Character Basics has no selected class
- **THEN** Step 1 validation fails

#### Scenario: Blank character name is invalid
- **WHEN** the character name is empty after trimming whitespace
- **THEN** Step 1 validation fails

#### Scenario: Overlong character description is invalid
- **WHEN** the character description exceeds the configured maximum length
- **THEN** Step 1 validation fails

### Requirement: Step 1 validation logic is covered by automated tests
The project SHALL include automated tests for Step 1 validation success and failure paths using the canonical `characterBasics` draft shape.

#### Scenario: Valid Step 1 payload passes tests
- **WHEN** tests evaluate a valid Character Basics payload
- **THEN** validation succeeds

#### Scenario: Invalid Step 1 payloads fail tests
- **WHEN** tests evaluate missing class, blank name, and overlong description inputs
- **THEN** validation fails for each invalid payload
