import { getHistorijaAll, getInfraObjekti, getPutevi } from "@/lib/data";
import { allRoutes } from "@/lib/nav";

export default async function sitemap() {
  const [historija, putevi, infraObjekti] = await Promise.all([
    getHistorijaAll(),
    getPutevi(),
    getInfraObjekti(),
  ]);

  const pages = allRoutes.map((path) => ({
    url: `https://cizmici.net${path}`,
    changeFrequency: "monthly" as const,
    priority: path === "/" ? 1 : 0.7,
  }));

  const articles = [
    ...historija.map((item) => `/historija/${item.slug}`),
    ...putevi.map((item) => `/infrastruktura/${item.slug}`),
    ...infraObjekti.map((item) => `/infrastruktura/${item.slug}`),
  ].map((path) => ({
    url: `https://cizmici.net${path}`,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...pages, ...articles];
}
