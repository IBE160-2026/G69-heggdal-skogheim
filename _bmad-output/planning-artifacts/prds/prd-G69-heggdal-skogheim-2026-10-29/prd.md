---
title: AI CV & Job Application Assistant — PRD
status: draft
created: 2026-10-29
updated: 2026-10-29
authors: Sondre Skogheim, Kevin Heggdal
course: IBE160 Programmering med KI, Høgskolen i Molde
source_brief: _bmad-output/planning-artifacts/briefs/brief-G69-heggdal-skogheim-2026-09-17/brief.md (revidert 2026-10-27)
---

# PRD: AI CV & Job Application Assistant

> **Utkast, godkjent innhold.** Sondre og Kevin har lest og godkjent den reviderte briefen og hele dette utkastet (2026-10-29). Valgene merket `[bekreftet antakelse]` ble tatt på hurtigsporet og er bekreftet av begge. De er samlet i §11, og begrunnelsene står i `.memlog.md`. PRD-en settes til `final` etter Finalize.

## 0. Om dokumentet

PRD-en bygger på den reviderte produktbriefen fra 27. oktober, faglærers tilbakemelding fra 6. oktober, research og brainstorming, og testsettet i `testdata/`. Den gjentar ikke briefen, men gjør den om til krav som kan testes.

PRD-en har tre typer lesere:
- **Gruppen** bruker den når den lager stories (`bmad-create-epics-and-stories`), UX (`bmad-ux`) og arkitektur (`bmad-architecture`).
- **Sensor** skal kunne følge sporet brief → PRD → stories → kode.
- **KI-agenter** som implementerer stories, skal bruke ordene fra ordlisten (§3) nøyaktig.

Alle krav har faste ID-er: UJ (brukerreise), FR (funksjonelt krav), NFR (ikke-funksjonelt krav) og SM (suksessmål). §8 viser hvilke krav som dekker hvert av briefens suksesskriterier. Teknologiforslag står i `addendum.md` og avgjøres i arkitekturfasen.

## 1. Visjon

Studenter og unge jobbsøkere har ofte mer relevant erfaring enn de selv ser. En deltidsjobb i butikk viser kundebehandling, og et verv som kasserer viser kontanthåndtering. AI CV & Job Application Assistant viser dem dette. Brukeren laster opp CV-en og limer inn en stillingsannonse. Appen viser krav for krav hva CV-en dekker, hva den delvis dekker og hva som mangler, og lager et søknadsbrev og konkrete forslag som bare bygger på det som faktisk står i CV-en.

Det som skiller verktøyet fra Jobscan, Teal og lignende, er ikke flere funksjoner. Det er ærlighet og gjennomsiktighet på norsk. Verktøyet dikter aldri opp kvalifikasjoner, og hver vurdering viser hvilken tekst i CV-en den bygger på. Treffprosenten regnes ut i kode og forklares. Det er brukeren som bestemmer, og alt KI-en lager er forslag som kan redigeres.

Verktøyet krever ingen konto og lagrer ingenting. Brukeren får vite før opplasting at CV-teksten sendes til en ekstern språkmodell, og alt slettes når økten er over.

## 2. Målgruppe

### 2.1 Jobs To Be Done
- **Funksjonelt:** Forstå hva en stillingsannonse faktisk ber om, og se hvilke av mine erfaringer som dekker hvert krav.
- **Funksjonelt:** Få et utkast til søknadsbrev for akkurat denne stillingen på minutter, ikke en time.
- **Emosjonelt:** Være trygg på at søknaden ikke overdriver eller lyver. Jeg skal kunne stå inne for alt i et intervju.
- **Emosjonelt:** Være trygg på at CV-en min ikke lagres eller spres.
- **Læring:** Forstå hva arbeidsgivere ser etter, slik at neste søknad blir bedre også uten verktøyet.

### 2.2 Ikke-brukere (v1)
- Karriereveiledere og rekrutterere. De ble fjernet som sekundær målgruppe i briefen.
- Erfarne jobbsøkere med lange CV-er og lederroller. De kan bruke verktøyet, men det er ikke tilpasset dem.
- Søkere som skriver på andre språk enn norsk bokmål.

### 2.3 Brukerreiser

