# Testpar 4, DOCX og treffprosent

## 2026-10-29 kl. 14:56 — Sondre Skogheim

### Oppgave
Fullføre testsettet slik at PRD-kravene kan testes:
- testpar 4 med en fiktiv CV i to kolonner som PDF, med annonse og fasit
- en DOCX-versjon av CV-en i par 1
- forventet treffprosent i hver `fasit.md`, regnet ut med metoden i PRD-en og vist
- oppdatere `testdata/README.md` og `issues.md`

Finalize skulle ikke kjøres ennå.

### Plan
- Skrev annonse, `cv.txt` (forventet uttrekk) og `fasit.md` for par 4 i samme format som de andre parene.
- Lagde `cv.pdf` med reportlab. Tekstbitene ligger med vilje rad for rad på tvers av kolonnene i filen, slik mange designverktøy lagrer dem, så PDF-en er en reell test av kolonnelesing.
- Lagde `cv.docx` for par 1 med python-docx.
- Kontrollerte filene: naivt uttrekk med pypdf, uttrekk kolonne for kolonne med pdfplumber, DOCX-uttrekk med mammoth, og en PNG-gjengivelse av PDF-en for å se på den.
- Regnet ut treffprosenten med matcheregelen i FR-12 og skrev utregningen inn i hver fasit.
- Byggeskriptene ligger i scratchpad og er ikke en del av repoet.
- Bygger på [997-2026-10-29-14-49-56-prd-utkast.md](997-2026-10-29-14-49-56-prd-utkast.md).

### Resultat
- **Ny mappe `testdata/par-4-tokolonne-hotell/`:** `annonse.txt`, `cv.txt`, `cv.pdf` og `fasit.md`. Paret er Mina Fiktivsen, reiselivsstudent som søker resepsjonsjobb på Hotell Testfjord. Fasiten har seks krav (Oppfylt ×3, Delvis ×2, Mangler ×1 for booking/Opera), forbudte påstander og en egen seksjon «Innlesing» med kriteriene for FR-2.
- **Verifisert:**
  - Det naive uttrekket fletter kolonnene: KONTAKT, så PROFIL, så E-post …
  - Uttrekket kolonne for kolonne er likt `cv.txt` når mellomrom ikke regnes med.
  - `par-1-butikk-bank/cv.docx` gir samme tekst som `cv.txt` når mellomrom ikke regnes med.
- **Treffprosent i fasit:** par 1 er 2/9 = 22 %, par 2 er 1/9 = 11 %, par 3 er 1/13 = 8 % og par 4 er 4/12 = 33 %. Hver fasit har en tabell med nøkkelordene og hvilket CV-ord som gir treff.
- **`testdata/README.md`:** nytt par, nye filer, treffprosent og kjente svakheter ved matcheregelen. «Gjenstår» er tømt.
- **`testdata/sjekkliste.md`:** robusthetspunktene viser nå til `cv.pdf` og `cv.docx`.
- **PRD:** FR-12 er presisert slik at bindestrek og annen tegnsetting byttes ut med mellomrom. Åpne spørsmål 3 og 4 i §10 er markert som løst. Memloggen har fem nye oppføringer.
- **Funn:** Treffprosentene er lave fordi regelen er streng. Siste ledd i sammensatte ord gir ikke treff, for eksempel *oppgjør* i *dagsoppgjør*. Småord i nøkkelord med flere ord gir falske delvise treff, for eksempel *av* som treffer *avisbud*.
- Testdata og PRD er ikke committet.

### Åpne punkter
- Vurder om matcheregelen i FR-12 skal justeres (siste ledd i sammensatte ord, småord) når antakelsene gjennomgås. Endres regelen, må treffprosentene i fasitene regnes ut på nytt.

## 2026-10-29 kl. 15:05 — Sondre Skogheim

### Oppgave
Registrere at Kevin har lest og godkjent alt: den reviderte briefen og PRD-utkastet med testdata.

### Plan
- Oppdaterte status for godkjenning i PRD, memlogg og issues.md.

### Resultat
- **PRD:** Banneret sier nå at innholdet er godkjent av Sondre og Kevin, men at Finalize gjenstår. Alle 14 inline-merkene `[ANTAKELSE]` er endret til `[bekreftet antakelse]`. §10 punkt 5 (godkjenning) er markert som løst, og §11 heter nå «Antakelser (bekreftet)» og sier at matcheregelen i FR-12 er godkjent uendret.
- **Memlogg:** ny oppføring om beslutningen (35 oppføringer).
- **issues.md:** lukket godkjenningen av briefen, bekreftelsen av antakelsene og vurderingen av matcheregelen.
- PRD og testdata er fortsatt ikke committet.

### Åpne punkter
Ingen nye. Finalize av PRD-en står fortsatt åpen i issues.md.
