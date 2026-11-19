# Kjørebok: måling og leverandørvalg (story 2.4 del B)

> **Forhåndsundersøkt 2026-11-19, ikke bekreftet.** Opplysninger om vilkår, priser og modellnavn står med kilde og dato i [`vilkaar-og-priser-2-4.md`](vilkaar-og-priser-2-4.md) og må bekreftes i kontoen. Ingen måleresultater står her. De føres inn i [`vurdering-2-4-leverandorvalg.md`](vurdering-2-4-leverandorvalg.md).

Kjøreboka dekker AK 2 i story 2.4 og AD-11: testsettet kjøres mot Mistral og OpenAI, vurderes med sjekklisten, og leverandøren velges. Del B er ikke ferdig før stegene her er gjort. Sett ikke 2-4 til `done` i `sprint-status.yaml`. Del C (produksjonen) gjenstår uansett.

## Hvem gjør hva

| Steg | Ansvarlig |
|---|---|
| Mistral-konto, kreditt (10 USD kjøpt av Kevin, ingen automatisk påfylling), grense for forbruket, trening av, nøkkel | Kevin |
| OpenAI-konto, kreditt (ca. 5 USD, automatisk påfylling av), trening av, nøkkel | Sondre |
| Kontroll av nøkkelen og full måling | Den som har nøkkelen. Nøkkelen deles ikke i chat eller git |
| Manuell test i appen (avsnitt 3 i malen) | Sondre, som i 2.3 |
| Vurderingen og valget | Kevin og Sondre sammen |

Totalt budsjett er under 200 kr. Valutakursen føres inn med kilde og dato i avsnitt 0 i malen.

## 1. Forutsetninger

- [ ] Kontoene er satt opp etter sjekklistene i [`vilkaar-og-priser-2-4.md`](vilkaar-og-priser-2-4.md), og avsnitt 1 i vurderingsmalen er fylt ut med lenke og dato. Har en leverandør `N` på trening eller databehandleravtale, måles den ikke.
- [ ] Arbeidstreet er rent (`git status` uten endringer), så rapporten ikke får merknaden om endringer som ikke er committet. Commit-hashen i rapporten skal kunne spores (NFR-10).
- [ ] `npm ci` er kjørt, og `npm test` er grønn.
- [ ] Tørrkjøringen virker uten nøkkel:

  ```bash
  npm run testsett -- --leverandor mistral --mock
  ```

  Den gir utgangskode 0 og en rapport i `testsett-rapporter/` med `-mock` i filnavnet, «Modell (bedt om)» og versjonen «mock». Den ignoreres av git.

## 2. `.env.local`

Lag `.env.local` i prosjektroten (ignoreres av git via `.env.*`). Bare nøkkelen som skal brukes, trengs:

```bash
MISTRAL_API_KEY=<nøkkelen fra Mistral>
OPENAI_API_KEY=<nøkkelen fra OpenAI>
```

Skriptet leser filen selv (`--env-file-if-exists=.env.local`). Nøkkelen skrives aldri til rapporten eller konsollen. Ikke legg den i Vercel i denne delen.

## 3. Modellnavnene

**OpenAI:** `gpt-4.1-mini` (beslutning, Kevin 2026-11-19). `gpt-5-mini` ga 404 hos Sondre uten en verifisert organisasjon. `gpt-4.1-mini` er ikke en resonneringsmodell og tar imot temperaturen (AD-3).

**Mistral:** begge måles foreløpig (beslutning, Kevin 2026-11-19): Medium 3.5 med `--modell mistral-medium-2604` og Large 4 med `--modell mistral-large-4-0`. Navnene er hentet fra `GET /v1/models` med Kevins konto 2026-11-19. Det endelige modellvalget tas etter Kevins beslutning. Hvis kontoen senere viser andre navn, gjelder fremgangsmåten under. **Ikke gjett navnet.**

1. Les modelloversikten: <https://docs.mistral.ai/getting-started/models> (kolonnen for API-navn, utfasing og avvikling).
2. Se hvilke modeller kontoen har tilgang til, helst i Mistral-konsollen (Admin Panel / AI Studio, oversikten over modeller). Vil du heller bruke API-et (`GET /v1/models`, en liste og ikke en generering), last nøkkelen fra `.env.local` uten å skrive den ut. I PowerShell:

   ```powershell
   $nokkel = ((Get-Content .env.local | Where-Object { $_ -match '^MISTRAL_API_KEY=' }) -replace '^MISTRAL_API_KEY=', '').Trim()
   (Invoke-RestMethod https://api.mistral.ai/v1/models -Headers @{ Authorization = "Bearer $nokkel" }).data |
     Where-Object { $_.id -like '*medium*' } | Select-Object id, aliases, deprecation
   Remove-Variable nokkel
   ```

   **Lim aldri nøkkelen inn direkte i kommandoen.** Den havner da i historikken til skallet. Se etter Medium-modellene, feltet `id`, eventuelle `aliases` og at modellen ikke er avviklet (`deprecation`).
