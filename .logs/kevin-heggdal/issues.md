# Åpne punkter

## Åpne

- [ ] 2026-11-05 [story-1-3-cv-innlesing](999-2026-11-05-11-36-42-story-1-3-cv-innlesing.md) — Avgjør med gruppen om `masker` også skal fange «010190-12345» og flere mellomrom (endrer FR-6 og testene)
- [ ] 2026-11-05 [story-1-3-cv-innlesing](999-2026-11-05-11-36-42-story-1-3-cv-innlesing.md) — Avgjør om CV-feltet og annonsefeltet skal ha `spellCheck={false}`
- [ ] 2026-11-05 [story-1-3-cv-innlesing](999-2026-11-05-11-36-42-story-1-3-cv-innlesing.md) — Story 1.6 må sjekke maskering ved klikk på *Analyser* i Safari
- [ ] 2026-11-05 [story-1-4-opplasting-docx-txt](998-2026-11-05-12-16-14-story-1-4-opplasting-docx-txt.md) — Lag PR for 1.4 først når PR-en for 1.3 er merget, og rebaser 1.4 på `main`
- [ ] 2026-11-07 [story-1-5-pdf-to-kolonner](997-2026-11-07-23-19-12-story-1-5-pdf-to-kolonner.md) — Lag PR for 1.5 først når PR-ene for 1.3 og 1.4 er merget, og rebaser 1.5 på `main`
- [ ] 2026-11-07 [story-1-5-pdf-to-kolonner](997-2026-11-07-23-19-12-story-1-5-pdf-to-kolonner.md) — Test story 1.5 med NVDA og VoiceOver i Safari (også en sjekk av pdfjs 6 i Safari), og sett 1.5 til `done`, eller avgjør med gruppen om testene kan sløyfes
- [ ] 2026-11-07 [story-1-6-demovarsel](996-2026-11-07-23-50-49-story-1-6-demovarsel.md) — NVDA og VoiceOver i Safari for 1.6: bekreft at varselet uten `role="alert"` leses opp når det får fokus, og sjekk maskeringen ved klikk på *Analyser* i Safari
- [ ] 2026-11-07 [story-1-6-demovarsel](996-2026-11-07-23-50-49-story-1-6-demovarsel.md) — Story 2.1/2.2: *Analyser* på demoeksempelet gir ingen tilbakemelding før `kjoring` og *Prøv med eksempel* finnes
- [ ] 2026-11-07 [story-1-6-demovarsel](996-2026-11-07-23-50-49-story-1-6-demovarsel.md) — Lag PR for 1.6 først når PR-ene for 1.3, 1.4 og 1.5 er merget, og rebaser 1.6 på `main`

## Løst

- [x] 2026-11-07 [story-1-6-demovarsel](996-2026-11-07-23-50-49-story-1-6-demovarsel.md) — Rett fokustestene i `CvPanel-fil.test.tsx` som feiler av og til i hele testkjøringen (`waitFor`), så CI ikke feiler tilfeldig (løst 2026-11-08: `kontrollFeltMedFokus()` med `waitFor` i de sju testene, 10 av 10 fulle kjøringer bestått)
- [x] 2026-11-07 [story-1-6-demovarsel](996-2026-11-07-23-50-49-story-1-6-demovarsel.md) — Manuell test av story 1.6 etter `npm run build && npm start` uten nøkkel (varsel og fokus med egen CV, ingen varsel for demoeksempelet, varselet forsvinner ved endring, ingen request til `/api/generer`, tastatur, 320 px, 200 % zoom), og sett 1.6 til `done` (løst 2026-11-08 for de 7 testene Kevin kjørte; NVDA og VoiceOver står som eget åpent punkt)
- [x] 2026-11-07 [story-1-5-pdf-to-kolonner](997-2026-11-07-23-19-12-story-1-5-pdf-to-kolonner.md) — Manuell test av story 1.5 etter `npm run build && npm start` (PDF med knapp og dra og slipp, skannet, ødelagt og for stor PDF, tastatur, NVDA, VoiceOver i Safari, 320 px, 200 % zoom og nettverksfanen), og sett 1.5 til `done` (løst 2026-11-07 for de 11 testene Kevin kjørte; NVDA og VoiceOver står som eget åpent punkt)
- [x] 2026-11-07 [story-1-5-pdf-to-kolonner](997-2026-11-07-23-19-12-story-1-5-pdf-to-kolonner.md) — Stopp `next start -p 3157` (PID 21756 og 19288), som implementeringsagenten lot stå igjen (løst 2026-11-07: prosessen kjører ikke lenger)

- [x] 2026-11-05 [story-1-4-opplasting-docx-txt](998-2026-11-05-12-16-14-story-1-4-opplasting-docx-txt.md) — Manuell test av story 1.4 (også DOCX etter `npm run build && npm start`), og sett 1.4 til `done` (løst 2026-11-07: alle 16 tester bestått, 1.4 satt til `done`)
- [x] 2026-11-05 [story-1-3-cv-innlesing](999-2026-11-05-11-36-42-story-1-3-cv-innlesing.md) — Story 1.4 må vise varselet om kort tekst når en fil gir 0 tegn (løst 2026-11-05: `cvVurdering` varsler ved 0 tegn fra lest fil, se [story-1-4-opplasting-docx-txt](998-2026-11-05-12-16-14-story-1-4-opplasting-docx-txt.md))
