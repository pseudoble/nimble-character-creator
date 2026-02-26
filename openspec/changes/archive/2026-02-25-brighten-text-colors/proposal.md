## Why

The current `text-low` (oklch 0.45) and `text-med` (oklch 0.65) colors have insufficient contrast against the dark background (surface-0 at oklch 0.13). `text-low` in particular falls below WCAG AA contrast ratio (4.5:1) for normal text. This affects readability of labels, metadata, stat details, and secondary content across the character sheet and creator.

## What Changes

- Increase `text-low` lightness from 0.45 to 0.65
- Increase `text-med` lightness from 0.65 to 0.80
- `text-high` remains at 0.93 (already high contrast)

## Capabilities

### New Capabilities

_None_

### Modified Capabilities

- `design-system`: Text color token lightness values are changing to improve contrast and readability

## Impact

- `src/app/globals.css`: Two CSS custom property values change
- All components using `text-text-low` and `text-text-med` classes get brighter text automatically (no component changes needed)
