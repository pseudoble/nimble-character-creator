## Context

The character creator wizard currently has 3 steps: Character Basics, Ancestry & Background, and Stats & Skills. Each step follows a consistent pattern: a page component reads from `CreatorProvider` context, passes props to a controlled form component, and validation is handled by a Zod-based pure function. Steps are gated by `StepGuard` and navigated via URL paths.

The next player-facing choice in the Nimble rulebook is Equipment & Money: choose between class starting gear or 50 gold pieces.

## Goals / Non-Goals

**Goals:**
- Add Step 4 following all existing wizard patterns (context, validation, persistence, routing, StepGuard)
- Enrich `starting-gear.json` with item stats from the reference (damage, properties, armor values)
- Present a visually appealing side-by-side gear-vs-gold choice with grouped item display

**Non-Goals:**
- Inventory slot management or tracking
- "Spend your gold" shopping flow
- Level multiplier on gold (always 50 gp at level 1)
- Handling the "Made a BAD Choice" background edge case
- Any derived/secondary stats step

## Decisions

### 1. Enrich `starting-gear.json` rather than creating separate item tables

Items in `starting-gear.json` will gain fields for damage, properties, armor value, and type details. Since there's no inventory system yet, a full normalized item database is premature. The starting gear file serves as a self-contained lookup for this step.

**Alternative considered:** Separate `weapons.json` and `armor.json` files referenced by ID. Rejected because it adds indirection for no current benefit — we only need to display these items in one place.

### 2. Extend `CreatorDraft` with `stepFour` following existing patterns

```ts
interface StepFourData {
  equipmentChoice: "gear" | "gold" | "";
}
```

Added to `CreatorDraft` alongside `stepOne`/`stepTwo`/`stepThree`. The context gains `updateStepFour` and `resetStep` support for the new step ID.

**Alternative considered:** Storing as a boolean. Rejected because the empty string `""` clearly represents "no choice made yet" for validation, consistent with how other steps handle unselected state.

### 3. Side-by-side layout with `-OR-` separator

Two selectable card-style boxes arranged horizontally. Left card shows class starting gear grouped by category (weapons, armor, shields, supplies) with stats. Right card shows a gold pile image above "50 gp" in larger text. A `-OR-` label sits between them. Selecting a card highlights it with the active accent style.

The layout follows the existing cyberpunk design system — `border-neon-cyan`, `glow-cyan` for selection, `surface-1`/`surface-3` for card backgrounds.

### 4. Starting gear display: grouped by category, stats inline, no prices

Weapons show damage dice and properties (e.g., "1d10+STR Slashing · 2-handed"). Armor shows armor value (e.g., "Armor 6+DEX (max 2)"). Shields show armor bonus (e.g., "Armor +2"). Supplies show name only. Items are grouped under category headers. No prices shown on the gear side.

### 5. Gold pile artwork as static asset

The gold pile image is placed in `public/` as a static asset and rendered via a standard `<img>` tag on the gold card. Sized to fill the upper portion of the right card.

### 6. Draft schema version bump

`DRAFT_SCHEMA_VERSION` increments to 2 and `createEmptyDraft` gains a default `stepFour: { equipmentChoice: "" }`. The persistence layer's shape validator backfills `stepFour` for v1 drafts, consistent with how the existing code handles schema evolution.

### 7. Wider wizard shell for Step 4

The existing wizard shell uses `max-w-2xl`. The Step 4 side-by-side layout benefits from more horizontal space. The step form itself can use a wider container (e.g., `max-w-4xl`) or the shell can conditionally widen. The simplest approach: the step 4 page component renders its content at wider width within the existing shell, and the shell's `max-w-2xl` is widened to `max-w-4xl` globally since the other steps aren't harmed by a wider container.

## Risks / Trade-offs

- **Enriched starting-gear.json may drift from reference** → Item stats are transcribed manually from the Nimble reference docs. If the game rules update, this data must be manually synced. Acceptable for now since the game content is stable.
- **Side-by-side layout on mobile** → Two columns may be tight on small screens. Mitigation: use responsive classes to stack vertically on mobile (`flex-col` at small breakpoints, `flex-row` at medium+).
- **Gold image asset size** → The provided image is large (4226×2958). It should be reasonably sized for web use. Consider optimizing or using Next.js `Image` component for automatic optimization.
