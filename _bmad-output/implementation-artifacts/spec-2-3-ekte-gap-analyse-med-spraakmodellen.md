---
title: 'Story 2.3: Ekte gap-analyse med språkmodellen'
type: 'feature'
created: '2026-11-18'
status: 'done'
baseline_commit: 'e834c3882bcf4c593bdfbd437bfcda4f2a016e4e'
route: 'dispatch'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-2-context.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Bare demoeksempelet gir en gap-analyse. *Analyser* med egen CV gir ingenting i appen, og API-et svarer `llm_feil` fordi den ekte adapteren er en plassholder.

**Approach:** Adaptere for Mistral og OpenAI med AI SDK bak porten `LlmKlient`, en prompt i `lib/llm/prompter/`, rate-limit i minnet i pipelinen, og *Analyser* med egen CV i ekte modus som starter en kjøring som i 2.2. Med i tillegg: de tre utsatte punktene fra 2.1 og språkmerknaden fra FR-4.

**Beslutninger (Sondre, 2026-11-18):** Story-fila holdes samlet (ca. 2 800 tokens). Standardmodellene og avvisning av svar over grensene i Design Notes er godkjent.

## Boundaries & Constraints

**Always:**
- Pakkene `ai@7.0.162`, `@ai-sdk/mistral@4.0.79` og `@ai-sdk/openai@4.0.108`, med eksakte versjoner som i arkitekturen.
- Adapterne følger AD-3: `generateText` med `Output.object`, `instructions`, `maxRetries: 0`, `temperature` 0–0,3 og et `abortSignal`. Mistral har `strictJsonSchema: true`. `LLM_LEVERANDOR` (standard `mistral`) og `LLM_MODELL` velger leverandør og modell.
- `analyseGap` tar inn et `AbortSignal`. Pipelinen kombinerer `request.signal` med `AbortSignal.timeout(45000)`, og et avbrudd gir `llm_tidsavbrudd`.
- Prompten avgrenser CV-teksten og annonsen som data og sier at instrukser i dem skal ignoreres. Den krever ordrette belegg, svakeste kategori ved tvil, ingen påfunne kvalifikasjoner, `kravIndeks` til ett krav eller `null`, og bokmål.
- Rate-limit (AD-9): én teller i minnet, `GRENSE_PER_MINUTT` (standard 10) og `GRENSE_PER_DOGN` (standard 200, UTC-døgn). Hver ekte generering telles i steg D uansett utfall. Demo telles ikke, og ingen identifikator brukes.
- Ingen test kaller et ekte API. Testene kjører uten nøkkel.

**Never:**
- Ingen måling, `npm run testsett` eller endelig modellvalg (2.4). Ingen *Prøv igjen* eller meldingstabell (2.5).
- Nøkkelen havner aldri i klienten, i loggen eller i git.
- Endre ikke `kontrollerKrav`, `treffprosent` eller UI-et fra 2.2, bortsett fra det som står i Tasks.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Egen CV, ekte modus | nøkkel, gyldige tekster, avkrysning | *Analyser* setter `kjoring` med `erEksempel: false` og maskert CV, resultatet vises som i 2.2 | N/A |
| Egen CV, demomodus | ingen nøkkel | Varselet fra FR-26 som før, ingen request | N/A |
| Demoeksempelet, ekte modus | nøkkel | Mock som før, telles ikke | N/A |
| Grense nådd | 11. generering samme minutt eller 201. samme døgn | 429 `grense_naadd` før adapteren | `Alert` med teksten fra 2.2 |
| Tidsavbrudd | adapteren bruker over 45 s | 504 `llm_tidsavbrudd` | Meldingen fra 2.2 |
| Ugyldig svar | modellen svarer utenfor skjemaet | 502 `ugyldig_svar` | Meldingen fra 2.2 |
| Svar over grensene | over 30 krav, 10 belegg per krav eller 40 nøkkelord, eller for lange tekster | 502 `ugyldig_svar` | Som over |
| Duplikate nøkkelord | samme nøkkelord to ganger (små og store bokstaver, bindestrek), eller tomt | Telles én gang, tomme fjernes | N/A |
| Ukjent `LLM_LEVERANDOR` | for eksempel `foo` | Mistral brukes, som i `lagStatus` | N/A |

</frozen-after-approval>

## Code Map

