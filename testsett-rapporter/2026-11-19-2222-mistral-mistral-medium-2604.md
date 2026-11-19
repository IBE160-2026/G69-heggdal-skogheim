# Testsett: mistral mistral-medium-2604

- **Commit:** `4cd4f2f683994a33e0be9daac7e9c9f80b878f33`
- **Leverandør:** mistral
- **Modell (bedt om):** mistral-medium-2604
- **Modellversjon fra leverandøren:** mistral-medium-2604 (samme som navnet som ble bedt om; leverandøren oppga kanskje ingen egen versjon) (12 kjøringer)
- **Dato:** 2026-11-19T21:22:24.980Z
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
- Kjøring 2: 8 av 9 forventede nøkkelord (89 %), hjelp, ikke vurdering
- Kjøring 3: 8 av 9 forventede nøkkelord (89 %), hjelp, ikke vurdering

### Kjøringer

#### Kjøring 1

- **Status:** 200
- **Modellversjon:** mistral-medium-2604 (samme som navnet som ble bedt om; leverandøren oppga kanskje ingen egen versjon)
- **Tokens:** 2285 inn, 946 ut
- **Varighet:** 6594 ms
- **Kostnad:** 0,1019 kr
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
| 1 | Er kundeorientert og trives med å hjelpe andre | Delvis oppfylt | «liker å jobbe med mennesker»<br>«Hjalp kunder med å finne varer og svarte på spørsmål» | Kundeorientering er beskrevet som en egenskap i profilen, men det mangler konkrete eksempler på kundebehandling i en bankkontekst. |
| 2 | Har gode digitale ferdigheter | Delvis oppfylt | «Microsoft Office (Word, Excel, PowerPoint) – grunnleggende» | Digitale ferdigheter er dokumentert, men kun på grunnleggende nivå og ikke spesifikt rettet mot banktjenester. |
| 3 | Har erfaring med kontanthåndtering | Oppfylt | «Betjente kasse og tok imot kontanter og kortbetaling»<br>«Talte opp kontanter etter kiosksalg på kampdager» | – |
| 4 | Er nøyaktig og pålitelig | Delvis oppfylt | «pålitelig»<br>«Førte oversikt over medlemskontingent i et regneark» | Pålitelighet er nevnt som egenskap, men nøyaktighet er kun indirekte dokumentert gjennom oppgaver som krever presisjon. |
| 5 | Studerer økonomi eller tilsvarende | Oppfylt | «Bachelor i økonomi og administrasjon, Høgskolen i Molde (pågår)»<br>«Fag så langt: bedriftsøkonomi, markedsføring, regnskapsforståelse» | – |
| 6 | Har autorisasjon som finansiell rådgiver (AFR) | Mangler | – | Råd: Dersom du har relevant erfaring eller utdanning, kan du vurdere å ta AFR-sertifiseringen for å styrke kvalifikasjonene dine. |

#### Kjøring 2

- **Status:** 200
- **Modellversjon:** mistral-medium-2604 (samme som navnet som ble bedt om; leverandøren oppga kanskje ingen egen versjon)
- **Tokens:** 2285 inn, 923 ut
- **Varighet:** 5456 ms
- **Kostnad:** 0,1003 kr
- **Stilling:** Sommervikar – Kundebehandler, **arbeidsgiver:** Sparebanken Testvik
- **Treffprosent:** 18 %
- **Fjernede belegg:** 0
- **Nedgraderte krav:** ingen
- **Nøkkelord funnet i CV-en:** telefon, pålitelig, økonomi
- **Nøkkelord ikke funnet:** sommervikar, kundebehandler, kundeorientert, serviceinnstilt, kundesenter, chat, skranke, nettbank, mobilbank, kontanthåndtering, digitale ferdigheter, nøyaktig, finansiell rådgiver, AFR
- **Nøkkelorddekning mot fasiten:** 8 av 9 forventede nøkkelord (89 %), hjelp, ikke vurdering
  - Ikke med fra fasiten: kundeservice

