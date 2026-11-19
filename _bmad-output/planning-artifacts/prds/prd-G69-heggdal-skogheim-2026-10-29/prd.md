---
title: AI CV & Job Application Assistant — PRD
status: final
created: 2026-10-29
updated: 2026-11-18
authors: Sondre Skogheim, Kevin Heggdal
course: IBE160 Programmering med KI, Høgskolen i Molde
source_brief: _bmad-output/planning-artifacts/briefs/brief-G69-heggdal-skogheim-2026-09-17/brief.md (revidert 2026-10-27)
---

# PRD: AI CV & Job Application Assistant

> **Status: final.** Sist oppdatert 2026-11-18 etter faglærers tilbakemelding (`tilbakemelding-prd.md`). §11 lister beslutningene som gjelder, §12 er en kort endringslogg, og begrunnelsene står i `.memlog.md`. Merket `[ANTAKELSE]` brukes bare om det som ikke er avklart.

## 0. Om dokumentet

PRD-en bygger på den reviderte produktbriefen fra 27. oktober, faglærers tilbakemelding fra 6. oktober, research og brainstorming, og testsettet i `testdata/`. Den gjentar ikke briefen, men gjør den om til PRD-krav som kan testes.

PRD-en har tre typer lesere:
- **Gruppen** bruker den når den lager stories (`bmad-create-epics-and-stories`), UX (`bmad-ux`) og arkitektur (`bmad-architecture`).
- **Sensor** skal kunne følge sporet brief → PRD → stories → kode.
- **KI-agenter** som implementerer stories, skal bruke ordene fra ordlisten (§3) nøyaktig.

Alle PRD-krav har faste ID-er: UJ (brukerreise), FR (funksjonelt krav), NFR (ikke-funksjonelt krav) og SM (suksessmål). §8 viser hvilke PRD-krav som dekker hvert av briefens suksesskriterier, og hvordan hvert av dem verifiseres. Teknologiforslag står i `addendum.md` og er avgjort i arkitekturen.

**Avvik fra briefen:** Briefen snakker om fem genereringer: gap-analyse, nøkkelord, søknadsbrev, CV-forbedringer og ATS-forslag. I PRD-en henter gap-analysen også ut nøkkelordene, så en full kjøring er fire genereringer (§3 Kjøring).

## 1. Visjon

Studenter og unge jobbsøkere har ofte mer relevant erfaring enn de selv ser. En deltidsjobb i butikk viser kundebehandling, og et verv som kasserer viser kontanthåndtering. AI CV & Job Application Assistant viser dem dette. Brukeren laster opp CV-en og limer inn en stillingsannonse. Appen går gjennom annonsekravene ett for ett og viser hva CV-en dekker, hva den delvis dekker og hva som mangler. Den lager også et søknadsbrev og konkrete forslag som bare bygger på det som faktisk står i CV-en.

Det som skiller verktøyet fra Jobscan, Teal og lignende, er ikke flere funksjoner. Det er ærlighet og gjennomsiktighet på norsk. Verktøyet dikter aldri opp kvalifikasjoner, og hver vurdering viser hvilken tekst i CV-en den bygger på. Treffprosenten regnes ut i kode og forklares. Det er brukeren som bestemmer, og alt språkmodellen lager er forslag som kan redigeres.

**Hvorfor ikke bare bruke en generell chatbot?** Med en generell chatbot må brukeren selv skrive gode instrukser, sjekke at ingenting er diktet opp og vite hva det er lurt å be om. Her er strukturen bygget inn: annonsen brytes ned i annonsekrav, hvert belegg kontrolleres i kode mot CV-teksten (FR-9), treffprosenten regnes ut i kode og ikke av språkmodellen (FR-12), fødselsnummer maskeres før sending (FR-6), og ingenting lagres (NFR-1).

Verktøyet krever ingen konto og lagrer ingenting. Brukeren får vite før opplasting at CV-teksten sendes til en ekstern språkmodell, og alt slettes når økten er over.

## 2. Målgruppe

### 2.1 Jobs To Be Done
- **Funksjonelt:** Forstå hva en stillingsannonse faktisk ber om, og se hvilke av mine erfaringer som dekker hvert annonsekrav.
- **Funksjonelt:** Få et utkast til søknadsbrev for akkurat denne stillingen på minutter, ikke en time.
- **Emosjonelt:** Være trygg på at søknaden ikke overdriver eller lyver. Jeg skal kunne stå inne for alt i et intervju.
- **Emosjonelt:** Være trygg på at CV-en min ikke lagres eller spres.
- **Læring:** Forstå hva arbeidsgivere ser etter, slik at neste søknad blir bedre også uten verktøyet.

### 2.2 Ikke-brukere (v1)
- Karriereveiledere og rekrutterere. De ble fjernet som sekundær målgruppe i briefen.
- Erfarne jobbsøkere med lange CV-er og lederroller. De kan bruke verktøyet, men det er ikke tilpasset dem.
- Søkere som skriver på andre språk enn norsk bokmål (se FR-4 og §7.1).

### 2.3 Brukerreiser

**UJ-1. Ida finner ut at butikkjobben teller.**
Ida (21) studerer økonomi og vil søke sommerjobb som kundebehandler i Sparebanken Testvik. Hun åpner appen på laptopen og trenger ikke logge inn. Over opplastingsfeltet står det kort at CV-teksten sendes til en ekstern språkmodell og ikke lagres. Hun laster opp CV-en som Word-fil (DOCX) og limer inn annonsen. I kontrollsteget ser hun teksten appen har lest inn. Hun retter en linje som ble feil, krysser av for at hun har forstått informasjonen og trykker *Analyser*.

Etter noen sekunder åpnes fanen *Gap-analyse og nøkkelord*:
- «Kundeorientert» er **Oppfylt**, med belegg fra butikkjobben.
- «Kontanthåndtering» er **Oppfylt**, med belegg fra butikkjobben og kasserervervet.
- «Gode digitale ferdigheter» er **Delvis oppfylt**, med en kort forklaring.
- «AFR-autorisasjon» er **Mangler**, med et ærlig råd om å nevne at hun er villig til å ta den.

Treffprosenten viser hvilke nøkkelord som er funnet og hvilke som mangler. **Høydepunktet** er at Ida skjønner at hun dekker mer enn hun trodde, og hvorfor (SM-10).

