## Context

The app uses Tailwind CSS v4.2 utility classes for all font sizing. There are 79 font size class usages across 13 files, using 5 distinct size tiers: `text-[10px]`, `text-xs`, `text-sm`, `text-lg`, and `text-2xl`. No custom theme font-size tokens are defined — everything uses Tailwind defaults.

## Goals / Non-Goals

**Goals:**
- Increase all font sizes by ~20% via a one-step-up shift in Tailwind size classes
- Maintain the existing visual hierarchy (smallest text stays smallest, headers stay largest)
- Keep the change mechanical and predictable — no subjective redesign

**Non-Goals:**
- Introducing a custom font-size scale or design tokens for sizes
- Changing font families, weights, or line-heights
- Responsive font sizing or viewport-based scaling
- Redesigning layouts to accommodate new sizes

## Decisions

### 1. Shift each Tailwind class up one step in the standard scale

| Current Class | New Class | Approx Increase |
|--------------|-----------|-----------------|
| `text-[10px]` | `text-xs` (12px) | +20% |
| `text-xs` (12px) | `text-sm` (14px) | +17% |
| `text-sm` (14px) | `text-base` (16px) | +14% |
| `text-lg` (18px) | `text-xl` (20px) | +11% |
| `text-2xl` (24px) | `text-3xl` (30px) | +25% |

**Rationale**: Using Tailwind's built-in scale keeps the approach simple and avoids custom CSS. The percentage varies slightly per step (11–25%) but averages close to 20% and preserves the relative hierarchy.

### 2. Simple find-and-replace per class, no new abstractions

Each size class gets a direct 1:1 replacement. No shared constants or theme tokens for font sizes — the codebase doesn't have them now and this change doesn't warrant introducing them.

**Rationale**: Minimal diff, easy to review, easy to revert.

## Risks / Trade-offs

- **Layout overflow in tight spaces** → Manually verify stat grids in character-sheet.tsx and the creator skill grid where `text-[10px]` was used to fit content. May need minor width/padding tweaks.
- **~14-17% increase on smaller sizes vs 20% target** → Acceptable trade-off for using standard Tailwind classes instead of custom values.
- **text-2xl → text-3xl is a 25% jump** → Only used once (gold display), visually acceptable.
