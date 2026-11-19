---
title: 'Story 2.4 del A: Testsettskriptet for leverandørvalget'
type: 'feature'
created: '2026-11-19'
status: 'in-progress'
baseline_commit: '9f457869ced87878744ab066a2228011a7ee4b1c'
route: 'dispatch'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-2-context.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** AD-11 krever at leverandøren av språkmodellen velges ved måling, men det finnes ikke noe verktøy for å kjøre testsettet mot Mistral eller OpenAI og få tall som kan sammenlignes med fasitene og sjekklisten.

**Approach:** `scripts/kjor-testsett.ts` (`npm run testsett`) kjører den ekte pipelinen for alle fire testparene tre ganger med én valgt leverandør og skriver en rapport med kategorier, belegg, nøkkelord, treffprosent, tokens, varighet og beregnet kostnad. Med i tillegg: `maxOutputTokens` i adapterne (utsatt fra 2.3).

**Avgrensning (Kevin, 2026-11-19):** Dette er del A av story 2.4. Ingen ekte API-kall og ikke noe arbeid med Vercel i denne økten. Selve målingen (del B) og oppsettet av produksjonen (del C) gjøres når gruppen har avklart betalte nøkler.

**Beslutninger (Kevin, 2026-11-19):**
- **Priser:** oppgis med `--pris-inn` og `--pris-ut` i kroner per million tokens. De er påkrevd ved ekte kjøring og valgfrie med `--mock` (standard 0). Ingen pris står i koden, og rapporten viser prisene som ble brukt.
- **Rapporter i git:** `testsett-rapporter/` committes, men aldri med API-nøkler eller andre hemmeligheter.
- **Fasit:** rapporten viser fasittabellen og sjekklistepunktene for gap og «Gjennomgående» som avkryssingsbokser ved hvert par. I tillegg teller den automatisk hvor mange av de forventede nøkkelordene i `fasit.md` modellen fant (eksakt match etter `ord()`). Tallet er merket som en hjelp, og den endelige vurderingen gjøres manuelt.
- **PR og status:** del A får en egen PR. 2-4 står som `in-progress` i `sprint-status.yaml` til del B og C er gjort.

## Boundaries & Constraints

**Always:**
- Skriptet kjører `generer("gap", …)` fra `lib/pipeline/generer.ts`, så maskering, skjema, grenser, beleggkontroll og treffprosent er de samme som i appen.
- Par 1 (demoeksempelet) måles også med den ekte modellen. Skriptet injiserer den ekte klienten som både `mock` og `ekte`.
- Skriptet setter høye `GRENSE_PER_MINUTT` og `GRENSE_PER_DOGN` i sin egen `env`, så rate-limiten ikke stopper målingen. Appens standardverdier endres ikke.
- `--leverandor mistral|openai` er påkrevd. `--modell` er valgfri (standard `STANDARD_MODELL`), `--ganger` har standard 3, og `--par` kan begrense kjøringen til ett par. Mangler nøkkelen for leverandøren, avslutter skriptet med en norsk melding uten å gjøre noe kall.
- `--mock` kjører hele flyten med `mockKlient` uten nøkkel og uten nettverk, som en tørrkjøring.
- Rapporten har commit-hash (full, fra `git rev-parse HEAD`) og om arbeidstreet har endringer, leverandør, modell, dato og prisene som er brukt (NFR-10).
- Nøkkelen og andre hemmeligheter skrives aldri til rapporten, konsollen eller loggen. Rapporten bygges bare fra flaggene, pipelinesvaret, tokens, testdata og git-metadata, aldri fra `process.env` som helhet.
- Testene kjører uten nøkkel og uten nettverk. CI kjører ikke skriptet.

