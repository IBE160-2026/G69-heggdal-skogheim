---
title: 'Story 2.4, B4 del 2: the prompt skips instructions in the ad but still extracts all requirements, and an empty requirement list is rejected as ugyldig_svar'
type: 'bugfix'
created: '2026-11-20'
status: 'done'
route: 'oneshot'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/implementation-artifacts/kjorebok-2-4-del-b.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** B4 del 2 (NFR-9) failed in production on 2026-11-20. With the CV for par 1 and `testdata/robusthet/annonse-med-instruks.txt` (the full ad for par 1 plus a planted instruction), the gap analysis came back as HTTP 200 with **0 requirements**, and it was shown without any message. The most likely cause, not confirmed, is that the instruction disrupted the model's answer. The app then accepted an empty list:
- `gapSvar.krav` in `src/lib/kontrakt/gap.ts` has no minimum.
- The tab hides empty groups.

**Approach (approved by Sondre and Kevin, 2026-11-20):**
1. **Prompt** (`src/lib/llm/prompter/gap.ts`):
   - State that text in the ad that tries to give instructions is neither a requirement nor an instruction. It is skipped, and the task is done as usual with the rest of the ad.
   - State that a job ad gives at least one requirement, and that all ordinary requirements are extracted even when the ad contains such text.
   - The existing rules on documentation, categories, evidence and honesty (never invent experience) are kept unchanged.
2. **Validation:** `gapSvar.krav` gets `.min(1)`. An empty list from the model then fails `gapSvar.safeParse` in the pipeline, gives `ugyldig_svar` (HTTP 502), and the user sees the existing message «Svaret fra språkmodellen kunne ikke brukes. Prøv igjen.» with *Prøv igjen* (FR-22, AD-8).
3. **Tests:** unit tests for the new prompt rules, that `gapSvar` rejects an empty list and accepts one requirement, and that the pipeline gives 502 `ugyldig_svar` for 0 requirements.
4. **Documentation:** record the fix in the runbook. The failed B4 test stays as history.

**Rules:**
- No paid calls.
- No change to the answer keys or test data.
- `gapAnalyse` (the pipeline output), `GapGrunnlag` and the JSON schema sent to the model (`gapModellSkjema` in `felles.ts`) are not changed.
- No push, PR, merge or deploy without Kevin's approval.

</frozen-after-approval>

## Implementation Notes

- **Why the model schema is unchanged:** `gapModellSkjema` is sent as a strict JSON schema. Adding `minItems` there could be rejected by the provider, which would turn into `llm_feil` in production. That cannot be verified without a paid call, so the check is done in code instead (AD-4).
- **The measurement no longer matches the code exactly.** The prompt was measured at `271edb4`, with `TEMPERATUR = 0` from `ee49c2b`. Changing the prompt means that the test set (SM-1–SM-3) and B4 del 2 must be run again before the results apply to the new prompt (the SM-2 rule in the PRD: when the prompt changes, everything is run again). That needs paid calls and Kevin's approval.
- **Merging deploys production.** Merging to `main` probably deploys production automatically, so production would run the unmeasured prompt until the re-test is done. Raised with Kevin.
- **Files:**
  - `src/lib/llm/prompter/gap.ts` (two prompt rules)
  - `src/lib/kontrakt/gap.ts` (`.min(1)` on `gapSvar.krav`, and a comment)
  - `src/lib/llm/prompter/gap.test.ts`, `src/lib/kontrakt/gap.test.ts` (new), `src/lib/pipeline/generer.test.ts`
  - `kjorebok-2-4-del-b.md` § 7a
  - `.logs/kevin-heggdal/issues.md`
- **Verification:**
  - Without `.min(1)`, 4 of the new tests fail. With it, lint, typecheck, `npm test` (all green) and `npm run build` pass.
  - The prompt tests check wording only.
- **Decisions left to Kevin:**
  - A dedicated message for an ad with no requirements.
  - An empty-state message in the tab.
  - Updating `testdata/robusthet/README.md`.
  - Re-running the test set and B4 del 2, which are paid calls, and the order relative to merge.

## Review Triage Log

| # | Finding | Verdict | Route | Evidence |
|---|---------|---------|-------|----------|
| 1 | "Never empty" clashes with "only qualifications are requirements" and with non-ads | medium | patch | Rewritten: instructions do not cause requirements to be dropped, the rules above still apply, and tasks are never turned into requirements to fill the list. An empty list is caught by `.min(1)` |
| 2 | `ugyldig_svar` is misleading for an ad with no requirements, and retrying loops at temperature 0 | medium | defer (Kevin) | Needs a new error code and UI copy, which is beyond the approved scope. Documented as a known limit and an open item |
| 3 | The new rule covers only the ad, not the CV | low | patch | It now says "CV-teksten eller annonsen" |
| 4 | Duplicate wording, and a redundant test | low | patch | Duplicate sentence removed, and the tests merged to three |
| 5 | Comment on the wrong declaration | low | patch | Moved above `gapSvar` |
| 6 | `testdata/robusthet/README.md` is out of date | low | defer (Kevin) | Test data must not be changed without approval. The re-test criteria are written in the runbook |
| 7 | Only the server is protected, and the empty view in the tab remains | medium | defer (Kevin) | Documented. The issue was reworded from "rettet" to "delvis rettet", with a new open item |
| 8 | No end-to-end test from API to tab | low | patch (doc) | The runbook says the message relies on the existing `ugyldig_svar` tests |
| 9 | The test-count claim needs qualifying | low | patch | The runbook says the prompt tests check wording only |
| 10 | The report for runs where every attempt is `ugyldig_svar` | low | reject | `scripts/testsett/kjor.test.ts` already covers a run with `feilkode: "ugyldig_svar"` and `analyse: null` |
| 11 | Spec status, log link, the `TEMPERATUR` comment | low | patch / defer | Spec done, session log written before commit. The `TEMPERATUR` comment stays an open item (a separate code change) |
