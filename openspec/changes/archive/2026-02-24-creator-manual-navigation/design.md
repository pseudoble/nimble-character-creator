## Context

The creator uses a 4-step accordion in `creator-shell.tsx`. Currently, completing a step auto-advances to the next, and steps are locked until all prior steps are valid. State is managed via `CreatorProvider` in `context.tsx` with per-step validation and a `resetStep` function. A single Reset button below the accordion resets the current step.

## Goals / Non-Goals

**Goals:**
- User controls all navigation (no auto-advance)
- All steps always accessible (no locking)
- Clear visual feedback on step completion status
- Per-step Reset/Next buttons inside each accordion section
- Full-form Reset All button

**Non-Goals:**
- Changing step validation logic itself
- Modifying individual step form components
- Changing draft persistence behavior

## Decisions

### 1. Track "touched" state per step

**Decision**: Add a `touchedSteps: Set<string>` to creator context. A step becomes touched when the user clicks Next past it or manually opens and then leaves it.

**Rationale**: The "needs attention" indicator should only show for steps the user has visited, not untouched future steps. A simple set in context is sufficient — no need for per-field tracking since the indicators are at the step level.

**Alternatives**: Could track touched at the field level, but that's over-engineered for step-level indicators.

### 2. Three-state accordion headers

**Decision**: Derive header state from validation + touched:
- **Untouched** (`!touched && !valid`): Show step number, neutral styling
- **Complete** (`valid`): Show checkmark icon, success styling (already exists)
- **Needs attention** (`touched && !valid`): Show warning icon with tooltip listing missing fields, warning border color

**Rationale**: Gives clear visual feedback without being aggressive. Untouched steps look neutral, so the user isn't overwhelmed with warnings on first load.

### 3. Per-step button placement

**Decision**: Render a button row at the bottom of each expanded accordion section content area. Reset on the left, Next/Finish on the right.

**Rationale**: Buttons inside the section keep the action close to the content. Placing them at the bottom follows natural reading flow.

### 4. "Reset All" replaces bottom Reset

**Decision**: Repurpose the existing Reset button below the accordion to call a new `resetAll` function in context that resets all steps and clears `touchedSteps`.

**Rationale**: Per-step reset is now handled inside each section, so the bottom button serves better as a full-form reset.

### 5. Remove auto-advance and locking logic

**Decision**: Delete the `useEffect` that watches validation transitions and advances steps. Delete the `isStepLocked` function and remove the `isLocked` prop from `AccordionSection`. Remove the `prevValidationRef` and `userClickedRef` refs that supported auto-advance.

**Rationale**: These are the core behaviors being replaced. Clean removal avoids dead code.

## Risks / Trade-offs

- **Users may leave steps incomplete without realizing** → Mitigated by the warning indicators and tooltip showing what's missing
- **Removing locking means validation errors may appear on steps with no data** → Mitigated by "touched" gating — warnings only show after interaction