**UJ-1. Ida finner ut at butikkjobben teller.**
Ida (21) studerer økonomi og vil søke sommerjobb som kundebehandler i Sparebanken Testvik. Hun åpner appen på laptopen og trenger ikke logge inn. Over opplastingsfeltet står det kort at CV-teksten sendes til en ekstern språkmodell og ikke lagres. Hun laster opp CV-en som PDF og limer inn annonsen. I kontrollsteget ser hun teksten appen har lest inn. Hun retter en linje som ble feil, krysser av for at hun har forstått informasjonen og trykker *Analyser*.

Etter noen sekunder åpnes fanen *Gap-analyse og nøkkelord*:
- «Kundeorientert» er **Oppfylt**, med sitat fra butikkjobben.
- «Kontanthåndtering» er **Oppfylt**, med sitat fra kasserervervet.
- «Gode digitale ferdigheter» er **Delvis oppfylt**, med en kort forklaring.
- «AFR-sertifisering» er **Mangler**, med et ærlig råd om å nevne at hun er villig til å ta den.

Treffprosenten viser hvilke nøkkelord som er funnet og hvilke som mangler. **Høydepunktet** er at Ida skjønner at hun dekker mer enn hun trodde, og hvorfor.

Hun åpner fanen *Søknadsbrev*. Brevet genereres der og da, nevner butikkjobben og vervet og påstår ikke at hun har AFR. Under brevet står en liste over hvilke deler av CV-en det bygger på. Hun endrer en setning og kopierer brevet. **Avslutning:** Hun lukker fanen, og ingenting ligger igjen.

**Kanttilfelle:** Hvis språkmodellen ikke svarer, ser Ida en norsk feilmelding og en *Prøv igjen*-knapp. CV-teksten og annonsen ligger fortsatt i feltene.

**UJ-2. Jonas laster opp en CV med to kolonner.**
Jonas er IT-student og har en PDF-CV med to kolonner som han har laget i et designverktøy. Han skal søke på en stilling som IT-supportmedarbeider. I kontrollsteget ser han at venstre kolonne (ferdigheter) kommer før høyre kolonne (erfaring), og at ingen setninger er flettet sammen. Han analyserer.

Annonsen krever førerkort klasse B og ITIL. Ingen av delene står i CV-en, så begge får **Mangler**. Verken brevet eller CV-forslagene nevner førerkort eller ITIL som noe han har.

**Kanttilfelle:** Hvis PDF-en er skannet og nesten ikke gir tekst, får Jonas beskjed om dette. Han får forslag om å lime inn CV-teksten selv, og han kan gjøre det i samme felt.

**UJ-3. Marit, sensor, kjører appen uten nøkkel.**
Marit vurderer prosjektet. Hun kloner det offentlige repoet og følger README-en, og har ingen API-nøkkel. Appen starter i **demomodus**, og et banner forteller det. Hun trykker *Prøv med eksempel*. Idas fiktive CV og annonse (testpar 1) lastes inn. Alle fire resultatdelene vises fra lagrede svar, og treffprosenten regnes ut i kode akkurat som i vanlig drift. Hun kan redigere og kopiere tekst og prøve kontrollsteget med sin egen fil. Når hun trykker *Analyser* på en egen CV, forklarer appen at full analyse krever en API-nøkkel.

## 3. Ordliste

Disse ordene brukes nøyaktig likt i PRD, stories og kode. Det skal ikke brukes synonymer.

