---
title: 'Story 1.5: Laste opp CV som PDF, også med to kolonner'
type: 'feature'
created: '2026-11-07'
status: 'done'
baseline_commit: 'ffe149f26ff1f0dc8f6aa07660823811dabb927a'
route: 'dispatch'
review_loop_iteration: 1
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-1-context.md'
  - '{project-root}/_bmad-output/implementation-artifacts/spec-1-4-laste-opp-cv-som-docx-eller-txt.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** En PDF avvises i dag med «PDF-filer kan ikke leses ennå». Mange CV-er er PDF-er med to kolonner, og hvis tekstbitene leses i den rekkefølgen de ligger i fila, blir kolonnene flettet sammen (testpar 4).

**Approach:** `lesPdf` i `lib/innlesing` går fra `ArrayBuffer` til `string`, med `getDocument` injisert og kolonneregelen fra addendum B. `lib/okt` laster pdfjs-dist dynamisk bare for PDF og setter `workerSrc` der. PDF går gjennom samme opplastingsfelt, filfeil, maskering og kontrollsteg som i 1.4.

**Beslutninger (Kevin, 2026-11-07):**
- Formatmeldingen er «Filen kan ikke brukes. Velg en PDF-, DOCX- eller TXT-fil på maks 5 MB.» Hjelpeteksten er «eller dra filen hit. PDF, DOCX eller TXT, maks 5 MB». PDF-meldingen fra 1.4 fjernes.
- Spec-en er på norsk.
- Det utsatte punktet fra 1.4 om nettleserbygget til mammoth holdes utenfor og står til 5.1.
- Spec-en beholdes hel, selv om den er over 1 600 tokens.
- `pdfjs-dist@6.5.438` med eksakt versjon (AD-7), lastet med dynamisk `import()` bare ved PDF.
- Tekst fra PDF som gir 0–299 tegn (skannet PDF), gir varselet om kort tekst fra 1.3 og 1.4. Ingen OCR.
- En PDF som ikke kan åpnes (ødelagt eller passordbeskyttet), gir samme lesefeil som i 1.4.
- Etter gjennomgangen av spec-en: alle fire manglene og fem mindre punktene er lagt inn (testen for blandede linjer, PDF uten tekstlag bygget i testen, mellomrom ut fra avstand, tilgjengelighetstest, flere sider, sjekk etter bygget, panel-test med mock, ingen nettverksadresser i pdfjs, og `FR-3:` i testnavn).
- Etter kodegjennomgangen (runde 1): en topptekst eller bunntekst over hele bredden skal ikke gjøre at siden leses som én kolonne. Linjer øverst eller nederst som krysser grensen, skrives først eller sist, og kolonnene under leses hver for seg.

## Boundaries & Constraints

**Always:**
- Filen leses bare i nettleseren og sendes aldri til serveren (FR-2). Ingen nettleserlagring. `getDocument` kalles uten `cMapUrl`, `standardFontDataUrl`, `wasmUrl` og `iccUrl`, så pdfjs henter ingenting fra nettet, og med `isEvalSupported: false`.
- Kolonnegrensen finnes ut fra x-posisjon og bredde for elementer som ikke bare er mellomrom. Finnes ingen grense med alle linjene, prøves den igjen uten de øverste og nederste linjene, færrest mulig og høyst en fjerdedel av linjene på siden.
- Én kolonne: hele siden sorteres etter y (ovenfra) og så x. To kolonner: først toppteksten, så hele venstre kolonne, så hele høyre og til slutt bunnteksten, og hver del sorteres på samme måte. Sider skilles med en tom linje.
- Tekstbiter på samme linje skjøtes med mellomrom bare når avstanden mellom dem er større enn 0,15 × tekststørrelsen. Ellers skjøtes de uten mellomrom, så ord som er delt i flere biter, ikke blir delt.
- `workerSrc` settes med `new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url)` i `lib/okt`, og PDF-opplasting må bevises etter `next build && next start`.
- Node-testene bruker `pdfjs-dist/legacy/build/pdf.mjs` med den samme `lesPdf`.
- AD-2: komponentene importerer aldri `lib/innlesing` eller pdfjs-dist.
- Testdata med CV-innhold ligger bare under `testdata/`. PDF-en uten tekstlag bygges i testen og har ikke CV-innhold.

