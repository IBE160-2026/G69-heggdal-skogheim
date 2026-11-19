# Vurdering: leverandørvalg, runde 5 (story 2.4 del B)

> **Status 2026-11-19: begge er målt i runde 5** på commit `2e92de3` med samme prompt (`271edb4`), uten kontrollkall. OpenAI: 12 av 12, 0 feil, 0,2223 kr. Mistral: 12 av 12, 0 feil, 1,2293 kr. Samlet 1,45 kr.
> **Regelen om CV-ens egne ord virket for begge:** ingen forklaringer eller råd tillegger brukeren annonsens begreper uten dekning, så SM-2 er `J` for begge. **Ingen består SM-3:** OpenAI består 10 av 12, Mistral 8 av 12.

**Rundene 3–5 sammenlignet** (krav over fasiten og kjøringer som består SM-3, av 12):

| | R3 Mistral | R3 OpenAI | R4 Mistral | R4 OpenAI | **R5 Mistral** | **R5 OpenAI** |
|---|---|---|---|---|---|---|
| Krav over fasiten | 2 | 2 | 4 | 0 | **3** | **1** |
| Kjøringer med to krav under fasiten | 0 | 0 | 2 | 0 | **1** | **1** |
| Kjøringer som består SM-3 | 10 | 10 | 6 | 12 | **8** | **10** |
| SM-2 (fasit + FR-27) | J | J | J | N (1 setning) | **J** | **J** |
| Kostnad per gap-kjøring | 0,0967 kr | 0,0170 kr | 0,0985 kr | 0,0175 kr | 0,1024 kr | 0,0185 kr |

**Summen for rundene 3–5:** OpenAI består 32 av 36 kjøringer, med 3 krav over fasiten. Mistral består 24 av 36, med 9 krav over fasiten.

> **Tidligere status:** forberedt, ikke målt. Runde 5 måler både OpenAI `gpt-4.1-mini` og Mistral Medium 3.5 på samme commit, med prompten etter [`spec-2-4-del-b-runde-5-cv-ens-egne-ord.md`](spec-2-4-del-b-runde-5-cv-ens-egne-ord.md). Rundene 1–4 står uendret ([runde 4](vurdering-2-4-leverandorvalg-runde-4.md) har sammenligningen av alle rundene). Vilkårene, prisene, kursen og regelen for sammensatte krav er de samme som før.

**Hvorfor runde 5:** Kevin og Sondre bestemte 2026-11-19 at forklaringen i runde 4, par 2 K1 («Erfaringen er med brukerstøtte i studiet», CV-en har veiledning) bryter SM-2 og FR-27. Prompten har fått en generell regel: det brukeren har, beskrives med CV-ens egne ord, ikke med annonsens betegnelser eller nivåord.

**Slik vurderes regelen i runde 5 (gjelder begge leverandørene):** les hver `forklaring` og hvert `raad`. Tillegger en setning brukeren en erfaring, ferdighet, egenskap eller et nivå med annonsens ord uten at CV-en bruker dem, gir det `N` på «Ingen oppdiktede kvalifikasjoner» (SM-2). Unntakene er:
- en egenskap nevnt sammen med den konkrete erfaringen som viser den
- det som mangler, nevnt med annonsens ord
- en oversettelse fra et annet språk

I runde 4 ville også «CV-en dokumenterer god forståelse av Windows» (OpenAI, par 2, alle tre) falt under regelen.

Kopi av [`vurdering-2-4-leverandorvalg.md`](vurdering-2-4-leverandorvalg.md) for runde 5. Mal for å vurdere testsettrapportene fra `npm run testsett` mot fasitene og `testdata/sjekkliste.md`, og ta valget etter AD-11. Fyll ut én kopi per målerunde. Hva som skjer når en kjøring feiler, står i beslutningene under avsnitt 0: feiler begge leverandørene på samme punkt, rettes prompten, og begge måles på nytt. Feiler bare Mistral, velges OpenAI uten ny måling. Ny runde betyr ny kopi.

