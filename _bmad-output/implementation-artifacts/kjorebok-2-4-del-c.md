# Kjørebok: produksjonen med valgt leverandør (story 2.4 del C)

> **Valget er tatt 2026-11-19: OpenAI `gpt-4.1-mini` med temperatur 0** (Kevin og Sondre, AD-11). Del C gjelder derfor OpenAI. `LLM_LEVERANDOR=openai`, `LLM_MODELL=gpt-4.1-mini`, `OPENAI_API_KEY` (en egen nøkkel for produksjonen) bare i Production. Personvernboksen skal vise «CV-teksten sendes til OpenAI i USA. Det betyr at opplysningene overføres ut av EØS.», og `/api/status` skal gi `tredjeland: true`. Sondre må bekrefte innstillingene for deling av data og avtalegrunnlaget (DPA) før produksjonsbruk (avsnitt 7 i `vurdering-2-4-kontroll-temperatur-0.md`). Det er bekreftet 2026-11-20, se C1. Merk: SM-1 er ikke bestått (par 3) og må løses før innleveringen.
>
> **Status 2026-11-20: påbegynt** på grenen `story-2.4-del-c-produksjon`. Utgangspunktet er kontrollert på nytt, og grensene og `MAKS_UTDATA_TOKENS` er avgjort (C3 punkt 5 og C5). C1 og C2 er bekreftet av Sondre 2026-11-20. Unntaket er punktet om grensen for forbruket i C2, som er Kevins beslutning. C3–C4 er ikke startet, og ingenting er endret i Vercel.
>
> **Forberedt 2026-11-19.** Del C begynner først når del B har valgt leverandøren etter AD-11 og Kevin og Sondre har signert [`vurdering-2-4-leverandorvalg-runde-1.md`](vurdering-2-4-leverandorvalg-runde-1.md) (eller en senere runde). **Hver endring i Vercel og hvert betalt kall i produksjonen krever Kevins godkjenning.** Ingen nøkler skrives i chat, git eller logger.

Del C dekker AK 3 i story 2.4 (`epics.md`, story 2.4):

> **Gitt** den valgte leverandøren **Når** valget er tatt **Så** er vilkårene sjekket direkte (API-data brukes ikke til trening, og det finnes en databehandleravtale), `LLM_LEVERANDOR`, `LLM_MODELL` og nøkkelen er satt i Production på Vercel, og det er forhåndsbetalt kreditt uten automatisk påfylling, satt under 200 kr **Og** personvernboksen i produksjon viser riktig leverandør og land

Reglene som gjelder: AD-11 (FR-5-teksten bygges bare fra `leverandor` i `/api/status`), AD-12 (nøkkelen bare i Production, så forhåndsvisninger kjører i demomodus, og ingen `NEXT_PUBLIC_`-variabler) og NFR-3 (grensen for forbruket hos leverandøren er det harde taket).

## Utgangspunktet (kontrollert 2026-11-19, gratis `GET`)

`https://g69-cv-assistent.vercel.app/api/status` svarer `{"modus":"demo","leverandor":{"navn":"Mistral AI","land":"Frankrike","tredjeland":false}}`, og `X-Vercel-Id` starter med `arn1::arn1`. Produksjonen har altså ingen nøkkel og bruker standardleverandøren. Vercel-prosjektet er `g69-cv-assistent` (Sondre), med `regions: ["arn1"]` i `vercel.json`.

**Kontrollert på nytt 2026-11-20 kl. 11:41 UTC** (kontroll av utgangspunktet før C1, gren `story-2.4-del-c-produksjon` fra `main` `0292337`, gratis `GET`):
- `HTTP/1.1 200 OK`, `Content-Type: application/json`, `Cache-Control: public, max-age=0, must-revalidate`
- Svaret: `{"modus":"demo","leverandor":{"navn":"Mistral AI","land":"Frankrike","tredjeland":false}}`
- `X-Vercel-Id` starter med `arn1::arn1`

Utgangspunktet er uendret. Produksjonen står fortsatt i demomodus uten nøkkel og viser standardleverandøren (Mistral). `LLM_LEVERANDOR=openai` er altså ikke satt ennå. Personvernboksen bygges bare fra `leverandor` i `/api/status` (AD-11), så den viser etter alt å dømme Mistral og Frankrike til C3 er gjort. Selve siden er ikke åpnet. Det kontrolleres i C4.

## C1. Vilkårene for den valgte leverandøren

