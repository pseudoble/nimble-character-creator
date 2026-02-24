## 1. Stat Tooltips

- [x] 1.1 Add `description` field to each entry in `STAT_FIELDS` in `stats-skills-form.tsx` with brief flavor text for STR, DEX, INT, WIL
- [x] 1.2 Wrap each stat label in a `Tooltip`/`TooltipTrigger`/`TooltipContent` using the existing tooltip primitives, displaying the description on hover

## 2. Conditional Type Field

- [x] 2.1 Add optional `type?: "advantage" | "disadvantage"` to the conditional interface in `TraitModifiers` in `trait-modifiers.ts`
- [x] 2.2 Tag the Elf Lithe conditional with `type: "advantage"` in `ancestryModifiers`
- [x] 2.3 Update `SaveIndicator` / `ConditionalIcon` rendering in `character-sheet.tsx`: when a conditional has `type: "advantage"`, render `▲` (cyan); when `type: "disadvantage"`, render `▼` (amber); otherwise keep existing `?` tooltip behavior
- [x] 2.4 Update `VitalRow` to render typed conditionals as compact triangle indicators with tooltip instead of inline `(qualifier)` text
- [x] 2.5 Update skill rows to render typed conditionals as compact triangle indicators with tooltip

## 3. Background Language Grants

- [x] 3.1 Add `languages?: string[]` to the `TraitModifiers` interface in `trait-modifiers.ts`
- [x] 3.2 Set `"raised-by-goblins": { languages: ["goblin"] }` in `backgroundModifiers`
- [x] 3.3 Update `computeSheetData` in `compute-sheet-data.ts` to merge background-granted languages into the final languages list, deduplicating against ancestry and manual selections

## 4. Single Page Scroll

- [x] 4.1 Remove `lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto` from both panel divs in `creator-shell.tsx`
