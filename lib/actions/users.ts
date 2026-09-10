"use server";

import { asc, count, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/actions/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { isSuperAdminEmail } from "@/lib/super-admin";

export async function listUsersAdmin() {
  await requireAdmin();
  return db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      createdAt: users.createdAt,
      image: users.image,
    })
    .from(users)
    .orderBy(asc(users.createdAt));
}

export async function setUserRole(formData: FormData): Promise<void> {
  const admin = await requireAdmin();
  const id = String(formData.get("id") || "");
  const role = String(formData.get("role") || "");
  if (!id || !["admin", "member"].includes(role)) return;

  const [target] = await db
    .select({ id: users.id, email: users.email, role: users.role })
    .from(users)
    .where(eq(users.id, id))
    .limit(1);
  if (!target) return;

  // Trajni super-admin: niko (ni on sam putem UI) ne smije skinuti admin.
  if (isSuperAdminEmail(target.email) && role !== "admin") return;

  if (id === admin.id && role !== "admin") return;

  if (role === "member") {
    const [adminCount] = await db
      .select({ n: count() })
      .from(users)
      .where(eq(users.role, "admin"));
    if ((adminCount?.n ?? 0) <= 1 && target.role === "admin") return;
  }

  await db
    .update(users)
    .set({ role: role as "admin" | "member" })
    .where(eq(users.id, id));

  revalidatePath("/admin/korisnici");
  revalidatePath("/admin");
}
