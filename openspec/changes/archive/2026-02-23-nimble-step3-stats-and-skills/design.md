## Context

The creator wizard currently supports Step 1 (class/name/description) and Step 2 (ancestry/background/motivation), with client-side draft persistence and per-step validation gating. Core data already includes `stat-arrays.json` and `skills.json`, but there is no Step 3 flow to collect stat assignments or skill allocation before finish.

This change introduces the first cross-field validation step in the wizard:
- Stat values must be assigned from a selected stat array
- Assignment must respect array value counts (including duplicate values)
- Skill allocation must satisfy legal point-total rules

The implementation must fit existing patterns:
- `CreatorDraft` as the source of truth
- `validateStepX()` modules returning `{ valid, errors }`
- localStorage persistence with safe backfill behavior
- test-first parity with Step 1/Step 2 validation coverage

## Goals / Non-Goals

**Goals:**
- Add a Step 3 draft model for selected stat array, `STR/DEX/INT/WIL` assignments, and skill allocation values.
- Add Step 3 form UX for stat-array selection, stat assignment dropdowns, and skill allocation inputs.
- Prevent over-selection of stat-array values by guarding dropdown options using remaining available value counts.
- Validate Step 3 submission for legal stat distribution and legal skill point totals.
- Integrate Step 3 into wizard ordering, persistence, and validation gating.
- Add automated tests for Step 3 validation and wizard progression behavior.

**Non-Goals:**
- Enforcing background requirement text against finalized stats.
- Derived-stat calculations beyond Step 3 validation (combat math, saves, etc.).
- Server-side persistence or API changes.
- Changes to core-data JSON datasets.

## Decisions

### 1. Extend draft shape with explicit Step 3 data

Add `StepThreeData` to `CreatorDraft`:
- `statArrayId: string`
- `stats: { str: string; dex: string; int: string; wil: string }` (string form in UI, parsed in validation)
- `skillAllocations: Record<string, number>`

Rationale:
- Keeps wizard state serializable and aligned with existing localStorage pattern.
- Explicit per-stat fields match form controls and field-level errors.
- Skill allocations keyed by skill ID scale cleanly with core-data changes.

Alternative considered:
- Store only derived totals and infer assignments from selections; rejected because validation/errors need per-field traceability.

### 2. Use multiset accounting for stat dropdown guarding

Step 3 will compute remaining stat-array values as a multiset:
- Start with selected array values and their counts
- Subtract values assigned to other stat fields
- Disable options that have no remaining count for the current stat field

Rationale:
- Correctly handles arrays with duplicates (example: two `2`s).
- Prevents illegal overuse in UI without blocking valid duplicate usage.

Alternative considered:
- Treat each array entry as a unique slot ID; rejected as unnecessarily complex UI for the same constraint.

### 3. Two-layer Step 3 validation (schema + domain checks)

`step-three-validation.ts` will follow existing step-validation structure:
- Zod/schema checks for required fields and numeric/coercion safety
- Domain checks for:
  - valid `statArrayId`
  - assigned stat values forming exactly the selected array multiset
  - skill allocation values meeting configured total-point rule

Rationale:
- Matches Step 1/2 architecture and keeps validation deterministic and testable.
- Separates basic field correctness from gameplay-rule correctness.

Alternative considered:
- UI-only enforcement without validation module; rejected because wizard gating/tests depend on reusable validation logic.

### 4. Keep rules configurable via constants

Add Step 3 constants in `constants.ts` (step ID plus skill-point rule constants). Validation consumes constants rather than hard-coded numbers in form logic.

Rationale:
- Keeps rules centralized and test-stable.
- Supports future balancing without structural rewrites.

Alternative considered:
- Embed numeric rules directly in validation file; rejected due poor maintainability.

### 5. Integrate Step 3 with minimal wizard-shell surface changes

`wizard-shell.tsx` changes:
- Add Step 3 descriptor after Step 2
- Include `stepThree` in draft save-duplication snapshot
- Render `StepThreeForm` when active
- Use existing advance/back flow; finish remains gated by active-step validity

Rationale:
- Leverages proven step-navigation behavior.
- Minimizes regression risk in shell mechanics.

Alternative considered:
- Reworking wizard engine into generic dynamic renderer; rejected as out-of-scope for this change.

## Risks / Trade-offs

- **[Static ID lists drift from core data]** -> Add tests ensuring valid stat-array IDs and skill IDs match `stat-arrays.json` and `skills.json`.
- **[String-to-number coercion edge cases in stat assignment]** -> Normalize parsing in one helper and assert invalid/non-numeric values produce deterministic field errors.
- **[Ambiguity in “legal” skill distribution]** -> Encode explicit configured point-total rule in constants and reference that rule in specs/tests.
- **[Draft backward compatibility]** -> Backfill missing `stepThree` on load; invalid legacy payloads still fall back to `createEmptyDraft()`.

## Migration Plan

1. Add Step 3 draft fields and defaults in `createEmptyDraft()`.
2. Backfill missing `stepThree` in `loadDraft()` for older saved drafts.
3. Add Step 3 form and validation modules.
4. Register Step 3 in wizard shell and wire update handlers.
5. Land Step 3 unit tests and wizard navigation test updates.

Rollback:
- Revert Step 3 module additions and wizard registration.
- Keep `loadDraft()` fallback/backfill guards so previously written drafts do not crash on older code.

## Open Questions

- None blocking for this change; skill-point legality is defined as a configurable constant-driven total rule in this implementation.
