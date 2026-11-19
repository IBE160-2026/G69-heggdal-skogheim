# Testsett: mistral mistral-medium-2604

- **Commit:** `2e92de3bac7831d5119c7ff097381fdaff7340f2`
- **Leverandør:** mistral
- **Modell (bedt om):** mistral-medium-2604
- **Modellversjon fra leverandøren:** mistral-medium-2604 (samme som navnet som ble bedt om; leverandøren oppga kanskje ingen egen versjon) (12 kjøringer)
- **Dato:** 2026-11-19T21:53:29.444Z
- **Priser:** 14,53 kr per million input-tokens, 72,65 kr per million output-tokens
- **Kjøringer per par:** 3
- **Temperatur:** 0.2
- **Tak for output-tokens:** 8000
- **Resonnering (reasoningEffort):** none

Kategorier, belegg og treffprosent er kontrollert i kode (samme pipeline som appen). Nøkkelorddekningen mot fasiten er en hjelp. Den endelige vurderingen gjøres manuelt med sjekklisten.

## par-1-butikk-bank

### Fasit

| Krav | Forventet kategori | Grunnlag i CV |
|---|---|---|
| Kundeorientert | Oppfylt | Kundehjelp i butikk |
| Gode digitale ferdigheter | Delvis oppfylt | Grunnleggende Office, regneark som kasserer – men ingen erfaring med nettbank/kundesystemer |
| Erfaring med kontanthåndtering | Oppfylt | Kasse i butikk, opptelling som kasserer |
| Nøyaktig og pålitelig | Delvis oppfylt | Står i profilen og støttes av kassererverv, men er en egenvurdering |
| Studerer økonomi eller tilsvarende | Oppfylt | Bachelor i økonomi (pågår) |
| AFR-autorisasjon | Mangler | – |

**Forventede nøkkelord:** kundeorientert, kundeservice, digitale ferdigheter, nettbank, mobilbank, kontanthåndtering, nøyaktig, pålitelig, økonomi

### Forbudte påstander (SM-2)

- At Ida har AFR-autorisasjon eller holder på med den
- At Ida har jobbet i bank, finans eller kundesenter
- At Ida har erfaring med nettbank-support eller bankens systemer
- At Ida har fullført bachelorgraden
- Avanserte Excel-ferdigheter
- Tall eller resultater som ikke står i CV-en (f.eks. «betjente 200 kunder daglig»)

### Nøkkelorddekning

- Kjøring 1: 6 av 9 forventede nøkkelord (67 %), hjelp, ikke vurdering
- Kjøring 2: 8 av 9 forventede nøkkelord (89 %), hjelp, ikke vurdering
- Kjøring 3: 6 av 9 forventede nøkkelord (67 %), hjelp, ikke vurdering

### Kjøringer

#### Kjøring 1

- **Status:** 200
- **Modellversjon:** mistral-medium-2604 (samme som navnet som ble bedt om; leverandøren oppga kanskje ingen egen versjon)
- **Tokens:** 2764 inn, 913 ut
- **Varighet:** 5560 ms
- **Kostnad:** 0,1065 kr
- **Stilling:** Sommervikar – Kundebehandler, **arbeidsgiver:** Sparebanken Testvik
- **Treffprosent:** 17 %
- **Fjernede belegg:** 0
- **Nedgraderte krav:** ingen
- **Nøkkelord funnet i CV-en:** pålitelig, økonomi
- **Nøkkelord ikke funnet:** sommervikar, kundebehandler, kundeorientert, serviceinnstilt, hjelpe andre, digitale ferdigheter, kontanthåndtering, nøyaktig, finansiell rådgiver, AFR
- **Nøkkelorddekning mot fasiten:** 6 av 9 forventede nøkkelord (67 %), hjelp, ikke vurdering
  - Ikke med fra fasiten: kundeservice, nettbank, mobilbank

| # | Krav | Kategori | Belegg | Forklaring eller råd |
|---|---|---|---|---|
| 1 | Er kundeorientert og trives med å hjelpe andre | Delvis oppfylt | «liker å jobbe med mennesker»<br>«Hjalp kunder med å finne varer og svarte på spørsmål» | CV-en viser at du liker å jobbe med mennesker og har hjulpet kunder, men det er ikke dokumentert at du er kundeorientert i en servicekontekst som ligner på bank. |
| 2 | Har gode digitale ferdigheter | Delvis oppfylt | «Microsoft Office (Word, Excel, PowerPoint) – grunnleggende» | Du har grunnleggende ferdigheter i Microsoft Office, men det er ikke oppgitt om dette dekker det som kreves for digitale ferdigheter i banksektoren. |
| 3 | Har erfaring med kontanthåndtering | Oppfylt | «Betjente kasse og tok imot kontanter og kortbetaling»<br>«Talte opp kontanter etter kiosksalg på kampdager» | – |
| 4 | Er nøyaktig og pålitelig | Delvis oppfylt | «Pålitelig»<br>«Førte oversikt over medlemskontingent i et regneark» | CV-en nevner at du er pålitelig, men nøyaktighet er bare dokumentert gjennom oversikt over medlemskontingent, som ikke nødvendigvis viser full nøyaktighet i en bankkontekst. |
| 5 | Studerer økonomi eller tilsvarende | Oppfylt | «Bachelor i økonomi og administrasjon, Høgskolen i Molde (pågår)»<br>«Fag så langt: bedriftsøkonomi, markedsføring, regnskapsforståelse» | – |
| 6 | Har autorisasjon som finansiell rådgiver (AFR) | Mangler | – | Råd: Hvis du har relevant utdanning eller erfaring som kan føre til AFR, kan du nevne dette og vise vilje til å ta sertifiseringen. |

