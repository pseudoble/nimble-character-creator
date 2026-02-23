## Context

The Stats and Skills page (Step 3 of the character creator) allows users to assign skill points. There is a total limit of 4 skill points (`STEP_THREE_REQUIRED_SKILL_POINTS`). Currently, the UI only limits individual skill assignments to a maximum of 4 (`STEP_THREE_MAX_SKILL_POINTS_PER_SKILL`), but does not prevent the user from exceeding the total pool of 4 points across all skills.

Users have reported that when revisiting the page, they can assign an additional 4 points, although validation correctly catches the error on submission.

## Goals / Non-Goals

**Goals:**
- Prevent users from assigning more than the total allowed skill points in the UI.
- Ensure the "Remaining" skill points indicator correctly reflects the current allocation.
- Dynamically limit the maximum value of each skill input based on the remaining points in the pool.

**Non-Goals:**
- Change the total number of skill points (remains at 4).
- Modify the individual skill maximum (remains at 4).
- Change the validation logic on submission (already working).

## Decisions

- **Dynamic Input Capping**: The `max` attribute of each skill's `Input` component will be dynamically calculated as `Math.min(STEP_THREE_MAX_SKILL_POINTS_PER_SKILL, currentSkillPoints + remainingPoints)`.
- **Validation in `onChange`**: The `onChange` handler in `StepThreeForm` will be updated to ensure that any increase in skill points does not exceed the `remainingSkillPoints`.
- **Visual Feedback**: The "Remaining" points counter will continue to provide real-time feedback, and the inputs will be naturally capped to prevent invalid states.

## Risks / Trade-offs

- **[Risk]** If a user somehow manages to enter an invalid number (e.g., via direct state manipulation or a bug in capping), the "Remaining" count could go negative.
  - **Mitigation**: The validation logic on submission already catches these cases. The UI will also use `Math.max(0, remainingSkillPoints)` for display if necessary, though the goal is to prevent negative values entirely.
