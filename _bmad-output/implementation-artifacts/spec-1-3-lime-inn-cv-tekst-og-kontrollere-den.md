---
title: 'Story 1.3: Lime inn CV-tekst og kontrollere den'
type: 'feature'
created: '2026-11-04'
status: 'done'
baseline_commit: '55b36766b2c884e8d113e349e84a421a1f11355a'
route: 'dispatch'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-1-context.md'
  - '{project-root}/_bmad-output/planning-artifacts/ux-designs/ux-G69-heggdal-skogheim-2026-10-30/mockups/key-forberedelse.html'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** CV-panelet har bare en plassholder. Brukeren kan ikke legge inn CV-teksten, ser ikke hva som blir sendt, og fødselsnumre blir ikke fjernet.

**Approach:** Bygg `masker` i `lib/kjerne`, CV-panelets tilstand 1 (*Lim inn CV-teksten*) og tilstand 2 (kontrollsteget) med teller, grense, maskeringslinje og varsel om kort tekst, og én live-region for hele appen. Masking og meldinger går gjennom navngitte handlinger i `lib/okt`.

**Beslutninger (Kevin godkjenner):**
- Tilstand 1 i denne storyen: `h2` «CV», linjen «Opplasting av CV-fil kommer snart.» og knappen *Lim inn CV-teksten*. Story 1.4 erstatter linjen med opplastingsfeltet.
- Panelet viser tilstand 2 når brukeren har trykket *Lim inn CV-teksten* eller `cvTekst` ikke er tom. Det finnes ingen vei tilbake til tilstand 1 før *Bytt fil* kommer i story 1.4.
- Maskeringslinjen over feltet teller forekomstene av `[fødselsnummer fjernet]` i feltet: «1 fødselsnummer er fjernet fra CV-teksten.» eller «{n} fødselsnumre er fjernet fra CV-teksten.» Linjen vises bare når n > 0. Live-meldingen bruker samme setning med antallet som ble fjernet i hendelsen.
- Over 15 000 tegn: «CV-teksten er for lang. Maks 15 000 tegn.» i feltet, og årsaken «CV-teksten kan være maks 15 000 tegn.» under *Analyser*. Telleren er «{n} av maks 15 000 tegn».
- Når en grense passeres (fra under til over), meldes det én gang i live-regionen, både for CV-teksten og annonsen («Annonsen er for lang. Maks 8 000 tegn.»). Dette tar punktet fra `deferred-work.md`.
- Bare gyldige datoer regnes som fødselsnummer, slik FR-6 sier. D-nummer (dag + 40) maskeres ikke. 29.02 godtas når ÅÅ er delelig med 4.
- Varselet om kort tekst vises bare for 1–299 tegn (etter `trim()`), ikke når feltet er tomt. Story 1.4 må selv vise varselet når en fil gir 0 tegn.
- Spec-en beholdes samlet selv om den er over 1 600 tokens, fordi storyen har ett mål (valgt av Kevin).

## Boundaries & Constraints

**Always:**
- `masker` erstatter 11 sifre, eventuelt med ett mellomrom etter de seks første, der DDMMÅÅ er en gyldig dato og ingen siffer står rett før eller etter. Den er idempotent.
- Maskering skjer ved innliming, når feltet forlates og når *Analyser* trykkes, aldri mens brukeren skriver. Teksten kuttes aldri.
- Når feltet forlates fordi *Analyser* trykkes (`relatedTarget` er knappen), maskerer bare *Analyser*. Finner *Analyser* et fødselsnummer, maskeres det, linjen og live-regionen oppdateres, og ingenting annet skjer. Ellers gjør *Analyser* fortsatt ingenting, fordi analysen kommer i story 1.6.
- Tilstand 2: `h2` «Kontroller CV-teksten» (samme `id` som «CV»), etiketten «CV-tekst», og teller, maskeringslinje og feil i `aria-describedby`. *Lim inn CV-teksten* flytter fokus til feltet.
- Over 15 000 tegn: med en gang `aria-invalid`, `destructive` på teller og kant, og meldingen under feltet, som i `Annonsepanel`.
- 1–299 tegn: shadcn `Alert` med `TriangleAlert` (`aria-hidden`) over feltet: «Fant nesten ikke tekst i filen. Den kan være skannet eller tom. Lim inn teksten selv i feltet under.» Varselet bruker `role="status"` eller ingen rolle, ikke `role="alert"`.
- Live-regionen er én `aria-live="polite"` i `layout.tsx` inne i `OktProvider`. Samme melding to ganger skal leses opp to ganger.
- AD-2: komponentene importerer `lib/okt` og `lib/kontrakt`, aldri `lib/kjerne`. Tallene bruker U+00A0 (`15 000`).

