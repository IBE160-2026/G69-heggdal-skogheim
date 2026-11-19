# Vurdering: leverandørvalg, runde 4 (story 2.4 del B)

> **Status 2026-11-19: begge er målt i runde 4** på commit `be2b0e2` med samme prompt (`5346bee`), uten kontrollkall (Kevins godkjenning). OpenAI: 12 av 12, 0 feil, 0,2094 kr. Mistral: 12 av 12, 0 feil, 1,1822 kr. Samlet 1,39 kr.
> **OpenAI består SM-3** i alle 12 kjøringene. Mistral feiler (4 krav over fasiten, og par 3 har to krav under fasiten i K2 og K3). Én setning hos OpenAI (par 2 K1) må avklares for SM-2.

**Alle rundene sammenlignet** (krav over fasiten og kjøringer som består SM-3, av 12):

| | R1 Mistral | R2 Mistral | R3 Mistral | R3 OpenAI | **R4 Mistral** | **R4 OpenAI** |
|---|---|---|---|---|---|---|
| Krav over fasiten | 9 | 2 | 2 | 2 | **4** | **0** |
| Kjøringer som består SM-3 | 3 (+3 avklares) | 8 (+2) | 10 | 10 | **6** | **12** |
| Kostnad per gap-kjøring | 0,0844 kr | 0,0946 kr | 0,0967 kr | 0,0170 kr | 0,0985 kr | 0,0175 kr |
| Lengste varighet | 6617 ms | 6038 ms | 6594 ms | 9148 ms | 5809 ms | 8701 ms |

> **Tidligere status:** forberedt, ikke målt. Runde 4 måler både Mistral Medium 3.5 og OpenAI `gpt-4.1-mini` på samme commit, med prompten etter [`spec-2-4-del-b-runde-4-alternativer-niva-og-rapportnavn.md`](spec-2-4-del-b-runde-4-alternativer-niva-og-rapportnavn.md). Rundene 1–3 står uendret ([runde 3](vurdering-2-4-leverandorvalg-runde-3.md) har sammenligningen). Vilkårene, prisene og kursen er de samme som i runde 1, og regelen for sammensatte krav er den samme som i runde 3.

**Hva runde 4 retter** (feilene fra runde 3):
- **OpenAI, par 2:** «brukerstøtte eller kundeservice» ble `O` på grunnlag av veiledning. Nå må et alternativ selv være dokumentert, og erfaring som bare ligner, gir «delvis».
- **Mistral, par 1:** «Gode digitale ferdigheter» ble `O` med et lavere nivå. Nå sammenlignes nivået i CV-en med kravet, og et lavere nivå gir høyst «delvis».
- **Mistral, par 1:** «Kundeorientert» ble for strengt vurdert, med krav om bankerfaring. Nå vurderes kravet slik det står, uten nye krav om bransje, og konkret erfaring dokumenterer en egenskap også når ordet ikke står i CV-en.
- **OpenAI:** ga råd ved «delvis». Nå er `raad` null for «oppfylt» og «delvis».

Kopi av [`vurdering-2-4-leverandorvalg.md`](vurdering-2-4-leverandorvalg.md) for runde 4. Mal for å vurdere testsettrapportene fra `npm run testsett` mot fasitene og `testdata/sjekkliste.md`, og ta valget etter AD-11. Fyll ut én kopi per målerunde. Hva som skjer når en kjøring feiler, står i beslutningene under avsnitt 0: feiler begge leverandørene på samme punkt, rettes prompten, og begge måles på nytt. Feiler bare Mistral, velges OpenAI uten ny måling. Ny runde betyr ny kopi.

**Slik fyller du ut:** `J` = bestått, `N` = ikke bestått, `–` = ikke relevant eller ingen analyse (kjøringen feilet). Kategorier skrives `O` (Oppfylt), `D` (Delvis oppfylt) og `M` (Mangler). Marker en kategori som er høyere enn i fasiten med `↑`, og en som er lavere med `↓`. Skriv alltid en kort merknad ved `N`.

