---
title: 'En mislykket Generer på nytt beholder den forrige gap-analysen'
type: 'bugfix'
created: '2026-11-24'
status: 'done'
route: 'dispatch'
review_loop_iteration: 0
baseline_commit: 'a7328d925a3baae57781f906093efb72bcc0b875'
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Når *Generer på nytt* feiler, er den forrige gap-analysen borte, også redigeringene. Brukeren ser bare feilmeldingen. Det skjer fordi `genereringStartet` og `genereringFeilet` i `tilstand.ts` setter `generert` og `redigert` til `null` (deferred-work.md, fra story 2.6).

**Approach:** En ny generering endrer ingenting før den lykkes. Den forrige analysen, redigeringene og merket «· redigert» beholdes i tilstanden mens den nye lages, og etter en feil. Først når et nytt svar kommer, erstattes analysen og redigeringene nullstilles, som i dag (FR-19). Avtalt med Kevin 2026-11-24: 2.7 bygger på at redigert-tilstanden er riktig også etter en feil.

## Boundaries & Constraints

**Always:**
- Den første genereringen (ingen forrige analyse) oppfører seg som i dag: skjelett mens den lages, og bare varselet ved feil.
- Svar som kommer for sent (feil `kjoringId` eller `gapVersjon`), ignoreres fortsatt (`gjelder`).
- Feilen vises fortsatt i en `Alert` med `role="alert"`, aldri som toast, og live-regionen gjentar den ikke (AD-8, FR-22).
- *Tilbake* og en ny kjøring fra forberedelsen nullstiller resultatet som i dag.
- Testnavn starter med FR-19, FR-22 eller UX-DR.

**Never:**
- Ingen endring i API-et, pipelinen eller `GapVerktoylinje`s dialog for å overskrive redigeringer.
- Ingen lagring i nettleseren (NFR-1).

**Beslutninger (Sondre, 2026-11-24):**
- **Under genereringen** ser alt ut som i dag: skjelett i fanen og i toppfeltet, spinneren i fanenavnet og ikke «· redigert». Den forrige analysen ligger bare i tilstanden.
- **Etter en feil med en forrige analyse** står varselet øverst i fanen, og under det den forrige analysen med redigeringene, toppfeltet, «· redigert» og verktøylinjen. Varselet har ikke *Prøv igjen*, siden *Generer på nytt* i verktøylinjen gjør det samme med dialogen om redigeringer. *Prøv med eksempel* vises som før når feilkoden gir den.
- **Uten forrige analyse** er feilvisningen som i dag, med *Prøv igjen*.

</frozen-after-approval>

## Code Map

- `src/lib/okt/tilstand.ts:437-484` -- `genereringStartet`, `genereringFerdig`, `genereringFeilet`. De to første og den siste setter `generert` og `redigert` til `null`. `medGap`, `gjelder` (l.279) og `medRedigering` brukes uendret. Typen for gap-delen (`status`, `feilkode`, `generert`, `redigert`, `gapVersjon`) står øverst i fila.
- `src/components/GapAnalyseFane.tsx:462-470` -- skjelett ved `venter`/`genererer`, `<Feil>` ved `feil`, ellers `gap.redigert ?? gap.generert`. `Feil` (l.80) har *Prøv igjen* og *Prøv med eksempel* fra `FEILMELDINGER`.
- `src/components/Resultat.tsx:28-109` -- `analyse` i toppfeltet, «· redigert» og spinneren i fanenavnet, og `GapVerktoylinje` skjules ved `feil`.
- `src/lib/okt/OktProvider.tsx:70-82` -- `startGenerering` øker `gapVersjon`.
- Testene: `tilstand.test.ts`, `GapAnalyseFane.test.tsx`, `Resultat.test.tsx`, `GapVerktoylinje.test.tsx`.
- Kevin endrer `tilstand.ts` og `Resultat.tsx` i 2.7 etter at denne er flettet. Hold endringene små.

## Tasks & Acceptance

**Execution:**
- [x] `src/lib/okt/tilstand.ts` + test -- forrige `generert` og `redigert` beholdes ved start og feil, og erstattes ved ferdig -- FR-19
- [x] `src/components/Resultat.tsx`, `GapAnalyseFane.tsx` + tester -- visningen etter beslutningene over -- FR-22, UX-DR10

