"use client";

import { siteData } from "@/data/siteData";
import { ScrollReveal } from "@/components/ScrollReveal";
import { SocialIcons } from "@/components/SocialIcons";
import { Shelf } from "@/components/Shelf";
import { GlassPanel } from "@/components/GlassPanel";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* ==================== HERO ==================== */}
      <section className="relative min-h-screen flex flex-col justify-center px-6 sm:px-12 md:px-16 lg:px-24 max-w-2xl">
        <ScrollReveal>
          <h1
            className="text-5xl sm:text-6xl md:text-7xl font-light tracking-tight mb-4"
            style={{
              color: '#c8cdd0',
              textShadow: '0 2px 20px rgba(0, 0, 0, 0.3)',
            }}
          >
            {siteData.name}
          </h1>
        </ScrollReveal>
        <ScrollReveal>
          <p
            className="text-lg sm:text-xl font-light tracking-wide mb-10 italic"
            style={{
              color: '#7edcb4',
              textShadow: '0 0 30px rgba(126, 220, 180, 0.08)',
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
      <section className="px-6 sm:px-12 md:px-16 lg:px-24 max-w-2xl py-28">
        <GlassPanel>
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
        </GlassPanel>
      </section>

      {/* ==================== PAST ==================== */}
      <section className="px-6 sm:px-12 md:px-16 lg:px-24 max-w-2xl py-28">
        <GlassPanel>
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
        </GlassPanel>
      </section>

      {/* ==================== WRITING ==================== */}
      <section className="px-6 sm:px-12 md:px-16 lg:px-24 max-w-2xl py-28">
        <GlassPanel>
          <ScrollReveal>
            <p className="section-heading mb-2">Writing</p>
            <div className="section-divider mb-6" />
            <a
              href={siteData.socials.substack}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-slate-400 hover:text-[var(--color-accent)] transition-colors text-base"
            >
              Read on Substack
              <span aria-hidden="true">&rarr;</span>
            </a>
          </ScrollReveal>
        </GlassPanel>
      </section>

      {/* ==================== FAVORITES ==================== */}
      <section className="px-6 sm:px-12 md:px-16 lg:px-24 max-w-3xl py-28">
        <GlassPanel>
          <ScrollReveal>
            <p className="section-heading mb-2">Favorites</p>
            <div className="section-divider mb-4" />
            <p className="text-slate-400 text-sm leading-relaxed max-w-md mb-12">
              {siteData.favoritesIntro}
            </p>
          </ScrollReveal>

          <Shelf label="Books" description={siteData.favorites.books.description} items={siteData.favorites.books.items} />
          <Shelf label="Video Games" description={siteData.favorites.games.description} items={siteData.favorites.games.items} />
          <Shelf label="Albums" description={siteData.favorites.albums.description} items={siteData.favorites.albums.items} />
          <Shelf label="Anime / Manga" description={siteData.favorites.anime.description} items={siteData.favorites.anime.items} />
        </GlassPanel>
      </section>

      {/* ==================== PHOTOS ==================== */}
      <section className="px-6 sm:px-12 md:px-16 lg:px-24 max-w-3xl py-28">
        <GlassPanel>
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
                      className="w-full flex items-center justify-center text-slate-600 text-xs"
                      style={{ height: `${160 + (i % 3) * 60}px` }}
                    >
                      {photo.alt}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollReveal>
        </GlassPanel>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="px-6 sm:px-12 md:px-16 lg:px-24 max-w-2xl py-16">
        <GlassPanel intensity="subtle">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <p className="text-slate-600 text-sm">
              {siteData.name}
            </p>
            <SocialIcons size={18} />
          </div>
        </GlassPanel>
      </footer>
    </div>
  );
}
