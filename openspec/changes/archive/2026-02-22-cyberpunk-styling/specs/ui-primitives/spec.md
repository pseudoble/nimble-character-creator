## ADDED Requirements

### Requirement: Button primitive is available with cyberpunk styling
The system SHALL provide a Button component with accessible markup, keyboard support, and cyberpunk-styled variants.

#### Scenario: Default button renders with primary accent styling
- **WHEN** a Button is rendered without variant props
- **THEN** it displays with the primary (cyan) accent color, dark surface background on rest, and glow effect on hover

#### Scenario: Button supports keyboard activation
- **WHEN** a user focuses a Button and presses Enter or Space
- **THEN** the button activates

### Requirement: Input primitive is available with cyberpunk styling
The system SHALL provide an Input component with accessible markup, focus states, and cyberpunk-styled appearance.

#### Scenario: Input renders with dark surface styling
- **WHEN** an Input is rendered
- **THEN** it displays with a dark surface background, subtle border, and light text

#### Scenario: Input shows glow on focus
- **WHEN** a user focuses an Input
- **THEN** the input border changes to the primary accent color and a glow effect appears

#### Scenario: Input displays error state
- **WHEN** an Input has `aria-invalid="true"`
- **THEN** the input border and glow use the warning (amber) accent color

### Requirement: Select primitive is available with cyberpunk styling
The system SHALL provide a Select component with accessible markup, keyboard navigation, and cyberpunk-styled appearance.

#### Scenario: Select renders with dark surface styling
- **WHEN** a Select is rendered
- **THEN** it displays with styling consistent with the Input component

#### Scenario: Select shows glow on focus
- **WHEN** a user focuses a Select trigger
- **THEN** the trigger border changes to the primary accent color and a glow effect appears

### Requirement: Textarea primitive is available with cyberpunk styling
The system SHALL provide a Textarea component with accessible markup, focus states, and cyberpunk-styled appearance consistent with the Input component.

#### Scenario: Textarea renders with dark surface styling and focus glow
- **WHEN** a Textarea is rendered and focused
- **THEN** it displays dark surface background at rest and primary accent glow on focus, consistent with Input behavior

### Requirement: Label primitive is available with monospace styling
The system SHALL provide a Label component that renders field labels in Geist Mono with uppercase, letter-spaced styling.

#### Scenario: Label renders with monospace tech styling
- **WHEN** a Label is rendered
- **THEN** text displays in Geist Mono, uppercase, with letter-spacing applied