**Never:**
- Ingen opplasting, `Bytt fil`, filnavn, `kjoring` eller `/api/generer`. Ingen nettleserlagring. Telleren er ikke en live-region.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Fødselsnummer | «01019012345», «010190 12345» | `[fødselsnummer fjernet]` | N/A |
| Ikke fødselsnummer | «400 00 001», «1990», «1234.56.78903», «12345678903», «310290 12345» | Uendret | N/A |
| Siffer rundt | «101019012345», «010190123456» | Uendret | N/A |
| Idempotens | `masker(masker(x))` | Lik `masker(x)` | N/A |
| Innliming | Tekst med 2 fødselsnumre | Begge maskert, linjen sier 2, live-melding med 2 | N/A |
| Skrevet, så *Analyser* | Nytt nummer, feltet ikke forlatt | Maskert, linjen oppdatert, ingen annen handling | N/A |
| CV-grense | 15 000 og 15 001 tegn | `ok`, så `for_lang`, én live-melding | Teksten beholdes |
| Kort CV | 299 og 300 tegn | Varsel, så ikke varsel | N/A |
| Tomt felt | 0 tegn eller bare mellomrom etter *Lim inn* | Ikke varsel, ingen feil, CV-årsaken under *Analyser* | N/A |

</frozen-after-approval>

## Code Map

- `src/lib/kontrakt/grenser.ts` -- har `CV_MAKS`. Legg til `CV_KORT = 300`.
- `src/lib/kjerne/grenser.ts` -- `tegnAntall` (trim) og mønsteret i `annonseStatus` gjenbrukes til `cvStatus`.
- `src/lib/okt/tilstand.ts` -- `reducer`, `startTilstand`, `arsakerTilAnalyse`, `annonseFeil`, `annonseVurdering`. Utvid her, ikke lag ny store.
- `src/components/Annonsepanel.tsx` -- mønster for etikett, teller, `aria-describedby`, `aria-invalid` og `medTusenskille`.
- `src/components/AnalyserKnapp.tsx` -- har ingen `onClick` ennå. Behold `aria-disabled` og årsakene.
- `src/components/CvPanel.tsx` -- plassholderen erstattes.
- `src/components/ui/alert.tsx` -- har `role="alert"` som standard. Overstyr med prop, ikke endre fila (samme grep som `Personvernboks`).
- `src/app/layout.tsx` -- `OktProvider` rundt `Demomodus` og `children`. Live-regionen legges her.
- Tester med handlinger og fokus: `jsdom` per fil, som `Annonsepanel.test.tsx`. Statisk markup: `renderToStaticMarkup`.
- `src/lint-grenser.test.ts` -- legg til at `@/lib/kjerne/masker` blokkeres i `src/components/X.tsx`.

## Tasks & Acceptance

**Execution:**
- [x] `src/lib/kjerne/masker.ts` + test -- `masker(tekst)` og `maskerMedAntall(tekst): { tekst, antall }`, konstanten `FODSELSNUMMER_FJERNET`. Testnavn starter med `FR-6:` -- FR-6, AD-13.
- [x] `src/lib/kontrakt/grenser.ts`, `src/lib/kjerne/grenser.ts` + test -- `CV_KORT`, `cvStatus(tekst)`: `tom | for_lang | ok` -- FR-4.
- [x] `src/lib/okt/tilstand.ts` + test -- `kunngjoring: { tekst, nr } | null`; handlingene `cvEndret`, `cvLimtInn` (maskerer), `cvForlatt` (maskerer), `analyserTrykket` (maskerer); melding når en grense passeres i `cvEndret` og `annonseEndret`; `cvVurdering`, `cvFeil`, `antallFjernet`; CV-årsak for `for_lang` i `arsakerTilAnalyse` -- AD-6, FR-3, FR-6.
- [x] `src/components/Kunngjoring.tsx` + test, `src/app/layout.tsx` -- live-regionen fra `tilstand.kunngjoring`, med `key={nr}` så samme tekst leses opp på nytt -- UX-DR23.
- [x] `src/components/CvPanel.tsx` + test -- tilstand 1 og 2, fokus, innliming (`onPaste` setter et flagg som neste `onChange` leser), `onBlur` uten maskering når `relatedTarget` er *Analyser*, teller, linje, feil og varsel -- UX-DR5, UX-DR24.
- [x] `src/components/AnalyserKnapp.tsx` + test -- `id="analyser"`, `onClick` sender `analyserTrykket` -- FR-6.
- [x] Oppdater testene som sjekker den gamle plassholderen (`CvPanel.test.tsx`) -- uten å endre andre forventninger.