**Never:** OCR, endringer i `masker`, grensene eller `lesDocx`/`lesTxt`, endringer i `kjoring` eller `/api/generer`, kopiering av workeren til `public/` uten at det er avtalt, CDN-adresser til pdfjs.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| To kolonner | `par-4/cv.pdf` | Alle linjene i `cv.txt` finnes (uten mellomrom). Hver linje i uttrekket som ikke er tom, er uten mellomrom en del av én enkelt linje i `cv.txt`. «SPRÅK» og «KURS» før «PROFIL» | N/A |
| Én kolonne | Syntetiske elementer uten grense, også biter i omvendt x-rekkefølge på samme linje | Sortert etter y og så x, leserekkefølgen bevart | N/A |
| Topptekst og bunntekst | Sentrert navn og kontaktlinje over hele bredden, to kolonner under, og en bunnlinje over hele bredden | Toppteksten først, hele venstre kolonne, hele høyre, bunnteksten sist. Ingen linje blander kolonnene | N/A |
| Ord i flere biter | «Reiselivs» + «student» uten avstand, «2024–nå» + «Servitør» med avstand | «Reiselivsstudent» og «2024–nå Servitør» | N/A |
| Flere sider | Falsk `getDocument` med to sider | Side 1 før side 2, med en tom linje mellom | N/A |
| Store bokstaver | `CV.PDF` | Godtas | N/A |
| Skannet | Gyldig PDF med én tom side uten tekstlag, bygget i testen | `""`, så tilstand 2 med tomt felt og varsel om kort tekst | N/A |
| Ødelagt | tilfeldige byte som `.pdf` | Tilstand 2, tomt felt | Lesefeil |
| For stor | PDF på 5 MB + 1 byte | Ikke lest | Formatmeldingen |

</frozen-after-approval>

## Code Map

