## Why

When developing and debugging the character creator wizard, there's no easy way to inspect the current state of the `CreatorDraft` object. Adding a `?debug=true` query parameter to any `/create/<step>` URL would let developers see the full character sheet JSON rendered below the form, making it easy to verify state changes during development.

## What Changes

- Add a debug panel component that renders the full `CreatorDraft` as syntax-highlighted JSON
- Read the `debug` query parameter from the URL on each step page
- When `?debug=true` is present, show the debug panel below the form content inside the wizard shell
- Use a `<pre>` block with syntax highlighting (CSS-based, no external dependency)

## Capabilities

### New Capabilities
- `creator-debug-panel`: A collapsible JSON debug viewer for the creator wizard, activated by `?debug=true` query parameter

### Modified Capabilities
- `creator-wizard-shell`: Shell needs to accept and render the debug panel below the form content

## Impact

- **Code**: `src/lib/creator/creator-shell.tsx` (reads query param, conditionally renders debug panel), new component file for the debug panel
- **Dependencies**: None — uses built-in `useSearchParams` from Next.js
- **Risk**: None — debug panel is opt-in and has no effect on normal user flow
