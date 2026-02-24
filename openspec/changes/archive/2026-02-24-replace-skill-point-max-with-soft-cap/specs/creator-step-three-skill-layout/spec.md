## ADDED Requirements

### Requirement: Step 3 skill assignment guards enforce final skill bonus soft cap
The system SHALL prevent Step 3 point assignment controls from setting a value that would make a skill's final bonus exceed `+12`, where final bonus is governing stat assignment + assigned skill points + flat ancestry/background skill modifiers.

#### Scenario: Input controls block values above final bonus cap
- **WHEN** a user attempts to assign points to a skill such that the resulting final skill bonus would be greater than `+12`
- **THEN** the control constrains the assigned value to the highest value that keeps the final bonus at or below `+12`

#### Scenario: Input controls still respect remaining pool rules
- **WHEN** a user changes skill points in Step 3
- **THEN** the control applies both the remaining total point pool limit and the final bonus soft-cap limit

## REMOVED Requirements

### Requirement: Step 3 enforces per-skill point maximums
**Reason**: The fixed per-skill allocation maximum of 4 points does not exist in system rules and incorrectly rejects valid allocation strategies.
**Migration**: Use the new requirement "Step 3 skill assignment guards enforce final skill bonus soft cap", which caps by final skill total (`<= +12`) instead of raw assigned points.
