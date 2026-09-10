"use server";

import { AuthError } from "next-auth";
import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { auth, signIn, signOut } from "@/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";

const registerSchema = z.object({
  name: z.string().trim().min(2, "Ime je prekratko").max(80),
  email: z.string().trim().email("Unesite ispravan email"),
  password: z.string().min(8, "Lozinka mora imati najmanje 8 karaktera"),
});

const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8),
});

export type ActionState = {
  ok: boolean;
  error?: string;
  message?: string;
};

export async function registerMember(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Neispravan unos" };
  }

  const email = parsed.data.email.toLowerCase();
  const [existing] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (existing) {
    return { ok: false, error: "Nalog s ovim emailom već postoji." };
  }

  // cost 10 ≈ 4× brže od 12; i dalje dovoljno za ovaj sajt
  const passwordHash = await hash(parsed.data.password, 10);
  await db.insert(users).values({
    name: parsed.data.name,
    email,
    passwordHash,
    role: "member",
  });

  try {
    await signIn("credentials", {
      email,
      password: parsed.data.password,
      redirectTo: "/price",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { ok: false, error: "Nalog je kreiran, ali prijava nije uspjela. Pokušajte se prijaviti." };
    }
    throw error;
  }

  return { ok: true, message: "Nalog kreiran." };
}

export async function loginMember(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { ok: false, error: "Provjerite email i lozinku." };
  }

  const callbackUrl = String(formData.get("callbackUrl") || "/");

  try {
    await signIn("credentials", {
      email: parsed.data.email.toLowerCase(),
      password: parsed.data.password,
      redirectTo: callbackUrl.startsWith("/") ? callbackUrl : "/",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { ok: false, error: "Pogrešan email ili lozinka." };
    }
    throw error;
  }

  return { ok: true };
}

export async function logoutMember() {
  await signOut({ redirectTo: "/" });
}

export async function loginWithGoogle(formData: FormData) {
  const callbackUrl = String(formData.get("callbackUrl") || "/");
  await signIn("google", {
    redirectTo: callbackUrl.startsWith("/") ? callbackUrl : "/",
  });
}

export async function requireUser() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("UNAUTHORIZED");
  }
  return session.user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== "admin") {
    throw new Error("FORBIDDEN");
  }
  return user;
}
