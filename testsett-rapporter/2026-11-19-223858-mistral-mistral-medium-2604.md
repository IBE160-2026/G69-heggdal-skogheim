# Testsett: mistral mistral-medium-2604

- **Commit:** `be2b0e23b3c6b5a48e489509a7b317dd2270dada`
- **Leverandør:** mistral
- **Modell (bedt om):** mistral-medium-2604
- **Modellversjon fra leverandøren:** mistral-medium-2604 (samme som navnet som ble bedt om; leverandøren oppga kanskje ingen egen versjon) (12 kjøringer)
- **Dato:** 2026-11-19T21:38:58.736Z
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
- Kjøring 3: 8 av 9 forventede nøkkelord (89 %), hjelp, ikke vurdering

### Kjøringer

#### Kjøring 1

- **Status:** 200
- **Modellversjon:** mistral-medium-2604 (samme som navnet som ble bedt om; leverandøren oppga kanskje ingen egen versjon)
- **Tokens:** 2507 inn, 758 ut
- **Varighet:** 4379 ms
- **Kostnad:** 0,0915 kr
- **Stilling:** Sommervikar – Kundebehandler, **arbeidsgiver:** Sparebanken Testvik
- **Treffprosent:** 18 %
- **Fjernede belegg:** 0
- **Nedgraderte krav:** ingen
- **Nøkkelord funnet i CV-en:** pålitelig, økonomi
- **Nøkkelord ikke funnet:** sommervikar, kundebehandler, kundeorientert, hjelpe andre, digitale ferdigheter, kontanthåndtering, nøyaktig, AFR, finansiell rådgiver
- **Nøkkelorddekning mot fasiten:** 6 av 9 forventede nøkkelord (67 %), hjelp, ikke vurdering
  - Ikke med fra fasiten: kundeservice, nettbank, mobilbank

| # | Krav | Kategori | Belegg | Forklaring eller råd |
|---|---|---|---|---|
| 1 | Er kundeorientert og trives med å hjelpe andre | Oppfylt | «Liker å jobbe med mennesker»<br>«Hjalp kunder med å finne varer og svarte på spørsmål» | – |
| 2 | Har gode digitale ferdigheter | Delvis oppfylt | «Microsoft Office (Word, Excel, PowerPoint) – grunnleggende» | CV-en viser grunnleggende digitale ferdigheter, men ikke nødvendigvis tilstrekkelig for nettbank og mobilbank. |
| 3 | Har erfaring med kontanthåndtering | Oppfylt | «Betjente kasse og tok imot kontanter og kortbetaling»<br>«Talte opp kontanter etter kiosksalg på kampdager» | – |
| 4 | Er nøyaktig og pålitelig | Oppfylt | «Pålitelig»<br>«Førte oversikt over medlemskontingent i et regneark» | – |
| 5 | Studerer økonomi eller tilsvarende | Oppfylt | «Bachelor i økonomi og administrasjon, Høgskolen i Molde (pågår)» | – |
| 6 | Har autorisasjon som finansiell rådgiver (AFR) | Mangler | – | Råd: Dersom du har eller planlegger å ta AFR, bør du nevne dette i CV-en. |

#### Kjøring 2

- **Status:** 200
- **Modellversjon:** mistral-medium-2604 (samme som navnet som ble bedt om; leverandøren oppga kanskje ingen egen versjon)
- **Tokens:** 2507 inn, 941 ut
- **Varighet:** 5266 ms
- **Kostnad:** 0,1048 kr
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
| 1 | Er kundeorientert og trives med å hjelpe andre | Delvis oppfylt | «liker å jobbe med mennesker»<br>«Hjalp kunder med å finne varer og svarte på spørsmål» | Kundeorientering er beskrevet som en egenskap i profilen, men konkret erfaring med kundehjelp er dokumentert i arbeidserfaringen. |
| 2 | Har gode digitale ferdigheter | Delvis oppfylt | «Microsoft Office (Word, Excel, PowerPoint) – grunnleggende» | Digitale ferdigheter er dokumentert, men nivået er oppgitt som grunnleggende. |
| 3 | Har erfaring med kontanthåndtering | Oppfylt | «Betjente kasse og tok imot kontanter og kortbetaling»<br>«Talte opp kontanter etter kiosksalg på kampdager» | – |
| 4 | Er nøyaktig og pålitelig | Delvis oppfylt | «pålitelig»<br>«Førte oversikt over medlemskontingent i et regneark» | Pålitelighet er nevnt som en egenskap i profilen, mens nøyaktighet er dokumentert gjennom oppgaver i vervet. |
| 5 | Studerer økonomi eller tilsvarende | Oppfylt | «Bachelor i økonomi og administrasjon, Høgskolen i Molde (pågår)» | – |
| 6 | Har autorisasjon som finansiell rådgiver (AFR) | Mangler | – | Råd: Hvis du har eller jobber med å få AFR-autorisasjon, bør du nevne dette i CV-en. Ellers kan du trekke fram relevant økonomifaglig utdanning som viser din kompetanse. |

