## Context

Recent renames moved creator Step 1 and Step 4 concepts from `stepOne`/`stepFour` to semantic names (`characterBasics`, `languagesEquipment`) and file names (`character-basics-*`, `languages-equipment-*`). The codebase currently mixes old and new identifiers across creator context logic, draft persistence, sheet derivation, and tests.

Current failures show two classes of breakage:
- import/name drift (for example tests still importing `step-one-validation`)
- runtime shape mismatches (for example code expecting `characterBasics` while fixtures still provide `stepOne`)

The system already has partial migration logic for legacy drafts in `draft-persistence.ts`, but compatibility behavior is not consistently reflected in all paths and tests.

## Goals / Non-Goals

**Goals:**
- Make `characterBasics` and `languagesEquipment` the single canonical draft shape for active code paths.
- Preserve backward compatibility for persisted drafts that still contain `stepOne`/`stepFour`.
- Ensure creator reset/navigation, validation, persistence, and sheet derivation behave consistently with the canonical shape.
- Restore a green test suite with explicit coverage for legacy migration and canonical field usage.

**Non-Goals:**
- Redesigning creator UX or validation rules beyond identifier/shape consistency.
- Introducing a new draft schema version unless required by implementation.
- Maintaining long-term support for legacy names in all internal call sites (compatibility remains at migration boundaries).

## Decisions

### Decision 1: Canonical internal draft contract is semantic keys only
- Decision: internal code and new tests SHALL use `characterBasics` and `languagesEquipment`.
- Rationale: one source of truth avoids repeated dual-shape branching and prevents future rename regressions.
- Alternative considered: keep dual-shape support (`stepOne` and `characterBasics`, `stepFour` and `languagesEquipment`) in all consumers.
- Why not chosen: this increases complexity, broadens test matrix, and makes drift likely.

### Decision 2: Legacy support stays at persistence/normalization boundaries
- Decision: `loadDraft` migration SHALL map legacy keys (`stepOne`, `stepFour`) to canonical keys before the draft enters runtime context.
- Rationale: boundary migration isolates compatibility and keeps downstream logic simple.
- Alternative considered: expose compatibility fallback in every module (context, validators, sheet).
- Why not chosen: duplicated fallback logic is fragile and harder to reason about.

### Decision 3: Reset and navigation logic will reset/inspect semantic step data
- Decision: creator shell/context reset operations and step-validity checks SHALL operate on canonical keys only.
- Rationale: reset and validity are central orchestration points; mixed keys here cause cross-step regressions.
- Alternative considered: retain old step IDs and map opportunistically.
- Why not chosen: partial mappings are easy to miss and caused current failures.

### Decision 4: Tests migrate to canonical fixtures, with targeted legacy migration cases
- Decision: tests SHALL build `CreatorDraft` fixtures with canonical keys; only migration-focused tests may provide legacy payloads as raw persisted JSON.
- Rationale: tests should enforce intended contract while still protecting backward compatibility behavior.
- Alternative considered: keep old fixture shapes and add adapter helpers in tests.
- Why not chosen: adapters can mask production mismatches and delay cleanup.

## Risks / Trade-offs

- [Risk] Hidden legacy references remain in less-traveled code/tests.
  -> Mitigation: repo-wide identifier sweep (`stepOne`, `stepFour`, old import paths) and focused regression tests.

- [Risk] Overly strict canonical assumptions could break direct callers bypassing persistence.
  -> Mitigation: ensure canonical defaults are always created by context initialization; optionally add defensive guards where direct invocation exists.

- [Risk] Updating many tests at once can introduce assertion churn unrelated to behavior.
  -> Mitigation: migrate fixtures mechanically first, then re-run tests and only adjust assertions tied to contract changes.

## Migration Plan

1. Update creator and sheet code paths to use canonical keys consistently (`characterBasics`, `languagesEquipment`).
2. Ensure `draft-persistence` migration handles `stepOne` and `stepFour` reliably and returns canonical shape.
3. Replace stale imports and identifier references in tests (e.g., `step-one-validation` -> `character-basics-validation`).
4. Keep explicit migration tests that serialize legacy payloads and assert canonical restoration.
5. Run full test suite (`npm test`) and resolve remaining regressions.

Rollback strategy:
- Revert this change set to restore prior behavior; no data migration is destructive because legacy keys are transformed in-memory on load.

## Open Questions

- Should we add temporary compatibility re-export modules for renamed validation files, or keep the codebase strict and update all imports immediately?
