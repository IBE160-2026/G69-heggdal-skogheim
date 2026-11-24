---
title: 'Story 2.7: Endre CV-tekst, gå tilbake og starte på nytt'
type: 'feature'
created: '2026-11-24'
status: 'in-review'
route: 'dispatch'
review_loop_iteration: 0
baseline_commit: '227ddb328c2ff54689583f2e7cf17d61746f3472'
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-2-context.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Resultatsiden har bare en midlertidig *Tilbake*, som sletter kjøringen og resultatet. Brukeren kan ikke legge inn en erfaring og gå tilbake uten å miste analysen. Brukeren kan heller ikke tømme alt og begynne på nytt.

**Approach:** Forberedelsen skal kunne vises uten at kjøringen og resultatene tømmes.
- *Endre CV-tekst* åpner forberedelsen med teksten beholdt.
- *Tilbake til resultatet* går tilbake så lenge teksten er uendret.
- *Analyser* spør først hvis noe er redigert.
- *Ny analyse* tømmer innholdet etter bekreftelse.

## Boundaries & Constraints

**Always:**
- Tekstene er fra EXPERIENCE.md. I dialogen ved *Analyser* er `{faner}` = «Gap-analyse og nøkkelord».
  - «Starte en ny analyse? Alle resultatdelene erstattes. Redigeringene dine i {faner} blir overskrevet.» (*Avbryt*, *Analyser på nytt*)
  - «Tømme alt? CV-teksten, annonsen og alle resultatdelene fjernes.» (*Avbryt*, *Tøm alt*)
  - «Du har endret teksten. Trykk *Analyser* for en ny analyse.»
- Dialogene bruker `AlertDialog`. Fokus står på *Avbryt* når de åpnes. Lukkes de uten valg, går fokus tilbake til knappen som åpnet dem. Under 640 px er det «Valg».
- Fokus (UX-DR24):
  - *Endre CV-tekst* → CV-tekstfeltet.
  - *Tilbake til resultatet* og *Analyser* → «Resultat».
  - Bekreftet *Ny analyse* → *Velg CV-fil*.
