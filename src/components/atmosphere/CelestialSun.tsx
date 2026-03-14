"use client";

import { useEffect, useRef } from "react";
import { subscribeToScroll, sunPosition } from "./scrollProgress";

function quadBezier(p0: number, p1: number, p2: number, t: number) {
  const inv = 1 - t;
  return inv * inv * p0 + 2 * inv * t * p1 + t * t * p2;
}

export function CelestialSun() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const isMobile = "ontouchstart" in window;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isMobile || prefersReduced) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const size = 500;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    const cx = size / 2;
    const cy = size / 2;

    // Load the sun PNG texture
    const sunImg = new Image();
    sunImg.src = "/Favorites/Site Assets/pinkSun.png";

    let scrollT = 0;
    let scrollOpacity = 0;

    const unsub = subscribeToScroll((progress) => {
      if (!wrapperRef.current) return;

      if (progress < 0.45) {
        wrapperRef.current.style.opacity = "0";
        sunPosition.opacity = 0;
        scrollOpacity = 0;
        return;
      }

      const t = (progress - 0.45) / 0.55;
      scrollT = t;
      const x = quadBezier(5, 35, 45, t);
      const y = quadBezier(55, 5, 20, t);

      let opacity: number;
      if (progress < 0.6) opacity = (progress - 0.45) / 0.15;
      else opacity = 1;
      scrollOpacity = opacity;

      const scale = 1 + t * 0.8;

      wrapperRef.current.style.left = `${x}%`;
      wrapperRef.current.style.top = `${y}%`;
      wrapperRef.current.style.opacity = String(opacity);
      wrapperRef.current.style.transform = `translate(-50%, -50%) scale(${scale})`;

      sunPosition.x = x;
      sunPosition.y = y;
      sunPosition.opacity = opacity;
    });

    let animId: number;
    let lastFrame = 0;
    const frameInterval = 1000 / 30;

    const draw = (time: number) => {
      if (time - lastFrame < frameInterval) {
        animId = requestAnimationFrame(draw);
        return;
      }
      lastFrame = time;

      if (scrollOpacity === 0) {
        animId = requestAnimationFrame(draw);
        return;
      }

      ctx.clearRect(0, 0, size, size);

      // Breathing pulse — layered sine waves for organic feel
      const pulse1 = 0.85 + 0.15 * Math.sin(time / 2000 * Math.PI * 2);
      const pulse2 = 0.9 + 0.1 * Math.sin(time / 3200 * Math.PI * 2 + 1.2);
      const pulse = pulse1 * pulse2;
      const shimmer = 0.7 + 0.3 * Math.sin(time / 800 * Math.PI * 2);

      // Outer corona — large, soft, atmospheric
      const outerR = (160 + scrollT * 50) * pulse;
      const outerGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, outerR);
      outerGrad.addColorStop(0, `rgba(245, 193, 123, ${0.3 * pulse})`);
      outerGrad.addColorStop(0.3, `rgba(232, 158, 138, ${0.2 * pulse})`);
      outerGrad.addColorStop(0.6, `rgba(202, 118, 158, ${0.1 * pulse})`);
      outerGrad.addColorStop(1, "rgba(202, 118, 158, 0)");
      ctx.fillStyle = outerGrad;
      ctx.fillRect(0, 0, size, size);

      // Mid glow — the visible body of the sun
      const midR = (70 + scrollT * 25) * pulse2;
      const midGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, midR);
      midGrad.addColorStop(0, `rgba(255, 210, 180, ${0.85 * pulse})`);
      midGrad.addColorStop(0.35, `rgba(245, 180, 150, ${0.6 * pulse})`);
      midGrad.addColorStop(0.7, `rgba(235, 150, 140, ${0.3 * pulse})`);
      midGrad.addColorStop(1, "rgba(220, 130, 140, 0)");
      ctx.fillStyle = midGrad;
      ctx.fillRect(0, 0, size, size);

      // Sun PNG texture — drawn with breathing, wobble, and shimmer
      if (sunImg.complete && sunImg.naturalWidth > 0) {
        const imgSize = 120 + scrollT * 30;
        const scalePulse = 1 + 0.035 * Math.sin(time / 2000 * Math.PI * 2) + 0.025 * Math.sin(time / 3200 * Math.PI * 2 + 1.2);
        const rotationWobble = (Math.PI / 120) * Math.sin(time / 5000 * Math.PI * 2);
        const alphaShimmer = 0.88 + 0.12 * Math.sin(time / 1200 * Math.PI * 2);

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(rotationWobble);
        ctx.scale(scalePulse, scalePulse);
        ctx.globalAlpha = alphaShimmer;
        ctx.drawImage(sunImg, -imgSize / 2, -imgSize / 2, imgSize, imgSize);
        ctx.restore();
      } else {
        // Fallback hot core while PNG loads
        const coreR = (30 + scrollT * 12) * pulse1;
        const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR);
        coreGrad.addColorStop(0, `rgba(255, 245, 235, ${0.95 * shimmer})`);
        coreGrad.addColorStop(0.3, `rgba(255, 225, 200, ${0.85 * shimmer})`);
        coreGrad.addColorStop(0.6, `rgba(250, 200, 170, ${0.5 * shimmer})`);
        coreGrad.addColorStop(1, "rgba(245, 185, 155, 0)");
        ctx.fillStyle = coreGrad;
        ctx.fillRect(0, 0, size, size);
      }

      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);

    return () => {
      unsub();
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="absolute pointer-events-none"
      style={{
        top: "55%",
        left: "5%",
        width: 500,
        height: 500,
        opacity: 0,
        transform: "translate(-50%, -50%)",
        willChange: "transform, opacity",
      }}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
