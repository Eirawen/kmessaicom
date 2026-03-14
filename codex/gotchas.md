# Gotchas

## Node.js version

**Use Node 22 LTS.** Node 25 ships a broken `globalThis.localStorage` (the object exists but `getItem`/`setItem` are `undefined` unless `--localstorage-file` is passed). Next.js's dev overlay calls `localStorage.getItem()` during SSR and crashes with a 500. There is no clean workaround — just use Node 22.

## Parallax drift

Elements that should stay visually locked together (e.g., treeline sitting on top of the water surface) **must have the same `data-parallax-speed`**. Even a small difference (0.01 vs 0.02) creates a visible gap on scroll. Currently treeline and water are both `0.02`.

The characters intentionally use a faster speed (`0.04`) for depth — this works because they overlap into the water zone and don't have a hard edge to align with the treeline.

## StarField RNG sync

`StarField` and `WaterLayer` both use the same seeded LCG (seed 314) to generate 120 star positions. The RNG must be called in exactly the same order: 4 calls per star (x, y, size, brightness). If you change the star generation in one file, you **must** change it in the other or the reflections won't align.

Wobble/shimmer parameters are derived from star positions (`star.sx * 997 + star.sy * 991`), NOT from additional `rand()` calls. This keeps the RNG in lockstep.

## SceneLayer object-fit

`SceneLayer` renders images with `object-fit: contain`. If the container aspect ratio doesn't match the image, you get invisible padding. The character image (`phoskhaledcliffpng.png`, 1534x1205) was trimmed to remove right-side blank space so it slots flush into the bottom-right corner. If you swap the image, check the aspect ratio.

The treeline uses `object-fit: cover !important` (overriding SceneLayer's default) because it needs to stretch full-width edge-to-edge without letterboxing.

## .next cache corruption

If you `rm -rf .next` while a dev server is running on any port, you'll get `ENOENT: fallback-build-manifest.json` errors. **Always kill all `next dev` processes first** (`pkill -f "next dev"`), then clear the cache.

## "use client" and SSR

Components marked `"use client"` still get server-side rendered for initial HTML. Only `useEffect` code is client-only. Don't access `window`, `document`, or browser APIs outside of `useEffect` in these components.

## Water layer z-ordering

DOM order in the scene container determines visual stacking (no z-index needed). The current order matters:
1. StarField (back)
2. Moon
3. Side trees
4. Treeline
5. WaterLayer (water surface, reflections)
6. Characters (front)

Moving WaterLayer after characters would put the water on top of Khaled & Phos.
