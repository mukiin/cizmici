import { cache } from "react";
import { unstable_cache } from "next/cache";
import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  businesses,
  demografijaAgeGroups,
  demografijaEthnicity,
  demografijaSettings,
  dijasporaCountries,
  dijasporaSettings,
  events,
  historijaItems,
  infraObjects,
  infrastrukturaSettings,
  mapaMarkers,
  mapaSettings,
  pozdraviItems,
  pozdraviSettings,
  projects,
  roads,
  siteRoadmap,
  siteSettings,
  siteStats,
} from "@/lib/db/schema";
import type {
  Business,
  Demographics,
  Diaspora,
  EventItem,
  Greetings,
  Infrastructure,
  Issues,
  MapData,
  Poll,
  Project,
  Site,
  Story,
  TimelineItem,
} from "./types";

import priceJson from "@/content/price.json";
import prijaveJson from "@/content/prijave.json";
import anketaJson from "@/content/anketa.json";

/** Cross-request cache for editorial Neon reads (ISR-style). */
function editorialCache<T>(key: string, fn: () => Promise<T>) {
  const cached = unstable_cache(fn, [`editorial-${key}`], {
    revalidate: 120,
    tags: ["editorial", key],
  });
  // React cache: one DB hit per request even if Footer + page both call it.
  return cache(() => cached());
}

export const getSite = editorialCache("site", async (): Promise<Site> => {
  const [settings] = await db.select().from(siteSettings).limit(1);
  if (!settings) throw new Error("site_settings prazan — pokreni npm run db:seed-editorial");
  const [stats, roadmap] = await Promise.all([
    db.select().from(siteStats).orderBy(asc(siteStats.sortOrder)),
    db.select().from(siteRoadmap).orderBy(asc(siteRoadmap.sortOrder)),
  ]);
  return {
    name: settings.name,
    domain: settings.domain,
    tagline: settings.tagline,
    location: {
      municipality: settings.municipality,
      canton: settings.canton,
      settlements: settings.settlements,
      lat: settings.lat,
      lng: settings.lng,
      elevationM: settings.elevationM,
      note: settings.locationNote,
    },
    danMz: {
      month: settings.danMzMonth,
      day: settings.danMzDay,
      foundedYear: settings.foundedYear,
    },
    stats: stats.map((s) => ({ value: s.value, label: s.label })),
    live: { lastNews: settings.lastNews, lastNewsHref: settings.lastNewsHref },
    sources: settings.sources,
    disclaimer: settings.disclaimer,
    roadmap: roadmap.map((r) => ({
      num: r.num,
      title: r.title,
      body: r.body,
      live: r.live,
    })),
  };
});

export const getHistorijaAll = editorialCache("historija-all", async (): Promise<TimelineItem[]> => {
  const rows = await db.select().from(historijaItems).orderBy(asc(historijaItems.sortOrder));
  return rows.map((h) => ({
    slug: h.slug,
    year: h.year,
    title: h.title,
    body: h.body,
    source: h.source,
    featured: h.featured,
    detail: h.detail ?? [],
  }));
});

export async function getHistorijaPregled() {
  return (await getHistorijaAll()).filter((item) => item.featured);
}

export const getHistorija = cache(async (slug: string) => {
  return unstable_cache(
    async () => {
      const [row] = await db.select().from(historijaItems).where(eq(historijaItems.slug, slug)).limit(1);
      if (!row) return undefined;
      return {
        slug: row.slug,
        year: row.year,
        title: row.title,
        body: row.body,
        source: row.source,
        featured: row.featured,
        detail: row.detail ?? [],
      } satisfies TimelineItem;
    },
    [`historija-${slug}`],
    { revalidate: 120, tags: ["editorial", "historija"] },
  )();
});

export async function historijaNeighbors(slug: string) {
  const all = await getHistorijaAll();
  const index = all.findIndex((item) => item.slug === slug);
  if (index < 0) return { prev: undefined, next: undefined };
  return {
    prev: index > 0 ? all[index - 1] : undefined,
    next: index < all.length - 1 ? all[index + 1] : undefined,
  };
}

export const getDemografija = editorialCache("demografija", async (): Promise<Demographics> => {
  const [settings] = await db.select().from(demografijaSettings).limit(1);
  if (!settings) throw new Error("demografija_settings prazan — seed-editorial");
  const [ageGroups, ethnicity] = await Promise.all([
    db.select().from(demografijaAgeGroups).orderBy(asc(demografijaAgeGroups.sortOrder)),
    db.select().from(demografijaEthnicity).orderBy(asc(demografijaEthnicity.sortOrder)),
  ]);
  return {
    note: settings.note,
    coverageNote: settings.coverageNote,
    source: settings.source,
    sourceLabel: settings.sourceLabel,
    males: settings.males,
    females: settings.females,
    areaKm2: settings.areaKm2,
    total: settings.total,
    ageGroups: ageGroups.map((g) => ({ label: g.label, value: g.value })),
    ethnicity: ethnicity.map((e) => ({ label: e.label, count: e.count, pct: e.pct })),
  };
});