#### Kjøring 2

- **Status:** 200
- **Modellversjon:** mistral-medium-2604 (samme som navnet som ble bedt om; leverandøren oppga kanskje ingen egen versjon)
- **Tokens:** 2764 inn, 978 ut
- **Varighet:** 6207 ms
- **Kostnad:** 0,1112 kr
- **Stilling:** Sommervikar – Kundebehandler, **arbeidsgiver:** Sparebanken Testvik
- **Treffprosent:** 19 %
- **Fjernede belegg:** 0
- **Nedgraderte krav:** ingen
- **Nøkkelord funnet i CV-en:** pålitelig, økonomi, telefon
- **Nøkkelord ikke funnet:** sommervikar, kundebehandler, kundeorientert, serviceinnstilt, digitale ferdigheter, kontanthåndtering, nøyaktig, finansiell rådgiver, AFR, nettbank, mobilbank, skranke, chat
- **Nøkkelorddekning mot fasiten:** 8 av 9 forventede nøkkelord (89 %), hjelp, ikke vurdering
  - Ikke med fra fasiten: kundeservice

| # | Krav | Kategori | Belegg | Forklaring eller råd |
|---|---|---|---|---|
| 1 | Er kundeorientert og trives med å hjelpe andre | Delvis oppfylt | «liker å jobbe med mennesker»<br>«Hjalp kunder med å finne varer og svarte på spørsmål» | CV-en viser at du liker å jobbe med mennesker og har hjulpet kunder, men det er ikke dokumentert at du er kundeorientert i en bank- eller servicekontekst. |
| 2 | Har gode digitale ferdigheter | Delvis oppfylt | «Microsoft Office (Word, Excel, PowerPoint) – grunnleggende» | CV-en viser grunnleggende ferdigheter i Microsoft Office, men det er ikke dokumentert at ferdighetene er gode eller tilstrekkelige for oppgavene. |
| 3 | Har erfaring med kontanthåndtering | Oppfylt | «Betjente kasse og tok imot kontanter og kortbetaling»<br>«Talte opp kontanter etter kiosksalg på kampdager» | – |
| 4 | Er nøyaktig og pålitelig | Delvis oppfylt | «Pålitelig»<br>«Førte oversikt over medlemskontingent i et regneark» | CV-en viser at du er pålitelig og har utførte oppgaver som krever nøyaktighet, men det er ikke dokumentert at du er nøyaktig i en bankkontekst. |
| 5 | Studerer økonomi eller tilsvarende | Oppfylt | «Bachelor i økonomi og administrasjon, Høgskolen i Molde (pågår)»<br>«Fag så langt: bedriftsøkonomi, markedsføring, regnskapsforståelse» | – |
| 6 | Har autorisasjon som finansiell rådgiver (AFR) | Mangler | – | Råd: Hvis du har denne autorisasjonen, bør du legge den inn i CV-en. Hvis ikke, kan du nevne at du er villig til å ta den om det kreves. |

#### Kjøring 3

- **Status:** 200
- **Modellversjon:** mistral-medium-2604 (samme som navnet som ble bedt om; leverandøren oppga kanskje ingen egen versjon)
- **Tokens:** 2764 inn, 838 ut
- **Varighet:** 4709 ms
- **Kostnad:** 0,1010 kr
- **Stilling:** Sommervikar – Kundebehandler, **arbeidsgiver:** Sparebanken Testvik
- **Treffprosent:** 17 %
- **Fjernede belegg:** 0
- **Nedgraderte krav:** ingen
- **Nøkkelord funnet i CV-en:** pålitelig, økonomi
- **Nøkkelord ikke funnet:** sommervikar, kundebehandler, kundeorientert, serviceinnstilt, hjelpe andre, digitale ferdigheter, kontanthåndtering, nøyaktig, finansiell rådgiver, AFR
- **Nøkkelorddekning mot fasiten:** 6 av 9 forventede nøkkelord (67 %), hjelp, ikke vurdering
  - Ikke med fra fasiten: kundeservice, nettbank, mobilbank

