---
title: 'Story 1.6: Analyser med egen CV i demomodus'
type: 'feature'
created: '2026-11-07'
status: 'done'
baseline_commit: '015dd3f46d6d21e25ef3729370035d78b6b061fd'
route: 'dispatch'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-1-context.md'
  - '{project-root}/_bmad-output/implementation-artifacts/spec-1-5-laste-opp-cv-som-pdf-ogsaa-med-to-kolonner.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** I demomodus gjør *Analyser* ingenting annet enn å maskere. En sensor uten API-nøkkel som prøver sin egen CV, får ingen forklaring (FR-26).

**Approach:** `DEMO_CV` og `DEMO_ANNONSE` i `lib/kontrakt`, importert statisk fra `testdata/par-1-butikk-bank`. `normaliser` og `erDemoeksempel` i `lib/kjerne`. *Analyser* avgjør i `lib/okt` om teksten er demoeksempelet. I demomodus med egen CV vises en `Alert` over *Analyser*, fokus flyttes dit, og ingenting sendes.

**Beslutninger (Kevin, 2026-11-07):**
- Spec-en er på norsk, som for 1.4 og 1.5, og beholdes hel selv om den er over 1 600 tokens.
- Varselet har ingen knapp i 1.6. Story 2.2 legger til *Prøv med eksempel* når demoeksempelet og resultatet finnes (UX-DR22).
- `kjoring` innføres ikke i 1.6. 1.6 lager bare varselet og `demoVarsel`, og `kjoring { id, cvTekst, annonse, erEksempel }` kommer i 2.1, der den brukes (AD-6).

## Boundaries & Constraints

**Always:**
- Varselteksten er nøyaktig «Full analyse av din egen CV krever en API-nøkkel. Prøv eksempelet for å se hvordan resultatet ser ut.» (FR-26, UX-DR26).
- `erDemoeksempel(cvTekst, annonse)` er sann bare når både CV-teksten og annonsen er lik demoeksempelet etter `normaliser(masker(x))` (AD-13). `normaliser` ser bort fra store og små bokstaver, mellomrom og linjeskift (FR-9).
- *Analyser* som maskerer et nytt fødselsnummer, gjør bare det, og brukeren må trykke igjen (epic 1). Et deaktivert *Analyser* gjør ingenting.
- Varselet og avgjørelsen ligger i `lib/okt`. Komponentene importerer aldri `lib/kjerne` (AD-2).
- Ingen request til `/api/generer` fra *Analyser* i denne storyen. Ingenting lagres i nettleseren.
- Demotekstene leses fra `testdata/par-1-butikk-bank/cv.txt` og `annonse.txt` med en statisk import, aldri kopiert inn i koden.

**Never:** endringer i `masker`, innlesingen eller grensene, kall til språkmodellen, resultatsiden, demobanneret eller `/api/status`.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Egen CV i demo | `modus: demo`, egen CV, gyldig annonse, avkrysning | `Alert` med teksten over *Analyser*, fokus på varselet, ingen fetch | N/A |
| Demoeksempelet i demo | `DEMO_CV` og `DEMO_ANNONSE` (også fra `cv.docx`, med CRLF eller ekstra mellomrom) | Ingen varsel | N/A |
| Ett ord endret | `DEMO_CV` med ett ord byttet | `erDemoeksempel` usann, varsel | N/A |
| Ekte modus | `modus: ekte`, egen CV | Ingen varsel | N/A |
| Nytt fødselsnummer | Feltet har et fødselsnummer som ikke er maskert | Første trykk maskerer bare, andre trykk gir varselet | N/A |
| Deaktivert | Årsaker under *Analyser* | Ingen varsel | N/A |
| Trykk på nytt | Varselet vises, brukeren trykker *Analyser* igjen | Varselet står, fokus flyttes dit igjen | N/A |

</frozen-after-approval>

## Code Map

