---
type: review
lens: reconcile-prd
target: ARCHITECTURE-SPINE.md
sources: [prd.md, addendum.md]
date: 2026-11-03
---

# Avstemming: arkitekturspine mot PRD

**Vurdering:** Spinen dekker PRD-en godt i hovedtrekk: port og adapter, én pipeline, beleggkontroll og treffprosent i kode, ett feilformat, rate-limit uten IP-adresser og logging av bare metadata. Men slik spinen står nå, kan ikke FR-5 (leverandør og land) oppfylles. FR-19 («basert på forrige analyse») og FR-25/FR-26 (hva som regnes som demoeksempelet) kan to enheter bygge ulikt. I tillegg finnes det tekniske hull som kan velte NFR-6 og demomodus i produksjon. **F1–F3 bør rettes før stories lages. F4–F7 kan rettes i samme runde.**

Bare funn der to enheter kan gjøre ulike valg, eller der et krav motsies eller ikke kan nås, er tatt med. Detaljer på story-nivå er utelatt.

---

## F1 [high] FR-5 og §6: UI-et kan ikke vite leverandør og land

- **PRD:** FR-5 sier at informasjonsteksten oppgir leverandør og land. §6 sier at overføring til et tredjeland (OpenAI, USA) skal stå tydelig.
- **Spine:** AD-11 henter leverandør og land fra «én konstant i `lib/kontrakt` som følger `LLM_LEVERANDOR`». Etter AD-12 har `LLM_LEVERANDOR` ikke prefikset `NEXT_PUBLIC_`, så variabelen finnes bare på serveren. AD-1 gjør hele UI-et til klientkomponenter, og `GET /api/status` svarer bare `{ modus }`.
- **Konsekvens:** Klientkoden i `lib/kontrakt` kan ikke lese `LLM_LEVERANDOR`. Den som bygger UI-et, må enten hardkode leverandøren eller lage en egen kanal. Da kan teksten si Mistral (EU) mens appen sender til OpenAI (USA). Det er akkurat det AD-11 skal hindre.
- **Løsning:** Utvid `/api/status` til `{ modus, leverandor: { navn, land, tredjeland: boolean } }`. Serveren slår opp svaret i konstanten i `lib/kontrakt`, og FR-5-teksten bygges bare fra dette svaret. Bestem også hva som vises i demomodus (den konfigurerte leverandøren, eller «ingen data sendes i demomodus»), og hvilken leverandør som er standard når `LLM_LEVERANDOR` ikke er satt (se F7).

## F2 [high] FR-19: merkingen «basert på forrige analyse» utløses ikke når gap-analysen genereres på nytt

- **PRD:** FR-19 sier at de andre resultatdelene merkes «basert på forrige analyse» når gap-analysen genereres på nytt. Etter §3 er det en ny generering, ikke en ny kjøring. En ny kjøring (*Analyser* på nytt, FR-3) erstatter derimot alle resultatdelene.
- **Spine:** AD-6 har `kjoringId` og en `gapKjoringId` per resultatdel. En resultatdel er utdatert når `gapKjoringId` «ikke er den nyeste». Spinen sier ikke hva den sammenlignes med, eller hvilken handling som endrer verdien.
- **Konsekvens:** Navnet og ordlisten tilsier at `kjoringId` bare endres ved *Analyser*. Da endres den ikke når gap-analysen genereres på nytt, og ingenting blir merket. FR-19 brytes uten at noen ser det. Reduceren og fane-komponenten kan også bygges med ulik tolkning, og FR-3 kan feilaktig gi merking i stedet for tømming.
- **Løsning:** Innfør en egen `gapVersjon` som økes **hver gang gap-analysen genereres**, både ved *Analyser* og ved FR-19. Brevet, CV-forbedringene og ATS-forslagene lagrer `gapVersjon` fra gap-analysen de bygger på. En resultatdel er utdatert når `del.gapVersjon !== okt.gapVersjon`. *Analyser* er en ny kjøring og tømmer brevet, CV-forbedringene og ATS-forslagene i stedet for å merke dem. Skriv reglene som handlinger i reduceren (`ANALYSE_STARTET`, `GAP_GENERERT`, `DEL_GENERERT`), så det bare finnes én tolkning.

