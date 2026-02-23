## 1. Data Layer

- [x] 1.1 Enrich `starting-gear.json` with damage, properties, and armor fields for all items (sourced from Nimble reference Weapons.md and Armor.md)
- [x] 1.2 Add `StepFourData` interface to `types.ts` and extend `CreatorDraft` with `stepFour`
- [x] 1.3 Add `EQUIPMENT_MONEY` to `STEP_IDS` in `constants.ts`
- [x] 1.4 Update `createEmptyDraft` in `draft-persistence.ts` to include `stepFour` defaults and bump `DRAFT_SCHEMA_VERSION` to 2 with v1 backfill logic

## 2. Validation

- [x] 2.1 Create `step-four-validation.ts` with `validateStepFour` (validates non-empty `equipmentChoice`)
- [x] 2.2 Write tests for Step 4 validation (empty fails, "gear" passes, "gold" passes)

## 3. Context & State

- [x] 3.1 Add `updateStepFour` to `CreatorProvider` in `context.tsx`, wire validation and persistence
- [x] 3.2 Add Step 4 to `resetStep` handling in context

## 4. Wizard Shell Updates

- [x] 4.1 Add Step 4 entry to `STEPS` and `STEP_PATHS` arrays in `creator-shell.tsx`
- [x] 4.2 Widen wizard shell container from `max-w-2xl` to `max-w-4xl`
- [x] 4.3 Update "Finish" logic so Step 3 shows "Next" and Step 4 shows "Finish"

## 5. Step 4 UI

- [x] 5.1 Create `step-four-form.tsx` with side-by-side gear/gold card layout, `-OR-` separator, category grouping, and item stat display
- [x] 5.2 Add gold pile image to `public/` as a static asset
- [x] 5.3 Create `app/create/equipment-money/page.tsx` with `StepGuard` wrapping and context wiring
- [x] 5.4 Add responsive layout (side-by-side on md+, stacked on small screens)

## 6. Data Integrity Tests

- [x] 6.1 Write tests verifying all class `startingGearIds` resolve to valid `starting-gear.json` entries
- [x] 6.2 Write tests verifying weapons have `damage` field and armor/shields have `armor` field
