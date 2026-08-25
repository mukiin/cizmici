# Stanje — Čizmići

Ažurirano: 2026-08-26 01:10 (Europe/Sarajevo)
Zadnji potez: Prvi git commit i push na GitHub `mukiin/cizmici`.

Neslužbena digitalna lična karta **MZ Čizmići** (Grad Cazin, USK). Nije sajt MZ ni Grada. Cilj: mještani + dijaspora (DE/AT/SI/CH).

## Sada radi

- Next.js 15 App Router, sadržaj u `content/*.json`, `lib/data.ts` kao sloj (kasnije backend).
- Početna je jedna duga „lična karta“ kao mockup `mockups/cizmici.html` (ne teaser kartice).
- Historija: featured na početnoj, klik otvara `/historija/[slug]`.
- Infrastruktura: tabela 10 pravaca + čipovi; klik otvara **opis i činjenice**, **bez mape puta**.
- Opšta mapa naselja ostaje na početnoj (`/#mapa`) i `/mapa` (džamija, dom, igralište — okvirno).
- Forme `/prijava`, `/prijave`, `/ankete` samo vizualno (disabled).
- Live traka: Open-Meteo za Čizmiće, dani do Dana MZ (10. juli).
- Hydration upozorenje u Chromeu: ekstenzije (`bis_skin_checked`, ColorZilla). Skripta `public/strip-extension-attrs.js` skida atribute prije hidracije.

## Odluke (ne dirati bez pitanja)

- Vizualni jezik mockupa: pergament / šuma / rđa / zlato, Fraunces + Inter + IBM Plex Mono. Ne redizajnirati.
- Javni plan: 1 Lična karta → 2 Vijesti/priče → 3 Dijaspora → 4 Zajednica. **Nema porodičnih stabala** na javnom planu.
- Ne izmišljati brojeve. Izvor označiti (službeni akt / statistika / javni izvor).
- Faza 1 nav: hash linkovi (`/#historija` …) da skrolaju početnu. Dijaspora i Događaji ostaju prave rute.
- Infrastruktura: nema ucrtavanja 10 puteva dok nema GPS/elaborata; ostaje tekst iz evidencije MZ 2021.

## Ne graditi još

- Porodična stabla / matching
- Admin / red čekanja agenata
- Email digest HTML
- Oglasi, vaktija, dženaze, donacije
- CMS, auth, dijaspora mapa opt-in (objave), žive prijave/ankete

## Sljedeće

- Na drugom računaru: `git clone https://github.com/mukiin/cizmici.git`, otvori folder u Cursoru, novi Agent chat čita `STANJE.md`.
- Chat historija se ne prenosi. Dalje: `git pull` / `git push`.
- Kasnije (ne sad): CMS, auth, žive forme, tačne geometrije puteva.

## Tehničko

- Folder: `cizmici` na Desktopu. Dev server često **port 3005** (3000 je Grafana na ovom PC-u).
- Stack: Next 15.5, React 19, Leaflet samo za mapu naselja.
- Codacy MCP: poslije svakog edit-a `codacy_cli_analyze`; poslije npm install — trivy.
- Dnevnik agenta: pravilo `.cursor/rules/stanje.mdc` (always), skill `.cursor/skills/azuriraj-stanje/`, hookovi `sessionStart` + `stop` u `.cursor/hooks.json`.

## Changelog

- 2026-08-26: GitHub remote `https://github.com/mukiin/cizmici.git` — prvi commit na `main`.
- 2026-08-26: Dnevnik `STANJE.md` + agent (pravilo, skill, hookovi) da se stanje dopisuje poslije svake izmjene.
- 2026-08-26: Hydration mismatch — skripta skida atribute Chrome ekstenzija prije hidracije.
- 2026-08-26: Infrastruktura — uklonjene mape pravaca; ostali detaljni opisi i tabele činjenica.
- 2026-08-26: Historija klik otvara članak; infrastruktura klik otvara stranicu (prvo s mapom, zatim bez).
- 2026-08-25: Scaffold Next.js, početna kao mockup, Faza 1–2 javne stranice, forme disabled.
