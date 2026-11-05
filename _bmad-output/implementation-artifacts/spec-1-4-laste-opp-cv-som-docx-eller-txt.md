---
title: 'Story 1.4: Laste opp CV som DOCX eller TXT'
type: 'feature'
created: '2026-11-05'
status: 'done'
baseline_commit: '5bc13c0e5a9e0db69ab2b1b5a0e551e64b53932d'
route: 'dispatch'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-1-context.md'
  - '{project-root}/_bmad-output/implementation-artifacts/spec-1-3-lime-inn-cv-tekst-og-kontrollere-den.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Brukeren må kopiere CV-teksten selv. Tilstand 1 har bare «Opplasting av CV-fil kommer snart.», og kontrollsteget har ingen vei tilbake.

**Approach:** Rene funksjoner i `lib/innlesing` fra `ArrayBuffer` til `string` for DOCX og TXT. Opplastingsfeltet erstatter linjen i tilstand 1, og innlest tekst går gjennom maskeringen fra 1.3 til kontrollsteget med filnavn og *Bytt fil*. Validering, lesing og filstatus går gjennom `lib/okt`.

**Beslutninger (Kevin, 2026-11-05):**
- `mammoth@1.13.0` eksakt, lastet med dynamisk `import()` bare ved DOCX.
- Endelsen avgjør formatet (`.docx`, `.txt`, uavhengig av store og små bokstaver). MIME-typen brukes ikke. `File.size` over 5 MB avvises før lesing. Meldingen: «Filen kan ikke brukes. Velg en DOCX- eller TXT-fil på maks 5 MB.»
- 1–299 tegn gir varselet fra 1.3. En fil som gir 0 tegn går til tilstand 2 med tomt felt, filnavn, *Bytt fil* og samme varsel. TXT som ikke er gyldig UTF-8, gir lesefeil.
- PDF leses ikke. `accept` beholder `.pdf`, og en PDF gir «PDF-filer kan ikke leses ennå. Velg en DOCX- eller TXT-fil, eller lim inn CV-teksten.» som formatfeil. Hjelpeteksten er «eller dra filen hit. DOCX eller TXT, maks 5 MB». Story 1.5 endrer begge.
- Spec-en er på norsk.

## Boundaries & Constraints

**Always:**
- Filen leses bare i nettleseren og sendes aldri til serveren (FR-2). Ingen nettleserlagring.
- Avvist fil: meldingen står under feltet med `role="alert"`, er knyttet til «Velg CV-fil» med `aria-describedby`, og fokus blir på knappen.
- Lesefeil: «Klarte ikke å lese filen. Lim inn CV-teksten i stedet.» i feltets `aria-describedby`, tilstand 2 med tomt felt, ingen krasj (FR-22).
- Innlest tekst maskeres med samme linje og live-melding som innliming (AD-13), kuttes aldri, og får grensetilstanden over 15 000 tegn.
- Fokus: lest eller feilet fil → CV-tekstfeltet. *Bytt fil* → «Velg CV-fil».
- «Velg CV-fil» er en `<button>` som åpner en skjult `<input type="file" accept=".pdf,.docx,.txt">`. Dra og slipp i tilstand 1 er et tillegg. *Lim inn CV-teksten* og *Bytt fil* er `variant="link"`, minst 44 × 44 px på mobil (UX-DR4).
- AD-2: komponentene importerer aldri `lib/innlesing` eller `lib/kjerne`.

**Never:** PDF-lesing, `pdfjs-dist`, OCR, endringer i `masker` eller grensene fra 1.3, `kjoring` eller `/api/generer`.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| DOCX | `par-1/cv.docx` | Lik `cv.txt` uten mellomrom og linjeskift | N/A |
| TXT | hver `cv.txt` | Lik fila uten mellomrom og linjeskift | N/A |
| Fødselsnummer | TXT med «01019012345» | Maskert, linje og live-melding | N/A |
| Store bokstaver | `CV.DOCX` | Godtas | N/A |
| For stor | 5 MB + 1 byte | Ikke lest | Formatmeldingen |
| Feil format | `.odt`, `.doc`, uten endelse | Ikke lest | Formatmeldingen |
| PDF | `cv.pdf` | Ikke lest | PDF-meldingen |
| Ødelagt | tilfeldige byte som `.docx` | Tilstand 2, tomt felt | Lesefeil |
| Ugyldig UTF-8 | TXT i Windows-1252 med æøå | Tilstand 2, tomt felt | Lesefeil |
| Tom fil | 0 byte, eller bare mellomrom | Tilstand 2, tomt felt, varsel om kort tekst | N/A |
| *Bytt fil* | kontrollsteget med fil | Tilstand 1, tekst og filnavn tømt | N/A |

</frozen-after-approval>

## Code Map

