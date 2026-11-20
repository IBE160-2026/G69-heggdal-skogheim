---
title: 'Story 2.4 del C: document the C3/C4 results, a manual SM-4 assessment, SM-1 and B4 status'
type: 'chore'
created: '2026-11-20'
status: 'done'
route: 'oneshot'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/implementation-artifacts/kjorebok-2-4-del-c.md'
  - '{project-root}/_bmad-output/implementation-artifacts/vurdering-2-4-kontroll-temperatur-0.md'
  - '{project-root}/testsett-rapporter/2026-11-19-225914-openai-gpt-4.1-mini.md'
  - '{project-root}/testdata/par-1-butikk-bank/fasit.md'
  - '{project-root}/testdata/par-2-it-support/fasit.md'
  - '{project-root}/testdata/par-3-regnskap/fasit.md'
  - '{project-root}/testdata/par-4-tokolonne-hotell/fasit.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Kevin and Sondre ran C3 and C4 in production on 2026-11-20. Kevin approved the documentation, and the results are not recorded yet:
- The variables are set in Production only, and the Redeploy is done. Production runs in real mode with OpenAI `gpt-4.1-mini`.
- The free checks passed.
- The paid check with test pair 2 gave HTTP 200 in 8.4 s, and 6 of 6 categories match the answer key.
- Two earlier attempts failed with 502 in under 1 s because of a wrong key. Sondre replaced it with `produksjon-vercel-2`, deleted the old key and did a Redeploy.
- The keyword match rate for test pair 2 was 25 % (2 of 8), against 11 % (1 of 9) in the answer key.
- The usage is not confirmed.

**Approach:** Update the documents in Norwegian, with date 2026-11-20 and source "Kevin and Sondre":
- the runbook C3 (steps 2–4) and C4
- the C3 checklist
- the assessment: section 7 gets the DPA dates from Sondre's log, and a new section 8 has a manual, free SM-4 assessment of all four pairs, based on the temperature-0 report
- `issues.md`
- `deferred-work.md`

**Decisions (Kevin, 2026-11-20):**
- The SM-4 assessment is manual and free. SM-4 is not marked as passed without enough evidence.
- SM-1 stays an open deviation (9/12).
- B4 part 1 is covered by the production test. Part 2 (the planted instruction) remains. No new paid tests.
- The C4 usage is "venter på bekreftelse fra Sondre" until he has checked Usage/Activity.
- The measurement key `kevin-maaling-2-4` is kept until B4 is done.
- No code, prompt or answer-key changes. Story 2.4 is not marked done.
- No push, PR, merge, deploy, keys or paid calls.

</frozen-after-approval>

## Implementation Notes

- **Branch:** `story-2.4-del-c-kontroll`, with `main` (`3e70acc`) merged in (`f04f941`, no conflicts, no rebase).
- **SM-4 rule used:** a keyword from the answer key counts as extracted when one of the model's keywords is the same word or a form of it (inflection, compound with the same stem, or extra detail such as "førerkort klasse B"). Synonyms and paraphrases are counted separately as doubtful, not as extracted.
- **SM-4 ownership:** SM-4 is in the acceptance criteria of story 5.1 (`epics.md`, line 784), not 2.4. Story 2.4 realises SM-1, SM-2, SM-3 and SM-8.
- **Files:**
  - `kjorebok-2-4-del-c.md`: status, C3 steps 1–4 with the incident, and C4
  - `sjekkliste-2-4-c3-sondre.md`: status and lesson
  - `vurdering-2-4-kontroll-temperatur-0.md`: section 7 dates, and the new section 8 on SM-4
  - `deferred-work.md`
  - `.logs/kevin-heggdal/issues.md`
- **Verification:**
  - The SM-4 counts were re-derived independently by the reviewer from the report and the four answer keys.
  - The unit-test percentages (22/11/8/33) were checked in `treffprosent.test.ts`.
  - `git diff --check`, lint, typecheck and `npm test` (896 of 896) are green, before and after the review fixes. No code changed.

## Review Triage Log

| # | Finding | Verdict | Route | Evidence |
|---|---------|---------|-------|----------|
| 1 | Par 1 «økonomistudent» breaks the stated rule | medium | patch | Same stem, like «kommunikasjonsevner». Par 1 is 6/9 = 67 % and the total is 32/43 = 74 %. Fixed in section 8, `issues.md` and `deferred-work.md`. SM-4 is still not met |
| 2 | "56–69 % også med tvilstilfellene" is false | low | patch | Reworded: all under 80 %, and par 1 with the doubtful case is 78 % |
| 3 | The doubtful-case totals only apply to K1 and K3, and «AFR» in K2 is not mentioned | low | patch | Stated |
| 4 | Par 1 missing list omits kundeservice | low | patch | Added as a doubtful case |
| 5 | "Enhetstesten er grønn" has no run cited | low | patch | Cites `npm test` 2026-11-20 on the branch, 896 of 896 |
| 6 | Owner sentence omits SM-8 | low | patch | Added in section 8 and in the spec |
| 7 | "Production behaves like the measurement" rests only on the percentage | low | patch | Softened to "samme treffprosent", and the list is not recorded |
| 8 | Paid C4 ticked while bokmål is unconfirmed | medium | patch | Unticked as "bestått med forbehold" everywhere |
| 9 | Stale DPA-date lines | low | patch | Updated in section 7 and the runbook |
| 10 | C3 step 1 still says the name is unknown | low | patch | Name recorded |
| 11 | The B4 item has conflicting notes, and the rotate item does not say the key is kept | low | patch | Old note removed, and the rotate item annotated |
| 12 | The `issues.md` summary overstates C2 | low | patch | The C2 exception is stated |
| 13 | No source for the 502 incident, and the lesson does not follow | medium | patch | Source stated, the cause marked unverified, and the lesson rewritten (`/api/status` only shows that a key exists) |
| 14 | Blockquote broken, and the stale branch name | low | patch | Fixed |
| 15 | Spec context misses the answer keys and has no verification | low | patch | Added |