| # | Krav | Kategori | Belegg | Forklaring eller råd |
|---|---|---|---|---|
| 1 | Er kundeorientert og trives med å hjelpe andre | Delvis oppfylt | «liker å jobbe med mennesker»<br>«Hjalp kunder med å finne varer og svarte på spørsmål» | Kundeorienteringen er beskrevet som en egenskap i profilen, men det mangler direkte dokumentasjon på erfaring med å hjelpe kunder i en servicekontekst som ligner bank. |
| 2 | Har gode digitale ferdigheter | Oppfylt | «Microsoft Office (Word, Excel, PowerPoint) – grunnleggende» | – |
| 3 | Har erfaring med kontanthåndtering | Oppfylt | «Betjente kasse og tok imot kontanter og kortbetaling»<br>«Talte opp kontanter etter kiosksalg på kampdager» | – |
| 4 | Er nøyaktig og pålitelig | Delvis oppfylt | «Pålitelig»<br>«Førte oversikt over medlemskontingent i et regneark» | Påliteligheten er beskrevet som en egenskap, mens nøyaktigheten bare er indirekte dokumentert gjennom oppgaver som krever presisjon. |
| 5 | Studerer økonomi eller tilsvarende | Oppfylt | «Bachelor i økonomi og administrasjon, Høgskolen i Molde (pågår)» | – |
| 6 | Har autorisasjon som finansiell rådgiver (AFR) | Mangler | – | Råd: Hvis du har relevant erfaring eller utdanning som kan føre til autorisasjon, kan du nevne dette og vise vilje til å ta sertifiseringen. |

#### Kjøring 3

- **Status:** 200
- **Modellversjon:** mistral-medium-2604 (samme som navnet som ble bedt om; leverandøren oppga kanskje ingen egen versjon)
- **Tokens:** 2285 inn, 898 ut
- **Varighet:** 5044 ms
- **Kostnad:** 0,0984 kr
- **Stilling:** Sommervikar – Kundebehandler, **arbeidsgiver:** Sparebanken Testvik
- **Treffprosent:** 18 %
- **Fjernede belegg:** 0
- **Nedgraderte krav:** ingen
- **Nøkkelord funnet i CV-en:** telefon, pålitelig, økonomi
- **Nøkkelord ikke funnet:** sommervikar, kundebehandler, kundeorientert, serviceinnstilt, kundesenter, chat, skranke, nettbank, mobilbank, kontanthåndtering, digitale ferdigheter, nøyaktig, AFR, finansiell rådgiver
- **Nøkkelorddekning mot fasiten:** 8 av 9 forventede nøkkelord (89 %), hjelp, ikke vurdering
  - Ikke med fra fasiten: kundeservice

| # | Krav | Kategori | Belegg | Forklaring eller råd |
|---|---|---|---|---|
| 1 | Er kundeorientert og trives med å hjelpe andre | Delvis oppfylt | «liker å jobbe med mennesker»<br>«Hjalp kunder med å finne varer og svarte på spørsmål» | Kundeorienteringen er beskrevet som en egenskap, ikke dokumentert gjennom konkrete oppgaver i kundebehandling. |
| 2 | Har gode digitale ferdigheter | Oppfylt | «Microsoft Office (Word, Excel, PowerPoint) – grunnleggende» | – |
| 3 | Har erfaring med kontanthåndtering | Oppfylt | «Betjente kasse og tok imot kontanter og kortbetaling»<br>«Talte opp kontanter etter kiosksalg på kampdager» | – |
| 4 | Er nøyaktig og pålitelig | Delvis oppfylt | «Pålitelig»<br>«Førte oversikt over medlemskontingent i et regneark» | Pålitelighet er beskrevet som en egenskap, mens nøyaktighet bare er delvis dokumentert gjennom regnearksarbeid. |
| 5 | Studerer økonomi eller tilsvarende | Oppfylt | «Bachelor i økonomi og administrasjon, Høgskolen i Molde (pågår)» | – |
| 6 | Har autorisasjon som finansiell rådgiver (AFR) | Mangler | – | Råd: Dersom du har relevant utdanning eller planer om å ta AFR, kan du nevne dette i søknaden for å vise ambisjon. |

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
- **Gjennomsnittlig kostnad:** 0,1002 kr
- **Lengste varighet:** 6594 ms
- **Høyeste output-tokens:** 946
- **Treffprosent per kjøring:** 19 %, 18 %, 18 %

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
- **Tokens:** 2167 inn, 804 ut
- **Varighet:** 4430 ms
- **Kostnad:** 0,0899 kr
- **Stilling:** IT-brukerstøtte – deltid for student, **arbeidsgiver:** Nordvest Testkommune
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
| 2 | God forståelse av Windows og Microsoft 365 | Delvis oppfylt | «Operativsystemer: Windows» | Mangler dokumentasjon på forståelse av Microsoft 365. |
| 3 | Erfaring med brukerstøtte eller kundeservice | Delvis oppfylt | «Hjalp førsteårsstudenter med oppgaver i introduksjonsfaget i programmering»<br>«Holdt to veiledningstimer i uken» | Erfaringen er med veiledning, ikke direkte brukerstøtte eller kundeservice. |
| 4 | Gode kommunikasjonsevner, muntlig og skriftlig | Delvis oppfylt | «Språk: norsk (morsmål), engelsk (svært godt)» | Kommunikasjonsevner er bare nevnt som språkferdigheter, ikke konkret dokumentert. |
| 5 | Førerkort klasse B | Mangler | – | Råd: Legg til førerkort klasse B i CV-en hvis du har det. |
| 6 | Kjennskap til ITIL | Mangler | – | Råd: Vurder å ta en introduksjonskurs i ITIL for å styrke kvalifikasjonene. |