- `src/lib/innlesing/txt.ts`, `docx.ts` (nye) -- `lesTxt(data: ArrayBuffer): string` med `TextDecoder("utf-8", { fatal: true })`, og `lesDocx(data: ArrayBuffer): Promise<string>` med `extractRawText`. Kaster ved feil. Fjern `.gitkeep`.
- `src/lib/kontrakt/grenser.ts` -- legg til `CV_FIL_MAKS = 5 * 1024 * 1024`.
- `src/lib/okt/cvFil.ts` (ny) -- `lesCvFil(fil: File)` gir `{ type: "lest", cvTekst } | { type: "avvist", melding } | { type: "feilet" }` og kaster aldri. Den eneste asynkrone delen.
- `src/lib/okt/tilstand.ts` -- `innhold.cvFil: { navn; tilstand: "leser" | "lest" | "feilet" } | null`. Handlinger `cvFilLeses`, `cvFilLest` (via `maskerCv`), `cvFilFeilet` og `cvFilByttet`, som tømmer tekst. Gjenbruk `medCvTekst` og `kunngjor`. «Leser CV-en …» meldes i live-regionen. Varselet gjelder også 0 tegn når `cvFil.tilstand === "lest"`.
- `src/components/CvPanel.tsx` -- tilstand 1 med knapp, input, dra og slipp, hjelpetekst og avvisningsmelding (lokal tilstand). Tilstand 2 med filnavn og *Bytt fil*. `kontroll` er også sann når `cvFil` er `lest` eller `feilet`. *Bytt fil* nullstiller `valgtInnliming`. Svar som kommer etter *Bytt fil* eller en ny fil, ignoreres. Behold innliming, blur og `ANALYSER_ID`.
- Eksisterende tester med hele tilstanden (`tilstand.test.ts`, `cv-tilstand.test.ts`, `AnalyserKnapp.test.tsx`) får `cvFil: null`. Testen av den gamle linjen i `CvPanel.test.tsx` oppdateres. Ellers endres ingen forventninger.
- Ikke rør: `masker.ts`, `Annonsepanel.tsx`, `ui/*`, `eslint.config.mjs`.

## Tasks & Acceptance

**Execution:**
- [x] `package.json`, `package-lock.json` -- `npm install mammoth@1.13.0 --save-exact` -- AD-7.
- [x] `src/lib/innlesing/*` + tester -- DOCX og TXT mot `testdata` i Node, ødelagt DOCX og ugyldig UTF-8. Testnavn starter med `FR-2:` -- FR-2, NFR-6.
- [x] `src/lib/kontrakt/grenser.ts`, `src/lib/okt/cvFil.ts` + test -- størrelse, endelser, PDF og feil med `File`-objekter -- FR-1, FR-22.
- [x] `src/lib/okt/tilstand.ts` + test -- `cvFil` og handlingene, med maskering, grensemelding og varsel ved 0 tegn -- AD-6, FR-3, FR-6.
- [x] `src/components/CvPanel.tsx` + test (jsdom) -- opplasting, dra og slipp, meldinger, filnavn, *Bytt fil* og fokus -- UX-DR4, UX-DR5, UX-DR24.
- [x] `src/lint-grenser.test.ts` -- `@/lib/innlesing/docx` blokkeres i `src/components/X.tsx`. Eksisterende tester får `cvFil: null` -- AD-2.

**Acceptance Criteria:**
- Given tilstand 1, when brukeren velger `cv.docx` med knappen eller dra og slipp, then vises «Leser CV-en …», så kontrollsteget med teksten, «cv.docx» og *Bytt fil*, og fokus i feltet.
- Given en avvist fil, when meldingen vises, then har den `role="alert"`, er i knappens `aria-describedby`, og fokus er på knappen.
- Given en fil som ikke kan leses, when lesingen feiler, then er feltet tomt og har fokus, med meldingen i `aria-describedby`, og appen krasjer ikke.
- Given kontrollsteget med en fil, when brukeren trykker *Bytt fil*, then vises tilstand 1 uten tekst og filnavn, og fokus er på «Velg CV-fil».
- Given lesing av en fil, when nettverksfanen ses, then sendes ingen forespørsel med filinnholdet.

## Implementation Notes

- `lesDocx` sender `{ arrayBuffer, buffer }` med samme `ArrayBuffer` til `extractRawText`. Nettleserbygget av mammoth leser `arrayBuffer` og Node-bygget `buffer`, og begge gir verdien til JSZip. Node-testen kjører dermed samme funksjon. `mammoth.browser.js` er også sjekket med `arrayBuffer` mot `par-1/cv.docx`. Etter `next build` ligger mammoth i en egen chunk på cirka 400 kB, ikke i sidechunken.
- `cvFil.ts` har også den synkrone `avvisCvFil(fil)`, som `lesCvFil` bruker. Panelet kaller den først, slik at en avvist fil aldri gir «Leser CV-en …».
- Reduceren ignorerer `cvFilLest` og `cvFilFeilet` når ingen fil leses (etter *Bytt fil*). Panelet har i tillegg en teller, så svaret fra en eldre fil ignoreres når en ny fil leses.
- *Lim inn CV-teksten* mens en fil leses, slipper filen (`cvFilByttet`), så et sent svar ikke overskriver feltet.
- `cvVurdering(cvTekst, cvFil?)` har fått en valgfri parameter for varselet ved 0 tegn.
- Lesefeilen vises som tekst over feltet med id `cv-lesefeil`, og den står så lenge filstatusen er `feilet`, også etter at brukeren har limt inn tekst.
- `Annonsepanel.test.tsx` fikk også `cvFil: null` (bare testfila, ikke komponenten), fordi typesjekken ellers feiler. Nye tester ligger i `src/lib/innlesing/innlesing.test.ts`, `src/lib/okt/cvFil.test.ts`, `src/lib/okt/cvfil-tilstand.test.ts` og `src/components/CvPanel-fil.test.tsx`.
- Etter gjennomgangen: lesefeilen vises nå bare så lenge filstatusen er `feilet` og feltet er tomt. En avvist fil mens en annen leses, sender `cvFilByttet`. Avvisningen lagres som `{ tekst, nr }` og monteres med `key={nr}`. `window` har lyttere for `dragover` og `drop` som bare stopper filer. 299 tester består.

