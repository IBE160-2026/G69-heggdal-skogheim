# Epic 1 Context: Brukeren kan forberede en analyse trygt

<!-- Compiled from planning artifacts. Edit freely. Regenerate with compile-epic-context if planning docs change. -->

## Goal

Denne epicen legger grunnmuren: en publisert app som kan startes uten API-nøkkel, og forberedelsessiden der brukeren laster opp eller limer inn CV-en, ser og retter teksten som vil bli sendt (også fra PDF med to kolonner), og limer inn annonsen. Fødselsnumre maskeres synlig, og brukeren får vite hvor teksten sendes. Uten nøkkel forklarer appen at full analyse krever nøkkel. Senere epics bygger på kodestrukturen og økt-tilstanden herfra.

## Stories

- Story 1.1: Kjørbar app i demomodus, lokalt og på Vercel
- Story 1.2: Forberedelsessiden med personvern og annonse
- Story 1.3: Lime inn CV-tekst og kontrollere den
- Story 1.4: Laste opp CV som DOCX eller TXT
- Story 1.5: Laste opp CV som PDF, også med to kolonner
- Story 1.6: Analyser med egen CV i demomodus

## Requirements & Constraints

- **Grenser:** CV-fil er PDF, DOCX eller TXT på maks 5 MB. Annonsen er 200–8 000 tegn, CV-teksten maks 15 000. Under 300 tegn CV-tekst gir advarsel om skannet eller tom fil. Ingen OCR, og tekst kuttes aldri.
- **Innlesing:** Filen forlater aldri nettleseren. Bare CV-teksten sendes, og først ved *Analyser*. DOCX og TXT skal gi `cv.txt` når mellomrom og linjeskift ikke regnes med. For testpar 4 skal alle linjene finnes uten blandede kolonner.
- **Fødselsnummer:** 11 sifre der de seks første er en gyldig dato (DDMMÅÅ). Mellom de seks første og de fem siste kan det stå ingenting, 1–3 mellomrom, eller én bindestrek eller tankestrek med høyst ett mellomrom på hver side. Tabulator og linjeskift regnes ikke som skille. Telefonnumre, årstall, kontonumre og 11 sifre uten gyldig dato maskeres ikke.
- **Personvern og lagring:** Avkrysning kreves før første analyse og gjelder hele økten. Ingenting skrives til disk, database, nettleserlagring eller cookies, og innhold logges aldri.
- **Hemmeligheter:** API-nøkkelen finnes bare som miljøvariabel på serveren. CV-filer er bare tillatt under `testdata/`.
- **Sensor:** Fra en fersk klone starter appen i demomodus med høyst tre kommandoer. README-en har Vercel-adressen. Mangler en variabel, gir det demomodus eller standardverdi, aldri krasj.
- **Plattform:** Alt kan brukes med tastatur, med synlige etiketter, ned til 320 px uten sidelengs rulling. Grensesnittet er på naturlig bokmål.

## Technical Decisions

