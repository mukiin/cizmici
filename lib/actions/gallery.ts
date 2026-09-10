"use server";

import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireUser, type ActionState } from "@/lib/actions/auth";
import { db } from "@/lib/db";
import { galleryImages, users } from "@/lib/db/schema";
import { optimizeGalleryImage } from "@/lib/gallery-optimize";

const MAX_UPLOAD_BYTES = 12 * 1024 * 1024; // prije kompresije
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/heic", "image/heif"]);

export type GalleryListItem = {
  id: string;
  caption: string | null;
  width: number;
  height: number;
  bytes: number;
  createdAt: Date;
  authorName: string;
  authorId: string;
};

export async function listGalleryImages(): Promise<GalleryListItem[]> {
  return db
    .select({
      id: galleryImages.id,
      caption: galleryImages.caption,
      width: galleryImages.width,
      height: galleryImages.height,
      bytes: galleryImages.bytes,
      createdAt: galleryImages.createdAt,
      authorName: users.name,
      authorId: galleryImages.authorId,
    })
    .from(galleryImages)
    .innerJoin(users, eq(galleryImages.authorId, users.id))
    .orderBy(desc(galleryImages.createdAt));
}

export async function getGalleryImageData(id: string) {
  const [row] = await db
    .select({
      dataBase64: galleryImages.dataBase64,
      mimeType: galleryImages.mimeType,
    })
    .from(galleryImages)
    .where(eq(galleryImages.id, id))
    .limit(1);
  return row;
}

export async function uploadGalleryImage(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  const file = formData.get("image");
  const caption = String(formData.get("caption") || "")
    .trim()
    .slice(0, 200);

  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "Odaberite sliku." };
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return { ok: false, error: "Slika je prevelika (max 12 MB prije kompresije)." };
  }
  if (file.type && !ALLOWED.has(file.type) && !file.type.startsWith("image/")) {
    return { ok: false, error: "Dozvoljeni su samo formati slika." };
  }

  const raw = Buffer.from(await file.arrayBuffer());
  let optimized;
  try {
    optimized = await optimizeGalleryImage(raw);
  } catch {
    return { ok: false, error: "Slika se nije mogla obraditi. Pokušajte drugi fajl." };
  }

  await db.insert(galleryImages).values({
    authorId: user.id,
    caption: caption || null,
    mimeType: optimized.mimeType,
    dataBase64: optimized.buffer.toString("base64"),
    width: optimized.width,
    height: optimized.height,
    bytes: optimized.bytes,
  });

  revalidatePath("/galerija");
  return {
    ok: true,
    message: `Slika dodana (${Math.round(optimized.bytes / 1024)} KB WebP).`,
  };
}

export async function deleteGalleryImage(formData: FormData): Promise<void> {
  const user = await requireUser();
  const id = String(formData.get("id") || "");
  if (!id) return;

  const [row] = await db
    .select({ authorId: galleryImages.authorId })
    .from(galleryImages)
    .where(eq(galleryImages.id, id))
    .limit(1);
  if (!row) return;

  if (row.authorId !== user.id && user.role !== "admin") {
    throw new Error("FORBIDDEN");
  }

  await db.delete(galleryImages).where(eq(galleryImages.id, id));
  revalidatePath("/galerija");
}