- **Økt.** Det som skjer fra appen åpnes til fanen lukkes eller brukeren trykker *Ny analyse*. Data finnes bare i minnet i løpet av økten.
- **CV-fil.** Filen brukeren laster opp: PDF, DOCX eller TXT.
- **CV-tekst.** Teksten som leses ut av CV-filen eller limes inn. Analysen bruker CV-teksten slik den står etter kontrollsteget.
- **Annonse.** Teksten fra stillingsannonsen, limt inn av brukeren.
- **Kontrollsteg.** Steget der brukeren ser og kan rette CV-teksten før analysen starter.
- **Krav.** Én kvalifikasjon eller ett ønske som er hentet ut av annonsen.
- **Kategori.** Vurderingen av ett krav. Den er alltid én av tre: **Oppfylt**, **Delvis oppfylt** eller **Mangler**.
- **Belegg.** Et ordrett utdrag fra CV-teksten som en vurdering eller et forslag bygger på.
- **Nøkkelord.** Et sentralt ord eller uttrykk fra annonsen, hentet ut av språkmodellen.
- **Treffprosent.** Andelen nøkkelord som finnes i CV-teksten. Den regnes ut deterministisk i kode (FR-12).
- **Resultatdel.** Én av de fire fanene: *Gap-analyse og nøkkelord*, *Søknadsbrev*, *CV-forbedringer* og *ATS-forslag*.
- **Generering.** Ett kall til språkmodellen som lager innholdet i én resultatdel.
- **Kjøring.** Alle genereringene for ett par av CV-tekst og annonse. En full kjøring er fire genereringer.
- **Demomodus.** Driftsmodus når API-nøkkel mangler. Resultatene kommer da fra lagrede svar.
- **Demoeksempel.** Den fiktive CV-en og annonsen som demomodus bruker (testpar 1).
- **Testpar.** En fiktiv CV, en annonse og en fasit i `testdata/`.
- **Fasit.** Forventet kategori per krav, forventede nøkkelord, forventet treffprosent og forbudte påstander for ett testpar.
- **Forbudt påstand.** En kvalifikasjon som ikke står i CV-en og som aldri skal presenteres som noe brukeren har.
- **Sjekkliste.** `testdata/sjekkliste.md`, den manuelle kvalitetskontrollen per testpar.

## 4. Funksjoner

Funksjonene står i den rekkefølgen de bygges. Et trinn påbegynnes først når det forrige fungerer (briefens prioritering): **4.1 og 4.7 er grunnmuren**, så kommer **4.2**, så **4.3** og til slutt **4.4**. Feilhåndtering (4.6) og redigering (4.5) bygges sammen med hvert trinn.

### 4.1 Innlesing og kontrollsteg (grunnmur)

**Beskrivelse:** Startsiden har et felt for CV-filen, et tekstfelt for annonsen og informasjon om personvern. CV-filen leses ut til CV-tekst. Før analysen ser brukeren CV-teksten i kontrollsteget og kan rette den. Kontrollsteget er hovedforsvaret mot feil innlesing av kolonner og tabeller, fordi brukeren alltid ser det språkmodellen får. Realiserer UJ-1, UJ-2 og UJ-3.

#### FR-1: Laste opp CV-fil
Brukeren kan laste opp en CV-fil i formatene PDF, DOCX eller TXT, på maks 5 MB. `[bekreftet antakelse]`
- Andre formater og større filer avvises før innlesing, med en norsk melding som sier hvilke formater og hvilken størrelse som er lov.
- Brukeren kan i stedet lime CV-teksten direkte inn i tekstfeltet i kontrollsteget.

#### FR-2: Lese ut tekst, også fra PDF med to kolonner
Systemet leser ut CV-teksten fra CV-filen. Ved to kolonner leses hver kolonne ferdig ovenfra og ned før neste kolonne. Realiserer UJ-2.
- For testparet med to kolonner (testpar 4, se §10, punkt 3) finnes alle linjene fra fasiten i CV-teksten. Ingen setninger fra ulike kolonner er flettet sammen.
- For DOCX- og TXT-versjonene av testparene er CV-teksten lik `cv.txt`. Mellomrom og linjeskift regnes ikke med i sammenligningen.
- Innholdet i CV-filen sendes ikke til serveren. Bare CV-teksten sendes, og først når brukeren trykker *Analyser*. `[bekreftet antakelse]`

#### FR-3: Kontrollsteg
Brukeren ser CV-teksten i et redigerbart felt før analysen og kan endre den.
- Analysen bruker CV-teksten slik den står i feltet når brukeren trykker *Analyser*.
- Er CV-teksten kortere enn 300 tegn, får brukeren en advarsel. Den sier at filen kan være skannet eller tom, og foreslår å lime inn teksten. Ingen OCR i v1. `[bekreftet antakelse]`

#### FR-4: Legge inn annonse
Brukeren kan lime inn annonsen i et tekstfelt.
- Annonsen må være mellom 200 og 8 000 tegn, og CV-teksten maks 15 000 tegn. Utenfor grensene vises en norsk melding, og *Analyser* er deaktivert. `[bekreftet antakelse]`

#### FR-5: Informasjon om personvern og bekreftelse
Over feltene står en kort tekst som forklarer tre ting:
- CV-teksten sendes til en ekstern språkmodell (leverandør og land oppgis).
- Ingenting lagres etter økten.
- Brukeren bør fjerne personnummer, adresse, bilde og helseopplysninger.

