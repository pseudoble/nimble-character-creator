## MODIFIED Requirements

### Requirement: Step 3 collects stat-array selection, stat assignment, and skill allocation
The system SHALL provide the stats & skills step (rendered at accordion position 2) with inputs in the `/create` flow for selecting a stat array, assigning values to `STR`, `DEX`, `INT`, and `WIL`, and allocating skill points across available skills.

#### Scenario: Stat-array selector is available when Step 3 is rendered
- **WHEN** the Stats & Skills step is rendered
- **THEN** users can interact with a stat-array selector

#### Scenario: Assign Stats controls are hidden until a valid stat array is selected
- **WHEN** the Stats & Skills step is rendered and no valid stat array is selected
- **THEN** the Assign Stats section and its four stat assignment controls (`STR`/`DEX`/`INT`/`WIL`) are not displayed

#### Scenario: Assign Stats controls appear after valid stat-array selection
- **WHEN** a user selects a valid stat array in Step 3
- **THEN** the Assign Stats section is displayed with four stat assignment controls (`STR`/`DEX`/`INT`/`WIL`)

#### Scenario: Placeholder option cannot be re-selected after valid array selection
- **WHEN** a user has selected a valid stat array
- **THEN** the placeholder option (`Select a stat array...`) is not selectable through the stat-array selector

#### Scenario: Stat-array options are sourced from core data
- **WHEN** the stat-array selection is displayed
- **THEN** selectable stat arrays correspond to valid entries from core data

#### Scenario: Skill allocation options are sourced from core data
- **WHEN** the skill allocation controls are displayed
- **THEN** allocatable skills correspond to valid skill entries from core data

## ADDED Requirements

### Requirement: Step 3 validation prioritizes stat-array selection before stat assignment errors
The system SHALL treat missing stat-array selection as a gating validation condition and suppress individual stat assignment validation errors until a valid stat array is selected.

#### Scenario: Missing stat array reports only stat-array validation error
- **WHEN** Step 3 validation runs and `statArrayId` is empty
- **THEN** validation includes a `statArrayId` error
- **AND** validation does not include individual stat assignment errors for `STR`, `DEX`, `INT`, or `WIL`
- **AND** validation does not include aggregate assigned-stat mismatch errors

#### Scenario: Stat assignment validation runs after valid stat array selection
- **WHEN** Step 3 validation runs with a valid `statArrayId`
- **THEN** individual stat assignment validation errors and aggregate assigned-stat mismatch errors are evaluated normally
