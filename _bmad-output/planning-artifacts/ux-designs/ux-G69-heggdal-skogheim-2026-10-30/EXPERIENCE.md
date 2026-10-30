---
title: AI CV & Job Application Assistant — EXPERIENCE
status: final
created: 2026-10-30
updated: 2026-10-30
sources:
  - _bmad-output/planning-artifacts/prds/prd-G69-heggdal-skogheim-2026-10-29/prd.md
---

# AI CV & Job Application Assistant — opplevelse

Ordene i ordlisten i PRD §3 (CV-tekst, kontrollsteg, krav, kategori, belegg, resultatdel, kjøring, demomodus osv.) brukes nøyaktig likt her. Visuell utforming står i `DESIGN.md`. Ved konflikt med skissene gjelder denne fila og `DESIGN.md`.

## Foundation

- **Plattform:** responsiv webapp. PC er hovedflaten, men alt skal fungere på mobil ned til 320 px (NFR-8 sier 360 px; 320 px er målet i WCAG 1.4.10).
- **UI-system:** shadcn/ui på Next.js og Tailwind `[ANTAKELSE: bekreftes i bmad-architecture]`. Denne fila beskriver bare oppførsel som avviker fra eller kommer i tillegg til shadcn.
- **Ingen konto og ingen lagring.** Alt finnes bare i minnet i økten (NFR-1). Lukkes fanen eller lastes siden på nytt, er alt borte, og appen advarer ikke om det, fordi det er en del av løftet.
- **Språk:** `<html lang="nb">`.
- **Visuell identitet:** `DESIGN.md`.

## Information Architecture

| Flate | Nås fra | Formål | Krav |
|---|---|---|---|
| Forberedelse | Åpning av appen, *Endre CV-tekst*, *Ny analyse* | Last opp eller lim inn CV, kontroller CV-teksten, lim inn annonsen, bekreft personvern, trykk *Analyser* | FR-1 til FR-6, FR-23, FR-25, FR-26 |
| Resultat | *Analyser*, *Prøv med eksempel*, *Tilbake til resultatet* | De fire resultatdelene i faner | FR-7 til FR-21, FR-24 |
| Dialog: bekreft overskriving | *Generer på nytt*, *Analyser* på nytt | Advarer om at redigeringer overskrives | FR-3, FR-19 |
| Dialog: ny analyse | *Ny analyse* | Bekrefter at alt tømmes | FR-21 |
| Dialog: erstatte med eksempel | *Prøv med eksempel* når feltene ikke er tomme | Bekrefter at tekstene erstattes | FR-25 |

Det er bare to flater. **Kontrollsteget er ikke en egen side.** Det er CV-panelets andre tilstand: når filen er lest inn, blir opplastingsfeltet et redigerbart tekstfelt med CV-teksten. Slik er kontrollsteget alltid ett klikk unna.

**Forberedelse**, ovenfra og ned:
1. Demobanner (bare i demomodus).
2. Tittel og én setning om hva appen gjør, og knappen *Prøv med eksempel*.
3. Personvernboksen (FR-5).
4. CV-panelet og annonsepanelet, side om side på PC og stablet på mobil.
5. Avkrysning for personvern og knappen *Analyser*. Finnes det resultater fra før, og er CV-teksten og annonsen uendret, står også *Tilbake til resultatet* her.

**Resultat**, ovenfra og ned:
1. Toppfelt med fast overskrift «Resultat» (`h1`), stilling og arbeidsgiver under, og knappene *Endre CV-tekst* og *Ny analyse*. Stilling og arbeidsgiver er felt i svaret fra gap-analysen. Til de finnes, vises et skjelett. Feiler gap-analysen, vises bare «Resultat».
2. Fanene *Gap-analyse og nøkkelord*, *Søknadsbrev*, *CV-forbedringer* og *ATS-forslag*, med fulle navn og i denne rekkefølgen.
3. Verktøylinje per fane med *Kopier* og *Generer på nytt*.
4. Innholdet i fanen.

