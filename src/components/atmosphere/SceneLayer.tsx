"use client";

export function SceneLayer({
  src,
  speed = 0,
  className = "",
  style = {},
  alt = "",
}: {
  src: string;
  speed?: number;
  className?: string;
  style?: React.CSSProperties;
  alt?: string;
}) {
  return (
    <div
      className={`absolute pointer-events-none ${className}`}
      data-parallax-speed={speed}
      style={style}
      aria-hidden="true"
    >
      <img
        src={src}
        alt={alt}
        draggable={false}
        style={{ width: "100%", height: "100%", objectFit: "contain" }}
      />
    </div>
  );
}
