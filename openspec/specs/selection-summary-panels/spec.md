## Requirements

### Requirement: Summary panel displays relevant details for a selected option
The system SHALL render a summary panel below a select field when a valid option is chosen, showing key details from core data.

#### Scenario: Class summary shows description, key stats, and hit die
- **WHEN** a valid class is selected in Step 1
- **THEN** a summary panel appears below the class select displaying the class description, key stats (formatted as uppercase comma-separated), and hit die

#### Scenario: Ancestry summary shows size, trait name, and trait description
- **WHEN** a valid ancestry is selected in Step 2
- **THEN** a summary panel appears below the ancestry select displaying the ancestry size, trait name, and trait description

#### Scenario: Background summary shows description and requirement
- **WHEN** a valid background is selected in Step 2
- **THEN** a summary panel appears below the background select displaying the background description, and the requirement if one exists

#### Scenario: No summary panel when no selection is made
- **WHEN** a select field has no value chosen (empty/placeholder)
- **THEN** no summary panel is rendered below that select field

### Requirement: Summary panels use consistent visual styling
The system SHALL render all summary panels with a consistent bordered container style using muted text colors.

#### Scenario: Summary panel renders with bordered container
- **WHEN** a summary panel is displayed
- **THEN** it renders as a bordered container with muted/secondary text styling consistent with the design system
