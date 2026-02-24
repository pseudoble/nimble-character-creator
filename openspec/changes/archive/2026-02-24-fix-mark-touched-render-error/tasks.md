## 1. Fix handleToggle

- [x] 1.1 In `src/lib/creator/creator-shell.tsx`, refactor `handleToggle` to call `markTouched(expandedStep)` before `setExpandedStep` instead of inside its updater function. Guard the call so it only fires when navigating away from a step (i.e., `expandedStep` exists and differs from `stepId`).

## 2. Verify

- [x] 2.1 Run the existing test suite (`npm test`) and confirm all tests pass
- [x] 2.2 Manually confirm (or add a test) that toggling accordion sections no longer produces the "Cannot update a component while rendering a different component" console error
