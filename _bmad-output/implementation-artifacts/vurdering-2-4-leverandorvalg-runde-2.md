# Vurdering: leverandørvalg, runde 2 (story 2.4 del B)

> **Status 2026-11-19: Mistral Medium 3.5 er målt i runde 2** (12 av 12 kjøringer, 0 feil, 1,1352 kr). Mistral feiler fortsatt SM-3 på par 1 (K1 og K3). OpenAI `gpt-4.1-mini` er ikke målt ennå. Den skal måles på samme commit (`28da462`) og samme prompt.

**Runde 1 og runde 2 for Mistral Medium 3.5** (kategorier per kjøring K1/K2/K3, fasiten i parentes):

| Par og krav | Runde 1 | Runde 2 | Endring |
|---|---|---|---|
| Par 1 Kundeorientert (O) | O/O/O | **D↓/D↓/D↓** | For strengt: modellen krever bankerfaring |
| Par 1 Gode digitale ferdigheter (D) | **O↑/O↑/O↑** | **O↑**/D/**O↑** | Bedre, men fortsatt over fasiten i 2 av 3 |
| Par 1 Nøyaktig og pålitelig (D) | **O↑/O↑/O↑** | D/D/D | Rettet |
| Par 2 Windows og Microsoft 365 (D) | delt/delt/delt | D/delt/delt | Bedre, men fortsatt delt i 2 av 3 |
| Par 2 stillingen | It-brukerstøtte | IT-brukerstøtte | Rettet |
| Par 3 Bokføring og avstemminger (D) | M↓/M↓/M↓ | M↓/M↓/M↓ | Uendret (ett under er tillatt) |
| Par 4 Selvstendig og ansvarsbevisst (D) | **O↑/O↑/O↑** | D/D/D | Rettet |
| Par 4 Serviceinnstilt med kundeservice (O) | O/O/O | O/O/O | Uendret (ikke for strengt) |
| Tilfeller av krav over fasiten | 9 | 2 | |
| Kjøringer som består SM-3 (par 2 regnet som avklares) | par 3 (3 av 12) | par 1 K2, par 2 K1, par 3, par 4 (8 av 12) | |
| Lengste varighet / høyeste output | 6617 ms / 908 | 6038 ms / 978 | NFR-4 i orden |
| Kostnad per gap-kjøring | 0,0844 kr | 0,0946 kr | Ca. 340 flere input-tokens per kall (lengre prompt) |

> **Tidligere status (forberedt, ikke målt):** Runde 2 måler begge leverandørene på prompten etter [`spec-2-4-del-b-runde-2-kategori-og-sammensatte-krav.md`](spec-2-4-del-b-runde-2-kategori-og-sammensatte-krav.md). Kevin bestemte 2026-11-19 å rette prompten etter runde 1 før OpenAI ble målt, i tråd med SM-2 (feiler én kjøring, rettes prompten, og alt kjøres på nytt). Valget tas etter AD-11 på resultatene fra runde 2. Runde 1 står uendret i [`vurdering-2-4-leverandorvalg-runde-1.md`](vurdering-2-4-leverandorvalg-runde-1.md). Vilkårene, prisene og kursen er de samme som i avsnitt 0 og 1 der, så lenge de ikke er endret i kontoen.

Kopi av [`vurdering-2-4-leverandorvalg.md`](vurdering-2-4-leverandorvalg.md) for runde 2. Mal for å vurdere testsettrapportene fra `npm run testsett` mot fasitene og `testdata/sjekkliste.md`, og ta valget etter AD-11. Fyll ut én kopi per målerunde. Hva som skjer når en kjøring feiler, står i beslutningene under avsnitt 0: feiler begge leverandørene på samme punkt, rettes prompten, og begge måles på nytt. Feiler bare Mistral, velges OpenAI uten ny måling. Ny runde betyr ny kopi.

**Slik fyller du ut:** `J` = bestått, `N` = ikke bestått, `–` = ikke relevant eller ingen analyse (kjøringen feilet). Kategorier skrives `O` (Oppfylt), `D` (Delvis oppfylt) og `M` (Mangler). Marker en kategori som er høyere enn i fasiten med `↑`, og en som er lavere med `↓`. Skriv alltid en kort merknad ved `N`.

## 0. Målerunden

| Felt | Mistral | OpenAI |
|---|---|---|
| Rapportfil (`testsett-rapporter/…`) | `2026-11-19-2129-mistral-mistral-medium-2604.md` | _(etter målingen av OpenAI)_ |
| Modell (`--modell`, datobestemt navn) | `mistral-medium-2604` (Medium 3.5) | `gpt-4.1-mini` |
| Modellversjon fra leverandøren (fra rapporten) | `mistral-medium-2604` i alle 12 kjøringene | |
| Commit (fra rapporten) | `28da462` (prompten fra `af5f4dd`) | Samme commit |
| Arbeidstreet rent (ingen merknad i rapporten) | J (`git status` tom før kjøringen, ingen merknad i rapporten) | J / N |
| Pris inn (kr per million tokens) | 14,53 (1,50 USD, ikke eksakt bekreftet) | 3,87 (0,40 USD) |
| Pris ut (kr per million tokens) | 72,65 (7,50 USD, ikke eksakt bekreftet) | 15,50 (1,60 USD) |
| Kilde for prisen og dato | Som i runde 1: tredjeparter, og konsollen viser ingen pris (Kevin, 2026-11-19) | developers.openai.com: pricing, lest 2026-11-19 |
| Valutakurs og dato | 9,6866 kr per USD, Norges Bank, 2026-11-19 | Samme |
| Kjøringer med feil (fra «Totalt») | 0 av 12 | |

- **Dato for vurderingen:**
- **Vurdert av:**
- **Målerunde nr.:** 2 (øk med én for hver gang prompten er rettet)

**Beslutninger som gjelder (Kevin, 2026-11-19):**
- «1 kr per kjøring» vurderes som gjennomsnittlig kostnad per gap-kjøring × 4, fordi en full kjøring har fire genereringer (gap, brev, CV, ATS), og bare gap finnes ennå.
- OpenAI måles med `gpt-4.1-mini` (Kevin, 2026-11-19). `gpt-5-mini` ga 404 uten en verifisert organisasjon. `gpt-4.1-mini` tar imot temperaturen, så det trengs ikke noe unntak fra AD-3.
- Feiler begge leverandørene på samme punkt, er det et problem med prompten. Prompten rettes da med `bmad-build`, og begge måles på nytt. Feiler bare Mistral, velges OpenAI etter regelen.
- Kevin og Sondre gjør vurderingen og tar beslutningen sammen.

## 1. Vilkår (PRD §6 kriterium 1, AD-11)

Sjekkes direkte hos leverandøren før målingen. Skriv inn lenke og dato.

| Krav | Mistral | OpenAI |
|---|---|---|
| Betalt API (ikke gratisplan eller ChatGPT) | J / N | J / N |
| API-data brukes ikke til trening (lenke, dato) | | |
| Databehandleravtale (DPA) finnes (lenke, dato) | | |
| Land og region for behandlingen | Frankrike (EU) | USA (tredjeland) |
| Grense for forbruk satt, ingen automatisk påfylling | J / N | J / N |

> Har en leverandør `N` på trening eller databehandleravtale, kan den ikke velges uansett hvordan målingen går.

## 2. Testparene

Hver tabell fylles ut fra de to rapportene. K1–K3 er de tre kjøringene. Hvilket kriterium et punkt i sjekklisten hører til, står i kolonnen «Krit.».

### Par 1 – butikk → bank (`par-1-butikk-bank`)

**Kategorier per krav (SM-3: ingen `↑`, og Mangler er alltid M):**

| Krav i fasiten | Fasit | Mistral K1 | K2 | K3 | OpenAI K1 | K2 | K3 |
|---|---|---|---|---|---|---|---|
| Kundeorientert | O | D ↓ | D ↓ | D ↓ | | | |
| Gode digitale ferdigheter | D | O ↑ | D | O ↑ | | | |
| Erfaring med kontanthåndtering | O | O | O | O | | | |
| Nøyaktig og pålitelig | D | D | D | D | | | |
| Studerer økonomi eller tilsvarende | O | O | O | O | | | |
| AFR-autorisasjon | **M** | M | M | M | | | |
| Krav fra modellen som ikke står i fasiten | – | – | – | – | | | |

**Forbudte påstander (SM-2):** AFR-autorisasjon (også «holder på med»), bank/finans/kundesenter, nettbank-support eller bankens systemer, fullført bachelor, avanserte Excel-ferdigheter, tall som ikke står i CV-en.

**Sjekklisten:**

| Punkt | Krit. | Mistral K1 | K2 | K3 | OpenAI K1 | K2 | K3 |
|---|---|---|---|---|---|---|---|
| Ingen forbudte påstander | SM-2 | J | J | J | | | |
| Ingen oppdiktede kvalifikasjoner, arbeidsgivere, årstall eller tall | SM-2 | J | J | J | | | |
| Naturlig bokmål, uten svensk, dansk eller oversatt engelsk | NFR-5 | J | J | J | | | |
| Alle krav fra annonsen er med | SM-1 | J | J | J | | | |
| Mangler i fasiten er alltid Mangler | SM-1, SM-3 | J | J | J | | | |
| Ingen krav over fasiten, høyst ett under | SM-1, SM-3 | N | J | N | | | |
| Belegg finnes i CV-en, krav uten belegg står i Mangler | SM-1 | J | J | J | | | |
| Ærlige råd ved Mangler, ingen oppfordring til å påstå | SM-1 | J | J | J | | | |

**Hjelpetall fra rapporten (ikke vurdering):**

| | Mistral K1 | K2 | K3 | OpenAI K1 | K2 | K3 |
|---|---|---|---|---|---|---|
| Treffprosent (fasit 22 %) | 18 % | 18 % | 18 % | | | |
| Nøkkelorddekning (av 9) | 8 | 8 | 6 | | | |
| Nedgraderte krav / fjernede belegg | 0 / 0 | 0 / 0 | 0 / 0 | | | |
| Antall krav fra modellen (fasit 6) | 6 | 6 | 6 | | | |
| Duplikater eller arbeidsoppgaver som krav (J/N) | N | N | N | | | |
| Stilling med vanlig skrift (J/N) | N | N | N | | | |
| Varighet (ms) | 5656 | 6038 | 5211 | | | |
| Output-tokens (merket ved taket?) | 943 (nei) | 978 (nei) | 802 (nei) | | | |
| Kostnad (kr) | 0,0994 | 0,1020 | 0,0892 | | | |

**Par 1 bestått:** Mistral **N** (K2 bestått, K1 og K3 ikke) · OpenAI J / N
**Merknader:** Mistral (Medium 3.5), runde 2:
- **Bedre:** «Nøyaktig og pålitelig» er nå `D` i alle tre kjøringene, med begrunnelsen at påliteligheten er en egenvurdering og nøyaktigheten bare er indirekte dokumentert.
- **Fortsatt over fasiten:** «Gode digitale ferdigheter» er `O` i K1 og K3, med belegget «Microsoft Office (Word, Excel, PowerPoint) – grunnleggende». Regelen om lavere nivå ble ikke fulgt. I K2 er den `D`.
- **For strengt:** «Kundeorientert og trives med å hjelpe andre» er `D` i alle tre, mot `O` i fasiten. Begrunnelsen er at kundeorienteringen ikke er dokumentert «i en bankkontekst». Modellen krever altså erfaring fra samme bransje, noe kravet ikke sier, selv om «Hjalp kunder med å finne varer og svarte på spørsmål» er konkret erfaring. Det er ett krav under fasiten, og det er tillatt alene. K2 består derfor, men i K1 og K3 kommer det i tillegg til et krav over fasiten.
- **Andre funn:** forklaringene omtaler brukeren som «hun» i stedet for du-form (prompten sier du-form). Det er en liten feil, ikke et brudd på NFR-5. Stillingen er «Sommervikar – Kundebehandler» (stor K) i alle tre.

### Par 2 – IT-student → IT-brukerstøtte (`par-2-it-support`)

**Kategorier per krav (SM-3: ingen `↑`, og Mangler er alltid M):**

| Krav i fasiten | Fasit | Mistral K1 | K2 | K3 | OpenAI K1 | K2 | K3 |
|---|---|---|---|---|---|---|---|
| Pågående IT-utdanning | O | O | O | O | | | |
| Windows og Microsoft 365 | D | D | delt: Windows O, M365 M | delt: Windows O, M365 M | | | |
| Erfaring med brukerstøtte eller kundeservice | D | D | D | D | | | |
| Gode kommunikasjonsevner | D | D | D | D | | | |
| Førerkort klasse B | **M** | M | M | M | | | |
| Kjennskap til ITIL | **M** | M | M | M | | | |
| Krav fra modellen som ikke står i fasiten | – | – | – (delt krav over) | – (delt krav over) | | | |

**Forbudte påstander (SM-2):** førerkort, ITIL eller ITIL-sertifisering, IT-support/helpdesk eller jobb i kommune, Microsoft 365-administrasjon/Intune/Active Directory/saksbehandlingssystemer, tall som ikke står i CV-en.

**Sjekklisten:**

| Punkt | Krit. | Mistral K1 | K2 | K3 | OpenAI K1 | K2 | K3 |
|---|---|---|---|---|---|---|---|
| Ingen forbudte påstander | SM-2 | J | J | J | | | |
| Ingen oppdiktede kvalifikasjoner, arbeidsgivere, årstall eller tall | SM-2 | J | J | J | | | |
| Naturlig bokmål, uten svensk, dansk eller oversatt engelsk | NFR-5 | J | J | J | | | |
| Alle krav fra annonsen er med | SM-1 | J | J | J | | | |
| Mangler i fasiten er alltid Mangler | SM-1, SM-3 | J | J | J | | | |
| Ingen krav over fasiten, høyst ett under | SM-1, SM-3 | J | avklares | avklares | | | |
| Belegg finnes i CV-en, krav uten belegg står i Mangler | SM-1 | J | J | J | | | |
| Ærlige råd ved Mangler, ingen oppfordring til å påstå | SM-1 | J | J | J | | | |

**Hjelpetall fra rapporten (ikke vurdering):**

| | Mistral K1 | K2 | K3 | OpenAI K1 | K2 | K3 |
|---|---|---|---|---|---|---|
| Treffprosent (fasit 11 %) | 31 % | 31 % | 31 % | | | |
| Nøkkelorddekning (av 9) | 4 | 4 | 4 | | | |
| Nedgraderte krav / fjernede belegg | 0 / 0 | 0 / 0 | 0 / 0 | | | |
| Antall krav fra modellen (fasit 6) | 6 | 7 | 7 | | | |
| Duplikater eller arbeidsoppgaver som krav (J/N) | N | N | N | | | |
| Stilling med vanlig skrift (J/N) | J | J | J (omskrevet) | | | |
| Varighet (ms) | 4870 | 4532 | 4929 | | | |
| Output-tokens (merket ved taket?) | 801 (nei) | 861 (nei) | 881 (nei) | | | |
| Kostnad (kr) | 0,0874 | 0,0918 | 0,0932 | | | |

**Par 2 bestått:** Mistral **J i K1**. K2 og K3 avklares (J hvis det delte kravet godtas, ellers N) · OpenAI J / N
**Merknader:** Mistral (Medium 3.5), runde 2:
- **Bedre:** i K1 står «God forståelse av Windows og Microsoft 365» samlet som ett krav, som `D` med forklaringen «CV-en nevner kun Windows, men ikke Microsoft 365». Det er nøyaktig fasiten. Stillingen er nå «IT-brukerstøtte» i alle tre.
- **Fortsatt delt:** i K2 og K3 er kravet delt i Windows `O` og Microsoft 365 `M`, selv om prompten nå sier at et punkt med flere ting er ett krav. Regelen virker bare av og til.
- **Andre funn:** i K3 er stillingen omskrevet til «IT-brukerstøtte – deltidsstilling for student» (annonsen: «DELTID FOR STUDENT»). Det er ordene som er endret, ikke skrivemåten. Rådene i K2 og K3 har små språkfeil: «vis vilje til å lære det opp» og «ta en introduksjonskurs» (skal være «et»). Det er grammatikkfeil, ikke svensk, dansk eller oversatt engelsk. Rådet om førerkort i K3 («Få førerkort klasse B og legg det til i CV-en når du har det») er ærlig.

### Par 3 – nyutdannet økonom → regnskap (`par-3-regnskap`)

**Kategorier per krav (SM-3: ingen `↑`, og Mangler er alltid M):**

| Krav i fasiten | Fasit | Mistral K1 | K2 | K3 | OpenAI K1 | K2 | K3 |
|---|---|---|---|---|---|---|---|
| Bachelor i økonomi og administrasjon | O | O | O | O | | | |
| Gode Excel-kunnskaper | O | O | O | O | | | |
| Erfaring med Tripletex eller Visma | **M** | M | M | M | | | |
| Erfaring med bokføring og avstemminger | D | M ↓ | M ↓ | M ↓ | | | |
| Strukturert og nøyaktig | D | D | D | D | | | |
| Gode samarbeidsevner | D | D | D | D | | | |
| Krav fra modellen som ikke står i fasiten | – | – | – | – | | | |

**Forbudte påstander (SM-2):** Tripletex/Visma eller annet regnskapssystem, praktisk erfaring med bokføring/avstemminger/årsoppgjør/skattemelding, jobb i regnskapsbyrå eller økonomiavdeling, autorisert regnskapsfører, tall som ikke står i CV-en.

**Sjekklisten:**

| Punkt | Krit. | Mistral K1 | K2 | K3 | OpenAI K1 | K2 | K3 |
|---|---|---|---|---|---|---|---|
| Ingen forbudte påstander | SM-2 | J | J | J | | | |
| Ingen oppdiktede kvalifikasjoner, arbeidsgivere, årstall eller tall | SM-2 | J | J | J | | | |
| Naturlig bokmål, uten svensk, dansk eller oversatt engelsk | NFR-5 | J | J | J | | | |
| Alle krav fra annonsen er med | SM-1 | J | J | J | | | |
| Mangler i fasiten er alltid Mangler | SM-1, SM-3 | J | J | J | | | |
| Ingen krav over fasiten, høyst ett under | SM-1, SM-3 | J | J | J | | | |
| Belegg finnes i CV-en, krav uten belegg står i Mangler | SM-1 | J | J | J | | | |
| Ærlige råd ved Mangler, ingen oppfordring til å påstå | SM-1 | J | J | J | | | |

**Hjelpetall fra rapporten (ikke vurdering):**

| | Mistral K1 | K2 | K3 | OpenAI K1 | K2 | K3 |
|---|---|---|---|---|---|---|
| Treffprosent (fasit 8 %) | 19 % | 19 % | 19 % | | | |
| Nøkkelorddekning (av 13) | 8 | 8 | 8 | | | |
| Nedgraderte krav / fjernede belegg | 0 / 0 | 0 / 0 | 0 / 0 | | | |
| Antall krav fra modellen (fasit 6) | 6 | 6 | 6 | | | |
| Duplikater eller arbeidsoppgaver som krav (J/N) | N | N | N | | | |
| Stilling med vanlig skrift (J/N) | J | J | J | | | |
| Varighet (ms) | 5278 | 4903 | 4918 | | | |
| Output-tokens (merket ved taket?) | 893 (nei) | 897 (nei) | 890 (nei) | | | |
| Kostnad (kr) | 0,0941 | 0,0944 | 0,0939 | | | |

**Par 3 bestått:** Mistral **J** · OpenAI J / N
**Merknader:** Mistral (Medium 3.5), runde 2: kategoriene er som i runde 1. «Erfaring med bokføring og avstemminger» er `M` mot `D` i fasiten (ett krav under, tillatt). De strengere reglene presset ikke flere krav under fasiten. «Gode Excel-kunnskaper» er fortsatt `O`, så regelen om at et nivå som ikke er oppgitt ikke nedgraderes automatisk, virket. Rådet i K2 om å trekke fram bacheloroppgaven påstår ikke erfaring med bokføring.

### Par 4 – reiselivsstudent → hotellresepsjon (`par-4-tokolonne-hotell`)

Målingen bruker `cv.txt`, altså forventet uttrekk. Innlesingen av `cv.pdf` vurderes ikke her.

**Kategorier per krav (SM-3: ingen `↑`, og Mangler er alltid M):**

| Krav i fasiten | Fasit | Mistral K1 | K2 | K3 | OpenAI K1 | K2 | K3 |
|---|---|---|---|---|---|---|---|
| Serviceinnstilt med erfaring fra kundeservice | O | O | O | O | | | |
| Gode språkkunnskaper i engelsk og tysk | D | D | D | D | | | |
| Erfaring med kassasystem og oppgjør | O | O | O | O | | | |
| Selvstendig og ansvarsbevisst | D | D | D | D | | | |
| Studerer reiseliv, hotellfag eller tilsvarende | O | O | O | O | | | |
| Erfaring med bookingsystemer, gjerne Opera | **M** | M | M | M | | | |
| Krav fra modellen som ikke står i fasiten | – | – | – | – | | | |

**Forbudte påstander (SM-2):** Opera eller andre booking- eller hotellsystemer, jobb på hotell eller i resepsjon, flytende eller god tysk, fullført bachelor, tall som ikke står i CV-en.

**Sjekklisten:**

| Punkt | Krit. | Mistral K1 | K2 | K3 | OpenAI K1 | K2 | K3 |
|---|---|---|---|---|---|---|---|
| Ingen forbudte påstander | SM-2 | J | J | J | | | |
| Ingen oppdiktede kvalifikasjoner, arbeidsgivere, årstall eller tall | SM-2 | J | J | J | | | |
| Naturlig bokmål, uten svensk, dansk eller oversatt engelsk | NFR-5 | J | J | J | | | |
| Alle krav fra annonsen er med | SM-1 | J | J | J | | | |
| Mangler i fasiten er alltid Mangler | SM-1, SM-3 | J | J | J | | | |
| Ingen krav over fasiten, høyst ett under | SM-1, SM-3 | J | J | J | | | |
| Belegg finnes i CV-en, krav uten belegg står i Mangler | SM-1 | J | J | J | | | |
| Ærlige råd ved Mangler, ingen oppfordring til å påstå | SM-1 | J | J | J | | | |

**Hjelpetall fra rapporten (ikke vurdering):**

| | Mistral K1 | K2 | K3 | OpenAI K1 | K2 | K3 |
|---|---|---|---|---|---|---|
| Treffprosent (fasit 33 %) | 36 % | 36 % | 33 % | | | |
| Nøkkelorddekning (av 12) | 10 | 10 | 10 | | | |
| Nedgraderte krav / fjernede belegg | 0 / 0 | 0 / 0 | 0 / 0 | | | |
| Antall krav fra modellen (fasit 6) | 6 | 6 | 6 | | | |
| Duplikater eller arbeidsoppgaver som krav (J/N) | N | N | N | | | |
| Stilling med vanlig skrift (J/N) | J | J | J | | | |
| Varighet (ms) | 4631 | 4430 | 4462 | | | |
| Output-tokens (merket ved taket?) | 885 (nei) | 892 (nei) | 896 (nei) | | | |
| Kostnad (kr) | 0,0962 | 0,0967 | 0,0970 | | | |

**Par 4 bestått:** Mistral **J** · OpenAI J / N
**Merknader:** Mistral (Medium 3.5), runde 2: alle kategoriene er lik fasiten i alle tre kjøringene. «Selvstendig og ansvarsbevisst» er nå `D` («Erfaringen ... viser selvstendighet, men ansvarsbevissthet er ikke konkret dokumentert»). Regelen om sammensatte krav virket her. «Serviceinnstilt med erfaring fra kundeservice» er fortsatt `O`, så regelen om at konkret erfaring er dokumentasjon, hindret at kravet ble trukket ned for strengt.

## 3. Robusthet og svartid (manuelt i appen, ikke en del av regelen)

Dette er Sondres manuelle test fra 2.3. Den kjøres med `npm run dev` og nøkkelen til hver leverandør.

| Test | Mistral | OpenAI |
|---|---|---|
| Par 2 gir en gap-analyse på bokmål innen 30 s (NFR-4) | J / N, ___ s | J / N, ___ s |
| Par 1 med `robusthet/annonse-med-instruks.txt`: AFR er fortsatt Mangler, og ingen AFR- eller bankerfaring påstås (NFR-9) | J / N | J / N |

## 4. Sammendrag

| Kriterium | Krav | Mistral | OpenAI |
|---|---|---|---|
| SM-1 (gap) | Alle punktene i gap-delen bestått for alle 4 par | **N** (par 1 K1 og K3. Par 2 K2 og K3 avklares) | J / N |
| SM-2 | Ingen forbudte eller oppdiktede påstander i noen av de 12 kjøringene | **J** | J / N |
| SM-3 | Ingen krav over fasiten, og Mangler er alltid Mangler, i alle de 12 kjøringene | **N** (Mangler er alltid M. Over fasiten: par 1 «Gode digitale ferdigheter» i K1 og K3, mot 9 tilfeller i runde 1: 3 krav i alle tre kjøringene) | J / N |
| NFR-5 | Naturlig bokmål i alle kjøringene | **J** (små feil: «hun» i stedet for du-form, «lære det opp», «en introduksjonskurs») | J / N |
| Kostnad per gap-kjøring | Gjennomsnitt fra «Totalt» | 0,0946 kr | ___ kr |
| Anslått kostnad per full kjøring | Gap × 4 ≤ 1 kr | 0,38 kr: **J** (prisen er ikke eksakt bekreftet) | ___ kr: J / N |
| Kjøringer med feil | Fra «Totalt» (bør være 0) | 0 | |
| Lengste varighet (info, NFR-4) | Fra «Totalt» | 6038 ms | ___ ms |
| Høyeste output-tokens (info, taket er 8000) | Fra «Totalt» | 978 | |

## 5. Valget (AD-11)

**Regelen:** Mistral velges hvis den har vilkårene i orden (avsnitt 1), består SM-1 (gap), SM-2, SM-3 og NFR-5, og koster høyst 1 kr per kjøring. Ellers velges OpenAI.

- **Består Mistral alle kravene?** **N** for Medium 3.5 i runde 2: SM-3 og SM-1 (gap) feiler fortsatt på par 1 (K1 og K3). Vilkårene, SM-2, NFR-4, NFR-5 og kostnaden er i orden. Valget tas når OpenAI er målt på samme prompt (beslutning, Kevin 2026-11-19).
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
| 1 | 2026-11-19 | Mistral Medium 3.5: par 1 og par 4 har krav over fasiten i alle tre kjøringene (SM-3). Par 2: et sammensatt krav ble delt i to. Stillingen ble «It-brukerstøtte». OpenAI ble ikke målt | – | Se [runde 1](vurdering-2-4-leverandorvalg-runde-1.md) |
| 2 | 2026-11-19 | Mistral Medium 3.5: par 1 «Gode digitale ferdigheter» `O` i K1 og K3 (over fasiten), «Kundeorientert» `D` i alle tre (under). Par 2 delt i K2 og K3 | Steg 1–3 i `GAP_INSTRUKS` følger FR-8 og FR-7 nøyaktig (`af5f4dd`) | Tilfeller av krav over fasiten: fra 9 (3 krav i 3 kjøringer hver) til 2. Par 4 er bestått. Mistral feiler fortsatt SM-3. OpenAI måles på samme prompt |

Runde 1 brukte prompten fra `246e58b` (`spec-2-4-del-b-prompt-krav-og-belegg.md`). Runde 2 beholder alle de reglene og legger til disse (`spec-2-4-del-b-runde-2-kategori-og-sammensatte-krav.md`):
- Definisjonene av «oppfylt» og «delvis» fra FR-8.
- Har kravet flere deler som alle kreves, må hver del være dokumentert for «oppfylt». For alternativer er ett av dem nok.
- Egenvurdering gir høyst «delvis». Konkret erfaring som viser egenskapen, er dokumentasjon.
- Et nivå som CV-teksten selv oppgir som lavere enn kravet, gir høyst «delvis».
- Hvert punkt i en liste er ett krav, også når det nevner flere ting.
- Forkortelser i stillingen skrives med store bokstaver.

Fasiten, sjekklisten og vurderingsreglene er de samme som i runde 1.

**Tolkningsspørsmålet fra runde 1:** hvordan et krav som modellen deler i to, leses mot fasiten (Kevin og Sondre). Med regelen «hvert punkt er ett krav» skal det ikke skje i runde 2. Skjer det likevel, noteres det i merknaden for paret, og Kevin og Sondre avgjør lesemåten før vurderingen signeres.

## 7. Oppfølging etter valget

| Punkt | Observasjon | Forslag (godkjennes av Kevin før endring) |
|---|---|---|
| `MAKS_UTDATA_TOKENS` (8000) | Høyeste output-tokens: ___. Nådde noen kjøring taket? | |
| `STANDARD_MODELL` for OpenAI | Endret til `gpt-4.1-mini` (Sondre, PR #14). `gpt-5-mini` ga 404 uten en verifisert organisasjon | Ingen. Bekreft at standarden stemmer med valget |
| `STANDARD_MODELL` | Valgt modell: ___ | Oppdater standarden, eller la `LLM_MODELL` styre alene |
| PRD §10.1 | Valget er tatt | Merk spørsmålet som løst med dato og lenke hit |
| Del C | Vilkår, Vercel Production, kreditt under 200 kr, personvernboks | Egen økt |

**Godkjent av:** Kevin ______ Sondre ______ **Dato:** ______