## F3 [high] FR-25 og FR-26: «demoeksempelet» er ikke definert, og `demo: true` kan sendes med en egen CV

- **PRD:** Etter FR-26 går en egen CV i demomodus bare gjennom kontrollsteget. Når brukeren trykker *Analyser*, forklarer appen at full analyse krever en API-nøkkel, og tilbyr demoeksempelet. Etter FR-25 finnes *Prøv med eksempel* også når nøkkelen er satt. I UJ-3 kan sensor redigere teksten.
- **Spine:** Etter AD-5 svarer ruten `demo_krever_nokkel` når modusen er `demo` og «teksten ikke [er] demoeksempelet». Spinen sier ikke hvordan dette avgjøres: eksakt tekst, normalisert tekst, hash eller bare annonsen. I ekte modus kan `demo: true` sendes med hvilken som helst CV-tekst, og da gir mock-adapteren Idas svar for en annen CV.
- **Konsekvens:**
  - UI-et og ruten kan avgjøre ulikt hva som er demoeksempelet. Endrer brukeren ett tegn i demo-CV-en i kontrollsteget, kan UI-et si ja mens ruten sier nei.
  - Sendes `demo: true` med en egen CV i ekte modus, nedgraderer beleggkontrollen alle krav til **Mangler**, og treffprosenten regnes mot nøkkelordene fra feil annonse. Brukeren ser et resultat som ser ekte ut, men er feil.
  - Redigerer brukeren demo-CV-en, kan beleggene i de lagrede svarene slutte å treffe.
- **Løsning:** Legg én ren funksjon `erDemoeksempel(cvTekst, annonse)` i `lib/kjerne`, for eksempel som normalisert likhet med `testdata/par-1-butikk-bank/cv.txt` og `annonse.txt`. UI-et bruker den til å vise FR-26-meldingen uten å kalle serveren, og ruten bruker den samme funksjonen. Mock-adapteren brukes **bare** når `erDemoeksempel` er sann. Ellers svarer ruten `demo_krever_nokkel` i demomodus og `ugyldig_inndata` når `demo: true` er sendt i ekte modus. Bestem også om demoeksempelet er låst i kontrollsteget, eller om det slutter å være demoeksempelet når brukeren redigerer det.

## F4 [medium] FR-6 mot FR-9 og FR-12: hvilken CV-tekst gjelder, den maskerte eller originalen?

- **PRD:** Etter FR-6 vises maskeringen i kontrollsteget, så brukeren ser hva som sendes. FR-9 kontrollerer belegg mot CV-teksten, og FR-12 regner treffprosenten mot CV-teksten.
- **Spine:** I AD-4 maskeres teksten på serveren (steg F), og bare i ekte modus. Kartet sier at maskeringen skjer i både klient og server. AD-6 kaller `cvTekst` «originalen etter kontrollsteget». Spinen sier ikke om `cvTekst` er maskert, eller om beleggkontrollen (steg I) og treffprosenten (steg J) bruker den maskerte eller den umaskerte teksten.
- **Konsekvens:** Språkmodellen ser `[fødselsnummer fjernet]`. Et belegg som siterer den linjen, gir ikke treff mot den umaskerte teksten, og kravet nedgraderes feilaktig. Klienten og pipelinen kan også vise ulik tekst.
- **Løsning:** Bestem at teksten maskeres i klienten med `lib/kjerne` når brukeren går videre fra kontrollsteget, så `okt.cvTekst` alltid er maskert. Serveren maskerer på nytt, og det skal ikke endre noe. Beleggkontrollen og treffprosenten bruker alltid den maskerte teksten som ble sendt. Skriv dette inn i AD-4 og AD-6.

## F5 [medium] NFR-4 og FR-22: ingen felles tidsgrense for `llm_tidsavbrudd`

