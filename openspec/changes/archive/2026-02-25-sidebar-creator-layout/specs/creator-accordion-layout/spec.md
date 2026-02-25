## MODIFIED Requirements

### Requirement: Creator renders as a two-panel layout with accordion form sidebar and draft preview
The system SHALL render the creator at `/create` as a two-panel layout: a left sidebar (40% width) containing an accordion of creator steps, and a right main panel (60% width) displaying a live character sheet preview. The outer container SHALL use `max-w-7xl`. On viewports below the `lg` breakpoint, the layout SHALL stack vertically with the accordion form above the sheet preview.

#### Scenario: Two-panel layout on wide screens with 40/60 split
- **WHEN** the user navigates to `/create` on a viewport at or above the `lg` breakpoint
- **THEN** the accordion form sidebar is displayed on the left at 40% width and the sheet preview panel is displayed on the right at 60% width, side by side, within a `max-w-7xl` container

#### Scenario: Stacked layout on narrow screens
- **WHEN** the user navigates to `/create` on a viewport below the `lg` breakpoint
- **THEN** the accordion form is displayed above the sheet preview in a single column

#### Scenario: Draft preview shows live character sheet
- **WHEN** the user modifies any form field in any accordion step
- **THEN** the sheet preview panel updates immediately to reflect the current draft state

### Requirement: Accordion sidebar renders as a single unified panel with left-edge accent
The system SHALL render all accordion sections within a single container panel styled with a left-edge accent border (`border-l-2 border-l-neon-cyan/30`), right-side rounded corners (`rounded-r-lg`), and a surface background (`bg-surface-1`). Individual accordion sections SHALL NOT have their own card borders or backgrounds.

#### Scenario: Sidebar container has left-edge accent
- **WHEN** the creator is displayed on a viewport at or above the `lg` breakpoint
- **THEN** the accordion sidebar is wrapped in a single container with a 2px left border in cyan accent color and rounded right corners

#### Scenario: Individual sections do not have card styling
- **WHEN** the creator is displayed
- **THEN** no accordion section has its own `rounded-lg` border or individual `bg-surface-1` background separate from the sidebar container

### Requirement: Accordion sections are separated by divider lines
The system SHALL separate accordion sections with horizontal divider lines (`border-t border-surface-3`) instead of gaps between cards. The first section SHALL NOT have a top divider.

#### Scenario: Dividers between sections
- **WHEN** the creator is displayed with four accordion sections
- **THEN** thin horizontal divider lines appear between each adjacent pair of sections (3 dividers total)

#### Scenario: No divider above the first section
- **WHEN** the creator is displayed
- **THEN** the first accordion section does not have a divider line above it

### Requirement: Accordion step indicators use compact dots
The system SHALL display each accordion section header with a small dot indicator (`h-2 w-2 rounded-full`) instead of a numbered circle. The dot color SHALL convey state: `bg-neon-cyan` for complete or expanded, `bg-amber-500` for needs-attention, `bg-surface-3` for untouched.

#### Scenario: Complete step shows cyan dot
- **WHEN** a step passes validation
- **THEN** the step header displays a small cyan dot indicator

#### Scenario: Expanded step shows cyan dot
- **WHEN** a step is currently expanded
- **THEN** the step header displays a small cyan dot indicator

#### Scenario: Needs-attention step shows amber dot
- **WHEN** a step has been touched but does not pass validation
- **THEN** the step header displays a small amber dot indicator

#### Scenario: Untouched step shows neutral dot
- **WHEN** a step has not been touched and is not valid
- **THEN** the step header displays a small neutral-colored dot indicator

### Requirement: Each creator step renders as a collapsible accordion section
The system SHALL render each of the four creator steps (Character Basics, Stats & Skills, Ancestry & Background, Languages & Equipment) as a collapsible accordion section within the sidebar panel. Exactly one section SHALL be expanded at a time.

#### Scenario: Steps are rendered as accordion sections
- **WHEN** the creator is displayed
- **THEN** four accordion sections are visible, labeled "Character Basics", "Ancestry & Background", "Stats & Skills", and "Languages & Equipment"

#### Scenario: Only one section is expanded at a time
- **WHEN** the user expands a different accordion section
- **THEN** the previously expanded section collapses and the newly selected section expands

#### Scenario: Expanded section contains the step form
- **WHEN** an accordion section is expanded
- **THEN** the corresponding step form is rendered inside the section

### Requirement: Collapsed accordion sections display a summary of selections
The system SHALL display a one-line summary of the user's selections in each collapsed accordion header when that step has data entered.

#### Scenario: Collapsed Step 1 shows class and name
- **WHEN** the user has entered a class and name in Step 1 and the section is collapsed
- **THEN** the accordion header displays a summary including the selected class name and character name

#### Scenario: Collapsed Step 2 shows ancestry and background
- **WHEN** the user has selected an ancestry and background in Step 2 and the section is collapsed
- **THEN** the accordion header displays a summary including the ancestry name and background name

#### Scenario: Collapsed Step 3 shows stat array
- **WHEN** the user has assigned stats in Step 3 and the section is collapsed
- **THEN** the accordion header displays a summary of the assigned stat values

#### Scenario: Collapsed Step 4 shows equipment choice
- **WHEN** the user has made an equipment choice in Step 4 and the section is collapsed
- **THEN** the accordion header displays a summary of the equipment choice

#### Scenario: Collapsed step with no data shows no summary
- **WHEN** a step has no data entered and the section is collapsed
- **THEN** the accordion header displays the step label without a summary line

### Requirement: Accordion headers display three visual states
The system SHALL display each accordion section header in one of three visual states based on completion and interaction status: untouched, complete, or needs-attention. The expanded step header label SHALL use `text-neon-cyan` without glow effects.

#### Scenario: Untouched step shows neutral styling
- **WHEN** a step has not been touched and is not valid
- **THEN** the accordion header displays the step label in low-emphasis text with a neutral dot

#### Scenario: Complete step shows success styling
- **WHEN** a step passes validation
- **THEN** the accordion header displays the step label in medium-emphasis text with a cyan dot

#### Scenario: Needs-attention step shows warning styling
- **WHEN** a step has been touched but does not pass validation
- **THEN** the accordion header displays the step label in amber with a warning tooltip and amber dot

#### Scenario: Expanded step uses cyan label text
- **WHEN** a step is currently expanded
- **THEN** the step label is displayed in `text-neon-cyan` without any glow effect