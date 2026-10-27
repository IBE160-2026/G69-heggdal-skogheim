---
title: AI CV & Job Application Assistant
status: final
created: 2026-09-17
updated: 2026-10-27
authors: Sondre Skogheim, Kevin Heggdal
course: IBE160 Programmering med KI, Høgskolen i Molde
---

# Produktbrief: AI CV & Job Application Assistant

## Sammendrag

AI CV & Job Application Assistant er en webapplikasjon som hjelper studenter og unge jobbsøkere med å skreddersy CV-er og søknadsbrev til konkrete stillingsannonser ved hjelp av kunstig intelligens. Brukeren laster opp sin eksisterende CV (PDF, DOCX eller TXT) og legger inn en stillingsannonse, og verktøyet analyserer begge for å generere et skreddersydd søknadsbrev, konkrete forbedringsforslag til CV-en, en oversikt over sentrale ferdigheter og nøkkelord fra annonsen, en gap-analyse mot stillingskravene og forslag til ATS-optimalisering (Applicant Tracking System).

Brukeren beholder full kontroll over alt AI-generert innhold (se Løsningen). Siden løsningen behandler CV-er med personopplysninger, har v1 verken brukerkontoer eller varig lagring: alt behandles i økten og slettes etterpå (se Personvern og datahåndtering). Målet er å gjøre det raskere og enklere for målgruppen å forstå hva arbeidsgivere faktisk ser etter, og å levere en søknad tilpasset akkurat den aktuelle stillingen — uten å bygge en fullverdig rekrutteringsplattform.

## Problemet

Mange studenter og unge jobbsøkere har begrenset erfaring med å skrive profesjonelle CV-er og søknader, og strever med å forstå hva en stillingsannonse faktisk etterspør. Konsekvensen er ofte generiske søknader som ikke fremhever relevant kompetanse, og som dermed presterer dårligere både hos rekrutterere og i automatiserte ATS-systemer.

Å skrive en ny, tilpasset søknad for hver enkelt stilling er også tidkrevende. I praksis fører dette til at mange velger bort skreddersøm til fordel for volum — med lavere kvalitet og relevans som resultat.

**Eksempel:** Ida (21) studerer økonomi og søker sommerjobb som kundebehandler i en bank. CV-en hennes er kort: deltidsjobb i dagligvarebutikk, frivillig arbeid som kasserer i et idrettslag og noen fag fra studiet. Annonsen ber om «kundeorientering», «gode digitale ferdigheter» og «erfaring med kontanthåndtering». Ida ser ikke at butikkjobben og kasserervervet faktisk dekker flere av kravene, og sender den samme generelle søknaden hun har brukt til ti andre stillinger.

## Løsningen

Kjerneflyten er: **last opp CV → lim inn annonse → få gap-analyse og søknadsbrev → rediger.**

1. **Startsiden** har to felt: opplasting av CV (PDF, DOCX eller TXT) og et tekstfelt der brukeren limer inn stillingsannonsen. Over feltene står en kort, tydelig melding om at CV-teksten sendes til en ekstern språkmodell for analyse, og at ingenting lagres etter økten.
2. **Kontroll av innlest tekst.** Etter opplasting viser appen teksten som ble lest ut av CV-en, slik at brukeren kan se og rette eventuelle feil før analysen starter. Dette er viktig fordi CV-er med kolonner og tabeller kan gi ufullstendig tekstuttrekk.
3. **Resultatsiden** er delt i faner, én per resultattype, i prioritert rekkefølge: *Gap-analyse og nøkkelord*, *Søknadsbrev*, *CV-forbedringer* og *ATS-forslag*. Faner hindrer at fem typer innhold havner på én uoversiktlig side.
4. **Redigering.** Alt generert innhold vises i redigerbare tekstfelt. Brukeren kan endre teksten, generere en enkeltdel på nytt og kopiere den ferdige teksten.
5. **Feilhåndtering.** Feiler opplastingen eller kallet til språkmodellen, får brukeren en forståelig melding på norsk om hva som gikk galt og hva hen kan gjøre, og det som allerede er lagt inn, går ikke tapt.

Verktøyet skal aldri dikte opp erfaring, ferdigheter eller utdanning brukeren ikke faktisk har. Alt AI-generert innhold er forslag som brukeren gjennomgår og redigerer før det tas i bruk.

### Gap-analyse og «svake» kvalifikasjoner

Hvert krav i annonsen plasseres i én av tre kategorier:

- **Oppfylt:** CV-en dokumenterer kravet direkte. Analysen viser hvilken del av CV-en som dekker kravet.
- **Delvis oppfylt:** CV-en inneholder relatert erfaring som kan brukes som argument, men ikke direkte dekker kravet (f.eks. kravet «erfaring med kundeservice» og CV-en nevner butikkjobb). Analysen viser hvilken del av CV-en vurderingen bygger på, og forklarer kort hvorfor den bare er delvis.
- **Mangler:** CV-en inneholder ingenting som dekker kravet. Analysen gir et ærlig råd om hvordan brukeren kan håndtere det, for eksempel å nevne motivasjon for å lære, men foreslår aldri at brukeren skal påstå å ha kvalifikasjonen.

