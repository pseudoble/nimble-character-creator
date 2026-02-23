### Requirement: Debug panel displays draft JSON when query param is set
The system SHALL render a debug panel below the form content in the creator wizard when the URL contains `?debug=true`. The panel SHALL display the full `CreatorDraft` object as formatted JSON with syntax highlighting. When the query parameter is absent or set to any value other than `"true"`, the panel SHALL NOT be rendered.

#### Scenario: Debug mode activated
- **WHEN** a user navigates to `/create/character-basics?debug=true`
- **THEN** a `<pre>` block is rendered below the form content displaying the full `CreatorDraft` JSON, formatted with 2-space indentation and syntax-highlighted

#### Scenario: Debug mode not activated
- **WHEN** a user navigates to `/create/character-basics` without `?debug=true`
- **THEN** no debug panel is rendered

#### Scenario: Debug panel updates reactively
- **WHEN** debug mode is active and the user changes a form field
- **THEN** the debug panel SHALL update to reflect the new draft state immediately

### Requirement: Debug panel uses syntax highlighting
The debug panel SHALL apply CSS-based syntax highlighting to the JSON output. Keys, strings, numbers, booleans, and null values SHALL each be visually distinct using colors from the existing design system.

#### Scenario: JSON values are color-coded
- **WHEN** the debug panel renders a draft containing string, number, boolean, and null values
- **THEN** each value type is rendered with a distinct color class
