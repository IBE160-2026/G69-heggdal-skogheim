---
title: 'Story 2.4 del C: record the transfer basis, the production key and the agreed order (PR before Vercel)'
type: 'chore'
created: '2026-11-20'
status: 'done'
route: 'oneshot'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/implementation-artifacts/kjorebok-2-4-del-c.md'
  - '{project-root}/_bmad-output/implementation-artifacts/sjekkliste-2-4-c3-sondre.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The C3 checklist requires the transfer basis to the USA to be confirmed before Redeploy. On 2026-11-20 Sondre gave his final answer, passed on by Kevin, and agreed an order of work. The documents do not show this yet.

Sondre confirms:
- Data sharing is off.
- The DPA applies automatically, with OpenAI Ireland Ltd. as the contracting party.
- DPA section 4.1 covers transfers out of the EEA by SCCs or an adequacy decision under GDPR art. 45, including the EU–U.S. Data Privacy Framework.
- The credit is 6.25 USD incl. VAT (about 60 kr), and auto top-up is off.
- A separate production key has been created and stored securely, outside GitHub.

**Approach:** Update the documents in Norwegian, with date 2026-11-20 and source "Sondre, passed on by Kevin". The documents are the runbook, the C3 checklist, section 7 of `vurdering-2-4-kontroll-temperatur-0.md` and `issues.md`. Also prepare a PR description draft for del C in `pr-2-4-del-c.md`.

The agreed order:
1. Finish the PR for del C.
2. Sondre reviews and merges it to `main`.
3. Sondre sets the variables in Vercel, Production only.
4. C3/C4 checks are done together.

**Rules:**
- C3 step 1 (key created) may be checked.
- C3 steps 2–4, C4, C5 and story 2.4 are not marked done.
- SM-1 stays an open deviation.
- No code, no Vercel, no keys, no paid calls, no push, no PR.

</frozen-after-approval>

## Implementation Notes

- **Merge to `main` deploys production:** this is assumed from the Vercel Git integration and is not verified here. It happens before the variables are set, so production stays in demo mode. The variables need a Redeploy afterwards. This is noted in the checklist.
- **Branch status:** `origin/main` is one commit ahead (`e9a70d8`, Sondre's session log only). A test merge gives no conflicts.
- **Files:**
  - `kjorebok-2-4-del-c.md`: status, order, C3 step 1, C3 text and the C5 PR item
  - `sjekkliste-2-4-c3-sondre.md`: status, order, steps 0, 1, 4 and 7
  - `vurdering-2-4-kontroll-temperatur-0.md`, section 7
  - `vilkaar-og-priser-2-4.md`
  - `.logs/kevin-heggdal/issues.md`
  - new: `pr-2-4-del-c.md`
- **Verification:**
  - `git diff --check` is clean.
  - lint and typecheck are green.
  - `npm test` 896 of 896.
  - `npm run build` is green.
  - The checks are run again after the review fixes. Documentation only, apart from the earlier comment commit `d055d98`.

## Review Triage Log

Scope: the whole branch against `main`, plus uncommitted work.

| # | Finding | Verdict | Route | Evidence |
|---|---------|---------|-------|----------|
| 1 | Duplicate sentence in C5 | low | patch | The old line kept its tail. Fixed |
| 2 | The C5 bullet nests the PR order under the `done` condition | low | patch | Split into its own bullet |
| 3 | Key stored outside Vercel, against the checklist | medium | patch | Deviation recorded in the runbook, checklist and PR, with a new open item for Kevin and Sondre |
| 4 | C3 step 1 ticked with unknowns | low | patch | The unknowns are listed. The key exists, so the box stays ticked |
| 5 | Transfer basis: the mechanism in use, DPF certification and version date are unknown | medium | patch | Reworded from "bekreftet" to "kontrollert i DPA-en", with the unknowns stated in all four documents |
| 6 | `issues.md` item closed while the PRD §6 report part is not done | medium | patch | New open item for the reflection report |
| 7 | Session log is behind, and the PR test section has no numbers | low | patch | The PR has the numbers. The log is written before the commit |
| 8 | The PR order differs from the runbook and checklist | low | patch | Aligned to four steps, with Redeploy and Kevin's «gå» |
| 9 | The PR states the merge-deploy as fact | low | patch | Now "trolig, ikke kontrollert" |
| 10 | The PR "gjenstår" list misses the C2 decision and B4 | low | patch | Added |
| 11 | Third spec unfinished | low | patch | Done |
| 12 | The PR does not mention that `origin/main` moved | low | patch | Added |
| 13 | Stale text in checklist step 7 and step 0 | low | patch | Fixed |
| 14 | `vilkaar-og-priser-2-4.md` lacks the transfer basis | low | patch | Added |
| 15 | The PR document list is incomplete | low | patch | `issues.md` and the draft added, with a note that everything is committed before push |