**Slik fyller du ut:** `J` = bestått, `N` = ikke bestått, `–` = ikke relevant eller ingen analyse (kjøringen feilet). Kategorier skrives `O` (Oppfylt), `D` (Delvis oppfylt) og `M` (Mangler). Marker en kategori som er høyere enn i fasiten med `↑`, og en som er lavere med `↓`. Skriv alltid en kort merknad ved `N`.

## 0. Målerunden

| Felt | Mistral | OpenAI |
|---|---|---|
| Rapportfil (`testsett-rapporter/…`) | `2026-11-19-225329-mistral-mistral-medium-2604.md` | `2026-11-19-225200-openai-gpt-4.1-mini.md` |
| Modell (`--modell`, datobestemt navn) | `mistral-medium-2604` | `gpt-4.1-mini` |
| Modellversjon fra leverandøren (fra rapporten) | `mistral-medium-2604` i alle 12 | `gpt-4.1-mini-2025-04-14` i alle 12 |
| Commit (fra rapporten) | `2e92de3` (prompten fra `271edb4`) | `2e92de3` (samme) |
| Arbeidstreet rent (ingen merknad i rapporten) | J | J |
| Pris inn (kr per million tokens) | 14,53 (ikke eksakt bekreftet) | 3,87 |
| Pris ut (kr per million tokens) | 72,65 (ikke eksakt bekreftet) | 15,50 |
| Kilde for prisen og dato | Som i runde 1 | developers.openai.com: pricing, 2026-11-19 |
| Valutakurs og dato | 9,6866 kr per USD, Norges Bank, 2026-11-19 | Samme |
| Kjøringer med feil (fra «Totalt») | 0 av 12 | 0 av 12 |

- **Dato for vurderingen:**
- **Vurdert av:**
- **Målerunde nr.:** 5 (øk med én for hver gang prompten er rettet)

**Beslutninger som gjelder (Kevin, 2026-11-19):**
- «1 kr per kjøring» vurderes som gjennomsnittlig kostnad per gap-kjøring × 4, fordi en full kjøring har fire genereringer (gap, brev, CV, ATS), og bare gap finnes ennå.
- OpenAI måles med `gpt-4.1-mini` (Kevin, 2026-11-19). `gpt-5-mini` ga 404 uten en verifisert organisasjon. `gpt-4.1-mini` tar imot temperaturen, så det trengs ikke noe unntak fra AD-3.
- Feiler begge leverandørene på samme punkt, er det et problem med prompten. Prompten rettes da med `bmad-build`, og begge måles på nytt. Feiler bare Mistral, velges OpenAI etter regelen.
- Kevin og Sondre gjør vurderingen og tar beslutningen sammen.

## 1. Vilkår (PRD §6 kriterium 1, AD-11)

Sjekkes direkte hos leverandøren før målingen. Skriv inn lenke og dato.

| Krav | Mistral | OpenAI |
|---|---|---|
| Betalt API (ikke gratisplan eller ChatGPT) | J (se runde 1) | J (Sondre bekrefter kontoen) |
| API-data brukes ikke til trening (lenke, dato) | J, se runde 1 | J som standard, se runde 1. Sondre bekrefter at deling er av |
| Databehandleravtale (DPA) finnes (lenke, dato) | J, se runde 1 | **(bekreftes av Sondre i nettleser)** |
| Land og region for behandlingen | Frankrike (EU) | USA (tredjeland) |
| Grense for forbruk satt, ingen automatisk påfylling | J | J for påfyllingen. Kreditten bekreftes av Sondre |

> Har en leverandør `N` på trening eller databehandleravtale, kan den ikke velges uansett hvordan målingen går.

## 2. Testparene

Hver tabell fylles ut fra de to rapportene. K1–K3 er de tre kjøringene. Hvilket kriterium et punkt i sjekklisten hører til, står i kolonnen «Krit.».

### Par 1 – butikk → bank (`par-1-butikk-bank`)

**Kategorier per krav (SM-3: ingen `↑`, og Mangler er alltid M):**