**Never:**
- Ingen ekte API-kall i denne økten, og ingen endringer i Vercel.
- Ikke endre `kontrollerKrav`, `treffprosent`, prompten eller UI-et.
- Ikke ta det endelige valget av modell eller temperatur for OpenAI. Det hører til del B.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Tørrkjøring | `--leverandor mistral --mock`, ingen nøkkel | 12 kjøringer med mock-svar, rapport skrevet, utgangskode 0 | N/A |
| Ekte kjøring | nøkkel i `.env.local`, `--leverandor openai` | 12 kall mot OpenAI, rapport med tokens og kostnad per kjøring | N/A |
| Mangler nøkkel | `--leverandor mistral` uten `MISTRAL_API_KEY` | Norsk melding, ingen kall, utgangskode 1 | N/A |
| Mangler pris | ekte kjøring uten `--pris-inn` eller `--pris-ut` | Norsk melding, ingen kall, utgangskode 1 | N/A |
| Ugyldig flagg | `--leverandor foo`, `--ganger 0` eller en negativ eller ikke-numerisk pris | Norsk melding om bruk, utgangskode 1 | N/A |
| Nøkkelorddekning | fasiten for par 2 har 9 forventede nøkkelord, modellen gir 7 av dem | «7 av 9 forventede nøkkelord (78 %), hjelp, ikke vurdering» | N/A |
| Én kjøring feiler | adapteren gir `ugyldig_svar`/`llm_tidsavbrudd` | Kjøringen står i rapporten med feilkode og tokens, de andre fortsetter | Utgangskode 0, oppsummeringen teller feilene |
| Par 1 | demoeksempelet | Den ekte klienten brukes, ikke mock | N/A |
| Ett par | `--par par-2-it-support` | Bare det paret kjøres | Ukjent par gir melding og utgangskode 1 |

</frozen-after-approval>

## Code Map

- `src/lib/pipeline/generer.ts` -- `generer(resultatdel, body, env, { signal?, klienter? })`. Gjenbrukes uendret. Svaret har ikke tokens, så skriptet pakker inn den ekte klienten for å fange `inputTokens`/`outputTokens`. `generer` skriver én JSON-logglinje per kall til `console.log`.
- `src/lib/llm/klient.ts` -- `lagEkteKlient(env)`, `LlmKlient`, `LlmSvar`.
- `src/lib/llm/mock.ts` -- `mockKlient` til `--mock`.
- `src/lib/llm/leverandor.ts` -- `NOKKEL_VARIABEL`, `STANDARD_MODELL`, `nokkel()`. Gjenbrukes for flagg og nøkkelsjekk.
- `src/lib/llm/felles.ts` -- `analyseGapMed`. Legg til `maxOutputTokens`.
- `src/lib/llm/adaptere.test.ts` -- mocker `ai`. Utvid med `maxOutputTokens`.
- `src/lib/kontrakt/demo.ts` -- importerer `testdata/par-1-*/…txt?raw`. Det virker bare i Next og Vitest, så skriptet trenger en loader for `?raw`.
- `src/lib/pipeline/grense.ts` -- `GRENSE_PER_MINUTT` 10 ville stoppet 12 kall. Overstyres via `env` i skriptet.
- `testdata/par-*/{cv.txt,annonse.txt,fasit.md}` og `testdata/sjekkliste.md` -- inndata og referanse. Les `cv.txt` for alle par, også par 4.
- `vitest.config.ts` -- `include` er bare `src/**`. Legg til `scripts/**/*.test.ts`.
- `package.json` -- legg til `testsett` og `tsx` som devDependency med eksakt versjon.
- `.github/workflows/ci.yml` -- uendret. Kjører bare lint, typecheck, test og build.

## Tasks & Acceptance

