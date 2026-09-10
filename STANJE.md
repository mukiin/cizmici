# Stanje — Čizmići

Ažurirano: 2026-09-10 22:25 (Europe/Sarajevo)
Zadnji potez: Galerija (upload + WebP kompresija + autor na slici).

Neslužbena digitalna lična karta **MZ Čizmići** (Grad Cazin, USK).

## Sada radi

- Auth + Google; CMS; korisnici; super-admin.
- **Galerija** `/galerija` u headeru — samo prijavljeni dodaju, odmah javno, bez admin odobrenja.
- Slike: sharp → WebP max 1280px, spremljene u `gallery_images` (base64), servirane preko `/api/galerija/[id]`.
- Domen: cizmici.net

## Odluke

- Galerija model A (ravna lista, bez albuma).
- Autor se prikazuje uz svaku sliku; autor/admin može obrisati.

## Ne graditi još

- Porodična stabla, email digest, oglasi/vaktija, dijaspora opt-in, žive ankete
- Albumi/tagovi u galeriji (kasnije ako treba)

## Sljedeće

- Commit + push + deploy.
- Žive ankete.

## Tehničko

- `npm run db:apply-gallery` → migracija 0003
- Dev: :3005

## Changelog

- 2026-09-10: Galerija + gallery_images + sharp.
- 2026-09-10: cizmici.net; super-admin; session sync; Google; CMS.
