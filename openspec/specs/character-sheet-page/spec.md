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
The system SHALL render the character sheet page as a single centered column without the accordion form panel, using the full available width. After the Vitals section, the sheet SHALL use a two-column grid layout where Skills occupies the left column and the info sections (Ancestry Trait, Background, Equipment, Gold, Languages) stack in the right column at a 50/50 split.

#### Scenario: Full-width rendering
- **WHEN** the sheet page renders
- **THEN** the character sheet component occupies the full content width without a side panel

#### Scenario: Two-column layout for skills and info sections
- **WHEN** the sheet page renders with all sections visible
- **THEN** Header, Stats, and Vitals render full-width above a two-column grid
- **AND** Skills renders in the left column of the grid
- **AND** Ancestry Trait, Background, Equipment, Gold, and Languages stack vertically in the right column

### Requirement: Sheet page uses consistent cyberpunk styling
The system SHALL style the character sheet page using the existing design system tokens (surface colors, neon accents, text hierarchy, glow effects, font families).

#### Scenario: Visual consistency with creator
- **WHEN** the sheet page renders
- **THEN** it uses the same surface backgrounds, neon cyan/magenta/amber accents, text colors, and font families as the creator wizard

### Requirement: Stat modifier values are clickable on the full sheet
The system SHALL render stat modifier values (STR, DEX, INT, WIL) as clickable elements on the `/sheet` page that trigger a `1d20+X` dice roll where X is the stat modifier.

#### Scenario: Clicking a stat modifier triggers a roll
- **WHEN** a user clicks a stat modifier value (e.g., "+2") on the full character sheet
- **THEN** the system triggers a dice roll of `1d20+X` where X is that stat's modifier value
- **AND** the roll is labeled with the stat name (e.g., "STR Check")

#### Scenario: Stat values are not clickable in preview variant
- **WHEN** the character sheet renders in `preview` variant
- **THEN** stat modifier values render as plain text with no click behavior

### Requirement: Skill total values are clickable on the full sheet
The system SHALL render skill total modifier values as clickable elements on the `/sheet` page that trigger a `1d20+X` dice roll where X is the skill total.

#### Scenario: Clicking a skill total triggers a roll
- **WHEN** a user clicks a skill total value (e.g., "+3") on the full character sheet
- **THEN** the system triggers a dice roll of `1d20+X` where X is that skill's total modifier
- **AND** the roll is labeled with the skill name (e.g., "Stealth")

#### Scenario: Skill values are not clickable in preview variant
- **WHEN** the character sheet renders in `preview` variant
- **THEN** skill total values render as plain text with no click behavior

### Requirement: Clickable modifiers have visual affordance
The system SHALL visually indicate that stat and skill modifier values are clickable on the full sheet.

#### Scenario: Hover state on clickable modifier
- **WHEN** a user hovers over a clickable stat or skill modifier on the full sheet
- **THEN** the value displays a visual hover state (e.g., cursor change, highlight) indicating it is interactive
