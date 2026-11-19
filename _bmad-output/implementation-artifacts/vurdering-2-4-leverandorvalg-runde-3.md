# Vurdering: leverandørvalg, runde 3 (story 2.4 del B)

> **Status 2026-11-19: begge leverandørene er målt i runde 3** på commit `4cd4f2f` med den samme prompten (`1ad9821`). OpenAI: kontroll pluss 12 av 12, 0 feil, 0,2214 kr. Mistral: 12 av 12, 0 feil, 1,1606 kr. Samlet 1,38 kr, under Kevins ramme på 2 kr. **Ingen av dem består SM-3**, og de feiler på hvert sitt punkt (avsnitt 4 og 5).

**Rundene sammenlignet** (tilfeller av kategori over fasiten og kjøringer som består SM-3, av 12):

| | Runde 1 Mistral | Runde 2 Mistral | Runde 3 Mistral | Runde 3 OpenAI |
|---|---|---|---|---|
| Krav over fasiten | 9 | 2 | 2 (par 1 «Gode digitale ferdigheter», K2 og K3) | 2 (par 2 «Brukerstøtte eller kundeservice», K1 og K2) |
| Kjøringer som består SM-3 | 3 (pluss 3 som avklares) | 8 (pluss 2 som avklares) | 10 | 10 |
| Sammensatt krav i par 2 samlet | 0 av 3 | 1 av 3 | 3 av 3 | 3 av 3 |
| Krav under fasiten (ett per par er tillatt) | par 3 | par 1 og 3 | par 1 og 3 | ingen |
| Lengste varighet | 6617 ms | 6038 ms | 6594 ms | 8857 ms (kontrollen 9148 ms) |
| Kostnad per gap-kjøring | 0,0844 kr | 0,0946 kr | 0,0967 kr | 0,0170 kr |

> **Tidligere status:** forberedt, ikke målt. Runde 3 måler både Mistral Medium 3.5 og OpenAI `gpt-4.1-mini` på samme commit, med prompten etter [`spec-2-4-del-b-runde-3-sammensatte-krav.md`](spec-2-4-del-b-runde-3-sammensatte-krav.md) (Sondres regel for sammensatte krav). Prompten er endret etter runde 2, så Mistral må måles på nytt for at begge skal vurderes på samme grunnlag (SM-2). Valget tas etter AD-11 på runde 3. Rundene 1 og 2 står uendret i [`vurdering-2-4-leverandorvalg-runde-1.md`](vurdering-2-4-leverandorvalg-runde-1.md) og [`vurdering-2-4-leverandorvalg-runde-2.md`](vurdering-2-4-leverandorvalg-runde-2.md). Vilkårene, prisene og kursen er de samme som i avsnitt 0 og 1 i runde 1.

**Regelen for sammensatte krav** (Sondre, meldt av Kevin 2026-11-19), som vurderingen bruker:
- Et punkt med to deler, for eksempel «Windows og Microsoft 365», er ett krav.
- Begge delene dokumentert: Oppfylt. Bare én del dokumentert: Delvis oppfylt.
- Ingen av delene dokumentert: Mangler. Har CV-en overførbar eller beslektet erfaring, gir FR-8 likevel Delvis oppfylt (par 3: bokføring og avstemminger, strukturert og nøyaktig). Denne lesingen må Sondre bekrefte.
- Ved Delvis oppfylt viser belegget delen som er dekket, og forklaringen sier hvilken del som mangler.
- Deler modellen et sammensatt krav i flere krav, er det et avvik fra regelen. Det noteres i merknaden for paret, og Kevin og Sondre avgjør hvilket punkt i sjekklisten det gir `N` på.

Kopi av [`vurdering-2-4-leverandorvalg.md`](vurdering-2-4-leverandorvalg.md) for runde 3. Mal for å vurdere testsettrapportene fra `npm run testsett` mot fasitene og `testdata/sjekkliste.md`, og ta valget etter AD-11. Fyll ut én kopi per målerunde. Hva som skjer når en kjøring feiler, står i beslutningene under avsnitt 0: feiler begge leverandørene på samme punkt, rettes prompten, og begge måles på nytt. Feiler bare Mistral, velges OpenAI uten ny måling. Ny runde betyr ny kopi.

