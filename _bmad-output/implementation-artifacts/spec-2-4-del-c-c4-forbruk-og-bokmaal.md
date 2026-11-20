---
title: 'Story 2.4 del C, C4: record the usage confirmation (Sondre) and the bokmål confirmation (Kevin)'
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

**Problem:** C4 has two items that are not settled: the paid check ("bestått med forbehold", because bokmål was not confirmed) and the usage ("venter på bekreftelse fra Sondre"). Both are now confirmed:
- **Kevin, 2026-11-20:** the gap analysis in production was in bokmål.
- **Sondre, 2026-11-20:** OpenAI Usage shows 54 calls, about 154 000 tokens and 0.09 USD for the whole week, across all keys.
  - The production test with par 2 cost an estimated 0.002 USD. It is not shown separately with two decimals.
  - Usage shows 5 API errors in total. Two are probably the failed attempts with the wrong production key.
  - The spend limit is 100 USD. The project has 5 USD prepaid credit, and auto top-up is off.

**Approach:** Update the runbook (C4, the status block and the C2 note), the C3 checklist status and `issues.md`, in Norwegian with date and source.
- Mark the paid check as passed, based on HTTP 200, 8.4 s, six correct categories and confirmed bokmål.
- State that the cost is an estimate.

**Rules:**
- SM-1, SM-4 and B4 part 2 stay open.
- C5 and story 2.4 are not marked done.
- No code, no push, PR, merge, deploy, keys or paid calls.

</frozen-after-approval>

## Implementation Notes

- **The usage criterion is not met literally.** The criterion approved on 2026-11-20 was: one successful call with `produksjon-vercel-2`, at most 0.01 USD for the day, and the failed attempts not billed. What Sondre confirmed is weekly and across all keys, so the per-key and per-day parts cannot be read out.
  - After review the item is left **unchecked** as "bekreftet på ukenivå", with the deviation written out and a new open item for Kevin to accept it. Only the paid check is marked passed, as Kevin asked.
  - **Consistency check:** 54 calls minus 5 errors gives 49 successful calls. At about 0.0185 kr (about 0.0019 USD) per gap analysis, that is about 0.093 USD, which matches 0.09 USD.
  - That the failed attempts were not billed is not confirmed directly.
- **Spend limit 100 USD:** recorded as a fact under C2. The hard cap is still the prepaid credit with auto top-up off (NFR-3). Kevin's open C2 decision gets this as input. No recommendation is made beyond noting it.
- **Also updated after review:**
  - **C2 balance:** about 0.87 kr used since the purchase, and about 4.91 USD (about 47.6 kr excl. VAT) left. The old 1–2 kr estimate for del B is replaced.
  - **Spend limit:** 100 USD is about 969 kr, and the setting is not identified. The hard cap is the prepaid credit (PRD NFR-3).
  - **Cross-check:** reworded to "consistent within rounding". A token-based check was added (154 000 tokens, about 2 850 per call).
  - **Error attribution:** hedged.
  - **The C3 incident line** points to the C4 deviation.
  - **Summaries:** the runbook and checklist summaries carry the reservation.
  - **Checklist step boxes:** noted as documentation only.
  - **New open items:** Kevin accepts the deviation, and usage per project before 2.8, with the open checklist step 7.
- **Verification:**
  - Arithmetic re-checked: 0.09 × 9.6866 = 0.87 kr; 4.91 × 9.6866 = 47.6 kr; 47.6 / 0.0185 ≈ 2 570 and / 0.07 ≈ 680; 154 000 / 54 ≈ 2 850; 128 000 × 0.40 + 26 000 × 1.60 per million ≈ 0.093 USD.
  - `git diff --check`, lint, typecheck and `npm test` (896 of 896) are green. No code changed.

## Review Triage Log

| # | Finding | Verdict | Route | Evidence |
|---|---------|---------|-------|----------|
| 1 | Usage box ticked without anyone accepting the deviation | medium | patch | Unticked, and a new open item for Kevin |
| 2 | The C2 balance and del B estimate are stale | medium | patch | Updated from Sondre's figures |
| 3 | 100 USD not set against 200 kr and NFR-3, and "Den" unclear | low | patch | Named, converted, and the setting marked unidentified; the hard cap is cited from PRD NFR-3 |
| 4 | The cross-check is overstated | low | patch | "Forenlig innenfor avrundingen", with the rounding range |
| 5 | Tokens unused | low | patch | Token-based check added; the split is not read in Usage |
| 6 | Attribution of the 2 of 5 errors doubtful | low | patch | Hedged with the alternative; the other three are unknown |
| 7 | The C3 incident line is stale | low | patch | Points to the C4 deviation |
| 8 | Summaries omit the reservation | low | patch | Added in the runbook and checklist |
| 9 | Spec status and scope | low | patch | Done, with notes |
| 10 | Checklist step boxes contradict the status | low | patch | Noted as documentation |
| 11 | Separate-project follow-up and step 7 not tracked | low | patch | New open item before 2.8 |
