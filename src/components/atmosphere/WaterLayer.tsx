"use client";

import { useEffect, useRef } from "react";

export function WaterLayer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
      ctx.clearRect(0, 0, w, waterHeight);

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

        const alpha = star.brightness * 0.4 * shimmer;

        ctx.fillStyle = `rgba(180, 200, 215, ${alpha})`;
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

    // Static draw for mobile / reduced motion
    if (isMobile || prefersReducedMotion) {
      drawReflections(0);
      return;
    }

    // Animated ~30fps on desktop
    let animId: number;
    let lastFrame = 0;
    const frameInterval = 1000 / 30;

    const animate = (time: number) => {
      if (time - lastFrame >= frameInterval) {
        drawReflections(time);
        lastFrame = time;
      }
      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="water-surface" data-parallax-speed={0.02} aria-hidden="true">
      {/* Star reflections canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

      {/* SVG filter for moon distortion — GPU-composited, zero JS */}
      <svg className="absolute" width="0" height="0" aria-hidden="true">
        <defs>
          <filter id="water-distortion" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.012 0.035"
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
              scale={14}
              xChannelSelector="R"
              yChannelSelector="G"
            />
            <feGaussianBlur stdDeviation="0.6" />
          </filter>
        </defs>
      </svg>

      {/* Flipped moon with water distortion */}
      <div className="water-moon-reflection">
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

      {/* Fishing line ripples */}
      <div className="water-ripple-origin">
        <div className="water-ripple" style={{ animationDelay: "0s" }} />
        <div className="water-ripple" style={{ animationDelay: "1.7s" }} />
        <div className="water-ripple" style={{ animationDelay: "3.3s" }} />
      </div>
    </div>
  );
}