#### Kjøring 3

- **Status:** 200
- **Modellversjon:** mistral-medium-2604 (samme som navnet som ble bedt om; leverandøren oppga kanskje ingen egen versjon)
- **Tokens:** 2507 inn, 934 ut
- **Varighet:** 5466 ms
- **Kostnad:** 0,1043 kr
- **Stilling:** Sommervikar – Kundebehandler, **arbeidsgiver:** Sparebanken Testvik, Molde
- **Treffprosent:** 21 %
- **Fjernede belegg:** 0
- **Nedgraderte krav:** ingen
- **Nøkkelord funnet i CV-en:** Molde, pålitelig, økonomi, telefon
- **Nøkkelord ikke funnet:** sommervikar, kundebehandler, Sparebanken Testvik, kundeorientert, serviceinnstilt, hjelpe andre, digitale ferdigheter, kontanthåndtering, nøyaktig, finansiell rådgiver, AFR, nettbank, mobilbank, skranke, chat
- **Nøkkelorddekning mot fasiten:** 8 av 9 forventede nøkkelord (89 %), hjelp, ikke vurdering
  - Ikke med fra fasiten: kundeservice

| # | Krav | Kategori | Belegg | Forklaring eller råd |
|---|---|---|---|---|
| 1 | Er kundeorientert og trives med å hjelpe andre | Oppfylt | «Liker å jobbe med mennesker»<br>«Hjalp kunder med å finne varer og svarte på spørsmål» | – |
| 2 | Har gode digitale ferdigheter | Delvis oppfylt | «Microsoft Office (Word, Excel, PowerPoint) – grunnleggende» | CV-en viser grunnleggende digitale ferdigheter, men ikke nødvendigvis tilstrekkelig for nettbank og mobilbank. |
| 3 | Har erfaring med kontanthåndtering | Oppfylt | «Betjente kasse og tok imot kontanter og kortbetaling»<br>«Talte opp kontanter etter kiosksalg på kampdager» | – |
| 4 | Er nøyaktig og pålitelig | Delvis oppfylt | «Pålitelig»<br>«Førte oversikt over medlemskontingent i et regneark» | Pålitelighet er nevnt som egenvurdering, mens nøyaktighet bare er dokumentert gjennom regnearksarbeid. |
| 5 | Studerer økonomi eller tilsvarende | Oppfylt | «Bachelor i økonomi og administrasjon, Høgskolen i Molde (pågår)» | – |
| 6 | Har autorisasjon som finansiell rådgiver (AFR) | Mangler | – | Råd: Dersom du har eller planlegger å ta AFR, bør du nevne dette i CV-en. |

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
- **Lengste varighet:** 5466 ms
- **Høyeste output-tokens:** 941
- **Treffprosent per kjøring:** 18 %, 18 %, 21 %

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
- **Tokens:** 2389 inn, 786 ut
- **Varighet:** 4651 ms
- **Kostnad:** 0,0918 kr
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
| 3 | Erfaring med brukerstøtte eller kundeservice | Delvis oppfylt | «Hjalp førsteårsstudenter med oppgaver i introduksjonsfaget i programmering» | Erfaringen er med veiledning, ikke direkte brukerstøtte eller kundeservice. |
| 4 | Gode kommunikasjonsevner, muntlig og skriftlig | Delvis oppfylt | «Holdt to veiledningstimer i uken» | Erfaringen viser muntlig kommunikasjon, men mangler dokumentasjon på skriftlig kommunikasjon. |
| 5 | Førerkort klasse B | Mangler | – | Råd: Legg til førerkort klasse B i CV-en hvis du har det. |
| 6 | Kjennskap til ITIL | Mangler | – | Råd: Vurder å ta en introduksjonskurs i ITIL for å styrke kvalifikasjonene. |

