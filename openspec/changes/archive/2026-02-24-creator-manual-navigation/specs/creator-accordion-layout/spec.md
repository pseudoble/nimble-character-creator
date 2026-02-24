## ADDED Requirements

### Requirement: Each expanded accordion section contains per-step action buttons
The system SHALL render a button row at the bottom of each expanded accordion section containing a Reset button and a navigation button.

#### Scenario: Steps 1-3 show Reset and Next buttons
- **WHEN** any of Steps 1, 2, or 3 is expanded
- **THEN** a button row is displayed at the bottom of the section with a "Reset" button on the left and a "Next" button on the right

#### Scenario: Step 4 shows Reset and Finish buttons
- **WHEN** Step 4 is expanded
- **THEN** a button row is displayed at the bottom of the section with a "Reset" button on the left and a "Finish" button on the right

#### Scenario: Per-step Reset clears only that step
- **WHEN** the user clicks the "Reset" button inside an expanded step
- **THEN** only that step's data is cleared and all other steps remain intact

#### Scenario: Next button advances to the next step
- **WHEN** the user clicks "Next" inside an expanded step
- **THEN** the current step collapses and the next step expands, regardless of the current step's validation state

#### Scenario: Next marks the current step as touched
- **WHEN** the user clicks "Next" inside an expanded step
- **THEN** the current step is marked as touched for the purposes of validation indicators

### Requirement: Accordion headers display three visual states
The system SHALL display each accordion section header in one of three visual states based on completion and interaction status: untouched, complete, or needs-attention.

#### Scenario: Untouched step shows step number
- **WHEN** a step has not been touched (user has not visited or navigated past it) and is not valid
- **THEN** the accordion header displays the step number with neutral styling

#### Scenario: Complete step shows checkmark
- **WHEN** a step passes validation
- **THEN** the accordion header displays a checkmark icon with success styling

#### Scenario: Needs-attention step shows warning indicator
- **WHEN** a step has been touched but does not pass validation
- **THEN** the accordion header displays a warning icon with a tooltip describing what is missing, and the header uses a warning visual style

#### Scenario: Step becomes touched when user navigates away
- **WHEN** the user expands a step and then expands a different step
- **THEN** the previously expanded step is marked as touched

### Requirement: Reset All button resets the entire form
The system SHALL provide a "Reset All" button below the accordion that clears all step data and resets all touched state.

#### Scenario: Reset All clears all steps
- **WHEN** the user clicks "Reset All"
- **THEN** all four steps are cleared to their initial empty state and all touched markers are removed

#### Scenario: Reset All resets header indicators
- **WHEN** the user clicks "Reset All" after interacting with multiple steps
- **THEN** all accordion headers return to the untouched state showing step numbers

## MODIFIED Requirements

### Requirement: Accordion sections for incomplete prerequisites are locked
The system SHALL allow expanding any accordion section at any time regardless of whether prerequisite steps have passed validation. All sections SHALL be visually interactive and clickable.

#### Scenario: Step 2 is accessible when Step 1 is invalid
- **WHEN** Step 1 has not passed validation
- **THEN** the Step 2 accordion section can be expanded by clicking its header

#### Scenario: All steps are accessible on initial load
- **WHEN** the creator loads with an empty draft
- **THEN** all four accordion sections are clickable and can be expanded

### Requirement: Completing a step auto-advances to the next step
The system SHALL NOT automatically advance to the next step when the current step's validation transitions to valid. The user SHALL control navigation explicitly via the Next button or by clicking accordion headers.

#### Scenario: Completing Step 1 does not auto-advance
- **WHEN** the user completes all required fields in Step 1 and the step becomes valid
- **THEN** Step 1 remains expanded and no other step is automatically opened

#### Scenario: User advances via Next button
- **WHEN** the user clicks the "Next" button in any step
- **THEN** the current step collapses and the next step expands

#### Scenario: User advances via header click
- **WHEN** the user clicks a different step's accordion header
- **THEN** the current step collapses and the clicked step expands

### Requirement: Reset button clears the active accordion step
The system SHALL provide a "Reset All" button below the accordion that clears data for all steps and resets touched state. Individual step reset is handled by per-step Reset buttons inside each accordion section.

#### Scenario: Reset All clears all step data
- **WHEN** the user clicks "Reset All" below the accordion
- **THEN** all four steps are cleared to their initial empty state

#### Scenario: Per-step reset is inside accordion section
- **WHEN** a step is expanded
- **THEN** a Reset button specific to that step is available inside the section content

## REMOVED Requirements

### Requirement: Accordion sections for incomplete prerequisites are locked
**Reason**: Replaced by open navigation model where all steps are always accessible. Validation status is communicated via header indicators instead of locking.
**Migration**: Remove `isStepLocked` logic and `isLocked` prop from AccordionSection. All sections are always interactive.
