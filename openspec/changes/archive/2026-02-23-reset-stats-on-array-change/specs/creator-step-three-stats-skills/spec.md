## ADDED Requirements

### Requirement: Changing stat array resets assigned stats but preserves skill allocations
The system SHALL reset all stat assignments (`STR`, `DEX`, `INT`, `WIL`) to unassigned when the user changes the selected stat array. Skill point allocations SHALL be preserved.

#### Scenario: Switching stat array clears stat assignments
- **WHEN** a user has assigned stat values and then selects a different stat array
- **THEN** all four stat assignments (`STR`, `DEX`, `INT`, `WIL`) SHALL be reset to empty/unassigned

#### Scenario: Switching stat array preserves skill allocations
- **WHEN** a user has allocated skill points and then selects a different stat array
- **THEN** all skill point allocations SHALL remain unchanged

#### Scenario: Selecting the same stat array does not reset
- **WHEN** a user selects the stat array that is already selected
- **THEN** stat assignments SHALL remain unchanged
