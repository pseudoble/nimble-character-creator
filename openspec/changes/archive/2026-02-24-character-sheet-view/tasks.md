## 1. Ancestry & Background Modifier Data

- [x] 1.1 Define the `TraitModifiers` TypeScript interface (flat bonuses, conditionals, hitDieIncrement)
- [x] 1.2 Create ancestry modifier map with entries for all ancestries in `ancestries.json` (human, elf, dwarf, halfling, goblin, orc, half-giant, turtlefolk, ratfolk, kobold, dragonborn, oozeling-construct, gnome, birdfolk, fiendkin, celestial, planarbeing, bunbun, crystalborn, wyrdling, minotaur-beastfolk, stoatling, dryad-shroomling, changeling)
- [x] 1.3 Create background modifier map with entries for all backgrounds in `backgrounds.json` (fearless, wild-one, survivalist, back-out-of-retirement, and empty entries for the rest)

## 2. Derived Value Computation

- [x] 2.1 Create `SheetData` interface defining the fully resolved character sheet data shape
- [x] 2.2 Implement `computeSheetData` pure function that accepts `CreatorDraft` and core data, returns `SheetData`
- [x] 2.3 Implement stat parsing (string stat values from draft → numbers)
- [x] 2.4 Implement skill score computation (governing stat + allocated points + flat ancestry/bg bonuses)
- [x] 2.5 Implement vitals computation (HP, hit die size/count, initiative, speed, armor, max wounds, inventory slots) applying ancestry/bg modifiers
- [x] 2.6 Implement armor string parsing (`"3+DEX"`, `"6+DEX (max 2)"`) to compute final armor value from equipment
- [x] 2.7 Implement hit die increment logic for Oozeling (d6→d8→d10→d12→d20)
- [x] 2.8 Implement language list resolution (Common + ancestry language + selected languages)
- [x] 2.9 Implement equipment resolution (class startingGearIds → resolved gear objects grouped by category)
- [x] 2.10 Write tests for derived value computation covering key scenarios from specs

## 3. Character Sheet Component

- [x] 3.1 Create `CharacterSheet` component accepting `SheetData` and `variant` prop (`"preview"` | `"full"`)
- [x] 3.2 Implement header section (name, class, ancestry, background, motivation)
- [x] 3.3 Implement stats section with save indicators (up-arrow/down-arrow)
- [x] 3.4 Implement vitals section (HP, hit die, initiative, speed, armor, max wounds, inventory slots, size)
- [x] 3.5 Implement skills section with allocated-point dots and final total score
- [x] 3.6 Implement conditional modifier tooltip icons using existing Tooltip primitive
- [x] 3.7 Implement ancestry trait section (trait name + description)
- [x] 3.8 Implement background section (name + description)
- [x] 3.9 Implement equipment section grouped by category (weapons with damage/properties, armor with value, supplies)
- [x] 3.10 Implement gold section (50 gp when gold is chosen)
- [x] 3.11 Implement languages section
- [x] 3.12 Style all sections using cyberpunk design tokens (surface colors, neon accents, mono font for stats/numbers)

## 4. Live Preview Integration

- [x] 4.1 Remove `DebugPanel` component and its import from `CreatorShell`
- [x] 4.2 Create a `CharacterSheetPreview` wrapper that reads `CreatorDraft` from context, computes `SheetData`, and renders `CharacterSheet` with `variant="preview"`
- [x] 4.3 Implement section visibility logic: hide sections whose source data is incomplete
- [x] 4.4 Wire `CharacterSheetPreview` into the right panel of `CreatorShell` replacing `DebugPanel`

## 5. Finish Button & Sheet Page

- [x] 5.1 Wire the "Finish" button to set `showErrors(true)`, validate all steps, and call `router.push("/sheet")` when all valid
- [x] 5.2 Create `/sheet` route (`src/app/sheet/page.tsx`) that reads draft from localStorage via existing persistence module
- [x] 5.3 Implement redirect to `/create` when no valid draft exists in localStorage
- [x] 5.4 Render `CharacterSheet` with `variant="full"` and full-width centered layout on the sheet page

## 6. Cleanup

- [x] 6.1 Delete `debug-panel.tsx` file
- [x] 6.2 Remove the `creator-debug-panel` spec's requirements from main specs (handled at archive time, but verify no stale references)
