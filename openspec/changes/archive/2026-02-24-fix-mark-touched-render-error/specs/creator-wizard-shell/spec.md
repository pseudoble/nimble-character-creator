## ADDED Requirements

### Requirement: Accordion toggle does not trigger cross-component state updates during render
The system SHALL NOT call state setters belonging to ancestor components from within a state updater function of a descendant component. Specifically, the accordion toggle handler SHALL invoke `markTouched` outside of any `setState` updater callback.

#### Scenario: Toggling accordion sections produces no React warnings
- **WHEN** a user clicks an accordion section header to expand or collapse it
- **THEN** no "Cannot update a component while rendering a different component" console error is produced

#### Scenario: Previous step is still marked touched on toggle
- **WHEN** a user has Step A expanded and clicks Step B's header
- **THEN** Step A is marked as touched before Step B expands