- `next.config.ts` -- legg til `'*.txt': { condition: { query: '?raw' }, type: 'text' }` i `turbopack.rules`, ved siden av `*.css`-regelen (Next 16 dokumentasjon `08-turbopack.md`, «Query strings»). Vitest støtter `?raw` selv.
- `src/raw.d.ts` (ny) -- `declare module "*.txt?raw" { const tekst: string; export default tekst; }`.
- `src/lib/kontrakt/demo.ts` (ny) -- `DEMO_CV` og `DEMO_ANNONSE` fra `../../../testdata/par-1-butikk-bank/cv.txt?raw` og `annonse.txt?raw`. Lint-regelen for `kontrakt` tillater en relativ import fra `testdata`. `testdata/**` sjekkes ut med LF (`.gitattributes`).
- `src/lib/kjerne/demo.ts` (ny) + `demo.test.ts` -- `normaliser(tekst)`: `normalize("NFC")`, små bokstaver, alle mellomrom og linjeskift fjernet. `erDemoeksempel(cvTekst, annonse)`. Testnavn `FR-26:` og `FR-9:`.
- `src/lib/okt/tilstand.ts:158` -- `analyserTrykket` maskerer som før (`maskerMedAntall`). Med nye fødselsnumre eller årsaker skjer ingenting mer. Ellers: `modus !== "ekte"` og `!erDemoeksempel` gir `innhold.demoVarsel = { nr }` (nr øker for hvert trykk, så fokus flyttes igjen). `demoVarsel` blir `null` ved `cvEndret`, `cvLimtInn`, `annonseEndret` og filhandlingene. `modus: null` regnes som demo. Eksisterende tester med hele tilstanden får det nye feltet.
- `src/components/AnalyserKnapp.tsx` -- `Alert` (`@/components/ui/alert`) rett over knappen når `demoVarsel` finnes, med `tabIndex={-1}` og fokus i en effekt per `nr`. Knappen og årsakslisten er som før.
- `src/components/AnalyserKnapp.test.tsx` -- varsel og fokus i demo, ingen `fetch` til `/api/generer`, demoeksempelet uten varsel, ekte modus uten varsel, nytt fødselsnummer først.
- Ikke rør: `masker.ts`, `lib/innlesing`, `CvPanel.tsx`, `DemoBanner.tsx`, `ui/*`.

## Tasks & Acceptance

**Execution:**
- [x] `next.config.ts`, `src/raw.d.ts`, `src/lib/kontrakt/demo.ts` -- statisk import av demotekstene -- `DEMO_CV`, `DEMO_ANNONSE`.
- [x] `src/lib/kjerne/demo.ts` + test -- `normaliser`, `erDemoeksempel` -- FR-9, FR-26, AD-13.
- [x] `src/lib/okt/tilstand.ts` + tester -- avgjørelsen ved *Analyser* og `demoVarsel` -- AD-6, FR-26.
- [x] `src/components/AnalyserKnapp.tsx` + test -- varsel og fokus -- UX-DR22, UX-DR24.
- [x] Etter `next build`: demotekstene finnes i bygget, og ingen chunk gjør kall til `/api/generer`.

**Acceptance Criteria:**
- Given `lib/kontrakt`, when demoeksempelet trengs, then er `DEMO_CV` og `DEMO_ANNONSE` lik `cv.txt` og `annonse.txt`, og de er importert statisk.
- Given demomodus, egen CV-tekst, en gyldig annonse og avkrysning, when brukeren trykker *Analyser*, then blir brukeren på forberedelsessiden, varselet står over *Analyser*, fokus er på varselet, og ingen request går til `/api/generer`.
- Given varselet, when brukeren endrer CV-teksten eller annonsen, then forsvinner varselet.

## Implementation Notes

