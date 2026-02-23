## Context

The creator flow already supports Step 3 skill allocation, live totals, and validation, but the skills are rendered as repeated card blocks that are harder to scan when comparing all skills. This change focuses on presentation clarity and tighter per-skill allocation safety while preserving existing total-point rules and wizard behavior.

## Goals / Non-Goals

**Goals:**
- Render Step 3 skills in a consistent two-column row layout: skill identity/details on the left and point assignment on the right.
- Keep each skill's description visible in-line to reduce context switching.
- Keep live totals visible per skill and derived from selected stat assignment plus allocated points.
- Enforce a per-skill maximum of 4 points at both UI and validation layers.
- Preserve existing wizard progression/gating semantics (invalid Step 3 data blocks finishing).

**Non-Goals:**
- Changing total skill-point budget rules for Step 3.
- Changing stat-array selection or stat assignment mechanics.
- Introducing server-side persistence or API changes.
- Reworking wizard navigation architecture.

## Decisions

### 1. Use row-based two-column layout for skill allocation controls
Step 3 skill entries will be rendered as row units with a two-column structure:
- Left column: skill name, associated stat, and description
- Right column: numeric point input and live computed total

Rationale:
- Improves scanability and side-by-side comparison across skills.
- Makes the assignment control location consistent for each skill.

Alternatives considered:
- Keep card layout with minor spacing tweaks; rejected because scanning long descriptions and inputs remains inconsistent.
- Use semantic HTML table only; rejected to retain easier responsive stacking while preserving row structure via grid/flex.

### 2. Compute live totals in form state from stat assignment plus allocated points
Each skill total will be computed as:
`skillTotal = selectedStatValueForSkill + allocatedSkillPoints`

Rationale:
- Keeps display deterministic and immediately responsive to both stat and skill edits.
- Avoids extra derived state fields in draft persistence.

Alternatives considered:
- Persist precomputed skill totals in draft; rejected because totals are derived and can become stale.

### 3. Enforce per-skill max using shared constants across UI and validation
A single constant-driven max (`4`) will be applied in:
- Input attributes (`max`) and onChange clamping in Step 3 form
- Schema/domain validation for persisted or manually edited payloads

Rationale:
- Prevents UI-only enforcement gaps.
- Keeps behavior consistent across interaction and validation paths.

Alternatives considered:
- UI-only guard; rejected because malformed persisted payloads could bypass client input constraints.

## Risks / Trade-offs

- [Dense row layout may feel cramped on small screens] -> Use responsive stacking so row columns collapse vertically on narrow widths.
- [UI guard and validation diverge over time] -> Keep max value in shared constants and cover with tests for over-allocation rejection.
- [Spec overlap with prior Step 3 work] -> Keep this change scoped to layout/description/max-guard behavior and avoid unrelated Step 3 logic changes.

## Migration Plan

1. Update Step 3 constants with per-skill max rule.
2. Update Step 3 form rendering to row-based two-column layout with inline descriptions and live totals.
3. Add/adjust Step 3 validation checks for per-skill max.
4. Add/adjust tests for over-allocation and UI-derived behavior assumptions.
5. Verify wizard finish gating remains unchanged for invalid Step 3 payloads.

Rollback:
- Revert Step 3 form layout changes and max-guard checks.
- Remove added constant and validation rule additions.

## Open Questions

- None blocking; the per-skill maximum is explicitly set to 4 by character rules for this change.
