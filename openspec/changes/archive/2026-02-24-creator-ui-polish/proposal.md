## Why

The character creator and sheet preview have several rough edges that hurt usability: stats lack explanatory tooltips, advantage indicators are verbose text instead of compact symbols, the "Raised by Goblins" background doesn't mechanically grant the Goblin language, and both panels have independent scrollbars instead of a single page scroll.

## What Changes

- Add brief tooltip descriptions to each stat (STR, DEX, INT, WIL) in the Assign Stats section of the creator form
- Introduce a `type` field on trait conditionals to distinguish simple advantage/disadvantage from complex conditionals; render simple ones as compact `▲`/`▼` symbols instead of verbose text like "(Advantage on Initiative)"
- Add a `languages` field to `TraitModifiers` so backgrounds can grant languages mechanically; wire "Raised by Goblins" to grant Goblin
- Remove sticky positioning and per-panel overflow scrolling from both the accordion and sheet preview panels, giving the page a single natural scrollbar

## Capabilities

### New Capabilities

_(none)_

### Modified Capabilities

- `creator-step-three-stats-skills`: Add tooltip descriptions to stat assignment dropdowns
- `ancestry-background-modifiers`: Add `type` field to conditionals for advantage/disadvantage rendering; add `languages` field for background-granted languages
- `character-sheet-preview`: Render compact `▲`/`▼` indicators for simple advantage/disadvantage conditionals instead of verbose text; merge background-granted languages into computed sheet data
- `creator-accordion-layout`: Remove sticky positioning and independent scroll containers from both panels; single page-level scrollbar

## Impact

- `src/lib/core-data/trait-modifiers.ts` — `TraitModifiers` interface gains `languages?: string[]`; conditionals gain `type?: "advantage" | "disadvantage"`; update data for raised-by-goblins and elf Lithe
- `src/lib/sheet/compute-sheet-data.ts` — merge background-granted languages into language list
- `src/lib/sheet/character-sheet.tsx` — update `VitalRow` and skill row rendering to use compact indicators for typed conditionals
- `src/lib/creator/stats-skills-form.tsx` — add tooltips to `STAT_FIELDS` and render them next to stat labels
- `src/lib/creator/creator-shell.tsx` — remove `lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto` from both panel divs
