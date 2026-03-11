"use client";

import { useEffect, useRef } from "react";

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

export function PaintCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const isMobile = typeof ontouchstart !== "undefined";
    const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1 : 2);
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    const rand = seededRandom(77);

    // Dark earth base — soil, not void
    ctx.fillStyle = "#080c08";
    ctx.fillRect(0, 0, w, h);

    // Subtle dot grid — the digital/technology substrate
    ctx.globalCompositeOperation = "source-over";
    const gridSpacing = 28;
    for (let x = gridSpacing; x < w; x += gridSpacing) {
      for (let y = gridSpacing; y < h; y += gridSpacing) {
        ctx.fillStyle = `rgba(60, 80, 60, ${0.08 + rand() * 0.06})`;
        ctx.beginPath();
        ctx.arc(x, y, 0.6, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Organic green growth forms breaking through the grid
    // These are clusters of overlapping soft shapes — like moss, lichen, roots
    ctx.globalCompositeOperation = "screen";

    const growths = [
      // Upper-left — bright living green, like new growth
      { cx: 0.12, cy: 0.18, color: [34, 197, 94], alpha: 0.06, count: 14, spread: 350, size: 250 },
      // Center — deep forest, the anchor
      { cx: 0.45, cy: 0.5, color: [22, 163, 74], alpha: 0.05, count: 18, spread: 500, size: 300 },
      // Right — spring green, reaching out
      { cx: 0.82, cy: 0.3, color: [74, 222, 128], alpha: 0.04, count: 10, spread: 300, size: 200 },
      // Bottom — darker, like roots underground
      { cx: 0.3, cy: 0.85, color: [21, 128, 61], alpha: 0.055, count: 12, spread: 400, size: 280 },
      // Upper-right — a touch of teal, algae in water
      { cx: 0.7, cy: 0.12, color: [45, 180, 140], alpha: 0.035, count: 8, spread: 250, size: 180 },
    ];

    for (const g of growths) {
      const baseX = g.cx * w;
      const baseY = g.cy * h;

      for (let i = 0; i < g.count; i++) {
        // Organic offset — not uniform, clustered with tendrils reaching out
        const angle = rand() * Math.PI * 2;
        const dist = rand() * rand() * g.spread; // cluster toward center
        const ox = Math.cos(angle) * dist;
        const oy = Math.sin(angle) * dist;
        const r = g.size * (0.3 + rand() * 0.7);
        const a = g.alpha * (0.5 + rand() * 1.0);
        const blur = 30 + rand() * 50;

        ctx.save();
        ctx.filter = `blur(${blur}px)`;
        ctx.fillStyle = `rgba(${g.color[0]}, ${g.color[1]}, ${g.color[2]}, ${a})`;
        ctx.beginPath();
        // Slightly irregular ellipses — organic, not perfect circles
        ctx.ellipse(
          baseX + ox,
          baseY + oy,
          r,
          r * (0.5 + rand() * 0.5),
          rand() * Math.PI,
          0,
          Math.PI * 2
        );
        ctx.fill();
        ctx.restore();
      }
    }

    // Disrupt grid near growth centers — life displacing structure
    // Overdraw slightly brighter dots where growth is strong
    ctx.globalCompositeOperation = "source-over";
    for (const g of growths) {
      const baseX = g.cx * w;
      const baseY = g.cy * h;
      const influenceRadius = g.spread * 0.6;

      for (let x = gridSpacing; x < w; x += gridSpacing) {
        for (let y = gridSpacing; y < h; y += gridSpacing) {
          const dx = x - baseX;
          const dy = y - baseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < influenceRadius) {
            const strength = 1 - dist / influenceRadius;
            // Shift dot green and slightly displace it
            const displaceX = (rand() - 0.5) * 3 * strength;
            const displaceY = (rand() - 0.5) * 3 * strength;
            ctx.fillStyle = `rgba(${g.color[0]}, ${g.color[1]}, ${g.color[2]}, ${0.15 * strength})`;
            ctx.beginPath();
            ctx.arc(x + displaceX, y + displaceY, 0.6 + strength * 0.8, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    }

    // Faint canvas texture — short marks, green-tinted
    ctx.globalCompositeOperation = "overlay";
    ctx.filter = "none";
    const lineCount = isMobile ? 600 : 1500;
    for (let i = 0; i < lineCount; i++) {
      const x = rand() * w;
      const y = rand() * h;
      const len = 2 + rand() * 3;
      const angle = rand() * Math.PI * 2;
      const alpha = 0.015 + rand() * 0.015;
      ctx.strokeStyle = `rgba(80, 120, 80, ${alpha})`;
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + Math.cos(angle) * len, y + Math.sin(angle) * len);
      ctx.stroke();
    }
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  );
}
