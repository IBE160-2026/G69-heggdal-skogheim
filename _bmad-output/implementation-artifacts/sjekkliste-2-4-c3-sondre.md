# Sjekkliste for Sondre: produksjonsnøkkel og Vercel (story 2.4 del C, C3)

> **Godkjent av Kevin 2026-11-20.** Ikke start før Kevin har gitt beskjed. Hvert steg merket 🔒 krever Kevins godkjenning i forkant. Grunnlaget er C3 og C4 i [`kjorebok-2-4-del-c.md`](kjorebok-2-4-del-c.md), AD-12 (nøkkelen bare i Production, ingen `NEXT_PUBLIC_`) og AD-11 (personvernteksten bygges bare fra `/api/status`).

> **Status 2026-11-20 (Kevin og Sondre):**
> - Punkt 0–5 er gjort.
> - Variablene ligger bare i Production, og Redeploy er tatt.
> - De gratis kontrollene og den betalte kontrollen med par 2 er bestått med forbehold (bokmål er ikke bekreftet). Se C3 og C4 i [`kjorebok-2-4-del-c.md`](kjorebok-2-4-del-c.md).
> - Den første nøkkelen var lagt inn feil og ga 502. Sondre har erstattet den med `produksjon-vercel-2` og slettet den gamle.
> - **Punkt 6:** `kevin-maaling-2-4` beholdes til B4 del 2 er gjort.
> - **Punkt 7:** navnet på nøkkelen er meldt. Prosjektet, eieren og rettighetene er ikke meldt.
> - **Gjenstår:** bekreftelsen av forbruket under *Usage* eller *Activity* (Sondre).
>
> **Lærdom:** `/api/status` viser bare at en nøkkel *finnes*, ikke at den er gyldig. En ugyldig nøkkel gir 502 (`llm_feil`) først ved et kall. Neste gang en nøkkel byttes, skal den betalte kontrollen gjøres rett etter Redeploy.

## Avtalt rekkefølge (Sondre og Kevin, 2026-11-20)

1. PR-en for del C gjøres ferdig (dokumentasjonen og denne sjekklisten).
2. Sondre går gjennom PR-en og fletter den til `main`.
   - Vercel lager trolig en ny produksjonsdeploy ved flettingen. Det er ikke kontrollert.
   - Produksjonen står da fortsatt i demomodus, fordi variablene ikke er satt ennå.
3. Sondre legger inn variablene, bare for Production (punkt 2–3), og tar en Redeploy (punkt 4) etter Kevins «gå».
4. Kevin og Sondre tar kontrollene i C4 sammen (punkt 5). Etterpå kommer nøklene fra del B (punkt 6).

**Regelen for nøkkelen:** nøkkelen skrives bare ett sted, i Vercel. Den skal ikke i chat, Discord, e-post, git, skjermbilder, logger eller `.env`-filer. Del heller ikke deler av den, som de siste tegnene. Si bare at den er lagt inn, og hva den heter.

## 0. Før du starter

