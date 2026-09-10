import { config as loadEnv } from "dotenv";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { neon } from "@neondatabase/serverless";

loadEnv({ path: ".env.local" });

async function main() {
  const url = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL missing");
  const sql = neon(url);
  const file = readFileSync(resolve("drizzle/0002_editorial_tables.sql"), "utf8");
  const statements = file
    .split("--> statement-breakpoint")
    .map((s) => s.trim())
    .filter(Boolean);

  for (const statement of statements) {
    await sql.query(statement);
    console.log("OK:", statement.slice(0, 60).replace(/\s+/g, " "), "…");
  }
  console.log("Migration 0002 applied.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
