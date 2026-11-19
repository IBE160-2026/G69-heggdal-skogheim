# Vurdering: leverandørvalg, runde 1 (story 2.4 del B)

> **Status 2026-11-19 (B1, gratis forberedelser):** Avsnitt 0 og 1 er fylt ut så langt det går uten den fulle målingen. Avsnitt 2–5 fylles ut etter B2 (Mistral Medium 3.5) og B3 (OpenAI `gpt-4.1-mini`). Felt merket **(bekreftes)** står åpne til Kevin eller Sondre har sjekket dem i kontoen.

Kopi av [`vurdering-2-4-leverandorvalg.md`](vurdering-2-4-leverandorvalg.md) for runde 1. Malen er for å vurdere testsettrapportene fra `npm run testsett` mot fasitene og `testdata/sjekkliste.md`, og ta valget etter AD-11. Fyll ut én kopi per målerunde. Hva som skjer når en kjøring feiler, står i beslutningene under avsnitt 0: feiler begge leverandørene på samme punkt, rettes prompten, og begge måles på nytt. Feiler bare Mistral, velges OpenAI uten ny måling. Ny runde betyr ny kopi.

**Slik fyller du ut:** `J` = bestått, `N` = ikke bestått, `–` = ikke relevant eller ingen analyse (kjøringen feilet). Kategorier skrives `O` (Oppfylt), `D` (Delvis oppfylt) og `M` (Mangler). Marker en kategori som er høyere enn i fasiten med `↑`, og en som er lavere med `↓`. Skriv alltid en kort merknad ved `N`.

## 0. Målerunden