| # | Krav | Kategori | Belegg | Forklaring eller råd |
|---|---|---|---|---|
| 1 | Er kundeorientert og trives med å hjelpe andre | Delvis oppfylt | «Liker å jobbe med mennesker»<br>«Hjalp kunder med å finne varer og svarte på spørsmål» | CV-en viser at du liker å jobbe med mennesker og har hjulpet kunder, men det står ikke eksplisitt at du er kundeorientert. |
| 2 | Har gode digitale ferdigheter | Delvis oppfylt | «Microsoft Office (Word, Excel, PowerPoint) – grunnleggende» | Du har grunnleggende ferdigheter i Microsoft Office, men det står ikke at de er gode. |
| 3 | Har erfaring med kontanthåndtering | Oppfylt | «Betjente kasse og tok imot kontanter og kortbetaling»<br>«Talte opp kontanter etter kiosksalg på kampdager» | – |
| 4 | Er nøyaktig og pålitelig | Delvis oppfylt | «Pålitelig»<br>«Førte oversikt over medlemskontingent i et regneark» | CV-en viser at du er pålitelig og har utførte nøyaktige oppgaver, men det står ikke eksplisitt at du er nøyaktig. |
| 5 | Studerer økonomi eller tilsvarende | Oppfylt | «Bachelor i økonomi og administrasjon, Høgskolen i Molde (pågår)» | – |
| 6 | Har autorisasjon som finansiell rådgiver (AFR) | Mangler | – | Råd: Hvis du har eller planlegger å ta autorisasjonen, kan du nevne dette i søknaden. |

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

- **Kjøringer:** 3, **feil:** 0
- **Gjennomsnittlig kostnad:** 0,1062 kr
- **Lengste varighet:** 6207 ms
- **Høyeste output-tokens:** 978
- **Treffprosent per kjøring:** 17 %, 19 %, 17 %

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
- Kjøring 2: 4 av 9 forventede nøkkelord (44 %), hjelp, ikke vurdering
- Kjøring 3: 4 av 9 forventede nøkkelord (44 %), hjelp, ikke vurdering

### Kjøringer

#### Kjøring 1

- **Status:** 200
- **Modellversjon:** mistral-medium-2604 (samme som navnet som ble bedt om; leverandøren oppga kanskje ingen egen versjon)
- **Tokens:** 2646 inn, 803 ut
- **Varighet:** 4164 ms
- **Kostnad:** 0,0968 kr
- **Stilling:** IT-brukerstøtte, **arbeidsgiver:** Nordvest Testkommune
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
| 2 | God forståelse av Windows og Microsoft 365 | Delvis oppfylt | «Operativsystemer: Windows» | Du har erfaring med Windows, men Microsoft 365 er ikke nevnt. |
| 3 | Erfaring med brukerstøtte eller kundeservice | Delvis oppfylt | «Hjalp førsteårsstudenter med oppgaver i introduksjonsfaget i programmering»<br>«Holdt to veiledningstimer i uken» | Du har veiledningserfaring, men dette er ikke det samme som brukerstøtte eller kundeservice. |
| 4 | Gode kommunikasjonsevner, muntlig og skriftlig | Delvis oppfylt | «Holdt to veiledningstimer i uken» | Du har muntlig kommunikasjonsevne gjennom veiledning, men skriftlig kommunikasjonsevne er ikke dokumentert. |
| 5 | Førerkort klasse B | Mangler | – | Råd: Legg til førerkort klasse B i CV-en hvis du har det. |
| 6 | Kjennskap til ITIL | Mangler | – | Råd: Vis vilje til å lære ITIL, eller trekk fram beslektet erfaring med IT-styring hvis du har det. |

#### Kjøring 2

- **Status:** 200
- **Modellversjon:** mistral-medium-2604 (samme som navnet som ble bedt om; leverandøren oppga kanskje ingen egen versjon)
- **Tokens:** 2646 inn, 802 ut
- **Varighet:** 4503 ms
- **Kostnad:** 0,0967 kr
- **Stilling:** IT-brukerstøtte, **arbeidsgiver:** Nordvest Testkommune
- **Treffprosent:** 31 %
- **Fjernede belegg:** 0
- **Nedgraderte krav:** ingen
- **Nøkkelord funnet i CV-en:** deltid, student, IT-utdanning, Windows
- **Nøkkelord ikke funnet:** IT-brukerstøtte, Microsoft 365, brukerstøtte, kundeservice, kommunikasjonsevner, muntlig, skriftlig, Førerkort klasse B, ITIL
- **Nøkkelorddekning mot fasiten:** 4 av 9 forventede nøkkelord (44 %), hjelp, ikke vurdering
  - Ikke med fra fasiten: førstelinje, saksbehandlingssystem, oppsett av PC, kommunikasjon, førerkort

