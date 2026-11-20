# Utkast: PR for story 2.4, B4-resultatet og testsettet med den nye prompten

> **Utkast.** Tittelen og beskrivelsen under kopieres inn når PR-en opprettes. Grenen er `story-2.4-b4-resultat`, laget fra `main` `b50e34a` (PR #28) og oppdatert med `origin/main` `c3471e1` (Sondres logg).

**Tittel:** `Story 2.4: B4 bestått i produksjonen, og testsettet med den nye prompten (SM-1 9/12, SM-2 10/12, SM-3 11/12 – ikke bestått)`

---

## Sammendrag

Denne PR-en inneholder **bare dokumentasjon og én testrapport**. Prompten, fasitene, testdataene og koden er ikke endret.

- **B4 del 2 (NFR-9) er bestått i produksjonen** etter PR #28, og Sondre har bekreftet det. **`store: false` virker** også. Under Logs i OpenAI er det ingen nye rader etter kl. 16:36.
- **Testsettet med den nye prompten fra PR #27 og PR #28** ble kjørt én gang med 12 betalte kall (0,2456 kr). **Tre suksesskriterier er ikke bestått:**

| Kriterium | Ny prompt | Gammel prompt (kontrollen med temperatur 0) | Kjøringene som feiler |
|---|---|---|---|
| **SM-1 (gap), hele sjekklisten** | **IKKE bestått, 9 av 12** (7 av 12 hvis grensetilfellet regnes som brudd) | 12 av 12 med revurdert fasit (11 av 12 hvis grensetilfellet regnes som brudd) | par 2 K1, par 2 K3, par 3 K1 |
| **SM-2, ingen oppdiktede kvalifikasjoner** | **IKKE bestått, 10 av 12** (7 av 12 hvis grensetilfellet regnes som brudd) | 12 av 12 (11 av 12 hvis grensetilfellet regnes som brudd, fordi det sto i K1) | par 2 K1 og K3 |
| **SM-3, ingen krav over fasiten** | **IKKE bestått, 11 av 12** | 12 av 12 | par 3 K1 |
| Toleransen i FR-8, NFR-4 og kostnaden | Bestått (høyst 8,8 s, ca. 0,08 kr per full kjøring) | Bestått | – |
| NFR-5 | Bestått med små feil | Bestått med små feil | – |
| NFR-9 (B4 del 2) | Bestått (1 kall i produksjonen, 2 lokalt) | Uavklart | – |

> **Til Sondre:** det åpne punktet i loggen din kl. 19:39 («sjekk at SM-1 og SM-2 fortsatt er bestått») er besvart. **Svaret er nei:** SM-1 og SM-2 er ikke lenger bestått med den nye prompten, og det er heller ikke SM-3.
>
> **Story 2.4 er ikke ferdig, og denne PR-en setter ikke 2-4 til `done`.** Kevin og Sondre må avgjøre punktene under «Beslutninger» først.

## Avvikene

- **Par 3 K1 (SM-3):** «Gode samarbeidsevner» ble Delvis oppfylt. Fasiten etter revurderingen er Mangler, så kravet ligger over fasiten, som er den alvorlige retningen. Belegget er «Kundeservicemedarbeider (deltid)», og forklaringen er «kan tyde på samarbeidsevner».
- **Par 2 K1 og K3 (SM-2):** forklaringene sier «viser erfaring **med brukerstøtte**» og «**forståelse av** Windows», med annonsens ord om brukeren. CV-en har bare veiledning og «Windows og Linux (brukt i studiet)». Dette er et brudd etter regelen fra 2026-11-19.
- **Grensetilfelle (SM-2):** «Du har erfaring med fakturaer» i par 3 i alle tre kjøringene. CV-en sier «Besvarte kundehenvendelser om fakturaer».
- **Par 3 varierer** mellom kjøringene, selv med temperatur 0. K2 har ett krav under fasiten, som toleransen tillater.
- **Mindre svakheter:**
  - Stillingen i par 4 har mistet «– deltid».
  - Noen språkfeil, blant annet «muntlig kommunikasjonsevner».
  - Tredje person i stedet for du-form i par 4.
- **Årsaken er ikke vist.** Det er én kjøring med 3 forsøk per par. Det kan skyldes prompten, men også tilfeldig variasjon.

### Den forbudte påstanden i SM-2, ordrett (lagt til 2026-11-21)

Fra `testsett-rapporter/2026-11-20-182613-openai-gpt-4.1-mini.md`, par 2, kravet «Erfaring med brukerstøtte eller kundeservice»:
- **K1** (linje 198): «CV-teksten viser erfaring med brukerstøtte som studentassistent, men ikke kundeservice.»
- **K3** (linje 248): «CV-teksten viser erfaring med brukerstøtte som studentassistent, men ikke direkte kundeservice.»
- **CV-en har** «Studentassistent (deltid), Høgskolen i Molde», «Hjalp førsteårsstudenter med oppgaver i introduksjonsfaget i programmering» og «Holdt to veiledningstimer i uken». Brukerstøtte er ikke nevnt.

Det andre SM-2-bruddet, i samme kjøringer, gjelder kravet «God forståelse av Windows og Microsoft 365»:
- **K1** (linje 197) og **K3** (linje 247): «CV-teksten viser forståelse av Windows, men nevner ikke Microsoft 365.»
- **CV-en har** «Windows og Linux (brukt i studiet)».

Alle kravene som feilet, ordrett per kjøring, står i **avsnitt 2a** i `vurdering-2-4-kontroll-ny-prompt.md`.

### Feilene har forekommet før PR #28

Avsnitt 2a har en tabell med rapportfil og linje for rundene 3, 4 og 5 og kontrollen. Alle brukte prompter uten eksempelblokken og uten reglene fra PR #27:

| Feilen | Forekom før |
|---|---|
| Setningen om «brukerstøtte» (SM-2) | Bare runde 4 K1. Det er setningen som ga regelen fra 2026-11-19, og den forekom ikke med `271edb4` |
| «Brukerstøtte» Oppfylt, over fasiten (SM-3) | Runde 3 K1 og K2, og runde 5 K1 |
| «Forståelse av Windows» | Runde 3 (K1 og K3) og runde 4 (alle tre), før regelen om CV-ens egne ord |
| «Gode samarbeidsevner» D med kundeservicejobben som belegg | Runde 3 (alle tre), runde 4 K3 og runde 5 K2, og hos Mistral i de samme rundene. Fasiten var D den gang, så det var ikke et brudd da |
| «Erfaring med fakturaer» (grensetilfellet) | Alle rundene og kontrollen |

- **Runde 5 hadde samme prompt som kontrollen** (`271edb4`), bare med temperatur 0,2 i stedet for 0.
- **Bare kontrollen**, én kjøring med temperatur 0, var fri for de tre feilene (brukerstøtte, Windows og samarbeidsevner). Grensetilfellet sto der også.
- Det viser ikke at eksempelblokken er årsaken, og heller ikke at den ikke er det. **Ingenting er endret** før Kevin og Sondre har gått gjennom avvikene.

## Ferdig i denne PR-en

- **B4 i produksjonen** (`8a59382`): § 7a i `kjorebok-2-4-del-b.md` har resultatet etter PR #28. Det er 6 krav (3 O, 2 D og 1 M for AFR), tok ca. 9 s og brukte riktig fil.
  - Årsaken til feilene kl. 16:01 og 16:36 står som **uavklart**. Kevin har bekreftet at **ett** av forsøkene brukte README-innholdet som annonse, men ikke hvilket. Sondres logg (19:39) forklarer **begge** de tomme svarene med README-innlimingen. **Sondre, bekreft eller rett dette.**
- **Testsettet** (`efc6653`):
  - Rapporten ligger i `testsett-rapporter/2026-11-20-182613-openai-gpt-4.1-mini.md`.
  - Rapporten er **rå utdata**: den viser svarene og fasiten, men avkrysningsboksene er tomme, og den har ingen vurdering.
  - Vurderingen ligger i `vurdering-2-4-kontroll-ny-prompt.md`. Den har en statusboks øverst med kriteriene som ikke er bestått, og deretter kategoriene, SM-2, kriteriene, svakhetene og beslutningene.
- **Sondres bekreftelse:** B4 og `store: false` er ført inn i kjørebøkene, vurderingen og `issues.md`. Regelen for nøkkelen er også ført inn: `kevin-maaling-2-4` slettes ikke før Sondre har bekreftet at rapporten er tilstrekkelig og selv har slettet OpenAI-nøkkelen.
- **Tidligere vurderinger og utkast:**
  - `vurdering-2-4-kontroll-temperatur-0.md`: SM-2 og SM-3 gjelder nå uttrykkelig prompten fra `271edb4`, og det er lagt til en NFR-9-linje og en ny overskrift i § 6.
  - `pr-2-4-avslutning.md` og `pr-2-4-b4-oppfolging.md`: daterte merknader.
- **Spesifikasjoner** (BMAD): `spec-2-4-b4-produksjon-bestatt-og-inndata-uavklart.md`, `spec-2-4-kontroll-ny-prompt-testsett.md` og `spec-2-4-gjennomgang-for-pr-b4-resultat.md`.
- **Epic-konteksten** (`epic-2-context.md`) er kompilert på nytt fra planleggingsdokumentene. Det tar også med endringer fra annet arbeid som allerede er flettet, og som ikke gjelder B4:
  - Sondres farger og mørk modus (en ny del, «Farger og tema»)
  - titlene i dialogen *Generer på nytt*, per fane
  - knappen *Analyser på nytt*
- **Logger:** Kevins sesjonslogg og `issues.md`, og en fletting av `origin/main` (`c3471e1`, Sondres logg).

## Beslutninger (Kevin og Sondre, avsnitt 5 i vurderingen)

1. **SM-2:** skal «erfaring med fakturaer» i par 3 regnes som brudd?
2. **SM-3 i par 3 K1:** to veier.
   - **a)** godta det som en kjent svakhet
   - **b)** rette prompten og måle på nytt (12 betalte kall og en ny B4-test)

   Å endre fasiten igjen anbefales ikke.