- `analyserTrykket` er skilt fra `cvForlatt` og går via `analyser()` i `tilstand.ts`. Den bruker `maskerMedAntall` for å se om et nytt fødselsnummer ble maskert, og `arsakerTilAnalyse` på den maskerte tilstanden. `demoVarsel.nr` regnes fra forrige varsel, så det starter på 1 igjen etter at varselet er fjernet. Komponenten monteres da på nytt, og effekten flytter fokus uansett.
- `cvForlatt` (også når *Analyser* mister fokus) fjerner ikke varselet, fordi teksten ikke endres uten et nytt fødselsnummer, og det kan bare komme med `cvEndret`, som fjerner det.
- Varselet er `Alert` med `role={undefined}`, `tabIndex={-1}`, `Info`-ikon og id `demo-varsel`. Fokus flyttes dit, så `role="alert"` er fjernet for å unngå at skjermleseren leser det to ganger (samme mønster som varselet om kort tekst i `CvPanel`).
- `cv.docx` fra par 1 er testet gjennom `lesDocx` i `src/lib/okt/demovarsel-tilstand.test.ts`, fordi `lib/kjerne` ikke kan importere `lib/innlesing`.
- `AnalyserKnapp.test.tsx` kjører nå i jsdom. De nye testene henter modus fra en falsk `/api/status` og sjekker at alle `fetch`-kall går dit.
- Etter `next build`: CV-en og annonsen fra par 1 ligger som strenger i én klientchunk, varselteksten i en annen, og ingen fil under `.next/static` eller `.next/server` inneholder `api/generer`. 377 tester består.

- Etter gjennomgangen:
  - `analyser()` maskerer én gang med `maskerCv`, og et nytt fødselsnummer gjenkjennes ved at teksten endres. Det erstatter `maskerMedAntall` i første punkt.
  - `statusHentet` fjerner `demoVarsel` når modus er `ekte`.
  - Testene sjekker at varselet ikke har `role`, og at ekte modus ikke sender noe.
  - Den meningsløse maskeringstesten er erstattet med `erDemoeksempel(masker(DEMO_CV), masker(DEMO_ANNONSE))`.
  - 378 tester består.
- Sjekket etter `next build`: hele `cv.txt` (1 065 tegn) og `annonse.txt` (695 tegn) ligger uendret som strenger i klient-chunken `0-nqo8nke8w51.js`, så `?raw` virker i produksjon. Ingen fil under `.next/static` eller `.next/server` nevner `api/generer`.
- Manuell test (Kevin, 2026-11-08): alle 7 tester er bestått, etter `npm run build && npm start` uten nøkkel. De dekker varselet med fokus for egen CV, nytt trykk, at varselet forsvinner ved endring, demoeksempelet uten varsel, nettverksfanen uten request til `/api/generer`, tastatur, 320 px og 200 % zoom.
  - Det første forsøket med demoeksempelet ga varselet. Årsaken var en ufullstendig annonse: 657 tegn i stedet for 694, med én punktlinje mindre. Med hele `annonse.txt` fra `par-1-butikk-bank` virket det som forventet. Det viser at sammenligningen er streng, slik FR-26 krever.
  - NVDA og VoiceOver i Safari gjenstår, så 1.6 står som `review`.
- Fokustestene fra 1.4 (utsatt i triagen, Kevin godkjente rettingen 2026-11-08): sju tester i `CvPanel-fil.test.tsx` venter nå på fokus med `kontrollFeltMedFokus()` og `waitFor`. Bare testen er endret, ikke `CvPanel.tsx`. 10 av 10 fulle kjøringer ga 378 av 378 bestått, og lint og typesjekk består.

## Spec Change Log

## Review Triage Log

