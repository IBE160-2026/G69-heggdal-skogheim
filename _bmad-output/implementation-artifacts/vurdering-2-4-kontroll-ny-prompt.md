# Vurdering: testsettet med den nye prompten (story 2.4, etter PR #27 og PR #28)

> **Oppdatert 2026-11-23:** spørsmålene i avsnitt 5 er besvart i beslutningsarket (spørsmål 2–5). Eksempelblokken fra PR #28 er fjernet (PR #34), og testsettet er kjørt på nytt: SM-1 8 av 12, SM-2 11 av 12, SM-3 9 av 12, og B4 er bestått. Se [`vurdering-2-4-uten-eksempelblokk.md`](vurdering-2-4-uten-eksempelblokk.md). Avvikene er godtatt som kjente svakheter og måles på nytt i story 5.1 (Sondre og Kevin, 2026-11-23). Denne vurderingen står som historisk dokumentasjon av målingen med eksempelblokken.

> **Kontroll 2026-11-20, godkjent av Kevin og Sondre (høyst 12 betalte kall).** OpenAI `gpt-4.1-mini` med temperatur 0. Fasiten for par 3 er den revurderte (løsning B, «Gode samarbeidsevner» er Mangler).
>
> Vurderingen er gjort av Claude, og Kevin og Sondre bekrefter den. SM-2 er vurdert etter regelen Kevin og Sondre bestemte 2026-11-19 (runde 5).

> **Status: tre suksesskriterier er IKKE bestått med den nye prompten** (detaljene i avsnitt 1–3, og modellens svar ordrett, med tidligere forekomster, i avsnitt 2a):
>
> | Kriterium | Resultat | Kjøringene som feiler |
> |---|---|---|
> | **SM-1 (gap), hele sjekklisten** | **IKKE bestått, 9 av 12** (7 av 12 hvis grensetilfellet i par 3 regnes som brudd, fordi par 3 K2 og K3 da også feiler) | par 2 K1, par 2 K3 og par 3 K1 |
> | **SM-2, ingen oppdiktede kvalifikasjoner** | **IKKE bestått, 10 av 12** (7 av 12 hvis grensetilfellet i par 3 regnes som brudd) | par 2 K1 og K3 |
> | **SM-3, ingen krav over fasiten** | **IKKE bestått, 11 av 12** | par 3 K1 |
>
> - **Bestått:** toleransen i FR-8 (høyst ett krav under), NFR-4 (høyst 8,8 s), kostnaden (ca. 0,08 kr per full kjøring) og NFR-9 (B4 del 2, bekreftet av Sondre 2026-11-20). NFR-5 er bestått med små feil (avsnitt 4).
> - **Sammenligningen med den gamle prompten** (12 av 12 på alle tre) gjelder den revurderte fasiten for par 3. Der sto «erfaring med fakturaer» i K1. Regnes grensetilfellet som brudd, blir SM-2 og SM-1 11 av 12 også på den gamle prompten.
> - **Rapporten** (`testsett-rapporter/…-182613-…`) er rå utdata, med tomme avkrysningsbokser. Vurderingen står bare her.
> - **Ikke vurdert på nytt:** SM-4 (hører til story 5.1).
> - **Ikke avgjort:** hva avvikene betyr for story 2.4 (avsnitt 5). Ingenting er endret i prompten, fasiten, testdataene eller koden.

**Det som er endret siden kontrollen med temperatur 0** (`ee49c2b`, prompten fra `271edb4`, vurdert i [`vurdering-2-4-kontroll-temperatur-0.md`](vurdering-2-4-kontroll-temperatur-0.md)):
1. **Prompten, PR #27:** instrukser i dataene hoppes over, og en vanlig stillingsannonse har minst ett krav.
2. **Prompten, PR #28:** et eksempel med en annonse med en innplantet melding.
3. **Forespørselen, PR #28:** `store: false` sendes til OpenAI.
4. **Valideringen, PR #27:** `.min(1)` på kravlista i koden. Den er ikke en del av skjemaet modellen får (`gapModellSkjema`), så modellen ser ikke den endringen.
5. **Ellers:** fasiten for par 3 er revurdert. Det påvirker vurderingen, ikke modellens svar.

## 0. Kjøringen

