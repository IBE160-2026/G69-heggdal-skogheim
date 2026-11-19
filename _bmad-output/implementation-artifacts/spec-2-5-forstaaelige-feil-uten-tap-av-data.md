---
title: 'Story 2.5: Forståelige feil uten tap av data'
type: 'feature'
created: '2026-11-19'
status: 'done'
baseline_commit: 'ab458158396776bf1cef018651e5bc8f154007d3'
route: 'dispatch'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-2-context.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Feil i gap-fanen viser en midlertidig melding fra 2.2 uten *Prøv igjen*, og koder som `demo_krever_nokkel` og `for_lang_tekst` får feil tekst. Feilmeldingene for filer ligger spredt i `lib/okt` og `CvPanel`.

**Approach:** Én meldingstabell i UI-et for alle feilkoder og filfeil (AD-8). Gap-fanen viser `Alert` med `role="alert"`, og *Prøv igjen* der det hjelper. *Prøv igjen* starter gap-analysen på nytt for samme kjøring, uten tap av tekst. Hvert tilfelle i FR-22 fremkalles i test (SM-7).

**Beslutninger (Sondre, 2026-11-19):** Story-fila holdes samlet (ca. 2 300 tokens). De nye meldingene i Design Notes er godkjent.

## Boundaries & Constraints

**Always:**
- Én tabell (for eksempel `src/components/feilmeldinger.tsx`) gir melding og om *Prøv igjen* vises, for de åtte API-kodene og tre filfeil: avvist fil, fil som ikke kan leses, og nesten ingen tekst. Mikroteksten er ordrett som i EXPERIENCE.md der den finnes der.
- *Prøv igjen* vises bare for `llm_feil`, `llm_tidsavbrudd` og `ugyldig_svar`. Den kaller `startGenerering("gap")` og gir fokus til fanepanelet (`tabIndex=-1`).
- CV-teksten, annonsen og kjøringen beholdes ved feil og ved *Prøv igjen*.
- Feil vises aldri som toast.
- Testnavn starter med FR-, NFR-, UX-DR-, AD- eller SM-ID.

**Never:**
- Ingen nye feilkoder, og ingen endring i `lib/kjerne`, `lib/llm` eller API-et. Pipelinen kan bare få tester.
- Ingen redigering, kopiering eller *Generer på nytt* (2.6). Ingen *Endre CV-tekst* eller *Ny analyse* (2.7).
- Lengdemeldingene i panelene (FR-4) endres ikke. De er feltvalidering og dekker FR-22 for for lang og for kort tekst.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Feil fra språkmodellen | 502 `llm_feil` | `Alert` med `role="alert"`: «Språkmodellen svarte ikke. Teksten din er tatt vare på. Prøv igjen.» og *Prøv igjen* | N/A |
| Tidsavbrudd | 504 eller `llm_tidsavbrudd` | Som over | N/A |
| Ugyldig svar | `ugyldig_svar` | «Svaret fra språkmodellen kunne ikke brukes. Prøv igjen.» og *Prøv igjen* | N/A |
| Nettverk eller ikke JSON | fetch feiler | `llm_feil` som over | N/A |
| *Prøv igjen* | gap `feil` | Én ny POST for samme kjøring, fokus til fanepanelet, skjelett, og så resultatet | Ny feil vises på nytt |
| Grense nådd | 429 `grense_naadd` | Teksten fra EXPERIENCE l.121 og knappen *Prøv med eksempel*, ingen *Prøv igjen* | N/A |
| Kreditten er brukt opp | adapteren kaster (for eksempel 429 `insufficient_quota`) | `llm_feil`, ikke `grense_naadd`. *Prøv med eksempel* virker fortsatt | N/A |
| Demo krever nøkkel | 403 `demo_krever_nokkel` | Teksten fra demovarselet og *Prøv med eksempel*, ingen *Prøv igjen* | N/A |
| Tekst eller inndata avvist av serveren | `for_lang_tekst`, `for_kort_tekst`, `ugyldig_inndata` | Egen melding fra tabellen, ingen *Prøv igjen* | N/A |
| Filfeil | avvist fil, fil som ikke kan leses, nesten ingen tekst | Samme tekster som i dag, nå fra tabellen | N/A |

