## Context

Creator Step 4 currently handles only equipment/gold selection at route `/create/equipment-money`. The Nimble rulebook defines language selection as a character sheet step that depends on INT (determined in Step 3) and ancestry (determined in Step 2). Both prerequisites are already captured in the draft by the time the user reaches Step 4, making this the natural place to add language selection.

Ancestry languages are currently embedded in trait description strings (e.g., "Know Elvish if INT is not negative."). There is no structured language data file — the complete language list exists only in the reference rulebook.

## Goals / Non-Goals

**Goals:**
- Add language display and selection to Step 4 (above existing equipment section)
- Rename the step from "Equipment & Money" to "Languages & Equipment" (label, route, constants)
- Add structured `languages.json` core data and `ancestryLanguage` field to ancestry data
- Persist and validate language selections in the creator draft
- Handle all edge cases: negative INT (no ancestry language, no picks), zero INT (ancestry language only), positive INT (ancestry language + picks)

**Non-Goals:**
- Custom/homebrew language input (future roadmap item)
- Changing how ancestry trait descriptions are displayed elsewhere
- Adding a separate Step 5 for languages

## Decisions

### 1. Add `ancestryLanguage` field to ancestry JSON rather than parsing trait strings

Parsing "Know Elvish if INT is not negative" from `traitDescription` is fragile. Adding a structured `ancestryLanguage` field (e.g., `"ancestryLanguage": "elvish"` or `null`) to `ancestries.json` makes the data explicit and machine-readable.

**Alternative considered**: Regex parsing of trait descriptions at runtime. Rejected — brittle, harder to test, and the trait text format isn't guaranteed to be stable.

### 2. New `languages.json` core data file

A flat array of language objects with `id`, `name`, and `speakers` (flavor text from the rulebook). This follows the existing pattern of JSON data files in `src/lib/core-data/data/`. The language IDs will use lowercase kebab-case matching the language names (e.g., `"thieves-cant"`, `"deep-speak"`).

### 3. Store `selectedLanguages: string[]` on `StepFourData`

Language IDs chosen by the user via INT picks are stored as a string array alongside `equipmentChoice`. This keeps all Step 4 state in one place.

**What's NOT stored**: Common and ancestry language are not stored in `selectedLanguages` — they're derived at render time from ancestry + INT. Only user-chosen bonus languages go in the array.

**Alternative considered**: Storing all known languages (including Common and ancestry). Rejected — derived data shouldn't be persisted; it creates sync issues if the user goes back and changes ancestry or stats.

### 4. Route rename: `/create/equipment-money` → `/create/languages-equipment`

The STEP_IDS constant changes from `EQUIPMENT_MONEY: "equipment-money"` to `LANGUAGES_EQUIPMENT: "languages-equipment"`. The Next.js page directory moves from `src/app/create/equipment-money/` to `src/app/create/languages-equipment/`. All references throughout the codebase (wizard shell steps, validation, context, tests) update accordingly.

### 5. Validation: language count must match INT (when INT > 0)

Step 4 validation expands to check:
- Equipment choice is still required (existing)
- If INT > 0, `selectedLanguages.length` must equal INT value
- Selected language IDs must be valid (exist in `languages.json`)
- Selected languages must not include Common or the ancestry language (those are auto-granted)
- No duplicates

When INT <= 0, `selectedLanguages` must be empty.

### 6. Draft schema version bump to 3

`DRAFT_SCHEMA_VERSION` bumps from 2 to 3. The `loadDraft` backfill logic adds `selectedLanguages: []` for drafts missing it. `ACCEPTED_VERSIONS` expands to `[1, 2, 3]`.

### 7. Language section renders above equipment section

The Step 4 form component renders in two sections: Languages (top) then Equipment (bottom). This matches the rulebook ordering (Section 5: Languages comes conceptually before equipment in the character sheet flow, and in our combined step it leads).

## Risks / Trade-offs

- **[Breaking route change]** → Any bookmarked `/create/equipment-money` URLs will 404. Acceptable for pre-launch app with no public users. The step guard redirect logic will catch direct navigation attempts and redirect to the first incomplete step.
- **[Ancestry data modification]** → Adding `ancestryLanguage` field changes the shape of `ancestries.json`. All ancestry consumers need to tolerate the new field. Since the field is additive (not modifying existing fields), existing code won't break — it simply ignores unknown properties.
- **[INT change after language selection]** → If a user goes back to Step 3 and changes their INT allocation, their language selections may become invalid (too many or too few). The existing reset-on-revisit behavior handles this — Step 4 data resets when the user re-enters the step from a previous step, OR validation catches it and prevents advancement.
