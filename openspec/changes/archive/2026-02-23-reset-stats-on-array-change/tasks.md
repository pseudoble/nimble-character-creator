## 1. Core Implementation

- [x] 1.1 In `updateStepThree` in `src/lib/creator/context.tsx`, detect when `updates.statArrayId` is present and differs from `prev.stepThree.statArrayId`, and reset `stats` to `{ str: "", dex: "", int: "", wil: "" }` while preserving `skillAllocations`

## 2. Tests

- [x] 2.1 Add test: changing stat array resets all four stat assignments to empty
- [x] 2.2 Add test: changing stat array preserves existing skill allocations
- [x] 2.3 Add test: selecting the same stat array does not reset stat assignments