- **Rammeverk:** Next.js App Router som React-app med tynn backend. Alt UI er klientkomponenter. Ingen Server Actions, database, innlogging eller Cache Components.
- **Versjoner:** Node 24.x, Next 16.4.4, React 19.3.1, TypeScript 5.9.x, Tailwind 4.3.4, shadcn 4.23.0 (Radix), zod 4.6.7, pdfjs-dist 6.5.438, mammoth 1.13.0, Vitest 5.1.0.
- **Lag under `src/lib/`:** `kontrakt` (skjemaer, konstanter, demotekster), `kjerne` (rene funksjoner: `masker`, `normaliser`, grenser, `erDemoeksempel`), `innlesing`, `llm`, `pipeline`, `okt`.
- **Avhengighetsretning:** UI → `okt` → `innlesing`/`kjerne` → `kontrakt`. UI kaller aldri `kjerne` direkte, men kan importere `kontrakt`. `llm` og `pipeline` er bare for serveren (`server-only`). ESLint `no-restricted-imports` håndhever grensene.
- **Økt-tilstand:** Én `useReducer`-context i `lib/okt`, endret bare med navngitte handlinger. `okt` (`bekreftetPersonvern`, `modus`, `leverandor`) varer hele økten. `innhold` har `utkast { cvTekst, annonse }` og `kjoring { id, cvTekst, annonse, erEksempel }`, satt av *Analyser* fra `utkast`.
- **Status-API:** `GET /api/status` er dynamisk og svarer `{ modus: 'ekte' | 'demo', leverandor: { navn, land, tredjeland } }`. Leverandøren er ikke valgt ennå, så personvernteksten bygges bare fra dette svaret og hardkodes aldri.
- **Innlesing:** Rene funksjoner fra `ArrayBuffer` til `string`. PDF-funksjonen får `getDocument` injisert, slik at Node-tester kan bruke legacy-builden av pdfjs. `workerSrc` settes i en klientmodul, og PDF-opplasting må bevises etter `next build`, ikke bare i dev.
- **Kolonneregel:** Finn et vertikalt mellomrom uten tekst nær midten av siden ut fra elementenes x- og y-posisjon, del i venstre og høyre kolonne, og sorter hver etter y og så x. Uten slikt mellomrom sorteres hele siden etter y og x.
- **Kanonisk tekst:** CV-teksten som brukes videre, er `masker(cvTekst)`. `masker` er idempotent, og `kjoring.cvTekst` er alltid maskert. `erDemoeksempel` sammenligner `normaliser(masker(x))`.
- **Miljø og drift:** Ingen miljøvariabel har prefikset `NEXT_PUBLIC_`. CI kjører uten nøkkel. På Vercel har bare Production nøkkelen, så forhåndsvisninger kjører i demomodus, og funksjonene ligger i én EU-region.
- **Konvensjoner:** Domeneord på norsk uten æøå og uten synonymer. Komponenter i PascalCase på norsk. Typer avledes med `z.infer`. Tester i `*.test.ts` ved siden av koden, med testnavn som starter med FR-ID.

## UX & Interaction Patterns

- **Flate:** Forberedelsen er én side uten egne ruter. Kontrollsteget er CV-panelets andre tilstand, ikke en egen side. Panelene står side om side fra 1024 px og stables under, med CV først.
- **Maskering:** Skjer ved innlesing, innliming og når feltet forlates, og det vises hvor mange som ble fjernet. Finner *Analyser* et nytt fødselsnummer, maskeres det, og brukeren må trykke igjen.
- **Felt utenfor grensene:** Samme mønster for begge felt: `aria-invalid`, `destructive` på teller og kant, og melding via `aria-describedby`. «For lang» vises med en gang, «for kort» når feltet forlates.
- ***Analyser* deaktivert:** `aria-disabled`, men kan få fokus. Alle årsakene står i en liste under knappen.
- **Visuelt og tekst:** Fargetokener, fokusring og typografi fra `DESIGN.md` legges inn i Tailwind 4 og shadcn-temaet. Eksakt ordlyd, fokustabell og live-meldinger står i `EXPERIENCE.md`. Bruk du-form og «språkmodellen», uten utropstegn og uten «vi» eller «jeg».
- **Testing:** Hver story med brukerflate testes med tastatur alene, NVDA, VoiceOver, i 320 px bredde og med 200 % tekstzoom.

## Cross-Story Dependencies

- Story 1.1 er forutsetning for alle de andre. Story 1.2 bruker `/api/status` og etablerer `lib/okt`.
- Story 1.3 leverer `masker`, kontrollsteget og advarselen om kort tekst. Story 1.4 og 1.5 mater inn i kontrollsteget, og story 1.6 bruker `masker`. Story 1.5 gjenbruker opplastingsfeltet og filfeilene fra story 1.4.
- Epic 2 håndhever lengdegrensene på serveren, så grensene legges i `lib/kjerne` nå og deles av begge sider. Story 2.2 bygger *Prøv med eksempel* på `DEMO_CV`, `DEMO_ANNONSE` og `erDemoeksempel` fra story 1.6.
- UX-spesifikasjonen gir varselet i demomodus en knapp til *Prøv med eksempel*, mens akseptansekriteriene i story 1.6 ikke nevner den, og oppførselen bygges først i story 2.2.
- Leverandøren velges ved måling i Epic 2, så alt her må tåle begge leverandørene.
