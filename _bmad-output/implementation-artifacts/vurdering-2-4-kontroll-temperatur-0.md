# Vurdering: kontroll med temperatur 0 og leverandørvalget (story 2.4 del B)

> **Kontroll etter runde 5 (Kevin, 2026-11-19).** Bare OpenAI `gpt-4.1-mini`, 12 kjøringer, med prompten fra runde 5 (`271edb4`) og alle andre innstillinger uendret. Den eneste endringen er `TEMPERATUR` fra 0,2 til 0 (`ee49c2b`, innenfor AD-3: 0–0,3). Mistral ble ikke målt på nytt. Rundene 1–5 står uendret i `vurdering-2-4-leverandorvalg-runde-1.md` … `-runde-5.md`.

## 0. Målingen

| Felt | OpenAI |
|---|---|
| Rapportfil | `testsett-rapporter/2026-11-19-225914-openai-gpt-4.1-mini.md` |
| Modellversjon fra leverandøren | `gpt-4.1-mini-2025-04-14` i alle 12 |
| Commit | `ee49c2b` (prompten fra `271edb4`, `TEMPERATUR = 0`) |
| Arbeidstreet rent | J |
| Priser | 3,87 kr inn og 15,50 kr ut per million tokens (developers.openai.com, 2026-11-19) |
| Kjøringer med feil | 0 av 12 |
| Samlet kostnad | 0,2225 kr (0,0185 kr per gap-kjøring, ca. 0,07 kr per full kjøring) |
| Lengste varighet | 8392 ms (NFR-4) |
| Høyeste output-tokens | 608 (taket er 8000) |

## 1. Kategorier (K1/K2/K3, fasiten i parentes)

| Par og krav | T = 0 | Runde 5 (T = 0,2) | Runde 4 (T = 0,2) |
|---|---|---|---|
| Par 1 (alle seks krav) | lik fasiten ×3 | lik fasiten ×3 | lik fasiten ×3 |
| Par 2 Brukerstøtte eller kundeservice (D) | D/D/D | **O↑**/D/D | D/D/D |
| Par 2 Gode kommunikasjonsevner (D) | D/D/D | D/D/D | D/D/M↓ |
| Par 2 de andre fem kravene | lik fasiten ×3 | lik fasiten ×3 | lik fasiten ×3 |
| Par 3 Strukturert og nøyaktig (D) | **M↓/M↓/M↓** | D/D/M↓ | D/D/D |
| Par 3 Gode samarbeidsevner (D) | **M↓/M↓/M↓** | M↓/D/M↓ | M↓/M↓/D |
| Par 3 de andre fire kravene | lik fasiten ×3 | lik fasiten ×3 | lik fasiten ×3 |
| Par 4 (alle seks krav) | lik fasiten ×3 | lik fasiten ×3 | lik fasiten ×3 |

Med temperatur 0 er kategoriene **identiske i alle tre kjøringene** for hvert par. Bare ordlyden i forklaringene og rådene varierer litt.

> **Fasiten er revurdert 2026-11-20 (løsning B, avsnitt 6):** «Gode samarbeidsevner» i par 3 er nå **M**. Tabellen over viser fasiten slik den var da målingen ble gjort, og den er ikke endret. Mot den nye fasiten blir dette annerledes:
> - Kjøringene med temperatur 0 (`M` ×3) er **lik fasiten**.
> - Runde 5 K2 og runde 4 K3 (`D`) ligger **over fasiten**.
> - Runde 5 K1 og K3 og runde 4 K1 og K2 (`M`) er lik fasiten.

## 2. Kriteriene

