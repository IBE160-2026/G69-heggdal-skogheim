# Story 2.6: redigere, kopiere og generere gap-analysen på nytt

## 2026-11-19 kl. 16:14 — Sondre Skogheim

### Oppgave
Sondre bygger story 2.6 med bmad-build: gap-analysen skal kunne redigeres, kopieres og genereres på nytt.

### Plan
- Story-fil: [spec-2-6-redigere-kopiere-og-generere-gap-analysen-paa-nytt.md](../../_bmad-output/implementation-artifacts/spec-2-6-redigere-kopiere-og-generere-gap-analysen-paa-nytt.md). Godkjent av Sondre («Godkjenn og fortsett»): samlet story-fil, toast øverst på midten, fast råd ikke redigerbart, skjelett under ny generering, ingen verktøylinje ved feil.
- Implementering med agent, kodegjennomgang i tre lag (blind, edge case, verification gap), rettelser og full sjekk.

### Resultat
- Kravtekst, «Hvorfor delvis» og «Råd» er tekstfelt som lagrer i `redigert` (`kravRedigert` i tilstand.ts). Fanen viser «· redigert».
- Ny `GapVerktoylinje.tsx`: *Kopier* (ren tekst fra `gapTekst.ts`, toast «Kopiert», live «Kopiert.», feiltoast) og *Generer på nytt* (dialog når fanen er redigert, `aria-disabled` under generering).
- `sonner` lagt til (shadcn); `next-themes` fjernet, toasten bruker lyst tema.
- Kodegjennomgang: 18 funn. 5 rettet: test for redigering av forklaring/råd, `toast.error` ved feil, kravnummer i skjermlesernavnet på feltene, fast råd fra én kilde i testen, trimming i kopiteksten. 1 utsatt, 12 avvist (se Review Triage Log i story-fila).
- lint, typecheck, 765 tester og build er grønne. Commit 0c91d1d på grenen story-2.6-redigere-kopiere-og-generere-gap-analysen-paa-nytt. Story 2.6 står som review i sprint-status.

### Åpne punkter
- Test 2.6 i nettleseren før fletting: rediger et krav, Kopier og lim inn, Generer på nytt med og uten redigering, tastatur alene og 320 px.
- Story 5.2: sjekk med NVDA/VoiceOver om vellykket kopiering leses opp to ganger (toast «Kopiert» og live-regionen «Kopiert.»).
- Senere: en mislykket *Generer på nytt* sletter den forrige analysen (deferred-work.md).
- Vurder ordlyden i dialogen «Lage nytt Gap-analyse og nøkkelord?» (malen i EXPERIENCE.md gir feil kjønn).
