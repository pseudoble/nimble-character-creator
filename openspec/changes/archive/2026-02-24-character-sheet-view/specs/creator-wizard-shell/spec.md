## MODIFIED Requirements

### Requirement: Debug panel displays in the draft preview panel
The system SHALL render the character sheet preview component in the right-side panel, replacing the former debug JSON view. The preview SHALL update reactively as the user modifies form fields.

#### Scenario: Character sheet preview shown by default
- **WHEN** the user navigates to `/create`
- **THEN** the right-side panel displays the live character sheet preview

#### Scenario: Character sheet preview updates live
- **WHEN** the user modifies any form field
- **THEN** the right-side panel updates immediately to reflect the derived character values

## ADDED Requirements

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