**Slik fyller du ut:** `J` = bestått, `N` = ikke bestått, `–` = ikke relevant eller ingen analyse (kjøringen feilet). Kategorier skrives `O` (Oppfylt), `D` (Delvis oppfylt) og `M` (Mangler). Marker en kategori som er høyere enn i fasiten med `↑`, og en som er lavere med `↓`. Skriv alltid en kort merknad ved `N`.

## 0. Målerunden

| Felt | Mistral | OpenAI |
|---|---|---|
| Rapportfil (`testsett-rapporter/…`) | `2026-11-19-2222-mistral-mistral-medium-2604.md` | `2026-11-19-2220-openai-gpt-4.1-mini.md` (den fulle målingen. Kontrollen ble overskrevet, se par 2) |
| Modell (`--modell`, datobestemt navn) | `mistral-medium-2604` (Medium 3.5) | `gpt-4.1-mini` |
| Modellversjon fra leverandøren (fra rapporten) | `mistral-medium-2604` i alle 12 | `gpt-4.1-mini-2025-04-14` i alle 12 (og i kontrollen) |
| Commit (fra rapporten) | `4cd4f2f` (prompten fra `1ad9821`) | `4cd4f2f` (samme) |
| Arbeidstreet rent (ingen merknad i rapporten) | J | J |
| Pris inn (kr per million tokens) | 14,53 (1,50 USD, ikke eksakt bekreftet) | 3,87 (0,40 USD) |
| Pris ut (kr per million tokens) | 72,65 (7,50 USD, ikke eksakt bekreftet) | 15,50 (1,60 USD) |
| Kilde for prisen og dato | Tredjeparter. Konsollen viser ingen pris (Kevin, 2026-11-19) | developers.openai.com: pricing, lest 2026-11-19 |
| Valutakurs og dato | 9,6866 kr per USD, Norges Bank, 2026-11-19 | Samme |
| Kjøringer med feil (fra «Totalt») | 0 av 12 | 0 av 12 (og 0 av 1 i kontrollen) |

- **Dato for vurderingen:**
- **Vurdert av:**
- **Målerunde nr.:** 3 (øk med én for hver gang prompten er rettet)

**Beslutninger som gjelder (Kevin, 2026-11-19):**
- «1 kr per kjøring» vurderes som gjennomsnittlig kostnad per gap-kjøring × 4, fordi en full kjøring har fire genereringer (gap, brev, CV, ATS), og bare gap finnes ennå.
- OpenAI måles med `gpt-4.1-mini` (Kevin, 2026-11-19). `gpt-5-mini` ga 404 uten en verifisert organisasjon. `gpt-4.1-mini` tar imot temperaturen, så det trengs ikke noe unntak fra AD-3.
- Feiler begge leverandørene på samme punkt, er det et problem med prompten. Prompten rettes da med `bmad-build`, og begge måles på nytt. Feiler bare Mistral, velges OpenAI etter regelen.
- Kevin og Sondre gjør vurderingen og tar beslutningen sammen.

## 1. Vilkår (PRD §6 kriterium 1, AD-11)

Sjekkes direkte hos leverandøren før målingen. Skriv inn lenke og dato.

| Krav | Mistral | OpenAI |
|---|---|---|
| Betalt API (ikke gratisplan eller ChatGPT) | J (se runde 1) | J (kallene ble fakturert med Sondres nøkkel. Sondre bekrefter kontoen) |
| API-data brukes ikke til trening (lenke, dato) | J, se runde 1 | J som standard, se runde 1. Sondre bekrefter at deling er av |
| Databehandleravtale (DPA) finnes (lenke, dato) | J, se runde 1 | **(bekreftes av Sondre i nettleser)**, se runde 1 |
| Land og region for behandlingen | Frankrike (EU) | USA (tredjeland) |
| Grense for forbruk satt, ingen automatisk påfylling | J (2 USD per måned, ingen påfylling) | J for påfyllingen (Sondres logg). Kreditten bekreftes av Sondre |

> Har en leverandør `N` på trening eller databehandleravtale, kan den ikke velges uansett hvordan målingen går.

## 2. Testparene

Hver tabell fylles ut fra de to rapportene. K1–K3 er de tre kjøringene. Hvilket kriterium et punkt i sjekklisten hører til, står i kolonnen «Krit.».

### Par 1 – butikk → bank (`par-1-butikk-bank`)

**Kategorier per krav (SM-3: ingen `↑`, og Mangler er alltid M):**

