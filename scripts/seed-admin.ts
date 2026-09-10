import { config as loadEnv } from "dotenv";

loadEnv({ path: ".env.local" });

async function main() {
  const bcrypt = (await import("bcryptjs")).default;
  const { eq } = await import("drizzle-orm");
  const { db } = await import("../lib/db");
  const { users } = await import("../lib/db/schema");

  const email = process.env.ADMIN_EMAIL?.toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || "Administrator";

  if (!email || !password) {
    throw new Error("ADMIN_EMAIL i ADMIN_PASSWORD moraju biti u .env.local");
  }
  if (password.length < 8) {
    throw new Error("ADMIN_PASSWORD mora imati najmanje 8 karaktera");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const [existing] = await db.select().from(users).where(eq(users.email, email)).limit(1);

  if (existing) {
    await db
      .update(users)
      .set({
        name,
        passwordHash,
        role: "admin",
      })
      .where(eq(users.id, existing.id));
    console.log(`Admin ažuriran: ${email}`);
    return;
  }

  await db.insert(users).values({
    email,
    name,
    passwordHash,
    role: "admin",
  });
  console.log(`Admin kreiran: ${email}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
