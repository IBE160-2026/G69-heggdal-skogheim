---
title: AI CV & Job Application Assistant — PRD
status: final
created: 2026-10-29
updated: 2026-10-29
authors: Sondre Skogheim, Kevin Heggdal
course: IBE160 Programmering med KI, Høgskolen i Molde
source_brief: _bmad-output/planning-artifacts/briefs/brief-G69-heggdal-skogheim-2026-09-17/brief.md (revidert 2026-10-27)
---

# PRD: AI CV & Job Application Assistant

> **Ferdig (final), 2026-10-29.** Sondre og Kevin har lest og godkjent den reviderte briefen og utkastet til PRD-en. Valgene merket `[bekreftet antakelse]` ble tatt på hurtigsporet og er bekreftet av begge. Under Finalize ble funn fra gjennomgang og avstemming rettet. Valgene som ble tatt da, står for seg i §11 og bør leses av begge før stories lages. Begrunnelsene står i `.memlog.md`.

## 0. Om dokumentet

PRD-en bygger på den reviderte produktbriefen fra 27. oktober, faglærers tilbakemelding fra 6. oktober, research og brainstorming, og testsettet i `testdata/`. Den gjentar ikke briefen, men gjør den om til krav som kan testes.

PRD-en har tre typer lesere:
- **Gruppen** bruker den når den lager stories (`bmad-create-epics-and-stories`), UX (`bmad-ux`) og arkitektur (`bmad-architecture`).
- **Sensor** skal kunne følge sporet brief → PRD → stories → kode.
- **KI-agenter** som implementerer stories, skal bruke ordene fra ordlisten (§3) nøyaktig.

Alle krav har faste ID-er: UJ (brukerreise), FR (funksjonelt krav), NFR (ikke-funksjonelt krav) og SM (suksessmål). §8 viser hvilke krav som dekker hvert av briefens suksesskriterier, og hvordan hvert krav verifiseres. Teknologiforslag står i `addendum.md` og avgjøres i arkitekturfasen.

**Avvik fra briefen:** Briefen snakker om fem genereringer: gap-analyse, nøkkelord, søknadsbrev, CV-forbedringer og ATS-forslag. I PRD-en henter gap-analysen også ut nøkkelordene, så en full kjøring er fire genereringer (§3 Kjøring).

## 1. Visjon

Studenter og unge jobbsøkere har ofte mer relevant erfaring enn de selv ser. En deltidsjobb i butikk viser kundebehandling, og et verv som kasserer viser kontanthåndtering. AI CV & Job Application Assistant viser dem dette. Brukeren laster opp CV-en og limer inn en stillingsannonse. Appen viser krav for krav hva CV-en dekker, hva den delvis dekker og hva som mangler, og lager et søknadsbrev og konkrete forslag som bare bygger på det som faktisk står i CV-en.

Det som skiller verktøyet fra Jobscan, Teal og lignende, er ikke flere funksjoner. Det er ærlighet og gjennomsiktighet på norsk. Verktøyet dikter aldri opp kvalifikasjoner, og hver vurdering viser hvilken tekst i CV-en den bygger på. Treffprosenten regnes ut i kode og forklares. Det er brukeren som bestemmer, og alt språkmodellen lager er forslag som kan redigeres.

**Hvorfor ikke bare bruke en generell chatbot?** Med en generell chatbot må brukeren selv skrive gode instrukser, sjekke at ingenting er diktet opp og vite hva det er lurt å be om. Her er strukturen bygget inn: annonsen brytes ned krav for krav, hvert belegg kontrolleres i kode mot CV-teksten (FR-9), treffprosenten regnes ut i kode og ikke av språkmodellen (FR-12), fødselsnummer maskeres før sending (FR-6), og ingenting lagres (NFR-1).

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
Ida (21) studerer økonomi og vil søke sommerjobb som kundebehandler i Sparebanken Testvik. Hun åpner appen på laptopen og trenger ikke logge inn. Over opplastingsfeltet står det kort at CV-teksten sendes til en ekstern språkmodell og ikke lagres. Hun laster opp CV-en som Word-fil (DOCX) og limer inn annonsen. I kontrollsteget ser hun teksten appen har lest inn. Hun retter en linje som ble feil, krysser av for at hun har forstått informasjonen og trykker *Analyser*.

Etter noen sekunder åpnes fanen *Gap-analyse og nøkkelord*:
- «Kundeorientert» er **Oppfylt**, med belegg fra butikkjobben.
- «Kontanthåndtering» er **Oppfylt**, med belegg fra butikkjobben og kasserervervet.
- «Gode digitale ferdigheter» er **Delvis oppfylt**, med en kort forklaring.
- «AFR-autorisasjon» er **Mangler**, med et ærlig råd om å nevne at hun er villig til å ta den.