**Acceptance Criteria:**
- Given CV-panelet i tilstand 1, when brukeren trykker *Lim inn CV-teksten*, then vises tilstand 2 med tomt felt og fokus i feltet.
- Given tekst med fødselsnummer, when den limes inn eller feltet forlates, then står `[fødselsnummer fjernet]` i feltet, linjen viser antallet, og live-regionen sier «1 fødselsnummer er fjernet fra CV-teksten.»
- Given alle vilkår oppfylt og et nytt nummer skrevet inn, when brukeren klikker *Analyser* med musen, then maskeres nummeret av *Analyser*, og ingenting annet skjer.
- Given en CV-tekst over 15 000 tegn, when den står i feltet, then har feltet grensetilstanden, og *Analyser* viser årsaken.

## Implementation Notes

- Del 1 (Kevin ba om bare `masker` først): `src/lib/kjerne/masker.ts` og `masker.test.ts`, implementert direkte og ikke med subagent, siden handoffen ville bygget hele spec-en. Matriseradene Fødselsnummer, Ikke fødselsnummer, Siffer rundt og Idempotens er dekket av testene. Gjennomgangen i steg 4 kjøres når hele storyen er ferdig.
- Mønsteret finner 11 sifre (med valgfritt mellomrom) uten siffer rundt, og `erGyldigDato` sjekker DDMMÅÅ etterpå. Plassholderen har ingen sifre, derfor er `masker` idempotent.
- Del 2: `CV_KORT = 300` i `lib/kontrakt/grenser.ts`, og `CvStatus` og `cvStatus` i `lib/kjerne/grenser.ts`, bare som nye linjer. CV-teksten har ingen `for_kort`, fordi 300 tegn bare gir et varsel. Varselet (1–299 tegn) vurderes i `lib/okt` i neste del.
- Del 3: `kunngjoring` er et obligatorisk felt med `null` i `startTilstand` (Kevin valgte dette). To av Sondres tester fikk derfor én linje `kunngjoring: null` hver: `tilstand.test.ts` og `KLAR` i `AnalyserKnapp.test.tsx`. Nye tester ligger i `src/lib/okt/cv-tilstand.test.ts`, slik at `tilstand.test.ts` ellers er urørt. `fjernetTekst(antall)` er lagt til, slik at linjen og live-meldingen bruker samme setning. Uten ny melding står forrige `kunngjoring` uendret. Flere meldinger i én hendelse slås sammen med mellomrom. `cvForlatt` og `analyserTrykket` gir samme objekt tilbake når ingenting maskeres.
- Del 4: `Kunngjoring` er en `div` med `aria-live="polite"`, `aria-atomic="true"` og `sr-only`, som alltid står i DOM-en. Meldingen er en `span` med `key={nr}`. Den står etter `{children}` i `layout.tsx`, slik at banneret og `h1` beholder plassen sin. `next build` er kjørt, og regionen finnes i den forhåndsrendrede `index.html`. Testen sender handlinger med knapper og `fireEvent`, fordi lint (`react-hooks/globals`) ikke tillater å fange `dispatch` i en variabel utenfor komponenten.
- Del 5: `CvPanel` viser tilstand 2 når `valgtInnliming` er sann eller `cvTekst` ikke er tom. Panelet blir derfor stående i tilstand 2 når feltet tømmes. Fokus flyttes i en effekt etter *Lim inn CV-teksten*. Innliming merkes med `onPaste` og leses i neste `onChange`, og `onKeyDown` nullstiller merket, slik at skriving etter en innliming som ikke endret noe, ikke maskeres. `ANALYSER_ID = "analyser"` eksporteres fra `CvPanel.tsx`. Før *Analyser* får denne id-en i neste del, maskerer blur alltid, og det er den trygge retningen. `Alert` får `role={undefined}`, slik at det bare finnes én live-region. Varselet er knyttet til feltet med `aria-describedby`. Den gamle testen «FR-1: har overskrift og plassholderlinje» er beholdt med ny linjetekst og `OktProvider`, fordi panelet nå bruker `useOkt`. `medTusenskille` er kopiert fra `Annonsepanel` i stedet for å flyttes, så `Annonsepanel.tsx` er urørt.
- Del 6: `AnalyserKnapp` har `id={ANALYSER_ID}` og `onClick`, som sender `analyserTrykket` bare når knappen er aktiv. Regelen fra story 1.2 om at et trykk på en `aria-disabled` knapp ikke gjør noe, gjelder dermed fortsatt. CV-feltet overlater derfor maskeringen til *Analyser* bare når knappen ikke er `aria-disabled`. Ellers ville et fødselsnummer blitt stående umaskert når brukeren klikker en deaktivert knapp. Testknappen med samme id er fjernet fra `CvPanel.test.tsx`, og testene bruker den ekte knappen. Testene for *Analyser* ligger i `CvPanel.test.tsx`, som allerede bruker jsdom, slik at `AnalyserKnapp.test.tsx` ikke trenger nytt testmiljø. `lint-grenser.test.ts` har fått én linje, som sier at `@/lib/kjerne/masker` blokkeres i `src/components/X.tsx`.

