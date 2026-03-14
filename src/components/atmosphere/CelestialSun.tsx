"use client";

import { useEffect, useRef } from "react";
import { subscribeToScroll, sunPosition } from "./scrollProgress";

function quadBezier(p0: number, p1: number, p2: number, t: number) {
  const inv = 1 - t;
  return inv * inv * p0 + 2 * inv * t * p1 + t * t * p2;
}

export function CelestialSun() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isMobile = "ontouchstart" in window;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isMobile || prefersReduced) return;

    return subscribeToScroll((progress) => {
      if (!ref.current) return;

      // Sun arc: progress 0.45→1.0 maps to bezier t 0→1
      let opacity: number;
      if (progress < 0.45) {
        opacity = 0;
        ref.current.style.opacity = "0";
        sunPosition.opacity = 0;
        return;
      }

      const t = (progress - 0.45) / 0.55;
      const x = quadBezier(5, 35, 45, t);
      const y = quadBezier(55, 5, 20, t);

      // Fade in 0.45→0.60
      if (progress < 0.6) opacity = (progress - 0.45) / 0.15;
      else opacity = 1;

      ref.current.style.left = `${x}%`;
      ref.current.style.top = `${y}%`;
      ref.current.style.opacity = String(opacity);

      // Warm glow intensifies with progress
      const glowIntensity = opacity * 0.6;
      const spread = 20 + t * 40;
      ref.current.style.boxShadow = `0 0 ${spread}px ${spread * 0.6}px rgba(202, 118, 158, ${glowIntensity})`;

      // Write to shared state for WaterLayer
      sunPosition.x = x;
      sunPosition.y = y;
      sunPosition.opacity = opacity;
    });
  }, []);

  return (
    <div
      ref={ref}
      className="absolute pointer-events-none"
      style={{
        top: "55%",
        left: "5%",
        width: 120,
        height: 120,
        opacity: 0,
        borderRadius: "50%",
        willChange: "transform, opacity",
      }}
      aria-hidden="true"
    >
      <img
        src="/Favorites/Site Assets/pinkSun.png"
        alt=""
        draggable={false}
        style={{ width: "100%", height: "100%", objectFit: "contain" }}
      />
    </div>
  );
}
