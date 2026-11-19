---
title: 'Story 2.4 del B, runde 2: kategoriene etter FR-8 og sammensatte krav i prompten'
type: 'bugfix'
created: '2026-11-19'
status: 'done'
baseline_commit: '26f831eb61136827b6470cfbe9a7b5d3c072a2f2'
route: 'oneshot'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-2-context.md'
  - '{project-root}/_bmad-output/implementation-artifacts/spec-2-4-del-b-prompt-krav-og-belegg.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** I runde 1 (B2, `testsett-rapporter/2026-11-19-2057-mistral-mistral-medium-2604.md`) feilet Mistral Medium 3.5 SM-3. Tre krav fikk «Oppfylt» der fasiten har «Delvis oppfylt», i alle tre kjøringene: par 1 «Gode digitale ferdigheter» og «Nøyaktig og pålitelig», og par 4 «Selvstendig og ansvarsbevisst». I tillegg ble «God forståelse av Windows og Microsoft 365» (par 2) delt i to krav i alle kjøringene, og stillingen ble «It-brukerstøtte».

Analysen av årsakene:
- **Kategoriene (prompten):** steg 3 i `GAP_INSTRUKS` gjengir ikke FR-8. Der FR-8 krever at CV-teksten «direkte dekker» kravet for «Oppfylt», sier prompten bare «dokumenterer kravet». Prompten mangler også regelen i FR-8 om at et krav som bare står som egenvurdering, er «Delvis oppfylt». Den sier heller ikke noe om sammensatte krav, der bare én av delene er dokumentert (for eksempel «nøyaktig» og «pålitelig», «selvstendig» og «ansvarsbevisst»), eller om krav der CV-teksten selv oppgir et lavere nivå (Office «grunnleggende» mot «gode digitale ferdigheter»). Modellen fyller hullet med en raus lesing. Tvilsregelen alene er ikke nok.
- **Delte krav (kravuthentingen i prompten):** «Ett krav per punkt» kan leses som «én kvalifikasjon per krav». Modellen deler derfor et punkt med to verktøy. Den delte ikke punkter med to egenskaper, så lesingen er ustabil.
- **Stillingen (prompten):** «behold forkortelser slik de står» virker ikke når hele overskriften er skrevet med store bokstaver.
- **Ikke årsaker:** koden (pipelinen nedgraderer bare, `kontrollerKrav` fjernet 0 belegg), skjemaet og fasiten.

**Approach:** Steg 1–3 i `GAP_INSTRUKS` skrives slik at de følger FR-8 og FR-7 nøyaktig:
- definisjonene av «oppfylt» og «delvis» fra FR-8
- egenvurdering gir høyst «delvis»
- hver del av et sammensatt krav må være dokumentert for «oppfylt»
- et nivå som CV-teksten selv oppgir som lavere, gir høyst «delvis»
- hvert punkt i annonsens lister er ett krav og deles ikke opp
- forkortelser i stillingen skrives med store bokstaver

Formuleringene er nøytrale, uten eksempler fra testdataene. Det dokumenteres som runde 2.

**Beslutninger (Kevin, 2026-11-19):**
- Runde 2 gjøres nå, før OpenAI er målt. Begge leverandørene måles i runde 2 på den samme rettede prompten (SM-2: feiler én kjøring, rettes prompten, og alt kjøres på nytt). Valget tas etter AD-11 på runde 2.
- Resultatene fra runde 1 (rapportene og `vurdering-2-4-leverandorvalg-runde-1.md`) endres ikke.
- Fasiten, sjekklisten, FR-8, SM-1–SM-3 og akseptansekriteriene endres ikke.
- Ingen betalte kall, og ingen endringer i Vercel eller nøklene.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Egenvurdering | Egenskapen står bare i brukerens beskrivelse av seg selv | Instruksen sier høyst «delvis» | N/A |
| Sammensatt krav | Ett punkt med to egenskaper eller to verktøy, CV-teksten dokumenterer én | Ett krav, «delvis» | N/A |
| Lavere nivå | CV-teksten oppgir selv et lavere nivå enn kravet | Høyst «delvis» | N/A |
| Nivå ikke oppgitt | Konkrete ferdigheter uten nivåord | Vurderes ut fra det CV-teksten konkret viser, ikke automatisk nedgradert | N/A |
| Forkortelse i stillingen | Overskrift med store bokstaver som begynner med en forkortelse | Forkortelsen beholder store bokstaver | N/A |

