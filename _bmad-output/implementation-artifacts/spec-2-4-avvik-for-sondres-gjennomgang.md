---
title: 'Story 2.4: document the failed requirements with verbatim model output and earlier occurrences, for Sondre''s review in PR #29'
type: 'chore'
created: '2026-11-21'
status: 'done'
route: 'oneshot'
review_loop_iteration: 0
context:
  - '{project-root}/testsett-rapporter/2026-11-20-182613-openai-gpt-4.1-mini.md'
  - '{project-root}/_bmad-output/implementation-artifacts/vurdering-2-4-kontroll-ny-prompt.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Sondre wants to review the deviations before any more changes are made. The documentation in PR #29 (`story-2.4-b4-resultat`) must clearly show three things:
- the test pairs, runs and specific requirements that failed SM-1, SM-2 and SM-3
- the forbidden SM-2 claim, quoted verbatim from the model's actual output
- which failures also occurred in measurements before PR #28, with references to the earlier reports

**Approach:**
- Add a section to `vurdering-2-4-kontroll-ny-prompt.md`, in Norwegian:
  - a table per pair, run and requirement, with the category, the model's explanation quoted verbatim, and the CV text
  - the earlier occurrences in rounds 3, 4 and 5 and the temperature-0 control, with report file and line, the prompt commit, and the answer key in force at the time
- Update the PR draft `pr-2-4-b4-resultat.md`.
- Commit and push to the same branch.

**Rules:**
- Documentation only. No change to the code, prompt, answer key or test data.
- No paid calls, no new branch or PR, and no merge.
- No keys deleted, and story 2.7 is not started.
- The example block is not removed.

</frozen-after-approval>

## Implementation Notes
- **Files:**
  - `vurdering-2-4-kontroll-ny-prompt.md`: new § 2a and a pointer in the status box
  - `pr-2-4-b4-resultat.md`: the verbatim SM-2 claims and the table of earlier occurrences
- **Sources used:**
  - OpenAI reports `2026-11-19-2220-…` (round 3), `223737-…` (round 4), `225200-…` (round 5) and `225914-…` (the control)
  - Mistral `2026-11-19-2222-…`
  - the round vurdering files, `testdata/par-2-it-support` and `testdata/par-3-regnskap` (CV and answer key)
- **Verification:**
  - Every quote was checked by script against the reports and CVs.
  - `src` and `testdata` are unchanged, and `npm test` gives 927 of 927.
  - Lint and typecheck are green, and there are no secrets.
- **PR #29** already exists for the branch (`refs/pull/29/head`). The GitHub description must be updated by hand from the draft, because `gh` is missing.

## Review Triage Log

| # | Finding | Verdict | Route | Evidence |
|---|---------|---------|-------|----------|
| 1 | "fri for alle feilene" ignores the borderline case in the control | medium | patch | Names the three failures, and the borderline case is noted |
| 2 | SM-2 sentence and SM-3 category merged in the brukerstøtte row | medium | patch | Split. The sentence occurred only in round 4 K1, never with `271edb4` |
| 3 | The answer key is paraphrased | low | patch | Now quoted |
| 4 | CV quote spacing | low | patch | The date span was moved out of the quote |
| 5 | The job title is missing from the CV column, and the PR says "bare" | medium | patch | Added |
| 6 | Some earlier cells have no quote | low | patch (partial) | Example quotes added for round 3 samarbeid and fakturaer. The rest have line numbers |
| 7 | The borderline counting rule is not stated | low | patch | Stated in the row header |
| 8 | The near-miss wording is noted for the control only | low | patch | Rounds 4 and 5 K3 are noted |
| 9 | Mistral occurrences are missing | low | patch | One line. The reviewer's quote «kan tyde på» for line 331 was wrong (it is «samhandling»), so no quote is used |
| 10 | The overwritten round 3 control is not acknowledged | low | patch | Caveat added |
| 11 | The intro names only one source | low | patch | All sources named |
| 12 | The category column mixes meanings | low | patch | Split into model and answer key |
| 13 | The PR leaves out the Windows claim | medium | patch | Quoted |
| 14 | The spec is unfinished | low | patch | Finalized here |