Hun åpner fanen *Søknadsbrev*. Brevet genereres der og da, nevner butikkjobben og vervet og påstår ikke at hun har AFR. Under brevet står en liste over hvilke deler av CV-en det bygger på. Hun endrer en setning og kopierer brevet. **Avslutning:** Hun lukker fanen, og ingenting ligger igjen.

**Kanttilfelle:** Hvis språkmodellen ikke svarer, ser Ida en norsk feilmelding og en *Prøv igjen*-knapp. CV-teksten og annonsen ligger fortsatt i feltene.

**UJ-2. Mina laster opp en CV med to kolonner.** (testpar 4)
Mina studerer reiselivsledelse og har en PDF-CV med to kolonner som hun har laget i et designverktøy. Hun skal søke deltidsjobb i resepsjonen på Hotell Testfjord. I kontrollsteget ser hun at hele venstre kolonne (kontakt, ferdigheter, språk og kurs) kommer før høyre kolonne (profil, utdanning og erfaring), og at ingen linjer er flettet sammen. Hun analyserer.

Annonsen ønsker erfaring med bookingsystemer, gjerne Opera. Det står ikke i CV-en, så annonsekravet får **Mangler**. Annonsen krever også gode kunnskaper i engelsk og tysk. Mina har bare grunnleggende tysk, så det annonsekravet får **Delvis oppfylt**. Verken brevet eller CV-forslagene sier at hun kan Opera eller snakker godt tysk.

**Kanttilfelle:** Hvis PDF-en er skannet og nesten ikke gir tekst, får Mina beskjed om dette. Hun får forslag om å lime inn CV-teksten selv, og hun kan gjøre det i samme felt.

Testpar 2 (Jonas, IT-brukerstøtte med annonsekrav om førerkort og ITIL) og testpar 3 (Sara, regnskap med svake kvalifikasjoner) følger samme flyt som UJ-1 og er ikke skrevet ut som egne reiser.

**UJ-3. Marit, sensor, kjører appen uten nøkkel.**
Marit vurderer prosjektet. Hun kloner det offentlige repoet og følger README-en, og har ingen API-nøkkel. Appen starter i **demomodus**, og et banner forteller det. Hun trykker *Prøv med eksempel*. Idas fiktive CV og annonse (testpar 1) lastes inn. Alle fire resultatdelene vises fra lagrede svar, og treffprosenten regnes ut i kode akkurat som i vanlig drift. Hun kan redigere og kopiere tekst og prøve kontrollsteget med sin egen fil. Når hun trykker *Analyser* på en egen CV, forklarer appen at analyse av egen CV krever en API-nøkkel.

## 3. Ordliste

Disse ordene brukes nøyaktig likt i PRD, stories og kode. Det skal ikke brukes synonymer. Kode bruker ordene uten æøå, slik arkitekturen bestemmer (for eksempel `krav` for annonsekrav og `nokkelord`).

- **Økt.** Det som skjer fra appen åpnes til nettleserfanen lukkes eller siden lastes på nytt. Data finnes bare i minnet i løpet av økten. *Ny analyse* (FR-21) tømmer innholdet, men avslutter ikke økten.
- **Språkmodell.** Den eksterne KI-tjenesten som lager innholdet i resultatdelene. PRD-kravene bruker dette ordet, ikke «KI-en».
- **CV-fil.** Filen brukeren laster opp: PDF, DOCX eller TXT.
- **CV-tekst.** Teksten som leses ut av CV-filen eller limes inn. Analysen bruker CV-teksten slik den står etter kontrollsteget.
- **Annonse.** Teksten fra stillingsannonsen, limt inn av brukeren.
- **Kontrollsteg.** Steget der brukeren ser og kan rette CV-teksten før analysen starter.
- **Annonsekrav.** Én kvalifikasjon eller ett ønske som er hentet ut av annonsen. Annonsens egne «krav» og «ønsker» er begge annonsekrav.
- **PRD-krav.** Et krav i dette dokumentet, med ID (FR, NFR). Brukes for å skille dem fra annonsekrav.
- **Analyse.** Det som starter når brukeren trykker *Analyser*: genereringen av gap-analysen, som er den første genereringen i en kjøring. Hele forløpet med alle resultatdelene heter kjøring, ikke analyse.
- **Gap-analyse.** Resultatdelen der hvert annonsekrav har en kategori og belegg, sammen med nøkkelordene og treffprosenten. Den vises i fanen *Gap-analyse og nøkkelord*.
- **Kategori.** Vurderingen av ett annonsekrav. Den er alltid én av tre: **Oppfylt**, **Delvis oppfylt** eller **Mangler**.
- **Tvilsregelen.** Ved tvil velges den svakeste kategorien (FR-8).
- **Belegg.** Et ordrett utdrag fra CV-teksten som en vurdering eller et forslag bygger på. Hva «ordrett» betyr, står i FR-9.
- **Nøkkelord.** Et sentralt ord eller uttrykk fra annonsen, hentet ut av språkmodellen og knyttet til ett annonsekrav eller ingen (FR-11).
- **Treffprosent.** Andelen nøkkelord som finnes i CV-teksten. Den regnes ut deterministisk i kode (FR-12).
- **Resultatdel.** Én av de fire delene av resultatet: gap-analysen, søknadsbrevet, CV-forbedringene og ATS-forslagene. Hver vises i sin egen fane (*Gap-analyse og nøkkelord*, *Søknadsbrev*, *CV-forbedringer* og *ATS-forslag*). «Fane» brukes bare om selve grensesnittet.
- **Generering.** Ett kall til språkmodellen som lager innholdet i én resultatdel.
- **Kjøring.** Genereringene for ett par av CV-tekst og annonse. Gap-analysen genereres når brukeren trykker *Analyser*. De tre andre resultatdelene genereres første gang brukeren åpner fanen deres. En full kjøring er derfor fire genereringer. Nye genereringer (FR-19) kommer i tillegg og telles mot grensene i NFR-3.
- **Demomodus.** Driftsmodus når API-nøkkel mangler. Resultatene kommer da fra lagrede svar.
- **Demoeksempel.** Den fiktive CV-en og annonsen som demomodus bruker (testpar 1).
- **Testpar.** En fiktiv CV, en annonse og en fasit i `testdata/`.
- **Fasit.** Forventet kategori per annonsekrav, forventede nøkkelord, forventet treffprosent og forbudte påstander for ett testpar.
- **Forbudt påstand.** En kvalifikasjon som ikke står i CV-en og som aldri skal presenteres som noe brukeren har.
- **Sjekkliste.** `testdata/sjekkliste.md`, den manuelle kvalitetskontrollen per testpar.

