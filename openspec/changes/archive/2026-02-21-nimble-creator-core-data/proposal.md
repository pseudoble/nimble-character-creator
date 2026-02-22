## Why

Nimble creator data is currently not represented as a consistent, validated core dataset that application code can load safely. Normalizing this data now enables deterministic character-creation behavior and prevents drift/errors as creator features expand.

## What Changes

- Define a normalized JSON data model for core creator entities and author initial datasets for:
  - classes
  - ancestries
  - backgrounds
  - stat arrays
  - skills
  - starting gear
- Add machine-readable schemas for each core data domain and a shared validation contract.
- Add loader utilities that read core data JSON, validate against schemas, and expose typed data to app/runtime code.
- Add integrity tests that verify schema conformance, referential integrity across datasets, and required content invariants.
- Add documentation for data file organization, schema usage, and contributor workflow for extending core creator data.

## Capabilities

### New Capabilities

- `core-data-normalization`: System stores core Nimble creator data in normalized JSON files with consistent structure across domains.
- `core-data-schema-validation`: System validates creator datasets against explicit schemas before data is consumed.
- `core-data-loading`: System provides loader utilities that parse and validate normalized core data for application usage.
- `core-data-integrity-testing`: System includes automated tests that enforce data integrity, cross-file references, and required-field constraints.

### Modified Capabilities

- None.

## Impact

- Adds new core data directories/files for normalized creator datasets and schema definitions.
- Adds loader and validation modules in application/library code paths.
- Adds test coverage focused on data validation and integrity checks.
- Establishes a durable contract for future creator features that consume canonical core data.
