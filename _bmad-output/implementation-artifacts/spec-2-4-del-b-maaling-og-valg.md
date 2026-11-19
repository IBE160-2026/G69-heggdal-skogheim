---
title: 'Story 2.4 del B: forberedelse av målingen og leverandørvalget'
type: 'feature'
created: '2026-11-19'
status: 'done'
baseline_commit: '958c1eddd836ce22b5f270234d2f24717c7d02eb'
route: 'dispatch'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-2-context.md'
  - '{project-root}/_bmad-output/implementation-artifacts/spec-2-4-velge-leverandor-ved-maaling.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Del B (AK 2 i story 2.4) krever at testsettet kjøres mot Mistral og OpenAI og vurderes med sjekklisten. Det finnes ennå ingen betalte nøkler. Rapporten fra del A viser bare modellnavnet fra `--modell`. Et alias som `mistral-medium-latest` kan bytte modell uten varsel, så en måling kan ikke spores til den faktiske modellen (NFR-10). Gruppen har heller ingen samlet fremgangsmåte, og ingen oversikt over vilkår og priser å bekrefte.

**Approach:** Gjør alt som kan gjøres uten nøkler: (1) rapporten viser modellversjonen leverandøren faktisk svarte med (`response.modelId` i AI SDK), (2) en kjørebok for målingen, og (3) en oversikt over vilkår og priser med kilder, merket som må bekreftes. Målingen, vurderingen og valget gjøres når nøklene finnes. Del B er ikke ferdig før det.

**Beslutninger (Kevin, 2026-11-19):**
- «1 kr per kjøring» vurderes som gap × 4.
- OpenAI måles med `gpt-5-mini`, og unntaket for temperaturen noteres.
- Feiler begge leverandørene på samme punkt, rettes prompten, og begge måles på nytt. Feiler bare Mistral, velges OpenAI.
- Kevin og Sondre vurderer og bestemmer sammen.
- Vurderingsmalen `vurdering-2-4-leverandorvalg.md` er godkjent.
- **Mistral-modell:** den nyeste Medium-modellen med datobestemt navn, ikke et alias. Kjøreboka sier hvor navnet finnes, og det skal ikke gjettes.
- **Resonnering for `gpt-5-mini`:** standardinnsatsen, uten kodeendring. Svartid, tokens og kostnad vurderes etter målingen.
- **Kontoene (Kevin og Sondre, 2026-11-19):** ingen betalte nøkler ennå. Kevin ordner betalt API hos Mistral med et budsjett på ca. 5–10 EUR, uten automatisk påfylling. Sondre ordner OpenAI API med ca. 5 USD i kreditt, med automatisk påfylling slått av. Totalt under 200 kr.
- **Status for kontoene (Kevin, 2026-11-19, senere samme dag):**
  - Kevin har betalt API-tilgang hos Mistral med 10 USD i kreditt og automatisk påfylling slått av. Nøkkelen ligger i `MISTRAL_API_KEY` i `.env.local` i prosjektroten (ignorert av git, bekreftet med `git check-ignore`). Nøkkelen skal aldri leses, skrives ut eller deles.
  - Sondre har ansvaret for OpenAI-nøkkelen, og den ventes fortsatt til målingen.
- **Del A er flettet:** PR #14 (`a75c41f`) ligger i `main`.
- **Funn fra Sondre 2026-11-19** (logget i `.logs/sondre-skogheim/`, ikke en del av målingen etter AD-11):
  - `gpt-5-mini` gir 404 uten en verifisert organisasjon hos OpenAI, mens `gpt-4.1-mini` virker og tar imot temperaturen.
  - Manuell test med `gpt-4.1-mini`: par 2 og NFR-9 bestått.
  - Kvalitetsfunn i prompten: arbeidsoppgaver tas med som krav, ett krav kommer to ganger, beleggene har listetegn, og stillingen står med store bokstaver.
  - Beslutningen om OpenAI-modellen ovenfor må tas på nytt før målingen.
