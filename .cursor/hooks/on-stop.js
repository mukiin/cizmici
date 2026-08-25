"use strict";

const fs = require("fs");
const path = require("path");

const SKIP_DIRS = new Set(["node_modules", ".next", ".git", ".codacy"]);
const ROOTS = ["app", "components", "content", "lib", "public", "mockups", ".cursor"];

function newestUnder(dir) {
  if (!fs.existsSync(dir)) return 0;
  let max = 0;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      max = Math.max(max, newestUnder(full));
      continue;
    }
    if (!entry.isFile()) continue;
    if (entry.name === "STANJE.md") continue;
    max = Math.max(max, fs.statSync(full).mtimeMs);
  }
  return max;
}

let raw = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => {
  raw += chunk;
});
process.stdin.on("end", () => {
  let loopCount = 0;
  let status = "completed";
  try {
    const payload = JSON.parse(raw || "{}");
    loopCount = Number(payload.loop_count) || 0;
    status = payload.status || "completed";
  } catch {
    loopCount = 0;
  }

  if (loopCount > 0 || status === "aborted") {
    process.stdout.write("{}\n");
    return;
  }

  const root = process.cwd();
  const stanjePath = path.join(root, "STANJE.md");
  const stanjeMtime = fs.existsSync(stanjePath) ? fs.statSync(stanjePath).mtimeMs : 0;
  let newest = 0;
  for (const rel of ROOTS) {
    newest = Math.max(newest, newestUnder(path.join(root, rel)));
  }

  if (newest > stanjeMtime + 1500) {
    process.stdout.write(
      `${JSON.stringify({
        followup_message:
          "Ažuriraj STANJE.md po skillu azuriraj-stanje: zapiši šta je urađeno u ovom potezu, šta je sljedeće, i datum (Europe/Sarajevo). Ne radi ništa osim tog ažuriranja.",
      })}\n`,
    );
    return;
  }

  process.stdout.write("{}\n");
});
