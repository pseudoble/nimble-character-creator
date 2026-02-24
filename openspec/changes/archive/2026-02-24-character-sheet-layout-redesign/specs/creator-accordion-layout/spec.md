## ADDED Requirements

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
The system SHALL prevent expanding accordion sections whose prerequisite steps have not passed validation. Locked sections SHALL be visually distinct from unlocked sections.

#### Scenario: Step 2 is locked when Step 1 is invalid
- **WHEN** Step 1 has not passed validation
- **THEN** the Step 2 accordion section cannot be expanded and appears visually locked

#### Scenario: Step 3 is locked when Step 2 is invalid
- **WHEN** Step 2 has not passed validation
- **THEN** the Step 3 accordion section cannot be expanded and appears visually locked

#### Scenario: Step 4 is locked when Step 3 is invalid
- **WHEN** Step 3 has not passed validation
- **THEN** the Step 4 accordion section cannot be expanded and appears visually locked

#### Scenario: Completed steps can be reopened
- **WHEN** a step has passed validation and is collapsed
- **THEN** the user can click the accordion header to expand and edit that step

### Requirement: Completing a step auto-advances to the next step
The system SHALL automatically collapse the current accordion section and expand the next incomplete section when the current step's validation transitions to valid.

#### Scenario: Completing Step 1 opens Step 2
- **WHEN** the user completes all required fields in Step 1 and the step becomes valid
- **THEN** Step 1 collapses and Step 2 expands automatically

#### Scenario: Completing Step 3 opens Step 4
- **WHEN** the user completes all required fields in Step 3 and the step becomes valid
- **THEN** Step 3 collapses and Step 4 expands automatically

#### Scenario: Completing the last step does not auto-advance
- **WHEN** the user completes all required fields in Step 4 and the step becomes valid
- **THEN** Step 4 remains expanded (there is no next step)

#### Scenario: Manually opened steps are not auto-collapsed
- **WHEN** the user has manually clicked to open a previously completed step and is editing it
- **THEN** the step is not auto-collapsed by another step becoming valid

### Requirement: Form sidebar scrolls independently
The system SHALL allow the form sidebar to scroll independently of the draft preview panel when the accordion content exceeds the viewport height.

#### Scenario: Long form step scrolls within sidebar
- **WHEN** the expanded accordion section (e.g., Stats & Skills) exceeds the viewport height
- **THEN** the form sidebar scrolls vertically while the draft preview panel remains in its position

### Requirement: Reset button clears the active accordion step
The system SHALL provide a Reset button within or below the accordion that clears data for the currently expanded step.

#### Scenario: Reset clears expanded step data
- **WHEN** the user clicks Reset while Step 3 is expanded
- **THEN** Step 3 data is cleared and Steps 1, 2, and 4 data remain intact