- **PRD:** Etter NFR-4 er gap-analysen ferdig innen 30 sekunder, og brukeren ser at noe skjer innen 2 sekunder. Etter FR-22 gir et tidsavbrudd en melding og *Prøv igjen*.
- **Spine:** Den eneste tiden i spinen er `maxDuration` på 60 sekunder. Spinen har ingen tidsgrense for kallet til språkmodellen, og sier ikke hvem som avbryter kallet: `fetch` i klienten eller adapteren på serveren.
- **Konsekvens:** Klienten kan avbryte etter for eksempel 30 sekunder mens serveren fortsetter. Kallet koster da penger og telles i rate-limiten, men brukeren ser bare en generell feil. Uten en tidsgrense under 60 sekunder stopper Vercel funksjonen, og klienten får en 504 uten `{ feil: { kode } }`. Det bryter AD-8.
- **Løsning:** Legg en konstant `LLM_TIDSGRENSE_MS` (for eksempel 45 000) i `lib/kontrakt`. Adapteren bruker den med `AbortSignal.timeout` og gjør avbrudd om til `llm_tidsavbrudd`. `maxDuration` settes høyere enn grensen. Klienten avbryter ikke selv før grensen pluss en margin, og den gjør nettverksfeil og svar som ikke er JSON, om til `llm_feil`. Lastetilstanden vises med en gang (kravet om 2 sekunder).

## F6 [medium] NFR-6: `import 'server-only'` stopper Vitest, og demosvarene finnes ikke

- **PRD:** Etter NFR-6 kjører testene uten API-nøkkel, og én automatisk test kjører hele flyten for demoeksempelet med mock-klienten. De lagrede demosvarene brukes også som mock.
- **Spine:** Etter AD-2 starter `lib/llm` og `lib/pipeline` med `import 'server-only'`. Etter Utsatt-listen skal flyttesten skrives i Vitest. Kildetreet sier at `testdata/` «finnes allerede: … demo-svar».
- **Konsekvens:**
  - `server-only` kaster en feil når pakken importeres uten betingelsen `react-server`, og det gjelder i Vitest. Flyttesten og testene av pipelinen feiler da allerede ved import.
  - `testdata/par-1-butikk-bank/demo-svar/` finnes **ikke** i repoet. Spinen sier heller ikke hvilket format svarene skal ha. De bør ha det rå svarformatet fra språkmodellen (zod-skjemaet), fra før beleggkontrollen. Ellers kontrolleres ikke demomodus og ekte modus likt (AD-4).
  - Mock-adapteren leser filer fra `testdata/` mens appen kjører. Vercel tar ikke med filer som ligger utenfor importgrafen, i funksjonen. Da feiler *Prøv med eksempel* i produksjon og i forhåndsvisninger.
- **Løsning:**
  - Sett `resolve.alias: { 'server-only': <tom modul> }` i `vitest.config`, eller bruk betingelsen `react-server`.
  - Rett kildetreet, siden demosvarene ikke er laget ennå. Lag én JSON-fil per resultatdel, i det rå svarformatet fra `lib/kontrakt`, og en test som validerer filene mot skjemaet.
  - La mock-adapteren importere JSON-filene statisk (`import gap from '.../demo-svar/gap.json'`) i stedet for å lese dem med `fs`. Alternativet er `outputFileTracingIncludes`.

## F7 [low] NFR-7 og AD-12: hva er standard når `.env` mangler?

- **PRD:** Etter NFR-7 kan appen startes i demomodus fra en fersk klone med høyst tre kommandoer (`git clone`, `npm install`, `npm run dev`).
- **Spine:** Modusen er `demo` når «nøkkelen for den valgte leverandøren mangler». Spinen sier ikke hva som skjer når `LLM_LEVERANDOR` og `LLM_MODELL` ikke er satt, og det er de ikke hos sensor.
- **Konsekvens:** Én utvikler kan la appen kaste en feil når konfigurasjonen mangler eller er ugyldig, mens en annen lar den falle tilbake til demomodus. Kaster appen en feil, brytes NFR-7.
- **Løsning:** Skriv i AD-12: mangler `LLM_LEVERANDOR` eller nøkkelen, eller er verdien ugyldig, er modusen `demo`. Appen starter alltid, også uten miljøvariabler. Demomodus trenger ingen `.env`.