→ Skisser: [forberedelse](mockups/key-forberedelse.html), [resultat med gap-analyse](mockups/key-resultat-gap.html), [redigering av søknadsbrev](mockups/key-redigering-brev.html).

## Voice and Tone

Merkevarestemmen står i `DESIGN.md` (Brand & Style). Her er reglene for mikrotekst:

- Du-form, kort og konkret bokmål. Ingen utropstegn, ingen emojier.
- Ikke ros som ikke er fortjent. Ikke trøst heller. Vis hva som står, og hva brukeren kan gjøre.
- Feilmeldinger sier hva som skjedde og hva brukeren kan gjøre nå, i den rekkefølgen.
- Kategoriene heter alltid **Oppfylt**, **Delvis oppfylt** og **Mangler**, aldri «Match», «Svak» eller lignende.
- Den eksterne tjenesten heter «språkmodellen», ikke «KI-en» (PRD §3).
- Appen omtaler ikke seg selv som «vi» eller «jeg». Meldinger skrives uten subjekt der det går: «Fant nesten ikke tekst i filen.»

| Gjør | Ikke gjør |
|---|---|
| «Analyser» | «Start KI-magien» |
| «Du dekker 3 av 6 krav. 2 er delvis oppfylt.» | «Flott! Du er en sterk kandidat!» |
| «Står ikke i CV-en din. Har du denne erfaringen? Trykk *Endre CV-tekst* og legg den inn.» | «Du mangler dette.» |
| «Språkmodellen svarte ikke. Teksten din er tatt vare på. Prøv igjen.» | «Noe gikk galt.» |
| «Veiledende treff, ikke en ATS-score.» | «Din ATS-score: 22 %» |
| «Skriver søknadsbrevet …» | «Tenker …» |

## Component Patterns

Visuell utforming står i `DESIGN.md` (Components).

