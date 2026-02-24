## Why

The `CreatorShell` component's `handleToggle` callback calls `markTouched(prev)` inside a `setExpandedStep` state updater function. Because React state updaters run synchronously during the render phase, this triggers a cross-component setState call (`setTouchedSteps` in `CreatorProvider`) during rendering, producing the console error: "Cannot update a component (`CreatorProvider`) while rendering a different component (`CreatorShell`)."

## What Changes

- Move the `markTouched` call in `handleToggle` out of the `setExpandedStep` updater so it executes before/after the state transition rather than during it
- No behavioral change — touched-step tracking continues to work identically

## Capabilities

### New Capabilities

_(none)_

### Modified Capabilities

- `creator-wizard-shell`: The accordion toggle handler's internal implementation changes to avoid calling cross-component state setters inside a state updater. No requirement-level behavior changes.

## Impact

- **Code**: `src/lib/creator/creator-shell.tsx` — `handleToggle` callback (~5 lines changed)
- **APIs**: None
- **Dependencies**: None
- **Risk**: Minimal — pure internal refactor, no behavioral change
