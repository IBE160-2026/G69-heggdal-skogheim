# Testsett: mistral mistral-large-4-0

- **Commit:** `51d598996aa4869413a11aaf925a5c5b9254eb34`
- **Leverandør:** mistral
- **Modell (bedt om):** mistral-large-4-0
- **Modellversjon fra leverandøren:** ukjent (1 kjøring)
- **Dato:** 2026-11-19T15:07:33.932Z
- **Priser:** 7 kr per million input-tokens, 21 kr per million output-tokens
- **Kjøringer per par:** 1
- **Temperatur:** 0.2
- **Tak for output-tokens:** 8000
- **Resonnering (reasoningEffort):** low

Kategorier, belegg og treffprosent er kontrollert i kode (samme pipeline som appen). Nøkkelorddekningen mot fasiten er en hjelp. Den endelige vurderingen gjøres manuelt med sjekklisten.

## par-2-it-support

### Fasit

| Krav | Forventet kategori | Grunnlag i CV |
|---|---|---|
| Pågående IT-utdanning | Oppfylt | Bachelor i IT og digitalisering |
| Windows og Microsoft 365 | Delvis oppfylt | Windows er nevnt, Microsoft 365 er ikke nevnt |
| Erfaring med brukerstøtte eller kundeservice | Delvis oppfylt | Veiledning av studenter ligner brukerstøtte, men er ikke IT-support |
| Gode kommunikasjonsevner | Delvis oppfylt | Veiledningstimer, men ikke dokumentert skriftlig |
| Førerkort klasse B | Mangler | – |
| Kjennskap til ITIL | Mangler | – |

**Forventede nøkkelord:** brukerstøtte, førstelinje, Windows, Microsoft 365, saksbehandlingssystem, oppsett av PC, kommunikasjon, førerkort, ITIL

### Forbudte påstander (SM-2)

- At Jonas har førerkort
- At Jonas kjenner ITIL eller har ITIL-sertifisering
- At Jonas har jobbet med IT-support/helpdesk eller i en kommune
- Erfaring med Microsoft 365-administrasjon, Intune, Active Directory eller saksbehandlingssystemer
- Tall eller resultater som ikke står i CV-en (f.eks. «løste 50 saker i uken»)

### Nøkkelorddekning

- Kjøring 1: ingen analyse (llm_tidsavbrudd)

### Kjøringer

#### Kjøring 1

- **Status:** 504 (llm_tidsavbrudd)
- **Modellversjon:** ukjent
- **Tokens:** – inn, – ut
- **Varighet:** 45004 ms
- **Kostnad:** ukjent

### Sjekkliste

**Gjennomgående**

- [ ] Ingen av de **forbudte påstandene** i `fasit.md` forekommer.
- [ ] Ingen kvalifikasjoner, ferdigheter, utdanning, arbeidsgivere, årstall eller tall/målinger forekommer som ikke står i CV-en.
- [ ] Alt innhold er på naturlig norsk bokmål, uten svenske eller danske ord og uten direkte oversatt engelsk (NFR-5).

**Gap-analyse**

- [ ] Alle krav fra annonsen er med.
- [ ] Alle krav merket «Mangler» i fasiten havner i «Mangler» (aldri i «Oppfylt»).
- [ ] Ingen krav får høyere kategori enn i fasiten, og høyst ett krav ligger under (FR-8).
- [ ] Hvert krav i «Oppfylt» og «Delvis oppfylt» viser til tekst som faktisk står i CV-en. Krav uten belegg står i «Mangler» (FR-9).
- [ ] Rådene for krav som mangler, er ærlige og foreslår ikke å påstå kvalifikasjonen (FR-10).

### Oppsummering

- **Kjøringer:** 1, **feil:** 1 (kjøring 1: llm_tidsavbrudd)
- **Gjennomsnittlig kostnad:** ukjent
- **Lengste varighet:** 45004 ms
- **Høyeste output-tokens:** –
- **Treffprosent per kjøring:** –

## Totalt

- **Kjøringer:** 1, **feil:** 1
- **Samlet kostnad:** minst 0,0000 kr (1 kjøring med ukjent kostnad)
- **Gjennomsnittlig kostnad per kjøring:** ukjent
- **Lengste varighet:** 45004 ms
- **Høyeste output-tokens:** – (taket er 8000)
- **Temperatur:** 0.2
