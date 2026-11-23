# Kjørebok: produksjonen med valgt leverandør (story 2.4 del C)

> **Valget er tatt 2026-11-19: OpenAI `gpt-4.1-mini` med temperatur 0** (Kevin og Sondre, AD-11). Del C gjelder derfor OpenAI. `LLM_LEVERANDOR=openai`, `LLM_MODELL=gpt-4.1-mini`, `OPENAI_API_KEY` (en egen nøkkel for produksjonen) bare i Production. Personvernboksen skal vise «CV-teksten sendes til OpenAI i USA. Det betyr at opplysningene overføres ut av EØS.», og `/api/status` skal gi `tredjeland: true`. Sondre må bekrefte innstillingene for deling av data og avtalegrunnlaget (DPA) før produksjonsbruk (avsnitt 7 i `vurdering-2-4-kontroll-temperatur-0.md`). Det er bekreftet 2026-11-20, se C1. Merk: SM-1 var ikke bestått (par 3). Det ble løst 2026-11-20 ved at fasiten ble revurdert (løsning B), men med den nye prompten fra PR #27 og PR #28 er SM-1 9 av 12 (`vurdering-2-4-kontroll-ny-prompt.md`).
>
> **Status 2026-11-20: påbegynt.** Forberedelsen ble gjort på grenen `story-2.4-del-c-produksjon` (PR #22), og resultatet fra C3 og C4 er dokumentert på `story-2.4-del-c-kontroll`. Utgangspunktet er kontrollert på nytt, og grensene og `MAKS_UTDATA_TOKENS` er avgjort (C3 punkt 5 og C5). C1 og C2 er bekreftet av Sondre 2026-11-20. Unntaket er punktet om grensen for forbruket i C2, som er Kevins beslutning. Grunnlaget for overføringen til USA er kontrollert i DPA-en (punkt 4.1: SCC eller art. 45, også DPF). Hvilket av dem som brukes, er ikke kontrollert.
>
> **Oppdatert 2026-11-20 etter C3 og C4 (Kevin og Sondre):**
> - PR #22 er flettet (`f5747f5`).
> - C3 er gjort, og produksjonen er i ekte modus med OpenAI `gpt-4.1-mini`.
> - **C4:** de gratis kontrollene og den betalte kontrollen med par 2 er bestått, og bokmål er bekreftet av Kevin. Forbruket er bekreftet av Sondre på ukenivå, og kostnaden er et anslag. Kriteriet per nøkkel og per dag er ikke lest direkte. Kevin godtok avviket 2026-11-20, så punktet er fullført med forbehold (se C4).
> - C5 står igjen. **B4 del 2 (NFR-9) er BESTÅTT i produksjonen** (2026-11-20) etter PR #28 (`b50e34a`): 6 krav, 3 O, 2 D og 1 M (AFR), på ca. 9 s. De to tidligere forsøkene (16:01 med 0 krav, og 16:36 med `ugyldig_svar`) feilet, og årsaken er uavklart, fordi ett av dem ved en feil brukte README-innholdet. Se § 7a i `kjorebok-2-4-del-b.md`. Sondre har bekreftet B4 og at `store: false` virker (2026-11-20 kl. 19:39: ingen nye rader under Logs i OpenAI etter kl. 16:36). SM-1 ble 12 av 12 med den revurderte fasiten (løsning B) på den gamle prompten. Med den nye prompten fra PR #27 og PR #28 er SM-1 9 av 12, SM-2 10 av 12 og SM-3 11 av 12. Det må avgjøres, se `vurdering-2-4-kontroll-ny-prompt.md`. SM-4 er ikke oppfylt, men det hører til story 5.1. Story 2.4 er ikke ferdig.
>
> **Oppdatert 2026-11-22 (Claude, på oppdrag fra Kevin, grenen `story-2.4-c5-dokumentasjon`):**
> - **PR #29** (B4-resultatet og testsettet med den nye prompten) er flettet til `main` (`50a7e36`).
> - **PR #30 fra `story-2.4-b4-resultat`** med avviksanalysen (avsnitt 2a i `vurdering-2-4-kontroll-ny-prompt.md`) er til gjennomgang hos Sondre. Den er ikke flettet. *(Utdatert: flettet 2026-11-22, se boksen under.)*
> - **Sondres åpne spørsmål** står samlet i [`beslutningsark-2-4-sondre.md`](beslutningsark-2-4-sondre.md). De kjente svakhetene står i [`kjente-svakheter-2-4.md`](kjente-svakheter-2-4.md).
> - **PRD §10.1** er oppdatert med resultatene for begge promptene. Den sier at ingen av SM-1–SM-3 er bestått med prompten i produksjonen.
> - **Ingenting er endret** i prompten, koden, testdataene, Vercel eller nøklene. 2-4 står fortsatt som `in-progress`.
>
> **Oppdatert 2026-11-22 etter flettingen (Claude, på oppdrag fra Kevin, grenen `story-2.4-c5-oppfolging`).** Dette erstatter punktet om PR #30 i boksen over:
> - **PR #31** (C5-dokumentasjonen) er flettet av Sondre 2026-11-22 kl. 16:16 (`c7c4a68`).
> - **PR #30** (avviksanalysen) er flettet av Sondre 2026-11-22 kl. 16:16 (`f36568e`).
> - **Beslutningsarket er ikke besvart.** Ingen av svarfeltene til de 12 spørsmålene er fylt ut, og ingen har signert.
> - **SM-1–SM-3 er fortsatt ikke bestått** med prompten i produksjonen (9, 10 og 11 av 12). Den manuelle kontrollen av rapporten (§ 8 i `kjente-svakheter-2-4.md`) endrer ikke det.
> - **Kevins foreløpige beslutninger 2026-11-22:**
>   - De to åpne funnene fra del A utsettes til neste relevante kode- og testrunde, og de står åpne til de er rettet.
>   - Om OpenAI-prosjektet skal ha en egen grense for forbruket, avklares med Sondre før noe endres (C2).
> - **Ingenting er endret** i prompten, koden, testdataene, Vercel eller nøklene. 2-4 står fortsatt som `in-progress`.
>
> **Oppdatert 2026-11-23 (Claude, på oppdrag fra Kevin, grenen `story-2.4-fjerne-eksempelblokk`):**
> - **Sondre har svart på beslutningsarket** i PR #33 (`2b66889`). Sondre flettet PR #33 til `main` 2026-11-23 (`7eb7300`).
> - **Spørsmål 2:**
>   - Eksempelblokken fra PR #28 fjernes. Reglene fra PR #27 og `store: false` beholdes.
>   - Etter flettingen kjøres testsettet én gang (høyst 12 kall) og B4 del 2 én gang i produksjonen.
>   - Blir SM-1–SM-3 ikke 12 av 12, føres avvikene som kjente svakheter og måles på nytt i 5.1.
> - **Fjerningen** er gjort i [`spec-2-4-fjerne-eksempelblokken.md`](spec-2-4-fjerne-eksempelblokken.md), se «Eksempelblokken fjernes (2026-11-23, Sondres beslutning)» i § 7a i `kjorebok-2-4-del-b.md`. Ingen betalte kall er kjørt.
> - **De andre svarene i arket** (spørsmål 1 og 3–12, og C2) står i arket i PR #33. Denne boksen følger bare opp spørsmål 2.
> - **Ikke endret:** nøkler, `.env.local`, testdata, fasiten og personvernboksen. 2-4 står fortsatt som `in-progress`.
>
> **Oppdatert 2026-11-23 etter målingen (Claude, på oppdrag fra Kevin, grenen `story-2.4-avslutning-maaling`):**
> - **PR #34** er flettet og publisert som Production/Current (`5de48e0`, kl. 18:05, bekreftet av Sondre).
> - **Testsettet** er kjørt én gang (12 kall): SM-1 8 av 12, SM-2 11 av 12, SM-3 9 av 12. **B4 del 2** er bestått i produksjonen (1 kall). Se [`vurdering-2-4-uten-eksempelblokk.md`](vurdering-2-4-uten-eksempelblokk.md).
> - **Avgjort (Sondre: «ja, kjør», gitt videre av Kevin):** avvikene godtas som kjente svakheter og måles på nytt i story 5.1. SM-1 er dermed avgjort.
> - **Det som gjenstår før `done`,** står i C5 under. 2-4 står fortsatt som `in-progress`.
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
  - **Foreløpig beslutning fra Kevin (2026-11-22):** om prosjektet skal ha en egen grense for forbruket, avklares med Sondre før noe endres. Ingenting er endret i OpenAI. Punktet står åpent.

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

- [ ] Avsnitt 5 og 7 i vurderingen er fylt ut og signert av Kevin og Sondre. **2026-11-22:** begge avsnittene i `vurdering-2-4-kontroll-temperatur-0.md` er fylt ut, men «Godkjent av» i avsnitt 7 er ikke signert. Signaturene er spørsmål 12 i `beslutningsark-2-4-sondre.md`. **2026-11-23:** også «Godkjent av» i avsnitt 5 i `vurdering-2-4-uten-eksempelblokk.md` (den siste målingen) og i avsnitt 5 i `vurdering-2-4-kontroll-ny-prompt.md` skal signeres. Ingen er signert. Sondre signerer etter at målingen er ført inn (svaret på spørsmål 12).
- [x] PRD §10.1 er merket som løst med dato og lenke til vurderingen (forslaget i avsnitt 7). **2026-11-22:** §10.1 sier nå at valget av leverandør og modell er avgjort, med lenke til vurderingen. Resultatene for begge promptene står der, og at ingen av SM-1–SM-3 er bestått med prompten i produksjonen. (Punktet var ikke krysset av 2026-11-22, fordi status for SM-1 var åpen.) **2026-11-23:** §10.1 har nå resultatet uten eksempelblokken (`5de48e0`: SM-1 8, SM-2 11, SM-3 9 av 12, B4 bestått) og beslutningen om å godta avvikene og måle på nytt i 5.1, med lenke til `vurdering-2-4-uten-eksempelblokk.md`. Krysset av.
- [x] Forslagene om `STANDARD_MODELL` og `MAKS_UTDATA_TOKENS` er godkjent eller avvist av Kevin, og eventuelle endringer er gjort med `bmad-build`. **2026-11-20:**
  - `STANDARD_MODELL.openai` var allerede `gpt-4.1-mini` (`spec-2-4-del-b-valgt-oppsett.md`).
  - `MAKS_UTDATA_TOKENS` beholdes på 8000 (Kevin). Bare kommentaren i `src/lib/llm/felles.ts` er oppdatert (`spec-2-4-del-c-maks-utdata-tokens.md`).
  - Taket vurderes på nytt i epic 3.
- [ ] Nøklene fra målingen er slettet eller rotert hos leverandørene, og de er fjernet fra `.env.local` hvis de ikke skal brukes videre lokalt. **2026-11-20 (Kevin):** `kevin-maaling-2-4` (OpenAI-nøkkelen fra målingen) slettes ikke før Sondre har bekreftet at rapporten er tilstrekkelig. Deretter sletter Sondre den hos OpenAI, og Kevin sletter Mistral-nøkkelen fra målingen (Kevin, 2026-11-20). **2026-11-23:** målingen er kjørt. Etter spørsmål 5 sletter Sondre `kevin-maaling-2-4` hos OpenAI nå, og Kevin sletter Mistral-nøkkelen og fjerner begge fra `.env.local`. Ikke gjort ennå. Kevin har bedt om at ingen nøkler slettes eller endres før han sier fra (2026-11-23).
- [x] Sesjonsloggen har resultatet, `LLM_MODELL` og commit (AK 2). **Kontrollert 2026-11-22:** linje 594 i `.logs/kevin-heggdal/993-2026-11-19-15-57-09-story-2-4-del-b-forberedelse.md` har `LLM_LEVERANDOR=openai`, `LLM_MODELL=gpt-4.1-mini` (`gpt-4.1-mini-2025-04-14` fra leverandøren), `TEMPERATUR=0`, commit `ee49c2b` for kontrollen og begrunnelsen etter AD-11. **2026-11-23:** den nye målingen (resultatet, `LLM_MODELL=gpt-4.1-mini`, `gpt-4.1-mini-2025-04-14` og commit `5de48e0`) skal også i sesjonsloggen, etter PRD §6 (SM-1). Det gjøres med `sesjonslogg` når denne dokumentasjonen er godkjent.
- [ ] `issues.md` er oppdatert for avslutningen. **2026-11-22:** venter til PR #30 fra `story-2.4-b4-resultat` er flettet, fordi `.logs/kevin-heggdal/issues.md` er en del av PR #30. **Oppdatert 2026-11-22 etter flettingen** (`story-2.4-c5-oppfolging`):
  - Lukket: punktet om de kjente svakhetene, og punktet om SM-1-linjen i PRD §10.1.
  - Rettet: «(PR #29)» til «(PR #30)».
  - Lagt til: Kevins foreløpige beslutninger om forbruksgrensen og de to funnene fra del A.

  Punktet krysses ikke av ennå, fordi `issues.md` må oppdateres på nytt når Sondre har svart og story 2.4 avsluttes. **2026-11-23:** oppdatert etter målingen og beslutningen (punktet om testsettet med den nye prompten er lukket, og avslutningspunktene står som åpne punkter). Det oppdateres en siste gang når 2-4 settes til `done`.
- [ ] Først når AK 1–3 er oppfylt og SM-1 er avgjort (avgjort 2026-11-20 med løsning B, SM-1 12 av 12 på den gamle prompten. Med den nye prompten er SM-1 9 av 12, og Kevin og Sondre avgjør om SM-1 fortsatt regnes som avgjort, se avsnitt 5 i `vurdering-2-4-kontroll-ny-prompt.md`): 2-4 settes til `done` i `sprint-status.yaml`. **2026-11-23:** SM-1 er avgjort. Avvikene uten eksempelblokken (8 av 12) er godtatt som kjente svakheter og måles på nytt i 5.1 (Sondre og Kevin). AK 1–3 er oppfylt (AK 2 med `ee49c2b` for valget). Den nye målingen skal i tillegg i sesjonsloggen etter PRD §6. **Gjenstår før `done`:** Kevins bekreftelse av prompten i produksjonen, signaturene, sesjonsloggen med den nye målingen, slettingen av nøklene, og PR-en som setter 2-4 til `done`. To av betingelsene er foreslått av Claude og ikke avtalt ennå: signaturen på den nye vurderingen og en ny bekreftelse av `store: false`. Se «Avslutningspunktene» under.
- [ ] **PR-ene:**
  - PR-en for del C (dokumentasjonen fram til C3, `pr-2-4-del-c.md`) går til gjennomgang hos Sondre **før** C3, etter den avtalte rekkefølgen.
  - Resultatet fra C3 og C4, og senere statusen `done`, kommer i en egen PR etterpå.
  - Del B er allerede merget (PR #21).
  - **2026-11-20:** B4-resultatet og testsettet med den nye prompten går til Sondre i en egen PR fra `story-2.4-b4-resultat` (`pr-2-4-b4-resultat.md`). Den fletter ikke statusen `done`. **Flettet som PR #29** (`50a7e36`).
  - **2026-11-21/22:** avviksanalysen (avsnitt 2a) er til gjennomgang hos Sondre i PR #30 fra samme gren. Ikke flettet da. Merk: linja fra 2026-11-21 i `issues.md` i PR #30 kaller avsnittet «(PR #29)». Det rettes i PR #30 eller etter flettingen. **Flettet som PR #30** (`f36568e`, 2026-11-22). Henvisningen er rettet på `story-2.4-c5-oppfolging`.
  - **2026-11-22:** C5-dokumentasjonen (beslutningsarket, de kjente svakhetene, PRD §10.1 og denne kjøreboka) ligger på `story-2.4-c5-dokumentasjon`. Utkastet til den avsluttende PR-en står i `pr-2-4-c5-avslutning.md`, og den er ikke opprettet. **Flettet som PR #31** (`c7c4a68`, 2026-11-22) med tittel A fra utkastet. Den avsluttende PR-en (tittel B) er ikke opprettet.
  - **2026-11-22:** oppfølgingen etter flettingen ligger på `story-2.4-c5-oppfolging`, laget fra `main` `f36568e`. Den inneholder bare dokumentasjon og er ikke pushet.
  - **2026-11-23:** PR #33 (Sondres svar i beslutningsarket, `7eb7300`) og PR #34 (eksempelblokken fjernet, `5de48e0`) er flettet. Dokumentasjonen av målingen ligger på `story-2.4-avslutning-maaling`, laget fra `main` `5de48e0`. Den er ikke committet eller pushet.
  - Push og PR krever Kevins godkjenning.

### Avslutningspunktene (status 2026-11-23)

**Må være gjort før 2-4 settes til `done`** (punktene over). Rader merket *(forslag)* er Claudes forslag og må bekreftes av Kevin og Sondre:

| Punkt | Eier | Status |
|---|---|---|
| Bekreftelse av at prompten uten eksempelblokken (`5de48e0`) blir i produksjonen. Det følger av beslutningen, men Sondre har ikke svart på det direkte | Kevin | Ikke bekreftet |
| «Godkjent av» i `vurdering-2-4-kontroll-temperatur-0.md` (avsnitt 7) og `vurdering-2-4-kontroll-ny-prompt.md` (avsnitt 5) | Kevin og Sondre | Ikke signert (spørsmål 12) |
| *(forslag)* «Godkjent av» i `vurdering-2-4-uten-eksempelblokk.md` (avsnitt 5), siden det er den siste målingen | Kevin og Sondre | Ikke signert |
| *(forslag)* `store: false` etter målingen: ingen nye rader under Logs hos OpenAI etter 2026-11-23 kl. 18:38. Sondre bekreftet det for kallene 2026-11-20 | Sondre | Ikke bekreftet |
| Sesjonsloggen med den nye målingen: resultatet, `LLM_MODELL` og commit `5de48e0` (PRD §6, SM-1) | Kevin (`sesjonslogg`) | Ikke gjort |
| `kevin-maaling-2-4` slettet hos OpenAI | Sondre | Ikke gjort (spørsmål 5). Venter på beskjed fra Kevin |
| Mistral-nøkkelen fra målingen slettet, og begge nøklene fjernet fra `.env.local` | Kevin | Ikke gjort (spørsmål 5) |
| Commit, push og den avsluttende PR-en (tittel B i `pr-2-4-c5-avslutning.md`) med `issues.md` oppdatert en siste gang, og 2-4 satt til `done` i `sprint-status.yaml` | Kevin, flettes av Sondre | Etter punktene over |

**Åpne, men ikke betingelser for `done`** (følges opp i egne PR-er eller senere stories):

| Punkt | Eier | Kilde |
|---|---|---|
| Personvernboksen: én setning om at OpenAI kan beholde teksten i opptil 30 dager for å oppdage misbruk (egen liten PR med spec) | Ikke fordelt | Spørsmål 9 |
| Regelen om «fakturaer» skrives inn i fasiten for par 3 (endring i testdata, krever godkjenning) | Ikke fordelt | Spørsmål 3 |
| DPF-lista: er OpenAI sertifisert? Før refleksjonsrapporten | Sondre | Spørsmål 11 |
| `OPENAI_API_KEY` merket *Sensitive* i Vercel | Sondre | Spørsmål 7 |
| Hvilket forsøk (16:01 eller 16:36) brukte README-innholdet. Kan leses i Logs hos OpenAI fram til rundt 19.–20. desember | Kevin | Spørsmål 6 |
| `TEMPERATUR`-kommentaren i `src/lib/llm/felles.ts` er utdatert, og den skulle rettes når spørsmål 2 var avgjort. Tallene der må også oppdateres (SM-3 er nå 9 av 12). Kodeendring, krever godkjenning | Kevin | Beslutningsarket, «Kevins egne beslutninger» |
| Ny måling av SM-1–SM-3 og B4 (NFR-9) på den endelige versjonen, med de kjente svakhetene | Story 5.1 | `kjente-svakheter-2-4.md` § 1, `deferred-work.md` |
| Øvrige åpne punkter fra 2-4 i `issues.md`: forbruksgrensen i C2 (Sondres syn: la stå), de to funnene fra del A, melding for en annonse uten krav, merknaden i `testdata/robusthet/README.md` og oppbrukt kreditt (`llm_feil`) | Kevin | `.logs/kevin-heggdal/issues.md`, beslutningsarket |
