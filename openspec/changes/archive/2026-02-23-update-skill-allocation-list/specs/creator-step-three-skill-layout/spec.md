## ADDED Requirements

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

## MODIFIED Requirements

### Requirement: Step 3 skills render in a two-column row layout
The system SHALL render Step 3 skill allocation as row-based entries with three logical columns: skill identity/details on the left, assigned point controls in the middle, and the computed total on the right.

#### Scenario: Skill row shows descriptive left column, assignment middle column, and total right column
- **WHEN** Step 3 skill allocation is displayed
- **THEN** each skill row shows skill name and description in the left column, a point assignment input in the middle column, and the computed total in the right column

#### Scenario: Skill rows are generated from valid skill data
- **WHEN** Step 3 skill allocation is rendered
- **THEN** the rows correspond to valid skill IDs from core skill data

### Requirement: Step 3 skill rows show live computed totals
The system SHALL display a live total for each skill equal to the currently assigned governing stat value plus currently assigned skill points, rendered in the dedicated total column.

#### Scenario: Stat assignment change updates skill totals
- **WHEN** the user changes a governing stat value in Step 3
- **THEN** each affected skill row's total column updates immediately to reflect the new stat value plus assigned points

#### Scenario: Skill point change updates skill total
- **WHEN** the user changes assigned points for a skill
- **THEN** that skill row's total column updates immediately using the latest stat assignment and point value

## REMOVED Requirements

### Requirement: Inline total text in assigned-points column
**Reason**: The total is now displayed in a dedicated third column with a hover tooltip for the breakdown. The inline "Total: +N (STAT +X + Points Y)" text in the assigned-points column is redundant and removed to keep the column focused on the input control.
**Migration**: Tests targeting the inline total text should target the new total column element and its `title` attribute instead.
