---
title: 'Story 2.4 del B, runde 4: alternativer, nivå og kravet slik det står, og rapporter som ikke overskrives'
type: 'bugfix'
created: '2026-11-19'
status: 'done'
baseline_commit: '73766a61b193117c02e5401d736722e461cc12ef'
route: 'oneshot'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-2-context.md'
  - '{project-root}/_bmad-output/implementation-artifacts/spec-2-4-del-b-runde-3-sammensatte-krav.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem 1 (prompten):** I runde 3 (`vurdering-2-4-leverandorvalg-runde-3.md`) feilet begge leverandørene SM-3, med 2 krav over fasiten hver:
- **OpenAI, par 2 K1 og K2:** «Erfaring med brukerstøtte eller kundeservice» ble `O` på grunnlag av veiledning av studenter. Veiledningen ligner et av alternativene, men er ikke ett av dem (fasiten: `D`). Regelen «for alternativer er ett nok» sier ikke at alternativet selv må være dokumentert.
- **Mistral, par 1 K2 og K3:** «Gode digitale ferdigheter» ble `O` med Office «grunnleggende». Regelen om lavere nivå ble ikke fulgt.
- **Mistral, par 1 i alle tre:** «Kundeorientert og trives med å hjelpe andre» ble `D` (fasiten: `O`). Begrunnelsen var bankerfaring eller «bare egenvurdering», selv om konkret kundehjelp står i CV-en. Modellen la til et krav som ikke står i annonsen.
- **OpenAI:** ga råd også ved «delvis», mot steg 6.

**Problem 2 (testsettet):** `rapportNavn` i `scripts/kjor-testsett.ts` har bare timer og minutter, og `main` skriver med `writeFileSync` uten å sjekke om fila finnes. Kontrollen for OpenAI i runde 3 ble derfor overskrevet av den fulle målingen, som startet i samme minutt.

**Approach:**
- Generelle regler i steg 3 av `GAP_INSTRUKS`, uten eksempler fra testdataene:
  - Et alternativ må selv være dokumentert. Erfaring som bare ligner, gir «delvis».
  - Et nivå i CV-teksten som er lavere enn nivået i kravet, gir «delvis», også når ferdigheten ellers passer.
  - Kravet vurderes slik det står. Ingen krav legges til, for eksempel om bransje, arbeidsgiver eller stilling.
  - En egenskap er dokumentert når konkret erfaring viser den, også når ordet ikke står i CV-en.
- Steg 6: `raad` er null for «oppfylt» og «delvis».
- Sondres regel for sammensatte krav (runde 3) beholdes uendret.
- Testsettet: filnavnet får sekunder (`TTMMSS`), og en rapport overskrives aldri. Finnes navnet, får det et løpenummer (`-2`, `-3` …). Det dekkes av en regresjonstest.

**Rammer (Kevin, 2026-11-19):**
- Fasitene, sjekklisten, FR-8, SM-1–SM-3 og akseptansekriteriene endres ikke.
- Resultatene fra rundene 1–3 endres ikke.
- Ingen betalte kall før Kevin har godkjent dem.
- Ingen push, ingen fletting og ingen endringer i Vercel.
- Begge leverandørene måles i runde 4 på samme commit.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Alternativ dokumentert | «A eller B», CV-en dokumenterer B | «oppfylt» hvis B dekker kravet | N/A |
| Bare noe som ligner | «A eller B», CV-en har C, som ligner A | «delvis» | N/A |
| Lavere nivå | Kravet «gode X», CV-en «X – grunnleggende» | «delvis» | N/A |
| Annen bransje | Kravet om en egenskap, konkret erfaring fra en annen bransje | Kan være «oppfylt». Bransjen er ikke et krav | N/A |
| Råd ved delvis | Kategori «delvis» | `raad` er null | N/A |
| To kjøringer i samme sekund | Samme valg og samme dato, `main` to ganger | To filer. Den første er uendret, og den andre heter `…-2.md` | Annen skrivefeil kastes videre |
| Sekunder i navnet | Dato 09:05:07 | `…-090507-…` | N/A |

</frozen-after-approval>

## Implementation Notes

- **Filer:**
  - `src/lib/llm/prompter/gap.ts` og `gap.test.ts`: steg 3 og 6.
  - `scripts/kjor-testsett.ts` (`rapportNavn`, `main` får `na` og en ny hjelper for et ledig filnavn) og `scripts/testsett/kjor.test.ts`.
  - Dokumentasjonen: `vurdering-2-4-leverandorvalg-runde-4.md`, kjøreboka og sesjonsloggen.
- **Ikke endret:** fasitene, pipelinen, skjemaet, demosvarene og rundene 1–3.
- **Etter gjennomgangen:**
  - Reglene om å vurdere kravet slik det står, sier nå at de ikke gjør beslektet erfaring til dokumentasjon. Erfaring som bare ligner, gir fortsatt «delvis».
  - Regelen om nivå er igjen et tak («høyst "delvis"»).
  - Løpenummeret er `-nrN`, før `-mock.md` eller `.md`, med en øvre grense på 1000. For en tørrkjøring heter den andre fila `…-nr2-mock.md`, og den fanges fortsatt av `.gitignore` (`*-mock.md`).
  - Testene sjekker `ENOENT` uten at noen fil skrives, et modellnavn som slutter på et siffer, og linjen i konsollen.
- **Kontrollen:** lint, typecheck, `npm test` (819 av 819 i 48 filer), build og begge tørrkjøringene er grønne. Navnene har nå sekunder (`…-223427-…`).
- **Utsatt** (i `deferred-work.md`): å fjerne `raad` ved «delvis» i koden, og å rette formatet på filnavnet i spec-en for del A.
- **Sprint-status:** 2-4 står fortsatt som `in-progress`.

## Review Triage Log

| # | Finding | Verdict | Route | Evidence |
|---|---------|---------|-------|----------|
| 1 | The «slik det står» bullets can undo the alternatives fix | medium | patch | Supervising students could be read as user support from another industry. A sentence now says these two rules do not turn related experience into documentation. |
| 2 | The level rule changed from a ceiling to a fixed result | medium | patch | «er kravet "delvis"» would rule out «mangler» for a much lower level. Restored to «høyst "delvis"». |
| 3 | `raad` being null for oppfylt and delvis is only in the prompt | medium | defer | It is a pipeline change, outside this spec. Logged in `deferred-work.md`. |
| 4 | Prompt tests check wording, not behaviour | low | reject | Behaviour needs paid calls. Runde 4 is the gate. |
| 5 | `skrivNyRapport` loop has no upper bound | low | patch | Capped at 1000 attempts with a clear error. |
| 6 | The run number can be confused with digits in a model name | low | patch | The suffix is now `-nrN`, and a test with `mistral-large-4-0` was added. |
| 7 | The write-error test is weak | low | patch | It now asserts `code: "ENOENT"` and that no file was written. |
| 8 | The main regression test ignores the console line | low | patch | It asserts the logged path ends in `nr2-mock.md`. |
| 9 | The docs still describe minute-only names, and the planned docs are missing | medium | patch / defer | The runbook and the round-4 evaluation were added. The done del A spec is deferred, because the workflow does not edit specs in a fix. |
| 10 | The I/O matrix omits `-nr2-mock.md` and the gitignore rule | low | patch (notes) | The matrix is frozen, so the rule is recorded in the Implementation Notes above. |