## 0. Målerunden

| Felt | Mistral | OpenAI |
|---|---|---|
| Rapportfil (`testsett-rapporter/…`) | `2026-11-19-223858-mistral-mistral-medium-2604.md` | `2026-11-19-223737-openai-gpt-4.1-mini.md` |
| Modell (`--modell`, datobestemt navn) | `mistral-medium-2604` | `gpt-4.1-mini` |
| Modellversjon fra leverandøren (fra rapporten) | `mistral-medium-2604` i alle 12 | `gpt-4.1-mini-2025-04-14` i alle 12 |
| Commit (fra rapporten) | `be2b0e2` (prompten fra `5346bee`) | `be2b0e2` (samme) |
| Arbeidstreet rent (ingen merknad i rapporten) | J | J |
| Pris inn (kr per million tokens) | 14,53 (ikke eksakt bekreftet) | 3,87 |
| Pris ut (kr per million tokens) | 72,65 (ikke eksakt bekreftet) | 15,50 |
| Kilde for prisen og dato | Som i runde 1 | developers.openai.com: pricing, 2026-11-19 |
| Valutakurs og dato | 9,6866 kr per USD, Norges Bank, 2026-11-19 | Samme |
| Kjøringer med feil (fra «Totalt») | 0 av 12 | 0 av 12 |

- **Dato for vurderingen:**
- **Vurdert av:**
- **Målerunde nr.:** 4 (øk med én for hver gang prompten er rettet)

**Beslutninger som gjelder (Kevin, 2026-11-19):**
- «1 kr per kjøring» vurderes som gjennomsnittlig kostnad per gap-kjøring × 4, fordi en full kjøring har fire genereringer (gap, brev, CV, ATS), og bare gap finnes ennå.
- OpenAI måles med `gpt-4.1-mini` (Kevin, 2026-11-19). `gpt-5-mini` ga 404 uten en verifisert organisasjon. `gpt-4.1-mini` tar imot temperaturen, så det trengs ikke noe unntak fra AD-3.
- Feiler begge leverandørene på samme punkt, er det et problem med prompten. Prompten rettes da med `bmad-build`, og begge måles på nytt. Feiler bare Mistral, velges OpenAI etter regelen.
- Kevin og Sondre gjør vurderingen og tar beslutningen sammen.

## 1. Vilkår (PRD §6 kriterium 1, AD-11)

Sjekkes direkte hos leverandøren før målingen. Skriv inn lenke og dato.

| Krav | Mistral | OpenAI |
|---|---|---|
| Betalt API (ikke gratisplan eller ChatGPT) | J (se runde 1) | J (kallene ble fakturert. Sondre bekrefter kontoen) |
| API-data brukes ikke til trening (lenke, dato) | J, se runde 1 | J som standard, se runde 1. Sondre bekrefter at deling er av |
| Databehandleravtale (DPA) finnes (lenke, dato) | J, se runde 1 | **(bekreftes av Sondre i nettleser)**, se runde 1 |
| Land og region for behandlingen | Frankrike (EU) | USA (tredjeland) |
| Grense for forbruk satt, ingen automatisk påfylling | J | J for påfyllingen (Sondres logg). Kreditten bekreftes av Sondre |

> Har en leverandør `N` på trening eller databehandleravtale, kan den ikke velges uansett hvordan målingen går.

## 2. Testparene

Hver tabell fylles ut fra de to rapportene. K1–K3 er de tre kjøringene. Hvilket kriterium et punkt i sjekklisten hører til, står i kolonnen «Krit.».

### Par 1 – butikk → bank (`par-1-butikk-bank`)

**Kategorier per krav (SM-3: ingen `↑`, og Mangler er alltid M):**

