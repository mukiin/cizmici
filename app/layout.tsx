import type { Metadata } from "next";
import type { ReactNode } from "react";
import Script from "next/script";
import { Fraunces, IBM_Plex_Mono, Inter } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { site } from "@/lib/data";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
});

const fraunces = Fraunces({
  subsets: ["latin", "latin-ext"],
  variable: "--font-fraunces",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://cizmici.ba"),
  title: {
    default: "Čizmići — Lična karta mjesne zajednice",
    template: "%s · Čizmići",
  },
  description: site.tagline,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="bs" suppressHydrationWarning>
      <body className={`${inter.variable} ${fraunces.variable} ${mono.variable}`} suppressHydrationWarning>
        <Script id="strip-ext-attrs" src="/strip-extension-attrs.js" strategy="beforeInteractive" />
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  );
}
