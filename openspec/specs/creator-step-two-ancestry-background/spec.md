## Requirements

### Requirement: Step 2 collects ancestry, background, and optional motivation
The system SHALL provide Step 2 inputs for ancestry selection, background selection, and an optional motivation text field in the `/create` flow. When an ancestry or background is selected, a summary panel SHALL appear below the respective select showing relevant details from core data.

#### Scenario: Step 2 fields are present
- **WHEN** Step 2 is rendered
- **THEN** users can interact with a selection for ancestry, a selection for background, and a text input for motivation

#### Scenario: Ancestry options are sourced from core data
- **WHEN** Step 2 ancestry selection is displayed
- **THEN** selectable ancestries correspond to valid ancestry entries from core data

#### Scenario: Background options are sourced from core data
- **WHEN** Step 2 background selection is displayed
- **THEN** selectable backgrounds correspond to valid background entries from core data

#### Scenario: Ancestry summary appears when an ancestry is selected
- **WHEN** a valid ancestry is selected in Step 2
- **THEN** a summary panel appears below the ancestry select showing the ancestry size, trait name, and trait description

#### Scenario: Background summary appears when a background is selected
- **WHEN** a valid background is selected in Step 2
- **THEN** a summary panel appears below the background select showing the background description and requirement (if any)

### Requirement: Step 2 enforces validation rules for required selections
The system SHALL validate Step 2 data and treat the step as invalid when required selections are missing or reference non-existent IDs.

#### Scenario: Missing ancestry selection is invalid
- **WHEN** Step 2 has no selected ancestry
- **THEN** Step 2 validation fails with an ancestry error

#### Scenario: Missing background selection is invalid
- **WHEN** Step 2 has no selected background
- **THEN** Step 2 validation fails with a background error

#### Scenario: Non-existent ancestry ID is invalid
- **WHEN** Step 2 ancestry ID does not match any core data ancestry
- **THEN** Step 2 validation fails with an ancestry error

#### Scenario: Non-existent background ID is invalid
- **WHEN** Step 2 background ID does not match any core data background
- **THEN** Step 2 validation fails with a background error

#### Scenario: Overlong motivation is invalid
- **WHEN** the motivation text exceeds the configured maximum length
- **THEN** Step 2 validation fails with a motivation error

#### Scenario: Empty motivation is valid
- **WHEN** the motivation text is empty or omitted
- **THEN** Step 2 validation does not fail on the motivation field

#### Scenario: Valid ancestry, background, and motivation passes validation
- **WHEN** Step 2 has a valid ancestry ID, valid background ID, and motivation within limits
- **THEN** Step 2 validation succeeds

### Requirement: Step 2 validation logic is covered by automated tests
The project SHALL include automated tests for Step 2 validation success and failure paths.

#### Scenario: Valid Step 2 payload passes tests
- **WHEN** tests evaluate a valid Step 2 payload with real core data IDs
- **THEN** validation succeeds

#### Scenario: Invalid Step 2 payloads fail tests
- **WHEN** tests evaluate missing ancestry, missing background, invalid IDs, and overlong motivation
- **THEN** validation fails for each invalid payload with the correct field error

#### Scenario: Step 2 ID lists match core data
- **WHEN** tests compare `getValidAncestryIds()` and `getValidBackgroundIds()` against loaded core data
- **THEN** the static ID lists match the IDs in `ancestries.json` and `backgrounds.json`