| Kriterium | T = 0 | Runde 5 | Runde 4 |
|---|---|---|---|
| **SM-2 og FR-27** (ingen forbudte eller oppdiktede påstander, CV-ens egne ord) | **J** | J | N (1 setning, par 2 K1) |
| **SM-3** etter PRD: ingen krav over fasiten, og Mangler er alltid Mangler | **J (12 av 12)** | N (1 krav over, par 2 K1) | J (12 av 12) |
| **FR-8:** høyst ett krav under fasiten per kjøring (sjekklisten, SM-1) | **N i par 3 ×3** (to krav under) | N i par 3 K3 | J |
| **SM-1 (gap):** alle punktene i sjekklisten | **N (9 av 12)**, par 3 | N (10 av 12) | N (11 av 12: setningen i par 2 K1 bryter SM-2) |
| NFR-4 | J (8,4 s) | J (10,4 s) | J (8,7 s) |
| NFR-5 | J (små feil: setninger uten subjekt, «It-brukerstøtte») | J (små feil) | J med forbehold |
| Kostnad per full kjøring (≤ 1 kr) | J (0,07 kr) | J (0,07 kr) | J (0,07 kr) |

**Mot den revurderte fasiten (2026-11-20, løsning B):** tabellen over er vurdert mot fasiten slik den var da målingen ble gjort, og den er ikke endret. Mot den nye fasiten («Gode samarbeidsevner» = M) blir det slik:

| Kriterium | T = 0 | Runde 5 | Runde 4 |
|---|---|---|---|
| **SM-3** | **J (12 av 12)**, uendret | N, uendret (par 2 K1), og nå også par 3 K2 | **N** (par 3 K3: `D` over fasiten) |
| **FR-8, høyst ett under** | **J.** Par 3 har ett krav under («Strukturert og nøyaktig») | J. Par 3 K3 har nå bare ett krav under | J |
| **SM-1 (gap)** | **J (12 av 12)**, var 9 av 12 | N (10 av 12, uendret antall): par 2 K1 og nå par 3 K2, ikke lenger par 3 K3 | **N (10 av 12)**, var 11 av 12: par 2 K1 og nå også par 3 K3 |

Resten av sjekklisten for par 3 var bestått i kontrollen med temperatur 0. Det eneste punktet som feilet, var toleransen. SM-1 er derfor 12 av 12 uten ny måling. Rundene 1–5 vurderes ikke på nytt, se avsnitt 6.

**Om SM-3 og «høyst ett under»:** PRD-en definerer SM-3 som «ingen annonsekrav over fasit, og Mangler er alltid Mangler». «Høyst ett annonsekrav per testpar får lavere kategori» er også en konsekvens av FR-8, og sjekklisten har den på samme linje («Ingen krav over fasiten, høyst ett under»), merket SM-1 og SM-3 i malen. I vurderingene for rundene 3–5 er to krav under fasiten regnet som en feil på den linjen. Med den strenge definisjonen i PRD-en består OpenAI SM-3 med temperatur 0, men feiler punktet i sjekklisten om toleranse (SM-1) i par 3.

## 3. Feil som gjenstår med temperatur 0

1. **Par 3, for strengt** (samme i alle tre kjøringene). *Etter at fasiten ble revurdert 2026-11-20, er bare «Strukturert og nøyaktig» under fasiten. «Gode samarbeidsevner» er M i fasiten nå, se avsnitt 6.* Teksten fra før revurderingen: «Strukturert og nøyaktig» og «Gode samarbeidsevner» er `M` mot `D` i fasiten. Fasiten bygger på beslektet erfaring (registrering i kundesystem, bacheloroppgave, kundeservice). Regelen «ingen deler dokumentert, men beslektet erfaring = delvis» ble ikke fulgt. Feilen går i den forsiktige retningen, og rådene er ærlige, men to krav under fasiten bryter toleransen i FR-8.
2. **Stillingen** er «It-brukerstøtte – deltid for student» i alle kjøringene og alle rundene med OpenAI, ikke «IT-…».
3. **Kravtekstene** har med «(en fordel)» og «(påkrevd)» fra annonsen (kosmetisk).
4. **Små språkfeil i forklaringene:** setninger uten subjekt («Har erfaring som studentassistent …»), og i tidligere runder særskriving («Tysk kunnskapsnivået»).

## 4. Anbefaling om temperatur

