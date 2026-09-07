/**
 * Push .env.local keys to the linked Vercel project (production + preview).
 * Uses stdin for values (URLs contain & which breaks Windows cmd --value).
 * Does not print secret values.
 */
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";

const envPath = resolve(process.cwd(), ".env.local");
const raw = readFileSync(envPath, "utf8");

const env = {};
for (const line of raw.split(/\r?\n/)) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const i = trimmed.indexOf("=");
  if (i < 0) continue;
  const key = trimmed.slice(0, i).trim();
  let value = trimmed.slice(i + 1).trim();
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1);
  }
  env[key] = value;
}

const required = ["DATABASE_URL", "AUTH_SECRET"];
const missing = required.filter((k) => !env[k]);
if (missing.length) {
  console.error("Nedostaju u .env.local:", missing.join(", "));
  process.exit(1);
}

if (!env.AUTH_TRUST_HOST) env.AUTH_TRUST_HOST = "true";

const keys = Object.keys(env).filter((k) => !k.startsWith("VERCEL"));
const targets = ["production", "preview"];
const vercelBin = resolve(process.env.APPDATA || "", "npm", "vercel.cmd");

console.log("Šaljem na Vercel:", keys.join(", "));

for (const key of keys) {
  for (const target of targets) {
    const result = spawnSync(
      vercelBin,
      ["env", "add", key, target, "--yes", "--force", "--sensitive"],
      {
        input: `${env[key]}\n`,
        encoding: "utf8",
        shell: false,
        cwd: process.cwd(),
        windowsHide: true,
      },
    );
    const out = `${result.stdout || ""}\n${result.stderr || ""}`.trim();
    if (result.status !== 0) {
      console.error(`FAIL ${key} (${target}) status=${result.status}`);
      console.error(out.slice(0, 800));
      process.exit(result.status ?? 1);
    }
    console.log(`OK ${key} → ${target}`);
  }
}

console.log("Gotovo.");
