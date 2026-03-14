"use client";

import { useEffect, type ReactNode } from "react";
import { notifySubscribers } from "./scrollProgress";

export function ParallaxProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Disable on touch devices or reduced motion preference
    const isMobile = "ontouchstart" in window;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isMobile || prefersReduced) return;

    let ticking = false;

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? scrollY / docHeight : 0;
        document.body.style.setProperty("--scroll-progress", String(progress));
        notifySubscribers(progress);

        const els = document.querySelectorAll<HTMLElement>("[data-parallax-speed]");
        for (let i = 0; i < els.length; i++) {
          const speed = parseFloat(els[i].dataset.parallaxSpeed || "0");
          els[i].style.transform = `translate3d(0, ${scrollY * speed}px, 0)`;
        }
        ticking = false;
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return <>{children}</>;
}