#### Kjøring 2

- **Status:** 200
- **Modellversjon:** mistral-medium-2604 (samme som navnet som ble bedt om; leverandøren oppga kanskje ingen egen versjon)
- **Tokens:** 2389 inn, 804 ut
- **Varighet:** 4331 ms
- **Kostnad:** 0,0931 kr
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
| 4 | Gode kommunikasjonsevner, muntlig og skriftlig | Delvis oppfylt | «Holdt to veiledningstimer i uken» | Erfaringen viser muntlig kommunikasjon, men mangler dokumentasjon på skriftlig kommunikasjonsevne. |
| 5 | Førerkort klasse B | Mangler | – | Råd: Legg til førerkort klasse B i CV-en hvis du har det. |
| 6 | Kjennskap til ITIL | Mangler | – | Råd: Vurder å ta en introduksjonskurs i ITIL for å vise vilje til å lære. |

#### Kjøring 3

- **Status:** 200
- **Modellversjon:** mistral-medium-2604 (samme som navnet som ble bedt om; leverandøren oppga kanskje ingen egen versjon)
- **Tokens:** 2389 inn, 801 ut
- **Varighet:** 4227 ms
- **Kostnad:** 0,0929 kr
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
| 4 | Gode kommunikasjonsevner, muntlig og skriftlig | Delvis oppfylt | «Holdt to veiledningstimer i uken» | Erfaringen viser muntlig kommunikasjon, men mangler dokumentasjon på skriftlig kommunikasjon. |
| 5 | Førerkort klasse B | Mangler | – | Råd: Legg til førerkort klasse B i CV-en hvis du har det. |
| 6 | Kjennskap til ITIL | Mangler | – | Råd: Vurder å ta en introduksjonskurs i ITIL for å vise vilje til å lære. |

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
- **Gjennomsnittlig kostnad:** 0,0926 kr
- **Lengste varighet:** 4651 ms
- **Høyeste output-tokens:** 804
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
- Kjøring 3: 6 av 13 forventede nøkkelord (46 %), hjelp, ikke vurdering

### Kjøringer

#### Kjøring 1

- **Status:** 200
- **Modellversjon:** mistral-medium-2604 (samme som navnet som ble bedt om; leverandøren oppga kanskje ingen egen versjon)
- **Tokens:** 2391 inn, 880 ut
- **Varighet:** 5809 ms
- **Kostnad:** 0,0987 kr
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
| 3 | Erfaring med regnskapssystemer som Tripletex eller Visma | Mangler | – | Råd: Legg inn erfaring med regnskapssystemer i CV-en hvis du har det, eller trekk fram beslektet erfaring med andre systemer. |
| 4 | Erfaring med bokføring og avstemminger | Mangler | – | Råd: Vurder om du har relevant erfaring fra studiet, for eksempel oppgaver eller prosjekter, og legg det inn i CV-en. |
| 5 | Strukturert og nøyaktig | Delvis oppfylt | «Bacheloroppgave: «Likviditetsstyring i små familiebedrifter»» | Egenskapen er bare nevnt som en del av studiet, ikke dokumentert gjennom konkrete arbeidsoppgaver. |
| 6 | Gode samarbeidsevner | Delvis oppfylt | «Besvarte kundehenvendelser om fakturaer og abonnement» | Samarbeidsevner er ikke direkte dokumentert, men kan antydes gjennom kundeoppgaver. |

#### Kjøring 2

