"use server";

import { and, desc, eq } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import { requireAdmin, requireUser, type ActionState } from "@/lib/actions/auth";
import { db } from "@/lib/db";
import { issues, stories, users } from "@/lib/db/schema";

function bustAdminCache() {
  revalidateTag("admin-stories");
  revalidateTag("admin-issues");
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

async function uniqueStorySlug(base: string) {
  const slug = base || "prica";
  let i = 0;
  while (true) {
    const candidate = i === 0 ? slug : `${slug}-${i}`;
    const [existing] = await db
      .select({ id: stories.id })
      .from(stories)
      .where(eq(stories.slug, candidate))
      .limit(1);
    if (!existing) return candidate;
    i += 1;
  }
}

const storySchema = z.object({
  title: z.string().trim().min(4, "Naslov je prekratak").max(160),
  body: z.string().trim().min(20, "Tekst je prekratak").max(12000),
});

const issueSchema = z.object({
  kind: z.enum(["put", "rasvjeta", "deponija", "ostalo"]),
  location: z.string().trim().min(3).max(160),
  body: z.string().trim().min(10).max(4000),
});

const kindLabels: Record<string, string> = {
  put: "Oštećen put",
  rasvjeta: "Rasvjeta",
  deponija: "Divlja deponija",
  ostalo: "Ostalo",
};

export async function submitStory(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  const parsed = storySchema.safeParse({
    title: formData.get("title"),
    body: formData.get("body"),
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Neispravan unos" };
  }

  const slug = await uniqueStorySlug(slugify(parsed.data.title));
  const status = user.role === "admin" ? "published" : "pending";

  await db.insert(stories).values({
    title: parsed.data.title,
    slug,
    body: parsed.data.body,
    authorId: user.id,
    status,
    publishedAt: status === "published" ? new Date() : null,
  });

  revalidatePath("/price");
  revalidatePath("/admin");
  revalidatePath("/admin/price");
  bustAdminCache();

  return {
    ok: true,
    message:
      status === "published"
        ? "Priča je objavljena."
        : "Priča je poslana. Čeka odobrenje administratora.",
  };
}

export async function submitIssue(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  const parsed = issueSchema.safeParse({
    kind: formData.get("kind"),
    location: formData.get("location"),
    body: formData.get("body"),
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Neispravan unos" };
  }

  const title = `${kindLabels[parsed.data.kind] ?? "Prijava"} — ${parsed.data.location}`;

  await db.insert(issues).values({
    kind: parsed.data.kind,
    title,
    location: parsed.data.location,
    body: parsed.data.body,
    authorId: user.id,
    status: "new",
    visibility: "public",
  });

  revalidatePath("/prijave");
  revalidatePath("/admin");
  revalidatePath("/admin/prijave");
  bustAdminCache();

  return { ok: true, message: "Prijava je poslana." };
}

export async function setStoryStatus(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "");
  if (!id || !["pending", "published", "rejected", "draft"].includes(status)) return;

  await db
    .update(stories)
    .set({
      status: status as "pending" | "published" | "rejected" | "draft",
      publishedAt: status === "published" ? new Date() : null,
      updatedAt: new Date(),
    })
    .where(eq(stories.id, id));

  revalidatePath("/admin");
  revalidatePath("/admin/price");
  revalidatePath("/price");
  bustAdminCache();
}

export async function setIssueStatus(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "");
  if (!id || !["new", "progress", "done"].includes(status)) return;

  await db
    .update(issues)
    .set({
      status: status as "new" | "progress" | "done",
      updatedAt: new Date(),
    })
    .where(eq(issues.id, id));

  revalidatePath("/admin");
  revalidatePath("/admin/prijave");
  revalidatePath("/prijave");
  bustAdminCache();
}

export async function setIssueVisibility(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  const visibility = String(formData.get("visibility") || "");
  if (!id || !["public", "hidden"].includes(visibility)) return;

  await db
    .update(issues)
    .set({
      visibility: visibility as "public" | "hidden",
      updatedAt: new Date(),
    })
    .where(eq(issues.id, id));

  revalidatePath("/admin");
  revalidatePath("/admin/prijave");
  revalidatePath("/prijave");
  bustAdminCache();
}

export async function listPublishedStories() {
  return db
    .select({
      id: stories.id,
      title: stories.title,
      slug: stories.slug,
      body: stories.body,
      publishedAt: stories.publishedAt,
      authorName: users.name,
    })
    .from(stories)
    .innerJoin(users, eq(stories.authorId, users.id))
    .where(eq(stories.status, "published"))
    .orderBy(desc(stories.publishedAt), desc(stories.createdAt));
}

export async function getPublishedStory(slug: string) {
  const [row] = await db
    .select({
      id: stories.id,
      title: stories.title,
      slug: stories.slug,
      body: stories.body,
      publishedAt: stories.publishedAt,
      authorName: users.name,
    })
    .from(stories)
    .innerJoin(users, eq(stories.authorId, users.id))
    .where(and(eq(stories.slug, slug), eq(stories.status, "published")))
    .limit(1);
  return row;
}

export async function listPublicIssues() {
  return db
    .select({
      id: issues.id,
      title: issues.title,
      location: issues.location,
      body: issues.body,
      status: issues.status,
      createdAt: issues.createdAt,
      authorName: users.name,
    })
    .from(issues)
    .innerJoin(users, eq(issues.authorId, users.id))
    .where(eq(issues.visibility, "public"))
    .orderBy(desc(issues.createdAt));
}
