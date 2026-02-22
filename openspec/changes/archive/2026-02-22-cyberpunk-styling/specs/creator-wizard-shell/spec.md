## MODIFIED Requirements

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

### Requirement: Wizard advance button uses the Button primitive
The system SHALL render the wizard's advance/finish action using the styled Button primitive from the UI primitives capability.

#### Scenario: Advance button renders with primary styling
- **WHEN** the wizard shell displays the advance button
- **THEN** it renders as a styled Button with primary accent appearance and glow on hover