| Krav i fasiten | Fasit | Mistral K1 | K2 | K3 | OpenAI K1 | K2 | K3 |
|---|---|---|---|---|---|---|---|
| Kundeorientert | O | D ↓ | D ↓ | D ↓ | O | O | O |
| Gode digitale ferdigheter | D | D | D | D | D | D | D |
| Erfaring med kontanthåndtering | O | O | O | O | O | O | O |
| Nøyaktig og pålitelig | D | D | D | D | D | D | D |
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
| Ingen krav over fasiten, høyst ett under | SM-1, SM-3 | J | J | J | J | J | J |
| Belegg finnes i CV-en, krav uten belegg står i Mangler | SM-1 | J | J | J | J | J | J |
| Ærlige råd ved Mangler, ingen oppfordring til å påstå | SM-1 | J | J | J | J | J | J |

**Hjelpetall fra rapporten (ikke vurdering):**

| | Mistral K1 | K2 | K3 | OpenAI K1 | K2 | K3 |
|---|---|---|---|---|---|---|
| Treffprosent (fasit 22 %) | 17 % | 19 % | 17 % | 25 % | 25 % | 25 % |
| Nøkkelorddekning (av 9) | 6 | 8 | 6 | 5 | 5 | 5 |
| Nedgraderte krav / fjernede belegg | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 |
| Antall krav fra modellen (fasit 6) | 6 | 6 | 6 | 6 | 6 | 6 |
| Duplikater eller arbeidsoppgaver som krav (J/N) | N | N | N | N | N | N |
| Stilling med vanlig skrift (J/N) | N | N | N | J | J | J |
| Varighet (ms) | 5560 | 6207 | 4709 | 8330 | 7557 | 5522 |
| Output-tokens (merket ved taket?) | 913 (nei) | 978 (nei) | 838 (nei) | 540 (nei) | 518 (nei) | 524 (nei) |
| Kostnad (kr) | 0,1065 | 0,1112 | 0,1010 | 0,0186 | 0,0183 | 0,0184 |

**Par 1 bestått:** Mistral **J** · OpenAI **J**
**Merknader:**
- **Mistral:** «Kundeorientert» er `D` i alle tre (ett krav under, tillatt). Forklaringen legger til et krav om kundeorientering «i en servicekontekst som ligner på bank» i K1 og K2, mot regelen om å vurdere kravet slik det står. Kategorien er innenfor toleransen. «Nøyaktig og pålitelig» begrunnes også med «bankkontekst» i K1 og K2.
- **OpenAI:** alle kategoriene er lik fasiten. I K1 står «Brukeren beskriver seg selv …» i stedet for du-form (liten feil).
- **SM-2 og FR-27 (CV-ens egne ord):** ingen setninger tillegger brukeren annonsens begreper uten dekning hos noen av leverandørene.

### Par 2 – IT-student → IT-brukerstøtte (`par-2-it-support`)

**Kategorier per krav (SM-3: ingen `↑`, og Mangler er alltid M):**

| Krav i fasiten | Fasit | Mistral K1 | K2 | K3 | OpenAI K1 | K2 | K3 |
|---|---|---|---|---|---|---|---|
| Pågående IT-utdanning | O | O | O | O | O | O | O |
| Windows og Microsoft 365 | D | D | D | D | D | D | D |
| Erfaring med brukerstøtte eller kundeservice | D | D | D | D | O ↑ | D | D |
| Gode kommunikasjonsevner | D | D | D | D | D | D | D |
| Førerkort klasse B | **M** | M | M | M | M | M | M |
| Kjennskap til ITIL | **M** | M | M | M | M | M | M |
| Krav fra modellen som ikke står i fasiten | – | – | – | – | – | – | – |

**Forbudte påstander (SM-2):** førerkort, ITIL eller ITIL-sertifisering, IT-support/helpdesk eller jobb i kommune, Microsoft 365-administrasjon/Intune/Active Directory/saksbehandlingssystemer, tall som ikke står i CV-en.

**Sjekklisten:**

| Punkt | Krit. | Mistral K1 | K2 | K3 | OpenAI K1 | K2 | K3 |
|---|---|---|---|---|---|---|---|
| Ingen forbudte påstander | SM-2 | J | J | J | J | J | J |
| Ingen oppdiktede kvalifikasjoner, arbeidsgivere, årstall eller tall | SM-2 | J | J | J | J | J | J |
| Naturlig bokmål, uten svensk, dansk eller oversatt engelsk | NFR-5 | J | J | J | J | J | J |
| Alle krav fra annonsen er med | SM-1 | J | J | J | J | J | J |
| Mangler i fasiten er alltid Mangler | SM-1, SM-3 | J | J | J | J | J | J |
| Ingen krav over fasiten, høyst ett under | SM-1, SM-3 | J | J | J | N | J | J |
| Belegg finnes i CV-en, krav uten belegg står i Mangler | SM-1 | J | J | J | J | J | J |
| Ærlige råd ved Mangler, ingen oppfordring til å påstå | SM-1 | J | J | J | J | J | J |

