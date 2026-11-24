---
title: 'Feil fra språkmodellen viser vei til Prøv med eksempel, så brukeren ikke står fast når kreditten er brukt opp'
type: 'bugfix'
created: '2026-11-24'
status: 'done'
route: 'dispatch'
review_loop_iteration: 0
baseline_commit: '3dee41f1947a51b2322b429966e3e5a2eb064e75'
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Når kreditten hos leverandøren er brukt opp, svarer OpenAI med 429 `insufficient_quota`. Pipelinen gjør det om til `llm_feil` (EXPERIENCE.md l.122). Brukeren får «Språkmodellen svarte ikke … Prøv igjen.» og knappen *Prøv igjen*, som aldri hjelper, og ingen vei til *Prøv med eksempel*, som virker (deferred-work.md, fra story 2.5).

**Approach:** Feil fra språkmodellen (`llm_feil` og `llm_tidsavbrudd`) får *Prøv med eksempel* i tillegg til *Prøv igjen*, og teksten peker til eksempelet. Pipelinen og kategoriseringen av feil er uendret.

## Boundaries & Constraints

**Always:**
- Feilen vises fortsatt i en `Alert` med `role="alert"` (AD-8, FR-22), og tekstene står bare i `FEILMELDINGER`.
- *Prøv med eksempel* bruker den eksisterende `ProvEksempelKnapp`.
- Testnavn starter med FR-22 eller NFR-3.

**Never:**
- Ingen endring i `tilstand.ts`, `Resultat.tsx`, `AnalyserKnapp.tsx` eller `CvPanel.tsx` (Kevin endrer dem i 2.7).
- Ingen nye avhengigheter.
- Ingen endring i pipelinen eller `kontrakt/feil.ts`. Oppbrukt kreditt er fortsatt `llm_feil` (EXPERIENCE.md l.122).

**Beslutninger (Sondre, 2026-11-24):**
- Teksten for `llm_feil` og `llm_tidsavbrudd` blir «Språkmodellen svarte ikke. Teksten din er tatt vare på. Prøv igjen, eller bruk *Prøv med eksempel*.», med `provIgjen: true` og `provEksempel: true`.
- `ugyldig_svar` er uendret: den skyldes svaret, ikke kreditten.

</frozen-after-approval>

## Code Map

- `src/components/feilmeldinger.tsx:24-34` -- `SPRAAKMODELLEN_SVARTE_IKKE` brukes av `llm_feil` og `llm_tidsavbrudd`. `grense_naadd` (l.40) viser formen med `<em>Prøv med eksempel</em>`.
- `src/components/feilmeldinger.test.tsx` -- testene for tabellen.
- `src/components/GapAnalyseFane.tsx` (`Feil`) og forberedelsen viser `provIgjen` og `provEksempel` fra tabellen.
- `src/lib/pipeline/generer.ts:89-96` -- feil som ikke er `GenereringsFeil`, blir `llm_feil` eller `llm_tidsavbrudd`.
- `_bmad-output/planning-artifacts/ux-designs/ux-G69-heggdal-skogheim-2026-10-30/EXPERIENCE.md:66, 121, 122, 220` -- feiltekstene.

## Tasks & Acceptance

**Execution:**
- [x] `src/components/feilmeldinger.tsx` + `feilmeldinger.test.tsx` -- ny tekst og `provEksempel: true` for `llm_feil` og `llm_tidsavbrudd` -- FR-22, NFR-3
- [x] Testene som låser den gamle teksten eller fraværet av *Prøv med eksempel* ved disse feilene (søk etter «Språkmodellen svarte ikke») -- oppdateres til ny oppførsel -- FR-22
- [x] `EXPERIENCE.md` l.66, 122 og 220 -- samme tekst, med dato og henvisning til denne spec-en -- sporbarhet

**Acceptance Criteria:**
- Given at kreditten er brukt opp, when brukeren analyserer, then viser feilen en vei til *Prøv med eksempel*.
- Given `npm run lint`, `npm run typecheck`, `npm test` og `npm run build`, when de kjøres, then er alle grønne.

## Implementation Notes

- `SPRAAKMODELLEN_SVARTE_IKKE` i `feilmeldinger.tsx` har ny tekst og `provEksempel: true`. Ingen komponentkode er endret: `Feil` i `GapAnalyseFane.tsx` viser knappene fra tabellen.
- Etter en mislykket *Generer på nytt* med en forrige analyse (FR-19) viser varselet nå *Prøv med eksempel*. *Prøv igjen* er fortsatt skjult der.
- `EXPERIENCE.md` l.66, 121, 122 og 220 og `epics.md` (story 2.5) har den nye teksten. Punktet i `deferred-work.md` er merket som rettet.
- Lint, typecheck, 935 tester og build er grønne, kjørt fra `C:\`.

## Spec Change Log

## Review Triage Log

| # | Source | Location | Finding | Verdict | Evidence | Route |
|---|--------|----------|---------|---------|----------|-------|
| 1 | blind | Resultat.test.tsx | NFR-3 test used the example path, which can never get `llm_feil` from credit | medium | Confirmed: the example is answered by the server mock (AD-5). Rewritten to use pasted CV and ad | patch |
| 2 | blind | feilmeldinger.tsx | Comment says *Prøv igjen* does not help, above `provIgjen: true` | low | Confirmed; reworded | patch |
| 3 | blind | deferred-work.md | Source entry not marked fixed | low | Confirmed; marked | patch |
| 4 | blind | epics.md story 2.5 | Old text and only *Prøv igjen* | low | Confirmed; updated | patch |
| 5 | blind + edge | GapAnalyseFane.tsx (`medForrige`) | Text says «Prøv igjen» but only *Prøv med eksempel* is shown | low | carried: rejected in spec-generer-paa-nytt-beholder-forrige (#10); *Generer på nytt* is directly above | reject |
| 6 | blind | FR-19 path | *Prøv med eksempel* can replace the kept analysis | low | The button opens the existing confirmation dialog («… erstattes»); nothing is lost without confirming | reject |
| 7 | blind | ACs | No test from provider 429 to UI | low | Mapping 429 `insufficient_quota` → `llm_feil` is pinned in `pipeline/generer.test.ts`; UI from `llm_feil` is tested | reject |
| 8 | blind | tests | Touched tests keep UX-DR20/FR-19 names | false | The naming rule applies to new tests; renaming would break traceability | reject |
| 9 | blind | spec | Record sections empty | false | Filled at step 5 | reject |
| 10 | blind | feilmeldinger.tsx | Scope includes `llm_tidsavbrudd`; wording and button order | low | Frozen decision by Sondre | reject |
| 11 | verification-gap | spec Code Map | «forberedelsen viser provEksempel» is wrong | low | Fix edits this build's spec | reject |

## Verification

**Commands:**
- `npm run lint`, `npm run typecheck`, `npm test`, `npm run build` -- expected: alle grønne
