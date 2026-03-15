"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { subscribeToScroll } from "@/components/atmosphere/scrollProgress";
import { multiStopLerp, rgbString, type RGB } from "@/lib/colorUtils";

// Darkened sky-harmonized tints for panel backgrounds
const panelStops: [number, RGB][] = [
  [0.0, [6, 6, 12]],
  [0.3, [6, 6, 12]],
  [0.4, [16, 12, 30]],
  [0.5, [38, 33, 58]],
  [0.6, [42, 28, 38]],
  [0.7, [50, 30, 35]],
  [0.85, [56, 42, 30]],
  [1.0, [60, 48, 28]],
];

// Brighter accent tints for borders
const borderStops: [number, RGB][] = [
  [0.0, [30, 40, 55]],
  [0.3, [30, 40, 55]],
  [0.4, [55, 42, 85]],
  [0.5, [90, 80, 140]],
  [0.6, [110, 75, 95]],
  [0.7, [135, 85, 95]],
  [0.85, [160, 115, 85]],
  [1.0, [170, 135, 85]],
];

const opacities = { subtle: 0.18, normal: 0.28, strong: 0.38 };

export function GlassPanel({
  children,
  className = "",
  intensity = "normal",
}: {
  children: ReactNode;
  className?: string;
  intensity?: "subtle" | "normal" | "strong";
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isMobile = "ontouchstart" in window;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (isMobile || prefersReduced) return;

    const opacity = opacities[intensity];

    return subscribeToScroll((progress) => {
      if (!ref.current) return;
      const tint = multiStopLerp(panelStops, progress);
      const border = multiStopLerp(borderStops, progress);
      ref.current.style.backgroundColor = rgbString(tint, opacity);
      ref.current.style.borderColor = rgbString(border, 0.12);
    });
  }, [intensity]);

  return (
    <div ref={ref} className={`glass-panel glass-${intensity} ${className}`}>
      {children}
    </div>
  );
}
