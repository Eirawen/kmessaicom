"use client";

import { useEffect, useRef } from "react";
import { subscribeToScroll } from "./scrollProgress";
import { multiStopLerp, lerpColor, rgbString, type RGB } from "@/lib/colorUtils";

const skyStops: [number, RGB][] = [
  [0.0, [6, 6, 8]],
  [0.3, [6, 6, 8]],
  [0.4, [42, 31, 78]],
  [0.5, [134, 118, 202]],
  [0.6, [158, 107, 138]],
  [0.7, [196, 120, 138]],
  [0.85, [232, 168, 124]],
  [1.0, [245, 193, 123]],
];

export function SkyGradient() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isMobile = "ontouchstart" in window;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isMobile || prefersReduced) return;

    return subscribeToScroll((progress) => {
      if (!ref.current) return;
      const top = multiStopLerp(skyStops, progress);
      const bottom = lerpColor(top, [255, 255, 255] as RGB, 0.15);
      ref.current.style.background = `linear-gradient(to bottom, ${rgbString(top)}, ${rgbString(bottom)})`;
    });
  }, []);

  return (
    <div
      ref={ref}
      className="absolute inset-0 pointer-events-none"
      style={{ background: "rgb(6, 6, 8)" }}
      aria-hidden="true"
    />
  );
}
