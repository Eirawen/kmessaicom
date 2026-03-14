# Architecture

## Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS 4 + vanilla CSS in `globals.css`
- **Fonts**: Cormorant Garamond (display/headings), Source Sans 3 (body)
- **No component library** — everything is hand-rolled

## Layout Structure

```
<html>
  <body>
    <ParallaxProvider>
      <div fixed inset-0 z-0>   ← Scene (background, not interactive)
        <StarField />            ← Canvas: 120 twinkling stars
        <CelestialSun />         ← Canvas: PNG sun texture with glow corona, scroll-driven arc
        <SceneLayer moon />      ← Parallax image layers
        <SceneLayer trees-left />
        <SceneLayer trees-right />
        <SceneLayer treeline />  ← Horizon silhouette, full width
        <WaterLayer />           ← Canvas reflections + SVG moon filter + CSS ripples
        <SceneLayer characters />← Khaled & Phos on cliff, bottom-right corner
      </div>
      <main z-1>                 ← Content scrolls above the scene
        {children}
      </main>
    </ParallaxProvider>
  </body>
</html>
```

The scene is a single `position: fixed` container at `z-index: 0`. All scene layers are absolutely positioned within it. Page content sits at `z-index: 1` and scrolls normally over the scene.

## Key Directories

```
src/
  app/
    layout.tsx        ← Root layout, scene layer stack
    page.tsx          ← Homepage content (hero, now, past, favorites, photos)
    globals.css       ← All styles: variables, scene layers, water, animations, components
  components/
    atmosphere/       ← Scene rendering
      ParallaxProvider.tsx  ← Scroll listener, applies transforms via data-parallax-speed
      StarField.tsx         ← Seeded RNG star canvas with twinkle animation
      CelestialSun.tsx      ← Canvas sun: PNG texture + radial glow corona + scroll arc
      WaterLayer.tsx        ← Star reflections, moon reflection, fishing ripples
      SceneLayer.tsx        ← Generic parallax image wrapper
    ScrollReveal.tsx  ← IntersectionObserver fade-in
    Shelf.tsx         ← Horizontal scroll gallery for favorites
    SocialIcons.tsx   ← Social links
  data/
    siteData.ts       ← Centralized content (text, links, favorites lists)
public/
  scene/              ← Scene PNG assets (moon, trees, etc.)
  Favorites/
    Site Assets/      ← Character image, treeline silhouette
    Books/, Games/... ← Cover art for favorites shelves
```

## Parallax System

`ParallaxProvider` listens to scroll events and applies `translate3d(0, scrollY * speed, 0)` to any element with a `data-parallax-speed` attribute.

Speed values create depth layers:
- `0.008` — Moon (farthest)
- `0.015` — Side trees (mid-distance)
- `0.02`  — Treeline, water surface (horizon)
- `0.04`  — Characters (closest/foreground)

**Critical rule**: Elements that must stay visually connected (treeline ↔ water edge) MUST share the same parallax speed, or they drift apart on scroll.
