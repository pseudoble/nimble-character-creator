## 1. Canonical Draft Contract

- [x] 1.1 Audit creator/sheet code for legacy identifiers (`stepOne`, `stepFour`, `step-one-*`) and replace runtime usage with `characterBasics`, `languagesEquipment`, and renamed modules.
- [x] 1.2 Ensure `CreatorDraft` defaults and context reset paths initialize/reset only canonical keys (`characterBasics`, `statsSkills`, `ancestryBackground`, `languagesEquipment`).
- [x] 1.3 Update wizard validation/navigation flows to read canonical step data and remove stale references that bypass the semantic model.

## 2. Legacy Draft Migration Compatibility

- [x] 2.1 Verify `loadDraft` migration maps persisted `stepOne` -> `characterBasics` and `stepFour` -> `languagesEquipment` before validation.
- [x] 2.2 Ensure migrated drafts backfill missing `languagesEquipment.selectedLanguages` and other required defaults without throwing.
- [x] 2.3 Keep persistence output canonical by ensuring saved drafts never reintroduce legacy keys.

## 3. Validation and Derivation Alignment

- [x] 3.1 Update renamed validation imports/usages (for example Step 1 validation module references) to match `character-basics` naming.
- [x] 3.2 Align sheet computation inputs with canonical fields so class/header/equipment/gold/language derivations do not rely on legacy keys.
- [x] 3.3 Verify reset-step behavior for Character Basics and Languages & Equipment uses canonical data paths.

## 4. Test Suite Migration and Regression Coverage

- [x] 4.1 Migrate creator and sheet test fixtures from `stepOne`/`stepFour` to `characterBasics`/`languagesEquipment` where canonical contract is expected.
- [x] 4.2 Keep targeted persistence tests that inject legacy draft JSON and assert migration to canonical fields.
- [x] 4.3 Update any stale test imports (for example `step-one-validation`) to renamed module paths.
- [x] 4.4 Run `npm test`, fix remaining failures, and confirm the full Vitest suite passes.
