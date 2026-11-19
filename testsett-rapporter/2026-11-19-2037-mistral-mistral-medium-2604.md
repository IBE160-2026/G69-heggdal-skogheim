# Testsett: mistral mistral-medium-2604

- **Commit:** `cd9655b7e3aaf606bf044c109775a32f02e22e8b`
- **Leverandør:** mistral
- **Modell (bedt om):** mistral-medium-2604
- **Modellversjon fra leverandøren:** mistral-medium-2604 (samme som navnet som ble bedt om; leverandøren oppga kanskje ingen egen versjon) (1 kjøring)
- **Dato:** 2026-11-19T19:37:18.312Z
- **Priser:** 15 kr per million input-tokens, 75 kr per million output-tokens
- **Kjøringer per par:** 1
- **Temperatur:** 0.2
- **Tak for output-tokens:** 8000
- **Resonnering (reasoningEffort):** none

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

- Kjøring 1: 4 av 9 forventede nøkkelord (44 %), hjelp, ikke vurdering

### Kjøringer

#### Kjøring 1

- **Status:** 200
- **Modellversjon:** mistral-medium-2604 (samme som navnet som ble bedt om; leverandøren oppga kanskje ingen egen versjon)
- **Tokens:** 1673 inn, 783 ut
- **Varighet:** 4774 ms
- **Kostnad:** 0,0838 kr
- **Stilling:** It-brukerstøtte, **arbeidsgiver:** Nordvest Testkommune
- **Treffprosent:** 31 %
- **Fjernede belegg:** 0
- **Nedgraderte krav:** ingen
- **Nøkkelord funnet i CV-en:** deltid, student, IT-utdanning, Windows
- **Nøkkelord ikke funnet:** IT-brukerstøtte, Microsoft 365, brukerstøtte, kundeservice, kommunikasjonsevner, muntlig, skriftlig, førerkort klasse B, ITIL
- **Nøkkelorddekning mot fasiten:** 4 av 9 forventede nøkkelord (44 %), hjelp, ikke vurdering
  - Ikke med fra fasiten: førstelinje, saksbehandlingssystem, oppsett av PC, kommunikasjon, førerkort

| # | Krav | Kategori | Belegg | Forklaring eller råd |
|---|---|---|---|---|
| 1 | Pågående IT-utdanning | Oppfylt | «Bachelor i IT og digitalisering, Høgskolen i Molde (pågår, 3. år)» | – |
| 2 | God forståelse av Windows | Oppfylt | «Operativsystemer: Windows» | – |
| 3 | God forståelse av Microsoft 365 | Mangler | – | Råd: Hvis du har erfaring med Microsoft 365, bør du legge det inn i CV-en din. |
| 4 | Erfaring med brukerstøtte eller kundeservice | Delvis oppfylt | «Hjalp førsteårsstudenter med oppgaver i introduksjonsfaget i programmering»<br>«Holdt to veiledningstimer i uken» | Erfaringen er med veiledning av studenter, ikke direkte brukerstøtte eller kundeservice. |
| 5 | Gode kommunikasjonsevner, muntlig og skriftlig | Mangler | – | Råd: Trekk fram eksempler på situasjoner der du har brukt muntlige og skriftlige kommunikasjonsevner, for eksempel i studier eller tidligere jobber. |
| 6 | Førerkort klasse B | Mangler | – | Råd: Hvis du har førerkort klasse B, bør du legge det inn i CV-en din. |
| 7 | Kjennskap til ITIL | Mangler | – | Råd: Hvis du har kjennskap til ITIL, bør du nevne det i CV-en din. Hvis ikke, kan du vise vilje til å lære. |

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

- **Kjøringer:** 1, **feil:** 0
- **Gjennomsnittlig kostnad:** 0,0838 kr
- **Lengste varighet:** 4774 ms
- **Høyeste output-tokens:** 783
- **Treffprosent per kjøring:** 31 %

## Totalt

- **Kjøringer:** 1, **feil:** 0
- **Samlet kostnad:** 0,0838 kr
- **Gjennomsnittlig kostnad per kjøring:** 0,0838 kr
- **Lengste varighet:** 4774 ms
- **Høyeste output-tokens:** 783 (taket er 8000)
- **Temperatur:** 0.2
