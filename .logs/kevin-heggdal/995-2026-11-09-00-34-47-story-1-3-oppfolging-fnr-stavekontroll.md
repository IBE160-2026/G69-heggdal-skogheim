# Story 1.3 oppfølging: fødselsnummer og stavekontroll

## 2026-11-09 kl. 00:34 — Kevin Heggdal

### Oppgave
Sondre gikk gjennom story 1.3 og anbefalte to rettinger før PR-en for 1.4: `masker` skal også fange fødselsnummer med bindestrek og flere mellomrom, uten å maskere andre tall feilaktig (FR-6 og testene oppdateres), og CV-feltet og annonsefeltet skal ha `spellCheck={false}` av personvernhensyn. Rettingene skulle føres videre til story 1.4, 1.5 og 1.6 uten at arbeid gikk tapt, og ingen PR eller merge til `main`.

### Plan
- Egen rettegren `story-1.3-oppfolging-fnr-stavekontroll` fra oppdatert `origin/main` (1.3 er merget dit). Lokal `main` ble spolt fram fra `55b3676` til `48d3c94`.
- Skille mellom 6 og 5 sifre: ingenting, 1–3 mellomrom (også hardt), eller én bindestrek eller tankestrek med høyst ett mellomrom på hver side. Ikke tabulator, linjeskift eller andre tegn. Datokravet er uendret. Avgrensningen ble godkjent av Kevin.
- Videreføring med merge, ikke rebase, fordi grenene alt var pushet: rettegren → 1.4 → 1.5 → 1.6, med lint, typesjekk, tester og build etter hver merge.

### Resultat
- `f42bf1c` på rettegrenen:
  - `src/lib/kjerne/masker.ts` har den nye regelen.
  - `masker.test.ts` har 75 tester: 13 formater som maskeres, 12 skilletegn som ikke maskeres, ugyldige datoer med bindestrek, 18 vanlige tallkombinasjoner (telefon, konto, org.nr., IBAN, kort, ISBN, perioder, datoer, postnummer, klokkeslett og beløp), en CV-linje, tabellceller og telling.
  - `spellCheck={false}` med test i `CvPanel` og `Annonsepanel`.
  - FR-6 er oppdatert i `prd.md`, `epics.md`, `epic-1-context.md` og `spec-1-3`, og de to punktene er fjernet fra `deferred-work.md`.
- En midlertidig for vid regel (`[\s\-–._/]*`) ga 13 feilede tester, så de negative testene virker.
- Merger:
  - `d16047f` på 1.4: én konflikt i `deferred-work.md`, løst ved å beholde de to punktene fra 1.4 og fjerne de to løste (9 → 7 punkter).
  - `a5fa898` på 1.5: ingen konflikt.
  - `9bf1e29` på 1.6: ingen konflikt.
- Kontroller: lint, typesjekk og build var grønne etter hver merge. Testene:

  | Gren | Testfiler | Tester |
  |---|---|---|
  | Rettegrenen | 21 | 279 |
  | 1.4 | 25 | 353 |
  | 1.5 | 26 | 392 |
  | 1.6 | 28 | 432 |

- Alle fire grenene er pushet. Ingen PR og ingen merge til `main`.
- Lukket punktene om `masker` med bindestrek og flere mellomrom og om `spellCheck={false}` i `issues.md`.

### Åpne punkter
- Lag PR for `story-1.3-oppfolging-fnr-stavekontroll` mot `main` før PR-en for 1.4. Merk at 1.4–1.6 nå har merge-commits fra rettegrenen, så punktene om å rebase 1.4–1.6 på `main` bør vurderes på nytt (merge av `main` er enklere).