- [x] Kevin har godkjent denne sjekklisten (2026-11-20). Punkt 2–4 starter etter flettingen av PR-en for del C.
- [x] **Grunnlaget for overføringen til USA (personvern): kontrollert i DPA-en 2026-11-20.** Ikke kontrollert: hvilket av grunnlagene som faktisk brukes (SCC eller DPF), om OpenAI er sertifisert under DPF, og datoen for versjonen.
  - Svaret: punkt 4.1 i DPA-en beskriver overføringer ut av EØS med SCC eller en beslutning om tilstrekkelig beskyttelsesnivå etter GDPR art. 45, også EU–U.S. Data Privacy Framework.
  - Avtaleparten er OpenAI Ireland Ltd.
  - DPA-en gjelder automatisk.
  - Datoen for versjonen er ikke notert.

  Opprinnelig spørsmål (spørsmålet om datoen for versjonen er fortsatt åpent): les avsnittet om internasjonale overføringer i [DPA-en](https://openai.com/policies/data-processing-addendum/). Svar Kevin på dette:
  - Hvilket grunnlag gjelder: standard personvernbestemmelser (SCC), EU–US Data Privacy Framework (DPF) eller begge?
  - Hvilken dato har versjonen du leste («Last updated» eller «Effective»)?

  Det er ikke bekreftet ennå, og det trengs i personverndokumentasjonen (FR-5, PRD §6). **Krav (Kevin, 2026-11-20):** grunnlaget skal være bekreftet før produksjonsoppsettet aktiveres, altså før Redeploy i punkt 4. Fra da av sendes ekte CV-tekst til OpenAI.

## 1. Lag en egen API-nøkkel for produksjonen (C3.1)

> **Gjort 2026-11-20:** Sondre har laget en egen nøkkel for produksjonen og lagret den sikkert, utenfor GitHub. Navnet, prosjektet, eieren og rettighetene meldes i punkt 7. Stegene under er beholdt som dokumentasjon.
>
> **Avvik:** stegene sier at nøkkelen bare skal ligge i Vercel. **Avgjort 2026-11-20 (Kevin):** Sondre oppbevarer nøkkelen sikkert i en passordbehandler, ikke i en vanlig fil. Den skal aldri deles i chat, kode eller GitHub.

I [platform.openai.com](https://platform.openai.com), med organisasjonen som har kreditten på 5 USD:

- [ ] **Valgfritt, men anbefalt:** lag et eget prosjekt, `g69-produksjon` (prosjektvelgeren øverst → *Create project*). Da kan forbruket i produksjonen leses for seg under Usage, og det gjør kontrollen av forbruket i C4 enklere. Kreditten ligger på organisasjonen og deles uansett.
- [ ] Gå til *API keys* (under Settings, eller under prosjektet) → *Create new secret key*.
  - **Navn:** `g69-produksjon`
  - **Prosjekt:** `g69-produksjon`, eller prosjektet du bruker
  - **Eier:** *Service account* hvis det er mulig, så nøkkelen ikke er knyttet til brukeren din. *You* går også.
  - **Rettigheter:** *Restricted* med skrivetilgang bare til **Responses** (`/v1/responses`), som er det appen kaller (AI SDK, `openai(modell)`). Er du usikker på hvilke valg som dekker dette, velg *All*. Vi har ikke kunnet kontrollere de eksakte navnene i OpenAI-konsollen herfra. Feil rettigheter viser seg først ved den betalte kontrollen i C4, som en `llm_feil`.
- [ ] Kopier nøkkelen én gang, rett inn i Vercel (punkt 2). OpenAI viser den bare én gang. Lagre den ikke andre steder.
- [ ] Bruk **ikke** nøkkelen fra målingen i del B.

## 2. Miljøvariablene i Vercel (C3.2) 🔒

Vercel → prosjektet `g69-cv-assistent` → *Settings* → *Environment Variables* → *Add New*. Legg inn tre variabler:

| Navn (nøyaktig) | Verdi (nøyaktig) | Miljø | Sensitive |
|---|---|---|---|
| `LLM_LEVERANDOR` | `openai` | **bare Production** | ikke nødvendig |
| `LLM_MODELL` | `gpt-4.1-mini` | **bare Production** | ikke nødvendig |
| `OPENAI_API_KEY` | nøkkelen fra punkt 1 | **bare Production** | **ja**, slå på *Sensitive* |

- Verdiene skrives uten anførselstegn og uten mellomrom foran eller bak. Bruk små bokstaver i `openai`.
  - En skrivefeil i `LLM_LEVERANDOR` gir ingen feilmelding. Appen faller da tilbake til Mistral.
  - En skrivefeil i `LLM_MODELL` gir feil først ved den betalte kontrollen.
- **Ikke legg inn:**
  - `MISTRAL_API_KEY`
  - `GRENSE_PER_MINUTT` og `GRENSE_PER_DOGN`. Kevin har bestemt at standardverdiene i koden gjelder: 10 per minutt og 200 per døgn.
  - noe med prefikset `NEXT_PUBLIC_`. Slike verdier sendes til nettleseren (AD-12).

## 3. Bare Production, ikke Preview eller Development (C3.3)

- [ ] Når du legger inn hver variabel: **Vercel krysser trolig av for alle tre miljøene som standard.** Fjern krysset for *Preview* og *Development*, så bare *Production* står igjen.
- [ ] Sjekk lista etterpå. Hver av de tre variablene skal vise bare *Production*. Er en av dem lagt inn med feil miljø: slett den og legg den inn på nytt, eller rediger miljøet.
- [ ] Sjekk at ingen *gamle* variabler ligger i Preview eller Development, særlig `OPENAI_API_KEY` og `MISTRAL_API_KEY`. Det skal ikke finnes noen nøkkel der.
- [ ] Bruker du Vercel CLI: `vercel env ls` viser navn og miljø, men ikke verdiene, og kan brukes til kontrollen. **Kjør ikke** `vercel env pull`. Den skriver verdiene til en lokal fil.

## 4. Redeploy (C3.4) 🔒

Variablene tas først i bruk ved en ny deploy. Det gjelder også om flettingen av PR-en allerede har gitt en ny produksjonsdeploy, fordi den ble laget før variablene fantes. Gjør dette **bare når grunnlaget for overføringen er bekreftet (punkt 0) og Kevin har sagt «gå»**, og helst samme dag som de gratis kontrollene:

- [ ] *Deployments* → den siste **Production**-deployen fra `main` → *Redeploy*.
- [ ] Gi Kevin beskjed når deployen står som *Ready*. Si bare «Redeploy ferdig», og send aldri nøkkelen.

Fra dette øyeblikket er produksjonen i ekte modus, og CV-tekst som brukerne analyserer, sendes til OpenAI.

**Hvis noe er galt:** slett `OPENAI_API_KEY` fra Production og ta en ny Redeploy. Appen går da tilbake til demomodus, og det koster ingenting.

## 5. Kontroll uten å vise nøkkelen (C4, gratis)

Kevin (eller Claude på Kevins vegne) tar disse kontrollene rett etter Redeploy. Ingen av dem viser nøkkelen eller koster noe.

- [ ] `GET https://g69-cv-assistent.vercel.app/api/status` skal gi `{"modus":"ekte","leverandor":{"navn":"OpenAI","land":"USA","tredjeland":true}}`, og `X-Vercel-Id` skal starte med `arn1`. Svaret sier bare *om* det finnes en nøkkel, ikke hva den er.
  - `"modus":"demo"` med OpenAI og USA: `OPENAI_API_KEY` mangler i Production, eller deployen er ikke ny.
  - `"Mistral AI"`: `LLM_LEVERANDOR` mangler eller er feilstavet.
- [ ] Personvernboksen på forsiden i produksjonen skal vise «CV-teksten sendes til OpenAI i USA. Det betyr at opplysningene overføres ut av EØS.»
- [ ] En forhåndsvisning (Preview) skal fortsatt svare `"modus":"demo"` på `/api/status`. Åpne den i nettleseren mens du er logget inn, hvis forhåndsvisningene er beskyttet.
- [ ] Lista i Vercel viser fortsatt de tre variablene bare i Production, og `OPENAI_API_KEY` er merket *Sensitive*.

**Den betalte kontrollen** (én analyse med `par-2-it-support`, ca. 0,02 kr) krever en egen godkjenning fra Kevin og gjøres etter de gratis kontrollene. Etter den sjekker Sondre forbruket under *Usage*. Med et eget prosjekt kan forbruket filtreres på `g69-produksjon`.

## 6. Nøklene fra målingen i del B

Nøkkelen fra målingen trekker trolig fra den samme kreditten som produksjonen. Den kan derfor bruke av det harde taket.

- [ ] **OpenAI (Sondre):** slett nøkkelen fra målingen, eller roter den, før eller like etter Redeploy. Den finnes også i Kevins `.env.local`.
- [ ] **Mistral (Kevin):** slett eller roter nøkkelen fra målingen i Mistral-konsollen.
- [ ] **Kevin:** fjern nøklene fra `.env.local` hvis de ikke skal brukes videre lokalt.

Uten nøkkelen fra målingen kan `npm run testsett` og B4 ikke kjøres lokalt mot OpenAI. B4 (par 2 innen 30 s og par 1 med annonsen med innplantet instruks) kan i stedet tas i produksjonen sammen med den betalte kontrollen i C4. Kevin avgjør dette.

## 7. Gi beskjed til Kevin

Når du er ferdig, send en kort melding uten nøkkel:
- Navnet på nøkkelen og prosjektet, og hvilke rettigheter du valgte (*Restricted* eller *All*).
- At de tre variablene ligger bare i Production, og at `OPENAI_API_KEY` er *Sensitive*.
- At Preview og Development ikke har noen nøkkel.
- Datoen for versjonen av DPA-en, hvis du har den (resten av punkt 0 er besvart).
- Om kopien av nøkkelen utenfor Vercel er slettet, eller hvor den ligger (bare som «passordbehandler» eller lignende, ikke selve nøkkelen).
- Om nøkkelen fra målingen er slettet eller rotert.
