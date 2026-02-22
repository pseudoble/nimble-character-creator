## ADDED Requirements

### Requirement: Explicit schemas define each core data domain
The system SHALL define explicit runtime schemas for classes, ancestries, backgrounds, stat arrays, skills, and starting gear.

#### Scenario: All required domain schemas are present
- **WHEN** schema modules are inspected
- **THEN** each required core domain has a corresponding schema definition

#### Scenario: Schema contracts declare required fields
- **WHEN** a domain schema is evaluated
- **THEN** required fields and expected field types are explicitly defined

### Requirement: Data is validated against schemas before consumption
Core creator data MUST be validated against the corresponding schema before it is returned to runtime consumers.

#### Scenario: Valid data passes schema validation
- **WHEN** loader code validates a conforming dataset
- **THEN** validation succeeds and returns typed parsed data

#### Scenario: Invalid data is rejected before use
- **WHEN** a dataset violates its schema
- **THEN** validation fails and data is not returned to consuming application code

### Requirement: Validation failures provide actionable diagnostics
Schema validation errors SHALL identify domain and failure details sufficient for contributors to locate and correct invalid records.

#### Scenario: Error includes domain context
- **WHEN** validation fails for a dataset
- **THEN** the reported error includes which domain failed validation

#### Scenario: Error includes record-level detail
- **WHEN** a specific record violates schema constraints
- **THEN** the reported error includes enough path/detail information to identify the failing field or record
