## Why

The character sheet renders all sections in a single vertical column, which wastes horizontal space—especially in the Skills section, where short rows (skill name, dots, modifier) leave large negative space to the right. Meanwhile, the Ancestry Trait, Background, Equipment, Gold, and Languages sections are individually small but stack vertically, making the sheet unnecessarily tall.

## What Changes

- Restructure the lower half of the character sheet (after Vitals) into a two-column grid layout
- Skills occupies the left column; Ancestry Trait, Background, Equipment, Gold, and Languages stack in the right column
- Both `full` and `preview` variants of the CharacterSheet component use the same two-column layout
- 50/50 column split

## Capabilities

### New Capabilities

_(none — this is a layout modification to existing capabilities)_

### Modified Capabilities

- `character-sheet-page`: Layout changes from single-column to two-column for the skills/info region
- `character-sheet-preview`: Same two-column layout applied to the preview variant

## Impact

- `src/lib/sheet/character-sheet.tsx` — primary file affected; wrapping Skills + info sections in a grid container
- No data model changes, no new dependencies, no API changes
