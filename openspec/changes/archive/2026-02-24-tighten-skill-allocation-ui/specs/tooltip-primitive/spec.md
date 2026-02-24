## ADDED Requirements

### Requirement: Tooltip primitive is available with cyberpunk styling
The system SHALL provide a Tooltip component built on Radix UI that displays contextual information on hover/focus, styled with the cyberpunk design tokens.

#### Scenario: Tooltip appears on hover
- **WHEN** a user hovers over a Tooltip trigger element
- **THEN** a styled tooltip content panel appears after a brief delay

#### Scenario: Tooltip appears on keyboard focus
- **WHEN** a user focuses a Tooltip trigger element via keyboard
- **THEN** the tooltip content panel appears

#### Scenario: Tooltip dismisses on escape
- **WHEN** a tooltip is visible and the user presses Escape
- **THEN** the tooltip dismisses

#### Scenario: Tooltip renders with cyberpunk styling
- **WHEN** a Tooltip content panel is displayed
- **THEN** it renders with a dark surface background, subtle border, and medium-emphasis text consistent with the design system

#### Scenario: Tooltip handles viewport collisions
- **WHEN** a tooltip would overflow the viewport edge
- **THEN** it repositions to remain fully visible

### Requirement: Tooltip exports composable sub-components
The system SHALL export TooltipProvider, Tooltip, TooltipTrigger, and TooltipContent as composable building blocks following the shadcn/Radix pattern.

#### Scenario: Tooltip is composed from sub-components
- **WHEN** a developer uses the Tooltip component
- **THEN** they can compose it from TooltipProvider, Tooltip, TooltipTrigger, and TooltipContent sub-components
