# Tilbakemelding på product brief

| | |
|---|---|
| **Gruppe** | G69 – G69-heggdal-skogheim |
| **Product brief** | `_bmad-output/planning-artifacts/briefs/brief-G69-heggdal-skogheim-2026-09-17/brief.md` (commit `b382a4b`) |
| **Tilbakemelding fra** | Faglærer i IBE160 (utarbeidet med KI-støtte) |
| **Dato** | 2026-10-06 |

## Samlet vurdering

- **Godt utgangspunkt med justeringer.** Gruppen kan gå videre og innarbeide punktene under.

Vi har vurdert `brief.md` for «AI CV & Job Application Assistant» sammen med `addendum.md` i samme mappe.

**Det som er bra:**

1. Briefen er ærlig og godt avgrenset. Dere skriver rett ut at markedet allerede har Teal, Rezi, Jobscan og Kickresume, og plasserer differensieringen i norsk språk, studenter som målgruppe og brukerkontroll. Addendumet er også tydelig på at kildene er markedsføringsmateriell og ikke verifiserte fakta. Det er god kildekritikk.
2. Prinsippet om at verktøyet «aldri skal dikte opp erfaring, ferdigheter eller utdanning» er formulert som et eget suksesskriterium. Det er et viktig og testbart kvalitetskrav for en KI-funksjon, og det gir et godt utgangspunkt for kvalitetssikringen.

**De viktigste endringene:**

1. De åpne spørsmålene om brukerkontoer, lagring og personvern må avklares før arkitekturen. CV-er inneholder personopplysninger, og valget påvirker både omfang, sikkerhet og hva sensor må sette opp. Et enkelt valg for v1 er ingen kontoer og ingen varig lagring, slik at alt behandles i økten og slettes etterpå.
2. Kriteriet «oppleves som relevant og spesifikt … ikke generisk» kan ikke testes slik det står. Gjør det sjekkbart, for eksempel med et sett eksempel-CV-er og -annonser og en enkel sjekkliste for vurderingen.
3. Fem ulike KI-genereringer i v1 (søknadsbrev, CV-forbedringer, nøkkelord, gap-analyse og ATS-forslag) er mye å kvalitetssikre. Prioriter rekkefølgen, slik at kjerneflyten blir ferdig og stabil først.

## Vanskelighetsgrad og gjennomførbarhet

### Vurdert vanskelighetsgrad

- **Middels**

**Sammenlignbart med:** 2) AI CV- og søknadsassistent (middels). Briefen beskriver i praksis dette forslaget, avgrenset til studenter og norsk språk.

**Begrunnelse:**

| Faktor | Nivå (lav / middels / høy) | Kommentar |
|---|---|---|
| Domenelogikk – hvor mange og hvor kompliserte regler og beregninger må stemme? | lav | Lite regelbasert logikk. Det meste av verdien kommer fra KI-genereringen. Et nøkkelordtreff kan eventuelt beregnes i kode. |
| Datamodell – antall entiteter og relasjoner mellom dem | lav | CV, stillingsannonse og genererte resultater. Mer hvis dere velger kontoer og lagring. |
| Brukere, roller og innlogging | lav | Én målgruppe. Innlogging er ikke besluttet, og uten innlogging forblir nivået lavt. |
| KI-funksjonalitet i appen, f.eks. kall til språkmodell, prompts i koden og håndtering av usikre svar | høy | Fem genereringer på norsk med strenge krav om ikke å dikte opp kvalifikasjoner. Prompts, struktur på svarene og kontroll av innholdet blir den største jobben. |
| Integrasjoner og eksterne tjenester, f.eks. API-er, betaling og e-post | middels | Språkmodell-API. LinkedIn og jobbportaler er bevisst holdt utenfor. |
| Sanntid, samtidighet eller flere brukere som påvirker hverandre | lav | Ingen. |
| Filhåndtering, f.eks. opplasting, PDF-lesing og eksport | middels | Opplasting av PDF, DOCX og TXT. CV-er har ofte kolonner og tabeller som gjør tekstuttrekk upålitelig. Eksport er ikke nevnt. |
| Sikkerhet og personvern | middels | CV-er med personopplysninger sendes til en ekstern språkmodell. Det bør beskrives og begrunnes, også med tanke på refleksjonsrapporten. |

**Hva vanskelighetsgraden betyr for dere:**

- _Middels:_ Et godt balansert valg. Pass på at kjerneflyten blir ferdig og stabil før dere legger til mer. Her er kjerneflyten: last opp CV → lim inn annonse → få søknadsbrev og gap-analyse → rediger.

