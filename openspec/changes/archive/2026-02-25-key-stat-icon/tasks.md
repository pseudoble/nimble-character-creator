## 1. Data Layer

- [x] 1.1 Add `keyStats: string[]` to the `SheetData` interface in `src/lib/sheet/compute-sheet-data.ts`
- [x] 1.2 Populate `keyStats` from `cls?.keyStats ?? []` in `computeSheetData` and include it in the returned object

## 2. Component

- [x] 2.1 In `src/lib/sheet/character-sheet.tsx`, update the stats grid to render a 🔑 span after the stat label when `data.keyStats.includes(stat)` is true

## 3. Tests

- [x] 3.1 Update `computeSheetData` tests to assert `keyStats` is present and correct for a class-bearing draft
- [x] 3.2 Update `computeSheetData` tests to assert `keyStats` is `[]` when no class is selected