| Krav i fasiten | Fasit | Mistral K1 | K2 | K3 | OpenAI K1 | K2 | K3 |
|---|---|---|---|---|---|---|---|
| Kundeorientert | O | D ↓ | D ↓ | D ↓ | O | O | O |
| Gode digitale ferdigheter | D | D | O ↑ | O ↑ | D | D | D |
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
| Ingen krav over fasiten, høyst ett under | SM-1, SM-3 | J | N | N | J | J | J |
| Belegg finnes i CV-en, krav uten belegg står i Mangler | SM-1 | J | J | J | J | J | J |
| Ærlige råd ved Mangler, ingen oppfordring til å påstå | SM-1 | J | J | J | J | J | J |

**Hjelpetall fra rapporten (ikke vurdering):**

| | Mistral K1 | K2 | K3 | OpenAI K1 | K2 | K3 |
|---|---|---|---|---|---|---|
| Treffprosent (fasit 22 %) | 19 % | 18 % | 18 % | 25 % | 29 % | 25 % |
| Nøkkelorddekning (av 9) | 8 | 8 | 8 | 5 | 5 | 5 |
| Nedgraderte krav / fjernede belegg | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 |
| Antall krav fra modellen (fasit 6) | 6 | 6 | 6 | 6 | 6 | 6 |
| Duplikater eller arbeidsoppgaver som krav (J/N) | N | N | N | N | N | N |
| Stilling med vanlig skrift (J/N) | N | N | N | J | J | J |
| Varighet (ms) | 6594 | 5456 | 5044 | 7713 | 8857 | 5737 |
| Output-tokens (merket ved taket?) | 946 (nei) | 923 (nei) | 898 (nei) | 505 (nei) | 503 (nei) | 506 (nei) |
| Kostnad (kr) | 0,1019 | 0,1003 | 0,0984 | 0,0164 | 0,0164 | 0,0164 |

**Par 1 bestått:** Mistral **N** (K1 bestått, K2 og K3 ikke) · OpenAI **J**
**Merknader:**
- **Mistral (Medium 3.5):** «Gode digitale ferdigheter» er `O` i K2 og K3 (over fasiten), med belegget Office «grunnleggende». «Kundeorientert» er `D` i alle tre (under fasiten). Forklaringen er at kundeorienteringen er en egenvurdering i profilen, selv om «Hjalp kunder med å finne varer …» er konkret erfaring. Mønsteret er det samme som i runde 2. Stillingen er «Sommervikar – Kundebehandler» (stor K).
- **OpenAI (`gpt-4.1-mini`):** alle kategoriene er lik fasiten i alle tre kjøringene. Rådet om AFR i K2 er uklart («… hvis du får opplæring i autorisasjon»), men det er ærlig. Kravtekstene har «(en fordel)» fra annonsen.

### Par 2 – IT-student → IT-brukerstøtte (`par-2-it-support`)

**Kategorier per krav (SM-3: ingen `↑`, og Mangler er alltid M):**

| Krav i fasiten | Fasit | Mistral K1 | K2 | K3 | OpenAI K1 | K2 | K3 |
|---|---|---|---|---|---|---|---|
| Pågående IT-utdanning | O | O | O | O | O | O | O |
| Windows og Microsoft 365 | D | D | D | D | D | D | D |
| Erfaring med brukerstøtte eller kundeservice | D | D | D | D | O ↑ | O ↑ | D |
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
| Ingen krav over fasiten, høyst ett under | SM-1, SM-3 | J | J | J | N | N | J |
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
| Varighet (ms) | 4430 | 4301 | 4309 | 7150 | 5472 | 6033 |
| Output-tokens (merket ved taket?) | 804 (nei) | 807 (nei) | 821 (nei) | 572 (nei) | 514 (nei) | 552 (nei) |
| Kostnad (kr) | 0,0899 | 0,0901 | 0,0911 | 0,0171 | 0,0162 | 0,0168 |

