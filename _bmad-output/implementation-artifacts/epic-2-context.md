# Epic 2 Context: Brukeren ser ærlig hva CV-en dekker

<!-- Compiled from planning artifacts. Edit freely. Regenerate with compile-epic-context if planning docs change. -->

## Goal

Brukeren trykker *Analyser* og får en gap-analyse der hvert annonsekrav er Oppfylt, Delvis oppfylt eller Mangler, med belegg som er kontrollert i kode mot CV-teksten, ærlige råd og en treffprosent regnet i kode. Resultatet kan redigeres, kopieres og genereres på nytt. Brukeren kan gå tilbake med *Endre CV-tekst* eller starte på nytt med *Ny analyse*, og feil vises på norsk med *Prøv igjen*. *Prøv med eksempel* viser demoeksempelets gap-analyse uten nøkkel, og leverandøren av språkmodellen velges ved måling. Epicen er kjernen i produktet: appen skal aldri påstå at brukeren har kvalifikasjoner CV-en ikke dokumenterer.

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

- **Krav og kategorier:** alle annonsekrav (krav og ønsker) hentes ut. Hvert får én kategori. Oppfylt har belegg, Delvis oppfylt har belegg og én setning om hvorfor, Mangler har et ærlig råd (vilje til å lære, beslektet erfaring, legg erfaringen inn via kontrollsteget) og aldri et råd om å påstå kvalifikasjonen. Ved tvil velges svakeste kategori.
- **Beleggkontroll i kode:** hvert belegg må finnes i CV-teksten etter normalisering (små bokstaver, uten mellomrom, linjeskift, listetegn, alle bindestreker og tankestreker, anførselstegn og apostrofer). Normalisert belegg må ha minst 4 tegn og begynne og slutte på ordgrenser i CV-teksten. Oppfylt eller Delvis oppfylt uten gyldig belegg blir Mangler med `nedgradert: true` og et fast råd fra koden, og ugyldige belegg vises ikke.
- **Nøkkelord og treffprosent:** nøkkelord hentes ut i samme generering, hvert med `kravIndeks` (ett krav eller `null`). Koblingen påvirker ikke treffprosenten. Treffprosenten er deterministisk (prefiks-match per ord, alle ord må finnes for flerordsnøkkelord, avrundet heltall) og skal gi 22 %, 11 %, 8 % og 33 % for de fire fasitene. Ved tallet står det at det er veiledende og ikke en ATS-score.
- **Ingen oppdiktning:** ingen kvalifikasjoner, arbeidsgivere, årstall eller tall som ikke står i CV-teksten, med mindre det presenteres som noe brukeren mangler.
- **Redigering:** tekstfeltene kan redigeres og står ut økten. Kategori, belegg, treffprosent og nøkkelord er låst. Nye genereringer bygger alltid på den originale (maskerte) CV-teksten og annonsen.
- **Ny generering:** én resultatdel kan genereres på nytt, med bekreftelse hvis den er redigert. Ny gap-analyse merker andre resultatdeler «basert på forrige analyse».
- **Feil (FR-22):** norske meldinger som sier hva som skjedde og hva brukeren kan gjøre, uten tap av tekst eller redigeringer. Hvert tilfelle må kunne fremkalles i test, og appen krasjer ikke.
- **Demo:** demoeksempelet (testpar 1) bruker lagrede svar uten kall til språkmodellen, også med nøkkel og når kreditten er brukt opp.
- **Personvern:** ingenting lagres på disk, database eller nettleserlagring. Bare metadata logges, aldri tekst, og ingen IP-adresser.
- **Ytelse og kostnad:** gap-analysen ferdig innen 30 s, synlig aktivitet innen 2 s, ingen forespørsel over 4,5 MB. Mål om 1 kr eller mindre per kjøring. Forhåndsbetalt kreditt under 200 kr er det harde taket, og telleren i minnet er en myk grense.
- **Språk:** naturlig bokmål i både UI og modellsvar. Verktøyet er laget for norske CV-er og annonser, men avviser ikke andre språk.
- **Upålitelig inndata:** CV-tekst og annonse avgrenses i prompten med instruks om å ignorere instrukser i dem. Lengdegrenser håndheves på serveren, svar valideres mot skjema, og innhold vises som ren tekst.
- **Testbarhet:** enhetstester for beleggkontroll og treffprosent (testnavn med FR-prefiks), demosvarene er mock, og testene kjører uten nøkkel.
- **Brukertest:** minst to av tre medstudenter skal svare ja på «Fant du en erfaring du ikke hadde tenkt på som relevant?», før epic 3.

