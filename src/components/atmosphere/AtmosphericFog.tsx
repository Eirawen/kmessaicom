"use client";

const fogLayers = [
  { className: "atmo-fog-1", speed: "0.02" },
  { className: "atmo-fog-2", speed: "0.035" },
  { className: "atmo-fog-3", speed: "0.015" },
  { className: "atmo-fog-4", speed: "0.04" },
  { className: "atmo-fog-5", speed: "0.025" },
];

export function AtmosphericFog() {
  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 1 }} aria-hidden="true">
      {fogLayers.map((layer) => (
        <div
          key={layer.className}
          className={`atmo-fog ${layer.className}`}
          data-parallax-speed={layer.speed}
        />
      ))}
    </div>
  );
}
