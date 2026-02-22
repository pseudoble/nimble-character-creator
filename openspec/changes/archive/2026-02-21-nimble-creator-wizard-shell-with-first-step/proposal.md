## Why

Nimble does not yet provide a guided `/create` experience, so character setup is fragmented and easy to lose between sessions. This change introduces a usable first slice of the creator wizard now so future steps can be added on top of a stable flow shell.

## What Changes

- Add a `/create` multi-step wizard shell with step navigation and shared layout.
- Add progress UI that shows step order and current completion state.
- Persist in-progress draft data so users can refresh or return without losing work.
- Implement Step 1 fields for class selection, character name, and character description.
- Add Step 1 validation rules that block progression when required data is invalid or missing.
- Add automated tests for shell behavior, Step 1 validation, and draft persistence behavior.

## Capabilities

### New Capabilities

- `creator-wizard-shell`: Provides the `/create` route shell, step navigation, progress indicator, and draft persistence for in-progress creation data.
- `creator-step-one-character-basics`: Defines Step 1 inputs (class, name, description), validation rules, and corresponding tests.

### Modified Capabilities

- None.

## Impact

- Affected code: Next.js route and UI components for `/create`, wizard state/draft persistence utilities, and test suites for wizard flow and validation.
- APIs: No external API contract changes in this slice.
- Dependencies: Uses current frontend stack; no required backend or infrastructure changes.
- Systems: Client-side creation workflow UX and local draft behavior.
