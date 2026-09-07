import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const globalForDb = globalThis as unknown as { __cizmiciDb?: ReturnType<typeof createDb> };

function createDb() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL nije postavljen. Pokreni `neon link` ili `neon env pull` u folderu projekta.",
    );
  }
  return drizzle(neon(url), { schema });
}

export const db = globalForDb.__cizmiciDb ?? createDb();

if (process.env.NODE_ENV !== "production") {
  globalForDb.__cizmiciDb = db;
}
