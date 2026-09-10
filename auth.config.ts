import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/prijava",
  },
  session: {
    strategy: "jwt",
    // Shorter cookie work; role stays in JWT until re-login.
    maxAge: 60 * 60 * 24 * 14,
  },
  providers: [],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id!;
        token.role = (user as { role?: "admin" | "member" }).role ?? "member";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = (token.role as "admin" | "member") ?? "member";
      }
      return session;
    },
  },
  trustHost: true,
} satisfies NextAuthConfig;
