---
title: 'Story 2.1: Kontrollert gap-analyse for demoeksempelet gjennom API-et'
type: 'feature'
created: '2026-11-18'
status: 'done'
baseline_commit: '5b6583a78c7f3cee5e08145d5e389f212fa048fd'
route: 'dispatch'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-2-context.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Det finnes ingen gap-analyse ennå. Story 2.2–2.7 og epic 3–4 trenger delte former, kontroll av belegg i kode, treffprosent, en port mot språkmodellen og én pipeline før noe kan vises.

**Approach:** Grunnmuren for epic 2 bygges uten UI: delte zod-former i `lib/kontrakt`, `kontrollerKrav` og `treffprosent` i `lib/kjerne`, porten `LlmKlient` med mock og demosvar i `lib/llm`, `generer()` i `lib/pipeline` og ruten `POST /api/generer/[resultatdel]` for `gap`. Demoeksempelet går hele veien gjennom kontrollene og gir treffprosent 22.

**Beslutninger (Sondre, 2026-11-18):**
- FR-9 bygges etter addendum D0, med `[ANTAKELSE]`: alle bindestreker og tankestreker fjernes ved normalisering. Kevin har ikke bekreftet ennå.
- Testen fra gjennomgangen av 1.6 tas med: `statusHentet` med `modus: "demo"` beholder `demoVarsel`.

## Boundaries & Constraints

**Always:**
- `normaliser` i `lib/kjerne/demo.ts` utvides (ikke en ny funksjon), så `erDemoeksempel` og `kontrollerKrav` bruker samme normalisering: NFC, små bokstaver, og fjerning av mellomrom, linjeskift, listetegn `• ▪ ‣ ◦ *`, bindestreker og tankestreker `- ‐ – —`, og anførselstegn og apostrofer `« » " “ ” „ ' ‘ ’`.
- Pipelinen kjører i fast rekkefølge (AD-4): inndata (zod og lengder) → `masker` → `erDemoeksempel` → adapter → svarskjema → `kontrollerKrav` → `treffprosent` → én logglinje. Alt etter `masker` bruker den kanoniske teksten.
- Mock-adapteren brukes bare når `erDemoeksempel` er sann. Det gjelder i begge modi og også med `demo: true`.
- Feil er HTTP-status pluss `{ feil: { kode } }`, med enumen og statustabellen i `lib/kontrakt` (AD-8).
- Logglinjen er JSON med bare `resultatdel`, `modus`, `status`, `varighetMs`, `inputTokens`, `outputTokens` og `feilkode` (AD-10).
- `lib/llm` og `lib/pipeline` starter med `import "server-only"`. Testnavnene starter med FR- eller NFR-ID.

**Never:**
- Ingen UI, ingen `lib/okt`-genereringer og ingen fetch fra klienten (story 2.2).
- Ingen ekte adapter, AI SDK, prompter eller rate-limit (story 2.3). Ekte modus med egen CV gir `llm_feil` til da.
- `brev`, `cv` og `ats` gir `ugyldig_inndata` (epic 3 og 4).
- `masker`, `lib/innlesing` og komponentene endres ikke.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Demoeksempelet | `DEMO_CV`, `DEMO_ANNONSE`, demomodus eller ekte modus | 200, `GapAnalyse` med 6 krav som i fasiten for par 1, 9 nøkkelord og treffprosent 22 | N/A |
| Demo med CRLF og ekstra mellomrom | demoteksten med andre linjeskift | Samme svar som over | N/A |
| Egen CV i demomodus | annen CV-tekst, ingen nøkkel | Ingen mock-svar | 403 `demo_krever_nokkel` |
| `demo: true` med egen CV i ekte modus | nøkkel satt, annen CV-tekst | Ingen mock-svar | 400 `ugyldig_inndata` |
| Egen CV i ekte modus | nøkkel satt, ikke `demo` | Ingen adapter før 2.3 | 502 `llm_feil` |
| For lang tekst | CV over 15 000 eller annonse over 8 000 tegn | Avvist før masker | 413 `for_lang_tekst` |
| For kort tekst | annonse under 200 tegn eller tom CV | Avvist | 400 `for_kort_tekst` |
| Ugyldig body | ikke JSON, feil typer, ukjent resultatdel | Avvist | 400 `ugyldig_inndata` |
| Ugyldig svar fra adapter | svar som ikke passer skjemaet | Ingen kontroll kjøres | 502 `ugyldig_svar` |

