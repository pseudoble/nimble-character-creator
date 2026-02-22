## ADDED Requirements

### Requirement: Automated tests enforce schema conformance for all core domains
The project SHALL include automated tests that validate every core creator dataset against its schema.

#### Scenario: Schema conformance test passes for valid datasets
- **WHEN** the integrity test suite runs on valid core data files
- **THEN** each required domain dataset passes schema validation tests

#### Scenario: Schema conformance test fails for invalid datasets
- **WHEN** a domain dataset violates schema constraints
- **THEN** the integrity test suite fails and reports the failing dataset

### Requirement: Automated tests enforce referential integrity across domains
The project SHALL include tests that verify cross-domain references point to existing target IDs.

#### Scenario: Valid references pass integrity checks
- **WHEN** cross-domain links reference existing IDs
- **THEN** referential integrity tests pass

#### Scenario: Dangling references are detected
- **WHEN** a record references a non-existent ID in another domain
- **THEN** referential integrity tests fail and identify the missing target

### Requirement: Automated tests enforce domain invariants and uniqueness
The project SHALL include tests for uniqueness and required invariants needed for reliable creator behavior.

#### Scenario: Duplicate IDs are rejected
- **WHEN** duplicate identifiers appear within a domain
- **THEN** integrity tests fail and report duplicate IDs

#### Scenario: Required invariant violations are rejected
- **WHEN** a dataset violates a required domain invariant used by creator logic
- **THEN** integrity tests fail and indicate the invariant violation
