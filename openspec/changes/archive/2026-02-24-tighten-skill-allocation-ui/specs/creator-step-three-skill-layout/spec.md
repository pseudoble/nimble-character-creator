## ADDED Requirements

### Requirement: Skill allocation list displays a column header row
The system SHALL display a single header row above the skill list with column labels for "Skill", "Assigned Points", and "Total", aligned to the same grid as the data rows.

#### Scenario: Column headers are visible above skill rows
- **WHEN** the Step 3 skill allocation section is displayed
- **THEN** a header row appears above the skill list with "Skill", "Assigned Points", and "Total" labels

#### Scenario: Column headers align with data row columns
- **WHEN** the header row and skill data rows are displayed
- **THEN** the header labels align visually with their corresponding columns in the data rows

### Requirement: Skill descriptions are shown via tooltip instead of inline
The system SHALL display an info icon next to each skill name that reveals the skill description in a tooltip on hover or focus, instead of rendering the description inline.

#### Scenario: Info icon appears next to skill name
- **WHEN** a skill row is displayed
- **THEN** an info icon is visible inline after the skill name and stat badge

#### Scenario: Hovering info icon shows skill description
- **WHEN** a user hovers over a skill row's info icon
- **THEN** a tooltip appears containing the full skill description text

#### Scenario: Skill description is not shown inline
- **WHEN** a skill row is displayed
- **THEN** no inline description paragraph is rendered below the skill name

## MODIFIED Requirements

### Requirement: Step 3 skills render in a three-column row layout
The system SHALL render Step 3 skill allocation as row-based entries with three logical columns: skill identity on the left, assigned point controls in the middle, and the computed total on the right.

#### Scenario: Skill row shows skill identity left column, assignment middle column, and total right column
- **WHEN** Step 3 skill allocation is displayed
- **THEN** each skill row shows skill name, stat badge, and info icon in the left column, a point assignment input in the middle column, and the computed total in the right column

#### Scenario: Skill rows are generated from valid skill data
- **WHEN** Step 3 skill allocation is rendered
- **THEN** the rows correspond to valid skill IDs from core skill data

#### Scenario: Individual skill rows do not display an "Assigned Points" label
- **WHEN** a skill row is displayed
- **THEN** the row does not contain a per-row "Assigned Points" label (the label is in the column header instead)
