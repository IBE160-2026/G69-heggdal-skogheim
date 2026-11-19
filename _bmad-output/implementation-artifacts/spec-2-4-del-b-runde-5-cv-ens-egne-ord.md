---
title: 'Story 2.4 del B, runde 5: erfaring beskrives med CV-ens egne ord'
type: 'bugfix'
created: '2026-11-19'
status: 'done'
baseline_commit: '1b18ed97ef3cc548e4fbeddca48a31971d5ab644'
route: 'oneshot'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-2-context.md'
  - '{project-root}/_bmad-output/implementation-artifacts/spec-2-4-del-b-runde-4-alternativer-niva-og-rapportnavn.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** I runde 4 (`testsett-rapporter/2026-11-19-223737-openai-gpt-4.1-mini.md`, linje 198, par 2 K1) var `forklaring` for «Erfaring med brukerstøtte eller kundeservice» (kategori «delvis») «Erfaringen er med brukerstøtte i studiet, men ikke spesifikt i kundeservice». CV-en dokumenterer veiledning av studenter, ikke brukerstøtte. Kategorien er riktig, men forklaringen tillegger brukeren erfaring med annonsens begrep.

**Beslutning (Kevin og Sondre, 2026-11-19):** setningen er et brudd på SM-2 og FR-27. Modellen skal ikke omtale brukerens erfaring med annonsens begreper når CV-en ikke dokumenterer dem. Sondre foreslo en generell regel om at erfaring beskrives med CV-ens egne ord.

**Samme type feil i runde 4:** OpenAI skriver «CV-en dokumenterer god forståelse av Windows» i par 2 K1–K3. CV-en har bare «Operativsystemer: Windows», så nivåordet er annonsens. Regelen dekker også dette.

**Approach:** En generell regel i avsnittet «Ærlighet» i `GAP_INSTRUKS`, og en presisering i steg 5:
- Det som står om brukeren i `forklaring` og `raad`, beskrives med CV-tekstens egne ord.
- Annonsens betegnelse på en erfaring, ferdighet, egenskap eller et nivå brukes ikke om brukeren hvis CV-teksten ikke bruker den.
- Beslektet erfaring beskrives som det CV-teksten viser, og det sies at den ikke er det samme som kravet.
- Det som mangler, kan nevnes med annonsens ord. Kravteksten (`krav`) bruker annonsens ord som før.
- Ingen eksempler fra testdataene.

**Rammer:**
- Fasitene, sjekklisten, akseptansekriteriene og de andre reglene i prompten endres ikke, heller ikke Sondres regel for sammensatte krav.
- Rundene 1–4 endres ikke.
- Ingen betalte kall før Kevin har godkjent dem.
- Runde 5 måler begge leverandørene på samme commit.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Beslektet erfaring | Kravet nevner en type erfaring, CV-en beskriver en annen, beslektet aktivitet | Forklaringen bruker CV-ens ord for aktiviteten og sier at den ikke er det samme som kravet | N/A |
| Nivåord bare i annonsen | Kravet har et nivåord, CV-en nevner ferdigheten uten nivå | Forklaringen legger ikke til nivåordet om brukeren | N/A |
| Det som mangler | En del av kravet er ikke dokumentert | Delen kan nevnes med annonsens ord, som noe som mangler | N/A |
| Kravteksten | – | `krav` bruker annonsens ord som før | N/A |

</frozen-after-approval>

## Implementation Notes

- **Filer:**
  - `src/lib/llm/prompter/gap.ts` (avsnittet «Ærlighet» og steg 5) og `gap.test.ts`.
  - Dokumentasjonen: `vurdering-2-4-leverandorvalg-runde-5.md`, kjøreboka og sesjonsloggen.
- **Etter gjennomgangen:** regelen i «Ærlighet» er delt i underpunkter.
  - En egenskap som konkret erfaring viser (steg 3), kan nevnes sammen med erfaringen.
  - Et nivå som ikke er oppgitt, beskrives som «ikke oppgitt», ikke som noe brukeren mangler.
  - CV-er på andre språk kan oversettes til bokmål.
  - Steg 6 (`raad`) viser også til regelen.
  - Setningen om kravteksten er fjernet, fordi steg 2 allerede dekker den.
  - Testene har én regex per punkt, en test av at regelen står under «Ærlighet» før «Språk», og flere ord i den negative lista («kundeservice», «kommunikasjonsevner», «studentassistent»).
- **Hvordan runde 5 vurderes** (står i `vurdering-2-4-leverandorvalg-runde-5.md`): hver `forklaring` og hvert `raad` leses. En setning som tillegger brukeren erfaring, en ferdighet, en egenskap eller et nivå med annonsens ord uten at CV-en bruker dem, gir `N` på «Ingen oppdiktede kvalifikasjoner» (SM-2, FR-27), etter Kevins og Sondres beslutning 2026-11-19. Det samme gjelder begge leverandørene.
- **Kontrollen:** lint, typecheck, `npm test` (835 av 835 i 48 filer), build og begge tørrkjøringene er grønne.
- **Sprint-status:** 2-4 står fortsatt som `in-progress`.

## Review Triage Log

| # | Finding | Verdict | Route | Evidence |
|---|---------|---------|-------|----------|
| 1 | The rule conflicts with the step-3 egenskap rule | medium | patch | «Kommunikasjonsevner er vist muntlig» would break the rule, even though veiledning shows it. A sub-bullet now allows naming an egenskap together with the experience that shows it. |
| 2 | «CV-tekstens egne ord» clashes with the Språk rule for other languages | low | patch | Translation into bokmål is now explicitly allowed. |
| 3 | Step 6 (`raad`) is not tied to the rule | medium | patch | Step 6 now refers to Ærlighet, with a test. |
| 4 | «Det som mangler» is a loophole for level words | medium | patch | A level that is not stated is described as «ikke oppgitt», not as something the user lacks. |
| 5 | No acceptance criterion for runde 5 | low | patch | The assessment rule is written into the runde-5 evaluation. |
| 6 | Tests check wording, not position | low | patch | An order test was added (Ærlighet, rule, Språk). |
| 7 | The banned-word list is incomplete | low | patch | Three words added. |
| 8 | The bullet is overloaded | low | patch | Split into sub-bullets. |
| 9 | «Kravteksten (krav) bruker annonsens ord» is redundant | low | patch | Removed, with a test that it is gone. |
| 10 | The planned documentation is missing | medium | patch | Evaluation copy and runbook added in this commit. |
| 11 | The matrix has no error handling | low | patch (notes) | The matrix is frozen, so the consequence (`N` under SM-2) is recorded above and in the evaluation. |
