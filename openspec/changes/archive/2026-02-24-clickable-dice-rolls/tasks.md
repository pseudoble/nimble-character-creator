## 1. Setup & Dependencies

- [x] 1.1 Install `@3d-dice/dice-box` npm package
- [x] 1.2 Copy dice-box static assets to `/public/assets/dice-box/`
- [x] 1.3 Add `/public/assets/dice-box/` to `.gitignore` if assets are generated at install time, or commit them if not

## 2. Dice Overlay Component

- [x] 2.1 Create `DiceOverlay` component (`src/lib/sheet/dice-overlay.tsx`) with full-viewport canvas container, `pointer-events: none` by default, `z-index: 50`
- [x] 2.2 Implement lazy dynamic import of `@3d-dice/dice-box` — initialize on first `roll()` call, reuse instance on subsequent calls
- [x] 2.3 Implement `roll(label: string, modifier: number)` method that rolls `1d20+X` notation via dice-box
- [x] 2.4 Toggle `pointer-events: auto` during roll animation, revert to `none` on `onRollComplete`
- [x] 2.5 Handle initialization failure gracefully — log warning, disable rolling, keep sheet functional

## 3. Roll Result Toast

- [x] 3.1 Add roll result toast UI inside `DiceOverlay` — shows label, die result, modifier, and total (e.g., "STR Check: 14 + 2 = 16")
- [x] 3.2 Auto-dismiss toast after ~4 seconds, allow early dismiss on click
- [x] 3.3 Style toast with existing design tokens (surface-2 bg, neon-cyan accent, mono font)

## 4. Clickable Modifiers in CharacterSheet

- [x] 4.1 Add optional `onRoll?: (label: string, modifier: number) => void` prop to `CharacterSheet`
- [x] 4.2 When `onRoll` is provided, render stat modifier values as clickable buttons that call `onRoll(statLabel, statValue)`
- [x] 4.3 When `onRoll` is provided, render skill total values as clickable buttons that call `onRoll(skillName, skillTotal)`
- [x] 4.4 Add hover affordance to clickable modifiers (cursor pointer, highlight effect)
- [x] 4.5 When `onRoll` is absent (preview variant), render values as plain text (no behavior change needed)

## 5. Wire Up in Sheet Page

- [x] 5.1 Mount `DiceOverlay` in `app/sheet/page.tsx` and pass its `roll` function as the `onRoll` prop to `CharacterSheet`
