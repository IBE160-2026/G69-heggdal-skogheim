---
title: 'Story 2.4 del C, step 4: document that MAKS_UTDATA_TOKENS was reviewed and kept at 8000'
type: 'chore'
created: '2026-11-20'
status: 'done'
route: 'oneshot'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/implementation-artifacts/kjorebok-2-4-del-c.md'
  - '{project-root}/_bmad-output/implementation-artifacts/vurdering-2-4-kontroll-temperatur-0.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The comment on `MAKS_UTDATA_TOKENS` in `src/lib/llm/felles.ts` still says that the value will be reviewed after the measurement in story 2.4. The review is done: Kevin approved on 2026-11-20 to keep 8000. With the chosen setup (OpenAI `gpt-4.1-mini`, temperature 0), the highest output was 608 tokens (`vurdering-2-4-kontroll-temperatur-0.md`).

**Approach:** Update only the comment, in Norwegian like the rest of the file, so it records:
- the review on 2026-11-20 and the measured maximum
- why 8000 is kept: a lower cap could cut answers for long ads (up to 8000 characters) and give `ugyldig_svar`, and the cost difference is small
- that the value is reviewed again in epic 3, when brev, cv and ats use the cap

**Decisions (Kevin, 2026-11-20):**
- `MAKS_UTDATA_TOKENS` stays 8000.
- `GRENSE_PER_MINUTT` (10) and `GRENSE_PER_DOGN` (200) keep their code defaults. No variables are set in Vercel for them.
- No value, test, prompt or setting changes. No push, deploy or paid calls.

</frozen-after-approval>

## Implementation Notes

- **Files:** `src/lib/llm/felles.ts` (comment only).
- **Not synced to sprint-status:** this is a sub-task of del C. Story 2-4 stays `in-progress` until AK 1–3 are met and SM-1 is settled. The oneshot step would otherwise set it to `review`.
- **Epic context:** the cached `epic-2-context.md` was reused, not recompiled. Some planning files have newer timestamps, but a comment-only change does not depend on them.
- **Also updated (docs):** `kjorebok-2-4-del-c.md`:
  - status banner
  - C3 step 5 and C5 decided
  - provisional C1/C2 status from Sondre
  - OpenAI cost note
  - del B PR already merged
- **Verification:** lint, typecheck and `npm test` (896 of 896) are green, and they are run again after the review fixes. `adaptere.test.ts` still asserts `MAKS_UTDATA_TOKENS === 8000`. The commit hash goes in the session log.

## Review Triage Log

| # | Finding | Verdict | Route | Evidence |
|---|---------|---------|-------|----------|
| 1 | Runbook C5 not updated | low | patch | Checked with the decision and links |
| 2 | Runbook C3 step 5 not updated | low | patch | Checked with the decision |
| 3 | `issues.md` item not closed, and no tracked epic 3 follow-up | low | patch | Item closed, and a new item was added for epic 3 and 2.8 |
| 4 | Runbook banner stale | low | patch | Status banner added |
| 5 | "steg 1 i del C" clashes with C1–C5 numbering | low | patch | Renamed to the baseline check before C1 |
| 6 | Privacy box text inferred, not seen | low | patch | Now says it is inferred from AD-11 and checked in C4 |
| 7 | Comment does not link to `ANNONSE_MAKS` | low | patch | Added |
| 8 | Comment hides the small sample | low | patch | Now says 12 runs on four test pairs |
| 9 | "small cost difference" has no number | low | patch | Now says about 0.12 kr at the full cap |
| 10 | Personal name in source comment | low | patch | Removed. The decision is in this spec and the runbook |
| 11 | Spec lacks verification | low | patch | Added above |
