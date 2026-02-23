## Why

The current wizard navigation relies on internal state or a single route, which limits the user's ability to bookmark specific steps or use browser navigation buttons effectively. Moving to URL-based navigation with distinct path segments will improve the user experience by making the application state explicit in the URL, enabling deep linking (where appropriate), and providing standard browser navigation behavior.

## What Changes

-   **URL Structure**: Implement distinct URL paths for each wizard step:
    -   `/create/character-basics` (Step 1)
    -   `/create/ancestry-background` (Step 2)
    -   `/create/stats-skills` (Step 3)
-   **Redirection Logic**:
    -   Redirect `/create` to the first incomplete step (defaulting to Step 1).
    -   Guard against skipping steps: If a user attempts to navigate to a step (e.g., Step 3) without completing prior steps (e.g., Step 1), redirect them to the first incomplete step.
-   **Step Indicator**: Update the step indicator pills to be clickable links, allowing users to navigate to any *visited* or *completed* step (or the current step), but not future locked steps.
-   **Navigation Controls**: Ensure "Back" and "Next" buttons trigger URL navigation.

## Capabilities

### New Capabilities
<!-- Capabilities being introduced. Replace <name> with kebab-case identifier (e.g., user-auth, data-export, api-rate-limiting). Each creates specs/<name>/spec.md -->

### Modified Capabilities
<!-- Existing capabilities whose REQUIREMENTS are changing (not just implementation).
     Only list here if spec-level behavior changes. Each needs a delta spec file.
     Use existing spec names from openspec/specs/. Leave empty if no requirement changes. -->
- `creator-wizard-shell`: Update navigation requirements to mandate URL-based routing, path segments, and redirection rules for incomplete steps.

## Impact

-   **Frontend Architecture**: Requires restructuring the `/create` route, possibly using Next.js nested layouts or dynamic routing to handle the sub-paths.
-   **Components**: Updates to the wizard shell component and step indicator component.
-   **Testing**: Existing navigation tests will need to be updated to verify URL changes and redirection logic.
