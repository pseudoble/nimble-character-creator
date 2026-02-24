## MODIFIED Requirements

### Requirement: Step 4 presents a gear-vs-gold equipment choice
The system SHALL provide Step 4 in the `/create` flow at route `/create/languages-equipment`, presenting the user with a binary choice between their class's starting gear or 50 gold pieces.

#### Scenario: Step 4 displays two selectable options
- **WHEN** Step 4 is rendered
- **THEN** the user sees two side-by-side selectable cards: one for starting gear (left) and one for starting gold (right), with a "-OR-" separator between them

#### Scenario: Selecting starting gear highlights the gear card
- **WHEN** the user clicks the starting gear card
- **THEN** the gear card is visually highlighted as selected and the gold card is deselected

#### Scenario: Selecting starting gold highlights the gold card
- **WHEN** the user clicks the starting gold card
- **THEN** the gold card is visually highlighted as selected and the gear card is deselected

### Requirement: Step 4 choice is persisted in draft state
The system SHALL store the Step 4 equipment choice in the `CreatorDraft` under `stepFour.equipmentChoice` with values `"gear"`, `"gold"`, or `""` (no choice). The system SHALL also store selected bonus languages in `stepFour.selectedLanguages` as a string array.

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
The system SHALL treat Step 4 as invalid when no equipment choice has been made OR when language selection is incomplete, preventing wizard advancement.

#### Scenario: No choice is invalid
- **WHEN** `stepFour.equipmentChoice` is `""`
- **THEN** Step 4 validation fails

#### Scenario: Gear choice with complete languages is valid
- **WHEN** `stepFour.equipmentChoice` is `"gear"` and language selection is complete
- **THEN** Step 4 validation succeeds

#### Scenario: Gold choice with complete languages is valid
- **WHEN** `stepFour.equipmentChoice` is `"gold"` and language selection is complete
- **THEN** Step 4 validation succeeds

### Requirement: Step 4 layout is responsive
The system SHALL render the equipment cards side-by-side on medium+ screens and stacked vertically on small screens.

#### Scenario: Side-by-side on desktop
- **WHEN** the viewport is medium width or larger
- **THEN** the gear and gold cards are displayed side-by-side with the "-OR-" separator between them

#### Scenario: Stacked on mobile
- **WHEN** the viewport is small width
- **THEN** the gear and gold cards are stacked vertically with the "-OR-" separator between them