3. Før navnet, kilden og datoen inn i avsnitt 0 i malen («Modell (`--modell`, datobestemt navn)»).

Den 2026-11-19 fant Kevin `mistral-medium-2604` med `GET /v1/models` i sin konto (avsnittet over). Forundersøkelsen i [`vilkaar-og-priser-2-4.md`](vilkaar-og-priser-2-4.md) fant ikke noe slikt navn. Hvis kontoen senere viser andre navn, og det ikke finnes noe datobestemt Medium-navn som ikke er avviklet, stopp her, og la Kevin og Sondre bestemme modellen før målingen.

Uansett hvilket navn som brukes, viser rapporten både «Modell (bedt om)» og «Modellversjon fra leverandøren», altså modellen som faktisk svarte. Det er den som føres inn i malen.

**Resonnering (2026-11-19):** Medium 3.5 og Large 4 er resonneringsmodeller. Kontrollen med Large 4 uten innstilling fikk tidsavbrudd etter 45 s (`testsett-rapporter/2026-11-19-1557-mistral-mistral-large-4-0.md`, kjørt før innstillingen fantes). Mistral-adapteren sender nå `reasoningEffort` `"none"` for Medium 3.5 og `"low"` for Large 4, som er den laveste innsatsen modellen tar imot (Large 4 tar ikke imot `none`). Bruk de datobestemte navnene. `mistral-large-latest` får ingen innstilling, fordi AI SDK dropper den for det aliaset. Rapporten viser verdien i linjen «Resonnering (reasoningEffort)». Se [spec-2-4-del-b-resonnering-mistral.md](spec-2-4-del-b-resonnering-mistral.md).

## 4. Prisene

Skriptet trenger prisene i kroner per million tokens (`--pris-inn` og `--pris-ut`). De står ikke i koden.

1. Hent prisen per million input- og output-tokens for modellen fra prissiden eller kontoen den dagen målingen gjøres.
2. Hent valutakursen med kilde og dato (for eksempel Norges Bank).
3. Regn om til kroner og før pris, kilde, kurs og dato inn i avsnitt 0 i malen.

## 5. Kontroll av hver nøkkel (ett par, én kjøring)

Før den fulle målingen: én kjøring med ett par, så en feil nøkkel eller et feil modellnavn ikke bruker opp kreditten.

```bash
npm run testsett -- --leverandor mistral --modell <modell> --pris-inn <kr> --pris-ut <kr> --par par-2-it-support --ganger 1
npm run testsett -- --leverandor openai --modell gpt-4.1-mini --pris-inn <kr> --pris-ut <kr> --par par-2-it-support --ganger 1
```

Sjekk i rapporten:

- [ ] Status 200 og ingen feilkode. Ved `llm_feil`: sjekk nøkkelen, kreditten og modellnavnet.
- [ ] «Modellversjon fra leverandøren» er et datobestemt eller spesifikt navn. Er `--modell` et alias, skal versjonen være forskjellig fra aliaset.
- [ ] «Resonnering (reasoningEffort)» er `low` for `mistral-large-4-0` og `none` for `mistral-medium-2604`.
- [ ] Er `--modell` et alias (for eksempel `…-latest`), har rapporten **ikke** merknaden «samme som navnet som ble bedt om». Merknaden betyr da at leverandøren kanskje ikke oppga noen versjon, og at AI SDK bare gjentok aliaset fra `--modell`. Stopp i så fall, og finn den faktiske versjonen (steg 3) før den fulle målingen. Med et datobestemt navn er merknaden normal: navnet kommer vanligvis tilbake uendret.
- [ ] Kostnaden er rimelig sammenlignet med budsjettet.

Kontrollrapporten er ikke en måling. Slett den, eller la være å committe den. Skriptet regner ikke filer i `testsett-rapporter/` som endringer i arbeidstreet, så den gjør ikke neste rapport «skitten». Andre filer gjør det.

## 6. Full måling per leverandør

Tre kjøringer av alle fire parene (12 kall per leverandør):

