"use server";

import { asc, eq } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";
import { requireAdmin, type ActionState } from "@/lib/actions/auth";
import { db } from "@/lib/db";
import {
  businesses,
  events,
  historijaItems,
  projects,
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

export async function listHistorijaAdmin() {
  await requireAdmin();
  return db.select().from(historijaItems).orderBy(asc(historijaItems.sortOrder));
}

export async function getHistorijaAdmin(slug: string) {
  await requireAdmin();
  const [row] = await db.select().from(historijaItems).where(eq(historijaItems.slug, slug)).limit(1);
  return row;
}

export async function saveHistorijaItem(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  const title = String(formData.get("title") || "").trim();
  const year = String(formData.get("year") || "").trim();
  const body = String(formData.get("body") || "").trim();
  const source = String(formData.get("source") || "public") as
    | "official"
    | "verified"
    | "public";
  const featured = formData.get("featured") === "on";
  const detail = String(formData.get("detail") || "")
    .split(/\n+/)
    .map((s) => s.trim())
    .filter(Boolean);
  let slug = String(formData.get("slug") || "").trim() || slugify(`${year}-${title}`);

  if (!title || !year || !body) {
    return { ok: false, error: "Godina, naslov i kratki opis su obavezni." };
  }

  if (id) {
    await db
      .update(historijaItems)
      .set({
        slug,
        year,
        title,
        body,
        source,
        featured,
        detail,
        updatedAt: new Date(),
      })
      .where(eq(historijaItems.id, id));
  } else {
    const existing = await db.select().from(historijaItems).where(eq(historijaItems.slug, slug)).limit(1);
    if (existing.length) slug = `${slug}-${Date.now().toString(36)}`;
    const count = (await db.select().from(historijaItems)).length;
    await db.insert(historijaItems).values({
      slug,
      year,
      title,
      body,
      source,
      featured,
      detail,
      sortOrder: count,
    });
  }

  revalidatePublic();
  revalidatePath("/admin/sadrzaj/historija");
  return { ok: true, message: "Historija sačuvana." };
}

export async function deleteHistorijaItem(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  if (!id) return;
  await db.delete(historijaItems).where(eq(historijaItems.id, id));
  revalidatePublic();
  revalidatePath("/admin/sadrzaj/historija");
}

export async function listProjectsAdmin() {
  await requireAdmin();
  return db.select().from(projects).orderBy(asc(projects.sortOrder));
}

export async function saveProjectItem(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "planned") as "done" | "progress" | "planned";
  let statusLabel = String(formData.get("statusLabel") || "").trim();
  if (!statusLabel) {
    statusLabel =
      status === "done" ? "Završeno" : status === "progress" ? "U toku" : "Planirano";
  }
  const title = String(formData.get("title") || "").trim();
  const body = String(formData.get("body") || "").trim();
  const year = String(formData.get("year") || "").trim();
  const meta = String(formData.get("meta") || "").trim();
  if (!title || !body) return { ok: false, error: "Naslov i opis su obavezni." };

  if (id) {
    await db
      .update(projects)
      .set({ status, statusLabel, title, body, year, meta, updatedAt: new Date() })
      .where(eq(projects.id, id));
  } else {
    const count = (await db.select().from(projects)).length;
    await db.insert(projects).values({
      status,
      statusLabel,
      title,
      body,
      year,
      meta,
      sortOrder: count,
    });
  }
  revalidatePublic();
  revalidatePath("/admin/sadrzaj/projekti");
  return { ok: true, message: "Projekat sačuvan." };
}

export async function deleteProjectItem(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  if (!id) return;
  await db.delete(projects).where(eq(projects.id, id));
  revalidatePublic();
  revalidatePath("/admin/sadrzaj/projekti");
}

export async function listBusinessesAdmin() {
  await requireAdmin();
  return db.select().from(businesses).orderBy(asc(businesses.sortOrder));
}

export async function saveBusinessItem(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  const name = String(formData.get("name") || "").trim();
  const tag = String(formData.get("tag") || "").trim();
  const body = String(formData.get("body") || "").trim();
  const founded = String(formData.get("founded") || "").trim();
  const location = String(formData.get("location") || "").trim();
  if (!name || !body) return { ok: false, error: "Naziv i opis su obavezni." };

  if (id) {
    await db
      .update(businesses)
      .set({ name, tag, body, founded, location, updatedAt: new Date() })
      .where(eq(businesses.id, id));
  } else {
    const count = (await db.select().from(businesses)).length;
    await db.insert(businesses).values({ name, tag, body, founded, location, sortOrder: count });
  }
  revalidatePublic();
  revalidatePath("/admin/sadrzaj/biznisi");
  return { ok: true, message: "Biznis sačuvan." };
}

export async function deleteBusinessItem(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  if (!id) return;
  await db.delete(businesses).where(eq(businesses.id, id));
  revalidatePublic();
  revalidatePath("/admin/sadrzaj/biznisi");
}

export async function listEventsAdmin() {
  await requireAdmin();
  return db.select().from(events).orderBy(asc(events.sortOrder));
}

export async function saveEventItem(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  const day = String(formData.get("day") || "").trim();
  const month = String(formData.get("month") || "").trim();
  const title = String(formData.get("title") || "").trim();
  const meta = String(formData.get("meta") || "").trim();
  const recurring = formData.get("recurring") === "on";
  const illustrative = formData.get("illustrative") === "on";
  if (!title || !day || !month) {
    return { ok: false, error: "Dan, mjesec i naslov su obavezni." };
  }

  if (id) {
    await db
      .update(events)
      .set({ day, month, title, meta, recurring, illustrative, updatedAt: new Date() })
      .where(eq(events.id, id));
  } else {
    const count = (await db.select().from(events)).length;
    await db.insert(events).values({
      day,
      month,
      title,
      meta,
      recurring,
      illustrative,
      sortOrder: count,
    });
  }
  revalidatePublic();
  revalidatePath("/admin/sadrzaj/dogadjaji");
  return { ok: true, message: "Događaj sačuvan." };
}

export async function deleteEventItem(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  if (!id) return;
  await db.delete(events).where(eq(events.id, id));
  revalidatePublic();
  revalidatePath("/admin/sadrzaj/dogadjaji");
}
