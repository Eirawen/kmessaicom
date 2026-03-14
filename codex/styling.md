# Styling Guide

## Approach

Styles live in two places:
- **`globals.css`** — scene layers, water, animations, component classes, CSS variables
- **Tailwind utility classes** — inline in JSX for layout, spacing, typography

There is no CSS modules, styled-components, or CSS-in-JS. Keep it simple.

## CSS Variables

All theme colors are in `:root` in `globals.css`. Use them:
```css
var(--color-bg)          /* #060608 — page background */
var(--color-surface)     /* #14141a — card/elevated backgrounds */
var(--color-accent)      /* #7edcb4 — phosphophyllite green */
var(--color-accent-light)/* #a8e8cc — lighter accent for hovers */
var(--color-text)        /* #c8cdd0 — primary text */
var(--color-text-muted)  /* #6a7478 — secondary text */
var(--color-muted-dim)   /* #3a4448 — dividers, very subtle elements */
```

## Responsive Breakpoints

Three tiers, matching Tailwind defaults:
- **Mobile**: `max-width: 768px`
- **Desktop**: default (769px–1279px)
- **Large desktop**: `min-width: 1280px`

Scene layer sizes adjust at each breakpoint. Check `globals.css` for the media queries.

## Animation Conventions

- Scroll reveals: `fade-up` class + `IntersectionObserver` via `ScrollReveal` component
- Staggered children: parent gets `stagger` class, children get `fade-up`
- Hover effects: `transition: transform 0.3s ease, box-shadow 0.3s ease` is the standard
- Scene animations: 30fps throttled `requestAnimationFrame` for canvas, CSS keyframes for everything else
- All animations must respect `prefers-reduced-motion: reduce`

## Opacity / Subtlety Scale

The site aesthetic is understated. Effects should be felt, not seen:
- Star brightness: `0.15–0.5` alpha
- Star reflections: `brightness * 0.55` alpha
- Water line texture: `0.015` alpha
- Ripple borders: `0.06` alpha
- Moon reflection: `0.45` opacity
- Treeline: `0.85` opacity
- Accent glow: `0.08–0.12` alpha

When in doubt, go more subtle. You can always increase later.
