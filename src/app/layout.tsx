import type { Metadata } from "next";
import { Cormorant_Garamond, Source_Sans_3 } from "next/font/google";
import { ParallaxProvider } from "@/components/atmosphere/ParallaxProvider";
import { SkyGradient } from "@/components/atmosphere/SkyGradient";
import { StarField } from "@/components/atmosphere/StarField";
import { SceneLayer } from "@/components/atmosphere/SceneLayer";
import { CelestialMoon } from "@/components/atmosphere/CelestialMoon";
import { CelestialSun } from "@/components/atmosphere/CelestialSun";
import { WaterLayer } from "@/components/atmosphere/WaterLayer";
import { FishingRipples } from "@/components/atmosphere/FishingRipples";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Khaled Messai",
  description: "Building things that see.",
  openGraph: {
    title: "Khaled Messai",
    description: "Building things that see.",
    url: "https://kmessai.com",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Khaled Messai",
    description: "Building things that see.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${sourceSans.variable}`}>
      <body className={sourceSans.className}>
        <ParallaxProvider>
          {/* Scene — all layers in one fixed container at z-index 0 */}
          <div style={{ position: "fixed", inset: "0", zIndex: 0, pointerEvents: "none" }}>
            <SkyGradient />
            <StarField />
            <CelestialMoon />
            <SceneLayer src="/scene/trees-left.png" speed={0.015} className="scene-trees-left" />
            <SceneLayer src="/scene/trees-right.png" speed={0.015} className="scene-trees-right" />
            <SceneLayer src="/Favorites/Site Assets/fulltreenobg.png" speed={0.02} className="scene-treeline" />
            <CelestialSun />
            <WaterLayer />
            <FishingRipples />
            <SceneLayer src="/Favorites/Site Assets/phoskhaledcolored_isnet.png" speed={0.04} className="scene-characters" />
          </div>

          {/* Content — above the scene */}
          <main style={{ position: "relative", zIndex: 1 }}>{children}</main>
        </ParallaxProvider>
      </body>
    </html>
  );
}
