## Why

When a user lowers their INT stat allocation in Step 3 after already selecting bonus languages in Step 4, the selected languages persist in draft state even though the character no longer qualifies for them. This creates an invalid state that only surfaces as a validation error when the user returns to Step 4, with no automatic correction.

## What Changes

- Add reactive logic so that when INT is lowered in Step 3, any excess bonus language selections in Step 4 are automatically trimmed or cleared
- If INT drops to 0 or below, all bonus language selections are cleared
- If INT drops but remains positive, excess selections are trimmed (last-selected removed first)

## Capabilities

### New Capabilities

_None_ — this is a behavioral fix within existing capabilities.

### Modified Capabilities

- `creator-step-four-languages`: Adding a requirement that language selections are automatically reset/trimmed when INT stat allocation changes in a way that reduces the number of allowed bonus languages

## Impact

- `src/lib/creator/context.tsx` — stat update logic needs to trigger language selection trimming
- `openspec/specs/creator-step-four-languages/spec.md` — new requirement scenarios for cross-step reactivity
- Tests for the new reset behavior