Treffprosenten viser hvilke nøkkelord som er funnet og hvilke som mangler. **Høydepunktet** er at Ida skjønner at hun dekker mer enn hun trodde, og hvorfor.

Hun åpner fanen *Søknadsbrev*. Brevet genereres der og da, nevner butikkjobben og vervet og påstår ikke at hun har AFR. Under brevet står en liste over hvilke deler av CV-en det bygger på. Hun endrer en setning og kopierer brevet. **Avslutning:** Hun lukker fanen, og ingenting ligger igjen.

**Kanttilfelle:** Hvis språkmodellen ikke svarer, ser Ida en norsk feilmelding og en *Prøv igjen*-knapp. CV-teksten og annonsen ligger fortsatt i feltene.

**UJ-2. Mina laster opp en CV med to kolonner.** (testpar 4)
Mina studerer reiselivsledelse og har en PDF-CV med to kolonner som hun har laget i et designverktøy. Hun skal søke deltidsjobb i resepsjonen på Hotell Testfjord. I kontrollsteget ser hun at hele venstre kolonne (kontakt, ferdigheter, språk og kurs) kommer før høyre kolonne (profil, utdanning og erfaring), og at ingen linjer er flettet sammen. Hun analyserer.

Annonsen ønsker erfaring med bookingsystemer, gjerne Opera. Det står ikke i CV-en, så kravet får **Mangler**. Annonsen krever også gode kunnskaper i engelsk og tysk. Mina har bare grunnleggende tysk, så kravet får **Delvis oppfylt**. Verken brevet eller CV-forslagene sier at hun kan Opera eller snakker godt tysk.

**Kanttilfelle:** Hvis PDF-en er skannet og nesten ikke gir tekst, får Mina beskjed om dette. Hun får forslag om å lime inn CV-teksten selv, og hun kan gjøre det i samme felt.

Testpar 2 (Jonas, IT-brukerstøtte med krav om førerkort og ITIL) og testpar 3 (Sara, regnskap med svake kvalifikasjoner) følger samme flyt som UJ-1 og er ikke skrevet ut som egne reiser.

**UJ-3. Marit, sensor, kjører appen uten nøkkel.**
Marit vurderer prosjektet. Hun kloner det offentlige repoet og følger README-en, og har ingen API-nøkkel. Appen starter i **demomodus**, og et banner forteller det. Hun trykker *Prøv med eksempel*. Idas fiktive CV og annonse (testpar 1) lastes inn. Alle fire resultatdelene vises fra lagrede svar, og treffprosenten regnes ut i kode akkurat som i vanlig drift. Hun kan redigere og kopiere tekst og prøve kontrollsteget med sin egen fil. Når hun trykker *Analyser* på en egen CV, forklarer appen at full analyse krever en API-nøkkel.

## 3. Ordliste

Disse ordene brukes nøyaktig likt i PRD, stories og kode. Det skal ikke brukes synonymer.

- **Økt.** Det som skjer fra appen åpnes til nettleserfanen lukkes eller siden lastes på nytt. Data finnes bare i minnet i løpet av økten. *Ny analyse* (FR-21) tømmer innholdet, men avslutter ikke økten.
- **Språkmodell.** Den eksterne KI-tjenesten som lager innholdet i resultatdelene. Kravene bruker dette ordet, ikke «KI-en».
- **CV-fil.** Filen brukeren laster opp: PDF, DOCX eller TXT.
- **CV-tekst.** Teksten som leses ut av CV-filen eller limes inn. Analysen bruker CV-teksten slik den står etter kontrollsteget.
- **Annonse.** Teksten fra stillingsannonsen, limt inn av brukeren.
- **Kontrollsteg.** Steget der brukeren ser og kan rette CV-teksten før analysen starter.
- **Krav.** Én kvalifikasjon eller ett ønske som er hentet ut av annonsen.
- **Analyse.** Det som starter når brukeren trykker *Analyser*: gap-analysen, som er første generering i en kjøring.
- **Kategori.** Vurderingen av ett krav. Den er alltid én av tre: **Oppfylt**, **Delvis oppfylt** eller **Mangler**.
- **Belegg.** Et ordrett utdrag fra CV-teksten som en vurdering eller et forslag bygger på.
- **Nøkkelord.** Et sentralt ord eller uttrykk fra annonsen, hentet ut av språkmodellen.
- **Treffprosent.** Andelen nøkkelord som finnes i CV-teksten. Den regnes ut deterministisk i kode (FR-12).
- **Resultatdel.** Én av de fire fanene: *Gap-analyse og nøkkelord*, *Søknadsbrev*, *CV-forbedringer* og *ATS-forslag*.
- **Generering.** Ett kall til språkmodellen som lager innholdet i én resultatdel.
- **Kjøring.** Genereringene for ett par av CV-tekst og annonse. Gap-analysen genereres når brukeren trykker *Analyser*. De tre andre resultatdelene genereres første gang brukeren åpner fanen deres. En full kjøring er derfor fire genereringer. Nye genereringer (FR-19) kommer i tillegg og telles mot grensene i NFR-3. `[bekreftet antakelse]`
- **Demomodus.** Driftsmodus når API-nøkkel mangler. Resultatene kommer da fra lagrede svar.
- **Demoeksempel.** Den fiktive CV-en og annonsen som demomodus bruker (testpar 1).
- **Testpar.** En fiktiv CV, en annonse og en fasit i `testdata/`.
- **Fasit.** Forventet kategori per krav, forventede nøkkelord, forventet treffprosent og forbudte påstander for ett testpar.
- **Forbudt påstand.** En kvalifikasjon som ikke står i CV-en og som aldri skal presenteres som noe brukeren har.
- **Sjekkliste.** `testdata/sjekkliste.md`, den manuelle kvalitetskontrollen per testpar.