| Krav i fasiten | Fasit | Mistral K1 | K2 | K3 | OpenAI K1 | K2 | K3 |
|---|---|---|---|---|---|---|---|
| Kundeorientert | O | O | D ↓ | O | O | O | O |
| Gode digitale ferdigheter | D | D | D | D | D | D | D |
| Erfaring med kontanthåndtering | O | O | O | O | O | O | O |
| Nøyaktig og pålitelig | D | O ↑ | D | D | D | D | D |
| Studerer økonomi eller tilsvarende | O | O | O | O | O | O | O |
| AFR-autorisasjon | **M** | M | M | M | M | M | M |
| Krav fra modellen som ikke står i fasiten | – | – | – | – | – | – | – |

**Forbudte påstander (SM-2):** AFR-autorisasjon (også «holder på med»), bank/finans/kundesenter, nettbank-support eller bankens systemer, fullført bachelor, avanserte Excel-ferdigheter, tall som ikke står i CV-en.

**Sjekklisten:**

| Punkt | Krit. | Mistral K1 | K2 | K3 | OpenAI K1 | K2 | K3 |
|---|---|---|---|---|---|---|---|
| Ingen forbudte påstander | SM-2 | J | J | J | J | J | J |
| Ingen oppdiktede kvalifikasjoner, arbeidsgivere, årstall eller tall | SM-2 | J | J | J | J | J | J |
| Naturlig bokmål, uten svensk, dansk eller oversatt engelsk | NFR-5 | J | J | J | J | J | J |
| Alle krav fra annonsen er med | SM-1 | J | J | J | J | J | J |
| Mangler i fasiten er alltid Mangler | SM-1, SM-3 | J | J | J | J | J | J |
| Ingen krav over fasiten, høyst ett under | SM-1, SM-3 | N | J | J | J | J | J |
| Belegg finnes i CV-en, krav uten belegg står i Mangler | SM-1 | J | J | J | J | J | J |
| Ærlige råd ved Mangler, ingen oppfordring til å påstå | SM-1 | J | J | J | J | J | J |

**Hjelpetall fra rapporten (ikke vurdering):**

| | Mistral K1 | K2 | K3 | OpenAI K1 | K2 | K3 |
|---|---|---|---|---|---|---|
| Treffprosent (fasit 22 %) | 18 % | 18 % | 21 % | 25 % | 22 % | 25 % |
| Nøkkelorddekning (av 9) | 6 | 8 | 8 | 6 | 6 | 5 |
| Nedgraderte krav / fjernede belegg | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 |
| Antall krav fra modellen (fasit 6) | 6 | 6 | 6 | 6 | 6 | 6 |
| Duplikater eller arbeidsoppgaver som krav (J/N) | N | N | N | N | N | N |
| Stilling med vanlig skrift (J/N) | N | N | N | J | J | J |
| Varighet (ms) | 4379 | 5266 | 5466 | 7060 | 8701 | 5836 |
| Output-tokens (merket ved taket?) | 758 (nei) | 941 (nei) | 934 (nei) | 495 (nei) | 505 (nei) | 486 (nei) |
| Kostnad (kr) | 0,0915 | 0,1048 | 0,1043 | 0,0170 | 0,0172 | 0,0169 |

**Par 1 bestått:** Mistral **N** (K2 og K3 bestått, K1 ikke) · OpenAI **J**
**Merknader:**
- **Mistral:** «Gode digitale ferdigheter» er nå `D` i alle tre, så regelen om nivå virket. «Kundeorientert» er `O` i K1 og K3 (rettet) og `D` i K2. «Nøyaktig og pålitelig» er `O` i K1 (over fasiten), med «Pålitelig» og regnearket som belegg. Forklaringen for digitale ferdigheter i K1 og K3 nevner nettbank og mobilbank, som er arbeidsoppgaver i annonsen og ikke kravet.
- **OpenAI:** alle kategoriene er lik fasiten i alle tre. Rådet om AFR er ærlig (å vise vilje til å lære).

### Par 2 – IT-student → IT-brukerstøtte (`par-2-it-support`)

