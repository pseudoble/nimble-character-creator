## ADDED Requirements

### Requirement: Step 3 collects stat-array selection, stat assignment, and skill allocation
The system SHALL provide Step 3 inputs in the `/create` flow for selecting a stat array, assigning values to `STR`, `DEX`, `INT`, and `WIL`, and allocating skill points across available skills.

#### Scenario: Step 3 fields are present
- **WHEN** Step 3 is rendered
- **THEN** users can interact with a stat-array selector, four stat assignment controls (`STR`/`DEX`/`INT`/`WIL`), and skill allocation controls

#### Scenario: Stat-array options are sourced from core data
- **WHEN** Step 3 stat-array selection is displayed
- **THEN** selectable stat arrays correspond to valid entries from core data

#### Scenario: Skill allocation options are sourced from core data
- **WHEN** Step 3 skill allocation controls are displayed
- **THEN** allocatable skills correspond to valid skill entries from core data

### Requirement: Step 3 stat assignment prevents illegal value reuse
The system SHALL prevent assigning stat-array values more times than they appear in the selected array, while still allowing duplicate values up to their available count.

#### Scenario: Exhausted value is unavailable in other stat controls
- **WHEN** a stat-array value has already been assigned the maximum number of times allowed by the selected array
- **THEN** that value is not selectable for remaining unassigned stats

#### Scenario: Duplicate array values remain selectable until exhausted
- **WHEN** the selected stat array contains duplicate values
- **THEN** each duplicate value remains selectable until its full count in the selected array has been used

#### Scenario: Changing an assignment restores availability
- **WHEN** a previously assigned stat value is changed to a different value
- **THEN** the released value becomes selectable again for other stats, subject to array counts

### Requirement: Step 3 validates legal distribution and point totals on submit
The system SHALL validate Step 3 on submit/advance and treat the step as invalid when stat distribution or skill-point totals violate configured rules.

#### Scenario: Missing stat-array selection is invalid
- **WHEN** Step 3 has no selected stat array
- **THEN** Step 3 validation fails with a stat-array error

#### Scenario: Incomplete stat assignment is invalid
- **WHEN** one or more of `STR`/`DEX`/`INT`/`WIL` is unassigned
- **THEN** Step 3 validation fails with stat assignment errors

#### Scenario: Stat assignments that do not match selected array are invalid
- **WHEN** assigned stat values do not exactly match the selected stat array's value counts
- **THEN** Step 3 validation fails with a stat distribution error

#### Scenario: Skill allocation total mismatch is invalid
- **WHEN** allocated skill points do not match the configured required total
- **THEN** Step 3 validation fails with a skill-point total error

#### Scenario: Legal stat distribution and legal skill total pass validation
- **WHEN** Step 3 has a valid stat array, valid stat assignments that match array counts, and a valid skill allocation total
- **THEN** Step 3 validation succeeds

### Requirement: Step 3 validation is covered by automated tests
The project SHALL include automated tests for Step 3 validation success and failure paths.

#### Scenario: Valid Step 3 payload passes tests
- **WHEN** tests evaluate a payload with a valid selected stat array, legal stat assignment, and legal skill total
- **THEN** validation succeeds

#### Scenario: Invalid Step 3 payloads fail tests
- **WHEN** tests evaluate missing stat array, illegal stat distribution, and invalid skill-point totals
- **THEN** validation fails for each invalid payload with the correct field errors

#### Scenario: Step 3 ID lists match core data
- **WHEN** tests compare valid Step 3 stat-array IDs and skill IDs against loaded core data
- **THEN** the static ID lists match `stat-arrays.json` and `skills.json`
