## ADDED Requirements

### Requirement: Step 4 presents a gear-vs-gold equipment choice
The system SHALL provide Step 4 in the `/create` flow at route `/create/equipment-money`, presenting the user with a binary choice between their class's starting gear or 50 gold pieces.

#### Scenario: Step 4 displays two selectable options
- **WHEN** Step 4 is rendered
- **THEN** the user sees two side-by-side selectable cards: one for starting gear (left) and one for starting gold (right), with a "-OR-" separator between them

#### Scenario: Selecting starting gear highlights the gear card
- **WHEN** the user clicks the starting gear card
- **THEN** the gear card is visually highlighted as selected and the gold card is deselected

#### Scenario: Selecting starting gold highlights the gold card
- **WHEN** the user clicks the starting gold card
- **THEN** the gold card is visually highlighted as selected and the gear card is deselected

### Requirement: Starting gear card displays class equipment grouped by category with stats
The system SHALL display the selected class's starting gear on the left card, grouped by item category, with relevant stats for each item.

#### Scenario: Gear is sourced from selected class
- **WHEN** Step 4 is rendered for a character with class "Berserker"
- **THEN** the gear card displays the Berserker's starting gear items (Battleaxe, Rations (meat), Rope (50 ft.))

#### Scenario: Weapons display damage and properties
- **WHEN** a starting gear item is a weapon
- **THEN** the item displays its name, damage dice and type (e.g., "1d10+STR Slashing"), and properties (e.g., "2-handed")

#### Scenario: Armor displays armor value
- **WHEN** a starting gear item is armor
- **THEN** the item displays its name and armor value (e.g., "Armor 3+DEX")

#### Scenario: Shields display armor bonus
- **WHEN** a starting gear item is a shield
- **THEN** the item displays its name and armor bonus (e.g., "Armor +2")

#### Scenario: Supplies display name only
- **WHEN** a starting gear item is a supply
- **THEN** the item displays its name without additional stats

#### Scenario: Items are grouped by category
- **WHEN** the gear card contains items of multiple categories
- **THEN** items are grouped under category headers (e.g., "WEAPONS", "ARMOR", "SHIELDS", "SUPPLIES")

#### Scenario: No prices shown on gear card
- **WHEN** the gear card is displayed
- **THEN** no gold prices are shown for any items

### Requirement: Starting gold card displays 50 gp with artwork
The system SHALL display the gold option on the right card with a gold pile image and the amount "50 gp" in larger text.

#### Scenario: Gold card shows artwork and amount
- **WHEN** the gold card is rendered
- **THEN** a gold pile image is displayed above the text "50 gp" which is rendered in a larger font size than the default body text

### Requirement: Step 4 choice is persisted in draft state
The system SHALL store the Step 4 equipment choice in the `CreatorDraft` under `stepFour.equipmentChoice` with values `"gear"`, `"gold"`, or `""` (no choice).

#### Scenario: Selecting gear updates draft
- **WHEN** the user selects the starting gear option
- **THEN** `draft.stepFour.equipmentChoice` is set to `"gear"`

#### Scenario: Selecting gold updates draft
- **WHEN** the user selects the starting gold option
- **THEN** `draft.stepFour.equipmentChoice` is set to `"gold"`

#### Scenario: Draft persists after refresh
- **WHEN** the user selects an equipment choice and refreshes the page
- **THEN** the previously selected choice is restored

### Requirement: Step 4 validates that a choice has been made
The system SHALL treat Step 4 as invalid when no equipment choice has been made, preventing wizard advancement.

#### Scenario: No choice is invalid
- **WHEN** `stepFour.equipmentChoice` is `""`
- **THEN** Step 4 validation fails

#### Scenario: Gear choice is valid
- **WHEN** `stepFour.equipmentChoice` is `"gear"`
- **THEN** Step 4 validation succeeds

#### Scenario: Gold choice is valid
- **WHEN** `stepFour.equipmentChoice` is `"gold"`
- **THEN** Step 4 validation succeeds

### Requirement: Step 4 layout is responsive
The system SHALL render the two cards side-by-side on medium+ screens and stacked vertically on small screens.

#### Scenario: Side-by-side on desktop
- **WHEN** the viewport is medium width or larger
- **THEN** the gear and gold cards are displayed side-by-side with the "-OR-" separator between them

#### Scenario: Stacked on mobile
- **WHEN** the viewport is small width
- **THEN** the gear and gold cards are stacked vertically with the "-OR-" separator between them

### Requirement: Step 4 validation is covered by automated tests
The project SHALL include automated tests for Step 4 validation.

#### Scenario: Empty choice fails validation
- **WHEN** tests evaluate a Step 4 payload with `equipmentChoice: ""`
- **THEN** validation fails

#### Scenario: Valid choices pass validation
- **WHEN** tests evaluate Step 4 payloads with `equipmentChoice: "gear"` and `equipmentChoice: "gold"`
- **THEN** validation succeeds for both
