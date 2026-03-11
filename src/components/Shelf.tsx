"use client";

import { ScrollReveal } from "./ScrollReveal";

type ShelfItem = {
  title: string;
  cover: string | null;
};

export function Shelf({
  label,
  description,
  items,
}: {
  label: string;
  description: string;
  items: ShelfItem[];
}) {
  return (
    <div className="mb-16">
      <ScrollReveal>
        <h3 className="section-heading mb-2">{label}</h3>
        <p className="text-sm text-slate-400 leading-relaxed mb-6 max-w-lg">
          {description}
        </p>
      </ScrollReveal>
      <ScrollReveal stagger>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {items.slice(0, 5).map((item, i) => (
            <div key={i} className="cover-card fade-up">
              {item.cover ? (
                <img
                  src={item.cover}
                  alt={item.title}
                  className="cover-img"
                  loading="lazy"
                />
              ) : (
                <div className="cover-img flex items-center justify-center border border-slate-700/30">
                  <span className="text-slate-500 text-xs text-center px-2 font-medium">
                    {item.title}
                  </span>
                </div>
              )}
              <p className="mt-2 text-xs text-slate-400 leading-tight truncate">
                {item.title}
              </p>
            </div>
          ))}
        </div>
      </ScrollReveal>
    </div>
  );
}
