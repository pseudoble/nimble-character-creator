## Why

Current font sizes across the app are too small for comfortable reading, especially on standard-resolution displays. The smallest text (10px custom class) and the dominant `text-xs` (12px) used for 80% of content make the UI feel cramped. Increasing all font sizes by 20% improves readability and visual hierarchy.

## What Changes

- Scale all Tailwind text size classes up by one step (e.g., `text-xs` → `text-sm`, `text-sm` → `text-base`, etc.)
- Replace custom `text-[10px]` with `text-xs` (12px, the closest 20% increase from 10px)
- Update `text-lg` usages to `text-xl`
- Update `text-2xl` usage to `text-3xl`
- Verify layout still works with larger text (no overflow, truncation issues)

## Capabilities

### New Capabilities

_None — this is a pure visual scaling change._

### Modified Capabilities

- `design-system`: Font size scale is shifting up across all components

## Impact

- **Components affected**: All 13 files using font size classes across `src/components/ui/`, `src/lib/creator/`, and `src/lib/sheet/`
- **79 total class replacements** across the codebase
- Layout may need minor adjustments if larger text causes overflow in tight spaces (stat grids, sheet panels)
- No API, data, or dependency changes
