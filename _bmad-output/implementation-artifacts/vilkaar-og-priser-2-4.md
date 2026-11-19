# Vilkår og priser: Mistral og OpenAI (story 2.4 del B)

> **Forhåndsundersøkt 2026-11-19 i offentlige kilder. Ingenting her er bekreftet.** Hver opplysning **må bekreftes i kontoen** hos leverandøren før målingen, og igjen før produksjonen (del C). Skriv inn lenke og dato i avsnitt 1 og 0 i [`vurdering-2-4-leverandorvalg.md`](vurdering-2-4-leverandorvalg.md). Ingen måleresultater står her.

Kriteriene kommer fra PRD §6 (vilkår først), AD-11 (ingen trening på API-data, databehandleravtale, kreditt uten automatisk påfylling) og AK 3 i story 2.4.

## Budsjettet (beslutning, Kevin og Sondre 2026-11-19)

| Leverandør | Ansvarlig | Budsjett | Påfylling |
|---|---|---|---|
| Mistral | Kevin | 10 USD i forhåndsbetalt kreditt (kjøpt 2026-11-19) | Automatisk påfylling slått av (Kevin, 2026-11-19) |
| OpenAI | Sondre | ca. 5 USD i forhåndsbetalt kreditt (planlagt). Kontoen er opprettet, men beløpet er ikke oppgitt her | Automatisk påfylling slått av, og delingen under Data controls er slått av (Sondres logg 2026-11-19) |

Taket for begge til sammen er under 200 kr (epic 2, kostnad). **Taket gjelder beløpet som faktisk belastes, med mva.** Kreditten kan bli belastet med mva. (Mistral trekker kreditten med mva., se avsnittet om Mistral). I øvre del av spennet kan 10 EUR + 5 USD med 25 % mva. komme over 200 kr. Beløpet hos Mistral må derfor fastsettes når kursen er kjent, slik at summen med mva. holder seg under taket. Her oppgis verken valutakurs eller beløp i kroner. Før kursen og datoen inn i avsnitt 0 i vurderingsmalen, med kilde (for eksempel Norges Banks valutakurser), den dagen kreditten kjøpes.

## Mistral (La Plateforme / AI Studio)

