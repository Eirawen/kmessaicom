"use client";

import { useEffect, useRef } from "react";
import { subscribeToScroll, moonPosition } from "./scrollProgress";

function quadBezier(p0: number, p1: number, p2: number, t: number) {
  const inv = 1 - t;
  return inv * inv * p0 + 2 * inv * t * p1 + t * t * p2;
}

export function CelestialMoon() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isMobile = "ontouchstart" in window;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isMobile || prefersReduced) return;

    return subscribeToScroll((progress) => {
      if (!ref.current) return;

      // Moon arc: progress 0→0.5 maps to bezier t 0→1
      const t = Math.min(progress / 0.5, 1);
      const x = quadBezier(8, 50, 85, t);
      const y = quadBezier(6, -5, 45, t);

      // Opacity: full until 0.35, fade to 0 by 0.50
      let opacity: number;
      if (progress < 0.35) opacity = 0.9;
      else if (progress > 0.5) opacity = 0;
      else opacity = 0.9 * (1 - (progress - 0.35) / 0.15);

      ref.current.style.transform = `translate3d(0, 0, 0)`;
      ref.current.style.left = `${x}%`;
      ref.current.style.top = `${y}%`;
      ref.current.style.opacity = String(opacity);

      // Write to shared state for WaterLayer
      moonPosition.x = x;
      moonPosition.y = y;
      moonPosition.opacity = opacity;
    });
  }, []);

  return (
    <div
      ref={ref}
      className="absolute pointer-events-none"
      data-parallax-speed={0.008}
      style={{
        top: "6%",
        left: "8%",
        width: 140,
        height: 180,
        opacity: 0.9,
        willChange: "transform, opacity",
      }}
      aria-hidden="true"
    >
      <img
        src="/scene/moon.png"
        alt=""
        draggable={false}
        style={{ width: "100%", height: "100%", objectFit: "contain" }}
      />
    </div>
  );
}
