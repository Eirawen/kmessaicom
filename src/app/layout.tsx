import type { Metadata } from "next";
import { Cormorant_Garamond, Source_Sans_3 } from "next/font/google";
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
      <body className={`${sourceSans.className} grain`}>
        <div className="vignette" />
        <div className="light-wash" />
        <main className="relative z-10">{children}</main>
      </body>
    </html>
  );
}
