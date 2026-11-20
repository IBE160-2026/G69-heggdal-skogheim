# Beslutningsgrunnlag: fasiten for par 3 (story 2.4 del B)

> **Avgjort 2026-11-20: løsning B** (Kevin og Sondre). «Gode samarbeidsevner» er endret til `M` i `testdata/par-3-regnskap/fasit.md`, og «Strukturert og nøyaktig» er fortsatt `D`. Se avsnitt 5. Statusen under er fra før beslutningen.

> **Status 2026-11-19: ikke avgjort.** Kevin og Sondre har valgt løsning 2: å vurdere fasiten for «Gode samarbeidsevner» på nytt. Dokumentet samler det som står i CV-en, i annonsen og i fasiten for de to kravene der det valgte oppsettet (OpenAI `gpt-4.1-mini`, temperatur 0) avviker fra fasiten. **Fasiten er ikke endret. SM-1 er IKKE bestått (9 av 12 kjøringer), og avviket står åpent til Kevin og Sondre har tatt en dokumentert beslutning.**

Kilder:
- `testdata/par-3-regnskap/cv.txt`, `annonse.txt` og `fasit.md`
- PRD FR-8
- [`vurdering-2-4-kontroll-temperatur-0.md`](vurdering-2-4-kontroll-temperatur-0.md) og vurderingene for rundene 1–5

## 1. Det som står i kildene

### Annonsen (`annonse.txt`)

> Vi er et autorisert regnskapsbyrå med **15 ansatte** og søker en regnskapsmedarbeider i fast stilling. Nyutdannede oppfordres til å søke.

Under «Kvalifikasjoner» står de to kravene som egne punkter: «Strukturert og nøyaktig» og «Gode samarbeidsevner». Ingen av dem er utdypet. Arbeidsoppgavene er løpende bokføring, avstemminger og periodeavslutninger, fakturering og oppfølging av kunder, og bistand med årsoppgjør og skattemeldinger.

### CV-en (`cv.txt`), ordrett

```
UTDANNING
2023–2026  Bachelor i økonomi og administrasjon, Testvik handelshøyskole (fullført juni 2026)
           Bacheloroppgave: «Likviditetsstyring i små familiebedrifter»
           Relevante fag: finansregnskap, skatterett, bedriftsøkonomisk analyse, Excel for økonomer

ARBEIDSERFARING
2024–2026  Kundeservicemedarbeider (deltid), Testtelefon AS, Ålesund
           - Besvarte kundehenvendelser om fakturaer og abonnement
           - Registrerte endringer i kundesystemet
Sommer 2025 Sommervikar, lager, Sunnmøre Testmøbler

FERDIGHETER
- Excel: pivottabeller, HVIS- og FINN.RAD-funksjoner (fra studiet)
- Word og PowerPoint
- Språk: norsk (morsmål), engelsk (godt), tysk (grunnleggende)
```

CV-en har **ingen profil eller egenvurdering**. Ordene «strukturert», «nøyaktig», «samarbeid», «team» og «kolleger» står ikke noe sted.

### Fasiten (`fasit.md`)

| Krav | Kategori | Grunnlag i CV |
|---|---|---|
| Strukturert og nøyaktig | Delvis oppfylt | «Ikke direkte dokumentert; kan argumenteres via registrering i kundesystem og bacheloroppgave» |
| Gode samarbeidsevner | Delvis oppfylt | «Ikke direkte dokumentert; kundeservice gir et utgangspunkt» |

«strukturert», «nøyaktig» og «samarbeid» står blant de forventede nøkkelordene, alle som «Nei» (ikke funnet i CV-en). Ingen av de forbudte påstandene gjelder disse kravene.

### FR-8 (PRD)

- **Oppfylt:** «konkret erfaring, utdanning eller dokumentasjon som direkte dekker annonsekravet»
- **Delvis oppfylt:** «overførbar eller beslektet erfaring, eller annonsekravet står bare som egenvurdering»
- **Mangler:** «Annonsekravet er ikke dokumentert i CV-teksten»
- **Tvilsregelen:** «ved tvil velges den svakeste kategorien»
- **Konsekvens:** høyst ett annonsekrav per testpar kan få lavere kategori enn i fasiten.

## 2. Det modellene har svart

| | Strukturert og nøyaktig (fasit `D`) | Gode samarbeidsevner (fasit `D`) |
|---|---|---|
| **OpenAI, T = 0 (valgt oppsett)** | `M` ×3 | `M` ×3 |
| OpenAI runde 5 (T = 0,2) | D / D / M | M / D / M |
| OpenAI runde 4 | D / D / D | M / M / D |
| OpenAI runde 3 | D / D / D | D / D / D |
| Mistral rundene 2–5 | `D` i alle (12 av 12) | `D` i alle (12 av 12) |

**Belegg modellene har brukt når de har gitt `D`:**
- For strukturert og nøyaktig: bacheloroppgaven, «Relevante fag …» og «Besvarte kundehenvendelser om fakturaer og abonnement».
- For samarbeid: «Kundeservicemedarbeider (deltid), Testtelefon AS, Ålesund» og «Besvarte kundehenvendelser …».