## 4. Funksjoner

Funksjonene står i den rekkefølgen de bygges. Et trinn påbegynnes først når det forrige fungerer (briefens prioritering): **4.1 og 4.7 er grunnmuren**, så kommer **4.2**, så **4.3** og til slutt **4.4**. Feilhåndtering (4.6) og redigering (4.5) bygges sammen med hvert trinn. Den gjennomgående regelen i 4.8 gjelder alle resultatdelene.

### 4.1 Innlesing og kontrollsteg (grunnmur)

**Beskrivelse:** Startsiden har et felt for CV-filen, et tekstfelt for annonsen og informasjon om personvern. CV-filen leses ut til CV-tekst. Før analysen ser brukeren CV-teksten i kontrollsteget og kan rette den. Kontrollsteget er hovedforsvaret mot feil innlesing av kolonner og tabeller, fordi brukeren alltid ser det språkmodellen får. Realiserer UJ-1, UJ-2 og UJ-3.

#### FR-1: Laste opp CV-fil
Brukeren kan laste opp en CV-fil i formatene PDF, DOCX eller TXT, på maks 5 MB. `[bekreftet antakelse]`
- Andre formater og større filer avvises før innlesing, med en norsk melding som sier hvilke formater og hvilken størrelse som er lov.
- Brukeren kan i stedet lime CV-teksten direkte inn i tekstfeltet i kontrollsteget.

#### FR-2: Lese ut tekst, også fra PDF med to kolonner
Systemet leser ut CV-teksten fra CV-filen. Ved to kolonner leses hver kolonne ferdig ovenfra og ned før neste kolonne. Realiserer UJ-2.
- For `testdata/par-4-tokolonne-hotell/cv.pdf` finnes alle linjene i `cv.txt` i CV-teksten. Ingen linje blander tekst fra begge kolonnene, og «SPRÅK» og «KURS» (venstre kolonne) kommer før «PROFIL» (høyre kolonne).
- For DOCX- og TXT-versjonene av testparene er CV-teksten lik `cv.txt`. Mellomrom og linjeskift regnes ikke med i sammenligningen.
- Innholdet i CV-filen sendes ikke til serveren. Bare CV-teksten sendes, og først når brukeren trykker *Analyser*. `[bekreftet antakelse]`

#### FR-3: Kontrollsteg
Brukeren ser CV-teksten i et redigerbart felt før analysen og kan endre den.
- Analysen bruker CV-teksten slik den står i feltet når brukeren trykker *Analyser*.
- Er CV-teksten kortere enn 300 tegn, får brukeren en advarsel. Den sier at filen kan være skannet eller tom, og foreslår å lime inn teksten. Ingen OCR i v1. `[bekreftet antakelse]`
- Kontrollsteget er også forsvaret mot CV-er med tabeller: tekst som blir rotete, retter brukeren her.

#### FR-4: Legge inn annonse
Brukeren kan lime inn annonsen i et tekstfelt.
- Annonsen må være mellom 200 og 8 000 tegn, og CV-teksten maks 15 000 tegn. Utenfor grensene vises en norsk melding, og *Analyser* er deaktivert. `[bekreftet antakelse]`
- Grensene håndheves også på serveren (NFR-9).

#### FR-5: Informasjon om personvern og bekreftelse
Over feltene står en kort tekst som forklarer tre ting:
- CV-teksten sendes til en ekstern språkmodell (leverandør og land oppgis).
- Ingenting lagres etter økten.
- Brukeren bør fjerne fødselsnummer, adresse, bilde og helseopplysninger.
- IP-adressen brukes kortvarig til å begrense bruken (NFR-1, NFR-3).

Brukeren må krysse av for at informasjonen er forstått før den første analysen i økten.
- *Analyser* er deaktivert til brukeren har krysset av. Avkrysningen gjelder resten av økten.