</frozen-after-approval>

## Code Map

- `src/components/GapAnalyseFane.tsx:71-89, 367-374` -- `feilmelding()` (midlertidig fra 2.2) og `Alert` uten knapp. Erstatt med tabellen og legg til knappene.
- `src/components/Resultat.tsx:96-102` -- `TabsContent` for gap. Gi den `tabIndex={-1}` og en id eller ref, så *Prøv igjen* kan flytte fokus dit.
- `src/lib/okt/OktProvider.tsx:69-120` -- `startGenerering` ligger i `useOkt()`. Vakten stopper bare en aktiv request, så et nytt kall etter `feil` går gjennom. `genereringStartet` krever ikke `venter`. Ingen endring trengs, bare tester.
- `src/lib/okt/generer.ts` -- fetch-innpakningen gir allerede kodene etter AD-8. Den har tester i `generer.test.ts`.
- `src/lib/okt/cvFil.ts:13-14` -- `FIL_AVVIST`. Flytt teksten til tabellen, så `lib/okt` bare gir utfallet.
- `src/components/CvPanel.tsx:186-195, 267-271, 277-286` -- meldingene for avvist fil, lesefeil og kort tekst. Hent tekstene fra tabellen.
- `src/components/ProvEksempelKnapp.tsx` -- gjenbrukes i varselet for `grense_naadd` og `demo_krever_nokkel`.
- `src/lib/pipeline/generer.ts` + `generer.test.ts` -- legg til en test: adapteren kaster en feil med `statusCode: 429` og gir `llm_feil`, og demoeksempelet virker etterpå.
- `src/components/GapAnalyseFane.test.tsx:262-276`, `Resultat.test.tsx:126`, `CvPanel-fil.test.tsx` -- dagens feiltester. Utvid dem og hold dem grønne.
- `_bmad-output/planning-artifacts/ux-designs/ux-G69-heggdal-skogheim-2026-10-30/EXPERIENCE.md` -- legg de nye meldingene inn i tabellen over tilstander.

## Tasks & Acceptance

**Execution:**
- [x] `src/components/feilmeldinger.tsx` + test -- tabellen med alle koder og filfeil, og `provIgjen` -- AD-8, FR-22
- [x] `src/components/GapAnalyseFane.tsx`, `Resultat.tsx` + tester -- `Alert` fra tabellen, *Prøv igjen* med fokus til panelet, og *Prøv med eksempel* der tabellen sier det -- UX-DR20, UX-DR24
- [x] `src/lib/okt/cvFil.ts`, `src/components/CvPanel.tsx` + tester -- filmeldingene fra tabellen, med samme tekster -- FR-22
- [x] `src/lib/okt/OktProvider.test.tsx` -- *Prøv igjen* etter `feil` sender én ny POST for samme kjøring og forkaster ikke svaret -- AD-6
- [x] `src/lib/pipeline/generer.test.ts` -- brukt kreditt gir `llm_feil`, og demo virker etterpå -- NFR-3
- [x] `EXPERIENCE.md` -- de nye meldingene -- FR-22

**Acceptance Criteria:**
- Given hvert tilfelle i FR-22, when det fremkalles i test (API-feil med mock-fetch eller mock-klient, filfeil med de eksisterende filene), then gir det riktig kode og melding, teksten i feltene er urørt, og appen krasjer ikke (SM-7).
- Given en feil i fanen, when den vises, then finnes ingen toast, og live-regionen gjentar ikke feilen.
- Given `npm run lint`, `npm run typecheck`, `npm test` og `npm run build`, when de kjøres, then er alle grønne.

## Implementation Notes

- `TabsContent` får `tabIndex={-1}`, men ingen egen id: Radix setter id-en som fanen peker på med `aria-controls`, og en egen id ville brutt koblingen. *Prøv igjen* finner panelet med `closest("[role=tabpanel]")` fra varselet.
- `avvisCvFil` gir nå `boolean`, og `lesCvFil` gir `{ type: "avvist" }` uten melding. `FIL_AVVIST` er fjernet fra `lib/okt`.
- Varselet i forberedelsen (`AnalyserKnapp`) henter også teksten for `demo_krever_nokkel` fra tabellen, så teksten bare står ett sted.
- En `gap` med `feil` uten feilkode vises som `llm_feil`.
- `scripts/testsett/kommando.test.ts` feiler lokalt fordi `tsx` mangler i `node_modules` (det feiler også på baseline). `npm install` retter det.