**Rådene med T = 0** er for eksempel «Du har ikke dokumentert gode samarbeidsevner i CV-teksten. Vurder å legge til erfaring som viser samarbeid eller teamarbeid». De er ærlige.

## 3. Vurdering per krav (ikke en beslutning)

### «Gode samarbeidsevner»

**For `D` (fasiten i dag):**
- FR-8 gir `D` for «overførbar erfaring».
- Deltidsjobb i kundeservice i to år forutsetter at man fungerer på en arbeidsplass.
- Mistral og OpenAI i runde 3 har gitt `D`.

**For `M`:**
- Kundeservice slik CV-en beskriver den, er kontakt med kunder («Besvarte kundehenvendelser …»), ikke samarbeid med kolleger.
- CV-en nevner verken team, kolleger eller felles arbeid.
- Fasiten skriver selv «ikke direkte dokumentert» og «gir et utgangspunkt», ikke at erfaringen er beslektet.
- Tvilsregelen i FR-8 peker mot den svakeste kategorien.
- Til sammenligning har par 2 «Gode kommunikasjonsevner» `D` med veiledning av studenter. Der er det tydeligere sammenheng mellom erfaringen og kravet.

**Vurdering:** et reelt tvilstilfelle. Grunnlaget for `D` er svakere enn for de andre `D`-kravene i fasitene. Det er ikke feil.

### «Strukturert og nøyaktig»

**For `D` (fasiten i dag):**
- «Registrerte endringer i kundesystemet» er en konkret oppgave som krever nøyaktighet.
- En fullført bacheloroppgave er et selvstendig, strukturert arbeid.
- Det er beslektet erfaring etter FR-8.
- OpenAI i rundene 3–4 og Mistral i alle rundene har gitt `D`.

**For `M`:**
- Ingen av egenskapene står i CV-en.
- Fasiten skriver «ikke direkte dokumentert» og «kan argumenteres».

**Vurdering:** fasitens `D` har konkret beslektet erfaring bak seg. Modellens `M` med temperatur 0 er trolig for streng. Det foreslås ikke å endre dette kravet.

## 4. Konsekvenser av beslutningen

| Beslutning | SM-1 for det valgte oppsettet (T = 0) | Andre konsekvenser |
|---|---|---|
| **A. Fasiten beholdes** (begge `D`) | IKKE bestått (9 av 12). Krever at modellen rettes og en ny betalt måling, eller at avviket aksepteres og står i rapporten | Ingen endring i testdataene |
| **B. «Gode samarbeidsevner» endres til `M`** (strukturert beholdes som `D`) | Par 3 får ett krav under fasiten (strukturert), og det er tillatt. SM-1 blir 12 av 12 i den eksisterende kontrollen, uten ny måling. Det må stå i vurderingen at fasiten ble endret etter målingen | Kjøringer som har gitt `D` for samarbeid, blir **over fasiten**: Mistral i rundene 2–5 og OpenAI i alle tre kjøringene i runde 3, K3 i runde 4 og K2 i runde 5. Resultatene fra de rundene er historiske og vurderes ikke på nytt |
| **C. Begge endres til `M`** | 12 av 12 uten noen krav under | Ikke foreslått, fordi strukturert har bedre grunnlag for `D` (avsnitt 3) |

**Uansett beslutning:**
- Endringen begrunnes ut fra CV-en, annonsen og FR-8, ikke ut fra hva modellen svarte.
- `fasit.md` får dato, begrunnelse og hvem som besluttet.
- Det står at endringen ble gjort etter målingen, både her, i vurderingen og i sesjonsloggen.
- `testdata/sjekkliste.md`, FR-8 og akseptansekriteriene endres ikke.
- Endringen må gjøres med `bmad-build` og ha en egen commit.

## 5. Beslutningen

- [ ] A: fasiten beholdes
- [x] B: «Gode samarbeidsevner» endres til `M`
- [ ] C: begge endres til `M`

**Begrunnelse:**

> CV-en dokumenterer verken samarbeid med kolleger, teamarbeid eller en egenvurdering av samarbeidsevner. Kundeservice er beskrevet som kontakt med kunder («Besvarte kundehenvendelser …»). Etter FR-8 er kravet da ikke dokumentert (Mangler), og tvilsregelen peker samme vei. Den gamle begrunnelsen i fasiten («Ikke direkte dokumentert») beskrev selv et krav som ikke er dokumentert. «Strukturert og nøyaktig» beholdes som `D`, fordi registrering i kundesystemet og bacheloroppgaven er beslektet erfaring. Endringen er gjort etter målingen. Det står i fasiten, i avsnitt 6 i `vurdering-2-4-kontroll-temperatur-0.md` og i sesjonsloggen (`.logs/kevin-heggdal/992-…-story-2-4-del-c-produksjon.md`, 2026-11-20).

**Besluttet av:** Kevin og Sondre (Sondres godkjenning gitt videre av Kevin) **Dato:** 2026-11-20