## Spec Change Log

- Ingen loopback. Gjennomgangen fant ingen `intent_gap` eller `bad_spec`. Alle rettingene under er patcher etter gjennomgangen.

## Review Triage Log

| Finding | Verdict | Evidence | Route |
|---------|---------|----------|-------|
| Rejected file during a read leaves `cvFil` at `leser`, spinner stuck (blind, edge, gap) | medium | `velgFil` bumped the counter and returned without a dispatch, so the late answer was dropped and the state never left `leser` | patch, `cvFilByttet` in the rejection branch + test |
| Read-error message stays after the user pastes text (blind) | medium | Shown only from `cvFil.tilstand === "feilet"`; nothing changes that on `cvEndret` or `cvLimtInn` | patch, also require an empty field + test |
| Same rejection twice is not announced again (blind) | medium | Identical string, so the `role="alert"` node is unchanged and screen readers say nothing | patch, `{ tekst, nr }` with `key={nr}` + test |
| File dropped outside the zone opens in the tab and loses the session (blind, edge) | medium | Only the zone called `preventDefault`; the browser default opens the file and discards annonse and CV text | patch, `window` listeners that stop only `Files` + test |
| Stale-answer test never exercises the counter (gap) | medium | Old answer released after the new file was `lest`, so the reducer guard alone passed it | patch, test with two held-back reads |
| Browser path (`arrayBuffer`) of `lesDocx` is never run by tests (gap) | medium | Vitest uses mammoth's Node build, which reads `buffer`; checked by hand only | defer |
| Lazy loading of mammoth has no automated check (gap) | low | A static import passes every test; needs build output | defer |
| Warning on a field emptied by hand after a good read (blind, edge) | low | Real, but rare, and the fix needs extra state to tell file text from edits | rejected |
| Live region keeps «Leser CV-en …» after the read (edge) | low | Focus moves to the field, which reads the label and `aria-describedby`; same verdict as the old-message row in 1.3 | rejected |
| Dead `avvist` branch in the panel (blind) | low | `lesCvFil` rechecks defensively; harmless, and removing it changes the return type | rejected |
| Several files, or a drop with no files (edge) | low | Only the first file is used; a drop without files does nothing, which is harmless | rejected |
| DOCX zip bomb freezes the tab (blind, edge) | low | The user's own file in the user's own tab, no server; a cap needs JSZip internals or a Worker | rejected |
| Windows-1252 TXT always fails (blind) | false | Frozen decision: invalid UTF-8 gives a read error | rejected |
| Cast in `docx.ts`, mammoth `messages` dropped (blind) | low | The cast is documented and covered by the Node test; the messages are warnings only | rejected |
| Import-boundary test covers only `innlesing/docx` (blind) | low | The ESLint regex covers the whole folder; one probe matches the pattern used in 1.3 | rejected |
| Patch leaves out spec, sprint status and lockfile; mammoth pinned exactly (blind) | false | Excluded from the review diff on purpose; the exact pin is a frozen decision | rejected |
| Missing UI tests (drag-leave), cwd-relative `testdata` paths, network test via URL (blind) | low | `npm test` always runs from the root; nothing builds a URL from file content | rejected |

## Design Notes

Valideringen ligger i `lib/okt` fordi UI-et ikke kan importere `lib/innlesing` (AD-2), og `File` hører ikke hjemme i de rene funksjonene. mammoth tar `{ arrayBuffer }` i nettleseren. Sjekk etter installasjon hva Node-versjonen godtar, men testen må kjøre den samme `lesDocx` med `ArrayBuffer` inn.

## Verification

**Commands:**
- `npm run lint && npm run typecheck && npm test && npm run build` -- alt består uten nøkkel.

**Manual checks:**
- `npm run dev`: `par-1/cv.docx` med knapp og dra og slipp, en fil over 5 MB, `.odt`, PDF, omdøpt `.docx` og *Bytt fil*, med tastatur, i 320 px og med 200 % zoom. Ingen fil i nettverksfanen.
