---
title: 'Story 2.4 del B, etterarbeid: standardverdiene for det valgte oppsettet (OpenAI gpt-4.1-mini, temperatur 0)'
type: 'chore'
created: '2026-11-19'
status: 'done'
baseline_commit: '2aa0a7210beb0dd5e690f59f1f2409aecd175be3'
route: 'oneshot'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/implementation-artifacts/vurdering-2-4-kontroll-temperatur-0.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Kevin og Sondre valgte 2026-11-19 OpenAI `gpt-4.1-mini` med temperatur 0 (AD-11). `STANDARD_MODELL.openai` er allerede `gpt-4.1-mini`, og `TEMPERATUR` ble satt til 0 for kontrollen (`ee49c2b`). Kommentaren beskriver fortsatt verdien som foreløpig, og ingen test låser temperaturen eller modellen som valgt oppsett. Testen for adapterne sjekker bare at temperaturen ligger mellom 0 og 0,3.

**Approach:**
- Kommentaren til `TEMPERATUR` i `src/lib/llm/felles.ts` skal si at verdien er valgt (AD-3, AD-11, 2026-11-19).
- Testen for OpenAI-adapteren skal sjekke at standardmodellen er `gpt-4.1-mini` og at `temperature` er 0.
- En egen test låser `TEMPERATUR = 0` og `STANDARD_MODELL.openai = "gpt-4.1-mini"`, så en senere endring må være bevisst.

**Rammer:**
- Prompten, fasitene, `LLM_LEVERANDOR`-standarden i koden (Mistral, AD-3) og `MAKS_UTDATA_TOKENS` endres ikke.
- `LLM_LEVERANDOR=openai` settes i Production på Vercel i del C, etter Kevins godkjenning.
- Ingen betalte kall.

</frozen-after-approval>

## Implementation Notes

- **Filer:** `src/lib/llm/felles.ts` (bare kommentaren) og `src/lib/llm/adaptere.test.ts`.
- **Presisering av problemet:** før endringen sjekket testen for OpenAI-adapteren allerede `modelId: "gpt-4.1-mini"`. Bare temperaturen var ulåst, og testen for Mistral sjekket bare intervallet.
- **Etter gjennomgangen:**
  - Kommentaren til `TEMPERATUR` nevner at SM-1 ikke er bestått (par 3), og at verdien også gjelder Mistral, som bare er målt med 0,2.
  - Kommentaren over `STANDARD_MODELL` i `leverandor.ts` er oppdatert.
  - Testen for Mistral sjekker `temperature === TEMPERATUR`.
  - Testnavnet har ikke lenger navn og dato.
  - Punktet om `gpt-5-mini` og temperaturen i `deferred-work.md` er lukket.
- **Kontrollen:** lint, typecheck, `npm test` (836 av 836), build og tørrkjøringen er grønne.
- **Oppfølging** (i kjøreboka for del B, avsnitt 10, og i `issues.md`):
  - SM-1 i par 3
  - forslaget om `MAKS_UTDATA_TOKENS`
  - B4, manuell test i appen
  - rotering av nøklene fra målingen
  - del C (`LLM_LEVERANDOR=openai` og `LLM_MODELL` i Production, og personvernteksten om USA og utenfor EØS)

## Review Triage Log

| # | Finding | Verdict | Route | Evidence |
|---|---------|---------|-------|----------|
| 1 | The decision is in the code before the documents | low | reject | The decision (Kevin, with Sondre's confirmation, 2026-11-19) is now in section 5 of `vurdering-2-4-kontroll-temperatur-0.md`. The sign-off line is for the signatures themselves. |
| 2 | The comment cites only the favourable results | low | patch | It now says that SM-1 is not passed (par 3). |
| 3 | `TEMPERATUR` is shared, and Mistral was never measured at 0 | medium | patch | Stated in the comment. Production uses OpenAI (del C). |
| 4 | The comment above `STANDARD_MODELL` is stale | low | patch | Updated. |
| 5 | The deferred `gpt-5-mini` item is not closed | low | patch | A status line was added. |
| 6 | The AD-11 test duplicates the adapter test | low | reject | It locks the chosen setup on purpose, and a comment says why. |
| 7 | The Mistral test checks only the range | low | patch | It now checks `temperature === TEMPERATUR`. |
| 8 | The test name has names and a date | low | patch | Removed. |
| 9 | The spec has no verification or log | low | patch | Notes and this log were added. |
| 10 | The problem statement overstates the gap | low | patch (notes) | The intent is frozen, so the clarification is in the notes. |
| 11 | Follow-ups are not listed | low | patch | Listed above. |
| 12 | Line endings will change | false | reject | It is git's normal autocrlf warning, shown for every file in this repo. The diff only shows the changed lines. |
