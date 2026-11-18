# Epic 2 Context: Brukeren ser ærlig hva CV-en dekker

<!-- Compiled from planning artifacts. Edit freely. Regenerate with compile-epic-context if planning docs change. -->

## Goal

Denne epicen gjør *Analyser* og *Prøv med eksempel* om til en gap-analyse. Hvert krav i annonsen får Oppfylt, Delvis oppfylt eller Mangler, og beleggene kontrolleres i kode. Mangler får ærlige råd, og treffprosenten regnes ut deterministisk. Resultatet kan redigeres, kopieres og genereres på nytt, og brukeren kan gå tilbake med *Endre CV-tekst* eller tømme alt med *Ny analyse*. Feil vises på norsk med *Prøv igjen*. Leverandøren (Mistral eller OpenAI) velges ved måling. Epicen legger pipelinen, porten mot språkmodellen, de delte formene og økt-tilstanden for genereringer, og Epic 3 og 4 bygger videre på alt dette. Høydepunktet er at brukeren ser at hun dekker mer enn hun trodde, og hvorfor.

## Stories

- Story 2.1: Kontrollert gap-analyse for demoeksempelet gjennom API-et
- Story 2.2: *Prøv med eksempel* viser gap-analysen
- Story 2.3: Ekte gap-analyse med språkmodellen
- Story 2.4: Velge leverandør ved måling
- Story 2.5: Forståelige feil uten tap av data
- Story 2.6: Redigere, kopiere og generere gap-analysen på nytt
- Story 2.7: Endre CV-tekst, gå tilbake og starte på nytt
- Story 2.8: Brukertest med medstudenter

## Requirements & Constraints

