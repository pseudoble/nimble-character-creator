## 1. Layout Width Changes

- [x] 1.1 Change outer container from `max-w-6xl` to `max-w-7xl` in CreatorShell
- [x] 1.2 Change left panel from `lg:w-1/2` to `lg:w-2/5`
- [x] 1.3 Change right panel from `lg:w-1/2` to `lg:w-3/5`

## 2. Sidebar Container

- [x] 2.1 Wrap accordion sections in a single sidebar container with `border-l-2 border-l-neon-cyan/30 rounded-r-lg bg-surface-1`
- [x] 2.2 Remove `space-y-2` gap between sections and add `border-t border-surface-3` dividers between sections (skip first section)
- [x] 2.3 Move "Reset All" button inside the sidebar container

## 3. Accordion Section Restyling

- [x] 3.1 Remove per-section card styling (`rounded-lg border bg-surface-1`) from AccordionSection
- [x] 3.2 Remove expanded-state border glow (`border-neon-cyan/40`) and needs-attention border (`border-amber-500/40`) from section wrappers
- [x] 3.3 Replace numbered circle indicators (`h-7 w-7 rounded-full border`) with compact dots (`h-2 w-2 rounded-full`) using state-based colors: cyan for complete/expanded, amber for needs-attention, surface-3 for untouched
- [x] 3.4 Verify expanded step header uses `text-neon-cyan` without glow, collapsed headers use appropriate emphasis levels

## 4. Verification

- [x] 4.1 Verify accordion interactions still work: expand/collapse, next/reset buttons, validation indicators, tooltip warnings
- [x] 4.2 Verify mobile stacked layout is unaffected below `lg` breakpoint
- [x] 4.3 Visual check that sidebar feels distinct from but complementary to the character sheet preview
