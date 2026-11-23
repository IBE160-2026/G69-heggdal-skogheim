---
title: 'Story 2.4: remove the example block (PR #28) from the gap prompt, and keep the PR #27 rules and store: false'
type: 'bugfix'
created: '2026-11-23'
status: 'done'
route: 'oneshot'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/implementation-artifacts/vurdering-2-4-kontroll-ny-prompt.md'
  - '{project-root}/_bmad-output/implementation-artifacts/kjorebok-2-4-del-b.md'
  - '{project-root}/_bmad-output/implementation-artifacts/kjente-svakheter-2-4.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:**
- With the prompt in production (PR #27 + PR #28, `b50e34a`), the test set gave SM-1 9/12, SM-2 10/12 and SM-3 11/12 (`vurdering-2-4-kontroll-ny-prompt.md`). The control on the prompt from `271edb4` gave 12/12.
- PR #28 (`48bb82f`) added two things: the example block (Nordlager AS) in `GAP_INSTRUKS` and `store: false` in `OPENAI_VALG`. Only the example block changes what the model sees. Removing it separates the effect of PR #27 from PR #28.

**Decision (Sondre, decision sheet question 2, 2026-11-23, PR #33, commit `2b66889`; approved by Kevin 2026-11-23):**
- Remove the example block from the prompt. Keep the two PR #27 rules, `.min(1)` on `gapSvar.krav`, and `store: false`.
- After the PR is merged and the deploy is confirmed: the test set once (at most 12 paid calls) and B4 del 2 once in production (1 call). Not part of this spec.
- If SM-1–SM-3 are not 12/12: document the deviations as known weaknesses and measure again in story 5.1. No more prompt tuning.
- «Erfaring med fakturaer» (par 3) is not a breach (question 3).
- 2-4 can be set to `done` when this is carried out and documented (question 4). Not in this spec.

**Scope of this change:**
1. `src/lib/llm/prompter/gap.ts`: delete the 5 lines of the example block (the blank line and the lines from «Eksempel (viser bare framgangsmåten …» up to, not including, the blank line before «Oppgaven:»). Nothing else in the prompt changes.
2. `src/lib/llm/prompter/gap.test.ts`: delete the `describe("NFR-9: eksempelet med en innplantet melding i annonsen")` block (7 tests). They test only the removed text.
3. Documentation: § 7a in `kjorebok-2-4-del-b.md`, the status box in `kjorebok-2-4-del-c.md`, `.logs/kevin-heggdal/issues.md`, and a PR draft. Record the decision, what is kept, and the pending paid runs.

**Pass criteria (free checks):**
- `git diff aeb3aca -- src/lib/llm/prompter/gap.ts src/lib/llm/prompter/gap.test.ts` is empty: the prompt and its tests are byte-identical to PR #27.
- `git diff --stat origin/main -- src` lists only those two files.
- `src/lib/llm/openai.ts`, `openai.test.ts`, `adaptere.test.ts`, `src/lib/kontrakt/`, `src/lib/pipeline/` are unchanged.
- No «Nordlager» or «Eksempel (viser bare» left in `src`. `store: false` is in `openai.ts`, and `.min(1)` is in `kontrakt/gap.ts`.
- Lint, typecheck, `npm test` (7 fewer tests than on `origin/main`) and `npm run build` are green.

**Rules:**
- No paid API calls and no B4 test.
- No change to API keys, `.env.local`, test data, answer keys or the privacy box.
- No commit, push or PR without Kevin's approval.
- 2-4 stays `in-progress`. No story 2.7 or 5.1.

**Not decided here (for Sondre, before the paid calls):**
- What happens if B4 del 2 fails without the example: keep the prompt and record NFR-9 as a known weakness, or restore the PR #28 prompt, which has already passed B4.
- Which prompt stays in production if SM-1–SM-3 are not 12/12 but B4 passes (assumed: without the example).
- Which of the earlier attempts (16:01 or 16:36) used the README content. It can be read for free in the stored rows under Logs at OpenAI until about 19–20 December 2026.

</frozen-after-approval>

## Implementation Notes

- **Branch:** `story-2.4-fjerne-eksempelblokk` from `origin/main` `7a029cbb7dc1f9cb14966c6365906c81348e8296`, upstream unset so a push cannot target `main` by mistake.
- **Epic context:** `epic-2-context.md` was older than the PRD (PR #31 changed its open-questions list), so it was recompiled by a subagent. Only the provider bullet, a new privacy-text bullet and one dependency wording changed.
- **Code:** the 5 example lines removed from `GAP_INSTRUKS`, and lines 146–199 of `gap.test.ts` (the `describe` block and its trailing blank line). `gapBrukermelding`, `CV` and `ANNONSE` are still used by other tests, and lint is clean.
- **Checks:**
  - `git diff aeb3aca` for both files: 0 bytes
  - `git diff --stat origin/main -- src`: only the two files, 59 deletions
  - no «Nordlager» or «Eksempel (viser bare» in `src`
  - `store: false` at `openai.ts:14` and `.min(1)` at `kontrakt/gap.ts:51`
  - lint and typecheck green
  - `npm test` 920/920 (baseline 927/927 on `origin/main`)
  - `npm run build` green
- **Docs:**
  - a new subsection at the end of § 7a in `kjorebok-2-4-del-b.md`
  - an update box in `kjorebok-2-4-del-c.md`
  - the 2026-11-21 item in `.logs/kevin-heggdal/issues.md` moved to Løst
  - PR draft `pr-2-4-fjerne-eksempelblokk.md`
  - New open items (the paid runs, Sondre's two questions, 16:01/16:36) go in through the `sesjonslogg` skill, which commits, so that waits for Kevin's approval.
- **Not done here, by Kevin's instruction:** commit, sprint-status sync (2-4 stays `in-progress`), paid calls.
- **Update 2026-11-23 (after PR #33):** Sondre merged PR #33 into `main` (`7eb7300c37ec82f08902be2e0efd249c0627362e`). The branch was fast-forwarded from `7a029cb` with the uncommitted changes in place. PR #33 touched only `beslutningsark-2-4-sondre.md` and `.logs/sondre-skogheim/`, none of which this change touches, so there were no conflicts. The del C box and the PR draft now say PR #33 is merged. Kevin approved a local commit, but no push or PR.

## Review Triage Log

Two reviewers: Blind Hunter (context-free) and a scope auditor (checked the diff against Sondre's answers in `2b66889`). The auditor confirmed the code scope: the `aeb3aca` diff is empty, only the two prompt files changed in `src`, PR #28's `openai.ts`, `openai.test.ts` and `adaptere.test.ts` are intact, and 920 + 7 = 927.

| # | Finding | Verdict | Route | Evidence / action |
|---|---|---|---|---|
| 1 | `issues.md` lines 29–31 still call Sondre's answers to questions 2, 5, 6, 8 and 9 open | medium | patch | Verified against the file. A dated update with the answers and what remains was added to each item |
| 2 | Resolved item and PR draft point to unmerged PR #33 | low | patch | Verified: `2b66889` is not on `origin/main`. The PR draft now says to merge PR #33 first |
| 3 | PR draft does not say whether merging waits for Sondre's two fallback questions, and gives no rollback | medium | patch | Merging deploys the prompt. The draft and § 7a now say "helst før flettingen" and that a revert restores `b50e34a` |
| 4 | `kjente-svakheter-2-4.md` lines 13 and 73 are stale | low | patch | Line 73 treated the removal as hypothetical. Both lines updated, still saying it is not merged |
| 5 | `epic-2-context.md` still says the way forward is undecided, and drops questions 8, 9 and 11 | false | reject | The epic context is compiled from planning artifacts only. The decision sheet is an implementation artifact on an unmerged branch. The implementation docs carry the decision |
| 6 | Questions 3 and 4 are missing from the runbooks and the PR draft, and the question-3 answer-key follow-up has no owner | low | patch | Added to § 7a ("Etter de betalte kallene") and to `issues.md` item 30, as a test-data change that needs approval |
| 7 | The runbook does not say what to do with the result (PRD §10.1, known weaknesses, signing, key deletion) | low | patch | Added to § 7a |
| 8 | New open items wait for `sesjonslogg`, so the paid runs had no open item | medium | patch | `issues.md` item 30 (open) now lists the paid runs and the fallback questions |
| 9 | No test stops the example from coming back | low | reject | A test would break the byte-for-byte match with PR #27, which is the acceptance check. The trade-off is written in the PR draft |
| 10 | "§ 7a" references are vague | low | patch | The del C box now names the subsection |
| 11 | "5 linjer" is imprecise | low | patch | The PR draft now says 4 text lines and 1 blank line, old lines 22–26 |
| 12 | Kevin's approval has no source in the repo | false | reject | Kevin approved the plan in this session on 2026-11-23. The session log records it |
| 13 | The frozen Intent lists the 16:01/16:36 question "for Sondre", but Sondre's answer to question 6 says Kevin answers it | low | note | The frozen block is not edited. § 7a and `issues.md` say correctly that Kevin answers it |
| 14 | The del C box line "Sondre har svart" may suggest all answers are followed up | low | patch | Added a line saying the box follows up only question 2 |
| 15 | State Sondre's premise (B4 failed only because of the wrong file) next to the open questions | low | patch | Added to § 7a |

Final review after the fast-forward to `7eb7300` (Blind Hunter). It confirmed the scope: in `src` only the two files changed, the `aeb3aca` diff is empty, PR #33's files are untouched, and 920/920 tests pass.

| # | Finding | Verdict | Route | Evidence / action |
|---|---|---|---|---|
| 16 | `epic-2-context.md` still says the way forward is undecided, now that PR #33 is merged | false | reject | The epic context is compiled from planning artifacts only, and the decision sheet is not one. The implementation docs carry the decision. This replaces the "unmerged branch" half of #5's reason |
| 17 | Triage #2 is stale after the merge of PR #33 | low | note | The log is append-only. The PR draft and the del C box now say PR #33 is merged (`7eb7300`) |
| 18 | Status lines saying «ikke flettet» or «ikke gjort» will be wrong after merge | low | patch | Added a post-merge step to update them, in the PR draft and § 7a |
| 19 | Sondre's question-6 answer rests on three B4 passes, all with the example block | medium | patch | Verified against the decision sheet. Added as an open question in the PR draft and § 7a |
| 20 | The `TEMPERATUR` comment follow-up (decision sheet: fix it when question 2 is decided) is not mentioned | low | patch | Listed as not in this PR. It is a code change that needs approval |
| 21 | The PR draft says `issues.md` covers questions 2–9 | low | patch | The wording now names 2, 3, 4, 5, 6, 8, 9. Questions 7 and 11 are Sondre's items in his `issues.md` from PR #33 |
| 22 | The rollback via a merge revert is imprecise and would also revert the docs | low | patch | Now: restore only `gap.ts` and `gap.test.ts` from `b50e34a` in a small PR approved by Kevin and Sondre |
| 23 | No B4 pass criterion and no order in the post-merge plan | low | patch | Criteria from § 7a referenced, `ugyldig_svar` is not a pass, the test set runs first, and the report shows the commit |
| 24 | One run cannot separate the prompt effect from run-to-run variation | medium | patch | Caveat added to § 7a and the PR draft. The frozen "separates the effect" wording is left as is |
| 25 | "Byte for byte" holds in git, not on disk (`core.autocrlf=true`) | low | patch | § 7a and the PR draft now say "identiske i git". Verified: the index has LF, and `git diff aeb3aca` is empty |
| 26 | Extra blank line in the Løst list; nested bullets in item 30 | low | patch / reject | Blank line removed. The nested bullets are kept for readability |
