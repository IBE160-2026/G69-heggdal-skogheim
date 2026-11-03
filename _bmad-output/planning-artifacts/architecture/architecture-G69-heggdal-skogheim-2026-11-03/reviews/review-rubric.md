# Rubric review: ARCHITECTURE-SPINE.md (2026-11-03)

**Reviewed:** `ARCHITECTURE-SPINE.md` (status: draft), against the PRD (`prd.md`, with the addendum headings) and the `.memlog.md` decisions.
**Checklist:** divergence points fixed for epics/stories · enforceable Rules · safe deferrals · named tech is current · spec coverage · no silent dimensions (operational envelope in particular) · bloat.

## Verdict

The spine is strong and nearly ready. Its layering, single pipeline, session-state owner, error enum and environment split close most of the real divergence points, and every FR and NFR maps to an AD. One stack pin will break the starter as written (TypeScript 7). One AD cannot work as specified (the FR-5 provider text in a client-only UI). The remaining gaps are contract seams that two stories would otherwise settle in two different ways: the demo-text check, the shared belegg shape, timeout and error transport, and the eval harness. Fix the two highs before epics are created. The mediums can be fixed in the same pass.

## Findings

### F1 [HIGH] TypeScript 7.0.2 is current but incompatible with the rest of the stack

Verified against the npm registry on 2026-11-03. All twelve pinned versions match `latest`, so they are verified-current. But `typescript@7.0.2` is the native (Go) compiler. Its package export `"."` is only `lib/version.cjs`, and the compiler API exists only under `./unstable/*`. `create-next-app` installs `eslint-config-next@16.4.4`, which depends on `typescript-eslint@^8.56`. The latest `typescript-eslint` (8.72.1) has the peer dependency `typescript >=4.8.4 <6.1.0`. As a result, `npm install` hits a peer conflict (ERESOLVE), and the TypeScript step in `next build` and the lint step cannot load the classic API. Two developers with no React experience will lose days to this on the first story.

**Fix:** In the Stack table, pin `TypeScript 6.0.3` (the newest version `typescript-eslint` accepts), with a note: "not 7.x until typescript-eslint and Next support it". Keep the other pins.

### F2 [HIGH] AD-11 / FR-5: the browser cannot read `LLM_LEVERANDOR`

AD-1 makes all UI `'use client'`. AD-12 forbids the `NEXT_PUBLIC_` prefix. AD-11 says provider and country for FR-5 come from "one constant in `lib/kontrakt` that follows `LLM_LEVERANDOR`". In the browser, `process.env.LLM_LEVERANDOR` is `undefined`, so the FR-5 text is either empty or hard-coded. A hard-coded text can contradict the real provider, which is exactly the divergence AD-11 says it prevents. A USA provider also means a third-country transfer that must be disclosed (PRD §6).

**Fix:** Extend AD-5: `GET /api/status` returns `{ modus, leverandor: { navn, land } }`, built on the server from the constant in `lib/kontrakt`. The FR-5 text reads only from `/api/status`. State what is shown in demo mode and in Preview, where there is no key (for example, the configured provider, or "ingen språkmodell brukes i demomodus").

### F3 [MEDIUM] AD-5 does not define "the demo example", and `demo: true` with foreign text is unspecified

"If the mode is `demo` and the text is not the demo example" leaves the comparison undefined: exact string, normalised whitespace, or a hash of `testdata/par-1/cv.txt` plus the job ad? The user can edit the demo CV in the control step (FR-3), and FR-6 masking can alter it. The UI story and the route story will each pick a different rule. Also, `demo: true` in real mode (FR-25) with a text that is not the demo example would run mock answers through the belegg check against the wrong CV, so every requirement ends up downgraded to `mangler`.