| # | Krav | Kategori | Belegg | Forklaring eller råd |
|---|---|---|---|---|
| 1 | Pågående IT-utdanning | Oppfylt | «Bachelor i IT og digitalisering, Høgskolen i Molde (pågår, 3. år)» | – |
| 2 | God forståelse av Windows og Microsoft 365 | Delvis oppfylt | «Operativsystemer: Windows» | Du har erfaring med Windows, men Microsoft 365 er ikke nevnt. |
| 3 | Erfaring med brukerstøtte eller kundeservice | Delvis oppfylt | «Hjalp førsteårsstudenter med oppgaver i introduksjonsfaget i programmering»<br>«Holdt to veiledningstimer i uken» | Du har veiledningserfaring, men dette er ikke det samme som brukerstøtte eller kundeservice. |
| 4 | Gode kommunikasjonsevner, muntlig og skriftlig | Delvis oppfylt | «Språk: norsk (morsmål), engelsk (svært godt)» | Du har språklige ferdigheter, men kommunikasjonsevner i arbeidssammenheng er ikke dokumentert. |
| 5 | Førerkort klasse B | Mangler | – | Råd: Legg til førerkort klasse B i CV-en hvis du har det. |
| 6 | Kjennskap til ITIL | Mangler | – | Råd: Vurder å ta en introduksjonskurs i ITIL for å vise interesse for feltet. |

#### Kjøring 3

- **Status:** 200
- **Modellversjon:** mistral-medium-2604 (samme som navnet som ble bedt om; leverandøren oppga kanskje ingen egen versjon)
- **Tokens:** 2646 inn, 796 ut
- **Varighet:** 6383 ms
- **Kostnad:** 0,0963 kr
- **Stilling:** IT-brukerstøtte, **arbeidsgiver:** Nordvest Testkommune
- **Treffprosent:** 31 %
- **Fjernede belegg:** 0
- **Nedgraderte krav:** ingen
- **Nøkkelord funnet i CV-en:** deltid, student, IT-utdanning, Windows
- **Nøkkelord ikke funnet:** IT-brukerstøtte, Microsoft 365, brukerstøtte, kundeservice, kommunikasjonsevner, muntlig, skriftlig, Førerkort klasse B, ITIL
- **Nøkkelorddekning mot fasiten:** 4 av 9 forventede nøkkelord (44 %), hjelp, ikke vurdering
  - Ikke med fra fasiten: førstelinje, saksbehandlingssystem, oppsett av PC, kommunikasjon, førerkort

| # | Krav | Kategori | Belegg | Forklaring eller råd |
|---|---|---|---|---|
| 1 | Pågående IT-utdanning | Oppfylt | «Bachelor i IT og digitalisering, Høgskolen i Molde (pågår, 3. år)» | – |
| 2 | God forståelse av Windows og Microsoft 365 | Delvis oppfylt | «Operativsystemer: Windows» | Du har erfaring med Windows, men Microsoft 365 er ikke nevnt. |
| 3 | Erfaring med brukerstøtte eller kundeservice | Delvis oppfylt | «Hjalp førsteårsstudenter med oppgaver i introduksjonsfaget i programmering»<br>«Holdt to veiledningstimer i uken» | Du har veiledningserfaring, men dette er ikke det samme som brukerstøtte eller kundeservice. |
| 4 | Gode kommunikasjonsevner, muntlig og skriftlig | Delvis oppfylt | «Holdt to veiledningstimer i uken» | Du har muntlig kommunikasjonsevne gjennom veiledning, men skriftlig kommunikasjonsevne er ikke dokumentert. |
| 5 | Førerkort klasse B | Mangler | – | Råd: Legg til førerkort klasse B i CV-en hvis du har det. |
| 6 | Kjennskap til ITIL | Mangler | – | Råd: Trekk fram eventuell kjennskap til ITIL eller lignende rammeverk i CV-en. |

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

- **Kjøringer:** 3, **feil:** 0
- **Gjennomsnittlig kostnad:** 0,0966 kr
- **Lengste varighet:** 6383 ms
- **Høyeste output-tokens:** 803
- **Treffprosent per kjøring:** 31 %, 31 %, 31 %

## par-3-regnskap

### Fasit

| Krav | Forventet kategori | Grunnlag i CV |
|---|---|---|
| Bachelor i økonomi og administrasjon | Oppfylt | Fullført bachelor 2026 |
| Gode Excel-kunnskaper | Oppfylt | Pivottabeller, HVIS, FINN.RAD |
| Erfaring med Tripletex eller Visma | Mangler | – |
| Erfaring med bokføring og avstemminger | Delvis oppfylt | Finansregnskap fra studiet, men ingen praktisk erfaring |
| Strukturert og nøyaktig | Delvis oppfylt | Ikke direkte dokumentert; kan argumenteres via registrering i kundesystem og bacheloroppgave |
| Gode samarbeidsevner | Delvis oppfylt | Ikke direkte dokumentert; kundeservice gir et utgangspunkt |

**Forventede nøkkelord:** bokføring, avstemming, periodeavslutning, fakturering, årsoppgjør, skattemelding, Excel, Tripletex, Visma, regnskapssystem, strukturert, nøyaktig, samarbeid

