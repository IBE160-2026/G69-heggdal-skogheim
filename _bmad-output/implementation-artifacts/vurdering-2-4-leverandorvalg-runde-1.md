# Vurdering: leverandørvalg, runde 1 (story 2.4 del B)

> **Status 2026-11-19:** B1 (gratis forberedelser) og B2 (full måling av Mistral Medium 3.5, 12 kjøringer, 0 feil, 1,01 kr) er ført inn. Medium 3.5 feiler SM-3 på par 1 og 4 (se avsnitt 2 og 4). OpenAI-kolonnene fylles ut etter B3. Felt merket **(bekreftes)** står åpne til Kevin eller Sondre har sjekket dem i kontoen.

Kopi av [`vurdering-2-4-leverandorvalg.md`](vurdering-2-4-leverandorvalg.md) for runde 1. Malen er for å vurdere testsettrapportene fra `npm run testsett` mot fasitene og `testdata/sjekkliste.md`, og ta valget etter AD-11. Fyll ut én kopi per målerunde. Hva som skjer når en kjøring feiler, står i beslutningene under avsnitt 0: feiler begge leverandørene på samme punkt, rettes prompten, og begge måles på nytt. Feiler bare Mistral, velges OpenAI uten ny måling. Ny runde betyr ny kopi.

**Slik fyller du ut:** `J` = bestått, `N` = ikke bestått, `–` = ikke relevant eller ingen analyse (kjøringen feilet). Kategorier skrives `O` (Oppfylt), `D` (Delvis oppfylt) og `M` (Mangler). Marker en kategori som er høyere enn i fasiten med `↑`, og en som er lavere med `↓`. Skriv alltid en kort merknad ved `N`.

## 0. Målerunden

