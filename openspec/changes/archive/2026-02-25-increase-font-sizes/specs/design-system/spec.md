## MODIFIED Requirements

### Requirement: Typography uses Geist font family
The system SHALL configure Geist Sans as the body font and Geist Mono as the monospace font using `next/font`. All text size classes SHALL use Tailwind's standard scale shifted up one step from the original baseline: `text-[10px]` becomes `text-xs`, `text-xs` becomes `text-sm`, `text-sm` becomes `text-base`, `text-lg` becomes `text-xl`, and `text-2xl` becomes `text-3xl`.

#### Scenario: Body text renders in Geist Sans
- **WHEN** any body text is displayed
- **THEN** the text renders in Geist Sans with appropriate fallbacks

#### Scenario: Monospace elements render in Geist Mono
- **WHEN** an element uses the monospace font class
- **THEN** the text renders in Geist Mono

#### Scenario: Smallest UI text uses text-xs
- **WHEN** metadata labels, section headings, or stat abbreviations are displayed (previously text-[10px])
- **THEN** the text renders at Tailwind's `text-xs` size (12px)

#### Scenario: Default body text uses text-sm
- **WHEN** standard body content, error messages, or secondary labels are displayed (previously text-xs)
- **THEN** the text renders at Tailwind's `text-sm` size (14px)

#### Scenario: Form inputs and interactive text use text-base
- **WHEN** form inputs, buttons, or section headers are displayed (previously text-sm)
- **THEN** the text renders at Tailwind's `text-base` size (16px)

#### Scenario: Key values and headers use text-xl
- **WHEN** character names, stat values, or ability modifiers are displayed (previously text-lg)
- **THEN** the text renders at Tailwind's `text-xl` size (20px)

#### Scenario: Special emphasis text uses text-3xl
- **WHEN** highlighted values like gold amounts are displayed (previously text-2xl)
- **THEN** the text renders at Tailwind's `text-3xl` size (30px)
