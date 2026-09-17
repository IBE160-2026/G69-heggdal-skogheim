---
title: AI CV & Job Application Assistant
status: final
created: 2026-09-17
updated: 2026-09-17
authors: Sondre Skogheim, Kevin Heggdal
course: IBE160 Programmering med KI, Høgskolen i Molde
---

# Produktbrief: AI CV & Job Application Assistant

## Sammendrag

AI CV & Job Application Assistant er en webapplikasjon som hjelper studenter og unge jobbsøkere med å skreddersy CV-er og søknadsbrev til konkrete stillingsannonser ved hjelp av kunstig intelligens. Brukeren laster opp sin eksisterende CV (PDF, DOCX eller TXT) og legger inn en stillingsannonse, og verktøyet analyserer begge for å generere et skreddersydd søknadsbrev, konkrete forbedringsforslag til CV-en, en oversikt over sentrale ferdigheter og nøkkelord fra annonsen, en gap-analyse mot stillingskravene og forslag til ATS-optimalisering (Applicant Tracking System).

Brukeren beholder full kontroll over alt AI-generert innhold (se Løsningen), og siden løsningen behandler CV-er med personopplysninger, er personvern et sentralt hensyn (se Antakelser og åpne spørsmål). Målet er å gjøre det raskere og enklere for målgruppen å forstå hva arbeidsgivere faktisk ser etter, og å levere en søknad tilpasset akkurat den aktuelle stillingen — uten å bygge en fullverdig rekrutteringsplattform.

## Problemet

Mange studenter og unge jobbsøkere har begrenset erfaring med å skrive profesjonelle CV-er og søknader, og strever med å forstå hva en stillingsannonse faktisk etterspør. Konsekvensen er ofte generiske søknader som ikke fremhever relevant kompetanse, og som dermed presterer dårligere både hos rekrutterere og i automatiserte ATS-systemer.

Å skrive en ny, tilpasset søknad for hver enkelt stilling er også tidkrevende. I praksis fører dette til at mange velger bort skreddersøm til fordel for volum — med lavere kvalitet og relevans som resultat.

## Løsningen

Brukeren laster opp sin eksisterende CV og legger inn en stillingsannonse. AI-en analyserer begge dokumentene og genererer et sett med skreddersydd innhold og analyser — søknadsbrev, CV-forbedringer, nøkkelord, gap-analyse og ATS-optimalisering (se Omfang for full liste over funksjonalitet).

Brukeren beholder alltid full kontroll: alt AI-generert innhold kan gjennomgås og redigeres før det tas i bruk, og verktøyet skal aldri dikte opp erfaring, ferdigheter eller utdanning brukeren ikke faktisk har.

## Hva gjør dette annerledes

Markedet for AI-drevne CV- og søknadsverktøy er allerede godt utbygd (blant annet Teal, Rezi, Jobscan og Kickresume dekker deler av, eller hele, denne funksjonaliteten hver for seg). Verktøyet hevder derfor ikke å være unikt på funksjonsnivå i første versjon (v1). Differensieringen i v1 ligger heller i:

- Et bevisst smalt og realistisk omfang, rettet spesifikt mot studenter og unge jobbsøkere — ikke en bred rekrutteringsplattform
- Norsk språkstøtte, i et marked der mange etablerte verktøy primært er engelskspråklige
- Et eksplisitt prinsipp om brukerkontroll og ærlighet i alt AI-generert innhold (se Løsningen)

Dette er en bevisst og forsvarlig posisjon for et fokusert studentprosjekt — ikke en påstand om markedsnyhet. (Se `addendum.md` for detaljert sammenligning med eksisterende verktøy.)

## Hvem dette er for

Studenter og unge jobbsøkere i det norske arbeidsmarkedet, med begrenset erfaring i å skrive profesjonelle CV-er og søknader. De søker typisk deltidsjobber, sommerjobber, praksisplasser eller sin første faste stilling etter studier, og har ofte en kort eller ujevn CV der det er vanskelig å vite hva som bør fremheves. Dette er den eneste målgruppen for v1 — det er ikke besluttet noen sekundær målgruppe.

## Suksesskriterier

For første versjon anses løsningen som vellykket når:

- En bruker kan fullføre hele flyten: laste opp CV, legge inn stillingsannonse, og motta søknadsbrev, CV-forbedringer, nøkkelord, gap-analyse og ATS-optimalisering
- Det genererte innholdet oppleves som relevant og spesifikt for den aktuelle stillingen, ikke generisk
- Ingen genererte forslag inneholder kvalifikasjoner, ferdigheter, utdanning eller erfaring som ikke finnes i brukerens faktiske CV
- Brukeren kan gjennomgå og redigere alt AI-generert innhold før det brukes videre

## Omfang

### Inkludert i første versjon (v1)

- Opplasting av eksisterende CV (PDF, DOCX, TXT)
- Innlegging av stillingsannonse
- Generering av skreddersydd søknadsbrev
- Analyse og forbedringsforslag til CV-en
- Identifisering av sentrale ferdigheter og nøkkelord fra stillingsannonsen
- Gap-analyse mellom CV og stillingskrav
- Forslag til ATS-optimalisering
- Mulighet til å gjennomgå og redigere alt AI-generert innhold før bruk
- Norsk språkstøtte: verktøyet og alt generert innhold skal håndtere norske CV-er, stillingsannonser og søknader

### Eksplisitt utenfor første versjon

- Jobbsporing / oversikt over søknader
- Automatisk jobbsøk
- Intervjuforberedelse
- Direkte integrasjon med LinkedIn eller jobbportaler
- Støtte for andre språk enn norsk
- Valg av spesifikk AI-modell/teknisk plattform — utsettes bevisst til arkitekturfasen

## Antakelser og åpne spørsmål

- **Åpent:** Om v1 skal ha brukerkontoer og/eller persistent lagring av data på tvers av økter er ikke besluttet. Dette er bevisst holdt åpent som en teknisk/designmessig beslutning for senere faser, ikke en antakelse i denne briefen.
- **Åpent:** Valg av AI-modell/teknisk plattform er ikke besluttet (se Omfang).
- **Åpent:** Personvern og datahåndtering for CV-er (som inneholder personopplysninger) er ikke løst her og må adresseres tidlig i teknisk design.
- **Åpent:** Hvor strengt/subjektivt AI-en skal vurdere «svake» kvalifikasjoner i gap-analysen er ikke definert og bør presiseres i PRD-fasen.

## Visjon

Ambisjonen for dette prosjektet er å levere en solid, avgrenset MVP innenfor rammen av IBE160 — ikke å bygge en bred plattform. Gruppen har ikke besluttet noen retning utover dette, og eventuell videreutvikling etter kursprosjektet er ikke en del av denne briefen.