Brukeren må krysse av for at informasjonen er forstått før den første analysen i økten.
- *Analyser* er deaktivert til brukeren har krysset av. Avkrysningen gjelder resten av økten.

#### FR-6: Maskere fødselsnummer
Systemet erstatter sekvenser med 11 sammenhengende sifre i CV-teksten med `[fødselsnummer fjernet]` før teksten sendes. `[bekreftet antakelse]`
- Maskeringen vises i kontrollsteget, så brukeren ser hva som sendes.
- En enhetstest bekrefter at 11 sifre maskeres, mens 8-sifrede telefonnumre og årstall ikke maskeres.

### 4.2 Gap-analyse og nøkkelord

**Beskrivelse:** Første generering i en kjøring. Den henter ut alle krav og nøkkelord fra annonsen og gir hvert krav en kategori med belegg. Systemet kontrollerer i kode at hvert belegg faktisk står i CV-teksten. Treffprosenten regnes ut i kode, ikke av språkmodellen. Realiserer UJ-1 og UJ-2.

#### FR-7: Hente ut alle krav
Systemet henter ut alle krav i annonsen, både «krav» og «ønsker», og viser dem i en liste.
- For hvert testpar er hvert krav i fasiten med.

#### FR-8: Sette kategori med belegg
Hvert krav får én kategori etter denne regelen:
- **Oppfylt:** CV-teksten har konkret erfaring, utdanning eller dokumentasjon som direkte dekker kravet. Belegget vises.
- **Delvis oppfylt:** CV-teksten har overførbar eller beslektet erfaring, eller kravet står bare som egenvurdering (for eksempel «nøyaktig» i profilen). Belegget vises, sammen med én setning om hvorfor kravet bare er delvis oppfylt. `[bekreftet antakelse]`
- **Mangler:** Det finnes ikke belegg.
- **Ved tvil velges den svakeste kategorien.**

Konsekvenser som kan testes:
- Ingen krav får høyere kategori enn i fasiten.
- Krav med **Mangler** i fasiten får alltid **Mangler**.
- Høyst ett krav per testpar får ett hakk lavere kategori enn i fasiten. `[bekreftet antakelse]`

#### FR-9: Kontrollere belegg i kode
Systemet kontrollerer at hvert belegg finnes ordrett i CV-teksten. Store og små bokstaver, mellomrom og linjeskift regnes ikke med. Mangler belegget, settes kravet til **Mangler** og merkes «nedgradert: fant ikke belegg i CV-en». `[bekreftet antakelse]`
- Enhetstester dekker tre tilfeller: sitat som finnes, sitat som er litt omskrevet (skal avvises) og sitat med andre linjeskift (skal godtas).

#### FR-10: Ærlige råd ved Mangler
For hvert krav med **Mangler** gir systemet et ærlig råd, for eksempel å vise vilje til å lære eller å peke på beslektet erfaring.
- Ingen råd foreslår å påstå kvalifikasjonen. Dette kontrolleres mot forbudte påstander i fasiten.

#### FR-11: Hente ut nøkkelord
Systemet henter ut nøkkelordene fra annonsen.
- For hvert testpar er minst 80 % av de forventede nøkkelordene i fasiten med.

#### FR-12: Regne ut treffprosent i kode
Systemet regner ut treffprosenten deterministisk og viser for hvert nøkkelord om det er funnet eller ikke.
- **Matcheregel:** Både CV-teksten og nøkkelordet gjøres om til små bokstaver, og tegnsetting (også bindestrek) erstattes med mellomrom før teksten deles i ord. Et nøkkelord er funnet når et ord i CV-teksten begynner med nøkkelordet. Det gir treff på bøyningsformer og sammensatte ord der nøkkelordet er første ledd (*kundeservice* treffer *kundeservicen* og *kundeservicemedarbeider*). Et nøkkelord med flere ord er funnet når alle ordene finnes. `[bekreftet antakelse]`
- Treffprosenten er antall funnet delt på antall nøkkelord, rundet til nærmeste hele prosent.
- Enhetstester med nøkkelordene fra hver fasit gir den forventede treffprosenten. Forventet treffprosent legges inn i hver `fasit.md`.
- Prosenten som vises, er lik prosenten koden regner ut.