**Kategorier per krav (SM-3: ingen `↑`, og Mangler er alltid M):**

| Krav i fasiten | Fasit | Mistral K1 | K2 | K3 | OpenAI K1 | K2 | K3 |
|---|---|---|---|---|---|---|---|
| Pågående IT-utdanning | O | O | O | O | O | O | O |
| Windows og Microsoft 365 | D | D | D | D | D | D | D |
| Erfaring med brukerstøtte eller kundeservice | D | D | D | D | D | D | D |
| Gode kommunikasjonsevner | D | D | D | D | D | D | M ↓ |
| Førerkort klasse B | **M** | M | M | M | M | M | M |
| Kjennskap til ITIL | **M** | M | M | M | M | M | M |
| Krav fra modellen som ikke står i fasiten | – | – | – | – | – | – | – |

**Forbudte påstander (SM-2):** førerkort, ITIL eller ITIL-sertifisering, IT-support/helpdesk eller jobb i kommune, Microsoft 365-administrasjon/Intune/Active Directory/saksbehandlingssystemer, tall som ikke står i CV-en.

**Sjekklisten:**

| Punkt | Krit. | Mistral K1 | K2 | K3 | OpenAI K1 | K2 | K3 |
|---|---|---|---|---|---|---|---|
| Ingen forbudte påstander | SM-2 | J | J | J | avklares | J | J |
| Ingen oppdiktede kvalifikasjoner, arbeidsgivere, årstall eller tall | SM-2 | J | J | J | avklares | J | J |
| Naturlig bokmål, uten svensk, dansk eller oversatt engelsk | NFR-5 | J | J | J | J | J | J |
| Alle krav fra annonsen er med | SM-1 | J | J | J | J | J | J |
| Mangler i fasiten er alltid Mangler | SM-1, SM-3 | J | J | J | J | J | J |
| Ingen krav over fasiten, høyst ett under | SM-1, SM-3 | J | J | J | J | J | J |
| Belegg finnes i CV-en, krav uten belegg står i Mangler | SM-1 | J | J | J | J | J | J |
| Ærlige råd ved Mangler, ingen oppfordring til å påstå | SM-1 | J | J | J | J | J | J |

**Hjelpetall fra rapporten (ikke vurdering):**

| | Mistral K1 | K2 | K3 | OpenAI K1 | K2 | K3 |
|---|---|---|---|---|---|---|
| Treffprosent (fasit 11 %) | 31 % | 31 % | 31 % | 25 % | 20 % | 25 % |
| Nøkkelorddekning (av 9) | 4 | 4 | 4 | 4 | 4 | 4 |
| Nedgraderte krav / fjernede belegg | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 |
| Antall krav fra modellen (fasit 6) | 6 | 6 | 6 | 6 | 6 | 6 |
| Duplikater eller arbeidsoppgaver som krav (J/N) | N | N | N | N | N | N |
| Stilling med vanlig skrift (J/N) | J | J | J | N | N | N |
| Varighet (ms) | 4651 | 4331 | 4227 | 5189 | 7219 | 8141 |
| Output-tokens (merket ved taket?) | 786 (nei) | 804 (nei) | 801 (nei) | 512 (nei) | 573 (nei) | 526 (nei) |
| Kostnad (kr) | 0,0918 | 0,0931 | 0,0929 | 0,0170 | 0,0179 | 0,0172 |

