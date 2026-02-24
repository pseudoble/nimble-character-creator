## ADDED Requirements

### Requirement: Full character sheet page renders at /sheet
The system SHALL provide a page at `/sheet` that renders the complete character sheet using the persisted creator draft from localStorage.

#### Scenario: Sheet page renders all sections
- **WHEN** a user navigates to `/sheet` with a complete valid draft in localStorage
- **THEN** the page renders the full character sheet with all sections visible: header, stats, vitals, skills, ancestry trait, background, equipment or gold, and languages

#### Scenario: Sheet page computes all derived values
- **WHEN** the sheet page loads a valid draft
- **THEN** all derived values (final skill scores, HP, hit die, initiative, speed, armor, max wounds, inventory slots, max hit dice) are computed and displayed

### Requirement: Sheet page redirects when no valid draft exists
The system SHALL redirect to `/create` if no valid creator draft is found in localStorage when the `/sheet` page loads.

#### Scenario: No draft in localStorage
- **WHEN** a user navigates to `/sheet` with no draft in localStorage
- **THEN** they are redirected to `/create`

#### Scenario: Malformed draft in localStorage
- **WHEN** a user navigates to `/sheet` with a malformed draft in localStorage
- **THEN** they are redirected to `/create`

### Requirement: Sheet page is full-width layout
The system SHALL render the character sheet page as a single centered column without the accordion form panel, using the full available width.

#### Scenario: Full-width rendering
- **WHEN** the sheet page renders
- **THEN** the character sheet component occupies the full content width without a side panel

### Requirement: Sheet page uses consistent cyberpunk styling
The system SHALL style the character sheet page using the existing design system tokens (surface colors, neon accents, text hierarchy, glow effects, font families).

#### Scenario: Visual consistency with creator
- **WHEN** the sheet page renders
- **THEN** it uses the same surface backgrounds, neon cyan/magenta/amber accents, text colors, and font families as the creator wizard
