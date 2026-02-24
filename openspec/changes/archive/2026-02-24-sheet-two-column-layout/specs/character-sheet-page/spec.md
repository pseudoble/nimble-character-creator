## MODIFIED Requirements

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
