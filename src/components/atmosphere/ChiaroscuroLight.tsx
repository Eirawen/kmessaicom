"use client";

export function ChiaroscuroLight() {
  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 2 }} aria-hidden="true">
      {/* Primary bioluminescent glow — upper left */}
      <div
        className="bio-glow-primary"
        data-parallax-speed="0.02"
      />
      {/* Secondary glow — lower right, deeper */}
      <div
        className="bio-glow-secondary"
        data-parallax-speed="0.01"
      />
      {/* Teal accent — life finds a way */}
      <div
        className="bio-glow-accent"
        data-parallax-speed="0.04"
      />
    </div>
  );
}
