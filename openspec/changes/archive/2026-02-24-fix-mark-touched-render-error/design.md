## Context

The `CreatorShell` component manages accordion expansion state via `useState`. When a user toggles between accordion sections, `handleToggle` calls `markTouched(prev)` inside the `setExpandedStep` state updater. React state updaters execute synchronously during the render phase, so calling `markTouched` (which triggers `setTouchedSteps` in `CreatorProvider`) violates React's rule against updating one component while rendering another.

## Goals / Non-Goals

**Goals:**
- Eliminate the "Cannot update a component while rendering a different component" console error
- Preserve existing touched-step tracking behavior (the previously expanded step is marked touched when navigating away)

**Non-Goals:**
- Refactoring the touched-step system or validation architecture
- Changing any user-facing behavior

## Decisions

**Move `markTouched` out of the `setExpandedStep` updater**

The `handleToggle` callback currently nests `markTouched(prev)` inside `setExpandedStep((prev) => ...)`. The fix is to read `expandedStep` from the closure (it's already available as component state), call `markTouched` outside the updater, then call `setExpandedStep`.

This works because:
- `expandedStep` is the current value at the time the click handler fires (event handlers see committed state, not stale render-phase state)
- `markTouched` and `setExpandedStep` will batch together in React 18+ automatic batching, so there's no extra re-render

Alternative considered: wrapping `markTouched` in `setTimeout` or `queueMicrotask` — rejected as unnecessarily complex and could cause ordering issues.

## Risks / Trade-offs

- [Minimal risk] The fix reads `expandedStep` from the closure instead of the updater's `prev` argument. In React 18+ event handlers, state reads are already batched and consistent, so this is safe. → No mitigation needed.
