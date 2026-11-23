---
title: 'Story 2.4: document the measurement without the example block, record the deviations as known weaknesses, and list what remains before done'
type: 'chore'
created: '2026-11-23'
status: 'done'
route: 'oneshot'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/implementation-artifacts/vurdering-2-4-uten-eksempelblokk.md'
  - '{project-root}/_bmad-output/implementation-artifacts/beslutningsark-2-4-sondre.md'
  - '{project-root}/_bmad-output/implementation-artifacts/kjorebok-2-4-del-c.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:**
- The measurement on `5de48e0` (PR #34, the prompt without the example block, in production) gave SM-1 8/12, SM-2 11/12 and SM-3 9/12. B4 del 2 passed in production.
- The results are documented on the working tree only. PRD §10.1, the runbooks, the earlier assessment, the known weaknesses and `issues.md` still describe the open state before the decision.

**Decision (Sondre, «ja, kjør», relayed by Kevin 2026-11-23; approved by Kevin):**
- Accept the deviations as known weaknesses, document them, and measure again in story 5.1 (alternative a, question 2 in the decision sheet).
- No more prompt changes and no more paid calls.

**Scope (documentation only):**
1. Finalise `vurdering-2-4-uten-eksempelblokk.md`: record the decision and keep the signature line open. Add the test-set report and the B4 JSON.
2. Record the deviations in `kjente-svakheter-2-4.md` as known weaknesses to re-measure in 5.1. Add a `deferred-work.md` entry for 5.1.
3. Update with the decision and the final numbers:
   - PRD §10.1
   - `vurdering-2-4-kontroll-ny-prompt.md` (a pointer)
   - § 7a in `kjorebok-2-4-del-b.md`
   - C5 and the status box in `kjorebok-2-4-del-c.md`
   - a dated fact under question 2 in the decision sheet
   - `.logs/kevin-heggdal/issues.md`
4. List every closing item for 2-4 that still remains, with owner, in C5: signatures, privacy-box PR, `store: false` confirmation, keys and `.env.local`, session log (AK 2), `done`.

**Rules:**
- No code, prompt, test data, answer key or key changes. No paid calls.
- 2-4 stays `in-progress`, and `sprint-status.yaml` is untouched.
- No signatures are filled in for anyone.
- No commit, push or PR without Kevin's approval.
- No story 2.7.

</frozen-after-approval>

## Implementation Notes

- **Branch:** `story-2.4-avslutning-maaling` from `main` `5de48e0`. It carries the uncommitted documentation from the measurement.
- **Measurement (before this spec):**
  - test set: 12 calls on `5de48e0`, report `2026-11-23-183801-…`
  - B4: 1 `POST` in production at 18:39:49, JSON `2026-11-23-183949-b4-del-2-produksjon.json`
  - An independent recount (subagent) matched every number. Four wording fixes were applied in `vurdering-2-4-uten-eksempelblokk.md`.
- **Files:**
  - `vurdering-2-4-uten-eksempelblokk.md` (decision, § 5 rewritten, signature line)
  - `kjente-svakheter-2-4.md` (§ 1 accepted, error types, set-up line, B4)
  - PRD §10.1 (third bullet and the decision, past tense for PR #28)
  - `vurdering-2-4-kontroll-ny-prompt.md` (pointer box)
  - `kjorebok-2-4-del-b.md` § 7a (decision)
  - `kjorebok-2-4-del-c.md` (status box; C5 annotations; §10.1 ticked; new «Avslutningspunktene» tables with owners)
  - `beslutningsark-2-4-sondre.md` (dated fact under question 2; Sondre's answer text untouched)
  - `deferred-work.md` (entry for 5.1)
  - `.logs/kevin-heggdal/issues.md` (test-set item moved to Løst; two new open items: closing 2-4, and the par 3 answer-key rule)
- **Owners:** the owner is «Ikke fordelt» where nobody has been named (the privacy PR, the `TEMPERATUR` comment).
- **Not done:**
  - signatures, key deletion, `sprint-status.yaml`, session log (it commits), commit
  - `epic-2-context.md` is now older than the PRD again. The next `bmad-build` for epic 2 recompiles it.
- **Checks:**
  - `git diff --check` is clean.
  - There are no changes in `src`, `testdata`, `scripts`, `package.json` or `sprint-status.yaml`.
  - The secret scan of the diff and the new files is clean.
  - All relative links in the changed Markdown files resolve.

## Review Triage Log

Two reviewers: Blind Hunter (14 findings) and a scope auditor. The auditor passed the scope check (documentation only, `sprint-status.yaml` untouched, no signatures, Sondre's answer text untouched) and the numbers check (everything matches the raw report and the B4 JSON). The findings below were verified in the files before they were routed.

| # | Finding | Verdict | Route | Action / evidence |
|---|---|---|---|---|
| 1 | C5 says «AK 1–3 er oppfylt» while listing the session log (AK 2) as open | medium | patch | AK 2 was met with `ee49c2b`. The new entry is required by PRD §6, and the label is fixed in the C5 note and the table |
| 2 | §10.1 item ticked, but its text says it is not ticked | low | patch | The old sentence is now in the past tense |
| 3 | `kjente-svakheter` says all three error types appeared with several prompts | medium | patch | The par 4 type is new for OpenAI (Mistral rounds 1, 4, 5). Corrected |
| 4 | `kjente-svakheter` § 2 still has the old «fakturaer» and K2 state | low | patch | Dated decision line added (question 3; K2/K3; K3 for «Strukturert») |
| 5 | Question 12 lists two documents, C5 three | medium | patch | The third signature is marked *(forslag)* in C5. A dated fact under question 12 proposes it. Sondre's text is untouched |
| 6 | The spec lists the privacy-box PR among closing items, but C5 does not make it a condition | false | reject | Scope item 4 asks for a list of closing items, not conditions. Sondre's question 4 makes `done` depend only on question 2 |
| 7 | Prompt-in-production presented as decided (§ 7a); tense in the assessment | medium | patch | Both now say it follows from the decision, Sondre has not answered it directly, and Kevin confirms. It is a row in the «Må» table |
| 8 | Key deletion status inconsistent; Kevin's hold not tracked | low | patch | C5, the table and `issues.md` now say it waits for Kevin's word |
| 9 | B4 tokens and cost not recorded; source of the commit | low | patch | § 7a gives the estimate (ca. 0,02 kr, Usage), and that the commit rests on Sondre's Vercel check |
| 10 | `TEMPERATUR` owner and trigger | low | patch | Owner is Kevin. The trigger has fired and the numbers are out of date. Updated in the table and in `issues.md` |
| 11 | PR drafts not updated; this branch's role unclear | low | patch | A dated note under title B in `pr-2-4-c5-avslutning.md`. This branch is not the closing PR |
| 12 | `deferred-work` entry omits B4 | low | patch | NFR-9 re-run added |
| 13 | NFR-4 wording; the «Uavklart (16:01)» cell | low | patch | Reworded |
| 14 | § 7a «Gjenstår» incomplete; «Ikke avgjort» and «Ingen av dem er kjørt» not annotated | low | patch | § 7a now points to C5, with dated annotations |
| 15 | Two conditions are Claude's proposals (new signature, new `store: false` check) | low | patch | Marked *(forslag)* |
| 16 | Commit, push and closing PR missing from the «Må» table; other open 2-4 items missing from the other table | low | patch | Rows added |
| 17 | Owners: «fakturaer» row → «Ikke fordelt» | low | patch | Done |
| 18 | Stale `issues.md` items (del C, signatures, keys, project/rights, `TEMPERATUR`, Q5–6; Q10 confirmed) | low | patch | Dated updates added. The question-10 item moved to Løst |
| 19 | `epic-2-context.md` is now older than the PRD | low | note | Recompiled by the next `bmad-build` for epic 2 (Implementation Notes) |
