## ADDED Requirements

### Requirement: Wizard shell supports backward step navigation
The system SHALL provide a back button that navigates to the previous step in the wizard, allowing users to revisit and modify earlier selections.

#### Scenario: Back button is not shown on Step 1
- **WHEN** the user is on Step 1 (Character Basics)
- **THEN** no back button is rendered in the wizard footer

#### Scenario: Back button is shown on Step 2
- **WHEN** the user is on Step 2 (Ancestry & Background)
- **THEN** a back button labeled "Back" is rendered in the wizard footer

#### Scenario: Clicking back navigates to the previous step
- **WHEN** the user is on Step 2 and clicks the back button
- **THEN** the wizard navigates to Step 1 and displays the Step 1 form with previously entered data intact

#### Scenario: Back navigation is not gated by validation
- **WHEN** the user is on Step 2 with invalid or incomplete data
- **THEN** the back button is still clickable and navigates to the previous step

#### Scenario: Back navigation resets error display
- **WHEN** the user navigates back from Step 2
- **THEN** validation errors are not shown on the previous step until the user attempts to advance again

### Requirement: Wizard back button uses the Button primitive with outline variant
The system SHALL render the wizard's back action using the styled Button primitive with the outline variant, visually distinguished from the primary advance button.

#### Scenario: Back button renders with outline styling
- **WHEN** the wizard shell displays the back button
- **THEN** it renders as a styled Button with the outline variant

## MODIFIED Requirements

### Requirement: Wizard advance button uses the Button primitive
The system SHALL render the wizard's advance/finish action using the styled Button primitive from the UI primitives capability. When a back button is present, the footer layout SHALL use space-between alignment; otherwise it SHALL use end alignment.

#### Scenario: Advance button renders with primary styling
- **WHEN** the wizard shell displays the advance button
- **THEN** it renders as a styled Button with primary accent appearance and glow on hover

#### Scenario: Footer layout with back button
- **WHEN** the wizard is on a step that shows a back button
- **THEN** the footer uses space-between layout with back on the left and advance on the right

#### Scenario: Footer layout without back button
- **WHEN** the wizard is on Step 1 with no back button
- **THEN** the footer uses end-aligned layout with only the advance button

### Requirement: Wizard shell behavior is covered by automated tests
The project SHALL include automated tests for wizard shell progression, backward navigation, and draft persistence behavior.

#### Scenario: Navigation gating test coverage
- **WHEN** automated tests run for creator wizard shell behavior
- **THEN** tests verify that forward navigation is blocked for invalid Step 1 and Step 2, and allowed for valid Step 1 and Step 2

#### Scenario: Draft persistence test coverage
- **WHEN** automated tests run for creator draft behavior
- **THEN** tests verify draft save and restore behavior, including invalid persisted payload handling

#### Scenario: Back navigation test coverage
- **WHEN** automated tests run for creator wizard shell behavior
- **THEN** tests verify that back navigation works from Step 2 to Step 1, preserves draft data, and is not blocked by validation state