- **Krav og kategorier:** Alle krav i annonsen hentes ut, både krav og ønsker. Kategoriene er Oppfylt (direkte dekning, med belegg), Delvis oppfylt (overførbar erfaring eller egenvurdering, med belegg og én setning om hvorfor) og Mangler. Ved tvil velges den svakeste. Ingen krav får høyere kategori enn i fasiten, Mangler i fasiten er alltid Mangler, og høyst ett krav per testpar havner under fasiten.
- **Kontroll av belegg:** Hvert belegg må finnes ordrett i den maskerte CV-teksten etter normalisering. Normaliseringen gjør om til NFC og små bokstaver, og fjerner mellomrom, linjeskift, listetegn (• ▪ ‣ ◦ *), alle bindestreker og tankestreker (- ‐ – —) og anførselstegn og apostrofer (« » " “ ” „ ' ‘ ’). Et tomt normalisert belegg er ugyldig. Et belegg uten treff fjernes og returneres aldri. Er et krav Oppfylt eller Delvis oppfylt uten gyldig belegg, også med tom liste, blir det Mangler med `nedgradert: true`.
- **Råd ved Mangler:** Rådet er ærlig, for eksempel vilje til å lære eller beslektet erfaring, og ber brukeren legge erfaringen inn via kontrollsteget. Det ber aldri brukeren påstå en kvalifikasjon. Ingen resultatdel inneholder kvalifikasjoner, arbeidsgivere, årstall eller tall som ikke står i CV-teksten.
- **Nøkkelord og treffprosent:** Nøkkelordene hentes ut i samme generering, og hvert har `kravIndeks` (et krav eller `null`). Minst 80 % av fasitens nøkkelord skal være med. Matcheregel for treffprosent: små bokstaver, tegnsetting og bindestrek byttes med mellomrom (æøå beholdes), og teksten deles i ord. Et nøkkelord er funnet når hvert av ordene er starten på et ord i CV-teksten. Prosenten rundes med halve opp. Fasitene gir 22, 11, 8 og 33 %. De kjente svakhetene (*oppgjør* mot *dagsoppgjør*, *av* mot *avisbud*) dokumenteres i egne tester. Ved treffprosenten står det at den er veiledende og ikke en ATS-score.
- **Redigering:** Krav, forklaring og råd kan redigeres. Kategori, belegg, treffprosent og nøkkelord er låst. Genereringer bygger alltid på den originale `kjoring` og den uredigerte gap-analysen.
- **Inndata som ikke kan stoles på:** CV-teksten og annonsen avgrenses som data i prompten, med en instruks om å ignorere instrukser i dem. Lengdegrensene (annonse 200–8 000 tegn, CV maks 15 000) gjelder også på serveren. Svaret valideres mot skjema og vises bare som ren tekst. `testdata/robusthet/annonse-med-instruks.txt` skal gi en vanlig analyse.
- **Ytelse og kostnad:** Gap-analysen er ferdig innen 30 s for alle testparene, og brukeren ser at noe skjer innen 2 s. En full kjøring skal koste 1 kr eller mindre. Kreditten er forhåndsbetalt, uten automatisk påfylling og under 200 kr. *Prøv med eksempel* virker også når kreditten er brukt opp.
- **Personvern:** Ingen lagring og ingen IP-adresser. Logglinjene har bare metadata, og et søk etter tekst fra testpar 1 skal ikke gi treff.
- **Språk:** Svaret er på naturlig bokmål. Under overskriften i CV-panelet og i annonsepanelet står det: «Laget for CV-er og annonser på norsk. Resultatet er alltid på bokmål.»
- **Testing:** Testene kjører uten nøkkel, og demosvarene er mock. Testnavnene starter med FR-ID, for eksempel `FR-9:`.

## Technical Decisions

- **Port:** `LlmKlient.analyseGap` returnerer et rått svar som ikke er kontrollert, sammen med antall tokens. Adapterne for Mistral og OpenAI bruker AI SDK 7 `generateText` + `Output.object(skjema)` + `instructions`, med `maxRetries: 0`, `AbortSignal.timeout(45000)` og temperatur 0–0,3. Mistral bruker i tillegg `strictJsonSchema: true`. `LLM_LEVERANDOR` velger adapter (standard `mistral`), og `LLM_MODELL` velger modell. Mock-adapteren importerer `lib/llm/demo-svar/gap.json` statisk, i det rå svarformatet. Promptene ligger i `lib/llm/prompter/`. `lib/llm` og `lib/pipeline` starter med `import 'server-only'`.
- **Pipeline (`generer()` i `lib/pipeline`), i fast rekkefølge:**
  1. zod-validering av inndata og lengder
  2. `masker`, som gir kanonisk tekst
  3. `erDemoeksempel`: ja går til mock. Nei gir feil i demomodus eller med `demo: true`, og går videre til rate-limit i ekte modus.
  4. ekte adapter
  5. skjema
  6. `kontrollerKrav`
  7. treffprosent (bare for gap)
  8. én logglinje med metadata

  Treffprosenten regnes aldri i UI-et eller av språkmodellen.
- **API:** `POST /api/generer/[resultatdel]` med body `{ cvTekst, annonse, demo?, gap? }`, `maxDuration` 60 s og uten strømming. Feil sendes som HTTP-status + `{ feil: { kode } }`. Kodene er `ugyldig_inndata` 400, `for_lang_tekst` 413, `for_kort_tekst` 400, `grense_naadd` 429, `llm_feil` 502, `llm_tidsavbrudd` 504, `ugyldig_svar` 502 og `demo_krever_nokkel` 403. Enumen og statustabellen ligger i `lib/kontrakt`.
- **Delte former (`lib/kontrakt`, zod + `z.infer`):**
  - `Kategori = 'oppfylt' | 'delvis' | 'mangler'`
  - `Belegg = string`
  - `Krav { tekst, kategori, belegg[], forklaring?, raad?, nedgradert }`
  - `Nokkelord { tekst, kravIndeks: number | null, funnet }`
  - `GapAnalyse` (med `stilling` og `arbeidsgiver`)
  - `GapGrunnlag { krav: { tekst, kategori, belegg[] }[], nokkelord: { tekst, kravIndeks }[] }`, uten fritekst og med grenser for antall og lengde
  - tellerne `fjernetBelegg` og `fjernetForslag`
- **Kjerne:** `normaliser` (fra story 1.6) utvides med normaliseringen for belegg, og testene for `erDemoeksempel` må fortsatt være grønne. `kontrollerKrav` og `treffprosent` ligger bare i `lib/kjerne`.
- **Rate-limit:** én teller i minnet per serverinstans (`GRENSE_PER_MINUTT` 10, `GRENSE_PER_DOGN` 200 per UTC-døgn), som er en myk grense. Hver ekte generering telles uansett utfall, og demo telles ikke. Ingen identifikator brukes.
- **Logg:** én JSON-linje med `{ resultatdel, modus, status, varighetMs, inputTokens, outputTokens, feilkode }`. Body, tekst, prompter, svar og rå feilobjekter logges aldri.
- **Økt-tilstand (`lib/okt`):** `resultatdeler[resultatdel] = { status: venter | genererer | feil | ferdig, feilkode, generert, redigert, gapVersjon }`. Visning og kopiering bruker `redigert ?? generert`. Bare `startGenerering(resultatdel)` sender requester, med vakt mot dobbeltstart (også under StrictMode) og en `AbortController`. Requester bygges bare fra `kjoring`. Svar for en `kjoring.id` eller `gapVersjon` som ikke lenger gjelder, forkastes. *Analyser* nullstiller alle resultatdelene. Fetch-innpakningen gjør om 504, nettverksfeil og svar som ikke er JSON til `llm_tidsavbrudd` eller `llm_feil`.
- **Valg av leverandør:** `scripts/kjor-testsett.ts` (`npm run testsett`) krever nøkkel, kjører hvert testpar tre ganger og er ikke med i `npm test` eller CI. Mistral velges hvis den består SM-1, SM-2, SM-3 og NFR-5 innenfor 1 kr. Ellers velges OpenAI. Valget noteres med modell og commit i sesjonsloggen.

## UX & Interaction Patterns

- **Resultatflaten:** Toppfeltet har «Resultat» som `h1` med `tabindex="-1"`. Stilling og arbeidsgiver vises under, med skjelett til de finnes. Knappene *Endre CV-tekst* og *Ny analyse* står der, og under 640 px ligger de i en `DropdownMenu` bak «Valg». Fanene er shadcn `Tabs` med `activationMode="manual"`. Faner som ikke er bygget ennå, vises ikke.
- **Gap-fanen:** Oppsummeringen sier «Du dekker X av Y krav. Z er delvis oppfylt.» med tre kategorimerker (ikon, ord og antall) som lenker til gruppeoverskriftene. Kravkortene er gruppert Oppfylt, Delvis oppfylt, Mangler i annonsens rekkefølge, og tomme grupper skjules. Belegg-sitatet er en `figure` med «Fra CV-en» og kan ikke redigeres. Et nedgradert krav har merket «Nedgradert: fant ikke belegg i CV-en» og et fast råd fra koden. Treffmåleren står under kravene, med nøkkelordene i «Funnet i CV-en» og «Ikke funnet».
- **Lasting:** Innen 2 s vises skjelettkort med `aria-hidden` og teksten «Leser annonsen og sammenligner med CV-en …». Fanepanelet har `aria-busy`. Det pulserer ikke ved `prefers-reduced-motion`.
- **Feil:** En `Alert` med `role="alert"` står i fanen, med meldingen fra én tabell. *Prøv igjen* vises bare for `llm_feil`, `llm_tidsavbrudd` og `ugyldig_svar`, og gir fokus til fanepanelet. `grense_naadd` viser til *Prøv med eksempel*. Feil vises aldri som toast.
- **Verktøylinje:** *Kopier* og *Generer på nytt* har `aria-disabled` under generering. Kopiformatet er per krav «Krav — Kategori», «Fra CV-en: «…»», forklaring eller råd, og til slutt treff og nøkkelord. Toasten «Kopiert» står øverst på mobil.
- **Dialoger:** Alle bruker `AlertDialog` med fokus på *Avbryt*, og fokus går tilbake til knappen som åpnet dialogen. De fire er erstatte med eksempelet, generere på nytt i redigert fane, analysere på nytt med redigeringer, og *Ny analyse* («Tømme alt?»). Eksakt ordlyd står i EXPERIENCE.md.
- **Live-region** (én med `polite`): «Analyserer. Dette tar inntil 30 sekunder.», «Gap-analysen er klar. X av Y krav er oppfylt.» og «Kopiert.».
- **Fokus:** *Analyser*, *Prøv med eksempel* og *Tilbake til resultatet* gir fokus til «Resultat». *Endre CV-tekst* gir fokus til CV-tekstfeltet, og bekreftet *Ny analyse* gir fokus til opplastingsknappen.
- **Mikrotekst:** du-form, ingen utropstegn, ingen «vi» eller «jeg», «språkmodellen», og kategorinavnene nøyaktig.
- **Testing:** Hver flate testes med tastatur alene, NVDA, VoiceOver, i 320 px bredde og med 200 % tekstzoom.

## Cross-Story Dependencies

- **Story 2.1 er grunnmuren:** kontrakt, kjerne, port og mock, pipeline, rute og logg. Story 2.2–2.7 bygger på den.
- **Story 2.2** bygger `lib/okt`-genereringene og resultatflaten. Story 2.3, 2.5, 2.6 og 2.7 utvider dem.
- **Story 2.4** krever de ekte adapterne fra story 2.3.
- **Story 2.8** krever story 2.3 og 2.4 i produksjon, og resultatet kan gi endringer i prompten før Epic 3.
- **Fra Epic 1:** Epicen bruker `masker`, `normaliser`, `erDemoeksempel`, `DEMO_CV`/`DEMO_ANNONSE`, lengdegrensene i `lib/kjerne`, `utkast` og `kjoring`, `/api/status` og varselet i demomodus.
- **Til Epic 3 og 4:** De gjenbruker formene, `GapGrunnlag`, pipelinen og `startGenerering`. Fanene deres starter når gap er `ferdig`, og de merkes utdatert når `gapVersjon` øker.
- **Valgt leverandør:** Den styrer personvernteksten via `/api/status`. Vilkår, nøkkel og kreditt settes bare i Production på Vercel.
