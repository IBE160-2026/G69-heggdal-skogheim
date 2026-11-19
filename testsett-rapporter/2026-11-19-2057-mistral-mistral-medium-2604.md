# Testsett: mistral mistral-medium-2604

- **Commit:** `72315213048f4e1dfbd25c6be90137df7396b3da`
- **Leverandør:** mistral
- **Modell (bedt om):** mistral-medium-2604
- **Modellversjon fra leverandøren:** mistral-medium-2604 (samme som navnet som ble bedt om; leverandøren oppga kanskje ingen egen versjon) (12 kjøringer)
- **Dato:** 2026-11-19T19:57:48.790Z
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

- Kjøring 1: 8 av 9 forventede nøkkelord (89 %), hjelp, ikke vurdering
- Kjøring 2: 6 av 9 forventede nøkkelord (67 %), hjelp, ikke vurdering
- Kjøring 3: 6 av 9 forventede nøkkelord (67 %), hjelp, ikke vurdering

### Kjøringer

#### Kjøring 1

- **Status:** 200
- **Modellversjon:** mistral-medium-2604 (samme som navnet som ble bedt om; leverandøren oppga kanskje ingen egen versjon)
- **Tokens:** 1791 inn, 791 ut
- **Varighet:** 6617 ms
- **Kostnad:** 0,0835 kr
- **Stilling:** Sommervikar – kundebehandler, **arbeidsgiver:** Sparebanken Testvik
- **Treffprosent:** 18 %
- **Fjernede belegg:** 0
- **Nedgraderte krav:** ingen
- **Nøkkelord funnet i CV-en:** telefon, pålitelig, økonomi
- **Nøkkelord ikke funnet:** sommervikar, kundebehandler, kundeorientert, serviceinnstilt, kundesenter, chat, skranke, nettbank, mobilbank, kontanthåndtering, nøyaktig, finansiell rådgiver, AFR, digitale ferdigheter
- **Nøkkelorddekning mot fasiten:** 8 av 9 forventede nøkkelord (89 %), hjelp, ikke vurdering
  - Ikke med fra fasiten: kundeservice

| # | Krav | Kategori | Belegg | Forklaring eller råd |
|---|---|---|---|---|
| 1 | er kundeorientert og trives med å hjelpe andre | Oppfylt | «liker å jobbe med mennesker»<br>«Hjalp kunder med å finne varer og svarte på spørsmål» | – |
| 2 | har gode digitale ferdigheter | Oppfylt | «Microsoft Office (Word, Excel, PowerPoint) – grunnleggende» | – |
| 3 | har erfaring med kontanthåndtering | Oppfylt | «Betjente kasse og tok imot kontanter og kortbetaling»<br>«Talte opp kontanter etter kiosksalg på kampdager» | – |
| 4 | er nøyaktig og pålitelig | Oppfylt | «Pålitelig»<br>«Førte oversikt over medlemskontingent i et regneark» | – |
| 5 | studere økonomi eller tilsvarende | Oppfylt | «Bachelor i økonomi og administrasjon, Høgskolen i Molde (pågår)»<br>«Fag så langt: bedriftsøkonomi, markedsføring, regnskapsforståelse» | – |
| 6 | har autorisasjon som finansiell rådgiver (AFR) | Mangler | – | Råd: Hvis du har relevant erfaring eller utdanning, kan du nevne dette i søknaden og vise vilje til å ta sertifiseringen senere |

#### Kjøring 2

- **Status:** 200
- **Modellversjon:** mistral-medium-2604 (samme som navnet som ble bedt om; leverandøren oppga kanskje ingen egen versjon)
- **Tokens:** 1791 inn, 692 ut
- **Varighet:** 3969 ms
- **Kostnad:** 0,0763 kr
- **Stilling:** Sommervikar – Kundebehandler, **arbeidsgiver:** Sparebanken Testvik
- **Treffprosent:** 18 %
- **Fjernede belegg:** 0
- **Nedgraderte krav:** ingen
- **Nøkkelord funnet i CV-en:** pålitelig, økonomi
- **Nøkkelord ikke funnet:** sommervikar, kundebehandler, kundeorientert, serviceinnstilt, digitale ferdigheter, kontanthåndtering, nøyaktig, AFR, finansiell rådgiver
- **Nøkkelorddekning mot fasiten:** 6 av 9 forventede nøkkelord (67 %), hjelp, ikke vurdering
  - Ikke med fra fasiten: kundeservice, nettbank, mobilbank

