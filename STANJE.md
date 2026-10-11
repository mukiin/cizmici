# Stanje — Čizmići

Ažurirano: 2026-10-11 20:33 (Europe/Sarajevo)
Zadnji potez: Push `a3d9886` na GitHub i Vercel production.

Neslužbena digitalna lična karta **MZ Čizmići** (Grad Cazin, USK).

## Sada radi

- Auth + Google; CMS; korisnici; super-admin.
- **Galerija** `/galerija` — samo prijavljeni dodaju, odmah javno.
- **Forum** `/forum` — teme, komentari, lajk/dislajk; admin briše teme i komentare.
- Slike: sharp → WebP max 1280px, `gallery_images`, `/api/galerija/[id]`.
- Lična karta: historija (1991–2023), popis 2013. sa svim starosnim skupinama, infra (Vignjevići, džamija 2006.), projekti iz akata. Biznisi prazni. Dijaspora bez izmišljenih brojki.
- Domen (sadržaj): cizmici.net
- Produkcija: https://cizmici.vercel.app (Vercel `mukiin/cizmici`)
- Lokalno: `http://localhost:3005`

## Odluke

- Galerija model A (ravna lista, bez albuma).
- Autor se prikazuje uz svaku sliku; autor/admin može obrisati.
- Forum: javni pregled; pišu/glasaju samo prijavljeni; uz objavu ime + datum/vrijeme (Europe/Sarajevo); jedan glas po osobi (ponovni klik skida).
- Forum: samo **admin** briše teme i komentare (ne i običan autor); prije brisanja pita za potvrdu.
- **Novosti se ne dodaju** — stranica ostaje lična karta sela, ne portal vijesti.
- **Pronađene firme se ne objavljuju** (Auto otpad/servis, HALAL, austrijska investment firma). Sekcija Biznisi ostaje prazna dok nema odluke da se unosi pouzdano.
- Dijaspora: nema zvaničnog broja — ne izmišljati 312/98/64. Samo koridori DE/AT/SI/CH.

## Ne graditi još

- Porodična stabla, email digest, oglasi/vaktija, dijaspora opt-in, žive ankete
- Albumi/tagovi u galeriji (kasnije ako treba)
- Novosti / smrtovnice na naslovnoj

## Sljedeće

- Žive ankete (kasnije).
- Google login lokalno treba `GOOGLE_CLIENT_*` s drugog računara (opciono).

## Tehničko

- `npm run db:apply-gallery` → migracija 0003
- `npm run db:apply-forum` → migracija 0004
- `npm run db:seed-forum` → 5 tema × 3 komentara (idempotent po naslovu)
- `npx tsx scripts/apply-content-refresh.ts` — historija/demo/infra/projekti/site/dijaspora/biznisi iz `content/*.json`; **ne dira** mapu, pozdrave, događaje
- `npm run db:seed-editorial` — puni seed (briše i mapu); prazan `biznisi.json` je dozvoljen
- Dev: :3005 (`npm run dev`); Neon `cizmici` (`.neon` + `.env.local`, nije u gitu)
- Port 3000 zauzima Grafana
- Editorial cache ~120 s (`unstable_cache`)

## Changelog

- 2026-10-11: Push `a3d9886` + deploy https://cizmici.vercel.app. `cizmici.net` nije vezan na ovaj Vercel nalog.
- 2026-10-11: Historija i ostali sadržaj iz javnih izvora; biznisi i izmišljene brojke dijaspore skinuti; Novosti odbačene.
- 2026-10-11: Footer — bedževi izvora sivi na tamnoj podlozi.
- 2026-10-11: Admin panel — `formatDate` prima string ili Date (Neon HTTP).
- 2026-10-11: Admin brisanje teme/komentara ide preko potvrde Da / Odustani.
- 2026-10-11: Seed 5 forum tema; admin dugmad Obriši na temi i komentaru.
- 2026-10-11: Forum `/forum` — teme, komentari, lajk/dislajk, samo prijavljeni pišu.
- 2026-10-11: Lokalni server :3005; `neon link` + `AUTH_SECRET`; početne rute 200.
- 2026-10-11: Pull `b17c68c` → `7d94ef7` (auth, CMS, galerija, cizmici.net).
- 2026-09-10: Galerija + gallery_images + sharp.
- 2026-09-10: cizmici.net; super-admin; session sync; Google; CMS.