- **Status:** 200
- **Modellversjon:** mistral-medium-2604 (samme som navnet som ble bedt om; leverandøren oppga kanskje ingen egen versjon)
- **Tokens:** 2391 inn, 901 ut
- **Varighet:** 5048 ms
- **Kostnad:** 0,1002 kr
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
| 2 | Gode Excel-kunnskaper | Delvis oppfylt | «Excel: pivottabeller, HVIS- og FINN.RAD-funksjoner (fra studiet)» | CV-en viser konkrete Excel-ferdigheter, men det fremgår ikke om nivået er 'gode' |
| 3 | Erfaring med regnskapssystemer som Tripletex eller Visma | Mangler | – | Råd: Legg til erfaring med regnskapssystemer i CV-en hvis du har det, eller vektlegg vilje til å lære |
| 4 | Erfaring med bokføring og avstemminger | Mangler | – | Råd: Trekk fram relevant erfaring fra studiet eller praksis som viser bokføring og avstemminger |
| 5 | Strukturert og nøyaktig | Delvis oppfylt | «Bacheloroppgave: «Likviditetsstyring i små familiebedrifter»» | Egenskapen fremgår ikke direkte, men bacheloroppgaven kan tyde på struktur og nøyaktighet |
| 6 | Gode samarbeidsevner | Delvis oppfylt | «Kundeservicemedarbeider (deltid), Testtelefon AS, Ålesund» | Erfaringen kan tyde på samarbeidsevner, men det fremgår ikke eksplisitt |

#### Kjøring 3

- **Status:** 200
- **Modellversjon:** mistral-medium-2604 (samme som navnet som ble bedt om; leverandøren oppga kanskje ingen egen versjon)
- **Tokens:** 2391 inn, 912 ut
- **Varighet:** 4986 ms
- **Kostnad:** 0,1010 kr
- **Stilling:** Regnskapsmedarbeider, **arbeidsgiver:** Fjordtall Regnskap AS
- **Treffprosent:** 20 %
- **Fjernede belegg:** 0
- **Nedgraderte krav:** ingen
- **Nøkkelord funnet i CV-en:** Ålesund, bachelor i økonomi og administrasjon, Excel
- **Nøkkelord ikke funnet:** regnskapsmedarbeider, Fjordtall Regnskap AS, tilsvarende, Excel-kunnskaper, Tripletex, Visma, regnskapssystemer, bokføring, avstemminger, strukturert, nøyaktig, samarbeidsevner
- **Nøkkelorddekning mot fasiten:** 6 av 13 forventede nøkkelord (46 %), hjelp, ikke vurdering
  - Ikke med fra fasiten: avstemming, periodeavslutning, fakturering, årsoppgjør, skattemelding, regnskapssystem, samarbeid

| # | Krav | Kategori | Belegg | Forklaring eller råd |
|---|---|---|---|---|
| 1 | Bachelor i økonomi og administrasjon eller tilsvarende | Oppfylt | «Bachelor i økonomi og administrasjon, Testvik handelshøyskole (fullført juni 2026)» | – |
| 2 | Gode Excel-kunnskaper | Delvis oppfylt | «Excel: pivottabeller, HVIS- og FINN.RAD-funksjoner (fra studiet)» | CV-en viser konkrete Excel-ferdigheter, men det står ikke at de er på et 'godt' nivå. |
| 3 | Erfaring med regnskapssystemer som Tripletex eller Visma | Mangler | – | Råd: Trekk fram eventuell erfaring med lignende systemer eller vis vilje til å lære opp i Tripletex eller Visma. |
| 4 | Erfaring med bokføring og avstemminger | Mangler | – | Råd: Legg inn relevant erfaring med bokføring eller avstemminger hvis du har det, for eksempel fra studiet eller praksis. |
| 5 | Strukturert og nøyaktig | Delvis oppfylt | «Bacheloroppgave: «Likviditetsstyring i små familiebedrifter»»<br>«Relevante fag: finansregnskap, skatterett, bedriftsøkonomisk analyse» | Egenskapene er ikke direkte dokumentert, men studiet og oppgaven kan tyde på struktur og nøyaktighet. |
| 6 | Gode samarbeidsevner | Delvis oppfylt | «Kundeservicemedarbeider (deltid), Testtelefon AS, Ålesund» | Arbeidserfaringen kan tyde på samarbeidsevner, men det står ikke eksplisitt. |

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
- **Lengste varighet:** 5809 ms
- **Høyeste output-tokens:** 912
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
- **Tokens:** 2574 inn, 888 ut
- **Varighet:** 4439 ms
- **Kostnad:** 0,1019 kr
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
| 1 | Er serviceinnstilt og har erfaring fra kundeservice | Oppfylt | «Reiselivsstudent som trives med å ta imot gjester og løse problemer på stedet»<br>«Tok imot bestillinger og hjalp gjester med spørsmål»<br>«Svarte turister på spørsmål på norsk og engelsk» | – |
| 2 | Har gode språkkunnskaper i engelsk og tysk | Delvis oppfylt | «Engelsk – godt»<br>«Tysk – grunnleggende» | Tysk-kunnskapene er på grunnleggende nivå, mens kravet krever gode kunnskaper. |
| 3 | Har erfaring med kassasystem og oppgjør | Oppfylt | «Kassasystem og dagsoppgjør»<br>«Betjente kassasystem og tok dagsoppgjør ved stenging» | – |
| 4 | Er selvstendig og ansvarsbevisst | Oppfylt | «Vant til å jobbe alene på kveldsvakt»<br>«Stengte kafeen alene på kveldsvakter» | – |
| 5 | Studerer reiseliv, hotellfag eller tilsvarende | Oppfylt | «Student i reiselivsledelse»<br>«Bachelor i reiselivsledelse, Testvik høgskole (pågår, 2. år)» | – |
| 6 | Har erfaring med bookingsystemer, gjerne Opera | Mangler | – | Råd: Trekk fram eventuell erfaring med andre bookingsystemer eller vis vilje til å lære Opera. |

