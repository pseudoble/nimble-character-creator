## ADDED Requirements

### Requirement: Creator context tracks touched steps
The system SHALL track which steps the user has interacted with via a touched-steps set in the creator context, enabling conditional display of validation indicators.

#### Scenario: Step is marked touched when user navigates away from it
- **WHEN** the user has a step expanded and then opens a different step (via Next button or header click)
- **THEN** the previously expanded step is added to the touched-steps set

#### Scenario: Touched state persists during session
- **WHEN** a step has been marked as touched
- **THEN** it remains touched for the remainder of the session unless Reset All is used

#### Scenario: Reset All clears touched state
- **WHEN** the user clicks "Reset All"
- **THEN** the touched-steps set is cleared to empty

### Requirement: Creator context supports full-form reset
The system SHALL provide a `resetAll` function in the creator context that resets all step data to initial empty values and clears the touched-steps set.

#### Scenario: resetAll clears all steps
- **WHEN** `resetAll` is called
- **THEN** all four steps (stepOne, stepTwo, stepThree, stepFour) are reset to their initial empty values

#### Scenario: resetAll clears touched state
- **WHEN** `resetAll` is called
- **THEN** the touched-steps set is emptied

#### Scenario: resetAll clears validation errors display
- **WHEN** `resetAll` is called
- **THEN** showErrors is set to false

## MODIFIED Requirements

### Requirement: Wizard advancement is gated by active-step validity
The system SHALL allow expanding any accordion section at any time. Navigation is not gated by step validity.

#### Scenario: Can expand Step 2 with invalid Step 1
- **WHEN** Step 1 has missing or invalid required data
- **THEN** the Step 2 accordion section can be expanded

#### Scenario: Can expand Step 3 with invalid Step 2
- **WHEN** Step 2 has missing or invalid ancestry/background selections
- **THEN** the Step 3 accordion section can be expanded

#### Scenario: Can expand Step 4 with invalid Step 3
- **WHEN** Step 3 has invalid stat or skill allocations
- **THEN** the Step 4 accordion section can be expanded

### Requirement: Wizard shell supports resetting the active step
The system SHALL provide per-step "Reset" buttons inside each expanded accordion section and a "Reset All" button below the accordion. The per-step Reset clears data for that step only. The "Reset All" clears all steps and touched state.

#### Scenario: Per-step Reset button clears only that step
- **WHEN** the user clicks the "Reset" button inside an expanded step
- **THEN** only that step's data is cleared, validation errors are removed, and the step remains expanded

#### Scenario: Reset All clears all step data
- **WHEN** the user clicks "Reset All" below the accordion
- **THEN** all four steps are cleared to their initial empty values, touched state is cleared, and validation errors are removed
