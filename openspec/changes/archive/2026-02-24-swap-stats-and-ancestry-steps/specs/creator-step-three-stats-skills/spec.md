## MODIFIED Requirements

### Requirement: Step 3 collects stat-array selection, stat assignment, and skill allocation
The system SHALL provide the stats & skills step (rendered at accordion position 2) with inputs in the `/create` flow for selecting a stat array, assigning values to `STR`, `DEX`, `INT`, and `WIL`, and allocating skill points across available skills.

#### Scenario: Stats & Skills fields are present
- **WHEN** the Stats & Skills step is rendered
- **THEN** users can interact with a stat-array selector, four stat assignment controls (`STR`/`DEX`/`INT`/`WIL`), and skill allocation controls

#### Scenario: Stat-array options are sourced from core data
- **WHEN** the stat-array selection is displayed
- **THEN** selectable stat arrays correspond to valid entries from core data

#### Scenario: Skill allocation options are sourced from core data
- **WHEN** the skill allocation controls are displayed
- **THEN** allocatable skills correspond to valid skill entries from core data
