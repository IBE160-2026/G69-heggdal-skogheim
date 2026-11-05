# Story 1.3: CV-innlesing (Kevins arbeid)

## 2026-11-05 kl. 10:12 — Sondre Skogheim (logger arbeid utført av Kevin Heggdal)

Loggen er skrevet i ettertid av Sondres Claude-økt, ut fra commit `e1e286e` og spec-en. Kevin har ikke skrevet eller lest den. Det som står om Kevins valg og testresultater, kommer fra spec-en og er ikke kontrollert på nytt.

### Oppgave
Sondre ba om en logg over det Kevin gjorde, fordi commiten ikke hadde noen `.logs/`-fil. Kevins oppgave var story 1.3: brukeren skal kunne lime inn CV-teksten, se hva som blir sendt, og få fødselsnumre fjernet.

### Plan
- Spec: `_bmad-output/implementation-artifacts/spec-1-3-lime-inn-cv-tekst-og-kontrollere-den.md` på grenen `origin/story-1.3-cv-innlesing`.
- Ifølge spec-en bygde Kevin storyen i seks deler: `masker`, grenser, tilstand, live-region, CV-panel og *Analyser*-knappen. Deretter kom en gjennomgang med rettelser.

### Resultat
Commit `e1e286e` (2026-11-05 kl. 02:10), 20 filer, +1247/−19, bygger på `55b3676`. Grenen er ikke flettet til `main`, og den har ingen PR da loggen ble skrevet. `sprint-status.yaml` på grenen sier `review`, mens spec-en sier `status: 'done'`.

- **Maskering:** `src/lib/kjerne/masker.ts` bytter 11 sifre med gyldig dato (DDMMÅÅ) til `[fødselsnummer fjernet]`, også med ett vanlig eller hardt mellomrom etter de seks første sifrene. Maskering skjer ved innliming, når feltet forlates og når *Analyser* trykkes, ikke mens brukeren skriver.
- **CV-panelet:** `src/components/CvPanel.tsx` har nå knappen *Lim inn CV-teksten* og et kontrollsteg med teller, maskeringslinje, feilmelding over 15 000 tegn og varsel ved 1–299 tegn.
- **Tilstand:** `src/lib/okt/tilstand.ts` har fått handlingene `cvEndret`, `cvLimtInn`, `cvForlatt` og `analyserTrykket`, og feltet `kunngjoring`. `cvStatus` ligger i `src/lib/kjerne/grenser.ts`, og `CV_KORT = 300` i `src/lib/kontrakt/grenser.ts`.
- **Live-region:** `src/components/Kunngjoring.tsx` ligger i `layout.tsx`. Den melder også når CV-teksten eller annonsen går over grensen.
- **Analyser-knappen:** `src/components/AnalyserKnapp.tsx` maskerer når knappen er aktiv og trykkes. Analysen kommer i story 1.6.
- **Tester:** Nye eller utvidede tester for alt over. `tilstand.test.ts` og `AnalyserKnapp.test.tsx`, som Sondre skrev, fikk én linje hver (`kunngjoring: null`).
- **Testresultat:** Spec-en oppgir at lint, typesjekk, tester og bygg består. Det ble ikke kjørt på nytt da denne loggen ble skrevet.

### Åpne punkter
- Avgjør med gruppen om `masker` også skal fange «010190-12345» og flere mellomrom. Disse formatene sendes umaskert i dag, og en endring krever ny FR-6 og nye tester.
- Avgjør om CV- og annonsefeltet skal ha `spellCheck={false}`, siden Chromes utvidede stavekontroll kan sende teksten til Google.
- Story 1.4 må selv vise varselet om kort tekst når en fil gir 0 tegn.
- Story 1.6 må sjekke maskeringen ved trykk på *Analyser* i Safari, der knapper ikke får fokus ved klikk.
