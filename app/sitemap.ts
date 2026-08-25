import { historija, infraObjekti, putevi } from "@/lib/data";
import { allRoutes } from "@/lib/nav";

export default function sitemap() {
  const pages = allRoutes.map((path) => ({
    url: `https://cizmici.ba${path}`,
    changeFrequency: "monthly" as const,
    priority: path === "/" ? 1 : 0.7,
  }));

  const articles = [
    ...historija.map((item) => `/historija/${item.slug}`),
    ...putevi.map((item) => `/infrastruktura/${item.slug}`),
    ...infraObjekti.map((item) => `/infrastruktura/${item.slug}`),
  ].map((path) => ({
    url: `https://cizmici.ba${path}`,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...pages, ...articles];
}
