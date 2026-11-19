# Epic 2 Context: Brukeren ser ærlig hva CV-en dekker

<!-- Compiled from planning artifacts. Edit freely. Regenerate with compile-epic-context if planning docs change. -->

## Goal

Brukeren trykker *Analyser* og får gap-analysen: hvert krav i annonsen får kategorien Oppfylt, Delvis oppfylt eller Mangler. Belegget kontrolleres i kode, Mangler får ærlige råd, og treffprosenten regnes deterministisk. Resultatet kan redigeres, kopieres og genereres på nytt. Brukeren kan gå tilbake med *Endre CV-tekst* eller tømme alt med *Ny analyse*. Feil vises på norsk med *Prøv igjen* uten at data går tapt. *Prøv med eksempel* viser demoeksempelet (testpar 1) uten nøkkel og uten kall til språkmodellen. Leverandøren (Mistral eller OpenAI) velges ved måling. Epicen leverer kjernen i produktløftet, at ingenting diktes opp, og grunnmuren (pipeline, økt-tilstand, feilformat) som brev, CV- og ATS-fanene i epic 3 og 4 bygger på.

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

- **Krav og kategorier:** Alle krav i annonsen hentes ut, både krav og ønsker. Ved tvil velges den svakeste kategorien. Ingen krav får høyere kategori enn i fasiten, og Mangler i fasiten er alltid Mangler. Delvis oppfylt har belegg og én setning om hvorfor. Mangler får et ærlig råd (vilje til å lære, beslektet erfaring, legg erfaringen inn via kontrollsteget) og foreslår aldri å påstå kvalifikasjonen.
- **Beleggkontroll (kode, ikke modell):** Belegget må stå ordrett i CV-teksten etter normalisering. Disse forskjellene regnes ikke med: store og små bokstaver, mellomrom, linjeskift, listetegn, bindestreker og tankestreker (også orddeling), og anførselstegn og apostrofer. Alle bindestreker fjernes. Belegget må følge ordgrensene og ha minst 4 tegn. Oppfylt eller Delvis oppfylt uten gyldig belegg blir Mangler med `nedgradert: true`, og belegget vises ikke. Testnavnene starter med `FR-9:`.
- **Nøkkelord og treffprosent:** Nøkkelordene hentes i samme generering, og hvert knyttes til ett krav eller ingen (`kravIndeks`). Minst 80 % av fasitens nøkkelord skal være med. Matchingen: små bokstaver, tegnsetting og bindestrek byttes med mellomrom, teksten deles i ord, og et ord i CV-teksten må begynne med nøkkelordet. Et nøkkelord med flere ord krever at alle ordene finnes. Prosenten rundes til nærmeste hele prosent. Fasitverdier: 22 %, 11 %, 8 % og 33 %. Treffprosenten er veiledende og ikke en ATS-score, og koblingen påvirker den ikke.
- **Ingen oppdiktning:** Ingen kvalifikasjoner, arbeidsgivere, årstall eller tall som ikke står i CV-teksten, med mindre de er presentert som noe brukeren mangler.
- **Redigering:** Tekstfeltene kan redigeres og står til økten avsluttes. Kategori, belegg, treffprosent og nøkkelord er låst. Nye genereringer bygger alltid på original CV-tekst og annonse, aldri på redigeringer. *Kopier* kopierer `redigert ?? generert`.
- **Ny kjøring:** Etter *Endre CV-tekst* beholdes CV-teksten og annonsen. *Analyser* erstatter alle resultatdeler, med bekreftelse hvis noe er redigert. *Ny analyse* tømmer alt etter bekreftelse, men avkrysningen for personvern gjelder fortsatt.
- **Feil:** Feilmeldingene er på norsk, sier hva som skjedde og hva brukeren kan gjøre, og ingen tekst eller redigering går tapt. Hvert feiltilfelle kan fremkalles i test uten krasj (SM-7). *Prøv igjen* vises ved feil eller tidsavbrudd. *Prøv med eksempel* virker også når kreditten er brukt opp.
- **Ytelse og kostnad:** Gap-analysen er ferdig innen 30 s, og brukeren ser at noe skjer innen 2 s. Ingen forespørsel er over 4,5 MB. Målet er 1 kr eller mindre per full kjøring. Forhåndsbetalt kreditt under 200 kr uten automatisk påfylling er det harde taket.
- **Språk og upålitelig inndata:** Svarene er på naturlig bokmål. CV-teksten og annonsen er avgrenset i prompten med instruks om å ignorere instrukser i dem (test: `testdata/robusthet/annonse-med-instruks.txt`). Svaret valideres mot skjema og vises som ren tekst.
- **Personvern:** Ingenting skrives til database, disk eller nettleserlagring. Bare metadata logges, aldri tekst, og ingen IP-adresser.
- **Leverandørvalg:** Mistral velges hvis den består SM-1 (gap), SM-2 (ingen oppdiktning i tre kjøringer per testpar), SM-3 og bokmålskravet innenfor 1 kr per kjøring. Ellers velges OpenAI. Resultatet, modellen og commit-versjonen noteres i sesjonsloggen.
- **Verdi for brukeren (SM-10):** Tre medstudenter tester med egen CV og annonsen fra par 1, og minst to skal svare ja på om de fant en relevant erfaring de ikke hadde tenkt på. Svarene noteres uten CV-tekst eller navn.