| # | Krav | Kategori | Belegg | Forklaring eller råd |
|---|---|---|---|---|
| 1 | er kundeorientert og trives med å hjelpe andre | Oppfylt | «liker å jobbe med mennesker»<br>«Hjalp kunder med å finne varer og svarte på spørsmål» | – |
| 2 | har gode digitale ferdigheter | Oppfylt | «Microsoft Office (Word, Excel, PowerPoint) – grunnleggende» | – |
| 3 | har erfaring med kontanthåndtering | Oppfylt | «Betjente kasse og tok imot kontanter og kortbetaling»<br>«Talte opp kontanter etter kiosksalg på kampdager» | – |
| 4 | er nøyaktig og pålitelig | Oppfylt | «Pålitelig»<br>«Førte oversikt over medlemskontingent i et regneark» | – |
| 5 | studere økonomi eller tilsvarende | Oppfylt | «Bachelor i økonomi og administrasjon, Høgskolen i Molde (pågår)»<br>«Fag så langt: bedriftsøkonomi, markedsføring, regnskapsforståelse» | – |
| 6 | har autorisasjon som finansiell rådgiver (AFR) | Mangler | – | Råd: Hvis du har planer om å ta AFR-autorisasjonen, kan du nevne dette i søknaden for å vise fremtidig ambisjon |

#### Kjøring 3

- **Status:** 200
- **Modellversjon:** mistral-medium-2604 (samme som navnet som ble bedt om; leverandøren oppga kanskje ingen egen versjon)
- **Tokens:** 1791 inn, 705 ut
- **Varighet:** 3900 ms
- **Kostnad:** 0,0772 kr
- **Stilling:** Sommervikar – Kundebehandler, **arbeidsgiver:** Sparebanken Testvik
- **Treffprosent:** 18 %
- **Fjernede belegg:** 0
- **Nedgraderte krav:** ingen
- **Nøkkelord funnet i CV-en:** pålitelig, økonomi
- **Nøkkelord ikke funnet:** sommervikar, kundebehandler, kundeorientert, serviceinnstilt, digitale ferdigheter, kontanthåndtering, nøyaktig, AFR, finansiell rådgiver
- **Nøkkelorddekning mot fasiten:** 6 av 9 forventede nøkkelord (67 %), hjelp, ikke vurdering
  - Ikke med fra fasiten: kundeservice, nettbank, mobilbank

| # | Krav | Kategori | Belegg | Forklaring eller råd |
|---|---|---|---|---|
| 1 | Er kundeorientert og trives med å hjelpe andre | Oppfylt | «liker å jobbe med mennesker»<br>«Hjalp kunder med å finne varer og svarte på spørsmål» | – |
| 2 | Har gode digitale ferdigheter | Oppfylt | «Microsoft Office (Word, Excel, PowerPoint) – grunnleggende» | – |
| 3 | Har erfaring med kontanthåndtering | Oppfylt | «Betjente kasse og tok imot kontanter og kortbetaling»<br>«Talte opp kontanter etter kiosksalg på kampdager» | – |
| 4 | Er nøyaktig og pålitelig | Oppfylt | «Pålitelig»<br>«Førte oversikt over medlemskontingent i et regneark» | – |
| 5 | Studerer økonomi eller tilsvarende | Oppfylt | «Bachelor i økonomi og administrasjon, Høgskolen i Molde (pågår)»<br>«Fag så langt: bedriftsøkonomi, markedsføring, regnskapsforståelse» | – |
| 6 | Har autorisasjon som finansiell rådgiver (AFR) | Mangler | – | Råd: Dersom du har relevant erfaring eller utdanning som kan kvalifisere deg til AFR, kan du nevne dette i søknaden og vise vilje til å ta sertifiseringen. |

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
- **Gjennomsnittlig kostnad:** 0,0790 kr
- **Lengste varighet:** 6617 ms
- **Høyeste output-tokens:** 791
- **Treffprosent per kjøring:** 18 %, 18 %, 18 %

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
- **Tokens:** 1673 inn, 828 ut
- **Varighet:** 5564 ms
- **Kostnad:** 0,0845 kr
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
| 3 | God forståelse av Microsoft 365 | Mangler | – | Råd: Dersom du har erfaring med Microsoft 365, bør du legge det inn i CV-en. Hvis ikke, kan du nevne at du er villig til å lære. |
| 4 | Erfaring med brukerstøtte eller kundeservice | Delvis oppfylt | «Hjalp førsteårsstudenter med oppgaver i introduksjonsfaget i programmering»<br>«Holdt to veiledningstimer i uken» | Erfaringen er med veiledning av studenter, ikke direkte brukerstøtte eller kundeservice. |
| 5 | Gode kommunikasjonsevner, muntlig og skriftlig | Delvis oppfylt | «Holdt to veiledningstimer i uken» | Veiledningstimene viser muntlig kommunikasjon, men det mangler eksplisitt dokumentasjon av skriftlig kommunikasjonsevne. |
| 6 | Førerkort klasse B | Mangler | – | Råd: Hvis du har førerkort klasse B, bør du legge det inn i CV-en. Hvis ikke, kan du vurdere å ta det for å oppfylle kravet. |
| 7 | Kjennskap til ITIL | Mangler | – | Råd: Dersom du har kjennskap til ITIL, bør du nevne det i CV-en. Hvis ikke, kan du vise vilje til å lære. |