#### Kjøring 2

- **Status:** 200
- **Modellversjon:** mistral-medium-2604 (samme som navnet som ble bedt om; leverandøren oppga kanskje ingen egen versjon)
- **Tokens:** 2167 inn, 807 ut
- **Varighet:** 4301 ms
- **Kostnad:** 0,0901 kr
- **Stilling:** IT-brukerstøtte – deltid for student, **arbeidsgiver:** Nordvest Testkommune
- **Treffprosent:** 31 %
- **Fjernede belegg:** 0
- **Nedgraderte krav:** ingen
- **Nøkkelord funnet i CV-en:** deltid, student, IT-utdanning, Windows
- **Nøkkelord ikke funnet:** IT-brukerstøtte, Microsoft 365, brukerstøtte, kundeservice, kommunikasjonsevner, muntlig, skriftlig, Førerkort klasse B, ITIL
- **Nøkkelorddekning mot fasiten:** 4 av 9 forventede nøkkelord (44 %), hjelp, ikke vurdering
  - Ikke med fra fasiten: førstelinje, saksbehandlingssystem, oppsett av PC, kommunikasjon, førerkort

| # | Krav | Kategori | Belegg | Forklaring eller råd |
|---|---|---|---|---|
| 1 | Pågående IT-utdanning | Oppfylt | «2024–2027  Bachelor i IT og digitalisering, Høgskolen i Molde (pågår, 3. år)» | – |
| 2 | God forståelse av Windows og Microsoft 365 | Delvis oppfylt | «Operativsystemer: Windows» | Mangler dokumentasjon på forståelse av Microsoft 365. |
| 3 | Erfaring med brukerstøtte eller kundeservice | Delvis oppfylt | «Hjalp førsteårsstudenter med oppgaver i introduksjonsfaget i programmering»<br>«Holdt to veiledningstimer i uken» | Erfaringen er med veiledning, ikke direkte brukerstøtte eller kundeservice. |
| 4 | Gode kommunikasjonsevner, muntlig og skriftlig | Delvis oppfylt | «Språk: norsk (morsmål), engelsk (svært godt)» | Kommunikasjonsevner er bare nevnt som språkferdigheter, ikke konkret dokumentert. |
| 5 | Førerkort klasse B | Mangler | – | Råd: Legg til førerkort klasse B i CV-en hvis du har det. |
| 6 | Kjennskap til ITIL | Mangler | – | Råd: Vurder å ta en introduksjonskurs i ITIL for å vise vilje til å lære. |

#### Kjøring 3

- **Status:** 200
- **Modellversjon:** mistral-medium-2604 (samme som navnet som ble bedt om; leverandøren oppga kanskje ingen egen versjon)
- **Tokens:** 2167 inn, 821 ut
- **Varighet:** 4309 ms
- **Kostnad:** 0,0911 kr
- **Stilling:** IT-brukerstøtte – deltid for student, **arbeidsgiver:** Nordvest Testkommune
- **Treffprosent:** 31 %
- **Fjernede belegg:** 0
- **Nedgraderte krav:** ingen
- **Nøkkelord funnet i CV-en:** deltid, student, IT-utdanning, Windows
- **Nøkkelord ikke funnet:** IT-brukerstøtte, Microsoft 365, brukerstøtte, kundeservice, kommunikasjonsevner, muntlig, skriftlig, Førerkort klasse B, ITIL
- **Nøkkelorddekning mot fasiten:** 4 av 9 forventede nøkkelord (44 %), hjelp, ikke vurdering
  - Ikke med fra fasiten: førstelinje, saksbehandlingssystem, oppsett av PC, kommunikasjon, førerkort

