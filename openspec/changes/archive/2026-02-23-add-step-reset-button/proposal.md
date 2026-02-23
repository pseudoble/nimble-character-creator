## Why

Users currently have no quick way to clear the data they've entered on a specific step of the character creation wizard if they change their mind or want to start that step over. Adding a "Reset" button provides a standard, expected UX pattern that improves the flow and reduces friction when users want to clear their selections on the current step.

## What Changes

- Add a "Reset" button to the wizard shell navigation footer, situated near the "Next" (or "Finish") button.
- The "Reset" button will clear all form data/selections for the *current* active step only.
- It will not affect data entered on previous or future steps.
- The button will be available on all steps of the wizard.

## Capabilities

### New Capabilities
None.

### Modified Capabilities
- `creator-wizard-shell`: The wizard shell footer navigation requirements are being modified to include a "Reset" button that clears the state for the current active step.

## Impact

- **UI/Components**: The wizard shell footer component will need to be updated to include the new button.
- **State Management**: The underlying state management (e.g., Zustand store or React Context) will need a new action to reset the state slices corresponding to individual steps.
- **Testing**: Automated tests for the wizard shell will need to be updated to verify the presence and functionality of the reset button on each step.
