"use client";

import { useEffect, useRef } from "react";

// Bob at pixel (388, 581) in the 1152×896 image.
// object-fit: contain with near-matching aspect ratios means
// these percentages hold across all responsive breakpoints.
const RIPPLE_LEFT = (388 / 1152) * 100; // ~33.7%
const RIPPLE_TOP = 67; // slightly below bob (64.8%) — water surface

export function FishingRipples() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let lastY = window.scrollY;
    let lastT = performance.now();
    let velocity = 0;
    let rafId: number;

    const tick = () => {
      const now = performance.now();
      const dt = now - lastT;
      const dy = Math.abs(window.scrollY - lastY);

      if (dt > 0) {
        const instant = dy / dt; // px/ms
        velocity = velocity * 0.85 + instant * 0.15;
      }

      lastY = window.scrollY;
      lastT = now;

      el.style.setProperty(
        "--ripple-intensity",
        String(Math.min(velocity / 1.5, 1))
      );

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div
      ref={ref}
      className="fishing-ripples"
      data-parallax-speed={0.04}
      aria-hidden="true"
      style={{ "--ripple-intensity": "0" } as React.CSSProperties}
    >
      <div
        className="fishing-ripple-origin"
        style={{ left: `${RIPPLE_LEFT}%`, top: `${RIPPLE_TOP}%` }}
      >
        <div className="fishing-ripple" style={{ animationDelay: "0s" }} />
        <div className="fishing-ripple" style={{ animationDelay: "1.5s" }} />
        <div className="fishing-ripple" style={{ animationDelay: "3s" }} />
      </div>
    </div>
  );
}
