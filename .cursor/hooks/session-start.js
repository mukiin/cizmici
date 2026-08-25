"use strict";

const fs = require("fs");
const path = require("path");

let raw = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => {
  raw += chunk;
});
process.stdin.on("end", () => {
  const file = path.join(process.cwd(), "STANJE.md");
  let body = "STANJE.md još ne postoji. Kreiraj ga po skillu azuriraj-stanje.";
  if (fs.existsSync(file)) {
    body = fs.readFileSync(file, "utf8");
    if (body.length > 8000) body = `${body.slice(0, 8000)}\n…`;
  }
  process.stdout.write(
    `${JSON.stringify({
      additional_context:
        "Obavezno poštuj STANJE.md (dnevnik projekta Čizmići). Pročitaj ga na početku. Na kraju svakog poteza koji mijenja kod, sadržaj ili odluke — ažuriraj ga. Trenutni sadržaj:\n\n" +
        body,
    })}\n`,
  );
});