| # | Krav | Kategori | Belegg | Forklaring eller råd |
|---|---|---|---|---|
| 1 | Pågående IT-utdanning | Oppfylt | «2024–2027  Bachelor i IT og digitalisering, Høgskolen i Molde (pågår, 3. år)» | – |
| 2 | God forståelse av Windows og Microsoft 365 | Delvis oppfylt | «Operativsystemer: Windows» | Mangler dokumentasjon på forståelse av Microsoft 365. |
| 3 | Erfaring med brukerstøtte eller kundeservice | Delvis oppfylt | «Hjalp førsteårsstudenter med oppgaver i introduksjonsfaget i programmering»<br>«Holdt to veiledningstimer i uken» | Erfaringen er med veiledning, ikke direkte brukerstøtte eller kundeservice. |
| 4 | Gode kommunikasjonsevner, muntlig og skriftlig | Delvis oppfylt | «Språk: norsk (morsmål), engelsk (svært godt)» | Kun språkkunnskaper er dokumentert, ikke kommunikasjonsevner i arbeidssammenheng. |
| 5 | Førerkort klasse B | Mangler | – | Råd: Legg til førerkort klasse B i CV-en hvis du har det, eller vurder om du kan ta det. |
| 6 | Kjennskap til ITIL | Mangler | – | Råd: Vurder å ta en introduksjonskurs i ITIL for å vise interesse og læringsvilje. |

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
- **Gjennomsnittlig kostnad:** 0,0904 kr
- **Lengste varighet:** 4430 ms
- **Høyeste output-tokens:** 821
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
- **Tokens:** 2169 inn, 893 ut
- **Varighet:** 4841 ms
- **Kostnad:** 0,0964 kr
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
| 3 | Erfaring med regnskapssystemer som Tripletex eller Visma | Mangler | – | Råd: Trekk fram eventuell erfaring med andre regnskapssystemer eller vis vilje til å lære Tripletex og Visma. |
| 4 | Erfaring med bokføring og avstemminger | Mangler | – | Råd: Legg inn relevant erfaring med bokføring og avstemminger hvis du har det, for eksempel fra studiet eller praksis. |
| 5 | Strukturert og nøyaktig | Delvis oppfylt | «Bacheloroppgave: «Likviditetsstyring i små familiebedrifter»» | Kravet er basert på egenvurdering og studier, men mangler konkret arbeidserfaring som viser egenskapene. |
| 6 | Gode samarbeidsevner | Delvis oppfylt | «Kundeservicemedarbeider (deltid), Testtelefon AS, Ålesund» | Erfaringen viser samhandling, men det er ikke konkret dokumentert at dette er 'gode' samarbeidsevner. |

#### Kjøring 2

- **Status:** 200
- **Modellversjon:** mistral-medium-2604 (samme som navnet som ble bedt om; leverandøren oppga kanskje ingen egen versjon)
- **Tokens:** 2169 inn, 916 ut
- **Varighet:** 5107 ms
- **Kostnad:** 0,0981 kr
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
| 3 | Erfaring med regnskapssystemer som Tripletex eller Visma | Mangler | – | Råd: Trekk fram eventuell erfaring med andre regnskapssystemer eller vis vilje til å lære Tripletex og Visma |
| 4 | Erfaring med bokføring og avstemminger | Mangler | – | Råd: Legg inn relevant erfaring med bokføring og avstemminger hvis du har det, for eksempel fra studiet eller praksis |
| 5 | Strukturert og nøyaktig | Delvis oppfylt | «Bacheloroppgave: «Likviditetsstyring i små familiebedrifter»»<br>«Relevante fag: finansregnskap, skatterett, bedriftsøkonomisk analyse» | Kravet er basert på egenskaper som ikke er konkret dokumentert med erfaring, men studiet kan tyde på struktur og nøyaktighet |
| 6 | Gode samarbeidsevner | Delvis oppfylt | «Kundeservicemedarbeider (deltid), Testtelefon AS, Ålesund» | Erfaringen med kundeservice kan tyde på samarbeidsevner, men det er ikke konkret dokumentert |

