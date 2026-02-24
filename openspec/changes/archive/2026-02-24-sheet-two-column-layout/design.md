## Context

The `CharacterSheet` component in `src/lib/sheet/character-sheet.tsx` renders all sections in a single `space-y-4` vertical stack. The Skills section produces ~13 short rows that leave significant horizontal whitespace, while the info sections (Ancestry Trait, Background, Equipment, Gold, Languages) are each small but add vertical height when stacked.

Both the `full` variant (used on `/sheet`) and the `preview` variant (used in the creator sidebar) share the same component and layout.

## Goals / Non-Goals

**Goals:**
- Reduce vertical height by placing Skills beside the info sections
- Fill horizontal negative space in the Skills section
- Apply consistently to both `full` and `preview` variants

**Non-Goals:**
- Responsive breakpoints or mobile-specific layout (can be addressed later if needed)
- Changing any section content, styling, or data computation
- Rearranging the order of sections within either column

## Decisions

### Wrap Skills + info sections in a CSS grid

Use a `grid grid-cols-2 gap-4` container around the Skills section (left) and a stacked column of Ancestry Trait, Background, Equipment, Gold, and Languages (right).

**Why grid over flexbox:** Grid gives us clean 50/50 column control without worrying about flex-basis or shrink behavior. The columns are independent heights — Skills will likely be taller, and we want the right column to simply top-align its children.

**Why not a separate layout per variant:** Both variants render the same JSX structure. The preview panel is narrower but the content (short skill names, small info cards) is compact enough for two columns. Keeping a single layout path avoids divergence.

### Right column uses a stacked `space-y-4` div

The right column sections remain individually wrapped in their existing card containers. They stack vertically within a wrapper div, inheriting the same `space-y-4` spacing used by the current top-level layout.

### Sections above the grid (Header, Stats, Vitals) remain full-width

These sections benefit from full width — Stats uses a 4-column grid, Vitals uses a 2-column grid. They stay in the outer `space-y-4` flow above the two-column region.

## Risks / Trade-offs

- **Narrow preview panel** → Skills column at 50% of an already narrow panel may feel tight. The `w-24` skill name width should still fit but may need adjustment. Mitigation: start with 50/50, adjust if needed.
- **Uneven column heights** → If Skills is much taller than the right column, there'll be empty space at the bottom-right. This is acceptable and expected — it's still better than the current full-width stacking.