#### FR-6: Maskere fødselsnummer
Systemet erstatter fødselsnumre i CV-teksten med `[fødselsnummer fjernet]` før teksten sendes. Et fødselsnummer er 11 sifre, eventuelt med mellomrom etter de seks første, der de seks første er en gyldig dato (DDMMÅÅ). `[bekreftet antakelse]`
- Maskeringen vises i kontrollsteget, så brukeren ser hva som sendes.
- En enhetstest bekrefter at «01019012345» og «010190 12345» maskeres, mens telefonnumre («400 00 001»), årstall, kontonumre («1234.56.78903») og 11 sifre uten gyldig dato («12345678903») ikke maskeres.

### 4.2 Gap-analyse og nøkkelord

**Beskrivelse:** Første generering i en kjøring. Den henter ut alle krav og nøkkelord fra annonsen og gir hvert krav en kategori med belegg. Systemet kontrollerer i kode at hvert belegg faktisk står i CV-teksten. Treffprosenten regnes ut i kode, ikke av språkmodellen. Realiserer UJ-1 og UJ-2.

#### FR-7: Hente ut alle krav
Systemet henter ut alle krav i annonsen, både «krav» og «ønsker», og viser dem i en liste.
- For hvert testpar er hvert krav i fasiten med. Et krav regnes som med når listen har et krav med samme innhold, også om ordlyden er en annen. Dette vurderes manuelt med sjekklisten.

#### FR-8: Sette kategori med belegg
Hvert krav får én kategori etter denne regelen:
- **Oppfylt:** CV-teksten har konkret erfaring, utdanning eller dokumentasjon som direkte dekker kravet. Belegget vises.
- **Delvis oppfylt:** CV-teksten har overførbar eller beslektet erfaring, eller kravet står bare som egenvurdering (for eksempel «nøyaktig» i profilen). Belegget vises, sammen med én setning om hvorfor kravet bare er delvis oppfylt. `[bekreftet antakelse]`
- **Mangler:** Det finnes ikke belegg.
- **Ved tvil velges den svakeste kategorien.**

Konsekvenser som kan testes:
- Ingen krav får høyere kategori enn i fasiten.
- Krav med **Mangler** i fasiten får alltid **Mangler**.
- Høyst ett krav per testpar får ett hakk lavere kategori enn i fasiten, også når det skyldes nedgradering i FR-9. `[bekreftet antakelse]`

#### FR-9: Kontrollere belegg i kode
Systemet kontrollerer at hvert belegg finnes ordrett i CV-teksten. Store og små bokstaver, mellomrom og linjeskift regnes ikke med. Mangler belegget, nedgraderes kravet ett hakk (**Oppfylt** blir **Delvis oppfylt**, og **Delvis oppfylt** blir **Mangler**) og merkes «nedgradert: fant ikke belegg i CV-en». Et nedgradert **Delvis oppfylt**-krav viser ikke belegget som ikke ble funnet. `[bekreftet antakelse; ett hakk avklart under Finalize]`
- Enhetstester dekker tre tilfeller: belegg som finnes, belegg som er litt omskrevet (skal avvises) og belegg med andre linjeskift (skal godtas).
- En enhetstest bekrefter at et **Oppfylt**-krav uten gyldig belegg blir **Delvis oppfylt**, ikke **Mangler**.

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
- Brevet er ikke generisk: det kunne ikke vært sendt uendret til en annen stilling, fordi det nevner krav og oppgaver som er spesifikke for denne annonsen. Vurderes med sjekklisten.
- Brevet høres ikke ut som det er skrevet av en språkmodell: det er sammenhengende tekst uten punktlister og uten tomme fraser som «dynamisk og resultatorientert», «i dagens konkurranseutsatte marked» eller «jeg brenner for». Vurderes med sjekklisten.

#### FR-15: Brevet bygger bare på belegg
Brevet presenterer bare krav med **Oppfylt** eller **Delvis oppfylt** som kvalifikasjoner. Krav med **Mangler** kan bare nevnes som motivasjon for å lære. Under brevet står listen «Bygger på» med beleggene som er brukt. Beleggene kontrolleres som i FR-9, og belegg uten treff fjernes fra listen og merkes.
- Selve brevteksten kontrolleres ikke automatisk. Den kontrolleres mot forbudte påstander i SM-2.
- Ingen forbudte påstander står i brevet, i noen av kjøringene i SM-2.

### 4.4 CV-forbedringer og ATS-forslag

**Beskrivelse:** To resultatdeler som genereres første gang fanen åpnes. Begge foreslår endringer i det som allerede står i CV-en, aldri nytt innhold.

#### FR-16: CV-forbedringer
Systemet gir konkrete forslag til omformulering, rekkefølge eller presisering. Hvert forslag peker på en bestemt del av CV-teksten med belegg som kontrolleres som i FR-9.
- Ingen forslag legger til noe som ikke står i CV-teksten (FR-27).
- Hvert forslag har én setning om hvorfor, knyttet til et krav eller nøkkelord i annonsen. Slik lærer brukeren hva arbeidsgivere ser etter.

