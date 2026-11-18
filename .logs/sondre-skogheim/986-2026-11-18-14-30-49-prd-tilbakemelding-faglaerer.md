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
- PRD-endringene er ikke committet (bare denne loggen).

### Åpne punkter
- Kevin går gjennom PRD-endringene fra 2026-11-18 og bekrefter `[ANTAKELSE]` i FR-9 om at alle bindestreker fjernes.
- `epics.md` må oppdateres etter PRD-endringene: FR-9 med AC i story 2.1, og FR-11 og FR-17. `normaliser` i `lib/kjerne` utvides i story 2.1.
- Brukertesten i SM-10 (tre medstudenter) gjøres før innlevering, helst før søknadsbrevet bygges.
