## 1. Context Layer Changes

- [x] 1.1 Add `touchedSteps` state (Set<string>) and `markTouched` function to CreatorProvider in `context.tsx`
- [x] 1.2 Add `resetAll` function to CreatorProvider that resets all step data, clears touchedSteps, and sets showErrors to false
- [x] 1.3 Expose `touchedSteps`, `markTouched`, and `resetAll` through the creator context

## 2. Remove Auto-Advance and Locking

- [x] 2.1 Remove the auto-advance `useEffect`, `prevValidationRef`, and `userClickedRef` from `creator-shell.tsx`
- [x] 2.2 Remove the `isStepLocked` function and `isLocked` prop from `AccordionSection`
- [x] 2.3 Remove locked visual styling (reduced opacity, disabled click) from `AccordionSection`

## 3. Accordion Header States

- [x] 3.1 Update `AccordionSection` to accept `isTouched` prop and derive three-state indicator (untouched/complete/needs-attention)
- [x] 3.2 Render warning icon with tooltip on needs-attention headers (touched + invalid), showing what's missing
- [x] 3.3 Pass `touchedSteps` from context to each `AccordionSection` in the shell

## 4. Per-Step Buttons

- [x] 4.1 Add Reset and Next/Finish button row inside each expanded accordion section
- [x] 4.2 Wire Next button to collapse current step and expand next step, marking current as touched
- [x] 4.3 Wire per-step Reset button to call `resetStep` for that step
- [x] 4.4 Render "Finish" instead of "Next" for Step 4

## 5. Reset All Button

- [x] 5.1 Change the bottom Reset button label to "Reset All" and wire it to `resetAll`

## 6. Touch Tracking on Navigation

- [x] 6.1 Mark the previously expanded step as touched when the user clicks a different accordion header (in `handleToggle`)

## 7. Tests

- [x] 7.1 Update `wizard-navigation.test.ts` — remove auto-advance and locking tests, add tests for: Next button navigation, per-step Reset, Reset All, touched state tracking, and three-state header indicators
