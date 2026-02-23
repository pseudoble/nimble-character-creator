## 1. Setup & Routing

- [x] 1.1 Create new step page components at `/create/character-basics/page.tsx`, `/create/ancestry-background/page.tsx`, and `/create/stats-skills/page.tsx` that render the existing step content.
- [x] 1.2 Update `/create/page.tsx` to redirect to `/create/character-basics`.
- [x] 1.3 Create a `StepGuard` component (or hook) that checks the current draft state and redirects to the first incomplete step if the user attempts to access a locked step.

## 2. Component Updates

- [x] 2.1 Update the Wizard Shell component to use `usePathname` or similar to determine the active step instead of internal state.
- [x] 2.2 Refactor the Step Indicator component to render clickable `Link` elements for visited/completed steps.
- [x] 2.3 Update the "Back" and "Next" buttons in the wizard footer to navigate via `router.push()` to the correct URL paths.

## 3. Integration & Testing

- [x] 3.1 Verify manual navigation flow: `/create` -> `/create/character-basics` -> `/create/ancestry-background` -> `/create/stats-skills`.
- [x] 3.2 Verify deep linking: Accessing `/create/stats-skills` with an empty draft should redirect to `/create/character-basics`.
- [x] 3.3 Update existing automated tests (e.g., `wizard-navigation.test.ts`) to verify URL changes and redirection logic.
