## 1. Core Data

- [x] 1.1 Create `src/lib/core-data/data/languages.json` with all 10 languages (id, name, speakers)
- [x] 1.2 Add `ancestryLanguage` field to each ancestry in `ancestries.json` — language ID string or `null`, with optional `displayName` override for Gnome (Gnomish) and Orc (Orcish)

## 2. Route & Constants Rename

- [x] 2.1 Rename `STEP_IDS.EQUIPMENT_MONEY` to `STEP_IDS.LANGUAGES_EQUIPMENT` with value `"languages-equipment"` in `constants.ts`
- [x] 2.2 Move `src/app/create/equipment-money/` directory to `src/app/create/languages-equipment/`
- [x] 2.3 Update all references to the old step ID and route throughout the codebase (context.tsx, step-guard, wizard shell step descriptors, tests)

## 3. Types & Draft Persistence

- [x] 3.1 Add `selectedLanguages: string[]` to `StepFourData` in `types.ts`
- [x] 3.2 Update `createEmptyStepFour()` in `draft-persistence.ts` to include `selectedLanguages: []`
- [x] 3.3 Bump `DRAFT_SCHEMA_VERSION` to 3, add version 3 to `ACCEPTED_VERSIONS`, and add backfill logic for drafts missing `selectedLanguages`
- [x] 3.4 Update `isValidStepFourShape` to check for `selectedLanguages` array

## 4. Validation

- [x] 4.1 Update `validateStepFour` to validate language selection: correct count matching INT (when INT > 0), valid language IDs, no duplicates, empty array when INT <= 0
- [x] 4.2 Add automated tests for language validation (correct count passes, wrong count fails, zero/negative INT with empty passes, invalid IDs fail)

## 5. Language Section UI

- [x] 5.1 Build language section in `step-four-form.tsx`: display rule explanation text, show known languages (Common + ancestry language if INT >= 0), show picker for bonus languages when INT > 0, show "INT too low" note when INT <= 0
- [x] 5.2 Update `StepFourFormProps` to accept `ancestryId` and `intStat` (or full draft context needed to derive known languages and pick count)
- [x] 5.3 Update the page component at `languages-equipment/page.tsx` to pass ancestry and INT data to the form

## 6. Wizard Shell Updates

- [x] 6.1 Update step label from "Equipment & Money" to "Languages & Equipment" in the wizard shell step descriptor list
- [x] 6.2 Verify reset behavior clears `selectedLanguages` along with `equipmentChoice`

## 7. Verification

- [x] 7.1 Run existing tests and fix any failures from the rename
- [x] 7.2 Manual verification: walk through creator flow with various ancestry/INT combos (Elf INT 2, Human INT 0, Dwarf INT -1, Gnome INT 1) and confirm correct language display and picker behavior