| Komponent | Brukes på | Oppførsel |
|---|---|---|
| Personvernboks | Forberedelse | Alltid synlig over panelene og kan ikke lukkes. Tekst: «CV-teksten sendes til {leverandør} i {land}. [Hvis utenfor EØS:] Det betyr at opplysningene overføres ut av EØS. Ingenting lagres, og alt er borte når du lukker fanen. Du bør fjerne fødselsnummer, adresse, bilde og helseopplysninger før du analyserer.» (FR-5, PRD §6) |
| Opplastingsfelt | CV-panel, tilstand 1 | Knapp med etiketten «Velg CV-fil» som åpner filvelgeren. Dra og slipp er et tillegg, ikke eneste vei. Godtar PDF, DOCX og TXT på maks 5 MB og avviser andre før innlesing (FR-1). Under feltet står knappen *Lim inn CV-teksten*, som går rett til tilstand 2 med tomt felt. |
| CV-tekstfelt (kontrollsteget) | CV-panel, tilstand 2 | Overskrift «Kontroller CV-teksten», og feltet har den synlige etiketten «CV-tekst». Filnavnet og knappen *Bytt fil* står over. Feltet har tegnteller (maks 15 000). Fødselsnumre maskeres ved innlesing, ved innliming og når brukeren forlater feltet. De står som `[fødselsnummer fjernet]`, og en linje over feltet sier hvor mange som ble fjernet. Finner *Analyser* et nytt fødselsnummer, maskeres det, linjen oppdateres, og analysen starter ikke før brukeren trykker igjen (FR-6). |
| Annonsefelt | Annonsepanel | Synlig etikett «Annonse» og hjelpetekst «Lim inn hele annonsen». Tegnteller (200–8 000). |
| Avkrysning for personvern | Over *Analyser* | «Jeg har lest informasjonen om personvern.» Gjelder resten av økten, også etter *Ny analyse* (FR-5, FR-21). Etter første avkrysning vises den som avkrysset og låst. |
| *Analyser* | Forberedelse | Primærknapp. Er vilkårene ikke oppfylt, har den `aria-disabled="true"`, men kan fortsatt få fokus. Under knappen står alle årsakene som en liste, for eksempel «Annonsen må være minst 200 tegn» og «Kryss av for personvern», knyttet til knappen med `aria-describedby`. Trykk når den er deaktivert, gjør ingenting. I demomodus med egen CV vises i stedet en `Alert` over knappen (se State Patterns). |
| *Tilbake til resultatet* | Forberedelse | Sekundærknapp. Vises bare når det finnes resultater og CV-teksten og annonsen er uendret. Går tilbake til resultatet uten ny kjøring. Når teksten endres, forsvinner knappen, og en linje sier «Du har endret teksten. Trykk *Analyser* for en ny analyse.» |
| *Prøv med eksempel* | Forberedelse | Sekundærknapp. Fyller inn demoeksempelet og går rett til resultatet med lagrede svar, uten kall til språkmodellen (FR-24, FR-25). Har brukeren tekst i feltene eller resultater, vises dialogen «Erstatte teksten din med eksempelet?» først. |
| Faner | Resultat | shadcn `Tabs` med `activationMode="manual"`: piltaster flytter fokus, og fanen åpnes først med Enter eller mellomrom. En resultatdel genereres første gang fanen åpnes (PRD §3 Kjøring). *Søknadsbrev*, *CV-forbedringer* og *ATS-forslag* trenger gap-analysen (FR-18). Åpnes de mens den genereres, viser de «Venter på gap-analysen …» og starter av seg selv når den er klar. Har gap-analysen feilet, viser de «Denne delen bygger på gap-analysen. Prøv gap-analysen på nytt først.» med en knapp til den fanen. |
| Fanemerke | Fanetittel | Under generering vises en spinner med `aria-hidden="true"` og visuelt skjult tekst «, genereres». Etter redigering vises «· redigert», som også leses opp. Brukeren kan bytte fane mens en annen genereres. |
| Verktøylinje | Hver fane | *Kopier* kopierer innholdet som ren tekst slik det står etter redigering, og bekrefter med toast «Kopiert» (FR-20). *Generer på nytt* er én ny generering og åpner dialogen om overskriving hvis fanen er redigert (FR-19). Under generering har begge `aria-disabled="true"` og beholder fokus. |
| Kopiformat | *Kopier* | **Gap-analyse:** per krav «Krav — Kategori», så «Fra CV-en: «…»» og forklaring eller råd. Til slutt «Treff: 22 % (veiledende)» og nøkkelordene som er funnet og ikke funnet. **Søknadsbrev:** brevteksten. **CV-forbedringer og ATS-forslag:** per forslag «Gjelder: …», «Forslag: …» og «Hvorfor: …». |
| Oppsummering | Gap-analyse | «Du dekker X av Y krav. Z er delvis oppfylt.» Tre kategorimerker med ord og antall. Merkene er lenker til gruppeoverskriften, som får fokus (`tabindex="-1"`). |
| Kravkort | Gap-analyse | Gruppert som Oppfylt, Delvis oppfylt og Mangler, i annonsens rekkefølge innen gruppen. En tom gruppe vises ikke, men oppsummeringen viser 0. Kravteksten, forklaringen (Delvis oppfylt) og rådet (Mangler) er tekstfelt med synlige etiketter («Krav», «Hvorfor delvis», «Råd»). Kategori og belegg er låst, fordi de er kontrollert i kode (FR-9, FR-18). |
| Nedgradert krav | Gap-analyse, gruppen Mangler | Merket «Nedgradert: fant ikke belegg i CV-en». Belegget vises ikke (FR-9). Rådet er en fast tekst fra koden: «Fant ikke belegg for dette i CV-teksten. Har du denne erfaringen, trykk *Endre CV-tekst* og legg den inn.» (FR-10) |
| Belegg-sitat | Kravkort, forslagskort, *Bygger på* | Kan ikke redigeres. Teksten er alltid ordrett fra CV-teksten. |
| Treffmåler og nøkkelordliste | Gap-analyse, under kravene | Prosenten fra koden (FR-12) og teksten fra FR-13. Nøkkelordene står i to lister: «Funnet i CV-en» og «Ikke funnet». Treffprosent og nøkkelord kan ikke redigeres. |
| Brevfelt | Søknadsbrev | Et vanlig `textarea` med synlig etikett «Søknadsbrev» og ordteller (mål 250–400). Over feltet står «Fyll inn før du sender: [Ditt navn], [E-post], [Telefon]», med de plassholderne brevet faktisk har (FR-14). Plassholderne markeres ikke inne i feltet. |
| *Bygger på* | Under brevet | Liste over beleggene brevet bruker. Belegg som ikke ble funnet, vises ikke. Listen avsluttes med «1 belegg ble fjernet fordi det ikke fantes i CV-en.» når det gjelder (FR-15). |
| Forslagskort | CV-forbedringer, ATS-forslag | «Gjelder» er et belegg-sitat (CV-forbedringer) eller overskriften, linjen eller nøkkelordet forslaget gjelder (ATS-forslag), og er låst. «Forslag» og «Hvorfor» er tekstfelt med synlige etiketter (FR-16, FR-17). |
| Banner for utdatert fane | Resultat | Vises når gap-analysen er generert på nytt etter at fanen ble laget: «Basert på forrige analyse.» med *Generer på nytt* (FR-19). |
| Bekreftelsesdialog | Se IA | shadcn `AlertDialog`. *Avbryt* har fokus når dialogen åpnes. |

