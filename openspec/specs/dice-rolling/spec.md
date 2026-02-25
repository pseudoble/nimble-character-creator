## ADDED Requirements

### Requirement: Full-viewport dice canvas overlay on sheet page
The system SHALL render an invisible full-viewport canvas overlay on the `/sheet` page using `@3d-dice/dice-box` for 3D dice rendering.

#### Scenario: Canvas is present but invisible on page load
- **WHEN** a user navigates to `/sheet`
- **THEN** a full-viewport canvas overlay is present in the DOM
- **AND** the canvas has `pointer-events: none` so it does not block interaction with the sheet

#### Scenario: Canvas enables pointer events during a roll
- **WHEN** a dice roll is triggered
- **THEN** the canvas switches to `pointer-events: auto` for the duration of the dice animation
- **AND** returns to `pointer-events: none` after the roll completes

### Requirement: Dice-box is lazy-loaded on first roll
The system SHALL NOT load the `@3d-dice/dice-box` library until the first dice roll is triggered, to avoid impacting initial page load performance.

#### Scenario: No dice-box loaded on page load
- **WHEN** the `/sheet` page loads
- **THEN** the `@3d-dice/dice-box` module is NOT imported or initialized

#### Scenario: First roll triggers initialization
- **WHEN** a user clicks a stat or skill modifier for the first time
- **THEN** the system dynamically imports `@3d-dice/dice-box`, initializes the instance, and executes the roll
- **AND** subsequent rolls reuse the already-initialized instance

### Requirement: Roll result displayed as toast
The system SHALL display a toast notification after dice settle showing the roll label, dice result breakdown, and total.

#### Scenario: Toast appears after roll completes
- **WHEN** a dice roll animation completes
- **THEN** a toast appears showing the roll label (e.g., "STR Check" or skill name), the individual die result, the modifier, and the final total

#### Scenario: Toast auto-dismisses
- **WHEN** a roll result toast is displayed
- **THEN** the toast automatically dismisses after approximately 4 seconds
- **AND** the user MAY dismiss the toast early by clicking it

### Requirement: Graceful degradation when dice-box fails
The system SHALL handle dice-box initialization failures gracefully without breaking the character sheet.

#### Scenario: dice-box fails to initialize
- **WHEN** dice-box initialization fails (e.g., OffscreenCanvas not supported)
- **THEN** the stat and skill values remain visible and the sheet remains fully functional
- **AND** clicking modifiers has no effect
