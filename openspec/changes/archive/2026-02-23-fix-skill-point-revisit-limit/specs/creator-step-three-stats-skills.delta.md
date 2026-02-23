# Delta Spec: creator-step-three-stats-skills

## Modified Requirements

### Requirement: Step 3 skill allocation UI prevents over-allocation
The system SHALL limit skill point assignment in the UI such that the total across all skills does not exceed the allowed pool.

#### Scenario: Individual skill input is capped by remaining pool
- **GIVEN** a character has 4 total skill points to assign
- **WHEN** 3 points have already been assigned to other skills
- **THEN** any single skill's input SHALL have a maximum selectable value of 1

#### Scenario: Incremental assignment updates remaining points
- **WHEN** a user increases a skill's assigned points
- **THEN** the "Remaining" points display SHALL immediately reflect the decrease in available points

#### Scenario: Decreasing assignment restores remaining points
- **WHEN** a user decreases a skill's assigned points
- **THEN** the "Remaining" points display SHALL immediately reflect the increase in available points
- **AND** other skills' input caps SHALL be updated accordingly
