## Requirements

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

### Requirement: Stat assignment controls display tooltip descriptions
The system SHALL display a tooltip on each stat label (STR, DEX, INT, WIL) in the Assign Stats section that provides a brief description of what the stat governs.

#### Scenario: STR tooltip describes strength
- **WHEN** the user hovers over or focuses the STR label in the Assign Stats section
- **THEN** a tooltip appears with a brief description of Strength (e.g., melee attacks, feats of strength, carrying capacity)

#### Scenario: DEX tooltip describes dexterity
- **WHEN** the user hovers over or focuses the DEX label in the Assign Stats section
- **THEN** a tooltip appears with a brief description of Dexterity (e.g., ranged attacks, reflexes, nimble movement)

#### Scenario: INT tooltip describes intelligence
- **WHEN** the user hovers over or focuses the INT label in the Assign Stats section
- **THEN** a tooltip appears with a brief description of Intelligence (e.g., knowledge, languages, arcane understanding)

#### Scenario: WIL tooltip describes willpower
- **WHEN** the user hovers over or focuses the WIL label in the Assign Stats section
- **THEN** a tooltip appears with a brief description of Willpower (e.g., willpower, perception, force of personality)

### Requirement: Step 3 validation enforces final skill bonus soft cap
The system SHALL validate that each skill's final bonus is at most `+12`, where final bonus is governing stat assignment + assigned skill points + flat ancestry/background skill modifiers.

#### Scenario: Validation passes when all final skill bonuses are at or below +12
- **WHEN** Step 3 data contains only skills whose final bonuses are `<= +12`
- **THEN** no soft-cap validation error is produced for skill allocations

#### Scenario: Validation rejects skills above +12
- **WHEN** Step 3 data includes any skill whose final bonus is greater than `+12`
- **THEN** Step 3 validation fails with a field-level error for that skill allocation

#### Scenario: Validation includes all-skills ancestry/background bonuses
- **WHEN** ancestry or background modifiers add flat points to all skills
- **THEN** those flat points are included in the final bonus soft-cap computation

#### Scenario: Validation includes per-skill ancestry/background bonuses
- **WHEN** ancestry or background modifiers add flat points to a specific skill
- **THEN** those flat points are included in that skill's final bonus soft-cap computation

### Requirement: Step 3 validity updates when ancestry/background changes affect skill totals
The system SHALL recompute Stats & Skills validation when ancestry/background selections change, because those selections can change flat skill modifiers used in Step 3 final-bonus soft-cap validation.

#### Scenario: Ancestry/background change can invalidate Step 3
- **WHEN** a user changes ancestry or background and the resulting flat skill modifiers push any Step 3 final skill bonus above `+12`
- **THEN** the Stats & Skills step becomes invalid immediately without requiring additional edits in Step 3

#### Scenario: Ancestry/background change can restore Step 3 validity
- **WHEN** a user changes ancestry or background and resulting flat skill modifiers bring all Step 3 final skill bonuses to `<= +12`
- **THEN** the Stats & Skills step becomes valid immediately when all other Step 3 requirements are met