| Finding | Verdict | Evidence | Route |
|---------|---------|----------|-------|
| A demo warning shown while `modus` is `null` stays after `statusHentet` gives `ekte` (blind, edge) | low | Real: `statusHentet` (`tilstand.ts:160-169`) never touches `demoVarsel`. Rare, because the user must fill in both fields before `/api/status` answers. The fix is one line | patch: `statusHentet` clears `demoVarsel` when the mode is `ekte`, plus a test |
| No test checks that the warning has no `role="alert"` (gap, blind) | low | Pre-verified: `role={undefined}` works only because `Alert` spreads props after its own `role`. Nothing fails if that changes, and screen readers would read the warning twice | patch: assert that `role` is missing in the FR-26 component test |
| The «sammenligningen gjøres etter masker» test proves nothing (blind) | low | Real: both inputs differ from the demo CV, so both give `false` with or without masking | patch: replace it with a test that fails without masking, or remove it |
| `analyser()` masks the same text twice (blind) | low | Real: `maskerMedAntall` runs only to get the count, then `maskerCv` masks again. The two can never disagree today, but the duplicate is a trap | patch: use one masking call |
| The ekte-mode component test does not check that no request is sent (blind) | low | Real: only the demo tests call the fetch check. The fix is one line | patch: call the same fetch check in the ekte-mode test |
| The Turbopack `?raw` rule is never checked by a test, and Vitest uses Vite's own `?raw` (gap, blind) | medium | Pre-verified: changing the rule keeps every test and the build green, and then the demo example would always get the warning. Checked by hand in this build: `cv.txt` and `annonse.txt` are in `.next/static/chunks/0h8vimhggd7_z.js` | defer: a check after the build that looks for a line from `cv.txt` in the client chunks |
| Pressing *Analyser* while a file is read judges old text (edge) | false | A file can only be chosen in state 1, where the CV text is empty, so *Analyser* is disabled (`CvPanel.tsx:97-110`) | rejected |
| `normaliser` keeps soft hyphens, zero-width characters and BOM (blind, edge) | low | `cv.docx` from par 1 is recognised (tested). FR-9 names spaces and line breaks, and `normaliser` is shared with the evidence check in Epic 2, so widening it changes FR-9 | rejected |
| No PDF of the demo CV is tested (blind) | low | `testdata/par-1-butikk-bank` has no `cv.pdf`, and the demo example is promised for `cv.txt` and `cv.docx` | rejected |
| Fragile relative path `../../../testdata` in `kontrakt/demo.ts` (blind) | low | A moved folder fails loudly at build and in tests, and does not fail silently | rejected |
| `next build --webpack` has no rule for `?raw` (blind) | false | The project builds with Turbopack only (`next.config.ts`, `npm run build`), and webpack is not used | rejected |
| *Analyser* on the demo example gives no feedback until 2.1 and 2.2 (blind) | low | Real and accepted in the spec: `kjoring` and *Prøv med eksempel* come in 2.1 and 2.2. Recorded as an open point for 2.1 in the session log | rejected |
| Focus tests in `CvPanel-fil.test.tsx` fail now and then in the full run (found by Claude in step 3) | medium | Real: 2 of 6 full runs failed on a focus check. One time it was «0 byte», the other «lesefeil i nettleseren». Each passed 5 of 5 alone. `findByLabelText` resolves before the focus effect has run. The tests come from 1.4 and are not changed here | defer: pre-existing, fix by waiting for focus with `waitFor` |

## Design Notes

`erDemoeksempel` brukes også av serveren i Epic 2 (AD-3), så den skal være ren og ikke avhenge av `okt`. Den sammenligner med `normaliser(masker(DEMO_CV))` og `normaliser(masker(DEMO_ANNONSE))`. `masker` er idempotent, så en maskert tekst gir samme resultat. `cv.docx` fra par 1 gir samme tekst som `cv.txt` uten mellomrom (story 1.4), så den regnes som demoeksempelet.

Varselet forsvinner når brukeren endrer teksten, fordi det da ikke lenger gjelder det som står i feltene. Et nytt trykk viser det igjen.

## Verification

**Commands:**
- `npm run lint && npm run typecheck && npm test && npm run build` -- alt består uten nøkkel.

**Manual checks:**
- `npm run build && npm start` uten nøkkel: egen CV gir varselet og fokus, `par-1/cv.docx` og annonsen gir ikke varsel, nettverksfanen viser ingen request til `/api/generer`.
- Tastatur alene, 320 px og 200 % zoom. NVDA og VoiceOver i Safari, der Safari også sjekker maskeringen ved klikk på *Analyser* (åpent punkt fra 1.3).