**Ordlyd i dialogene:**
- *Generer på nytt* i redigert fane (FR-19): «Lage nytt {fanenavn}? Redigeringene dine i {fanenavn} blir overskrevet. Det nye bygger på CV-teksten og annonsen, ikke på endringene dine. Andre faner endres ikke.» Knapper: *Avbryt*, *Lag ny*.
- *Analyser* når det finnes redigerte faner (FR-3): «Starte en ny analyse? Alle resultatdelene erstattes. Redigeringene dine i {liste over redigerte faner} blir overskrevet.» Knapper: *Avbryt*, *Analyser på nytt*.
- *Ny analyse* (FR-21): «Tømme alt? CV-teksten, annonsen og alle resultatdelene fjernes.» Knapper: *Avbryt*, *Tøm alt*.
- *Prøv med eksempel* med innhold: «Erstatte teksten din med eksempelet? CV-teksten, annonsen og eventuelle resultater erstattes.» Knapper: *Avbryt*, *Bruk eksempelet*.

## State Patterns

| Tilstand | Flate | Behandling |
|---|---|---|
| Tom | Forberedelse | Opplastingsfelt og tomt annonsefelt. *Analyser* deaktivert med årsaker. |
| Leser fil | CV-panel | Spinner i feltet: «Leser CV-en …». |
| Kort CV-tekst (< 300 tegn) | CV-panel | `Alert` over tekstfeltet: «Fant nesten ikke tekst i filen. Den kan være skannet eller tom. Lim inn teksten selv i feltet under.» (FR-3) |
| Feil format eller for stor fil | CV-panel | Feilmelding under feltet med lov format og størrelse (FR-1, FR-22). Filen leses ikke. |
| Fil kan ikke leses | CV-panel | «Klarte ikke å lese filen. Lim inn CV-teksten i stedet.» Panelet går til tilstand 2 med tomt felt. |
| Utenfor lengdegrensene | Begge paneler | Feltet får `aria-invalid="true"`, telleren og kanten blir `destructive`, og meldingen står under feltet (`aria-describedby`). «For kort» vises først når brukeren forlater feltet. «For lang» vises med en gang. Innlimt tekst kuttes ikke. *Analyser* er deaktivert (FR-4). |
| Analyserer | Resultat | Brukeren går til resultatsiden med en gang. Innen 2 sekunder vises skjelettkort og «Leser annonsen og sammenligner med CV-en …» (NFR-4). Fanepanelet har `aria-busy="true"`, og skjelettene har `aria-hidden="true"`. |
| Genererer fane | Resultat | Skjelett og en synlig tekst om hva som skjer, for eksempel «Skriver søknadsbrevet …». Brukeren kan bytte fane. |
| Venter på gap-analysen | *Søknadsbrev*, *CV-forbedringer*, *ATS-forslag* | «Venter på gap-analysen …», og genereringen starter av seg selv når den er klar. |
| Gap-analysen feilet | De tre andre fanene | «Denne delen bygger på gap-analysen. Prøv gap-analysen på nytt først.» med knapp til fanen. |
| Feil eller tidsavbrudd fra språkmodellen | Fanen det gjelder | `Alert` med feilmelding og *Prøv igjen*. Tekstene og andre faner er urørt (FR-22). |
| Ugyldig svar fra språkmodellen | Fanen det gjelder | Som over: «Svaret fra språkmodellen kunne ikke brukes. Prøv igjen.» |
| Grensen for bruk er nådd | Forberedelse eller fane | «Appen har nådd grensen for bruk akkurat nå. Prøv igjen senere, eller bruk *Prøv med eksempel*.» Ingen *Prøv igjen*-knapp (NFR-3). |
| Redigert fane | Resultat | Fanemerket «· redigert». Gir dialog før ny generering. |
| Utdatert fane | Resultat | Banner for utdatert fane (FR-19). |
| Tom kategorigruppe | Gap-analyse | Gruppen vises ikke. Oppsummeringen viser 0 for kategorien. |
| Tilbake fra *Endre CV-tekst* | Forberedelse | Tekstene er beholdt, avkrysningen er låst, og *Tilbake til resultatet* vises til teksten endres. *Analyser* starter en ny kjøring, med dialog hvis noen fane er redigert (FR-3). |
| Demomodus | Hele appen | Demobanner: «Demomodus: appen kjører uten API-nøkkel. Du kan prøve eksempelet og kontrollsteget med din egen CV.» (FR-23) |
| *Analyser* med egen CV i demomodus | Forberedelse | `Alert` rett over *Analyser*: «Full analyse av din egen CV krever en API-nøkkel. Prøv eksempelet for å se hvordan resultatet ser ut.» med knappen *Prøv med eksempel*. Fokus flyttes til varselet (FR-26). |
| Ny generering i demomodus | Resultat | Viser det lagrede svaret på nytt (FR-24). |