#### FR-17: ATS-forslag
Systemet gir konkrete ATS-forslag om format, seksjonsoverskrifter og ordvalg. Et nøkkelord som ikke er funnet (FR-12), foreslås bare når CV-teksten har belegg for det, det vil si når det hører til et krav med **Oppfylt** eller **Delvis oppfylt**.
- Hvert forslag nevner en bestemt overskrift, linje eller et bestemt nøkkelord, for eksempel «Endre overskriften "Jobber" til "Arbeidserfaring"», ikke «Optimaliser for ATS».
- Hvert forslag har én setning om hvorfor, som i FR-16.

### 4.5 Redigering, ny generering og kopiering

#### FR-18: Redigere alt
All tekst i resultatdelene vises i redigerbare felt, og brukerens endringer blir stående til økten avsluttes.
- En endring gjelder bare den resultatdelen den gjøres i. Senere genereringer bygger på CV-teksten og den genererte gap-analysen, ikke på brukerens redigeringer. Treffprosenten endres ikke av redigering.

#### FR-19: Generere én resultatdel på nytt
Brukeren kan generere én resultatdel på nytt. Det er én generering.
- Har brukeren redigert resultatdelen, ber systemet om bekreftelse før teksten overskrives.
- Genereres gap-analysen på nytt, merkes de andre genererte resultatdelene «basert på forrige analyse», med tilbud om å generere dem på nytt.

#### FR-20: Kopiere
Hver resultatdel har en knapp som kopierer innholdet slik det står etter redigering.

#### FR-21: Ny analyse
Knappen *Ny analyse* tømmer CV-teksten, annonsen og alle resultatdeler, etter at brukeren har bekreftet. Økten fortsetter, så avkrysningen i FR-5 gjelder fortsatt.

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
I demomodus kan brukeren laste inn demoeksempelet og se alle fire resultatdelene fra lagrede svar. Treffprosenten regnes ut i kode (FR-12). Redigering og kopiering fungerer. Ny generering viser det lagrede svaret på nytt, uten kall til språkmodellen.

#### FR-25: Prøv med eksempel
Knappen *Prøv med eksempel* finnes også når API-nøkkelen er satt, og bruker de lagrede svarene uten kall til språkmodellen.

#### FR-26: Egen CV i demomodus
I demomodus fungerer innlesing og kontrollsteget for egne CV-filer. Trykker brukeren *Analyser*, forklarer appen at full analyse krever API-nøkkel, og tilbyr demoeksempelet.

### 4.8 Gjennomgående regel

#### FR-27: Ingen oppdiktning i noen resultatdel
Ingen resultatdel inneholder kvalifikasjoner, ferdigheter, utdanning, arbeidsgivere, årstall eller tall som ikke står i CV-teksten, med mindre de er presentert som noe brukeren mangler eller kan lære. Regelen gjelder gap-analysen (FR-10), søknadsbrevet (FR-14 og FR-15), CV-forbedringene (FR-16) og ATS-forslagene (FR-17).
- Kontrolleres mot forbudte påstander og punktet «Gjennomgående» i sjekklisten, i alle kjøringene i SM-2.

## 5. Ikke-funksjonelle krav

- **NFR-1 Personvern og lagring.** Ingen data fra økten skrives til database, disk eller nettleserlagring (localStorage, IndexedDB og cookies). CV-tekst, annonse, prompter og resultater skrives ikke til logger. Bare metadata som status, varighet og antall tokens logges. IP-adresser brukes bare til grensen per IP (NFR-3). De lagres hashet og slettes etter høyst én time.
  - *Test:* gjennomgang av koden og et søk i loggen etter tekst fra testparene etter en kjøring.
- **NFR-2 Hemmeligheter.** API-nøkkelen finnes bare som miljøvariabel på serveren: i Vercel i produksjon og i en `.env` som Git ignorerer, lokalt. Repoet har bare `.env.example` og fiktive testdata.
  - *Test:* nøkkelen og prefikset finnes ikke i JavaScript-koden som sendes til nettleseren eller i Git-historikken.
  - CV-filer (`*.pdf`, `*.docx`) er bare tillatt under `testdata/`. `.gitignore` blokkerer dem andre steder, og repoet sjekkes for ekte CV-er før innlevering.
- **NFR-3 Kostnad og misbruk.** Grensene er `[bekreftet antakelse]`:
  - En full kjøring er fire genereringer (§3 Kjøring). Nye genereringer telles mot grensen per IP.
  - Kostnaden per kjøring er mål 1 kr eller mindre.
  - Det offentlige nettstedet har forbruksgrense hos leverandøren (semesterbudsjett 200 kr), en grense per IP-adresse (30 genereringer per time) og en daglig total grense.
  - Når en grense er nådd, gjelder FR-22.
