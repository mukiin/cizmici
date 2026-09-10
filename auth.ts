import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { authConfig } from "@/auth.config";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

/**
 * Credentials + JWT only — no DB adapter.
 * DB/bcrypt se učitavaju tek u authorize (prijava), ne na /api/auth/session.
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Lozinka", type: "password" },
      },
      async authorize(raw) {
        const parsed = credentialsSchema.safeParse(raw);
        if (!parsed.success) return null;

        const [{ eq }, { db }, { users }, bcrypt] = await Promise.all([
          import("drizzle-orm"),
          import("@/lib/db"),
          import("@/lib/db/schema"),
          import("bcryptjs"),
        ]);

        const email = parsed.data.email.toLowerCase();
        const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
        if (!user?.passwordHash) return null;

        const ok = await bcrypt.default.compare(parsed.data.password, user.passwordHash);
        if (!ok) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
});
