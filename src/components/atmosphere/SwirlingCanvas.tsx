"use client";

import { useEffect, useRef } from "react";

interface Spore {
  x: number;
  y: number;
  baseSpeed: number;
  drift: number;
  size: number;
  alpha: number;
  color: [number, number, number];
  phase: number;
  wobbleSpeed: number;
  wobbleAmp: number;
}

function createSpores(w: number, h: number, count: number): Spore[] {
  const spores: Spore[] = [];
  for (let i = 0; i < count; i++) {
    const bright = Math.random() > 0.6;
    spores.push({
      x: Math.random() * w,
      y: Math.random() * h,
      baseSpeed: 0.15 + Math.random() * 0.35,
      drift: (Math.random() - 0.5) * 0.3,
      size: bright ? 2 + Math.random() * 3 : 1 + Math.random() * 1.5,
      alpha: bright ? 0.3 + Math.random() * 0.4 : 0.1 + Math.random() * 0.2,
      color: bright
        ? [100 + Math.random() * 80, 200 + Math.random() * 55, 80 + Math.random() * 60]
        : [40 + Math.random() * 40, 140 + Math.random() * 60, 60 + Math.random() * 40],
      phase: Math.random() * Math.PI * 2,
      wobbleSpeed: 0.001 + Math.random() * 0.002,
      wobbleAmp: 15 + Math.random() * 30,
    });
  }
  return spores;
}

export function SwirlingCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const isMobile = typeof ontouchstart !== "undefined" || window.innerWidth < 768;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const sporeCount = isMobile ? 15 : 35;
    const spores = createSpores(w, h, sporeCount);

    let lastFrame = 0;
    const FRAME_INTERVAL = isMobile ? 66 : 33; // ~15fps mobile, ~30fps desktop

    function draw(time: number) {
      rafRef.current = requestAnimationFrame(draw);
      if (time - lastFrame < FRAME_INTERVAL) return;
      lastFrame = time;

      ctx!.clearRect(0, 0, w, h);

      for (const s of spores) {
        // Float upward, wobble side to side
        s.y -= s.baseSpeed;
        s.x += s.drift + Math.sin(time * s.wobbleSpeed + s.phase) * 0.3;

        // Wrap around when off-screen
        if (s.y < -10) {
          s.y = h + 10;
          s.x = Math.random() * w;
        }
        if (s.x < -20) s.x = w + 20;
        if (s.x > w + 20) s.x = -20;

        // Pulsing alpha — breathing
        const pulse = 0.7 + 0.3 * Math.sin(time * 0.002 + s.phase);
        const a = s.alpha * pulse;

        // Glow effect — larger faint circle behind
        ctx!.beginPath();
        ctx!.arc(s.x, s.y, s.size * 4, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${s.color[0]}, ${s.color[1]}, ${s.color[2]}, ${a * 0.15})`;
        ctx!.fill();

        // Core
        ctx!.beginPath();
        ctx!.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${s.color[0]}, ${s.color[1]}, ${s.color[2]}, ${a})`;
        ctx!.fill();
      }
    }

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
      aria-hidden="true"
    />
  );
}