#### Kjøring 3

- **Status:** 200
- **Modellversjon:** mistral-medium-2604 (samme som navnet som ble bedt om; leverandøren oppga kanskje ingen egen versjon)
- **Tokens:** 2169 inn, 863 ut
- **Varighet:** 4654 ms
- **Kostnad:** 0,0942 kr
- **Stilling:** Regnskapsmedarbeider, **arbeidsgiver:** Fjordtall Regnskap AS
- **Treffprosent:** 20 %
- **Fjernede belegg:** 0
- **Nedgraderte krav:** ingen
- **Nøkkelord funnet i CV-en:** Ålesund, Bachelor i økonomi og administrasjon, Excel
- **Nøkkelord ikke funnet:** regnskapsmedarbeider, Fjordtall Regnskap AS, bokføring, avstemminger, fakturering, årsoppgjør, skattemeldinger, Tripletex, Visma, strukturert, nøyaktig, samarbeidsevner
- **Nøkkelorddekning mot fasiten:** 8 av 13 forventede nøkkelord (62 %), hjelp, ikke vurdering
  - Ikke med fra fasiten: avstemming, periodeavslutning, skattemelding, regnskapssystem, samarbeid

| # | Krav | Kategori | Belegg | Forklaring eller råd |
|---|---|---|---|---|
| 1 | Bachelor i økonomi og administrasjon eller tilsvarende | Oppfylt | «Bachelor i økonomi og administrasjon, Testvik handelshøyskole (fullført juni 2026)» | – |
| 2 | Gode Excel-kunnskaper | Oppfylt | «Excel: pivottabeller, HVIS- og FINN.RAD-funksjoner (fra studiet)» | – |
| 3 | Erfaring med regnskapssystemer som Tripletex eller Visma | Mangler | – | Råd: Trekk fram eventuell erfaring med andre regnskapssystemer eller vis vilje til å lære Tripletex eller Visma |
| 4 | Erfaring med bokføring og avstemminger | Mangler | – | Råd: Legg inn relevant erfaring med bokføring eller avstemminger hvis du har det, for eksempel fra studiet eller praksis |
| 5 | Strukturert og nøyaktig | Delvis oppfylt | «Bacheloroppgave: «Likviditetsstyring i små familiebedrifter»» | Kravet er basert på egenvurdering og studier, ikke direkte dokumentert arbeidserfaring |
| 6 | Gode samarbeidsevner | Delvis oppfylt | «Kundeservicemedarbeider (deltid), Testtelefon AS, Ålesund» | Erfaringen viser samarbeid, men det er ikke konkret dokumentert at samarbeidsevnen er god |

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
- **Gjennomsnittlig kostnad:** 0,0962 kr
- **Lengste varighet:** 5107 ms
- **Høyeste output-tokens:** 916
- **Treffprosent per kjøring:** 19 %, 19 %, 20 %

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
- **Tokens:** 2352 inn, 920 ut
- **Varighet:** 5151 ms
- **Kostnad:** 0,1010 kr
- **Stilling:** Resepsjonsmedarbeider – deltid, **arbeidsgiver:** Hotell Testfjord
- **Treffprosent:** 36 %
- **Fjernede belegg:** 0
- **Nedgraderte krav:** ingen
- **Nøkkelord funnet i CV-en:** deltid, engelsk, tysk, kassasystem, reiseliv
- **Nøkkelord ikke funnet:** resepsjonsmedarbeider, serviceinnstilt, kundeservice, oppgjør, selvstendig, ansvarsbevisst, hotellfag, bookingsystemer, Opera
- **Nøkkelorddekning mot fasiten:** 10 av 12 forventede nøkkelord (83 %), hjelp, ikke vurdering
  - Ikke med fra fasiten: resepsjon, booking

