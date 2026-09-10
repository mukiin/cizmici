import type { ReactNode } from "react";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { getSite } from "@/lib/data";

export async function generateMetadata() {
  try {
    const site = await getSite();
    return { description: site.tagline };
  } catch {
    return {};
  }
}

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Nav />
      {children}
      <Footer />
    </>
  );
}
