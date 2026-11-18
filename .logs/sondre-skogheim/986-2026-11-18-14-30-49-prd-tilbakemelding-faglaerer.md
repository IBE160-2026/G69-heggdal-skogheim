# PRD oppdatert etter faglærers tilbakemelding

## 2026-11-18 kl. 14:30 — Sondre Skogheim

### Oppgave
Sondre spurte først hva som var gjort og hva som var neste steg. Deretter ba han om å oppdatere PRD-en etter `tilbakemelding-prd.md` med `bmad-prd` (Update). Punktene 4.1, 4.2, 4.4, 4.5 og de mekaniske funnene i §5 skulle tas nå. Fra 4.3 skulle SM-10 og regelen for SM-2 legges inn. Alle endringer skulle logges i memloggen. Før §10.1 (leverandør) og NFR-3 (kostnadstak) ble endret, skulle Claude spørre og vise alternativene med fordeler og ulemper.

### Plan
- Lese PRD, memlogg og addendum, og sjekke kollisjoner med arkitekturen (AD-9, AD-11, AD-14) og `normaliser` på Kevins gren for story 1.6.
- Spørre Sondre om §10.1, NFR-3, konflikten mellom 4.2 og AD-14, og hvordan engelsk tekst skal behandles.
- Logge beslutningene, skrive om PRD-en, oppdatere addendum og sjekklisten, og deretter kjøre en lett Finalize.

### Resultat
- **Sondres valg:** §10.1 skal peke på AD-11, og PRD-en sier at en EU-leverandør foretrekkes. NFR-3 skal ha forhåndsbetalt kreditt som hardt tak og telleren i minnet som myk grense. FR-11 knytter hvert nøkkelord til ett annonsekrav eller ingen, som i AD-14. Faglærers «minst ett» ble forkastet. Tekst på engelsk godtas med en merknad.
- **`prd.md`:**
  - **FR-9:** normaliseringen tåler listetegn, bindestreker, anførselstegn og orddeling, og det er lagt til nye enhetstester, blant annet med tekst fra par 4.
  - **FR-11, FR-17 og FR-18:** nøkkelordene er koblet til annonsekrav, og par 3 skal verken få «Tripletex» eller «Visma».
  - **Suksessmål:** ny SM-10 og en regel for ny kjøring i SM-2.
  - **Ordlisten:** skiller nå mellom annonsekrav og PRD-krav, og har fått gap-analyse og tvilsregelen. «Analyse» og «fane» er avgrenset.
  - **Mekaniske funn:** FR-2 er formulert som dataminimering, og FR-4 har fått en merknad om språk.
  - **§6, §10.1 og NFR-3:** følger Sondres valg.
  - **Ny risiko i §9:** riktige belegg kan bli avvist.
  - **§11 og §12:** §11 er nå en ren liste over beslutninger som gjelder. Den nye §12 er en endringslogg. Merkene `[bekreftet antakelse]` er fjernet, og `updated` er satt til 2026-11-18.
- **`addendum.md`:** ny D0 med normaliseringen og begrunnelsen for bindestrekene. Skjemaet i C har fått `kravIndeks`, og E har fått de forkastede alternativene for taket.
- **`testdata/sjekkliste.md`:** nytt punkt for FR-17.
- **`.memlog.md`:** 19 nye oppføringer. Den gjelder også FR-6-endringen fra 2026-11-09, som ble registrert i ettertid.
- **Finalize:** Konsistenssjekken med grep gikk gjennom uten funn. Det ble ikke kjørt en ny rubrikkrunde, og det er ingen eksterne overleveringer.
- PRD-endringene er committet lokalt i 49b6b40. Push til `main` ble stoppet av sikkerhetsregelen i Claude Code, så Sondre pusher selv.
- **Senere samme dag, `bmad-correct-course` (batch, godkjent av Sondre):** [sprint-change-proposal-2026-11-18.md](../../_bmad-output/planning-artifacts/sprint-change-proposal-2026-11-18.md).
  - **`epics.md`:** kravoversikten for FR-2, FR-4, FR-9, FR-11, FR-17, FR-18, FR-26 og NFR-3 er oppdatert. Det er nye AC-er i story 2.1 (normaliser og FR-9-tester, `kravIndeks` i `gap.json`), 2.3 (nøkkelord knyttet til krav, og merknad om språk), 2.5 (kreditt brukt opp), 4.2 (`kravIndeks: null` og par 3) og 5.1 (regelen i SM-2). Ny story 2.8 *Brukertest med medstudenter* (SM-10) står før epic 3.
  - **`sprint-status.yaml`:** `2-8-brukertest-med-medstudenter: backlog`.
  - **Arkitekturen:** ingen endring, fordi AD-9, AD-11 og AD-14 stemmer allerede.
  - Committet lokalt i d0cd1c1.

- **Push:** Sondre pushet `main` selv fra VS Code-terminalen (auto-modus blokkerte `git push` fra Claude, selv med regelen `Bash(git push:*)` i `.claude/settings.local.json`).
- **Kodegjennomgang av story 1.5** (`bmad-code-review`, fire parallelle agenter, diff `main...origin/story-1.5-…`). Resultat: 0 som trenger beslutning, 1 rettelse, 2 utsatt, 13 avvist. Ingenting stopper flettingen.
  - **Rettelse:** grenen der linjer som fjernes nederst på siden legges tilbake i kolonnene (`tilbake` i `finnOppdeling`), er ikke testet. Sondre valgte at Kevin legger inn testen, og fikk en ferdig beskjed han kan sende.
  - **Utsatt:** begge sto allerede i `deferred-work.md`. Det ene er at en CV med én kolonne og datokolonne kan bli lest som to kolonner (middels, ikke bekreftet). Det andre er at de manuelle testene med NVDA, VoiceOver i Safari og worker-fila etter `next build` ikke er gjort.
  - **Funnene er ikke skrevet i story-fila,** fordi den bare finnes på Kevins gren. Det er ikke committet noe på grenen hans.

### Åpne punkter
- Kevin legger inn en test for linjer som fjernes nederst på siden i `finnOppdeling` (story 1.5) og oppdaterer designnotatene i spec-1-5 til regelen fra runde 2.
- Før story 1.5 flettes, tester Sondre to ting etter `npm run build && npm start`: PDF-en fra par 4, og en CV med én kolonne og datoer til venstre.
- Kevin går gjennom PRD-endringene fra 2026-11-18 og bekrefter `[ANTAKELSE]` i FR-9 om at alle bindestreker fjernes.
- Brukertesten i SM-10 (tre medstudenter) gjøres i story 2.8, før epic 3.
- Merknaden om språk («Laget for CV-er og annonser på norsk …») legges inn i EXPERIENCE.md når story 2.3 bygges.