### Gjennomførbarhet med BMAD og Claude Code

Dere skal planlegge med BMAD (product brief → PRD → arkitektur → epics og stories) og implementere med Claude Code. Vurderingen under tar hensyn til at det må være tid til hele denne flyten, og til testing, retting og README til slutt.

| Spørsmål | Vurdering (OK / risiko / stor risiko) | Kommentar |
|---|---|---|
| **Tid og omfang** – kan v1 realistisk bli ferdig og stabil i løpet av semesteret, med tid til flere iterasjoner? | OK | Omfanget er realistisk for to personer, særlig hvis dere velger bort kontoer og lagring i v1. |
| **BMAD-flyten** – er briefen konkret nok til at PRD, arkitektur og stories kan lages uten store hull, og blir det overkommelig mange stories? | OK | Funksjonene er tydelig listet. De fire åpne spørsmålene må besvares tidlig i PRD-en. |
| **Egnet for Claude Code** – bruker løsningen en vanlig, godt dokumentert teknologistakk som Claude Code håndterer godt, eller krever den nisjeteknologi, spesialmaskinvare eller mye manuell konfigurasjon? | OK | En webapp med filopplasting og LLM-kall er godt egnet. Biblioteker for PDF og DOCX er godt dokumentert. |
| **Kontroll på KI-ens arbeid** – kan gruppen selv avgjøre om koden gjør det riktige? Krever domenet kunnskap gruppen ikke har, f.eks. avanserte beregninger eller fagregler, så er det vanskelig å kvalitetssikre. | risiko | Dere kan vurdere søknader selv, men det er vanskelig å sjekke systematisk at KI-en ikke dikter opp noe. Planlegg en konkret metode, for eksempel en test-CV med kjent innhold der dere kontrollerer at ingen nye kvalifikasjoner dukker opp. |
| **Testbarhet** – finnes det tydelige regler og forventede resultater som tester kan skrives mot? | risiko | Filopplasting, tekstuttrekk og flyten kan testes automatisk. KI-svarene må testes med mock-svar i automatiske tester og med et fast testsett og sjekkliste manuelt. |
| **Kjørbar for sensor** – kan appen kjøres lokalt etter README, uten gruppens nøkler, betalte kontoer eller egen infrastruktur? | risiko | Ikke omtalt. Sensor trenger enten egen nøkkel eller en demomodus med forhåndslagrede svar for en eksempel-CV. |
| **Avhengigheter og kostnader** – krever løsningen betalte API-er, f.eks. språkmodeller, og finnes det en plan for kostnad, testmodus eller mock-data? | risiko | Fem genereringer per kjøring gir mange kall. Velg modell med kostnad i tankene, og lag mock-svar for utvikling og testing. |

**Konklusjon om gjennomførbarhet:**

- **Gjennomførbart som beskrevet.**

**Forslag til justering av omfang eller vanskelighetsgrad:**

1. Velg «ingen kontoer, ingen varig lagring» for v1. Det forenkler personvernet og gjør appen lettere å kjøre. Lagring av tidligere søknader kan være en tydelig utvidelse senere.
2. Prioriter rekkefølgen: (1) gap-analyse og nøkkelord, (2) søknadsbrev, (3) CV-forbedringer og ATS-forslag. Vurder å beregne nøkkelordtreffet i vanlig kode, for eksempel som andel av annonsens nøkkelord som finnes i CV-en. Det gir en del av appen som kan testes nøyaktig.

## Hvorfor product brief er viktig for mappen

Product brief er utgangspunktet for PRD, arkitektur, stories og til slutt koden. Del 1 av mappen vurderes blant annet på om sensor kan følge en sporbar vei fra plan til ferdig app. Den vurderes også på om appen gjør det dere har beskrevet, om den er testet, om den er godt designet, og om den kan kjøres etter README. Et uklart, for stort eller for lite brief gjør alt dette vanskeligere senere. Det er mye enklere å rette nå enn sent i semesteret.

## 1. Gjennomgang av briefens deler

