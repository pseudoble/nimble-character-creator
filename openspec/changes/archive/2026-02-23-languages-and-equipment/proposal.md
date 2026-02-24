## Why

Creator Step 4 currently covers only equipment/gold selection. The Nimble rulebook treats Languages as a distinct section (Section 5 of the character sheet) that depends on INT and ancestry — both of which are determined in earlier steps. Adding language selection to Step 4 completes the character creation flow for launch and avoids adding a separate step for a relatively small section.

## What Changes

- Rename Step 4 from "Equipment & Money" to "Languages & Equipment" throughout the wizard (nav labels, URLs, page titles, specs)
- Add a language selection section above the existing equipment choice on Step 4
- Display known languages (Common + ancestry language if INT >= 0) as non-editable items
- If INT > 0, present a picker allowing the user to choose additional languages (one per point of INT) from the remaining language list
- If INT <= 0, display a note that INT is too low for additional language picks
- Add a `languages.json` core data file listing the 10 game languages with descriptions
- Add structured `ancestryLanguage` field to ancestry data so language grants don't need to be parsed from trait description strings
- Persist selected languages in `stepFour` draft state and validate the selection count matches INT
- **BREAKING**: Route changes from `/create/equipment-money` to `/create/languages-equipment`

## Capabilities

### New Capabilities
- `creator-step-four-languages`: Language display and selection UI within Step 4, including known-language display, INT-based picker, and draft persistence/validation

### Modified Capabilities
- `creator-step-four-equipment`: Route rename from `equipment-money` to `languages-equipment`; step label rename; stepFour data shape expanded with language fields
- `creator-wizard-shell`: Step 4 label and URL updated from "Equipment & Money" / `equipment-money` to "Languages & Equipment" / `languages-equipment`

## Impact

- **Routes**: `/create/equipment-money` → `/create/languages-equipment`
- **Core data**: New `languages.json`; `ancestries.json` gains `ancestryLanguage` field
- **Types**: `StepFourData` expanded with `selectedLanguages: string[]`
- **Validation**: New validation logic for language count matching INT
- **Draft migration**: Schema version bump to handle drafts without language data
- **Components**: `step-four-form.tsx` gains language section; wizard shell step descriptor updated
- **Tests**: New validation tests for language selection; updated tests for route/label changes
