---
title: 'Story 2.4, SM-1: revise the answer key for par 3 «Gode samarbeidsevner» to Mangler (decision B)'
type: 'chore'
created: '2026-11-20'
status: 'done'
route: 'oneshot'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/implementation-artifacts/beslutningsgrunnlag-2-4-fasit-par-3.md'
  - '{project-root}/_bmad-output/implementation-artifacts/vurdering-2-4-kontroll-temperatur-0.md'
  - '{project-root}/testdata/par-3-regnskap/fasit.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** SM-1 is not passed (9 of 12). In par 3 the chosen setup (OpenAI `gpt-4.1-mini`, temperature 0) gives Mangler for two requirements where the answer key has Delvis oppfylt, and FR-8 allows at most one below.

**Decision B (Kevin and Sondre, 2026-11-20):**
- «Gode samarbeidsevner» changes from Delvis oppfylt to Mangler.
- «Strukturert og nøyaktig» stays Delvis oppfylt.

**Approach:**
- Change the row in `testdata/par-3-regnskap/fasit.md`.
- Add a dated section saying the answer key was revised on professional grounds after the measurement. The reasons come from the CV, the ad and FR-8, not from what the model answered.
- Record the decision in section 5 of the decision basis.
- Update section 6 of the temperature-0 assessment: SM-1 becomes 12 of 12 in the existing control without a new measurement. SM-3 stays OK for the chosen setup.
- Record that earlier runs with Delvis oppfylt for this requirement are now above the answer key: OpenAI round 3, round 4 K3 and round 5 K2, and Mistral rounds 2–5. The choice of provider under AD-11 is unchanged.
- The original measurement results and the round assessments are kept unchanged.

**Rules:**
- No new measurements and no paid calls.
- No code or prompt changes.
- «Strukturert og nøyaktig», the keyword list and the hit rate (8 %) are not changed.
- Story 2.4 is not marked done.

</frozen-after-approval>

## Implementation Notes

- `scripts/testsett/fasit.ts` reads only the table, the keyword line and the forbidden claims, each by its `## ` heading. A new `## ` section after the table does not affect parsing. `fasit.test.ts` only counts rows.
- `testdata/** text eol=lf`: the file keeps LF.
- **Files:**
  - `testdata/par-3-regnskap/fasit.md`
  - `beslutningsgrunnlag-2-4-fasit-par-3.md` (sections 5 and the banner)
  - `vurdering-2-4-kontroll-temperatur-0.md` (sections 1, 2, 3, 5 and 6)
  - `kjorebok-2-4-del-b.md` (banner)
  - `pr-2-4-del-b.md` (banner)
  - The SM-1 lines in `kjorebok-2-4-del-c.md` and the PR drafts for del C, committed with the key/usage correction because they share files
- **Signatures:** Sondre's approval was relayed by Kevin. The assessment's sign-off line is still blank, and signing stays in C5.
- **Not changed (needs approval):** the code comment in `src/lib/llm/felles.ts` lines 19–20 still describes the old answer key. Logged as an open item. Sondre's own `issues.md` still lists SM-1 as open, so Kevin tells Sondre.
- **Verification:**
  - `fasit.ts` parsing was checked by the reviewer.
  - `git diff --check`, lint and typecheck are green, and `npm test` gives 896 of 896.
  - The fasit file keeps LF.

## Review Triage Log (combined review of both specs)

| # | Finding | Verdict | Route | Evidence |
|---|---------|---------|-------|----------|
| 1 | C4 still says Usage cannot show per key | low | patch | Reworded: the figures were given at week level, and Usage can filter per key |
| 2 | The checklist still points to a separate project | low | patch | Annotated at line 51 and line 107 |
| 3 | The closed C4 item in `issues.md` says the per-key point is open | low | patch | Correction note added |
| 4 | The section 2 table drops the counts for rounds 4 and 5 | low | patch | Counts added (R4 11 → 10, R5 10 → 10 with different runs) |
| 5 | "Mistral feilet SM-3 og NFR-4" is wrong | medium | patch | Medium 3.5 failed SM-3 and SM-1, and Large 4 failed NFR-4 |
| 6 | Stale SM-1 texts in force | medium | patch / defer | Banners in the del B runbook and the PR drafts, a note in section 3, and the issue reworded. The code comment is an open item (code change not approved). Sondre's issue is for him to close |
| 7 | The code comment and Sondre's item | low | defer | As above |
| 8 | Signing condition not met | medium | patch | Stated openly that the approval was relayed, and signing remains in C5 |
| 9 | Claims the session log already records it | low | patch | Session log written before commit, and the reference made explicit |
| 10 | Two intents mixed, the answer key needs its own commit | low | patch | The answer key, basis and assessment go in their own commit. The shared files go in the second commit, stated in its message |