## Technical Decisions

- **Lag:** `lib/kontrakt` (zod-skjemaer og avledede typer, feilkoder, `DEMO_CV`/`DEMO_ANNONSE`), `lib/kjerne` (rene funksjoner som `normaliser`, `kontrollerKrav`, `treffprosent`), `lib/llm` og `lib/pipeline` (begge `server-only`), `lib/okt` (klienttilstand). All UI er klientkomponenter. Ingen Server Actions. ESLint håndhever avhengighetsretningen.
- **Delte former:** `Kategori`, `Belegg`, `Krav` (med `nedgradert`), `Nokkelord` (`tekst`, `kravIndeks: number | null`, `funnet`), `GapAnalyse` (med `stilling`, `arbeidsgiver`), `GapGrunnlag`, `fjernetBelegg`, `fjernetForslag`.
- **Port:** `LlmKlient` med `analyseGap` (og senere brev, CV og ATS). Mistral- og OpenAI-adaptere bruker AI SDK `generateText` med `Output.object`, `maxRetries: 0`, tidsgrense 45 s, temperatur 0–0,3, Mistral med `strictJsonSchema`. Valgt med `LLM_LEVERANDOR` og `LLM_MODELL`. Mock-adapteren importerer `lib/llm/demo-svar/*.json` statisk. Prompter ligger i `lib/llm/prompter/`.
- **Pipeline:** inndata → maskering (kanonisk tekst, idempotent `masker`) → `erDemoeksempel` → rate-limit → adapter → skjema → beleggkontroll → treffprosent → logg.
- **API:** `POST /api/generer/[gap|brev|cv|ats]` med body `{ cvTekst, annonse, demo?, gap? }`, `maxDuration` 60 s, ingen strømming. `GET /api/status` gir modus og leverandør. Annen CV enn demo gir `demo_krever_nokkel` i demomodus og `ugyldig_inndata` med `demo: true` i ekte modus.
- **Feilkoder:** svar `{ feil: { kode } }` med `ugyldig_inndata` 400, `for_lang_tekst` 413, `for_kort_tekst` 400, `grense_naadd` 429, `llm_feil` 502, `llm_tidsavbrudd` 504, `ugyldig_svar` 502, `demo_krever_nokkel` 403. En fetch-innpakning mapper 504, nettverksfeil og svar som ikke er JSON. Én meldingstabell i UI-et. *Prøv igjen* bare for `llm_feil`, `llm_tidsavbrudd` og `ugyldig_svar`.
- **Rate-limit:** teller i minnet per instans, `GRENSE_PER_MINUTT` 10 og `GRENSE_PER_DOGN` 200. Hver ekte generering telles uansett utfall, demo telles ikke, ingen identifikator.
- **Logging:** én JSON-linje per generering med bare `resultatdel`, `modus`, `status`, `varighetMs`, `inputTokens`, `outputTokens`, `feilkode`.
- **Økt-tilstand:** én `useReducer`-context delt i `okt` (bl.a. `bekreftetPersonvern`) og `innhold` (`utkast`, `kjoring`, `resultatdeler` med `status`, `feilkode`, `generert`, `redigert`, `gapVersjon`). Visning og kopiering bruker `redigert ?? generert`. Bare `startGenerering` sender requester, med vakt mot dobbeltstart (også StrictMode) og `AbortController`. Svar for en utdatert `kjoring.id` eller `gapVersjon` forkastes. Klienten lagrer bare maskert tekst.
- **Leverandørvalg:** `scripts/kjor-testsett.ts` (`npm run testsett`, krever nøkkel, ikke i CI) kjører alle testparene tre ganger. Mistral velges hvis den består gap-kvalitet, ingen oppdiktning, beleggkrav og bokmål innenfor 1 kr per kjøring. Ellers OpenAI. Resultat, modell og commit noteres i sesjonsloggen. I produksjon: vilkår sjekket (ingen trening på API-data, databehandleravtale), nøkkel bare i Production på Vercel, kreditt uten automatisk påfylling.