**Par 2 bestått:** Mistral **J** · OpenAI **N** (K3 bestått, K1 og K2 ikke)
**Merknader:**
- **Sammensatte krav:** «God forståelse av Windows og Microsoft 365» står samlet som ett krav med `D` hos begge leverandørene i alle seks kjøringene. Belegget er Windows, og forklaringen sier at Microsoft 365 mangler. Sondres regel virket.
- **Mistral:** alle kategoriene er lik fasiten. Stillingen er «IT-brukerstøtte – deltid for student». Rådet om ITIL sier «en introduksjonskurs» (skal være «et») i alle tre, en liten grammatikkfeil.
- **OpenAI:** «Erfaring med brukerstøtte eller kundeservice» er `O` i K1 og K2 (over fasiten), med «Studentassistent» og veiledningen som belegg. Fasiten sier at veiledning ligner brukerstøtte, men ikke er det (`D`). Regelen om alternativer («eller») kan ha bidratt. Stillingen er «It-brukerstøtte – deltid for student» i alle tre, altså ikke vanlig skrift. For krav med «delvis» gir OpenAI også råd («Råd: …»), selv om prompten sier at råd bare gis for «mangler». Rådene er ærlige.
- Kontrollkallet til OpenAI (par 2, én kjøring) ga 200 på 9148 ms, 2129 inn og 597 ut, 0,0175 kr og stillingen «It-brukerstøtte – deltid for student». Rapporten ble overskrevet av den fulle målingen fordi filnavnet bare har minutter (se `issues.md`). Tallene er fra utdataene i konsollen.

### Par 3 – nyutdannet økonom → regnskap (`par-3-regnskap`)

**Kategorier per krav (SM-3: ingen `↑`, og Mangler er alltid M):**

| Krav i fasiten | Fasit | Mistral K1 | K2 | K3 | OpenAI K1 | K2 | K3 |
|---|---|---|---|---|---|---|---|
| Bachelor i økonomi og administrasjon | O | O | O | O | O | O | O |
| Gode Excel-kunnskaper | O | O | O | O | O | O | O |
| Erfaring med Tripletex eller Visma | **M** | M | M | M | M | M | M |
| Erfaring med bokføring og avstemminger | D | M ↓ | M ↓ | M ↓ | D | D | D |
| Strukturert og nøyaktig | D | D | D | D | D | D | D |
| Gode samarbeidsevner | D | D | D | D | D | D | D |
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
| Ingen krav over fasiten, høyst ett under | SM-1, SM-3 | J | J | J | J | J | J |
| Belegg finnes i CV-en, krav uten belegg står i Mangler | SM-1 | J | J | J | J | J | J |
| Ærlige råd ved Mangler, ingen oppfordring til å påstå | SM-1 | J | J | J | J | J | J |

**Hjelpetall fra rapporten (ikke vurdering):**

| | Mistral K1 | K2 | K3 | OpenAI K1 | K2 | K3 |
|---|---|---|---|---|---|---|
| Treffprosent (fasit 8 %) | 19 % | 19 % | 20 % | 20 % | 20 % | 25 % |
| Nøkkelorddekning (av 13) | 8 | 8 | 8 | 6 | 6 | 4 |
| Nedgraderte krav / fjernede belegg | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 |
| Antall krav fra modellen (fasit 6) | 6 | 6 | 6 | 6 | 6 | 6 |
| Duplikater eller arbeidsoppgaver som krav (J/N) | N | N | N | N | N | N |
| Stilling med vanlig skrift (J/N) | J | J | J | J | J | J |
| Varighet (ms) | 4841 | 5107 | 4654 | 7806 | 6835 | 6559 |
| Output-tokens (merket ved taket?) | 893 (nei) | 916 (nei) | 863 (nei) | 596 (nei) | 605 (nei) | 559 (nei) |
| Kostnad (kr) | 0,0964 | 0,0981 | 0,0942 | 0,0175 | 0,0176 | 0,0169 |

**Par 3 bestått:** Mistral **J** · OpenAI **J**
**Merknader:**
- **Mistral:** «Erfaring med bokføring og avstemminger» er `M` mot `D` i fasiten. Det er ett krav under fasiten, og det er tillatt.
- **OpenAI:** alle kategoriene er lik fasiten. Bokføring er `D` med belegget «Besvarte kundehenvendelser om fakturaer og abonnement». Belegget er svakt, men forklaringen er ærlig. I K3 mangler «(fullført juni 2026)» i belegget for bacheloren, men belegget står ordrett i CV-en.
- Begge foreslår aldri å påstå Tripletex eller Visma.

### Par 4 – reiselivsstudent → hotellresepsjon (`par-4-tokolonne-hotell`)

