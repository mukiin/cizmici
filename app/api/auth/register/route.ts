import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";

const schema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email(),
  password: z.string().min(8),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Neispravan zahtjev." }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.issues[0]?.message ?? "Neispravan unos" },
      { status: 400 },
    );
  }

  const email = parsed.data.email.toLowerCase();
  const [existing] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (existing) {
    return NextResponse.json(
      { ok: false, error: "Nalog s ovim emailom već postoji." },
      { status: 409 },
    );
  }

  const passwordHash = await hash(parsed.data.password, 10);
  await db.insert(users).values({
    name: parsed.data.name,
    email,
    passwordHash,
    role: "member",
  });

  return NextResponse.json({ ok: true });
}