- **Nye beslutninger (Kevin, 2026-11-19), som erstatter beslutningene over der de er i strid:**
  - **OpenAI:** `gpt-4.1-mini`. Den virker hos Sondre og tar imot temperaturen, så det trengs ikke noe unntak fra AD-3. Beslutningene over om `gpt-5-mini` og resonneringsinnsatsen gjelder ikke lenger.
  - **Mistral:** foreløpig måles begge, Medium og Large 4 (alternativ C). Det endelige modellvalget tas etter en anbefaling ut fra modelloversikten og prisene.
  - **Prompten:** de fire kjente feilene fra Sondre rettes først i en egen `bmad-build` med egen spec, før målingen.
  - **Utfall regelen ikke dekker:**
    - Feiler begge leverandørene, rettes prompten, og begge måles på nytt.
    - Holder ikke vilkårene hos OpenAI, stopper vi og diskuterer med Sondre.
    - En leverandør som feiler NFR-9 eller NFR-4, kan ikke velges uten en egen beslutning.
  - **Modellene som måles (Kevin, 2026-11-19):**
    - Mistral Medium 3.5 (`mistral-medium-2604`), Mistral Large 4 (`mistral-large-4-0`) og OpenAI `gpt-4.1-mini`.
    - Består begge Mistral-modellene, foretrekkes Large 4, så lenge kvaliteten og kostnaden er tilfredsstillende.
    - Hver betalt test vises først med testene og forventet kostnad, og den venter på Kevins godkjenning.
  - **Modelloversikten** (`GET /v1/models`, gratis) ble hentet med Kevins nøkkel uten at nøkkelen ble vist. `mistral-medium-latest` peker på `mistral-medium-2604` (Medium 3.5), og `mistral-large-latest` peker på `mistral-large-4` / `mistral-large-4-0`. API-et viste ingen dato for utfasing.

## Boundaries & Constraints

**Always:**
- Modellversjonen fra leverandøren hentes fra svaret (`resultat.response.modelId`) og føres med i `LlmSvar` som et valgfritt felt. Mock-adapteren oppgir ingen versjon.
- Rapporten viser både modellen som ble bedt om (`--modell`) og hver distinkte modellversjon leverandøren svarte med, i toppteksten og per kjøring. Er en kjøring feilet uten svar, står versjonen som ukjent.
- Pipelinen, API-svaret og logglinjen endres ikke. Versjonen brukes bare av testsettskriptet.
- Kjøreboka og oversikten over vilkår og priser viser til kilder med dato og er tydelig merket som forhåndsundersøkt og ikke bekreftet. Ingen måleresultater skrives inn før målingen er gjort.
- Testene kjører uten nøkkel og uten nettverk.

**Never:**
- Ingen betalte API-kall, ingen kontoer og ingen endringer i Vercel.
- Ingen endring av `TEMPERATUR`, `MAKS_UTDATA_TOKENS`, `STANDARD_MODELL`, `providerOptions` eller prompten.
- Ikke sett del B, story 2.4 eller sprint-status til ferdig. 2-4 står som `in-progress`.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Alias løses opp | `--modell mistral-medium-latest`, leverandøren svarer med `mistral-medium-2508` | Toppteksten: «Modell (bedt om): mistral-medium-latest» og «Modellversjon fra leverandøren: mistral-medium-2508». Kjøringen viser versjonen | N/A |
| Versjonen skifter underveis | kjøring 1–6 gir `a`, 7–12 gir `b` | Toppteksten lister begge versjonene med antall kjøringer, og hver kjøring viser sin | N/A |
| Mock | `--mock` | Versjonen står som «mock» | N/A |
| Kjøring uten svar | adapteren kaster (`llm_feil`/`llm_tidsavbrudd`) | Versjonen står som ukjent for den kjøringen | N/A |
| Ugyldig svar med versjon | `NoObjectGeneratedError` med `response.modelId` | Versjonen tas med når feilen har den, ellers ukjent | N/A |

</frozen-after-approval>

## Code Map

- `src/lib/llm/klient.ts` -- `LlmSvar` (`svar`, `inputTokens`, `outputTokens`). Legg til `modellversjon?: string`.
- `src/lib/llm/felles.ts` -- `analyseGapMed`. Les `resultat.response.modelId` ved suksess, og `feil.response?.modelId` i grenen for `NoObjectGeneratedError`. `NoOutputGeneratedError` gir ingen versjon.
- `src/lib/llm/adaptere.test.ts` -- mocker `generateText`. Svaret i mocken må få `response: { modelId }`.
- `src/lib/llm/mock.ts` -- uendret (ingen versjon).
- `src/lib/pipeline/generer.ts` -- uendret. Den leser bare `svar` og tokens.
- `scripts/kjor-testsett.ts` -- `medTokens` lagrer også `modellversjon`, og `Kjoring` får feltet. `--mock` gir «mock».
- `scripts/testsett/rapport.ts` -- `Kjoring`, `topptekst`, `kjoringSeksjon`. Topptekst med «Modell (bedt om)» og en liste over versjoner med antall kjøringer.
- `scripts/testsett/kjor.test.ts`, `rapport.test.ts` -- de falske klientene får versjoner.
- `_bmad-output/implementation-artifacts/vurdering-2-4-leverandorvalg.md` -- godkjent mal. Avsnitt 0 får raden «Modellversjon fra leverandøren».
- `README.md` -- avsnittet om testsettet. Lenke til kjøreboka.

## Tasks & Acceptance

