## Requirements

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

### Requirement: Step 3 skill rows show live computed totals
The system SHALL display a live total for each skill equal to the currently assigned governing stat value plus currently assigned skill points, rendered in the dedicated total column.

#### Scenario: Stat assignment change updates skill totals
- **WHEN** the user changes a governing stat value in Step 3
- **THEN** each affected skill row's total column updates immediately to reflect the new stat value plus assigned points

#### Scenario: Skill point change updates skill total
- **WHEN** the user changes assigned points for a skill
- **THEN** that skill row's total column updates immediately using the latest stat assignment and point value

### Requirement: Step 3 skill rows display total in a dedicated third column
The system SHALL render each skill's live computed total (governing stat value + assigned points) as a prominent integer in a third column to the right of the assigned-points column.

#### Scenario: Total column displays computed skill total
- **WHEN** Step 3 skill allocation is displayed
- **THEN** each skill row shows a third column containing the live total as a signed integer (e.g., "+3")

#### Scenario: Total column updates when stat assignment changes
- **WHEN** the user changes a governing stat value in Step 3
- **THEN** the total column for each affected skill updates immediately

#### Scenario: Total column updates when skill points change
- **WHEN** the user changes assigned points for a skill
- **THEN** that skill's total column updates immediately

### Requirement: Step 3 skill total column shows calculation tooltip on hover
The system SHALL display a tooltip on the total column element that shows the calculation breakdown when the user hovers or focuses the element.

#### Scenario: Tooltip shows calculation breakdown
- **WHEN** the user hovers over a skill's total column value
- **THEN** a tooltip appears showing the breakdown in the format "{STAT} {signedStatValue} + Points {assignedPoints} = {signedTotal}"

#### Scenario: Tooltip reflects current values
- **WHEN** the user changes a stat assignment or skill point allocation and then hovers the total
- **THEN** the tooltip shows the updated calculation values

### Requirement: Step 3 enforces per-skill point maximums
The system SHALL enforce a maximum of 4 assigned points per skill through both interaction guards and validation.

#### Scenario: Input controls block assigning more than 4 points to one skill
- **WHEN** a user attempts to assign more than 4 points to a single skill using Step 3 controls
- **THEN** the assigned value is constrained to 4 and the extra points are not applied

#### Scenario: Validation rejects payloads above per-skill maximum
- **WHEN** Step 3 data includes any skill allocation value greater than 4
- **THEN** Step 3 validation fails with an error for that skill allocation field