**Temperatur 0 anbefales** for appen og testsettet:
- **Stabilt:** kategoriene er like i alle kjøringene. En målt feil er reproduserbar og kan dokumenteres, og brukeren får samme vurdering ved ny generering.
- **Ingen krav over fasiten,** som er den alvorlige retningen (produktet skal aldri påstå at brukeren har noe CV-en ikke dokumenterer). Med 0,2 ble «brukerstøtte» `O` i 1 av 3 kjøringer i runde 5 og i 2 av 3 i runde 3.
- **SM-2 er i orden.**
- **Ulempen:** den gjenværende feilen (par 3) kommer hver gang og jevnes ikke ut over kjøringene. Den går i den forsiktige retningen.

Verdien er allerede 0 i `src/lib/llm/felles.ts` (`ee49c2b`). Hvis Kevin og Sondre velger 0,2 igjen, tilbakestilles den commiten.


## 5. Valget (AD-11), tatt 2026-11-19

- **Valgt leverandør:** OpenAI (Kevin og Sondre, 2026-11-19)
- **`LLM_LEVERANDOR`:** `openai`
- **`LLM_MODELL`:** `gpt-4.1-mini` (det er også `STANDARD_MODELL.openai`). Leverandøren svarte med `gpt-4.1-mini-2025-04-14`.
- **`TEMPERATUR`:** 0 (`src/lib/llm/felles.ts`, innenfor AD-3: 0–0,3)
- **Commit for kontrollen som ligger til grunn:** `ee49c2b` (prompten fra `271edb4`)

**Begrunnelse etter AD-11:** regelen er at Mistral velges hvis den består SM-1 (gap), SM-2, SM-3 og NFR-5 innenfor 1 kr per kjøring, og ellers OpenAI.
- **Mistral består ikke.** Mistral Large 4 feilet NFR-4 (tidsavbrudd etter 45 s). Medium 3.5 feilet SM-3 i alle fem rundene, med 2–9 krav over fasiten per runde, og består 24 av 36 kjøringer i rundene 3–5. Medium 3.5 er i tillegg utfaset hos Mistral og avvikles 30.04.2027.
- **Derfor velges OpenAI.** I prioritert rekkefølge etter PRD §6:
  - **Vilkår:** ingen trening på API-data som standard, og en databehandleravtale er publisert. Data behandles utenfor EØS (se avsnitt 7).
  - **Kvalitet:** best på tvers av rundene. Med temperatur 0 er SM-2 i orden og ingen krav over fasiten.
  - **Kostnad:** 0,07 kr per full kjøring.
  - **Strukturert svar:** 0 feil i alle målingene.