Målingen bruker `cv.txt`, altså forventet uttrekk. Innlesingen av `cv.pdf` vurderes ikke her.

**Kategorier per krav (SM-3: ingen `↑`, og Mangler er alltid M):**

| Krav i fasiten | Fasit | Mistral K1 | K2 | K3 | OpenAI K1 | K2 | K3 |
|---|---|---|---|---|---|---|---|
| Serviceinnstilt med erfaring fra kundeservice | O | O | O | O | O | O | O |
| Gode språkkunnskaper i engelsk og tysk | D | D | D | D | D | D | D |
| Erfaring med kassasystem og oppgjør | O | O | O | O | O | O | O |
| Selvstendig og ansvarsbevisst | D | D | D | D | D | D | D |
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
| Ingen krav over fasiten, høyst ett under | SM-1, SM-3 | J | J | J | J | J | J |
| Belegg finnes i CV-en, krav uten belegg står i Mangler | SM-1 | J | J | J | J | J | J |
| Ærlige råd ved Mangler, ingen oppfordring til å påstå | SM-1 | J | J | J | J | J | J |

**Hjelpetall fra rapporten (ikke vurdering):**

| | Mistral K1 | K2 | K3 | OpenAI K1 | K2 | K3 |
|---|---|---|---|---|---|---|
| Treffprosent (fasit 33 %) | 36 % | 33 % | 33 % | 33 % | 33 % | 42 % |
| Nøkkelorddekning (av 12) | 10 | 10 | 10 | 10 | 10 | 9 |
| Nedgraderte krav / fjernede belegg | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 |
| Antall krav fra modellen (fasit 6) | 6 | 6 | 6 | 6 | 6 | 6 |
| Duplikater eller arbeidsoppgaver som krav (J/N) | N | N | N | N | N | N |
| Stilling med vanlig skrift (J/N) | J | J | J | J | J | J |
| Varighet (ms) | 5151 | 4542 | 4636 | 6076 | 6316 | 6987 |
| Output-tokens (merket ved taket?) | 920 (nei) | 908 (nei) | 892 (nei) | 554 (nei) | 566 (nei) | 569 (nei) |
| Kostnad (kr) | 0,1010 | 0,1001 | 0,0990 | 0,0174 | 0,0176 | 0,0176 |

**Par 4 bestått:** Mistral **J** · OpenAI **J**
**Merknader:**
- Begge leverandørene har alle kategoriene lik fasiten i alle seks kjøringene.
- **OpenAI:** forklaringene har særskrivingsfeil («Tysk kunnskaper er …», «Tysk kunnskapsnivået er …»). Det er en språkfeil som ofte kommer av engelsk påvirkning. Den regnes med under NFR-5 i avsnitt 4.
- **Mistral:** kravtekstene står med liten forbokstav i K2 og K3.

## 3. Robusthet og svartid (manuelt i appen, ikke en del av regelen)

Dette er Sondres manuelle test fra 2.3. Den kjøres med `npm run dev` og nøkkelen til hver leverandør.

| Test | Mistral | OpenAI |
|---|---|---|
| Par 2 gir en gap-analyse på bokmål innen 30 s (NFR-4) | J / N, ___ s | J / N, ___ s |
| Par 1 med `robusthet/annonse-med-instruks.txt`: AFR er fortsatt Mangler, og ingen AFR- eller bankerfaring påstås (NFR-9) | J / N | J / N |

## 4. Sammendrag

| Kriterium | Krav | Mistral | OpenAI |
|---|---|---|---|
| SM-1 (gap) | Alle punktene i gap-delen bestått for alle 4 par | **N** (par 1, K2 og K3) | **N** (par 2, K1 og K2) |
| SM-2 | Ingen forbudte eller oppdiktede påstander i noen av de 12 kjøringene | **J** | **J** |
| SM-3 | Ingen krav over fasiten, og Mangler er alltid Mangler, i alle de 12 kjøringene | **N**: 2 krav over (Mangler er alltid M) | **N**: 2 krav over (Mangler er alltid M) |
| NFR-5 | Naturlig bokmål i alle kjøringene | **J** (små feil: «en introduksjonskurs», «Kundebehandler» med stor K) | **J med forbehold** (særskriving: «Tysk kunnskaper», «Tysk kunnskapsnivået». Stillingen er «It-brukerstøtte») |
| Kostnad per gap-kjøring | Gjennomsnitt fra «Totalt» | 0,0967 kr | 0,0170 kr |
| Anslått kostnad per full kjøring | Gap × 4 ≤ 1 kr | 0,39 kr: **J** (prisen er ikke eksakt bekreftet) | 0,07 kr: **J** |
| Kjøringer med feil | Fra «Totalt» (bør være 0) | 0 | 0 |
| Lengste varighet (info, NFR-4) | Fra «Totalt» | 6594 ms | 8857 ms (kontrollen 9148 ms) |
| Høyeste output-tokens (info, taket er 8000) | Fra «Totalt» | 946 | 605 |