- `src/lib/innlesing/pdf.ts` (ny) -- `lesPdf(data, getDocument): Promise<string>` og en ren `ordneSide(elementer, sidebredde): string` med kolonneregelen. Kaster ved feil. Gjenbruk mønsteret i `docx.ts`. Kopier bufferen før `getDocument`, fordi pdfjs kan overføre den til workeren.
- `src/lib/innlesing/innlesing.test.ts` -- `par-4/cv.pdf` med legacy-builden, én kolonne, topptekst og bunntekst over hele bredden, ord i flere biter, flere sider (også med tomme sider, og bare tomme sider som gir `""`), side med venstre kant ulik 0 (`view: [100, 0, 695, 842]`), PDF uten tekstlag og ødelagt PDF. En falsk `getDocument` tar vare på parametrene og sjekker `isEvalSupported: false`, at ingen `*Url`-parametre er satt, og at `data` er en annen buffer enn den som ble gitt inn. Rekkefølgetester sjekker først at begge ordene finnes. Testnavn starter med `FR-2:`, og testene for PDF uten tekstlag med `FR-3:`.
- `src/lib/okt/pdfjs.ts` (ny) -- `hentGetDocument()`: dynamisk `import("pdfjs-dist")`, setter `GlobalWorkerOptions.workerSrc` én gang og gir `getDocument`. Alle feil, også i oppsettet etter importen, nullstiller det lagrede løftet (`.then(...).catch(...)`).
- `src/lib/okt/pdfjs.test.ts` (ny) -- `vi.mock("pdfjs-dist")` og `vi.resetModules()` mellom tilfellene: `workerSrc` slutter på `pdf.worker.min.mjs`, to kall importerer én gang, og etter en import som feiler, prøver neste kall igjen.
- `src/lib/okt/cvFil.ts` -- `.pdf` i `LESERE` via `hentGetDocument`, `PDF_AVVIST` fjernes, ny `FIL_AVVIST`. `avvisCvFil`, `lesCvFil` og `CvFilSvar` beholdes.
- `src/lib/okt/cvFil.test.ts` -- `vi.mock("./pdfjs")` med legacy-builden. PDF leses, ødelagt PDF feiler, og `CV.PDF` godtas.
- `src/lib/okt/cvfil-tilstand.test.ts` -- `FR-3:` lest fil med `""` fra PDF gir varselet (allerede dekket for alle filer, legg til ett tilfelle for `cv.pdf`).
- `src/components/CvPanel.tsx:181` -- ny hjelpetekst. `accept=".pdf,.docx,.txt"` beholdes.
- `src/components/CvPanel.test.tsx:87` -- ny hjelpetekst.
- `src/components/CvPanel-fil.test.tsx:24-26,201` -- ny `FIL_AVVIST`, fjern PDF-raden i tabellen over avviste filer, og legg til en test der `@/lib/okt/pdfjs` er mocket og en PDF gir kontrollsteget med «cv.pdf». Uten mock prøver jsdom å laste den ekte pdfjs. Rekkefølgen sjekkes med `toContain` på begge ordene før `indexOf`.
- `eslint.config.mjs` -- legg til `pdfjs-dist` i UI-regelen (AD-2).
- `src/lint-grenser.test.ts` -- legg til et tilfelle der `pdfjs-dist` blokkeres i `src/components/X.tsx`.
- Ikke rør: `masker.ts`, `tilstand.ts` (varselet ved 0–299 tegn virker allerede for alle filer), `docx.ts`, `txt.ts`, `ui/*`.

## Tasks & Acceptance

**Execution:**
- [x] `package.json`, `package-lock.json` -- `npm install pdfjs-dist@6.5.438 --save-exact` -- AD-7.
- [x] `src/lib/innlesing/pdf.ts` + test -- kolonneregel med topptekst og bunntekst, skjøting, sider, PDF uten tekstlag og ødelagt PDF -- FR-2, FR-3, SM-5, NFR-6.
- [x] `src/lib/okt/pdfjs.ts`, `src/lib/okt/cvFil.ts` + tester -- PDF godtas og leses, ny formatmelding, `pdfjs.test.ts` -- FR-1, FR-3, FR-22.
- [x] `src/components/CvPanel.tsx` + tester -- hjelpetekst, avvisningstabell og PDF-test med mock -- UX-DR4.
- [x] `eslint.config.mjs`, `src/lint-grenser.test.ts` -- pdfjs-dist blokkert i UI -- AD-2.
- [x] Etter `next build`: en fil med `pdf.worker` i navnet finnes under `.next/static`, og pdfjs ligger ikke i chunken for startsiden (søk etter `GlobalWorkerOptions` i chunkene som `/` laster). Feiler det, stopp og spør.

**Acceptance Criteria:**
- Given tilstand 1, when brukeren velger `par-4/cv.pdf` med knappen eller dra og slipp, then vises «Leser CV-en …», så kontrollsteget med venstre kolonne før høyre, «cv.pdf» og *Bytt fil*, og fokus i feltet.
- Given `next build && next start`, when PDF-en fra testpar 4 lastes opp, then leses den uten feil i konsollen om worker.
- Given en skannet PDF, when den er lest, then vises varselet om kort tekst, og brukeren kan lime inn teksten i samme felt.
- Given lesing av en PDF, when nettverksfanen ses, then sendes ingen forespørsel med filinnholdet, og alt pdfjs henter, kommer fra appens egen adresse.

## Implementation Notes

