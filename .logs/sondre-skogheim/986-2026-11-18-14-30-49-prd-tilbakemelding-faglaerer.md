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

- **Sondres test av story 1.5** etter `npm run build` og `npm start`: PDF-en fra par 4 leses kolonne for kolonne, og `ida-test.pdf` (par 1 lagret som PDF fra Word, én kolonne) har datoene på samme linje som stillingene. Begge er bestått. Det bekrefter også at PDF-workeren virker etter bygget. Next.js tilbød 16.4.4 → 16.4.6 (sikkerhet), men Sondre hoppet over det for ikke å endre Kevins gren. `npm ci` meldte 23 sårbarheter (15 high).
- **Kodegjennomgang av story 1.6** med fire agenter, på diffen fra tuppen av 1.5 til 1.6: 0 som trenger beslutning, 1 rettelse, 3 utsatt og 14 avvist. Ingen AC-er er brutt.
  - **Rettelse:** test for at `statusHentet` med `demo` beholder `demoVarsel`. Den tar Kevin.
  - **Utsatt:**
    - Turbopack-regelen for `?raw` (demotekstene) er ikke verifisert automatisk i bygget.
    - I Safari kan blur maskere fødselsnummeret før klikket, så det første trykket viser varselet med en gang.
    - Dokumentene var ute av takt med koden. Det er rettet på `main`: AD-6 har fått `demoVarsel`, og `epics.md` sier at `kjoring` kommer i epic 2. Endringen er logget i arkitekturens memlogg.

- **CI på story 1.5** feilet på `findByLabelText("CV-tekst")`, som venter 1 s, fordi pdfjs ble lastet kaldt på en treg GitHub-maskin. Lokalt, i en egen arbeidsmappe på `b0f27f9`, besto alle 393 testene, og den første PDF-testen brukte 260 ms. Kevin rettet det i #7 (4bc9953): pdfjs og workeren lastes nå i `beforeAll`.
- **Story 1.5 er flettet** (PR #6 og #7, flettet av Sondre). Kevin rettet også testen for bunnteksten, designnotatene og statusen i spec-1-5 (319764d). Sprint-status på `main` sier `1-5: review` til NVDA og VoiceOver er testet.
- **Kommentar fra gjennomgangen av 1.5** er lagt på PR #6 med `gh`: https://github.com/IBE160-2026/G69-heggdal-skogheim/pull/6#issuecomment-6982292680. GitHub CLI finnes i `C:\Program Files\GitHub CLI\gh.exe`, men ikke i PATH.
- **Det finnes ingen PR for 1.6 ennå.** Utkastet til kommentaren ligger i [vedlegg/pr-kommentar-story-1-6.md](vedlegg/pr-kommentar-story-1-6.md) og legges på PR-en når Kevin åpner den.
- **IP-adresser i Vercel:** sjekket i story 1.1 (2026-11-04, se 990). Det var ingen IP i Runtime Logs eller i den synlige delen av Request Logs. Nederste del av panelet, CDN Requests og Firewall var ikke sjekket. **Sjekket på nytt 2026-11-18 av Sondre:** detaljpanelet for `/api/status` viser forespørsels-ID, sti, vert, User Agent, Referer, mottaksregion (`sfo1`), Firewall «Allowed», rutet til `arn1`, funksjonskall og deploy-informasjon, men ingen IP-adresse. Det gjelder også i Firewall-raden og nederst i panelet. Personvernteksten (FR-5) trenger derfor ikke nevne IP-logging fra Vercel. Story 5.2 kontrollerer dette på nytt før innlevering.

- **Story 1.6 er flettet** (PR #8, flettet av Sondre, med `main` flettet inn i 767b2d7). CI er grønn på `main`. Testen for `statusHentet` med `demo` var ikke med. Kommentaren fra gjennomgangen, oppdatert med denne statusen, er lagt på [PR #8](https://github.com/IBE160-2026/G69-heggdal-skogheim/pull/8#issuecomment-6982523841). Sondre testet ikke 1.6 manuelt før flettingen. Sprint-status: 1.5 og 1.6 står i `review`.

### Åpne punkter
- Testen for at `statusHentet` med `demo` beholder `demoVarsel` mangler fortsatt (1.6). Den kan tas i story 2.1 eller som en egen liten PR.
- Sondre tester story 1.6 på `main` etter `next build`: egen CV gir varsel, demoteksten fra par 1 limt inn gir ikke varsel (`?raw`-regelen), og fødselsnummer med to trykk. Gjør gjerne fødselsnummertesten i Safari også.
- Next.js 16.4.4 → 16.4.6 (sikkerhetsoppdatering) og ny vurdering av `npm audit` (23 sårbarheter, 15 high) på en egen gren etter at 1.5 og 1.6 er flettet.
- Kevin legger inn en test for linjer som fjernes nederst på siden i `finnOppdeling` (story 1.5) og oppdaterer designnotatene i spec-1-5 til regelen fra runde 2.
- Før story 1.5 flettes, tester Sondre to ting etter `npm run build && npm start`: PDF-en fra par 4, og en CV med én kolonne og datoer til venstre.
- Kevin går gjennom PRD-endringene fra 2026-11-18 og bekrefter `[ANTAKELSE]` i FR-9 om at alle bindestreker fjernes.
- Brukertesten i SM-10 (tre medstudenter) gjøres i story 2.8, før epic 3.
- Merknaden om språk («Laget for CV-er og annonser på norsk …») legges inn i EXPERIENCE.md når story 2.3 bygges.