## Interaction Primitives

- **Mus og berøring først**, men alt kan gjøres med tastatur (NFR-8).
- *Enter* sender ikke skjemaet fra et tekstfelt. *Analyser* må trykkes.
- Redigering lagres i minnet mens brukeren skriver. Det finnes ingen *Lagre*-knapp.
- `Esc` lukker dialoger og menyer. I fanelisten flytter piltastene fokus, og Enter eller mellomrom åpner fanen.
- **Ikke i v1:** dra og slipp for å sortere, uendelig rulling, hurtigtaster, angreknapp utover nettleserens egen i tekstfelt.

**Fokus etter handling:**

| Handling | Fokus går til |
|---|---|
| Filen er lest inn | CV-tekstfeltet |
| *Lim inn CV-teksten* | CV-tekstfeltet |
| *Bytt fil* | Opplastingsknappen |
| Filen kan ikke leses | CV-tekstfeltet (meldingen står i `aria-describedby`) |
| *Analyser* | Overskriften «Resultat» (`tabindex="-1"`) |
| *Tilbake til resultatet* | Overskriften «Resultat» |
| *Endre CV-tekst* | CV-tekstfeltet |
| *Ny analyse* bekreftet | Opplastingsknappen |
| *Prøv igjen* | Fanepanelet (`tabindex="-1"`) |
| En fane er ferdig generert | Fokus flyttes ikke |
| Klikk på kategorimerke | Gruppeoverskriften |
| Dialog åpnes | *Avbryt* |
| Dialog lukkes | Knappen som åpnet den |

