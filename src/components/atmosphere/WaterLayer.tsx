"use client";

import { useEffect, useRef } from "react";
import { scrollProgress, moonPosition, sunPosition } from "./scrollProgress";
import { multiStopLerp, rgbString, type RGB } from "@/lib/colorUtils";

const reflectionColorStops: [number, RGB][] = [
  [0.0, [180, 200, 215]],
  [0.35, [180, 200, 215]],
  [0.5, [160, 150, 210]],
  [0.7, [200, 140, 170]],
  [1.0, [220, 170, 140]],
];

const waterBgStops: [number, RGB][] = [
  [0.0, [4, 10, 20]],     // deep dark teal-navy — ties to moon #76caa2
  [0.3, [4, 10, 20]],     // hold dark through night
  [0.4, [14, 22, 46]],    // dark teal-indigo (sky: [42,31,78])
  [0.5, [32, 42, 82]],    // dark blue (sky: [134,118,202] — clearly darker, bluer)
  [0.6, [42, 38, 62]],    // dark muted blue (sky: [158,107,138])
  [0.7, [38, 32, 46]],    // dark cool (sky: [196,120,138])
  [0.85, [34, 28, 34]],   // dark neutral
  [1.0, [30, 26, 28]],    // dark warm-neutral (sky: [245,193,123] — water stays deep)
];

