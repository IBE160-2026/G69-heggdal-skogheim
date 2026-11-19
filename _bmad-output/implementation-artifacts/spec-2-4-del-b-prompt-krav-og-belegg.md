---
title: 'Story 2.4 del B: prompten rettes før målingen (krav, duplikater, belegg, stilling)'
type: 'bugfix'
created: '2026-11-19'
status: 'done'
baseline_commit: '082386e22592ddbf08800dc5fe28884900357cf0'
route: 'dispatch'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-2-context.md'
  - '{project-root}/_bmad-output/implementation-artifacts/spec-2-3-ekte-gap-analyse-med-spraakmodellen.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Sondres manuelle test 2026-11-19 med `gpt-4.1-mini` (`.logs/sondre-skogheim/983-…-story-2-3-ekte-gap-analyse.md`) viste fire feil i gap-analysen:
1. Arbeidsoppgaver i annonsen («Arbeidsoppgaver: …») ble tatt med som krav (9 i stedet for 6 for par 2).
2. Ett krav kom to ganger.
3. Beleggene beholder listetegnet først («- Betjente …»).
4. Stillingen står med store bokstaver, slik som annonsens overskrift («IT-BRUKERSTØTTE – DELTID FOR STUDENT»).

Feil 1 og 2 kan få «Alle krav fra annonsen er med» og kategoriene i SM-1 og SM-3 til å bli vurdert feil. Feil 3 og 4 ser feil ut for brukeren.

**Approach:** Rett prompten (`GAP_INSTRUKS`) for alle fire feilene før målingen i del B, slik at målingen bruker den rettede prompten (beslutning 3a, Kevin 2026-11-19). I tillegg fjerner pipelinen listetegn og innrykk først i hvert belegg før beleggkontrollen.

**Beslutning (Kevin, 2026-11-19):** alternativ B. Prompten rettes, og listetegn fjernes fra beleggene i koden før beleggkontrollen, uten å endre `kontrollerKrav`. Alle krav og ønsker etter FR-7 beholdes. Like krav fjernes ikke i koden. Det sikres bare i prompten.

## Boundaries & Constraints

**Always:**
- FR-7 gjelder fortsatt: alle annonsekrav, både krav og ønsker, hentes ut. Det som er kvalifikasjoner hos søkeren, er krav. Arbeidsoppgaver, det arbeidsgiveren tilbyr og praktisk informasjon er ikke krav.
- Regler fra 2.3 som ikke skal svekkes: avgrensning og ignorering av instrukser (NFR-9), ordrette belegg (FR-9), svakeste kategori ved tvil (FR-8), ingen oppdiktning (FR-27), `kravIndeks` (FR-11), bokmål (NFR-5) og råd som aldri påstår kvalifikasjonen (FR-10). De eksisterende prompttestene skal fortsatt være grønne.
- Testene kjører uten nøkkel og uten nettverk.

**Never:**
- Ingen betalte API-kall. Effekten av prompten kan bare sjekkes i målingen (kontrollen av nøkkelen og den fulle målingen), etter Kevins godkjenning.
- Ikke endre `kontrollerKrav`, `treffprosent`, `TEMPERATUR`, `MAKS_UTDATA_TOKENS`, `STANDARD_MODELL` eller skjemaet.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Arbeidsoppgaver | annonsen for par 2 med «Arbeidsoppgaver:» og «Kvalifikasjoner:» | Instruksen sier at bare kvalifikasjoner (krav og ønsker til søkeren) er krav, og at arbeidsoppgaver ikke er det | N/A |
| «En fordel» / «påkrevd» | «Kjennskap til ITIL (en fordel)», «Førerkort klasse B (påkrevd)» | Begge er fortsatt krav (FR-7: krav og ønsker) | N/A |
| Duplikater | to punkter med samme kvalifikasjon | Instruksen sier at hvert krav står én gang | N/A |
| Listetegn i belegg | CV-linjen «- Betjente kassasystem …» | Instruksen sier at listetegn og innrykk først på linjen ikke tas med i belegget | N/A |
| Stilling i store bokstaver | overskriften «IT-BRUKERSTØTTE – DELTID FOR STUDENT» | Instruksen sier at stillingen skrives med vanlig skrift (stor forbokstav) uten å endre innholdet | N/A |
| Listetegn i koden | belegg `"- Betjente kassasystem"`, `"• Kasse"`, `"  * Tok dagsoppgjør"` | Vises og lagres som `"Betjente kassasystem"`, `"Kasse"`, `"Tok dagsoppgjør"`. Beleggkontrollen gir samme resultat som før | N/A |
| Bindestrek inne i belegg | `"IT-utdanning"`, `"2024–nå"` | Uendret. Bare tegn først i belegget fjernes | N/A |
| Belegg som bare er listetegn | `"- "` | Blir tomt og fjernes som ugyldig av beleggkontrollen som før (nedgradering etter FR-9) | N/A |

