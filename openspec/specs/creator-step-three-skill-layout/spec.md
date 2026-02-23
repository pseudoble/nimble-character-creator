## ADDED Requirements

### Requirement: Step 3 skills render in a two-column row layout
The system SHALL render Step 3 skill allocation as row-based entries with two logical columns: skill identity/details on the left and assigned point controls on the right.

#### Scenario: Skill row shows descriptive left column and assignment right column
- **WHEN** Step 3 skill allocation is displayed
- **THEN** each skill row shows skill name and description in the left column and a point assignment input in the right column

#### Scenario: Skill rows are generated from valid skill data
- **WHEN** Step 3 skill allocation is rendered
- **THEN** the rows correspond to valid skill IDs from core skill data

### Requirement: Step 3 skill rows show live computed totals
The system SHALL display a live total for each skill equal to the currently assigned governing stat value plus currently assigned skill points.

#### Scenario: Stat assignment change updates skill totals
- **WHEN** the user changes a governing stat value in Step 3
- **THEN** each affected skill row total updates immediately to reflect the new stat value plus assigned points

#### Scenario: Skill point change updates skill total
- **WHEN** the user changes assigned points for a skill
- **THEN** that skill row total updates immediately using the latest stat assignment and point value

### Requirement: Step 3 enforces per-skill point maximums
The system SHALL enforce a maximum of 4 assigned points per skill through both interaction guards and validation.

#### Scenario: Input controls block assigning more than 4 points to one skill
- **WHEN** a user attempts to assign more than 4 points to a single skill using Step 3 controls
- **THEN** the assigned value is constrained to 4 and the extra points are not applied

#### Scenario: Validation rejects payloads above per-skill maximum
- **WHEN** Step 3 data includes any skill allocation value greater than 4
- **THEN** Step 3 validation fails with an error for that skill allocation field