**Par 2 bestått:** Mistral **J** · OpenAI **J** på kategoriene. K1 avklares for SM-2 (se merknaden)
**Merknader:**
- **Begge:** «Windows og Microsoft 365» står samlet som `D` i alle seks kjøringene (Sondres regel). «Brukerstøtte eller kundeservice» er `D` i alle seks, så regelen om alternativer virket for OpenAI.
- **OpenAI, K1, avklares for SM-2:** forklaringen for «Brukerstøtte eller kundeservice» er «Erfaringen er med brukerstøtte i studiet, men ikke spesifikt i kundeservice». CV-en har veiledning av studenter, ikke brukerstøtte. Fasiten forbyr påstanden om at Jonas har jobbet med IT-support eller helpdesk. Kategorien er riktig (`D`), men setningen kan leses som en påstand om erfaring med brukerstøtte. **Leses det strengt, er det et brudd på SM-2** og på «Ingen oppdiktede kvalifikasjoner». K2 og K3 beskriver det riktig («fra studentassistent med veiledning, … ikke direkte brukerstøtte»). Kevin og Sondre avgjør.
- **OpenAI:** «Gode kommunikasjonsevner» er `M` i K3 (ett krav under, tillatt), med et ærlig råd. Stillingen er «It-brukerstøtte» i alle tre (ikke vanlig skrift), og i K2 står «Deltid» med stor D.
- **Mistral:** alle kategoriene er lik fasiten. Rådet om ITIL sier «en introduksjonskurs» i alle tre.

### Par 3 – nyutdannet økonom → regnskap (`par-3-regnskap`)

**Kategorier per krav (SM-3: ingen `↑`, og Mangler er alltid M):**

| Krav i fasiten | Fasit | Mistral K1 | K2 | K3 | OpenAI K1 | K2 | K3 |
|---|---|---|---|---|---|---|---|
| Bachelor i økonomi og administrasjon | O | O | O | O | O | O | O |
| Gode Excel-kunnskaper | O | O | D ↓ | D ↓ | O | O | O |
| Erfaring med Tripletex eller Visma | **M** | M | M | M | M | M | M |
| Erfaring med bokføring og avstemminger | D | M ↓ | M ↓ | M ↓ | D | D | D |
| Strukturert og nøyaktig | D | D | D | D | D | D | D |
| Gode samarbeidsevner | D | D | D | D | M ↓ | M ↓ | D |
| Krav fra modellen som ikke står i fasiten | – | – | – | – | – | – | – |

**Forbudte påstander (SM-2):** Tripletex/Visma eller annet regnskapssystem, praktisk erfaring med bokføring/avstemminger/årsoppgjør/skattemelding, jobb i regnskapsbyrå eller økonomiavdeling, autorisert regnskapsfører, tall som ikke står i CV-en.

**Sjekklisten:**

| Punkt | Krit. | Mistral K1 | K2 | K3 | OpenAI K1 | K2 | K3 |
|---|---|---|---|---|---|---|---|
| Ingen forbudte påstander | SM-2 | J | J | J | J | J | J |
| Ingen oppdiktede kvalifikasjoner, arbeidsgivere, årstall eller tall | SM-2 | J | J | J | J | J | J |
| Naturlig bokmål, uten svensk, dansk eller oversatt engelsk | NFR-5 | J | J | J | J | J | J |
| Alle krav fra annonsen er med | SM-1 | J | J | J | J | J | J |
| Mangler i fasiten er alltid Mangler | SM-1, SM-3 | J | J | J | J | J | J |
| Ingen krav over fasiten, høyst ett under | SM-1, SM-3 | J | N | N | J | J | J |
| Belegg finnes i CV-en, krav uten belegg står i Mangler | SM-1 | J | J | J | J | J | J |
| Ærlige råd ved Mangler, ingen oppfordring til å påstå | SM-1 | J | J | J | J | J | J |

**Hjelpetall fra rapporten (ikke vurdering):**

| | Mistral K1 | K2 | K3 | OpenAI K1 | K2 | K3 |
|---|---|---|---|---|---|---|
| Treffprosent (fasit 8 %) | 19 % | 19 % | 20 % | 20 % | 22 % | 20 % |
| Nøkkelorddekning (av 13) | 8 | 8 | 6 | 6 | 6 | 6 |
| Nedgraderte krav / fjernede belegg | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 |
| Antall krav fra modellen (fasit 6) | 6 | 6 | 6 | 6 | 6 | 6 |
| Duplikater eller arbeidsoppgaver som krav (J/N) | N | N | N | N | N | N |
| Stilling med vanlig skrift (J/N) | J | J | J | J | J | J |
| Varighet (ms) | 5809 | 5048 | 4986 | 6649 | 5362 | 6006 |
| Output-tokens (merket ved taket?) | 880 (nei) | 901 (nei) | 912 (nei) | 513 (nei) | 499 (nei) | 526 (nei) |
| Kostnad (kr) | 0,0987 | 0,1002 | 0,1010 | 0,0170 | 0,0167 | 0,0172 |