Regelen er at «Oppfylt» og «Delvis oppfylt» alltid må kunne begrunnes med tekst som faktisk står i CV-en. Er det tvil, velges den svakeste kategorien.

### Nøkkelordtreff beregnes i kode

Nøkkelordene hentes ut fra annonsen av språkmodellen, men selve treffet beregnes i vanlig kode: andelen av annonsens nøkkelord som finnes i CV-teksten. Det gir et deterministisk tall som kan enhetstestes nøyaktig, i motsetning til KI-genererte vurderinger.

### Demomodus

Appen kan kjøres uten API-nøkkel. Mangler nøkkelen, starter den i demomodus med forhåndslagrede svar for en fiktiv eksempel-CV og -annonse som ligger i repoet. Slik kan sensor og andre kjøre appen lokalt etter README uten betalte kontoer eller gruppens nøkler. De samme forhåndslagrede svarene brukes som mock-svar i automatiske tester og under utvikling, slik at vi ikke bruker API-kall unødvendig.

## Hva gjør dette annerledes

Markedet for AI-drevne CV- og søknadsverktøy er allerede godt utbygd (blant annet Teal, Rezi, Jobscan og Kickresume dekker deler av, eller hele, denne funksjonaliteten hver for seg). Verktøyet hevder derfor ikke å være unikt på funksjonsnivå i første versjon (v1). Differensieringen i v1 ligger heller i:

- Et bevisst smalt og realistisk omfang, rettet spesifikt mot studenter og unge jobbsøkere — ikke en bred rekrutteringsplattform
- Norsk språkstøtte, i et marked der mange etablerte verktøy primært er engelskspråklige
- Et eksplisitt prinsipp om brukerkontroll og ærlighet i alt AI-generert innhold (se Løsningen)

Dette er en bevisst og forsvarlig posisjon for et fokusert studentprosjekt — ikke en påstand om markedsnyhet. (Se `addendum.md` for detaljert sammenligning med eksisterende verktøy.)

## Hvem dette er for

Studenter og unge jobbsøkere i det norske arbeidsmarkedet, med begrenset erfaring i å skrive profesjonelle CV-er og søknader. De søker typisk deltidsjobber, sommerjobber, praksisplasser eller sin første faste stilling etter studier, og har ofte en kort eller ujevn CV der det er vanskelig å vite hva som bør fremheves. Dette er den eneste målgruppen for v1 — det er ikke besluttet noen sekundær målgruppe.

## Suksesskriterier

Kriteriene sjekkes mot et fast testsett med fiktive CV-er og stillingsannonser, en fasit per par og en sjekkliste. Testsettet ligger i `testdata/` i repoet (se `testdata/README.md`).

For første versjon anses løsningen som vellykket når:

1. **Hele flyten fungerer:** En bruker kan laste opp CV, legge inn stillingsannonse og motta gap-analyse, nøkkelord, søknadsbrev, CV-forbedringer og ATS-forslag.
2. **Innholdet er relevant og spesifikt:** For hvert par i testsettet består det genererte innholdet alle punktene i `testdata/sjekkliste.md`. Blant annet skal søknadsbrevet vise til minst tre konkrete krav fra annonsen og minst to konkrete erfaringer fra CV-en.
3. **Ingenting er diktet opp:** For hvert par i testsettet inneholder ingen genererte forslag kvalifikasjoner, ferdigheter, utdanning eller erfaring som ikke står i CV-en. Dette kontrolleres mot listen over «forbudte påstander» i fasiten til hvert par.
4. **Gap-analysen stemmer med fasiten:** Kravene som er markert som «Mangler» i fasiten, havner aldri i «Oppfylt».
5. **Nøkkelordtreffet er korrekt:** Treffprosenten som beregnes i kode, gir forventet resultat i enhetstestene.
6. **Brukeren har kontroll:** Alt AI-generert innhold kan gjennomgås og redigeres før det brukes videre.
7. **Innlesing tåler vanlige CV-oppsett:** En CV i PDF med to kolonner leses inn uten at tekst går tapt.
8. **Feil håndteres:** Ved feil fra språkmodellen eller ved opplasting av en fil som ikke kan leses, får brukeren en forståelig melding på norsk, og appen krasjer ikke.
9. **Appen kan kjøres av andre:** Appen kan startes lokalt etter README uten API-nøkkel, i demomodus.

## Omfang

### Inkludert i første versjon (v1), i prioritert rekkefølge

Kjerneflyten bygges og stabiliseres først. Neste prioritet påbegynnes først når den forrige fungerer.