## 4. Funksjoner

Funksjonene står i den rekkefølgen de bygges. Et trinn påbegynnes først når det forrige fungerer (briefens prioritering): **4.1 og 4.7 er grunnmuren**, så kommer **4.2**, så **4.3** og til slutt **4.4**. Feilhåndtering (4.6) og redigering (4.5) bygges sammen med hvert trinn. Den gjennomgående regelen i 4.8 gjelder alle resultatdelene.

### 4.1 Innlesing og kontrollsteg (grunnmur)

**Beskrivelse:** Startsiden har et felt for CV-filen, et tekstfelt for annonsen og informasjon om personvern. CV-filen leses ut til CV-tekst. Før analysen ser brukeren CV-teksten i kontrollsteget og kan rette den. Kontrollsteget er hovedforsvaret mot feil innlesing av kolonner og tabeller, fordi brukeren alltid ser det språkmodellen får. Realiserer UJ-1, UJ-2 og UJ-3.

#### FR-1: Laste opp CV-fil
Brukeren kan laste opp en CV-fil i formatene PDF, DOCX eller TXT, på maks 5 MB.
- Andre formater og større filer avvises før innlesing, med en norsk melding som sier hvilke formater og hvilken størrelse som er lov.
- Brukeren kan i stedet lime CV-teksten direkte inn i tekstfeltet i kontrollsteget.

#### FR-2: Lese ut tekst, også fra PDF med to kolonner
Systemet leser ut CV-teksten fra CV-filen. Ved to kolonner leses hver kolonne ferdig ovenfra og ned før neste kolonne. Realiserer UJ-2.
- For `testdata/par-4-tokolonne-hotell/cv.pdf` finnes alle linjene i `cv.txt` i CV-teksten. Ingen linje blander tekst fra begge kolonnene, og «SPRÅK» og «KURS» (venstre kolonne) kommer før «PROFIL» (høyre kolonne).
- For DOCX- og TXT-versjonene av testparene er CV-teksten lik `cv.txt`. Mellomrom og linjeskift regnes ikke med i sammenligningen.
- **Dataminimering:** Ingenting fra CV-en forlater brukerens enhet før brukeren trykker *Analyser*, og da bare CV-teksten fra kontrollsteget. Selve filen, bilder og metadata i filen sendes ikke. Hvordan dette oppnås, står i arkitekturen.

#### FR-3: Kontrollsteg
Brukeren ser CV-teksten i et redigerbart felt før analysen og kan endre den.
- Analysen bruker CV-teksten slik den står i feltet når brukeren trykker *Analyser*.
- Er CV-teksten kortere enn 300 tegn, får brukeren en advarsel. Den sier at filen kan være skannet eller tom, og foreslår å lime inn teksten. Ingen OCR i v1.
- Kontrollsteget er også forsvaret mot CV-er med tabeller: tekst som blir rotete, retter brukeren her.
- Etter en analyse kan brukeren gå tilbake til kontrollsteget med knappen *Endre CV-tekst*. CV-teksten og annonsen beholdes. Slik legger brukeren inn en erfaring som manglet (FR-10). Trykker brukeren *Analyser* igjen, starter en ny kjøring, og alle resultatdelene erstattes. Har brukeren redigert en resultatdel, får hen en advarsel om at redigeringene overskrives, og må bekrefte (som i FR-19).

#### FR-4: Legge inn annonse
Brukeren kan lime inn annonsen i et tekstfelt.
- Annonsen må være mellom 200 og 8 000 tegn, og CV-teksten maks 15 000 tegn. Utenfor grensene vises en norsk melding, og *Analyser* er deaktivert.
- Grensene håndheves også på serveren (NFR-9).
- Ved feltene står det at verktøyet er laget for CV-er og annonser på norsk. Tekst på andre språk, for eksempel engelsk, avvises ikke. Resultatene er alltid på bokmål, og kvaliteten for andre språk er ikke testet (§7.1).

#### FR-5: Informasjon om personvern og bekreftelse
Over feltene står en kort tekst som forklarer tre ting:
- CV-teksten sendes til en ekstern språkmodell (leverandør og land oppgis).
- Ingenting lagres etter økten.
- Brukeren bør fjerne fødselsnummer, adresse, bilde og helseopplysninger.

Brukeren må krysse av for at informasjonen er forstått før den første analysen i økten.
- *Analyser* er deaktivert til brukeren har krysset av. Avkrysningen gjelder resten av økten.

#### FR-6: Maskere fødselsnummer
Systemet erstatter fødselsnumre i CV-teksten med `[fødselsnummer fjernet]` før teksten sendes. Et fødselsnummer er 11 sifre der de seks første er en gyldig dato (DDMMÅÅ). Mellom de seks første og de fem siste kan det stå ingenting, 1–3 mellomrom (også hardt mellomrom), eller én bindestrek eller tankestrek med høyst ett mellomrom på hver side. Tabulator, linjeskift og andre tegn regnes ikke som skille.
- Maskeringen vises i kontrollsteget, så brukeren ser hva som sendes.
- En enhetstest bekrefter at «01019012345», «010190 12345», «010190  12345» og «010190-12345» maskeres, mens telefonnumre («400 00 001»), årstall, kontonumre («1234.56.78903») og 11 sifre uten gyldig dato («12345678903») ikke maskeres.

### 4.2 Gap-analyse og nøkkelord

**Beskrivelse:** Første generering i en kjøring. Den henter ut alle annonsekrav og nøkkelord fra annonsen og gir hvert annonsekrav en kategori med belegg. Systemet kontrollerer i kode at hvert belegg faktisk står i CV-teksten. Treffprosenten regnes ut i kode, ikke av språkmodellen. Realiserer UJ-1 og UJ-2.

#### FR-7: Hente ut alle annonsekrav
Systemet henter ut alle annonsekrav, både det annonsen kaller «krav» og det den kaller «ønsker», og viser dem i en liste.
- For hvert testpar er hvert annonsekrav i fasiten med. Et annonsekrav regnes som med når listen har et annonsekrav med samme innhold, også om ordlyden er en annen. Dette vurderes manuelt med sjekklisten.

