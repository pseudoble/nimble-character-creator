## MODIFIED Requirements

### Requirement: Step 1 collects class, character name, and description
The system SHALL provide Step 1 inputs for class selection, character name, and character description in the `/create` flow, using styled UI primitives from the design system. When a class is selected, a summary panel SHALL appear below the class select showing the class description, key stats, and hit die.

#### Scenario: Step 1 fields are present
- **WHEN** Step 1 is rendered
- **THEN** users can interact with a styled Select for class selection, a styled Input for character name, and a styled Textarea for character description

#### Scenario: Class options are sourced from core creator data
- **WHEN** Step 1 class selection is displayed
- **THEN** selectable classes correspond to valid class entries from core data

#### Scenario: Class summary appears when a class is selected
- **WHEN** a valid class is selected in Step 1
- **THEN** a summary panel appears below the class select showing the class description, key stats, and hit die