- `src/lib/llm/klient.ts` -- `LlmKlient`, `GapInndata` og plassholderen `ekteKlient`. Erstatt plassholderen med `lagEkteKlient(env)`. Legg `signal` til i `GapInndata`.
- `src/lib/llm/mock.ts` -- mock-klienten, uendret bortsett fra ny signatur.
- `src/lib/pipeline/generer.ts` -- `generer(resultatdel, body, env, klienter?)`, steg i AD-4 og `erTidsavbrudd`. Legg til rate-limit som steg D, grensesjekken etter `gapSvar` og deduplisering før `finnNokkelord`. `generer` får også `signal`.
- `src/lib/pipeline/status.ts` -- `lagStatus` og tabellen `LEVERANDORER`. Gjenbruk valget av leverandør, så status og adapter alltid er like.
- `src/lib/kontrakt/gap.ts` -- `gapSvar`, `nokkelordSvar` og `GRUNNLAG_GRENSER`. `forklaring` og `raad` er `.optional()`. Strikt JSON-skjema krever at alle felt finnes, så skjemaet til modellen bruker `nullable`, og `null` blir gjort om til `undefined` før `gapSvar`.
- `src/lib/kjerne/treffprosent.ts` -- `ord()` er normaliseringen som brukes til deduplisering.
- `src/app/api/generer/[resultatdel]/route.ts` -- send `request.signal` videre.
- `src/lib/okt/tilstand.ts` -- `analyser()`. Egen CV i ekte modus gir `medKjoring(…, false)`.
- `src/components/CvPanel.tsx`, `Annonsepanel.tsx` -- merknaden under overskriften.
- `_bmad-output/planning-artifacts/ux-designs/ux-G69-heggdal-skogheim-2026-10-30/EXPERIENCE.md` -- legg merknaden inn i mikroteksten.
- `.env.example` -- har alle variablene allerede.
- `testdata/robusthet/annonse-med-instruks.txt` -- brukes i en prompttest (avgrensning og instruks) og i den manuelle testen.
- `_bmad-output/implementation-artifacts/deferred-work.md` -- de tre punktene fra 2.1 (AbortSignal, grenser, duplikater) lukkes her.

## Tasks & Acceptance

**Execution:**
- [x] `package.json` -- installer de tre pakkene med eksakte versjoner -- AD-3
- [x] `src/lib/llm/prompter/gap.ts` + test -- systeminstruks og brukermelding med avgrensede data -- FR-7–FR-11, FR-27, NFR-5, NFR-9
- [x] `src/lib/llm/mistral.ts`, `openai.ts`, `klient.ts` + `adaptere.test.ts` -- adapterne og `lagEkteKlient(env)`. Testen mocker `ai` og sjekker innstillingene og at `null` blir `undefined` -- AD-3
- [x] `src/lib/pipeline/grense.ts` + test -- telleren med injisert klokke og `nullstill` for tester -- AD-9, NFR-3
- [x] `src/lib/pipeline/generer.ts` + test -- steg D, `signal`, grensesjekk og deduplisering. Testene injiserer klienter, så ingen nettverkskall skjer -- AD-4, NFR-3, FR-12
- [x] `src/app/api/generer/[resultatdel]/route.ts` + test -- `request.signal` -- AD-5
- [x] `src/lib/okt/tilstand.ts` + test -- kjøring for egen CV i ekte modus -- FR-7
- [x] `src/components/CvPanel.tsx`, `Annonsepanel.tsx` + tester, `EXPERIENCE.md` -- merknaden om språk -- FR-4

**Acceptance Criteria:**
- Given prompten, when den bygges med `annonse-med-instruks.txt`, then står CV-teksten og annonsen mellom tydelige avgrensere, og instruksen om å ignorere instrukser i dataene står i systeminstruksen.
- Given en ekte generering, when den logges, then har logglinjen `inputTokens` og `outputTokens` fra adapteren, og ingen nøkkel eller tekst.
- Given `npm run lint`, `npm run typecheck`, `npm test` og `npm run build`, when de kjøres uten nøkkel, then er alle grønne.

## Implementation Notes

- **Leverandørvalget** er flyttet til `src/lib/llm/leverandor.ts` (`velgLeverandor`, `nokkel`, `modell`, standardmodellene). `lagStatus` og `lagEkteKlient` bruker begge dette, så pipeline → llm er avhengighetsretningen.
- **Felles adapterkall** i `src/lib/llm/felles.ts` (`analyseGapMed`, `gapModellSkjema`, `TEMPERATUR = 0.2`). `mistral.ts` og `openai.ts` gir bare modell og `providerOptions` (`strictJsonSchema: true` for begge). `NoObjectGeneratedError`/`NoOutputGeneratedError` gir `svar: undefined` med tokenene, så pipelinen svarer `ugyldig_svar` og logger tokenene.
- **`generer`** har signaturen `generer(resultatdel, body, env, { signal?, klienter? })`. Uten `klienter` lages `lagEkteKlient(env)` per kall. Avbrytes signalet til adapteren (tidsgrense eller `request.signal`), blir feilen `llm_tidsavbrudd` uansett hvordan adapteren pakker den inn.
- **Grensesjekken** gjøres etter dedupliseringen, så grensen på 40 nøkkelord gjelder unike nøkkelord. Krav, belegg og tekstlengder sjekkes mot det rå svaret.
- **Merknaden om språk** er komponenten `src/components/SpraakMerknad.tsx`, brukt i begge tilstandene i CV-panelet og i annonsepanelet.
- **Prompten** bruker avgrenserne `<<<CV_START>>>` osv. Avgrensere i dataene fjernes (gjentatt til ingen er igjen), så teksten ikke kan lukke sin egen blokk.
- **Kjente forhold:** `gpt-5-mini` er en resonneringsmodell. AI SDK kan ignorere `temperature` for den med en advarsel. Det avklares i målingen i 2.4. I Git Bash med `c:` som stasjonsbokstav feiler Vitest («failed to find the runner»). Kjør testene fra PowerShell eller med `C:`.

