## 1. Core Implementation

- [x] 1.1 In `updateStepThree` in `context.tsx`, add logic to detect when the INT stat value changes and trim `stepFour.selectedLanguages` accordingly: clear if new INT <= 0, trim to new INT length if reduced but still positive, no change if INT increased or unchanged
- [x] 1.2 Ensure stat array change (which resets all stats to `""`) also clears `stepFour.selectedLanguages` as part of the same state update

## 2. Tests

- [x] 2.1 Add tests verifying that lowering INT from 2→0 clears all selected languages
- [x] 2.2 Add tests verifying that lowering INT from 3→1 trims to the first selected language
- [x] 2.3 Add tests verifying that raising INT does not remove existing language selections
- [x] 2.4 Add tests verifying that changing a non-INT stat does not affect language selections
- [x] 2.5 Add tests verifying that stat array change clears language selections
