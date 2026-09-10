import type { Metadata } from "next";
import type { ReactNode } from "react";
import Script from "next/script";
import { Fraunces, IBM_Plex_Mono, Inter } from "next/font/google";
import { Providers } from "@/components/Providers";
import "./globals.css";

/** Editorial pages can reuse cached HTML/RSC for two minutes. */
export const revalidate = 120;

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
  description: "Neslužbena digitalna lična karta MZ Čizmići (Grad Cazin).",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="bs" suppressHydrationWarning>
      <body className={`${inter.variable} ${fraunces.variable} ${mono.variable}`} suppressHydrationWarning>
        <Script id="strip-ext-attrs" src="/strip-extension-attrs.js" strategy="beforeInteractive" />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