| # | Krav | Kategori | Belegg | Forklaring eller råd |
|---|---|---|---|---|
| 1 | Er serviceinnstilt og har erfaring fra kundeservice | Oppfylt | «Reiselivsstudent som trives med å ta imot gjester og løse problemer på stedet»<br>«Tok imot bestillinger og hjalp gjester med spørsmål»<br>«Svarte turister på spørsmål på norsk og engelsk» | – |
| 2 | Har gode språkkunnskaper i engelsk og tysk | Delvis oppfylt | «Engelsk – godt»<br>«Tysk – grunnleggende» | Tysk er kun på grunnleggende nivå, mens kravet krever gode kunnskaper. |
| 3 | Har erfaring med kassasystem og oppgjør | Oppfylt | «Kassasystem og dagsoppgjør»<br>«Betjente kassasystem og tok dagsoppgjør ved stenging» | – |
| 4 | Er selvstendig og ansvarsbevisst | Delvis oppfylt | «Vant til å jobbe alene på kveldsvakt»<br>«Stengte kafeen alene på kveldsvakter» | Selvstendighet er dokumentert, men ansvarsbevissthet er kun nevnt som egenvurdering i profilen. |
| 5 | Studerer reiseliv, hotellfag eller tilsvarende | Oppfylt | «Student i reiselivsledelse»<br>«2025–2028 Bachelor i reiselivsledelse, Testvik høgskole (pågår, 2. år)» | – |
| 6 | Har erfaring med bookingsystemer, gjerne Opera | Mangler | – | Råd: Dersom du har erfaring med bookingsystemer, bør du legge dette inn i CV-en. Hvis ikke, kan du fremheve din evne til å lære nye systemer raskt. |

#### Kjøring 2

- **Status:** 200
- **Modellversjon:** mistral-medium-2604 (samme som navnet som ble bedt om; leverandøren oppga kanskje ingen egen versjon)
- **Tokens:** 2352 inn, 908 ut
- **Varighet:** 4542 ms
- **Kostnad:** 0,1001 kr
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
| 2 | har gode språkkunnskaper i engelsk og tysk | Delvis oppfylt | «Engelsk – godt»<br>«Tysk – grunnleggende» | Tysk-kunnskapene er oppgitt som grunnleggende, ikke gode. |
| 3 | har erfaring med kassasystem og oppgjør | Oppfylt | «Kassasystem og dagsoppgjør»<br>«Betjente kassasystem og tok dagsoppgjør ved stenging» | – |
| 4 | er selvstendig og ansvarsbevisst | Delvis oppfylt | «Vant til å jobbe alene på kveldsvakt»<br>«Stengte kafeen alene på kveldsvakter» | Selvstendighet er dokumentert, men ansvarsbevissthet er bare nevnt som egenvurdering. |
| 5 | studerer reiseliv, hotellfag eller tilsvarende | Oppfylt | «Bachelor i reiselivsledelse, Testvik høgskole (pågår, 2. år)» | – |
| 6 | har erfaring med bookingsystemer, gjerne Opera | Mangler | – | Råd: Hvis du har brukt bookingsystemer, bør du nevne dette i CV-en. Hvis ikke, kan du vise vilje til å lære. |

#### Kjøring 3

- **Status:** 200
- **Modellversjon:** mistral-medium-2604 (samme som navnet som ble bedt om; leverandøren oppga kanskje ingen egen versjon)
- **Tokens:** 2352 inn, 892 ut
- **Varighet:** 4636 ms
- **Kostnad:** 0,0990 kr
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
| 2 | har gode språkkunnskaper i engelsk og tysk | Delvis oppfylt | «Engelsk – godt»<br>«Tysk – grunnleggende» | Tysk er oppgitt som grunnleggende, ikke godt. |
| 3 | har erfaring med kassasystem og oppgjør | Oppfylt | «Kassasystem og dagsoppgjør»<br>«Betjente kassasystem og tok dagsoppgjør ved stenging» | – |
| 4 | er selvstendig og ansvarsbevisst | Delvis oppfylt | «Vant til å jobbe alene på kveldsvakt»<br>«Stengte kafeen alene på kveldsvakter» | Selvstendighet er dokumentert, men ansvarsbevissthet er bare nevnt som egenvurdering. |
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
- **Gjennomsnittlig kostnad:** 0,1000 kr
- **Lengste varighet:** 5151 ms
- **Høyeste output-tokens:** 920
- **Treffprosent per kjøring:** 36 %, 33 %, 33 %

## Totalt

- **Kjøringer:** 12, **feil:** 0
- **Samlet kostnad:** 1,1606 kr
- **Gjennomsnittlig kostnad per kjøring:** 0,0967 kr
- **Lengste varighet:** 6594 ms
- **Høyeste output-tokens:** 946 (taket er 8000)
- **Temperatur:** 0.2
