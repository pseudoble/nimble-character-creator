## Why

Each class has exactly two "key stats" that define its identity, but the character sheet displays all four stats identically with no visual distinction. Players have no quick way to tell which stats matter most for their class.

## What Changes

- The stats section on both the character sheet preview and full character sheet will display a 🔑 (U+1F511) icon next to each key stat label
- `SheetData` will expose `keyStats: string[]` so the `CharacterSheet` component can identify which stats to decorate

## Capabilities

### New Capabilities

_(none)_

### Modified Capabilities

- `character-sheet-page`: Stats section now renders a 🔑 icon next to key stat labels on the full sheet
- `character-sheet-preview`: Stats section now renders a 🔑 icon next to key stat labels in the preview variant

## Impact

- `src/lib/sheet/compute-sheet-data.ts` — `SheetData` interface gets `keyStats: string[]`; `computeSheetData` populates it from `cls?.keyStats ?? []`
- `src/lib/sheet/character-sheet.tsx` — stat label row checks `data.keyStats.includes(stat)` and renders 🔑 when true
- No breaking changes, no new data files, no API changes