#### Kjøring 2

- **Status:** 200
- **Modellversjon:** mistral-medium-2604 (samme som navnet som ble bedt om; leverandøren oppga kanskje ingen egen versjon)
- **Tokens:** 1673 inn, 908 ut
- **Varighet:** 5501 ms
- **Kostnad:** 0,0903 kr
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
| 1 | Pågående IT-utdanning | Oppfylt | «2024–2027  Bachelor i IT og digitalisering, Høgskolen i Molde (pågår, 3. år)» | – |
| 2 | God forståelse av Windows | Oppfylt | «Operativsystemer: Windows» | – |
| 3 | God forståelse av Microsoft 365 | Mangler | – | Råd: Legg inn erfaring med Microsoft 365 i CV-en hvis du har det, for eksempel fra studier eller fritidsaktiviteter |
| 4 | Erfaring med brukerstøtte eller kundeservice | Delvis oppfylt | «Hjalp førsteårsstudenter med oppgaver i introduksjonsfaget i programmering»<br>«Holdt to veiledningstimer i uken» | Erfaringen er med veiledning av studenter, ikke direkte brukerstøtte eller kundeservice. |
| 5 | Gode kommunikasjonsevner, muntlig og skriftlig | Delvis oppfylt | «Språk: norsk (morsmål), engelsk (svært godt)» | Språkkunnskapene er dokumentert, men det mangler konkrete eksempler på kommunikasjonsevner i arbeidssammenheng. |
| 6 | Førerkort klasse B | Mangler | – | Råd: Hvis du har førerkort klasse B, legg det inn i CV-en under eget punkt, for eksempel under 'Annet' eller 'Ferdigheter' |
| 7 | Kjennskap til ITIL | Mangler | – | Råd: Hvis du har kjennskap til ITIL, legg det inn i CV-en. Hvis ikke, kan du nevne at du er villig til å lære det |

#### Kjøring 3

- **Status:** 200
- **Modellversjon:** mistral-medium-2604 (samme som navnet som ble bedt om; leverandøren oppga kanskje ingen egen versjon)
- **Tokens:** 1673 inn, 846 ut
- **Varighet:** 4930 ms
- **Kostnad:** 0,0858 kr
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
| 3 | God forståelse av Microsoft 365 | Mangler | – | Råd: Dersom du har erfaring med Microsoft 365, bør du legge det inn i CV-en. Hvis ikke, kan du fremheve din evne til å lære nye systemer raskt. |
| 4 | Erfaring med brukerstøtte eller kundeservice | Delvis oppfylt | «Hjalp førsteårsstudenter med oppgaver i introduksjonsfaget i programmering»<br>«Holdt to veiledningstimer i uken» | Erfaringen er fra veiledning av studenter, ikke direkte brukerstøtte eller kundeservice. |
| 5 | Gode kommunikasjonsevner, muntlig og skriftlig | Delvis oppfylt | «Språk: norsk (morsmål), engelsk (svært godt)» | Språkkunnskapene er dokumentert, men det mangler direkte eksempler på kommunikasjonsevner i arbeidssammenheng. |
| 6 | Førerkort klasse B | Mangler | – | Råd: Hvis du har førerkort klasse B, bør du legge det inn i CV-en. Hvis ikke, kan du vurdere å ta det for å oppfylle kravet. |
| 7 | Kjennskap til ITIL | Mangler | – | Råd: Dersom du har kjennskap til ITIL, bør du nevne det i CV-en. Hvis ikke, kan du fremheve din evne til å tilegne deg nye rammeverk. |

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
- **Gjennomsnittlig kostnad:** 0,0868 kr
- **Lengste varighet:** 5564 ms
- **Høyeste output-tokens:** 908
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
- Kjøring 2: 8 av 13 forventede nøkkelord (62 %), hjelp, ikke vurdering
- Kjøring 3: 8 av 13 forventede nøkkelord (62 %), hjelp, ikke vurdering