| Felt | Verdi |
|---|---|
| Rapportfil | `testsett-rapporter/2026-11-20-182613-openai-gpt-4.1-mini.md` |
| Commit | `85ab227` (`story-2.4-b4-resultat`). Koden er den samme som i produksjonen ved `b50e34a`, og grenen skiller seg bare med dokumentasjon |
| Arbeidstreet rent og nøkkelen | Ja, og nøkkelen var `kevin-maaling-2-4` fra `.env.local`. Begge deler bekreftet av Claude før kjøringen (`git status` og Kevins bekreftelse). Rapporten viser ingen av delene |
| Modellversjon fra leverandøren | `gpt-4.1-mini-2025-04-14` i alle 12 |
| Kjøringer | 12 (4 par × 3), alle med HTTP 200 og 0 feil. Ingen kjøringer på nytt. En tørrkjøring med `--mock` ga 12 på forhånd |
| Priser | 3,87 kr inn og 15,50 kr ut per million tokens, uten mva. |
| Samlet kostnad | **0,2456 kr**. Det er 0,0205 kr per gap-analyse, mot 0,0185 kr før (ca. +11 %), og ca. 0,08 kr per full kjøring |
| Tokens inn per kall | 3038–3190. Det er nøyaktig **+480 per par** mot kontrollen før (2558–2710), og økningen er det prompten har fått |
| Lengste varighet | 8785 ms (NFR-4: under 30 s) |
| Høyeste output-tokens | 599 (taket er 8000) |

## 1. Kategorier (K1/K2/K3 mot fasiten)

| Par | Fasiten | K1 | K2 | K3 |
|---|---|---|---|---|
| 1 Butikk/bank | O D O D O M | lik | lik | lik |
| 2 IT-support | O D D D M M | lik | lik | lik |
| 3 Regnskap (revurdert) | O O M D D M | **«Gode samarbeidsevner» D ↑** (over fasiten) | **«Strukturert og nøyaktig» M ↓** (ett under) | lik |
| 4 Hotell | O D O D O M | lik | lik | lik |

- Alle kjøringene har 6 krav i annonsens rekkefølge.
- Ingen krav er nedgradert, og ingen belegg er fjernet (FR-9).
- **Kategoriene i par 1, 2 og 4 er like i alle tre kjøringene. I par 3 varierer de**, selv med temperatur 0. I kontrollen før var kategoriene like i alle tre kjøringene for alle parene.
- Ordlyden, beleggene, nøkkelordene og stillingen varierer litt i flere par, som de gjorde før:
  - Par 1 K2 har en treffprosent på 29 % mot 25 %, og «nøyaktig» mangler blant nøkkelordene.
  - Par 1 K3 og par 4 K3 har andre belegg for ett krav.

**Par 3 K1, «Gode samarbeidsevner» = D:** belegget er «Kundeservicemedarbeider (deltid)», og forklaringen er «Du har erfaring som kundeservicemedarbeider, noe som kan tyde på samarbeidsevner, men det er ikke konkret dokumentert». Belegget står i CV-en. Men kategorien er over den revurderte fasiten, og «Mangler er alltid Mangler» brytes. Mot den opprinnelige fasiten (D) hadde den vært lik.

**Par 3, «Erfaring med bokføring og avstemminger» = D (alle):** belegget er i alle kjøringene «Besvarte kundehenvendelser om fakturaer og abonnement». Grunnlaget i fasiten, finansregnskap fra studiet, blir aldri sitert. Kategorien er riktig, men belegget passer dårlig. Slik var det også før.

## 2. SM-2 og FR-27: påstander og CV-ens egne ord

**Forbudte påstander i fasitene:** ingen av dem forekommer i de 12 kjøringene. Alle belegg, forklaringer og råd er kontrollert:
- ingen AFR eller bank (par 1)
- ingen IT-support, helpdesk, kommune, førerkort eller ITIL (par 2)
- ingen Tripletex, Visma, praktisk bokføring eller regnskapsbyrå (par 3)
- ingen Opera, hotell, resepsjon, tysk som flytende eller fullført bachelor (par 4)
- ingen tall som ikke står i CV-en

