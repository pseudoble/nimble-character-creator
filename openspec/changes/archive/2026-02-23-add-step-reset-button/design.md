## Context

The character creation flow is split across three steps within a wizard shell (`src/lib/creator/creator-shell.tsx`). The state is managed globally for the wizard (likely via `src/lib/creator/context.tsx`). Currently, users can navigate back and forth, and their progress is persisted via `draft-persistence.ts`, but there's no way to quickly clear out the selections for the active step if they want to start that specific step over from scratch.

## Goals / Non-Goals

**Goals:**
- Provide a "Reset Step" action that clears the form data/state exclusively for the currently active step.
- Update the UI in the wizard shell footer to include this reset button.
- Ensure the reset action correctly triggers any relevant re-renders or validation updates for the active step.
- Ensure the reset does not affect data persisted for previous or future steps.

**Non-Goals:**
- A global "Reset Entire Draft" button (this is explicitly out of scope for this change).
- Modifying the layout or styling of the wizard shell beyond adding the new button.

## Decisions

1.  **State Management Action:** We will introduce a new action in the creator context (e.g., `resetStep(stepId)`) that takes the current step identifier (1, 2, or 3) and resets only the relevant slice of the state to its initial empty/default values.
2.  **Button Placement:** The "Reset" button will be placed in the footer of the `creator-shell.tsx` component, likely styled as a secondary, destructive, or ghost button to visually separate it from primary forward navigation actions.
3.  **Active Step Detection:** The reset button's click handler will use the current route or active step state to determine which step's data needs to be cleared, keeping the component generic across all steps.

## Risks / Trade-offs

-   **Risk:** Accidentally clearing data from another step.
    **Mitigation:** The `resetStep` action in the state context must be strictly scoped to the data structures of the provided step index. Comprehensive unit tests should verify this isolation.
-   **Risk:** Users accidentally clicking "Reset" instead of "Next" or "Back".
    **Mitigation:** Use appropriate visual styling (e.g., ghost variant, different color, or strategic spacing) to ensure it's not easily confused with primary navigation buttons.
