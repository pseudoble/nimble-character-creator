## ADDED Requirements

### Requirement: Sheet-computed skill scores are capped at +12
The system SHALL cap each computed skill score at `MAX_SKILL_TOTAL_BONUS` (+12) when deriving sheet data. The cap SHALL be applied as `Math.min(statValue + allocatedPoints + flatModifier, MAX_SKILL_TOTAL_BONUS)` in the sheet computation layer, independent of creator validation.

#### Scenario: Skill score at or below cap is unchanged
- **WHEN** a character's computed skill total (stat + allocated + flat modifier) is 10
- **THEN** the sheet displays +10

#### Scenario: Skill score above cap is clamped to +12
- **WHEN** a character's computed skill total would be 14 (e.g., via boon or edge case)
- **THEN** the sheet displays +12
