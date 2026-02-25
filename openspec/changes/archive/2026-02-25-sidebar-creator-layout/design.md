## Context

The creator page (`/create`) uses `CreatorShell` in `src/lib/creator/creator-shell.tsx` to render a two-panel layout: accordion form on the left, character sheet preview on the right. Both panels are `lg:w-1/2` within a `max-w-6xl` container. Each accordion step is a standalone card (`rounded-lg border bg-surface-1`) with `space-y-2` gaps between them.

The design system uses Tailwind v4 with OKLCH color tokens (`surface-0` through `surface-3`, `neon-cyan`, `neon-magenta`, `neon-amber`) and glow utilities.

## Goals / Non-Goals

**Goals:**
- Make the accordion feel like a sidebar — visually subordinate to the sheet preview
- Give the sheet preview 60% width so it's the focal point
- Create a more compact accordion by removing per-card borders and using dividers
- Keep the sidebar visually complementary to the sheet (same design system, different structural feel)

**Non-Goals:**
- No behavioral changes to accordion interactions (expand, collapse, next, reset, validation)
- No independent scroll or sticky positioning
- No changes to form content within accordion steps
- No changes to mobile stacked layout behavior (still stacks vertically below `lg`)

## Decisions

### 1. Single sidebar container with left-edge accent

**Decision**: Wrap all accordion sections in one container with `border-l-2 border-l-neon-cyan/30 rounded-r-lg bg-surface-1`.

**Rationale**: A left-edge accent immediately signals "sidebar/navigation" and is a common UI pattern. It uses the existing cyan accent without competing with the sheet preview's card borders and glow effects. The `rounded-r-lg` (right corners only) reinforces the "attached to the left edge" feel.

**Alternatives considered**:
- Subtle surface container (plain `bg-surface-1 rounded-lg border`) — too similar to the sheet cards, doesn't read as "sidebar"
- Frosted glass (`backdrop-blur`) — more complex, potentially distracting, and doesn't add functional clarity

### 2. Divider-separated sections instead of individual cards

**Decision**: Remove per-step `rounded-lg border bg-surface-1` cards. Steps are separated by `border-t border-surface-3` divider lines within the single sidebar container.

**Rationale**: Individual cards add visual noise and vertical padding. Dividers are lighter, more compact, and reinforce that steps are sections of one panel rather than independent elements.

### 3. Simplified step indicators

**Decision**: Replace the `h-7 w-7 rounded-full border` numbered circles with smaller `h-2 w-2 rounded-full` dots. The dot color conveys state: `bg-neon-cyan` for complete, `bg-amber-500` for needs-attention, `bg-surface-3` for untouched. The active/expanded step uses `bg-neon-cyan` with no glow.

**Rationale**: The numbered circles are useful when steps are independent cards and you need to identify them. In a unified sidebar, the vertical position and label are sufficient for identification. Smaller dots reduce visual clutter and give more horizontal space to labels.

**Note**: Step numbers are removed from the indicators but step labels remain prominent, so accessibility and findability are preserved.

### 4. Container width bump to max-w-7xl

**Decision**: Change outer container from `max-w-6xl` (1152px) to `max-w-7xl` (1280px).

**Rationale**: At 40% of 1152px, the sidebar gets 461px — tight for form inputs. At 40% of 1280px, it gets 512px — comfortable. The 60% preview side gets 768px, plenty for the sheet.

### 5. Expanded step styling

**Decision**: The expanded step's header text gets `text-neon-cyan` but no border glow or background change on the section. The form content area has standard padding within the sidebar container.

**Rationale**: Glow effects are reserved for the sheet preview side. The sidebar should be understated. Cyan text on the active label is sufficient to indicate the current step.

## Risks / Trade-offs

- **Tighter sidebar width** → Mitigated by bumping to `max-w-7xl`. At 512px the forms have adequate room. If specific forms feel cramped, individual form components can be adjusted independently.
- **Removing step numbers from indicators** → Users can still identify steps by label. The vertical order is clear in a sidebar. If this proves confusing, numbers can be added back to the dot or beside the label.
- **Single container changes the "feel"** → This is intentional. If the unified feel is too tight, `space-y` between divider sections can be increased without reverting to cards.
