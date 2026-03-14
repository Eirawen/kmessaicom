"use client";

import { useEffect, useRef } from "react";
import { subscribeToScroll, sunPosition } from "./scrollProgress";

function quadBezier(p0: number, p1: number, p2: number, t: number) {
  const inv = 1 - t;
  return inv * inv * p0 + 2 * inv * t * p1 + t * t * p2;
}

export function CelestialSun() {
  const sunRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isMobile = "ontouchstart" in window;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isMobile || prefersReduced) return;

    return subscribeToScroll((progress) => {
      if (!sunRef.current || !glowRef.current) return;

      // Sun arc: progress 0.45→1.0 maps to bezier t 0→1
      let opacity: number;
      if (progress < 0.45) {
        opacity = 0;
        sunRef.current.style.opacity = "0";
        glowRef.current.style.opacity = "0";
        sunPosition.opacity = 0;
        return;
      }

      const t = (progress - 0.45) / 0.55;
      const x = quadBezier(5, 35, 45, t);
      const y = quadBezier(55, 5, 20, t);

      // Fade in 0.45→0.60
      if (progress < 0.6) opacity = (progress - 0.45) / 0.15;
      else opacity = 1;

      // Sun grows to emit light — scale from 1× to 1.8× as it rises
      const scale = 1 + t * 0.8;

      // Sharp sun
      sunRef.current.style.left = `${x}%`;
      sunRef.current.style.top = `${y}%`;
      sunRef.current.style.opacity = String(opacity);
      sunRef.current.style.transform = `translate3d(0, 0, 0) scale(${scale})`;

      // Glow — blurred duplicate, much larger, same position
      const glowScale = scale * 2.8;
      const glowBlur = 30 + t * 30;
      const glowOpacity = opacity * (0.45 + t * 0.25);
      glowRef.current.style.left = `${x}%`;
      glowRef.current.style.top = `${y}%`;
      glowRef.current.style.opacity = String(glowOpacity);
      glowRef.current.style.transform = `translate3d(0, 0, 0) scale(${glowScale})`;
      glowRef.current.style.filter = `blur(${glowBlur}px) saturate(1.3)`;

      // Write to shared state for WaterLayer
      sunPosition.x = x;
      sunPosition.y = y;
      sunPosition.opacity = opacity;
    });
  }, []);

  return (
    <>
      {/* Glow — separate element, behind the sun, no clipping container */}
      <div
        ref={glowRef}
        className="absolute pointer-events-none"
        style={{
          top: "55%",
          left: "5%",
          width: 120,
          height: 120,
          opacity: 0,
          willChange: "transform, filter, opacity",
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
      {/* Sharp sun — on top */}
      <div
        ref={sunRef}
        className="absolute pointer-events-none"
        style={{
          top: "55%",
          left: "5%",
          width: 120,
          height: 120,
          opacity: 0,
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
    </>
  );
}