### Kjøringer

#### Kjøring 1

- **Status:** 200
- **Modellversjon:** mistral-medium-2604 (samme som navnet som ble bedt om; leverandøren oppga kanskje ingen egen versjon)
- **Tokens:** 1675 inn, 827 ut
- **Varighet:** 5544 ms
- **Kostnad:** 0,0844 kr
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
| 3 | Erfaring med regnskapssystemer som Tripletex eller Visma | Mangler | – | Råd: Trekk fram eventuell erfaring med andre regnskapssystemer eller vis vilje til å lære systemer som Tripletex eller Visma. |
| 4 | Erfaring med bokføring og avstemminger | Mangler | – | Råd: Hvis du har relevant erfaring fra studiet, for eksempel i bacheloroppgaven eller fag som bedriftsøkonomisk analyse, kan du nevne dette i CV-en. |
| 5 | Strukturert og nøyaktig | Delvis oppfylt | «Bacheloroppgave: «Likviditetsstyring i små familiebedrifter»» | CV-en viser strukturert arbeid gjennom bacheloroppgaven, men det fremgår ikke eksplisitt at egenskapen gjelder generelt. |
| 6 | Gode samarbeidsevner | Delvis oppfylt | «Kundeservicemedarbeider (deltid), Testtelefon AS, Ålesund» | Erfaring som kundeservicemedarbeider kan indikere samarbeidsevner, men dette fremgår ikke direkte. |

#### Kjøring 2

- **Status:** 200
- **Modellversjon:** mistral-medium-2604 (samme som navnet som ble bedt om; leverandøren oppga kanskje ingen egen versjon)
- **Tokens:** 1675 inn, 840 ut
- **Varighet:** 5298 ms
- **Kostnad:** 0,0854 kr
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
| 3 | Erfaring med regnskapssystemer som Tripletex eller Visma | Mangler | – | Råd: Trekk fram eventuell erfaring med andre regnskapssystemer eller vis vilje til å lære systemer som Tripletex eller Visma. |
| 4 | Erfaring med bokføring og avstemminger | Mangler | – | Råd: Hvis du har relevant erfaring fra studier, prosjekter eller praksis, legg det inn i CV-en. Ellers kan du vise vilje til å lære. |
| 5 | Strukturert og nøyaktig | Delvis oppfylt | «Relevante fag: finansregnskap, skatterett, bedriftsøkonomisk analyse» | CV-en viser faglig bakgrunn som kan indikere struktur og nøyaktighet, men det mangler direkte dokumentasjon av egenskapen i arbeidssituasjoner. |
| 6 | Gode samarbeidsevner | Delvis oppfylt | «Kundeservicemedarbeider (deltid), Testtelefon AS, Ålesund» | Erfaring som kundeservicemedarbeider kan tyde på samarbeidsevner, men det mangler eksplisitt dokumentasjon av dette. |

#### Kjøring 3

