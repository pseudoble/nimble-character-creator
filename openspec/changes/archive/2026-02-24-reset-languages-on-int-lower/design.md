## Context

The character creator wizard has cross-step dependencies: Step 3 (Stats & Skills) determines the INT stat, which controls how many bonus languages can be selected in Step 4 (Languages & Equipment). Currently, `updateStepThree` in `context.tsx` handles one cross-step reset — when the stat array changes, all stat assignments are cleared. However, no similar mechanism exists for INT changes affecting Step 4 language selections.

The `selectedLanguages` array in `draft.stepFour` persists independently. If a user sets INT=2, picks 2 languages, then returns to Step 3 and lowers INT to 0, the 2 language selections remain — causing a validation error the user must manually fix.

## Goals / Non-Goals

**Goals:**
- Automatically trim or clear bonus language selections when INT is lowered in Step 3
- Follow the existing pattern in `updateStepThree` for cross-step side effects
- Maintain consistency: similar to how stat array changes reset stat assignments

**Non-Goals:**
- Changing how language selection UI works in Step 4
- Adding undo/confirmation dialogs for the reset
- Resetting equipment choice when stats change (no dependency exists)

## Decisions

### 1. Trim languages inside `updateStepThree` (not in Step 4 UI or validation)

**Rationale**: The existing pattern for cross-step resets lives in `updateStepThree` (stat array change resets stats). Adding language trimming here keeps all Step 3 side effects co-located. The alternative — reacting in Step 4's render or validation — would leave stale state in the draft between steps.

**Alternatives considered**:
- *Step 4 `useEffect`*: Would only fire when Step 4 is mounted, leaving invalid state while on other steps
- *Validation-only*: Already exists but doesn't fix the state, just flags it as an error

### 2. Trim from the end rather than clear entirely

**Rationale**: If INT goes from 3→1, the user likely still wants their first pick. Trimming `selectedLanguages` to `newInt` length preserves earlier selections. If INT drops to 0 or below, the array is cleared entirely. This is less disruptive than always clearing.

**Alternative considered**:
- *Always clear*: Simpler but more disruptive. A user going from INT 3→2 loses all 3 selections unnecessarily.

### 3. Only react to INT value changes, not all stat updates

**Rationale**: The trimming logic should only run when the INT stat value actually changes. Other stat changes (STR, DEX, WIL) have no bearing on languages. We compare the previous and new INT values to avoid unnecessary resets.

## Risks / Trade-offs

- [Trim order depends on array position] → Users may not realize which language was dropped. Acceptable since language re-selection is quick and low-cost.
- [Stat array change already resets all stats including INT] → When stat array changes, stats are cleared to `""`, which means INT becomes `0`. The language trim logic must handle this case (INT parsed as 0 clears all languages). This is correct behavior since a stat array change is a major reset.
