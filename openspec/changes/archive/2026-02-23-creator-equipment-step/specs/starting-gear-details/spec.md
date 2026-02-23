## ADDED Requirements

### Requirement: Starting gear data includes item stats
The `starting-gear.json` data SHALL include damage, properties, armor values, and item type details for all starting gear items, sourced from the Nimble reference.

#### Scenario: Weapon entries include damage and properties
- **WHEN** a starting gear item has category `"weapon"`
- **THEN** the item data includes `damage` (e.g., "1d10+STR Slashing"), and `properties` (e.g., ["2-handed"])

#### Scenario: Armor entries include armor value
- **WHEN** a starting gear item has category `"armor"`
- **THEN** the item data includes `armor` (e.g., "3+DEX")

#### Scenario: Shield entries include armor bonus
- **WHEN** a starting gear item has category `"shield"`
- **THEN** the item data includes `armor` (e.g., "+2")

#### Scenario: Supply entries have no stat fields
- **WHEN** a starting gear item has category `"supplies"`
- **THEN** the item data does not require `damage`, `properties`, or `armor` fields

### Requirement: Starting gear data is validated by schema tests
The project SHALL include automated tests verifying that all starting gear items referenced by class `startingGearIds` exist in `starting-gear.json` and that weapons have damage fields and armor/shields have armor fields.

#### Scenario: All class gear IDs resolve
- **WHEN** tests iterate over every class's `startingGearIds`
- **THEN** every ID maps to a valid entry in `starting-gear.json`

#### Scenario: Weapons have required fields
- **WHEN** tests check weapon-category items in `starting-gear.json`
- **THEN** every weapon has a non-empty `damage` field

#### Scenario: Armor and shields have required fields
- **WHEN** tests check armor-category and shield-category items in `starting-gear.json`
- **THEN** every armor and shield has a non-empty `armor` field
