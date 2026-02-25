## Context

Step 3 (`Stats & Skills`) currently renders the `Assign Stats` section immediately, even when no stat array is selected. The stat controls are disabled in that state, but their presence implies progression is possible before the prerequisite selection.

The stat-array select also keeps a placeholder option (`"Select a stat array..."`) available after a valid selection, allowing users to clear the selection back to empty through the same control.

Validation currently relies on a schema that requires both `statArrayId` and all stat assignments, so when `statArrayId` is empty, users can see both the real gating error (`statArrayId`) and downstream per-stat errors at once.

## Goals / Non-Goals

**Goals:**
- Enforce a stat-array-first UX by hiding `Assign Stats` until a valid stat array is selected.
- Prevent users from re-selecting the placeholder option after they have chosen a valid stat array.
- Make validation precedence explicit: when no stat array is selected, report only the stat-array error and suppress individual stat-assignment errors.
- Preserve existing behavior where changing between valid stat arrays resets stat assignments but keeps skill allocations.

**Non-Goals:**
- Redesign Step 3 skill-allocation layout or interactions.
- Change existing stat-array change side effects beyond the placeholder re-selection restriction.
- Introduce new persistence format or migration mechanics.

## Decisions

### 1) Gate `Assign Stats` visibility on a valid selected stat array

Render `Assign Stats` only when `selectedStatArray` resolves to a valid array record. When no valid array is selected, the section is omitted entirely.

Rationale:
- Matches user mental model: choose array first, then assign.
- Avoids showing inactive controls that produce no immediate value.

Alternatives considered:
- Keep section visible but disabled (current behavior): rejected because it keeps prerequisite ambiguity.

### 2) Make placeholder option initial-only

Keep the placeholder option for initial selection (`value=""`), but disable it once `data.statArrayId` is non-empty so users cannot return to the placeholder through the dropdown.

Rationale:
- Satisfies “do not let the user re-select `Select a stat array...`”.
- Preserves native select behavior and does not require custom combobox logic.

Alternatives considered:
- Remove placeholder option after first selection: rejected due to potential value mismatch/UX inconsistency in native select rendering.

### 3) Add validation precedence for missing stat array

When `statArrayId` is empty, validation returns the stat-array error and suppresses `stats.*` and aggregate `stats` assignment errors. Stat-assignment validation resumes only when a valid array is selected.

Rationale:
- Produces one actionable error at the gating boundary.
- Prevents noisy multi-error states for fields that are intentionally unavailable in UI.

Alternatives considered:
- Keep all errors visible: rejected because it conflicts with gated UX and degrades clarity.

## Risks / Trade-offs

- [Risk] Hidden `Assign Stats` section could break assumptions in tests that expected always-visible stat controls.
  - Mitigation: add/update tests explicitly for hidden-before-selection behavior.

- [Risk] Legacy drafts with invalid non-empty `statArrayId` may still have edge behavior.
  - Mitigation: gate visibility on resolved array object and keep validation erroring on invalid IDs.

- [Trade-off] Users can no longer clear stat array via the Step 3 dropdown directly.
  - Mitigation: clearing remains available through existing step reset/reset-all flows.

## Migration Plan

No data migration is required.

- Existing drafts with empty `statArrayId` will now hide `Assign Stats` and show only stat-array gating error on validation.
- Existing drafts with valid `statArrayId` continue to render and behave as before, except placeholder cannot be re-selected.
- Rollback is straightforward: revert form gating and validation precedence changes.

## Open Questions

- None at this time; behavior is explicitly defined by the confirmed UX and validation precedence requirements.
