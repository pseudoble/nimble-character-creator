## 1. Tailwind v4 & Dependencies

- [x] 1.1 Install Tailwind CSS v4 and configure with Next.js 16 (add CSS import to app entry)
- [x] 1.2 Install shadcn/ui dependencies (`class-variance-authority`, `clsx`, `tailwind-merge`, Radix packages) and initialize shadcn config
- [x] 1.3 Configure Geist Sans and Geist Mono via `next/font` in `layout.tsx`, expose as CSS variables

## 2. Design Tokens & Global Styles

- [x] 2.1 Define color tokens in Tailwind `@theme`: surface layers (base/card/hover/input), accents (cyan/magenta/amber), text hierarchy (high/med/low)
- [x] 2.2 Define glow effect utilities in CSS (box-shadow based, primary and secondary accent variants)
- [x] 2.3 Apply global styles: body background to base surface, default text to high-emphasis, font-family variables

## 3. UI Primitives (shadcn/ui)

- [x] 3.1 Add and style Button primitive: primary accent default, glow on hover, keyboard accessible
- [x] 3.2 Add and style Input primitive: dark surface background, subtle border, cyan glow on focus, amber glow on `aria-invalid`
- [x] 3.3 Add and style Select primitive: consistent with Input styling, glow on focus
- [x] 3.4 Add and style Textarea primitive: consistent with Input styling, glow on focus
- [x] 3.5 Add and style Label primitive: Geist Mono, uppercase, letter-spaced

## 4. Creator Wizard Shell Styling

- [x] 4.1 Style wizard shell layout: centered card on dark background, surface-1 card with subtle border
- [x] 4.2 Style step navigation: monospace labels, active step with primary accent + glow, completed steps with checkmark, dimmed pending steps
- [x] 4.3 Replace wizard advance button with styled Button primitive

## 5. Step One Form Styling

- [x] 5.1 Replace native `<select>`, `<input>`, `<textarea>` with styled Select, Input, Textarea primitives
- [x] 5.2 Replace field labels with styled Label primitives (monospace, uppercase, letter-spaced)
- [x] 5.3 Style error states: warning accent border/glow on invalid fields, styled error text below fields
