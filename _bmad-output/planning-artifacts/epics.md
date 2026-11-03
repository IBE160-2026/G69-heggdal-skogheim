---
stepsCompleted: [step-01-validate-prerequisites, step-02-design-epics, step-03-create-stories, step-04-final-validation]
inputDocuments:
  - _bmad-output/planning-artifacts/prds/prd-G69-heggdal-skogheim-2026-10-29/prd.md
  - _bmad-output/planning-artifacts/prds/prd-G69-heggdal-skogheim-2026-10-29/addendum.md
  - _bmad-output/planning-artifacts/architecture/architecture-G69-heggdal-skogheim-2026-11-03/ARCHITECTURE-SPINE.md
  - _bmad-output/planning-artifacts/ux-designs/ux-G69-heggdal-skogheim-2026-10-30/DESIGN.md
  - _bmad-output/planning-artifacts/ux-designs/ux-G69-heggdal-skogheim-2026-10-30/EXPERIENCE.md
  - _bmad-output/planning-artifacts/ux-designs/ux-G69-heggdal-skogheim-2026-10-30/review-rubric.md
  - _bmad-output/planning-artifacts/ux-designs/ux-G69-heggdal-skogheim-2026-10-30/review-tilgjengelighet.md
  - testdata/sjekkliste.md
  - testdata/*/fasit.md
---

# G69-heggdal-skogheim (AI CV & Job Application Assistant) – epics og stories

## Oversikt

Dette dokumentet deler kravene i PRD-en, UX-spesifikasjonen (DESIGN.md og EXPERIENCE.md) og arkitekturspinen inn i epics og stories som kan implementeres. Ordene i PRD §3 brukes uten synonymer. Hver story viser til FR-, NFR-, AD- og UX-DR-ID-ene den realiserer (NFR-10).

## Kravoversikt

### Funksjonelle krav

FR-1: Brukeren kan laste opp en CV-fil (PDF, DOCX eller TXT) på maks 5 MB. Andre formater og større filer avvises før innlesing, med en norsk melding om tillatte formater og størrelse. Brukeren kan i stedet lime CV-teksten inn i kontrollsteget.
FR-2: Systemet leser ut CV-teksten. Ved to kolonner leses hver kolonne ferdig før neste. For par 4 finnes alle linjene i `cv.txt`, ingen linje blander kolonner, og «SPRÅK» og «KURS» kommer før «PROFIL». DOCX og TXT gir `cv.txt` (mellomrom og linjeskift regnes ikke med). Bare CV-teksten sendes til serveren, og først når brukeren trykker *Analyser*.
FR-3: Kontrollsteg: CV-teksten vises i et redigerbart felt, og analysen bruker teksten slik den står da. Under 300 tegn vises en advarsel om skannet eller tom fil, med forslag om å lime inn teksten. Ingen OCR. Etter en analyse kan brukeren gå tilbake med *Endre CV-tekst*, og CV-teksten og annonsen beholdes. *Analyser* starter en ny kjøring som erstatter alle resultatdelene, med en advarsel og bekreftelse hvis noe er redigert.
FR-4: Annonsen limes inn i et tekstfelt. Annonsen må være 200–8 000 tegn og CV-teksten maks 15 000 tegn. Utenfor grensene vises en norsk melding, og *Analyser* er deaktivert. Grensene håndheves også på serveren.
FR-5: Informasjon om personvern over feltene: CV-teksten sendes til en ekstern språkmodell (leverandør og land), ingenting lagres etter økten, og brukeren bør fjerne fødselsnummer, adresse, bilde og helseopplysninger. Brukeren må krysse av før første analyse i økten, og avkrysningen gjelder resten av økten.
FR-6: Fødselsnumre (11 sifre, eventuelt med mellomrom etter de seks første, der de seks første er en gyldig dato DDMMÅÅ) erstattes med `[fødselsnummer fjernet]` før sending, og det vises i kontrollsteget. Enhetstest: «01019012345» og «010190 12345» maskeres. Telefonnumre, årstall, kontonumre og «12345678903» maskeres ikke.
FR-7: Systemet henter ut alle krav i annonsen, både krav og ønsker, og viser dem i en liste. Hvert krav i fasiten er med (vurderes manuelt med sjekklisten).
FR-8: Hvert krav får én kategori: **Oppfylt** (direkte dekning, belegg vises), **Delvis oppfylt** (overførbar erfaring eller egenvurdering, belegg og én setning om hvorfor) eller **Mangler** (ikke dokumentert i CV-teksten). Ved tvil velges den svakeste. Ingen krav over fasit, Mangler i fasiten er alltid Mangler, og høyst ett krav per testpar ligger under fasiten.
FR-9: Hvert belegg kontrolleres ordrett mot CV-teksten (store og små bokstaver, mellomrom og linjeskift regnes ikke med). Mangler belegget, blir kravet **Mangler** og merkes «nedgradert: fant ikke belegg i CV-en», og belegget vises ikke. Enhetstester: belegg som finnes, belegg som er omskrevet (avvises), belegg med andre linjeskift (godtas), og Oppfylt og Delvis oppfylt uten belegg blir Mangler.
FR-10: Hvert krav med **Mangler** får et ærlig råd, for eksempel vilje til å lære eller beslektet erfaring, og råd om å legge erfaringen inn i CV-teksten via kontrollsteget. Ingen råd foreslår å påstå kvalifikasjonen.
FR-11: Systemet henter ut nøkkelordene fra annonsen. Minst 80 % av de forventede nøkkelordene i fasiten er med.
FR-12: Treffprosenten regnes ut deterministisk. Matcheregel: små bokstaver, tegnsetting og bindestrek byttes med mellomrom, teksten deles i ord, og et nøkkelord er funnet når et ord i CV-teksten begynner med det. Et nøkkelord med flere ord er funnet når alle ordene finnes. Prosenten er antall funnet delt på antall nøkkelord, rundet til nærmeste hele prosent. Enhetstester gir treffprosenten i hver fasit (22 %, 11 %, 8 %, 33 %). Prosenten som vises, er lik den koden regner ut.
FR-13: Ved treffprosenten står det at den er veiledende og ikke en ATS-score, og at nøkkelord bare bør legges til når CV-en har dekning for dem.
FR-14: Søknadsbrev på bokmål, 250–400 ord. Det nevner minst tre krav og minst to erfaringer, har riktig stilling og arbeidsgiver, og har plassholdere for navn og kontaktinformasjon. Det er ikke generisk og ikke KI-aktig: sammenhengende tekst uten punktlister og uten tomme fraser.
FR-15: Brevet presenterer bare Oppfylt og Delvis oppfylt som kvalifikasjoner. Mangler kan bare nevnes som motivasjon for å lære. Listen «Bygger på» viser beleggene, som kontrolleres som i FR-9, og belegg uten treff fjernes og merkes. Ingen forbudte påstander i kjøringene i SM-2.
FR-16: CV-forbedringer: konkrete forslag til omformulering, rekkefølge eller presisering. Hvert forslag har belegg som kontrolleres som i FR-9, og én setning om hvorfor, knyttet til et krav eller nøkkelord. Ingenting nytt legges til.
FR-17: ATS-forslag om format, overskrifter og ordvalg. Et nøkkelord som ikke er funnet, foreslås bare når det hører til et krav med Oppfylt eller Delvis oppfylt. Hvert forslag er konkret og har én setning om hvorfor.
FR-18: All tekst i resultatdelene kan redigeres, og endringene står til økten avsluttes. Fanene er uavhengige, og treffprosenten endres ikke av redigering. Kategorier, belegg, treffprosent og nøkkelord er låst. Genereringer bygger på den originale CV-teksten (etter kontrollsteget) og annonsen, og brev, CV og ATS bruker i tillegg den uredigerte gap-analysen.
FR-19: Brukeren kan generere én resultatdel på nytt. Er den redigert, kommer en advarsel og bekreftelse, og andre faner berøres ikke. Genereres gap-analysen på nytt, merkes de andre resultatdelene «basert på forrige analyse», med tilbud om å generere dem på nytt.
FR-20: Hver resultatdel har en *Kopier*-knapp som kopierer innholdet slik det står etter redigering.
FR-21: *Ny analyse* tømmer CV-teksten, annonsen og alle resultatdelene etter bekreftelse. Økten fortsetter, og avkrysningen i FR-5 gjelder fortsatt.
FR-22: Norske feilmeldinger som sier hva som skjedde og hva brukeren kan gjøre, uten tap av CV-tekst, annonse eller redigeringer. Tilfellene er fil som ikke kan leses, stor fil eller feil format, for lang eller kort tekst, feil eller tidsavbrudd fra språkmodellen, nådd grense og ugyldig svar. Hvert tilfelle kan fremkalles i test, appen krasjer ikke, og ved feil eller tidsavbrudd vises *Prøv igjen*.
FR-23: Mangler API-nøkkelen, starter appen i demomodus med et banner.
FR-24: I demomodus vises alle fire resultatdelene for demoeksempelet fra lagrede svar. Treffprosenten regnes i kode, og redigering og kopiering virker. Ny generering viser det lagrede svaret uten kall til språkmodellen.
FR-25: *Prøv med eksempel* finnes også med nøkkel og bruker de lagrede svarene uten kall til språkmodellen.
FR-26: Egen CV i demomodus: innlesing og kontrollsteg virker. *Analyser* forklarer at full analyse krever nøkkel, og tilbyr demoeksempelet.
FR-27: Ingen resultatdel inneholder kvalifikasjoner, ferdigheter, utdanning, arbeidsgivere, årstall eller tall som ikke står i CV-teksten, med mindre de er presentert som noe brukeren mangler eller kan lære.

### Ikke-funksjonelle krav

NFR-1 Personvern og lagring: Ingenting fra økten skrives til database, disk eller nettleserlagring. CV-tekst, annonse, prompter og resultater logges ikke, bare metadata. Ingen IP-adresser eller hash av dem. Test: kodegjennomgang og søk i loggen etter tekst fra testparene.
NFR-2 Hemmeligheter: API-nøkkelen finnes bare som miljøvariabel på serveren. Repoet har `.env.example` og bare fiktive testdata. Nøkkelen finnes ikke i bundle eller Git-historikk. CV-filer er bare tillatt under `testdata/`.
NFR-3 Kostnad og misbruk: En full kjøring er fire genereringer, og nye genereringer telles. Mål: 1 kr eller mindre per kjøring. Forbruksgrense hos leverandøren (semesterbudsjett 200 kr) er det harde taket. Rate-limit i minnet og dagstak uten IP. Når en grense er nådd, gjelder FR-22.
NFR-4 Ytelse: Gap-analysen er ferdig innen 30 s for alle testpar. Brukeren ser at noe skjer innen 2 s. Ingen forespørsel er over 4,5 MB.
NFR-5 Språk: Grensesnitt og innhold fra språkmodellen er på naturlig bokmål, uten svenske eller danske ord og uten direkte oversatt engelsk.
NFR-6 Testbarhet: Alle prompter og kall ligger i én modul, og demosvarene er mock i testene. Enhetstester for FR-6, FR-9 og FR-12. Automatiske uttrekkstester for par 1 (DOCX) og par 4 (PDF). Én flyttest for demoeksempelet med mock. Testene kjører uten nøkkel.
NFR-7 Kjørbarhet for sensor: Fra en fersk klone starter appen i demomodus med høyst tre kommandoer etter README-en, og README-en har den publiserte Vercel-adressen.
NFR-8 Tilgjengelighet og plattform: Oppdaterte versjoner av Chrome, Firefox, Edge og Safari, på PC og mobil ned til 360 px (UX: 320 px). Alt kan brukes med tastatur, felt har synlige etiketter, og fanene er tilgjengelige for skjermlesere.
NFR-9 Upålitelig inndata: CV-teksten og annonsen er avgrenset i promptene, med en instruks om å ignorere instrukser i dem. Lengdegrenser og bruksgrenser gjelder på serveren. Svaret valideres mot skjema, og ugyldig svar gir FR-22. Innhold vises som ren tekst. Test: `robusthet/annonse-med-instruks.txt` og et direkte kall med for lang tekst.
NFR-10 Sporbarhet og KI-styring: Stories viser til FR og NFR. Tester og commits viser til story eller FR. Beslutninger logges i memlogg og sesjonslogg. Hver kjøring av testsettet noteres med commit-versjon.

### Tilleggskrav fra arkitekturen

- **Starter (epic 1, story 1, AD-15):** `npx create-next-app@16.4.4 app-tmp --ts --app --src-dir --tailwind --eslint --import-alias "@/*" --use-npm --disable-git --no-react-compiler --no-cache-components --no-agents-md` kjøres i en midlertidig mappe og flyttes inn i rotmappa. Deretter kjøres `npx shadcn@4.23.0 init -t next -b radix`. TypeScript låses til 5.9.x, `@types/node` til `^24`, og `engines.node` er `24.x`.
- **Stack (spinen):** Next.js 16.4.4, React 19.3.1, Tailwind 4.3.4, AI SDK 7, `@ai-sdk/mistral`, `@ai-sdk/openai`, zod 4, pdfjs-dist 6.5, mammoth 1.13, Vitest 5. Node 24 LTS må være installert.
- **Lag og grenser (AD-1, AD-2):** Klientkomponenter for alt UI. Ingen Server Actions og ingen Cache Components. Mappene er `lib/kontrakt`, `lib/kjerne`, `lib/innlesing`, `lib/llm`, `lib/pipeline` og `lib/okt`. `server-only` i `lib/llm` og `lib/pipeline`. ESLint `no-restricted-imports` håndhever avhengighetsretningen.
- **Port for språkmodellen (AD-3):** `LlmKlient` har metodene `analyseGap`, `skrivSoknadsbrev`, `foreslaCvForbedringer` og `foreslaAts`. Adaptere for Mistral og OpenAI bruker `generateText` og `Output.object`, med `maxRetries: 0`, tidsgrense 45 s, temperatur 0–0,3 og Mistral `strictJsonSchema`. Mock-adapteren importerer `lib/llm/demo-svar/*.json` statisk. Prompter ligger i `lib/llm/prompter/`, med avgrenset data.
- **Pipeline (AD-4):** inndata → maskering (kanonisk tekst) → `erDemoeksempel` → rate-limit → `kontrollerKrav` på `GapGrunnlag` → adapter → skjema → beleggkontroll → treffprosent (gap) → logg.
- **API (AD-5):** `GET /api/status` (dynamisk) gir `{ modus, leverandor: { navn, land, tredjeland } }`. `POST /api/generer/[gap|brev|cv|ats]` tar body `{ cvTekst, annonse, demo?, gap?: GapGrunnlag }`. `maxDuration` er 60 s, og svar strømmes ikke.
- **Økt-tilstand (AD-6):** én `useReducer`-context i `lib/okt`, delt i `okt` og `innhold` (`utkast`, `kjoring`, `resultatdeler` med `status`, `feilkode`, `generert`, `redigert`, `gapVersjon`). Bare `startGenerering` sender requester, med vakt mot dobbeltstart og AbortController. Svar fra en eldre kjøring forkastes. Ingen nettleserlagring.
- **Innlesing (AD-7):** rene funksjoner fra ArrayBuffer til string. `getDocument` injiseres, `workerSrc` settes i en klientmodul, og Node-tester bruker legacy-builden. PDF-opplasting må bevises etter `next build`.
- **Feil (AD-8):** `{ feil: { kode } }` med åtte koder og HTTP-status i `lib/kontrakt`. En fetch-innpakning mapper 504, nettverksfeil og svar som ikke er JSON. Én meldingstabell i UI-et. *Prøv igjen* for `llm_feil`, `llm_tidsavbrudd` og `ugyldig_svar`.
- **Rate-limit (AD-9):** teller per instans, `GRENSE_PER_MINUTT` 10 og `GRENSE_PER_DOGN` 200, telt i steg D uansett utfall. Demo telles ikke. Forhåndsbetalt kreditt hos leverandøren under 200 kr.
- **Logging (AD-10):** én JSON-linje per generering med bare metadata. Aldri body, tekst eller rå feilobjekter.
- **Valg av leverandør (AD-11):** `scripts/kjor-testsett.ts` (`npm run testsett`, krever nøkkel) kjører alle testparene mot Mistral og OpenAI. Mistral velges hvis den består SM-1, SM-2, SM-3 og NFR-5 innenfor 1 kr. Resultatet noteres i sesjonsloggen.
- **Miljø og CI (AD-12):** Miljøvariablene er `MISTRAL_API_KEY`, `OPENAI_API_KEY`, `LLM_LEVERANDOR`, `LLM_MODELL`, `GRENSE_PER_MINUTT` og `GRENSE_PER_DOGN`. Repoet har `.env.example`. `.gitignore` blokkerer `*.pdf` og `*.docx` utenfor `testdata/`, og `.gitattributes` setter `testdata/** text eol=lf`. GitHub Actions kjører `npm ci`, lint, `tsc --noEmit` og `vitest run` uten nøkkel. `server-only` er aliasert i Vitest. På Vercel har bare Production nøkkelen, Preview kjører i demomodus, og `vercel.json` setter én EU-region.
- **Kanonisk tekst (AD-13):** `masker` er idempotent. Klienten lagrer bare maskert tekst i `kjoring`, og serveren maskerer på nytt i begge modi.
- **Delte former (AD-14):** `Kategori`, `Belegg`, `Krav` (med `nedgradert`), `Nokkelord` (`kravIndeks`, `funnet`), `fjernetBelegg` og `fjernetForslag`, og `kontrollerKrav` defineres før første generering.
- **Demoeksempel:** `DEMO_CV` og `DEMO_ANNONSE` (testpar 1) i `lib/kontrakt`. `erDemoeksempel` sammenligner `normaliser(masker(x))`.
- **Publisering:** Vercel-prosjektet importeres i første story med kjørbar app. EU-regionen er `fra1` eller `arn1`. Sjekk om plattformloggene viser IP-adresser.

### UX-designkrav

UX-DR1: Fargetokenene fra DESIGN.md legges inn i Tailwind 4 og shadcn-temaet (`@theme`): primary, primary-soft, background, muted-foreground, input, ring, destructive, oppfylt, delvis, mangler (med -bg) og belegg (med -bg). Fokusringen er 2 px heltrukken med 2 px avstand og erstatter shadcn-standarden. Typografirollene er page-title, section-title, letter, hit-rate og label, med Geist Sans. Spacing er content-max 960 og letter-max 680. Kontrast: alle tekstpar AA, kanter og fokusring minst 3:1. Ingen tekst med redusert opasitet.
UX-DR2: To flater uten egne ruter: Forberedelse og Resultat. `<html lang="nb">`. Én `h1` per flate, `h2` for personvern, CV-panel, annonsepanel, kategorigrupper, treffmåler og *Bygger på*, og `h3` for kravtekst. Landemerkene er `header` og `main`. DOM-rekkefølgen er lik den visuelle, uten `order` eller `row-reverse`.
UX-DR3: Personvernboks (shadcn `Alert` med `ShieldCheck`) som alltid er synlig og ikke kan lukkes. Teksten bygges fra `leverandor` i `/api/status`, med setningen om overføring ut av EØS bare når `tredjeland` er sann.
UX-DR4: Opplastingsfelt: en `<button>` «Velg CV-fil» som åpner en skjult `<input type="file" accept=".pdf,.docx,.txt">`, med dra og slipp som tillegg. *Lim inn CV-teksten* og *Bytt fil* er knapper med `variant="link"`. En feil om format eller størrelse har `role="alert"` og `aria-describedby` på opplastingsknappen, og fokus blir stående. Tilstanden «Leser CV-en …» vises under innlesing.
UX-DR5: CV-panelets tilstand 2 (kontrollsteget): overskriften «Kontroller CV-teksten», et felt med etiketten «CV-tekst», filnavn og *Bytt fil*, og en tegnteller (maks 15 000). Fødselsnumre maskeres ved innlesing, innliming og når feltet forlates, og en linje sier hvor mange som ble fjernet. Finner *Analyser* et nytt fødselsnummer, maskeres det, og brukeren må trykke igjen. Under 300 tegn vises en `Alert` med `TriangleAlert`.
UX-DR6: Annonsefelt med etiketten «Annonse», hjelpeteksten «Lim inn hele annonsen» og en tegnteller (200–8 000). Tilstanden «utenfor grensene»: `aria-invalid`, teller og kant i `destructive`, og en melding med `aria-describedby`. «For kort» vises når feltet forlates, «for lang» med en gang. Teksten kuttes ikke. Tellerne er ikke live-regioner.
UX-DR7: Avkrysning for personvern med teksten «Jeg har lest informasjonen om personvern.» Etter første avkrysning erstattes den av teksten «Du har bekreftet at du har lest informasjonen om personvern.» med ikon (ikke en `disabled` avkrysning). Den gjelder også etter *Ny analyse*.
UX-DR8: Knappen *Analyser* får `aria-disabled` når vilkårene ikke er oppfylt, men kan fortsatt få fokus. Alle årsakene står i en liste under knappen, knyttet med `aria-describedby`, i rekkefølgen CV-tekst, annonse, avkrysning. Knappen *Tilbake til resultatet* vises bare når det finnes resultater og teksten er uendret. Ellers står linjen «Du har endret teksten …».
UX-DR9: Resultatsidens toppfelt: «Resultat» som `h1` (`tabindex="-1"`), stilling og arbeidsgiver fra gap (skjelett til de finnes), og *Endre CV-tekst* og *Ny analyse*. Under 640 px ligger de to knappene i `DropdownMenu` bak «Valg».
UX-DR10: Faner: shadcn `Tabs` med `activationMode="manual"`, fulle navn i fast rekkefølge, og to linjer under 640 px. Fanemerket viser en spinner (`aria-hidden`) med skjult tekst «, genereres», og «· redigert» etter redigering. Fanene for brev, CV og ATS viser «Venter på gap-analysen …», eller ved feil i gap-analysen en lenke til den fanen.
UX-DR11: Verktøylinje per fane med *Kopier* (primær) og *Generer på nytt*. Begge har `aria-disabled` under generering. Kopiformatet per fane følger EXPERIENCE.md. En toast «Kopiert» bekrefter kopiering. Feiler kopieringen, vises en toast «Kunne ikke kopiere. Merk teksten og kopier selv.». Toasts står øverst på mobil og har aldri knapper.
UX-DR12: Gap-fanen, oppsummering: «Du dekker X av Y krav. Z er delvis oppfylt.» og tre kategorimerker med ikon, ord og antall. Merkene lenker til gruppeoverskriftene (`tabindex="-1"`).
UX-DR13: Kravkort (`requirement-card` med venstrekant i kategorifargen), gruppert Oppfylt, Delvis oppfylt, Mangler i annonsens rekkefølge. Tomme grupper skjules, men oppsummeringen viser 0. Feltene «Krav», «Hvorfor delvis» og «Råd» kan redigeres og har etiketter. Kategori og belegg er låst. Et nedgradert krav har merket «Nedgradert: fant ikke belegg i CV-en» (`Info`) og et fast råd fra koden.
UX-DR14: Belegg-sitat (`belegg-quote`): etiketten «Fra CV-en» er knyttet til sitatet med `figure`/`figcaption`, og «» står i teksten. Sitatet kan ikke redigeres.
UX-DR15: Treffmåler: tallet i hit-rate-stil, teksten «veiledende treff, ikke en ATS-score» (FR-13) og en dekorativ linje med `aria-hidden`. Nøkkelordene står i listene «Funnet i CV-en» (brikke med `Check`) og «Ikke funnet» (stiplet brikke med kant i `input`). Brikkene er ikke interaktive og brytes over linjer.
UX-DR16: Søknadsbrev: `textarea` med brevskrift, etiketten «Søknadsbrev» og en ordteller (mål 250–400, plassholdere telles ikke). Linjen «Fyll inn før du sender: …» viser plassholderne brevet faktisk har. *Bygger på* er en liste av belegg-sitater med linjen «N belegg ble fjernet …» når det gjelder. Er alle beleggene fjernet, vises bare den linjen.
UX-DR17: Forslagskort for CV-forbedringer og ATS-forslag: «Gjelder» (låst belegg eller låst overskrift eller nøkkelord), og «Forslag» og «Hvorfor» som redigerbare felt med etiketter. Tom tilstand ved null forslag: «Ingen forslag til {fanenavn} for denne annonsen.» Tom tilstand ved forslag som ble fjernet: linjen om fjernede forslag.
UX-DR18: Bekreftelsesdialoger (shadcn `AlertDialog`) med teksten i `AlertDialogDescription`, fokus på *Avbryt* når dialogen åpnes, og fokus tilbake til knappen som åpnet den. Ordlyden for de fire dialogene står i EXPERIENCE.md: overskriving ved generering på nytt, ny analyse med redigerte faner, *Ny analyse*, og *Prøv med eksempel* når feltene har innhold.
UX-DR19: Tilstander for lasting: «Leser annonsen og sammenligner med CV-en …» innen 2 s, skjelettkort (`aria-hidden`), `aria-busy` på fanepanelet, og egne tekster per fane («Skriver søknadsbrevet …»). Skjelett og spinner pulserer ikke ved `prefers-reduced-motion`.
UX-DR20: Feiltilstander i fanen: `Alert` med `role="alert"` og meldingen fra tabellen. *Prøv igjen* gir fokus til fanepanelet. `grense_naadd` har ingen *Prøv igjen*, men viser til *Prøv med eksempel*. Feil vises aldri som toast.
UX-DR21: Banner for utdatert fane: shadcn `Alert` med «Basert på forrige analyse.» og *Generer på nytt*.
UX-DR22: Demobanner (`demo-banner`, `Info`) med full bredde øverst på begge flatene. Det kan ikke lukkes. Varselet for egen CV i demomodus (FR-26) er en `Alert` over *Analyser* med knappen *Prøv med eksempel*, og fokus flyttes dit.
UX-DR23: Én `aria-live="polite"`-region for hele appen, med meldingene i tabellen i EXPERIENCE.md: analysen starter, gap er klar med antall, en annen fane er klar, en fane er utdatert, maskering, kopiert og passert grense. Feil i en fane i bakgrunnen bruker `role="alert"`.
UX-DR24: Fokus etter handling følger tabellen i EXPERIENCE.md: filen lest inn, lim inn, bytt fil, fil kan ikke leses, *Analyser*, *Tilbake til resultatet*, *Endre CV-tekst*, *Ny analyse*, *Prøv igjen*, kategorimerke og dialog.
UX-DR25: Responsivt: panelene står side om side fra 1024 px og stables under. Ingen sidelengs rulling ned til 320 px (`overflow-wrap: anywhere`, ingen faste høyder). Klikkflater er minst 44 × 44 px på mobil og 24 × 24 px på PC.
UX-DR26: Mikrotekst følger Voice and Tone: du-form, ingen utropstegn, ingen «vi» eller «jeg», kategorinavnene nøyaktig, og «språkmodellen». Ingen «KI-glitter».
UX-DR27: Tilgjengelighetstesting per story med brukerflate: kun tastatur, NVDA med Firefox eller Chrome, VoiceOver med Safari, 320 px og 200 % tekstzoom.

### Dekningskart for FR

FR-1: Epic 1 – opplasting av CV-fil
FR-2: Epic 1 – tekstuttrekk, også PDF med to kolonner
FR-3: Epic 1 (kontrollsteget) og Epic 2 (*Endre CV-tekst*, ny kjøring)
FR-4: Epic 1 – annonse og lengdegrenser
FR-5: Epic 1 – personvern og avkrysning
FR-6: Epic 1 – maskering av fødselsnummer
FR-7: Epic 2 – hente ut alle krav
FR-8: Epic 2 – kategori med belegg
FR-9: Epic 2 – kontroll av belegg i kode
FR-10: Epic 2 – ærlige råd ved Mangler
FR-11: Epic 2 – nøkkelord
FR-12: Epic 2 – treffprosent i kode
FR-13: Epic 2 – veiledende treffprosent
FR-14: Epic 3 – søknadsbrev
FR-15: Epic 3 – brevet bygger bare på belegg
FR-16: Epic 4 – CV-forbedringer
FR-17: Epic 4 – ATS-forslag
FR-18: Epic 2 (gap), Epic 3 (brev) og Epic 4 (CV og ATS) – redigering
FR-19: Epic 2 (gap og merking som utdatert), Epic 3 og Epic 4 – ny generering
FR-20: Epic 2, Epic 3 og Epic 4 – kopiering per fane
FR-21: Epic 2 – *Ny analyse*
FR-22: Epic 2 – feilhåndtering (filfeil i Epic 1)
FR-23: Epic 1 – demomodus og banner
FR-24: Epic 2 (gap), Epic 3 (brev) og Epic 4 (CV og ATS) – lagrede demosvar
FR-25: Epic 2 – *Prøv med eksempel*
FR-26: Epic 1 – egen CV i demomodus
FR-27: Epic 2, Epic 3 og Epic 4 – ingen oppdiktning
NFR-1 til NFR-10: fordelt på epicene, og verifisert samlet i Epic 5 (SM-9).

## Epic-liste

### Epic 1: Brukeren kan forberede en analyse trygt
Appen er publisert og kan startes med tre kommandoer. Brukeren kan laste opp eller lime inn CV-en, se og rette CV-teksten i kontrollsteget (også PDF med to kolonner) og se at fødselsnummer blir maskert. Brukeren kan lime inn annonsen, lese personverninformasjonen og krysse av. Uten nøkkel viser appen demobanneret, og *Analyser* med egen CV gir varselet om at full analyse krever nøkkel.
**FR som dekkes:** FR-1, FR-2, FR-3 (kontrollsteget), FR-4, FR-5, FR-6, FR-23, FR-26

### Epic 2: Brukeren ser ærlig hva CV-en dekker
Brukeren trykker *Analyser* og får gap-analysen: hvert krav med Oppfylt, Delvis oppfylt eller Mangler, belegg kontrollert i kode, ærlige råd og treffprosent. Resultatet kan redigeres, kopieres og genereres på nytt, og brukeren kan gå tilbake med *Endre CV-tekst* eller starte på nytt med *Ny analyse*. Feil vises på norsk med *Prøv igjen*. *Prøv med eksempel* viser Idas gap-analyse uten nøkkel. Leverandøren velges ved måling (AD-11).
**FR som dekkes:** FR-3 (tilbake og ny kjøring), FR-7, FR-8, FR-9, FR-10, FR-11, FR-12, FR-13, FR-18, FR-19, FR-20, FR-21, FR-22, FR-24 (gap), FR-25, FR-27 (gap)

### Epic 3: Brukeren får et søknadsbrev som bare bygger på CV-en
Fanen *Søknadsbrev* genererer et nøkternt brev på 250–400 ord med listen *Bygger på*. Belegg uten treff fjernes, og brevet kan redigeres, kopieres og genereres på nytt, også i demomodus.
**FR som dekkes:** FR-14, FR-15, FR-18 (brev), FR-19 (brev), FR-20 (brev), FR-24 (brev), FR-27 (brev)

### Epic 4: Brukeren får konkrete forslag til CV-en
Fanene *CV-forbedringer* og *ATS-forslag* gir få, konkrete forslag med belegg og én setning om hvorfor, uten å legge til noe nytt. Kan kuttes fra slutten etter PRD §7.2: ATS-forslag først.
**FR som dekkes:** FR-16, FR-17, FR-18 (CV og ATS), FR-19 (CV og ATS), FR-20 (CV og ATS), FR-24 (CV og ATS), FR-27 (CV og ATS)

### Epic 5: Sensor kan verifisere at løsningen holder det den lover
Testsettet kjøres tre ganger per testpar mot den valgte leverandøren. Robusthet og tilgjengelighet testes på tvers av flatene, hvert krav verifiseres som i SM-9, og en medstudent starter appen fra README-en.
**FR som dekkes:** ingen nye. Verifiserer FR-1 til FR-27 og NFR-1 til NFR-10 (SM-1 til SM-9).

## Epic 1: Brukeren kan forberede en analyse trygt

Appen er publisert og kan startes med tre kommandoer. Brukeren kan laste opp eller lime inn CV-en, se og rette CV-teksten i kontrollsteget (også PDF med to kolonner) og se at fødselsnummer blir maskert. Brukeren kan lime inn annonsen, lese personverninformasjonen og krysse av. Uten nøkkel viser appen demobanneret, og *Analyser* med egen CV gir varselet om at full analyse krever nøkkel.

### Story 1.1: Kjørbar app i demomodus, lokalt og på Vercel

Som sensor (Marit, UJ-3),
vil jeg kunne klone repoet og starte appen med høyst tre kommandoer uten API-nøkkel,
slik at jeg kan vurdere prosjektet uten oppsett.

**Realiserer:** FR-23, NFR-2, NFR-6, NFR-7, AD-1, AD-2, AD-5 (`/api/status`), AD-12, AD-15, UX-DR22 (demobanner)

**Akseptansekriterier:**

**Gitt** at Node 24 er installert
**Når** prosjektet er satt opp med `create-next-app@16.4.4` og `shadcn@4.23.0 init -t next -b radix` med flaggene i AD-15, i en midlertidig mappe som så er flyttet inn i rotmappa
**Så** har repoet `src/app`, App Router, Tailwind 4, ESLint, TypeScript 5.9.x, `@types/node` `^24` og `engines.node: "24.x"`
**Og** Cache Components er av, det finnes ingen AGENTS.md fra starteren, og CLAUDE.md, `_bmad/`, `_bmad-output/`, `testdata/` og `.logs/` er urørt

**Gitt** en fersk klone uten `.env`
**Når** sensor kjører kommandoene i README-en (høyst tre, for eksempel `npm ci` og `npm run dev`)
**Så** starter appen, og demobanneret «Demomodus: appen kjører uten API-nøkkel. Du kan prøve eksempelet og kontrollsteget med din egen CV.» vises i full bredde øverst og kan ikke lukkes

**Gitt** at appen kjører
**Når** klienten kaller `GET /api/status`
**Så** er svaret `{ modus: 'demo', leverandor: { navn, land, tredjeland } }` når nøkkelen for `LLM_LEVERANDOR` mangler, og `modus: 'ekte'` når den finnes
**Og** ruten er dynamisk, så modusen ikke låses ved bygging, og en miljøvariabel som mangler, gir standardverdien og aldri krasj

**Gitt** repoet
**Når** det sjekkes
**Så** finnes `.env.example` med alle variablene i AD-12 uten verdier, ingen variabel har prefikset `NEXT_PUBLIC_`, `.gitignore` blokkerer `.env` og `*.pdf` og `*.docx` utenfor `testdata/`, og `.gitattributes` har `testdata/** text eol=lf`
**Og** mappene `lib/kontrakt`, `lib/kjerne`, `lib/innlesing`, `lib/llm`, `lib/pipeline` og `lib/okt` finnes, og ESLint-regelen `no-restricted-imports` stopper import av `lib/llm` og `lib/pipeline` fra `src/components` og fra sider under `src/app` (utenom `src/app/api`)

**Gitt** en PR eller en push til `main`
**Når** GitHub Actions kjører
**Så** passerer `npm ci`, lint, `tsc --noEmit` og `vitest run` uten API-nøkkel, med `server-only` aliasert i Vitest-konfigurasjonen

**Gitt** at repoet er importert på Vercel (Hobby)
**Når** `main` publiseres
**Så** kjører produksjonen på adressen i README-en, funksjonene ligger i én EU-region (`fra1` eller `arn1`, satt i `vercel.json`), og forhåndsvisninger kjører uten nøkkel
**Og** det er notert i sesjonsloggen om Vercels runtime-logger viser IP-adresser

### Story 1.2: Forberedelsessiden med personvern og annonse

Som jobbsøker (Ida, UJ-1),
vil jeg se hva som skjer med CV-en min og kunne lime inn annonsen,
slik at jeg vet at det er trygt før jeg analyserer.

**Realiserer:** FR-4, FR-5, NFR-1, NFR-8, AD-6 (`okt`, `utkast`), UX-DR1, UX-DR2, UX-DR3, UX-DR6, UX-DR7, UX-DR8, UX-DR25, UX-DR26

**Akseptansekriterier:**

**Gitt** at appen er åpnet
**Når** forberedelsessiden vises
**Så** står demobanneret (i demomodus), tittelen og én setning om hva appen gjør, personvernboksen, CV-panelet og annonsepanelet, avkrysningen og *Analyser* i den rekkefølgen, med én `h1`, `header` og `main` og `<html lang="nb">`
**Og** fargene, fokusringen og typografien kommer fra tokenene i DESIGN.md, lagt inn i Tailwind 4 og shadcn-temaet

**Gitt** at `/api/status` har svart
**Når** personvernboksen vises
**Så** sier den hvilken leverandør og hvilket land CV-teksten sendes til, med setningen om overføring ut av EØS bare når `tredjeland` er sann. Den sier også at ingenting lagres, og at brukeren bør fjerne fødselsnummer, adresse, bilde og helseopplysninger. Boksen kan ikke lukkes

**Gitt** annonsefeltet med etiketten «Annonse», hjelpeteksten «Lim inn hele annonsen» og en tegnteller
**Når** brukeren limer inn mer enn 8 000 tegn
**Så** får feltet med en gang `aria-invalid="true"`, telleren og kanten blir `destructive`, meldingen står under feltet via `aria-describedby`, og teksten kuttes ikke
**Og** under 200 tegn vises meldingen først når brukeren forlater feltet

**Gitt** at vilkårene for analyse ikke er oppfylt
**Når** brukeren ser på *Analyser*
**Så** har knappen `aria-disabled="true"`, men kan fortsatt få fokus, og alle årsakene står i en liste under knappen i rekkefølgen CV-tekst, annonse, avkrysning, knyttet med `aria-describedby`. Et trykk gjør ingenting

**Gitt** avkrysningen «Jeg har lest informasjonen om personvern.»
**Når** brukeren krysser av
**Så** erstattes den av teksten «Du har bekreftet at du har lest informasjonen om personvern.» med ikon, og `okt.bekreftetPersonvern` gjelder resten av økten

**Gitt** at siden er i bruk
**Når** den vises i 320 px bredde, i 1024 px bredde og med 200 % tekstzoom
**Så** stables panelene under 1024 px og står side om side fra 1024 px, uten sidelengs rulling, og klikkflatene er minst 44 × 44 px på mobil
**Og** ingenting skrives til localStorage, sessionStorage, IndexedDB eller cookies (NFR-1)

### Story 1.3: Lime inn CV-tekst og kontrollere den

Som jobbsøker,
vil jeg lime inn CV-teksten og se nøyaktig hva som blir sendt,
slik at jeg kan rette feil og vite at fødselsnummeret mitt ikke blir sendt.

**Realiserer:** FR-1 (innliming), FR-3, FR-4 (CV-grense), FR-6, AD-13, UX-DR5, UX-DR23, UX-DR24

**Akseptansekriterier:**

**Gitt** `masker` i `lib/kjerne`
**Når** enhetstestene kjører
**Så** maskeres «01019012345» og «010190 12345» til `[fødselsnummer fjernet]`, mens «400 00 001», årstall, «1234.56.78903» og «12345678903» ikke maskeres
**Og** `masker(masker(x)) === masker(x)`, og testnavnene starter med `FR-6:`

**Gitt** CV-panelet i tilstand 1
**Når** brukeren trykker *Lim inn CV-teksten*
**Så** går panelet til tilstand 2 med overskriften «Kontroller CV-teksten», et tomt felt med etiketten «CV-tekst» og en tegnteller (maks 15 000), og fokus går til feltet

**Gitt** CV-tekst med et fødselsnummer
**Når** brukeren limer inn teksten eller forlater feltet
**Så** står `[fødselsnummer fjernet]` i feltet, en linje over feltet sier hvor mange som ble fjernet, og live-regionen sier «1 fødselsnummer er fjernet fra CV-teksten.»

**Gitt** CV-tekst under 300 tegn
**Når** den vises i kontrollsteget
**Så** står en `Alert` (`TriangleAlert`) over feltet: «Fant nesten ikke tekst i filen. Den kan være skannet eller tom. Lim inn teksten selv i feltet under.»

**Gitt** CV-tekst over 15 000 tegn
**Når** den står i feltet
**Så** vises grensetilstanden som for annonsen i story 1.2, og *Analyser* viser årsaken

**Gitt** at CV-teksten, annonsen og avkrysningen er i orden
**Når** *Analyser* oppdager et fødselsnummer som ble skrevet inn uten at feltet ble forlatt
**Så** maskeres det, linjen oppdateres, og analysen starter ikke før brukeren trykker igjen

### Story 1.4: Laste opp CV som DOCX eller TXT

Som jobbsøker,
vil jeg laste opp CV-en min som Word-fil eller tekstfil,
slik at jeg slipper å kopiere teksten selv.

**Realiserer:** FR-1, FR-2 (DOCX, TXT), FR-22 (filfeil), NFR-6, AD-7, UX-DR4, UX-DR24

**Akseptansekriterier:**

**Gitt** `lib/innlesing` med rene funksjoner fra `ArrayBuffer` til `string`
**Når** testene kjører i Node
**Så** gir `testdata/par-1-butikk-bank/cv.docx` (mammoth) og hver `cv.txt` (UTF-8) samme tekst som `cv.txt`, uten at mellomrom og linjeskift regnes med (FR-2)

**Gitt** opplastingsfeltet, som er en `<button>` «Velg CV-fil» med en skjult `<input type="file" accept=".pdf,.docx,.txt">` og dra og slipp som tillegg
**Når** brukeren velger en DOCX- eller TXT-fil på maks 5 MB
**Så** vises «Leser CV-en …», teksten leses i nettleseren og maskeres (story 1.3), og panelet går til kontrollsteget med filnavnet og *Bytt fil*. Fokus går til CV-tekstfeltet

**Gitt** en fil i et annet format eller over 5 MB
**Når** brukeren velger den
**Så** leses den ikke, og meldingen under feltet sier hvilke formater og hvilken størrelse som er lov, med `role="alert"`. Meldingen er knyttet til knappen med `aria-describedby`, og fokus blir stående på knappen

**Gitt** en fil som ikke kan leses (for eksempel en ødelagt DOCX)
**Når** innlesingen feiler
**Så** står «Klarte ikke å lese filen. Lim inn CV-teksten i stedet.», panelet går til tilstand 2 med tomt felt, og fokus går til feltet. Appen krasjer ikke

**Gitt** kontrollsteget med en fil
**Når** brukeren trykker *Bytt fil*
**Så** går panelet tilbake til tilstand 1, og fokus går til opplastingsknappen
**Og** CV-filen sendes aldri til serveren (FR-2)

### Story 1.5: Laste opp CV som PDF, også med to kolonner

Som jobbsøker med en designet CV (Mina, UJ-2),
vil jeg at en PDF med to kolonner blir lest kolonne for kolonne,
slik at teksten ikke flettes sammen.

**Realiserer:** FR-2 (PDF), FR-3 (skannet PDF), NFR-6, AD-7, SM-5

**Akseptansekriterier:**

**Gitt** PDF-funksjonen i `lib/innlesing` med `getDocument` injisert og kolonneregelen fra addendum B
**Når** testen kjører i Node med `pdfjs-dist/legacy/build/pdf.mjs` på `testdata/par-4-tokolonne-hotell/cv.pdf`
**Så** finnes alle linjene i `cv.txt` i resultatet, ingen linje blander tekst fra begge kolonnene, og «SPRÅK» og «KURS» kommer før «PROFIL»

**Gitt** en PDF med én kolonne
**Når** den leses
**Så** sorteres teksten etter y og så x, og leserekkefølgen er bevart

**Gitt** at `workerSrc` er satt i en klientmodul med `new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url)`
**Når** appen er bygget med `next build` og startet med `next start`
**Så** kan brukeren laste opp PDF-en fra testpar 4, og kontrollsteget viser venstre kolonne før høyre

**Gitt** en skannet PDF som gir under 300 tegn
**Når** den er lest inn
**Så** vises advarselen om kort CV-tekst fra story 1.3, og brukeren kan lime inn teksten i samme felt

### Story 1.6: Analyser med egen CV i demomodus

Som sensor uten API-nøkkel,
vil jeg få en forklaring når jeg trykker *Analyser* på min egen CV,
slik at jeg forstår hvorfor og hva jeg kan gjøre i stedet.

**Realiserer:** FR-26, AD-6 (`kjoring`), AD-13, `DEMO_CV`, `DEMO_ANNONSE`, `erDemoeksempel`, UX-DR22, UX-DR24

**Akseptansekriterier:**

**Gitt** `lib/kontrakt`
**Når** demoeksempelet trengs
**Så** eksporteres `DEMO_CV` og `DEMO_ANNONSE` med teksten fra `testdata/par-1-butikk-bank/cv.txt` og `annonse.txt`, statisk importert

**Gitt** `normaliser` og `erDemoeksempel(cvTekst, annonse)` i `lib/kjerne`
**Når** enhetstestene kjører
**Så** er resultatet sant for demoteksten, også med CRLF-linjeskift eller andre mellomrom, og usant når ett ord er endret
**Og** sammenligningen er `normaliser(masker(x))`, med normaliseringen fra FR-9

**Gitt** demomodus, egen CV-tekst, en gyldig annonse og avkrysning
**Når** brukeren trykker *Analyser*
**Så** blir brukeren på forberedelsessiden, en `Alert` over *Analyser* sier «Full analyse av din egen CV krever en API-nøkkel. Prøv eksempelet for å se hvordan resultatet ser ut.», og fokus flyttes til varselet
**Og** ingen request sendes til `/api/generer`

## Epic 2: Brukeren ser ærlig hva CV-en dekker

Brukeren trykker *Analyser* og får gap-analysen: hvert krav med Oppfylt, Delvis oppfylt eller Mangler, belegg kontrollert i kode, ærlige råd og treffprosent. Resultatet kan redigeres, kopieres og genereres på nytt, og brukeren kan gå tilbake med *Endre CV-tekst* eller starte på nytt med *Ny analyse*. Feil vises på norsk med *Prøv igjen*. *Prøv med eksempel* viser Idas gap-analyse uten nøkkel. Leverandøren velges ved måling (AD-11).

### Story 2.1: Kontrollert gap-analyse for demoeksempelet gjennom API-et

Som sensor,
vil jeg at gap-analysen for demoeksempelet går gjennom de samme kontrollene i kode som en ekte analyse,
slik at demomodus viser hvordan appen faktisk sikrer ærligheten.

**Realiserer:** FR-9, FR-12, FR-24 (gap), NFR-1, NFR-6, NFR-9, AD-3 (port og mock), AD-4, AD-5, AD-8, AD-10, AD-13, AD-14

**Akseptansekriterier:**

**Gitt** `lib/kontrakt`
**Når** de delte formene defineres
**Så** finnes `Kategori`, `Belegg`, `Krav` (med `nedgradert`), `Nokkelord` (`tekst`, `kravIndeks`, `funnet`), `GapAnalyse` (med `stilling` og `arbeidsgiver`), `GapGrunnlag`, feilkode-enumen med HTTP-status, og tellerne `fjernetBelegg` og `fjernetForslag`, som zod-skjemaer med avledede typer

**Gitt** `kontrollerKrav` i `lib/kjerne`
**Når** enhetstestene kjører
**Så** godtas et belegg som finnes, også med andre linjeskift og store eller små bokstaver, et belegg som er litt omskrevet avvises, og et Oppfylt- eller Delvis oppfylt-krav uten gyldig belegg (også med tom liste) blir `mangler` med `nedgradert: true`. Belegg som ikke ble funnet, er fjernet (FR-9)

**Gitt** `treffprosent` i `lib/kjerne`
**Når** enhetstestene kjører med nøkkelordene fra hver `testdata/*/fasit.md` mot `cv.txt`
**Så** blir resultatet 22 %, 11 %, 8 % og 33 %, og de kjente svakhetene (*oppgjør* mot *dagsoppgjør*, *av* mot *avisbud*) er dokumentert i egne tester (FR-12)

**Gitt** `LlmKlient` og mock-adapteren, som importerer `lib/llm/demo-svar/gap.json` statisk
**Når** `demo-svar/gap.json` lages for testpar 1
**Så** er det et rått modellsvar som følger fasiten for par 1 (seks krav med riktig kategori og ordrette belegg fra `cv.txt`, og de ni nøkkelordene), og en test validerer filen mot skjemaet

**Gitt** `POST /api/generer/gap` med `DEMO_CV` og `DEMO_ANNONSE`
**Når** ruten kalles i demomodus eller med `demo: true`
**Så** går svaret gjennom stegene i AD-4 (inndata, maskering, `erDemoeksempel`, mock, skjema, `kontrollerKrav`, treffprosent) og returnerer en `GapAnalyse` med treffprosent 22
**Og** med en annen CV-tekst er svaret `demo_krever_nokkel` (403) i demomodus, og `ugyldig_inndata` (400) når `demo: true` sendes i ekte modus
**Og** for lang tekst gir `for_lang_tekst` (413) (NFR-9)

**Gitt** en generering
**Når** den logges
**Så** er det én JSON-linje med bare `resultatdel`, `modus`, `status`, `varighetMs`, `inputTokens`, `outputTokens` og `feilkode`, og et søk i loggen etter tekst fra testpar 1 gir ingen treff (NFR-1)

### Story 2.2: *Prøv med eksempel* viser gap-analysen

Som sensor eller jobbsøker,
vil jeg trykke *Prøv med eksempel* og se en ferdig gap-analyse,
slik at jeg forstår hva appen gjør før jeg bruker min egen CV.

**Realiserer:** FR-7 (visning), FR-8 (visning), FR-10 (visning), FR-11 (visning), FR-12, FR-13, FR-24 (gap), FR-25, NFR-8, AD-6, UX-DR9, UX-DR10, UX-DR12, UX-DR13, UX-DR14, UX-DR15, UX-DR18, UX-DR19, UX-DR23, UX-DR24, UX-DR27

**Akseptansekriterier:**

**Gitt** økt-tilstanden i `lib/okt` (context med `useReducer`, `okt` og `innhold`, `kjoring`, `resultatdeler` med `status`, `feilkode`, `generert`, `redigert` og `gapVersjon`)
**Når** en generering skal starte
**Så** gjør bare `startGenerering(resultatdel)` det, med vakt mot dobbeltstart (også under React StrictMode) og en `AbortController`, og en fanekomponent sender aldri en fetch selv

**Gitt** forberedelsessiden, med eller uten nøkkel
**Når** brukeren trykker *Prøv med eksempel* med tomme felt
**Så** fylles `DEMO_CV` og `DEMO_ANNONSE` inn, en `kjoring` med `erEksempel: true` settes, resultatsiden åpnes, fokus går til «Resultat» (`h1`), og gap-analysen hentes fra mock-adapteren uten kall til språkmodellen (FR-25)
**Og** har feltene innhold, vises dialogen «Erstatte teksten din med eksempelet?» først, med fokus på *Avbryt*

**Gitt** at gap-analysen genereres
**Når** resultatsiden vises
**Så** vises skjelettkort (`aria-hidden`) og «Leser annonsen og sammenligner med CV-en …» innen 2 s, fanepanelet har `aria-busy="true"`, og live-regionen sier «Analyserer. Dette tar inntil 30 sekunder.» (NFR-4)

**Gitt** at gap-analysen er ferdig
**Når** fanen *Gap-analyse og nøkkelord* vises
**Så** viser toppfeltet stilling og arbeidsgiver, oppsummeringen sier «Du dekker X av Y krav. Z er delvis oppfylt.» med tre kategorimerker (ikon, ord og antall) som lenker til gruppeoverskriftene, og kravkortene er gruppert Oppfylt, Delvis oppfylt, Mangler i annonsens rekkefølge
**Og** hvert krav har belegg-sitat (`figure` med «Fra CV-en»), forklaring (Delvis oppfylt) eller råd (Mangler), og et nedgradert krav har merket «Nedgradert: fant ikke belegg i CV-en» og det faste rådet fra koden
**Og** under kravene står treffprosenten fra koden med «veiledende treff, ikke en ATS-score» og teksten fra FR-13, en dekorativ linje med `aria-hidden`, og nøkkelordene i «Funnet i CV-en» og «Ikke funnet»
**Og** live-regionen sier «Gap-analysen er klar. X av Y krav er oppfylt.»

**Gitt** fanene på resultatsiden
**Når** de brukes med tastatur
**Så** er de shadcn `Tabs` med `activationMode="manual"`, og fanen *Gap-analyse og nøkkelord* er tilgjengelig. Faner for resultatdeler som ikke er bygget ennå, vises ikke
**Og** siden er testet med tastatur alene, NVDA, VoiceOver, i 320 px bredde og med 200 % tekstzoom (UX-DR27)

### Story 2.3: Ekte gap-analyse med språkmodellen

Som jobbsøker,
vil jeg trykke *Analyser* på min egen CV og annonse og få en gap-analyse,
slik at jeg ser hvilke krav jeg dekker, delvis dekker og mangler.

**Realiserer:** FR-7, FR-8, FR-9, FR-10, FR-11, FR-27 (gap), NFR-3, NFR-4, NFR-5, NFR-9, AD-3, AD-4, AD-5, AD-9, AD-11 (forberedelse)

**Akseptansekriterier:**

**Gitt** adapterne for Mistral og OpenAI i `lib/llm`
**Når** `analyseGap` kalles
**Så** brukes `generateText` med `Output.object(gapSkjema)`, `instructions`, `maxRetries: 0`, `AbortSignal.timeout(45000)` og temperatur 0–0,3, Mistral med `strictJsonSchema: true`, og adapteren velges med `LLM_LEVERANDOR` og `LLM_MODELL`
**Og** prompten ligger i `lib/llm/prompter/`, avgrenser CV-teksten og annonsen som data, sier at instrukser i dem skal ignoreres, og krever at hvert belegg er sitert ordrett, at ved tvil velges svakeste kategori, at kvalifikasjoner aldri fylles inn, og at svaret er på bokmål

**Gitt** ekte modus, egen CV-tekst, gyldig annonse og avkrysning
**Når** brukeren trykker *Analyser*
**Så** settes `kjoring` med den maskerte CV-teksten, resultatsiden åpnes, og gap-analysen genereres gjennom pipelinen. Svaret vises som i story 2.2

**Gitt** rate-limit i `lib/pipeline`
**Når** grensen per minutt eller per døgn er nådd i en serverinstans
**Så** svarer ruten `grense_naadd` (429), hver ekte generering telles i steg D uansett utfall, demo telles ikke, og ingen IP-adresse eller annen identifikator brukes (NFR-1, NFR-3)

**Gitt** `testdata/robusthet/annonse-med-instruks.txt`
**Når** den analyseres sammen med CV-en fra par 1
**Så** er resultatet en vanlig gap-analyse der instruksen ikke er fulgt (NFR-9)

**Gitt** de fire testparene
**Når** gap-analysen kjøres mot den konfigurerte leverandøren
**Så** er den ferdig innen 30 s for hvert par (NFR-4), og varighet og antall tokens står i loggen

### Story 2.4: Velge leverandør ved måling

Som gruppe,
vil vi kjøre testsettet mot både Mistral og OpenAI og velge etter en fast regel,
slik at valget av språkmodell bygger på data og kan begrunnes i rapporten.

**Realiserer:** AD-11, PRD §6, §10.1, SM-1, SM-2, SM-3, SM-8, NFR-5, NFR-10

**Akseptansekriterier:**

**Gitt** `scripts/kjor-testsett.ts` (`npm run testsett`)
**Når** skriptet kjøres med nøkkel og en valgt leverandør
**Så** kjører det gap-analysen for alle fire testparene tre ganger og skriver kategoriene, nøkkelordene, treffprosenten, tokens og beregnet kostnad per kjøring til en rapport som kan sammenlignes med fasitene og sjekklisten
**Og** skriptet er ikke en del av `npm test`, og CI kjører det ikke

**Gitt** begge leverandørene
**Når** testsettet er kjørt og vurdert med sjekklisten (gap-delen og «Gjennomgående»)
**Så** velges Mistral hvis den består SM-1 (gap), SM-2, SM-3 og NFR-5 innenfor 1 kr per kjøring. Ellers velges OpenAI
**Og** resultatet, modellnavnet (`LLM_MODELL`) og commit-versjonen noteres i sesjonsloggen

**Gitt** den valgte leverandøren
**Når** valget er tatt
**Så** er vilkårene sjekket direkte (API-data brukes ikke til trening, og det finnes en databehandleravtale), `LLM_LEVERANDOR`, `LLM_MODELL` og nøkkelen er satt i Production på Vercel, og det er forhåndsbetalt kreditt uten automatisk påfylling, satt under 200 kr
**Og** personvernboksen i produksjon viser riktig leverandør og land

### Story 2.5: Forståelige feil uten tap av data

Som jobbsøker,
vil jeg få en norsk melding og kunne prøve igjen når noe går galt,
slik at jeg ikke mister teksten min.

**Realiserer:** FR-22, NFR-3, NFR-9, AD-8, UX-DR20, UX-DR23, UX-DR24, SM-7

**Akseptansekriterier:**

**Gitt** fetch-innpakningen i `lib/okt`
**Når** serveren svarer 504, nettverket feiler eller svaret ikke er JSON
**Så** blir det `llm_tidsavbrudd` eller `llm_feil`, og alle andre svar leses som `{ feil: { kode } }`

**Gitt** én meldingstabell i UI-et
**Når** en fane får `llm_feil`, `llm_tidsavbrudd` eller `ugyldig_svar`
**Så** vises en `Alert` med `role="alert"` i fanen, med en melding som sier hva som skjedde og hva brukeren kan gjøre (for eksempel «Språkmodellen svarte ikke. Teksten din er tatt vare på. Prøv igjen.»), og en *Prøv igjen*-knapp som gir fokus til fanepanelet
**Og** CV-teksten, annonsen og andre faner er urørt

**Gitt** `grense_naadd`
**Når** feilen vises
**Så** står «Appen har nådd grensen for bruk akkurat nå. Prøv igjen senere, eller bruk *Prøv med eksempel*.», uten *Prøv igjen*-knapp

**Gitt** mock-klienten
**Når** testene fremkaller hvert feiltilfelle i FR-22 (for API-feilene med mock, for filfeilene med filer fra testsettet)
**Så** gir hvert tilfelle riktig kode og melding, og appen krasjer ikke (SM-7)
**Og** feil vises aldri som toast

### Story 2.6: Redigere, kopiere og generere gap-analysen på nytt

Som jobbsøker,
vil jeg kunne rette tekst i gap-analysen, kopiere den og lage den på nytt,
slik at jeg kan ta med meg resultatet videre.

**Realiserer:** FR-18 (gap), FR-19 (gap), FR-20 (gap), FR-24 (ny generering i demo), AD-6 (`redigert`, `gapVersjon`), UX-DR10, UX-DR11, UX-DR18, UX-DR23

**Akseptansekriterier:**

**Gitt** en ferdig gap-analyse
**Når** brukeren endrer feltene «Krav», «Hvorfor delvis» eller «Råd»
**Så** lagres endringen i `redigert` (samme form som `generert`), fanemerket viser «· redigert», og kategori, belegg, treffprosent og nøkkelord er låst og endres ikke (FR-18)

**Gitt** verktøylinjen med *Kopier* og *Generer på nytt*
**Når** brukeren trykker *Kopier*
**Så** kopieres `redigert ?? generert` som ren tekst i formatet fra EXPERIENCE.md (per krav «Krav — Kategori», «Fra CV-en: «…»», forklaring eller råd, og til slutt treffprosenten og nøkkelordene), toasten «Kopiert» vises øverst på mobil, og live-regionen sier «Kopiert.»
**Og** feiler kopieringen, vises «Kunne ikke kopiere. Merk teksten og kopier selv.»

**Gitt** en redigert gap-analyse
**Når** brukeren trykker *Generer på nytt*
**Så** vises dialogen «Lage nytt Gap-analyse og nøkkelord? …» med *Avbryt* og *Lag ny*, og etter bekreftelse går én ny generering til serveren, med samme grunnlag (`kjoring`), og `gapVersjon` øker
**Og** under generering har begge knappene `aria-disabled="true"`

**Gitt** demomodus
**Når** brukeren genererer gap-analysen på nytt
**Så** vises det lagrede svaret igjen, uten kall til språkmodellen (FR-24)

### Story 2.7: Endre CV-tekst, gå tilbake og starte på nytt

Som jobbsøker,
vil jeg kunne legge inn en erfaring som manglet og analysere på nytt, eller tømme alt,
slik at jeg kan forbedre CV-teksten uten å miste kontrollen.

**Realiserer:** FR-3 (tilbake og ny kjøring), FR-5, FR-21, AD-6 (forkaste sene svar), UX-DR8, UX-DR9, UX-DR18, UX-DR24

**Akseptansekriterier:**

**Gitt** resultatsiden
**Når** brukeren trykker *Endre CV-tekst*
**Så** åpnes forberedelsen med `utkast` beholdt, avkrysningen er bekreftet, fokus går til CV-tekstfeltet, og *Tilbake til resultatet* vises
**Og** under 640 px ligger *Endre CV-tekst* og *Ny analyse* i en `DropdownMenu` bak «Valg»

**Gitt** at brukeren har kommet tilbake fra resultatet
**Når** CV-teksten eller annonsen endres
**Så** forsvinner *Tilbake til resultatet*, og linjen «Du har endret teksten. Trykk *Analyser* for en ny analyse.» vises
**Og** uten endring tar *Tilbake til resultatet* brukeren til resultatet uten ny kjøring, med fokus på «Resultat»

**Gitt** at gap-analysen er redigert
**Når** brukeren trykker *Analyser* igjen
**Så** vises dialogen «Starte en ny analyse? Alle resultatdelene erstattes. Redigeringene dine i {faner} blir overskrevet.», og etter bekreftelse settes en ny `kjoring`, og alle resultatdelene nullstilles

**Gitt** en generering som er i gang
**Når** brukeren starter en ny kjøring eller trykker *Ny analyse*
**Så** avbrytes requesten, og et svar som kommer for en `kjoring.id` eller `gapVersjon` som ikke lenger gjelder, forkastes og vises ikke

**Gitt** resultatsiden
**Når** brukeren trykker *Ny analyse* og bekrefter «Tømme alt?»
**Så** tømmes `innhold` (CV-tekst, annonse og alle resultatdeler), `okt.bekreftetPersonvern` beholdes, og fokus går til opplastingsknappen (FR-21)

## Epic 3: Brukeren får et søknadsbrev som bare bygger på CV-en

Fanen *Søknadsbrev* genererer et nøkternt brev på 250–400 ord med listen *Bygger på*. Belegg uten treff fjernes, og brevet kan redigeres, kopieres og genereres på nytt, også i demomodus.

### Story 3.1: Søknadsbrevet for demoeksempelet

Som sensor eller jobbsøker,
vil jeg åpne fanen *Søknadsbrev* for eksempelet og se et brev med det det bygger på,
slik at jeg ser hvordan brevet holder seg til CV-en.

**Realiserer:** FR-15 (*Bygger på*), FR-18 (grunnlag), FR-24 (brev), AD-4, AD-5 (`GapGrunnlag`), AD-6, AD-14, UX-DR10, UX-DR16, UX-DR19, UX-DR23

**Akseptansekriterier:**

**Gitt** `lib/llm/demo-svar/brev.json` for testpar 1
**Når** filen lages
**Så** er det et rått modellsvar med et brev på 250–400 ord som følger sjekklisten for par 1, uten forbudte påstander, med plassholdere for navn og kontaktinformasjon og en liste *Bygger på* med ordrette belegg fra `cv.txt`. En test validerer filen mot brevskjemaet

**Gitt** `POST /api/generer/brev` med `cvTekst`, `annonse` og `gap: GapGrunnlag`
**Når** ruten kalles
**Så** avviser den requesten med `ugyldig_inndata` hvis `gap` mangler eller er for stor, kjører `kontrollerKrav` på nytt på `GapGrunnlag` mot den kanoniske CV-teksten før adapteren kalles, fjerner belegg i *Bygger på* som ikke finnes i CV-teksten og teller dem i `fjernetBelegg`
**Og** en test viser at et `GapGrunnlag` der et krav uten belegg er endret fra `mangler` til `oppfylt`, blir satt tilbake til `mangler` før prompten bygges (NFR-9)

**Gitt** at gap-analysen er ferdig
**Når** brukeren åpner fanen *Søknadsbrev* første gang
**Så** starter `startGenerering('brev')` én generering, med `GapGrunnlag` bygd fra den uredigerte `generert` for gap, aldri fra `redigert`, og fanen viser skjelett og «Skriver søknadsbrevet …»
**Og** åpnes fanen mens gap-analysen genereres, vises «Venter på gap-analysen …», og brevet starter av seg selv når gap er ferdig
**Og** har gap-analysen feilet, vises «Denne delen bygger på gap-analysen. Prøv gap-analysen på nytt først.» med en knapp til den fanen

**Gitt** et ferdig brev
**Når** fanen vises
**Så** står brevet i et `textarea` med brevskrift og etiketten «Søknadsbrev», en ordteller (mål 250–400, plassholdere telles ikke) og linjen «Fyll inn før du sender: …» med plassholderne brevet har
**Og** under brevet står *Bygger på* som belegg-sitater, med linjen «N belegg ble fjernet fordi det ikke fantes i CV-en.» når `fjernetBelegg > 0`
**Og** live-regionen sier «Søknadsbrevet er klart.», også når brukeren står i en annen fane

### Story 3.2: Ekte søknadsbrev som ikke dikter opp

Som jobbsøker,
vil jeg få et søknadsbrev for akkurat denne stillingen som bare bruker det som står i CV-en min,
slik at jeg kan stå inne for alt i et intervju.

**Realiserer:** FR-14, FR-15, FR-27 (brev), NFR-5, NFR-9, AD-3, SM-1 (brev), SM-2 (brev)

**Akseptansekriterier:**

**Gitt** `skrivSoknadsbrev` i adapterne og en prompt i `lib/llm/prompter/`
**Når** brevet genereres
**Så** avgrenser prompten CV-teksten, annonsen og `GapGrunnlag` som data, og krever et sammenhengende brev på bokmål på 250–400 ord for stillingen og arbeidsgiveren, med minst tre krav og to erfaringer, plassholdere for navn og kontaktinformasjon, ingen punktlister og ingen tomme fraser
**Og** prompten sier at bare krav med Oppfylt eller Delvis oppfylt kan presenteres som kvalifikasjoner, og at krav med Mangler bare kan nevnes som motivasjon for å lære

**Gitt** `npm run testsett` utvidet med brevet
**Når** det kjøres tre ganger per testpar mot den valgte leverandøren
**Så** består hvert brev brevdelen og punktet «Gjennomgående» i sjekklisten, og ingen forbudte påstander i fasitene forekommer (SM-2)
**Og** resultatet noteres i sesjonsloggen med commit-versjon

### Story 3.3: Redigere, kopiere og lage søknadsbrevet på nytt

Som jobbsøker,
vil jeg kunne endre brevet, kopiere det og lage et nytt,
slik at jeg kan gjøre det til mitt eget.

**Realiserer:** FR-18 (brev), FR-19 (brev og merking som utdatert), FR-20 (brev), FR-24 (ny generering i demo), AD-6, UX-DR11, UX-DR18, UX-DR21, UX-DR23

**Akseptansekriterier:**

**Gitt** et ferdig brev
**Når** brukeren endrer teksten
**Så** lagres endringen i `redigert` mens brukeren skriver, fanemerket viser «· redigert», og gap-fanen og treffprosenten er uendret (FR-18)

**Gitt** verktøylinjen
**Når** brukeren trykker *Kopier*
**Så** kopieres brevteksten slik den står etter redigering, og «Kopiert» bekreftes som i story 2.6

**Gitt** et redigert brev
**Når** brukeren trykker *Generer på nytt*
**Så** vises dialogen «Lage nytt Søknadsbrev? Redigeringene dine i Søknadsbrev blir overskrevet. …», og etter bekreftelse går én ny generering med samme grunnlag som første gang, mens andre faner ikke berøres
**Og** i demomodus vises det lagrede brevet igjen uten kall til språkmodellen

**Gitt** et ferdig brev
**Når** gap-analysen genereres på nytt (`gapVersjon` øker)
**Så** vises banneret «Basert på forrige analyse.» med *Generer på nytt* øverst i fanen *Søknadsbrev*, og live-regionen sier «Søknadsbrevet er basert på forrige analyse.»

## Epic 4: Brukeren får konkrete forslag til CV-en

Fanene *CV-forbedringer* og *ATS-forslag* gir få, konkrete forslag med belegg og én setning om hvorfor, uten å legge til noe nytt. Kan kuttes fra slutten etter PRD §7.2: ATS-forslag først.

### Story 4.1: CV-forbedringer med belegg

Som jobbsøker,
vil jeg få konkrete forslag til hvordan jeg kan formulere det som allerede står i CV-en, bedre,
slik at jeg lærer hva arbeidsgivere ser etter, uten å legge til noe som ikke er sant.

**Realiserer:** FR-16, FR-18 (CV), FR-19 (CV), FR-20 (CV), FR-24 (CV), FR-27 (CV), AD-3, AD-4, AD-14, UX-DR11, UX-DR17, UX-DR21, SM-1 (CV), SM-2 (CV), SM-C3

**Akseptansekriterier:**

**Gitt** `lib/llm/demo-svar/cv.json` for testpar 1
**Når** filen lages
**Så** er det et rått modellsvar med få, konkrete forslag. Hvert forslag har et belegg sitert ordrett fra `cv.txt`, et forslag og én setning om hvorfor, knyttet til et krav eller nøkkelord. En test validerer filen mot skjemaet

**Gitt** `POST /api/generer/cv` med `GapGrunnlag`
**Når** svaret er generert
**Så** kjøres `kontrollerKrav` på nytt på `GapGrunnlag` før prompten bygges, forslag uten gyldig belegg fjernes og telles i `fjernetForslag`, og fjernede belegg returneres aldri

**Gitt** `foreslaCvForbedringer` og prompten i `lib/llm/prompter/`
**Når** forslagene genereres
**Så** avgrenser prompten CV-teksten, annonsen og `GapGrunnlag` som data, og krever at forslag bare omformulerer, endrer rekkefølge eller presiserer det som står i CV-teksten, aldri legger til noe nytt, og har én setning om hvorfor

**Gitt** at gap-analysen er ferdig
**Når** brukeren åpner fanen *CV-forbedringer*
**Så** genereres den som brevet i story 3.1 (venter på gap, feiltilstand ved feil i gap, skjelett og «Lager CV-forbedringer …»), og hvert forslag vises som et forslagskort med «Gjelder» som låst belegg-sitat, og «Forslag» og «Hvorfor» som redigerbare felt med etiketter
**Og** med null forslag står «Ingen forslag til CV-forbedringer for denne annonsen.», og forslag som er fjernet, nevnes i en linje

**Gitt** fanen *CV-forbedringer*
**Når** brukeren redigerer, kopierer eller genererer på nytt, eller gap-analysen genereres på nytt
**Så** oppfører fanen seg som *Søknadsbrev* i story 3.3: kopiformatet er «Gjelder: …», «Forslag: …» og «Hvorfor: …» per forslag, det kommer en dialog før en redigert fane overskrives, demomodus viser det lagrede svaret, og banneret «Basert på forrige analyse.» vises når fanen er utdatert

**Gitt** `npm run testsett` utvidet med CV-forbedringer
**Når** det kjøres tre ganger per testpar
**Så** består forslagene CV-delen og punktet «Gjennomgående» i sjekklisten, uten forbudte påstander (SM-2), og resultatet noteres i sesjonsloggen

### Story 4.2: ATS-forslag som ikke oppfordrer til nøkkelordstapping

Som jobbsøker,
vil jeg få konkrete forslag om overskrifter, format og ordvalg,
slik at CV-en blir lettere å lese for et ATS-system, uten at jeg legger til ord jeg ikke har dekning for.

**Realiserer:** FR-17, FR-18 (ATS), FR-19 (ATS), FR-20 (ATS), FR-24 (ATS), FR-27 (ATS), AD-3, AD-4, AD-14, UX-DR11, UX-DR17, UX-DR21, SM-1 (ATS), SM-2 (ATS), SM-C1

**Akseptansekriterier:**

**Gitt** `lib/llm/demo-svar/ats.json` for testpar 1
**Når** filen lages
**Så** er det et rått modellsvar med konkrete forslag som hver nevner en bestemt overskrift, linje eller et bestemt nøkkelord, med én setning om hvorfor. En test validerer filen mot skjemaet

**Gitt** `POST /api/generer/ats` med `GapGrunnlag` (nøkkelord med `kravIndeks`)
**Når** svaret er generert
**Så** fjernes forslag som legger til et nøkkelord som ikke er funnet, med mindre nøkkelordet hører til et krav med Oppfylt eller Delvis oppfylt etter `kontrollerKrav`. Forslagene telles i `fjernetForslag`
**Og** en enhetstest viser at et nøkkelord knyttet til et krav med Mangler aldri foreslås (FR-17)

**Gitt** `foreslaAts` og prompten i `lib/llm/prompter/`
**Når** forslagene genereres
**Så** avgrenser prompten dataene som i story 4.1 og krever konkrete forslag som «Endre overskriften "Jobber" til "Arbeidserfaring"», ikke generelle råd som «Optimaliser for ATS»

**Gitt** fanen *ATS-forslag*
**Når** den åpnes og brukes
**Så** oppfører den seg som *CV-forbedringer* i story 4.1. «Gjelder» er den låste overskriften, linjen eller nøkkelordet, og med null forslag står «Ingen ATS-forslag for denne annonsen.»

**Gitt** `npm run testsett` utvidet med ATS-forslag
**Når** det kjøres tre ganger per testpar
**Så** består forslagene ATS-delen og punktet «Gjennomgående» i sjekklisten, uten forbudte påstander, og resultatet noteres i sesjonsloggen

## Epic 5: Sensor kan verifisere at løsningen holder det den lover

Testsettet kjøres tre ganger per testpar mot den valgte leverandøren. Robusthet og tilgjengelighet testes på tvers av flatene, hvert krav verifiseres som i SM-9, og en medstudent starter appen fra README-en. Epicen er den siste samlede kontrollen før innlevering og virker også hvis epic 4 er kuttet helt eller delvis.

### Story 5.1: Testsettet på den endelige versjonen

Som sensor,
vil jeg se at alle testparene er kjørt mot den endelige versjonen og bestått sjekklisten,
slik at jeg kan stole på at appen ikke dikter opp.

**Realiserer:** SM-1, SM-2, SM-3, SM-4, SM-8, NFR-3, NFR-4, NFR-5, NFR-10

**Akseptansekriterier:**

**Gitt** den endelige commiten med alle resultatdelene som er bygget
**Når** `npm run testsett` kjøres tre ganger per testpar mot den valgte leverandøren
**Så** er alle punktene i sjekklisten bestått for alle fire testparene (SM-1), ingen forbudte påstander forekommer i noen resultatdel (SM-2), ingen krav har høyere kategori enn i fasiten, Mangler er alltid Mangler (SM-3), og minst 80 % av de forventede nøkkelordene er hentet ut (SM-4)
**Og** gap-analysen er ferdig innen 30 s for hvert testpar (NFR-4)

**Gitt** de loggførte tokenene fra kjøringene
**Når** kostnaden regnes ut med leverandørens pris
**Så** er gjennomsnittet for en full kjøring 1 kr eller mindre, og det totale forbruket er innenfor budsjettet på 200 kr (SM-8)

**Gitt** resultatene
**Når** de dokumenteres
**Så** står hver kjøring i sesjonsloggen med commit-versjon, leverandør, modell og resultat per testpar. Et testpar som ikke består, får en egen oppføring om hva som ble gjort med det (NFR-10)

### Story 5.2: Personvern, hemmeligheter, robusthet og tilgjengelighet er kontrollert

Som sensor,
vil jeg se at løftene om personvern, sikkerhet og tilgjengelighet er sjekket på den publiserte appen,
slik at jeg vet at de holder i praksis og ikke bare på papiret.

**Realiserer:** NFR-1, NFR-2, NFR-8, NFR-9, FR-22, SM-7, UX-DR27

**Akseptansekriterier:**

**Gitt** produksjonen på Vercel
**Når** en full kjøring med testpar 1 er gjort
**Så** gir et søk i Vercels runtime-logger etter tekst fra CV-en og annonsen ingen treff, loggene inneholder bare metadata, og det er dokumentert om Vercel viser IP-adresser. Hvis ja, nevner personvernteksten det (NFR-1)
**Og** ingenting er lagret i localStorage, sessionStorage, IndexedDB eller cookies (sjekket i nettleserens utviklerverktøy)

**Gitt** repoet og den publiserte bundle-en
**Når** de søkes gjennom
**Så** finnes ingen API-nøkkel eller nøkkelprefiks i JavaScript-koden som sendes til nettleseren eller i Git-historikken, og ingen `*.pdf` eller `*.docx` utenfor `testdata/` (NFR-2)

**Gitt** produksjonen
**Når** `annonse-med-instruks.txt` analyseres, og ruten kalles direkte med for lang tekst
**Så** følges ikke instruksen, og den lange teksten avvises med `for_lang_tekst` (NFR-9)
**Og** hvert feiltilfelle i FR-22 gir en norsk melding uten krasj og uten tap av data (SM-7)

**Gitt** den endelige versjonen
**Når** hele flyten testes med tastatur alene, med NVDA og Firefox eller Chrome, med VoiceOver og Safari, i 320 px og 360 px bredde og med 200 % tekstzoom
**Så** kan alt gjøres uten mus, alle felt har synlige etiketter, fanene og meldingene leses opp riktig, og ingenting gir sidelengs rulling (NFR-8)
**Og** funnene og eventuelle avvik er notert i sesjonsloggen

### Story 5.3: Medstudenttest og verifiseringstabellen

Som sensor,
vil jeg kunne starte appen etter README-en og følge sporet fra krav til kode,
slik at jeg kan vurdere prosjektet uten hjelp fra gruppen.

**Realiserer:** SM-6, SM-9, NFR-7, NFR-10, FR-23 til FR-26

**Akseptansekriterier:**

**Gitt** README-en med den publiserte adressen og høyst tre kommandoer
**Når** en medstudent utenfor gruppen kloner repoet på en maskin uten prosjektet og uten API-nøkkel
**Så** starter appen i demomodus, *Prøv med eksempel* viser alle resultatdelene som er bygget, og kontrollsteget virker med medstudentens egen CV (SM-6)
**Og** det som var uklart i README-en, er rettet

**Gitt** tabellen «Verifisering per krav» i PRD §8
**Når** hver konsekvens som kan testes i FR-1 til FR-27 og NFR-1 til NFR-10, er verifisert på den måten tabellen sier
**Så** er resultatet notert i sesjonsloggen med bestått, ikke bestått eller kuttet (for krav som ble kuttet etter §7.2) per krav (SM-9)

**Gitt** sporet fra brief via PRD og stories til kode
**Når** tre stories trekkes som stikkprøve
**Så** kan hver følges til FR-ID-ene, testene som har FR-ID i navnet, og commits som viser til storyen (NFR-10)
