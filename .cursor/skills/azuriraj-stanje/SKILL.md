---
name: azuriraj-stanje
description: Updates STANJE.md, the Čizmići project journal. Use at the start of a conversation (read it) and after any change to code, content, routes, product decisions, or the next-steps list so another computer and another chat can resume.
---

# Ažuriraj STANJE.md

Jedini dnevnik projekta. Ide u git. Chat Cursor **ne** putuje na drugi računar — ovo jeste.

## Kad

- Početak razgovora: pročitaj `STANJE.md`.
- Kraj poteza s izmjenom koda, JSON-a, stilova, ruta, hookova, pravila ili **nove odluke**: dopiši `STANJE.md` u istom potezu.
- Čisto pitanje bez odluke: ne diraj fajl.

## Kako

1. Pročitaj trenutni `STANJE.md`.
2. Ažuriraj zaglavlje (`Ažurirano`, `Zadnji potez`).
3. Ispravi liste **Sada radi / Odluke / Ne graditi / Sljedeće / Tehničko** da budu istina, ne arhiva.
4. Na vrh **Changelog** dodaj jednu stavku: datum + jedna rečenica.
5. Changelog drži na zadnjih 20 stavki.
6. Piši bosanski, kratko, konkretno. Ne izmišljaj brojeve ni izvore.

## Šablon zaglavlja

```markdown
# Stanje — Čizmići

Ažurirano: YYYY-MM-DD HH:mm (Europe/Sarajevo)
Zadnji potez: jedna rečenica šta je urađeno
```

## Ne

- Ne pravi drugi dnevnik (`NOTES.md`, `TODO.md`, canvas umjesto ovoga).
- Ne loguj sitne formatizacije.
- Ne briši odjeljak **Odluke** osim ako korisnik eksplicitno promijeni odluku — tada je precrtaj i zapiši novu.
