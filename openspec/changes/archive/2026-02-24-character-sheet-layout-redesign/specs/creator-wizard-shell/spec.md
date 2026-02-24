## REMOVED Requirements

### Requirement: `/create` provides a wizard shell with step navigation
**Reason**: Replaced by accordion-based layout in `creator-accordion-layout`. The horizontal breadcrumb step nav and Back/Next button navigation are removed in favor of collapsible accordion sections.
**Migration**: Accordion sections with locking replace the step navigation. Step indicators, validation gating, and reset are handled by the accordion layout.

### Requirement: URL-based step navigation
**Reason**: The creator is now a single-page accordion at `/create`. Individual step URLs (`/create/character-basics`, etc.) are removed.
**Migration**: All creator functionality is accessed at `/create`. No deep links to individual steps.

### Requirement: Incomplete step redirection
**Reason**: With all steps visible as accordion sections on one page, redirect logic is unnecessary. Accordion locking prevents accessing future steps.
**Migration**: Accordion locking in `creator-accordion-layout` replaces redirect-based gating.

### Requirement: Wizard shell supports backward step navigation
**Reason**: Back button is unnecessary when all steps are visible as accordion sections. Users click any unlocked section to navigate.
**Migration**: Click accordion headers to navigate between steps.

### Requirement: Wizard shell behavior is covered by automated tests
**Reason**: Test coverage requirements are redefined for the new accordion-based layout.
**Migration**: New test scenarios are defined in `creator-accordion-layout` spec.

## MODIFIED Requirements

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
The system SHALL prevent expanding accordion sections for steps whose prerequisites have not passed validation.

#### Scenario: Cannot expand Step 2 with invalid Step 1
- **WHEN** Step 1 has missing or invalid required data
- **THEN** the Step 2 accordion section is locked and cannot be expanded

#### Scenario: Can expand Step 2 with valid Step 1
- **WHEN** Step 1 satisfies all validation rules
- **THEN** the Step 2 accordion section is unlocked and can be expanded

#### Scenario: Cannot expand Step 3 with invalid Step 2
- **WHEN** Step 2 has missing or invalid ancestry/background selections
- **THEN** the Step 3 accordion section is locked and cannot be expanded

#### Scenario: Can expand Step 3 with valid Step 2
- **WHEN** Step 2 has a valid ancestry and background selected
- **THEN** the Step 3 accordion section is unlocked and can be expanded

#### Scenario: Cannot expand Step 4 with invalid Step 3
- **WHEN** Step 3 has invalid stat or skill allocations
- **THEN** the Step 4 accordion section is locked and cannot be expanded

#### Scenario: Can expand Step 4 with valid Step 3
- **WHEN** Step 3 satisfies all validation rules
- **THEN** the Step 4 accordion section is unlocked and can be expanded

### Requirement: Wizard shell supports resetting the active step
The system SHALL provide a "Reset" button that clears all user-entered data for the currently expanded accordion step without affecting data on any other steps.

#### Scenario: Reset button clears Step 1 data
- **WHEN** the user has Step 1 expanded with entered data and clicks the "Reset" button
- **THEN** all fields on Step 1 are cleared, validation errors are removed, and Step 1 remains expanded

#### Scenario: Reset button clears Step 2 data
- **WHEN** the user has Step 2 expanded with selected ancestry and background and clicks the "Reset" button
- **THEN** the ancestry and background selections are cleared, and Step 1 data remains intact

#### Scenario: Reset button clears Step 3 data
- **WHEN** the user has Step 3 expanded with allocated stats and skills and clicks the "Reset" button
- **THEN** all stat and skill allocations are returned to their initial state, and Step 1 and Step 2 data remain intact

#### Scenario: Reset button clears Step 4 data
- **WHEN** the user has Step 4 expanded with a selected equipment choice and language selections, and clicks the "Reset" button
- **THEN** the equipment choice and language selections are cleared, and Steps 1-3 data remain intact

### Requirement: Debug panel displays in the draft preview panel
The system SHALL render the debug panel (JSON draft view) in the right-side draft preview panel, always visible without requiring a query parameter.

#### Scenario: Debug panel shown by default
- **WHEN** the user navigates to `/create`
- **THEN** the draft preview panel on the right displays the full draft JSON

#### Scenario: Debug panel updates live
- **WHEN** the user modifies any form field
- **THEN** the draft preview panel updates immediately to reflect the change

### Requirement: V2 draft is migrated to include language defaults
The system SHALL backfill `selectedLanguages: []` for persisted drafts missing the field.

#### Scenario: V2 draft is migrated to include language defaults
- **WHEN** a persisted draft from schema version 2 (without selectedLanguages) is loaded
- **THEN** the draft is backfilled with `selectedLanguages: []` and loads without error
