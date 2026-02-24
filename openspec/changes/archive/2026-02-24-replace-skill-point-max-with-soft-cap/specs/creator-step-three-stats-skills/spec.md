## ADDED Requirements

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