- **Status:** 200
- **Modellversjon:** mistral-medium-2604 (samme som navnet som ble bedt om; leverandøren oppga kanskje ingen egen versjon)
- **Tokens:** 1675 inn, 903 ut
- **Varighet:** 4895 ms
- **Kostnad:** 0,0899 kr
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
| 3 | Erfaring med regnskapssystemer som Tripletex eller Visma | Mangler | – | Råd: Legg inn eventuell erfaring med regnskapssystemer i CV-en, eller vis vilje til å lære disse systemene. |
| 4 | Erfaring med bokføring og avstemminger | Mangler | – | Råd: Trekk fram relevant erfaring fra studier eller praksis som kan knyttes til bokføring og avstemminger. |
| 5 | Strukturert og nøyaktig | Delvis oppfylt | «Bacheloroppgave: «Likviditetsstyring i små familiebedrifter»»<br>«Relevante fag: finansregnskap, skatterett, bedriftsøkonomisk analyse» | CV-en viser faglig struktur gjennom studier, men mangler direkte eksempler på nøyaktighet i arbeidssituasjoner. |
| 6 | Gode samarbeidsevner | Delvis oppfylt | «Besvarte kundehenvendelser om fakturaer og abonnement» | CV-en viser samhandling med kunder, men mangler eksempler på samarbeid internt i team. |

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
- **Gjennomsnittlig kostnad:** 0,0866 kr
- **Lengste varighet:** 5544 ms
- **Høyeste output-tokens:** 903
- **Treffprosent per kjøring:** 19 %, 19 %, 19 %

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
- **Tokens:** 1858 inn, 803 ut
- **Varighet:** 4235 ms
- **Kostnad:** 0,0853 kr
- **Stilling:** Resepsjonsmedarbeider – deltid, **arbeidsgiver:** Hotell Testfjord, Ålesund
- **Treffprosent:** 33 %
- **Fjernede belegg:** 0
- **Nedgraderte krav:** ingen
- **Nøkkelord funnet i CV-en:** deltid, engelsk, tysk, kassasystem, reiseliv
- **Nøkkelord ikke funnet:** resepsjonsmedarbeider, serviceinnstilt, kundeservice, språkkunnskaper, oppgjør, selvstendig, ansvarsbevisst, hotellfag, bookingsystemer, Opera
- **Nøkkelorddekning mot fasiten:** 10 av 12 forventede nøkkelord (83 %), hjelp, ikke vurdering
  - Ikke med fra fasiten: resepsjon, booking

| # | Krav | Kategori | Belegg | Forklaring eller råd |
|---|---|---|---|---|
| 1 | Er serviceinnstilt og har erfaring fra kundeservice | Oppfylt | «Reiselivsstudent som trives med å ta imot gjester og løse problemer på stedet»<br>«Tok imot bestillinger og hjalp gjester med spørsmål» | – |
| 2 | Har gode språkkunnskaper i engelsk og tysk | Delvis oppfylt | «Engelsk – godt»<br>«Tysk – grunnleggende» | Tysk-kunnskapene er beskrevet som grunnleggende, ikke gode. |
| 3 | Har erfaring med kassasystem og oppgjør | Oppfylt | «Kassasystem og dagsoppgjør»<br>«Betjente kassasystem og tok dagsoppgjør ved stenging» | – |
| 4 | Er selvstendig og ansvarsbevisst | Oppfylt | «Vant til å jobbe alene på kveldsvakt»<br>«Stengte kafeen alene på kveldsvakter» | – |
| 5 | Studerer reiseliv, hotellfag eller tilsvarende | Oppfylt | «Bachelor i reiselivsledelse, Testvik høgskole (pågår, 2. år)» | – |
| 6 | Har erfaring med bookingsystemer, gjerne Opera | Mangler | – | Råd: Hvis du har brukt bookingsystemer, bør du nevne dette i CV-en. Hvis ikke, kan du fremheve din evne til å lære nye systemer raskt. |

#### Kjøring 2

- **Status:** 200
- **Modellversjon:** mistral-medium-2604 (samme som navnet som ble bedt om; leverandøren oppga kanskje ingen egen versjon)
- **Tokens:** 1858 inn, 797 ut
- **Varighet:** 4327 ms
- **Kostnad:** 0,0849 kr
- **Stilling:** Resepsjonsmedarbeider, **arbeidsgiver:** Hotell Testfjord
- **Treffprosent:** 33 %
- **Fjernede belegg:** 0
- **Nedgraderte krav:** ingen
- **Nøkkelord funnet i CV-en:** deltid, engelsk, tysk, kassasystem, reiseliv
- **Nøkkelord ikke funnet:** resepsjonsmedarbeider, serviceinnstilt, kundeservice, språkkunnskaper, oppgjør, selvstendig, ansvarsbevisst, hotellfag, bookingsystemer, Opera
- **Nøkkelorddekning mot fasiten:** 10 av 12 forventede nøkkelord (83 %), hjelp, ikke vurdering
  - Ikke med fra fasiten: resepsjon, booking

