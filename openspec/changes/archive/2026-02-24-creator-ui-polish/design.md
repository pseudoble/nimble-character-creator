## Context

The character creator has four UI polish issues:
1. Stats (STR/DEX/INT/WIL) in the assignment form have no tooltips — users must already know what each stat does
2. Advantage/disadvantage conditionals render as verbose text like `(Advantage on Initiative)` instead of compact symbols
3. The "Raised by Goblins" background describes granting the Goblin language in prose but doesn't mechanically add it to the sheet
4. Both the accordion and sheet preview panels have independent scroll containers with `lg:sticky` + `overflow-y-auto`, producing two scrollbars instead of one

Current state:
- `STAT_FIELDS` in `stats-skills-form.tsx` is `[{ key, label }]` with no descriptions
- `TraitModifiers.conditionals` is `Array<{ field, description }>` — all conditionals render identically as a `?` tooltip or inline `(qualifier)` text
- `TraitModifiers` has no `languages` field; language resolution in `computeSheetData` only pulls from ancestry and manual selections
- Both panels in `creator-shell.tsx` use `lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto`

## Goals / Non-Goals

**Goals:**
- Add brief hardcoded tooltip descriptions to each stat in the assignment form
- Distinguish simple advantage/disadvantage conditionals from complex ones via a `type` field, rendering the simple ones as compact `▲`/`▼` symbols
- Allow backgrounds to grant languages mechanically via a new `languages` field on `TraitModifiers`
- Replace dual independent scrollbars with a single page-level scrollbar

**Non-Goals:**
- Reworking the conditional system beyond adding the `type` field
- Adding stat descriptions to the character sheet itself (only the creator form)
- Supporting conditional language grants (e.g., "Know X if INT is not negative" for backgrounds — that pattern only applies to ancestries and is already handled)
- Making the sheet preview sticky while accordion scrolls (both panels flow naturally)

## Decisions

### 1. Stat tooltip descriptions — hardcoded in STAT_FIELDS

Add a `description` field to each `STAT_FIELDS` entry. Render via the existing `Tooltip`/`TooltipContent` primitives already used in the skill allocation section.

**Rationale:** No external stat data file exists. Four hardcoded strings is simpler than creating a new data file for four entries. The descriptions are flavor text, not game-mechanical data.

### 2. Conditional type field — explicit `type` on TraitModifiers conditionals

Extend the conditional interface to:
```ts
conditionals?: Array<{
  field: string;
  description: string;
  type?: "advantage" | "disadvantage";
}>;
```

When `type` is set, renderers display `▲` (cyan, advantage) or `▼` (amber, disadvantage) with the full description available as a hover tooltip. When `type` is absent, the existing `?` tooltip or `(qualifier)` text behavior is preserved.

Tag the Elf Lithe conditional with `type: "advantage"`. Leave complex conditionals (like Kobold's "+3 to Influence vs friendly characters") untyped.

**Rationale:** Explicit typing avoids fragile string parsing. The renderer can make a clear visual decision based on a structured field. Only verifiably simple advantage/disadvantage conditionals get tagged.

### 3. Background-granted languages — new `languages` field on TraitModifiers

Add `languages?: string[]` to `TraitModifiers`. In `computeSheetData`, merge background-granted languages into the final languages list (after Common, after ancestry language, before manual selections).

Set `"raised-by-goblins": { languages: ["goblin"] }`.

**Rationale:** Follows the existing modifier pattern. The `languages` field is a simple string array matching language IDs from `languages.json`. No conditional logic needed — if the background grants it, it's always granted.

### 4. Single page scroll — remove sticky/overflow from both panels

Strip `lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto` from both panel `<div>`s in `creator-shell.tsx`. Both panels flow at their natural height, and the browser's page-level scrollbar handles overflow.

**Rationale:** Simplest possible fix. Two independent scrollbars are confusing; a single page scroll is standard and expected. The sheet preview being off-screen when scrolled down is acceptable — users scroll naturally.

## Risks / Trade-offs

- **Sheet preview not visible while editing lower accordion sections** → Acceptable. Users can scroll up to check. This is standard web behavior.
- **Conditional `type` field is optional** → Existing conditionals without `type` continue to work unchanged. No migration risk.
- **Background language grant is unconditional** → Unlike ancestry languages (gated by INT ≥ 0), "Raised by Goblins" always grants Goblin per the description text. If other backgrounds gain conditional language grants in the future, the model would need extending — but that's a future concern.