### Forbudte påstander (SM-2)

- At Sara har brukt Tripletex, Visma eller et annet regnskapssystem
- At Sara har praktisk erfaring med bokføring, avstemminger, årsoppgjør eller skattemeldinger
- At Sara har jobbet i regnskapsbyrå eller økonomiavdeling
- At Sara er autorisert regnskapsfører
- Tall eller resultater som ikke står i CV-en

### Nøkkelorddekning

- Kjøring 1: 8 av 13 forventede nøkkelord (62 %), hjelp, ikke vurdering
- Kjøring 2: 6 av 13 forventede nøkkelord (46 %), hjelp, ikke vurdering
- Kjøring 3: 7 av 13 forventede nøkkelord (54 %), hjelp, ikke vurdering

### Kjøringer

#### Kjøring 1

- **Status:** 200
- **Modellversjon:** mistral-medium-2604 (samme som navnet som ble bedt om; leverandøren oppga kanskje ingen egen versjon)
- **Tokens:** 2648 inn, 918 ut
- **Varighet:** 5641 ms
- **Kostnad:** 0,1052 kr
- **Stilling:** Regnskapsmedarbeider, **arbeidsgiver:** Fjordtall Regnskap AS
- **Treffprosent:** 19 %
- **Fjernede belegg:** 0
- **Nedgraderte krav:** ingen
- **Nøkkelord funnet i CV-en:** Ålesund, Bachelor i økonomi og administrasjon, Excel
- **Nøkkelord ikke funnet:** regnskapsmedarbeider, Fjordtall Regnskap AS, bokføring, avstemminger, periodeavslutninger, fakturering, årsoppgjør, skattemeldinger, Tripletex, Visma, strukturert, nøyaktig, samarbeidsevner
- **Nøkkelorddekning mot fasiten:** 8 av 13 forventede nøkkelord (62 %), hjelp, ikke vurdering
  - Ikke med fra fasiten: avstemming, periodeavslutning, skattemelding, regnskapssystem, samarbeid

| # | Krav | Kategori | Belegg | Forklaring eller råd |
|---|---|---|---|---|
| 1 | Bachelor i økonomi og administrasjon eller tilsvarende | Oppfylt | «Bachelor i økonomi og administrasjon, Testvik handelshøyskole (fullført juni 2026)» | – |
| 2 | Gode Excel-kunnskaper | Oppfylt | «Excel: pivottabeller, HVIS- og FINN.RAD-funksjoner (fra studiet)» | – |
| 3 | Erfaring med regnskapssystemer som Tripletex eller Visma | Mangler | – | Råd: Trekk fram erfaring med kundesystemet fra Testtelefon AS, og vis vilje til å lære regnskapssystemer som Tripletex eller Visma |
| 4 | Erfaring med bokføring og avstemminger | Mangler | – | Råd: Legg inn relevant erfaring med bokføring og avstemminger hvis du har det, for eksempel fra studiet eller praksis |
| 5 | Strukturert og nøyaktig | Delvis oppfylt | «Bacheloroppgave: «Likviditetsstyring i små familiebedrifter»»<br>«Relevante fag: finansregnskap, skatterett, bedriftsøkonomisk analyse» | CV-en viser strukturert arbeid gjennom bacheloroppgave og relevante fag, men egenskapene er ikke konkret dokumentert i arbeidserfaring |
| 6 | Gode samarbeidsevner | Delvis oppfylt | «Besvarte kundehenvendelser om fakturaer og abonnement» | CV-en viser samhandling med kunder, men samarbeidsevner er ikke konkret dokumentert i teamarbeid |

#### Kjøring 2

- **Status:** 200
- **Modellversjon:** mistral-medium-2604 (samme som navnet som ble bedt om; leverandøren oppga kanskje ingen egen versjon)
- **Tokens:** 2648 inn, 852 ut
- **Varighet:** 4848 ms
- **Kostnad:** 0,1004 kr
- **Stilling:** Regnskapsmedarbeider, **arbeidsgiver:** Fjordtall Regnskap AS
- **Treffprosent:** 25 %
- **Fjernede belegg:** 0
- **Nedgraderte krav:** ingen
- **Nøkkelord funnet i CV-en:** Ålesund, Bachelor i økonomi og administrasjon, Excel
- **Nøkkelord ikke funnet:** regnskapsmedarbeider, Fjordtall Regnskap AS, bokføring, avstemminger, Tripletex, Visma, strukturert, nøyaktig, samarbeidsevner
- **Nøkkelorddekning mot fasiten:** 6 av 13 forventede nøkkelord (46 %), hjelp, ikke vurdering
  - Ikke med fra fasiten: avstemming, periodeavslutning, fakturering, årsoppgjør, skattemelding, regnskapssystem, samarbeid

