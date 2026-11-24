- source_spec: `_bmad-output/implementation-artifacts/spec-1-1-del-1-kjorbar-app-lokalt.md`
  summary: Story 1.1 del 2: publiser på Vercel-prosjektet g69-cv-assistent med regionen arn1 i vercel.json, legg https://g69-cv-assistent.vercel.app i README-en, sett nøkkelen bare i Production, og noter om runtime-loggene viser IP-adresser.
  evidence: Sondre valgte å dele story 1.1 i lokal app og publisering, slik at økten kan stoppe mellom delene.
- source_spec: `_bmad-output/implementation-artifacts/spec-1-2-forberedelsessiden.md`
  summary: Story 1.3 must also announce «Annonsen er for lang. Maks 8 000 tegn.» once in the live region when the limit is passed.
  evidence: UX-DR23 and `EXPERIENCE.md` require it, but the criteria for story 1.3 only name masking, so a screen reader user who pastes 9 000 characters hears nothing today.
- source_spec: `_bmad-output/implementation-artifacts/spec-1-2-forberedelsessiden.md`
  summary: Add a browser smoke test of the production build that covers `layout.tsx` and `page.tsx`, including the banner before the `h1`.
  evidence: No test renders them, and removing `<Demomodus />` from the layout keeps CI green. A unit test needs font mocks, and `next build` only catches a missing provider.
- source_spec: `_bmad-output/implementation-artifacts/spec-1-2-forberedelsessiden.md`
  summary: Story 2.6 must give non-default button variants a disabled look without opacity when it uses `aria-disabled` on *Generer på nytt*.
  evidence: This story removed `disabled:opacity-50` and only replaced it for the default variant, because no other variant has a disabled caller yet.
- source_spec: none
  summary: Story 5.2 must run `npm audit` again and take any safe updates for `minimatch` and `deepmerge`, without `--force`.
  evidence: The 21 findings on 2026-11-04 come from these two packages through ESLint and `shadcn`, and `npm audit fix` changes nothing today.
- source_spec: `_bmad-output/implementation-artifacts/spec-1-4-laste-opp-cv-som-docx-eller-txt.md`
  summary: Add an automated check that the browser build of mammoth reads the `{ arrayBuffer }` input that `lesDocx` builds.
  evidence: Vitest loads mammoth's Node build, which reads only `buffer`. Removing `arrayBuffer` from `lesDocx` keeps every test green, but DOCX upload would fail in the browser. Today only the manual check after `next build` covers it. Story 1.5 or 5.1 could alias `mammoth/lib/unzip.js` to `browser/unzip.js` in one test.
- source_spec: `_bmad-output/implementation-artifacts/spec-1-4-laste-opp-cv-som-docx-eller-txt.md`
  summary: Add a check that mammoth is not in the page chunk after `next build` (AD-7, dynamic import).
  evidence: A static `import mammoth` passes every test and adds about 400 kB to the start page. Checking it needs build output, outside `npm test`; the browser smoke test from story 1.2's deferred item could include it.
- source_spec: `_bmad-output/implementation-artifacts/spec-1-5-laste-opp-cv-som-pdf-ogsaa-med-to-kolonner.md`
  summary: Add an automated browser test of PDF upload on the production build: the modern pdfjs build, the worker URL from the bundler, and `testdata/par-4-tokolonne-hotell/cv.pdf` read in the review step. It fits with the browser smoke test deferred in story 1.2.
  evidence: Every PDF test mocks `hentGetDocument` or uses the legacy build, and `pdfjs.test.ts` only checks the `workerSrc` string. A wrong worker name or a bundler change after a Next upgrade would break all PDF uploads in production while every test passes. Today only the manual check after `next build && next start` covers it.
- source_spec: `_bmad-output/implementation-artifacts/spec-1-5-laste-opp-cv-som-pdf-ogsaa-med-to-kolonner.md`
  summary: Check whether one-column CVs with a date table («2024–nå | Servitør …») are read as two columns, so that all dates come before all roles, and adjust the column rule if so (medium, unverified).
  evidence: `finnKolonnegrense` needs only one bit on each side of a gap of at least 12 pt. The header and footer trimming from round 2 can remove a full-width profile paragraph at the top. It happens only when no heading covers the space between dates and text, so it depends on the PDF. To settle it, run `lesPdf` on real one-column CV PDFs from Word and Canva.
