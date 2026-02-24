## MODIFIED Requirements

### Requirement: Form sidebar scrolls independently
The system SHALL use a single page-level scrollbar for the entire creator layout. Neither the form sidebar nor the sheet preview panel SHALL have independent scroll containers or sticky positioning. Both panels SHALL render at their natural height and the page SHALL scroll as a single document.

#### Scenario: Page scrolls as single document on wide screens
- **WHEN** the accordion content or sheet preview exceeds the viewport height on a viewport at or above the `lg` breakpoint
- **THEN** the browser's page-level scrollbar handles overflow and neither panel has its own scrollbar

#### Scenario: Page scrolls as single document on narrow screens
- **WHEN** the stacked layout content exceeds the viewport height on a viewport below the `lg` breakpoint
- **THEN** the browser's page-level scrollbar handles overflow (unchanged from current mobile behavior)
