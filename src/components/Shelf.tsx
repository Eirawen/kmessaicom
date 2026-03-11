"use client";

import { ScrollReveal } from "./ScrollReveal";

type ShelfItem = {
  title: string;
  cover: string | null;
};

export function Shelf({
  label,
  items,
}: {
  label: string;
  items: ShelfItem[];
}) {
  return (
    <div className="mb-12">
      <ScrollReveal>
        <h3 className="section-heading mb-4">{label}</h3>
      </ScrollReveal>
      <ScrollReveal stagger>
        <div className="shelf-scroll">
          {items.map((item, i) => (
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
