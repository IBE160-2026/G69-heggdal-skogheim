---
title: 'Story 2.4 del B, runde 3: Sondres regel for sammensatte krav i prompten'
type: 'bugfix'
created: '2026-11-19'
status: 'done'
baseline_commit: '1af881735139f45107f9834bcb93a003ae45c4af'
route: 'oneshot'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-2-context.md'
  - '{project-root}/_bmad-output/implementation-artifacts/spec-2-4-del-b-runde-2-kategori-og-sammensatte-krav.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** I runde 2 ble «God forståelse av Windows og Microsoft 365» (par 2) fortsatt delt i to krav i K2 og K3, selv om prompten sier at et punkt med flere ting er ett krav. Regelen for sammensatte krav står spredt (steg 2 og en kulepunktregel i steg 3). Den sier heller ikke hva belegget og forklaringen skal vise når bare én del er dekket.

**Avklaring (Sondre, meldt av Kevin 2026-11-19):**
- Et krav med to deler (for eksempel «Windows og Microsoft 365») behandles som ett krav.
- Begge delene er dokumentert: Oppfylt.
- Bare én del er dokumentert: Delvis oppfylt.
- Ingen av delene er dokumentert: Mangler.
- Ved Delvis oppfylt viser belegget sitatet for delen som er dekket, og «Hvorfor delvis» forklarer hvilken del som mangler.
- Det følger FR-8 og prinsippet om ett krav per punkt.

**Kontroll av fasitene (ingen fasit er endret):**
- **Konsistente med regelen:** par 1 «Nøyaktig og pålitelig» (D), par 2 «Windows og Microsoft 365» (D) og «muntlig og skriftlig» (D), par 4 «Serviceinnstilt med erfaring fra kundeservice» (O), «engelsk og tysk» (D), «kassasystem og oppgjør» (O) og «Selvstendig og ansvarsbevisst» (D). Krav med «eller» er alternativer, ikke sammensatte krav.
- **Motstrid ved en bokstavelig lesing:** i par 3 har «Erfaring med bokføring og avstemminger» og «Strukturert og nøyaktig» `D` i fasiten. Ingen av delene er direkte dokumentert, men det finnes beslektet erfaring (finansregnskap fra studiet, bacheloroppgaven). FR-8 sier at overførbar eller beslektet erfaring gir Delvis oppfylt. Leses «ingen deler dokumentert = Mangler» bokstavelig, havner begge i Mangler, og par 3 får to krav under fasiten.
- **Løsning:** FR-8 går foran. Ingen dokumenterte deler gir Mangler, med mindre CV-teksten har overførbar eller beslektet erfaring. Da er kravet Delvis oppfylt. Sondre bør bekrefte denne lesingen.

**Approach:** Steg 3 i `GAP_INSTRUKS` får en egen, kort regel for sammensatte krav etter Sondres avklaring og FR-8, med belegg og forklaring ved Delvis. Den erstatter kulepunktregelen fra runde 2. Regelen i steg 2 om ett krav per punkt beholdes. Det dokumenteres som runde 3.

**Rammer:**
- Fasitene, sjekklisten og akseptansekriteriene endres ikke.
- Resultatene fra runde 1 og 2 endres ikke.
- Ingen betalte kall, og ingen endringer i Vercel.
- Siden prompten endres, måles Mistral og OpenAI begge i runde 3 på samme commit (SM-2), etter Kevins godkjenning.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Begge delene dokumentert | To verktøy, begge i CV-teksten | Ett krav, «oppfylt» | N/A |
| Én del dokumentert | To verktøy, ett i CV-teksten | Ett krav, «delvis». Belegget siterer delen som er dekket, og forklaringen nevner delen som mangler | N/A |
| Ingen del, men beslektet erfaring | To fagområder, bare et beslektet emne i CV-teksten | «delvis» (FR-8) | N/A |
| Ingen del og ikke noe beslektet | – | «mangler» | N/A |
| Alternativer | «A eller B», bare B i CV-teksten | «oppfylt» hvis B dekker kravet | N/A |

</frozen-after-approval>

## Implementation Notes

- **Filer:**
  - `src/lib/llm/prompter/gap.ts`: steg 3 i `GAP_INSTRUKS`.
  - `src/lib/llm/prompter/gap.test.ts`: mønstrene og rekkefølgen.
  - Dokumentasjonen: ny `vurdering-2-4-leverandorvalg-runde-3.md`, kjøreboka og sesjonsloggen.
- **Ikke endret:** fasitene, koden i pipelinen, skjemaet, demosvarene og rundene 1 og 2.
- **Kontroll:** lint, typecheck, `npm test`, build og `npm run testsett -- --leverandor mistral --mock`. Om regelen virker, vises først i runde 3, etter Kevins godkjenning.
- **Etter gjennomgangen:**
  - Steg 2 sier at kravteksten skal ha alle delene slik de står i punktet. Delingen skjer når kravene hentes ut, ikke når de får kategori.
  - Overskriften over blokken sier ikke lenger «som alle kreves», og alternativene står for seg.
  - Unntaket for beslektet erfaring er en egen betingelse før «mangler».
  - Steg 5 sier at forklaringen nevner delen som mangler, og «delene» står i flertall.
  - Testene merker regelen om ett krav per punkt som FR-7, sjekker at den gamle overskriften er borte, og sjekker rekkefølgen fra steg 2 til steg 3.
- **Kontrollen:** lint, typecheck, `npm test` (806 av 806 i 48 filer), build og tørrkjøringen (12 av 12) er grønne.
- **Åpent:** Sondre bør bekrefte lesingen «ingen deler, men beslektet erfaring = delvis» (ført i `issues.md`). Om endringen virker, avgjøres av målingen i runde 3, som krever Kevins godkjenning.
- **Sprint-status:** 2-4 står fortsatt som `in-progress` (AK 2 og AK 3 er ikke oppfylt).

## Review Triage Log

| # | Finding | Verdict | Route | Evidence |
|---|---------|---------|-------|----------|
| 1 | The rule sits in step 3, but the split happens in step 2 | medium | patch | Runde 2 K2/K3 output had two requirement texts, so the split happened during extraction. Step 2 now says to keep all parts in the requirement text. |
| 2 | The header «som alle kreves» contradicts the alternatives bullet | low | patch | The header was reworded, and alternatives moved out of the bullet list. |
| 3 | «Ingen deler: mangler» comes before the exception | medium | patch | A model can stop at the first sentence, which is the par 3 risk. The exception is now its own condition before «mangler». |
| 4 | The exception repeats the general «delvis» definition | low | patch | Fixed together with 3, as explicit conditions. |
| 5 | Step 5 is not linked to the rule, and «delen» is singular | low | patch | Step 5 sentence added, and «delene» used. |
| 6 | Combinations with self-assessment or level are unspecified | low | reject | The tie-break rule («svakeste kategori») already decides these. More rules make the prompt longer without testdata to support them. |
| 7 | Sondre's «én del» vs «noen av delene», and his confirmation is not tracked | low | patch | For two parts the wordings mean the same. The confirmation is now an open item in `issues.md`. |
| 8 | The documentation listed in the spec is missing | medium | patch | `vurdering-2-4-leverandorvalg-runde-3.md` and a runbook status section were added. |
| 9 | Test gaps: old header, alternatives position, step 2 order, FR label | low | patch | Tests added for each, and the label changed to FR-7. |
| 10 | Tests check wording, not behaviour | low | reject | Behaviour can only be checked with paid calls. Runde 3 is the gate. |
| 11 | The spec uses `D`/`O` without defining them | low | reject | Cosmetic. The abbreviations are defined in the evaluation template. |
