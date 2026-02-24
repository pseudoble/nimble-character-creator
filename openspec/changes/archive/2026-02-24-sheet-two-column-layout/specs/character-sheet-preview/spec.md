## MODIFIED Requirements

### Requirement: Character sheet preview replaces the debug panel
The system SHALL render a live character sheet preview in the right column of the creator layout, replacing the former debug panel. The preview SHALL update reactively as the user modifies any form field. After the Vitals section, the preview SHALL use a two-column grid layout where Skills occupies the left column and the info sections (Ancestry Trait, Background, Equipment, Gold, Languages) stack in the right column at a 50/50 split.

#### Scenario: Sheet preview shown by default during creation
- **WHEN** a user navigates to `/create`
- **THEN** the right panel displays the character sheet preview instead of raw JSON

#### Scenario: Sheet preview updates live
- **WHEN** the user changes any form field in the creator
- **THEN** the character sheet preview updates immediately to reflect the new derived values

#### Scenario: Two-column layout for skills and info sections in preview
- **WHEN** the preview renders with skills and at least one info section visible
- **THEN** Skills renders in the left column of a two-column grid
- **AND** visible info sections (Ancestry Trait, Background, Equipment, Gold, Languages) stack vertically in the right column
