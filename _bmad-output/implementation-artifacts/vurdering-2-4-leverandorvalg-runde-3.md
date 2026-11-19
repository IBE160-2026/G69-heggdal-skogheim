# Vurdering: leverandørvalg, runde 3 (story 2.4 del B)

> **Status 2026-11-19: forberedt, ikke målt.** Runde 3 måler både Mistral Medium 3.5 og OpenAI `gpt-4.1-mini` på samme commit, med prompten etter [`spec-2-4-del-b-runde-3-sammensatte-krav.md`](spec-2-4-del-b-runde-3-sammensatte-krav.md) (Sondres regel for sammensatte krav). Prompten er endret etter runde 2, så Mistral må måles på nytt for at begge skal vurderes på samme grunnlag (SM-2). Valget tas etter AD-11 på runde 3. Rundene 1 og 2 står uendret i [`vurdering-2-4-leverandorvalg-runde-1.md`](vurdering-2-4-leverandorvalg-runde-1.md) og [`vurdering-2-4-leverandorvalg-runde-2.md`](vurdering-2-4-leverandorvalg-runde-2.md). Vilkårene, prisene og kursen er de samme som i avsnitt 0 og 1 i runde 1.

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
| Rapportfil (`testsett-rapporter/…`) | | |
| Modell (`--modell`, datobestemt navn) | | |
| Modellversjon fra leverandøren (fra rapporten) | | |
| Commit (fra rapporten) | | |
| Arbeidstreet rent (ingen merknad i rapporten) | J / N | J / N |
| Pris inn (kr per million tokens) | | |
| Pris ut (kr per million tokens) | | |
| Kilde for prisen og dato | | |
| Valutakurs og dato | | |
| Kjøringer med feil (fra «Totalt») | | |

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
| 1 | 2026-11-19 | Mistral: 9 tilfeller av krav over fasiten (par 1 og 4), og par 2 delt | – | Se [runde 1](vurdering-2-4-leverandorvalg-runde-1.md) |
| 2 | 2026-11-19 | Mistral: 2 tilfeller over fasiten (par 1 «Gode digitale ferdigheter»), par 1 «Kundeorientert» for strengt, par 2 delt i K2 og K3 | Steg 1–3 etter FR-8 og FR-7 (`af5f4dd`) | Se [runde 2](vurdering-2-4-leverandorvalg-runde-2.md) |
| 3 | | | Sondres regel for sammensatte krav (_commit fylles inn_) | |

Runde 3 bruker prompten fra runde 2 (`af5f4dd`, se [runde 2](vurdering-2-4-leverandorvalg-runde-2.md)) med disse endringene (`spec-2-4-del-b-runde-3-sammensatte-krav.md`):
- Steg 2: kravteksten skal ha alle delene slik de står i punktet.
- Steg 3: en egen regel for sammensatte krav (alle delene, noen av delene, ingen deler med og uten beslektet erfaring), og alternativer for seg.
- Steg 5: forklaringen for et sammensatt krav sier hvilken del som mangler.

Fasiten, sjekklisten og vurderingsreglene er de samme som i rundene 1 og 2.

## 7. Oppfølging etter valget

| Punkt | Observasjon | Forslag (godkjennes av Kevin før endring) |
|---|---|---|
| `MAKS_UTDATA_TOKENS` (8000) | Høyeste output-tokens: ___. Nådde noen kjøring taket? | |
| `STANDARD_MODELL` for OpenAI | Endret til `gpt-4.1-mini` (Sondre, PR #14). `gpt-5-mini` ga 404 uten en verifisert organisasjon | Ingen. Bekreft at standarden stemmer med valget |
| `STANDARD_MODELL` | Valgt modell: ___ | Oppdater standarden, eller la `LLM_MODELL` styre alene |
| PRD §10.1 | Valget er tatt | Merk spørsmålet som løst med dato og lenke hit |
| Del C | Vilkår, Vercel Production, kreditt under 200 kr, personvernboks | Egen økt |

**Godkjent av:** Kevin ______ Sondre ______ **Dato:** ______
