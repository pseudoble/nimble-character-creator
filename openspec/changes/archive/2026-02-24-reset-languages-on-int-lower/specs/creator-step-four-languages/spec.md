## ADDED Requirements

### Requirement: Language selections are trimmed when INT stat is lowered
The system SHALL automatically trim or clear bonus language selections in Step 4 when the INT stat allocation is changed in Step 3 such that the new INT value allows fewer bonus languages than currently selected. When INT drops to zero or below, all bonus language selections SHALL be cleared. When INT drops but remains positive, the selected languages array SHALL be trimmed to the new INT value, preserving earlier selections.

#### Scenario: INT lowered from 2 to 0 clears all language selections
- **WHEN** a character has INT 2 with 2 bonus languages selected and the user changes INT to 0 in Step 3
- **THEN** `draft.stepFour.selectedLanguages` is set to an empty array

#### Scenario: INT lowered from 3 to 1 trims to one language
- **WHEN** a character has INT 3 with 3 bonus languages selected and the user changes INT to 1 in Step 3
- **THEN** `draft.stepFour.selectedLanguages` is trimmed to contain only the first selected language

#### Scenario: INT lowered to negative clears all language selections
- **WHEN** a character has INT 1 with 1 bonus language selected and the user changes INT to -1 in Step 3
- **THEN** `draft.stepFour.selectedLanguages` is set to an empty array

#### Scenario: INT raised does not modify existing selections
- **WHEN** a character has INT 1 with 1 bonus language selected and the user changes INT to 2 in Step 3
- **THEN** `draft.stepFour.selectedLanguages` is unchanged (still contains the 1 previously selected language)

#### Scenario: INT unchanged does not modify selections
- **WHEN** a character has INT 2 with 2 bonus languages selected and the user updates a different stat (e.g., STR) in Step 3
- **THEN** `draft.stepFour.selectedLanguages` is unchanged

#### Scenario: Stat array change clears language selections
- **WHEN** a character has bonus languages selected and the user changes the stat array in Step 3
- **THEN** all stat values are reset (including INT becoming empty/0) and `draft.stepFour.selectedLanguages` is set to an empty array

### Requirement: Language selection trimming is covered by automated tests
The project SHALL include automated tests verifying that language selections are correctly trimmed or cleared when INT is lowered.

#### Scenario: Tests cover INT reduction clearing languages
- **WHEN** automated tests run for the creator context
- **THEN** tests verify that lowering INT clears or trims `selectedLanguages` appropriately

#### Scenario: Tests cover INT increase preserving languages
- **WHEN** automated tests run for the creator context
- **THEN** tests verify that raising INT does not remove existing language selections
