---
title: 'Story 1.1, del 1: Kjørbar app i demomodus lokalt, med grenser og CI'
type: 'feature'
created: '2026-11-04'
status: 'done'
baseline_commit: 'fec5c47a60c9bf41df25f6e66d8fc73bd464fff5'
route: 'dispatch'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-1-context.md'
  - '{project-root}/_bmad-output/planning-artifacts/architecture/architecture-G69-heggdal-skogheim-2026-11-03/ARCHITECTURE-SPINE.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Repoet har ingen app, så sensor kan ikke starte noe, og de senere stories har ingen struktur å bygge på.

**Approach:** Sett opp starteren etter AD-15 i rotmappa. Legg til `GET /api/status`, demobanneret, lagmappene med importgrenser, repo-filene og CI, slik at en fersk klone uten `.env` starter i demomodus. Dette er første del av story 1.1 (`1-1-kjorbar-app-i-demomodus-lokalt-og-paa-vercel`). Vercel-delen er utsatt, se `deferred-work.md`.

## Boundaries & Constraints

**Always:**
- Versjonene i spinen er eksakte: Next 16.4.4, shadcn 4.23.0, TypeScript 5.9.x, `@types/node` `^24`, `engines.node: "24.x"`, zod 4.6.7, Vitest 5.1.0.
- Alt UI er klientkomponenter. Ingen miljøvariabel har prefikset `NEXT_PUBLIC_`. En variabel som mangler eller er ugyldig, gir demomodus eller standardverdien, aldri krasj.
- Domeneord på norsk uten æøå. Tester i `*.test.ts(x)` ved siden av koden, med FR-ID først i testnavnet.
- Filene `CLAUDE.md`, `_bmad/`, `_bmad-output/`, `testdata/` og `.logs/` er urørt, bortsett fra denne spec-en, `deferred-work.md` og `sprint-status.yaml`. Innholdet i `testdata/` skal være byte-likt etter `.gitattributes`.

**Never:**
- Ingen `vercel.json`, publisering eller Vercel-adresse i README-en i denne delen.
- Ikke push til `main`, for det utløser produksjonspublisering uten regionen `arn1`.
- Ikke bygg forberedelsessiden, økt-context eller fargetema (story 1.2), og ingen `LlmKlient` eller adaptere (Epic 2).
- Ingen AGENTS.md fra starteren, ingen Cache Components og ingen Server Actions.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Ingen miljøvariabler | `{}` | `modus: 'demo'`, Mistral AI, Frankrike, `tredjeland: false` | Ingen krasj |
| Nøkkel for valgt leverandør | `MISTRAL_API_KEY` satt | `modus: 'ekte'`, Mistral | N/A |
| Nøkkel for en annen leverandør | `LLM_LEVERANDOR=openai`, bare `MISTRAL_API_KEY` | `modus: 'demo'`, OpenAI, USA, `tredjeland: true` | N/A |
| Tom nøkkel | `MISTRAL_API_KEY=''` eller bare mellomrom | `modus: 'demo'` | Behandles som manglende |
| Ugyldig leverandør | `LLM_LEVERANDOR=foo` | Standardverdien `mistral` | Ingen krasj |
| Status i demomodus | Klienten får `modus: 'demo'` | Banneret vises med full bredde og kan ikke lukkes | N/A |
| Status i ekte modus | Klienten får `modus: 'ekte'` | Ikke noe banner | N/A |
| Status feiler | Nettverksfeil eller ugyldig JSON | Ikke noe banner, appen kjører videre | Feilen svelges uten logging av innhold |

</frozen-after-approval>

## Code Map

- `README.md` -- finnes, gruppens tekst beholdes, og oppstartsavsnitt legges til. Ikke overskriv med starterens README.
- `.gitignore` -- finnes og dekker `node_modules`, `.next`, `.env*` og `!.env.example`. Mangler reglene for `*.pdf` og `*.docx`. Ikke overskriv med starterens fil.
- `.gitattributes` -- finnes ikke.
- `testdata/par-1-butikk-bank/cv.docx`, `testdata/par-4-tokolonne-hotell/cv.pdf` -- binære filer som `testdata/** text eol=lf` alene ville ødelagt.
- `ARCHITECTURE-SPINE.md` -- AD-1, AD-2, AD-5, AD-12, AD-15 og strukturelt seed.
- `DESIGN.md` linje 117–119 og 197 -- banneret bruker `primary` på `primary-soft`, med `Info`-ikon. `EXPERIENCE.md` linje 125 -- ordlyden.

## Tasks & Acceptance