| Punkt | Forhåndsundersøkt (2026-11-19) | Kilde | Må bekreftes i kontoen |
|---|---|---|---|
| Trening på API-data | Data fra La Plateforme API brukes ikke til trening. Scale-planen er unntatt fra trening som standard. På Experiment-planen må det slås av i Admin Console under Privacy. Innstillingen for Vibe er egen og gjelder ikke API-et. | [help.mistral.ai 323757](https://help.mistral.ai/en/articles/323757-do-you-use-my-user-data-to-train-your-artificial-intelligence-models), [help.mistral.ai 455207](https://help.mistral.ai/en/articles/455207-can-i-opt-out-of-my-input-or-output-data-being-used-for-training), [docs: privacy data controls](https://docs.mistral.ai/admin/monitor-comply/privacy-data-controls) (alle lest 2026-11-19) | **Bekreftet av Kevin 2026-11-19:** under Admin → API → Privacy er «Allow the use of your API calls to train Mistral’s AI models» slått av, og Labs models er også slått av |
| Databehandleravtale (DPA) | Mistral har en DPA som del av vilkårene. Lenken er ikke åpnet i forundersøkelsen. | [mistral.ai/terms](https://mistral.ai/terms) (**ikke verifisert, må leses og bekreftes**: lenken ble ikke åpnet 2026-11-19) | At DPA-en gjelder for API-et og kontoen. Lagre lenken og datoen |
| Land og region | Frankrike (EU), som i vurderingsmalen | Vurderingsmalen avsnitt 1 | Bekreftes i vilkårene |
| Betalt plan | Bruk ut over den inkluderte månedlige bruken krever at pay-as-you-go er slått på og at saldoen er positiv | [docs: billing](https://docs.mistral.ai/admin/billing-usage/billing) (lest 2026-11-19) | At kontoen har betalt API, ikke bare gratisplanen |
| Forhåndsbetaling og påfylling | Kreditter kjøpes under Billing i Admin Panel. Kredittene trekkes med mva., mens grensen for forbruket regnes uten mva., så kreditten kan ta slutt før grensen er nådd | [docs: billing](https://docs.mistral.ai/admin/billing-usage/billing) (lest 2026-11-19) | At ingen automatisk påfylling er slått på |
| Grense for forbruket | Månedlig grense for organisasjonen under Admin Panel → Subscriptions → Billing. Workspaces har ingen grense som standard, og grensen settes under Administration → Workspaces → Settings → «Monthly spending limit» | [docs: usage limits](https://docs.mistral.ai/admin/billing-usage/usage-limits) (lest 2026-11-19) | Sett grensen for organisasjonen (og workspacen) til budsjettet |
| Modellnavn | Fra `GET /v1/models` med Kevins konto 2026-11-19: `mistral-medium-latest` = `mistral-medium-2604` (Medium 3.5, også `mistral-medium-3-5`). `mistral-large-latest` = `mistral-large-4` / `mistral-large-4-0` (Large 4). I tillegg `mistral-large-2512` og `mistral-small-2603`. API-et viste ingen utfasing, men dokumentasjonen merker Medium 3.5 som utfaset 2026-10-31 (avvikles 2027-04-30), med Large 4 som erstatning | `GET /v1/models` (2026-11-19), [docs: models](https://docs.mistral.ai/getting-started/models) (lest 2026-11-19) | Modellvalget tas av Kevin (Medium, Large 4 eller begge) |
| Pris | **Large 4 (`mistral-large-4-0`): 0,70 USD inn og 2,10 USD ut per million tokens** (cached input 0,07), fra Mistrals egen modellside (lest 2026-11-19, ingen kampanje oppgitt). Tredjeparter oppga 1,36 / 4,18 USD, men de stemmer ikke med Mistral selv. **Medium 3.5 (`mistral-medium-2604`):** Mistrals modellside viser ingen pris. Bare tredjeparter oppgir den, til ca. 1,50 USD inn og 7,50 USD ut (**ikke verifisert**, må bekreftes i kontoen) | [docs: Mistral Large 4](https://docs.mistral.ai/models/mistral-large-4-0), [docs: Mistral Medium 3.5](https://docs.mistral.ai/models/mistral-medium-3-5-26-04) (begge lest 2026-11-19), [pricepertoken: Medium 3.5](https://pricepertoken.com/pricing-page/model/mistral-ai-mistral-medium-3.5) | Prisen for Medium 3.5 i kontoen. Kursen til kroner med kilde og dato |

**Slås av eller settes i kontoen (Kevin):**
- Trening av: Admin Panel → API → Privacy (hvis planen ikke er unntatt).
- Månedlig grense for forbruket i organisasjonen og workspacen, innenfor budsjettet.
- Ingen automatisk påfylling.
- En egen API-nøkkel for målingen. Den legges bare i `.env.local` og slettes eller roteres etter målingen.

## OpenAI (API Platform)

| Punkt | Forhåndsundersøkt (2026-11-19) | Kilde | Må bekreftes i kontoen |
|---|---|---|---|
| Trening på API-data | Data sendt til API-et brukes ikke til trening som standard | [openai.com/enterprise-privacy](https://openai.com/enterprise-privacy/) (**ikke verifisert, må leses og bekreftes**: lenken ble ikke åpnet 2026-11-19, opplysningen er fra spec-en for del B) | At organisasjonen ikke har slått på deling av data (Settings → Data controls) |
| Databehandleravtale (DPA) | Det finnes en DPA, som inngås via et skjema | [openai.com/policies/data-processing-addendum](https://openai.com/policies/data-processing-addendum/) (**ikke verifisert, må leses og bekreftes**: lenken ble ikke åpnet 2026-11-19, opplysningen er fra spec-en for del B) | At DPA-en er inngått eller kan inngås for kontoen. Lagre lenken og datoen |
| Land og region | USA (tredjeland), som i vurderingsmalen | Vurderingsmalen avsnitt 1 | Bekreftes i vilkårene. Velges OpenAI, må personvernteksten si at data går ut av EØS (del C) |
| Betalt plan | API-et faktureres med forhåndsbetalt kreditt, uavhengig av ChatGPT | [help.openai.com 8264644](https://help.openai.com/en/articles/8264644-setting-up-and-managing-prepaid-api-billing) (**ikke verifisert, må leses og bekreftes**: bare søkeresultat 2026-11-19, siden ble ikke åpnet) | At det er API-kontoen, ikke ChatGPT, som har kreditt |
| Forhåndsbetaling og påfylling | Minste kjøp er 5 USD (standardbeløpet er 10 USD). Automatisk påfylling er slått **på** som standard ved oppsettet og må slås av. Kreditter utløper etter ett år og refunderes ikke | [help.openai.com 8264644](https://help.openai.com/en/articles/8264644-setting-up-and-managing-prepaid-api-billing), [help.openai.com 8264778](https://help.openai.com/en/articles/8264778-what-is-prepaid-billing) (**ikke verifisert, må leses og bekreftes**: bare søkeresultat 2026-11-19, siden ble ikke åpnet) | At beløpet endres fra 10 til 5 USD, og at automatisk påfylling er av |
| Grense for forbruket | Det er en valgfri månedlig grense for automatisk påfylling. Den er ikke en grense for bruken av API-et. Forhåndsbetalt kreditt er det harde taket | Samme kilder (**ikke verifisert, må leses og bekreftes**) | At kreditten er 5 USD og påfyllingen av |
| Modellnavn | `gpt-4.1-mini` (beslutning, Kevin 2026-11-19). `STANDARD_MODELL` for OpenAI er endret fra `gpt-5-mini` til `gpt-4.1-mini` etter Sondres gjennomgang av PR #14. `gpt-5-mini` ga 404 uten en verifisert organisasjon | Sondres logg 2026-11-19, spec-en for del B | Den faktiske versjonen står i rapporten under «Modellversjon fra leverandøren» |
| Pris | `gpt-4.1-mini`: ca. 0,40 USD per million input-tokens og 1,60 USD per million output-tokens. **Ikke verifisert, må leses og bekreftes** (oppgitt etter hukommelsen, ikke lest i en kilde 2026-11-19) | [openai.com/api/pricing](https://openai.com/api/pricing/) (ikke åpnet) | Prisen i kontoen den dagen målingen gjøres, og kursen til kroner med kilde og dato |

**Slås av eller settes i kontoen (Sondre):**
- Kjøp 5 USD i kreditt (endre standardbeløpet på 10 USD).
- Slå av automatisk påfylling.
- Sjekk at deling av data for trening er av.
- En egen API-nøkkel for målingen. Den gis til den som kjører målingen på en sikker måte (ikke i chat eller git), legges bare i `.env.local` og slettes eller roteres etter målingen.

## Åpne spørsmål før målingen

- **Mistral-modellen:** løst 2026-11-19 for selve målingen. Begge måles (`mistral-medium-2604` og `mistral-large-4-0`, fra `GET /v1/models`). Det endelige valget tas av Kevin, se anbefalingen i økten.
- **Prisene for Mistral:** bare fra tredjeparter (se tabellen over). De må bekreftes i kontoen den dagen målingen gjøres.
