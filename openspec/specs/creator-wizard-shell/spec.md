## Requirements

### Requirement: `/create` provides a wizard shell with step navigation
The system SHALL expose a `/create` route that renders a creator wizard shell with ordered step navigation and an active step content region, styled with the cyberpunk design system.

#### Scenario: User opens creator flow
- **WHEN** a user navigates to `/create`
- **THEN** the page renders the wizard shell with Step 1 as the active step, displayed as a centered card on the dark application background

#### Scenario: Step navigation state is visible
- **WHEN** the wizard shell is displayed
- **THEN** users can see the ordered step list with the active step highlighted using the primary accent color and monospace step labels

### Requirement: Wizard shell displays progress state
The system SHALL display progress UI for the creator flow showing current step position and completion state, using accent colors and glow to indicate active and completed steps.

#### Scenario: Initial progress state
- **WHEN** a user first opens `/create` with an empty draft
- **THEN** the active step indicator uses the primary accent color with glow, and later steps appear dimmed

#### Scenario: Progress updates after valid completion
- **WHEN** the active step satisfies its validation rules
- **THEN** the completed step indicator shows a checkmark and the accent color transitions to indicate completion

### Requirement: Creator draft is persisted and restored
The system SHALL persist in-progress creator draft data and restore it when the user returns to the flow.

#### Scenario: Draft persists after refresh
- **WHEN** a user enters Step 1 values and refreshes `/create`
- **THEN** previously entered values are restored into Step 1 fields

#### Scenario: Invalid persisted draft is safely ignored
- **WHEN** persisted draft data is malformed or incompatible with the current draft schema
- **THEN** the flow loads without crashing and starts from a clean draft state

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

### Requirement: Wizard advance button uses the Button primitive
The system SHALL render the wizard's advance/finish action using the styled Button primitive from the UI primitives capability.

#### Scenario: Advance button renders with primary styling
- **WHEN** the wizard shell displays the advance button
- **THEN** it renders as a styled Button with primary accent appearance and glow on hover

### Requirement: Wizard shell behavior is covered by automated tests
The project SHALL include automated tests for wizard shell progression and draft persistence behavior.

#### Scenario: Navigation gating test coverage
- **WHEN** automated tests run for creator wizard shell behavior
- **THEN** tests verify that forward navigation is blocked for invalid Step 1 and Step 2, and allowed for valid Step 1 and Step 2

#### Scenario: Draft persistence test coverage
- **WHEN** automated tests run for creator draft behavior
- **THEN** tests verify draft save and restore behavior, including invalid persisted payload handling