> **Bekreftet 2026-11-20 av Sondre** (kontoen er hans, og bekreftelsen er gitt videre av Kevin). Det er ikke kontrollert på nytt av oss andre:
> - Trening og deling av data er slått av i OpenAI.
> - Sondre har lest DPA-en ([openai.com/policies/data-processing-addendum](https://openai.com/policies/data-processing-addendum/)) og bekrefter at den gjelder automatisk når tjenestene brukes. Den må ikke inngås separat.
> - Ifølge Sondre er **OpenAI Ireland Ltd.** avtaleparten for kunder i EØS.
>
> **Personvernteksten:** at avtaleparten er irsk, endrer ikke hvor behandlingen skjer. Dataene behandles fortsatt i USA (avsnitt 7 i vurderingen: lagring og behandling i EU krever godkjenning via salg). Teksten «CV-teksten sendes til OpenAI i USA. Det betyr at opplysningene overføres ut av EØS.» og `tredjeland: true` er derfor fortsatt riktige. De kontrolleres i produksjonen i C4.

- [x] Vilkårene har `J` på trening og databehandleravtale, med lenke og dato. Kriteriet er tilpasset: det pekte på avsnitt 1 i malen (`vurdering-2-4-leverandorvalg.md`), som ikke fylles ut. For det valgte oppsettet står J, lenke og dato i avsnitt 7 i `vurdering-2-4-kontroll-temperatur-0.md`. Datoen for versjonen av DPA-en er ikke notert. Feltene merket «(bekreftes av Sondre)» i vurderingen for runde 1 er historiske og står uendret. Feltene merket «Må bekreftes» er lukket 2026-11-20.
- [x] **Mistral:** ikke aktuelt, fordi Mistral ikke ble valgt. Kevins kontroll fra 2026-11-19 står i `vilkaar-og-priser-2-4.md`.
- [x] **OpenAI:** deling er av (Settings → Data controls). DPA-en er lest og gjelder automatisk for organisasjonen (Sondre, 2026-11-20). Behandlingen skjer i USA, altså i et tredjeland.
- [x] Datoen for kontrollen er ført inn i sesjonsloggen (`.logs/kevin-heggdal/992-2026-11-20-12-41-17-story-2-4-del-c-produksjon.md`).

## C2. Kreditten og grensen for forbruket

> **Bekreftet 2026-11-20 av Sondre** (gitt videre av Kevin):
> - 5 USD i kreditt er kjøpt én gang, 2026-11-19. Med 25 % mva. ble beløpet 6,25 USD, ca. 60 kr (6,25 × 9,6866 kr per USD, Norges Bank 2026-11-19).
> - Det er ikke fylt på senere, og automatisk påfylling er slått av.
> - Beløpet er under grensen på 200 kr inkl. mva.
> - **Saldoen nå er ikke notert.** Målingene med OpenAI i del B er trukket fra samme kreditt (anslagsvis 1–2 kr), så det som er igjen, er litt under 5 USD.
> - Ifølge OpenAIs hjelpesider utløper kreditten etter ett år, altså rundt 2026-11-19 året etter. Det er ikke verifisert (`vilkaar-og-priser-2-4.md`).
> - **Samme organisasjon og samme kreditt:** nøkkelen for produksjonen (C3) og nøkkelen fra målingen trekker trolig fra samme kreditt. Nøkkelen fra målingen bør derfor roteres eller slettes før eller like etter C3, så den ikke kan bruke av det harde taket for produksjonen (punktet står i `issues.md`).
>
> Merk: tallene for kostnad per analyse i punktet om grensen under gjelder Mistral. For OpenAI `gpt-4.1-mini` er det målt ca. 0,0185 kr per gap-analyse og ca. 0,07 kr per full kjøring (`vurdering-2-4-kontroll-temperatur-0.md`).

- [x] Kontoen som brukes i produksjonen, har forhåndsbetalt kreditt **under 200 kr inkl. mva.**, og automatisk påfylling er av.
  - **Mistral (Kevin):** 10 USD, påfylling av, og organisasjonen har en grense på 2 USD per måned (bekreftet 2026-11-19). Brukes ikke i produksjonen.
  - **OpenAI (Sondre), brukes i produksjonen:** 5 USD (6,25 USD inkl. 25 % mva., ca. 60 kr), kjøpt én gang 2026-11-19. Påfylling er av (bekreftet 2026-11-20).
- [ ] Det er notert om grensen for forbruket også skal gjelde produksjonen, eller om den skal økes (krever Kevins beslutning). 2 USD (ca. 19,4 kr uten mva) rekker til ca. 230 gap-analyser med Medium 3.5 (0,0844 kr per analyse, 9,6866 kr per USD), eller ca. 57 fulle kjøringer når brev, CV og ATS kommer i epic 3 (× 4).
  - **For OpenAI (åpent, Kevins beslutning):** om prosjektet også skal ha en grense for forbruket. Den månedlige grensen hos OpenAI gjelder ifølge `vilkaar-og-priser-2-4.md` den automatiske påfyllingen, ikke bruken av API-et. Kreditten på 5 USD er det harde taket. Med hele beløpet på 5 USD rekker den til ca. 2600 gap-analyser eller ca. 690 fulle kjøringer etter de målte kostnadene uten mva. Saldoen nå er litt lavere.

## C3. Nøkkelen for produksjonen og Vercel (krever godkjenning)

1. [ ] Lag en **egen API-nøkkel for produksjonen** hos den valgte leverandøren. Bruk ikke nøkkelen fra målingen. Gi den et navn, for eksempel `g69-produksjon`.
2. [ ] Sett i Vercel → `g69-cv-assistent` → Settings → Environment Variables, **bare for Production** (ikke Preview eller Development):
   - `LLM_LEVERANDOR`: `mistral` eller `openai`.
   - `LLM_MODELL`: det datobestemte navnet fra vurderingen (for eksempel `mistral-medium-2604` eller `gpt-4.1-mini`).
   - `MISTRAL_API_KEY` eller `OPENAI_API_KEY`: bare nøkkelen til den valgte leverandøren. Merk den som Sensitive.
3. [ ] Sjekk at ingen av variablene har prefikset `NEXT_PUBLIC_` (AD-12), og at Preview fortsatt ikke har nøkkel.
4. [ ] Deploy produksjonen på nytt (Redeploy av siste produksjonsdeploy fra `main`), så variablene tas i bruk.
5. [x] Avgjør om `GRENSE_PER_MINUTT` og `GRENSE_PER_DOGN` skal settes, eller om standardverdiene fra AD-9 gjelder (krever Kevins beslutning). **Avgjort 2026-11-20 (Kevin):** standardverdiene i koden gjelder: 10 per minutt og 200 per UTC-døgn (`src/lib/pipeline/grense.ts`). Variablene settes ikke i Vercel. De vurderes på nytt før brukertesten i 2.8 og i epic 3.

Sondre har sagt (2026-11-20) at han lager nøkkelen for produksjonen og legger inn variablene i Vercel. Punkt 1–4 er ikke startet. Fremgangsmåten for Sondre står i [`sjekkliste-2-4-c3-sondre.md`](sjekkliste-2-4-c3-sondre.md) (godkjent av Kevin 2026-11-20). Kravet er at grunnlaget for overføringen til USA er bekreftet i DPA-en før Redeploy.

## C4. Kontroll i produksjonen

- [ ] **Gratis:** `GET https://g69-cv-assistent.vercel.app/api/status` gir `modus: "ekte"` og riktig leverandør. Mistral skal gi `Mistral AI`, `Frankrike` og `tredjeland: false`. OpenAI skal gi `OpenAI`, `USA` og `tredjeland: true`. `X-Vercel-Id` skal starte med `arn1`.
- [ ] **Gratis:** personvernboksen viser «CV-teksten sendes til Mistral AI i Frankrike.», eller for OpenAI «CV-teksten sendes til OpenAI i USA. Det betyr at opplysningene overføres ut av EØS.» (`src/lib/okt/personvern.ts`).
- [ ] **Gratis:** en forhåndsvisning (Preview) står fortsatt i demomodus.
- [ ] **Betalt, krever godkjenning:** én analyse med `par-2-it-support` i produksjonen gir en gap-analyse på bokmål innen 30 s (NFR-4). Noter tiden.
- [ ] Forbruket i konsollen etter analysen stemmer med forventet kostnad.

## C5. Dokumentasjonen og avslutningen

- [ ] Avsnitt 5 og 7 i vurderingen er fylt ut og signert av Kevin og Sondre.
- [ ] PRD §10.1 er merket som løst med dato og lenke til vurderingen (forslaget i avsnitt 7).
- [x] Forslagene om `STANDARD_MODELL` og `MAKS_UTDATA_TOKENS` er godkjent eller avvist av Kevin, og eventuelle endringer er gjort med `bmad-build`. **2026-11-20:**
  - `STANDARD_MODELL.openai` var allerede `gpt-4.1-mini` (`spec-2-4-del-b-valgt-oppsett.md`).
  - `MAKS_UTDATA_TOKENS` beholdes på 8000 (Kevin). Bare kommentaren i `src/lib/llm/felles.ts` er oppdatert (`spec-2-4-del-c-maks-utdata-tokens.md`).
  - Taket vurderes på nytt i epic 3.
- [ ] Nøklene fra målingen er slettet eller rotert hos leverandørene, og de er fjernet fra `.env.local` hvis de ikke skal brukes videre lokalt.
- [ ] Sesjonsloggen har resultatet, `LLM_MODELL` og commit (AK 2), og `issues.md` er oppdatert.
- [ ] Først når AK 1–3 er oppfylt: 2-4 settes til `done` i `sprint-status.yaml`, og PR-en for del C går til gjennomgang hos Sondre (del B er allerede merget, PR #21). Push og PR krever Kevins godkjenning.
