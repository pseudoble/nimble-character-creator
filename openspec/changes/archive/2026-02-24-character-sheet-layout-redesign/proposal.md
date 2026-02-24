## Why

The current character creator is a multi-page wizard that hides most of the character's state behind page transitions. Users only see one step at a time and have no persistent view of the character they're building. Redesigning to a two-panel layout with a live draft preview makes the creator feel like *building a character* rather than *filling out a form*, and establishes the layout foundation for a future styled character sheet.

## What Changes

- **Replace multi-page wizard with single-page accordion layout**: All four creator steps render as collapsible accordion sections in a left sidebar instead of separate URL-routed pages. Collapsed sections show a one-line summary of selections made. Completing a step auto-collapses it and opens the next.
- **Add draft preview panel**: The right-side main panel displays the existing JSON debug view of the draft state (relocated from below the form). This serves as a placeholder for a future styled character sheet.
- **Responsive stacking**: On narrow screens (below `lg` breakpoint), the layout stacks vertically with the form above the draft preview.
- **Remove URL-based step routing**: **BREAKING** — The `/create/character-basics`, `/create/ancestry-background`, `/create/stats-skills`, and `/create/languages-equipment` routes are removed. The creator lives at a single `/create` route. `StepGuard` redirect logic is removed.
- **Remove Back/Next page navigation**: Replaced by accordion expand/collapse. Validation gating moves to accordion lock (future steps can't open until prerequisites pass).
- **Retain existing validation and state management**: `CreatorContext`, Zod validation schemas, draft persistence, and all step form components remain intact.

## Capabilities

### New Capabilities
- `creator-accordion-layout`: Single-page accordion-based creator layout replacing the multi-page wizard. Includes collapsed step summaries, auto-advance on completion, and accordion lock for incomplete prerequisites.

### Modified Capabilities
- `creator-wizard-shell`: Navigation model changes from URL-routed pages with Back/Next buttons to a single-page accordion with expand/collapse. The debug JSON view moves to the right panel (always visible, no longer gated by `?debug=true`). Draft persistence, validation gating, and reset behavior are preserved but adapted to the new layout.

## Impact

- **Routes**: Remove four step-specific routes under `/create/`. The `/create` route becomes the sole entry point rendering the full accordion + draft preview layout.
- **Components**: `creator-shell.tsx` is heavily reworked. `step-guard.tsx` is removed. New components: accordion wrapper, per-step collapsed summary.
- **Step form components**: `step-one-form.tsx` through `step-four-form.tsx` are reused as accordion panel content with minimal changes.
- **Tests**: `wizard-navigation.test.ts` needs rewriting to test accordion behavior instead of URL-based navigation.
- **No data model changes**: `CreatorDraft`, validation schemas, and `CreatorContext` are unchanged.