## Technical Decisions

- **Lag:** `lib/kontrakt` (zod-skjemaer, typer via `z.infer`, feilkoder, `DEMO_CV`/`DEMO_ANNONSE`), `lib/kjerne` (ren logikk: `masker`, `normaliser`, `kontrollerKrav`, `treffprosent`, grenser, `erDemoeksempel`), `lib/llm` og `lib/pipeline` (`server-only`), og `lib/okt` (klienttilstand og fetch-innpakning). Belegglogikk (FR-9), treffprosent (FR-12) og maskering (FR-6) finnes bare i `lib/kjerne`. UI kaller ikke `lib/kjerne` direkte, bare via `lib/okt`. ESLint håndhever grensene.
- **Delte former:** `Kategori = 'oppfylt'|'delvis'|'mangler'`, `Belegg = string`, `Krav { tekst, kategori, belegg[], forklaring?, raad?, nedgradert }`, `Nokkelord { tekst, kravIndeks: number|null, funnet }`, `GapAnalyse` (med `stilling`, `arbeidsgiver`), `GapGrunnlag { krav: {tekst, kategori, belegg[]}[], nokkelord: {tekst, kravIndeks}[] }` (uten fritekst, bygd fra den uredigerte gap-analysen), og tellerne `fjernetBelegg`/`fjernetForslag`. Fjernede belegg returneres aldri.
- **Port:** `LlmKlient` har metodene `analyseGap`, `skrivSoknadsbrev`, `foreslaCvForbedringer` og `foreslaAts`. Adapterne bruker `generateText` + `Output.object(skjema)` + `instructions`, `maxRetries: 0`, `AbortSignal.timeout(45000)` og temperatur 0–0,3. Mistral bruker i tillegg `strictJsonSchema: true`. `LLM_LEVERANDOR` (standard `mistral`) og `LLM_MODELL` velger adapter og modell. Mock-adapteren importerer `lib/llm/demo-svar/*.json` statisk, i det rå svarformatet. Promptene ligger i `lib/llm/prompter/`.
- **Pipeline (`generer()`, fast rekkefølge):** zod-inndata og lengder → masker (kanonisk tekst) → `erDemoeksempel`? ja: mock / nei i demomodus eller med `demo: true`: feil / nei i ekte modus: rate-limit → (`kontrollerKrav` på `GapGrunnlag` for brev/cv/ats) → adapter → zod-svar → beleggkontroll → treffprosent (bare gap) → logg. Demo og ekte modus går gjennom samme kontroller.
- **API:** `GET /api/status` (dynamisk) gir `{ modus, leverandor: { navn, land, tredjeland } }`. `POST /api/generer/[gap|brev|cv|ats]` tar body `{ cvTekst, annonse, demo?, gap? }`. Svarene strømmes ikke, og `maxDuration` er 60 s. Demo med annen tekst gir `demo_krever_nokkel` (403) i demomodus og `ugyldig_inndata` (400) når `demo: true` sendes i ekte modus.
- **Feilformat:** HTTP-status + `{ feil: { kode } }`. Kodene er `ugyldig_inndata` 400, `for_lang_tekst` 413, `for_kort_tekst` 400, `grense_naadd` 429, `llm_feil` 502, `llm_tidsavbrudd` 504, `ugyldig_svar` 502 og `demo_krever_nokkel` 403. Fetch-innpakningen i `lib/okt` gjør om 504 til `llm_tidsavbrudd`, og nettverksfeil og svar som ikke er JSON til `llm_feil`. Alle meldinger står i én tabell i UI-et. *Prøv igjen* vises bare for `llm_feil`, `llm_tidsavbrudd` og `ugyldig_svar`.
- **Rate-limit:** én teller i minnet per instans, `GRENSE_PER_MINUTT` 10 og `GRENSE_PER_DOGN` 200 (UTC). Hver ekte generering telles i steg D uansett utfall, og demo telles ikke. Ingen IP, hash eller cookies.
- **Logging:** én JSON-linje per generering: `{ resultatdel, modus, status, varighetMs, inputTokens, outputTokens, feilkode }`. Aldri body, tekst, prompt, svar eller rå feilobjekter.
- **Økt-tilstand:** én `useReducer`-context i `lib/okt`. `okt` (`bekreftetPersonvern`, `modus`, `leverandor`) varer hele økten. `innhold` (`utkast`, `kjoring { id, cvTekst (maskert), annonse, erEksempel }`, `resultatdeler[del] { status: venter|genererer|feil|ferdig, feilkode, generert, redigert, gapVersjon }`, `gapVersjon`, `demoVarsel`) tømmes av *Ny analyse*. Bare `startGenerering(resultatdel)` sender requester, med vakt mot dobbeltstart (også i StrictMode) og en `AbortController`. Svar for en `kjoring.id` eller `gapVersjon` som ikke lenger gjelder, forkastes. Ingen nettleserlagring.
- **Kanonisk tekst:** `masker` er idempotent. Klienten lagrer bare maskert tekst i `kjoring`, og serveren maskerer på nytt i begge modi. `erDemoeksempel` sammenligner `normaliser(masker(x))`.
- **Testsett:** `scripts/kjor-testsett.ts` (`npm run testsett`) krever nøkkel og kjører alle fire testparene tre ganger. Rapporten viser kategorier, nøkkelord, treffprosent, tokens og kostnad. Skriptet er ikke med i `npm test` eller CI.
- **Konvensjoner:** Vitest i `*.test.ts` ved siden av koden, med FR-ID i testnavnet. Testene kjører uten nøkkel med mock. Domeneord på norsk uten æøå (`krav`, `belegg`, `nokkelord`, `kjoring`, `resultatdel`). Komponenter i PascalCase på norsk. Aldri `dangerouslySetInnerHTML`.

