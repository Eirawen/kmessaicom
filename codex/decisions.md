# Design Decisions

## Visual Identity

The site depicts a nighttime lakeside scene: two figures (Khaled and Phos from Houseki no Kuni) sitting on a cliff, fishing under a starry sky with a phosphophyllite-green crescent moon. The aesthetic is quiet, dark, atmospheric — like a painted illustration you're peering into.

## Color Palette

- **Background**: `#060608` — near-black with a hint of blue
- **Water**: `#050810` — slightly darker/bluer than the sky
- **Accent**: `#7edcb4` — phosphophyllite green, used sparingly (tagline, hover states, selection)
- **Text**: `#c8cdd0` (primary), `#6a7478` (muted), `#3a4044` (dim)
- **Star reflections**: `rgba(180, 200, 215, alpha)` — cool silver-blue

The palette is deliberately monochromatic with a single warm-cool accent. Don't introduce new colors without strong reason.

## Typography

- **Headings**: Cormorant Garamond — elegant serif, used for section headings and h1-h4
- **Body**: Source Sans 3 — clean sans-serif, light weights (300-600)
- Section headings are small caps (`text-transform: uppercase`, `letter-spacing: 0.06em`, `font-size: 0.75rem`)

## Scene Composition

The scene is built from layered PNG assets, not procedural generation (except stars). This was a deliberate choice — hand-drawn/painted assets give warmth that procedural art can't match.

**Layer order (back to front)**:
1. Star canvas — 120 seeded stars in upper 65% of viewport, twinkling
2. Sun canvas — pinkSun.png with glow corona, scroll-driven bezier arc
3. Moon — phosphophyllite crescent, top-left, slowest parallax
3. Side trees — decorative framing, left and right edges
4. Treeline — full-width horizon silhouette at the sky/water boundary
5. Water surface — gradient fade, star reflections, moon distortion, fishing ripples
6. Characters — Khaled & Phos on cliff, flush bottom-right corner

## Water Reflections — Hybrid Approach

The water layer uses three different rendering techniques, each chosen for what it does best:
- **Star reflections**: Canvas (`ctx.ellipse`) — needs per-frame animation (wobble + shimmer), 120 draw calls is trivial for canvas
- **Moon reflection**: CSS `<img>` + SVG `<filter>` with animated `feTurbulence` — GPU-composited distortion with zero JS
- **Fishing ripples**: Pure CSS `@keyframes` — simple scale+opacity animation, no JS needed

## Characters Flush to Corner

The character image is positioned at `bottom: 0; right: 0` with no offset. The PNG was trimmed so its bottom and right edges are flat — it slots into the viewport corner like a puzzle piece. This is intentional and looks wrong with any offset.

## Content Structure

Content is centralized in `src/data/siteData.ts`, not scattered across components. This makes it easy to update text without touching component code. The page is a single scroll: Hero → Now → Past → Writing → Favorites → Photos → Footer.

## CelestialSun — Living PNG on Canvas

The sun uses `pinkSun.png` drawn on a `<canvas>` rather than as a static `<img>` or pure gradient. This gives us the actual artwork as the sun's visual identity while enabling per-frame animation.

**Rendering stack (back to front on the 500×500 canvas):**
1. Outer corona — radial gradient glow (warm pink/peach), breathes with layered sine pulses
2. Mid glow — tighter radial gradient body, breathes on a slightly different cycle
3. Sun PNG — `pinkSun.png` drawn with `ctx.drawImage()`, animated transforms
4. Ghost layer — a single slightly-larger, slightly-rotated copy of the PNG at 15% opacity, creating soft wavy edges on the ray tips

**Animation parameters (deliberately slow — the user is sensitive to motion):**
- Rotation: one full turn every **72 seconds** + ±1.5° wobble on a 5s sine
- Scale pulse: ±1.2% on a 3s sine — barely perceptible breathing
- Ghost layer: ±0.04 radian rotation offset on a 2s sine, 4% larger, 15% alpha
- No alpha shimmer on the main layer — held at 0.95

**Scroll behavior:**
- Invisible below 45% scroll progress, fades in between 45–60%, fully visible above 60%
- Follows a quadratic bezier arc across the viewport (bottom-left → top-center → upper-right)
- Wrapper scale grows from 1.0→1.8 as scroll progresses
- Shares position via `sunPosition` global for WaterLayer reflection

**Key design principle:** When the user says "slow it down," they mean it. The sun went through three speed halvings (18s → 36s → 72s per rotation) before feeling right. Always err on the side of glacially slow for this site's aesthetic.

## Reduced Motion

All animations respect `prefers-reduced-motion: reduce`:
- Stars: static (no twinkle)
- Water reflections: static (no wobble/shimmer)
- Ripples: frozen at mid-expansion
- Scroll reveals: instant visibility, no transition