1. **Grunnmur:** Opplasting av CV (PDF, DOCX, TXT) med visning av innlest tekst, innlegging av stillingsannonse og demomodus med forhåndslagrede svar
2. **Gap-analyse og nøkkelord:** Identifisering av sentrale ferdigheter og nøkkelord fra annonsen, nøkkelordtreff beregnet i kode og gap-analyse med tre kategorier
3. **Søknadsbrev:** Generering av skreddersydd søknadsbrev
4. **CV-forbedringer og ATS-forslag:** Analyse og forbedringsforslag til CV-en og forslag til ATS-optimalisering

Gjennomgående for alle punktene:

- Mulighet til å gjennomgå og redigere alt AI-generert innhold før bruk
- Forståelige feilmeldinger på norsk
- Norsk språkstøtte: verktøyet og alt generert innhold skal håndtere norske CV-er, stillingsannonser og søknader

### Eksplisitt utenfor første versjon

- Brukerkontoer og innlogging
- Varig lagring av CV-er, annonser eller resultater (lagring av tidligere søknader er en mulig utvidelse senere)
- Eksport til PDF eller DOCX — brukeren kopierer den ferdige teksten
- Jobbsporing / oversikt over søknader
- Automatisk jobbsøk
- Intervjuforberedelse
- Direkte integrasjon med LinkedIn eller jobbportaler
- Støtte for andre språk enn norsk
- Valg av spesifikk AI-modell/teknisk plattform — utsettes bevisst til arkitekturfasen

## Personvern og datahåndtering

CV-er inneholder personopplysninger. Følgende er besluttet for v1:

- **Ingen kontoer og ingen varig lagring.** CV, annonse og resultater holdes bare i minnet under økten og lagres ikke i database eller på disk. Når økten avsluttes, er dataene borte.
- **Ekstern språkmodell.** CV-teksten sendes til en ekstern språkmodell for analyse. Brukeren informeres om dette før opplasting. Ved valg av leverandør i arkitekturfasen vektlegges vilkårene for hvordan API-data brukes og lagres.
- **Ingen logging av CV-innhold.** Appen skriver ikke CV-tekst eller genererte resultater til logger.
- **Hemmeligheter.** API-nøkkelen ligger i en `.env`-fil som er ignorert av Git. Repoet inneholder bare en `.env.example` uten ekte nøkkel.
- **Testdata.** Repoet inneholder bare fiktive CV-er og annonser. Ekte CV-er skal aldri committes.

## Kvalitetssikring av KI-innholdet

Den største risikoen i prosjektet er at KI-genereringen er vanskelig å kontrollere. Vi håndterer det slik:

- **Fast testsett:** 3–5 fiktive CV-er og annonser med kjent innhold og en fasit per par i `testdata/`. Hvert par har en liste over kvalifikasjoner CV-en faktisk har, forventet kategori for hvert krav i gap-analysen og en liste over «forbudte påstander» som aldri skal dukke opp.
- **Manuell sjekkliste:** Ved hver vesentlige endring i prompts kjøres testsettet, og resultatene vurderes mot `testdata/sjekkliste.md`.
- **Automatiske tester med mock-svar:** Filopplasting, tekstuttrekk, nøkkelordtreff og flyten testes automatisk med forhåndslagrede svar i stedet for ekte API-kall.
- **Prompts samlet ett sted:** Alle prompts og kall til språkmodellen samles i én modul, slik at de er lette å forbedre og teste.
- **Kostnad:** Fem genereringer per kjøring gir mange API-kall. Modellen velges med kostnad i tankene, og mock-svar brukes under utvikling og testing.

## Antakelser og åpne spørsmål

- **Besluttet (2026-10-27):** v1 har ingen brukerkontoer og ingen varig lagring (se Omfang og Personvern og datahåndtering).
- **Besluttet (2026-10-27):** Personvern og datahåndtering er beskrevet i egen seksjon.
- **Besluttet (2026-10-27):** Gap-analysen bruker tre kategorier, og «Oppfylt» og «Delvis oppfylt» må begrunnes med tekst fra CV-en (se Løsningen).
- **Åpent:** Valg av AI-modell/teknisk plattform er ikke besluttet. Det avgjøres i arkitekturfasen, med vekt på kostnad, norsk språkkvalitet og vilkår for databehandling.

## Visjon

Ambisjonen for dette prosjektet er å levere en solid, avgrenset MVP innenfor rammen av IBE160 — ikke å bygge en bred plattform. Gruppen har ikke besluttet noen retning utover dette, og eventuell videreutvikling etter kursprosjektet er ikke en del av denne briefen.

## Endringslogg

- **2026-09-17:** Første versjon.
- **2026-10-27:** Revidert etter tilbakemelding fra faglærer (`tilbakemelding-product-brief.md`): besluttet ingen kontoer og ingen varig lagring, la til seksjon om personvern og datahåndtering, definerte kategoriene i gap-analysen, gjorde suksesskriteriene testbare med et fast testsett, prioriterte rekkefølgen på genereringene, beskrev brukeropplevelsen og demomodus, og la til et konkret eksempel i problembeskrivelsen.
