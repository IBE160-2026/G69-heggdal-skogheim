# Kjørebok: produksjonen med valgt leverandør (story 2.4 del C)

> **Valget er tatt 2026-11-19: OpenAI `gpt-4.1-mini` med temperatur 0** (Kevin og Sondre, AD-11). Del C gjelder derfor OpenAI. `LLM_LEVERANDOR=openai`, `LLM_MODELL=gpt-4.1-mini`, `OPENAI_API_KEY` (en egen nøkkel for produksjonen) bare i Production. Personvernboksen skal vise «CV-teksten sendes til OpenAI i USA. Det betyr at opplysningene overføres ut av EØS.», og `/api/status` skal gi `tredjeland: true`. Sondre må bekrefte innstillingene for deling av data og avtalegrunnlaget (DPA) før produksjonsbruk (avsnitt 7 i `vurdering-2-4-kontroll-temperatur-0.md`). Merk: SM-1 er ikke bestått (par 3) og må løses før innleveringen.
>
> **Forberedt 2026-11-19, ikke startet.** Del C begynner først når del B har valgt leverandøren etter AD-11 og Kevin og Sondre har signert [`vurdering-2-4-leverandorvalg-runde-1.md`](vurdering-2-4-leverandorvalg-runde-1.md) (eller en senere runde). **Hver endring i Vercel og hvert betalt kall i produksjonen krever Kevins godkjenning.** Ingen nøkler skrives i chat, git eller logger.

Del C dekker AK 3 i story 2.4 (`epics.md`, story 2.4):

> **Gitt** den valgte leverandøren **Når** valget er tatt **Så** er vilkårene sjekket direkte (API-data brukes ikke til trening, og det finnes en databehandleravtale), `LLM_LEVERANDOR`, `LLM_MODELL` og nøkkelen er satt i Production på Vercel, og det er forhåndsbetalt kreditt uten automatisk påfylling, satt under 200 kr **Og** personvernboksen i produksjon viser riktig leverandør og land

Reglene som gjelder: AD-11 (FR-5-teksten bygges bare fra `leverandor` i `/api/status`), AD-12 (nøkkelen bare i Production, så forhåndsvisninger kjører i demomodus, og ingen `NEXT_PUBLIC_`-variabler) og NFR-3 (grensen for forbruket hos leverandøren er det harde taket).

## Utgangspunktet (kontrollert 2026-11-19, gratis `GET`)

`https://g69-cv-assistent.vercel.app/api/status` svarer `{"modus":"demo","leverandor":{"navn":"Mistral AI","land":"Frankrike","tredjeland":false}}`, og `X-Vercel-Id` starter med `arn1::arn1`. Produksjonen har altså ingen nøkkel og bruker standardleverandøren. Vercel-prosjektet er `g69-cv-assistent` (Sondre), med `regions: ["arn1"]` i `vercel.json`.

## C1. Vilkårene for den valgte leverandøren