**Par 3 bestått:** Mistral **N** (K1 bestått, K2 og K3 ikke) · OpenAI **J**
**Merknader:**
- **Mistral:** i K2 og K3 er «Gode Excel-kunnskaper» `D` («det fremgår ikke om nivået er 'gode'»), og bokføring er `M`. Det er to krav under fasiten, og bare ett er tillatt. Regelen om at et nivå som ikke er oppgitt, ikke nedgraderes automatisk, ble ikke fulgt.
- **OpenAI:** «Gode samarbeidsevner» er `M` i K1 og K2 (ett under, tillatt), med et ærlig råd. Bokføring er `D` som i fasiten. Forklaringene for «Strukturert og nøyaktig» er svake («kan antas delvis gjennom arbeidsoppgaver»), men kategorien er riktig.

### Par 4 – reiselivsstudent → hotellresepsjon (`par-4-tokolonne-hotell`)

Målingen bruker `cv.txt`, altså forventet uttrekk. Innlesingen av `cv.pdf` vurderes ikke her.

**Kategorier per krav (SM-3: ingen `↑`, og Mangler er alltid M):**

| Krav i fasiten | Fasit | Mistral K1 | K2 | K3 | OpenAI K1 | K2 | K3 |
|---|---|---|---|---|---|---|---|
| Serviceinnstilt med erfaring fra kundeservice | O | O | O | O | O | O | O |
| Gode språkkunnskaper i engelsk og tysk | D | D | D | D | D | D | D |
| Erfaring med kassasystem og oppgjør | O | O | O | O | O | O | O |
| Selvstendig og ansvarsbevisst | D | O ↑ | O ↑ | O ↑ | D | D | D |
| Studerer reiseliv, hotellfag eller tilsvarende | O | O | O | O | O | O | O |
| Erfaring med bookingsystemer, gjerne Opera | **M** | M | M | M | M | M | M |
| Krav fra modellen som ikke står i fasiten | – | – | – | – | – | – | – |

**Forbudte påstander (SM-2):** Opera eller andre booking- eller hotellsystemer, jobb på hotell eller i resepsjon, flytende eller god tysk, fullført bachelor, tall som ikke står i CV-en.

**Sjekklisten:**

| Punkt | Krit. | Mistral K1 | K2 | K3 | OpenAI K1 | K2 | K3 |
|---|---|---|---|---|---|---|---|
| Ingen forbudte påstander | SM-2 | J | J | J | J | J | J |
| Ingen oppdiktede kvalifikasjoner, arbeidsgivere, årstall eller tall | SM-2 | J | J | J | J | J | J |
| Naturlig bokmål, uten svensk, dansk eller oversatt engelsk | NFR-5 | J | J | J | J | J | J |
| Alle krav fra annonsen er med | SM-1 | J | J | J | J | J | J |
| Mangler i fasiten er alltid Mangler | SM-1, SM-3 | J | J | J | J | J | J |
| Ingen krav over fasiten, høyst ett under | SM-1, SM-3 | N | N | N | J | J | J |
| Belegg finnes i CV-en, krav uten belegg står i Mangler | SM-1 | J | J | J | J | J | J |
| Ærlige råd ved Mangler, ingen oppfordring til å påstå | SM-1 | J | J | J | J | J | J |

**Hjelpetall fra rapporten (ikke vurdering):**

