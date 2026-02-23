## Context

The current `/create` route handles all steps of the character creation wizard internally, managing state via React state or a context provider. This means the URL remains `/create` throughout the process. This prevents users from using the browser's back/forward buttons naturally and makes it impossible to link directly to a specific step (e.g., to return to a draft). We are moving to a URL-based routing system where each step has a distinct path.

## Goals / Non-Goals

**Goals:**
-   Implement URL-based navigation for the character creation wizard.
-   Enable browser history navigation (back/forward).
-   Support deep linking to specific steps (with appropriate validation/redirection).
-   Redirect users to the first incomplete step if they try to jump ahead.
-   Update the step indicator to function as a navigation menu for visited/completed steps.

**Non-Goals:**
-   Changing the visual design of the wizard (beyond making step indicators clickable).
-   Persisting state to the backend (this is handled by existing draft persistence, we are just changing how navigation interacts with it).

## Decisions

-   **Next.js Nested Layouts vs. Dynamic Routes:** We will use Next.js file-system routing with a layout for the wizard shell.
    -   `/create/layout.tsx`: Contains the wizard shell (header, step indicator, background).
    -   `/create/page.tsx`: Redirects to the first step.
    -   `/create/[step]/page.tsx`: Or individual files like `/create/character-basics/page.tsx` for each step. Given the limited number of steps and specific logic for each, individual page files are clearer than a dynamic `[step]` route.
-   **State Management:** The existing `CreatorProvider` (or equivalent) will still hold the draft state. It needs to sync with the URL. When the route changes, the provider ensures the correct step is active.
-   **Redirection Logic:** Implemented in a `Guard` component or within the `layout.tsx` / `page.tsx` via `useEffect` or middleware. Since draft state is client-side (loaded from local storage or API), client-side redirection in the layout or a wrapper component is most appropriate. We will use a `StepGuard` component that checks `currentStep` vs `requestedStep` and redirects if necessary.

## Risks / Trade-offs

-   **Risk:** flicker on redirection.
    -   *Mitigation:* Show a loading state while draft data is loading and validation is checked.
-   **Risk:** deeply nested state logic complexity.
    -   *Mitigation:* Keep the URL as the source of truth for "current step", and the store as the source of truth for "draft data".

## Open Questions

-   None at this stage.