- «Uendret» betyr at `utkast` er lik `kjoring` (CV-tekst og annonse), og at ingen CV-fil leses (`cvFil?.tilstand !== "leser"`).
- *Tilbake til resultatet* vises når det finnes en `kjoring` og teksten er uendret. Det gjelder også mens analysen genereres, og når den har feilet. Requesten fortsetter. (Kevin, 2026-11-24, alternativ A)
- En fane er redigert når `redigert !== null`, også etter en feil (avtalt med Sondre, PR #41).
- Dialogen ved *Analyser* vises bare når trykket faktisk starter en ny kjøring. Ellers virker *Analyser* som før (maskering og demovarsel).
- *Ny analyse* tømmer `innhold`: utkast, fil, demovarsel, kjøring og resultatdeler. I tillegg:
  - Live-meldingen fjernes.
  - `okt.bekreftetPersonvern` beholdes.
  - `gapVersjon` nullstilles ikke, så id-ene til kjøringene aldri gjentas. Det er et bevisst avvik fra AD-6, og det står i `deferred-work.md`.
- *Endre CV-tekst* og *Tilbake til resultatet* lar live-meldingen stå, og de avbryter ingenting.
- En ny kjøring eller *Ny analyse* avbryter den pågående requesten, og sene svar forkastes (AD-6).
- Under 640 px ligger *Endre CV-tekst* og *Ny analyse* i en `DropdownMenu` bak «Valg».
- Det som kom med PR #41 og PR #42, skal virke som før. Testene for dette skal stå grønne uten endring i det de forventer. Unntaket er testen for *Tilbake* fra PR #41, se Code Map.
  - En ny generering som feiler, beholder analysen og redigeringene.
  - Feilvarselet følger PR #41 og PR #42. Ved `llm_feil` og `llm_tidsavbrudd` uten en tidligere analyse viser det *Prøv igjen* og *Prøv med eksempel*. Med en tidligere analyse viser det bare *Prøv med eksempel*, fordi *Generer på nytt* i verktøylinjen gjør det samme som *Prøv igjen* (`medForrige` i `GapAnalyseFane`).
- Testnavnene starter med FR-, UX-DR- eller AD-ID.

**Beslutninger (Kevin, 2026-11-24):**
- *Tilbake til resultatet* følger alternativ A (se over).
- En fil som leses, regnes som endret tekst.
- Spec-en holdes samlet selv om den er over 1 600 tokens, og *Ny analyse* blir med i 2.7.
- Gjennomgangen i steg 4 gjøres med uavhengige underagenter.
- Avvikene fra AD-6 (`gapVersjon`) og fra EXPERIENCE.md (alternativ A) føres i `deferred-work.md`. Dokumentene endres ikke nå.
- **Avkrysningen (alternativ A, etter implementeringen):** *Endre CV-tekst* beholder `okt.bekreftetPersonvern` som den er. Den vises som bekreftet bare hvis brukeren allerede har krysset av. Kom kjøringen fra *Prøv med eksempel* uten avkrysning (FR-25), står den tom, og brukeren må krysse av før *Analyser* med egen tekst. Begrunnelse: avkrysningen er brukerens samtykke til at CV-teksten sendes til leverandøren i et tredjeland (FR-5), og appen skal aldri registrere et samtykke som brukeren ikke selv har gitt. Ordlyden «avkrysningen er bekreftet» i `epics.md` gjelder det vanlige tilfellet, der kjøringen kom fra *Analyser*.
- **Feilvarselet (alternativ A, etter implementeringen):** oppførselen fra PR #41 og PR #42 beholdes uendret (se Always). Begrunnelse: Kevin har krevd at Sondres endringer bevares uten regresjon, og en egen *Prøv igjen* ved siden av *Generer på nytt* ville vært en dobbel knapp for samme handling.

**Never:**
- Ingen endring i ARCHITECTURE-SPINE.md eller i EXPERIENCE.md.
- Ingen endring i API-et, i pipelinen, i feilmeldingene eller i `ProvEksempelKnapp`.
- Ingen endring i `genereringStartet` og `genereringFeilet` (PR #41).
- Ingen nettleserlagring og ingen ny rute.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Endre CV-tekst | resultat, gap ferdig | Forberedelsen med tekstene beholdt, avkrysningen som før (bekreftet bare hvis brukeren har krysset av), fokus i CV-feltet, *Tilbake til resultatet* synlig | N/A |
| Endre CV-tekst etter eksempelet | kjøring fra *Prøv med eksempel*, `bekreftetPersonvern === false` | Avkrysningen står tom og kan krysses av. Ingenting setter samtykket automatisk | N/A |
| Tilbake uendret | ingen endring | Resultatet uten ny request, fokus på «Resultat», redigeringene og «· redigert» står | N/A |
| Tilbake under generering eller etter feil | gap `genererer`, eller `feil` uten tidligere analyse | Knappen vises. Resultatet viser spinneren eller feilen. Requesten avbrytes ikke, og svaret vises når det kommer | N/A |
| Tekst endret | CV-tekst eller annonse ≠ kjøringen | Knappen er skjult, og linjen om endret tekst vises | N/A |
| Tekst satt tilbake | teksten er lik kjøringen igjen | Knappen vises igjen | N/A |
| Fil leses | `cvFil.tilstand === "leser"` | Knappen er skjult | N/A |
| Analyser, redigert | `redigert !== null`, og trykket starter en kjøring | Dialog. *Avbryt*: ingenting endres, og fokus går til *Analyser*. *Analyser på nytt*: ny `kjoring`, alle resultatdelene nullstilles, og fokus går til «Resultat» | N/A |
| Analyser, redigert under ny generering | gap `genererer`, `redigert` skjult | Dialogen vises (`redigert !== null`) | N/A |
| Analyser, ikke redigert | `redigert === null` | Ny kjøring uten dialog | N/A |
| Analyser starter ikke | demomodus med egen tekst, et nytt fødselsnummer, eller årsaker til at knappen er deaktivert | Ingen dialog. Demovarsel, maskering eller ingenting, som før | N/A |
| Ny analyse | bekreftet | `innhold` er tom, tilstand 1, fokus på *Velg CV-fil*. Avkrysningen og `gapVersjon` beholdes, og neste kjøring får en ny id | N/A |
| Ny analyse avbrutt | *Avbryt* | Ingenting endres, og fokus går tilbake til det som åpnet dialogen | N/A |
| Ny analyse under fillesing | `cvFil` leses | Filen slippes, og et sent leseresultat ignoreres | N/A |
| Sent svar | requesten går, og *Ny analyse* eller *Analyser på nytt* trykkes | Requesten avbrytes, og svaret vises ikke | N/A |

</frozen-after-approval>

## Code Map

- `src/lib/okt/tilstand.ts`:
  - Typene og `startTilstand` (:52–129), `medKjoring` (:202), `eksempel`, `analyser` (:252), `gjelder` (:277), `kunngjor` (privat) og `cvFilLeses` (:402, endrer ikke `utkast`).
  - `tilbakeTrykket` (:429–440) fjernes.
  - `genereringStartet` og `genereringFeilet` er fra PR #41 og røres ikke.
- `src/app/page.tsx` -- viser `Resultat` når `kjoring` finnes. Det må avhenge av visningen.
- `src/components/Resultat.tsx`:
  - Toppkommentaren (:23–24), `tilbake()` (:39–43) og knappen *Tilbake* (:73–81) erstattes.
  - Fokuset på «Resultat» kommer fra effekten når siden monteres (:35–37), så det trengs ingen ny kode for det.
  - `genererer`, `analyse` og `redigert` (:28–32) og fanedelen er fra PR #41 og røres ikke.
- `src/components/AnalyserKnapp.tsx` -- *Analyser* (:50–65), med `onBlur` → `cvForlatt`. Dialogen, *Tilbake til resultatet* og linjen om endret tekst skal hit (EXPERIENCE l.39).
- `src/components/CvPanel.tsx`:
  - `FELT_ID` (:22) er ikke eksportert, og *Velg CV-fil* (`velgKnapp`) har ingen id.
  - Panelet monteres på nytt når visningen byttes. Etter *Ny analyse* er `cvTekst` tom, `cvFil` er `null` og `valgtInnliming` er `false`, så tilstand 1 med *Velg CV-fil* vises.
  - Etter *Endre CV-tekst* er `cvTekst` ikke tom, så tekstfeltet finnes.
- `src/components/ProvEksempelKnapp.tsx` -- mønsteret for `AlertDialog` (kontrollert `open`, `onCloseAutoFocus`). `harInnhold` regner allerede med `kjoring`. Knappen står også i feilvarselet (`GapAnalyseFane`, PR #42), og den går gjennom `medKjoring`. Ikke endre den.
- `src/lib/okt/OktProvider.tsx:111-120` -- når `kjoring` blir `null`, avbrytes alt, og `startGenerering` avbryter en eldre kjøring. Ingen endring.
- `src/components/ui/` -- `npx shadcn@4.23.0 add dropdown-menu` (`radix-ui` ^1.8.1 og `radix-nova` er i bruk). Den genererte fila sjekkes mot `FORBUDT_I_UI` (`src/repo-regler.test.ts:28`), og forbudte klasser byttes: `data-disabled:opacity-50` → `data-disabled:text-muted-foreground`, `ring-*` → `border`, `outline-none` og `focus-visible:ring` → mønsteret i de andre ui-filene.
- **Tester som skrives om** (de bruker `tilbakeTrykket` eller *Tilbake*):
  - `kjoring-tilstand.test.ts:264-305`
  - `OktProvider.test.tsx:154-183`
  - `Resultat.test.tsx:212, 426-452`
  - `redigering-tilstand.test.ts:253-271` (fra PR #41, godkjent av Kevin). Den skrives om til to tester: *Endre CV-tekst* og *Tilbake til resultatet* etter en feil beholder `generert` og `redigert`, og *Ny analyse* gir `gap === null`. Begrunnelsen skal stå i Implementation Notes.
- **Tester som skal stå med de samme forventningene:** resten av `redigering-tilstand.test.ts`, testene fra PR #41 og PR #42 i `GapAnalyseFane.test.tsx`, `GapVerktoylinje.test.tsx` og `Resultat.test.tsx`, og `feilmeldinger.test.tsx`. Følgende må ikke endres av de nye knappene i toppfeltet:
  - at overskriften (nivå 2) mangler under generering
  - `textContent` på fanen («Gap-analyse og nøkkelord · redigert»)
  - knappelisten i `role="alert"`

## Tasks & Acceptance

**Execution:**
- [x] `src/lib/okt/tilstand.ts` -- de nye tilstandene, handlingene og hjelperne -- FR-3, FR-21, AD-6
  - Tilstanden får `visning: "forberedelse" | "resultat"` utenfor `innhold`, og `medKjoring` setter `"resultat"`.
  - Handlingene `endreCvTrykket`, `tilbakeTilResultatet` og `nyAnalyseBekreftet` erstatter `tilbakeTrykket`.
  - `tilbakeTilResultatet` gjør ingenting når teksten ikke er uendret.
  - Hjelperne eksporteres:
    - `erUendret(t)`
    - `redigerteFaner(t)`, som gir fanenavnene der `redigert !== null`
    - `analyserStarterKjoring(t)`, definert som `reducer(t, { type: "analyserTrykket" }).innhold.kjoring !== t.innhold.kjoring`, uten egne regler
- [x] `src/lib/okt/kjoring-tilstand.test.ts` og `redigering-tilstand.test.ts` -- tester for tilstanden -- FR-3, FR-21, AD-6
  - Testene for *Tilbake* skrives om (se Code Map).
  - Nye tester:
    - live-meldingen: fjernes av *Ny analyse*, står etter *Endre CV-tekst* og *Tilbake*
    - `erUendret` med tekst endret, tekst satt tilbake og en fil som leses
    - *Ny analyse* beholder avkrysningen og `gapVersjon`, og neste kjøring får en ny id
    - et sent leseresultat etter *Ny analyse* ignoreres
    - `analyserStarterKjoring` i demomodus med egen tekst, med et nytt fødselsnummer og med årsaker
    - `redigerteFaner` etter en feil og under en ny generering
- [x] `src/lib/okt/OktProvider.test.tsx` -- tester for requestene -- AD-6
  - *Ny analyse* og *Analyser på nytt* avbryter, og svaret forkastes.
  - *Endre CV-tekst* under generering avbryter ikke (`signal.aborted === false`, ingen ekstra kall), og svaret står i tilstanden etter *Tilbake*.
- [x] `src/app/page.tsx` + test -- `Resultat` bare når det finnes en kjøring og visningen er `"resultat"`. En test viser at en kjøring og `"forberedelse"` gir forberedelsen -- FR-3
- [x] `src/components/CvPanel.tsx` -- eksporter `CV_FELT_ID`, og gi *Velg CV-fil* en eksportert `VELG_CV_ID` -- UX-DR24
- [x] `src/components/ui/dropdown-menu.tsx` -- shadcn-komponenten uten klassene i `FORBUDT_I_UI` -- UX-DR9
- [x] `src/components/Resultat.tsx` + `Resultat.test.tsx` -- toppfeltet og dialogen «Tømme alt?» -- FR-3, FR-21, UX-DR9, UX-DR18, UX-DR24
  - Fra 640 px står *Endre CV-tekst* og *Ny analyse* i toppfeltet, utenfor fanene og varselet. Under 640 px står «Valg» med en `DropdownMenu`.
  - Det er én kontrollert dialog for «Tømme alt?», utenfor menyen, og den åpnes fra `onSelect` eller fra knappen.
  - `onCloseAutoFocus` gir fokus til det som åpnet dialogen. Etter *Tøm alt* går fokus til *Velg CV-fil*, med `flushSync` og `getElementById`.
  - *Endre CV-tekst* bruker `flushSync` og flytter fokus til CV-feltet. Menyens `onCloseAutoFocus` får `preventDefault`.
  - Testene åpner menyen med tastaturet og sjekker `document.activeElement` etter *Avbryt*, *Tøm alt* og *Endre CV-tekst*.
  - En regresjonstest dekker PR #41 og PR #42: *Endre CV-tekst* → *Tilbake til resultatet* → *Generer på nytt* → `llm_feil`. Da står den redigerte verdien og «· redigert», og varselet har nøyaktig *Prøv med eksempel*, som i PR #41. En egen test viser at en feil uten tidligere analyse gir nøyaktig *Prøv igjen* og *Prøv med eksempel*.
  - En test viser at *Prøv med eksempel* i varselet gir resultatet med eksempelet.
- [x] `src/components/AnalyserKnapp.tsx` + test -- dialogen ved *Analyser*, *Tilbake til resultatet* og linjen om endret tekst -- FR-3, UX-DR8, UX-DR18
  - `onClick` åpner dialogen når den aktive knappen trykkes, `redigerteFaner` ikke er tom, og `analyserStarterKjoring` er sann. Ellers sendes `analyserTrykket` direkte, så maskering og demovarsel virker ved første trykk.
  - Etter bekreftelse får `onCloseAutoFocus` `preventDefault`, siden «Resultat» tar fokus.
  - Testene dekker *Avbryt* (ingenting endres, fokus på *Analyser*) og *Tilbake* etter en feil uten tidligere analyse.
- [x] `_bmad-output/implementation-artifacts/deferred-work.md` -- avvikene fra AD-6 og EXPERIENCE.md (gjort ved planleggingen)

**Acceptance Criteria:**
- Given *Endre CV-tekst* og deretter *Tilbake til resultatet*, when resultatet vises, then er det ikke sendt noen ny request, og redigeringene og «· redigert» står.
- Given en skjerm under 640 px, when brukeren åpner «Valg», then finnes *Endre CV-tekst* og *Ny analyse* som menyvalg. De virker som knappene, og fokus går tilbake til «Valg» når dialogen avbrytes.
- Given en ny generering som feiler etter *Endre CV-tekst* og *Tilbake til resultatet*, when feilen vises, then står den forrige analysen og redigeringene, og varselet har *Prøv med eksempel*. Uten tidligere analyse har det *Prøv igjen* og *Prøv med eksempel* (PR #41 og PR #42).
- Given `npm run lint`, `npm run typecheck`, `npm test` og `npm run build`, when de kjøres, then er alle grønne, og ingen test fra PR #41 eller PR #42 har fått endret forventning, bortsett fra den ene som er godkjent.

## Implementation Notes

- **Omskrevet test fra PR #41** (`redigering-tilstand.test.ts`, godkjent av Kevin): «Tilbake etter en mislykket ny generering fjerner den beholdte analysen» brukte `tilbakeTrykket`, som er fjernet. Den midlertidige *Tilbake* tømte kjøringen. Nå finnes det to veier ut av resultatet: *Endre CV-tekst* (med *Tilbake til resultatet*) skal beholde analysen, og bare *Ny analyse* skal fjerne den. Derfor er testen delt i to: *Endre CV-tekst* → *Tilbake til resultatet* etter feilen beholder `generert`, `redigert` og `status: "feil"`, og *Ny analyse* gir `gap === null`.
- **Varselet etter en ny generering som feiler:** Med en forrige analyse viser `GapAnalyseFane` bare *Prøv med eksempel* (PR #41: *Generer på nytt* i verktøylinjen gjør det samme som *Prøv igjen*). Regresjonstesten i `Resultat.test.tsx` sjekker derfor `["Prøv med eksempel"]` for den veien, slik testen fra PR #41 gjør. En egen test sjekker at en feil uten tidligere analyse gir nøyaktig *Prøv igjen* og *Prøv med eksempel* etter *Endre CV-tekst* → *Tilbake til resultatet*, og at *Prøv med eksempel* gir resultatet med eksempelet. Formuleringen i Tasks og Acceptance Criteria («nøyaktig *Prøv igjen* og *Prøv med eksempel*») stemmer bare for det siste tilfellet.
- **`FANENAVN`** står nå i `lib/okt/tilstand.ts`, fordi `redigerteFaner` trenger navnet og `lib/okt` ikke kan importere fra `components`. `FANENAVN_GAP` i `GapVerktoylinje.tsx` er den samme verdien.
- **Menyen «Valg»** er `modal={false}`, så dialogen kan åpnes fra et menyvalg uten at `pointer-events: none` blir stående på `body`. Menyvalgene har `min-h-11`.
- **`dropdown-menu.tsx`:** I tillegg til byttene i Code Map er `outline-hidden` fjernet (det skjulte den globale fokusringen i `globals.css`), og `cn` importeres fra `@/lib/utils` i stedet for pakken `cn`, som generatoren valgte.
- **Avkrysningen etter *Endre CV-tekst*:** Kom kjøringen fra *Prøv med eksempel* uten avkrysning, er `bekreftetPersonvern` fortsatt `false`, og avkrysningen vises som før. *Endre CV-tekst* setter den ikke.
- **Testene i jsdom** stubber `ResizeObserver` (menyen bruker den til plasseringen).

- **Step 4, patches (2026-11-24):** finding 3 `analyser-endret` is now in the `aria-describedby` of *Analyser* while the line is shown. Finding 16 added the explicit FR-5 test that *Endre CV-tekst* after *Prøv med eksempel* leaves the checkbox unticked. Findings 9 and 10 were fixed in `epic-2-context.md`, which was compiled in step 1 of this build. After the patches: lint, typecheck, 991 tests (58 files) and build are green, and the PR #41 and PR #42 files are unchanged (`git diff 227ddb3`).
- **Manual check in the browser (2026-11-24, Chrome, local dev server in demo mode, no paid calls):** every `/api/` request went to localhost, and the console had no errors.
  - *Prøv med eksempel* without ticking the checkbox, then an edit to requirement 1 and «· redigert». After that, *Endre CV-tekst*: focus in `cv-tekst`, the checkbox is unticked (consent is not set), and *Tilbake til resultatet* is shown.
  - Typing one character: the button disappears, the line appears, and *Analyser* has `aria-describedby="analyser-arsaker analyser-endret"`. Backspace: the button comes back.
  - Tab from *Analyser* to *Tilbake til resultatet*, then Enter: focus on «Resultat», the edit and «· redigert» are still there, and no request was sent.
  - After ticking the checkbox with the space bar, *Analyser* opens «Starte en ny analyse?» with focus on *Avbryt*. Escape: focus goes back to *Analyser*. Confirming *Analyser på nytt*: one POST, focus on «Resultat», the edit is replaced, and `body` has `pointer-events: auto`.
  - *Ny analyse* opens «Tømme alt?» with focus on *Avbryt*. *Avbryt*: focus on *Ny analyse*. *Tøm alt*: focus on `velg-cv-fil`, still there after 600 ms. The checkbox stays confirmed and the live region is empty.
  - Mobile in a 373 px iframe (the window could not be resized): the header shows only «Valg». Enter opens the menu with focus on *Endre CV-tekst*, and ArrowDown moves to *Ny analyse*. Enter opens the dialog with the menu closed. Escape: focus on «Valg». The menu item *Endre CV-tekst* puts focus in `cv-tekst`.
  - At 320 px neither the preparation page nor the result page scrolls sideways.
  - Not done: NVDA and VoiceOver (the group does this), and a real phone.

## Spec Change Log

- **2026-11-24, etter steg 3 (Kevin, alternativ A på to spørsmål):** Implementeringen fant to steder der spec-en ikke stemte med det som var godkjent. (1) Raden «Endre CV-tekst» sa «avkrysningen bekreftet», men en kjøring fra *Prøv med eksempel* har ingen avkrysning. Endret til «som før», og en ny rad for eksempelet er lagt til. (2) Always, oppgaven for regresjonstesten og AC 3 sa at varselet har *Prøv igjen* og *Prøv med eksempel*, men PR #41 skjuler *Prøv igjen* når det finnes en tidligere analyse. Teksten følger nå PR #41 og PR #42. Ingen endring i koden. Tilstanden som unngås: at appen registrerer et samtykke uten at brukeren har gitt det, og en regresjon i Sondres feilvarsel. KEEP: `bekreftetPersonvern` settes bare av `personvernBekreftet`. `GapAnalyseFane` og `feilmeldinger` røres ikke.

## Review Triage Log

| # | Source | Location | Finding | Verdict | Evidence | Route |
|---|--------|----------|---------|---------|----------|-------|
| 1 | edge | AnalyserKnapp.tsx dialog description | Dialog open during a running regeneration: when `genereringFerdig` arrives, `redigert` becomes null and the text reads «Redigeringene dine i  blir overskrevet» | low | Real but rare: needs *Endre CV-tekst* during a regeneration of an edited tab, then *Analyser*, and the answer must arrive while the dialog is open. The fix adds state (a snapshot at opening). Confirming still does the right thing | reject |
| 2 | blind | AnalyserKnapp.tsx changed-text line | The line shows while a file is read, and while *Analyser* is disabled, so it says «Trykk Analyser» next to the reasons list | low | Reading a new file is changing the CV text, so the line is correct there. When disabled, the reasons list stands right below. The text is fixed by EXPERIENCE.md; changing it edits the spec | reject |
| 3 | blind | AnalyserKnapp.tsx changed-text line | The line is not tied to *Analyser*, so a screen reader user is not told that the way back is gone | low | Confirmed: the line has no id and is not in `aria-describedby`. The fix is one id and one attribute | patch |
| 4 | blind | preparation page | No way to clear everything from the preparation page after an edit | false | By design: *Ny analyse* is on the result page (Story 2.7 AC 5, EXPERIENCE.md). The intent does not ask for it on the preparation page | reject |
| 5 | blind | preparation page | Nothing is shown while a run continues in the background after *Endre CV-tekst* | low | The live region in `layout.tsx` announces «Gap-analysen er klar …» also on the preparation page (`genereringFerdig` calls `kunngjor`). A failure is shown when the user goes back. A visible status adds a new component | reject |
| 6 | blind | four AlertDialogs | The confirm dialog is copied in four places with their own focus flags | low | Real duplication, two copies are older (ProvEksempelKnapp, GapVerktoylinje). A shared component is a refactor across Sondre's files and PR #41/#42 code, which the intent protects. Consider it in epic 3, when more tabs get dialogs | reject |
| 7 | blind | Resultat.test.tsx, AnalyserKnapp.test.tsx | `ResizeObserver` stub copied in two test files | low | A future test without it fails loudly («ResizeObserver is not defined»). Moving it to a setup file changes `vitest.config.ts` | reject |
| 8 | blind | AnalyserKnapp.tsx `somListe` | The branch for several tab names is untested and unreachable with one tab | low | Unreachable until epic 3 adds tabs. A test needs a new export | reject |
| 9 | blind | epic-2-context.md | The rewritten context contradicts this story's decisions: «Tilbake» only with results, «Avkrysningen vises som bekreftet», and the alert always with both buttons | medium | Confirmed. Later builds (2.8, epic 3) load this file as their primary context and would get the wrong rules | patch |
| 10 | blind | epic-2-context.md | The rewrite dropped details epic 3 and 4 need: the gap copy format, the per-tab dialog titles, the copy error text and «øverst på mobil» | medium | Confirmed against `git show 227ddb3:…/epic-2-context.md` (lines 53–55). Epic 3 needs the dialog titles for brev, CV and ATS | patch |
| 11 | blind | spec frontmatter, sprint-status.yaml | `in-review` in the spec but `in-progress` in sprint-status, and the triage log empty | false | Expected BMAD state: step 4 sets the spec to `in-review`, sprint-status is synced in step 5, and this log is being filled now | reject |
| 12 | blind | spec Code Map | Line numbers point at code the diff removed | low | They are relative to `baseline_commit`, written at planning time. Fixing them edits this build's spec | reject |
| 13 | blind | I/O matrix | «Fil leses» and «Ny analyse under fillesing» are only tested in the reducer, and Escape is not tested | low | The button reads `erUendret` directly, which the reducer tests cover. Radix closes on Escape and *Avbryt* through the same `onOpenChange` and `onCloseAutoFocus` path | reject |
| 14 | blind | ui/dropdown-menu.tsx | Unused exports are not checked against `FORBUDT_I_UI` | false | `repo-regler.test.ts:74` scans every file in `src/components/ui`, so the whole file is checked. The unused exports follow the shadcn file convention | reject |
| 15 | blind | AnalyserKnapp.tsx | `kjoring && kanGaaTilbake` repeats a check that `erUendret` already makes | low | Cosmetic, no named harm, and the `kjoring` check is needed for the other line | reject |
| 16 | step-3 audit | I/O matrix row «Endre CV-tekst etter eksempelet» | No test asserts directly that the checkbox stays unticked after *Prøv med eksempel* → *Endre CV-tekst* | low | Only covered indirectly (`getByRole("checkbox")` in AnalyserKnapp.test.tsx:363 would throw). An explicit test protects the privacy rule | patch |

## Design Notes

- **Visningen** ligger utenfor `innhold`, siden den ikke er data. *Ny analyse* setter den til `"forberedelse"`.
- **`analyserStarterKjoring`** kjører den rene reduceren og sammenligner kjøringen før og etter. Da kan den ikke komme ut av takt med `analyser()`: maskering, årsaker, demovarsel og ukjent modus regnet som demo.
- **`gapVersjon` beholdes** ved *Ny analyse*, fordi `kjoring.id = gapVersjon + 1`. AD-6 sier at hele `innhold` tømmes. Avviket står i `deferred-work.md` til Sondre har avklart AD-6.
- **Under en ny generering** står `redigert` i tilstanden, men er skjult i fanen. Dialogen nevner den likevel, fordi regelen er `redigert !== null`.

## Verification

**Commands:**
- `npm run lint`, `npm run typecheck`, `npm test`, `npm run build` -- expected: alle grønne. Kjøres fra `C:\…` med stor stasjonsbokstav.
- `git diff main -- src/lib/okt/redigering-tilstand.test.ts src/components/GapAnalyseFane.test.tsx src/components/GapVerktoylinje.test.tsx src/components/feilmeldinger.test.tsx` -- expected: bare den godkjente omskrivingen.

**Manual checks:**
- I nettleseren, i demomodus med *Prøv med eksempel* (gratis):
  - Rediger et krav, trykk *Endre CV-tekst* og *Tilbake til resultatet*.
  - Endre teksten og sett den tilbake.
  - *Analyser* skal gi dialogen.
  - Trykk *Ny analyse*.
  - Gjør alt med tastatur og på 320 px.
- NVDA og VoiceOver tas av gruppen.
