# Scene Assets

All scene PNGs are transparent-background images composited over the dark site background.

## Asset Inventory

| Asset | Path | Dimensions | Notes |
|-------|------|-----------|-------|
| Moon | `/scene/moon.png` | — | Phosphophyllite-colored crescent |
| Trees (left) | `/scene/trees-left.png` | — | Decorative framing, bottom-left |
| Trees (right) | `/scene/trees-right.png` | — | Decorative framing, bottom-right |
| Treeline | `/Favorites/Site Assets/fulltreenobg.png` | — | Full-width horizon silhouette. Hourglass shape (thinner in center) — positioned slightly low (`bottom: 34%`) to hide the center gap |
| Characters | `/Favorites/Site Assets/phoskhaledcliffpng.png` | 1534x1205 | Khaled & Phos on cliff. Right and bottom edges are flat/trimmed for flush corner placement |
| Sun | `/Favorites/Site Assets/pinkSun.png` | — | Pink/warm sun artwork, drawn on canvas by CelestialSun component with glow corona behind it |
| Cliff (unused) | `/scene/cliff.png` | — | Older standalone cliff asset, superseded by combined character image |
| Characters alt (unused) | `/scene/khaled-phos.png` | — | Older character image without cliff |
| Characters alt (unused) | `/scene/khaled-phos-cliff.png` | 1645x1205 | Older combined image with right-side blank space |

## Adding New Scene Layers

1. Place the PNG in `public/scene/` or `public/Favorites/Site Assets/`
2. Add a `<SceneLayer>` in `layout.tsx` at the correct position in DOM order (order = z-order)
3. Add a CSS class in `globals.css` under the "SCENE LAYERS" section with positioning
4. Choose a parallax speed that matches the layer's intended depth
5. If the layer must align with another layer's edge, use the **same** parallax speed

For full-width layers, override `object-fit` to `cover`:
```css
.scene-your-layer img {
  object-fit: cover !important;
  object-position: bottom center;
}
```