**Regelen fra 2026-11-19 (runde 5):** tillegger en forklaring eller et råd brukeren en erfaring, ferdighet, egenskap eller et nivå med annonsens ord, uten at CV-en bruker dem, er det N på «Ingen oppdiktede kvalifikasjoner» (SM-2). Unntaket er en egenskap som vises av konkret erfaring som nevnes sammen med den.
- **Par 2 K1 og K3, «Erfaring med brukerstøtte eller kundeservice»:** «CV-teksten viser erfaring **med brukerstøtte** som studentassistent». CV-en har «Hjalp førsteårsstudenter …» og «Holdt to veiledningstimer i uken». Det er samme type setning som var bakgrunnen for regelen. **N.** K2 har det riktig: «… med veiledning, men ikke direkte brukerstøtte».
- **Par 2 K1 og K3, «God forståelse av Windows og Microsoft 365»:** «CV-teksten viser **forståelse av** Windows». «Forståelse» er annonsens ord, og CV-en sier «Windows og Linux (brukt i studiet)». **N.** Det er de samme kjøringene, så tellingen endres ikke. K2 og kontrollen før har det riktig: «erfaring med Windows».
- **Par 3, alle kjøringene:** «Du har erfaring **med fakturaer**», mens CV-en sier «Besvarte kundehenvendelser om fakturaer». «Fakturaer» er CV-ens ord, så regelen slår ikke inn etter ordlyden. Men «erfaring med fakturaer» er videre enn å svare på spørsmål om fakturaer, og setningen står under bokføringskravet. **Grensetilfelle, avklares.** Før sto den bare i K1. K2 og K3 hadde «erfaring med kundehenvendelser om fakturaer». Nå står den i alle tre.
- **Par 3 K1 og K3, «Strukturert og nøyaktig» = D:** «… kan indikere noe av dette». Det er ikke et brudd.

**SM-2: N (10 av 12)**, fordi par 2 K1 og K3 bryter regelen. Hvis grensetilfellet i par 3 regnes som brudd, blir det 7 av 12.

## 2a. Kravene som feilet, ordrett, og om de forekom før PR #28

Lagt til 2026-11-21 for Sondres gjennomgang. Sitatene er kopiert ordrett:
- modellens svar fra rapportene i `testsett-rapporter/` (den nye er `2026-11-20-182613-openai-gpt-4.1-mini.md`, de tidligere står i tabellen under)
- CV-tekstene fra `testdata/par-2-it-support/cv.txt` og `testdata/par-3-regnskap/cv.txt`
- fasiten fra `testdata/par-*/fasit.md`

Linjenummeret er raden i rapporten. K1, K2 og K3 er kjøring 1, 2 og 3 for paret. Ingenting er endret i prompten, fasiten eller koden.

### Kravene som feilet med den nye prompten

| Par og kjøring | Krav | Modellens kategori | Fasiten | Modellens forklaring, ordrett | Det CV-en faktisk har | Feiler |
|---|---|---|---|---|---|---|
| Par 2 K1 (linje 198) | Erfaring med brukerstøtte eller kundeservice | D | D | «CV-teksten viser erfaring med brukerstøtte som studentassistent, men ikke kundeservice.» | «Studentassistent (deltid), Høgskolen i Molde», «Hjalp førsteårsstudenter med oppgaver i introduksjonsfaget i programmering», «Holdt to veiledningstimer i uken» | **SM-2** (og SM-1) |
| Par 2 K3 (linje 248) | Erfaring med brukerstøtte eller kundeservice | D | D | «CV-teksten viser erfaring med brukerstøtte som studentassistent, men ikke direkte kundeservice.» | Samme som over | **SM-2** (og SM-1) |
| Par 2 K1 (linje 197) | God forståelse av Windows og Microsoft 365 | D | D | «CV-teksten viser forståelse av Windows, men nevner ikke Microsoft 365.» | «Operativsystemer: Windows og Linux (brukt i studiet)» | **SM-2** (og SM-1) |
| Par 2 K3 (linje 247) | God forståelse av Windows og Microsoft 365 | D | D | «CV-teksten viser forståelse av Windows, men nevner ikke Microsoft 365.» | Samme som over | **SM-2** (og SM-1) |
| Par 3 K1 (linje 331) | Gode samarbeidsevner | **D** | M | «Du har erfaring som kundeservicemedarbeider, noe som kan tyde på samarbeidsevner, men det er ikke konkret dokumentert.» Belegget er «Kundeservicemedarbeider (deltid)» | «Kundeservicemedarbeider (deltid), Testtelefon AS, Ålesund» (2024–2026). Samarbeid er ikke nevnt | **SM-3** (og SM-1) |

