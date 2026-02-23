## Context

Step 1 of the character creator collects class, name, and description. The wizard shell already supports ordered steps, validation gating, and draft persistence. Core data for ancestries (24 entries) and backgrounds (23 entries) is loaded and validated via Zod schemas. Step 2 adds ancestry and background selection following the same patterns established by Step 1.

## Goals / Non-Goals

**Goals:**
- Add `StepTwoData` with `ancestryId`, `backgroundId`, and optional `motivation` to the creator draft
- Validate selections against core data IDs at the logic layer
- Achieve test parity with Step 1 (valid path, each invalid field, edge cases)
- Register Step 2 in the wizard shell's step list

**Non-Goals:**
- UI components for Step 2 (separate change)
- Background requirement filtering based on character stats (stats aren't chosen yet)
- Ancestry size or trait display logic
- Any changes to core data files

## Decisions

### 1. Static ID list for validation (same as Step 1)

`getValidAncestryIds()` and `getValidBackgroundIds()` return static string arrays, validated against core data in tests. This mirrors `getValidClassIds()` in `step-one-validation.ts`.

**Alternative considered:** Dynamic import from JSON at validation time — rejected because Step 1 established the static-list pattern and tests already verify alignment with core data.

### 2. Optional motivation field with max length

`motivation` is an optional free-text string (max 200 chars). Empty string and undefined both treated as valid. This gives players a space to note why they chose this ancestry/background combination without requiring it.

### 3. Extend CreatorDraft with stepTwo

Add `stepTwo: StepTwoData` to `CreatorDraft`. Draft persistence picks this up automatically since it serializes the full draft object. The draft schema version stays at 1 — `stepTwo` defaults to empty strings, so old drafts missing it remain loadable.

### 4. Separate validation file per step

`step-two-validation.ts` follows the same module pattern as `step-one-validation.ts`: exports a Zod schema, ID getter functions, and a `validateStepTwo()` function returning `StepValidationResult`.

## Risks / Trade-offs

- **[Static ID lists drift from core data]** → Mitigated by existing core-data integrity tests that validate schema conformance; new tests will verify Step 2 ID lists match `ancestries.json` and `backgrounds.json`.
- **[Draft version unchanged]** → Old drafts without `stepTwo` will have undefined values. Validation will correctly flag them as invalid, prompting the user to fill in Step 2. No migration needed.