- `pdf.ts` har egne små typer (`Tekstbit`, `GetDocument`) i stedet for å importere typer fra pdfjs-dist. Både den moderne og legacy-builden av `getDocument` og de falske versjonene i testene passer til typen. Sidebredden tas fra `page.view`, og x regnes fra venstre kant av siden. Tomme sider hoppes over når sidene skjøtes, så en PDF uten tekstlag gir `""`. Kolonnene skjøtes med vanlig linjeskift, uten tom linje mellom.
- Tekststørrelsen er `hypot(transform[2], transform[3])`. Ved skjøting brukes den største av de to bitene.
- `hentGetDocument` husker løftet, så workeren settes én gang. Feiler lastingen av chunken, glemmes løftet, så neste PDF prøver igjen.
- I `CvPanel-fil.test.tsx` gir mocken legacy-builden med `workerSrc` som en `file:`-URL til workeren i `node_modules`. I jsdom er `import.meta.url` en `http:`-URL, som Node ikke kan laste. Den dynamiske `import()` av pdfjs i testfila fanges ikke av `no-restricted-imports`, som bare ser på statiske importer.
- Sjekk etter bygget: `.next/static/media/pdf.worker.min.*.mjs` finnes. Det eneste treffet på `GlobalWorkerOptions` i chunkene som `/` laster, er vår egen linje i `pdfjs.ts`. Selve pdfjs (versjonsstrengen `6.5.438`) ligger bare i en egen chunk på cirka 447 kB som lastes ved første PDF.
- Prøvd i Chrome mot `next start`: `cv.pdf` (lagt inn i filvelgeren med `DataTransfer` fra JavaScript) ga kontrollsteget med venstre kolonne først, «cv.pdf» og fokus i feltet. Workeren ble hentet fra `/_next/static/media/`, ingen forespørsler gikk til andre adresser, og konsollen var tom. 321 tester består.
- Node-legacy-builden skriver «Ensure that the `standardFontDataUrl` API parameter is provided» som advarsel i testene. Den gjelder skrifttyper ved tegning, ikke tekstuttrekket, og `standardFontDataUrl` skal ikke settes (FR-2).
- Runde 1 er rullet tilbake etter kodegjennomgangen (se Spec Change Log). Notatene over gjelder den første versjonen og er beholdt som historikk. Koden fra runde 1 ligger i scratchpad-mappen for økten (`keep-1-5-runde-1`), men spec-en er eneste kilde.

- Runde 2, rettinger etter gjennomgangen:
  - **Topptekst og bunntekst:** grensen finnes som før. Av linjene som er fjernet øverst og nederst, blir bare de som krysser grensen topptekst eller bunntekst, slik den låste beslutningen sier. De andre legges tilbake i kolonnene. Regelen «godta bare når alle fjernede linjer krysser» ville gitt én kolonne og blandede linjer, og den ble derfor ikke brukt. Bivirkning: en skillelinje over hele bredden som står under de første radene, skrives først.
  - **Tester og ryddig:** `finnOppdeling` gir `midten` direkte. `pdfUtenTekst()` ligger i `src/testhjelp/pdf.ts`, og panelet har nå en test med skannet PDF. Nye tester for `destroy()`, likhetsregelen og grenseverdiene (2,0 og 2,1 pt, 12 og 11,9 pt). 338 tester består, og `next build` gir workeren i `.next/static/media` og pdfjs i en egen chunk på 447 kB.
- Manuell test (Kevin, 2026-11-07): alle 11 tester er bestått, etter `npm run build && npm start`. Det gjelder `par-4/cv.pdf` med to kolonner, dra og slipp, skannet PDF, ødelagt PDF, fil over 5 MB, *Bytt fil*, tastaturnavigasjon, 320 px, 200 % zoom, nettverksfanen (Network) og konsollen (Console). NVDA og VoiceOver i Safari er ikke med i de 11 testene og er ikke rapportert. Story 1.5 står derfor som `review` i `sprint-status.yaml`.

## Spec Change Log

