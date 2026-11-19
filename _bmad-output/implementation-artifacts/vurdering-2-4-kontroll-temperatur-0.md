# Vurdering: kontroll med temperatur 0 (story 2.4 del B)

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

**Om SM-3 og «høyst ett under»:** PRD-en definerer SM-3 som «ingen annonsekrav over fasit, og Mangler er alltid Mangler». «Høyst ett annonsekrav per testpar får lavere kategori» er også en konsekvens av FR-8, og sjekklisten har den på samme linje («Ingen krav over fasiten, høyst ett under»), merket SM-1 og SM-3 i malen. I vurderingene for rundene 3–5 er to krav under fasiten regnet som en feil på den linjen. Med den strenge definisjonen i PRD-en består OpenAI SM-3 med temperatur 0, men feiler punktet i sjekklisten om toleranse (SM-1) i par 3.

## 3. Feil som gjenstår med temperatur 0

1. **Par 3, for strengt** (samme i alle tre kjøringene): «Strukturert og nøyaktig» og «Gode samarbeidsevner» er `M` mot `D` i fasiten. Fasiten bygger på beslektet erfaring (registrering i kundesystem, bacheloroppgave, kundeservice). Regelen «ingen deler dokumentert, men beslektet erfaring = delvis» ble ikke fulgt. Feilen går i den forsiktige retningen, og rådene er ærlige, men to krav under fasiten bryter toleransen i FR-8.
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

**Godkjent av:** Kevin ______ Sondre ______ **Dato:** ______