## Spec Change Log

- No loopback. The review found no `intent_gap` or `bad_spec`. All the fixes below are patches made after the review.

## Review Triage Log

| Finding | Verdict | Evidence | Route |
|---------|---------|----------|-------|
| Live region in `layout.tsx` not covered by any test (gap, blind) | medium | Every test mounts its own `Kunngjoring`; deleting it from the layout kept the suite green. Confirmed by mutation: the new `layout.test.tsx` fails without it | patch, `src/app/layout.test.tsx` with font mock |
| Focus reaches active *Analyser* without a click (mousedown then drag off), so the typed number stays unmasked (blind, edge, gap) | medium | The blur skip assumes a click will follow; with no `click`, nothing masks until the field is left again | patch, `onBlur` on *Analyser* sends `cvForlatt` (idempotent) |
| Blur rule reads `aria-disabled` from the DOM instead of state (blind) | low | Masking breaks silently if `AnalyserKnapp` changes how it shows disabled; `arsakerTilAnalyse(tilstand)` is available | patch, direct replacement |
| NBSP between the 6 and 5 digits not masked (blind, edge) | medium | PDF and Word text often has U+00A0; FR-6 "ett mellomrom" covers a non-breaking space | patch, `[ \u00a0]?` + test |
| Hyphen or several spaces as separator not masked (blind, edge) | medium | Real formats, but FR-6 allows only one space; a wider rule changes the PRD | defer |
| Literal NBSP in strings instead of `\u00a0` (blind) | low | The tool wrote invisible characters; easy to break when editing. Direct correction in this story's files only, not in `Annonsepanel` | patch |
| Drag-and-drop not masked right away (blind, edge) | low | Only `onPaste` set the flag; one direct handler | patch, `onDrop` |
| Paste flag stays set when a paste changes nothing (edge) | low | The next non-key change is masked early; masking early is harmless, and `onDrop`/`onKeyDown` reset or set it anyway | rejected |
| Masking can push the text over 15 000 characters (blind, edge) | false | AD-13: the limit applies to the canonical masked text that is sent, so the message and the disabled *Analyser* are correct | rejected |
| No mod-11 check digit (blind) | false | FR-6 defines the rule as a valid date only, recorded as a decision in the frozen intent; over-masking is the safe direction | rejected |
| `antallFjernet` counts placeholders, line and live message can differ (blind, edge) | false | Frozen decision: the line counts the placeholders in the field; the live message counts this event | rejected |
| Short-text warning mentions a file when the user pasted (blind) | false | Wording fixed by the AC and `EXPERIENCE.md`; Kevin chose 1–299 characters | rejected, spec edit |
| No `spellCheck={false}` on the CV field (blind) | low | Chrome's opt-in enhanced spell check can send field text to Google; the annonse field has the same exposure from story 1.2, and turning it off is a UX choice for the whole app | defer |
| Old message stays in the `sr-only` region (blind) | low | Rarely met in browse mode; clearing needs timers or extra state | rejected |
| Caret jumps to the end after a masked paste (edge) | low | Only when the paste contains a number; fixing needs selection handling | rejected |
| Panel falls back to state 1 on remount with an empty field (edge) | false | `CvPanel` is never remounted today; story 2.7 owns the way back to the control step | rejected |
| `ANALYSER_ID` exported from `CvPanel.tsx` (blind) | false | No caller diverges; one constant, two users | rejected |
| `medTusenskille` copied into two panels (blind) | low | Deliberate, so `Annonsepanel.tsx` stays untouched; the copies are identical | rejected |
| 15 000 and 8 000 hard-coded in messages (blind) | low | Same verdict as in story 1.2: FR-4 fixes the numbers | rejected |

## Design Notes

Masking ligger i reduceren, slik at komponentene ikke importerer `lib/kjerne`, og slik at klikk, innliming og blur kan testes uten nettleser. `relatedTarget` virker ikke i Safari, der knapper ikke får fokus ved klikk. Der maskerer blur først, og *Analyser* finner ingenting nytt. Analysen finnes ikke før story 1.6, så det har ingen følger nå. Story 1.6 må sjekke dette i Safari.

## Verification

**Commands:**
- `npm run lint && npm run typecheck && npm test && npm run build` -- alt består uten nøkkel.

**Manual checks (if no CLI):**
- `npm run dev`: lim inn `testdata`-tekst med «01019012345», se linjen, og test tastatur, 320 px og 200 % zoom. NVDA og VoiceOver tas i story 2.2 og 5.2.
