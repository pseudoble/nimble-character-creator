## Why

The skill allocation list currently shows each skill's computed total (governing stat + assigned points) as inline text below the number input, making it easy to miss and cluttering the assigned-points column. Moving the total into its own prominent column improves scannability and keeps the assignment controls focused on their single job.

## What Changes

- Add a third column to each skill row (right of the assigned-points column) that displays the live computed total as a prominent integer
- Add a mouseover tooltip on the total that explains the calculation (e.g., "INT +2 + Points 1 = +3")
- Remove the existing inline "Total: +N ..." text from the assigned-points column, leaving only the input control and its label

## Capabilities

### New Capabilities

_(none)_

### Modified Capabilities

- `creator-step-three-skill-layout`: Skill rows gain a third "total" column with tooltip; inline total text removed from the assigned-points column

## Impact

- `src/lib/creator/step-three-form.tsx` — grid layout changes from 2 to 3 columns; total display and tooltip markup added; inline total text removed
- Existing tests covering the live total display will need to target the new column/tooltip instead of the inline text
