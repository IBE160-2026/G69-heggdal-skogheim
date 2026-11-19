# Story 2.5 – forståelige feil uten tap av data

## 2026-11-19 kl. 15:45 — Sondre Skogheim

### Oppgave
Bygge story 2.5 med bmad-build: norske feilmeldinger fra én tabell, *Prøv igjen* når språkmodellen feiler, og ingen tap av tekst (FR-22, SM-7). Kevin tar Mistral og del B av 2.4 samtidig.

### Plan
- Story-fila er [spec-2-5-forstaaelige-feil-uten-tap-av-data.md](../../_bmad-output/implementation-artifacts/spec-2-5-forstaaelige-feil-uten-tap-av-data.md). Sondre godkjente den, med de nye meldingene for tidsavbrudd, manglende nøkkel, for lang og for kort tekst og ugyldig inndata.
- Konteksten for epic 2 ble bygget på nytt, fordi EXPERIENCE.md var endret i 2.3.
- En agent implementerte, og tre agenter gikk gjennom koden.

### Resultat
- Commit `3093dae` på grenen `story-2.5-forstaaelige-feil-uten-tap-av-data`.
- **Meldingstabellen:** `src/components/feilmeldinger.tsx` har de åtte feilkodene og tre filfeil. Tallene i meldingene hentes fra konstantene i `grenser.ts`.
- **Gap-fanen:** feil vises som `Alert` med `role="alert"`.
  - *Prøv igjen* vises for feil fra språkmodellen, tidsavbrudd og ugyldig svar. Den flytter fokus til fanepanelet.
  - *Prøv med eksempel* vises for grense nådd og manglende nøkkel.
- **Filfeil:** tekstene ligger nå i tabellen og er uendret.
- **Oppbrukt kreditt:** gir `llm_feil` og ikke `grense_naadd`, og eksempelet virker etterpå. Det er testet.
- **EXPERIENCE.md:** har fått de nye meldingene.
- **`npm install`:** måtte kjøres fordi PR #14 la til `tsx`.
- **Kontrollene:** lint, typecheck, 732 tester og build er grønne.
- **Gjennomgangen:** 12 funn. 2 er rettet, 1 er utsatt og 9 er avvist.
- **Sprint-status:** 2-5 står som `review`.

### Åpne punkter
- Story 2.4 og produksjon: når kreditten er brukt opp, får brukeren *Prøv igjen*, som ikke hjelper, og ingen henvisning til *Prøv med eksempel* (`deferred-work.md`).
- Manuell test før fletting: sett `LLM_MODELL=finnes-ikke` i `.env.local`. *Analyser* med par 2 skal vise meldingen og *Prøv igjen*, og *Prøv med eksempel* skal virke etterpå. Sett `LLM_MODELL=gpt-4.1-mini` tilbake etterpå.
