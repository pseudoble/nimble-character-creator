## MODIFIED Requirements

### Requirement: Language selections are persisted in draft state
The system SHALL store user-selected bonus languages in `draft.languagesEquipment.selectedLanguages` as a string array of language IDs. Only user-chosen bonus languages are stored; Common and ancestry languages are derived.

#### Scenario: Selecting a language updates draft
- **WHEN** the user selects "Draconic" from the language picker
- **THEN** `draft.languagesEquipment.selectedLanguages` includes `"draconic"`

#### Scenario: Deselecting a language updates draft
- **WHEN** the user deselects a previously selected language
- **THEN** that language ID is removed from `draft.languagesEquipment.selectedLanguages`

#### Scenario: Legacy stepFour field is migrated
- **WHEN** a persisted draft includes `stepFour` and omits `languagesEquipment`
- **THEN** `stepFour.selectedLanguages` is migrated to `languagesEquipment.selectedLanguages` before restore

#### Scenario: Draft persists after refresh
- **WHEN** the user selects languages and refreshes the page
- **THEN** the previously selected languages are restored

### Requirement: Language selections are trimmed when INT stat is lowered
The system SHALL automatically trim or clear bonus language selections when the INT stat allocation is changed in the Stats & Skills step such that the new INT value allows fewer bonus languages than currently selected. When INT drops to zero or below, all bonus language selections SHALL be cleared. When INT drops but remains positive, the selected languages array SHALL be trimmed to the new INT value, preserving earlier selections.

#### Scenario: INT lowered from 2 to 0 clears all language selections
- **WHEN** a character has INT 2 with 2 bonus languages selected and the user changes INT to 0 in Stats & Skills
- **THEN** `draft.languagesEquipment.selectedLanguages` is set to an empty array

#### Scenario: INT lowered from 3 to 1 trims to one language
- **WHEN** a character has INT 3 with 3 bonus languages selected and the user changes INT to 1 in Stats & Skills
- **THEN** `draft.languagesEquipment.selectedLanguages` is trimmed to contain only the first selected language

#### Scenario: INT lowered to negative clears all language selections
- **WHEN** a character has INT 1 with 1 bonus language selected and the user changes INT to -1 in Stats & Skills
- **THEN** `draft.languagesEquipment.selectedLanguages` is set to an empty array

#### Scenario: INT raised does not modify existing selections
- **WHEN** a character has INT 1 with 1 bonus language selected and the user changes INT to 2 in Stats & Skills
- **THEN** `draft.languagesEquipment.selectedLanguages` is unchanged (still contains the 1 previously selected language)

#### Scenario: INT unchanged does not modify selections
- **WHEN** a character has INT 2 with 2 bonus languages selected and the user updates a different stat (e.g., STR) in Stats & Skills
- **THEN** `draft.languagesEquipment.selectedLanguages` is unchanged

#### Scenario: Stat array change clears language selections
- **WHEN** a character has bonus languages selected and the user changes the stat array in Stats & Skills
- **THEN** all stat values are reset (including INT becoming empty/0) and `draft.languagesEquipment.selectedLanguages` is set to an empty array
