import { config as loadEnv } from "dotenv";

loadEnv({ path: ".env.local" });

/** Prebaci stare @cizmici.ba adrese / domain na .net */
async function main() {
  const { eq, sql } = await import("drizzle-orm");
  const { db } = await import("../lib/db");
  const { users, siteSettings } = await import("../lib/db/schema");
  const { SUPER_ADMIN_EMAIL, SUPER_ADMIN_NAME } = await import("../lib/super-admin");
  const bcrypt = (await import("bcryptjs")).default;

  // Domain u site_settings
  await db
    .update(siteSettings)
    .set({ domain: "cizmici.net", updatedAt: new Date() })
    .where(sql`true`);
  console.log("site_settings.domain → cizmici.net");

  // Stari admin@cizmici.ba → .net (ako postoji)
  const [oldAdmin] = await db
    .select()
    .from(users)
    .where(eq(users.email, "admin@cizmici.ba"))
    .limit(1);
  if (oldAdmin) {
    const [clash] = await db
      .select()
      .from(users)
      .where(eq(users.email, "admin@cizmici.net"))
      .limit(1);
    if (!clash) {
      await db
        .update(users)
        .set({ email: "admin@cizmici.net" })
        .where(eq(users.id, oldAdmin.id));
      console.log("admin@cizmici.ba → admin@cizmici.net");
    }
  }

  // Super-admin: migracija sa .ba ili upsert na .net
  const [oldSuper] = await db
    .select()
    .from(users)
    .where(eq(users.email, "cizmicm@cizmici.ba"))
    .limit(1);
  const [newSuper] = await db
    .select()
    .from(users)
    .where(eq(users.email, SUPER_ADMIN_EMAIL))
    .limit(1);

  const passwordHash = await bcrypt.hash("Danesjepetek2024", 10);

  if (oldSuper && !newSuper) {
    await db
      .update(users)
      .set({
        email: SUPER_ADMIN_EMAIL,
        name: SUPER_ADMIN_NAME,
        passwordHash,
        role: "admin",
      })
      .where(eq(users.id, oldSuper.id));
    console.log("cizmicm@cizmici.ba → cizmicm@cizmici.net");
  } else if (newSuper) {
    await db
      .update(users)
      .set({
        name: SUPER_ADMIN_NAME,
        passwordHash,
        role: "admin",
      })
      .where(eq(users.id, newSuper.id));
    if (oldSuper) {
      await db.delete(users).where(eq(users.id, oldSuper.id));
      console.log("obrisan stari cizmicm@cizmici.ba (već postoji .net)");
    } else {
      console.log("cizmicm@cizmici.net ažuriran");
    }
  } else {
    await db.insert(users).values({
      email: SUPER_ADMIN_EMAIL,
      name: SUPER_ADMIN_NAME,
      passwordHash,
      role: "admin",
    });
    console.log("kreiran cizmicm@cizmici.net");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