| Felt | Mistral | OpenAI |
|---|---|---|
| Rapportfil (`testsett-rapporter/…`) | `2026-11-19-2057-mistral-mistral-medium-2604.md` | _(etter B3)_ |
| Modell (`--modell`, datobestemt navn) | `mistral-medium-2604` (Medium 3.5). Fra `GET /v1/models/mistral-medium-2604` med Kevins konto 2026-11-19: HTTP 200, `deprecation: null`, `reasoning: true`. `mistral-medium-latest` er et alias for samme modell | `gpt-4.1-mini`. Det datobestemte navnet er `gpt-4.1-mini-2025-04-14` ([docs: data residency](https://developers.openai.com/api/docs/guides/data-residency), lest 2026-11-19) |
| Modellversjon fra leverandøren (fra rapporten) | `mistral-medium-2604` i alle 12 kjøringene (rapporten merker at den er lik navnet som ble bedt om, som er normalt for et datobestemt navn) | _(etter B3)_ |
| Commit (fra rapporten) | `7231521` (prompten fra `246e58b`) | _(etter B3)_ |
| Arbeidstreet rent (ingen merknad i rapporten) | J (`git status` tom før kjøringen, ingen merknad i rapporten) | J / N |
| Pris inn (kr per million tokens) | 14,53 (1,50 USD) **(ikke bekreftet)** | 3,87 (0,40 USD) |
| Pris ut (kr per million tokens) | 72,65 (7,50 USD) **(ikke bekreftet: konsollen viser ingen pris, Kevin 2026-11-19)** | 15,50 (1,60 USD) |
| Kilde for prisen og dato | Ingen offentlig side fra Mistral viser prisen (modellside, docs: models og mistral.ai/pricing lest 2026-11-19, den gamle prissiden gir 404). Tallene er fra tredjeparter ([pricepertoken](https://pricepertoken.com/pricing-page/model/mistral-ai-mistral-medium-3.5), [anotherwrapper](https://anotherwrapper.com/llm-pricing/mistral-medium-3-5)). OpenRouter (vertskap i EU) oppgir 1,65 / 8,25 USD. **Den faktiske prisen er fortsatt ikke eksakt bekreftet.** Konsollen viser ingen pris (Kevin, 2026-11-19). Usage viste 1 fakturerbart kall og 0,01 USD for kontrollen av `mistral-medium-2604` (1673 inn og 783 ut). Det stemmer med tredjepartsprisen (0,0084 USD), men beløpet er avrundet. Kostnadene i rapporten og her bygger på tredjepartsprisen. Etter B2 kan forbruket under Usage sammenlignes med 12 × ca. 0,0087 USD ≈ 0,10 USD | [developers.openai.com: pricing](https://developers.openai.com/api/docs/pricing), Standard, lest 2026-11-19. Cached input 0,10 USD |
| Valutakurs og dato | 9,6866 kr per USD, Norges Bank, 2026-11-19 ([API](https://data.norges-bank.no/api/data/EXR/B.USD.NOK.SP)). EUR: 10,6475 kr | Samme |
| Kjøringer med feil (fra «Totalt») | 0 av 12 | _(etter B3)_ |

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
| Kundeorientert | O | O | O | O | | | |
| Gode digitale ferdigheter | D | O ↑ | O ↑ | O ↑ | | | |
| Erfaring med kontanthåndtering | O | O | O | O | | | |
| Nøyaktig og pålitelig | D | O ↑ | O ↑ | O ↑ | | | |
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
| Ingen krav over fasiten, høyst ett under | SM-1, SM-3 | N | N | N | | | |
| Belegg finnes i CV-en, krav uten belegg står i Mangler | SM-1 | J | J | J | | | |
| Ærlige råd ved Mangler, ingen oppfordring til å påstå | SM-1 | J | J | J | | | |

**Hjelpetall fra rapporten (ikke vurdering):**

| | Mistral K1 | K2 | K3 | OpenAI K1 | K2 | K3 |
|---|---|---|---|---|---|---|
| Treffprosent (fasit 22 %) | 18 % | 18 % | 18 % | | | |
| Nøkkelorddekning (av 9) | 8 | 6 | 6 | | | |
| Nedgraderte krav / fjernede belegg | 0 / 0 | 0 / 0 | 0 / 0 | | | |
| Antall krav fra modellen (fasit 6) | 6 | 6 | 6 | | | |
| Duplikater eller arbeidsoppgaver som krav (J/N) | N | N | N | | | |
| Stilling med vanlig skrift (J/N) | J | N | N | | | |
| Varighet (ms) | 6617 | 3969 | 3900 | | | |
| Output-tokens (merket ved taket?) | 791 (nei) | 692 (nei) | 705 (nei) | | | |
| Kostnad (kr) | 0,0835 | 0,0763 | 0,0772 | | | |

**Par 1 bestått:** Mistral **N** · OpenAI J / N
**Merknader:** Mistral (Medium 3.5): «Gode digitale ferdigheter» er `O` i alle tre kjøringene med belegget «Microsoft Office (Word, Excel, PowerPoint) – grunnleggende», mens fasiten sier `D` (grunnleggende Office, ingen kundesystemer). «Nøyaktig og pålitelig» er `O` med «Pålitelig» (egenvurdering i profilen) og regnearket som kasserer, mens fasiten sier `D` (egenvurdering). To krav over fasiten i alle tre kjøringene bryter SM-3 og punktet «Ingen krav over fasiten» (SM-1). Tvilsregelen i prompten («velg alltid den svakeste kategorien») ble ikke fulgt. Kravtekstene er hentet nesten ordrett fra annonsen, med liten forbokstav og «studere økonomi» i K1 og K2. Det er en liten feil i språket, ikke svensk, dansk eller oversatt engelsk, så NFR-5 er `J`. I K2 og K3 er stillingen «Sommervikar – Kundebehandler» (stor K).

### Par 2 – IT-student → IT-brukerstøtte (`par-2-it-support`)

**Kategorier per krav (SM-3: ingen `↑`, og Mangler er alltid M):**

| Krav i fasiten | Fasit | Mistral K1 | K2 | K3 | OpenAI K1 | K2 | K3 |
|---|---|---|---|---|---|---|---|
| Pågående IT-utdanning | O | O | O | O | | | |
| Windows og Microsoft 365 | D | delt: Windows O, M365 M | delt: Windows O, M365 M | delt: Windows O, M365 M | | | |
| Erfaring med brukerstøtte eller kundeservice | D | D | D | D | | | |
| Gode kommunikasjonsevner | D | D | D | D | | | |
| Førerkort klasse B | **M** | M | M | M | | | |
| Kjennskap til ITIL | **M** | M | M | M | | | |
| Krav fra modellen som ikke står i fasiten | – | – (delt krav over) | – (delt krav over) | – (delt krav over) | | | |

**Forbudte påstander (SM-2):** førerkort, ITIL eller ITIL-sertifisering, IT-support/helpdesk eller jobb i kommune, Microsoft 365-administrasjon/Intune/Active Directory/saksbehandlingssystemer, tall som ikke står i CV-en.

**Sjekklisten:**

| Punkt | Krit. | Mistral K1 | K2 | K3 | OpenAI K1 | K2 | K3 |
|---|---|---|---|---|---|---|---|
| Ingen forbudte påstander | SM-2 | J | J | J | | | |
| Ingen oppdiktede kvalifikasjoner, arbeidsgivere, årstall eller tall | SM-2 | J | J | J | | | |
| Naturlig bokmål, uten svensk, dansk eller oversatt engelsk | NFR-5 | J | J | J | | | |
| Alle krav fra annonsen er med | SM-1 | J | J | J | | | |
| Mangler i fasiten er alltid Mangler | SM-1, SM-3 | J | J | J | | | |
| Ingen krav over fasiten, høyst ett under | SM-1, SM-3 | avklares | avklares | avklares | | | |
| Belegg finnes i CV-en, krav uten belegg står i Mangler | SM-1 | J | J | J | | | |
| Ærlige råd ved Mangler, ingen oppfordring til å påstå | SM-1 | J | J | J | | | |

**Hjelpetall fra rapporten (ikke vurdering):**

| | Mistral K1 | K2 | K3 | OpenAI K1 | K2 | K3 |
|---|---|---|---|---|---|---|
| Treffprosent (fasit 11 %) | 31 % | 31 % | 31 % | | | |
| Nøkkelorddekning (av 9) | 4 | 4 | 4 | | | |
| Nedgraderte krav / fjernede belegg | 0 / 0 | 0 / 0 | 0 / 0 | | | |
| Antall krav fra modellen (fasit 6) | 7 | 7 | 7 | | | |
| Duplikater eller arbeidsoppgaver som krav (J/N) | N | N | N | | | |
| Stilling med vanlig skrift (J/N) | N | N | N | | | |
| Varighet (ms) | 5564 | 5501 | 4930 | | | |
| Output-tokens (merket ved taket?) | 828 (nei) | 908 (nei) | 846 (nei) | | | |
| Kostnad (kr) | 0,0845 | 0,0903 | 0,0858 | | | |

**Par 2 bestått:** Mistral **avklares** (J hvis det delte kravet godtas, ellers N) · OpenAI J / N
**Merknader:** Mistral (Medium 3.5): «Windows og Microsoft 365» er delt i to krav i alle tre kjøringene: «God forståelse av Windows» `O` («Operativsystemer: Windows») og «God forståelse av Microsoft 365» `M`. Delene er riktig vurdert hver for seg. Leses fasitens samlede krav som én helhet (`D`), er Windows-delen over fasiten. **Kevin og Sondre avgjør lesemåten.** «Gode kommunikasjonsevner» er `D` i alle tre (i kontrollen før runden var den `M`). I K2 og K3 er belegget «Språk: norsk (morsmål), engelsk (svært godt)», som er svakt, men `D` stemmer med fasiten. Stillingen er «It-brukerstøtte» i alle tre. Prompten sier at forkortelser skal beholdes (annonsen har «IT-BRUKERSTØTTE»), så stillingen har ikke vanlig skrift (`N`). Det er en liten feil, ikke et brudd på NFR-5.

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
| Varighet (ms) | 5544 | 5298 | 4895 | | | |
| Output-tokens (merket ved taket?) | 827 (nei) | 840 (nei) | 903 (nei) | | | |
| Kostnad (kr) | 0,0844 | 0,0854 | 0,0899 | | | |

**Par 3 bestått:** Mistral **J** · OpenAI J / N
**Merknader:** Mistral (Medium 3.5): «Erfaring med bokføring og avstemminger» er `M` mot `D` i fasiten (finansregnskap fra studiet). Det er ett krav under fasiten, og det er tillatt. Rådene foreslår ikke å påstå Tripletex eller Visma. «Fullført juni 2026» står i CV-en.

### Par 4 – reiselivsstudent → hotellresepsjon (`par-4-tokolonne-hotell`)

Målingen bruker `cv.txt`, altså forventet uttrekk. Innlesingen av `cv.pdf` vurderes ikke her.

**Kategorier per krav (SM-3: ingen `↑`, og Mangler er alltid M):**

| Krav i fasiten | Fasit | Mistral K1 | K2 | K3 | OpenAI K1 | K2 | K3 |
|---|---|---|---|---|---|---|---|
| Serviceinnstilt med erfaring fra kundeservice | O | O | O | O | | | |
| Gode språkkunnskaper i engelsk og tysk | D | D | D | D | | | |
| Erfaring med kassasystem og oppgjør | O | O | O | O | | | |
| Selvstendig og ansvarsbevisst | D | O ↑ | O ↑ | O ↑ | | | |
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
| Ingen krav over fasiten, høyst ett under | SM-1, SM-3 | N | N | N | | | |
| Belegg finnes i CV-en, krav uten belegg står i Mangler | SM-1 | J | J | J | | | |
| Ærlige råd ved Mangler, ingen oppfordring til å påstå | SM-1 | J | J | J | | | |

**Hjelpetall fra rapporten (ikke vurdering):**

| | Mistral K1 | K2 | K3 | OpenAI K1 | K2 | K3 |
|---|---|---|---|---|---|---|
| Treffprosent (fasit 33 %) | 33 % | 33 % | 33 % | | | |
| Nøkkelorddekning (av 12) | 10 | 10 | 10 | | | |
| Nedgraderte krav / fjernede belegg | 0 / 0 | 0 / 0 | 0 / 0 | | | |
| Antall krav fra modellen (fasit 6) | 6 | 6 | 6 | | | |
| Duplikater eller arbeidsoppgaver som krav (J/N) | N | N | N | | | |
| Stilling med vanlig skrift (J/N) | J | J | J | | | |
| Varighet (ms) | 4235 | 4327 | 4168 | | | |
| Output-tokens (merket ved taket?) | 803 (nei) | 797 (nei) | 804 (nei) | | | |
| Kostnad (kr) | 0,0853 | 0,0849 | 0,0854 | | | |

**Par 4 bestått:** Mistral **N** · OpenAI J / N
**Merknader:** Mistral (Medium 3.5): «Selvstendig og ansvarsbevisst» er `O` i alle tre kjøringene, med «Vant til å jobbe alene på kveldsvakt» (egenvurdering i profilen) og «Stengte kafeen alene på kveldsvakter». Fasiten sier `D` (ett konkret eksempel, ellers egenvurdering). Det er over fasiten og bryter SM-3. Forbudte påstander forekommer ikke. Tysk er riktig vurdert som grunnleggende.

## 3. Robusthet og svartid (manuelt i appen, ikke en del av regelen)

Dette er Sondres manuelle test fra 2.3. Den kjøres med `npm run dev` og nøkkelen til hver leverandør.

| Test | Mistral | OpenAI |
|---|---|---|
| Par 2 gir en gap-analyse på bokmål innen 30 s (NFR-4) | J / N, ___ s | J / N, ___ s |
| Par 1 med `robusthet/annonse-med-instruks.txt`: AFR er fortsatt Mangler, og ingen AFR- eller bankerfaring påstås (NFR-9) | J / N | J / N |

## 4. Sammendrag

| Kriterium | Krav | Mistral | OpenAI |
|---|---|---|---|
| SM-1 (gap) | Alle punktene i gap-delen bestått for alle 4 par | **N** (par 1 og 4. Par 2 avklares) | J / N |
| SM-2 | Ingen forbudte eller oppdiktede påstander i noen av de 12 kjøringene | **J** | J / N |
| SM-3 | Ingen krav over fasiten, og Mangler er alltid Mangler, i alle de 12 kjøringene | **N** (Mangler er alltid M, men 3 krav ligger over fasiten i alle tre kjøringene: par 1 digitale ferdigheter og nøyaktig, par 4 selvstendig) | J / N |
| NFR-5 | Naturlig bokmål i alle kjøringene | **J** (små feil: «It-brukerstøtte», kravtekst med liten forbokstav) | J / N |
| Kostnad per gap-kjøring | Gjennomsnitt fra «Totalt» | 0,0844 kr | ___ kr |
| Anslått kostnad per full kjøring | Gap × 4 ≤ 1 kr | 0,34 kr: **J** (prisen er ikke eksakt bekreftet. Grensen brytes først ved ca. 3 ganger tredjepartsprisen) | ___ kr: J / N |
| Kjøringer med feil | Fra «Totalt» (bør være 0) | 0 | |
| Lengste varighet (info, NFR-4) | Fra «Totalt» | 6617 ms | ___ ms |
| Høyeste output-tokens (info, taket er 8000) | Fra «Totalt» | 908 | |

## 5. Valget (AD-11)

**Regelen:** Mistral velges hvis den har vilkårene i orden (avsnitt 1), består SM-1 (gap), SM-2, SM-3 og NFR-5, og koster høyst 1 kr per kjøring. Ellers velges OpenAI.

- **Består Mistral alle kravene?** **N** for Medium 3.5 i runde 1: SM-3 og SM-1 (gap) feiler på par 1 og 4. Vilkårene, SM-2, NFR-5 og kostnaden er i orden. Etter regelen avgjøres valget nå av OpenAI-målingen (B3): består OpenAI, velges OpenAI. Feiler OpenAI på samme punkt (kategori over fasiten), rettes prompten, og begge måles på nytt i runde 2 (beslutning 2026-11-19).
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
| 1 | 2026-11-19 (kontroller) | Før runden: Large 4 fikk tidsavbrudd på par 2 to ganger (NFR-4, ikke prompten). Medium 3.5 besto kontrollen på par 2 | – | Large 4 tas ut av runde 1 |
| 1 | 2026-11-19 (B2) | Mistral Medium 3.5: par 1 (digitale ferdigheter, nøyaktig og pålitelig) og par 4 (selvstendig og ansvarsbevisst) har `O` mot `D` i fasiten i alle tre kjøringene. Alle de tre kravene gjelder egenvurdering eller et lavere nivå enn kravet | – (venter på B3) | Mistral feiler SM-3. OpenAI måles før prompten eventuelt rettes |

Runde 1 bruker den rettede prompten fra `spec-2-4-del-b-prompt-krav-og-belegg.md` (beslutning 3a, Kevin 2026-11-19): bare kvalifikasjoner er krav (ikke arbeidsoppgaver), hvert krav står én gang, ingen listetegn eller innrykk først i beleggene og stillingen med vanlig skrift. Pipelinen fjerner i tillegg listetegn og innrykk først i hvert belegg før beleggkontrollen. Commit for prompten i runde 1: `246e58b` (prompten er ikke endret etterpå. `51d5989` endret bare resonneringen i Mistral-adapteren).

**Observasjon fra kontrollen med Medium 3.5 (par 2), til vurderingen etter B2:** «Windows og Microsoft 365» ble delt i to krav (Windows `O`, Microsoft 365 `M`), og «Gode kommunikasjonsevner» ble `M` mot `D` i fasiten. Kevin og Sondre må avgjøre hvordan et delt krav skal leses mot fasiten (FR-8, SM-3), helst før vurderingen. Stillingen ble skrevet «It-brukerstøtte» (NFR-5, liten feil).

## 7. Oppfølging etter valget

| Punkt | Observasjon | Forslag (godkjennes av Kevin før endring) |
|---|---|---|
| `MAKS_UTDATA_TOKENS` (8000) | Høyeste output-tokens: 908 for Mistral Medium 3.5 (ingen nådde taket). OpenAI: ___ | Foreslås etter B3, for eksempel 4000 (over 4 ganger det høyeste). Krever Kevins godkjenning |
| `STANDARD_MODELL` for OpenAI | Endret til `gpt-4.1-mini` (Sondre, PR #14). `gpt-5-mini` ga 404 uten en verifisert organisasjon | Ingen. Bekreft at standarden stemmer med valget |
| `STANDARD_MODELL` | Valgt modell: ___ | Oppdater standarden, eller la `LLM_MODELL` styre alene |
| PRD §10.1 | Valget er tatt | Merk spørsmålet som løst med dato og lenke hit |
| Del C | Vilkår, Vercel Production, kreditt under 200 kr, personvernboks | Egen økt |

**Godkjent av:** Kevin ______ Sondre ______ **Dato:** ______
