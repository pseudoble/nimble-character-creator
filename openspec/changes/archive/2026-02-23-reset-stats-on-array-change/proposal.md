## Why

When a user changes their stat array selection in Step 3, the previously assigned stat values and skill point allocations are not cleared. This leaves the form in a confusing intermediate state where old values from the previous array persist, failing validation silently until the user manually reassigns everything.

## What Changes

- When `statArrayId` changes, automatically reset `stats` (str, dex, int, wil) to empty strings
- Skill allocations are preserved across stat array changes
- This ensures the stat form returns to a clean state matching the newly selected array

## Capabilities

### New Capabilities

_(none)_

### Modified Capabilities

- `creator-step-three-stats-skills`: Add requirement that changing stat array selection resets assigned stat values (skill allocations preserved)

## Impact

- `src/lib/creator/context.tsx` — `updateStepThree` logic needs to detect `statArrayId` changes and clear dependent fields
- `src/lib/creator/step-three-form.tsx` — may need adjustment if reset logic lives in the form layer
- Tests for step three validation and form behavior
