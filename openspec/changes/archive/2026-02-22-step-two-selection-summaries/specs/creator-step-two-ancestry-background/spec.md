## MODIFIED Requirements

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