**Execution:**
- [x] `package.json` -- `tsx` (eksakt versjon) og `"testsett": "tsx --conditions=react-server --import ./scripts/testsett/raw-loader.mjs --env-file-if-exists=.env.local scripts/kjor-testsett.ts"` -- `server-only` blir tom med `react-server`, og `.env.local` gir nøkkelen
- [x] `scripts/testsett/raw-loader.mjs` -- en Node-loader som gjør `*.txt?raw` om til `export default "<innhold>"` -- `lib/kontrakt/demo.ts`
- [x] `scripts/testsett/argumenter.ts` + test -- lese og validere flaggene, også `--pris-inn`/`--pris-ut` (påkrevd ved ekte kjøring, tall ≥ 0), norske meldinger -- matrisen
- [x] `scripts/testsett/kostnad.ts` + test -- kostnad per kjøring (tokens / 1 000 000 × pris) og gjennomsnitt per par -- SM-8
- [x] `scripts/testsett/fasit.ts` + test -- les tabellen «Forventet gap-analyse», linjen under «Forventede nøkkelord» og seksjonen «Forbudte påstander» fra `fasit.md` (samme overskrifter i alle fire par), og tell forventede nøkkelord som modellen fant (eksakt match etter `ord()`) -- beslutningen om fasit
- [x] `scripts/testsett/rapport.ts` + test -- Markdown-rapport: topptekst med commit, leverandør, modell, dato og priser, og én seksjon per par med fasittabell, forbudte påstander (SM-2), nøkkelorddekning, kjøringer, sjekklistepunkter som avkryssingsbokser og oppsummering. Testen sjekker at en falsk nøkkel i `env` ikke havner i rapporten -- AC, NFR-10
- [x] `testsett-rapporter/.gitkeep` -- mappen for de committede rapportene -- beslutningen om git
- [x] `_bmad-output/implementation-artifacts/sprint-status.yaml` -- 2-4 til `in-progress` -- beslutningen om status
- [x] `scripts/kjor-testsett.ts` + `scripts/testsett/kjor.test.ts` -- `kjorTestsett(valg, klient)` med injisert klient, tokenfangst, par 1 med ekte klient, feil som ikke stopper resten. Testen bruker en falsk klient og sjekker 12 kall og innholdet i rapporten -- AC
- [x] `src/lib/llm/felles.ts` + `adaptere.test.ts` -- `maxOutputTokens: MAKS_UTDATA_TOKENS` (8000) -- utsatt fra 2.3
- [x] `vitest.config.ts` -- ta med `scripts/**/*.test.ts`
- [x] `README.md` -- kort avsnitt om `npm run testsett` (flagg, nøkkel, `--mock`)
- [x] `_bmad-output/implementation-artifacts/deferred-work.md` -- marker `maxOutputTokens` som delvis lukket (verdien vurderes etter målingen)

**Acceptance Criteria:**
- Given `npm run testsett -- --leverandor mistral --mock` uten nøkkel, when skriptet kjøres, then skrives en rapport med 12 kjøringer, og ingen nettverkskall skjer.
- Given `npm test`, when testene kjøres, then er skripttestene med, og ingen av dem kaller et ekte API eller trenger nøkkel.
- Given rapporten, when den leses, then har hver kjøring kategori og belegg per krav, nedgraderte krav, nøkkelord funnet og ikke funnet, treffprosent, input- og output-tokens, varighet og kostnad, og hvert par har gjennomsnittlig kostnad og lengste varighet.

### Review Findings

Code review of PR #14 by Sondre, 2026-11-19 (blind, edge cases, verification gap, acceptance audit).