- **Den forbudte påstanden i SM-2** er «CV-teksten viser erfaring med brukerstøtte som studentassistent» i par 2 K1 og K3. CV-en sier ingenting om brukerstøtte, bare om stillingen som studentassistent og hjelp og veiledning til studenter. Fasiten for par 2 sier: «Veiledning av studenter ligner brukerstøtte, men er ikke IT-support». Det er samme type påstand som Kevin og Sondre bestemte 2026-11-19 at bryter SM-2 og FR-27.
- **Par 2 K2** har det riktig: «CV-teksten viser erfaring som studentassistent med veiledning, men ikke direkte brukerstøtte eller kundeservice.» (linje 223) og «CV-teksten viser erfaring med Windows, men ikke med Microsoft 365.» (linje 222).
- **Grensetilfellet, ikke regnet som brudd:** par 3 «Erfaring med bokføring og avstemminger» har «Du har erfaring med fakturaer, men …» i alle tre kjøringene (linje 329, 354 og 379). CV-en har «Besvarte kundehenvendelser om fakturaer og abonnement».
- **Innenfor toleransen, ikke et brudd:** par 3 K2 «Strukturert og nøyaktig» er Mangler (linje 355), ett under fasiten (D).

### Feil av samme type i målingene før PR #28

Alle målingene under er OpenAI `gpt-4.1-mini` med prompten **før** PR #27 og PR #28. Kontrollkallet i runde 3 ble overskrevet av den fulle målingen, så det kan ikke sjekkes (`vurdering-2-4-leverandorvalg-runde-3.md`). Fasiten for par 3 ga «Gode samarbeidsevner» D fram til revurderingen 2026-11-20, så D var ikke et brudd da.

| Feilen | Runde 3 (`2026-11-19-2220-…`, prompten fra `1ad9821`, temperatur 0,2) | Runde 4 (`2026-11-19-223737-…`, `5346bee`, 0,2) | Runde 5 (`2026-11-19-225200-…`, `271edb4`, 0,2) | Kontrollen (`2026-11-19-225914-…`, `271edb4`, 0) |
|---|---|---|---|---|
| **«Brukerstøtte» om studentassistenten** (SM-2 når det står i forklaringen, SM-3 når kategorien er Oppfylt) | Ingen forklaring, men kategorien er **Oppfylt** i K1 og K2, over fasiten (linje 198 og 223) | K1: «Erfaringen er med brukerstøtte i studiet, men ikke spesifikt i kundeservice.» (linje 198). **Det er denne setningen som ga regelen** fra 2026-11-19 | K1: **Oppfylt** uten forklaring, over fasiten (linje 198) | Ikke funnet. K3: «… som er beslektet med brukerstøtte, men ikke direkte brukerstøtte eller kundeservice.» (linje 248). Det er riktig, og runde 4 og 5 har samme ordlyd i K3 (linje 248) |
| **«Forståelse av Windows» (SM-2)** | K1 og K3: «CV-en viser god forståelse av Windows …» og «CV-en dokumenterer god forståelse av Windows …» (linje 197 og 247) | Alle tre: «CV-en dokumenterer god forståelse av Windows, men ikke Microsoft 365.» (linje 197, 222 og 247) | Ikke funnet («erfaring med Windows») | Ikke funnet («erfaring med Windows») |
| **«Gode samarbeidsevner» D med kundeservicejobben som belegg (SM-3 med revurdert fasit)** | Alle tre (linje 331, 356 og 381), for eksempel «Samarbeidsevner er kun indirekte dokumentert gjennom arbeidserfaring, ikke konkret beskrevet.» | K3: «Samarbeidsevner er ikke eksplisitt dokumentert, men kan antas fra arbeidserfaring.» (linje 381) | K2: «… men gode samarbeidsevner er egenvurdering uten konkret dokumentasjon.» (linje 356) | Ikke funnet. Mangler i alle tre |
| **«Erfaring med fakturaer» (grensetilfellet; bare uttrykket «erfaring med fakturaer» telles, ikke «erfaring med kundehenvendelser om fakturaer»)** | Alle tre (linje 329, 354 og 379), for eksempel «CV-en dokumenterer erfaring med fakturaer, men ikke spesifikt bokføring og avstemminger.» | K3 (linje 379) | K2 og K3 (linje 354 og 379) | K1: «Du har erfaring med fakturaer, men det står ikke noe om bokføring eller avstemminger.» (linje 329) |