3. **Prompten:** skal den beholdes som den er, eller justeres?
4. **Story 2.4:** regnes SM-1 fortsatt som avgjort for C5 med 9 av 12?
5. **Nøklene fra målingen:** Sondre bekrefter om rapporten er tilstrekkelig. Etter det sletter Sondre OpenAI-nøkkelen `kevin-maaling-2-4`, og Kevin sletter Mistral-nøkkelen fra målingen.

**Andre åpne punkter** (i `issues.md` og kjørebøkene):
- om de 56 lagrede forespørslene hos OpenAI skal slettes
- om personvernboksen skal nevne OpenAIs logger mot misbruk (opptil 30 dager)
- en egen melding for en annonse uten krav
- en merknad i `testdata/robusthet/README.md` om at den ikke er testinndata
- signaturene i `vurdering-2-4-kontroll-temperatur-0.md` og `vurdering-2-4-kontroll-ny-prompt.md`
- resten av C5: PRD §10.1 og statusen `done`

## Kontroll

- `npm run lint`, `npm run typecheck`, `npm test` (927 av 927) og `npm run build` er grønne. De er kjørt på nytt etter flettingen av `origin/main`, med alle endringene i denne PR-en.
- `src/` og `testdata/` er uendret mot `main`.
- Ingen hemmeligheter. Rapporten inneholder ingen nøkler.

## Ikke i denne PR-en

- Ingen endring av prompten, fasiten, testdataene eller koden.
- Ingen nye betalte kall, ingen slettede nøkler, og 2-4 er ikke satt til `done`.
- Story 2.7 er ikke startet.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