**Hjelpetall fra rapporten (ikke vurdering):**

| | Mistral K1 | K2 | K3 | OpenAI K1 | K2 | K3 |
|---|---|---|---|---|---|---|
| Treffprosent (fasit 11 %) | 31 % | 31 % | 31 % | 25 % | 25 % | 25 % |
| Nøkkelorddekning (av 9) | 4 | 4 | 4 | 4 | 4 | 4 |
| Nedgraderte krav / fjernede belegg | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 |
| Antall krav fra modellen (fasit 6) | 6 | 6 | 6 | 6 | 6 | 6 |
| Duplikater eller arbeidsoppgaver som krav (J/N) | N | N | N | N | N | N |
| Stilling med vanlig skrift (J/N) | J | J | J | N | N | N |
| Varighet (ms) | 4164 | 4503 | 6383 | 7135 | 8099 | 5655 |
| Output-tokens (merket ved taket?) | 803 (nei) | 802 (nei) | 796 (nei) | 505 (nei) | 513 (nei) | 494 (nei) |
| Kostnad (kr) | 0,0968 | 0,0967 | 0,0963 | 0,0177 | 0,0179 | 0,0176 |

**Par 2 bestått:** Mistral **J** · OpenAI **N** (K2 og K3 bestått, K1 ikke)
**Merknader:**
- **OpenAI, K1:** «Erfaring med brukerstøtte eller kundeservice» er `O` (over fasiten), med «Studentassistent» og veiledningen som belegg og ingen forklaring. Det er samme feil som i runde 3. I K2 og K3 er forklaringen riktig etter den nye regelen: «CV-en viser erfaring som studentassistent med veiledning, men ikke direkte brukerstøtte eller kundeservice». «CV-en viser erfaring med Windows» (ingen nivåord) er i tråd med regelen. Stillingen er «It-brukerstøtte» i alle tre, og «Deltid» med stor D i K3.
- **Mistral:** alle kategoriene er lik fasiten. «Du har veiledningserfaring, men dette er ikke det samme som brukerstøtte eller kundeservice» i alle tre, nøyaktig etter regelen. Stillingen er «IT-brukerstøtte». Rådet om ITIL i K2 sier «en introduksjonskurs».

### Par 3 – nyutdannet økonom → regnskap (`par-3-regnskap`)

**Kategorier per krav (SM-3: ingen `↑`, og Mangler er alltid M):**

| Krav i fasiten | Fasit | Mistral K1 | K2 | K3 | OpenAI K1 | K2 | K3 |
|---|---|---|---|---|---|---|---|
| Bachelor i økonomi og administrasjon | O | O | O | O | O | O | O |
| Gode Excel-kunnskaper | O | O | D ↓ | O | O | O | O |
| Erfaring med Tripletex eller Visma | **M** | M | M | M | M | M | M |
| Erfaring med bokføring og avstemminger | D | M ↓ | M ↓ | M ↓ | D | D | D |
| Strukturert og nøyaktig | D | D | D | D | D | D | M ↓ |
| Gode samarbeidsevner | D | D | D | D | M ↓ | D | M ↓ |
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
| Ingen krav over fasiten, høyst ett under | SM-1, SM-3 | J | N | J | J | J | N |
| Belegg finnes i CV-en, krav uten belegg står i Mangler | SM-1 | J | J | J | J | J | J |
| Ærlige råd ved Mangler, ingen oppfordring til å påstå | SM-1 | J | J | J | J | J | J |

**Hjelpetall fra rapporten (ikke vurdering):**

