## 1. Debug Panel Component

- [x] 1.1 Create `src/lib/creator/debug-panel.tsx` — a client component that accepts `CreatorDraft`, renders `JSON.stringify(draft, null, 2)` inside a `<pre>` block with CSS-based syntax highlighting using regex replacement to wrap keys, strings, numbers, booleans, and null in colored `<span>` elements matching the design system
- [x] 1.2 Style the debug panel with a `border-surface-3 bg-surface-2` container, monospace font, and overflow-x scroll

## 2. Wire Into Wizard Shell

- [x] 2.1 In `src/lib/creator/creator-shell.tsx`, import `useSearchParams` from `next/navigation` and read the `debug` query parameter
- [x] 2.2 Wrap the `CreatorShell` content in a `Suspense` boundary (required by `useSearchParams` in Next.js App Router)
- [x] 2.3 Conditionally render `<DebugPanel draft={draft} />` below `<main>` when `debug === "true"`

## 3. Testing

- [x] 3.1 Add test: debug panel renders when `?debug=true` is in the URL and displays valid JSON matching the draft state
- [x] 3.2 Add test: debug panel does NOT render when query param is absent
