# Personvernboks: lagring for misbruk

## 2026-11-24 kl. 12:32 — Sondre Skogheim

### Oppgave
Personvernboksen skal si at leverandøren kan beholde teksten i opptil 30 dager for å oppdage misbruk (spørsmål 9 i beslutningsarket, svar a).

### Plan
- bmad-build med spec [spec-personvernboks-misbrukslogger.md](../../_bmad-output/implementation-artifacts/spec-personvernboks-misbrukslogger.md). Sondre valgte å samle teksten i punkt 2 og å nevne alle leverandører med navn.

### Resultat
- Punkt 2: «Appen lagrer ingenting, og alt er borte når du lukker fanen. {Leverandør} kan likevel beholde teksten i opptil 30 dager for å oppdage misbruk.» Uten status står «Språkmodellen».
- Ny funksjon `lagringstekst` i `src/lib/okt/personvern.ts`. PRD FR-5, EXPERIENCE.md, epics.md, testopplegget og kjørebok B er oppdatert.
- Lint, typecheck, 923 tester og build er grønne. Gjennomgang i tre lag: 4 rettinger i dokumenter, 2 utsatt, 9 avvist.
- Commit `4b7ce39` på grenen `personvernboks-misbrukslogger`, PR #38.

### Åpne punkter
- Sjekk den nye teksten i Vercel-forhåndsvisningen (lys og mørk modus, mobilbredde) før PR #38 flettes.
- Kildesjekk at Mistral beholder API-trafikk i 30 dager for misbruk (deferred-work.md).