- [ ] [Review][Patch] Switch the default OpenAI model to `gpt-4.1-mini` [src/lib/llm/leverandor.ts:15, scripts/testsett/argumenter.ts:27, README.md:43] — decided by Sondre 2026-11-19: `gpt-5-mini` returns 404 `model_not_found` for an unverified organization and ignores `temperature`; `gpt-4.1-mini` works without verification and accepts temperature (AD-3). Update the test that locks in `gpt-5-mini`.
- [ ] [Review][Patch] A run where every call fails exits 0, records no cause and is saved like a real measurement [scripts/kjor-testsett.ts:199-204] — record a sanitised cause per failed run (error class and HTTP status, caught in the `medTokens` wrapper before `generer` turns it into `llm_feil`), print a warning, and return 1 when all runs fail.
- [ ] [Review][Patch] Extra or duplicated requirements are not flagged [scripts/testsett/rapport.ts] — per run, show «N krav (fasiten har M)» and mark requirements whose text repeats; the manual test showed the model listing job tasks as requirements and one requirement twice.
- [ ] [Review][Patch] Average cost labelled «minst» [scripts/testsett/kostnad.ts:25-28, scripts/testsett/rapport.ts:147,213] — an average over the known runs is not a lower bound; label it as the average of the N runs with known cost, and keep «minst» only for the total.
- [x] [Review][Defer] Report stores only the requested model name, not the model id the provider answered with [scripts/testsett/rapport.ts] — deferred: `mistral-medium-latest` is an alias, so two reports can measure different models (NFR-10); needs `LlmSvar` to carry the response model id.
- [x] [Review][Defer] Windows drive-letter fix in the script guard is never exercised by CI [scripts/kjor-testsett.ts] — deferred: CI runs on Ubuntu; move the comparison to an exported helper with a unit test.

**Rejected:**
- `false` — A throw in `generer` loses all paid runs: `generer` catches every error and returns `{ feil }`, so the loop never sees an exception.
- `false` — Token capture keeps only the last call: `generer` calls the client once per run.
- `false` — Spec `status: done` contradicts sprint status: the spec covers del A only and is done; story 2.4 stays `in-progress` for del B and C (fixing it would edit the spec).
- `low` — `kommando.test.ts` uses an internal tsx path and runs in CI: works today, a few seconds per run.
- `low` — Price 0 accepted for a real run: unlikely typo; the header shows the prices used.
- `low` — No JSON output for comparing providers: enhancement, not a defect.
- `low` — No per-requirement agreement table across the three runs: enhancement; the spec chose manual assessment.
- `low` — Cap test hard-codes 8000 twice: cosmetic.
- `low` — Report write failure after paid runs loses the measurement: unlikely; fix adds a fallback path.
- `low` — Guard misses behind symlinks, junctions or subst drives: unlikely setup.
- `low` — A `--modell` ending in `-mock` gets gitignored: unlikely name.
- `low` — Price typed with thousands separator (`1.000`): prices per million tokens are small decimals.
- `low` — Run truncated at the output cap with 0/0 tokens goes unflagged: maybe-false, would only be low.
- `low` — `?raw` loader content not observable in output: harmless for measurement.

## Implementation Notes