## UX & Interaction Patterns

- **Resultatsiden:** «Resultat» som `h1` (`tabindex="-1"`), stilling og arbeidsgiver fra gap (skjelett til de finnes), *Endre CV-tekst* og *Ny analyse*, under 640 px bak «Valg» i `DropdownMenu`.
- **Faner:** shadcn `Tabs` med `activationMode="manual"`, fanemerke med skjult spinnertekst «, genereres» og «· redigert». Faner for resultatdeler som ikke er bygget, vises ikke.
- **Gap-fanen:** oppsummeringen «Du dekker X av Y krav. Z er delvis oppfylt.» med tre kategorimerker som lenker til gruppeoverskriftene. Kravkort med venstrekant i kategorifargen, gruppert Oppfylt, Delvis oppfylt, Mangler i annonsens rekkefølge, tomme grupper skjult. Belegg som `figure`/`figcaption` med «Fra CV-en» og «», ikke redigerbart. Nedgradert krav har merket «Nedgradert: fant ikke belegg i CV-en». Treffmåler med «veiledende treff, ikke en ATS-score» og nøkkelordbrikker i «Funnet i CV-en» og «Ikke funnet».
- **Lasting:** «Leser annonsen og sammenligner med CV-en …» innen 2 s, skjelettkort `aria-hidden`, `aria-busy` på fanepanelet, ingen puls ved `prefers-reduced-motion`.
- **Verktøylinje:** *Kopier* og *Generer på nytt*, begge `aria-disabled` under generering. Kopiformatet følger EXPERIENCE.md. Toast «Kopiert» (eller «Kunne ikke kopiere. Merk teksten og kopier selv.»), øverst på mobil, aldri med knapper.
- **Feil:** `Alert` med `role="alert"` i fanen, aldri toast. *Prøv igjen* gir fokus til fanepanelet. `grense_naadd` viser til *Prøv med eksempel* uten *Prøv igjen*.
- **Dialoger:** shadcn `AlertDialog`, fokus på *Avbryt* ved åpning og tilbake til utløserknappen. Ordlyden står i EXPERIENCE.md (generer på nytt, ny analyse med redigerte faner, *Ny analyse* «Tømme alt?», *Prøv med eksempel* når feltene har innhold).
- **Tilbake og nytt:** *Endre CV-tekst* beholder utkastet og fokuserer CV-feltet. *Tilbake til resultatet* vises bare når teksten er uendret, ellers linjen «Du har endret teksten …». *Ny analyse* tømmer innholdet, beholder avkrysningen og fokuserer opplastingsknappen.
- **Live-region:** én `aria-live="polite"` for hele appen med meldingene fra tabellen i EXPERIENCE.md. Fokus etter handling følger tabellen i EXPERIENCE.md.
- **Mikrotekst:** du-form, ingen utropstegn, ingen «vi» eller «jeg», kategorinavnene nøyaktig, «språkmodellen». Merknaden «Laget for CV-er og annonser på norsk. Resultatet er alltid på bokmål.» står under overskriften i begge panelene og skal også inn i EXPERIENCE.md.
- **Tilgjengelighet:** hver story med brukerflate testes med tastatur alene, NVDA, VoiceOver, 320 px og 200 % tekstzoom.

## Cross-Story Dependencies

- Epic 1 leverer forberedelsessiden, innlesing, kontrollsteget, maskering, demomodus og `normaliser`/`erDemoeksempel` (story 1.6). Story 2.1 utvider `normaliser`, og testene for `erDemoeksempel` må fortsatt være grønne.
- 2.1 (kontrakt, kjerne, mock, API-rute, logging) er grunnlaget for alle andre stories i epicen.
- 2.2 innfører økt-tilstanden og resultatsiden som 2.3, 2.5, 2.6 og 2.7 bygger på.
- 2.3 (ekte adaptere og prompt) må være ferdig før 2.4 (måling). 2.8 krever 2.3 og 2.4 i produksjon og skal gjøres før epic 3.
- Epic 3 og 4 bruker den uredigerte gap-analysen (kategorier og `kravIndeks`) som `GapGrunnlag`, og gjenbruker beleggkontrollen, verktøylinjen, feilvisningen og utdatert-banneret fra denne epicen.
