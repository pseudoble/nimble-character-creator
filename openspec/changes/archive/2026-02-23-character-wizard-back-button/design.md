## Context

The character creation wizard (`wizard-shell.tsx`) currently only supports forward navigation via a single "Next"/"Finish" button. The wizard has two steps: Character Basics and Ancestry & Background. Users cannot return to a previous step without refreshing the page.

The draft state already persists all step data simultaneously in a single `CreatorDraft` object, so backward navigation requires no state management changes — only UI and navigation logic.

## Goals / Non-Goals

**Goals:**
- Allow users to navigate backward through wizard steps
- Maintain all existing forward navigation and validation behavior unchanged
- Keep the implementation minimal — this is a single button addition

**Non-Goals:**
- Clickable step indicators for direct step jumping
- Keyboard shortcuts for navigation
- Step transition animations

## Decisions

**1. Back button placement: left side of footer, opposite the Next button**

The footer changes from `justify-end` to `justify-between` when a back button is present. On Step 1 the back button is not rendered, keeping the Next button right-aligned as it is today.

Rationale: This is the standard wizard pattern — Back on the left, Next on the right. Users expect this layout.

**2. Back navigation is never validation-gated**

Unlike forward navigation, back navigation is always allowed regardless of the current step's validation state. Users should never be trapped on a step.

**3. Back button uses the outline Button variant**

The back button uses the `outline` variant to visually differentiate it from the primary Next/Finish button, establishing clear visual hierarchy.

**4. handleBack resets showErrors**

When navigating back, `showErrors` is reset to `false` so that the previous step doesn't show validation errors immediately. The previous step's validation state is re-evaluated immediately (same pattern as `handleAdvance`).

## Risks / Trade-offs

- [Minimal scope] No direct step clicking — users must navigate sequentially. This is acceptable for a two-step wizard. → Revisit if more steps are added.