export const getInfrastruktura = editorialCache("infrastruktura", async (): Promise<Infrastructure> => {
  const [settings] = await db.select().from(infrastrukturaSettings).limit(1);
  if (!settings) throw new Error("infrastruktura_settings prazan — seed-editorial");
  const [roadRows, objectRows] = await Promise.all([
    db.select().from(roads).orderBy(asc(roads.sortOrder)),
    db.select().from(infraObjects).orderBy(asc(infraObjects.sortOrder)),
  ]);
  return {
    intro: settings.intro,
    source: settings.source,
    roads: roadRows.map((r) => ({
      id: r.code,
      slug: r.slug,
      name: r.name,
      km: r.km,
      from: r.fromPlace,
      to: r.toPlace,
      detail: r.detail ?? [],
      facts: r.facts ?? [],
    })),
    objects: objectRows.map((o) => ({
      slug: o.slug,
      name: o.name,
      chip: o.chip,
      kind: o.kind,
      detail: o.detail ?? [],
      facts: o.facts ?? [],
    })),
  };
});

export async function getPutevi() {
  return (await getInfrastruktura()).roads;
}

export async function getInfraObjekti() {
  return (await getInfrastruktura()).objects;
}

export async function getPut(slug: string) {
  return (await getPutevi()).find((item) => item.slug === slug);
}

export async function getInfraObjekt(slug: string) {
  return (await getInfraObjekti()).find((item) => item.slug === slug);
}

export async function putNeighbors(slug: string) {
  const putevi = await getPutevi();
  const index = putevi.findIndex((item) => item.slug === slug);
  if (index < 0) return { prev: undefined, next: undefined };
  return {
    prev: index > 0 ? putevi[index - 1] : undefined,
    next: index < putevi.length - 1 ? putevi[index + 1] : undefined,
  };
}

export const getMapa = editorialCache("mapa", async (): Promise<MapData> => {
  const [settings] = await db.select().from(mapaSettings).limit(1);
  if (!settings) throw new Error("mapa_settings prazan — seed-editorial");
  const markers = await db.select().from(mapaMarkers).orderBy(asc(mapaMarkers.sortOrder));
  return {
    intro: settings.intro ?? undefined,
    center: [settings.centerLat, settings.centerLng],
    zoom: settings.zoom,
    path: settings.path ?? undefined,
    markers: markers.map((m) => ({
      lat: m.lat,
      lng: m.lng,
      color: m.color,
      title: m.title,
      body: m.body,
      legend: m.legend,
    })),
  };
});

export const getProjekti = editorialCache("projekti", async (): Promise<Project[]> => {
  const rows = await db.select().from(projects).orderBy(asc(projects.sortOrder));
  return rows.map((p) => ({
    status: p.status,
    statusLabel: p.statusLabel,
    title: p.title,
    body: p.body,
    year: p.year,
    meta: p.meta,
  }));
});

export const getBiznisi = editorialCache("biznisi", async (): Promise<Business[]> => {
  const rows = await db.select().from(businesses).orderBy(asc(businesses.sortOrder));
  return rows.map((b) => ({
    tag: b.tag,
    name: b.name,
    body: b.body,
    founded: b.founded,
    location: b.location,
  }));
});

export const getDogadjaji = editorialCache("dogadjaji", async (): Promise<EventItem[]> => {
  const rows = await db.select().from(events).orderBy(asc(events.sortOrder));
  return rows.map((e) => ({
    day: e.day,
    month: e.month,
    title: e.title,
    meta: e.meta,
    recurring: e.recurring || undefined,
    illustrative: e.illustrative || undefined,
  }));
});

export const getDijaspora = editorialCache("dijaspora", async (): Promise<Diaspora> => {
  const [settings] = await db.select().from(dijasporaSettings).limit(1);
  if (!settings) throw new Error("dijaspora_settings prazan — seed-editorial");
  const countries = await db
    .select()
    .from(dijasporaCountries)
    .orderBy(asc(dijasporaCountries.sortOrder));
  return {
    illustrative: settings.illustrative,
    note: settings.note,
    total: settings.total,
    countriesCount: settings.countriesCount,
    home: { lat: settings.homeLat, lng: settings.homeLng, name: settings.homeName },
    countries: countries.map((c) => ({
      flag: c.flag,
      name: c.name,
      count: c.count,
      lat: c.lat,
      lng: c.lng,
    })),
  };
});

export const getPozdravi = editorialCache("pozdravi", async (): Promise<Greetings> => {
  const [settings] = await db.select().from(pozdraviSettings).limit(1);
  if (!settings) throw new Error("pozdravi_settings prazan — seed-editorial");
  const items = await db.select().from(pozdraviItems).orderBy(asc(pozdraviItems.sortOrder));
  return {
    illustrative: settings.illustrative,
    note: settings.note,
    items: items.map((i) => ({ name: i.name, loc: i.loc, text: i.text })),
  };
});

export const pricePlaceholders = priceJson as Story[];
export const prijaveMock = prijaveJson as Issues;
export const anketa = anketaJson as Poll;
