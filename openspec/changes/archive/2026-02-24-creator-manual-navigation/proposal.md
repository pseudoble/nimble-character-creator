## Why

The character creator auto-advances to the next step when a step becomes valid, which feels jarring and removes user control over navigation. Users should decide when to move forward, go back, or skip around. Step locking also prevents exploration — users can't look ahead or work out of order.

## What Changes

- Remove auto-advance behavior (step no longer auto-collapses/expands on validation transition)
- Remove step locking — all accordion sections are always clickable regardless of prior step validity
- Add per-step **Reset** and **Next** buttons inside each expanded accordion section
- Step 4 (last step) shows **Finish** instead of **Next**
- Add three visual states to accordion headers: untouched (step number), complete (checkmark), needs-attention (warning icon with tooltip describing what's missing)
- "Needs attention" state only activates after the user has interacted with or navigated past a step
- Repurpose the existing bottom Reset button to **Reset All** — resets the entire form instead of just the current step

## Capabilities

### New Capabilities

_None — all changes modify existing capabilities._

### Modified Capabilities

- `creator-accordion-layout`: Remove auto-advance requirement, remove step locking requirement, add per-step Reset/Next buttons, add three-state header indicators (untouched/complete/needs-attention), repurpose bottom reset to Reset All
- `creator-wizard-shell`: Remove wizard advancement gating by active-step validity, update reset behavior to support both per-step and full-form reset

## Impact

- `src/lib/creator/creator-shell.tsx` — primary changes (auto-advance removal, locking removal, button additions, header state logic)
- `src/lib/creator/context.tsx` — add full-form reset function, add "touched" tracking per step
- `__tests__/creator/wizard-navigation.test.ts` — update/replace tests for locking and auto-advance with tests for new navigation behavior
- Existing specs for `creator-accordion-layout` and `creator-wizard-shell` need delta specs
