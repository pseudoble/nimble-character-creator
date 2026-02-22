## 1. Define normalized core data structure

- [x] 1.1 Create the core-data directory layout for classes, ancestries, backgrounds, stat arrays, skills, and starting gear JSON datasets
- [x] 1.2 Add initial normalized JSON files for each core domain with stable string IDs
- [x] 1.3 Replace embedded cross-domain objects with ID-based references where applicable
- [x] 1.4 Validate that all domain JSON files parse successfully

## 2. Implement schema contracts and validation

- [x] 2.1 Add explicit Zod schemas for each required core domain
- [x] 2.2 Add shared schema primitives/helpers for reusable field constraints (IDs, enums, arrays, etc.)
- [x] 2.3 Implement validation wrappers that return typed parsed data for valid datasets
- [x] 2.4 Implement actionable validation error formatting including domain and record-level context

## 3. Build loader APIs

- [x] 3.1 Implement domain-specific loaders that read JSON, validate, and return typed data
- [x] 3.2 Implement aggregate loader that returns complete validated core creator data across all required domains
- [x] 3.3 Ensure aggregate loader fails if any required domain dataset is invalid or missing
- [x] 3.4 Add loader-level tests for valid and invalid load paths

## 4. Add data integrity test coverage

- [x] 4.1 Add schema conformance tests for every core domain dataset
- [x] 4.2 Add uniqueness tests to reject duplicate IDs within each domain
- [x] 4.3 Add referential integrity tests for cross-domain ID references
- [x] 4.4 Add invariant tests for required creator-data constraints used by runtime behavior

## 5. Document and verify contributor workflow

- [x] 5.1 Document core-data file organization and naming conventions
- [x] 5.2 Document schema/loader workflow for adding or updating creator data entries
- [x] 5.3 Document common validation failure patterns and expected fixes
- [x] 5.4 Run the full data test suite and confirm all integrity checks pass