</frozen-after-approval>

## Implementation Notes

- **Filer:**
  - `src/lib/llm/prompter/gap.ts`: bare `GAP_INSTRUKS`, steg 1–3. Reglene fra 2.3 og runde 1 beholdes.
  - `src/lib/llm/prompter/gap.test.ts`: mønstre for de nye reglene, og flere ord fra testdataene i den negative listen.
  - Dokumentasjonen: ny kopi `vurdering-2-4-leverandorvalg-runde-2.md`, kjøreboka og sesjonsloggen.
- **Ikke endret:** `kontrollerKrav`, skjemaet, `TEMPERATUR`, `MAKS_UTDATA_TOKENS`, `STANDARD_MODELL`, demosvarene (de har allerede `delvis` på de to kravene i par 1) og runde 1.
- **Kontroll:** `npm run lint`, `npm run typecheck`, `npm test`, `npm run build` og `npm run testsett -- --leverandor mistral --mock`. Alle skal være grønne uten nøkkel. Effekten av prompten kan bare måles i runde 2, etter Kevins godkjenning.
- **Etter gjennomgangen:**
  - Overskriften over reglene er «Disse reglene begrenser "oppfylt"».
  - Ved alternativer («eller») er det nok at ett av dem er dokumentert.
  - Konkret erfaring eller utdanning som viser en egenskap, er dokumentasjon.
  - Den negative lista har «nøyaktig og» (ikke «nøyaktig» alene, som prompten bruker om antallet).
- **Kontrollen:** lint, typecheck, `npm test` (797 av 797 i 48 filer), build og tørrkjøringen (12 av 12) er grønne.
- **Det som avgjør om endringen virker,** er målingen i runde 2: ingen krav over fasiten, og høyst ett under per par. Den krever Kevins godkjenning (kjøreboka for del B).
- **Sprint-status:** 2-4 står fortsatt som `in-progress` og settes ikke til `review`, fordi AK 2 og AK 3 i story 2.4 ikke er oppfylt.

## Review Triage Log

| # | Finding | Verdict | Route | Evidence |
|---|---------|---------|-------|----------|
| 1 | The parts rule does not separate «og» from «eller» alternatives | medium | patch | «Studerer økonomi eller tilsvarende» could be pushed below the fasit. A sentence on alternatives was added, with a test. |
| 2 | The self-assessment rule can drag requirements that mix a trait and experience below the fasit | medium | patch | Par 4 «Serviceinnstilt med erfaring fra kundeservice» is `O` in the fasit. A sentence was added saying that concrete experience that shows the trait is documentation, with a test. |
| 3 | The wording is tuned to the failures («profil», «to verktøy») | low | reject | «egenvurdering ... i profilen» is FR-8's own wording. «to verktøy eller to egenskaper» names categories, not testdata. The negative list covers the specific phrases. |
| 4 | The documentation promised in the spec is missing, and the runbook contradicts the decision | medium | patch | `vurdering-2-4-leverandorvalg-runde-2.md` was added, and the runbook got a new status section that replaces the old plan. Round 1 is left unchanged on purpose. |
| 5 | No behavioural test, only presence checks and mock | low | patch | A paid call is the only way to test behaviour. The round-2 measurement is named as the gate in Implementation Notes. |
| 6 | The heading «gjelder for "oppfylt"» reads as conditions for giving Oppfylt | low | patch | Reworded to «begrenser», and the order test was updated. |
| 7 | The abbreviation rule is unclear (NAV, word-like abbreviations) | false | reject | Abbreviations said as a word are written «Nav» in Norwegian, so letter-by-letter is the correct test. |
| 8 | The lower-level rule does not cover the fasit's reason for digital skills | low | reject | «direkte dekker hele kravet» and the parts rule already cover partial coverage. No change. |
| 9 | «nøyaktig» is left out of the negative list | low | patch | «nøyaktig og» was added. |