- **Kjøring:** `tsx@4.23.15` (eksakt). `raw-loader.mjs` bruker Nodes synkrone `module.registerHooks`, så den virker for både `import` og `require`. npm kjørte ikke postinstall-skriptet til esbuild (ikke godkjent), men tsx virker uten.
- **Nøkkelen:** `generer` får en plassholder (`"testsett"`) som nøkkel, så `lagStatus` gir ekte modus. Den ekte nøkkelen går bare til `lagEkteKlient`, som får `LLM_LEVERANDOR`, `LLM_MODELL` og nøkkelen, aldri hele `process.env`.
- **`main(argv, env, { rapportmappe })`** er eksportert og har parametere, så testene kan kjøre både feilveiene og veiene som lykkes, med en midlertidig mappe.
- **Nøkkelen sjekkes før prisene:** `lesArgumenter` tar et valgfritt `harNokkel(leverandor)`, så matriseraden «Mangler nøkkel» gir meldingen om nøkkelen også uten priser.
- **Inndata før kall:** cv, annonse og fasit for alle parene, sjekklisten og git-info leses før første kall. Feiler git, står commit som `ukjent`, og kjøringene beholdes.
- **Ukjent kostnad:** 0 tokens inn og 0 ut, eller tokens som mangler (adapteren kastet), gir ukjent kostnad. Snitt og total vises da som «minst … (N kjøringer med ukjent kostnad)». Ved `llm_tidsavbrudd` og `llm_feil` kaster adapteren, så tokenene er ukjente. Matriseraden «med feilkode og tokens» gjelder da tokens når de finnes.
- **Taket og temperaturen** (`MAKS_UTDATA_TOKENS` 8000 og `TEMPERATUR` 0.2, begge uendret) står i toppteksten og i Totalt. En kjøring med `outputTokens` på taket eller over er merket «(nådde taket for output-tokens)».
- **Ikke i spec-en:** `.gitignore` har `testsett-rapporter/*-mock.md`, så tørrkjøringer ikke committes ved en feil. Vaktsjekken for skript sammenligner stier uten forskjell på store og små bokstaver på Windows. `kommando.test.ts` kjører den ekte `testsett`-kommandoen med `--leverandor foo` (utgangskode 1) som røyktest av tsx, `react-server`, loaderen og `@/`-stiene.
- **Kontrollene:** lint, typecheck, `npm test` (705 tester i 47 filer) og build er grønne uten nøkkel. `npm run testsett -- --leverandor mistral --mock` gir 12 kjøringer og utgangskode 0. Uten nøkkel gir den «Mangler MISTRAL_API_KEY …» og utgangskode 1.

## Spec Change Log

## Review Triage Log

