## ADDED Requirements

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

### Requirement: Sheet preview progressively reveals sections
The system SHALL hide character sheet sections whose source data is incomplete. Sections SHALL appear as their required data becomes available.

#### Scenario: Empty draft shows no sections
- **WHEN** the draft is in its initial empty state
- **THEN** no character sheet sections are rendered in the preview

#### Scenario: Header appears when name or class is set
- **WHEN** the user enters a character name or selects a class
- **THEN** the header section (name, class, ancestry, background) becomes visible

#### Scenario: Stats section appears when stats are assigned
- **WHEN** the user selects a stat array and assigns stats
- **THEN** the stats section with save indicators becomes visible

#### Scenario: Vitals section appears when class is selected
- **WHEN** the user selects a class
- **THEN** the vitals section (HP, hit die, initiative, speed, armor, max wounds, inventory slots, size) becomes visible

#### Scenario: Skills section appears when stats are assigned
- **WHEN** stats are assigned (providing base values for skill computation)
- **THEN** the skills section with all 10 skills becomes visible

#### Scenario: Ancestry trait appears when ancestry is selected
- **WHEN** the user selects an ancestry
- **THEN** the ancestry trait section (name and description) becomes visible

#### Scenario: Background section appears when background is selected
- **WHEN** the user selects a background
- **THEN** the background section (name and description) becomes visible

#### Scenario: Equipment section appears when gear is chosen
- **WHEN** the user selects "Starting Gear" as equipment choice and a class is selected
- **THEN** the equipment section showing class starting gear becomes visible

#### Scenario: Gold section appears when gold is chosen
- **WHEN** the user selects "Starting Gold" as equipment choice
- **THEN** the gold section displaying 50 gp becomes visible

#### Scenario: Languages section appears when languages are known
- **WHEN** the user has at least Common as a known language (always true once ancestry context exists)
- **THEN** the languages section becomes visible

### Requirement: Sheet preview displays all derived values
The system SHALL compute and display all derived character values using the ancestry/background modifier system and Nimble game rules.

#### Scenario: Stats displayed as raw values with save indicators
- **WHEN** a Berserker (advantaged STR save, disadvantaged INT save) has stats STR +2, DEX +1, INT +0, WIL -1
- **THEN** the stats section shows each stat value with an up-arrow indicator on STR and a down-arrow indicator on INT

#### Scenario: Skills show allocated points and final total
- **WHEN** a Human character with DEX +2 allocates 2 points to Finesse
- **THEN** the Finesse row shows 2 filled dots (allocated points) and a total of +5 (DEX +2 + 2 pts + Human +1)

#### Scenario: Simple advantage conditional shown as compact triangle indicator
- **WHEN** an Elf character's vitals section renders the Initiative row
- **THEN** the Initiative value displays a cyan `▲` symbol next to it, and hovering the symbol shows "Advantage on Initiative"

#### Scenario: Complex conditional shown with tooltip icon
- **WHEN** a Kobold character's skill section renders the Influence row
- **THEN** the Influence row shows the base computed total and a `?` tooltip icon that on hover displays "+3 to Influence vs friendly characters"

#### Scenario: Conditional vitals shown with tooltip icon
- **WHEN** a Ratfolk character's vitals section renders the armor value
- **THEN** the armor value shows the base computed total and a tooltip icon that on hover displays "+2 Armor if you moved on your last turn"

#### Scenario: Equipment grouped by category
- **WHEN** a Berserker's equipment is displayed
- **THEN** weapons show name, damage, and properties; armor shows name and armor value; supplies show name; each category is visually grouped

### Requirement: Sheet preview derivation uses canonical creator draft fields
The system SHALL compute character sheet preview values from the canonical creator draft fields `characterBasics` and `languagesEquipment`. Persisted legacy draft shapes SHALL be migrated before derivation so preview rendering remains stable.

#### Scenario: Canonical fields drive Step 1 derivation
- **WHEN** a draft includes `characterBasics.classId` and `characterBasics.name`
- **THEN** class-based and header-derived preview values are computed without requiring `stepOne`

#### Scenario: Canonical fields drive Step 4 derivation
- **WHEN** a draft includes `languagesEquipment.equipmentChoice` and `languagesEquipment.selectedLanguages`
- **THEN** equipment, gold, and language preview values are computed without requiring `stepFour`

#### Scenario: Legacy persisted shape still renders preview after migration
- **WHEN** a persisted draft contains legacy `stepOne` and `stepFour` keys
- **THEN** migration maps those values to `characterBasics` and `languagesEquipment` before preview derivation executes
