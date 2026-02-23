## 1. Back Navigation Logic

- [x] 1.1 Add `handleBack` callback to `wizard-shell.tsx` that decrements `currentStepIndex`, resets `showErrors` to false, and re-validates the previous step
- [x] 1.2 Update the wizard footer layout: change from `justify-end` to conditional `justify-between` (when back button is present) or `justify-end` (Step 1)

## 2. Back Button UI

- [x] 2.1 Render a "Back" Button with `variant="outline"` in the wizard footer, visible only when `currentStepIndex > 0`
- [x] 2.2 Wire the back button's `onClick` to `handleBack` with appropriate `aria-label`

## 3. Tests

- [x] 3.1 Add test: back button is not rendered on Step 1
- [x] 3.2 Add test: back button is rendered on Step 2
- [x] 3.3 Add test: clicking back navigates to Step 1 with draft data preserved
- [x] 3.4 Add test: back navigation works even when Step 2 has invalid data
- [x] 3.5 Add test: validation errors are not shown after navigating back
