## Context

The creator wizard (`/create/<step>`) uses a `CreatorDraft` object stored in React context and persisted to localStorage. Currently there is no way to inspect the draft state at runtime without opening browser DevTools and manually checking localStorage or adding `console.log` calls. A lightweight debug panel activated by a URL query parameter would streamline development.

The wizard is structured as:
- `src/app/create/layout.tsx` — wraps children in `CreatorProvider` + `CreatorShell`
- `src/lib/creator/creator-shell.tsx` — renders step nav, form content, and navigation buttons
- `src/lib/creator/context.tsx` — provides `draft` state and updater functions

## Goals / Non-Goals

**Goals:**
- Show a formatted, syntax-highlighted JSON dump of the full `CreatorDraft` when `?debug=true` is in the URL
- Render the debug panel below the form content but inside the wizard shell card
- Zero impact on bundle size and runtime when debug mode is off
- Use CSS-based syntax highlighting (no external library)

**Non-Goals:**
- Editable debug panel (read-only display only)
- Persisting debug mode across navigation (query param must be present on each URL)
- Production build stripping (the panel is harmless and useful in all environments)

## Decisions

**1. Query param detection in CreatorShell via `useSearchParams`**
Read `?debug=true` in `CreatorShell` using Next.js `useSearchParams()`. This keeps detection centralized — no per-step changes needed.
- Alternative: Read in each page component and pass as prop → rejected because it duplicates logic across every step page.

**2. Inline `<pre>` with CSS class-based highlighting**
Use `JSON.stringify(draft, null, 2)` and apply a simple regex-based highlighter that wraps keys, strings, numbers, booleans, and null in `<span>` elements with Tailwind classes matching the existing design system colors.
- Alternative: Install a syntax highlighting library (e.g., `prism-react-renderer`) → rejected as overkill for a single JSON blob.

**3. Single new component: `DebugPanel`**
Create `src/lib/creator/debug-panel.tsx` as a client component that accepts the `draft` object and renders the highlighted JSON. Keep it simple — no collapse/expand, just a styled `<pre>` block.

## Risks / Trade-offs

- [Minimal bundle impact] → The component is small and only rendered when query param is present. React will still include it in the client bundle, but it's negligible.
- [Search params require Suspense boundary] → `useSearchParams()` in Next.js App Router requires wrapping in a `Suspense` boundary to avoid build warnings. The layout already uses `"use client"`, so this is straightforward.