#### Kjøring 2

- **Status:** 200
- **Modellversjon:** mistral-medium-2604 (samme som navnet som ble bedt om; leverandøren oppga kanskje ingen egen versjon)
- **Tokens:** 2574 inn, 876 ut
- **Varighet:** 4639 ms
- **Kostnad:** 0,1010 kr
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
| 2 | har gode språkkunnskaper i engelsk og tysk | Delvis oppfylt | «Engelsk – godt»<br>«Tysk – grunnleggende» | Tysk er kun på grunnleggende nivå, mens kravet krever gode kunnskaper. |
| 3 | har erfaring med kassasystem og oppgjør | Oppfylt | «Kassasystem og dagsoppgjør»<br>«Betjente kassasystem og tok dagsoppgjør ved stenging» | – |
| 4 | er selvstendig og ansvarsbevisst | Oppfylt | «Vant til å jobbe alene på kveldsvakt»<br>«Stengte kafeen alene på kveldsvakter» | – |
| 5 | studerer reiseliv, hotellfag eller tilsvarende | Oppfylt | «Bachelor i reiselivsledelse, Testvik høgskole (pågår, 2. år)» | – |
| 6 | har erfaring med bookingsystemer, gjerne Opera | Mangler | – | Råd: Trekk fram eventuell erfaring med andre bookingsystemer eller vis vilje til å lære Opera. |

#### Kjøring 3

- **Status:** 200
- **Modellversjon:** mistral-medium-2604 (samme som navnet som ble bedt om; leverandøren oppga kanskje ingen egen versjon)
- **Tokens:** 2574 inn, 875 ut
- **Varighet:** 4708 ms
- **Kostnad:** 0,1010 kr
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
| 2 | har gode språkkunnskaper i engelsk og tysk | Delvis oppfylt | «Engelsk – godt»<br>«Tysk – grunnleggende» | Tysk er kun på grunnleggende nivå, mens kravet krever gode kunnskaper. |
| 3 | har erfaring med kassasystem og oppgjør | Oppfylt | «Kassasystem og dagsoppgjør»<br>«Betjente kassasystem og tok dagsoppgjør ved stenging» | – |
| 4 | er selvstendig og ansvarsbevisst | Oppfylt | «Vant til å jobbe alene på kveldsvakt»<br>«Stengte kafeen alene på kveldsvakter» | – |
| 5 | studere reiseliv, hotellfag eller tilsvarende | Oppfylt | «Bachelor i reiselivsledelse, Testvik høgskole (pågår, 2. år)» | – |
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
- **Gjennomsnittlig kostnad:** 0,1013 kr
- **Lengste varighet:** 4708 ms
- **Høyeste output-tokens:** 888
- **Treffprosent per kjøring:** 33 %, 33 %, 33 %

## Totalt

- **Kjøringer:** 12, **feil:** 0
- **Samlet kostnad:** 1,1822 kr
- **Gjennomsnittlig kostnad per kjøring:** 0,0985 kr
- **Lengste varighet:** 5809 ms
- **Høyeste output-tokens:** 941 (taket er 8000)
- **Temperatur:** 0.2
