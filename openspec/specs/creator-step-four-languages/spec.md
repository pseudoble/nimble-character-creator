### Requirement: Step 4 displays known languages on arrival
The system SHALL display all languages the character already knows when Step 4 renders. Common is always shown. The ancestry language is shown if the character's INT stat is greater than or equal to zero and the selected ancestry grants a language.

#### Scenario: All characters know Common
- **WHEN** Step 4 is rendered for any character
- **THEN** Common is displayed in the known languages list

#### Scenario: Elf with non-negative INT knows Elvish
- **WHEN** Step 4 is rendered for a character with ancestry "Elf" and INT >= 0
- **THEN** Common and Elvish are displayed in the known languages list

#### Scenario: Dwarf with negative INT does not know Dwarvish
- **WHEN** Step 4 is rendered for a character with ancestry "Dwarf" and INT < 0
- **THEN** only Common is displayed in the known languages list

#### Scenario: Human has no ancestry language
- **WHEN** Step 4 is rendered for a character with ancestry "Human" (no ancestry language)
- **THEN** only Common is displayed in the known languages list regardless of INT value

#### Scenario: Gnome ancestry language is displayed as Gnomish
- **WHEN** Step 4 is rendered for a character with ancestry "Gnome" and INT >= 0
- **THEN** Common and Gnomish are displayed in the known languages list

#### Scenario: Orc ancestry language is displayed as Orcish
- **WHEN** Step 4 is rendered for a character with ancestry "Orc" and INT >= 0
- **THEN** Common and Orcish are displayed in the known languages list

### Requirement: Step 4 explains language rules
The system SHALL display explanatory text in the language section describing the language rules: all heroes speak Common, and each point of INT grants one additional language.

#### Scenario: Language rule text is displayed
- **WHEN** Step 4 is rendered
- **THEN** text is displayed explaining that all heroes speak Common and each point of INT grants one additional language known

### Requirement: Step 4 provides a language picker when INT is positive
The system SHALL display a language picker allowing the user to select additional languages when the character's INT stat is greater than zero. The number of selectable languages equals the INT value. The picker SHALL exclude Common and any ancestry language the character already knows.

#### Scenario: INT 1 allows one language pick
- **WHEN** Step 4 is rendered for a character with INT 1 and no ancestry language
- **THEN** the user can select exactly 1 language from the available list (excluding Common)

#### Scenario: INT 2 allows two language picks
- **WHEN** Step 4 is rendered for a character with INT 2 and ancestry language Elvish
- **THEN** the user can select exactly 2 languages from the available list (excluding Common and Elvish)

#### Scenario: Picker excludes already-known languages
- **WHEN** Step 4 renders the language picker for an Elf (knows Elvish) with INT 1
- **THEN** Elvish does not appear in the selectable language list

#### Scenario: All non-known languages are available for selection
- **WHEN** Step 4 renders the language picker
- **THEN** all languages from the language data except Common and any known ancestry language are available as selectable options

### Requirement: Step 4 displays a note when INT is too low for extra languages
The system SHALL display a note when the character's INT stat is zero or negative, informing the user they cannot pick additional languages.

#### Scenario: INT 0 shows no-picks note
- **WHEN** Step 4 is rendered for a character with INT 0
- **THEN** a note is displayed stating that INT is too low to pick additional languages and no language picker is shown

#### Scenario: INT -1 shows no-picks note
- **WHEN** Step 4 is rendered for a character with INT -1
- **THEN** a note is displayed stating that INT is too low to pick additional languages and no language picker is shown

### Requirement: Language selections are persisted in draft state
The system SHALL store user-selected bonus languages in `draft.stepFour.selectedLanguages` as a string array of language IDs. Only user-chosen bonus languages are stored; Common and ancestry languages are derived.

#### Scenario: Selecting a language updates draft
- **WHEN** the user selects "Draconic" from the language picker
- **THEN** `draft.stepFour.selectedLanguages` includes `"draconic"`

#### Scenario: Deselecting a language updates draft
- **WHEN** the user deselects a previously selected language
- **THEN** that language ID is removed from `draft.stepFour.selectedLanguages`

#### Scenario: Draft persists after refresh
- **WHEN** the user selects languages and refreshes the page
- **THEN** the previously selected languages are restored

### Requirement: Step 4 validates language selection count matches INT
The system SHALL validate that the number of selected bonus languages equals the character's INT value (when INT > 0), and that no languages are selected when INT <= 0. Step 4 is invalid until both language and equipment selections are complete.

#### Scenario: Correct number of languages selected is valid
- **WHEN** INT is 2 and `selectedLanguages` contains exactly 2 valid language IDs
- **THEN** the language portion of Step 4 validation succeeds

#### Scenario: Too few languages selected is invalid
- **WHEN** INT is 2 and `selectedLanguages` contains only 1 language ID
- **THEN** Step 4 validation fails with a language selection error

#### Scenario: Zero INT with no selections is valid
- **WHEN** INT is 0 and `selectedLanguages` is empty
- **THEN** the language portion of Step 4 validation succeeds

#### Scenario: Negative INT with no selections is valid
- **WHEN** INT is -1 and `selectedLanguages` is empty
- **THEN** the language portion of Step 4 validation succeeds

### Requirement: Language core data file provides the complete language list
The project SHALL include a `languages.json` core data file containing all 10 game languages with IDs, display names, and speaker descriptions.

#### Scenario: Languages data contains all game languages
- **WHEN** `languages.json` is loaded
- **THEN** it contains entries for: Common, Dwarvish, Elvish, Goblin, Infernal, Thieves' Cant, Celestial, Draconic, Primordial, and Deep Speak

#### Scenario: Each language has required fields
- **WHEN** a language entry is read from `languages.json`
- **THEN** it has `id` (string), `name` (string), and `speakers` (string) fields

### Requirement: Ancestry data includes structured language field
The project SHALL include an `ancestryLanguage` field on each ancestry in `ancestries.json`. The field value is the language ID granted by the ancestry (if INT >= 0), or `null` if the ancestry grants no language. For ancestries with renamed languages (Gnome → Gnomish, Orc → Orcish), the field includes a `displayName` override.

#### Scenario: Elf ancestry has structured language
- **WHEN** the Elf ancestry entry is read
- **THEN** it has `ancestryLanguage` with language ID `"elvish"`

#### Scenario: Human ancestry has no language
- **WHEN** the Human ancestry entry is read
- **THEN** it has `ancestryLanguage` set to `null`

#### Scenario: Gnome ancestry has display name override
- **WHEN** the Gnome ancestry entry is read
- **THEN** it has `ancestryLanguage` with language ID `"dwarvish"` and `displayName` of `"Gnomish"`

#### Scenario: Orc ancestry has display name override
- **WHEN** the Orc ancestry entry is read
- **THEN** it has `ancestryLanguage` with language ID `"goblin"` and `displayName` of `"Orcish"`

### Requirement: Step 4 language validation is covered by automated tests
The project SHALL include automated tests for Step 4 language validation logic.

#### Scenario: Tests cover INT-based language count validation
- **WHEN** automated tests run for Step 4 validation
- **THEN** tests verify that correct language counts pass, incorrect counts fail, and zero/negative INT with empty selections passes

#### Scenario: Tests cover draft backfill for missing language data
- **WHEN** automated tests run for draft persistence
- **THEN** tests verify that loading a draft without `selectedLanguages` backfills it to an empty array
