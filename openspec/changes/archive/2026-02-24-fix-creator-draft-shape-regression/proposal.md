## Why

We renamed Step 1 and Step 4 identifiers (`stepOne` -> `character-basics`/`characterBasics`, `stepFour` -> `languages-equipment`/`languagesEquipment`), but the codebase still has mixed references. That mismatch currently causes failing tests and creates regression risk anywhere draft state, validation, or derived-sheet logic expects one shape while receiving the other.

## What Changes

- Standardize creator draft usage on `characterBasics` and character-basics module naming across source and test code.
- Standardize creator draft usage on `languagesEquipment` and languages-equipment module naming across source and test code.
- Preserve backward compatibility for persisted legacy drafts by reliably migrating `stepOne` data to `characterBasics`.
- Preserve backward compatibility for persisted legacy drafts by reliably migrating `stepFour` data to `languagesEquipment`.
- Update reset, navigation, and persistence flows to use the canonical Step 1 identifiers consistently.
- Update reset, navigation, and persistence flows to use the canonical Step 4 identifiers consistently.
- Align sheet derivation paths with the canonical draft field so derived values do not fail on missing Step 1 data.
- Align sheet derivation paths with canonical Step 4 draft data so languages/equipment and gold derivations are stable.
- Restore and expand automated coverage for renamed identifiers and legacy migration paths.

## Capabilities

### New Capabilities
- None.

### Modified Capabilities
- `creator-wizard-shell`: Update creator draft/reset/navigation requirements to use `characterBasics` as the canonical Step 1 shape while continuing to accept/migrate legacy `stepOne` drafts.
- `creator-step-one-character-basics`: Align Step 1 validation contracts and module references with the character-basics naming model.
- `creator-step-four-equipment`: Align Step 4 equipment persistence and validation requirements with `languagesEquipment` as the canonical draft shape while continuing to accept/migrate legacy `stepFour` drafts.
- `creator-step-four-languages`: Align Step 4 language selection persistence/trimming requirements with `languagesEquipment` as the canonical draft shape while continuing to accept/migrate legacy `stepFour` drafts.
- `character-sheet-preview`: Require derived sheet computation to consume canonical Step 1 draft data after migration so preview rendering remains stable.

## Impact

- Affected code: creator draft types, persistence/migration logic, step validation imports, wizard reset/navigation logic, sheet computation, and related Vitest suites.
- Affected systems: `/create` creator flow and live character sheet preview.
- External APIs/dependencies: none.
