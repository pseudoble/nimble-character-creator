## Context

The creator wizard has two steps: Step 1 (class, name, description) and Step 2 (ancestry, background, motivation). When users select a class, ancestry, or background from the dropdowns, they only see the formatted name — no details about what each option does. The core data JSON files contain rich descriptive information (descriptions, traits, stats) that can be surfaced inline.

## Goals / Non-Goals

**Goals:**
- Show relevant summary details immediately below each select field when a valid option is chosen
- Use existing core data JSON imports — no new data sources
- Match the existing design system aesthetic (neon/tech theme)

**Non-Goals:**
- Redesigning the select dropdowns themselves
- Adding search/filter to select fields
- Showing summaries for options while browsing the dropdown (only after selection)
- Persisting summary visibility state

## Decisions

### 1. Inline summary panel below each select

Summary panels render directly below the select field (but above validation errors). This keeps context close to the selection and requires no modal or sidebar.

**Alternative considered**: Tooltip on hover — rejected because mobile doesn't have hover, and tooltips are harder to read for longer content.

### 2. Direct JSON import in form components

Each form component imports the relevant JSON data file and does a simple `.find()` lookup by selected ID. This is straightforward since the JSON files are small (11 classes, 24 ancestries, 23 backgrounds) and already bundled.

**Alternative considered**: Passing full data objects through props from wizard-shell — rejected as it would add prop drilling complexity for no real benefit. The JSON imports are static and tree-shakeable.

### 3. Summary content per selection type

- **Class**: description, key stats (formatted), hit die
- **Ancestry**: size, trait name, trait description
- **Background**: description, requirement (if any)

These are the most useful fields for making an informed selection. Other fields (armor proficiencies, starting gear, etc.) are implementation details that would clutter the summary.

### 4. Shared visual treatment

All three summary panels use the same styling: a subtle bordered container with muted text, appearing with no animation. This keeps the UI consistent and simple.

## Risks / Trade-offs

- [Layout shift on selection] → Acceptable since the panel appears below the select and pushes content down naturally. The panels are small enough that this won't be jarring.
- [Bundle size from JSON imports in form components] → Negligible. The JSON files are already imported elsewhere (validation), and the data is small.