## F8 [low] NFR-1: feilobjekter kan lekke innhold til loggen

- **PRD:** Etter NFR-1 skrives CV-tekst, annonse, prompter og resultater aldri til logger.
- **Spine:** AD-10 bestemmer innholdet i logglinjen, men sier ingenting om unntak. Feil fra AI SDK (for eksempel `NoObjectGeneratedError`) og fra zod kan inneholde svarteksten eller deler av inndataene. Et `console.error(err)` eller et unntak som ikke fanges, havner i loggen hos Vercel.
- **Løsning:** Legg til i AD-10: rutene fanger alle unntak og gjør dem om til en `feilkode`. Rå feilobjekter, `err.message` og `err.cause` logges aldri. Testen i NFR-1 (søk i loggen etter tekst fra testparene) kjøres også for tilfellet `ugyldig_svar`.

## F9 [low] FR-18 og FR-20: formen på `redigert` er ikke bestemt for gap-analysen

- **PRD:** Etter FR-18 er kategorier, belegg, treffprosent og nøkkelord låst, og annen tekst (forklaring og råd per krav) kan redigeres. Etter FR-20 kopierer knappen innholdet slik det står etter redigering.
- **Spine:** AD-6 beskriver `redigert` som «brukerens tekst», som om det er én streng per resultatdel.
- **Konsekvens:** I gap-analysen er de redigerbare feltene per krav. Fane-komponenten og kopieringsfunksjonen kan da velge ulik form (én streng eller et kart per krav), og kopien kan miste de låste feltene.
- **Løsning:** Bestem formen. For gap-analysen er `redigert` en `Record<kravIndeks, { forklaring?, raad? }>` som legges over `generert`. For brevet, CV-forbedringene og ATS-forslagene er det teksten eller ett felt per forslag. Én funksjon per resultatdel i `lib/okt` lager teksten som kopieres.

## F10 [low] Sporingskartet mangler NFR-5, NFR-8 og NFR-10

`binds` lover NFR-1..NFR-10, men kartet har ingen rad for NFR-5 (språk), NFR-8 (tastatur, skjermleser, 360 px bredde, fire nettlesere) eller NFR-10 (sporbarhet). For NFR-8 bør én beslutning stå i spinen: fanene bruker `Tabs` fra shadcn/Radix, slik at tastatur og ARIA blir riktig, og ingen lager egne faner. Legg til de tre radene. NFR-8 kan vise til konvensjonen for UI-komponenter og til DESIGN.md.

---

## Sjekket uten funn

- FR-18, regelen om original CV-tekst og uredigert gap-analyse, er dekket. I AD-5 er `gap` den uredigerte gap-analysen fra pipelinen, og etter AD-6 bygges requester aldri fra `redigert`.
- FR-4 og NFR-9: lengdegrensene sjekkes både i klienten og i ruten. Svarene valideres med zod og vises bare som ren tekst.
- FR-9 og FR-15–FR-17: beleggkontrollen gjelder alle resultatdelene i én pipeline, og krav uten belegg går til **Mangler**, slik gruppen avklarte 2026-10-30.
- FR-12 og FR-24: treffprosenten regnes ut i pipelinen i begge modi.
- NFR-1 og NFR-3: ingen IP-adresser, en global teller i minnet og forbruksgrensen hos leverandøren som hardt tak. Dette samsvarer med avklaringen 2026-10-30.
- NFR-2: ingen variabler med `NEXT_PUBLIC_`, og nøkkelen finnes bare i Production.
- NFR-4, grensen på 4,5 MB: bare tekst sendes, og tekstene er på høyst 15 000 og 8 000 tegn.
- §7.1, én tone: API-et har ingen parameter for tone, og det er riktig.
- FR-17, regelen om at nøkkelord bare foreslås for krav som er **Oppfylt** eller **Delvis oppfylt**, håndheves i prompten. Gap-skjemaet kobler ikke nøkkelord til krav, så regelen kan ikke kontrolleres i kode. PRD-en krever ikke det, så dette er ikke et funn, men gruppen bør vite om det.