**Execution:**
- [x] `src/lib/llm/klient.ts`, `felles.ts` + `adaptere.test.ts` -- `modellversjon` fra `response.modelId`, også ved `NoObjectGeneratedError` -- NFR-10
- [x] `scripts/kjor-testsett.ts` + `scripts/testsett/kjor.test.ts` -- lagre versjonen per kjøring, «mock» med `--mock` -- matrisen
- [x] `scripts/testsett/rapport.ts` + `rapport.test.ts` -- «Modell (bedt om)», versjoner med antall i toppteksten og versjonen per kjøring -- matrisen
- [x] `_bmad-output/implementation-artifacts/kjorebok-2-4-del-b.md` -- kjørebok: forutsetninger, `.env.local`, kontroll av hver nøkkel (ett par, én kjøring), full måling per leverandør, manuell test i appen (NFR-4, NFR-9), utfylling av malen, valget og etterarbeid. Kommandoene med `<kr>` og `<modell>` som plassholdere. Fordelingen av kontoene og budsjettet står i beslutningene, og det står hvem som gjør hva -- AK 2, AD-11
- [x] `_bmad-output/implementation-artifacts/vilkaar-og-priser-2-4.md` -- forhåndsundersøkt oversikt per leverandør: trening, databehandleravtale, betalt plan, forhåndsbetaling og automatisk påfylling, grense for forbruket, priser og modellnavn, med kilde og dato, og merket «må bekreftes i kontoen». Ta med budsjettet (ca. 5–10 EUR hos Mistral og 5 USD hos OpenAI, totalt under 200 kr) og hva som må slås av eller settes i hver konto. Ingen valutakurs eller sum oppgis som fakta uten kilde -- PRD §6, AD-11, AK 3
- [x] `_bmad-output/implementation-artifacts/vurdering-2-4-leverandorvalg.md` -- raden «Modellversjon fra leverandøren (fra rapporten)» i avsnitt 0
- [x] `README.md` -- lenke til kjøreboka fra avsnittet om testsettet

**Acceptance Criteria:**
- Given `npm run testsett -- --leverandor mistral --mock`, when rapporten leses, then står «Modell (bedt om)» og versjonen «mock», og kjøringen gir utgangskode 0.
- Given `npm run lint`, `npm run typecheck`, `npm test` og `npm run build`, when de kjøres uten nøkkel, then er alle grønne.
- Given kjøreboka og oversikten over vilkår og priser, when de leses, then har hver opplysning om vilkår eller pris en kilde og en dato, og det står at den må bekreftes. Ingen måleresultater er fylt inn.

## Implementation Notes

- **Versjonen:** `felles.ts` tar med `modellversjon` bare når `response.modelId` finnes (ikke tom). `NoOutputGeneratedError` og kastede feil gir ingen versjon. I skriptet blir manglende versjon `null`, som rapporten viser som «ukjent». `--mock` gir «mock» for alle kjøringene.
- **Toppteksten:** «Modell (bedt om)» erstatter «Modell». «Modellversjon fra leverandøren» lister hver versjon med antall kjøringer i rekkefølgen de kom, og «ukjent» står sist. Per kjøring står «Modellversjon» rett under «Status».
- **Forundersøkelsen 2026-11-19 (må bekreftes):** modelloversikten hos Mistral viste ingen Medium-modell med dato i navnet som ikke er avviklet. Medium 3.5 har API-navnet `mistral-medium-3-5` og var merket utfaset 2026-10-31, og `mistral-medium-2508` er avviklet 2026-08-31. Prisen for Mistral Medium ble ikke funnet på prissidene. Kjøreboka sier at Kevin og Sondre må bestemme modellen hvis det ikke finnes noe datobestemt navn i kontoen. `gpt-5-mini` koster 0,25 / 2,00 USD per million tokens inn/ut (developers.openai.com, 2026-11-19).
- **Kontrollene:** lint, typecheck, `npm test` (712 tester i 47 filer) og build er grønne uten nøkkel. `npm run testsett -- --leverandor mistral --mock` gir utgangskode 0 med «Modell (bedt om): mistral-medium-latest» og «Modellversjon fra leverandøren: mock (12 kjøringer)».

## Spec Change Log

- 2026-11-19: `STANDARD_MODELL.openai` endret fra `gpt-5-mini` til `gpt-4.1-mini` etter Sondres gjennomgang av PR #14, godkjent av Kevin. Unntak fra Never-listen.

## Review Triage Log

