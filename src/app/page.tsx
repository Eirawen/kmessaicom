"use client";

import { siteData } from "@/data/siteData";
import { ScrollReveal } from "@/components/ScrollReveal";
import { SocialIcons } from "@/components/SocialIcons";
import { Shelf } from "@/components/Shelf";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* ==================== HERO ==================== */}
      <section className="relative min-h-screen flex flex-col justify-center px-6 sm:px-12 md:px-24 lg:px-32 max-w-4xl" data-parallax-speed="-0.03">
        <ScrollReveal>
          <h1
            className="text-5xl sm:text-6xl md:text-7xl font-light tracking-tight mb-4"
            style={{
              color: '#d0e0d4',
              textShadow: '0 0 50px rgba(74, 222, 128, 0.08), 0 0 100px rgba(34, 197, 94, 0.04)',
            }}
          >
            {siteData.name}
          </h1>
        </ScrollReveal>
        <ScrollReveal>
          <p
            className="text-lg sm:text-xl font-light tracking-wide mb-10 italic"
            style={{
              color: '#4ade80',
              textShadow: '0 0 25px rgba(74, 222, 128, 0.1)',
            }}
          >
            {siteData.tagline}
          </p>
        </ScrollReveal>
        <ScrollReveal>
          <SocialIcons size={22} />
        </ScrollReveal>
      </section>

      {/* ==================== NOW ==================== */}
      <section className="px-6 sm:px-12 md:px-24 lg:px-32 max-w-4xl py-28">
        <ScrollReveal>
          <p className="section-heading mb-2">Now</p>
          <div className="section-divider mb-8" />
        </ScrollReveal>
        <ScrollReveal>
          <h2 className="text-3xl sm:text-4xl font-light text-slate-100 mb-2">
            {siteData.now.title}
          </h2>
          <p className="text-sm text-slate-400 font-medium uppercase tracking-wider mb-6">
            {siteData.now.subtitle}
          </p>
          <p className="text-slate-400 leading-relaxed max-w-xl text-base">
            {siteData.now.description}
          </p>
        </ScrollReveal>
      </section>

      {/* ==================== PAST ==================== */}
      <section className="px-6 sm:px-12 md:px-24 lg:px-32 max-w-4xl py-28">
        <ScrollReveal>
          <p className="section-heading mb-2">Prior</p>
          <div className="section-divider mb-10" />
        </ScrollReveal>
        <ScrollReveal stagger>
          <div className="space-y-10">
            {siteData.past.map((item, i) => (
              <div key={i} className="fade-up flex gap-6">
                <span className="text-slate-500 text-sm font-medium tracking-wider shrink-0 w-16 pt-0.5">
                  {item.period}
                </span>
                <p className="text-slate-400 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* ==================== WRITING ==================== */}
      <section className="px-6 sm:px-12 md:px-24 lg:px-32 max-w-4xl py-28">
        <ScrollReveal>
          <p className="section-heading mb-2">Writing</p>
          <div className="section-divider mb-10" />
        </ScrollReveal>
        <ScrollReveal stagger>
          <div className="space-y-6">
            {siteData.writing.map((post, i) => (
              <a
                key={i}
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                className="fade-up block group py-3 border-b border-slate-800/40 hover:border-slate-600/30 transition-colors"
              >
                <h3 className="text-lg text-slate-200 group-hover:text-slate-100 transition-colors font-normal">
                  {post.title}
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  {post.description}
                </p>
              </a>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* ==================== FAVORITES ==================== */}
      <section className="px-6 sm:px-12 md:px-24 lg:px-32 max-w-5xl py-28">
        <ScrollReveal>
          <p className="section-heading mb-2">Favorites</p>
          <div className="section-divider mb-10" />
        </ScrollReveal>

        <Shelf label="Books" items={siteData.favorites.books} />
        <Shelf label="Video Games" items={siteData.favorites.games} />
        <Shelf label="Albums" items={siteData.favorites.albums} />
        <Shelf label="Anime / Manga" items={siteData.favorites.anime} />
      </section>

      {/* ==================== PHOTOS ==================== */}
      <section className="px-6 sm:px-12 md:px-24 lg:px-32 max-w-6xl py-28">
        <ScrollReveal>
          <p className="section-heading mb-2">Photos</p>
          <div className="section-divider mb-10" />
        </ScrollReveal>
        <ScrollReveal stagger>
          <div className="photo-grid">
            {siteData.photos.map((photo, i) => (
              <div key={i} className="photo-item fade-up">
                {photo.src ? (
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    className="w-full block"
                    loading="lazy"
                  />
                ) : (
                  <div
                    className="w-full bg-slate-800/30 border border-slate-700/20 flex items-center justify-center text-slate-600 text-xs"
                    style={{ height: `${160 + (i % 3) * 60}px` }}
                  >
                    {photo.alt}
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="px-6 sm:px-12 md:px-24 lg:px-32 max-w-4xl py-16 border-t border-slate-800/30">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <p className="text-slate-600 text-sm">
            {siteData.name}
          </p>
          <SocialIcons size={18} />
        </div>
      </footer>
    </div>
  );
}
