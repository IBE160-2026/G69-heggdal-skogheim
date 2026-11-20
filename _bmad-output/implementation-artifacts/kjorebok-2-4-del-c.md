# Kjørebok: produksjonen med valgt leverandør (story 2.4 del C)

> **Valget er tatt 2026-11-19: OpenAI `gpt-4.1-mini` med temperatur 0** (Kevin og Sondre, AD-11). Del C gjelder derfor OpenAI. `LLM_LEVERANDOR=openai`, `LLM_MODELL=gpt-4.1-mini`, `OPENAI_API_KEY` (en egen nøkkel for produksjonen) bare i Production. Personvernboksen skal vise «CV-teksten sendes til OpenAI i USA. Det betyr at opplysningene overføres ut av EØS.», og `/api/status` skal gi `tredjeland: true`. Sondre må bekrefte innstillingene for deling av data og avtalegrunnlaget (DPA) før produksjonsbruk (avsnitt 7 i `vurdering-2-4-kontroll-temperatur-0.md`). Det er bekreftet 2026-11-20, se C1. Merk: SM-1 er ikke bestått (par 3) og må løses før innleveringen.
>
> **Status 2026-11-20: påbegynt.** Forberedelsen ble gjort på grenen `story-2.4-del-c-produksjon` (PR #22), og resultatet fra C3 og C4 er dokumentert på `story-2.4-del-c-kontroll`. Utgangspunktet er kontrollert på nytt, og grensene og `MAKS_UTDATA_TOKENS` er avgjort (C3 punkt 5 og C5). C1 og C2 er bekreftet av Sondre 2026-11-20. Unntaket er punktet om grensen for forbruket i C2, som er Kevins beslutning. Grunnlaget for overføringen til USA er kontrollert i DPA-en (punkt 4.1: SCC eller art. 45, også DPF). Hvilket av dem som brukes, er ikke kontrollert.
>
> **Oppdatert 2026-11-20 etter C3 og C4 (Kevin og Sondre):**
> - PR #22 er flettet (`f5747f5`).
> - C3 er gjort, og produksjonen er i ekte modus med OpenAI `gpt-4.1-mini`.
> - **C4:** de gratis kontrollene og den betalte kontrollen med par 2 er bestått, og bokmål er bekreftet av Kevin. Forbruket er bekreftet av Sondre på ukenivå, og kostnaden er et anslag. Kriteriet per nøkkel og per dag er ikke lest direkte. Kevin godtok avviket 2026-11-20, så punktet er fullført med forbehold (se C4).
> - C5 står igjen. **B4 del 2 (NFR-9) er IKKE bestått** (2026-11-20). Første forsøk ga en tom gap-analyse med 0 krav. Etter rettingen i PR #27 ga andre forsøk `ugyldig_svar`. Se § 7a i `kjorebok-2-4-del-b.md`. SM-1 er løst 2026-11-20 ved at fasiten for par 3 er revurdert (løsning B), og er 12 av 12. SM-4 er ikke oppfylt, men det hører til story 5.1. Story 2.4 er ikke ferdig.
>
> **Avtalt rekkefølge (Sondre og Kevin, 2026-11-20):**
> 1. PR-en for del C gjøres ferdig.
> 2. Sondre går gjennom PR-en og fletter den til `main`.
> 3. Sondre legger inn variablene i Vercel, bare for Production (C3 punkt 2–3), og tar en Redeploy etter Kevins «gå» (C3 punkt 4).
> 4. Kevin og Sondre tar kontrollene i C4 sammen.
>
> PR-en inneholder derfor bare dokumentasjon og én kommentar i koden. Resultatet fra C3 og C4 kommer etter flettingen.
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
> - **Saldoen (anslag, 2026-11-20):** Usage viser 0,09 USD (ca. 0,87 kr) for all bruk siden kjøpet, både målingene i del B og produksjonen. Det som er igjen, er ca. 4,91 USD (ca. 47,6 kr uten mva.). Det tidligere anslaget på 1–2 kr for del B var for høyt.
> - Ifølge OpenAIs hjelpesider utløper kreditten etter ett år, altså rundt 2026-11-19 året etter. Det er ikke verifisert (`vilkaar-og-priser-2-4.md`).
> - **Samme organisasjon og samme kreditt:** nøkkelen for produksjonen (C3) og nøkkelen fra målingen trekker trolig fra samme kreditt. Nøkkelen fra målingen bør derfor roteres eller slettes før eller like etter C3, så den ikke kan bruke av det harde taket for produksjonen (punktet står i `issues.md`).
>
> Merk: tallene for kostnad per analyse i punktet om grensen under gjelder Mistral. For OpenAI `gpt-4.1-mini` er det målt ca. 0,0185 kr per gap-analyse og ca. 0,07 kr per full kjøring (`vurdering-2-4-kontroll-temperatur-0.md`).

- [x] Kontoen som brukes i produksjonen, har forhåndsbetalt kreditt **under 200 kr inkl. mva.**, og automatisk påfylling er av.
  - **Mistral (Kevin):** 10 USD, påfylling av, og organisasjonen har en grense på 2 USD per måned (bekreftet 2026-11-19). Brukes ikke i produksjonen.
  - **OpenAI (Sondre), brukes i produksjonen:** 5 USD (6,25 USD inkl. 25 % mva., ca. 60 kr), kjøpt én gang 2026-11-19. Påfylling er av (bekreftet 2026-11-20).
- [ ] Det er notert om grensen for forbruket også skal gjelde produksjonen, eller om den skal økes (krever Kevins beslutning). 2 USD (ca. 19,4 kr uten mva) rekker til ca. 230 gap-analyser med Medium 3.5 (0,0844 kr per analyse, 9,6866 kr per USD), eller ca. 57 fulle kjøringer når brev, CV og ATS kommer i epic 3 (× 4).
  - **For OpenAI (åpent, Kevins beslutning):** om prosjektet også skal ha en grense for forbruket. «Spend limit» står i dag på 100 USD (Sondre, 2026-11-20), se C4. Ifølge `vilkaar-og-priser-2-4.md` gjelder den månedlige grensen hos OpenAI den automatiske påfyllingen, ikke bruken av API-et. Det er ikke kontrollert om grensen på 100 USD er den samme innstillingen. Kreditten på 5 USD er det harde taket. Med en saldo på ca. 4,91 USD rekker den til ca. 2 570 gap-analyser eller ca. 680 fulle kjøringer etter de målte kostnadene uten mva.

## C3. Nøkkelen for produksjonen og Vercel (krever godkjenning)

1. [x] Lag en **egen API-nøkkel for produksjonen** hos den valgte leverandøren. Bruk ikke nøkkelen fra målingen. Gi den et navn, for eksempel `g69-produksjon`. **Laget av Sondre (bekreftet 2026-11-20)** og lagret sikkert, utenfor GitHub.
  - **Oppbevaring (rettet 2026-11-20, bekreftet av Sondre og gitt videre av Kevin):** nøkkelen for produksjonen ligger **bare i Vercel**, slik sjekklisten sier. Den skal aldri deles i chat, kode eller GitHub. Det som sto her tidligere, om at Sondre lagret en kopi og om en passordbehandler, er erstattet.
  - **Navnet (2026-11-20):** først `produksjon-vercel`. Den ble erstattet av **`produksjon-vercel-2`** (se hendelsen under).
  - **Ikke kjent ennå:** prosjektet, eieren og rettighetene (*Restricted* eller *All*). Sondre melder dette etter punkt 7 i sjekklisten.
2. [x] Sett i Vercel → `g69-cv-assistent` → Settings → Environment Variables, **bare for Production** (ikke Preview eller Development):
   - `LLM_LEVERANDOR`: `mistral` eller `openai`.
   - `LLM_MODELL`: det datobestemte navnet fra vurderingen (for eksempel `mistral-medium-2604` eller `gpt-4.1-mini`).
   - `MISTRAL_API_KEY` eller `OPENAI_API_KEY`: bare nøkkelen til den valgte leverandøren. Merk den som Sensitive.
   **Gjort 2026-11-20 (Sondre, kontrollert sammen med Kevin):** `LLM_LEVERANDOR=openai` og `LLM_MODELL=gpt-4.1-mini` (Config), og `OPENAI_API_KEY` (Secret), alle bare i Production. Lista var tom fra før.
3. [x] Sjekk at ingen av variablene har prefikset `NEXT_PUBLIC_` (AD-12), og at Preview fortsatt ikke har nøkkel. **Gjort 2026-11-20:**
   - Ingen `NEXT_PUBLIC_`.
   - Preview og Development har ingen variabler.
   - Forhåndsvisningen for PR #22 svarer `demo` (C4).
4. [x] Deploy produksjonen på nytt (Redeploy av siste produksjonsdeploy fra `main`), så variablene tas i bruk. **Gjort 2026-11-20 (Sondre),** to ganger (se hendelsen under).

**Hendelse 2026-11-20, nøkkelen var lagt inn feil:**
- De to første forsøkene på den betalte kontrollen ga HTTP 502 på under 1 s, fordi den første nøkkelen (`produksjon-vercel`) var lagt inn feil.
- Sondre laget en ny nøkkel, `produksjon-vercel-2`, oppdaterte `OPENAI_API_KEY` i Production, slettet den gamle nøkkelen og tok en ny Redeploy. Det tredje forsøket gikk bra.
- Den nye nøkkelen ligger bare i Vercel (bekreftet av Sondre 2026-11-20).
- At de to forsøkene som feilet, ikke ble fakturert, er ikke bekreftet direkte. Se avviket under forbruket i C4.
- **Kilde:** tilbakemeldingen fra Kevin og Sondre 2026-11-20. Årsaken («lagt inn feil») er ikke kontrollert i loggen for funksjonen i Vercel. Sondres logg (`975-…`) slutter ved de gratis kontrollene.
- **Lærdom:** `/api/status` viser bare at en nøkkel *finnes*, ikke at den er gyldig. En ugyldig nøkkel viser seg først ved et kall (502, `llm_feil`). Neste gang en nøkkel byttes, skal den betalte kontrollen gjøres rett etter Redeploy.
5. [x] Avgjør om `GRENSE_PER_MINUTT` og `GRENSE_PER_DOGN` skal settes, eller om standardverdiene fra AD-9 gjelder (krever Kevins beslutning). **Avgjort 2026-11-20 (Kevin):** standardverdiene i koden gjelder: 10 per minutt og 200 per UTC-døgn (`src/lib/pipeline/grense.ts`). Variablene settes ikke i Vercel. De vurderes på nytt før brukertesten i 2.8 og i epic 3.

Fremgangsmåten for Sondre står i [`sjekkliste-2-4-c3-sondre.md`](sjekkliste-2-4-c3-sondre.md) (godkjent av Kevin 2026-11-20).
- Kravet var at Sondre skulle kontrollere grunnlaget for overføringen til USA i DPA-en før Redeploy. Det er gjort 2026-11-20.
  - Punkt 4.1 dekker overføringen med SCC eller GDPR art. 45 (også DPF).
  - Ikke kontrollert: hvilket av grunnlagene som faktisk brukes, og om OpenAI er sertifisert under DPF. Datoen for versjonen står i Sondres logg, se under.
- Punkt 1 er gjort.
- Punkt 2–4 er gjort 2026-11-20 etter at PR #22 ble flettet, i den avtalte rekkefølgen.
- Fra Sondres logg (`975-2026-11-20-14-29-16-produksjon-c3-c4.md`):
  - DPA-en gjelder fra 2026-01-01.
  - SCC-ene er fra 4. juni 2021.
  - Underbehandlerne står på platform.openai.com/subprocessors.

## C4. Kontroll i produksjonen

- [x] **Gratis:** `GET https://g69-cv-assistent.vercel.app/api/status` gir `modus: "ekte"` og riktig leverandør. Mistral skal gi `Mistral AI`, `Frankrike` og `tredjeland: false`. OpenAI skal gi `OpenAI`, `USA` og `tredjeland: true`. `X-Vercel-Id` skal starte med `arn1`. **Bestått 2026-11-20:** `{"modus":"ekte","leverandor":{"navn":"OpenAI","land":"USA","tredjeland":true}}`, og `X-Vercel-Id` starter med `arn1`.
- [x] **Gratis:** personvernboksen viser «CV-teksten sendes til Mistral AI i Frankrike.», eller for OpenAI «CV-teksten sendes til OpenAI i USA. Det betyr at opplysningene overføres ut av EØS.» (`src/lib/okt/personvern.ts`). **Bestått 2026-11-20:**
  - Teksten for OpenAI vises.
  - Demobanneret er borte.
  - Siden gjør ingen kall til `/api/generer` når den åpnes, så ingenting genereres automatisk.
- [x] **Gratis:** en forhåndsvisning (Preview) står fortsatt i demomodus. **Bestått 2026-11-20:** forhåndsvisningen for PR #22 svarer `"modus":"demo"` med Mistral som standard.
- [x] **Betalt, krever godkjenning:** én analyse med `par-2-it-support` i produksjonen gir en gap-analyse på bokmål innen 30 s (NFR-4). Noter tiden. **Bestått 2026-11-20** (godkjent av Kevin, tredje forsøk, se hendelsen i C3). Kilden er tilbakemeldingen fra Kevin og Sondre.
  - HTTP 200 på **8,4 s**.
  - Svaret var på bokmål (NFR-5), bekreftet av Kevin 2026-11-20.
  - Alle seks kravene har samme kategori som i fasiten: 1 Oppfylt, 3 Delvis oppfylt og 2 Mangler.
  - Treffprosenten var 25 % (2 av 8 nøkkelord), mot 11 % i fasiten. Det er forklart i avsnitt 8 i `vurdering-2-4-kontroll-temperatur-0.md` (SM-4). Testsettet med temperatur 0 ga samme treffprosent (25 %, 2 av 8) i alle tre kjøringene. Listen med nøkkelord fra produksjonen er ikke notert.
  - Analysen dekker også del 1 av B4 (par 2 innen 30 s).
- [x] Forbruket i konsollen etter analysen stemmer med forventet kostnad. **Fullført med forbehold 2026-11-20:** bekreftet av Sondre på ukenivå, og avviket er godtatt av Kevin. Kostnaden for analysen er et anslag.
  - **Status:** Kevin godtok avviket fra kriteriet 2026-11-20 (se under). Tallene Sondre oppga, er det samlede forbruket for alle nøklene, ikke forbruket for produksjonsnøkkelen for seg. **Tillegg 2026-11-20:** Sondre har bekreftet at forbruket i OpenAI kan filtreres per API-nøkkel. Senere kontroller kan derfor lese `produksjon-vercel-2` for seg, uten et eget prosjekt.
  - **Usage for hele uka, alle nøklene til sammen:** 54 kall, ca. 154 000 tokens og 0,09 USD. Uka dekker all bruk siden kreditten ble kjøpt 2026-11-19.
  - **API-feil:** 5 av kallene. To av dem er *trolig* forsøkene med feil nøkkel for produksjonen, men det er ikke sikkert. En nøkkel som er lagt inn feil, kan ikke alltid knyttes til organisasjonen, og da vises forsøket ikke i Usage. Hvor de tre andre feilene kommer fra, er ikke kjent (kanskje fra målingene i del B).
  - **Analysen med par 2:** anslagsvis 0,002 USD. Den vises ikke for seg med to desimaler.
  - **Kontroll av at tallene henger sammen** (forenlig innenfor avrundingen, ikke en bekreftelse):
    - Usage avrunder til 0,01 USD, så 0,09 USD betyr 0,085–0,095 USD.
    - 54 − 5 = 49 vellykkede kall × ca. 0,0019 USD (0,0185 kr per gap-analyse, målt) ≈ 0,093 USD. Det antar at alle kallene var gap-analyser, og det var de i del B og i produksjonen.
    - Tokenene peker samme vei. 154 000 / 54 ≈ 2 850 tokens per kall, mens et målt kall bruker ca. 2 200–2 650 tokens inn og 490–610 ut. Med samme fordeling (ca. 128 000 inn og 26 000 ut) blir kostnaden ca. 0,051 + 0,042 ≈ 0,09 USD (0,40 og 1,60 USD per million tokens). Fordelingen mellom inn og ut er ikke lest i Usage.
  - **Avvik fra kriteriet** (Kevin, 2026-11-20), som var:
    - ett vellykket kall med `produksjon-vercel-2`
    - høyst 0,01 USD for dagen
    - at de to forsøkene med feil nøkkel ikke er fakturert

    Tallene ble gitt for hele uka og samlet for alle nøklene, så de to første delene er ikke lest direkte. Usage kan filtreres per nøkkel (Sondre, 2026-11-20), men det ble ikke gjort i denne kontrollen. At de to forsøkene som feilet, ikke er fakturert, er heller ikke bekreftet direkte. De feilet på under 1 s, og summen for uka gir ikke rom for noen merkbar kostnad. **Godtatt av Kevin 2026-11-20.**
  - **Lærdom (oppdatert 2026-11-20):** forbruket kan filtreres per API-nøkkel (Sondre), så det trengs ikke et eget prosjekt. Ved neste kontroll, for eksempel B4 del 2 eller 2.8, filtreres det på `produksjon-vercel-2`.
  - **«Spend limit» i OpenAI** står på 100 USD (ca. 969 kr), ifølge Sondre. Det er langt over 200 kr, og det er ikke notert om det er grensen for organisasjonen eller for prosjektet. Det harde taket etter PRD NFR-3 er den forhåndsbetalte kreditten uten automatisk påfylling, og den er 5 USD. Grensen på 100 USD kan derfor ikke slippe gjennom mer enn kreditten. Se Kevins åpne beslutning i C2.

## C5. Dokumentasjonen og avslutningen

- [ ] Avsnitt 5 og 7 i vurderingen er fylt ut og signert av Kevin og Sondre.
- [ ] PRD §10.1 er merket som løst med dato og lenke til vurderingen (forslaget i avsnitt 7).
- [x] Forslagene om `STANDARD_MODELL` og `MAKS_UTDATA_TOKENS` er godkjent eller avvist av Kevin, og eventuelle endringer er gjort med `bmad-build`. **2026-11-20:**
  - `STANDARD_MODELL.openai` var allerede `gpt-4.1-mini` (`spec-2-4-del-b-valgt-oppsett.md`).
  - `MAKS_UTDATA_TOKENS` beholdes på 8000 (Kevin). Bare kommentaren i `src/lib/llm/felles.ts` er oppdatert (`spec-2-4-del-c-maks-utdata-tokens.md`).
  - Taket vurderes på nytt i epic 3.
- [ ] Nøklene fra målingen er slettet eller rotert hos leverandørene, og de er fjernet fra `.env.local` hvis de ikke skal brukes videre lokalt.
- [ ] Sesjonsloggen har resultatet, `LLM_MODELL` og commit (AK 2), og `issues.md` er oppdatert.
- [ ] Først når AK 1–3 er oppfylt og SM-1 er avgjort (avgjort 2026-11-20: løsning B, SM-1 12 av 12): 2-4 settes til `done` i `sprint-status.yaml`.
- [ ] **PR-ene:**
  - PR-en for del C (dokumentasjonen fram til C3, `pr-2-4-del-c.md`) går til gjennomgang hos Sondre **før** C3, etter den avtalte rekkefølgen.
  - Resultatet fra C3 og C4, og senere statusen `done`, kommer i en egen PR etterpå.
  - Del B er allerede merget (PR #21).
  - Push og PR krever Kevins godkjenning.
