---
title: 'Story 2.4 del B: lav resonnering for Mistral Medium 3.5 og Large 4'
type: 'bugfix'
created: '2026-11-19'
status: 'done'
baseline_commit: '7cde3c2b68cb0e1ad3ec1651e5b37312c6e41412'
route: 'oneshot'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/implementation-artifacts/spec-2-4-del-b-maaling-og-valg.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Kontrollen 2026-11-19 med `mistral-large-4-0` (par 2, én kjøring) fikk 504 `llm_tidsavbrudd` etter 45 s (rapport `testsett-rapporter/2026-11-19-1557-mistral-mistral-large-4-0.md`). `GET /v1/models` viser at både Large 4 og Medium 3.5 har `reasoning: true`. Etter Mistrals dokumentasjon (docs.mistral.ai/studio/conversations/reasoning, lest 2026-11-19) bruker Large 4 `reasoning_effort: "high"` når parameteren ikke er satt. Medium 3.5 tar imot `"none"`. Large 4 tar bare imot `low`, `medium` og `high`, ikke `none`. Standarden i appen (`mistral-medium-latest`) er den samme resonneringsmodellen, så ekte gap-analyser med Mistral kan få tidsavbrudd også i produksjon (AD-8 45 s, NFR-4 30 s).

**Approach:** Mistral-adapteren sender `reasoningEffort` etter modellen: `"none"` for Medium 3.5 og `"low"` for Large 4, også når modellen er oppgitt med et alias som peker på dem etter `GET /v1/models` 2026-11-19. Andre Mistral-modeller og OpenAI er uendret. Rapporten fra testsettet viser hvilken resonnering som ble brukt.

**Beslutning (Kevin, 2026-11-19):** alternativ A. Medium 3.5 får `"none"` og Large 4 får `"low"`, slik dokumentasjonen viser. Rapporten fra det mislykkede kallet beholdes som dokumentasjon. Etter grønne gratistester og en kodegjennomgang godkjennes én ny betalt kontroll med Large 4, innenfor det samlede taket på 1 kr inkludert mva. Medium 3.5 kjøres ikke før resultatet er vurdert.

</frozen-after-approval>

## Implementation Notes

- **Koden:** `src/lib/llm/mistral.ts` har tabellen `RESONNERING` og funksjonen `resonnering(modell)`. Adapteren legger `reasoningEffort` i `providerOptions.mistral` ved siden av `strictJsonSchema` når modellen står i tabellen. OpenAI og andre Mistral-modeller er uendret.
- **Overraskelse:** AI SDK 4.0.79 regner `mistral-large-latest` (og `mistral-large-2512`) som modeller uten resonnering og dropper `reasoningEffort` for dem uten å si fra. `mistral-large-latest` er derfor ikke med i tabellen. Bruk `mistral-large-4-0`.
- **Forespørselen er verifisert uten nettverk:** `src/lib/llm/mistral.test.ts` bruker en falsk `fetch` og sjekker at hver modell i tabellen faktisk sender `reasoning_effort` med riktig verdi i forespørselen, og at `mistral-small-latest` og `mistral-large-latest` ikke sender den.
- **Rapporten:** `scripts/testsett/rapport.ts` har linjen «Resonnering (reasoningEffort)». Den viser tabellverdien for Mistral, som testen over binder til det som faktisk sendes.
- **Rapporten fra det mislykkede kallet** (`testsett-rapporter/2026-11-19-1557-mistral-mistral-large-4-0.md`) er laget før innstillingen fantes. Den er kjørt uten `reasoningEffort`, altså med leverandørens standard `high`, og beholdes som dokumentasjon.
- **Kjent forhold:** aliasene (`-latest`, `mistral-medium-3` osv.) kan flytte seg til nye modeller. Tabellen må sjekkes mot `GET /v1/models` når Mistral lanserer nye versjoner.

## Review Triage Log

| # | Finding | Verdict | Route | Evidence |
|---|---------|---------|-------|----------|
| 1 | `mistral-large-latest` never sends `reasoning_effort` | medium | patch | SDK `modelsWithoutReasoningEffort` contains it. Removed from the table, and a wire test covers it. |
| 2 | The report line repeats the table instead of what was sent | low | patch (via #3) | The wire test now binds every table entry to the request body. |
| 3 | The wire test missed the default model and aliases, and had no length check | low | patch | The test iterates every table entry and checks `kropper` length. |
| 4 | `mistral-small-latest` may also time out | low | reject | Not measured and not used. Kevin's decision covers Medium 3.5 and Large 4. |
| 5 | Untested aliases | low | patch (via #3) | Covered by the wire test over the whole table. |
| 6 | The alias table will drift | low | patch | Documented in the code, the runbook and here. |
| 7 | The spec is unfinished | low | patch | Notes filled in; status set at finalisation. |
| 8 | The cost of the failed call is not counted | low | reject | Tokens are unknown after the abort. Kevin checks Usage in the Mistral console. Upper bound about 0.23 kr including mva. |
| 9 | The kept report does not explain itself | low | patch | Explained in the runbook and here. The generated report is not edited. |
| 10 | The runbook does not mention the setting | low | patch | Section 3 and the check list in section 5 updated. |
| 11 | Duplicate Large 4 test | low | patch | Replaced with a table-wide check that no `mistral-large-*` entry is `"none"`. |
