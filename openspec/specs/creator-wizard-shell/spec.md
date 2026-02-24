### Requirement: Creator draft is persisted and restored
The system SHALL persist in-progress creator draft data and restore it when the user returns to the flow.

#### Scenario: Draft persists after refresh
- **WHEN** a user enters Step 1 values and refreshes the page
- **THEN** previously entered values are restored into Step 1 fields and the accordion opens to the first incomplete step

#### Scenario: Step 3 draft persists after refresh
- **WHEN** a user enters Step 3 stat assignments and skill allocations, then refreshes the page
- **THEN** the previously entered Step 3 values are restored and the accordion opens to the first incomplete step

#### Scenario: Step 4 draft persists after refresh
- **WHEN** a user selects an equipment choice on Step 4 and refreshes the page
- **THEN** the previously selected equipment choice is restored and the accordion opens to the first incomplete step

#### Scenario: V1 draft is migrated to include Step 4 defaults
- **WHEN** a persisted draft from schema version 1 (without stepFour) is loaded
- **THEN** the draft is backfilled with `stepFour: { equipmentChoice: "" }` and loads without error

#### Scenario: Invalid persisted draft is safely ignored
- **WHEN** persisted draft data is malformed or incompatible with the current draft schema
- **THEN** the flow loads without crashing and starts from a clean draft state

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

### Requirement: Character sheet preview displays in the draft preview panel
The system SHALL render the character sheet preview component in the right-side panel, replacing the former debug JSON view. The preview SHALL update reactively as the user modifies form fields.

#### Scenario: Character sheet preview shown by default
- **WHEN** the user navigates to `/create`
- **THEN** the right-side panel displays the live character sheet preview

#### Scenario: Character sheet preview updates live
- **WHEN** the user modifies any form field
- **THEN** the right-side panel updates immediately to reflect the derived character values

### Requirement: V2 draft is migrated to include language defaults
The system SHALL backfill `selectedLanguages: []` for persisted drafts missing the field.

#### Scenario: V2 draft is migrated to include language defaults
- **WHEN** a persisted draft from schema version 2 (without selectedLanguages) is loaded
- **THEN** the draft is backfilled with `selectedLanguages: []` and loads without error

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

### Requirement: Finish button validates and redirects to sheet page
The system SHALL wire the "Finish" button on the last accordion step to validate all steps and redirect to `/sheet` when all steps are valid.

#### Scenario: Finish with all steps valid
- **WHEN** the user clicks "Finish" and all four steps are valid
- **THEN** the browser navigates to `/sheet`

#### Scenario: Finish with invalid steps
- **WHEN** the user clicks "Finish" and one or more steps are invalid
- **THEN** validation errors are displayed and navigation does not occur

#### Scenario: Finish triggers error display
- **WHEN** the user clicks "Finish"
- **THEN** `showErrors` is set to true so all validation errors across all steps become visible