#### FR-8: Sette kategori med belegg
Hvert annonsekrav får én kategori etter denne regelen:
- **Oppfylt:** CV-teksten har konkret erfaring, utdanning eller dokumentasjon som direkte dekker annonsekravet. Belegget vises.
- **Delvis oppfylt:** CV-teksten har overførbar eller beslektet erfaring, eller annonsekravet står bare som egenvurdering (for eksempel «nøyaktig» i profilen). Belegget vises, sammen med én setning om hvorfor annonsekravet bare er delvis oppfylt.
- **Mangler:** Annonsekravet er ikke dokumentert i CV-teksten, selv om brukeren kanskje har erfaringen. Språkmodellen fyller aldri inn kvalifikasjoner selv. Har brukeren erfaringen, legger hen den inn i CV-teksten i kontrollsteget før analysen.
- **Tvilsregelen:** ved tvil velges den svakeste kategorien.

Konsekvenser som kan testes:
- Ingen annonsekrav får høyere kategori enn i fasiten.
- Annonsekrav med **Mangler** i fasiten får alltid **Mangler**.
- Høyst ett annonsekrav per testpar får lavere kategori enn i fasiten, enten etter tvilsregelen eller etter nedgradering i FR-9.

#### FR-9: Kontrollere belegg i kode
Systemet kontrollerer at hvert belegg finnes ordrett i CV-teksten. Mangler belegget, er annonsekravet ikke dokumentert i CV-teksten. Det plasseres da i **Mangler**, uansett hvilken kategori språkmodellen foreslo, og merkes «nedgradert: fant ikke belegg i CV-en». Belegget som ikke ble funnet, vises ikke.