#### FR-13: Merke treffprosenten som veiledende
Ved treffprosenten står det at den er veiledende og ikke en score fra et ATS-system. Det står også at nøkkelord bare bør legges til når CV-en har dekning for dem.

### 4.3 Søknadsbrev

**Beskrivelse:** Brevet genereres første gang brukeren åpner fanen. Det bygger på gap-analysen og CV-teksten. Brevet skal være nøkternt og konkret og høres ut som en ung søker som skriver godt, ikke som en KI. Realiserer UJ-1.

#### FR-14: Generere søknadsbrev
Systemet lager et søknadsbrev på bokmål for stillingen og arbeidsgiveren i annonsen.
- Brevet er 250–400 ord.
- Det nevner minst tre konkrete krav fra annonsen og minst to konkrete erfaringer fra CV-teksten.
- Stilling og arbeidsgiver er riktige.
- Navn og kontaktinformasjon står som plassholdere, for eksempel `[Ditt navn]`, og hentes ikke fra CV-en. `[bekreftet antakelse]`

#### FR-15: Brevet bygger bare på belegg
Brevet presenterer bare krav med **Oppfylt** eller **Delvis oppfylt** som kvalifikasjoner. Krav med **Mangler** kan bare nevnes som motivasjon for å lære. Under brevet står listen «Bygger på» med beleggene som er brukt. Beleggene kontrolleres som i FR-9, og belegg uten treff fjernes fra listen og merkes.
- Ingen forbudte påstander står i brevet, i noen av kjøringene i SM-2.

### 4.4 CV-forbedringer og ATS-forslag

**Beskrivelse:** To resultatdeler som genereres første gang fanen åpnes. Begge foreslår endringer i det som allerede står i CV-en, aldri nytt innhold.

#### FR-16: CV-forbedringer
Systemet gir konkrete forslag til omformulering, rekkefølge eller presisering. Hvert forslag peker på en bestemt del av CV-teksten med belegg som kontrolleres som i FR-9.
- Ingen forslag legger til erfaring, ferdigheter eller tall som ikke står i CV-teksten.

#### FR-17: ATS-forslag
Systemet gir konkrete ATS-forslag om format, seksjonsoverskrifter og ordvalg. Nøkkelord som mangler, foreslås bare der kravet er **Oppfylt** eller **Delvis oppfylt**.
- Hvert forslag er konkret nok til å kunne utføres, for eksempel «Endre overskriften "Jobber" til "Arbeidserfaring"», ikke «Optimaliser for ATS».

### 4.5 Redigering, ny generering og kopiering

#### FR-18: Redigere alt
All tekst i resultatdelene vises i redigerbare felt, og brukerens endringer blir stående til økten avsluttes.

#### FR-19: Generere én resultatdel på nytt
Brukeren kan generere én resultatdel på nytt. Det er én generering.
- Har brukeren redigert resultatdelen, ber systemet om bekreftelse før teksten overskrives.
- Genereres gap-analysen på nytt, merkes de andre genererte resultatdelene «basert på forrige analyse», med tilbud om å generere dem på nytt.

#### FR-20: Kopiere
Hver resultatdel har en knapp som kopierer innholdet slik det står etter redigering.

#### FR-21: Ny analyse
Knappen *Ny analyse* tømmer CV-teksten, annonsen og alle resultatdeler i økten, etter at brukeren har bekreftet.

### 4.6 Feilhåndtering

#### FR-22: Forståelige feilmeldinger uten tap av data
Ved feil får brukeren en melding på norsk om hva som gikk galt og hva brukeren kan gjøre. CV-teksten, annonsen og redigerte resultater beholdes. Tilfellene er:
- fil som ikke kan leses
- for stor fil eller feil format
- for lang eller for kort tekst
- feil eller tidsavbrudd fra språkmodellen
- grense for bruk nådd (NFR-3)
- ugyldig svar fra språkmodellen

Konsekvenser som kan testes:
- Hvert tilfelle kan fremkalles i test, med mock eller med fil fra testsettet. Appen krasjer ikke.
- Ved feil eller tidsavbrudd fra språkmodellen vises en *Prøv igjen*-knapp.

### 4.7 Demomodus (grunnmur)

**Beskrivelse:** Sensor og utviklere skal kunne bruke hele flyten uten API-nøkkel. Realiserer UJ-3.

#### FR-23: Starte i demomodus automatisk
Mangler API-nøkkelen, starter appen i demomodus og viser et banner som sier det.