- **Status for kriteriene i det valgte oppsettet:**
  - SM-2: **J**, på prompten fra `271edb4`. Med den nye prompten er den N (10 av 12)
  - SM-3 etter PRD-en: **J**, på prompten fra `271edb4`. Med den nye prompten er den N (11 av 12)
  - NFR-4: **J**
  - NFR-5: **J**
  - Kostnad: **J**
  - **SM-1:** IKKE BESTÅTT (9 av 12 kjøringer) mot fasiten da målingen ble gjort. **Bestått (12 av 12)** mot fasiten slik den ble revurdert 2026-11-20 (løsning B). Se avsnitt 6.
  - **NFR-9 (B4 del 2):** bestått i produksjonen 2026-11-20 etter PR #28 (`b50e34a`). Årsaken til de to tidligere feilene er uavklart, fordi ett av forsøkene brukte feil inndata. Se § 7a i `kjorebok-2-4-del-b.md`.
  - **Merk:** prompten er endret etter denne målingen (PR #27 og PR #28). Tallene over gjelder prompten fra `271edb4`. Testsettet med den nye prompten ble kjørt 2026-11-20, og resultatet var dårligere på SM-1–SM-3. Se [`vurdering-2-4-kontroll-ny-prompt.md`](vurdering-2-4-kontroll-ny-prompt.md).

## 6. SM-1 og par 3: løst ved at fasiten er revurdert (løsning B, 2026-11-20). Gjelder den gamle prompten

> **Beslutning 2026-11-20 (Kevin og Sondre, løsning B i [`beslutningsgrunnlag-2-4-fasit-par-3.md`](beslutningsgrunnlag-2-4-fasit-par-3.md)):**
> - «Gode samarbeidsevner» i `testdata/par-3-regnskap/fasit.md` er endret fra **D** til **M**.
> - «Strukturert og nøyaktig» er fortsatt **D**.
> - Endringen er en faglig revurdering etter målingen. Begrunnelsen kommer fra CV-en, annonsen og FR-8, og står i fasiten.
> - Ingen nye målinger er kjørt.
>
> **Konsekvensene:**
> - **Valgt oppsett (T = 0):** SM-1 er **12 av 12**, og SM-3 er fortsatt J. Par 3 har ett krav under fasiten («Strukturert og nøyaktig»), og det tillater FR-8.
> - **Tidligere kjøringer som ga D for samarbeid, ligger nå over fasiten:**
>   - OpenAI: runde 3 (K1–K3), runde 4 K3 og runde 5 K2
>   - Mistral: rundene 2–5 (12 av 12)
>
>   De er historiske. Resultatene og vurderingene for rundene 1–5 står uendret og vurderes ikke på nytt.
> - **Valget av leverandør (AD-11) er uendret.** Mistral Medium 3.5 feilet allerede SM-3 (og SM-1) i alle rundene, og Mistral Large 4 feilet NFR-4. Endringen gjør bare Medium 3.5 svakere.
> - **Signaturene:** Sondres godkjenning av løsning B er gitt videre av Kevin. Avsnitt 6 sa tidligere at endringen skulle signeres av begge. Signaturene på denne vurderingen («Godkjent av» i avsnitt 7) gjenstår i C5.
> - Det som står under, er teksten fra før beslutningen. Den beholdes som dokumentasjon.

**Feilen:** med temperatur 0 får «Strukturert og nøyaktig» og «Gode samarbeidsevner» i par 3 `M` i alle tre kjøringene, mens fasiten har `D`. Det er to krav under fasiten. FR-8 tillater høyst ett, så punktet «Ingen krav over fasiten, høyst ett under» i sjekklisten feiler, og SM-1 er 9 av 12.

**Fasiten eller modellen?** Fasiten er **ikke endret**. Grunnlaget er dette:

| | Strukturert og nøyaktig | Gode samarbeidsevner |
|---|---|---|
| Fasiten (`testdata/par-3-regnskap/fasit.md`) | `D`: «Ikke direkte dokumentert; kan argumenteres via registrering i kundesystem og bacheloroppgave» | `D`: «Ikke direkte dokumentert; kundeservice gir et utgangspunkt» |
| CV-en | Ingen profil eller egenvurdering. «Registrerte endringer i kundesystemet», «Besvarte kundehenvendelser om fakturaer og abonnement», bacheloroppgave og relevante fag | Kundeservicemedarbeider (deltid). Ingen samarbeid med kolleger eller teamarbeid er nevnt |
| FR-8 | «Delvis oppfylt: … overførbar eller beslektet erfaring». «Tvilsregelen: ved tvil velges den svakeste kategorien» | Samme |
| Modellen (OpenAI, T = 0) | `M` med et ærlig råd («Du har ikke dokumentert at du er strukturert og nøyaktig …») | `M` med et ærlig råd |
| Andre målinger | `D` hos OpenAI i runde 3, 4 og 5 (K1, K2) og hos Mistral i alle rundene | `D` hos Mistral i rundene 2–5 og hos OpenAI i runde 3. `M` hos OpenAI i flere kjøringer i runde 4 og 5 |

**Vurderingen (ikke en beslutning):**
- **Strukturert og nøyaktig:** fasitens `D` har konkret beslektet erfaring bak seg (registrering i et kundesystem, et selvstendig bachelorarbeid). Det passer med FR-8 («beslektet erfaring»). Modellen er trolig for streng her.
- **Gode samarbeidsevner:** grunnlaget for fasitens `D` er svakere. Kundeservice er kontakt med kunder, ikke samarbeid med kolleger, og fasiten skriver selv «ikke direkte dokumentert». Modellens `M` kan forsvares med tvilsregelen i FR-8. Her er fasiten trolig for raus, eller i det minste et tvilstilfelle.
- **Uansett:** begge feilene går i den forsiktige retningen (ingen påstander om det brukeren ikke har), og rådene er ærlige.

**Status 2026-11-19:** Kevin og Sondre har valgt løsning 2. Grunnlaget for beslutningen er [`beslutningsgrunnlag-2-4-fasit-par-3.md`](beslutningsgrunnlag-2-4-fasit-par-3.md). Til beslutningen er tatt og dokumentert, står SM-1 som **IKKE bestått (9 av 12)**, og fasiten er uendret.

**Mulige løsninger (Kevin og Sondre avgjør):**
1. **Fasiten beholdes, og modellen rettes.** Det krever en ny endring i prompten og en ny betalt måling (OpenAI, 12 kall, ca. 0,22 kr). Endringen kan også flytte andre krav, slik runde 4 gjorde med Mistral.
2. **Fasiten for «Gode samarbeidsevner» vurderes på nytt** ut fra CV-en og FR-8, uavhengig av modellen. Hvis den endres til `M`, har par 3 bare ett krav under fasiten, og SM-1 blir 12 av 12 i kontrollen med temperatur 0, uten ny måling. En slik endring må begrunnes, dateres og signeres av begge i fasiten og her. Det må også stå tydelig at den ble gjort etter målingen.
3. **Avviket aksepteres og dokumenteres** som en kjent svakhet. SM-1 er da ikke bestått ved innleveringen, og det må stå i rapporten.

## 7. Vilkårene til OpenAI (offisielle kilder)

| Punkt | Hva kilden sier | Kilde (lest 2026-11-19) | Må bekreftes |
|---|---|---|---|
| Trening på API-data | «data sent to the OpenAI API is not used to train or improve OpenAI models (unless you explicitly opt in to share data with us)». Data brukes altså ikke til trening som standard, bare etter et aktivt samtykke | [developers.openai.com/api/docs/guides/your-data](https://developers.openai.com/api/docs/guides/your-data) | **Sondre:** at organisasjonen ikke har slått på deling av data (Settings → Data controls) |
| Lagring for å oppdage misbruk | «abuse monitoring logs … retained for up to 30 days» som standard | Samme | – |
| Databehandleravtale (DPA) | OpenAI har en publisert databehandleravtale for API-et. Siden svarer 403 på automatiske oppslag og er derfor ikke lest direkte her. Ifølge nettsøk (2026-11-19) er den oppdatert 2025-12-01, gjelder fra 2026-01-01 og har standard personvernbestemmelser (SCC) for overføring | [openai.com/policies/data-processing-addendum](https://openai.com/policies/data-processing-addendum/) | **Sondre:** les avtalen i nettleser, og bekreft at avtalegrunnlaget er på plass for organisasjonen (inngått, eller at den gjelder etter vilkårene) **før produksjonsbruk** |
| Land og region | Data kan behandles utenfor EØS (USA). Lagring og behandling i EU krever godkjenning via salg | [developers.openai.com/api/docs/guides/data-residency](https://developers.openai.com/api/docs/guides/data-residency) | Det må stå i personverndokumentasjonen (FR-5 og PRD §6). Appen viser «CV-teksten sendes til OpenAI i USA. Det betyr at opplysningene overføres ut av EØS.» når `LLM_LEVERANDOR=openai` (`src/lib/okt/personvern.ts`). Det kontrolleres i produksjonen i del C |

**Bekreftet 2026-11-20 av Sondre** (kontoen er hans, og bekreftelsen er gitt videre av Kevin). Feltene i kolonnen «Må bekreftes» er dermed lukket:
- **Trening på API-data: J** ([your data](https://developers.openai.com/api/docs/guides/your-data), lest 2026-11-19). Deling er slått av i organisasjonen (Sondre, 2026-11-20).
- **DPA: J** ([data-processing-addendum](https://openai.com/policies/data-processing-addendum/), lest av Sondre, bekreftet 2026-11-20). Den gjelder automatisk når tjenestene brukes, og den må ikke inngås separat. Ifølge Sondre er OpenAI Ireland Ltd. avtaleparten for kunder i EØS. Ifølge Sondres logg (2026-11-20) gjelder versjonen fra 2026-01-01. Det stemmer med nettsøket, som også nevnte 2025-12-01 som datoen da den ble oppdatert.
- **Grunnlaget for overføringen til USA** er bekreftet av Sondre 2026-11-20 (gitt videre av Kevin). Punkt 4.1 i DPA-en beskriver overføringer ut av EØS med standard personvernbestemmelser (SCC) eller en beslutning om tilstrekkelig beskyttelsesnivå etter GDPR art. 45, også EU–U.S. Data Privacy Framework.
  - Ifølge Sondres logg (`975-2026-11-20-14-29-16-produksjon-c3-c4.md`) gjelder DPA-en fra 2026-01-01, og SCC-ene er EU-kommisjonens fra 4. juni 2021.
  - **Ikke kontrollert:** hvilket av grunnlagene som faktisk brukes, og om OpenAI er sertifisert under DPF.
  - Grunnlaget skal med i refleksjonsrapporten (PRD §6). Det står som et åpent punkt.
- **Land:** at avtaleparten er irsk, endrer ikke hvor behandlingen skjer (USA, se raden over). Personvernteksten om USA og at opplysningene går ut av EØS står derfor fast, og den kontrolleres i produksjonen i del C (C4).
- **Kreditten:** 5 USD (6,25 USD inkl. 25 % mva., ca. 60 kr), kjøpt én gang 2026-11-19. Det er ikke fylt på senere, og automatisk påfylling er av. Beløpet er under 200 kr inkl. mva.

**Godkjent av:** Kevin Heggdal (2026-11-23) Sondre ______ **Dato:** ______

## 8. SM-4: manuell vurdering av nøkkelordene (2026-11-20, gratis)

**Kravet (PRD SM-4):** «Minst 80 % av de forventede nøkkelordene er hentet ut, og enhetstestene for treffprosent er grønne.» SM-4 står i AK for **story 5.1** (`epics.md`, linje 784), ikke i 2.4, som realiserer SM-1, SM-2, SM-3 og SM-8 (`epics.md`, story 2.4). Vurderingen er en kontroll av det valgte oppsettet, ikke en godkjenning.

**Grunnlaget:**
- Nøkkelordene modellen hentet ut i kontrollen med temperatur 0 (`testsett-rapporter/2026-11-19-225914-openai-gpt-4.1-mini.md`), sammenlignet med «Forventede nøkkelord» i hver `testdata/par-*/fasit.md`.
- Ingen nye kall. Ingen endring i prompten, koden eller fasitene.

**Regelen for den manuelle tellingen:**
- Et nøkkelord fra fasiten regnes som hentet ut når et av modellens nøkkelord er det samme ordet eller en form av det: bøyning, sammensetning med samme stamme, eller en presisering (for eksempel «førerkort klasse B» for «førerkort»).
- Synonymer og omskrivinger regnes ikke med, men står som tvilstilfeller.
- Rapportens egen telling er automatisk og kaller seg «hjelp, ikke vurdering».

| Par | Fasiten (antall) | Hentet ut, manuelt | Tvilstilfeller | Ikke hentet ut | Automatisk i rapporten |
|---|---|---|---|---|---|
| 1 Butikk/bank | 9 | 6 (kundeorientert, digitale ferdigheter, kontanthåndtering, nøyaktig, pålitelig, økonomi ← «økonomistudent») = **67 %** | «hjelpe kunder» for kundeservice, bare i K1 og K3 (K2 har «hjelpe andre»). Med tvilstilfellet: 7 av 9 = 78 % i K1 og K3 | nettbank, mobilbank, kundeservice (tvilstilfelle) | 56 % |
| 2 IT-support | 9 | 6 (brukerstøtte, Windows, Microsoft 365, ITIL, kommunikasjon ← «kommunikasjonsevner», førerkort ← «førerkort klasse B») = **67 %** | – | førstelinje, saksbehandlingssystem, oppsett av PC | 44 % |
| 3 Regnskap | 13 | 9 (bokføring, avstemming ← «avstemminger», Excel, Tripletex, Visma, regnskapssystem ← «regnskapssystemer», strukturert, nøyaktig, samarbeid ← «samarbeidsevner») = **69 %** | – | periodeavslutning, fakturering, årsoppgjør, skattemelding | 46 % |
| 4 Hotell | 12 | 11 (alle unntatt resepsjon, booking ← «bookingsystemer») = **92 %** | – | resepsjon | 83 % |
| **Til sammen** | 43 | 32 = **74 %** (33 = 77 % med tvilstilfellet, K1 og K3) | | | |

Tellingen er den samme i alle tre kjøringene for hvert par. Unntaket er par 1 K2:
- K2 har «hjelpe andre», ikke «hjelpe kunder», så tvilstilfellet faller bort der.
- K2 har «AFR» i stedet for «finansiell rådgiver». Det påvirker ikke tellingen.

**Vurdering: SM-4 er IKKE oppfylt.**
- Bare par 4 når 80 %.
- Par 1–3 ligger på 67–69 %, og alle er under 80 %. Det gjelder også par 1 med tvilstilfellet (78 %).
- Til sammen er det 74 %.
- Den andre delen av kravet er oppfylt. Enhetstesten for treffprosent (`src/lib/kjerne/treffprosent.test.ts`) bruker fasitlistene og gir 22, 11, 8 og 33 % for par 1–4. Den er grønn i `npm test` 2026-11-20 på grenen `story-2.4-del-c-kontroll` (896 av 896).

**Hva som mangler, og en mulig årsak (en hypotese, ikke undersøkt):**
- Det som mangler, er for det meste arbeidsoppgaver og begreper fra stillingen, ikke kvalifikasjoner:
  - par 3: periodeavslutning, fakturering, årsoppgjør, skattemelding
  - par 2: førstelinje, saksbehandlingssystem, oppsett av PC
  - par 1: nettbank, mobilbank og eventuelt kundeservice
  - par 4: resepsjon
- Prompten ble i runde 1 endret slik at bare kvalifikasjoner er **krav** (`246e58b`). Det kan ha smittet over på nøkkelordene. Det må undersøkes før prompten endres.

**Treffprosenten i par 2: 25 % i produksjonen, mot 11 % i fasiten.**
- Fasitens 11 % er regnet ut fra fasitens egne 9 nøkkelord (1 av 9). Det er et mål for enhetstesten av selve beregningen.
- Appen regner treffprosenten fra nøkkelordene modellen henter ut.
  - I testsettet med temperatur 0 var det 8 nøkkelord. 2 av dem ble funnet i CV-en, «IT-utdanning» og «Windows», som gir 25 % i alle tre kjøringene.
  - Produksjonen ga samme treffprosent, 25 % (2 av 8). Listen fra produksjonen er ikke notert, så det er ikke kontrollert om det var de samme nøkkelordene.
- Beregningen er altså ikke feil, og produksjonen ga samme treffprosent som målingen.
- «IT-utdanning» får treff etter regelen i FR-12, fordi «IT» og «UTDANNING» begge står i CV-en. CV-en har en bachelor i IT, så treffet er ærlig (SM-C1).
- Forskjellen kommer av at listen modellen henter ut, ikke dekker fasiten (SM-4).

**Videre:**
- Ingen endring i 2.4.
- Avviket er ført som kjent i `deferred-work.md` og `issues.md`. Det følges opp i epic 3, fordi ATS bruker nøkkelordene (FR-17), og i story 5.1.
- Kevin og Sondre avgjør der om det er prompten eller fasitlistene som må endres.