**Fix:** Add to AD-5: "The demo example is recognised in `lib/kjerne` with `erDemoeksempel(cvTekst, annonse)`, which compares the texts after the normalisation in FR-9. Whenever the mock adapter would be used (`demo: true` or mode `demo`) and `erDemoeksempel` is false, the route responds `demo_krever_nokkel`." Also note that `testdata/par-1-butikk-bank/demo-svar/` does not exist yet, even though the structural seed says it "already exists". Name the story that creates it (one file per result part, `gap.json`, `brev.json`, `cv.json`, `ats.json`, which must pass that part's zod schema).

### F4 [MEDIUM] The deferred per-part zod schema leaves the shared belegg shape open

AD-4 runs one belegg check over "all result parts that have belegg" and marks removed belegg. The UI shows `nedgradert` and removed markers in four tabs. If each result-part story invents its own field names (`belegg: string` vs. `belegg: string[]` vs. `{ tekst }`, `nedgradert: true` vs. `merknad`), the generic `kjerne` function and the UI cannot be shared. The first story then sets the shape implicitly, and later stories either follow it or fork it. That is the kind of deferral the checklist rejects.

**Fix:** Move the shared primitives out of Utsatt into AD-4 or the Conventions table. Define `Kategori`, `Belegg` (for example `{ tekst: string }`), the field name for belegg on an item, and the marker fields (`nedgradert?: true`, `fjernetBelegg: number`) in `lib/kontrakt`. Also state that the belegg check and the treffprosent run against the **masked** CV text, the one sent to the language model, so a quote that contains `[fødselsnummer fjernet]` still counts as a hit. Only the per-part payload stays deferred.

### F5 [MEDIUM] Timeout and error transport are silent, so AD-8 leaks

`maxDuration` is 60 s, but nothing sets an LLM call timeout below it, and nothing sets the AI SDK `maxRetries`. Its default is 2 retries, which can triple cost and duration and let one generation hit the provider three times. If Vercel kills the function at 60 s, the client receives a 504 with a non-JSON body, not `{ feil: { kode } }`. Network failures in the browser have no code either. The UI error table and the route will diverge on what `llm_tidsavbrudd` means. Stale responses are also unhandled: a brev response that arrives after a new *Analyser* can overwrite the new run.

**Fix:** AD-3/AD-5: the adapter uses `abortSignal` with a 45 s timeout and `maxRetries: 0` (or 1), and maps abort to `llm_tidsavbrudd`. AD-8: the client fetch wrapper in `lib/okt` maps a non-JSON body, 5xx or a network error to `llm_feil`, and 504 or a timeout to `llm_tidsavbrudd`. AD-6: every response is applied only if its `kjoringId` equals the current one. Otherwise it is dropped.

### F6 [MEDIUM] Operational envelope: no evaluation harness and no CI decision

Deployment and environments are well covered (AD-12 and the deploy seed: local, Preview in demo mode, Production with the key, region deferred). Two operational dimensions are silent:

1. **Testset / eval runner.** AD-11 (provider choice), SM-1–SM-3 (3 runs × 4 pairs) and SM-8 (cost from logged tokens) all depend on running the real language model against `testdata/` and recording the results. Nothing says where this runs (a script? Vitest behind a flag? manual runs in the UI?), how it stays out of the key-free `npm test` (NFR-6), or how token usage is collected for SM-8. The first gap story will improvise, and AD-11 hinges on it.
2. **CI.** There is no decision on whether `npm test`, lint and typecheck run on PRs (GitHub Actions) or only locally. With two developers and a public repo, this is a quality-gate decision. Settle it in one line, or defer it explicitly.

**Fix:** Add AD-13 "Testsett-kjøring": `scripts/kjor-testsett.ts` (run with `npx tsx`) calls `generer()` directly with the real adapter, `--leverandor` and `--runder 3`, and writes the results plus the token sum to stdout for the session log. It is excluded from Vitest, and is the only code path that needs a key outside the app. Add a line under Deploy: "CI: GitHub Actions runs `npm ci && npm run lint && npx tsc --noEmit && npm test` on PRs, without a key." Or, if the team declines, write "no CI in v1, tests run locally before merge" under Utsatt.

### F7 [LOW] `server-only` breaks Vitest unless aliased

`lib/llm` and `lib/pipeline` import `server-only` (AD-2). Outside the `react-server` export condition, that package throws on import. So the NFR-6 flow test and the pipeline unit tests fail in plain Vitest.

**Fix:** Add one line to the Tests convention: `vitest.config.ts` aliases `server-only` to an empty module. This also belongs to the starter story.

### F8 [LOW] AD-9 wording and the hard cap

"Global teller i minnet per serverinstans" contradicts itself. With Fluid compute there can be several instances, and cold starts reset the counter, so `GRENSE_PER_DOGN` is not a daily cap. The memlog admits it is a soft limit, but the spine does not. The real cap is the provider's spending limit, and the spine never says how that is enforced. Prepaid credits with auto-recharge off is a hard cap. A budget alert is not.

**Fix:** Reword to "soft limit per instance, reset on cold start". Add: "The hard cap is prepaid credit of at most 200 kr with auto-recharge off at the chosen provider. Verified when AD-11 is settled." Also state whether a failed generation counts.

### F9 [LOW] Smaller coverage notes

- AD-11 picks the provider only on quality and cost. PRD §6 ranks "no training on API data + data processing agreement" first, and §10.1 says this is not yet verified in the terms. The memlog asserts both candidates pass. Add a precondition to AD-11: "verify criterion 1 in the provider's terms before the measurement; record it in the session log".
- NFR-2 needs `.gitignore` to block `*.pdf` and `*.docx` outside `testdata/`. The current `.gitignore` does not. This is story-level, but it could be one line in AD-12.
- pdfjs-dist runs in the browser and in Node (tests). The worker setup and the Node (legacy) entry point differ. A one-line note in AD-7 saves the ingestion story a detour.

## Bloat (story-level detail in the spine)

Bloat is minor overall. The spine is lean.

- "Temperaturen er 0–0,3" (AD-3) is prompt tuning. Move it to the gap story or keep it as a default.
- The Traceability convention (commit messages cite FR IDs) is process, not architecture. It is harmless, but it belongs in the project AGENTS.md or CLAUDE.md.
- The Utsatt line on Prettier is fine as a non-decision. If CI is added (F6), decide formatting there instead.

## Checklist summary

| Criterion | Result |
| --- | --- |
| Fixes real divergence points, misses none | Mostly. Misses the demo-text identity (F3), the shared belegg shape (F4), timeout and error transport plus stale responses (F5), and the eval runner (F6) |
| Every Rule enforceable and prevents its divergence | Yes, except AD-11 (F2 cannot work as written) and AD-9 (F8, its wording overclaims) |
| Nothing in Utsatt lets units diverge | One violation: the "exact zod schema per result part" deferral covers the shared belegg primitives (F4) |
| Named tech verified-current | All 12 pins equal npm `latest` on 2026-11-03. TypeScript 7 is incompatible with typescript-eslint and Next's tooling (F1) |
| Covers spec capabilities | Every FR and NFR is mapped. Gaps: PRD §6 criterion 1 (F9), FR-5 provider text (F2) |
| No silent dimension / operational envelope | Deployment and environments are decided. Eval harness and CI are silent (F6). The hard spending cap is unspecified (F8) |
| Bloat | Minor (temperature, commit convention) |
