# Stanje — Čizmići

Ažurirano: 2026-09-07 22:05 (Europe/Sarajevo)
Zadnji potez: Vercel projekat povezan + env secrets; CLI deploy upload pada na mreži — treba commit/push + Redeploy.

Neslužbena digitalna lična karta **MZ Čizmići** (Grad Cazin, USK). Nije sajt MZ ni Grada. Cilj: mještani + dijaspora (DE/AT/SI/CH).

## Sada radi

- Next.js 15 App Router; urednički sadržaj i dalje u `content/*.json` preko `lib/data.ts`.
- **Neon Postgres** (`green-paper-25054361` / `production`) + **Drizzle** šema/migracije.
- **Auth.js** email+lozinka: registracija mještana, prijava, JWT sesija; Google kasnije.
- Role: `admin` | `member`. Seed admin: `npm run db:seed-admin` (env `ADMIN_EMAIL` / `ADMIN_PASSWORD`).
- Žive **priče** (`/price`, `/price/[slug]`): mještanin šalje → `pending` → admin odobrava → `published`.
- Žive **prijave** (`/prijave`): odmah `new`; admin status / sakrij.
- **Admin panel** `/admin`, `/admin/price`, `/admin/prijave` (middleware samo za admin).
- Početna/historija/infrastruktura/mapa i dalje JSON; forme ankete i dalje disabled.
- Live traka: Open-Meteo + countdown do Dana MZ (10. juli).
- `neon.ts` + `.neon` + `.env.local` (ne u git).

## Odluke (ne dirati bez pitanja)

- Vizualni jezik mockupa: pergament / šuma / rđa / zlato, Fraunces + Inter + IBM Plex Mono. Ne redizajnirati.
- Javni plan: 1 Lična karta → 2 Vijesti/priče → 3 Dijaspora → 4 Zajednica. **Nema porodičnih stabala** na javnom planu.
- Ne izmišljati brojeve. Izvor označiti (službeni akt / statistika / javni izvor).
- Faza 1 nav: hash linkovi (`/#historija` …) da skrolaju početnu. Dijaspora i Događaji ostaju prave rute.
- Infrastruktura: nema ucrtavanja 10 puteva dok nema GPS/elaborata; ostaje tekst iz evidencije MZ 2021.
- **ORM: Drizzle.** Auth: email+lozinka prvo, Google kasnije. Priče čekaju odobrenje admina.
- Baza: Neon managed Postgres (ne lokalni Docker).

## Ne graditi još

- Porodična stabla / matching
- Email digest HTML
- Oglasi, vaktija, dženaze, donacije
- Dijaspora mapa opt-in (objave)
- Žive ankete
- Google OAuth
- CMS za historiju/infrastrukturu/… (JSON ostaje dok ne krene Faza D)

## Sljedeće

- Commit + push novog koda (auth/DB) na GitHub, zatim Vercel Redeploy / Git connect (CLI upload trenutno `fetch failed`).
- Faza D: admin CRUD + migracija uredničkog JSON sadržaja u DB.
- Google prijava.
- (Opcionalno) žive ankete.

## Tehničko

- Folder: `cizmici` (Next root). Dev: `npm run dev` → **port 3005**.
- Stack: Next 15.5, React 19, Drizzle, Auth.js v5, Neon serverless driver, Leaflet za mapu.
- Skripte: `db:generate`, `db:migrate`, `db:seed-admin`.
- Codacy MCP: poslije edit-a `codacy_cli_analyze`; poslije npm install — trivy (MCP trenutno često nedostupan — reset ekstenzije).
- Dnevnik: `.cursor/rules/stanje.mdc` + skill `azuriraj-stanje`.

## Changelog

- 2026-09-07: Vercel `mukiin/cizmici` link + Production/Preview env (Neon/Auth); URL https://cizmici.vercel.app (još stari deploy dok se ne pusha novi kod).
- 2026-09-06: Neon link + Drizzle tabele + Auth + žive priče/prijave + /admin; mock forme skinute.
- 2026-08-26: GitHub remote `https://github.com/mukiin/cizmici.git` — prvi commit na `main`.
- 2026-08-26: Dnevnik `STANJE.md` + agent (pravilo, skill, hookovi) da se stanje dopisuje poslije svake izmjene.
- 2026-08-26: Hydration mismatch — skripta skida atribute Chrome ekstenzija prije hidracije.
- 2026-08-26: Infrastruktura — uklonjene mape pravaca; ostali detaljni opisi i tabele činjenica.
- 2026-08-26: Historija klik otvara članak; infrastruktura klik otvara stranicu (prvo s mapom, zatim bez).
- 2026-08-25: Scaffold Next.js, početna kao mockup, Faza 1–2 javne stranice, forme disabled.