## UX & Interaction Patterns

- **Resultatflaten:** Toppfeltet har «Resultat» som `h1` (`tabindex="-1"`), stilling og arbeidsgiver (skjelett til de finnes), og *Endre CV-tekst* og *Ny analyse* (under 640 px i `DropdownMenu` bak «Valg»). shadcn `Tabs` med `activationMode="manual"` og fulle navn. Faner som ikke er bygget ennå, vises ikke. Fanemerket viser en spinner (`aria-hidden`) med skjult tekst «, genereres», og «· redigert» etter redigering.
- **Gap-fanen:** Oppsummeringen «Du dekker X av Y krav. Z er delvis oppfylt.» har tre kategorimerker (ikon, ord og antall) som lenker til gruppeoverskriftene. Kravkortene grupperes Oppfylt, Delvis oppfylt, Mangler i annonsens rekkefølge, og tomme grupper skjules. Feltene «Krav», «Hvorfor delvis» og «Råd» kan redigeres og har etiketter. Belegg-sitatet er `figure` med `figcaption` «Fra CV-en» og «» i teksten, og er låst. Nedgraderte krav har merket «Nedgradert: fant ikke belegg i CV-en» og det faste rådet fra koden. Treffmåleren står under kravene med «veiledende treff, ikke en ATS-score», og nøkkelordene står i listene «Funnet i CV-en» og «Ikke funnet».
- **Lasting:** «Leser annonsen og sammenligner med CV-en …» innen 2 s, skjelettkort med `aria-hidden` og `aria-busy` på fanepanelet. Ingen pulsering ved `prefers-reduced-motion`.
- **Feil i fane:** `Alert` med `role="alert"` og meldingen fra tabellen. Feil vises aldri som toast. *Prøv igjen* gir fokus til fanepanelet (`tabindex="-1"`). `grense_naadd` har ingen *Prøv igjen*, men viser til *Prøv med eksempel*. Eksempel på melding: «Språkmodellen svarte ikke. Teksten din er tatt vare på. Prøv igjen.»
- **Verktøylinje:** *Kopier* (primær) og *Generer på nytt*, begge med `aria-disabled` under generering. Kopiformatet for gap: per krav «Krav — Kategori», «Fra CV-en: «…»» og forklaring eller råd, til slutt «Treff: 22 % (veiledende)» og nøkkelordene. Toasten «Kopiert» står øverst på mobil, og feil gir «Kunne ikke kopiere. Merk teksten og kopier selv.».
- **Dialoger (`AlertDialog`, fokus på *Avbryt*, fokus tilbake til knappen som åpnet):** «Lage nytt {fanenavn}? …» (*Lag ny*), «Starte en ny analyse? Alle resultatdelene erstattes. Redigeringene dine i {faner} blir overskrevet.» (*Analyser på nytt*), «Tømme alt? …» (*Tøm alt*) og «Erstatte teksten din med eksempelet? …» (*Bruk eksempelet*).
- **Fokus etter handling:** *Analyser* og *Tilbake til resultatet* gir fokus til «Resultat». *Endre CV-tekst* gir fokus til CV-tekstfeltet. Bekreftet *Ny analyse* gir fokus til opplastingsknappen. Når en fane er ferdig, flyttes ikke fokus.
- **Live-region (én `aria-live="polite"`):** «Analyserer. Dette tar inntil 30 sekunder.», «Gap-analysen er klar. X av Y krav er oppfylt.», «Kopiert.» og meldingen om utdatert fane.
- **Tilbake fra resultatet:** *Tilbake til resultatet* vises bare når teksten er uendret. Ellers står «Du har endret teksten. Trykk *Analyser* for en ny analyse.».
- **Merknad om språk** under overskriften i begge panelene: «Laget for CV-er og annonser på norsk. Resultatet er alltid på bokmål.»
- **Mikrotekst:** du-form, ingen utropstegn, ingen «vi» eller «jeg», kategorinavnene nøyaktig, og «språkmodellen» (ikke «KI-en»). Hver story med brukerflate testes med tastatur, NVDA, VoiceOver, i 320 px bredde og med 200 % tekstzoom.

## Cross-Story Dependencies

- 2.1 definerer kontrakt, kjerne, port og mock, pipeline og API-feilformat. Alle andre stories bygger på den.
- 2.2 innfører økt-tilstanden (`kjoring`, `resultatdeler`, `startGenerering`) og resultatflaten. 2.3, 2.5, 2.6 og 2.7 utvider dem.
- 2.3 (ekte adaptere og prompt) må være ferdig før 2.4 (måling). 2.8 krever 2.3 og 2.4 med valgt leverandør i produksjon, og skal skje før epic 3.
- Bygger på epic 1: forberedelsessiden, kontrollsteget, `masker`, grenser, `normaliser` og `erDemoeksempel` fra story 1.6 (`normaliser` utvides i 2.1), og `demoVarsel`.
- Epic 3 og 4 gjenbruker pipelinen, `GapGrunnlag`, feiltabellen, verktøylinjen, dialogene og utdatert-mekanismen (`gapVersjon`) herfra.
