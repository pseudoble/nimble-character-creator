## ADDED Requirements

### Requirement: Orc ancestry modifier encodes +1 Might
The system SHALL encode Orc ancestry flat skill modifiers as `skills: { might: 1 }` in the ancestry modifier map.

#### Scenario: Orc ancestry modifier map value
- **WHEN** the modifier map is queried for ancestry ID `"orc"`
- **THEN** it includes a flat Might skill bonus of `+1` (not `+2`)

### Requirement: Derived Orc Might totals use +1 ancestry modifier
The system SHALL include Orc's `+1` flat Might modifier when computing final Might totals from governing stat + allocated points + flat modifiers.

#### Scenario: Orc Might total computation
- **WHEN** an Orc character has STR `+2` and allocates 2 points to Might
- **THEN** the computed Might total is `+5` (`2 + 2 + 1`)