«Ordrett» betyr at ordene og rekkefølgen er like etter at både belegget og CV-teksten er normalisert. Disse forskjellene regnes ikke med, fordi tekst fra PDF og DOCX ofte har dem uten at innholdet er annerledes:
- store og små bokstaver
- mellomrom og linjeskift
- listetegn (for eksempel •, ▪ og *)
- bindestreker og tankestreker (-, –, —), også bindestrek ved orddeling på slutten av en linje. Alle bindestreker fjernes, ikke bare den ved linjeskift, slik at «IT-brukerstøtte» delt over to linjer også godtas.
- anførselstegn og apostrofer (for eksempel « », " ", ' og ’)

I tillegg må belegget begynne og slutte på en ordgrense i CV-teksten, og det må ha minst 4 tegn etter normalisering. Et belegg kan altså ikke være en bit av et ord (som «oppgjør» i «dagsoppgjør») eller et småord som «og». Et kort fagord som står alene, for eksempel «Excel», godtas. Algoritmen står i addendum D0.

Konsekvenser som kan testes:
- Enhetstester dekker disse tilfellene: belegg som finnes (godtas), belegg som er litt omskrevet (avvises), belegg med andre linjeskift (godtas), belegg med orddeling over linjeskift (godtas) og belegg med andre anførselstegn (godtas). De dekker også belegg under 4 tegn (avvises) og belegg som begynner eller slutter midt i et ord (avvises).
- En enhetstest bekrefter at et belegg som siterer en linje fra `testdata/par-4-tokolonne-hotell/cv.txt` uten listetegnet, for eksempel «Kassasystem og dagsoppgjør», godtas, mens det samme belegget med ett ord byttet ut avvises.
- En enhetstest bekrefter at både et **Oppfylt**- og et **Delvis oppfylt**-annonsekrav uten gyldig belegg blir **Mangler**.

#### FR-10: Ærlige råd ved Mangler
For hvert annonsekrav med **Mangler** gir systemet et ærlig råd, for eksempel å vise vilje til å lære eller å peke på beslektet erfaring. Rådet sier også at brukeren som har erfaringen, kan legge den inn i CV-teksten i kontrollsteget (FR-3).
- Ingen råd foreslår å påstå kvalifikasjonen. Dette kontrolleres mot forbudte påstander i fasiten.

#### FR-11: Hente ut nøkkelord
Systemet henter ut nøkkelordene fra annonsen. Hvert nøkkelord knyttes til det annonsekravet det hører til, eller til ingen hvis det ikke hører til noe annonsekrav. Nøkkelordene og koblingen kommer fra samme generering som annonsekravene.
- For hvert testpar er minst 80 % av de forventede nøkkelordene i fasiten med.
- Koblingen brukes i FR-17. Den påvirker ikke treffprosenten (FR-12).

#### FR-12: Regne ut treffprosent i kode
Systemet regner ut treffprosenten deterministisk og viser for hvert nøkkelord om det er funnet eller ikke.
- **Matcheregel:** Både CV-teksten og nøkkelordet gjøres om til små bokstaver, og tegnsetting (også bindestrek) erstattes med mellomrom før teksten deles i ord. Et nøkkelord er funnet når et ord i CV-teksten begynner med nøkkelordet. Det gir treff på bøyningsformer og sammensatte ord der nøkkelordet er første ledd (*kundeservice* treffer *kundeservicen* og *kundeservicemedarbeider*). Et nøkkelord med flere ord er funnet når alle ordene finnes.
- Treffprosenten er antall funnet delt på antall nøkkelord, rundet til nærmeste hele prosent.
- Enhetstester med nøkkelordene fra hver fasit gir den forventede treffprosenten. Forventet treffprosent står i hver `fasit.md`.
- Prosenten som vises, er lik prosenten koden regner ut.

#### FR-13: Merke treffprosenten som veiledende
Ved treffprosenten står det at den er veiledende og ikke en score fra et ATS-system. Det står også at nøkkelord bare bør legges til når CV-en har dekning for dem.

### 4.3 Søknadsbrev

**Beskrivelse:** Brevet genereres første gang brukeren åpner fanen. Det bygger på gap-analysen og CV-teksten. Brevet skal være nøkternt og konkret og høres ut som en ung søker som skriver godt, ikke som en KI. Realiserer UJ-1.

#### FR-14: Generere søknadsbrev
Systemet lager et søknadsbrev på bokmål for stillingen og arbeidsgiveren i annonsen.
- Brevet er 250–400 ord.
- Det nevner minst tre konkrete annonsekrav og minst to konkrete erfaringer fra CV-teksten.
- Stilling og arbeidsgiver er riktige.
- Navn og kontaktinformasjon står som plassholdere, for eksempel `[Ditt navn]`, og hentes ikke fra CV-en.
- Brevet er ikke generisk: det kunne ikke vært sendt uendret til en annen stilling, fordi det nevner annonsekrav og oppgaver som er spesifikke for denne annonsen. Vurderes med sjekklisten.
- Brevet høres ikke ut som det er skrevet av en språkmodell: det er sammenhengende tekst uten punktlister og uten tomme fraser som «dynamisk og resultatorientert», «i dagens konkurranseutsatte marked» eller «jeg brenner for». Vurderes med sjekklisten.

#### FR-15: Brevet bygger bare på belegg
Brevet presenterer bare annonsekrav med **Oppfylt** eller **Delvis oppfylt** som kvalifikasjoner. Annonsekrav med **Mangler** kan bare nevnes som motivasjon for å lære, aldri som noe brukeren har. Brevet fyller ikke inn kvalifikasjoner som ikke står i CV-teksten (FR-8, FR-27). Under brevet står listen «Bygger på» med beleggene som er brukt. Beleggene kontrolleres som i FR-9, og belegg uten treff fjernes fra listen og merkes.
- Selve brevteksten kontrolleres ikke automatisk. Den kontrolleres mot forbudte påstander i SM-2.
- Ingen forbudte påstander står i brevet, i noen av kjøringene i SM-2.

### 4.4 CV-forbedringer og ATS-forslag

**Beskrivelse:** To resultatdeler som genereres første gang fanen åpnes. Begge foreslår endringer i det som allerede står i CV-en, aldri nytt innhold.

#### FR-16: CV-forbedringer
Systemet gir konkrete forslag til omformulering, rekkefølge eller presisering. Hvert forslag peker på en bestemt del av CV-teksten med belegg som kontrolleres som i FR-9.
- Ingen forslag legger til noe som ikke står i CV-teksten (FR-27).
- Hvert forslag har én setning om hvorfor, knyttet til et annonsekrav eller nøkkelord. Slik lærer brukeren hva arbeidsgivere ser etter.

#### FR-17: ATS-forslag
Systemet gir konkrete ATS-forslag om format, seksjonsoverskrifter og ordvalg. Et nøkkelord som ikke er funnet (FR-12), foreslås bare når det er knyttet til et annonsekrav (FR-11) som har **Oppfylt** eller **Delvis oppfylt** etter kontrollen i FR-9. Nøkkelord som ikke er knyttet til noe annonsekrav, foreslås ikke.
- Hvert forslag nevner en bestemt overskrift, linje eller et bestemt nøkkelord, for eksempel «Endre overskriften "Jobber" til "Arbeidserfaring"», ikke «Optimaliser for ATS».
- Hvert forslag har én setning om hvorfor, som i FR-16.
- For testpar 3 foreslås verken «Tripletex» eller «Visma», fordi annonsekravet de hører til, har **Mangler**. Dette gjelder alle kjøringene i SM-2.

### 4.5 Redigering, ny generering og kopiering

#### FR-18: Redigere alt
All tekst i resultatdelene vises i redigerbare felt, og brukerens endringer blir stående til økten avsluttes. Resultatdelene er uavhengige.
- Redigering i én resultatdel påvirker ikke de andre. Treffprosenten endres ikke av redigering.
- Kategorier, belegg, treffprosent og nøkkelord er kontrollert i kode og vises låst. All annen tekst kan redigeres.
- Genereringer bygger på den originale CV-teksten (slik den sto etter kontrollsteget) og annonsen, aldri på brukerens redigeringer. Søknadsbrevet, CV-forbedringene og ATS-forslagene bruker i tillegg kategoriene og koblingen mellom nøkkelord og annonsekrav fra den genererte, uredigerte gap-analysen, fordi FR-15 og FR-17 trenger dem.

#### FR-19: Generere én resultatdel på nytt
Brukeren kan generere én resultatdel på nytt. Det er én generering, og den bygger på det samme grunnlaget som i FR-18.
- Har brukeren redigert resultatdelen, får brukeren en advarsel om at redigeringene i denne resultatdelen overskrives, og må bekrefte før den nye genereringen starter. Redigeringer i andre resultatdeler berøres ikke.
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
I demomodus fungerer innlesing og kontrollsteget for egne CV-filer. Trykker brukeren *Analyser*, forklarer appen at analyse av egen CV krever API-nøkkel, og tilbyr demoeksempelet.

### 4.8 Gjennomgående regel

#### FR-27: Ingen oppdiktning i noen resultatdel
Ingen resultatdel inneholder kvalifikasjoner, ferdigheter, utdanning, arbeidsgivere, årstall eller tall som ikke står i CV-teksten, med mindre de er presentert som noe brukeren mangler eller kan lære. Regelen gjelder gap-analysen (FR-10), søknadsbrevet (FR-14 og FR-15), CV-forbedringene (FR-16) og ATS-forslagene (FR-17).
- Kontrolleres mot forbudte påstander og punktet «Gjennomgående» i sjekklisten, i alle kjøringene i SM-2.

## 5. Ikke-funksjonelle krav

- **NFR-1 Personvern og lagring.** Ingen data fra økten skrives til database, disk eller nettleserlagring (localStorage, IndexedDB og cookies). CV-tekst, annonse, prompter og resultater skrives ikke til logger. Bare metadata som status, varighet og antall tokens logges. IP-adresser lagres ikke, verken i klartekst eller som hash, fordi de er personopplysninger.
  - *Test:* gjennomgang av koden og et søk i loggen etter tekst fra testparene etter en kjøring.
- **NFR-2 Hemmeligheter.** API-nøkkelen finnes bare som miljøvariabel på serveren: i Vercel i produksjon og i en `.env` som Git ignorerer, lokalt. Repoet har bare `.env.example` og fiktive testdata.
  - *Test:* nøkkelen og prefikset finnes ikke i JavaScript-koden som sendes til nettleseren eller i Git-historikken.
  - CV-filer (`*.pdf`, `*.docx`) er bare tillatt under `testdata/`. `.gitignore` blokkerer dem andre steder, og repoet sjekkes for ekte CV-er før innlevering.
- **NFR-3 Kostnad og misbruk.**
  - En full kjøring er fire genereringer (§3 Kjøring). Nye genereringer telles mot grensene.
  - Kostnaden per kjøring er mål 1 kr eller mindre.
  - **Hardt tak:** forhåndsbetalt kreditt hos leverandøren, uten automatisk påfylling og satt under semesterbudsjettet på 200 kr. Det er det eneste taket som holder uansett hvor mye nettstedet blir brukt.
  - **Myk grense:** en teller i minnet på serveren begrenser antall genereringer per minutt og per døgn (tallene står i arkitekturen, AD-9). På Vercel deles telleren ikke mellom serverinstanser og nullstilles ved kald start, så den demper misbruk, men stopper det ikke. Telleren bruker ikke IP-adresser eller andre kjennetegn på brukeren (NFR-1).
  - Når en grense er nådd eller kreditten er brukt opp, gjelder FR-22. *Prøv med eksempel* (FR-25) virker fortsatt, fordi den ikke kaller språkmodellen.
- **NFR-4 Ytelse.**
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

- **Publisering:** Bare Vercel er tillatt. Teknologien må være noe Vercel støtter: Vite/React, Next.js, Node/Express eller Python Flask/FastAPI. Valget er tatt i arkitekturen. Se også forslaget i `addendum.md`.
- **Offentlig repo:** Ingen nøkler og ingen ekte CV-er i koden eller historikken.
- **Valg av leverandør av språkmodell** gjøres ved måling (§10.1) ut fra disse kriteriene, i prioritert rekkefølge:
  1. API-data brukes ikke til trening, og det finnes en databehandleravtale
  2. kvalitet på norsk bokmål
  3. kostnad per kjøring (NFR-3)
  4. støtte for strukturert svar (JSON), som FR-9 trenger

  Når en leverandør i EU/EØS er god nok på kriterium 2 og 3, foretrekkes den, fordi den unngår tredjelandsoverføring. Leverandør og land skal stå i informasjonsteksten (FR-5). Begrunnelsen brukes i refleksjonsrapporten.
- **Tredjelandsoverføring:** Velges en leverandør i USA, betyr det overføring av personopplysninger ut av EØS. Det skal da stå tydelig i informasjonsteksten, og datamengden holdes nede (FR-2, FR-6).

## 7. Ikke-mål og avgrensning av MVP

### 7.1 Ikke-mål (v1)
- Kontoer, innlogging og varig lagring av søknader. Lagring kan bli en senere utvidelse.
- Eksport til PDF eller DOCX. Brukeren kopierer teksten.
- Jobbsporing, automatisk jobbsøk, intervjuforberedelse og integrasjon med LinkedIn eller jobbportaler.
- Andre språk enn norsk bokmål, både i grensesnittet og i CV-er og annonser. En CV eller annonse på engelsk avvises ikke, men resultatene er på bokmål og kvaliteten testes ikke (FR-4).
- Annonse lastet opp som fil eller lenke. Bare innlimt tekst.
- OCR av skannede PDF-er.
- Valg av tone eller mal for søknadsbrevet. Én nøktern tone.
- Ingen «ATS-score» eller sammenligning med andre søkere.

### 7.2 MVP
Med i MVP er alt i §4 og §5, i rekkefølgen grunnmur (4.1, 4.7) → 4.2 → 4.3 → 4.4. Er tiden knapp, kuttes det fra slutten: FR-17 (ATS-forslag) først, deretter FR-16 (CV-forbedringer). FR-1 til FR-15 og FR-18 til FR-27 er kjernen.

### 7.3 Vurderte ideer fra brainstormingen

| Idé | Beslutning | Grunn |
|---|---|---|
| «Hvorfor?»-forklaring per forslag | v1 (FR-16, FR-17) | Støtter læringsmålet i §2.1 |
| Markering av hvilke CV-linjer som dekker hvilke annonsekrav | v1 (belegg i FR-8) | Er kjernen i gjennomsiktigheten |
| Kopier-knapp per resultatdel | v1 (FR-20) | Brukeren tar teksten med seg ved å kopiere |
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
- **SM-2 Ingen oppdiktning.** Ingen forbudte påstander i noen resultatdel, testet med tre kjøringer per testpar fordi resultatene fra språkmodellen varierer. Feiler én av de tre kjøringene, rettes prompten, og alle tre kjøres på nytt. Siden prompten er endret, kjøres også resten av testsettet på nytt (SM-1). Validerer FR-9, FR-10, FR-15, FR-16 og FR-27.
- **SM-3 Riktig kategori.** I alle kjøringene i SM-2 gjelder konsekvensene i FR-8: ingen annonsekrav over fasit, og Mangler er alltid Mangler. Validerer FR-8 og FR-9.
- **SM-4 Nøkkelord og treff.** Minst 80 % av de forventede nøkkelordene er hentet ut, og enhetstestene for treffprosent er grønne. Validerer FR-11 og FR-12.

**Sekundære**
- **SM-5 To kolonner.** Testpar 4 leses inn uten at tekst går tapt eller flettes. Validerer FR-2.
- **SM-6 Kjørbar uten nøkkel.** En medstudent utenfor gruppen starter appen i demomodus på en maskin uten prosjektet, etter README-en, med høyst tre kommandoer. Validerer FR-23 til FR-26 og NFR-7.
- **SM-7 Robusthet.** Hvert feiltilfelle i FR-22 gir en norsk melding uten krasj og uten at data går tapt. Validerer FR-22.
- **SM-8 Kostnad.** Målt kostnad per full kjøring er 1 kr eller mindre, og det totale forbruket holder seg innenfor budsjettet. Kostnaden regnes ut fra loggført antall tokens ganger leverandørens pris, som gjennomsnitt over tre kjøringer per testpar. Validerer NFR-3.
- **SM-9 Alle PRD-krav verifisert.** Før innlevering er hver konsekvens som kan testes i FR-1 til FR-27 og NFR-1 til NFR-10 verifisert på den måten tabellen under viser. Resultatet noteres i sesjonsloggen. Validerer alle FR og NFR.
- **SM-10 Brukeren får verdi.** Før innlevering bruker tre medstudenter utenfor gruppen appen med egen CV-tekst og annonsen fra testpar 1. Minst to av dem svarer at de fant en erfaring de ikke hadde tenkt på som relevant. Svarene noteres i sesjonsloggen, uten CV-tekst. Validerer høydepunktet i UJ-1.

**Motmål (skal ikke optimaliseres)**
- **SM-C1 Høy treffprosent.** Skal ikke presses opp med nøkkelordstapping eller løsere matching. Den skal være ærlig. Motvekt til SM-4.
- **SM-C2 Overbevisende brev.** Et brev som «selger mer» ved å overdrive, er en feil. Sannhet går foran overbevisning. Motvekt til SM-1.
- **SM-C3 Antall forslag.** Flere CV- og ATS-forslag er ikke bedre. Få konkrete forslag med belegg slår mange generelle.

**Sporbarhet fra briefens suksesskriterier**

| Briefkriterium | Dekkes av |
|---|---|
| 1 Hele flyten fungerer | UJ-1 til UJ-3, SM-1, SM-9 (flyttest med mock i NFR-6) |
| 2 Sjekklisten bestått (brev: ≥3 annonsekrav, ≥2 erfaringer) | SM-1, FR-14 |
| 3 Ingenting diktet opp | SM-2, FR-9, FR-15, FR-16 |
| 4 Mangler aldri Oppfylt | SM-3, FR-8 |
| 5 Treffprosent i enhetstest | SM-4, FR-12 |
| 6 Alt kan redigeres | FR-18 |
| 7 PDF med to kolonner uten tap | SM-5, FR-2 |
| 8 Forståelig feilmelding, ingen krasj | SM-7, FR-22 |
| 9 Kan kjøres uten nøkkel | SM-6, FR-23 til FR-26 |
| Briefens seksjon om personvern | FR-5, FR-6, NFR-1, NFR-2, §6 |
| Briefens seksjon om kvalitetssikring | SM-1, SM-2, NFR-6, NFR-10 |

**Verifisering per PRD-krav (SM-9)**

| PRD-krav | Hvordan det verifiseres |
|---|---|
| FR-1, FR-3, FR-4, FR-5 | Manuell test i nettleseren: filtyper og grenser, advarsel under 300 tegn, merknad om språk, deaktivert *Analyser* |
| FR-2 | Automatisk test av uttrekk (NFR-6) og SM-5 |
| FR-6, FR-9, FR-12 | Enhetstester (NFR-6) |
| FR-7, FR-8, FR-10, FR-11, FR-13 til FR-17, FR-27 | Sjekklisten (SM-1), forbudte påstander (SM-2), kategorier (SM-3), nøkkelord (SM-4) |
| FR-18 til FR-21 | Manuell test i nettleseren, også i demomodus |
| FR-22 | SM-7 |
| FR-23 til FR-26 | SM-6 og flyttesten med mock (NFR-6) |
| NFR-1, NFR-2 | Kodegjennomgang, søk i logger, bundle og Git-historikk |
| NFR-3, NFR-4 | SM-8, kontroll av at kreditten er forhåndsbetalt uten påfylling, og tidsmåling for testparene |
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
| Riktige belegg avvises fordi tekst fra PDF eller DOCX har listetegn, orddeling eller andre anførselstegn | Normaliseringen i FR-9 med enhetstester på tekst fra testpar 4 |
| PDF med to kolonner leses feil | Lesing kolonne for kolonne (FR-2), kontrollsteget (FR-3), testpar 4 (SM-5) |
| Kostnaden med fire genereringer | Genereringer først når fanen åpnes (§3 Kjøring), maks fire per kjøring, grenser og budsjett (NFR-3), mock i utvikling (NFR-6) |
| Noen misbruker gruppens nøkkel på den offentlige adressen | Forhåndsbetalt kreditt uten påfylling som hardt tak, teller i minnet som myk grense (NFR-3). Demoeksempelet virker selv om kreditten er brukt opp |
| Sensor har ikke nøkkel | Demomodus (FR-23 til FR-26), NFR-7, SM-6 |
| Resultatene varierer mellom kjøringer | Tre kjøringer per testpar og regelen for omkjøring (SM-2), lav temperatur (addendum) |
| Tekst i CV-en eller annonsen prøver å styre språkmodellen | NFR-9: avgrenset data i promptene, kontroll på serveren, skjemavalidering, visning som ren tekst |
| Vi blir ikke ferdige i tide | Bygging i prioritert rekkefølge (§4) og fast rekkefølge for kutt (§7.2) |

## 10. Åpne spørsmål

1. **Valg av leverandør og modell.** *Eier:* Sondre og Kevin. *Når:* ved måling i story 2.4, etter regelen i arkitekturen (AD-11). Testsettet kjøres mot Mistral og OpenAI, og Mistral velges hvis den består SM-1, SM-2, SM-3 og NFR-5 innenfor 1 kr per kjøring. Det er i tråd med §6, som foretrekker en leverandør i EU/EØS. Vilkårene om trening og databehandleravtale sjekkes direkte for begge leverandørene. Informasjonsteksten i FR-5 og vurderingen av tredjelandsoverføring i §6 skrives ferdig når valget er tatt. **Valgt 2026-11-19 (Kevin og Sondre):** OpenAI `gpt-4.1-mini` med temperatur 0, etter AD-11. Mistral besto ikke SM-3, og Large 4 feilet NFR-4. Se `_bmad-output/implementation-artifacts/vurdering-2-4-kontroll-temperatur-0.md`. SM-1 er ikke bestått ennå (par 3, 9 av 12) og står som åpent punkt. Informasjonsteksten i FR-5 og vurderingen av tredjelandsoverføring (USA, utenfor EØS) skrives ferdig i del C av story 2.4.
2. **Skisser av opplasting, resultatside og redigering.** Løst 2026-10-30 i `bmad-ux`.
3. **Testpar 4 og DOCX.** Løst 2026-10-29: `testdata/par-4-tokolonne-hotell/` og `testdata/par-1-butikk-bank/cv.docx`.
4. **Forventet treffprosent i fasit.** Løst 2026-10-29: par 1 22 %, par 2 11 %, par 3 8 %, par 4 33 %.
5. **Godkjenning.** Løst 2026-10-29: Kevin har godkjent briefen og PRD-en.
6. **Brukerinnsikt.** Ingen intervjuer er gjort ennå. Testen i SM-10 skal gjøres før innlevering, helst før søknadsbrevet bygges, så resultatet kan påvirke det.
7. **Datatilsynet.** Sjekk om Datatilsynet har ny veiledning om generativ KI som påvirker informasjonsteksten i FR-5.
8. **Tilbake til kontrollsteget etter analysen.** Løst 2026-10-30: knappen *Endre CV-tekst* i FR-3.

## 11. Beslutninger som gjelder

Alle er bekreftet av Sondre og Kevin, med mindre noe annet står. Begrunnelsene står i `.memlog.md`, og forkastede alternativer i §12.

- **§3 Økt og FR-21:** *Ny analyse* tømmer innholdet, men avslutter ikke økten.
- **§3 Kjøring:** Fire genereringer, ikke fem. Resultatdelene etter gap-analysen genereres første gang fanen åpnes.
- **FR-1:** Maks filstørrelse er 5 MB.
- **FR-2:** Dataminimering: bare CV-teksten sendes, og først ved *Analyser*. At filen leses i nettleseren, er mekanismen og står i arkitekturen.
- **FR-3:** Advarsel ved under 300 tegn, ingen OCR. *Endre CV-tekst* tar brukeren tilbake med teksten beholdt, og en ny analyse er en ny kjøring.
- **FR-4:** Grensene er 200–8 000 tegn for annonsen og maks 15 000 tegn for CV-teksten. Tekst på engelsk godtas med merknad (avklart av Sondre 2026-11-18).
- **FR-5:** Brukeren krysser av for at personverninformasjonen er forstått før første analyse i økten.
- **FR-6:** Fødselsnummer er 11 sifre med gyldig dato og med skilletegnene i FR-6. Kontonumre maskeres ikke.
- **FR-8:** Egenvurdering gir **Delvis oppfylt**. Annonsekrav som ikke er dokumentert i CV-en, er alltid **Mangler**. Høyst ett annonsekrav per testpar kan ligge under fasiten.
- **FR-9:** Uten gyldig belegg blir annonsekravet **Mangler**. Normaliseringen tåler listetegn, orddeling og anførselstegn, og alle bindestreker fjernes. Belegget må følge ordgrensene i CV-teksten og ha minst 4 tegn (besluttet av Sondre 2026-11-18).
- **FR-11 og FR-17:** Hvert nøkkelord knyttes til ett annonsekrav eller ingen. Bare nøkkelord knyttet til **Oppfylt** eller **Delvis oppfylt** foreslås (avklart av Sondre 2026-11-18, som AD-14).
- **FR-12:** Matcheregelen med prefiks for norske bøyninger og sammensatte ord. Kjente svakheter står i `testdata/README.md` og addendum D.
- **FR-14:** Plassholdere for navn og kontaktinformasjon. Brevet er ikke generisk og høres ikke ut som en språkmodell.
- **FR-16 og FR-17:** Én setning om hvorfor per forslag.
- **FR-18 og FR-19:** Resultatdelene er uavhengige. Kategorier, belegg, treffprosent og nøkkelord er låst. Genereringer bygger på CV-teksten etter kontrollsteget, annonsen og den uredigerte gap-analysen, aldri på redigeringer. Brukeren får en advarsel før redigeringer overskrives.
- **FR-24 til FR-26:** Demomodus viser alle fire resultatdelene for demoeksempelet, *Prøv med eksempel* finnes også med nøkkel, og egen CV i demomodus går bare gjennom kontrollsteget.
- **FR-27:** Gjennomgående forbud mot oppdiktning i alle resultatdelene.
- **NFR-1:** Ingen lagring av IP-adresser eller hash av dem.
- **NFR-3:** 1 kr per kjøring. Forhåndsbetalt kreditt under 200 kr er det harde taket, og telleren i minnet er en myk grense (avklart av Sondre 2026-11-18).
- **NFR-4:** Ytelsesmålene er 30 s og 2 s.
- **NFR-9 og NFR-10:** Upålitelig inndata med egen testfil, og krav til sporbarhet og KI-styring.
- **§6 og §10.1:** Leverandøren velges ved måling (AD-11), og en leverandør i EU/EØS foretrekkes når den er god nok (avklart av Sondre 2026-11-18).
- **§7.1:** Én tone på søknadsbrevet.
- **§7.3:** Beslutning for hver idé fra brainstormingen.
- **SM-2:** Feiler én av tre kjøringer, rettes prompten, og alle kjøres på nytt (avklart av Sondre 2026-11-18).
- **SM-6 og SM-10:** Testene gjøres av medstudenter utenfor gruppen (SM-10 avklart av Sondre 2026-11-18).
- **SM-9:** Tabell over hvordan hvert PRD-krav verifiseres.

## 12. Endringslogg

- **2026-10-29:** Utkast på hurtigsporet og Finalize. Valgene ble bekreftet av Sondre og Kevin.
- **2026-10-30, gruppen:** Annonsekrav uten belegg går rett til **Mangler** (forslaget om nedgradering ett hakk ble forkastet). Ingen IP-adresser (forslagene om hashet IP i én time og grense per IP ble forkastet). Resultatdelene er uavhengige. Toleransen i FR-8 ble endret til «høyst ett annonsekrav under fasiten».
- **2026-10-30, UX:** Knappen *Endre CV-tekst* (FR-3), og låste kategorier, belegg, treffprosent og nøkkelord (FR-18).
- **2026-11-09:** FR-6 utvidet med bindestrek, tankestrek og flere mellomrom etter gjennomgangen av story 1.3.
- **2026-11-18, faglærers tilbakemelding:** Normalisering og nye tester i FR-9. Koblingen mellom nøkkelord og annonsekrav i FR-11 og FR-17 (faglærers «minst ett krav» ble forkastet for «ett eller ingen», som i arkitekturen). Ny SM-10 og regel for omkjøring i SM-2. Ordlisten skiller annonsekrav og PRD-krav, og har fått gap-analyse og tvilsregelen. FR-2 er formulert som dataminimering. Tekst på engelsk er avklart (FR-4). §10.1 peker på AD-11 med EU-preferanse. NFR-3 skiller hardt og mykt tak. Historikken er flyttet hit fra statusfeltet, §10 og §11.
- **2026-11-18, etter gjennomgangen av story 2.1:** FR-9 krever i tillegg ordgrenser og minst 4 tegn i belegget, og at alle bindestreker fjernes, er ikke lenger en antakelse (Sondre). Faglærers forslag om å fjerne bindestrek bare ved linjeskift ble forkastet.