## Accessibility Floor

Kontrast står i `DESIGN.md`. Alle tekstpar er AA, og kanter og fokusring er minst 3:1.

- WCAG 2.1 AA på alle flater, og målet om klikkflater i WCAG 2.2 (2.5.8).
- Kategorien formidles alltid med ord, ikke bare farge og ikon, på alle skjermbredder.
- Alle tekstfelt har en `<label>` med synlig tekst. Tellere og feilmeldinger er knyttet til feltet med `aria-describedby`.
- Tellerne er ikke live-regioner. Når en grense passeres, meldes det én gang.
- Fanene er shadcn `Tabs` med riktige roller, aldri egne `span`-elementer. Skissene viser bare utseendet.
- Ikoner har `aria-hidden="true"` og står alltid sammen med synlig tekst.
- Tab-rekkefølgen følger leserekkefølgen. Fokusringen er `focus-ring` fra `DESIGN.md`.
- Klikkflater er minst 44 × 44 px på mobil og 24 × 24 px på PC.
- Ingen tidsgrense som brukeren må rekke. Ved tidsavbrudd fra språkmodellen beholdes alt, og brukeren kan prøve igjen.
- Animasjoner (spinner, skjelett) følger `prefers-reduced-motion`.

**Meldinger til skjermleser** (én `aria-live="polite"`-region for hele appen, og `role="alert"` for feil):

| Hendelse | Melding |
|---|---|
| Analysen starter | «Analyserer. Dette tar inntil 30 sekunder.» |
| Gap-analysen er klar | «Gap-analysen er klar. 3 av 6 krav er oppfylt.» |
| En annen fane er klar (også i bakgrunnen) | «Søknadsbrevet er klart.» |
| En fane feiler (også i bakgrunnen) | `role="alert"`: «Søknadsbrevet kunne ikke lages. Åpne fanen for å prøve igjen.» |
| En fane blir utdatert | «CV-forbedringer er basert på forrige analyse.» |
| Fødselsnummer maskert | «1 fødselsnummer er fjernet fra CV-teksten.» |
| Kopiert | «Kopiert.» |
| Grense i tekstfelt passert | «Annonsen er for lang. Maks 8 000 tegn.» |

**Testing:** Hver story med brukerflate testes med tastatur alene, med NVDA og Firefox eller Chrome, og med VoiceOver og Safari. Den testes også i 320 px bredde og med 200 % tekstzoom.

## Responsive & Platform

| Bredde | Oppførsel |
|---|---|
| ≥ 1024 px | CV-panelet og annonsepanelet side om side. Resultat i én kolonne på maks `{spacing.content-max}`. |
| 640–1023 px | Panelene stables. Fanene står på én linje. |
| 320–639 px | Fanene brytes over to linjer, slik at alle fire er synlige. Verktøylinjens knapper beholder teksten og kan brytes over to linjer. *Endre CV-tekst* og *Ny analyse* ligger i en `DropdownMenu` bak knappen «Valg». Kategorimerkene beholder ordet og brytes ved behov. Lange ord og nøkkelordbrikker brytes, så ingenting gir sidelengs rulling. |

## Inspiration & Anti-patterns

- **Hentet fra rettesider i skrivekurs:** sitat fra egen tekst rett ved kommentaren. Belegg-sitatet bygger på dette.
- **Forkastet: poengsum som hovedtall** (Jobscan-stil «match score»). Treffprosenten er veiledende og står under kravene, ikke øverst (PRD §7.1).
- **Forkastet: chat-grensesnitt.** Strukturen er produktet (PRD §1). Ingen samtale med språkmodellen.
- **Forkastet: «KI-glitter».** Gnister og animerte gradienter gir inntrykk av magi og gjør det vanskeligere å stole på resultatet.

## Key Flows

### UJ-1. Ida finner ut at butikkjobben teller

