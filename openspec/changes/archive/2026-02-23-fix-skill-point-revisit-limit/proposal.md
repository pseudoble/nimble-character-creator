## Why
Fix a bug where returning to the Stats and Skills page allows the user to assign 4 extra skill points if points were previously allocated, although validation correctly catches the error on submission.

## What Changes
- Correct the skill point calculation logic to properly account for existing allocations when the page is revisited.
- Ensure the UI correctly reflects the remaining points and limits additional assignments based on the character's actual capacity.

## Capabilities

### New Capabilities
- (None)

### Modified Capabilities
- creator-step-three-stats-skills: Update requirements for skill point allocation to handle state persistence and re-entry correctly.

## Impact
- Stats and Skills step in the character wizard.
- State management for character creation.