- **NFR-4 Ytelse.** Grensene er `[bekreftet antakelse]`:
  - Gap-analysen er ferdig innen 30 sekunder for alle testparene.
  - Brukeren ser at noe skjer innen 2 sekunder etter å ha trykket *Analyser*.
  - Ingen forespørsel til serveren er større enn Vercels grense på 4,5 MB.
- **NFR-5 Språk.** Grensesnitt og innhold fra språkmodellen er på naturlig bokmål, uten svenske eller danske ord og uten direkte oversatt engelsk.
  - *Test:* sjekklisten, punktet «Gjennomgående».
- **NFR-6 Testbarhet.**
  - Alle prompter og kall til språkmodellen ligger i én modul.
  - De lagrede svarene fra demomodus brukes også som mock i automatiske tester.
  - Treffprosent (FR-12), kontroll av belegg (FR-9) og maskering (FR-6) har enhetstester.
  - Tekstuttrekket har automatiske tester: `par-1-butikk-bank/cv.docx` og `par-4-tokolonne-hotell/cv.pdf` gir `cv.txt` (FR-2).
  - Én automatisk test kjører hele flyten for demoeksempelet med mock-klienten.
  - Testene kjører uten API-nøkkel.
- **NFR-7 Kjørbarhet for sensor.** Fra en fersk klone kan appen startes i demomodus etter README-en med høyst tre kommandoer. Den publiserte Vercel-adressen står i README-en.
- **NFR-8 Tilgjengelighet og plattform.**
  - Webapp for oppdaterte versjoner av Chrome, Firefox, Edge og Safari, på PC og mobil ned til 360 px bredde.
  - Alt kan brukes med tastatur, felt har synlige etiketter, og fanene er tilgjengelige for skjermlesere.
- **NFR-9 Upålitelig inndata.** CV-teksten og annonsen behandles som data, ikke som instrukser.
  - I promptene er CV-teksten og annonsen tydelig avgrenset, og språkmodellen får beskjed om å ignorere instrukser inne i dem.
  - Lengdegrensene i FR-4 og grensene i NFR-3 håndheves på serveren, ikke bare i nettleseren.
  - Svar fra språkmodellen valideres mot et skjema. Ugyldig svar gir FR-22.
  - Innhold fra språkmodellen vises som ren tekst, aldri som HTML.
  - *Test:* `testdata/robusthet/annonse-med-instruks.txt` (annonsen fra par 1 med en innplantet instruks) gir en vanlig gap-analyse der instruksen ikke er fulgt. Et direkte kall til serveren med for lang tekst avvises.
- **NFR-10 Sporbarhet og KI-styring.** Sensor skal kunne følge sporet brief → PRD → stories → kode.
  - Hver story viser til FR- og NFR-ID-ene den realiserer.
  - Tester og commit-meldinger viser til story eller FR der det er naturlig.
  - Beslutninger, også forslag fra KI som er forkastet, logges i memloggen (planarbeid) og i sesjonsloggen (`.logs/`).
  - Resultatet av hver kjøring av testsettet noteres i sesjonsloggen med commit-versjon (SM-1).

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
Med i MVP er alt i §4 og §5, i rekkefølgen grunnmur (4.1, 4.7) → 4.2 → 4.3 → 4.4. Er tiden knapp, kuttes det fra slutten: FR-17 (ATS-forslag) først, deretter FR-16 (CV-forbedringer). FR-1 til FR-15 og FR-18 til FR-27 er kjernen.

### 7.3 Vurderte ideer fra brainstormingen

| Idé | Beslutning | Grunn |
|---|---|---|
| «Hvorfor?»-forklaring per forslag | v1 (FR-16, FR-17) | Støtter læringsmålet i §2.1 |
| Markering av hvilke CV-linjer som dekker hvilke krav | v1 (belegg i FR-8) | Er kjernen i gjennomsiktigheten |
| Kopier-knapp per fane | v1 (FR-20) | Brukeren tar teksten med seg ved å kopiere |
| Tilgjengelighet | v1 (NFR-8) | Grunnkrav |
| Valg av tone på søknadsbrevet | Ikke i v1 (§7.1) | Én nøktern tone er enklere å teste |
| Advarsel når CV-en er kort | Delvis i v1 (FR-3, under 300 tegn) | Ellers vises korte CV-er ærlig i gap-analysen |
| Før/etter-visning av CV-forbedringer | Senere | Krever mer UI. Forslagene viser allerede belegget |
| Spørsmål til brukeren når noe mangler | Senere | Gir en ekstra runde med generering og mer kostnad |
| Eksempel på godt norsk søknadsbrev | Senere | Må skrives og kvalitetssikres for seg |
| Mørk modus | Senere | Ikke viktig for kjerneflyten |

## 8. Suksessmål