| Del av brief | Status | Kommentar |
|---|---|---|
| Executive Summary – er det klart hva appen er, og hvilket problem den løser? | OK | Klart: last opp CV og annonse, få skreddersydd innhold og analyser. |
| The Problem – er problemet konkret, med reelle situasjoner og brukere? | OK | Konkret om generiske søknader og tidsbruk. Det kunne gjerne hatt ett eksempel, som en student som søker sommerjobb med en kort CV. |
| The Solution – beskriver løsningen brukeropplevelsen, ikke bare teknologi? | Juster | Kort og uten teknologi, men viser i stor grad til Omfang. Beskriv hvordan brukeren ser og redigerer resultatene, for eksempel faner per resultat og redigering i tekstfelt. |
| What Makes This Different – er vurderingen ærlig og realistisk? | OK | Svært ærlig og godt underbygget i addendum. |
| Who This Serves – er primærbrukerne tydelige, og vet vi hva de trenger? | OK | Én tydelig målgruppe: studenter og unge jobbsøkere med kort eller ujevn CV. |
| Success Criteria – kan kriteriene faktisk sjekkes eller testes? | Juster | Tre av fire kriterier kan sjekkes. Gjør «oppleves som relevant» sjekkbart med et fast testsett. Legg gjerne til «en CV i PDF med to kolonner leses inn uten at tekst går tapt» og «ved feil fra språkmodellen får brukeren en forståelig melding». |
| Scope – er det klart hva som er med i første versjon, og hva som ikke er det? | OK | Tydelig delt i inkludert og utenfor. Ta inn beslutningen om kontoer og lagring når den er tatt. |
| Vision – henger visjonen sammen med resten uten å blåse opp omfanget? | OK | Bevisst nøktern: en solid MVP, uten videre planer. Det er helt greit. |

## 2. Utgangspunkt for del 1 av mappen

Punktene følger kriteriene i sensorveiledningen for del 1. Vektene i parentes viser hvor mye hvert kriterium teller i del 1.

| Kriterium i del 1 | Hva briefen bør legge til rette for | Status | Kommentar |
|---|---|---|---|
| **1. Prosess og KI-styring** (30 %) | Brief som er presis nok til at PRD og stories kan bygges direkte på den, slik at krav kan spores fra brief til kode. | OK | Briefen er presis og ligger i BMAD-strukturen. Dere har allerede dokumentert at research ble gjort av en KI-agent. Fortsett å vise slike valg og vurderinger. |
| **2. Funksjonalitet og omfang** (20 %) | Realistisk omfang for gruppen og semesteret: en tydelig kjerneflyt som kan bli ferdig og stabil, og nok innhold til å vise reell funksjonalitet. | OK | Realistisk omfang med tydelig kjerneflyt og nok funksjonalitet. |
| **3. Kvalitetssikring og testing** (15 %) | Suksesskriterier og funksjoner som er konkrete nok til å bli testtilfeller. | Juster | Kravet om ingen oppdiktede kvalifikasjoner er godt. Lag et fast testsett med 3–5 CV-er og annonser og en sjekkliste, og bruk mock-svar i automatiske tester. |
| **4. Design og brukeropplevelse** (10 %) | Tydelige brukere og brukssituasjoner som designet kan bygges rundt, gjerne med de viktigste skjermbildene eller flytene skissert. | Juster | Målgruppen er tydelig. Skisser opplasting, resultatsiden med fem typer innhold og redigering, siden mye innhold på én side fort blir uoversiktlig. |
| **5. Kodekvalitet og arkitektur** (10 %) | Teknologivalg som er begrunnet og ikke mer komplekse enn appen trenger. | OK | Modellvalg er bevisst utsatt til arkitekturen. Samle prompts og LLM-kall i én modul, så de er lette å forbedre og teste. |
| **6. README og kjørbarhet** (10 %) | Løsning som andre kan kjøre lokalt uten betalte kontoer, og uten tilgang til gruppens egne tjenester og nøkler. | Juster | Planlegg demomodus eller mock-svar når API-nøkkel mangler, og legg ved en fiktiv eksempel-CV og -annonse. |
| **7. Ryddighet i repoet** (5 %) | En plan for hvor hemmeligheter, testdata og dokumentasjon skal ligge. | Juster | Bruk bare fiktive CV-er som testdata i repoet. Ekte CV-er må aldri committes. Hold API-nøkkelen i `.env` som ikke committes. |

## 3. Neste steg for gruppen

1. Besvar de åpne spørsmålene i briefen: kontoer og lagring (anbefalt nei i v1), personvern og datahåndtering, og hvordan gap-analysen skal vurdere «svake» kvalifikasjoner.
2. Gjør suksesskriteriet om relevans sjekkbart, og lag et fast testsett med fiktive CV-er og annonser.
3. Prioriter rekkefølgen på de fem genereringene, beskriv demomodus for sensor, og gå videre til PRD.

Oppdater product brief i repoet når dere har gjort endringene, slik at historikken viser hvordan planen utviklet seg. Det er en del av prosessen sensor ser etter.