#### FR-24: Alle resultatdeler i demomodus
I demomodus kan brukeren laste inn demoeksempelet og se alle fire resultatdelene fra lagrede svar. Treffprosenten regnes ut i kode (FR-12). Redigering, ny generering (av lagret svar) og kopiering fungerer.

#### FR-25: Prøv med eksempel
Knappen *Prøv med eksempel* finnes også når API-nøkkelen er satt, og bruker de lagrede svarene uten kall til språkmodellen.

#### FR-26: Egen CV i demomodus
I demomodus fungerer innlesing og kontrollsteget for egne CV-filer. Trykker brukeren *Analyser*, forklarer appen at full analyse krever API-nøkkel, og tilbyr demoeksempelet.

## 5. Ikke-funksjonelle krav

- **NFR-1 Personvern og lagring.** Ingen data fra økten skrives til database, disk eller nettleserlagring (localStorage, IndexedDB og cookies). CV-tekst, annonse, prompter og resultater skrives ikke til logger. Bare metadata som status, varighet og antall tokens logges.
  - *Test:* gjennomgang av koden og et søk i loggen etter tekst fra testparene etter en kjøring.
- **NFR-2 Hemmeligheter.** API-nøkkelen finnes bare som miljøvariabel på serveren: i Vercel i produksjon og i en `.env` som Git ignorerer, lokalt. Repoet har bare `.env.example` og fiktive testdata.
  - *Test:* nøkkelen og prefikset finnes ikke i JavaScript-koden som sendes til nettleseren eller i Git-historikken.
- **NFR-3 Kostnad og misbruk.** Grensene er `[bekreftet antakelse]`:
  - En full kjøring er maks fire genereringer.
  - Kostnaden per kjøring er mål 1 kr eller mindre.
  - Det offentlige nettstedet har forbruksgrense hos leverandøren (semesterbudsjett 200 kr), en grense per IP-adresse (30 genereringer per time) og en daglig total grense.
  - Når en grense er nådd, gjelder FR-22.
- **NFR-4 Ytelse.** Grensene er `[bekreftet antakelse]`:
  - Gap-analysen er ferdig innen 30 sekunder for alle testparene.
  - Brukeren ser at noe skjer innen 2 sekunder etter å ha trykket *Analyser*.
  - Ingen forespørsel til serveren er større enn Vercels grense på 4,5 MB.
- **NFR-5 Språk.** Grensesnitt og innhold fra KI-en er på naturlig bokmål, uten svenske eller danske ord og uten direkte oversatt engelsk.
  - *Test:* sjekklisten, punktet «Gjennomgående».
- **NFR-6 Testbarhet.**
  - Alle prompter og kall til språkmodellen ligger i én modul.
  - De lagrede svarene fra demomodus brukes også som mock i automatiske tester.
  - Treffprosent (FR-12), kontroll av belegg (FR-9) og maskering (FR-6) har enhetstester.
  - Testene kjører uten API-nøkkel.
- **NFR-7 Kjørbarhet for sensor.** Fra en fersk klone kan appen startes i demomodus etter README-en med høyst tre kommandoer. Den publiserte Vercel-adressen står i README-en.
- **NFR-8 Tilgjengelighet og plattform.**
  - Webapp for oppdaterte versjoner av Chrome, Firefox, Edge og Safari, på PC og mobil ned til 360 px bredde.
  - Alt kan brukes med tastatur, felt har synlige etiketter, og fanene er tilgjengelige for skjermlesere.

## 6. Rammer

- **Publisering:** Bare Vercel er tillatt. Teknologien må være noe Vercel støtter: Vite/React, Next.js, Node/Express eller Python Flask/FastAPI. Valget tas i arkitekturfasen. Se forslaget i `addendum.md`.
- **Offentlig repo:** Ingen nøkler og ingen ekte CV-er i koden eller historikken.
- **Valg av leverandør av språkmodell** gjøres i arkitekturfasen ut fra disse kriteriene, i prioritert rekkefølge:
  1. API-data brukes ikke til trening, og det finnes en databehandleravtale
  2. kvalitet på norsk bokmål
  3. kostnad per kjøring (NFR-3)
  4. støtte for strukturert svar (JSON), som FR-9 trenger
  
  Leverandør og land skal stå i informasjonsteksten (FR-5). Begrunnelsen brukes i refleksjonsrapporten.