**Acceptance Criteria:**
- Given en redigert gap-analyse, when *Generer på nytt* feiler, then står analysen med redigeringene og «· redigert» igjen sammen med feilmeldingen.
- Given en redigert gap-analyse, when *Generer på nytt* lykkes, then vises den nye analysen uten redigeringer, som i dag.
- Given `npm run lint`, `npm run typecheck`, `npm test` og `npm run build`, when de kjøres, then er alle grønne.

## Implementation Notes

- `genereringStartet` og `genereringFeilet` sprer den gjeldende gap-delen og endrer bare `status`, `feilkode` og `gapVersjon`. `genereringFerdig` er uendret og nullstiller `redigert`.
- Avvik fra Code Map: `medRedigering` godtar nå også `status: "feil"`. Uten det ville tekstfeltene i den beholdte analysen etter en feil se redigerbare ut, men ikke ta imot tastetrykk (kontrollerte felt). Under genereringen er redigering fortsatt avvist.
- `GapVerktoylinje`: bare `opptatt` er endret, så knappene virker ved `feil` med en forrige analyse. Dialogen er urørt.
- `Resultat`: toppfeltet og «· redigert» skjules under genereringen; verktøylinjen skjules ved feil bare når det ikke finnes en forrige analyse.
- `GapAnalyseFane`: `Feil` har `medForrige`, som tar bort *Prøv igjen*. Varselet står i en `mb-4` over analysen.
- Testen «AD-6: en ny generering tømmer både generert og redigert» i `redigering-tilstand.test.ts` er erstattet av FR-19-tester for start, feil, redigering etter feil, ferdig og forsinket svar.

- Etter gjennomgangen: to FR-19-tester til (et sent `genereringFerdig` endrer ikke den beholdte analysen, og *Tilbake* fjerner den etter en feil). Lint, typecheck, 934 tester og build er grønne, kjørt fra `C:\`.

## Spec Change Log

## Review Triage Log

| # | Source | Location | Finding | Verdict | Evidence | Route |
|---|--------|----------|---------|---------|----------|-------|
| 1 | blind | redigering-tilstand.test.ts | No test that a late `genereringFerdig` leaves the kept analysis | low | Confirmed gap; `gjelder` guards it, test added | patch |
| 2 | blind | redigering-tilstand.test.ts | No test that *Tilbake* clears a kept analysis after failure | low | Confirmed gap; test added | patch |
| 3 | blind | spec Code Map | Wording on which reducer cases null fields; wrong test file named | low | Fix edits this build's spec | reject |
| 4 | blind | spec Tasks | `GapVerktoylinje.tsx` not in task list | low | Fix edits the spec; change is recorded in Implementation Notes | reject |
| 5 | blind | GapVerktoylinje dialog | «blir overskrevet» is conditional now | low | Still true when the new generation succeeds; the frozen spec forbids changing the dialog | reject |
| 6 | blind | Resultat.tsx | `!== null` vs `!= null` for `redigert` | false | Type is `GapAnalyse \| null`; `undefined` cannot occur | reject |
| 7 | blind | tests | Regenerate from error without edits, and typing after failure in the UI, untested | low | Reducer tests cover both paths; unlikely to regress unnoticed | reject |
| 8 | blind | spec ACs | Missing ACs for first failure and hidden analysis during generation | low | Fix edits the spec; both covered by existing and new tests | reject |
| 9 | edge | GapVerktoylinje.tsx:35 | *Generer på nytt* enabled after non-retryable error codes | low | Retry is harmless: the kept analysis stays on failure. `for_lang_tekst` cannot occur on regeneration with unchanged text | reject |
| 10 | edge | GapAnalyseFane.tsx | Alert text says «Prøv igjen» without its button | low | *Generer på nytt* is directly above the alert; a variant text adds a branch | reject |
| 11 | verification-gap | — | No gaps | — | — | — |

## Verification

**Commands:**
- `npm run lint`, `npm run typecheck`, `npm test`, `npm run build` -- expected: alle grønne

**Manual checks:**
- Lokalt med `LLM_LEVERANDOR=openai OPENAI_API_KEY=` (demo) er feil vanskelig å lage. Verifiser med testene på tilstanden og komponentene.
