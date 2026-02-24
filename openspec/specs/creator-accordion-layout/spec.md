### Requirement: Creator renders as a two-panel layout with accordion form sidebar and draft preview
The system SHALL render the creator at `/create` as a two-panel layout: a left sidebar containing an accordion of creator steps, and a right main panel displaying a live JSON draft preview. On viewports below the `lg` breakpoint, the layout SHALL stack vertically with the accordion form above the draft preview.

#### Scenario: Two-panel layout on wide screens
- **WHEN** the user navigates to `/create` on a viewport at or above the `lg` breakpoint
- **THEN** the accordion form sidebar is displayed on the left and the draft preview panel is displayed on the right, side by side

#### Scenario: Stacked layout on narrow screens
- **WHEN** the user navigates to `/create` on a viewport below the `lg` breakpoint
- **THEN** the accordion form is displayed above the draft preview in a single column

#### Scenario: Draft preview shows live JSON
- **WHEN** the user modifies any form field in any accordion step
- **THEN** the draft preview panel updates immediately to reflect the current draft state as JSON

### Requirement: Each creator step renders as a collapsible accordion section
The system SHALL render each of the four creator steps (Character Basics, Ancestry & Background, Stats & Skills, Languages & Equipment) as a collapsible accordion section in the form sidebar. Exactly one section SHALL be expanded at a time.

#### Scenario: Steps are rendered as accordion sections
- **WHEN** the creator is displayed
- **THEN** four accordion sections are visible, labeled "Character Basics", "Ancestry & Background", "Stats & Skills", and "Languages & Equipment"

#### Scenario: Only one section is expanded at a time
- **WHEN** the user expands a different accordion section
- **THEN** the previously expanded section collapses and the newly selected section expands

#### Scenario: Expanded section contains the step form
- **WHEN** an accordion section is expanded
- **THEN** the corresponding step form (e.g., StepOneForm for Character Basics) is rendered inside the section

### Requirement: Collapsed accordion sections display a summary of selections
The system SHALL display a one-line summary of the user's selections in each collapsed accordion header when that step has data entered.

#### Scenario: Collapsed Step 1 shows class and name
- **WHEN** the user has entered a class and name in Step 1 and the section is collapsed
- **THEN** the accordion header displays a summary including the selected class name and character name

#### Scenario: Collapsed Step 2 shows ancestry and background
- **WHEN** the user has selected an ancestry and background in Step 2 and the section is collapsed
- **THEN** the accordion header displays a summary including the ancestry name and background name

#### Scenario: Collapsed Step 3 shows stat array
- **WHEN** the user has assigned stats in Step 3 and the section is collapsed
- **THEN** the accordion header displays a summary of the assigned stat values

#### Scenario: Collapsed Step 4 shows equipment choice
- **WHEN** the user has made an equipment choice in Step 4 and the section is collapsed
- **THEN** the accordion header displays a summary of the equipment choice

#### Scenario: Collapsed step with no data shows no summary
- **WHEN** a step has no data entered and the section is collapsed
- **THEN** the accordion header displays the step label without a summary line

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

### Requirement: Form sidebar scrolls independently
The system SHALL use a single page-level scrollbar for the entire creator layout. Neither the form sidebar nor the sheet preview panel SHALL have independent scroll containers or sticky positioning. Both panels SHALL render at their natural height and the page SHALL scroll as a single document.

#### Scenario: Page scrolls as single document on wide screens
- **WHEN** the accordion content or sheet preview exceeds the viewport height on a viewport at or above the `lg` breakpoint
- **THEN** the browser's page-level scrollbar handles overflow and neither panel has its own scrollbar

#### Scenario: Page scrolls as single document on narrow screens
- **WHEN** the stacked layout content exceeds the viewport height on a viewport below the `lg` breakpoint
- **THEN** the browser's page-level scrollbar handles overflow (unchanged from current mobile behavior)

### Requirement: Reset button clears the active accordion step
The system SHALL provide a "Reset All" button below the accordion that clears data for all steps and resets touched state. Individual step reset is handled by per-step Reset buttons inside each accordion section.

#### Scenario: Reset All clears all step data
- **WHEN** the user clicks "Reset All" below the accordion
- **THEN** all four steps are cleared to their initial empty state

#### Scenario: Per-step reset is inside accordion section
- **WHEN** a step is expanded
- **THEN** a Reset button specific to that step is available inside the section content

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
