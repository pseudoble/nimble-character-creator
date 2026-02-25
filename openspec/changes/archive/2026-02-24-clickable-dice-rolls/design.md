## Context

The `/sheet` page renders a read-only character sheet with stat modifiers (STR, DEX, INT, WIL) and skill totals as plain text. Players want to roll ability checks directly from these values. We'll integrate `@3d-dice/dice-box` to render 3D dice across a full-viewport invisible canvas, triggered by clicking any modifier value.

Current rendering:
- Stats: `character-sheet.tsx:153-154` — `<span>` with `formatModifier(data.stats[stat])`
- Skills: `character-sheet.tsx:217-218` — `<span>` with `formatModifier(skill.total)`
- Sheet page: `app/sheet/page.tsx` — simple wrapper that loads draft and renders `<CharacterSheet>`

## Goals / Non-Goals

**Goals:**
- Click any stat or skill modifier on `/sheet` to roll `1d20+X`
- Full-viewport invisible dice canvas (D&D Beyond style) — dice tumble across the entire screen
- Show roll result in a toast after dice settle (label, roll breakdown, total)
- Lazy-load dice-box on first click to avoid impacting initial page load
- Canvas does not block interaction with the sheet underneath

**Non-Goals:**
- Dice rolling on the creator preview (sidebar)
- Rolling weapon damage, hit dice, or other non-check dice
- Dice theme/color customization UI
- Roll history or logging
- Sound effects

## Decisions

### 1. Dice canvas lives in the sheet page, not the CharacterSheet component

The full-viewport canvas overlay belongs in `app/sheet/page.tsx`, not in `CharacterSheet`. The `CharacterSheet` component is shared between preview and full variants — dice rolling is page-level behavior specific to `/sheet`.

**Approach**: Create a `DiceOverlay` component mounted in the sheet page that manages the dice-box instance. Pass an `onRoll` callback down to `CharacterSheet` when `variant="full"`.

**Alternative considered**: Putting the canvas inside `CharacterSheet` with a variant check. Rejected because it couples a page-level concern (viewport overlay) to a presentational component.

### 2. Communication via callback prop

`CharacterSheet` receives an optional `onRoll?: (label: string, modifier: number) => void` prop. When present, stat/skill values render as clickable buttons. When absent (preview variant), they render as plain text — no behavioral change needed for the preview.

**Alternative considered**: React context for dice rolling. Rejected as over-engineered for a single callback.

### 3. Lazy initialization of dice-box

dice-box pulls in BabylonJS + AmmoJS (heavy). We'll dynamically import `@3d-dice/dice-box` on first roll trigger, not on page load. The `DiceOverlay` component holds a ref to the dice-box instance and initializes it lazily.

**Sequence**:
```
First click → dynamic import → init() → roll()
Subsequent clicks → roll() (already initialized)
```

### 4. Pointer events strategy

The canvas sits at `z-index: 50` with `pointer-events: none` by default. During a roll, it switches to `pointer-events: auto` so the dice physics can interact. After `onRollComplete` fires and the result toast displays, it returns to `pointer-events: none`.

### 5. Result display as a dismissible toast

After dice settle, show a small toast in the bottom-center of the screen:

```
┌──────────────────────┐
│  STR Check           │
│  🎲 14 + 2 = 16     │
└──────────────────────┘
```

The toast auto-dismisses after ~4 seconds or on click. Styled with existing design tokens (surface-2 bg, neon-cyan accent, mono font). No external toast library — a simple state-driven component in `DiceOverlay`.

### 6. Static assets via public directory

dice-box requires static assets (3D models, textures). These get copied to `/public/assets/dice-box/` during `npm install` via the library's postinstall script. The `assetPath` config points to `/assets/dice-box`.

## Risks / Trade-offs

- **Bundle size**: BabylonJS + AmmoJS are heavy (~2-3MB). → Mitigated by lazy dynamic import; never loaded until first roll.
- **OffscreenCanvas support**: dice-box uses OffscreenCanvas + web workers. Most modern browsers support this, but older Safari versions may not. → Acceptable for a TTRPG tool; target audience uses modern browsers. If init fails, rolls simply don't trigger (graceful degradation).
- **Asset hosting**: Static 3D assets add to the public directory size. → Acceptable trade-off for the visual payoff.
- **Canvas z-index conflicts**: The overlay sits above everything. → Use a known high z-index (50) and ensure no other UI elements compete.
