import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { authConfig } from "@/auth.config";
import { db } from "@/lib/db";
import { accounts, sessions, users, verificationTokens } from "@/lib/db/schema";
import { isSuperAdminEmail } from "@/lib/super-admin";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const googleEnabled = Boolean(
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET,
);

/**
 * JWT session (bez DB na svaki request).
 * Adapter samo za Google OAuth (accounts/users create+link).
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  ...(googleEnabled
    ? {
        adapter: DrizzleAdapter(db, {
          usersTable: users,
          accountsTable: accounts,
          sessionsTable: sessions,
          verificationTokensTable: verificationTokens,
        }),
      }
    : {}),
  providers: [
    ...(googleEnabled
      ? [
          Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            allowDangerousEmailAccountLinking: true,
          }),
        ]
      : []),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Lozinka", type: "password" },
      },
      async authorize(raw) {
        const parsed = credentialsSchema.safeParse(raw);
        if (!parsed.success) return null;

        const bcrypt = await import("bcryptjs");
        const email = parsed.data.email.toLowerCase();
        const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
        if (!user?.passwordHash) return null;

        const ok = await bcrypt.default.compare(parsed.data.password, user.passwordHash);
        if (!ok) return null;

        const role = isSuperAdminEmail(user.email) ? "admin" : user.role;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role,
        };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id!;
        if (isSuperAdminEmail(user.email)) {
          token.role = "admin";
        } else {
          const fromUser = (user as { role?: "admin" | "member" }).role;
          if (fromUser) {
            token.role = fromUser;
          } else if (user.email) {
            const [row] = await db
              .select({ id: users.id, role: users.role })
              .from(users)
              .where(eq(users.email, user.email.toLowerCase()))
              .limit(1);
            if (row) {
              token.id = row.id;
              token.role = isSuperAdminEmail(user.email) ? "admin" : row.role;
            } else {
              token.role = "member";
            }
          } else {
            token.role = "member";
          }
        }
      }

      // Osveži role iz baze (npr. nakon promote u admina + session.update())
      if (trigger === "update" && token.id) {
        if (isSuperAdminEmail(token.email as string | undefined)) {
          token.role = "admin";
        } else {
          const [row] = await db
            .select({ role: users.role, email: users.email })
            .from(users)
            .where(eq(users.id, String(token.id)))
            .limit(1);
          if (row) {
            token.role = isSuperAdminEmail(row.email) ? "admin" : row.role;
            token.email = row.email;
          }
        }
      }

      // Trajni vlasnik uvijek admin u JWT-u
      if (isSuperAdminEmail(token.email as string | undefined)) {
        token.role = "admin";
      }

      return token;
    },
  },
});

export const isGoogleAuthEnabled = googleEnabled;