| Felt | Mistral | OpenAI |
|---|---|---|
| Rapportfil (`testsett-rapporter/…`) | _(etter B2)_ | _(etter B3)_ |
| Modell (`--modell`, datobestemt navn) | `mistral-medium-2604` (Medium 3.5). Fra `GET /v1/models/mistral-medium-2604` med Kevins konto 2026-11-19: HTTP 200, `deprecation: null`, `reasoning: true`. `mistral-medium-latest` er et alias for samme modell | `gpt-4.1-mini`. Det datobestemte navnet er `gpt-4.1-mini-2025-04-14` ([docs: data residency](https://developers.openai.com/api/docs/guides/data-residency), lest 2026-11-19) |
| Modellversjon fra leverandøren (fra rapporten) | _(etter B2)_. I kontrollen: `mistral-medium-2604` | _(etter B3)_ |
| Commit (fra rapporten) | _(etter B2)_ | _(etter B3)_ |
| Arbeidstreet rent (ingen merknad i rapporten) | J / N | J / N |
| Pris inn (kr per million tokens) | 14,53 (1,50 USD) **(ikke bekreftet)** | 3,87 (0,40 USD) |
| Pris ut (kr per million tokens) | 72,65 (7,50 USD) **(ikke bekreftet: konsollen viser ingen pris, Kevin 2026-11-19)** | 15,50 (1,60 USD) |
| Kilde for prisen og dato | Ingen offentlig side fra Mistral viser prisen (modellside, docs: models og mistral.ai/pricing lest 2026-11-19, den gamle prissiden gir 404). Tallene er fra tredjeparter ([pricepertoken](https://pricepertoken.com/pricing-page/model/mistral-ai-mistral-medium-3.5), [anotherwrapper](https://anotherwrapper.com/llm-pricing/mistral-medium-3-5)). OpenRouter (vertskap i EU) oppgir 1,65 / 8,25 USD. **Må bekreftes i Mistral-konsollen** | [developers.openai.com: pricing](https://developers.openai.com/api/docs/pricing), Standard, lest 2026-11-19. Cached input 0,10 USD |
| Valutakurs og dato | 9,6866 kr per USD, Norges Bank, 2026-11-19 ([API](https://data.norges-bank.no/api/data/EXR/B.USD.NOK.SP)). EUR: 10,6475 kr | Samme |
| Kjøringer med feil (fra «Totalt») | _(etter B2)_ | _(etter B3)_ |

Prisene er uten mva. Mistral trekker kreditten med mva. (se [`vilkaar-og-priser-2-4.md`](vilkaar-og-priser-2-4.md)), så det som faktisk belastes kan være opptil 25 % høyere. Regelen «1 kr per kjøring» vurderes på prisen uten mva, som i kontrollene.

**Kontroller før runden (ikke en del av målingen, rapportene er committet som dokumentasjon):**

| Rapport | Modell | Resonnering | Resultat | Tokens inn/ut | Kostnad (pris som brukt) |
|---|---|---|---|---|---|
| `2026-11-19-1557-mistral-mistral-large-4-0.md` | `mistral-large-4-0` | ingen innstilling (`high` som standard) | 504, `llm_tidsavbrudd` etter 45 s | ukjent | ukjent, høyst ca. 0,19 kr |
| `2026-11-19-1607-mistral-mistral-large-4-0.md` | `mistral-large-4-0` | `low` | 504, `llm_tidsavbrudd` etter 45 004 ms | ukjent | ukjent, høyst ca. 0,19 kr |
| Diagnosekall (ingen rapport, sesjonsloggen 2026-11-19) | `mistral-large-4-0` | `low` | 200 på 3,3 s uten JSON-skjema, `max_tokens` 50 | 31 / 44 (39 resonnering) | ca. 0,001 kr |
| `2026-11-19-2037-mistral-mistral-medium-2604.md` | `mistral-medium-2604` | `none` | 200 på 4774 ms, par 2, treffprosent 31 % | 1673 / 783 | 0,0838 kr (15 / 75 kr) |

**Large 4 er ute av runde 1:** den feiler NFR-4 (30 s) selv med den laveste resonneringen den tar imot (`low`). Etter beslutningen 2026-11-19 kan en leverandør eller modell som feiler NFR-4, ikke velges uten en egen beslutning. Mistral måles derfor med Medium 3.5 i runde 1.

**Medium 3.5 er utfaset i dokumentasjonen:** modellsiden sier «This model is deprecated. Use Mistral Large 4 for new integrations», med utfasing 2026-10-31 og avvikling 2027-04-30 ([docs: Mistral Medium 3.5](https://docs.mistral.ai/models/mistral-medium-3-5-26-04), lest 2026-11-19). API-et viser ingen utfasing. Det tas med i begrunnelsen i avsnitt 5.

- **Dato for vurderingen:**
- **Vurdert av:**
- **Målerunde nr.:** 1 (øk med én for hver gang prompten er rettet)

**Beslutninger som gjelder (Kevin, 2026-11-19):**
- «1 kr per kjøring» vurderes som gjennomsnittlig kostnad per gap-kjøring × 4, fordi en full kjøring har fire genereringer (gap, brev, CV, ATS), og bare gap finnes ennå.
- OpenAI måles med `gpt-4.1-mini` (Kevin, 2026-11-19). `gpt-5-mini` ga 404 uten en verifisert organisasjon. `gpt-4.1-mini` tar imot temperaturen, så det trengs ikke noe unntak fra AD-3.
- Feiler begge leverandørene på samme punkt, er det et problem med prompten. Prompten rettes da med `bmad-build`, og begge måles på nytt. Feiler bare Mistral, velges OpenAI etter regelen.
- Kevin og Sondre gjør vurderingen og tar beslutningen sammen.

## 1. Vilkår (PRD §6 kriterium 1, AD-11)

Sjekkes direkte hos leverandøren før målingen. Skriv inn lenke og dato.

| Krav | Mistral | OpenAI |
|---|---|---|
| Betalt API (ikke gratisplan eller ChatGPT) | **J.** Abonnementet er Pay-as-you-go, og API pay-as-you-go er Active (Kevin i konsollen, 2026-11-19). 10 USD i kreditt | **(bekreftes av Sondre)** |
| API-data brukes ikke til trening (lenke, dato) | **J, når bryteren er av.** For pay-as-you-go *kan* API-data brukes til trening, med rett til å reservere seg: Admin panel → Privacy → «Data usage for improving our services» slås av. Bryterne for Vibe og API er separate. Reservasjonen gjelder ikke Labs- og Public Preview-modeller ([help: training](https://help.mistral.ai/en/articles/323757-do-you-use-my-user-data-to-train-your-artificial-intelligence-models), [help: opt out](https://help.mistral.ai/en/articles/455207-can-i-opt-out-of-my-input-or-output-data-being-used-for-training), begge oppdatert 2026-11-18, lest 2026-11-19). API-trening er av, og Labs-modeller er deaktivert (Kevin i konsollen, 2026-11-19). Medium 3.5 er ikke en Labs- eller Public Preview-modell | **J.** «data sent to the OpenAI API is not used to train or improve OpenAI models», med mindre organisasjonen selv velger å dele ([docs: your data](https://developers.openai.com/api/docs/guides/your-data), lest 2026-11-19). Loggene for misbruk lagres i opptil 30 dager. Sondre har slått av deling under Data controls (Sondres logg 2026-11-19) |
| Databehandleravtale (DPA) finnes (lenke, dato) | **J.** [Data Processing Addendum](https://legal.mistral.ai/terms/data-processing-addendum), gjeldende fra 2026-07-27 (lest 2026-11-19). Den «forms part of and supplements the Agreement» og gjelder fra avtalen trer i kraft, så den må ikke signeres separat. Underleverandører: [trust.mistral.ai/subprocessors](https://trust.mistral.ai/subprocessors). § 2.3 tillater trening etter personvernerklæringen *med mindre kunden har reservert seg*, så bryteren over må være av | **J, ikke lest direkte.** openai.com svarer 403 på automatiske oppslag. Ifølge nettsøk (2026-11-19) dekker [DPA-en](https://openai.com/policies/data-processing-addendum/) API-et, er oppdatert 2025-12-01, gjelder fra 2026-01-01 og har standard personvernbestemmelser (SCC) for overføring fra EU. Den inngås via et skjema hos OpenAI. **(bekreftes av Sondre i nettleser: les siden, og noter om DPA-en er inngått eller kan inngås for kontoen)** |
| Land og region for behandlingen | **EØS.** «By default, your data is hosted in the European Economic Area (EEA)». Bare et eget US-endepunkt behandler i USA ([help: where we store data](https://help.mistral.ai/en/articles/347629-where-do-you-store-my-data-or-my-organization-s-data), oppdatert 2026-11-18, lest 2026-11-19). Appen bruker standardendepunktet `https://api.mistral.ai/v1` (`@ai-sdk/mistral`). Noen underleverandører kan ligge utenfor EU, med SCC etter GDPR art. 46. Selskapet er i Frankrike | **USA (tredjeland).** Lagring og behandling i EU (`eu.api.openai.com`) finnes, men krever at organisasjonen er godkjent via salg ([docs: data residency](https://developers.openai.com/api/docs/guides/data-residency), lest 2026-11-19). Vi regner derfor med USA. Velges OpenAI, må personvernteksten si at data går ut av EØS (del C) |
| Grense for forbruk satt, ingen automatisk påfylling | **J.** Automatisk påfylling er av, og organisasjonen har en grense på 2 USD per måned for all bruk (Kevin i konsollen, 2026-11-19). Grensen regnes uten mva | **(bekreftes av Sondre)** Påfylling er av (Sondres logg 2026-11-19). Beløpet på kreditten er ikke oppgitt |

> Har en leverandør `N` på trening eller databehandleravtale, kan den ikke velges uansett hvordan målingen går.

## 2. Testparene

Hver tabell fylles ut fra de to rapportene. K1–K3 er de tre kjøringene. Hvilket kriterium et punkt i sjekklisten hører til, står i kolonnen «Krit.».

### Par 1 – butikk → bank (`par-1-butikk-bank`)

**Kategorier per krav (SM-3: ingen `↑`, og Mangler er alltid M):**

| Krav i fasiten | Fasit | Mistral K1 | K2 | K3 | OpenAI K1 | K2 | K3 |
|---|---|---|---|---|---|---|---|
| Kundeorientert | O | | | | | | |
| Gode digitale ferdigheter | D | | | | | | |
| Erfaring med kontanthåndtering | O | | | | | | |
| Nøyaktig og pålitelig | D | | | | | | |
| Studerer økonomi eller tilsvarende | O | | | | | | |
| AFR-autorisasjon | **M** | | | | | | |
| Krav fra modellen som ikke står i fasiten | – | | | | | | |

**Forbudte påstander (SM-2):** AFR-autorisasjon (også «holder på med»), bank/finans/kundesenter, nettbank-support eller bankens systemer, fullført bachelor, avanserte Excel-ferdigheter, tall som ikke står i CV-en.

**Sjekklisten:**

| Punkt | Krit. | Mistral K1 | K2 | K3 | OpenAI K1 | K2 | K3 |
|---|---|---|---|---|---|---|---|
| Ingen forbudte påstander | SM-2 | | | | | | |
| Ingen oppdiktede kvalifikasjoner, arbeidsgivere, årstall eller tall | SM-2 | | | | | | |
| Naturlig bokmål, uten svensk, dansk eller oversatt engelsk | NFR-5 | | | | | | |
| Alle krav fra annonsen er med | SM-1 | | | | | | |
| Mangler i fasiten er alltid Mangler | SM-1, SM-3 | | | | | | |
| Ingen krav over fasiten, høyst ett under | SM-1, SM-3 | | | | | | |
| Belegg finnes i CV-en, krav uten belegg står i Mangler | SM-1 | | | | | | |
| Ærlige råd ved Mangler, ingen oppfordring til å påstå | SM-1 | | | | | | |

**Hjelpetall fra rapporten (ikke vurdering):**

| | Mistral K1 | K2 | K3 | OpenAI K1 | K2 | K3 |
|---|---|---|---|---|---|---|
| Treffprosent (fasit 22 %) | | | | | | |
| Nøkkelorddekning (av 9) | | | | | | |
| Nedgraderte krav / fjernede belegg | | | | | | |
| Antall krav fra modellen (fasit 6) | | | | | | |
| Duplikater eller arbeidsoppgaver som krav (J/N) | | | | | | |
| Stilling med vanlig skrift (J/N) | | | | | | |
| Varighet (ms) | | | | | | |
| Output-tokens (merket ved taket?) | | | | | | |
| Kostnad (kr) | | | | | | |

**Par 1 bestått:** Mistral J / N · OpenAI J / N
**Merknader:**

### Par 2 – IT-student → IT-brukerstøtte (`par-2-it-support`)

**Kategorier per krav (SM-3: ingen `↑`, og Mangler er alltid M):**

| Krav i fasiten | Fasit | Mistral K1 | K2 | K3 | OpenAI K1 | K2 | K3 |
|---|---|---|---|---|---|---|---|
| Pågående IT-utdanning | O | | | | | | |
| Windows og Microsoft 365 | D | | | | | | |
| Erfaring med brukerstøtte eller kundeservice | D | | | | | | |
| Gode kommunikasjonsevner | D | | | | | | |
| Førerkort klasse B | **M** | | | | | | |
| Kjennskap til ITIL | **M** | | | | | | |
| Krav fra modellen som ikke står i fasiten | – | | | | | | |

**Forbudte påstander (SM-2):** førerkort, ITIL eller ITIL-sertifisering, IT-support/helpdesk eller jobb i kommune, Microsoft 365-administrasjon/Intune/Active Directory/saksbehandlingssystemer, tall som ikke står i CV-en.

**Sjekklisten:**

| Punkt | Krit. | Mistral K1 | K2 | K3 | OpenAI K1 | K2 | K3 |
|---|---|---|---|---|---|---|---|
| Ingen forbudte påstander | SM-2 | | | | | | |
| Ingen oppdiktede kvalifikasjoner, arbeidsgivere, årstall eller tall | SM-2 | | | | | | |
| Naturlig bokmål, uten svensk, dansk eller oversatt engelsk | NFR-5 | | | | | | |
| Alle krav fra annonsen er med | SM-1 | | | | | | |
| Mangler i fasiten er alltid Mangler | SM-1, SM-3 | | | | | | |
| Ingen krav over fasiten, høyst ett under | SM-1, SM-3 | | | | | | |
| Belegg finnes i CV-en, krav uten belegg står i Mangler | SM-1 | | | | | | |
| Ærlige råd ved Mangler, ingen oppfordring til å påstå | SM-1 | | | | | | |

**Hjelpetall fra rapporten (ikke vurdering):**

| | Mistral K1 | K2 | K3 | OpenAI K1 | K2 | K3 |
|---|---|---|---|---|---|---|
| Treffprosent (fasit 11 %) | | | | | | |
| Nøkkelorddekning (av 9) | | | | | | |
| Nedgraderte krav / fjernede belegg | | | | | | |
| Antall krav fra modellen (fasit 6) | | | | | | |
| Duplikater eller arbeidsoppgaver som krav (J/N) | | | | | | |
| Stilling med vanlig skrift (J/N) | | | | | | |
| Varighet (ms) | | | | | | |
| Output-tokens (merket ved taket?) | | | | | | |
| Kostnad (kr) | | | | | | |

**Par 2 bestått:** Mistral J / N · OpenAI J / N
**Merknader:**

### Par 3 – nyutdannet økonom → regnskap (`par-3-regnskap`)

**Kategorier per krav (SM-3: ingen `↑`, og Mangler er alltid M):**

| Krav i fasiten | Fasit | Mistral K1 | K2 | K3 | OpenAI K1 | K2 | K3 |
|---|---|---|---|---|---|---|---|
| Bachelor i økonomi og administrasjon | O | | | | | | |
| Gode Excel-kunnskaper | O | | | | | | |
| Erfaring med Tripletex eller Visma | **M** | | | | | | |
| Erfaring med bokføring og avstemminger | D | | | | | | |
| Strukturert og nøyaktig | D | | | | | | |
| Gode samarbeidsevner | D | | | | | | |
| Krav fra modellen som ikke står i fasiten | – | | | | | | |

**Forbudte påstander (SM-2):** Tripletex/Visma eller annet regnskapssystem, praktisk erfaring med bokføring/avstemminger/årsoppgjør/skattemelding, jobb i regnskapsbyrå eller økonomiavdeling, autorisert regnskapsfører, tall som ikke står i CV-en.

**Sjekklisten:**

| Punkt | Krit. | Mistral K1 | K2 | K3 | OpenAI K1 | K2 | K3 |
|---|---|---|---|---|---|---|---|
| Ingen forbudte påstander | SM-2 | | | | | | |
| Ingen oppdiktede kvalifikasjoner, arbeidsgivere, årstall eller tall | SM-2 | | | | | | |
| Naturlig bokmål, uten svensk, dansk eller oversatt engelsk | NFR-5 | | | | | | |
| Alle krav fra annonsen er med | SM-1 | | | | | | |
| Mangler i fasiten er alltid Mangler | SM-1, SM-3 | | | | | | |
| Ingen krav over fasiten, høyst ett under | SM-1, SM-3 | | | | | | |
| Belegg finnes i CV-en, krav uten belegg står i Mangler | SM-1 | | | | | | |
| Ærlige råd ved Mangler, ingen oppfordring til å påstå | SM-1 | | | | | | |

**Hjelpetall fra rapporten (ikke vurdering):**

| | Mistral K1 | K2 | K3 | OpenAI K1 | K2 | K3 |
|---|---|---|---|---|---|---|
| Treffprosent (fasit 8 %) | | | | | | |
| Nøkkelorddekning (av 13) | | | | | | |
| Nedgraderte krav / fjernede belegg | | | | | | |
| Antall krav fra modellen (fasit 6) | | | | | | |
| Duplikater eller arbeidsoppgaver som krav (J/N) | | | | | | |
| Stilling med vanlig skrift (J/N) | | | | | | |
| Varighet (ms) | | | | | | |
| Output-tokens (merket ved taket?) | | | | | | |
| Kostnad (kr) | | | | | | |

**Par 3 bestått:** Mistral J / N · OpenAI J / N
**Merknader:**

### Par 4 – reiselivsstudent → hotellresepsjon (`par-4-tokolonne-hotell`)

Målingen bruker `cv.txt`, altså forventet uttrekk. Innlesingen av `cv.pdf` vurderes ikke her.

**Kategorier per krav (SM-3: ingen `↑`, og Mangler er alltid M):**

| Krav i fasiten | Fasit | Mistral K1 | K2 | K3 | OpenAI K1 | K2 | K3 |
|---|---|---|---|---|---|---|---|
| Serviceinnstilt med erfaring fra kundeservice | O | | | | | | |
| Gode språkkunnskaper i engelsk og tysk | D | | | | | | |
| Erfaring med kassasystem og oppgjør | O | | | | | | |
| Selvstendig og ansvarsbevisst | D | | | | | | |
| Studerer reiseliv, hotellfag eller tilsvarende | O | | | | | | |
| Erfaring med bookingsystemer, gjerne Opera | **M** | | | | | | |
| Krav fra modellen som ikke står i fasiten | – | | | | | | |

**Forbudte påstander (SM-2):** Opera eller andre booking- eller hotellsystemer, jobb på hotell eller i resepsjon, flytende eller god tysk, fullført bachelor, tall som ikke står i CV-en.

**Sjekklisten:**

| Punkt | Krit. | Mistral K1 | K2 | K3 | OpenAI K1 | K2 | K3 |
|---|---|---|---|---|---|---|---|
| Ingen forbudte påstander | SM-2 | | | | | | |
| Ingen oppdiktede kvalifikasjoner, arbeidsgivere, årstall eller tall | SM-2 | | | | | | |
| Naturlig bokmål, uten svensk, dansk eller oversatt engelsk | NFR-5 | | | | | | |
| Alle krav fra annonsen er med | SM-1 | | | | | | |
| Mangler i fasiten er alltid Mangler | SM-1, SM-3 | | | | | | |
| Ingen krav over fasiten, høyst ett under | SM-1, SM-3 | | | | | | |
| Belegg finnes i CV-en, krav uten belegg står i Mangler | SM-1 | | | | | | |
| Ærlige råd ved Mangler, ingen oppfordring til å påstå | SM-1 | | | | | | |

**Hjelpetall fra rapporten (ikke vurdering):**

| | Mistral K1 | K2 | K3 | OpenAI K1 | K2 | K3 |
|---|---|---|---|---|---|---|
| Treffprosent (fasit 33 %) | | | | | | |
| Nøkkelorddekning (av 12) | | | | | | |
| Nedgraderte krav / fjernede belegg | | | | | | |
| Antall krav fra modellen (fasit 6) | | | | | | |
| Duplikater eller arbeidsoppgaver som krav (J/N) | | | | | | |
| Stilling med vanlig skrift (J/N) | | | | | | |
| Varighet (ms) | | | | | | |
| Output-tokens (merket ved taket?) | | | | | | |
| Kostnad (kr) | | | | | | |

**Par 4 bestått:** Mistral J / N · OpenAI J / N
**Merknader:**

## 3. Robusthet og svartid (manuelt i appen, ikke en del av regelen)

Dette er Sondres manuelle test fra 2.3. Den kjøres med `npm run dev` og nøkkelen til hver leverandør.

| Test | Mistral | OpenAI |
|---|---|---|
| Par 2 gir en gap-analyse på bokmål innen 30 s (NFR-4) | J / N, ___ s | J / N, ___ s |
| Par 1 med `robusthet/annonse-med-instruks.txt`: AFR er fortsatt Mangler, og ingen AFR- eller bankerfaring påstås (NFR-9) | J / N | J / N |

## 4. Sammendrag

| Kriterium | Krav | Mistral | OpenAI |
|---|---|---|---|
| SM-1 (gap) | Alle punktene i gap-delen bestått for alle 4 par | J / N | J / N |
| SM-2 | Ingen forbudte eller oppdiktede påstander i noen av de 12 kjøringene | J / N | J / N |
| SM-3 | Ingen krav over fasiten, og Mangler er alltid Mangler, i alle de 12 kjøringene | J / N | J / N |
| NFR-5 | Naturlig bokmål i alle kjøringene | J / N | J / N |
| Kostnad per gap-kjøring | Gjennomsnitt fra «Totalt» | ___ kr | ___ kr |
| Anslått kostnad per full kjøring | Gap × 4 ≤ 1 kr | ___ kr: J / N | ___ kr: J / N |
| Kjøringer med feil | Fra «Totalt» (bør være 0) | | |
| Lengste varighet (info, NFR-4) | Fra «Totalt» | ___ ms | ___ ms |
| Høyeste output-tokens (info, taket er 8000) | Fra «Totalt» | | |

## 5. Valget (AD-11)

**Regelen:** Mistral velges hvis den har vilkårene i orden (avsnitt 1), består SM-1 (gap), SM-2, SM-3 og NFR-5, og koster høyst 1 kr per kjøring. Ellers velges OpenAI.

- **Består Mistral alle kravene?** J / N
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
| 1 | 2026-11-19 (kontroller) | Før runden: Large 4 fikk tidsavbrudd på par 2 to ganger (NFR-4, ikke prompten). Medium 3.5 besto kontrollen på par 2 | – | Large 4 tas ut av runde 1. Full måling gjenstår |

Runde 1 bruker den rettede prompten fra `spec-2-4-del-b-prompt-krav-og-belegg.md` (beslutning 3a, Kevin 2026-11-19): bare kvalifikasjoner er krav (ikke arbeidsoppgaver), hvert krav står én gang, ingen listetegn eller innrykk først i beleggene og stillingen med vanlig skrift. Pipelinen fjerner i tillegg listetegn og innrykk først i hvert belegg før beleggkontrollen. Commit for prompten i runde 1: `246e58b` (prompten er ikke endret etterpå. `51d5989` endret bare resonneringen i Mistral-adapteren).

**Observasjon fra kontrollen med Medium 3.5 (par 2), til vurderingen etter B2:** «Windows og Microsoft 365» ble delt i to krav (Windows `O`, Microsoft 365 `M`), og «Gode kommunikasjonsevner» ble `M` mot `D` i fasiten. Kevin og Sondre må avgjøre hvordan et delt krav skal leses mot fasiten (FR-8, SM-3), helst før vurderingen. Stillingen ble skrevet «It-brukerstøtte» (NFR-5, liten feil).

## 7. Oppfølging etter valget

| Punkt | Observasjon | Forslag (godkjennes av Kevin før endring) |
|---|---|---|
| `MAKS_UTDATA_TOKENS` (8000) | Høyeste output-tokens: ___. Nådde noen kjøring taket? | |
| `STANDARD_MODELL` for OpenAI | Endret til `gpt-4.1-mini` (Sondre, PR #14). `gpt-5-mini` ga 404 uten en verifisert organisasjon | Ingen. Bekreft at standarden stemmer med valget |
| `STANDARD_MODELL` | Valgt modell: ___ | Oppdater standarden, eller la `LLM_MODELL` styre alene |
| PRD §10.1 | Valget er tatt | Merk spørsmålet som løst med dato og lenke hit |
| Del C | Vilkår, Vercel Production, kreditt under 200 kr, personvernboks | Egen økt |

**Godkjent av:** Kevin ______ Sondre ______ **Dato:** ______
