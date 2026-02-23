## 1. Layout Update

- [x] 1.1 Change skill row grid from `sm:grid-cols-[minmax(0,1fr)_11rem]` to `sm:grid-cols-[minmax(0,1fr)_11rem_4rem]` in `step-three-form.tsx`
- [x] 1.2 Add a third column cell to each skill row that renders the live total as a signed integer using `formatSignedValue(liveSkillTotal)` with prominent styling (`font-mono text-lg font-bold text-neon-cyan`)
- [x] 1.3 Add a `title` attribute to the total cell with the calculation breakdown in the format `"{STAT} {signedStatValue} + Points {assignedPoints} = {signedTotal}"`

## 2. Cleanup

- [x] 2.1 Remove the inline `<p>` element showing "Total: +N (STAT +X + Points Y)" from the assigned-points column
- [x] 2.2 Clean up any unused variables or helpers that were only used by the removed inline total

## 3. Tests

- [x] 3.1 Update existing tests that assert on the inline total text to target the new total column element and its `title` attribute instead
- [x] 3.2 Add test: total column displays correct computed value (stat + points)
- [x] 3.3 Add test: total column updates when governing stat changes
- [x] 3.4 Add test: tooltip (`title` attribute) contains correct calculation breakdown
