## ADDED Requirements

### Requirement: Domain loaders return validated typed core data
The system SHALL provide loader utilities for each core data domain that parse JSON and return schema-validated typed data structures.

#### Scenario: Domain loader returns parsed data for valid input
- **WHEN** a caller invokes a domain loader for a valid dataset
- **THEN** the loader returns parsed typed records for that domain

#### Scenario: Domain loader fails on invalid input
- **WHEN** a caller invokes a domain loader for an invalid dataset
- **THEN** the loader throws or returns a failure state instead of partial unvalidated data

### Requirement: Aggregate loading supports complete core creator data access
The system SHALL provide an aggregate loading path that returns the complete validated core creator dataset across all required domains.

#### Scenario: Aggregate loader returns all core domains
- **WHEN** a caller requests complete core creator data
- **THEN** the loader returns validated data for classes, ancestries, backgrounds, stat arrays, skills, and starting gear

#### Scenario: Aggregate load fails if any domain fails validation
- **WHEN** one required domain dataset is invalid or missing
- **THEN** aggregate load fails and does not return a partially valid core-data object

### Requirement: Loader contracts are stable for application consumers
Loader APIs SHALL expose deterministic return shapes so application code can consume core data without ad hoc parsing logic.

#### Scenario: Consumer code uses typed loader output directly
- **WHEN** application code calls the loader API
- **THEN** it can access expected domain fields without custom per-call JSON shape checks

#### Scenario: Loader output shape remains consistent
- **WHEN** datasets are updated but still schema-valid
- **THEN** loader return contracts remain consistent with documented loader types
