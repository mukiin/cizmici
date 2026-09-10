"use server";

import { asc, eq } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";
import { requireAdmin, type ActionState } from "@/lib/actions/auth";
import { db } from "@/lib/db";
import {
  demografijaAgeGroups,
  demografijaEthnicity,
  demografijaSettings,
  dijasporaCountries,
  dijasporaSettings,
  infraObjects,
  infrastrukturaSettings,
  mapaMarkers,
  mapaSettings,
  pozdraviItems,
  pozdraviSettings,
  roads,
  siteRoadmap,
  siteSettings,
  siteStats,
} from "@/lib/db/schema";

function revalidatePublic() {
  revalidateTag("editorial");
  revalidatePath("/");
  revalidatePath("/historija");
  revalidatePath("/infrastruktura");
  revalidatePath("/stanovnistvo");
  revalidatePath("/mapa");
  revalidatePath("/projekti");
  revalidatePath("/biznisi");
  revalidatePath("/dogadjaji");
  revalidatePath("/dijaspora");
  revalidatePath("/pozdravi");
  revalidatePath("/o");
  revalidatePath("/admin/sadrzaj");
}

function lines(raw: string) {
  return raw
    .split(/\n+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function parseFacts(raw: string) {
  return lines(raw)
    .map((line) => {
      const [label, ...rest] = line.split("|");
      return { label: (label || "").trim(), value: rest.join("|").trim() };
    })
    .filter((f) => f.label);
}

function num(raw: string, fallback = 0) {
  const n = Number(String(raw).replace(",", "."));
  return Number.isFinite(n) ? n : fallback;
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "dj")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

// —— Site ——

export async function getSiteAdmin() {
  await requireAdmin();
  const [settings] = await db.select().from(siteSettings).limit(1);
  const stats = await db.select().from(siteStats).orderBy(asc(siteStats.sortOrder));
  const roadmap = await db.select().from(siteRoadmap).orderBy(asc(siteRoadmap.sortOrder));
  return { settings, stats, roadmap };
}

export async function saveSiteSettings(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  const name = String(formData.get("name") || "").trim();
  const domain = String(formData.get("domain") || "").trim();
  const tagline = String(formData.get("tagline") || "").trim();
  if (!name || !tagline) return { ok: false, error: "Naziv i tagline su obavezni." };

  const values = {
    name,
    domain,
    tagline,
    municipality: String(formData.get("municipality") || "").trim(),
    canton: String(formData.get("canton") || "").trim(),
    settlements: lines(String(formData.get("settlements") || "")),
    lat: num(String(formData.get("lat"))),
    lng: num(String(formData.get("lng"))),
    elevationM: Math.round(num(String(formData.get("elevationM")))),
    locationNote: String(formData.get("locationNote") || "").trim(),
    danMzMonth: Math.round(num(String(formData.get("danMzMonth")), 1)),
    danMzDay: Math.round(num(String(formData.get("danMzDay")), 1)),
    foundedYear: Math.round(num(String(formData.get("foundedYear")))),
    lastNews: String(formData.get("lastNews") || "").trim(),
    lastNewsHref: String(formData.get("lastNewsHref") || "").trim(),
    sources: lines(String(formData.get("sources") || "")),
    disclaimer: String(formData.get("disclaimer") || "").trim(),
    updatedAt: new Date(),
  };

  if (id) {
    await db.update(siteSettings).set(values).where(eq(siteSettings.id, id));
  } else {
    await db.insert(siteSettings).values(values);
  }
  revalidatePublic();
  revalidatePath("/admin/sadrzaj/site");
  return { ok: true, message: "Postavke sajta sačuvane." };
}

export async function saveSiteStat(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  const value = String(formData.get("value") || "").trim();
  const label = String(formData.get("label") || "").trim();
  if (!value || !label) return { ok: false, error: "Vrijednost i oznaka su obavezni." };

  if (id) {
    await db.update(siteStats).set({ value, label }).where(eq(siteStats.id, id));
  } else {
    const n = (await db.select().from(siteStats)).length;
    await db.insert(siteStats).values({ value, label, sortOrder: n });
  }
  revalidatePublic();
  revalidatePath("/admin/sadrzaj/site");
  return { ok: true, message: "Statistika sačuvana." };
}

export async function deleteSiteStat(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  if (!id) return;
  await db.delete(siteStats).where(eq(siteStats.id, id));
  revalidatePublic();
  revalidatePath("/admin/sadrzaj/site");
}

export async function saveSiteRoadmap(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  const numLabel = String(formData.get("num") || "").trim();
  const title = String(formData.get("title") || "").trim();
  const body = String(formData.get("body") || "").trim();
  const live = formData.get("live") === "on";
  if (!title || !body) return { ok: false, error: "Naslov i tekst su obavezni." };

  if (id) {
    await db
      .update(siteRoadmap)
      .set({ num: numLabel, title, body, live })
      .where(eq(siteRoadmap.id, id));
  } else {
    const n = (await db.select().from(siteRoadmap)).length;
    await db.insert(siteRoadmap).values({
      num: numLabel || String(n + 1).padStart(2, "0"),
      title,
      body,
      live,
      sortOrder: n,
    });
  }
  revalidatePublic();
  revalidatePath("/admin/sadrzaj/site");
  return { ok: true, message: "Roadmap stavka sačuvana." };
}

export async function deleteSiteRoadmap(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  if (!id) return;
  await db.delete(siteRoadmap).where(eq(siteRoadmap.id, id));
  revalidatePublic();
  revalidatePath("/admin/sadrzaj/site");
}

// —— Demografija ——

export async function getDemografijaAdmin() {
  await requireAdmin();
  const [settings] = await db.select().from(demografijaSettings).limit(1);
  const ageGroups = await db
    .select()
    .from(demografijaAgeGroups)
    .orderBy(asc(demografijaAgeGroups.sortOrder));
  const ethnicity = await db
    .select()
    .from(demografijaEthnicity)
    .orderBy(asc(demografijaEthnicity.sortOrder));
  return { settings, ageGroups, ethnicity };
}

export async function saveDemografijaSettings(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  const source = String(formData.get("source") || "official") as
    | "official"
    | "verified"
    | "public";
  const values = {
    note: String(formData.get("note") || "").trim(),
    coverageNote: String(formData.get("coverageNote") || "").trim(),
    source,
    sourceLabel: String(formData.get("sourceLabel") || "").trim(),
    males: Math.round(num(String(formData.get("males")))),
    females: Math.round(num(String(formData.get("females")))),
    areaKm2: num(String(formData.get("areaKm2"))),
    total: Math.round(num(String(formData.get("total")))),
    updatedAt: new Date(),
  };
  if (!values.note) return { ok: false, error: "Napomena je obavezna." };

  if (id) {
    await db.update(demografijaSettings).set(values).where(eq(demografijaSettings.id, id));
  } else {
    await db.insert(demografijaSettings).values(values);
  }
  revalidatePublic();
  revalidatePath("/admin/sadrzaj/demografija");
  return { ok: true, message: "Demografija sačuvana." };
}

export async function saveAgeGroup(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  const label = String(formData.get("label") || "").trim();
  const value = Math.round(num(String(formData.get("value"))));
  if (!label) return { ok: false, error: "Oznaka je obavezna." };

  if (id) {
    await db.update(demografijaAgeGroups).set({ label, value }).where(eq(demografijaAgeGroups.id, id));
  } else {
    const n = (await db.select().from(demografijaAgeGroups)).length;
    await db.insert(demografijaAgeGroups).values({ label, value, sortOrder: n });
  }
  revalidatePublic();
  revalidatePath("/admin/sadrzaj/demografija");
  return { ok: true, message: "Dobna grupa sačuvana." };
}

export async function deleteAgeGroup(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  if (!id) return;
  await db.delete(demografijaAgeGroups).where(eq(demografijaAgeGroups.id, id));
  revalidatePublic();
  revalidatePath("/admin/sadrzaj/demografija");
}

export async function saveEthnicity(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  const label = String(formData.get("label") || "").trim();
  const count = Math.round(num(String(formData.get("count"))));
  const pct = String(formData.get("pct") || "").trim();
  if (!label) return { ok: false, error: "Oznaka je obavezna." };

  if (id) {
    await db
      .update(demografijaEthnicity)
      .set({ label, count, pct })
      .where(eq(demografijaEthnicity.id, id));
  } else {
    const n = (await db.select().from(demografijaEthnicity)).length;
    await db.insert(demografijaEthnicity).values({ label, count, pct, sortOrder: n });
  }
  revalidatePublic();
  revalidatePath("/admin/sadrzaj/demografija");
  return { ok: true, message: "Etnička stavka sačuvana." };
}

export async function deleteEthnicity(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  if (!id) return;
  await db.delete(demografijaEthnicity).where(eq(demografijaEthnicity.id, id));
  revalidatePublic();
  revalidatePath("/admin/sadrzaj/demografija");
}

// —— Infrastruktura ——

export async function getInfraAdmin() {
  await requireAdmin();
  const [settings] = await db.select().from(infrastrukturaSettings).limit(1);
  const roadRows = await db.select().from(roads).orderBy(asc(roads.sortOrder));
  const objectRows = await db.select().from(infraObjects).orderBy(asc(infraObjects.sortOrder));
  return { settings, roads: roadRows, objects: objectRows };
}

export async function saveInfraSettings(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  const intro = String(formData.get("intro") || "").trim();
  const source = String(formData.get("source") || "official") as
    | "official"
    | "verified"
    | "public";
  if (!intro) return { ok: false, error: "Uvod je obavezan." };

  if (id) {
    await db
      .update(infrastrukturaSettings)
      .set({ intro, source, updatedAt: new Date() })
      .where(eq(infrastrukturaSettings.id, id));
  } else {
    await db.insert(infrastrukturaSettings).values({ intro, source });
  }
  revalidatePublic();
  revalidatePath("/admin/sadrzaj/infrastruktura");
  return { ok: true, message: "Postavke infrastrukture sačuvane." };
}

export async function saveRoadItem(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  const code = String(formData.get("code") || "").trim();
  const name = String(formData.get("name") || "").trim();
  let slug = String(formData.get("slug") || "").trim() || slugify(name);
  const km = String(formData.get("km") || "").trim();
  const fromPlace = String(formData.get("fromPlace") || "").trim();
  const toPlace = String(formData.get("toPlace") || "").trim();
  const detail = lines(String(formData.get("detail") || ""));
  const facts = parseFacts(String(formData.get("facts") || ""));
  if (!name || !code) return { ok: false, error: "Šifra i naziv su obavezni." };

  if (id) {
    await db
      .update(roads)
      .set({
        code,
        slug,
        name,
        km,
        fromPlace,
        toPlace,
        detail,
        facts,
        updatedAt: new Date(),
      })
      .where(eq(roads.id, id));
  } else {
    const existing = await db.select().from(roads).where(eq(roads.slug, slug)).limit(1);
    if (existing.length) slug = `${slug}-${Date.now().toString(36)}`;
    const n = (await db.select().from(roads)).length;
    await db.insert(roads).values({
      code,
      slug,
      name,
      km,
      fromPlace,
      toPlace,
      detail,
      facts,
      sortOrder: n,
    });
  }
  revalidatePublic();
  revalidatePath("/admin/sadrzaj/infrastruktura");
  return { ok: true, message: "Put sačuvan." };
}

export async function deleteRoadItem(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  if (!id) return;
  await db.delete(roads).where(eq(roads.id, id));
  revalidatePublic();
  revalidatePath("/admin/sadrzaj/infrastruktura");
}

export async function saveInfraObject(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  const name = String(formData.get("name") || "").trim();
  let slug = String(formData.get("slug") || "").trim() || slugify(name);
  const chip = String(formData.get("chip") || "").trim();
  const kind = String(formData.get("kind") || "object") as "object" | "network";
  const detail = lines(String(formData.get("detail") || ""));
  const facts = parseFacts(String(formData.get("facts") || ""));
  if (!name || !chip) return { ok: false, error: "Naziv i chip su obavezni." };

  if (id) {
    await db
      .update(infraObjects)
      .set({ slug, name, chip, kind, detail, facts, updatedAt: new Date() })
      .where(eq(infraObjects.id, id));
  } else {
    const existing = await db.select().from(infraObjects).where(eq(infraObjects.slug, slug)).limit(1);
    if (existing.length) slug = `${slug}-${Date.now().toString(36)}`;
    const n = (await db.select().from(infraObjects)).length;
    await db.insert(infraObjects).values({
      slug,
      name,
      chip,
      kind,
      detail,
      facts,
      sortOrder: n,
    });
  }
  revalidatePublic();
  revalidatePath("/admin/sadrzaj/infrastruktura");
  return { ok: true, message: "Objekat sačuvan." };
}

export async function deleteInfraObject(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  if (!id) return;
  await db.delete(infraObjects).where(eq(infraObjects.id, id));
  revalidatePublic();
  revalidatePath("/admin/sadrzaj/infrastruktura");
}

// —— Mapa ——

export async function getMapaAdmin() {
  await requireAdmin();
  const [settings] = await db.select().from(mapaSettings).limit(1);
  const markers = await db.select().from(mapaMarkers).orderBy(asc(mapaMarkers.sortOrder));
  return { settings, markers };
}

export async function saveMapaSettings(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  const intro = String(formData.get("intro") || "").trim() || null;
  const centerLat = num(String(formData.get("centerLat")));
  const centerLng = num(String(formData.get("centerLng")));
  const zoom = Math.round(num(String(formData.get("zoom")), 13));
  const pathRaw = String(formData.get("path") || "").trim();
  let path: [number, number][] | null = null;
  if (pathRaw) {
    try {
      const parsed = JSON.parse(pathRaw) as [number, number][];
      if (Array.isArray(parsed)) path = parsed;
    } catch {
      path = lines(pathRaw)
        .map((line) => {
          const [a, b] = line.split(",").map((x) => num(x.trim()));
          return [a, b] as [number, number];
        })
        .filter(([a, b]) => Number.isFinite(a) && Number.isFinite(b));
    }
  }

  if (id) {
    await db
      .update(mapaSettings)
      .set({ intro, centerLat, centerLng, zoom, path, updatedAt: new Date() })
      .where(eq(mapaSettings.id, id));
  } else {
    await db.insert(mapaSettings).values({ intro, centerLat, centerLng, zoom, path });
  }
  revalidatePublic();
  revalidatePath("/admin/sadrzaj/mapa");
  return { ok: true, message: "Mapa sačuvana." };
}

export async function saveMapaMarker(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  const title = String(formData.get("title") || "").trim();
  const body = String(formData.get("body") || "").trim();
  const legend = String(formData.get("legend") || "").trim();
  const color = String(formData.get("color") || "#a6502e").trim();
  const lat = num(String(formData.get("lat")));
  const lng = num(String(formData.get("lng")));
  if (!title) return { ok: false, error: "Naslov je obavezan." };

  if (id) {
    await db
      .update(mapaMarkers)
      .set({ title, body, legend, color, lat, lng })
      .where(eq(mapaMarkers.id, id));
  } else {
    const n = (await db.select().from(mapaMarkers)).length;
    await db.insert(mapaMarkers).values({
      title,
      body,
      legend,
      color,
      lat,
      lng,
      sortOrder: n,
    });
  }
  revalidatePublic();
  revalidatePath("/admin/sadrzaj/mapa");
  return { ok: true, message: "Marker sačuvan." };
}

export async function deleteMapaMarker(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  if (!id) return;
  await db.delete(mapaMarkers).where(eq(mapaMarkers.id, id));
  revalidatePublic();
  revalidatePath("/admin/sadrzaj/mapa");
}

// —— Dijaspora ——

export async function getDijasporaAdmin() {
  await requireAdmin();
  const [settings] = await db.select().from(dijasporaSettings).limit(1);
  const countries = await db
    .select()
    .from(dijasporaCountries)
    .orderBy(asc(dijasporaCountries.sortOrder));
  return { settings, countries };
}

export async function saveDijasporaSettings(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  const values = {
    illustrative: formData.get("illustrative") === "on",
    note: String(formData.get("note") || "").trim(),
    total: Math.round(num(String(formData.get("total")))),
    countriesCount: Math.round(num(String(formData.get("countriesCount")))),
    homeLat: num(String(formData.get("homeLat"))),
    homeLng: num(String(formData.get("homeLng"))),
    homeName: String(formData.get("homeName") || "").trim(),
    updatedAt: new Date(),
  };
  if (!values.note) return { ok: false, error: "Napomena je obavezna." };

  if (id) {
    await db.update(dijasporaSettings).set(values).where(eq(dijasporaSettings.id, id));
  } else {
    await db.insert(dijasporaSettings).values(values);
  }
  revalidatePublic();
  revalidatePath("/admin/sadrzaj/dijaspora");
  return { ok: true, message: "Dijaspora postavke sačuvane." };
}

export async function saveDijasporaCountry(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  const flag = String(formData.get("flag") || "").trim();
  const name = String(formData.get("name") || "").trim();
  const count = Math.round(num(String(formData.get("count"))));
  const lat = num(String(formData.get("lat")));
  const lng = num(String(formData.get("lng")));
  if (!name) return { ok: false, error: "Naziv države je obavezan." };

  if (id) {
    await db
      .update(dijasporaCountries)
      .set({ flag, name, count, lat, lng })
      .where(eq(dijasporaCountries.id, id));
  } else {
    const n = (await db.select().from(dijasporaCountries)).length;
    await db.insert(dijasporaCountries).values({
      flag,
      name,
      count,
      lat,
      lng,
      sortOrder: n,
    });
  }
  revalidatePublic();
  revalidatePath("/admin/sadrzaj/dijaspora");
  return { ok: true, message: "Država sačuvana." };
}

export async function deleteDijasporaCountry(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  if (!id) return;
  await db.delete(dijasporaCountries).where(eq(dijasporaCountries.id, id));
  revalidatePublic();
  revalidatePath("/admin/sadrzaj/dijaspora");
}

// —— Pozdravi ——

export async function getPozdraviAdmin() {
  await requireAdmin();
  const [settings] = await db.select().from(pozdraviSettings).limit(1);
  const items = await db.select().from(pozdraviItems).orderBy(asc(pozdraviItems.sortOrder));
  return { settings, items };
}

export async function savePozdraviSettings(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  const illustrative = formData.get("illustrative") === "on";
  const note = String(formData.get("note") || "").trim();
  if (!note) return { ok: false, error: "Napomena je obavezna." };

  if (id) {
    await db
      .update(pozdraviSettings)
      .set({ illustrative, note, updatedAt: new Date() })
      .where(eq(pozdraviSettings.id, id));
  } else {
    await db.insert(pozdraviSettings).values({ illustrative, note });
  }
  revalidatePublic();
  revalidatePath("/admin/sadrzaj/pozdravi");
  return { ok: true, message: "Pozdravi postavke sačuvane." };
}

export async function savePozdravItem(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  const name = String(formData.get("name") || "").trim();
  const loc = String(formData.get("loc") || "").trim();
  const text = String(formData.get("text") || "").trim();
  if (!name || !text) return { ok: false, error: "Ime i tekst su obavezni." };

  if (id) {
    await db.update(pozdraviItems).set({ name, loc, text }).where(eq(pozdraviItems.id, id));
  } else {
    const n = (await db.select().from(pozdraviItems)).length;
    await db.insert(pozdraviItems).values({ name, loc, text, sortOrder: n });
  }
  revalidatePublic();
  revalidatePath("/admin/sadrzaj/pozdravi");
  return { ok: true, message: "Pozdrav sačuvan." };
}

export async function deletePozdravItem(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  if (!id) return;
  await db.delete(pozdraviItems).where(eq(pozdraviItems.id, id));
  revalidatePublic();
  revalidatePath("/admin/sadrzaj/pozdravi");
}
