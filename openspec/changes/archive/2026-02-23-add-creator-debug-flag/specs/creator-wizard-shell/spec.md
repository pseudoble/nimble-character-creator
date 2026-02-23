## MODIFIED Requirements

### Requirement: `/create` provides a wizard shell with step navigation
The system SHALL expose a `/create` route that renders a creator wizard shell with ordered step navigation and an active step content region, styled with the cyberpunk design system. When the URL contains the query parameter `?debug=true`, the shell SHALL render a debug panel below the form content displaying the current `CreatorDraft` state as syntax-highlighted JSON.

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

#### Scenario: Debug panel shown with query param
- **WHEN** the user navigates to any `/create/<step>?debug=true` URL
- **THEN** the wizard shell renders a debug panel below the form content showing the full draft JSON

#### Scenario: Debug panel hidden without query param
- **WHEN** the user navigates to any `/create/<step>` URL without `?debug=true`
- **THEN** no debug panel is rendered in the wizard shell