1. Ida åpner appen på laptopen. Forberedelsen viser personvernboksen øverst.
2. Hun drar CV-en (DOCX) inn i opplastingsfeltet. «Leser CV-en …», og så viser panelet «Kontroller CV-teksten» med teksten.
3. Hun retter en linje som ble feil, og limer inn annonsen fra Sparebanken Testvik.
4. Hun krysser av for personvern. *Analyser* blir aktiv, og hun trykker.
5. Resultatsiden åpnes med skjelettkort og «Leser annonsen og sammenligner med CV-en …».
6. **Høydepunkt:** Oppsummeringen sier «Du dekker 3 av 6 krav. 2 er delvis oppfylt.» Under «Oppfylt» står blant annet «Kundeorientert» og «Erfaring med kontanthåndtering», med sitater fra butikkjobben og kasserervervet. Ida ser hva hun faktisk dekker, og hvorfor.
7. Under «Mangler» står AFR-autorisasjonen med et ærlig råd. Under kravene ser hun treffprosenten og hvilke nøkkelord som er funnet.
8. Hun åpner *Søknadsbrev*. «Skriver søknadsbrevet …», og så kommer brevet med *Bygger på* under. Hun endrer en setning og trykker *Kopier*.
9. Hun lukker fanen. Ingenting ligger igjen.

**Feil:** Språkmodellen svarer ikke i steg 5. Fanen viser «Språkmodellen svarte ikke. Teksten din er tatt vare på.» og *Prøv igjen*. CV-teksten og annonsen er urørt.

**Variant, erfaring som mangler:** Ida kommer på at hun også hjelper kunder med betalingsterminalen i butikken, noe som ikke står i CV-en. Hun trykker *Endre CV-tekst*, legger det inn og trykker *Analyser*. Hun har redigert brevet, så dialogen sier «Redigeringene dine i Søknadsbrev blir overskrevet.» Hun bekrefter, og en ny kjøring starter. Hadde hun ombestemt seg før hun endret teksten, kunne hun trykket *Tilbake til resultatet*.

### UJ-2. Mina laster opp en CV med to kolonner

1. Mina laster opp en PDF med to kolonner.
2. I kontrollsteget ser hun venstre kolonne (kontakt, ferdigheter, språk, kurs) før høyre (profil, utdanning, erfaring), uten flettede linjer.
3. Hun limer inn annonsen fra Hotell Testfjord, krysser av og trykker *Analyser*.
4. **Høydepunkt:** «Erfaring med bookingsystemer, gjerne Opera» står under Mangler, med rådet om å vise at hun vil lære bookingsystemet og peke på erfaringen med kassasystem. «Gode språkkunnskaper i engelsk og tysk» står under Delvis oppfylt med forklaringen «Engelsk er oppgitt som godt, tysk som grunnleggende.»
5. Hun åpner *Søknadsbrev* og *CV-forbedringer*. Ingen av dem sier at hun kan Opera eller snakker godt tysk.

**Feil:** PDF-en er skannet. Kontrollsteget viser advarselen om kort CV-tekst, og Mina limer inn teksten selv i samme felt.

### UJ-3. Marit, sensor, kjører appen uten nøkkel

1. Marit starter appen fra README-en uten API-nøkkel. Demobanneret vises øverst.
2. Hun trykker *Prøv med eksempel*. Resultatsiden viser Idas gap-analyse med en gang.
3. Hun åpner alle fire fanene. Hver vises fra lagrede svar, og treffprosenten regnes i kode.
4. **Høydepunkt:** Hun redigerer brevet og kopierer det. Alt virker uten nøkkel.
5. Hun trykker *Endre CV-tekst*, bytter fil og ser kontrollsteget med sin egen CV. Når hun trykker *Analyser*, vises varselet om at full analyse krever en API-nøkkel, med knappen *Prøv med eksempel*.

## Åpne punkter

- `[ANTAKELSE]` shadcn/ui og Tailwind bekreftes eller endres i `bmad-architecture`.
