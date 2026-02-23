## Why

When users select a class, ancestry, or background, they see only the name — no description, traits, or other details. Users must remember or look up what each option does, making the creation flow frustrating and uninformative.

## What Changes

- Show a summary panel for the selected class in Step 1, displaying the class description, key stats, and hit die
- Show a summary panel for the selected ancestry in Step 2, displaying size, trait name, and trait description
- Show a summary panel for the selected background in Step 2, displaying the background description and any requirement

## Capabilities

### New Capabilities

- `selection-summary-panels`: Inline summary display that appears below a select field when a valid option is chosen, showing relevant details from core data

### Modified Capabilities

- `creator-step-one-character-basics`: Step 1 form gains a class summary panel below the class select
- `creator-step-two-ancestry-background`: Step 2 form gains ancestry and background summary panels below their respective selects

## Impact

- `src/lib/creator/step-one-form.tsx` — add class summary rendering
- `src/lib/creator/step-two-form.tsx` — add ancestry and background summary rendering
- Core data imports (`classes.json`, `ancestries.json`, `backgrounds.json`) will be consumed directly by form components for lookup