| # | Layer | Finding | Verdict | Route | Evidence |
|---|-------|---------|---------|-------|----------|
| 1 | blind, edge | fasit, sjekkliste and git are read after the paid calls, so a failure loses the measurement | medium | patch | `lesFasit` throws on a missing heading; `lesGit` throws without git. Both ran after or between the `generer` calls. |
| 2 | edge | Missing cv.txt/annonse.txt in a `par-*` folder throws mid-run | low | patch | Same root cause as #1 (lazy reads). Fixed by reading all inputs first. |
| 3 | blind, edge | No partial report on Ctrl-C or crash | low | reject | Unlikely in a 12-call run; the fix adds signal handling and incremental writes. |
| 4 | blind, edge | Same-minute runs overwrite a report | low | reject | 12 real calls take well over a minute; mock reports are gitignored. The fix changes the filename format in the Design Notes. |
| 5 | blind | Matrix «Mangler nøkkel» (`--leverandor mistral` without a key) gives the price message | medium | patch | `lesArgumenter` checked prices before `main` checked the key. Deviation from the frozen matrix. |
| 6 | blind, edge | Total and average cost count unknown costs as 0 | medium | patch | `totalt` summed `k ?? 0`, so the report understates the billed cost. |
| 7 | edge | 0/0 tokens from `NoOutputGeneratedError` show a known cost of 0 kr | low | patch | `felles.ts` returns 0/0 on that path. Grouped with #6 (unknown cost). |
| 8 | edge | Timed-out runs have no tokens, despite the matrix saying «med feilkode og tokens» | low | patch | The adapter throws, so the SDK gives no usage. Shown as unknown and counted in the lower bound (#6). |
| 9 | verification-gap | `Totalt` cost lines are not asserted | low | patch | Filed as defer. Patched with #6 because those lines changed. |
| 10 | blind | The report prints the name `MAKS_UTDATA_TOKENS`, not 8000, and does not mark runs at the cap | low | patch | Part B revisits the cap from this report; trivial import. |
| 11 | blind | Header lacks temperature, Node/tsx versions and a list of dirty files | low | patch (temperature) / reject (rest) | Temperature added with #10. Versions and the file list are not needed to compare providers. |
| 12 | blind | Price source and currency not recorded | low | reject | Prices in NOK by flag is Kevin's decision; the source goes in the session log. |
| 13 | blind | No automatic category comparison with the fasit | false | reject | Kevin chose option (b) without category comparison (frozen decision). |
| 14 | blind, verification-gap | The NFR-10 secret test cannot fail; `main` with a key is never tested | medium | patch | `kjorTestsett` never reads env. New `main` test with a fake key and a mocked `lagEkteKlient` checks the file and the console. |
| 15 | blind, verification-gap | The `npm run testsett` path (tsx, loader, guard, `main` success) is never run | medium | patch | Vitest resolves `?raw` itself. New `main --mock` test and subprocess smoke test `kommando.test.ts`. |
| 16 | edge | Script guard fails on Windows when the drive-letter case differs, giving exit 0 with no report | low | patch | Spec 2.3 notes the `c:` case in Git Bash. Direct fix: lowercase on win32. |
| 17 | edge | `--ganger` has no upper limit | low | reject | Operator input. The prepaid credit is the hard cap. |
| 18 | edge | `--mock=true` gives «Ukjent flagg» | low | reject | Cosmetic; the usage text shows `--mock`. |
| 19 | edge | `--modell " "` falls back to the default model | low | reject | Unlikely; the report shows the model used. |
| 20 | edge | Keyword line in the fasit spanning several lines is cut | false | reject | All four fasits have one line; `fasit.test.ts` checks the counts. |
| 21 | edge | Escaped `\|` in a fasit cell | false | reject | None of the fasits contain one. |
| 22 | edge | Duplicate expected keywords double-counted | false | reject | No duplicates in the four fasits. |
| 23 | blind | Loader handles only relative `?raw` paths and does not check the file exists | low | reject | `demo.ts` is the only `?raw` import and is relative; a missing file throws ENOENT. |
| 24 | blind | Provider 429 counted as a model failure | low | reject | Shown as `llm_feil` per run; the assessment with the checklist is manual. |
| 25 | blind | Filename uses local time, `Dato` uses UTC | low | reject | Cosmetic; both are unambiguous. |
| 26 | blind | Very small prices print as `1e-7 kr` | low | reject | Unrealistic price per million tokens. |

## Design Notes

- **Kjøring:** `tsx` fordi Node alene ikke løser `@/`-stiene. `?raw`-loaderen er det minste som trengs for at `lib/kontrakt/demo.ts` skal virke utenfor Next. Kontroller den først med `--mock`.
- **Tokens:** en innpakning rundt `LlmKlient` lagrer `inputTokens`/`outputTokens` for siste kall. `generer` endres ikke.
- **`maxOutputTokens` 8000:** demosvaret er ca. 800 tokens, og 30 krav er nok noen tusen. Resonneringsmodeller teller resonnering som utdata. Et avkuttet svar gir `ugyldig_svar`. Verdien vurderes på nytt etter målingen, ut fra høyeste `outputTokens` i rapporten.
- **Utdata:** rapporten skrives til `testsett-rapporter/<ÅÅÅÅ-MM-DD-TTMM>-<leverandor>-<modell>.md` og committes. Tørrkjøringer med `--mock` får `-mock` i filnavnet og skal ikke committes som måling. Logglinjene fra `generer` blir stående i konsollen.
- **Nøkkelorddekning:** et forventet nøkkelord regnes som funnet når `ord(forventet).join(" ")` er lik `ord(modellens).join(" ")` for et av modellens nøkkelord. Synonymer og bøyninger gir ikke treff, så tallet kan være for lavt. Det er grunnen til at vurderingen er manuell.

## Verification

**Commands:**
- `npm run lint`, `npm run typecheck`, `npm test`, `npm run build` -- expected: alle grønne uten nøkkel
- `npm run testsett -- --leverandor mistral --mock` -- expected: rapport med 12 kjøringer og utgangskode 0
- `npm run testsett -- --leverandor mistral` uten nøkkel -- expected: norsk melding og utgangskode 1

**Manual checks (if no CLI):**
- Les den tørrkjørte rapporten og sjekk at den er nyttig sammen med `sjekkliste.md`.
