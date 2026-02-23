## 1. State Management Update

- [x] 1.1 Add a `resetStep` action type to the creator state types in `src/lib/creator/types.ts`.
- [x] 1.2 Implement the `resetStep(stepIndex)` reducer logic in `src/lib/creator/context.tsx` to clear only the corresponding step's data.
- [x] 1.3 Update state management tests to verify `resetStep` properly clears the target step without affecting other steps' data.

## 2. Wizard UI Update

- [x] 2.1 Update the wizard shell footer in `src/lib/creator/creator-shell.tsx` to include a "Reset" button next to the forward navigation buttons.
- [x] 2.2 Hook up the "Reset" button to call the `resetStep` action using the currently active step index.
- [x] 2.3 Apply appropriate visual styling (e.g., ghost variant) to the "Reset" button so it's not confused with primary navigation.

## 3. Integration & Testing

- [x] 3.1 Update or add wizard shell integration tests (e.g., in `__tests__/creator/wizard-navigation.test.ts`) to verify clicking the "Reset" button correctly clears the active step's data.
- [x] 3.2 Ensure end-to-end functionality works as expected through manual verification in the browser on all 3 steps.