- **2026-11-07, runde 1 → 2 (intent_gap, Kevin valgte «Håndter toppteksten»).** Utløst av: en topptekst over hele bredden som krysser kolonnegrensen, ga én kolonne og flettede kolonner under. Endret: beslutning, grenseregel og ny rad i matrisen i den låste delen (med Kevins godkjenning), Design Notes (regelen for topptekst og bunntekst, begrensningen er fjernet), Code Map med de sju rettingene fra gjennomgangen (tester for `pdfjs.ts`, tomme sider, venstre kant, parametre til `getDocument`, buffer-kopi, `toContain` før `indexOf`, `.then().catch()` i `pdfjs.ts`). Unngått: CV-er med sentrert navn eller kontaktlinje over to kolonner som leses flettet. KEEP: alt annet fra runde 1 virket og skal bygges likt. Det gjelder de egne små typene i `pdf.ts` (`Tekstbit`, `GetDocument`), `view` for sidebredde og venstre kant, `hypot(transform[2], transform[3])` som tekststørrelse, at tomme sider hoppes over, at `destroy()` kalles i `finally`, at `hentGetDocument` husker løftet, `pdfUtenTekst()` bygget i testen, mocken i `CvPanel-fil.test.tsx` med legacy-workeren som `file:`-URL, ESLint-mønsteret `^pdfjs-dist(/|$)` for components og app med tester, og sjekken etter bygget (worker i `.next/static/media`, pdfjs i en egen chunk på cirka 447 kB).

## Review Triage Log