**Execution:**
- [x] rotmappa -- kjør AD-15 i `app-tmp`, flytt inn, og slett `app-tmp`, starterens README og starterens `.gitignore`. Kjør `shadcn init -t next -b radix` -- fast oppsett.
- [x] `package.json` -- navn `g69-cv-assistent`, eksakte versjoner, `engines.node`, skriptene `lint`, `typecheck` (`tsc --noEmit`) og `test` (`vitest run`); legg til `zod`, `server-only`, `vitest`, `lucide-react` -- NFR-6.
- [x] `vitest.config.ts` -- alias `@` og `server-only` til `server-only/empty.js` -- AD-12.
- [x] `src/lib/kontrakt/status.ts` -- zod-skjema `statusSvar`, avledede typer -- AD-5.
- [x] `src/lib/pipeline/status.ts` -- `import 'server-only'`, ren `lagStatus(env)` med leverandørtabellen -- AD-3, AD-5.
- [x] `src/app/api/status/route.ts` -- `force-dynamic`, returnerer `lagStatus(process.env)` -- modus låses ikke ved bygging.
- [x] `src/lib/okt/status.ts` -- `hentStatus()` validerer med `statusSvar`, gir `null` ved feil -- UI kaller ikke API-et selv.
- [x] `src/components/DemoBanner.tsx`, `src/components/Demomodus.tsx` -- rent banner, og en klientkomponent som henter status og viser banneret -- UX-DR22.
- [x] `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css` -- `lang="nb"`, `Demomodus` øverst, enkel `header` og `main` med én `h1`, og bannerfargene fra `DESIGN.md` -- resten kommer i story 1.2.
- [x] `src/lib/{kjerne,innlesing,llm}/.gitkeep` -- mappene finnes før de får kode. `kontrakt`, `pipeline` og `okt` har allerede filer.
- [x] `eslint.config.mjs` -- `no-restricted-imports` hindrer `lib/llm`, `lib/pipeline`, `lib/kjerne` og `lib/innlesing` i `src/components` og i `src/app` utenom `src/app/api` -- AD-2.
- [x] `.env.example` -- alle seks variablene i AD-12 uten verdier.
- [x] `.gitignore`, `.gitattributes` -- blokker `*.pdf` og `*.docx` utenfor `testdata/`; `testdata/** text eol=lf`, med `*.pdf` og `*.docx` under `testdata/` merket `binary` -- NFR-2.
- [x] `.github/workflows/ci.yml` -- på PR og push til `main`, Node 24: `npm ci`, lint, typecheck og test uten nøkkel -- AD-12.
- [x] `README.md` -- krav (Node 24) og høyst tre kommandoer -- NFR-7.
- [x] `src/lib/pipeline/status.test.ts`, `src/lib/okt/status.test.ts`, `src/app/api/status/route.test.ts`, `src/components/DemoBanner.test.tsx` -- dekker matrisen, med `FR-23:` først i navnene.

**Acceptance Criteria:**
- Given en fersk kopi uten `.env`, when kommandoene i README-en kjøres, then starter appen, og `GET /api/status` svarer `modus: 'demo'`.
- Given banneret, when det vises, then står «Demomodus: appen kjører uten API-nøkkel. Du kan prøve eksempelet og kontrollsteget med din egen CV.» ordrett med `Info`-ikon, uten lukkeknapp.
- Given en fil i `src/components` som importerer `@/lib/pipeline`, when lint kjøres, then feiler lint. Samme import i `src/app/api` godtas.
- Given `git check-ignore`, when `x.pdf` og `x.docx` i rotmappa og filene i `testdata/` sjekkes, then er bare de i rotmappa blokkert.
- Given CI-kommandoene, when de kjøres i en fersk kopi uten nøkkel, then består alle.

## Implementation Notes

- `shadcn init -t next -b radix` stopper på et valg av forhåndsoppsett når det ikke er en terminal. Kjørt med `-p nova --no-monorepo`, som er standardvalget (Lucide og Geist).
- shadcn la også til `components.json`, `src/components/ui/button.tsx`, `src/lib/utils.ts` og pakkene `cn`, `class-variance-authority`, `radix-ui`, `tw-animate-css` og `shadcn`.
- shadcn skrev `--font-sans: var(--font-sans)`, som viser til seg selv. Rettet til `--font-geist-sans` i `globals.css`.
- `LayoutProps<"/">` fra starteren er byttet ut, fordi typen genereres i `.next/` og typecheck ellers feiler i en fersk kopi.
- `layout.tsx` er ikke klientkomponent, fordi `metadata` ikke kan eksporteres fra en slik fil. Den har bare `html`, `body` og klientkomponenten `Demomodus`. `page.tsx` og komponentene har `'use client'`.
- React 19.3.1, Tailwind 4.3.4 og TypeScript 5.9.3 er låst etter spinen. Starteren ga React 19.3.0.
- Etter gjennomgangen: `erDemomodus` i `lib/okt`, `npm run build` i CI (i tillegg til listen i AD-12), lint-regler for `lib/okt`, `lib/kjerne` og `lib/kontrakt`, testene `src/lint-grenser.test.ts` og `src/repo-regler.test.ts`, små bokstaver i `LLM_LEVERANDOR`, store og små filendelser i `.gitignore` og `.gitattributes`, og starterens SVG-er er fjernet.

