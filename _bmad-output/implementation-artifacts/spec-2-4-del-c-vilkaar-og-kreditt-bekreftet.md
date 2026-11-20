---
title: 'Story 2.4 del C, C1 and C2: record that the OpenAI terms and the credit are confirmed by Sondre'
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

**Problem:** C1 (OpenAI terms) and C2 (credit) in the del C runbook have only a provisional status. On 2026-11-20 Kevin passed on Sondre's final confirmations, so they can now be recorded as confirmed.

**Approach:** Update the documents in Norwegian, with date 2026-11-20 and source "Sondre, passed on by Kevin". The documents are the runbook (C1 and C2), section 7 of `vurdering-2-4-kontroll-temperatur-0.md`, the OpenAI part of `vilkaar-og-priser-2-4.md` and `issues.md`.

The confirmations:
- **C1:** training and data sharing are off. Sondre has read the DPA and confirms that it applies automatically when the services are used. According to Sondre, OpenAI Ireland Ltd. is the contracting party for customers in the EEA.
- **C2:** 5 USD of credit was bought once, on 2026-11-19. With 25 % VAT that is 6.25 USD, about 60 kr. There have been no further top-ups, and auto top-up is off. The amount is below 200 kr incl. VAT.

**Rules:**
- Claims come from Sondre and are attributed to him. They are not presented as independently verified.
- Signature lines are left blank.
- Nothing about C3–C5 is marked done.
- No code, no Vercel, no keys, no paid calls, no push.

</frozen-after-approval>

## Implementation Notes

- **The privacy text:** with OpenAI Ireland Ltd. as the contracting party, the processing still takes place in the USA (data residency, section 7). The app text ("sendes til OpenAI i USA … ut av EØS") and `tredjeland: true` therefore stay correct. This note is added to the runbook. It is checked in production in C4.
- **C1, first checkbox:** it refers to section 1 of the template (`vurdering-2-4-leverandorvalg.md`). For the chosen setup, the terms are in section 7 of the temperature-0 assessment. That is where they are recorded, and the template is left unchanged.
- **Mistral checkbox in C1:** marked as not relevant, because Mistral was not chosen.
- **The spend-limit item in C2:** left open. It is Kevin's decision, tracked in `issues.md`.
- **Conversion:** 6.25 USD × 9.6866 kr/USD (Norges Bank, 2026-11-19) ≈ 60.5 kr.
- **Not synced to sprint-status:** 2-4 stays `in-progress`.
- **Also updated after review:**
  - The stale lines in `vilkaar-og-priser-2-4.md`: the DPA "inngås via et skjema" line and the budget row.
  - The rows that are closed are now named.
  - Explicit J, link and date in section 7, with the DPA version date not recorded.
  - The transfer basis is not confirmed and is tracked as a new open item.
  - The balance is not recorded, and the credit expiry is noted.
  - The measurement key and the production key share the same credit.
  - The stale open item amount is fixed.
  - The privacy-documentation part is split into its own open item.
- **Verification:**
  - `git diff --check` is clean.
  - All referenced files exist.
  - No code changed, so lint, typecheck and tests are not affected. They are run anyway before the commit.
  - The session log gets the final confirmation before the commit (sesjonslogg).

## Review Triage Log

| # | Finding | Verdict | Route | Evidence |
|---|---------|---------|-------|----------|
| 1 | Stale DPA and budget lines in `vilkaar-og-priser-2-4.md` | medium | patch | Lines 25 and 37 contradicted the new block. Both are marked as replaced |
| 2 | "Lukket for disse punktene" does not name the rows | low | patch | Rows are now named, and the uncovered rows are listed |
| 3 | First C1 checkbox reworded, and section 7 has no J | low | patch | J, link and date added in section 7. The rewording is stated. The runde-1 fields are historical and left unchanged (round documents are not edited) |
| 4 | C1 log checkbox points to a log without the final confirmation | low | patch | The session log is updated before the commit |
| 5 | `issues.md` item still says "ca. 5 USD" | low | patch | Fixed |
| 6 | Privacy-documentation part closed but not done | medium | patch | Split into its own open item |
| 7 | Legal basis for the transfer to the USA not recorded | medium | patch (open item) | It cannot be confirmed from here, so section 7 and the new open item state that it is not confirmed |
| 8 | Capacity uses the full 5 USD, not the balance | low | patch | Notes that the balance is lower and not recorded |
| 9 | The measurement key and production share the credit | medium | patch | Noted in C2 and linked to the key-rotation item |
| 10 | Only second-hand evidence, no receipt or screenshot | low | reject | The runbook accepts the account owner's confirmation. Whether to keep evidence for the submission is Kevin's call, raised in the report |
| 11 | Credit expiry and VAT check missing | low | patch / reject | Expiry is noted (unverified). Checking the card charge is rejected: the figure is far below the cap |
| 12 | Spec is in-progress and has no verification | low | patch | Done |
