import { config as loadEnv } from "dotenv";

loadEnv({ path: ".env.local" });

/** Seed / upsert trajnog super-admina cizmicm. */
async function main() {
  const bcrypt = (await import("bcryptjs")).default;
  const { eq } = await import("drizzle-orm");
  const { db } = await import("../lib/db");
  const { users } = await import("../lib/db/schema");
  const { SUPER_ADMIN_EMAIL, SUPER_ADMIN_NAME } = await import("../lib/super-admin");

  const password = "Danesjepetek2024";
  const passwordHash = await bcrypt.hash(password, 10);

  const [existing] = await db
    .select()
    .from(users)
    .where(eq(users.email, SUPER_ADMIN_EMAIL))
    .limit(1);

  if (existing) {
    await db
      .update(users)
      .set({
        name: SUPER_ADMIN_NAME,
        passwordHash,
        role: "admin",
      })
      .where(eq(users.id, existing.id));
    console.log(`Super-admin ažuriran: ${SUPER_ADMIN_EMAIL}`);
    return;
  }

  await db.insert(users).values({
    email: SUPER_ADMIN_EMAIL,
    name: SUPER_ADMIN_NAME,
    passwordHash,
    role: "admin",
  });
  console.log(`Super-admin kreiran: ${SUPER_ADMIN_EMAIL}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
