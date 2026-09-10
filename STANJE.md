# Stanje — Čizmići

Ažurirano: 2026-09-10 21:45 (Europe/Sarajevo)
Zadnji potez: Google OAuth (opciono preko GOOGLE_CLIENT_ID/SECRET).

Neslužbena digitalna lična karta **MZ Čizmići** (Grad Cazin, USK).

## Sada radi

- Auth: email+lozinka + **Google** (ako su env varovi postavljeni).
- JWT session; DrizzleAdapter samo kad je Google uključen (OAuth link).
- Kompletan admin CMS.
- Priče / prijave.

## Odluke

- Google korisnici = `member`. Admin ostaje credentials.
- `allowDangerousEmailAccountLinking` — isti email spaja Google + postojeći nalog.

## Ne graditi još

- Porodična stabla, email digest, oglasi/vaktija, dijaspora opt-in, žive ankete

## Sljedeće

- Postavi Google credentials u `.env.local` + Vercel.
- Commit + push.

## Tehničko

- Dev: `npm run dev` → :3005
- Redirect URI: `/api/auth/callback/google`

## Changelog

- 2026-09-10: Google OAuth provider + dugme na /prijava.
- 2026-09-10: Admin CMS za sve editorial tabele.
- 2026-09-10: Auth/session perf.
- 2026-09-07: Relacione editorial tabele.
- 2026-09-06: Auth + stories/issues.