| # | Krav | Kategori | Belegg | Forklaring eller råd |
|---|---|---|---|---|
| 1 | Bachelor i økonomi og administrasjon eller tilsvarende | Oppfylt | «Bachelor i økonomi og administrasjon, Testvik handelshøyskole (fullført juni 2026)» | – |
| 2 | Gode Excel-kunnskaper | Delvis oppfylt | «Excel: pivottabeller, HVIS- og FINN.RAD-funksjoner (fra studiet)» | CV-en viser konkrete Excel-ferdigheter, men nivået er ikke oppgitt som 'gode'. |
| 3 | Erfaring med regnskapssystemer som Tripletex eller Visma | Mangler | – | Råd: Trekk fram eventuell erfaring med andre regnskapssystemer eller vis vilje til å lære Tripletex eller Visma. |
| 4 | Erfaring med bokføring og avstemminger | Mangler | – | Råd: Legg inn eventuell erfaring med bokføring eller avstemminger fra studier, praksis eller tidligere jobber. |
| 5 | Strukturert og nøyaktig | Delvis oppfylt | «Bacheloroppgave: «Likviditetsstyring i små familiebedrifter»»<br>«Relevante fag: finansregnskap, skatterett, bedriftsøkonomisk analyse» | CV-en viser strukturert arbeid gjennom studier, men egenskapene er ikke direkte dokumentert i arbeidserfaring. |
| 6 | Gode samarbeidsevner | Delvis oppfylt | «Kundeservicemedarbeider (deltid), Testtelefon AS, Ålesund» | CV-en viser erfaring med kundekontakt, som kan indikere samarbeidsevner, men dette er ikke direkte dokumentert. |

#### Kjøring 3

- **Status:** 200
- **Modellversjon:** mistral-medium-2604 (samme som navnet som ble bedt om; leverandøren oppga kanskje ingen egen versjon)
- **Tokens:** 2648 inn, 875 ut
- **Varighet:** 4717 ms
- **Kostnad:** 0,1020 kr
- **Stilling:** Regnskapsmedarbeider, **arbeidsgiver:** Fjordtall Regnskap AS
- **Treffprosent:** 21 %
- **Fjernede belegg:** 1
- **Nedgraderte krav:** ingen
- **Nøkkelord funnet i CV-en:** Ålesund, Bachelor i økonomi og administrasjon, Excel
- **Nøkkelord ikke funnet:** regnskapsmedarbeider, Fjordtall Regnskap AS, bokføring, avstemminger, årsoppgjør, skattemeldinger, Tripletex, Visma, strukturert, nøyaktig, samarbeidsevner
- **Nøkkelorddekning mot fasiten:** 7 av 13 forventede nøkkelord (54 %), hjelp, ikke vurdering
  - Ikke med fra fasiten: avstemming, periodeavslutning, fakturering, skattemelding, regnskapssystem, samarbeid

| # | Krav | Kategori | Belegg | Forklaring eller råd |
|---|---|---|---|---|
| 1 | Bachelor i økonomi og administrasjon eller tilsvarende | Oppfylt | «Bachelor i økonomi og administrasjon, Testvik handelshøyskole (fullført juni 2026)» | – |
| 2 | Gode Excel-kunnskaper | Oppfylt | «Excel: pivottabeller, HVIS- og FINN.RAD-funksjoner (fra studiet)» | – |
| 3 | Erfaring med regnskapssystemer som Tripletex eller Visma | Mangler | – | Råd: Trekk fram erfaring med kundesystemet fra Testtelefon AS, og vis vilje til å lære regnskapssystemer som Tripletex eller Visma |
| 4 | Erfaring med bokføring og avstemminger | Mangler | – | Råd: Legg inn relevant erfaring med bokføring og avstemminger hvis du har det, eller vis vilje til å lære |
| 5 | Strukturert og nøyaktig | Delvis oppfylt | «Bacheloroppgave: «Likviditetsstyring i små familiebedrifter»» | CV-en viser strukturert arbeid gjennom bacheloroppgaven og bedriftsøkonomisk analyse, men egenskapen er ikke direkte dokumentert i arbeidserfaring |
| 6 | Gode samarbeidsevner | Delvis oppfylt | «Kundeservicemedarbeider (deltid), Testtelefon AS, Ålesund» | Erfaring som kundeservicemedarbeider viser samarbeid, men nivået er ikke oppgitt |

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

- **Kjøringer:** 3, **feil:** 0
- **Gjennomsnittlig kostnad:** 0,1025 kr
- **Lengste varighet:** 5641 ms
- **Høyeste output-tokens:** 918
- **Treffprosent per kjøring:** 19 %, 25 %, 21 %

## par-4-tokolonne-hotell

### Fasit

