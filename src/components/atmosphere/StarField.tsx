"use client";

import { useEffect, useRef } from "react";

/**
 * Faint, static star field on a transparent canvas.
 * Just dots — no animation, no noise. Understated.
 */
export function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

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
    for (let i = 0; i < starCount; i++) {
      const x = rand() * w;
      const y = rand() * h * 0.65; // stars mostly in upper 2/3
      const size = 0.5 + rand() * 1.2;
      const brightness = 0.15 + rand() * 0.35;

      ctx.fillStyle = `rgba(200, 210, 220, ${brightness})`;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      aria-hidden="true"
    />
  );
}