## Spec Change Log

## Review Triage Log

| # | Layer | Finding | Verdict | Route | Evidence |
|---|-------|---------|---------|-------|----------|
| 1 | blind, edge | Limits 15 000 / 8 000 / 200 hard-coded in messages and tests | low | patch | `grenser.ts` exports the constants; a changed limit would show the wrong number without failing. |
| 2 | verification-gap, blind, edge | «No toast» assertion can never fail | low | patch | No toaster exists in the app; direct deletion. |
| 3 | blind | Provider credit used up gives `llm_feil` with *Prøv igjen* but no pointer to the example | medium | defer | Retrying cannot help while the credit is spent; telling quota exhaustion apart, or adding *Prøv med eksempel* to `llm_feil`, is a UX decision for production (2.4). |
| 4 | blind, edge | Panel `tabIndex={-1}` removes it from the Tab order in every state | false | reject | EXPERIENCE.md's focus table specifies the panel with `tabindex="-1"`; the result and error views contain focusable controls. |
| 5 | blind, edge | `for_kort_tekst` names only the ad, though the server also sends it for an empty CV | low | reject | Unreachable from the UI, which blocks an empty CV before sending; text approved by Sondre. |
| 6 | blind | «Prøv igjen» may be read twice inside `role="alert"` | low | reject | EXPERIENCE.md puts the button in the Alert; the effect depends on the screen reader. |
| 7 | blind | User text lost via *Prøv med eksempel* from an error | false | reject | `ProvEksempelKnapp` opens the replace dialog whenever a run exists. |
| 8 | blind | Double click on *Prøv igjen* sends extra requests | false | reject | `startGenerering`'s guard skips a call while a request for the same run is active. |
| 9 | blind, edge | Focus fallback when no tabpanel ancestor or when `startGenerering` returns early | low | reject | `Feil` only renders inside `Resultat`'s panel, and a run always exists there. |
| 10 | blind | Diff omits the documents | false | reject | Diff deliberately limited to `src`. |
| 11 | blind | Tone regex weak and one test repeats another | low | reject | Cosmetic. |
| 12 | blind | No component test that `CvPanel` renders the table texts | false | reject | `CvPanel-fil.test.tsx` and `CvPanel.test.tsx` assert the exact texts. |

## Design Notes

- **Nye meldinger** (følger regelen «hva som skjedde, så hva du kan gjøre»):
  - `llm_tidsavbrudd` bruker samme tekst som `llm_feil`. EXPERIENCE.md har én rad for «feil eller tidsavbrudd».
  - `demo_krever_nokkel`: «Full analyse av din egen CV krever en API-nøkkel. Prøv eksempelet for å se hvordan resultatet ser ut.» Samme tekst som demovarselet.
  - `for_lang_tekst`: «Teksten er for lang til å analyseres. CV-en kan være maks 15 000 tegn og annonsen maks 8 000. Gå tilbake og kort ned teksten.»
  - `for_kort_tekst`: «Teksten er for kort til å analyseres. Annonsen må være minst 200 tegn. Gå tilbake og legg til mer.»
  - `ugyldig_inndata`: «Teksten kunne ikke sendes til analyse. Gå tilbake og trykk *Analyser* på nytt.»
- Med «Gå tilbake» menes den midlertidige knappen «Tilbake» til 2.7, som bytter den ut med *Endre CV-tekst*.
- **Kreditt brukt opp:** leverandøren svarer 429 og adapteren kaster. Det skal bli `llm_feil` og ikke `grense_naadd`, fordi `grense_naadd` er vår egen myke grense.

## Verification

**Commands:**
- `npm run lint`, `npm run typecheck`, `npm test`, `npm run build` -- expected: alle grønne

**Manual checks (if no CLI):**
- I nettleseren, med nøkkel: sett `LLM_MODELL=finnes-ikke` i `.env.local`. *Analyser* med par 2 skal gi meldingen og *Prøv igjen*, og *Prøv med eksempel* skal virke etterpå. Fjern linjen etter testen.