```bash
npm run testsett -- --leverandor mistral --modell <modell> --pris-inn <kr> --pris-ut <kr>
npm run testsett -- --leverandor openai --modell gpt-4.1-mini --pris-inn <kr> --pris-ut <kr>
```

- [ ] Hver kjøring gir utgangskode 0 og en rapport i `testsett-rapporter/` uten `-mock`.
- [ ] Toppteksten har commit, «Modell (bedt om)», «Modellversjon fra leverandøren» med antall kjøringer, priser, temperatur og tak.
- [ ] Viser toppteksten flere versjoner, har modellen byttet underveis. Noter det i malen, og vurder å måle på nytt.
- [ ] Kjøringer med feil (fra «Totalt») føres inn i avsnitt 0. Feilede kjøringer gjentas ikke stille. En ny runde er en ny kopi av malen.
- [ ] Commit hver ekte rapport (eller flytt den ut av prosjektet) før neste kjøring, så ingenting annet enn rapporter ligger uncommittet. Rapportene har ingen nøkler. Sjekk det med et søk etter `API_KEY` og nøkkelens prefiks før commit. En annen fil som ikke er committet (for eksempel den utfylte malen), gir merknaden om endringer i neste rapport.

## 7. Manuell test i appen (NFR-4, NFR-9)

Avsnitt 3 i malen. Testen bruker den samme kreditten som målingen. **Hver analyse i appen er ett betalt kall** (og telles i rate-limiten), så kjør bare de to analysene under, og ikke prøv igjen uten grunn. For hver leverandør:

1. Sjekk den gjenværende kreditten i kontoen. Før den andre leverandøren: sjekk at kreditten hos den fortsatt holder.
2. Sett `LLM_LEVERANDOR` og `LLM_MODELL` i `.env.local` til leverandøren og modellen som ble målt.
3. Kjør `npm run dev`.
4. Par 2 (`testdata/par-2-it-support`): gap-analysen kommer på bokmål innen 30 s (NFR-4). Noter tiden.
5. Par 1 med annonsen i `testdata/robusthet/annonse-med-instruks.txt`: AFR er fortsatt Mangler, og ingen AFR- eller bankerfaring påstås (NFR-9).
6. Stopp `npm run dev`, og **fjern `LLM_LEVERANDOR` og `LLM_MODELL` fra `.env.local`** igjen, så de ikke styrer neste test eller senere utvikling.

## 8. Utfylling av malen

Kopier [`vurdering-2-4-leverandorvalg.md`](vurdering-2-4-leverandorvalg.md) for runden (én kopi per målerunde), og fyll ut:

- Avsnitt 0: rapportfilene, modell (bedt om), modellversjonen fra leverandøren (fra rapporten), commit, rent arbeidstre, priser, kilder, kurs og feil.
- Avsnitt 1: vilkårene med lenke og dato.
- Avsnitt 2: kategorier, sjekklisten og hjelpetallene per par og kjøring.
- Avsnitt 3: den manuelle testen.
- Avsnitt 4: sammendraget. «1 kr per kjøring» vurderes som gjennomsnittlig kostnad per gap-kjøring × 4.

## 9. Valget

Regelen (AD-11, avsnitt 5 i malen): Mistral velges hvis vilkårene er i orden, og den består SM-1 (gap), SM-2, SM-3 og NFR-5 innenfor 1 kr per kjøring. Ellers velges OpenAI.

- Feiler **begge** på samme punkt, er det prompten: rett den med `bmad-build`, og mål **begge** på nytt (ny målerunde, ny kopi av malen, rad i avsnitt 6).
- Feiler **bare Mistral**, velges OpenAI.
- Kevin og Sondre vurderer og bestemmer sammen, og begge signerer malen.

## 10. Etterarbeid

- [ ] Commit rapportene og den utfylte malen.
- [ ] Noter resultatet, modellen (bedt om og versjonen fra leverandøren) og commit i sesjonsloggen (`sesjonslogg`-skillen).
- [ ] Avsnitt 7 i malen: forslag om `MAKS_UTDATA_TOKENS` og `STANDARD_MODELL`. Ingen av dem endres uten Kevins godkjenning.
- [ ] Merk PRD §10.1 som løst med dato og lenke til malen.
- [ ] Slett eller roter nøklene som ble brukt til målingen, hvis de ikke skal brukes i produksjonen.
- [ ] 2-4 står som `in-progress` til del C (vilkår, Vercel Production, kreditt under 200 kr, personvernboks) er gjort.
