## MODIFIED Requirements

### Requirement: /create provides a wizard shell with step navigation
The system SHALL expose a `/create` route that renders a creator wizard shell with ordered step navigation and an active step content region, styled with the cyberpunk design system. When the URL contains the query parameter `?debug=true`, the shell SHALL render a debug panel below the form content displaying the current `CreatorDraft` state as syntax-highlighted JSON.

#### Scenario: User opens creator flow
- **WHEN** a user navigates to `/create`
- **THEN** the user is redirected to the first incomplete step (defaulting to `/create/character-basics`)

#### Scenario: Step navigation state is visible
- **WHEN** the wizard shell is displayed
- **THEN** users can see the ordered step list with the active step highlighted using the primary accent color and monospace step labels

#### Scenario: Step navigation includes Step 4
- **WHEN** the wizard shell is displayed
- **THEN** the ordered step list includes Step 1 (Character Basics), Step 2 (Ancestry & Background), Step 3 (Stats & Skills), and Step 4 (Equipment & Money)

#### Scenario: Step navigation indicators are clickable
- **WHEN** the user is on Step 2 or later and clicks a previous step indicator
- **THEN** the wizard navigates to that step's URL

#### Scenario: Step navigation indicators prevent skipping
- **WHEN** the user attempts to click a future step whose prerequisites are not complete
- **THEN** navigation is blocked

#### Scenario: Debug panel shown with query param
- **WHEN** the user navigates to any `/create/<step>?debug=true` URL
- **THEN** the wizard shell renders a debug panel below the form content showing the full draft JSON

#### Scenario: Debug panel hidden without query param
- **WHEN** the user navigates to any `/create/<step>` URL without `?debug=true`
- **THEN** no debug panel is rendered in the wizard shell

### Requirement: Wizard advancement is gated by active-step validity
The system SHALL prevent forward navigation from the active step until that step passes validation, including step-specific constraints such as per-field maximum allocation rules.

#### Scenario: Cannot advance with invalid Step 4
- **WHEN** Step 4 has no equipment choice selected
- **THEN** the user cannot advance from Step 4

#### Scenario: Can finish with valid Step 4
- **WHEN** Step 4 has a valid equipment choice selected
- **THEN** the user can complete the wizard from Step 4

#### Scenario: Step 3 advances to Step 4
- **WHEN** Step 3 is valid and the user clicks Next
- **THEN** the wizard navigates to `/create/equipment-money`

### Requirement: Wizard shell supports backward step navigation
The system SHALL provide a back button that navigates to the previous step in the wizard, allowing users to revisit and modify earlier selections.

#### Scenario: Back button is shown on Step 4
- **WHEN** the user is on Step 4 (Equipment & Money)
- **THEN** a back button labeled "Back" is rendered in the wizard footer

#### Scenario: Clicking back navigates from Step 4 to Step 3
- **WHEN** the user is on Step 4 and clicks the back button
- **THEN** the wizard navigates to `/create/stats-skills` (Step 3) and displays previously entered Step 3 data

### Requirement: URL-based step navigation
The wizard SHALL utilize distinct URL paths for each step, ensuring the browser address bar reflects the current step and enables history navigation.

#### Scenario: Step 4 URL
- **WHEN** the user is on Step 4
- **THEN** the URL path is `/create/equipment-money`

### Requirement: Incomplete step redirection
The system SHALL prevent direct navigation to future steps if prior steps are incomplete, redirecting the user to the first incomplete step.

#### Scenario: Attempting to skip to Step 4
- **WHEN** a user who has not completed Steps 1-3 navigates directly to `/create/equipment-money`
- **THEN** they are redirected to the first incomplete step

### Requirement: Wizard shell supports resetting the active step
The system SHALL provide a "Reset" button in the wizard shell that clears all user-entered data for the currently active step without affecting data on any other steps.

#### Scenario: Reset button clears Step 4 data
- **WHEN** the user is on Step 4 with a selected equipment choice and clicks the "Reset" button
- **THEN** the equipment choice is cleared, and Steps 1-3 data remain intact

### Requirement: Creator draft is persisted and restored
The system SHALL persist in-progress creator draft data and restore it when the user returns to the flow.

#### Scenario: Step 4 draft persists after refresh
- **WHEN** a user selects an equipment choice on Step 4 and refreshes the page
- **THEN** the previously selected equipment choice is restored and the user remains on Step 4

#### Scenario: V1 draft is migrated to include Step 4 defaults
- **WHEN** a persisted draft from schema version 1 (without stepFour) is loaded
- **THEN** the draft is backfilled with `stepFour: { equipmentChoice: "" }` and loads without error