## 5. Valget (AD-11)

**Regelen:** Mistral velges hvis den har vilkårene i orden (avsnitt 1), består SM-1 (gap), SM-2, SM-3 og NFR-5, og koster høyst 1 kr per kjøring. Ellers velges OpenAI.

- **Består Mistral alle kravene?** **N** i runde 3: SM-3 og SM-1 (gap) feiler på par 1 (K2 og K3).
- **Består OpenAI alle kravene?** **N** i runde 3: SM-3 og SM-1 (gap) feiler på par 2 (K1 og K2).
- **Etter regelen:** AD-11 velger OpenAI når Mistral feiler, men regelen forutsetter at OpenAI er et akseptabelt alternativ. Kevin bestemte 2026-11-19 at når begge feiler, rettes prompten, og begge måles på nytt. Valget er derfor **ikke tatt** i runde 3. Det tas av Kevin og Sondre (se anbefalingen i sesjonsloggen 2026-11-19).
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
| 1 | 2026-11-19 | Mistral: 9 tilfeller av krav over fasiten (par 1 og 4), og par 2 delt | – | Se [runde 1](vurdering-2-4-leverandorvalg-runde-1.md) |
| 2 | 2026-11-19 | Mistral: 2 tilfeller over fasiten (par 1 «Gode digitale ferdigheter»), par 1 «Kundeorientert» for strengt, par 2 delt i K2 og K3 | Steg 1–3 etter FR-8 og FR-7 (`af5f4dd`) | Se [runde 2](vurdering-2-4-leverandorvalg-runde-2.md) |
| 3 | 2026-11-19 | Mistral: par 1 «Gode digitale ferdigheter» `O` i K2 og K3, «Kundeorientert» `D` i alle tre. OpenAI: par 2 «Brukerstøtte eller kundeservice» `O` i K1 og K2 | Sondres regel for sammensatte krav (`1ad9821`), målt på `4cd4f2f` | Det sammensatte kravet i par 2 er samlet i alle 6. Begge feiler SM-3 på hvert sitt punkt |

Runde 3 bruker prompten fra runde 2 (`af5f4dd`, se [runde 2](vurdering-2-4-leverandorvalg-runde-2.md)) med disse endringene (`spec-2-4-del-b-runde-3-sammensatte-krav.md`):
- Steg 2: kravteksten skal ha alle delene slik de står i punktet.
- Steg 3: en egen regel for sammensatte krav (alle delene, noen av delene, ingen deler med og uten beslektet erfaring), og alternativer for seg.
- Steg 5: forklaringen for et sammensatt krav sier hvilken del som mangler.

Fasiten, sjekklisten og vurderingsreglene er de samme som i rundene 1 og 2.

## 7. Oppfølging etter valget

| Punkt | Observasjon | Forslag (godkjennes av Kevin før endring) |
|---|---|---|
| `MAKS_UTDATA_TOKENS` (8000) | Høyeste output-tokens: Mistral 946 og OpenAI 605. Ingen nådde taket | For eksempel 4000 (over 4 ganger det høyeste). Krever Kevins godkjenning |
| `STANDARD_MODELL` for OpenAI | Endret til `gpt-4.1-mini` (Sondre, PR #14). `gpt-5-mini` ga 404 uten en verifisert organisasjon | Ingen. Bekreft at standarden stemmer med valget |
| `STANDARD_MODELL` | Valgt modell: ___ | Oppdater standarden, eller la `LLM_MODELL` styre alene |
| PRD §10.1 | Valget er tatt | Merk spørsmålet som løst med dato og lenke hit |
| Del C | Vilkår, Vercel Production, kreditt under 200 kr, personvernboks | Egen økt |

**Godkjent av:** Kevin ______ Sondre ______ **Dato:** ______