</frozen-after-approval>

## Code Map

- `src/lib/llm/prompter/gap.ts` -- `GAP_INSTRUKS`, punkt 1 (stilling), 2 (krav) og 4 (belegg). Teksten utvides.
- `src/lib/llm/prompter/gap.test.ts` -- `it.each` med mønstre i systeminstruksen. Legg til mønstre for de fire reglene.
- `src/lib/pipeline/generer.ts` -- steg 5–6 (`utenDuplikater` for nøkkelord, `innenforGrensene`, `kontrollerKrav`). Her må det endres hvis 1b eller 1c velges.
- `src/lib/kjerne/treffprosent.ts` -- `ord()`. Brukes ved 1c.
- `src/lib/kjerne/demo.ts` -- `IKKE_MED` og `ER_IKKE_MED` (listetegnene). Gjenbrukes ved 1b.
- `testdata/par-2-it-support/annonse.txt`, `testdata/par-4-tokolonne-hotell/cv.txt` -- eksempler på arbeidsoppgaver og listetegn til testene.

## Tasks & Acceptance

**Execution:**
- [x] `src/lib/llm/prompter/gap.ts` -- regler i `GAP_INSTRUKS` for (1) bare kvalifikasjoner som krav, ikke arbeidsoppgaver, (2) hvert krav én gang, (3) ingen listetegn eller innrykk først i belegg, (4) stillingen med vanlig skrift -- Sondres funn
- [x] `src/lib/llm/prompter/gap.test.ts` -- ett mønster per ny regel, og de eksisterende testene fortsatt grønne -- matrisen
- [x] `src/lib/pipeline/generer.ts` + `generer.test.ts` -- fjern listetegn og innrykk (de samme tegnene som listetegnene i `IKKE_MED`/`ER_IKKE_MED` i `lib/kjerne/demo.ts`, pluss mellomrom) først i hvert belegg, etter skjemaet og grensesjekken og før `kontrollerKrav`. Bindestreker og tankestreker inne i belegget beholdes. Test alle radene i matrisen om listetegn, og at et belegg med listetegn gir samme kategori som uten -- beslutning B
- [x] `_bmad-output/implementation-artifacts/vurdering-2-4-leverandorvalg.md` -- avsnitt 6 (målerunder): noter at runde 1 bruker den rettede prompten (commit fylles inn ved målingen)

**Acceptance Criteria:**
- Given `GAP_INSTRUKS`, when den leses, then har den de fire nye reglene og alle reglene fra 2.3.
- Given `npm run lint`, `npm run typecheck`, `npm test` og `npm run build`, when de kjøres uten nøkkel, then er alle grønne.

## Implementation Notes

- Listetegnene fjernes i `utenListetegn` i `src/lib/pipeline/generer.ts` med `^[\s•▪‣◦*\-‐–—]+` (listetegnene fra `IKKE_MED` uten anførselstegn, pluss mellomrom), etter skjemaet og grensesjekken og rett før `kontrollerKrav`. Et belegg som bare er listetegn, blir tomt og telles i `fjernetBelegg` som før. Mellomrom sist fjernes også, og like belegg i samme krav står én gang (det første beholdes, i `utenLikeBelegg` etter `kontrollerKrav`, så `fjernetBelegg` teller alle ugyldige belegg). En test sjekker at alle tegnene i `LISTETEGN_FORST` også fjernes av `normaliser`.
- **Etter Sondres gjennomgang av PR #14 (2026-11-19), meldt av Kevin:**
  - `STANDARD_MODELL.openai` er endret fra `gpt-5-mini` til `gpt-4.1-mini`, også i bruksteksten, README-en og testene.
  - `main` gir utgangskode 1 når alle kjøringene feiler. Rapporten skrives likevel. Feiler bare noen av kjøringene, er utgangskoden fortsatt 0.
  - Gjennomsnittlig kostnad omtales ikke som «minst». Den vises som snittet av de kjente kostnadene, med antallet ukjente som ikke er med. Samlet kostnad er fortsatt en nedre grense («minst»).
  - Arbeidsoppgaver som krav og like krav håndteres i prompten (regel 2). Like krav fjernes ikke i koden, etter beslutning B.