- source_spec: `_bmad-output/implementation-artifacts/spec-1-6-analyser-med-egen-cv-i-demomodus.md`
  summary: Add a check after `next build` that the demo texts from `?raw` (`DEMO_CV`, `DEMO_ANNONSE`) end up as the file text in the client chunks, for example by searching for a line from `testdata/par-1-butikk-bank/cv.txt`.
  evidence: Vitest uses Vite's own `?raw`, so the Turbopack rule in `next.config.ts` is never run by a test. A wrong rule or a change after a Next upgrade keeps every test and the build green, and then the demo example would always get the API-key warning in production. Today only a manual check covers it.
- source_spec: `_bmad-output/implementation-artifacts/spec-1-6-analyser-med-egen-cv-i-demomodus.md`
  summary: Make the focus tests in `src/components/CvPanel-fil.test.tsx` wait for focus with `waitFor`, so they do not fail now and then in the full test run.
  evidence: During story 1.6, 2 of 6 full `npm test` runs failed on `expect(document.activeElement).toBe(felt)`. One time it was «FR-3: tom fil (0 byte)», the other «FR-22: lesefeil i nettleseren». Each passed 5 of 5 alone. `findByLabelText` resolves when the field appears, before the focus effect has run. The tests come from story 1.4, and the flakiness can break CI.

## Deferred from: godkjenning av story 1.5 og 1.6 (2026-11-18)

- source_spec: `_bmad-output/implementation-artifacts/spec-1-5-laste-opp-cv-som-pdf-ogsaa-med-to-kolonner.md` og `spec-1-6-analyser-med-egen-cv-i-demomodus.md`
  summary: Manuell test med NVDA og VoiceOver i Safari av PDF-opplasting (1.5) og demovarselet (1.6) flyttes til story 5.2.
  evidence: Sondre godkjente 1.5 og 1.6 som `done` 2026-11-18 uten disse testene. Tastatur og produksjonsbygg er testet for 1.5 (par 4 og en PDF med én kolonne).
- source_spec: `_bmad-output/implementation-artifacts/spec-1-6-analyser-med-egen-cv-i-demomodus.md`
  summary: Manuell test etter `next build` av to tilfeller i 1.6 er ikke kjørt: (1) demoteksten fra par 1 uendret gir ikke varsel (sjekker Turbopack-regelen for `?raw` i produksjon), (2) et nytt fødselsnummer gir maskering på første trykk og varsel først på andre (også i Safari).
  evidence: Sondre testet bare at egen CV gir varsel. Kjør de to testene ved første anledning i epic 2, senest i story 2.2 (*Prøv med eksempel* bruker `erDemoeksempel`).