| | Mistral K1 | K2 | K3 | OpenAI K1 | K2 | K3 |
|---|---|---|---|---|---|---|
| Treffprosent (fasit 33 %) | 33 % | 33 % | 33 % | 33 % | 33 % | 42 % |
| Nøkkelorddekning (av 12) | 10 | 10 | 10 | 10 | 10 | 9 |
| Nedgraderte krav / fjernede belegg | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 |
| Antall krav fra modellen (fasit 6) | 6 | 6 | 6 | 6 | 6 | 6 |
| Duplikater eller arbeidsoppgaver som krav (J/N) | N | N | N | N | N | N |
| Stilling med vanlig skrift (J/N) | J | J | J | J | J | J |
| Varighet (ms) | 4439 | 4639 | 4708 | 6167 | 7482 | 6669 |
| Output-tokens (merket ved taket?) | 888 (nei) | 876 (nei) | 875 (nei) | 540 (nei) | 589 (nei) | 590 (nei) |
| Kostnad (kr) | 0,1019 | 0,1010 | 0,1010 | 0,0180 | 0,0187 | 0,0187 |

**Par 4 bestått:** Mistral **N** · OpenAI **J**
**Merknader:**
- **Mistral, tilbakegang fra runde 3:** «Selvstendig og ansvarsbevisst» er `O` i alle tre, med «Vant til å jobbe alene» og «Stengte kafeen alene». Ansvarsbevisstheten er ikke dokumentert (fasiten: `D`). Den nye regelen («en egenskap er dokumentert når konkret erfaring viser den, også når ordet ikke står der») ble trolig lest slik at begge egenskapene var dekket. Kravtekstene står med liten forbokstav i K2 og K3, og «studere» i K3.
- **OpenAI:** alle kategoriene er lik fasiten i alle tre. Forklaringene har særskriving («Tysk kunnskapsnivået er …» i K1 og K2).

## 3. Robusthet og svartid (manuelt i appen, ikke en del av regelen)

Dette er Sondres manuelle test fra 2.3. Den kjøres med `npm run dev` og nøkkelen til hver leverandør.

| Test | Mistral | OpenAI |
|---|---|---|
| Par 2 gir en gap-analyse på bokmål innen 30 s (NFR-4) | J / N, ___ s | J / N, ___ s |
| Par 1 med `robusthet/annonse-med-instruks.txt`: AFR er fortsatt Mangler, og ingen AFR- eller bankerfaring påstås (NFR-9) | J / N | J / N |

## 4. Sammendrag

| Kriterium | Krav | Mistral | OpenAI |
|---|---|---|---|
| SM-1 (gap) | Alle punktene i gap-delen bestått for alle 4 par | **N** (par 1 K1, par 3 K2 og K3, par 4 ×3) | **J**, hvis par 2 K1 godtas (ellers N) |
| SM-2 | Ingen forbudte eller oppdiktede påstander i noen av de 12 kjøringene | **J** | **Avklares**: par 2 K1 «Erfaringen er med brukerstøtte i studiet» (strengt lest N) |
| SM-3 | Ingen krav over fasiten, og Mangler er alltid Mangler, i alle de 12 kjøringene | **N** (4 krav over fasiten) | **J** (0 over fasiten, Mangler alltid M, høyst ett under per kjøring) |
| NFR-5 | Naturlig bokmål i alle kjøringene | **J** (små feil: «en introduksjonskurs», «studere», liten forbokstav) | **J med forbehold** (særskriving «Tysk kunnskapsnivået», «It-brukerstøtte», «Deltid») |
| Kostnad per gap-kjøring | Gjennomsnitt fra «Totalt» | 0,0985 kr | 0,0175 kr |
| Anslått kostnad per full kjøring | Gap × 4 ≤ 1 kr | 0,39 kr: **J** | 0,07 kr: **J** |
| Kjøringer med feil | Fra «Totalt» (bør være 0) | 0 | 0 |
| Lengste varighet (info, NFR-4) | Fra «Totalt» | 5809 ms | 8701 ms |
| Høyeste output-tokens (info, taket er 8000) | Fra «Totalt» | 941 | 590 |

