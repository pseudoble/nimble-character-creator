## Context

The creator wizard currently orders steps as: (1) Character Basics, (2) Ancestry & Background, (3) Stats & Skills, (4) Languages & Equipment. Backgrounds like Bumblewise require specific stat thresholds (e.g., "0 or negative WIL"), but users pick backgrounds before stats exist. Additionally, all internal naming uses positional identifiers (`stepTwo`, `stepThree`, `step-two-form.tsx`) rather than semantic ones, making future reordering fragile.

## Goals / Non-Goals

**Goals:**
- Swap Stats & Skills to position 2 and Ancestry & Background to position 3
- Rename all positional identifiers (type fields, file names, constants) to semantic names
- Bump draft schema version and migrate persisted drafts
- Preserve all existing functionality — no behavioral changes beyond ordering

**Non-Goals:**
- Filtering or disabling backgrounds based on stat requirements in the UI (future work)
- Changing the content of any step form
- Renaming Step 1 or Step 4 internals (they already use semantic-enough names or are unaffected)

## Decisions

### 1. Semantic naming convention for draft fields

**Decision**: Rename `stepTwo`/`stepThree` in `CreatorDraft` to `ancestryBackground`/`statsSkills`.

**Rationale**: Positional naming (`stepTwo`) breaks when steps reorder. Semantic naming (`statsSkills`) is self-documenting and survives future reordering.

**Alternative considered**: Keep positional names and just swap what they contain. Rejected because it makes the code confusing (a field called `stepTwo` holding stats data).

### 2. Semantic file naming

**Decision**: Rename form and validation files to match content:
- `step-two-form.tsx` → `ancestry-background-form.tsx`
- `step-three-form.tsx` → `stats-skills-form.tsx`
- `step-two-validation.ts` → `ancestry-background-validation.ts`
- `step-three-validation.ts` → `stats-skills-validation.ts`

Corresponding test files follow the same pattern.

**Rationale**: File names should describe content, not position.

### 3. Step order array drives rendering

**Decision**: The `STEP_ORDER` array in `creator-shell.tsx` is the single source of truth for step ordering. Swap the two entries there. All rendering, navigation, and validation iteration follows this array.

**Rationale**: Centralizing order in one array means the swap is a single line change for ordering.

### 4. Draft schema migration (v3 → v4)

**Decision**: Bump `DRAFT_SCHEMA_VERSION` to 4. Migration maps `stepTwo` → `ancestryBackground` and `stepThree` → `statsSkills` in persisted drafts. Invalid/old drafts fall through to clean state (existing behavior).

**Rationale**: Users with in-progress drafts should not lose data.

### 5. Rename positional constants

**Decision**: Rename `STEP_THREE_REQUIRED_SKILL_POINTS` → `REQUIRED_SKILL_POINTS` (and similar skill-point constants). These are not step-specific, they're domain constants.

**Rationale**: Removing step-number prefixes from domain constants that have nothing to do with step ordering.

## Risks / Trade-offs

- **Draft migration edge cases** → Migration logic is simple field rename; invalid drafts already fall through to clean state.
- **Import churn across many files** → Unavoidable with file renames, but a one-time cost. Using semantic names prevents future churn.
- **Test updates** → Tests reference old field names and file paths. Must update all references. Risk of missing one → CI will catch.
