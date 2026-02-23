## Context

Step 3 of the character creator wizard collects stat array selection, stat assignment, and skill allocation. Currently, when a user changes their stat array selection, the previously assigned stat values and skill allocations persist. This creates a confusing UX where stale values from the old array remain, failing validation until the user manually clears and reassigns everything.

The state is managed in `CreatorProvider` via `updateStepThree`, which shallow-merges partial updates into `draft.stepThree`. The form calls `onChange({ statArrayId: e.target.value })` on array change, which only updates the array ID without touching `stats` or `skillAllocations`.

## Goals / Non-Goals

**Goals:**
- Automatically reset `stats` when `statArrayId` changes
- Preserve `skillAllocations` across stat array changes
- Maintain a clean, predictable UX when switching arrays

**Non-Goals:**
- Preserving stat assignments that happen to be valid in the new array
- Adding confirmation dialogs before resetting

## Decisions

### Reset in `updateStepThree` (context layer) vs. form `onChange`

**Decision**: Handle reset in `updateStepThree` within `context.tsx`.

**Rationale**: The context layer already tracks the previous draft state. By detecting when `updates.statArrayId` differs from `prev.stepThree.statArrayId`, we can inject the reset there. This keeps the form layer simple (it just reports what changed) and ensures the reset happens regardless of how `updateStepThree` is called. The alternative — resetting in the form's `onChange` handler — would scatter state management logic across layers.

### Reset stats only, preserve skill allocations

**Decision**: Only reset `stats`; preserve `skillAllocations`.

**Rationale**: Skill allocations are independent of stat array choice — they represent the player's desired skill distribution regardless of which stat values are assigned. Preserving them avoids unnecessary rework when the user just wants to try different stat distributions.

## Risks / Trade-offs

- **User loses work on array switch** → Acceptable since the old values would be invalid anyway and the user would need to redo them manually. The form is small enough that re-entry is fast.
- **No undo** → Consistent with how the rest of the wizard works. The previous array can be re-selected and values re-entered.