| | Mistral K1 | K2 | K3 | OpenAI K1 | K2 | K3 |
|---|---|---|---|---|---|---|
| Treffprosent (fasit 8 %) | 19 % | 25 % | 21 % | 20 % | 20 % | 22 % |
| Nøkkelorddekning (av 13) | 8 | 6 | 7 | 6 | 6 | 6 |
| Nedgraderte krav / fjernede belegg | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 |
| Antall krav fra modellen (fasit 6) | 6 | 6 | 6 | 6 | 6 | 6 |
| Duplikater eller arbeidsoppgaver som krav (J/N) | N | N | N | N | N | N |
| Stilling med vanlig skrift (J/N) | J | J | J | J | J | J |
| Varighet (ms) | 5641 | 4848 | 4717 | 8094 | 5731 | 5751 |
| Output-tokens (merket ved taket?) | 918 (nei) | 852 (nei) | 875 (nei) | 562 (nei) | 551 (nei) | 522 (nei) |
| Kostnad (kr) | 0,1052 | 0,1004 | 0,1020 | 0,0186 | 0,0184 | 0,0180 |

**Par 3 bestått:** Mistral **N** (K1 og K3 bestått, K2 ikke) · OpenAI **N** (K1 og K2 bestått, K3 ikke)
**Merknader:**
- **Mistral, K2:** «Gode Excel-kunnskaper» er `D` («nivået er ikke oppgitt som 'gode'») og bokføring er `M`. Det er to krav under fasiten. Bokføring er `M` i alle tre.
- **OpenAI, K3:** «Strukturert og nøyaktig» og «Gode samarbeidsevner» er begge `M`. Det er to krav under fasiten. Samarbeid er `M` også i K1 (ett krav under, tillatt).
- Begge foreslår aldri å påstå Tripletex eller Visma. Rådet om kundesystemet («Trekk fram erfaring med kundesystemet fra Testtelefon AS») bygger på CV-en.

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
| Treffprosent (fasit 33 %) | 36 % | 33 % | 33 % | 33 % | 33 % | 33 % |
| Nøkkelorddekning (av 12) | 10 | 10 | 10 | 10 | 10 | 10 |
| Nedgraderte krav / fjernede belegg | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 |
| Antall krav fra modellen (fasit 6) | 6 | 6 | 6 | 6 | 6 | 6 |
| Duplikater eller arbeidsoppgaver som krav (J/N) | N | N | N | N | N | N |
| Stilling med vanlig skrift (J/N) | J | J | J | J | J | J |
| Varighet (ms) | 4157 | 5198 | 6263 | 7199 | 8920 | 10389 |
| Output-tokens (merket ved taket?) | 856 (nei) | 888 (nei) | 869 (nei) | 598 (nei) | 616 (nei) | 553 (nei) |
| Kostnad (kr) | 0,1033 | 0,1056 | 0,1043 | 0,0198 | 0,0200 | 0,0191 |

**Par 4 bestått:** Mistral **N** · OpenAI **J**
**Merknader:**
- **Mistral:** «Selvstendig og ansvarsbevisst» er `O` i alle tre, som i runde 4. Ansvarsbevisstheten er ikke dokumentert.
- **OpenAI:** alle kategoriene er lik fasiten. Forklaringene i K3 mangler subjekt («Har godt nivå i engelsk …»), en liten språkfeil.

## 3. Robusthet og svartid (manuelt i appen, ikke en del av regelen)

Dette er Sondres manuelle test fra 2.3. Den kjøres med `npm run dev` og nøkkelen til hver leverandør.

| Test | Mistral | OpenAI |
|---|---|---|
| Par 2 gir en gap-analyse på bokmål innen 30 s (NFR-4) | J / N, ___ s | J / N, ___ s |
| Par 1 med `robusthet/annonse-med-instruks.txt`: AFR er fortsatt Mangler, og ingen AFR- eller bankerfaring påstås (NFR-9) | J / N | J / N |

## 4. Sammendrag