| Finding | Verdict | Evidence | Route |
|---------|---------|----------|-------|
| A full-width header that crosses the gap turns the page into one column, so the columns below it interleave (blind) | medium | Real: `finnKolonnegrense` needs an x-range no text covers on the whole page. A centred name or contact line across the page is common in two-column templates. Listed as a known limitation in Design Notes, which is outside the frozen block | intent_gap, Kevin chose to handle it; loopback to round 2 |
| Real `hentGetDocument` is never tested: `workerSrc`, the one-time memo and the retry after a failed load (gap, blind) | medium | Pre-verified: both suites mock `./pdfjs` completely. Removing `hentet = null` keeps every test green, and then one failed chunk load breaks PDF for the whole session | patch, carried into round 2 through the Code Map |
| Empty pages being skipped is untested (gap) | medium | Pre-verified: the only no-text test has one page, and `[""].join` is still `""`. A scanned PDF with several pages would give `"\n\n…"` without the filter | patch, carried into round 2 through the Code Map |
| Subtracting the page's left edge (`venstreKant`) is untested (gap) | low | Pre-verified: every fake uses `view: [0, 0, 595, 842]`. A PDF with a non-zero origin would put the search window in the wrong place | patch, carried into round 2 through the Code Map |
| No test checks `isEvalSupported: false` or that no URL options are passed (blind) | medium | Real: the narrow type limits only callers at compile time. Adding `cMapUrl` would pass every test and break FR-2 | patch, carried into round 2 through the Code Map |
| `indexOf("SPRÅK") < indexOf("PROFIL")` passes when «SPRÅK» is missing (blind) | low | Real in `CvPanel-fil.test.tsx`: `-1 < n` is true. In `innlesing.test.ts` the full-text check catches it | patch, carried into round 2 through the Code Map |
| The test «bufferen som gis inn, kan brukes etterpå» proves nothing (blind) | low | Real: the Node legacy build uses a worker on the same thread, so nothing is transferred and the test passes without `slice(0)` | patch, carried into round 2 through the Code Map |
| A rejection in the `.then` success callback is cached for good (edge) | low | Real but only in theory: the reject handler in `.then(ok, feil)` does not catch errors thrown in `ok`. The fix is a direct correction | patch, carried into round 2 through the Code Map |
| No test for a password-protected PDF (blind) | low | Without `onPassword`, pdfjs rejects the loading task (`pdf.mjs:17430`). It takes the same catch path as a broken PDF, which is tested | rejected |
| No lint rule stops `lib/innlesing` from importing `pdfjs-dist` statically (blind) | low | Real, but it guards a state nobody has shown, and the fix is a new config rule. The build check in the tasks finds it. Like the chunk check deferred in 1.4 | rejected |
| Overlapping fake-bold runs are duplicated, and runs ending in a space get a double space (blind, edge) | low | Real for some PDFs, not for testpar 4 or ordinary Word exports. The fix adds a guard. A double space is cosmetic | rejected |
| Rotated pages and vertical text give the wrong x coverage (blind, edge) | low | Real for `/Rotate 90`, rare for CVs. The fix needs rotation handling | rejected |
| Three or more columns: only the widest gap is used (edge) | low | Real, rare for CVs. The fix needs a recursive split | rejected |
| y drift over 2 pt splits a line (edge) | low | Text is kept, and only the line break moves. It never mixes columns | rejected |
| A PDF that never settles leaves «Leser CV-en …» forever (edge) | low | Not shown to happen. Even so, the user stays in state 1 during the read, where *Lim inn CV-teksten* drops the file (`CvPanel.tsx:208-213`) | rejected |
| No cancel or page limit while a PDF is read; a stale result after *Bytt fil* (blind) | low | Stale results are ignored by the counter and the reducer guard from 1.4. The CPU time is limited by 5 MB | rejected |
| No masking test for fødselsnummer from PDF (blind) | low | Masking runs in `cvFilLest` whatever the source, and it is tested for TXT and DOCX. A split number is joined with no space or one space, and `masker` handles both | rejected |
| Spec status `in-review` vs sprint `in-progress`; manual checks not recorded (blind) | false | Sprint status moves at step 5 in this workflow. The manual checks belong to Kevin after the review | rejected |
| **Round 2:** trimming drops ordinary two-column rows as header or footer even when they do not cross the gap, and prints them mixed (blind) | medium | Real: `finnOppdeling` only counts lines. With 12 lines and a full-width divider as line 3, it first finds a gap at `topp = 3`, and «V1 H1» and «V2 H2» come out as header. The frozen decision says only lines *that cross the gap* are header or footer | patch: accept a split only when every dropped line overlaps the gap, plus a test with the crossing line in the middle |
| `destroy()` in `finally` is never checked (gap) | medium | Pre-verified: the fake's `destroy` records nothing. Removing `finally` keeps every test green and leaves pdfjs documents alive in the tab | patch: count `destroy` calls after a good read and after a `getTextContent` that rejects |
| Tie rule «færre nederst» is untested (blind) | low | Real: reversing the loop order in `finnOppdeling` passes every test. The fix is one test | patch |
| No boundary tests for `LINJE_TOLERANSE` (2.0 vs 2.1) and `MINSTE_GRENSE` (12 vs 11.9) (blind) | low | Real: only 1.5 pt and 10 pt are tested. The fix is a direct test | patch |
| The drag-and-drop PDF test leaves out part of AC 1 (blind) | low | Real: it does not check «Leser CV-en …», column order, *Bytt fil* or focus. The fix adds assertions | patch |
| No panel test for a scanned PDF: the matrix row «Skannet» is only proven in pieces (blind) | medium | Real: `lesPdf` → `""` and the reducer are tested apart. No test uploads a PDF without text and checks the warning, the empty field and pasting | patch: a panel test with `pdfUtenTekst()` from a shared test helper outside `lib/innlesing` (AD-2) |
| `midten` computed twice; `FR-2:` on the random-bytes test should be `FR-22:`; stray blank line (blind) | low | Real and cosmetic, with a direct fix: return `midten` from `finnOppdeling`, rename the test, remove the line | patch |
| No test of the real browser path: modern build, bundled worker URL; the `workerSrc` test only checks a string (gap, blind, edge) | medium | Pre-verified: all PDF tests mock `hentGetDocument` or use the legacy build, and the repo has no browser or e2e harness. The build check and the Chrome checks after `next start` cover it by hand | defer: belongs with the deferred browser smoke test from 1.2 |
| A one-column page with a date table can be read as two columns, more so with trimming (blind, edge) | maybe-false | Happens only when no line or heading covers the space between dates and text, which depends on the PDF. Settle it with real one-column CV PDFs from Word and Canva | defer (medium, unverified) |
| A dynamic `import("pdfjs-dist")` in components gets past the lint rule (blind) | low | Real, but nobody writes it in production code, and the fix is a new `no-restricted-syntax` rule. Same verdict as the lint row in round 1 | rejected |
| Repeated name or page footer on every page goes into the text once per page (blind) | low | Real for CVs with several pages. The text is kept and the user can delete it in the review step (FR-3). The fix needs comparison across pages | rejected |
| `erPdfTekstbit` does not check `transform` and `width` (blind) | false | pdfjs always gives both on text items, and marked-content items have no `str` and are filtered out | rejected |
| `destroy()` that rejects after a good read discards the text (edge) | low | Not shown to happen, and the fix guards a state nobody has seen | rejected |
| A column row within 2 pt of a full-width header is glued into the header (edge) | low | Needs two lines of text overlapping vertically, which does not happen with normal line spacing | rejected |
| Fallback to `hypot(transform[0], transform[1])` goes beyond the spec (edge) | false | Only used when the vertical scale is 0, so the main rule follows the spec. Harmless | rejected |