export function WaterLayer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const surfaceRef = useRef<HTMLDivElement>(null);
  const moonReflRef = useRef<HTMLDivElement>(null);
  const sunReflRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const isMobile = window.innerWidth < 768;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = window.innerWidth;
    const h = window.innerHeight;
    const waterHeight = h * 0.38;
    const waterlineY = h * 0.62;

    canvas.width = w * dpr;
    canvas.height = waterHeight * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${waterHeight}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    // Replicate exact seeded RNG from StarField (seed 314, LCG)
    let seed = 314;
    const rand = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };

    // Generate same star positions (4 rand() calls per star, same order)
    const starCount = 120;
    const stars: { sx: number; sy: number; size: number; brightness: number }[] = [];
    for (let i = 0; i < starCount; i++) {
      const sx = rand() * w;
      const sy = rand() * h * 0.65;
      const size = 0.5 + rand() * 1.2;
      const brightness = 0.15 + rand() * 0.35;
      stars.push({ sx, sy, size, brightness });
    }

    // Only reflect stars in the bottom 60% of the sky
    const skyThreshold = waterlineY * 0.4;

    const drawReflections = (time: number) => {
      const p = scrollProgress.current;
      // Star reflections fade slightly ahead of sky stars
      const starFade = p < 0.25 ? 1 : p > 0.55 ? 0 : 1 - (p - 0.25) / 0.3;
      const reflColor = multiStopLerp(reflectionColorStops, p);

      ctx.clearRect(0, 0, w, waterHeight);
      if (starFade === 0) return;

      for (const star of stars) {
        // Skip stars too high — they'd be too faint in real water
        if (star.sy < skyThreshold) continue;

        // Mirror Y across waterline into water canvas coords
        const reflY = waterlineY - star.sy;
        if (reflY < 0 || reflY > waterHeight) continue;

        // Horizontal wobble derived from position (not rand)
        const wobbleAmp = 0.5 + (star.sx % 3) * 0.3;
        const wobblePeriod = 3000 + ((star.sx * 1000) % 3000);
        const wobbleX =
          isMobile || prefersReducedMotion
            ? 0
            : Math.sin((time / wobblePeriod) * Math.PI * 2) * wobbleAmp;

        // Per-star shimmer/twinkle (3-6s cycle)
        const shimmerPeriod =
          3000 + (((star.sx * 997 + star.sy * 991) | 0) % 3000);
        const shimmer =
          isMobile || prefersReducedMotion
            ? 1
            : 0.6 + 0.4 * Math.sin((time / shimmerPeriod) * Math.PI * 2);

        const alpha = star.brightness * 0.55 * shimmer * starFade;

        ctx.fillStyle = rgbString(reflColor, alpha);
        ctx.beginPath();
        ctx.ellipse(
          star.sx + wobbleX,
          reflY,
          star.size,
          star.size * 1.75,
          0, 0, Math.PI * 2
        );
        ctx.fill();
      }
    };

    // Update water surface color and reflections based on scroll
    const updateWaterStyle = () => {
      const p = scrollProgress.current;

      // Water surface background color
      if (surfaceRef.current) {
        const bgColor = multiStopLerp(waterBgStops, p);
        surfaceRef.current.style.background = `linear-gradient(to bottom, transparent 0%, ${rgbString(bgColor, 0.15)} 8%, ${rgbString(bgColor, 0.45)} 22%, ${rgbString(bgColor, 0.75)} 42%, ${rgbString(bgColor)} 68%)`;

        // Water line color via CSS variable
        const lineColor = multiStopLerp(reflectionColorStops, p);
        surfaceRef.current.style.setProperty("--water-line-color", rgbString(lineColor, 0.015));
      }

      // Moon reflection tracking
      if (moonReflRef.current) {
        moonReflRef.current.style.left = `${moonPosition.x}%`;
        moonReflRef.current.style.opacity = String(Math.min(moonPosition.opacity * 0.5, 0.45));
      }

      // Sun reflection tracking
      if (sunReflRef.current) {
        sunReflRef.current.style.left = `${sunPosition.x}%`;
        sunReflRef.current.style.opacity = String(sunPosition.opacity * 0.35);
      }
    };

    // Click-to-ripple — listen on document since the scene container
    // has pointer-events:none and main content sits above at z-index 1
    const surface = surfaceRef.current!;

    const handleClick = (e: MouseEvent) => {
      // Don't steal clicks from interactive elements
      if ((e.target as HTMLElement).closest("a, button, input, [role='button']")) return;

      const rect = surface.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Only spawn if click lands within the water surface bounds
      if (x < 0 || x > rect.width || y < 0 || y > rect.height) return;

      const origin = document.createElement("div");
      origin.style.cssText = `position:absolute;left:${x}px;top:${y}px;width:0;height:0;pointer-events:none`;

      [0, 0.15, 0.35].forEach((delay) => {
        const ring = document.createElement("div");
        ring.className = "water-click-ripple";
        ring.style.animationDelay = `${delay}s`;
        origin.appendChild(ring);
      });

      surface.appendChild(origin);
      setTimeout(() => origin.remove(), 3500);
    };

    document.addEventListener("click", handleClick);

    // Static draw for mobile / reduced motion
    if (isMobile || prefersReducedMotion) {
      drawReflections(0);
      return () => document.removeEventListener("click", handleClick);
    }

    // Animated ~30fps on desktop
    let animId: number;
    let lastFrame = 0;
    const frameInterval = 1000 / 30;

    const animate = (time: number) => {
      if (time - lastFrame >= frameInterval) {
        drawReflections(time);
        updateWaterStyle();
        lastFrame = time;
      }
      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      document.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <div ref={surfaceRef} className="water-surface" data-parallax-speed={0.02} aria-hidden="true">
      {/* Star reflections canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

      {/* SVG filter for moon/sun distortion — GPU-composited, zero JS */}
      <svg className="absolute" width="0" height="0" aria-hidden="true">
        <defs>
          <filter id="water-distortion" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.008 0.024"
              numOctaves={3}
              result="noise"
            >
              <animate
                attributeName="seed"
                from="0"
                to="100"
                dur="10s"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale={9}
              xChannelSelector="R"
              yChannelSelector="G"
            />
            <feGaussianBlur stdDeviation="0.6" />
          </filter>
        </defs>
      </svg>

      {/* Flipped moon with water distortion */}
      <div ref={moonReflRef} className="water-moon-reflection">
        <img
          src="/scene/moon.png"
          alt=""
          draggable={false}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            transform: "scaleY(-1)",
          }}
        />
      </div>

      {/* Flipped sun with water distortion */}
      <div ref={sunReflRef} className="water-sun-reflection">
        <img
          src="/Favorites/Site Assets/pinkSun.png"
          alt=""
          draggable={false}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            transform: "scaleY(-1)",
          }}
        />
      </div>

    </div>
  );
}
