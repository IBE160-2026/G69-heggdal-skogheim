---
title: 'Story 2.4: assess the test set run with the new prompt (after PR #27 and PR #28) against SM-1, SM-2 and SM-3'
type: 'chore'
created: '2026-11-20'
status: 'done'
route: 'oneshot'
review_loop_iteration: 0
context:
  - '{project-root}/testsett-rapporter/2026-11-20-182613-openai-gpt-4.1-mini.md'
  - '{project-root}/testdata/sjekkliste.md'
  - '{project-root}/_bmad-output/implementation-artifacts/vurdering-2-4-kontroll-temperatur-0.md'
  - '{project-root}/testdata/par-1-butikk-bank/fasit.md'
  - '{project-root}/testdata/par-2-it-support/fasit.md'
  - '{project-root}/testdata/par-3-regnskap/fasit.md'
  - '{project-root}/testdata/par-4-tokolonne-hotell/fasit.md'
  - '{project-root}/_bmad-output/implementation-artifacts/vurdering-2-4-leverandorvalg-runde-5.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The prompt changed after the measurement (PR #27 and PR #28). With Kevin's and Sondre's approval, the test set was run once with the new prompt:
- 12 paid calls, run from `story-2.4-b4-resultat` at `85ab227`. The code is the same as production at `b50e34a`.
- The report is `testsett-rapporter/2026-11-20-182613-openai-gpt-4.1-mini.md`.

The results must be assessed against the checklist and the answer keys, including the revised key for par 3 (decision B).

**Approach:**
- Write `vurdering-2-4-kontroll-ny-prompt.md` in Norwegian. It covers the categories per run, the SM-1 (gap), SM-2 and SM-3 checks, FR-8, NFR-4, NFR-5 and the cost, plus a comparison with the temperature-0 control on the old prompt.
- Apply the earlier decision on SM-2 wording (round 4: using the ad's term "brukerstøtte" about the user counts as a breach) consistently. Leave the final call to Kevin and Sondre.
- Update the runbook, the assessment pointer, `issues.md` and the session log.
- Commit the real report (as the README says).

**Rules:**
- No new paid calls.
- No change to the prompt, code, answer keys or test data.
- No push, PR or merge.
- Story 2.4 is not marked done.

</frozen-after-approval>

## Implementation Notes
- **Paid calls:** exactly 12 (the test set), 0,2456 kr. No reruns.
- **Results:**
  - SM-3 11 of 12 (par 3 K1 «Gode samarbeidsevner» D over the revised key).
  - SM-2 10 of 12 under the rule Kevin and Sondre decided on 2026-11-19 (par 2 K1 and K3: «brukerstøtte», «forståelse av Windows»), with one borderline case in par 3.
  - SM-1 (gap) 9 of 12.
  - The FR-8 tolerance holds. NFR-4 and the cost are J, and NFR-5 is J with minor errors.
  - Worse than the temperature-0 control on the old prompt. The cause is not shown.
- **Files:**
  - `vurdering-2-4-kontroll-ny-prompt.md` (new)
  - `kjorebok-2-4-del-b.md` § 7a, plus the header and status lines
  - `kjorebok-2-4-del-c.md`, the header, status line and C5 gate
  - `vurdering-2-4-kontroll-temperatur-0.md` § 5 and the § 6 title
  - `.logs/kevin-heggdal/issues.md`
  - the report `testsett-rapporter/2026-11-20-182613-openai-gpt-4.1-mini.md`
- **Verification:**
  - The reviewer re-derived the categories, SM-3, FR-8, SM-2 and SM-1, the cost and the tokens independently.
  - Lint and typecheck are green, `npm test` gives 927 of 927, and the build is green.
  - `src` and test data are unchanged, and there are no secrets.

## Review Triage Log

| # | Finding | Verdict | Route | Evidence |
|---|---------|---------|-------|----------|
| 1 | Wrong earlier token figures, and the cost rise is missing | low | patch | +480 tokens per pair (2558–2710 → 3038–3190), and 0,0185 → 0,0205 kr |
| 2 | "Like" overclaims, it holds only for categories | low | patch | Now says the categories, and lists the variation in wording, evidence and keywords |
| 3 | «forståelse av Windows» is missed | medium | patch | Counted under the 2026-11-19 rule. Same runs, so the count is unchanged |
| 4 | «erfaring med fakturaer» is treated unevenly | medium | patch | Called a borderline case with reasons (the CV's word, but a wider claim, now in 3 of 3 runs). Alternative count 7 of 12 |
| 5 | The SM-2 precedent is a decision, not open | medium | patch | Applied as decided. The "mild" reading is removed everywhere |
| 6 | NFR-9 for the old prompt is "untested", and «løser» overclaims | medium | patch | "Uavklart", and "besto NFR-9-testen" |
| 7 | The par 4 job title lost «– deltid» | low | patch | Added as a regression |
| 8 | NFR-5 errors are missed | low | patch | Added (muntlig, førerkort advice, kundebehandling) |
| 9 | More than the prompt changed | low | patch | `store: false` and `.min(1)` listed |
| 10 | The FR-8 label misleads | low | patch | The checklist line is N in par 3 K1, and the tolerance is J |
| 11 | Stale statuses in the runbooks and the old assessment | medium | patch | Updated, including the C5 gate |
| 12 | `issues.md` items with changed premises | low | patch | The key and `TEMPERATUR` items are updated |
| 13 | The session log and report commit are missing, and the spec context is incomplete | low | patch | Context added. The report and log are committed |
| 14 | §0 claims that the report cannot show | low | patch | The source is now named (`git status` and Kevin's confirmation) |
