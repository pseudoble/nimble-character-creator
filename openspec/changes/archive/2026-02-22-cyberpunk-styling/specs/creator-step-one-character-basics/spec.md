## MODIFIED Requirements

### Requirement: Step 1 collects class, character name, and description
The system SHALL provide Step 1 inputs for class selection, character name, and character description in the `/create` flow, using styled UI primitives from the design system.

#### Scenario: Step 1 fields are present
- **WHEN** Step 1 is rendered
- **THEN** users can interact with a styled Select for class selection, a styled Input for character name, and a styled Textarea for character description

#### Scenario: Class options are sourced from core creator data
- **WHEN** Step 1 class selection is displayed
- **THEN** selectable classes correspond to valid class entries from core data

### Requirement: Step 1 validation feedback is actionable
The system SHALL expose validation feedback using styled error states so users can identify and correct invalid Step 1 fields.

#### Scenario: Field-level feedback appears for invalid fields
- **WHEN** Step 1 validation fails
- **THEN** invalid fields display with the warning accent color border and glow, and error text appears below each invalid field

#### Scenario: Validation feedback clears after correction
- **WHEN** a user corrects previously invalid Step 1 input
- **THEN** the field returns to its default border and the error text is removed

### Requirement: Step 1 field labels use monospace styling
The system SHALL render field labels in Step 1 using the Label primitive with monospace, uppercase, letter-spaced styling.

#### Scenario: Labels render with tech aesthetic
- **WHEN** Step 1 is displayed
- **THEN** field labels for class, character name, and description render in Geist Mono, uppercase, with letter-spacing