**Hva tabellen viser:**
- **«Erfaring med fakturaer»** har stått i alle målingene, også i kontrollen. Den ble ikke regnet som brudd i noen av dem.
- **Alle de tre feilene har forekommet før**, med prompter uten eksempelblokken og uten reglene fra PR #27:
  - **Selve setningen om brukerstøtte (SM-2)** sto bare i runde 4 K1. Den ble grunnlaget for regelen om CV-ens egne ord i `271edb4`, og med den prompten forekom den ikke (runde 5 og kontrollen). Med den nye prompten er den tilbake i K1 og K3.
  - **Kategorien Oppfylt for brukerstøtte (SM-3)** forekom i runde 3 og runde 5. Runde 5 hadde **nøyaktig samme prompt som kontrollen** (`271edb4`, bare temperaturen var annerledes).
  - **«Samarbeidsevner» D** forekom i runde 3, 4 og 5 (også i runde 5 K2, med samme prompt som kontrollen). Mistral gjorde det samme i de samme rundene, for eksempel `2026-11-19-2222-mistral-mistral-medium-2604.md` linje 331, 356 og 381. Den gamle fasiten sa «kundeservice gir et utgangspunkt».
- **«Forståelse av Windows»** forekom i runde 3 og 4, før regelen om CV-ens egne ord kom i `271edb4`. Med den regelen forsvant den i runde 5 og i kontrollen. Nå er den tilbake i K1 og K3.
- **Bare kontrollen** (én kjøring med 3 forsøk per par, temperatur 0) var fri for de tre feilene: setningen om brukerstøtte, «forståelse av Windows» og «samarbeidsevner» over fasiten. Grensetilfellet «erfaring med fakturaer» sto der også (K1).
- Tabellen viser altså **ikke** at eksempelblokken fra PR #28 er årsaken. Den viser heller ikke at den ikke er det. Testsettet er ikke kjørt med bare PR #27, så endringene fra PR #27 og PR #28 kan ikke skilles. Avvikene kan også skyldes at en endret prompt gir andre svar med temperatur 0.
- Kevin og Sondre går gjennom avvikene før det gjøres flere endringer (2026-11-21).

## 3. Kriteriene

| Kriterium | Ny prompt (12 kjøringer) | Kontrollen før (T = 0, revurdert fasit) |
|---|---|---|
| **SM-3:** ingen krav over fasiten, og Mangler er alltid Mangler | **N (11 av 12):** par 3 K1 | J (12 av 12) |
| Punktet i sjekklisten «Ingen krav får høyere kategori enn i fasiten, og høyst ett krav ligger under (FR-8)» | **N i par 3 K1**, fordi kravet ligger over. Toleransen «høyst ett under» er J i alle kjøringene (par 3 K2 har ett under) | J |
| **SM-2 og FR-27** | **N (10 av 12):** par 2 K1 og K3. Grensetilfellet i par 3 er ikke regnet med | J |
| **SM-1 (gap):** alle de 8 punktene for gap-analysen i sjekklisten, også de som gjelder alt innhold | **N (9 av 12):** par 2 K1, par 2 K3 og par 3 K1 | J (12 av 12) |
| NFR-4 | J (8,8 s) | J (8,4 s) |
| NFR-5 | J med små feil (avsnitt 4) | J med små feil |
| Kostnad per full kjøring (≤ 1 kr) | J (ca. 0,08 kr) | J (0,07 kr) |
| NFR-9 (B4 del 2, egen test) | J i 1 kall i produksjonen og 2 lokalt. Bekreftet av Sondre 2026-11-20, sammen med at `store: false` virker | **Uavklart.** 16:01 brukte den gamle prompten, men det er ikke kjent om forsøket brukte riktig fil (§ 7a i `kjorebok-2-4-del-b.md`) |