**Primære**
- **SM-1 Sjekklisten bestått.** Alle punktene i sjekklisten er bestått for alle fire testpar i `testdata/`. Testsettet kjøres på nytt etter hver vesentlige endring i prompter, og hvert resultat noteres i sesjonsloggen med commit-versjon. Validerer FR-7 til FR-17.
- **SM-2 Ingen oppdiktning.** Ingen forbudte påstander i noen resultatdel, testet med tre kjøringer per testpar fordi resultatene fra språkmodellen varierer. Validerer FR-9, FR-10, FR-15, FR-16 og FR-27.
- **SM-3 Riktig kategori.** I alle kjøringene i SM-2 gjelder konsekvensene i FR-8: ingen krav over fasit, og Mangler er alltid Mangler. Validerer FR-8 og FR-9.
- **SM-4 Nøkkelord og treff.** Minst 80 % av de forventede nøkkelordene er hentet ut, og enhetstestene for treffprosent er grønne. Validerer FR-11 og FR-12.

**Sekundære**
- **SM-5 To kolonner.** Testpar 4 leses inn uten at tekst går tapt eller flettes. Validerer FR-2.
- **SM-6 Kjørbar uten nøkkel.** En medstudent utenfor gruppen starter appen i demomodus på en maskin uten prosjektet, etter README-en, med høyst tre kommandoer. Validerer FR-23 til FR-26 og NFR-7.
- **SM-7 Robusthet.** Hvert feiltilfelle i FR-22 gir en norsk melding uten krasj og uten at data går tapt. Validerer FR-22.
- **SM-8 Kostnad.** Målt kostnad per full kjøring er 1 kr eller mindre, og det totale forbruket holder seg innenfor budsjettet. Kostnaden regnes ut fra loggført antall tokens ganger leverandørens pris, som gjennomsnitt over tre kjøringer per testpar. Validerer NFR-3.
- **SM-9 Alle krav verifisert.** Før innlevering er hver konsekvens som kan testes i FR-1 til FR-27 og NFR-1 til NFR-10 verifisert på den måten tabellen under viser. Resultatet noteres i sesjonsloggen. Validerer alle FR og NFR.

**Motmål (skal ikke optimaliseres)**
- **SM-C1 Høy treffprosent.** Skal ikke presses opp med nøkkelordstapping eller løsere matching. Den skal være ærlig. Motvekt til SM-4.
- **SM-C2 Overbevisende brev.** Et brev som «selger mer» ved å overdrive, er en feil. Sannhet går foran overbevisning. Motvekt til SM-1.
- **SM-C3 Antall forslag.** Flere CV- og ATS-forslag er ikke bedre. Få konkrete forslag med belegg slår mange generelle.

**Sporbarhet fra briefens suksesskriterier**

| Briefkriterium | Dekkes av |
|---|---|
| 1 Hele flyten fungerer | UJ-1 til UJ-3, SM-1, SM-9 (flyttest med mock i NFR-6) |
| 2 Sjekklisten bestått (brev: ≥3 krav, ≥2 erfaringer) | SM-1, FR-14 |
| 3 Ingenting diktet opp | SM-2, FR-9, FR-15, FR-16 |
| 4 Mangler aldri Oppfylt | SM-3, FR-8 |
| 5 Treffprosent i enhetstest | SM-4, FR-12 |
| 6 Alt kan redigeres | FR-18 |
| 7 PDF med to kolonner uten tap | SM-5, FR-2 |
| 8 Forståelig feilmelding, ingen krasj | SM-7, FR-22 |
| 9 Kan kjøres uten nøkkel | SM-6, FR-23 til FR-26 |
| Briefens seksjon om personvern | FR-5, FR-6, NFR-1, NFR-2, §6 |
| Briefens seksjon om kvalitetssikring | SM-1, SM-2, NFR-6, NFR-10 |

**Verifisering per krav (SM-9)**

| Krav | Hvordan det verifiseres |
|---|---|
| FR-1, FR-3, FR-4, FR-5 | Manuell test i nettleseren: filtyper og grenser, advarsel under 300 tegn, deaktivert *Analyser* |
| FR-2 | Automatisk test av uttrekk (NFR-6) og SM-5 |
| FR-6, FR-9, FR-12 | Enhetstester (NFR-6) |
| FR-7, FR-8, FR-10, FR-11, FR-13 til FR-17, FR-27 | Sjekklisten (SM-1), forbudte påstander (SM-2), kategorier (SM-3), nøkkelord (SM-4) |
| FR-18 til FR-21 | Manuell test i nettleseren, også i demomodus |
| FR-22 | SM-7 |
| FR-23 til FR-26 | SM-6 og flyttesten med mock (NFR-6) |
| NFR-1, NFR-2 | Kodegjennomgang, søk i logger, bundle og Git-historikk |
| NFR-3, NFR-4 | SM-8 og tidsmåling for testparene |
| NFR-5 | Sjekklisten, punktet «Gjennomgående» |
| NFR-6 | Testene kjører grønt uten API-nøkkel |
| NFR-7 | SM-6 |
| NFR-8 | Manuell test med tastatur og i 360 px bredde |
| NFR-9 | Testfilen med innplantet instruks og et direkte kall med for lang tekst |
| NFR-10 | Stikkprøve: tre stories kan følges til FR, test og commit |

