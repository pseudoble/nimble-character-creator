## Context

Nimble currently has a baseline Next.js App Router setup (`src/app`) and validated core reference data, including classes data in `src/lib/core-data`. There is no character creation flow yet, and users cannot safely build partial character data over multiple sessions.

This change introduces the first functional slice of creator UX: a `/create` wizard shell plus Step 1 (class, name, description). The design should make subsequent steps straightforward to add without rewriting shell behavior.

Constraints:
- Existing stack is Next.js + React + TypeScript with `zod` and Vitest.
- No backend draft API exists; persistence must be client-side for now.
- Existing tests are unit/integration style in Vitest (no browser E2E harness yet).

## Goals / Non-Goals

**Goals:**
- Provide a stable `/create` route shell with step navigation and progress UI.
- Establish a reusable step registry model so additional steps can be appended incrementally.
- Implement Step 1 capture for class selection, character name, and character description.
- Block forward progress when Step 1 data is invalid.
- Persist draft data locally and restore it on return to `/create`.
- Add automated tests for validation, draft persistence, and wizard-step gating behavior.

**Non-Goals:**
- Implementing Step 2+ content or final character submission.
- Introducing backend persistence or synchronization across devices.
- Building a full end-to-end browser testing framework in this slice.
- Finalizing UX copy/polish for all future wizard steps.

## Decisions

### 1. Wizard architecture: client-side shell with step registry

Use a client component shell at `/create` that renders:
- Step navigation
- Progress indicator
- Active step content (Step 1 for now)

The shell consumes a typed step registry (ordered array of step descriptors) to avoid hard-coded per-step conditionals. Each step descriptor defines id, label, validation gate, and render component. With one step initially, the same mechanism scales to multiple steps later.

Alternatives considered:
- Route-per-step (`/create/step-1`, `/create/step-2`): deferred to reduce early routing complexity while only one step exists.
- Ad hoc conditional rendering without registry: rejected because it makes future step expansion brittle.

### 2. Draft persistence: versioned localStorage payload

Persist wizard draft to localStorage under a versioned key (`nimble.creator.draft.v1`) containing:
- `stepOne.classId`
- `stepOne.name`
- `stepOne.description`
- metadata (`updatedAt`, schema `version`)

Hydrate on initial shell load; save on state updates (debounced). If parse/shape/version mismatch occurs, discard and start clean.

Alternatives considered:
- `sessionStorage`: rejected because data should survive tab/browser restarts.
- Server persistence: out of scope for this slice due missing API/auth model.

### 3. Step 1 validation: zod schema + normalized input

Define a dedicated Step 1 schema with `zod` for deterministic validation:
- `classId`: required and must map to available class ids from core data
- `name`: required, trimmed, bounded length
- `description`: bounded length (optional content allowed)

Validation runs on field update and on step-advance attempts. The "Next/Continue" control remains disabled until Step 1 passes.

Alternatives considered:
- Imperative per-field checks in component state: rejected due duplication and lower testability.

### 4. Core data integration for class options

Populate class selector options from existing core data loader/schema rather than inline constants. This keeps creator UI aligned with validated game data and avoids drift.

Alternatives considered:
- Hard-coded class list in UI: rejected because it duplicates source-of-truth data.

### 5. Test strategy: logic-first tests in Vitest

Add tests for:
- Step 1 schema validation (valid/invalid permutations)
- Draft serializer/deserializer and version mismatch handling
- Wizard navigation gate behavior (cannot advance when invalid; can advance when valid)

Given current tooling, tests emphasize pure functions/state transitions over DOM-heavy interactions.

Alternatives considered:
- Full component interaction tests with additional browser testing libraries: deferred to keep this slice focused and avoid introducing new tooling.

## Risks / Trade-offs

- [Risk] LocalStorage is unavailable in some environments (SSR/private contexts) -> Mitigation: guard storage access and fallback to in-memory state.
- [Risk] Frequent saves can cause noisy writes -> Mitigation: debounce persistence and skip writes when state is unchanged.
- [Risk] Future step expansion may require route-level deep linking -> Mitigation: keep step registry IDs stable so route-per-step can be added later without rewriting validation/persistence models.
- [Risk] Class ids in drafts may become invalid after data updates -> Mitigation: revalidate restored drafts against current core data and clear invalid values with user-visible validation feedback.

## Migration Plan

1. Add wizard shell/state/persistence modules and `/create` route UI with Step 1 wired in.
2. Add Step 1 validation schema and class option mapping from core data.
3. Add Vitest coverage for validation, persistence, and navigation gating logic.
4. Release behind normal app deployment; no data migration is required.

Rollback:
- Revert `/create` route and related creator modules.
- Existing app routes remain unaffected because no shared API contract is changed.

## Open Questions

- Should Step 1 description be optional or required in final product behavior?
- Do we want explicit "Save draft" UX later, or keep fully automatic persistence?
- Should future steps be represented as route segments for deep-link and browser history behavior?