**Konklusjon:**
- Den nye prompten **besto NFR-9-testen** i alle 3 kallene som ble gjort.
- Testsettet gir **dårligere resultater på SM-1–SM-3** enn kontrollen før:
  - ett krav over fasiten (par 3 K1), som er den alvorlige retningen etter PRD-en
  - to kjøringer med annonsens ord om brukeren (par 2 K1 og K3)
  - kategoriene i par 3 varierer
- **Om endringene i prompten er årsaken, er ikke vist.** Det er én kjøring med 3 forsøk per par, og forespørselen har også fått `store: false` (punkt 3 over). Det er lite sannsynlig at den påvirker svaret, men det er ikke utelukket.

## 4. Andre svakheter (ikke brudd)

- **Stillingen i par 4** er «Resepsjonsmedarbeider» i alle kjøringene. Annonsen og kontrollen før har «Resepsjonsmedarbeider – deltid», og prompten sier at ordene skal beholdes. Det er en tilbakegang.
- **Stillingen i par 2 K3** er «It-brukerstøtte», uten «– deltid for student». «It» med liten t er en kjent svakhet.
- **NFR-5:**
  - Par 1 K2 og K3: «nivået … er ikke spesifisert **i annonsen**». Annonsen sier «gode», så setningen er feil om annonsen.
  - Par 2 K1 og K3: «viser **muntlig** kommunikasjonsevner». Det skal være «muntlige».
  - Par 2 K2: rådet «Du bør skaffe eller dokumentere førerkort klasse B hvis du har det» henger ikke sammen.
  - Par 3 K1: «kundebehandling» er verken CV-ens eller annonsens ord.
  - Par 4 K2 og K3: tredje person («Bruker har …», «Brukeren har …»), mens prompten ber om du-form.
- **Nøkkelorddekningen** (SM-4, story 5.1) er ikke vurdert på nytt.

## 5. Det Kevin og Sondre må avgjøre (ingenting er endret)

1. **SM-2:** regelen fra 2026-11-19 er brukt, og den gir 10 av 12 (par 2 K1 og K3). Avgjør om «erfaring med fakturaer» i par 3 også skal regnes som brudd (da blir det 7 av 12).
2. **SM-3, par 3 K1** («Gode samarbeidsevner» = D, over den revurderte fasiten). Mulige veier:
   - **a)** godta det som en kjent svakhet og dokumentere det
   - **b)** rette prompten og måle på nytt (betalt). Det kan for eksempel gjelde at «kan tyde på» uten beslektet erfaring ikke gir D, eller CV-ens egne ord ved Windows og brukerstøtte.
   - **c)** vurdere fasiten på nytt. Det anbefales ikke, siden den nettopp ble revurdert ut fra kildene.
3. **Prompten:** skal endringene fra PR #27 og PR #28 beholdes som de er, siden NFR-9-testen besto? Eller skal de justeres for SM-1–SM-3? En justering krever en ny betalt måling (12 kall) og en ny B4-test.
4. **Story 2.4:**
   - I akseptansekriteriene (`epics.md`, story 2.4) brukes SM-1–SM-3 i valgregelen: Mistral velges hvis den består dem, og ellers OpenAI. Det valget står fast. Det står ikke at OpenAI må bestå SM-1–SM-3.
   - Gruppas egen regel i C5 (`kjorebok-2-4-del-c.md`) er at 2-4 settes til `done` når AK 1–3 er oppfylt og SM-1 er avgjort. **SM-1 var avgjort med 12 av 12 på den gamle prompten. Med den nye prompten er den 9 av 12.** Kevin og Sondre bestemmer om det fortsatt regnes som avgjort.
   - SM-1–SM-3 måles også på den endelige versjonen i story 5.1.
5. **`kevin-maaling-2-4`:** testsettet er kjørt, men vei b) i punkt 2 trenger en ny betalt måling. Avgjør om nøkkelen skal slettes nå eller beholdes for det. Kevin har bestemt (2026-11-20) at den ikke slettes før Sondre har bekreftet at denne rapporten er tilstrekkelig. Deretter sletter Sondre den hos OpenAI, og Kevin sletter Mistral-nøkkelen fra målingen.

**Godkjent av:** Kevin ______ Sondre ______ **Dato:** ______