## Spec Change Log

## Review Triage Log

| # | Layer | Finding | Verdict | Route | Evidence |
|---|-------|---------|---------|-------|----------|
| 1 | verification-gap | 40-keyword limit after dedupe untested | low | patch | No test sends >40 raw keywords that dedupe to ≤40. |
| 2 | verification-gap, edge | `NoOutputGeneratedError` branch untested, and it hides an abort as `ugyldig_svar` | low | patch | Branch never exercised; an aborted call returns `svar: undefined` instead of surfacing the timeout. |
| 3 | edge, blind | Delimiter stripping matches exact strings only and glues words together | medium | patch | `<<< CV_SLUTT >>>` and lowercase variants pass through to the model (NFR-9); deleting a delimiter between words makes the model's text differ from `kanonisk`. |
| 4 | edge, blind | `GRENSE_PER_*=0` blocks every real generation | low | patch | `^\d+$` accepts 0; direct fix. |
| 5 | edge | Already-aborted request takes a rate-limit slot | low | patch | `taPlass` runs before any signal check; direct fix. |
| 6 | blind, verification-gap | OpenAI `providerOptions` not asserted | low | patch | Test omits it; trivial assertion. |
| 7 | blind, edge | No `maxOutputTokens`, unbounded free-text lengths | medium | defer | A runaway answer is billed until the 45 s timeout; the cap depends on the model chosen in 2.4 (reasoning tokens count as output). |
| 8 | blind | `gpt-5-mini` ignores `temperature`, breaking AD-3 for OpenAI | medium | defer | Default model choice is settled by the 2.4 measurement. |
| 9 | edge | `LLM_MODELL` for the other provider fails every call | low | reject | Operator misconfiguration, visible on the first call; 2.4 sets both variables together. |
| 10 | blind | Client disconnect logged as `llm_tidsavbrudd` | low | reject | No error code exists for a client abort and nobody sees the response; the 2.4 measurement uses the test-set script, not logs. |
| 11 | blind | Dedupe keeps the first entry even when a later one has `kravIndeks` | low | reject | Unlikely; fix adds merge logic. |
| 12 | blind, edge | Size check runs after dedupe | false | reject | Intended; recorded in Implementation Notes. |
| 13 | blind | Language note says «Resultatet er alltid på bokmål» though quotes keep the original language | false | reject | Text is fixed verbatim by the story's AC and EXPERIENCE.md. |
| 14 | blind | Real client built per request | low | reject | Factory is cheap and makes no network call. |
| 15 | blind | 45 s timer not cleared on success | false | reject | `AbortSignal.timeout` holds no work after the request ends. |
| 16 | blind | AI SDK packages pinned exactly | false | reject | Exact versions are required by the spec and AD-3. |
| 17 | edge | `C`, `C++`, `C#` dedupe to one keyword | low | reject | Same normalisation as addendum D's treffprosent, which already treats them alike. |

## Design Notes

- **Standardmodeller til 2.4:** `mistral-medium-latest` og `gpt-5-mini` når `LLM_MODELL` ikke er satt. Målingen i 2.4 bestemmer den endelige modellen.
- **Grenser på svaret:** et svar over `GRUNNLAG_GRENSER` avvises som `ugyldig_svar` i stedet for å kuttes. Kutting ville skjult krav for brukeren uten at det synes. Grensene sjekkes i pipelinen, ikke i skjemaet til modellen, fordi strikt JSON-skjema ikke støtter alle grensene.
- **Deduplisering:** nøkler fra `ord(tekst).join(" ")`. Den første forekomsten beholdes, og tomme nøkkelord fjernes før treffprosenten regnes ut.
- **Telling:** telleren sjekker og teller i samme steg, før adapteren. En avvist generering telles ikke.

## Verification

**Commands:**
- `npm run lint`, `npm run typecheck`, `npm test`, `npm run build` -- expected: alle grønne uten nøkkel

**Manual checks (if no CLI):**
- Med nøkkel i `.env.local`: *Analyser* med CV-en og annonsen fra par 2 gir en gap-analyse på bokmål innen 30 s, og CV-en fra par 1 med `annonse-med-instruks.txt` gir ingen AFR eller bankerfaring.
