## ADDED Requirements

### Requirement: Tooltip primitive is available with cyberpunk styling
The system SHALL provide a Tooltip component with accessible markup, keyboard support, and cyberpunk-styled appearance, following the same Radix/shadcn wrapper pattern as existing primitives.

#### Scenario: Tooltip renders with dark surface styling
- **WHEN** a Tooltip content panel is displayed
- **THEN** it displays with a dark surface background, subtle border, and medium-emphasis text consistent with the design system

#### Scenario: Tooltip supports keyboard interaction
- **WHEN** a user focuses a Tooltip trigger via keyboard
- **THEN** the tooltip content appears, and pressing Escape dismisses it