- [ ] Avsnitt 1 i vurderingen har `J` på trening og databehandleravtale, med lenke og dato. Feltene merket **(bekreftes)** er lukket.
- [ ] **Mistral:** bryteren for API-trening er av (Admin → Privacy). Labs-modeller er av. Databehandleravtalen er en del av avtalen ([DPA](https://legal.mistral.ai/terms/data-processing-addendum), gjeldende fra 2026-07-27). Data ligger i EØS som standard.
- [ ] **OpenAI:** deling er av (Settings → Data controls). Databehandleravtalen ([DPA](https://openai.com/policies/data-processing-addendum/)) er lest i nettleser og inngått eller bekreftet for organisasjonen. Behandlingen skjer i USA, altså i et tredjeland.
- [ ] Datoen for kontrollen er ført inn i sesjonsloggen.

## C2. Kreditten og grensen for forbruket

- [ ] Kontoen som brukes i produksjonen, har forhåndsbetalt kreditt **under 200 kr inkl. mva.**, og automatisk påfylling er av.
  - **Mistral (Kevin):** 10 USD, påfylling av, og organisasjonen har en grense på 2 USD per måned (bekreftet 2026-11-19).
  - **OpenAI (Sondre):** ca. 5 USD, påfylling av.
- [ ] Det er notert om grensen for forbruket også skal gjelde produksjonen, eller om den skal økes (krever Kevins beslutning). 2 USD (ca. 19,4 kr uten mva) rekker til ca. 230 gap-analyser med Medium 3.5 (0,0844 kr per analyse, 9,6866 kr per USD), eller ca. 57 fulle kjøringer når brev, CV og ATS kommer i epic 3 (× 4).

## C3. Nøkkelen for produksjonen og Vercel (krever godkjenning)

1. [ ] Lag en **egen API-nøkkel for produksjonen** hos den valgte leverandøren. Bruk ikke nøkkelen fra målingen. Gi den et navn, for eksempel `g69-produksjon`.
2. [ ] Sett i Vercel → `g69-cv-assistent` → Settings → Environment Variables, **bare for Production** (ikke Preview eller Development):
   - `LLM_LEVERANDOR`: `mistral` eller `openai`.
   - `LLM_MODELL`: det datobestemte navnet fra vurderingen (for eksempel `mistral-medium-2604` eller `gpt-4.1-mini`).
   - `MISTRAL_API_KEY` eller `OPENAI_API_KEY`: bare nøkkelen til den valgte leverandøren. Merk den som Sensitive.
3. [ ] Sjekk at ingen av variablene har prefikset `NEXT_PUBLIC_` (AD-12), og at Preview fortsatt ikke har nøkkel.
4. [ ] Deploy produksjonen på nytt (Redeploy av siste produksjonsdeploy fra `main`), så variablene tas i bruk.
5. [ ] Avgjør om `GRENSE_PER_MINUTT` og `GRENSE_PER_DOGN` skal settes, eller om standardverdiene fra AD-9 gjelder (krever Kevins beslutning).

## C4. Kontroll i produksjonen

- [ ] **Gratis:** `GET https://g69-cv-assistent.vercel.app/api/status` gir `modus: "ekte"` og riktig leverandør. Mistral skal gi `Mistral AI`, `Frankrike` og `tredjeland: false`. OpenAI skal gi `OpenAI`, `USA` og `tredjeland: true`. `X-Vercel-Id` skal starte med `arn1`.
- [ ] **Gratis:** personvernboksen viser «CV-teksten sendes til Mistral AI i Frankrike.», eller for OpenAI «CV-teksten sendes til OpenAI i USA. Det betyr at opplysningene overføres ut av EØS.» (`src/lib/okt/personvern.ts`).
- [ ] **Gratis:** en forhåndsvisning (Preview) står fortsatt i demomodus.
- [ ] **Betalt, krever godkjenning:** én analyse med `par-2-it-support` i produksjonen gir en gap-analyse på bokmål innen 30 s (NFR-4). Noter tiden.
- [ ] Forbruket i konsollen etter analysen stemmer med forventet kostnad.

## C5. Dokumentasjonen og avslutningen

- [ ] Avsnitt 5 og 7 i vurderingen er fylt ut og signert av Kevin og Sondre.
- [ ] PRD §10.1 er merket som løst med dato og lenke til vurderingen (forslaget i avsnitt 7).
- [ ] Forslagene om `STANDARD_MODELL` og `MAKS_UTDATA_TOKENS` er godkjent eller avvist av Kevin, og eventuelle endringer er gjort med `bmad-build`.
- [ ] Nøklene fra målingen er slettet eller rotert hos leverandørene, og de er fjernet fra `.env.local` hvis de ikke skal brukes videre lokalt.
- [ ] Sesjonsloggen har resultatet, `LLM_MODELL` og commit (AK 2), og `issues.md` er oppdatert.
- [ ] Først når AK 1–3 er oppfylt: 2-4 settes til `done` i `sprint-status.yaml`, og PR-en for del B og C går til gjennomgang hos Sondre. Push og PR krever Kevins godkjenning.
