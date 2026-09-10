# Stanje — Čizmići

Ažurirano: 2026-09-10 21:25 (Europe/Sarajevo)
Zadnji potez: Ubrzanje admin navigacije (keš, lagani middleware, static favicon).

Neslužbena digitalna lična karta **MZ Čizmići** (Grad Cazin, USK).

## Sada radi

- Auth JWT bez adaptera; DB/bcrypt samo u authorize.
- Admin: `getToken` middleware, prefetch nav, `loading.tsx`, admin liste keš 30s (`lib/admin-queries.ts`).
- Static `/favicon.svg` (uklonjen spor `app/icon.tsx` / next/og).
- Javne rute u `app/(site)/`; editorial cache 120s.

## Odluke

- Vizual mockupa ostaje. Drizzle + Neon. Priče: pending→odobrenje. Prijave: odmah javne.
- CMS = relacione tabele. Credentials + JWT.

## Ne graditi još

- Porodična stabla, email digest, oglasi/vaktija, dijaspora opt-in, žive ankete, Google OAuth

## Sljedeće

- Admin forme za roads / site / demografija.
- Commit + push + Vercel redeploy.

## Tehničko

- Dev: `npm run dev` → :3005 (prvi compile spor; zatim keš)
- `npm run build && npm start` osjetno brži od `dev`

## Changelog

- 2026-09-10: Admin nav perf; static favicon; admin-queries cache.
- 2026-09-10: Auth bez adaptera; (site) layout.
- 2026-09-07: Editorial tabele + cache.
- 2026-09-06: Auth + stories/issues.
