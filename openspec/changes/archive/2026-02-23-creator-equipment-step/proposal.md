## Why

The character creator currently ends at Step 3 (Stats & Skills), but the Nimble rulebook includes an Equipment & Money decision as the next player choice. Heroes must choose between taking their class's predefined starting gear or 50 gold pieces. This is the next meaningful choice in character creation, as derived stats (HP, Hit Dice, etc.) require no player input.

## What Changes

- Add Step 4 "Equipment & Money" to the character creation wizard
- Enrich `starting-gear.json` with item details (damage dice, properties, armor values) sourced from the Nimble reference
- Present a side-by-side choice: class starting gear (left, grouped by category with stats) OR 50 gp (right, with gold pile artwork and larger font)
- Extend the wizard shell, draft state, validation, and persistence to support the new step
- Add route `/create/equipment-money` with StepGuard protection

## Capabilities

### New Capabilities
- `creator-step-four-equipment`: Step 4 form presenting the gear-vs-gold choice, displaying class starting gear with item details grouped by category
- `starting-gear-details`: Enriched starting gear data including damage, properties, and armor values for display in the equipment step

### Modified Capabilities
- `creator-wizard-shell`: Step navigation must include Step 4, advancement gating must cover Step 4 validation, back/reset must work for Step 4, URL navigation must include `/create/equipment-money`

## Impact

- **Data**: `starting-gear.json` schema changes to include damage, properties, armor, cost fields
- **State**: `CreatorDraft` gains `stepFour: { equipmentChoice: "gear" | "gold" | "" }`
- **Routing**: New route at `app/create/equipment-money/page.tsx`
- **Wizard shell**: `STEP_IDS`, `STEPS`, `STEP_PATHS` arrays grow by one entry
- **Validation**: New `step-four-validation.ts` (trivially validates non-empty choice)
- **Persistence**: Draft schema version bump to handle new stepFour field
- **Assets**: Gold pile image added as static asset