</frozen-after-approval>

## Code Map

- `src/lib/kjerne/demo.ts` -- `normaliser` og `erDemoeksempel`. Utvid `normaliser`. Testene i `demo.test.ts` skal fortsatt være grønne.
- `src/lib/kjerne/grenser.ts` -- `annonseStatus` og `cvStatus` gir `tom/for_kort/for_lang/ok`. Gjenbrukes til lengdene i pipelinen.
- `src/lib/kjerne/masker.ts` -- `masker` er idempotent. Brukes i steg 2, men endres ikke.
- `src/lib/kontrakt/demo.ts`, `grenser.ts` og `status.ts` -- mønster for zod-former med `z.infer`. Kontrakten kan bare importere kontrakt (ESLint).
- `src/lib/pipeline/status.ts` -- `lagStatus(env).modus` gir `demo` eller `ekte`. Gjenbrukes i ruten.
- `src/app/api/status/route.ts` -- mønster for en tynn rute. Den nye ruten skal også ha `dynamic = "force-dynamic"`.
- `src/lib/llm/.gitkeep` -- tom mappe som erstattes.
- `src/lib/okt/demovarsel-tilstand.test.ts:51-65` -- testen for `statusHentet` med `ekte`. Den nye testen for `demo` legges rett etter.
- `eslint.config.mjs` -- komponenter og app (utenom `api`) kan ikke importere `lib/llm` eller `lib/pipeline`, og kjernen bare kontrakt. Ingen endring.
- `testdata/*/fasit.md` og `cv.txt` -- nøkkelordene og forventet treffprosent (22, 11, 8 og 33).
- `testdata/par-4-tokolonne-hotell/cv.txt` -- linjen `- Kassasystem og dagsoppgjør` til FR-9-testen.

## Tasks & Acceptance

**Execution:**
- [x] `src/lib/kontrakt/gap.ts` -- zod: `kategori`, `belegg`, `krav` (med `nedgradert`), `nokkelord` (`tekst`, `kravIndeks: number | null`, `funnet`), `gapAnalyse` (`stilling`, `arbeidsgiver`, `krav`, `nokkelord`, `treffprosent`, `fjernetBelegg`), `gapSvar` (det rå svaret fra modellen, uten `nedgradert` og `funnet`), `gapGrunnlag` (med grenser) og telleren `fjernetForslag`. -- AD-14
- [x] `src/lib/kontrakt/feil.ts` -- `feilkode` (de åtte kodene), `FEIL_STATUS` og `feilSvar`. -- AD-8
- [x] `src/lib/kontrakt/generer.ts` -- `resultatdel` og `genererBody` (`cvTekst`, `annonse`, `demo?`, `gap?`). -- AD-5
- [x] `src/lib/kjerne/demo.ts` + `demo.test.ts` -- utvid `normaliser` og legg til tester for listetegn, bindestreker og anførselstegn. -- FR-9, AD-13
- [x] `src/lib/kjerne/belegg.ts` + `belegg.test.ts` -- `kontrollerKrav(krav, cvTekst)`. -- FR-9
- [x] `src/lib/kjerne/treffprosent.ts` + `treffprosent.test.ts` -- `finnNokkelord` og `treffprosent` etter addendum D, med tester for de fire fasitene og de to kjente svakhetene. -- FR-12
- [x] `src/lib/llm/klient.ts`, `mock.ts` og `demo-svar/gap.json` + `llm.test.ts` -- `LlmKlient.analyseGap` gir `{ svar: unknown, inputTokens, outputTokens }`. Mock-klienten importerer `gap.json` statisk, og den ekte er en plassholder som kaster. En test validerer `gap.json` mot `gapSvar` og sjekker at hvert belegg finnes i par 1 og at fasiten følges. -- AD-3
- [x] `src/lib/pipeline/generer.ts` + `generer.test.ts` -- `generer(resultatdel, body, env, klienter?)` gir `{ status, json }` med stegene i AD-4 og logglinjen. -- AD-4, AD-5, AD-10
- [x] `src/app/api/generer/[resultatdel]/route.ts` + `route.test.ts` -- en tynn `POST`-rute med `maxDuration = 60` og `force-dynamic`. -- AD-5
- [x] `src/lib/okt/demovarsel-tilstand.test.ts` -- `statusHentet` med `demo` beholder varselet. -- FR-26
- [x] `src/lint-grenser.test.ts` -- `@/lib/llm` er blokkert i `src/components`. -- AD-2

