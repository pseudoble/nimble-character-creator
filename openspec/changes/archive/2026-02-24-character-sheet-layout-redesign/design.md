## Context

The creator currently uses a multi-page wizard pattern with URL-based step routing (`/create/character-basics`, etc.). Each step is a separate Next.js page under `src/app/create/`. Navigation is handled by `CreatorShell` (horizontal breadcrumb nav + Back/Next buttons) and `StepGuard` (redirect to first incomplete step). State lives in `CreatorContext` with localStorage persistence.

The redesign collapses all steps into a single-page accordion layout with a two-panel structure: form sidebar on the left, draft preview on the right.

## Goals / Non-Goals

**Goals:**
- Replace multi-page wizard with single-page accordion in a two-panel layout
- Reuse existing step form components (`step-one-form.tsx` through `step-four-form.tsx`) without modification
- Reuse existing `CreatorContext`, validation, and persistence unchanged
- Show JSON debug view in the right panel as a draft preview placeholder
- Responsive: side-by-side on `lg+`, stacked on smaller screens

**Non-Goals:**
- Styled character sheet component (future change)
- Derived value calculations in the preview panel (future change)
- Animated accordion transitions (can add later)
- Mobile-specific UX optimizations beyond basic stacking

## Decisions

### Single route at `/create` instead of per-step routes

**Choice**: Remove the four step-specific routes and render everything at `/create`.

**Rationale**: With all steps in an accordion on one page, separate routes add complexity without value. The accordion's open/closed state replaces URL-based navigation. This eliminates `StepGuard`, the redirect logic in `page.tsx`, and the `STEP_PATHS` array.

**Alternative considered**: Hash-based anchors (`/create#stats-skills`) for deep linking. Rejected for now — adds complexity and the accordion state is transient. Can revisit if users need shareable step links.

### Accordion state managed locally in CreatorShell

**Choice**: Track which accordion section is expanded via local `useState` in the reworked `CreatorShell`, not in `CreatorContext`.

**Rationale**: Accordion open/close state is purely UI — it doesn't need persistence or sharing. Keeping it local avoids polluting the draft model. The expanded step is derived on mount: open the first step whose validation fails (or step 1 if all are incomplete).

**Alternative considered**: Storing active step in context. Rejected — it's not draft data and shouldn't persist across sessions.

### Reuse step forms as accordion panel content

**Choice**: Render `StepOneForm` through `StepFourForm` directly inside accordion panels with no changes to the form components themselves.

**Rationale**: The forms already read/write through `CreatorContext`. They don't know or care about the navigation model above them. This minimizes the blast radius of the layout change.

### Debug JSON view as right-panel placeholder

**Choice**: Move the existing `DebugPanel` component into the right panel position, always visible (no longer gated by `?debug=true`).

**Rationale**: This gives immediate visual feedback in the right panel without building a character sheet. It validates the two-panel layout works before investing in the styled sheet. The `?debug=true` gate is removed since the panel is now a core part of the layout.

### Collapsed step summaries

**Choice**: Each accordion header shows a one-line summary when collapsed (e.g., "Mage · Aldric", "Elf · Sage"). A new `StepSummary` component per step extracts key values from the draft.

**Rationale**: Without summaries, collapsed steps are opaque. Summaries let users see their choices at a glance and decide which section to reopen.

### Accordion locking for incomplete prerequisites

**Choice**: Steps whose prerequisites haven't been validated are rendered as locked (non-expandable) accordion items. Locking is derived from `CreatorContext.validation` — same logic as the current step nav's disabled state.

**Rationale**: Preserves the existing gating behavior. Users can't jump ahead to Step 4 without completing Steps 1–3.

### Auto-advance on step completion

**Choice**: When a step's validation transitions from invalid to valid and the user is on that step, auto-collapse it and expand the next incomplete step.

**Rationale**: Creates a smooth flow — fill in the last field, step folds up, next one opens. Reduces clicks vs. manually closing and opening sections.

**Risk**: Could feel jarring if validation flickers. Mitigate by only auto-advancing when the user hasn't manually navigated (i.e., respect explicit accordion clicks).

## Risks / Trade-offs

- **Loss of deep-linkable steps** → Acceptable for now. Add hash anchors later if needed.
- **Tall form steps (Step 3) in a sidebar** → The sidebar scrolls independently (`overflow-y-auto`). Step 3 is the tallest form; users scroll within the sidebar while the right panel stays visible.
- **Test rewrite** → `wizard-navigation.test.ts` tests URL-based navigation that no longer exists. Needs full rewrite to test accordion expand/collapse and locking instead. Existing validation tests are unaffected.
- **Auto-advance timing** → [Risk] Validation may pass mid-typing, causing premature collapse. → [Mitigation] Only auto-advance when the step transitions to valid AND the accordion is still on that step. Consider debouncing or triggering only on blur/explicit action if needed during implementation.
