## MODIFIED Requirements

### Requirement: `/create` provides a wizard shell with step navigation
The system SHALL expose a `/create` route that renders a creator wizard shell with ordered step navigation and an active step content region, styled with the cyberpunk design system.

#### Scenario: User opens creator flow
- **WHEN** a user navigates to `/create`
- **THEN** the user is redirected to the first incomplete step (defaulting to `/create/character-basics`)

#### Scenario: Step navigation state is visible
- **WHEN** the wizard shell is displayed
- **THEN** users can see the ordered step list with the active step highlighted using the primary accent color and monospace step labels

#### Scenario: Step navigation includes Step 3
- **WHEN** the wizard shell is displayed
- **THEN** the ordered step list includes Step 1 (Character Basics), Step 2 (Ancestry & Background), and Step 3 (Stats & Skills)

#### Scenario: Step navigation indicators are clickable
- **WHEN** the user is on Step 2 or Step 3 and clicks the Step 1 indicator
- **THEN** the wizard navigates to `/create/character-basics`

#### Scenario: Step navigation indicators prevent skipping
- **WHEN** the user is on Step 1 and attempts to click Step 3
- **THEN** navigation is blocked if Step 2 is not complete, or if Step 1 is invalid (depending on validation rules)

### Requirement: Creator draft is persisted and restored
The system SHALL persist in-progress creator draft data and restore it when the user returns to the flow.

#### Scenario: Draft persists after refresh
- **WHEN** a user enters Step 1 values and refreshes the page
- **THEN** previously entered values are restored into Step 1 fields and the user remains on the same step

#### Scenario: Step 3 draft persists after refresh
- **WHEN** a user enters Step 3 stat assignments and skill allocations, then refreshes the page
- **THEN** the previously entered Step 3 values are restored and the user remains on Step 3

#### Scenario: Invalid persisted draft is safely ignored
- **WHEN** persisted draft data is malformed or incompatible with the current draft schema
- **THEN** the flow loads without crashing and starts from a clean draft state

### Requirement: Wizard advancement is gated by active-step validity
The system SHALL prevent forward navigation from the active step until that step passes validation, including step-specific constraints such as per-field maximum allocation rules.

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

#### Scenario: Cannot advance when active step violates max-allocation constraints
- **WHEN** the active step data exceeds any configured per-field maximum value
- **THEN** the user cannot advance until the offending values are corrected

#### Scenario: Cannot finish with invalid Step 3
- **WHEN** Step 3 has missing or invalid stat assignments or skill allocation totals
- **THEN** the user cannot finish from Step 3

#### Scenario: Can finish with valid Step 3
- **WHEN** Step 3 satisfies all Step 3 validation rules
- **THEN** the user can complete the wizard from Step 3

### Requirement: Wizard shell supports backward step navigation
The system SHALL provide a back button that navigates to the previous step in the wizard, allowing users to revisit and modify earlier selections.

#### Scenario: Back button is not shown on Step 1
- **WHEN** the user is on Step 1 (Character Basics)
- **THEN** no back button is rendered in the wizard footer

#### Scenario: Back button is shown on Step 2
- **WHEN** the user is on Step 2 (Ancestry & Background)
- **THEN** a back button labeled "Back" is rendered in the wizard footer

#### Scenario: Back button is shown on Step 3
- **WHEN** the user is on Step 3 (Stats & Skills)
- **THEN** a back button labeled "Back" is rendered in the wizard footer

#### Scenario: Clicking back navigates from Step 3 to Step 2
- **WHEN** the user is on Step 3 and clicks the back button
- **THEN** the wizard navigates to `/create/ancestry-background` (Step 2) and displays previously entered Step 2 data

#### Scenario: Back navigation is not gated by validation
- **WHEN** the user is on Step 3 with invalid or incomplete data
- **THEN** the back button is still clickable and navigates to the previous step

#### Scenario: Back navigation resets error display
- **WHEN** the user navigates back from Step 3
- **THEN** validation errors are not shown on the previous step until the user attempts to advance again

### Requirement: Wizard shell behavior is covered by automated tests
The project SHALL include automated tests for wizard shell progression, backward navigation, and draft persistence behavior.

#### Scenario: Navigation gating test coverage
- **WHEN** automated tests run for creator wizard shell behavior
- **THEN** tests verify that forward navigation is blocked for invalid Step 1 and Step 2, and finishing is blocked for invalid Step 3

#### Scenario: Draft persistence test coverage
- **WHEN** automated tests run for creator draft behavior
- **THEN** tests verify draft save and restore behavior for Step 1 through Step 3, including invalid persisted payload handling

#### Scenario: Back navigation test coverage
- **WHEN** automated tests run for creator wizard shell behavior
- **THEN** tests verify that back navigation works from Step 3 to Step 2 and from Step 2 to Step 1, preserves draft data, and is not blocked by validation state

## ADDED Requirements

### Requirement: URL-based step navigation
The wizard SHALL utilize distinct URL paths for each step, ensuring the browser address bar reflects the current step and enables history navigation.

#### Scenario: Step 1 URL
- **WHEN** the user is on Step 1
- **THEN** the URL path is `/create/character-basics`

#### Scenario: Step 2 URL
- **WHEN** the user is on Step 2
- **THEN** the URL path is `/create/ancestry-background`

#### Scenario: Step 3 URL
- **WHEN** the user is on Step 3
- **THEN** the URL path is `/create/stats-skills`

### Requirement: Incomplete step redirection
The system SHALL prevent direct navigation to future steps if prior steps are incomplete, redirecting the user to the first incomplete step.

#### Scenario: Attempting to skip Step 1
- **WHEN** a user with a fresh session navigates directly to `/create/stats-skills`
- **THEN** they are redirected to `/create/character-basics`

#### Scenario: Attempting to skip Step 2
- **WHEN** a user who has completed Step 1 but not Step 2 navigates directly to `/create/stats-skills`
- **THEN** they are redirected to `/create/ancestry-background`