## 9. Risikoer

| Risiko | Tiltak |
|---|---|
| Språkmodellen dikter opp kvalifikasjoner | Gjennomgående forbud (FR-27), belegg kontrolleres i kode (FR-9), brevet bygger bare på belegg (FR-15), tvilsregelen (FR-8), forbudte påstander i fasit og tre kjøringer per testpar (SM-2) |
| PDF med to kolonner leses feil | Lesing kolonne for kolonne (FR-2), kontrollsteget (FR-3), testpar 4 (SM-5) |
| Kostnaden med fire genereringer | Genereringer først når fanen åpnes (§3 Kjøring), maks fire per kjøring, grenser og budsjett (NFR-3), mock i utvikling (NFR-6) |
| Noen misbruker gruppens nøkkel på den offentlige adressen | Forbruksgrense, grense per IP og daglig grense (NFR-3) |
| Sensor har ikke nøkkel | Demomodus (FR-23 til FR-26), NFR-7, SM-6 |
| Resultatene varierer mellom kjøringer | Tre kjøringer per testpar, lav temperatur (addendum) |
| Tekst i CV-en eller annonsen prøver å styre språkmodellen | NFR-9: avgrenset data i promptene, kontroll på serveren, skjemavalidering, visning som ren tekst |
| Vi blir ikke ferdige i tide | Bygging i prioritert rekkefølge (§4) og fast rekkefølge for kutt (§7.2) |

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
- **§4.1 FR-5:** Brukeren krysser av for at personverninformasjonen er forstått før første analyse i økten.
- **§4.1 FR-6:** Fødselsnummer maskeres automatisk.
- **§4.2 FR-8:** Grensen mellom Oppfylt og Delvis oppfylt (egenvurdering gir Delvis oppfylt), og regelen om at høyst ett krav kan ligge ett hakk under fasiten.
- **§4.2 FR-9:** Uten belegg nedgraderes kravet til Mangler.
- **§4.2 FR-12:** Matcheregelen med prefiks for norske bøyninger og sammensatte ord.
- **§4.3 FR-14:** Plassholdere for navn og kontaktinformasjon.
- **§3 Kjøring:** Fire genereringer, ikke fem. Resultatdelene genereres første gang fanen åpnes.
- **§4.7 FR-24 til FR-26:** Demomodus viser alle fire resultatdelene for demoeksempelet, *Prøv med eksempel* finnes også med nøkkel, og egen CV i demomodus går bare gjennom kontrollsteget.
- **§5 NFR-3:** Grensene for kostnad og misbruk (1 kr per kjøring, 200 kr per semester, 30 genereringer per time per IP).
- **§5 NFR-4:** Målene for ytelse (30 s og 2 s).
- **§7.1:** Én tone på søknadsbrevet.

**Avklart under Finalize 2026-10-29.** Innenfor rammene Sondre satte, foreslo Claude disse løsningene på funnene fra gjennomgangen og avstemmingen (`review-rubric.md` og `reconcile-inputs.md`). Hvert valg er begrunnet i `.memlog.md`, og gruppen går gjennom dem før stories lages.
- **FR-9:** Uten belegg nedgraderes kravet ett hakk, ikke rett til Mangler. Dermed motsier ikke FR-9 regelen om ett hakk i FR-8.
- **FR-6:** Fødselsnummer gjenkjennes ut fra 11 sifre med gyldig dato, og kan ha mellomrom. Kontonumre maskeres ikke.
- **§3 Økt og FR-21:** *Ny analyse* tømmer innholdet, men avslutter ikke økten.
- **FR-14:** Kravene om at brevet ikke er generisk og ikke høres ut som en språkmodell, med eksempler på fraser som ikke skal brukes.
- **FR-16 og FR-17:** Én setning om hvorfor per forslag.
- **FR-18:** En redigering påvirker bare resultatdelen den gjøres i.
- **FR-27:** Gjennomgående forbud mot oppdiktning i alle resultatdelene.
- **NFR-1:** IP-adresser lagres hashet i høyst én time.
- **NFR-9:** Upålitelig inndata (prompt injection), med egen testfil.
- **NFR-10:** Krav til sporbarhet og KI-styring.
- **SM-6:** Kjøres av en medstudent utenfor gruppen.
- **SM-9:** Tabell over hvordan hvert krav verifiseres.
- **§7.3:** Beslutning for hver idé fra brainstormingen.
