## Why

Some backgrounds have stat requirements (e.g., Bumblewise requires 0 or negative WIL, Accidental Acrobat requires 0 or negative DEX). Currently, ancestry & background is step 2 and stats & skills is step 3, so users pick backgrounds before knowing their stats. Swapping these steps lets users choose stats first, enabling the UI to filter or flag backgrounds based on stat eligibility.

## What Changes

- Swap the order of the stats & skills step (currently step 2 position) and ancestry & background step (currently step 3 position) in the creator wizard
- Rename all positional naming (`stepTwo`, `stepThree`, file names like `step-two-form.tsx`) to semantic naming (`statsSkills`, `ancestryBackground`, `stats-skills-form.tsx`) so names reflect content, not position
- Update all cross-step data references (e.g., step 4 reading INT stat and ancestry ID) to use new semantic field names

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `creator-wizard-shell`: Step ordering changes from Basics → Ancestry/Background → Stats/Skills → Languages/Equipment to Basics → Stats/Skills → Ancestry/Background → Languages/Equipment
- `creator-step-two-ancestry-background`: Becomes step 3 in the wizard. Internal naming shifts from positional (`stepTwo`) to semantic (`ancestryBackground`)
- `creator-step-three-stats-skills`: Becomes step 2 in the wizard. Internal naming shifts from positional (`stepThree`) to semantic (`statsSkills`)
- `creator-step-four-languages`: Field references update from `stepThree.stats.int` → semantic naming, `stepTwo.ancestryId` → semantic naming
- `creator-step-four-equipment`: Field references update to use semantic naming

## Impact

- **Creator form components**: All step form files renamed from positional to semantic naming
- **Creator validation files**: Same positional-to-semantic rename
- **Creator context/types**: Draft interface fields renamed from `stepTwo`/`stepThree` to `ancestryBackground`/`statsSkills`
- **LocalStorage**: Existing saved drafts will have old field names; migration or reset needed
- **Tests**: Import paths and field references updated throughout
