## Context

The application is a Next.js 16 + React 19 app with zero styling infrastructure. Components use semantic className strings (e.g., `creator-wizard`, `field`, `step-indicator`) but no CSS files or styling dependencies exist. The app currently renders as unstyled HTML.

The goal is to establish a complete styling foundation with a dark, cyberpunk-flavored aesthetic that is clean and well-designed — distinctive but not gimmicky. This foundation must scale from the current few screens to a significantly larger application.

## Goals / Non-Goals

**Goals:**
- Establish a design token system (colors, typography, spacing, effects) as CSS custom properties
- Install and configure Tailwind CSS v4 as the utility layer
- Integrate shadcn/ui for accessible, ownable UI primitives (Button, Input, Select, Textarea)
- Style the existing CreatorWizard and StepOneForm as first consumers
- Create a foundation that new components can adopt incrementally

**Non-Goals:**
- Heavy cyberpunk effects (scan-lines, CRT overlays, glitch animations) — this is cyberpunk-flavored, not Blade Runner
- Theming system or light mode — dark mode only
- Custom icon set or illustration system
- Responsive/mobile optimization (can come later)
- Styling components beyond the wizard flow in this change

## Decisions

### 1. Tailwind CSS v4 as the utility layer
**Choice**: Tailwind v4 with CSS-native `@theme` configuration
**Over**: Tailwind v3 (PostCSS plugin, JS config), CSS Modules, CSS-in-JS (styled-components, Emotion)

**Rationale**: Tailwind v4 is CSS-native — the theme is defined in a CSS file using `@theme` with CSS custom properties. This means design tokens are real CSS variables accessible everywhere, not locked in a JS config. Zero-config with Next.js. Best-in-class for rapid iteration while keeping things consistent via the constraint system.

### 2. shadcn/ui for UI primitives
**Choice**: shadcn/ui (copies component source into project) backed by Radix UI
**Over**: Headless libraries directly (Radix, React Aria), full component libraries (MUI, Chakra, Mantine)

**Rationale**: shadcn/ui gives us Radix accessibility (keyboard nav, ARIA, focus management) with full ownership of the component code. Components live in `src/components/ui/` and can be freely modified to match the cyberpunk aesthetic. No version-lock to a library's design opinions. This is critical for a custom visual identity — we need to own the styling, not override a library's defaults.

### 3. Geist font family via next/font
**Choice**: Geist Sans (body) + Geist Mono (labels, tech accents)
**Over**: Inter + JetBrains Mono, system fonts

**Rationale**: Geist ships with Next.js, zero additional setup. Clean and modern. Mono variant provides the "tech seasoning" for labels and indicators without going full monospace. Can be swapped later since fonts are behind CSS variables.

### 4. Color system using oklch
**Choice**: oklch color space for all design tokens
**Over**: hex, hsl, rgb

**Rationale**: oklch provides perceptually uniform lightness, making it easy to create consistent surface layers (each step up is visibly the same brightness increment). Critical for a layered dark theme where surface depth needs to feel intentional.

### 5. Glow as interaction signal
**Choice**: Box-shadow glow effects reserved strictly for interactive/active states
**Over**: Decorative glow on static elements, border-based glow everywhere

**Rationale**: Restraint is what makes the aesthetic feel designed vs. decorated. Glow means "this is interactive" or "this is active" — focus rings, primary button hover, active step indicator. This creates a consistent visual language that scales: users learn what glow means.

### 6. Component structure
**Choice**: shadcn primitives styled with Tailwind utilities + a small `cyber.css` for effects that can't be expressed as utilities (e.g., multi-stop glow gradients)
**Over**: All custom CSS, all Tailwind (no custom CSS)

**Rationale**: Tailwind handles 90% of styling. A thin custom CSS layer handles the cyberpunk-specific effects (glow keyframes, complex shadows) that would be awkward as inline utilities. This keeps the boundary clean: Tailwind for layout/spacing/color, custom CSS for signature effects.

## Risks / Trade-offs

- **shadcn/ui adds several Radix packages as dependencies** → Acceptable trade-off for production-grade accessibility. Tree-shaking keeps bundle impact minimal — only imported components ship.
- **Tailwind v4 is relatively new** → Stable release, well-supported by Next.js 16. Lower risk than staying on v3 which will eventually need migration anyway.
- **Custom aesthetic requires ongoing discipline** → Mitigated by design tokens as single source of truth. New components should compose tokens, not invent new colors/effects.
- **No light mode** → Explicitly a non-goal. Can be added later by extending the token system with theme-aware values if needed.
