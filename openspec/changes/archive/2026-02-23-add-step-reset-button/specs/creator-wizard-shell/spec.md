## ADDED Requirements

### Requirement: Wizard shell supports resetting the active step
The system SHALL provide a "Reset" button in the wizard shell that clears all user-entered data for the currently active step without affecting data on any other steps.

#### Scenario: Reset button clears Step 1 data
- **WHEN** the user is on Step 1 with entered data and clicks the "Reset" button
- **THEN** all fields on Step 1 are cleared, validation errors are removed, and the user remains on Step 1

#### Scenario: Reset button clears Step 2 data
- **WHEN** the user is on Step 2 with selected ancestry and background and clicks the "Reset" button
- **THEN** the ancestry and background selections are cleared, and Step 1 data remains intact

#### Scenario: Reset button clears Step 3 data
- **WHEN** the user is on Step 3 with allocated stats and skills and clicks the "Reset" button
- **THEN** all stat and skill allocations are returned to their initial state, and Step 1 and Step 2 data remain intact