## Design Notes

Undersøkt med pdfjs-dist 6.5.438 på `par-4/cv.pdf` (595 × 842 pt). Venstre kolonne slutter ved x ≈ 185 (navnet), og høyre starter ved 225. Elementer med bare `" "` går over grensen, så de må holdes utenfor søket. Navnefeltet ligger øverst i venstre kolonne og havner derfor først. En prøve av regelen under ga grensen 185–225, ingen manglende linjer, ingen blandede linjer og samme tekst som `cv.txt` uten mellomrom.

Regel: Elementer med omtrent lik y (±2 pt) blir én linje, sortert etter x. Kolonnegrensen er det bredeste x-intervallet mellom 20 og 80 % av sidebredden som ingen elementer med tekst dekker. Det må være minst 12 pt bredt, og det må finnes tekst på begge sider. Søket gjøres først med alle linjene. Finnes ingen grense, prøves det med k linjer fjernet øverst og m nederst, med minst mulig k + m først (ved lik sum: færre nederst), og k + m kan være høyst en fjerdedel av linjene på siden. De fjernede linjene øverst blir toppteksten og skrives først, de nederst blir bunnteksten og skrives sist, begge som én kolonne. Uten grense etter dette sorteres hele siden som én kolonne.

Eksempel (A4, 595 pt): «KARI NORDMANN» sentrert ved x 220–375, en kontaktlinje 40–555, så venstre kolonne 40–180 og høyre 225–555, og «Referanser oppgis på forespørsel» 40–555 nederst. Uten de to øverste og den nederste linjen er grensen 180–225. Utdata: navnet, kontaktlinjen, venstre kolonne, høyre kolonne, bunnlinjen.

## Verification

**Commands:**
- `npm run lint && npm run typecheck && npm test && npm run build` -- alt består uten nøkkel.

**Manual checks:**
- `npm run build && npm start`: `par-4/cv.pdf` med knapp og dra og slipp, ødelagt PDF, skannet PDF (testfil i scratchpad), PDF over 5 MB og *Bytt fil*. Nettverksfanen viser bare workeren og chunkene fra appens egen adresse, ingen filinnhold.
- Med tastatur alene, NVDA (Windows) og VoiceOver i Safari (macOS), i 320 px bredde og med 200 % tekstzoom. Safari er også en sjekk av at den moderne builden av pdfjs 6 virker der.
