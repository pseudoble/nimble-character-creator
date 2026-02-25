## Why

The character creation accordion and sheet preview are currently equal-width peers (50/50). The sheet preview — the thing the user is building toward — deserves more visual prominence. The accordion should feel like a sidebar control panel, not a co-equal panel. The current card-per-step accordion also takes up more vertical space than needed.

## What Changes

- Change the two-panel split from 50/50 to 40/60, giving the sheet preview more room
- Increase max container width from `max-w-6xl` to `max-w-7xl` so the 40% sidebar still has comfortable form input width
- Restyle the accordion from separate bordered cards to a single unified sidebar panel with a left-edge cyan accent border
- Replace per-step card borders with lightweight divider lines between steps
- Simplify step indicators from numbered circles to smaller dot/dash markers
- Reduce visual weight of collapsed step headers for a more compact feel

## Capabilities

### New Capabilities

_None — this is a restyling of existing layout._

### Modified Capabilities

- `creator-accordion-layout`: Panel split changes from 50/50 to 40/60, max-width increases to 7xl, accordion sections become divider-separated sections within a single sidebar panel instead of individual cards, step indicators simplified, left-edge accent border on sidebar container

## Impact

- `src/lib/creator/creator-shell.tsx` — layout widths, accordion section styling, outer container max-width
- No API, data, or dependency changes
- No behavioral changes — all accordion interactions (expand/collapse, next/reset, validation indicators) remain identical
