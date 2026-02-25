## ADDED Requirements

### Requirement: Game-wide constants are defined in a shared module
The system SHALL provide a shared constants module at `src/lib/constants.ts` that owns game-wide numeric constants used across both the creator and sheet modules. Constants that are specific to creator workflow (storage keys, step IDs, form UI limits) SHALL remain in `src/lib/creator/constants.ts`.

#### Scenario: CHARACTER_LEVEL constant exists and is 1
- **WHEN** the shared constants module is imported
- **THEN** `CHARACTER_LEVEL` is exported with value `1`

#### Scenario: STARTING_SKILL_POINTS constant exists and is 4
- **WHEN** the shared constants module is imported
- **THEN** `STARTING_SKILL_POINTS` is exported with value `4`

#### Scenario: SKILL_POINTS_PER_LEVEL constant exists and is 1
- **WHEN** the shared constants module is imported
- **THEN** `SKILL_POINTS_PER_LEVEL` is exported with value `1`

#### Scenario: MAX_SKILL_TOTAL_BONUS constant exists and is 12
- **WHEN** the shared constants module is imported
- **THEN** `MAX_SKILL_TOTAL_BONUS` is exported with value `12`

### Requirement: Creator skill point allocation uses STARTING_SKILL_POINTS
The system SHALL use `STARTING_SKILL_POINTS` (from the shared constants module) wherever the creator enforces or displays the number of skill points available at character creation. `REQUIRED_SKILL_POINTS` SHALL be removed.

#### Scenario: Skill allocation validation uses STARTING_SKILL_POINTS
- **WHEN** Step 3 validation runs
- **THEN** the total required skill point allocation is `STARTING_SKILL_POINTS` (4)
