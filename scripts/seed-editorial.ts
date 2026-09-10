import { config as loadEnv } from "dotenv";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

loadEnv({ path: ".env.local" });

function readJson<T>(name: string): T {
  return JSON.parse(readFileSync(resolve(process.cwd(), "content", `${name}.json`), "utf8")) as T;
}

async function main() {
  const { db } = await import("../lib/db");
  const schema = await import("../lib/db/schema");

  const site = readJson<{
    name: string;
    domain: string;
    tagline: string;
    location: {
      municipality: string;
      canton: string;
      settlements: string[];
      lat: number;
      lng: number;
      elevationM: number;
      note: string;
    };
    danMz: { month: number; day: number; foundedYear: number };
    stats: { value: string; label: string }[];
    live: { lastNews: string; lastNewsHref: string };
    sources: string[];
    disclaimer: string;
    roadmap: { num: string; title: string; body: string; live: boolean }[];
  }>("site");

  const historija = readJson<
    {
      slug: string;
      year: string;
      title: string;
      body: string;
      source: "official" | "verified" | "public";
      featured: boolean;
      detail: string[];
    }[]
  >("historija");

  const demografija = readJson<{
    note: string;
    coverageNote: string;
    source: "official" | "verified" | "public";
    sourceLabel: string;
    males: number;
    females: number;
    areaKm2: number;
    ageGroups: { label: string; value: number }[];
    ethnicity: { label: string; count: number; pct: string }[];
    total: number;
  }>("demografija");

  const infrastruktura = readJson<{
    intro: string;
    source: "official" | "verified" | "public";
    roads: {
      id: string;
      slug: string;
      name: string;
      km: string;
      from: string;
      to: string;
      detail: string[];
      facts: { label: string; value: string }[];
    }[];
    objects: {
      slug: string;
      name: string;
      chip: string;
      kind: "object" | "network";
      detail: string[];
      facts: { label: string; value: string }[];
    }[];
  }>("infrastruktura");

  const mapa = readJson<{
    intro?: string;
    center: [number, number];
    zoom: number;
    markers: {
      lat: number;
      lng: number;
      color: string;
      title: string;
      body: string;
      legend: string;
    }[];
    path?: [number, number][];
  }>("mapa");

  const projekti = readJson<
    {
      status: "done" | "progress" | "planned";
      statusLabel: string;
      title: string;
      body: string;
      year: string;
      meta: string;
    }[]
  >("projekti");

  const biznisi = readJson<
    { tag: string; name: string; body: string; founded: string; location: string }[]
  >("biznisi");

  const dogadjaji = readJson<
    {
      day: string;
      month: string;
      title: string;
      meta: string;
      recurring?: boolean;
      illustrative?: boolean;
    }[]
  >("dogadjaji");

  const dijaspora = readJson<{
    illustrative: boolean;
    note: string;
    total: number;
    countriesCount: number;
    home: { lat: number; lng: number; name: string };
    countries: { flag: string; name: string; count: number; lat: number; lng: number }[];
  }>("dijaspora");

  const pozdravi = readJson<{
    illustrative: boolean;
    note: string;
    items: { name: string; loc: string; text: string }[];
  }>("pozdravi");

  // Clear editorial tables (order matters for FKs — none here)
  await db.delete(schema.pozdraviItems);
  await db.delete(schema.pozdraviSettings);
  await db.delete(schema.dijasporaCountries);
  await db.delete(schema.dijasporaSettings);
  await db.delete(schema.events);
  await db.delete(schema.businesses);
  await db.delete(schema.projects);
  await db.delete(schema.mapaMarkers);
  await db.delete(schema.mapaSettings);
  await db.delete(schema.infraObjects);
  await db.delete(schema.roads);
  await db.delete(schema.infrastrukturaSettings);
  await db.delete(schema.demografijaEthnicity);
  await db.delete(schema.demografijaAgeGroups);
  await db.delete(schema.demografijaSettings);
  await db.delete(schema.historijaItems);
  await db.delete(schema.siteRoadmap);
  await db.delete(schema.siteStats);
  await db.delete(schema.siteSettings);

  await db.insert(schema.siteSettings).values({
    name: site.name,
    domain: site.domain,
    tagline: site.tagline,
    municipality: site.location.municipality,
    canton: site.location.canton,
    settlements: site.location.settlements,
    lat: site.location.lat,
    lng: site.location.lng,
    elevationM: site.location.elevationM,
    locationNote: site.location.note,
    danMzMonth: site.danMz.month,
    danMzDay: site.danMz.day,
    foundedYear: site.danMz.foundedYear,
    lastNews: site.live.lastNews,
    lastNewsHref: site.live.lastNewsHref,
    sources: site.sources,
    disclaimer: site.disclaimer,
  });

  await db.insert(schema.siteStats).values(
    site.stats.map((s, i) => ({ value: s.value, label: s.label, sortOrder: i })),
  );
  await db.insert(schema.siteRoadmap).values(
    site.roadmap.map((r, i) => ({
      num: r.num,
      title: r.title,
      body: r.body,
      live: r.live,
      sortOrder: i,
    })),
  );

  await db.insert(schema.historijaItems).values(
    historija.map((h, i) => ({
      slug: h.slug,
      year: h.year,
      title: h.title,
      body: h.body,
      source: h.source,
      featured: h.featured,
      detail: h.detail,
      sortOrder: i,
    })),
  );

  await db.insert(schema.demografijaSettings).values({
    note: demografija.note,
    coverageNote: demografija.coverageNote,
    source: demografija.source,
    sourceLabel: demografija.sourceLabel,
    males: demografija.males,
    females: demografija.females,
    areaKm2: demografija.areaKm2,
    total: demografija.total,
  });
  await db.insert(schema.demografijaAgeGroups).values(
    demografija.ageGroups.map((g, i) => ({
      label: g.label,
      value: g.value,
      sortOrder: i,
    })),
  );
  await db.insert(schema.demografijaEthnicity).values(
    demografija.ethnicity.map((e, i) => ({
      label: e.label,
      count: e.count,
      pct: e.pct,
      sortOrder: i,
    })),
  );

  await db.insert(schema.infrastrukturaSettings).values({
    intro: infrastruktura.intro,
    source: infrastruktura.source,
  });
  await db.insert(schema.roads).values(
    infrastruktura.roads.map((r, i) => ({
      code: r.id,
      slug: r.slug,
      name: r.name,
      km: r.km,
      fromPlace: r.from,
      toPlace: r.to,
      detail: r.detail,
      facts: r.facts,
      sortOrder: i,
    })),
  );
  await db.insert(schema.infraObjects).values(
    infrastruktura.objects.map((o, i) => ({
      slug: o.slug,
      name: o.name,
      chip: o.chip,
      kind: o.kind,
      detail: o.detail,
      facts: o.facts,
      sortOrder: i,
    })),
  );

  await db.insert(schema.mapaSettings).values({
    intro: mapa.intro ?? null,
    centerLat: mapa.center[0],
    centerLng: mapa.center[1],
    zoom: mapa.zoom,
    path: mapa.path ?? null,
  });
  await db.insert(schema.mapaMarkers).values(
    mapa.markers.map((m, i) => ({
      lat: m.lat,
      lng: m.lng,
      color: m.color,
      title: m.title,
      body: m.body,
      legend: m.legend,
      sortOrder: i,
    })),
  );

  await db.insert(schema.projects).values(
    projekti.map((p, i) => ({
      status: p.status,
      statusLabel: p.statusLabel,
      title: p.title,
      body: p.body,
      year: p.year,
      meta: p.meta,
      sortOrder: i,
    })),
  );

  await db.insert(schema.businesses).values(
    biznisi.map((b, i) => ({
      tag: b.tag,
      name: b.name,
      body: b.body,
      founded: b.founded,
      location: b.location,
      sortOrder: i,
    })),
  );

  await db.insert(schema.events).values(
    dogadjaji.map((e, i) => ({
      day: e.day,
      month: e.month,
      title: e.title,
      meta: e.meta,
      recurring: Boolean(e.recurring),
      illustrative: Boolean(e.illustrative),
      sortOrder: i,
    })),
  );

  await db.insert(schema.dijasporaSettings).values({
    illustrative: dijaspora.illustrative,
    note: dijaspora.note,
    total: dijaspora.total,
    countriesCount: dijaspora.countriesCount,
    homeLat: dijaspora.home.lat,
    homeLng: dijaspora.home.lng,
    homeName: dijaspora.home.name,
  });
  await db.insert(schema.dijasporaCountries).values(
    dijaspora.countries.map((c, i) => ({
      flag: c.flag,
      name: c.name,
      count: c.count,
      lat: c.lat,
      lng: c.lng,
      sortOrder: i,
    })),
  );

  await db.insert(schema.pozdraviSettings).values({
    illustrative: pozdravi.illustrative,
    note: pozdravi.note,
  });
  await db.insert(schema.pozdraviItems).values(
    pozdravi.items.map((p, i) => ({
      name: p.name,
      loc: p.loc,
      text: p.text,
      sortOrder: i,
    })),
  );

  // cms_documents already dropped in migration 0002

  console.log("Editorial tables seeded from content/*.json");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