| Krav | Forventet kategori | Grunnlag i CV |
|---|---|---|
| Serviceinnstilt med erfaring fra kundeservice | Oppfylt | Servitør: tok imot bestillinger og hjalp gjester; sesongarbeider: svarte turister |
| Gode språkkunnskaper i engelsk og tysk | Delvis oppfylt | Engelsk godt, men tysk bare grunnleggende |
| Erfaring med kassasystem og oppgjør | Oppfylt | Betjente kassasystem og tok dagsoppgjør ved stenging |
| Selvstendig og ansvarsbevisst | Delvis oppfylt | Stengte kafeen alene på kveldsvakter; ellers egenvurdering i profilen |
| Studerer reiseliv, hotellfag eller tilsvarende | Oppfylt | Bachelor i reiselivsledelse (pågår) |
| Erfaring med bookingsystemer, gjerne Opera | Mangler | – |

**Forventede nøkkelord:** resepsjon, serviceinnstilt, kundeservice, engelsk, tysk, kassasystem, oppgjør, selvstendig, ansvarsbevisst, reiseliv, booking, Opera

### Forbudte påstander (SM-2)

- At Mina har brukt Opera eller andre booking- eller hotellsystemer
- At Mina har jobbet på hotell eller i resepsjon
- At Mina snakker tysk flytende eller godt
- At Mina har fullført bachelorgraden
- Tall eller resultater som ikke står i CV-en (f.eks. «betjente 100 gjester per kveld»)

### Nøkkelorddekning

- Kjøring 1: 10 av 12 forventede nøkkelord (83 %), hjelp, ikke vurdering
- Kjøring 2: 10 av 12 forventede nøkkelord (83 %), hjelp, ikke vurdering
- Kjøring 3: 10 av 12 forventede nøkkelord (83 %), hjelp, ikke vurdering

### Kjøringer

#### Kjøring 1

- **Status:** 200
- **Modellversjon:** mistral-medium-2604 (samme som navnet som ble bedt om; leverandøren oppga kanskje ingen egen versjon)
- **Tokens:** 2831 inn, 856 ut
- **Varighet:** 4157 ms
- **Kostnad:** 0,1033 kr
- **Stilling:** Resepsjonsmedarbeider – deltid, **arbeidsgiver:** Hotell Testfjord, Ålesund
- **Treffprosent:** 36 %
- **Fjernede belegg:** 0
- **Nedgraderte krav:** ingen
- **Nøkkelord funnet i CV-en:** deltid, engelsk, tysk, kassasystem, reiseliv
- **Nøkkelord ikke funnet:** resepsjonsmedarbeider, serviceinnstilt, kundeservice, oppgjør, selvstendig, ansvarsbevisst, hotellfag, bookingsystemer, Opera
- **Nøkkelorddekning mot fasiten:** 10 av 12 forventede nøkkelord (83 %), hjelp, ikke vurdering
  - Ikke med fra fasiten: resepsjon, booking

| # | Krav | Kategori | Belegg | Forklaring eller råd |
|---|---|---|---|---|
| 1 | er serviceinnstilt og har erfaring fra kundeservice | Oppfylt | «Reiselivsstudent som trives med å ta imot gjester og løse problemer på stedet»<br>«Tok imot bestillinger og hjalp gjester med spørsmål»<br>«Svarte turister på spørsmål på norsk og engelsk» | – |
| 2 | har gode språkkunnskaper i engelsk og tysk | Delvis oppfylt | «Engelsk – godt»<br>«Tysk – grunnleggende» | Har godt engelsk, men tysk er bare grunnleggende. |
| 3 | har erfaring med kassasystem og oppgjør | Oppfylt | «Kassasystem og dagsoppgjør»<br>«Betjente kassasystem og tok dagsoppgjør ved stenging» | – |
| 4 | er selvstendig og ansvarsbevisst | Oppfylt | «Vant til å jobbe alene på kveldsvakt»<br>«Stengte kafeen alene på kveldsvakter» | – |
| 5 | studerer reiseliv, hotellfag eller tilsvarende | Oppfylt | «Bachelor i reiselivsledelse, Testvik høgskole (pågår, 2. år)» | – |
| 6 | har erfaring med bookingsystemer, gjerne Opera | Mangler | – | Råd: Trekk fram erfaring med andre systemer som ligner på bookingsystemer, for eksempel kassasystem, hvis du har det. |

#### Kjøring 2

- **Status:** 200
- **Modellversjon:** mistral-medium-2604 (samme som navnet som ble bedt om; leverandøren oppga kanskje ingen egen versjon)
- **Tokens:** 2831 inn, 888 ut
- **Varighet:** 5198 ms
- **Kostnad:** 0,1056 kr
- **Stilling:** Resepsjonsmedarbeider – deltid, **arbeidsgiver:** Hotell Testfjord
- **Treffprosent:** 33 %
- **Fjernede belegg:** 0
- **Nedgraderte krav:** ingen
- **Nøkkelord funnet i CV-en:** deltid, engelsk, tysk, kassasystem, reiseliv
- **Nøkkelord ikke funnet:** resepsjonsmedarbeider, serviceinnstilt, kundeservice, språkkunnskaper, oppgjør, selvstendig, ansvarsbevisst, hotellfag, bookingsystemer, Opera
- **Nøkkelorddekning mot fasiten:** 10 av 12 forventede nøkkelord (83 %), hjelp, ikke vurdering
  - Ikke med fra fasiten: resepsjon, booking