| # | Krav | Kategori | Belegg | Forklaring eller råd |
|---|---|---|---|---|
| 1 | Er serviceinnstilt og har erfaring fra kundeservice | Oppfylt | «Reiselivsstudent som trives med å ta imot gjester og løse problemer på stedet»<br>«Tok imot bestillinger og hjalp gjester med spørsmål»<br>«Svarte turister på spørsmål på norsk og engelsk» | – |
| 2 | Har gode språkkunnskaper i engelsk og tysk | Delvis oppfylt | «Engelsk – godt»<br>«Tysk – grunnleggende» | Tysk-kunnskapene er bare grunnleggende, mens kravet er gode kunnskaper. |
| 3 | Har erfaring med kassasystem og oppgjør | Oppfylt | «Kassasystem og dagsoppgjør»<br>«Betjente kassasystem og tok dagsoppgjør ved stenging» | – |
| 4 | Er selvstendig og ansvarsbevisst | Oppfylt | «Vant til å jobbe alene på kveldsvakt»<br>«Stengte kafeen alene på kveldsvakter» | – |
| 5 | Studerer reiseliv, hotellfag eller tilsvarende | Oppfylt | «Bachelor i reiselivsledelse, Testvik høgskole (pågår, 2. år)» | – |
| 6 | Har erfaring med bookingsystemer, gjerne Opera | Mangler | – | Råd: Trekk fram eventuell erfaring med andre bookingsystemer eller vis vilje til å lære Opera. |

#### Kjøring 3

- **Status:** 200
- **Modellversjon:** mistral-medium-2604 (samme som navnet som ble bedt om; leverandøren oppga kanskje ingen egen versjon)
- **Tokens:** 1858 inn, 804 ut
- **Varighet:** 4168 ms
- **Kostnad:** 0,0854 kr
- **Stilling:** Resepsjonsmedarbeider – deltid, **arbeidsgiver:** Hotell Testfjord, Ålesund
- **Treffprosent:** 33 %
- **Fjernede belegg:** 0
- **Nedgraderte krav:** ingen
- **Nøkkelord funnet i CV-en:** deltid, engelsk, tysk, kassasystem, reiseliv
- **Nøkkelord ikke funnet:** resepsjonsmedarbeider, serviceinnstilt, kundeservice, språkkunnskaper, oppgjør, selvstendig, ansvarsbevisst, hotellfag, bookingsystemer, Opera
- **Nøkkelorddekning mot fasiten:** 10 av 12 forventede nøkkelord (83 %), hjelp, ikke vurdering
  - Ikke med fra fasiten: resepsjon, booking

| # | Krav | Kategori | Belegg | Forklaring eller råd |
|---|---|---|---|---|
| 1 | Er serviceinnstilt og har erfaring fra kundeservice | Oppfylt | «Reiselivsstudent som trives med å ta imot gjester og løse problemer på stedet»<br>«Tok imot bestillinger og hjalp gjester med spørsmål» | – |
| 2 | Har gode språkkunnskaper i engelsk og tysk | Delvis oppfylt | «Engelsk – godt»<br>«Tysk – grunnleggende» | Tyskkunnskapene er kun grunnleggende, mens engelsk er godt. |
| 3 | Har erfaring med kassasystem og oppgjør | Oppfylt | «Kassasystem og dagsoppgjør»<br>«Betjente kassasystem og tok dagsoppgjør ved stenging» | – |
| 4 | Er selvstendig og ansvarsbevisst | Oppfylt | «Vant til å jobbe alene på kveldsvakt»<br>«Stengte kafeen alene på kveldsvakter» | – |
| 5 | Studerer reiseliv, hotellfag eller tilsvarende | Oppfylt | «Bachelor i reiselivsledelse, Testvik høgskole (pågår, 2. år)» | – |
| 6 | Har erfaring med bookingsystemer, gjerne Opera | Mangler | – | Råd: Hvis du har erfaring med bookingsystemer, bør du legge det inn i CV-en. Hvis ikke, kan du fremheve din evne til å lære nye systemer raskt. |

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
- **Gjennomsnittlig kostnad:** 0,0852 kr
- **Lengste varighet:** 4327 ms
- **Høyeste output-tokens:** 804
- **Treffprosent per kjøring:** 33 %, 33 %, 33 %

## Totalt

- **Kjøringer:** 12, **feil:** 0
- **Samlet kostnad:** 1,0129 kr
- **Gjennomsnittlig kostnad per kjøring:** 0,0844 kr
- **Lengste varighet:** 6617 ms
- **Høyeste output-tokens:** 908 (taket er 8000)
- **Temperatur:** 0.2
