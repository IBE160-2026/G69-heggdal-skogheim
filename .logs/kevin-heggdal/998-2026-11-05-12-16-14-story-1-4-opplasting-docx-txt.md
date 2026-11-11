# Story 1.4: laste opp CV som DOCX eller TXT

## 2026-11-05 kl. 12:16 — Kevin Heggdal

### Oppgave
Starte story 1.4 uten å vente på at PR-en for 1.3 er gjennomgått, og bygge opplasting av CV som DOCX eller TXT etter BMAD. Kevin tar pause før den manuelle testen, så arbeidet skulle committes og pushes med 1.4 som `review`.

### Plan
- Branchen `story-1.4-laste-opp-cv-som-docx-eller-txt` er laget fra `story-1.3-cv-innlesing` (5bc13c0), fordi 1.4 bygger på `CvPanel` og maskeringen fra 1.3. PR-en for 1.4 må ikke merges før PR-en for 1.3 er merget. Etter merge rebases 1.4 på `main` (`git rebase --onto origin/main story-1.3-cv-innlesing` hvis 1.3 squashes).
- Spesifikasjon: [spec-1-4-laste-opp-cv-som-docx-eller-txt.md](../../_bmad-output/implementation-artifacts/spec-1-4-laste-opp-cv-som-docx-eller-txt.md). Kevin godkjente de fire beslutningene: `mammoth@1.13.0` med dynamisk import, filendelse og 5 MB, varsel om kort tekst også ved tom fil (ugyldig UTF-8 gir lesefeil), og egen melding for PDF til story 1.5.
- `bmad-build`: implementering i subagent, tre gjennomganger (blind, kanttilfeller, testhull), triage og rettinger.

### Resultat
- Committet som `cdba0fb` og pushet til `story-1.4-laste-opp-cv-som-docx-eller-txt`.
- Nytt: `src/lib/innlesing/txt.ts` og `docx.ts`, `src/lib/okt/cvFil.ts` (`avvisCvFil`, `lesCvFil`), `CV_FIL_MAKS`, `innhold.cvFil` og handlingene `cvFilLeses`, `cvFilLest`, `cvFilFeilet` og `cvFilByttet` i `lib/okt/tilstand.ts`. `CvPanel` har fått «Velg CV-fil», dra og slipp, meldinger, «Leser CV-en …», filnavn og *Bytt fil*. Nye testfiler: `innlesing.test.ts`, `cvFil.test.ts`, `cvfil-tilstand.test.ts` og `CvPanel-fil.test.tsx`.
- `mammoth` 1.13.0 er lagt til med eksakt versjon. Etter `next build` ligger den i en egen chunk på cirka 400 kB.
- Gjennomgangen ga 17 funn. Fem er rettet: spinner som hang, lesefeil som ble stående, gjentatt avvisning som ikke ble lest opp, fil sluppet utenfor feltet som åpnet seg i fanen, og en test som ikke prøvde telleren. To er utsatt i `deferred-work.md`, og ti er avvist. Alt står i spec-en.
- `npm run lint`, `typecheck`, `test` (299 av 299) og `build` består uten nøkkel.
- Spec-en er `done`, og story 1.4 står som `review` i `sprint-status.yaml` til den manuelle testen er gjort.
- Punktet fra story 1.3 om varsel ved 0 tegn fra fil er løst.

### Åpne punkter
- Manuell test av story 1.4 etter testplanen i chatten: knapp og dra og slipp med `cv.docx`, avviste filer, PDF, lesefeil, *Bytt fil*, tastatur, 320 px, 200 % zoom, nettverksfanen og DOCX etter `npm run build && npm start`. Sett så 1.4 til `done`.
- Lag PR for 1.4 først når PR-en for 1.3 er merget, og rebaser 1.4 på `main`.

## 2026-11-07 kl. 22:29 — Kevin Heggdal

### Oppgave
Fullføre den manuelle testen av story 1.4, sette storyen til `done` i `sprint-status.yaml` og gjøre klart for commit og push til `story-1.4-laste-opp-cv-som-docx-eller-txt`. Kevin godkjenner før noe committes eller pushes.

### Plan
- Testfilene til test 8–13 ble laget på nytt utenfor prosjektet, i scratchpad-mappen for økten: `CV.DOCX` (kopi av `par-1-butikk-bank/cv.docx`), `for-stor.txt` (5 MB + 1 byte), `cv.odt`, `odelagt.docx` (2000 tilfeldige byte), `windows-1252.txt`, `tom.txt` (0 byte) og `kort-med-fnr.txt`. For PDF ble `testdata/par-4-tokolonne-hotell/cv.pdf` brukt.
- Kevin kjørte testplanen fra økten 2026-11-05.

### Resultat
- Alle 16 manuelle tester er bestått, også DOCX-opplasting etter `npm run build && npm start`.
- `sprint-status.yaml`: `1-4-laste-opp-cv-som-docx-eller-txt` er endret fra `review` til `done`, og `last_updated` er satt til 11-07-2026 22:29. `epic-1` står fortsatt som `in-progress`, fordi 1.5 og 1.6 gjenstår.
- Ingen kodeendringer. Punktet om manuell test i `issues.md` er lukket.
- Etter Kevins godkjenning er endringen i sprint-status committet som `50be4f9` (BMAD: story 1.4 satt til done). Den og loggcommiten er pushet til `origin/story-1.4-laste-opp-cv-som-docx-eller-txt` på GitHub. Ingen PR er opprettet, og ingenting er merget.

### Åpne punkter
- Lag PR for 1.4 først når PR-en for 1.3 er merget, og rebaser 1.4 på `main` (står allerede i `issues.md`).