| # | Krav | Kategori | Belegg | Forklaring eller råd |
|---|---|---|---|---|
| 1 | er serviceinnstilt og har erfaring fra kundeservice | Oppfylt | «Reiselivsstudent som trives med å ta imot gjester og løse problemer på stedet»<br>«Tok imot bestillinger og hjalp gjester med spørsmål»<br>«Svarte turister på spørsmål på norsk og engelsk» | – |
| 2 | har gode språkkunnskaper i engelsk og tysk | Delvis oppfylt | «Engelsk – godt»<br>«Tysk – grunnleggende» | Har godt engelsk og grunnleggende tysk, men tysk er ikke på det nivået som kreves |
| 3 | har erfaring med kassasystem og oppgjør | Oppfylt | «Kassasystem og dagsoppgjør»<br>«Betjente kassasystem og tok dagsoppgjør ved stenging» | – |
| 4 | er selvstendig og ansvarsbevisst | Oppfylt | «Vant til å jobbe alene på kveldsvakt»<br>«Stengte kafeen alene på kveldsvakter» | – |
| 5 | studerer reiseliv, hotellfag eller tilsvarende | Oppfylt | «Bachelor i reiselivsledelse, Testvik høgskole (pågår, 2. år)» | – |
| 6 | har erfaring med bookingsystemer, gjerne Opera | Mangler | – | Råd: Trekk fram erfaring med reservasjoner fra annen jobberfaring hvis du har det, eller vis vilje til å lære bookingsystemer |

#### Kjøring 3

- **Status:** 200
- **Modellversjon:** mistral-medium-2604 (samme som navnet som ble bedt om; leverandøren oppga kanskje ingen egen versjon)
- **Tokens:** 2831 inn, 869 ut
- **Varighet:** 6263 ms
- **Kostnad:** 0,1043 kr
- **Stilling:** Resepsjonsmedarbeider – deltid, **arbeidsgiver:** Hotell Testfjord
- **Treffprosent:** 33 %
- **Fjernede belegg:** 0
- **Nedgraderte krav:** ingen
- **Nøkkelord funnet i CV-en:** deltid, engelsk, tysk, kassasystem, reiseliv
- **Nøkkelord ikke funnet:** resepsjonsmedarbeider, serviceinnstilt, kundeservice, språkkunnskaper, oppgjør, selvstendig, ansvarsbevisst, hotellfag, bookingsystemer, Opera
- **Nøkkelorddekning mot fasiten:** 10 av 12 forventede nøkkelord (83 %), hjelp, ikke vurdering
  - Ikke med fra fasiten: resepsjon, booking

| # | Krav | Kategori | Belegg | Forklaring eller råd |
|---|---|---|---|---|
| 1 | er serviceinnstilt og har erfaring fra kundeservice | Oppfylt | «Reiselivsstudent som trives med å ta imot gjester og løse problemer på stedet»<br>«Tok imot bestillinger og hjalp gjester med spørsmål»<br>«Svarte turister på spørsmål på norsk og engelsk» | – |
| 2 | har gode språkkunnskaper i engelsk og tysk | Delvis oppfylt | «Engelsk – godt»<br>«Tysk – grunnleggende» | CV-en viser godt engelsk, men tysk er kun grunnleggende. |
| 3 | har erfaring med kassasystem og oppgjør | Oppfylt | «Kassasystem og dagsoppgjør»<br>«Betjente kassasystem og tok dagsoppgjør ved stenging» | – |
| 4 | er selvstendig og ansvarsbevisst | Oppfylt | «Vant til å jobbe alene på kveldsvakt»<br>«Stengte kafeen alene på kveldsvakter» | – |
| 5 | studerer reiseliv, hotellfag eller tilsvarende | Oppfylt | «Bachelor i reiselivsledelse, Testvik høgskole (pågår, 2. år)» | – |
| 6 | har erfaring med bookingsystemer, gjerne Opera | Mangler | – | Råd: Trekk fram eventuell erfaring med andre bookingsystemer eller vis vilje til å lære Opera. |

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

- **Kjøringer:** 3, **feil:** 0
- **Gjennomsnittlig kostnad:** 0,1044 kr
- **Lengste varighet:** 6263 ms
- **Høyeste output-tokens:** 888
- **Treffprosent per kjøring:** 36 %, 33 %, 33 %

## Totalt

- **Kjøringer:** 12, **feil:** 0
- **Samlet kostnad:** 1,2293 kr
- **Gjennomsnittlig kostnad per kjøring:** 0,1024 kr
- **Lengste varighet:** 6383 ms
- **Høyeste output-tokens:** 978 (taket er 8000)
- **Temperatur:** 0.2
