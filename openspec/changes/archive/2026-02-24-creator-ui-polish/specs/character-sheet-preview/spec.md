## MODIFIED Requirements

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
