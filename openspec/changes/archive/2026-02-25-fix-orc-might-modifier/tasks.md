## 1. Correct Orc Modifier Source Data

- [x] 1.1 Update Orc ancestry entry in `src/lib/core-data/trait-modifiers.ts` from `skills: { might: 2 }` to `skills: { might: 1 }`
- [x] 1.2 Verify no other code path redefines Orc flat Might bonuses

## 2. Add Regression Coverage

- [x] 2.1 Add/adjust sheet derivation tests to assert Orc Might totals use `+1` ancestry modifier
- [x] 2.2 Ensure the Orc test case covers computed total math (`stat + allocated + ancestry flat modifier`)

## 3. Validate Behavior

- [x] 3.1 Run targeted test suites for sheet/skill derivation and confirm all pass
- [x] 3.2 Confirm generated sheet data for an Orc example yields expected Might total