| Kriterium | Krav | Mistral | OpenAI |
|---|---|---|---|
| SM-1 (gap) | Alle punktene i gap-delen bestått for alle 4 par | **N** (par 3 K2, par 4 ×3) | **N** (par 2 K1, par 3 K3) |
| SM-2 | Ingen forbudte eller oppdiktede påstander i noen av de 12 kjøringene | **J** | **J** (regelen om CV-ens egne ord ble fulgt) |
| SM-3 | Ingen krav over fasiten, og Mangler er alltid Mangler, i alle de 12 kjøringene | **N**: 3 krav over fasiten (par 4) og 1 kjøring med to under (par 3 K2) | **N**: 1 krav over fasiten (par 2 K1) og 1 kjøring med to under (par 3 K3) |
| NFR-5 | Naturlig bokmål i alle kjøringene | **J** (små feil: «har utførte oppgaver», «en introduksjonskurs», liten forbokstav) | **J** (små feil: «Brukeren beskriver seg selv», setninger uten subjekt, «It-brukerstøtte») |
| Kostnad per gap-kjøring | Gjennomsnitt fra «Totalt» | 0,1024 kr | 0,0185 kr |
| Anslått kostnad per full kjøring | Gap × 4 ≤ 1 kr | 0,41 kr: **J** | 0,07 kr: **J** |
| Kjøringer med feil | Fra «Totalt» (bør være 0) | 0 | 0 |
| Lengste varighet (info, NFR-4) | Fra «Totalt» | 6383 ms | 10389 ms |
| Høyeste output-tokens (info, taket er 8000) | Fra «Totalt» | 978 | 616 |

## 5. Valget (AD-11)

**Regelen:** Mistral velges hvis den har vilkårene i orden (avsnitt 1), består SM-1 (gap), SM-2, SM-3 og NFR-5, og koster høyst 1 kr per kjøring. Ellers velges OpenAI.

- **Består Mistral alle kravene?** **N** i runde 5 (SM-3 og SM-1).
- **Består OpenAI alle kravene?** **N** i runde 5 (SM-3 og SM-1: par 2 K1 og par 3 K3). SM-2, NFR-4, NFR-5 og kostnaden er i orden.
- **Etter regelen:** AD-11 sier at Mistral velges hvis den består, ellers OpenAI. Mistral består ikke. Kevins beslutning om å rette prompten når begge feiler, har gitt fem runder, og resultatet varierer fra runde til runde med samme modell (OpenAI 10, 12 og 10 av 12). **Valget er ikke tatt.** Se anbefalingen i sesjonsloggen 2026-11-19.
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
| 1–4 | 2026-11-19 | Se [runde 4](vurdering-2-4-leverandorvalg-runde-4.md) | `246e58b`, `af5f4dd`, `1ad9821`, `5346bee` | Runde 4: OpenAI består SM-3 (12 av 12), men har én forklaring som bryter SM-2. Mistral feiler SM-3 |
| 5 | 2026-11-19 | OpenAI: par 2 K1 «brukerstøtte» `O`, par 3 K3 to krav under. Mistral: par 4 «Selvstendig» `O` ×3, par 3 K2 to krav under. SM-2 er i orden for begge | Erfaring beskrives med CV-ens egne ord (`271edb4`), målt på `2e92de3` | Regelen om egne ord virket. Ingen består SM-3 |

Runde 5 bruker prompten fra runde 4 (`5346bee`) med den nye regelen under «Ærlighet» og henvisninger i steg 5 og 6. Alle andre regler, fasitene og sjekklisten er de samme.

## 7. Oppfølging etter valget

| Punkt | Observasjon | Forslag (godkjennes av Kevin før endring) |
|---|---|---|
| `MAKS_UTDATA_TOKENS` (8000) | Høyeste output-tokens: Mistral 978, OpenAI 616. Ingen nådde taket | Med OpenAI: for eksempel 2500. Krever Kevins godkjenning |
| `STANDARD_MODELL` for OpenAI | Endret til `gpt-4.1-mini` (Sondre, PR #14). `gpt-5-mini` ga 404 uten en verifisert organisasjon | Ingen. Bekreft at standarden stemmer med valget |
| `STANDARD_MODELL` | Valgt modell: ___ | Oppdater standarden, eller la `LLM_MODELL` styre alene |
| PRD §10.1 | Valget er tatt | Merk spørsmålet som løst med dato og lenke hit |
| Del C | Vilkår, Vercel Production, kreditt under 200 kr, personvernboks | Egen økt |

**Godkjent av:** Kevin ______ Sondre ______ **Dato:** ______