**Acceptance Criteria:**
- Given `kontrollerKrav`, when et belegg bare skiller seg fra CV-teksten i linjeskift, store og små bokstaver, orddeling med bindestrek eller anførselstegn, then godtas det, og et litt omskrevet belegg avvises.
- Given `Kassasystem og dagsoppgjør` mot `par-4/cv.txt`, when det kontrolleres, then godtas det, og med ett ord byttet ut avvises det.
- Given et `oppfylt`- eller `delvis`-krav uten gyldig belegg (også med tom liste), when det kontrolleres, then blir det `mangler` med `nedgradert: true` og uten `forklaring`, belegg uten treff er fjernet, og `fjernetBelegg` er telt.
- Given nøkkelordene fra hver `fasit.md` mot `cv.txt`, when treffprosenten regnes ut, then blir den 22, 11, 8 og 33. *oppgjør* gir ikke treff i *dagsoppgjør*, og *av* i «oppsett av PC» gir treff alene, men nøkkelordet som helhet er ikke funnet.
- Given en generering, when den logges, then er det én JSON-linje med bare de sju feltene, og et søk etter tekst fra par 1 i loggen gir ingen treff.
- Given `npm run lint`, `npm run typecheck`, `npm test` og `npm run build`, when de kjøres, then er alle grønne.

## Implementation Notes

## Spec Change Log

## Review Triage Log

