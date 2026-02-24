## MODIFIED Requirements

### Requirement: Step navigation includes Step 4
- **WHEN** the wizard shell is displayed
- **THEN** the ordered step list includes Step 1 (Character Basics), Step 2 (Ancestry & Background), Step 3 (Stats & Skills), and Step 4 (Languages & Equipment)

#### Scenario: Step navigation includes renamed Step 4
- **WHEN** the wizard shell is displayed
- **THEN** Step 4 is labeled "Languages & Equipment" in the step navigation

### Requirement: Step 3 advances to Step 4
The system SHALL navigate from Step 3 to Step 4 at the updated route.

#### Scenario: Step 3 advances to Step 4
- **WHEN** Step 3 is valid and the user clicks Next
- **THEN** the wizard navigates to `/create/languages-equipment`

### Requirement: Step 4 URL
The wizard SHALL use the updated URL path for Step 4.

#### Scenario: Step 4 URL
- **WHEN** the user is on Step 4
- **THEN** the URL path is `/create/languages-equipment`

### Requirement: Attempting to skip to Step 4
The system SHALL redirect to the first incomplete step when navigating directly to the Step 4 URL.

#### Scenario: Attempting to skip to Step 4
- **WHEN** a user who has not completed Steps 1-3 navigates directly to `/create/languages-equipment`
- **THEN** they are redirected to the first incomplete step

### Requirement: Back button is shown on Step 4
The system SHALL show a back button on Step 4 with the updated label.

#### Scenario: Back button is shown on Step 4
- **WHEN** the user is on Step 4 (Languages & Equipment)
- **THEN** a back button labeled "Back" is rendered in the wizard footer

### Requirement: Clicking back navigates from Step 4 to Step 3
The system SHALL navigate backward from Step 4 to Step 3.

#### Scenario: Clicking back navigates from Step 4 to Step 3
- **WHEN** the user is on Step 4 and clicks the back button
- **THEN** the wizard navigates to `/create/stats-skills` (Step 3) and displays previously entered Step 3 data

### Requirement: Reset button clears Step 4 data
The system SHALL clear all Step 4 data including language selections when reset is clicked.

#### Scenario: Reset button clears Step 4 data
- **WHEN** the user is on Step 4 with a selected equipment choice and language selections, and clicks the "Reset" button
- **THEN** the equipment choice and language selections are cleared, and Steps 1-3 data remain intact

### Requirement: V2 draft is migrated to include language defaults
The system SHALL backfill `selectedLanguages: []` for persisted drafts missing the field.

#### Scenario: V2 draft is migrated to include language defaults
- **WHEN** a persisted draft from schema version 2 (without selectedLanguages) is loaded
- **THEN** the draft is backfilled with `selectedLanguages: []` and loads without error