## Spec Change Log

- 2026-11-19: `STANDARD_MODELL.openai` endret fra `gpt-5-mini` til `gpt-4.1-mini` etter Sondres gjennomgang av PR #14, godkjent av Kevin. Unntak fra Never-listen.
- 2026-11-19: ordlyden i prompten er gjort nøytral etter den fulle gjennomgangen, uten eksempler fra testdataene («Arbeidsoppgaver», «en fordel», «førerkort», «(for eksempel IT)», «nattskift»). Regelen om vilkår er snevret inn: bare vilkår annonsen uttrykkelig krever av søkeren, er krav, mens beskrivelser av selve stillingen (arbeidstid, vakter, stillingsprosent) ikke er det. Regel 4 sier nå bare at listetegn og innrykk først i belegget ikke tas med. Like belegg i samme krav fjernes etter `kontrollerKrav`, så `fjernetBelegg` teller som før.

## Review Triage Log

| # | Layer | Finding | Verdict | Route | Evidence |
|---|-------|---------|---------|-------|----------|
| 1 | edge, blind | The same belegg can appear twice in one requirement after stripping, and trailing whitespace is kept | low | patch | `["- Kasse","Kasse"]` became `["Kasse","Kasse"]`. Now deduplicated (first kept) and trimmed. |
| 2 | verification-gap, blind | Dash-type and rare bullets untested, and `LISTETEGN_FORST` copied by hand from `IKKE_MED` | low | patch | Narrowing the class kept every test green. Rows for – — ‐ ▪ ‣ ◦ and a drift test against `normaliser` added. |
| 3 | blind | Rule 4 says «ordrett, tegn for tegn» and then «drop list markers» | medium | patch | Two conflicting orders to the model. Reworded into one rule. |
| 4 | blind | Rule 2 excludes «praktisk informasjon» without saying that conditions the applicant must meet are requirements | medium | patch | Risk of dropping real requirements (FR-7). Rule clarified, without examples from the testdata. |
| 5 | blind | The measurement cannot show whether the prompt fix worked | low | patch | Rows for number of requirements, duplicates/work tasks and job-title case added to the template. |
| 6 | edge, blind | Numbered list markers («1. », «a) ») are not stripped | low | reject | The testdata CVs use only - and *. The fix adds regex complexity for an unlikely case. |
| 7 | blind | Leading quote marks not handled | low | reject | A quote mark can belong to the CV text; stripping it would be guessing. |
| 8 | edge | Inner «\n- » markers in multi-line belegg are kept | low | reject | Belegg are short phrases by rule 4; unlikely. |
| 9 | edge | The «- » only test passes even without `utenListetegn` | low | reject | Other rows fail without the stripping. |
| 10 | blind | The capital-letter rule conflicts with keeping abbreviations | low | reject | The rule names the exception (IT). An example from the testdata would bias the measurement. |
| 11 | blind | Stale Code Map, status and ACs in the spec | low | reject | The fix edits this build's spec. |
| 12 | blind | Tests do not use real testdata lines | low | reject | The synthetic CV covers the same formats. |
| 13 | blind | No prompt version in the run | false | reject | The report has the full commit hash and flags a dirty tree, so the prompt is fixed by the commit. |
| 14 | blind | Test name overstates what is checked | low | reject | Cosmetic. |

## Verification

**Commands:**
- `npm run lint`, `npm run typecheck`, `npm test`, `npm run build` -- expected: alle grønne uten nøkkel

**Manual checks (if no CLI):**
- I kontrollen av Mistral-nøkkelen (par 2, én kjøring, etter Kevins godkjenning): 6 krav, ingen duplikater, ingen listetegn først i beleggene og stillingen med vanlig skrift.
