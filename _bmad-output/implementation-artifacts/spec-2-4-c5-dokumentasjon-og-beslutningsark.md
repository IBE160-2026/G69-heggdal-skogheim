---
title: 'Story 2.4 C5: decision sheet for Sondre, PRD §10.1, runbook C, known weaknesses, part A findings and a draft closing PR'
type: 'chore'
created: '2026-11-22'
status: 'done'
route: 'oneshot'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/implementation-artifacts/kjorebok-2-4-del-c.md'
  - '{project-root}/_bmad-output/implementation-artifacts/vurdering-2-4-kontroll-ny-prompt.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Story 2.4 is waiting for Sondre to review the open PR with the deviation analysis (branch `story-2.4-b4-resultat`). The C5 documentation is stale or missing in the meantime:
- PRD §10.1 still says SM-1 is not passed because par 3 gave 9 of 12.
- The status in runbook C does not mention PR #29 or the open PR.
- The known weaknesses are not collected anywhere.
- The review findings from part A are unchecked although some are fixed.
- Sondre's open decisions are spread across several files.

**Approach:** On the new branch `story-2.4-c5-dokumentasjon` (from `origin/main` `50a7e36`), write the documentation in Norwegian:
- a decision sheet for Sondre
- a factual PRD §10.1
- an updated runbook C
- a known-weaknesses document
- verified status for the part A findings
- a draft of the closing PR

**Rules (Kevin, 2026-11-22):**
- Documentation and verification only. No change to the prompt, code or test data.
- No paid calls, no key changes, no signatures on anyone's behalf, and no decisions that need Sondre.
- 2-4 is not set to `done` (and not to `review`), and story 2.7 is not started.
- The files in the open PR are not touched:
  - `vurdering-2-4-kontroll-ny-prompt.md`
  - `pr-2-4-b4-resultat.md`
  - `spec-2-4-avvik-for-sondres-gjennomgang.md`
  - `.logs/kevin-heggdal/992-*`
  - `.logs/kevin-heggdal/issues.md`
- A box is ticked only when it is documented and verified.
- The PRD must not claim that SM-1–SM-3 are passed.
- No commit or push without Kevin's approval.

</frozen-after-approval>

## Implementation Notes

- **Workflow deviations (Kevin's rules take precedence):**
  - The oneshot commit step is skipped until Kevin approves.
  - The sprint-status sync to `review` is skipped, so 2-4 stays `in-progress`.
  - The session log skill is not run, because it commits and edits `issues.md`, which is in the open PR.
- **Verified before writing:**
  - The part A review findings in `spec-2-4-velge-leverandor-ved-maaling.md`:
    - #1, the default model is `gpt-4.1-mini` (`src/lib/llm/leverandor.ts:17`, switched in `246e58b`). Fixed.
    - #2 is partial (`scripts/kjor-testsett.ts:244-248`, `246e58b`). It warns and exits with 1 when all runs fail. No sanitised cause per run is recorded, because `medTokens` (lines 70-91) only captures tokens.
    - #3, «N krav (fasiten har M)» and repeated requirements, is not in `scripts/testsett/rapport.ts`.
    - #4, the average is no longer labelled «minst» (`scripts/testsett/kostnad.ts:31-32`, `246e58b`). Fixed.
  - AK 2 (result, `LLM_MODELL` and commit in the session log): `.logs/kevin-heggdal/993-2026-11-19-15-57-09-story-2-4-del-b-forberedelse.md` line 594.
- **Files:**
  - new: `beslutningsark-2-4-sondre.md`, `kjente-svakheter-2-4.md`, `pr-2-4-c5-avslutning.md`
  - edited: `prd.md` §10.1, `kjorebok-2-4-del-c.md`, `spec-2-4-velge-leverandor-ved-maaling.md` (Review Findings only, outside the frozen block), `deferred-work.md` (status line on the PRD item)
- **Correction during the work:** the default-model switch was first credited to `374495d`. `git show` shows that `246e58b` made the switch and `374495d` added the comment, so both specs were corrected.
- **The open PR is #30** (`refs/pull/30/head` = `8eeb2b7`). The docs first called it "a new PR" and now call it PR #30. Its `issues.md` line from 2026-11-21 calls section 2a "(PR #29)", which is wrong. That file is in PR #30, so it is left for Kevin to fix there or after the merge.

## Review Triage Log

Blind Hunter, 12 findings (floor 7). All of them are real and were patched. None was deferred.

| # | Finding | Verdict | Route | Evidence |
|---|---------|---------|-------|----------|
| 1 | Question 2 ignores Sondre's existing approval of the test set and the agreed order | medium | patch | `issues.md` line of 2026-11-21 in PR #30. Cited as "Allerede avtalt", and what is still missing is now stated |
| 2 | The open PR is unnamed, and its `issues.md` says "PR #29" | medium | patch | `git ls-remote`: `refs/pull/30/head` = `8eeb2b7`. Named PR #30 everywhere. The wrong reference in PR #30 is noted, not edited |
| 3 | The weaknesses intro promises a follow-up target at every point | low | patch | Reworded: the targets for sections 1–5 are named, and the rest point to the sheet, `issues.md` or `deferred-work.md` |
| 4 | The `TEMPERATUR` comment is named but its wrong text is not | low | patch | `felles.ts:17-22` quoted in the sheet. It is tracked in `issues.md` (2026-11-20), so there is no new deferred entry |
| 5 | No owner for checking the legal basis of the USA transfer | medium | patch | New question 11 in the sheet. Signatures moved to 12, and the runbook reference updated. The DPA date is already in Sondre's log, as cited in C3 |
| 6 | Question 7 misquotes checklist section 7 ("eieren") | low | patch | Rewritten: what is already answered (C3) and what is still open. *Sensitive* is not confirmed, because the runbook says "Secret" |
| 7 | Question 8 hedges on fictive data | low | patch | `kjorebok-2-4-del-b.md:468` cited |
| 8 | Question 5 leaves out the risk that the keys share the credit | medium | patch | C2 quoted, with the option to delete now and create a new key later |
| 9 | Question 4 leaves out the "Realiserer: SM-1, SM-2, SM-3" counterargument | medium | patch | `epics.md` story 2.4 header, and the re-run rule in PRD SM-2, added as "Det som taler mot a)" |
| 10 | Finding #1 is verified in one place only | low | patch | `argumenter.ts:27`, `README.md:44` and `adaptere.test.ts:134` checked and cited |
| 11 | Weaknesses §2 overstates the old-prompt occurrence | low | patch | `vurdering-2-4-kontroll-ny-prompt.md` line 75 ("Før sto den bare i K1"). The 11 of 12 on the old prompt added |
| 12 | Weaknesses leave out the B4/NFR-9 uncertainty | low | patch | Added to § 7 with § 7a and question 6 |
