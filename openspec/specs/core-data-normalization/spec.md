## ADDED Requirements

### Requirement: Canonical creator datasets are stored in normalized JSON domains
The system SHALL store core creator data as canonical JSON datasets for classes, ancestries, backgrounds, stat arrays, skills, and starting gear.

#### Scenario: Core domain datasets exist
- **WHEN** a developer inspects the core data directory
- **THEN** JSON datasets exist for each required domain: classes, ancestries, backgrounds, stat arrays, skills, and starting gear

#### Scenario: Domain files are parseable JSON
- **WHEN** a dataset file is read by the data tooling
- **THEN** it parses as valid JSON without syntax errors

### Requirement: Records use stable identifiers and normalized references
Each record in a core dataset SHALL include a stable string identifier, and cross-domain relationships MUST reference identifiers rather than embedding full external records.

#### Scenario: Records include stable IDs
- **WHEN** a dataset entry is validated
- **THEN** the entry includes a non-empty stable identifier field unique within its domain

#### Scenario: Cross-domain links are ID-based
- **WHEN** one domain references another domain entity
- **THEN** the relationship is represented by referenced identifier values instead of duplicated embedded objects

### Requirement: Domain structures are consistent within each dataset
Entries in the same domain SHALL follow a consistent field structure so downstream consumers can handle records deterministically.

#### Scenario: Same-domain entries share required fields
- **WHEN** entries from the same domain are validated
- **THEN** all required domain fields are present with consistent types

#### Scenario: Unexpected structural drift is rejected
- **WHEN** an entry introduces an unrecognized structure that violates the domain contract
- **THEN** validation fails and identifies the offending entry
