## Requirements

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
