## Why

The creator's right panel currently displays a raw JSON debug view of the `CreatorDraft`. This is useful for development but meaningless to players. Replacing it with a proper character sheet that populates live during creation — and providing a full-page sheet view after finishing — gives players immediate feedback and a usable output from the creator.

## What Changes

- Remove the `DebugPanel` component and its usage in `CreatorShell`
- Create a live character sheet preview component that replaces the debug panel in the right column during creation
- Sections appear progressively as the form is filled — incomplete sections are hidden
- All derived values (final skill scores, HP, initiative, speed, armor, max wounds, inventory slots, max hit dice) are fully calculated on the sheet
- Ancestry and background effects are codified as structured modifier data at development time, not parsed at runtime
- Conditional modifiers (e.g., Kobold +3 Influence vs friendly characters, Ratfolk +2 armor while moved) display the base calculated score plus a tooltip icon explaining the condition
- The "Finish" button validates all steps and redirects to a new `/sheet` page displaying the full-page character sheet
- Equipment choice of "Starting Gold" displays 50 gp on the sheet

## Capabilities

### New Capabilities
- `character-sheet-preview`: Live character sheet component shown in the right panel during creation, with progressive section visibility based on form completion
- `character-sheet-page`: Full-page character sheet view at `/sheet` rendered after completing creation
- `ancestry-background-modifiers`: Structured modifier data for all ancestry and background traits, encoding flat bonuses (speed, armor, wounds, hit dice, initiative, skills) and conditional effects with tooltip descriptions

### Modified Capabilities
- `creator-wizard-shell`: "Finish" button on the last step validates all steps and redirects to `/sheet`; right panel switches from `DebugPanel` to the live character sheet preview
- `creator-debug-panel`: Removed entirely, replaced by character sheet preview

## Impact

- **Components**: `DebugPanel` removed; new `CharacterSheetPreview` and full-page sheet components created
- **Routing**: New `/sheet` route added
- **Data layer**: New module for ancestry/background modifier definitions and derived value calculation functions
- **Core data**: May need to extend ancestry/background JSON or create a parallel modifier map
- **Dependencies**: No new external dependencies expected; tooltip primitive already exists