- source_spec: `_bmad-output/implementation-artifacts/spec-1-6-analyser-med-egen-cv-i-demomodus.md`
  summary: Test i `demovarsel-tilstand.test.ts` for at `statusHentet` med `modus: "demo"` beholder `demoVarsel` (funn fra kodegjennomgangen, ikke med i #8). Tas i story 2.1.
  evidence: Bare tilfellet `ekte` er testet. Fjernes betingelsen i `statusHentet`, er alle testene fortsatt grønne.

## Deferred from: code review of story 2.1 (2026-11-18)

- source_spec: `_bmad-output/implementation-artifacts/spec-2-1-kontrollert-gap-analyse-for-demoeksempelet-gjennom-api-et.md`
  summary: Very short or cross-word belegg (e.g. "og", "Excel") pass FR-9 because addendum D0 removes whitespace and matches substrings; consider a minimum length or word-boundary rule.
  evidence: `kontrollerKrav` accepts any non-empty normalised substring of the CV. Decide with Kevin together with the hyphen [ANTAKELSE].
- source_spec: `_bmad-output/implementation-artifacts/spec-2-1-kontrollert-gap-analyse-for-demoeksempelet-gjennom-api-et.md`
  summary: Give `LlmKlient.analyseGap` an AbortSignal or deadline in story 2.3 so a hanging adapter returns 504 `llm_tidsavbrudd` before the 60 s platform kill.
  evidence: The port has no signal today; only the placeholder exists, so it is not reachable until 2.3.
  status: Lukket i story 2.3. `GapInndata` har `signal`, og pipelinen kombinerer `request.signal` med `AbortSignal.timeout(45000)`. Et avbrudd gir 504 `llm_tidsavbrudd`.
- source_spec: `_bmad-output/implementation-artifacts/spec-2-1-kontrollert-gap-analyse-for-demoeksempelet-gjennom-api-et.md`
  summary: `gapSvar`/`gapAnalyse` have no size limits while `gapGrunnlag` caps 30 krav, 10 belegg, 40 nøkkelord; decide truncate vs reject in 2.3.
  evidence: A real model answer over the limits would be shown, then rejected with 400 when sent back for brev/cv/ats (epic 3–4).
  status: Lukket i story 2.3. Et svar over `GRUNNLAG_GRENSER` avvises i pipelinen med 502 `ugyldig_svar` i stedet for å kuttes.
- source_spec: `_bmad-output/implementation-artifacts/spec-2-1-kontrollert-gap-analyse-for-demoeksempelet-gjennom-api-et.md`
  summary: Duplicate or empty nøkkelord from the model are each counted in `treffprosent`; add a dedupe rule in 2.3.
  evidence: `finnNokkelord` maps one-to-one; only reachable with the real adapter.
  status: Lukket i story 2.3. Pipelinen fjerner duplikater (nøkkel `ord(tekst).join(" ")`, første beholdes) og tomme nøkkelord før `finnNokkelord`.

## Deferred from: planning of story 2.2 (2026-11-18)

- source_spec: `_bmad-output/implementation-artifacts/spec-2-2-prov-med-eksempel-viser-gap-analysen.md`
  summary: Manual test of the result view and the "Prøv med eksempel" dialog with NVDA and VoiceOver (UX-DR27) is moved to story 5.2.
  evidence: Sondre chose this 2026-11-18, as for 1.5 and 1.6. Keyboard, 320 px and 200 % zoom are tested before merge.

## Deferred from: code review of story 2.3 (2026-11-18)

- source_spec: `_bmad-output/implementation-artifacts/spec-2-3-ekte-gap-analyse-med-spraakmodellen.md`
  summary: Set `maxOutputTokens` (and consider caps on free-text lengths) in the adapters once the model is chosen in story 2.4.
  evidence: Without a cap a runaway answer is billed until the 45 s timeout; reasoning models count reasoning tokens as output, so the right cap depends on the measured model.
  status: Delvis lukket i story 2.4 del A. Adapterne har `maxOutputTokens: MAKS_UTDATA_TOKENS` (8000) i `lib/llm/felles.ts`. Verdien vurderes på nytt i del B ut fra høyeste `outputTokens` i testsettrapporten. Grenser på fritekstlengdene er ikke vurdert.
- source_spec: `_bmad-output/implementation-artifacts/spec-2-3-ekte-gap-analyse-med-spraakmodellen.md`
  summary: The default OpenAI model `gpt-5-mini` is a reasoning model and ignores `temperature`, so AD-3's 0–0.3 does not hold for OpenAI; settle the model (or record the exception) in story 2.4.
  evidence: AI SDK drops the setting with a warning; the adapter test only checks that the value is passed.
  status: Lukket 2026-11-19 i story 2.4 del B. Modellen er gpt-4.1-mini, som tar imot temperaturen, og TEMPERATUR er 0 (spec-2-4-del-b-valgt-oppsett.md).
- source_spec: `_bmad-output/implementation-artifacts/spec-2-4-del-b-runde-4-alternativer-niva-og-rapportnavn.md`
  summary: Drop `raad` in the pipeline (`src/lib/llm/felles.ts` or `generer.ts`) unless the category is «mangler», so the rule does not rest on the prompt alone.
  evidence: In runde 3, OpenAI gpt-4.1-mini returned `raad` for «delvis» in several runs against step 6. Runde 4 only tightens the prompt; changing the pipeline was out of scope.
- source_spec: `_bmad-output/implementation-artifacts/spec-2-4-del-b-runde-4-alternativer-niva-og-rapportnavn.md`
  summary: Update the report-name format in `spec-2-4-velge-leverandor-ved-maaling.md` (line ~149) from `TTMM` to `TTMMSS` with the `-nrN` suffix.
  evidence: Runde 4 changed `rapportNavn` and `skrivNyRapport`. The done spec for del A still documents the minute-only name, and the workflow does not edit specs as part of a fix.

## Deferred from: code review of spec-2-4-velge-leverandor-ved-maaling.md (2026-11-19)

- source_spec: `_bmad-output/implementation-artifacts/spec-2-4-velge-leverandor-ved-maaling.md`
  summary: The test-set report stores only the requested model name, not the model id the provider answered with, so reports under an alias like `mistral-medium-latest` may measure different models (NFR-10).
  evidence: Needs `LlmSvar` to carry the response model id from `generateText`.
  status: Lukket i story 2.4 del B (`082386e`). Rapporten viser «Modellversjon fra leverandøren» (`response.modelId`) i toppteksten og per kjøring.
- source_spec: `_bmad-output/implementation-artifacts/spec-2-4-velge-leverandor-ved-maaling.md`
  summary: The Windows drive-letter fix in the `kjor-testsett.ts` script guard is never exercised by CI.
  evidence: CI runs on Ubuntu only; move the comparison into an exported helper with a unit test.

## Deferred from: code review of story 2.5 (2026-11-19)

- source_spec: `_bmad-output/implementation-artifacts/spec-2-5-forstaaelige-feil-uten-tap-av-data.md`
  summary: When the provider credit is used up, the user gets `llm_feil` with *Prøv igjen* (which cannot help) and no pointer to *Prøv med eksempel*; decide in 2.4/production whether to detect quota exhaustion or add the example button to `llm_feil`.
  evidence: A provider 429 `insufficient_quota` maps to `llm_feil` on purpose (NFR-3); the pipeline test shows the demo still works, but the UI does not point there.
- source_spec: `_bmad-output/implementation-artifacts/spec-2-6-redigere-kopiere-og-generere-gap-analysen-paa-nytt.md`
  summary: A failed *Generer på nytt* discards the previous gap analysis, because `genereringStartet` nulls `generert` and `redigert` before the new answer arrives.
  evidence: `src/lib/okt/tilstand.ts` genereringStartet (from story 2.2) clears both; on error the tab shows only the alert with *Prøv igjen*. CV text and ad are kept. Consider keeping the previous result until the new one succeeds.

## Deferred from: story 2.4 del C, manual SM-4 assessment (2026-11-20)

- source_spec: `_bmad-output/implementation-artifacts/spec-2-4-del-c-resultat-c3-c4-og-sm-4.md`
  summary: SM-4 is not met with the chosen setup (OpenAI `gpt-4.1-mini`, temperature 0): 67 %, 67 %, 69 % and 92 % of the expected keywords extracted for pairs 1–4 (74 % overall), against the 80 % target; follow up in epic 3 (ATS, FR-17) and story 5.1.
  evidence: Section 8 of `vurdering-2-4-kontroll-temperatur-0.md`, counted manually from `testsett-rapporter/2026-11-19-225914-openai-gpt-4.1-mini.md`. The missing keywords are mostly job tasks (periodeavslutning, fakturering, årsoppgjør, førstelinje). Hypothesis, not verified: the round 1 prompt change (`246e58b`, only qualifications are requirements) also narrowed the keywords. Decide whether the prompt or the answer-key lists should change.

- source_spec: `_bmad-output/implementation-artifacts/spec-2-4-gjennomgang-for-pr-b4-resultat.md`
  summary: Update the SM-1 line in prd.md (§10.1, around line 459). It still says SM-1 is not passed because par 3 gave 9 of 12, and a future epic-context recompile would bring that stale status back.
  evidence: Solution B gave 12 of 12 on the old prompt, and the new prompt gives 9 of 12 across par 2 and par 3. Editing the PRD belongs to C5 in kjorebok-2-4-del-c.md.
  status: Updated 2026-11-22 on `story-2.4-c5-dokumentasjon` (`spec-2-4-c5-dokumentasjon-og-beslutningsark.md`). §10.1 now gives both results and says that none of SM-1–SM-3 is passed with the prompt in production. The epic 2 context (`epic-2-context.md`) is now older than the PRD, so the next `bmad-build` for epic 2 will compile it again.

- source_spec: `_bmad-output/implementation-artifacts/spec-2-4-avslutning-maaling.md`
  summary: Story 5.1 re-measures SM-1, SM-2 and SM-3 on the final version. With the prompt in production (`5de48e0`, without the example block) they were 8, 11 and 9 of 12, accepted on 2026-11-23 as known weaknesses. Check the failing runs and error types specifically, and run B4 del 2 (NFR-9) again. Without the example block it passed in one call only.
  evidence: `vurdering-2-4-uten-eksempelblokk.md` and § 1 of `kjente-svakheter-2-4.md`. The error types are «Gode samarbeidsevner» Delvis oppfylt from a related job (par 3, key: Mangler), «Selvstendig og ansvarsbevisst» Oppfylt from a self-assessment (par 4, key: Delvis oppfylt), and «forståelse av Windows» in the ad's words (par 2). Decision: Sondre («ja, kjør») and Kevin, 2026-11-23, alternative a in question 2 of `beslutningsark-2-4-sondre.md`. No further prompt tuning in 2.4.

- source_spec: `_bmad-output/implementation-artifacts/spec-personvernboks-misbrukslogger.md`
  summary: In demo mode the privacy box says the text is sent to and may be kept by the named provider, although nothing is sent.
  evidence: `lagStatus` returns a provider also when `modus` is `demo`; bullet 1 had the same issue before this change.
- source_spec: `_bmad-output/implementation-artifacts/spec-personvernboks-misbrukslogger.md`
  summary: The box says Mistral AI may keep the text for 30 days for abuse monitoring; this is not sourced.
  evidence: Unverified (would be medium if wrong). Settle by checking Mistral's terms or DPA. Production uses OpenAI.