| # | Layer | Finding | Verdict | Route | Evidence |
|---|-------|---------|---------|-------|----------|
| 1 | edge, blind | `response.modelId` falls back to the requested alias when the provider omits `model`, so the alias looks like a resolved version | medium | patch | `ai/dist/index.js:5554`: `result.response?.modelId ?? stepModel.modelId`. The report now marks a version equal to `--modell`, and the key check in the runbook requires a specific name. |
| 2 | edge, blind | Runbook step 5 check «viser en versjon, ikke ukjent» cannot fail | medium | patch | Same root as #1 (the fallback always fills the field on a 200). Check rewritten. |
| 3 | blind | An uncommitted real report makes the next report say «arbeidstreet har endringer» | medium | patch | `git status --porcelain` counted untracked `testsett-rapporter/*.md`. Excluded with a pathspec, plus a runbook step to commit between runs. |
| 4 | edge | Provider version interpolated raw into Markdown | low | patch | Untrusted provider text; direct fix with the existing `celle()`. |
| 5 | edge, blind | A failed `--mock` run is shown as «mock», not «ukjent» | low | patch | Contradicted the frozen matrix row «Kjøring uten svar»; one-line fix. |
| 6 | blind | Runbook `curl` uses `$MISTRAL_API_KEY`, which is unset in the shell and wrong for PowerShell | medium | patch | The key lives only in `.env.local`. Replaced with the console's model list or a PowerShell snippet that does not print the key. |
| 7 | blind | Budget can exceed 200 kr including mva | medium | patch (doc) + asked Kevin | 10 EUR + 5 USD plus 25 % mva may pass 200 kr; the documents now say the ceiling includes mva. The amount is Kevin's decision. |
| 8 | blind | Template intro contradicts the failure decisions | low | patch | Intro said «alt måles på nytt», decisions say only Mistral failing → OpenAI. |
| 9 | blind | Unopened or circular sources presented as sourced | medium | patch | Rows now say «ikke verifisert, må leses og bekreftes». |
| 10 | blind | Step 7 leaves `LLM_*` in `.env.local` and spends the credit unchecked | low | patch | Undo step, a note on cost per analysis and a credit check added. |
| 11 | blind | No rule for both failing on different points, OpenAI failing, OpenAI's terms `N`, or an NFR-9/NFR-4 failure | medium | intent_gap (asked Kevin) | AD-11 only says «ellers OpenAI». The gap is in the decision procedure, not in the code, so the code is kept. |
| 12 | blind | No fallback when the newest Mistral Medium is deprecated | medium | intent_gap (asked Kevin) | Mistral docs 2026-11-19: `mistral-medium-3-5` deprecated 2026-10-31 (retires 2027-04-30), Large 4 listed as the alternative, and no dated Medium name in service. Conflicts with Kevin's decision «nyeste datobestemte Medium». |
| 13 | blind | Design Notes claim about the provider `model` field has no source | low | reject | The fix edits this spec. Covered in practice by #1. |
| 14 | edge, blind | The alias test mocks `generateText`, so the SDK fallback is not exercised | low | reject | Handled by #1's report marker and the runbook check. |
| 15 | edge | A provider version literally «ukjent» merges with unknown runs | false | reject | Unrealistic model id. |
| 16 | edge | Test with an empty `modelId` covers an unreachable path | low | reject | Harmless test of the guard in `medVersjon`. |
| 17 | blind | Redundant old assertion and no direct test that `taSiste` resets the version | low | reject | `taSiste()` runs before each run; covered indirectly by the `modellversjon: null` assertion. |
| 18 | blind | «Gap × 4» ignores that letter/CV generations and reasoning tokens may cost more | low | reject | Kevin's decision (frozen). Noted for the assessment. |

## Design Notes

- **Hvorfor `response.modelId`:** leverandøren returnerer modellen som faktisk svarte (Mistral i feltet `model`, OpenAI likeså), og AI SDK gjør den tilgjengelig i `response.modelId`. Det er det sikreste sporet når et alias brukes, og det koster ingen ekstra kall.
- **Bare i skriptet:** versjonen logges ikke av pipelinen. Logglinjen (AD-10) er fast definert, og appen trenger ikke versjonen.
- **Forhåndsundersøkt 2026-11-19** (fra offentlige kilder, må bekreftes): API-data hos OpenAI brukes ikke til trening som standard, og en DPA finnes via skjema. OpenAI har minst 5 USD i forhåndsbetaling og automatisk påfylling slått **på** som standard, så den må slås av. Mistral sier at data fra La Plateforme API ikke brukes til trening, og at Scale-planen er unntatt fra trening som standard. Innstillingen må bekreftes i Admin Console under Privacy. Mistral har forhåndsbetalte kreditter og en månedlig grense for forbruket.

## Verification

**Commands:**
- `npm run lint`, `npm run typecheck`, `npm test`, `npm run build` -- expected: alle grønne uten nøkkel
- `npm run testsett -- --leverandor mistral --mock` -- expected: utgangskode 0, rapporten har «Modell (bedt om)» og versjonen «mock»
