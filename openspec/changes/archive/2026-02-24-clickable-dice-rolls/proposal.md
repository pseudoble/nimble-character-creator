## Why

The character sheet displays stat and skill modifiers as static text. Players need a way to quickly roll ability checks directly from the sheet — clicking a modifier should trigger a visually satisfying 3D dice roll using `1d20+X` notation, bringing the sheet to life as a playable tool rather than a read-only summary.

## What Changes

- Integrate the `@3d-dice/dice-box` npm library for 3D dice rendering
- Add a full-viewport invisible dice canvas overlay on the `/sheet` page
- Make stat modifier values (STR, DEX, INT, WIL) clickable — clicking rolls `1d20+X`
- Make skill total values clickable — clicking rolls `1d20+X`
- Display roll results in a toast/badge after dice settle (e.g., "STR Check: 14 + 2 = 16")
- Canvas uses `pointer-events: none` except during active dice animation

## Capabilities

### New Capabilities
- `dice-rolling`: Integration with `@3d-dice/dice-box`, full-viewport dice canvas overlay, roll triggering, and result display

### Modified Capabilities
- `character-sheet-page`: Stat and skill modifier values become clickable roll triggers on the `/sheet` page

## Impact

- **New dependency**: `@3d-dice/dice-box` npm package
- **Static assets**: dice-box assets must be copied to `/public/assets/dice-box/`
- **Affected code**: `/src/lib/sheet/character-sheet.tsx` (clickable values), `/src/app/sheet/page.tsx` (dice canvas mount)
- **Performance**: dice-box uses BabylonJS + AmmoJS via web workers; lazy-loaded on first roll to avoid impacting initial page load
