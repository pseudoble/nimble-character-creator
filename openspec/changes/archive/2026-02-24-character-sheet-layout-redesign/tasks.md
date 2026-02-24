## 1. Route Consolidation

- [x] 1.1 Create single `/create/page.tsx` that renders all step forms inline (replacing redirect-to-first-step logic)
- [x] 1.2 Remove per-step route pages (`character-basics/page.tsx`, `ancestry-background/page.tsx`, `stats-skills/page.tsx`, `languages-equipment/page.tsx`)
- [x] 1.3 Remove `step-guard.tsx` (no longer needed with accordion locking)

## 2. Accordion Component

- [x] 2.1 Create accordion wrapper component with expand/collapse behavior (single section open at a time)
- [x] 2.2 Implement accordion locking: sections for steps with unmet prerequisites are non-expandable and visually distinct
- [x] 2.3 Implement auto-advance: when current step becomes valid, auto-collapse and expand next incomplete step
- [x] 2.4 Determine initial expanded step on mount: first step whose validation fails

## 3. Step Summaries

- [x] 3.1 Create step summary components that extract one-line summaries from draft data (class + name, ancestry + background, stat values, equipment choice)
- [x] 3.2 Render summaries in collapsed accordion headers; show step label only when no data is entered

## 4. Two-Panel Layout

- [x] 4.1 Rework `creator-shell.tsx` to render two-panel layout: accordion sidebar (left) + draft preview (right)
- [x] 4.2 Make sidebar independently scrollable (`overflow-y-auto`) with sticky positioning
- [x] 4.3 Move `DebugPanel` into right panel position, always visible (remove `?debug=true` gate)
- [x] 4.4 Add responsive stacking: `flex-col` below `lg` breakpoint, `flex-row` at `lg+`

## 5. Navigation Cleanup

- [x] 5.1 Remove horizontal breadcrumb step nav from `CreatorShell`
- [x] 5.2 Remove Back/Next button navigation
- [x] 5.3 Adapt Reset button to clear the currently expanded accordion step
- [x] 5.4 Remove `STEP_PATHS` array and URL-based step index detection from `CreatorShell`

## 6. Testing

- [x] 6.1 Rewrite `wizard-navigation.test.ts` to test accordion expand/collapse, locking, auto-advance, and reset behavior
- [x] 6.2 Verify draft persistence works with new single-page layout (restore → correct accordion step opens)
