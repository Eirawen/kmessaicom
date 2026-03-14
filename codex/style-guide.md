# Style Guide — kmessai.com

## Mood

A quiet night by a lake. Two figures fishing on a cliff under a gemstone moon. The site should feel like peering into a painted diorama — still, atmospheric, contemplative. Nothing demands attention; everything rewards it.

---

## Color System

### Foundation

The palette is built around three ideas: near-black depth, cool silver text, and a single jewel-tone accent drawn from the moon.

| Role | Token | Hex | Usage |
|------|-------|-----|-------|
| Background | `--color-bg` | `#060608` | Page background, sky |
| Water | — | `#050810` | Lake surface (slightly bluer than sky) |
| Elevated bg | `--color-bg-elevated` | `#0e0e12` | Raised surfaces, cards |
| Surface | `--color-surface` | `#14141a` | Card fills, image placeholders |

### Text

| Role | Token | Hex | Usage |
|------|-------|-----|-------|
| Primary | `--color-text` | `#c8cdd0` | Body text, headings |
| Muted | `--color-text-muted` | `#6a7478` | Secondary info, social icons |
| Dim | `--color-text-dim` | `#3a4044` | Barely-there labels |
| Structural muted | `--color-muted` | `#5a6a70` | Section headings |
| Structural dim | `--color-muted-dim` | `#3a4448` | Dividers, fine rules |

### Accent — Phosphophyllite

The accent is the color of phosphophyllite, the gemstone character from Houseki no Kuni. The moon in the scene is this color. It's the only chromatic hue on the site.

| Role | Token | Hex | Usage |
|------|-------|-----|-------|
| Moon base | — | `#76caa2` | The moon image's dominant color. Reference only — not used in CSS directly |
| Accent | `--color-accent` | `#7edcb4` | Tagline text, link hovers, interactive highlights |
| Accent light | `--color-accent-light` | `#a8e8cc` | Hover states (social icons) |
| Accent glow | `--color-accent-glow` | `rgba(126, 220, 180, 0.12)` | Subtle glows, selection background |

**Rule**: The accent should be used sparingly — tagline, hover states, selection highlight, subtle glows. It should never dominate a section. Think of it as moonlight: present but soft.

### Scene-Specific Colors

| Element | Color | Notes |
|---------|-------|-------|
| Stars (sky) | `rgba(200, 210, 220, 0.15–0.5)` | Cool silver, varies per star |
| Star reflections | `rgba(180, 200, 215, alpha)` | Slightly cooler than sky stars |
| Selection | `rgba(126, 220, 180, 0.2)` bg / `#e0f5ec` text | Accent-tinted |

---

## Typography

### Fonts

| Role | Font | Weights | Token |
|------|------|---------|-------|
| Display / Headings | Cormorant Garamond | 300–700 | `--font-display` |
| Body | Source Sans 3 | 300–600 | `--font-body` |

### Hierarchy

| Element | Size | Weight | Style |
|---------|------|--------|-------|
| Hero name (h1) | `text-5xl` → `text-7xl` | `font-light` (300) | Tight tracking |
| Tagline | `text-lg` → `text-xl` | `font-light` (300) | Italic, accent color, faint glow |
| Section heading | `0.75rem` | 600 | Uppercase, wide tracking (`0.06em`), muted color |
| Section title (h2) | `text-3xl` → `text-4xl` | `font-light` (300) | `text-slate-100` |
| Body text | `text-base` | 400 | `text-slate-400`, relaxed leading |
| Meta / labels | `text-sm` | 500 | Uppercase, wide tracking |

### Principles

- **Light weights dominate.** The site uses 300 and 400 almost exclusively. Bold is rare — 600 only for small-caps section headings.
- **Serif for display, sans for reading.** Cormorant gives elegance to headings. Source Sans keeps body text clean.
- **Generous spacing.** Sections have `py-28` padding. Text blocks have `leading-relaxed`. Nothing feels cramped.

---

## Spacing & Layout

- Content max-width: `max-w-2xl` (672px) for text sections, `max-w-3xl` (768px) for favorites/photos
- Horizontal padding: `px-6` → `sm:px-12` → `md:px-16` → `lg:px-24`
- Section vertical padding: `py-28`
- The site is a single long scroll. No navigation. No sidebar.

---

## Interaction

### Hover States

- **Social icons**: color shift to `--color-accent-light`, translateY(-2px)
- **Cover cards** (favorites): scale(1.04) translateY(-4px), accent glow box-shadow
- **Photo items**: translateY(-2px), faint accent glow

All transitions: `0.2s–0.3s ease`. Nothing snaps. Nothing bounces.

### Scroll Reveals

Content fades up with `ScrollReveal` component (IntersectionObserver). `fade-up` class: 24px translateY, 0.8s cubic-bezier transition. Staggered children offset by 100ms each.

---

## Atmosphere Rules

### Subtlety Scale

Everything in the scene is understated. When adding visual effects:

| Opacity | Appropriate for |
|---------|----------------|
| `0.01–0.02` | Line textures, barely-there details |
| `0.04–0.08` | Ripple borders, faint glows |
| `0.1–0.2` | Star reflections, dim star brightness |
| `0.3–0.5` | Moon reflection, brighter stars |
| `0.8–0.9` | Treeline, moon |
| `1.0` | Characters, text |

**If you're unsure, go more subtle.** It's always easier to turn something up than to realize you've made the scene look busy.

### Animation Tempo

- Stars twinkle: 3–6 second cycles (slow, meditative)
- Moon distortion: 10 second seed cycle (glacial)
- Ripples: 5 second expand cycle, staggered
- Nothing pulses fast. Nothing blinks. The scene breathes.

---

## Do / Don't

**Do:**
- Use the accent color only for interactive elements and the tagline
- Keep body text light-weight and well-spaced
- Let the dark background do the heavy lifting
- Test with `prefers-reduced-motion` — everything must degrade gracefully
- Keep the scene layers simple — painted PNG assets, not procedural complexity

**Don't:**
- Introduce new chromatic colors (no reds, blues, yellows)
- Use bold/heavy font weights for body text
- Add attention-grabbing animations (no pulse, bounce, shake)
- Put text over the scene area (bottom 38% of viewport) — that's the lake
- Add UI chrome (borders, shadows, cards) where negative space works