## Spec Change Log

## Review Triage Log

| Finding | Verdict | Evidence | Route |
|---------|---------|----------|-------|
| `Demomodus` decision untested (blind, gap, edge) | medium | No test imports it; inverting the condition keeps all 22 tests green, and three matrix rows depend on it | patch |
| CI never builds (blind, gap) | medium | `ci.yml` has no build step; a broken config or CSS import passes CI | patch, additive to AD-12 |
| Lint rule has no committed check (blind, gap) | medium | No current file violates it, so a broken regex or glob stays green | patch |
| `lib/okt` and lower layers outside lint (blind, gap, edge) | medium | Probes of `lib/okt` importing `lib/pipeline` lint clean; AD-2 says lint enforces the direction | patch |
| Case-sensitive `LLM_LEVERANDOR`, trim untested (blind, gap, edge) | medium | `OpenAI` gives Mistral, Frankrike, `tredjeland: false`, which is wrong privacy information | patch |
| `check-ignore` rules have no repeatable check (gap) | medium | Tracked files pass without `--no-index`; nothing in CI covers NFR-2 | patch |
| Uppercase `.PDF`/`.DOCX` in `.gitignore`, `.gitattributes` (blind, edge) | low | Confirmed with `core.ignorecase=false`; the fix is a direct pattern correction | patch |
| README says the app reads all variables (blind, gap) | low | Only three of six are read so far | patch |
| Unused starter SVGs and placeholder comment (blind) | low | No references in `src` or README; deletion is direct | patch |
| CRLF in six `testdata` files in this working copy (edge) | low | `git ls-files --eol` confirms it; index is LF | patch, local checkout only |
| Status state outside `lib/okt` context (blind) | low | AD-6 wants one owner, but the intent excludes the context here; story 1.2 must move it | defer |
| Dark theme lacks `--primary-soft` (blind, edge) | false | Nothing sets `.dark`: no `next-themes`, no class toggle in `src` | rejected |
| Banner needs `role="status"` or announcement (blind, edge) | low | UX-DR23 allows one live region and does not list this message; the fix conflicts with the design | rejected |
| Dynamic `import()` bypasses lint (gap, edge) | low | Real, but unlikely in everyday use, and the fix adds a second lint rule | rejected |
| `fetch` without timeout or abort (edge) | low | Unlikely, the route answers immediately, and the fix adds guards | rejected |
| `next build` needs Google Fonts (edge) | low | Vercel and CI have network, and `next dev` falls back; the fix adds a dependency | rejected |
| Node version not enforced (blind) | low | `engines` warns and the README states the requirement; unlikely harm, and the fix adds files | rejected |
| No `* text=auto`; `.txt` and others not blocked (blind) | low | No named failure; the spec's rule covers PDF and DOCX, and `.txt` cannot be blocked generally | rejected |
| `.env.example` lacks options, README lacks real-mode steps (blind) | low | Real mode is not usable before story 2.3; AD-12 asks for no values | rejected |
| `Number("")` for limits (blind) | false | No code reads the limits yet | rejected |
| `button.tsx`, `utils.ts` unused; `button.tsx` not client (blind) | low | Standard shadcn files that story 1.2 uses; only imported from client code by then | rejected |
| Layout shift when the banner appears (blind) | low | Small and only at load; reserving space adds complexity for a state unknown until `fetch` returns | rejected |
| `epic-1-context.md`, lockfile untracked; scope wording (blind) | false | Nothing is committed yet; both are included in the commit. The fix would edit this spec | rejected |
| No technical safeguard against push to `main` (blind) | low | A process choice for Sondre, raised at hand-off; the fix is outside the code | rejected |
| CI workflow has never run (gap) | maybe-false | Needs a first run on GitHub; the lockfile has linux-x64 entries | raised at hand-off |

## Design Notes

Spec-en er skrevet på norsk, slik gruppen også gjorde med `epics.md`, så ordene er de samme fra PRD til kode (NFR-10). `lagStatus` tar `env` som argument, slik at testene ikke endrer `process.env`. `DemoBanner` testes med `renderToStaticMarkup`, siden nettlesertester og jsdom ikke er i spinen. At banneret vises etter `fetch`, sjekkes manuelt.

## Verification

**Commands:**
- `npm ci && npm run lint && npm run typecheck && npm test` -- i en ren kopi av sporede og nye filer, uten `.env`: alt består.
- `npm run build` -- bygger uten nøkkel.
- `git ls-files --eol testdata` og `git diff --stat -- testdata` -- `testdata/` er uendret, og PDF og DOCX er binære.

**Manual checks (if no CLI):**
- `npm run start`, `curl /api/status` gir demo. Med `MISTRAL_API_KEY=x` i miljøet gir samme bygg `ekte`.
- Sondre åpner appen i nettleseren og ser banneret i full bredde øverst.
