"use client";

import { useEffect, useRef } from "react";
import { scrollProgress } from "./scrollProgress";

export function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    // Seeded random for consistent stars
    let seed = 314;
    const rand = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };

    const starCount = 120;
    const stars: { x: number; y: number; size: number; brightness: number; twinklePeriod: number }[] = [];
    for (let i = 0; i < starCount; i++) {
      const x = rand() * w;
      const y = rand() * h * 0.65;
      const size = 0.5 + rand() * 1.2;
      const brightness = 0.15 + rand() * 0.35;
      // Twinkle period derived from position (3-6s), same approach as water reflections
      const twinklePeriod = 3000 + (((x * 997 + y * 991) | 0) % 3000);
      stars.push({ x, y, size, brightness, twinklePeriod });
    }

    const drawStars = (time: number) => {
      const p = scrollProgress.current;
      const starFade = p < 0.3 ? 1 : p > 0.6 ? 0 : 1 - (p - 0.3) / 0.3;

      ctx.clearRect(0, 0, w, h);
      if (starFade === 0) return;

      for (const star of stars) {
        const twinkle = prefersReducedMotion
          ? 1
          : 0.7 + 0.3 * Math.sin((time / star.twinklePeriod) * Math.PI * 2);
        const alpha = star.brightness * twinkle * starFade;

        ctx.fillStyle = `rgba(200, 210, 220, ${alpha})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    if (prefersReducedMotion) {
      drawStars(0);
      return;
    }

    let animId: number;
    let lastFrame = 0;
    const frameInterval = 1000 / 30;

    const animate = (time: number) => {
      if (time - lastFrame >= frameInterval) {
        drawStars(time);
        lastFrame = time;
      }
      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      aria-hidden="true"
    />
  );
}