- **Tredjelandsoverføring:** En leverandør i USA betyr overføring av personopplysninger ut av EØS. Det skal stå tydelig i informasjonsteksten, og datamengden holdes nede (FR-2, FR-6).

## 7. Ikke-mål og avgrensning av MVP

### 7.1 Ikke-mål (v1)
- Kontoer, innlogging og varig lagring av søknader. Lagring kan bli en senere utvidelse.
- Eksport til PDF eller DOCX. Brukeren kopierer teksten.
- Jobbsporing, automatisk jobbsøk, intervjuforberedelse og integrasjon med LinkedIn eller jobbportaler.
- Andre språk enn norsk bokmål, både i grensesnittet og i CV-er og annonser.
- Annonse lastet opp som fil eller lenke. Bare innlimt tekst.
- OCR av skannede PDF-er.
- Valg av tone eller mal for søknadsbrevet. Én nøktern tone. `[bekreftet antakelse]`
- Ingen «ATS-score» eller sammenligning med andre søkere.

### 7.2 MVP
Med i MVP er alt i §4 og §5, i rekkefølgen grunnmur (4.1, 4.7) → 4.2 → 4.3 → 4.4. Er tiden knapp, kuttes det fra slutten: FR-17 (ATS-forslag) først, deretter FR-16 (CV-forbedringer). FR-1 til FR-15 og FR-18 til FR-26 er kjernen.

## 8. Suksessmål

**Primære**
- **SM-1 Sjekklisten bestått.** Alle punktene i sjekklisten er bestått for alle testpar, minst fire par (§10, punkt 3). Resultatet noteres i sesjonsloggen sammen med commit-versjon. Validerer FR-7 til FR-17.
- **SM-2 Ingen oppdiktning.** Ingen forbudte påstander i noen resultatdel, testet med tre kjøringer per testpar fordi resultatene fra språkmodellen varierer. Validerer FR-9, FR-10, FR-15 og FR-16.
- **SM-3 Riktig kategori.** I alle kjøringene i SM-2 gjelder konsekvensene i FR-8: ingen krav over fasit, og Mangler er alltid Mangler. Validerer FR-8 og FR-9.
- **SM-4 Nøkkelord og treff.** Minst 80 % av de forventede nøkkelordene er hentet ut, og enhetstestene for treffprosent er grønne. Validerer FR-11 og FR-12.

**Sekundære**
- **SM-5 To kolonner.** Testpar 4 leses inn uten at tekst går tapt eller flettes. Validerer FR-2.
- **SM-6 Kjørbar uten nøkkel.** Kevin starter appen i demomodus på en ren maskin etter README-en, med høyst tre kommandoer. Validerer FR-23 til FR-26 og NFR-7.
- **SM-7 Robusthet.** Hvert feiltilfelle i FR-22 gir en norsk melding uten krasj og uten at data går tapt. Validerer FR-22.
- **SM-8 Kostnad.** Målt kostnad per full kjøring er 1 kr eller mindre, og det totale forbruket holder seg innenfor budsjettet. Validerer NFR-3.

**Motmål (skal ikke optimaliseres)**
- **SM-C1 Høy treffprosent.** Skal ikke presses opp med nøkkelordstapping eller løsere matching. Den skal være ærlig. Motvekt til SM-4.
- **SM-C2 Overbevisende brev.** Et brev som «selger mer» ved å overdrive, er en feil. Sannhet går foran overbevisning. Motvekt til SM-1.
- **SM-C3 Antall forslag.** Flere CV- og ATS-forslag er ikke bedre. Få konkrete forslag med belegg slår mange generelle.

**Sporbarhet fra briefens suksesskriterier**

| Briefkriterium | Dekkes av |
|---|---|
| 1 Hele flyten fungerer | UJ-1, SM-1 |
| 2 Sjekklisten bestått (brev: ≥3 krav, ≥2 erfaringer) | SM-1, FR-14 |
| 3 Ingenting diktet opp | SM-2, FR-9, FR-15, FR-16 |
| 4 Mangler aldri Oppfylt | SM-3, FR-8 |
| 5 Treffprosent i enhetstest | SM-4, FR-12 |
| 6 Alt kan redigeres | FR-18 |
| 7 PDF med to kolonner uten tap | SM-5, FR-2 |
| 8 Forståelig feilmelding, ingen krasj | SM-7, FR-22 |
| 9 Kan kjøres uten nøkkel | SM-6, FR-23 til FR-26 |

