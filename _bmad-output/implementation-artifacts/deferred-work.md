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
- source_spec: `_bmad-output/implementation-artifacts/spec-2-1-kontrollert-gap-analyse-for-demoeksempelet-gjennom-api-et.md`
  summary: `gapSvar`/`gapAnalyse` have no size limits while `gapGrunnlag` caps 30 krav, 10 belegg, 40 nøkkelord; decide truncate vs reject in 2.3.
  evidence: A real model answer over the limits would be shown, then rejected with 400 when sent back for brev/cv/ats (epic 3–4).
- source_spec: `_bmad-output/implementation-artifacts/spec-2-1-kontrollert-gap-analyse-for-demoeksempelet-gjennom-api-et.md`
  summary: Duplicate or empty nøkkelord from the model are each counted in `treffprosent`; add a dedupe rule in 2.3.
  evidence: `finnNokkelord` maps one-to-one; only reachable with the real adapter.

## Deferred from: planning of story 2.2 (2026-11-18)

- source_spec: `_bmad-output/implementation-artifacts/spec-2-2-prov-med-eksempel-viser-gap-analysen.md`
  summary: Manual test of the result view and the "Prøv med eksempel" dialog with NVDA and VoiceOver (UX-DR27) is moved to story 5.2.
  evidence: Sondre chose this 2026-11-18, as for 1.5 and 1.6. Keyboard, 320 px and 200 % zoom are tested before merge.