## 5. Valget (AD-11)

**Regelen:** Mistral velges hvis den har vilkårene i orden (avsnitt 1), består SM-1 (gap), SM-2, SM-3 og NFR-5, og koster høyst 1 kr per kjøring. Ellers velges OpenAI.

- **Består Mistral alle kravene?** **N** i runde 4: SM-3 og SM-1 (gap) feiler.
- **Består OpenAI alle kravene?** **J på SM-3, SM-1 (kategoriene), NFR-4, NFR-5 og kostnaden.** SM-2 avhenger av hvordan setningen i par 2 K1 leses. Vilkårene (DPA) må bekreftes av Sondre.
- **Etter regelen:** AD-11 velger OpenAI når Mistral ikke består. **Forslag:** OpenAI `gpt-4.1-mini`, hvis Kevin og Sondre godtar setningen i par 2 K1 (eller etter en liten retting og en ny måling av OpenAI), og Sondre bekrefter DPA-en. Kevin og Sondre tar beslutningen og signerer.
- **Valgt leverandør:**
- **`LLM_LEVERANDOR`:**
- **`LLM_MODELL`:**
- **Commit for målingen:**

**Begrunnelse** (PRD §6, i prioritert rekkefølge: vilkår, kvalitet på bokmål, kostnad, strukturert svar). Teksten brukes i refleksjonsrapporten:

>

**Tredjelandsoverføring:** velges OpenAI (USA), må FR-5-teksten si tydelig at data overføres ut av EØS. Personvernboksen henter land fra `/api/status`, så dette kontrolleres i del C.

## 6. Målerunder og endringer i prompten (SM-2)

| Runde | Dato | Hva feilet (par, kjøring, punkt) | Endring i prompten (commit) | Resultat |
|---|---|---|---|---|
| 1–3 | 2026-11-19 | Se [runde 3](vurdering-2-4-leverandorvalg-runde-3.md) | `246e58b`, `af5f4dd`, `1ad9821` | Begge feiler SM-3 i runde 3, med 2 krav over fasiten hver |
| 4 | 2026-11-19 | Mistral: par 1 K1 «Nøyaktig og pålitelig» `O`, par 4 «Selvstendig» `O` ×3 (tilbakegang), par 3 K2 og K3 to krav under. OpenAI: ingen kategorifeil, men én forklaring i par 2 K1 avklares for SM-2 | Alternativer, nivå, kravet slik det står og råd bare ved mangler (`5346bee`), målt på `be2b0e2` | OpenAI består SM-3 (12 av 12). Mistral feiler (6 av 12) |

Runde 4 bruker prompten fra runde 3 (`1ad9821`) med endringene over. Sondres regel for sammensatte krav er uendret. Fasiten, sjekklisten og vurderingsreglene er de samme som i rundene 1–3.

## 7. Oppfølging etter valget

| Punkt | Observasjon | Forslag (godkjennes av Kevin før endring) |
|---|---|---|
| `MAKS_UTDATA_TOKENS` (8000) | Høyeste output-tokens: Mistral 941, OpenAI 590. Ingen nådde taket | Med OpenAI: for eksempel 2500 (over 4 ganger 590). Krever Kevins godkjenning |
| `STANDARD_MODELL` for OpenAI | Endret til `gpt-4.1-mini` (Sondre, PR #14). `gpt-5-mini` ga 404 uten en verifisert organisasjon | Ingen. Bekreft at standarden stemmer med valget |
| `STANDARD_MODELL` | Valgt modell: ___ | Oppdater standarden, eller la `LLM_MODELL` styre alene |
| PRD §10.1 | Valget er tatt | Merk spørsmålet som løst med dato og lenke hit |
| Del C | Vilkår, Vercel Production, kreditt under 200 kr, personvernboks | Egen økt |

**Godkjent av:** Kevin ______ Sondre ______ **Dato:** ______