## 9. Risikoer

| Risiko | Tiltak |
|---|---|
| KI-en dikter opp kvalifikasjoner | Belegg kontrolleres i kode (FR-9), brevet bygger bare på belegg (FR-15), tvilsregelen (FR-8), forbudte påstander i fasit og tre kjøringer per testpar (SM-2) |
| PDF med to kolonner leses feil | Lesing kolonne for kolonne (FR-2), kontrollsteget (FR-3), testpar 4 (SM-5) |
| Kostnaden med fire genereringer | Genereringer først når fanen åpnes (§3 Kjøring), maks fire per kjøring, grenser og budsjett (NFR-3), mock i utvikling (NFR-6) |
| Noen misbruker gruppens nøkkel på den offentlige adressen | Forbruksgrense, grense per IP og daglig grense (NFR-3) |
| Sensor har ikke nøkkel | Demomodus (FR-23 til FR-26), NFR-7, SM-6 |
| Resultatene varierer mellom kjøringer | Tre kjøringer per testpar, lav temperatur (addendum) |

## 10. Åpne spørsmål

1. **Valg av leverandør og modell.** *Eier:* Sondre og Kevin. *Når:* i arkitekturfasen, før FR-7 implementeres. Kriteriene står i §6. Det må sjekkes direkte i vilkårene hvordan leverandøren lagrer og trener på API-data. Det er ikke verifisert ennå.
2. **Skisser av opplasting, resultatside og redigering.** Faglærer har bedt om dem, og design teller 10 %. *Eier:* gruppen. *Når:* i `bmad-ux`, før epics og stories.
3. ~~**Testpar 4 og DOCX.**~~ Løst 2026-10-29: `testdata/par-4-tokolonne-hotell/` (CV i PDF med to kolonner) og `testdata/par-1-butikk-bank/cv.docx`.
4. ~~**Forventet treffprosent i fasit.**~~ Løst 2026-10-29: lagt inn i hver `fasit.md` med utregning (par 1: 22 %, par 2: 11 %, par 3: 8 %, par 4: 33 %).
5. ~~**Godkjenning.**~~ Løst 2026-10-29: Kevin har lest og godkjent den reviderte briefen og dette utkastet, inkludert alle antakelsene i §11.
6. **Brukerinnsikt.** Ingen intervjuer er gjort ennå. Valgfritt: en rask test med to eller tre medstudenter på et testpar før søknadsbrevet bygges.
7. **Datatilsynet.** Sjekk om Datatilsynet har ny veiledning om generativ KI som påvirker informasjonsteksten i FR-5.

## 11. Antakelser (bekreftet)

Alle antakelsene ble tatt på hurtigsporet og er lest og bekreftet av Sondre og Kevin 2026-10-29, også matcheregelen i FR-12 med de kjente svakhetene som er dokumentert i `testdata/README.md`.

- **§4.1 FR-1:** Maks filstørrelse er 5 MB.
- **§4.1 FR-2:** Filen leses i nettleseren, og bare CV-teksten sendes.
- **§4.1 FR-3:** Advarsel ved under 300 tegn, ingen OCR.
- **§4.1 FR-4:** Grensene er 200–8 000 tegn for annonsen og maks 15 000 tegn for CV-teksten.
- **§4.1 FR-6:** Fødselsnummer maskeres automatisk.
- **§4.2 FR-8:** Grensen mellom Oppfylt og Delvis oppfylt (egenvurdering gir Delvis oppfylt), og regelen om at høyst ett krav kan ligge ett hakk under fasiten.
- **§4.2 FR-9:** Uten belegg nedgraderes kravet til Mangler.
- **§4.2 FR-12:** Matcheregelen med prefiks for norske bøyninger og sammensatte ord.
- **§4.3 FR-14:** Plassholdere for navn og kontaktinformasjon.
- **§3 Kjøring:** Fire genereringer, ikke fem. Resultatdelene genereres første gang fanen åpnes.
- **§5 NFR-3:** Grensene for kostnad og misbruk (1 kr per kjøring, 200 kr per semester, 30 genereringer per time per IP).
- **§5 NFR-4:** Målene for ytelse (30 s og 2 s).
- **§7.1:** Én tone på søknadsbrevet.
