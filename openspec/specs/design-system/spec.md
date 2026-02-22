## Requirements

### Requirement: Design token system defines the cyberpunk visual identity
The system SHALL define a design token system using CSS custom properties that establishes colors, typography, spacing, and effects for the application's cyberpunk-flavored dark aesthetic.

#### Scenario: Surface color tokens provide layered depth
- **WHEN** the design token CSS is loaded
- **THEN** at least four surface color tokens are defined (base, card, hover, input) with progressively lighter values in the oklch color space

#### Scenario: Accent color tokens define the neon palette
- **WHEN** the design token CSS is loaded
- **THEN** tokens for primary (cyan), secondary (magenta), and warning (amber) accent colors are defined

#### Scenario: Text color tokens define a readability hierarchy
- **WHEN** the design token CSS is loaded
- **THEN** tokens for high, medium, and low emphasis text colors are defined with cool tinting

### Requirement: Tailwind v4 is configured with the design token theme
The system SHALL configure Tailwind CSS v4 using `@theme` so that design tokens are available as Tailwind utility classes.

#### Scenario: Token-based utilities are available
- **WHEN** a component uses Tailwind classes like `bg-surface-0` or `text-neon-cyan`
- **THEN** the classes resolve to the corresponding design token values

#### Scenario: Tailwind CSS is imported in the application entry point
- **WHEN** the application loads
- **THEN** Tailwind's base, component, and utility layers are active

### Requirement: Typography uses Geist font family
The system SHALL configure Geist Sans as the body font and Geist Mono as the monospace font using `next/font`.

#### Scenario: Body text renders in Geist Sans
- **WHEN** any body text is displayed
- **THEN** the text renders in Geist Sans with appropriate fallbacks

#### Scenario: Monospace elements render in Geist Mono
- **WHEN** an element uses the monospace font class
- **THEN** the text renders in Geist Mono

### Requirement: Glow effect utilities are defined for interactive states
The system SHALL provide CSS utilities for glow effects (box-shadow based) intended for use on interactive and active states only.

#### Scenario: Glow utility applies a neon box-shadow
- **WHEN** a glow utility class is applied to an element
- **THEN** the element displays a colored box-shadow glow using the accent color tokens

#### Scenario: Glow is available in multiple accent colors
- **WHEN** glow utilities are used
- **THEN** variants exist for at least the primary (cyan) and secondary (magenta) accent colors

### Requirement: Global styles establish the dark base
The system SHALL apply global styles that set the application background to the base surface color and default text to the high-emphasis text color.

#### Scenario: Application has dark background by default
- **WHEN** the application loads
- **THEN** the `body` background is the base surface color and text is the high-emphasis text color