| # | Layer | Finding | Verdict | Route | Evidence |
|---|-------|---------|---------|-------|----------|
| 1 | verification-gap | `AbortError` → `llm_tidsavbrudd` untested | low | patch | Only `TimeoutError` is tested; removing the `AbortError` branch keeps all tests green. |
| 2 | verification-gap | Non-integer `kravIndeks` → `null` untested | low | patch | `gapSvar` allows any number; the AD-4 test covers 7 and -1 but not fractions. |
| 3 | verification-gap, blind, edge | Wider `normaliser` also loosens `erDemoeksempel` | false | reject | Frozen intent: extend `normaliser` (not a new function) so `erDemoeksempel` and `kontrollerKrav` share it. Intended. |
| 4 | blind, edge | Very short or cross-word belegg (e.g. "og") pass the substring check | medium | defer | Real, but inherent to addendum D0 (whitespace removed, substring match), which the frozen intent prescribes. PRD-level question for Kevin. |
| 5 | blind, edge | Catch-all maps internal bugs to 502 `llm_feil`, unlogged | low | reject | AD-8 has no 500 code and AD-10 forbids extra log fields; fix adds new surface; bugs surface in tests. |
| 6 | blind, edge | Port has no `AbortSignal`/deadline; 60 s platform kill gives no `{ feil }` | low | defer | Not reachable until the real adapter in 2.3; the port is cheap to extend then. |
| 7 | blind, edge | `request.json()` reads unbounded body before length check | low | reject | Vercel caps request bodies at 4.5 MB; fix adds a branch for an unlikely case. |
| 8 | blind, edge | `gapSvar`/`gapAnalyse` have no size limits while `gapGrunnlag` does | medium | defer | Only the real model can exceed them (2.3); a later brev/cv/ats call would then get 400. Truncate vs reject is a 2.3/epic 3 decision. |
| 9 | blind, edge | Duplicate or empty nøkkelord skew `treffprosent` | low | defer | Only reachable with the real model; dedupe rule belongs with the 2.3 prompt and addendum D. |
| 10 | blind, edge | Downgraded `mangler` has no `raad` | false | reject | Design note: `raad` is not set; the fixed advice is UI text in 2.2 (UX-DR13). |
| 11 | blind, edge | `mangler` from the model keeps valid belegg | low | patch | `kontrollerKrav` keeps belegg for `mangler`, contradicting the category; one-line correction. |
| 12 | blind | `demo` flag differs by mode (403 vs 400) | false | reject | Matches the frozen matrix: own CV in demo mode → 403, `demo: true` with own CV in real mode → 400. |
| 13 | blind | "demo: true gir mock-svaret" only checks status | low | patch | Test does not assert which client was called. |
| 14 | blind | Route "brev gir 400" does not check body | low | patch | Direct test correction. |
| 15 | blind | Route has no 413 or missing-body case | false | reject | Matrix rows covered in `generer.test.ts`; route is a thin pass-through with its own non-JSON test. |
| 16 | blind | FR-27 test scans whole JSON, so `kravIndeks` digits pass trivially | low | patch | Regex covers structural numbers, not only text. |
| 17 | blind | Diff omits story artifacts | false | reject | Diff deliberately limited to `src`; spec and sprint status are not code under review. |
| 18 | edge | `delvis` without `forklaring` / `oppfylt` with one | low | reject | Model-only, cosmetic; fix adds branches. |
| 19 | edge | Duplicate belegg within one krav | low | reject | Cosmetic, unlikely; fix adds complexity. |
| 20 | edge | Short keyword parts match as prefix of any CV word | false | reject | Prefix matching is addendum D's rule; the known weaknesses are tested against the fasit. |
| 21 | edge | Masking lengthens CV past `CV_MAKS` | low | reject | +12 chars per fødselsnummer; negligible against model limits. |

## Design Notes

- **Nedgradering:** `kontrollerKrav` fjerner `forklaring` når et krav blir `mangler`, fordi «hvorfor delvis» da er feil. `raad` settes ikke. Det faste rådet for nedgraderte krav er UI-tekst i 2.2 (UX-DR13).
- **`kravIndeks`:** En indeks utenfor `krav` blir `null`, og svaret avvises ikke. Det er den trygge retningen (FR-17 foreslår aldri nøkkelord uten krav).
- **Grenser i `gapGrunnlag`:** høyst 30 krav, tekst på høyst 300 tegn, høyst 10 belegg på høyst 500 tegn, høyst 40 nøkkelord på høyst 100 tegn.
- **Demosvaret (`gap.json`):** de seks kravene i annonsens rekkefølge, med kategori som i fasiten og belegg ordrett fra `par-1/cv.txt`. Nøkkelordene og `kravIndeks`: kundeorientert, kundeservice → 0; digitale ferdigheter, nettbank, mobilbank → 1; kontanthåndtering → 2; nøyaktig, pålitelig → 3; økonomi → 4.
- **Testbarhet:** `generer` tar inn `env` og `klienter`, så testene ikke trenger HTTP eller `process.env`. Logglinjen skrives med `console.log`, og testene spionerer på den.

## Verification

**Commands:**
- `npm run lint` -- forventet: ingen feil
- `npm run typecheck` -- forventet: ingen feil
- `npm test` -- forventet: alle grønne, også testene for 1.6 (`erDemoeksempel`)
- `npm run build` -- forventet: `/api/generer/[resultatdel]` vises som dynamisk rute
