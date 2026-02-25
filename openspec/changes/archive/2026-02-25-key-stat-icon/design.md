## Context

Each class in the game has exactly two "key stats" (e.g., a Berserker's key stats are STR and WIL). This information lives on the `Class` data type as `keyStats: string[]` and is already used in the creator UI (`character-basics-form.tsx`) to display stat labels. The character sheet stats section renders all four stats identically — no visual distinction between a character's primary and secondary stats.

The `CharacterSheet` component receives its data through the `SheetData` interface, which is populated by `computeSheetData`. `SheetData` currently omits `keyStats`, so the component has no way to know which stats to highlight.

## Goals / Non-Goals

**Goals:**
- Display 🔑 (U+1F511) next to key stat labels in the stats section of both preview and full sheet variants
- Pass `keyStats` through the data layer so the component can render it without special-casing class logic

**Non-Goals:**
- Changing the position, size, or color of stat values
- Making the key icon interactive or providing a tooltip
- Highlighting key stats in the skills section (skills already show their governing stat)

## Decisions

**Decision: Add `keyStats: string[]` to `SheetData` rather than re-deriving it in the component**

The `CharacterSheet` component is intentionally a pure rendering component — it receives `SheetData` and renders it. Letting the component import class data to determine key stats would introduce a dependency and couple it to game logic. Passing `keyStats` through `SheetData` keeps the component dumb and the data layer responsible for all derivation.

Alternatives considered:
- Component reads class data directly → couples the component to game data, breaks the existing layering
- Separate prop on `CharacterSheet` → works, but `SheetData` is already the contract; adding a separate prop fragments it

**Decision: Render 🔑 as an inline `<span>` in the stat label row, consistent with existing `SaveIndicator` spans**

The label row already conditionally renders `▲`/`▼` save indicators as inline spans. The 🔑 icon follows the same pattern — a small decorative span alongside the stat abbreviation. No new component is needed.

## Risks / Trade-offs

- **Emoji rendering variance across platforms** → U+1F511 is widely supported. The icon is decorative; inconsistent rendering has no functional impact.
- **`cls` may be null if the draft has no class selected** → `cls?.keyStats ?? []` handles this safely; no key stats render when no class is chosen (preview with no class shows no stats section anyway per existing visibility logic).

## Migration Plan

No migration needed. `SheetData` is a computed type, not persisted.
