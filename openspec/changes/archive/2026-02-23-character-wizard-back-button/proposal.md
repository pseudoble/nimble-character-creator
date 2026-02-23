## Why

The character creation wizard currently only supports forward navigation. Users who advance to Step 2 and want to change their Step 1 selections (e.g., switch class) have no way to go back — they must refresh the page and lose their step position. This is a basic usability gap.

## What Changes

- Add a "Back" button to the wizard shell that navigates to the previous step
- The back button is hidden on Step 1 (no previous step exists)
- Back navigation is always available — it is not gated by validation
- The wizard footer layout changes from a single right-aligned button to a two-button layout (Back left, Next/Finish right)

## Capabilities

### New Capabilities

_(none — this is a modification to an existing capability)_

### Modified Capabilities

- `creator-wizard-shell`: Adding backward navigation alongside existing forward-only navigation

## Impact

- `src/lib/creator/wizard-shell.tsx` — new back button, updated footer layout, new `handleBack` handler
- `__tests__/creator/wizard-navigation.test.ts` — new test cases for back navigation behavior
