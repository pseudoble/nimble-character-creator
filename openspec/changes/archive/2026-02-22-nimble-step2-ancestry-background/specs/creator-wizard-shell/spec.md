## MODIFIED Requirements

### Requirement: Wizard advancement is gated by active-step validity
The system SHALL prevent forward navigation from the active step until that step passes validation.

#### Scenario: Cannot advance with invalid Step 1
- **WHEN** Step 1 has missing or invalid required data
- **THEN** the user cannot advance to the next step

#### Scenario: Can advance with valid Step 1
- **WHEN** Step 1 satisfies all validation rules
- **THEN** the user can advance from Step 1

#### Scenario: Cannot advance with invalid Step 2
- **WHEN** Step 2 has missing or invalid ancestry/background selections
- **THEN** the user cannot advance from Step 2

#### Scenario: Can advance with valid Step 2
- **WHEN** Step 2 has a valid ancestry and background selected
- **THEN** the user can advance from Step 2

### Requirement: Wizard shell behavior is covered by automated tests
The project SHALL include automated tests for wizard shell progression and draft persistence behavior.

#### Scenario: Navigation gating test coverage
- **WHEN** automated tests run for creator wizard shell behavior
- **THEN** tests verify that forward navigation is blocked for invalid Step 1 and Step 2, and allowed for valid Step 1 and Step 2

#### Scenario: Draft persistence test coverage
- **WHEN** automated tests run for creator draft behavior
- **THEN** tests verify draft save and restore behavior, including invalid persisted payload handling
