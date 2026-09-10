import { config as loadEnv } from "dotenv";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

loadEnv({ path: ".env.local" });

async function main() {
  const { CMS_KEYS } = await import("../lib/cms/keys");
  const { saveCmsDocument } = await import("../lib/cms/store");

  const contentDir = resolve(process.cwd(), "content");
  let count = 0;

  for (const key of CMS_KEYS) {
    const file = resolve(contentDir, `${key}.json`);
    const data = JSON.parse(readFileSync(file, "utf8"));
    await saveCmsDocument(key, data);
    count += 1;
    console.log(`OK ${key}`);
  }

  console.log(`Seed CMS: ${count} dokumenata.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
