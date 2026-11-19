# Story 2.4 del B – forberedelse av målingen og rettet prompt

## 2026-11-19 kl. 15:57 — Kevin Heggdal

### Oppgave
Forberede del B av story 2.4 (målingen og leverandørvalget etter AD-11) mens PR #14 for del A var til gjennomgang. Alt som kan gjøres uten betalte kall skulle gjøres: rapporten skulle vise den faktiske modellversjonen, og det skulle lages kjørebok, oversikt over vilkår og priser og vurderingsmal. Prompten skulle rettes for de fire feilene Sondre fant, og punktene fra Sondres gjennomgang av PR #14 skulle tas med. Det ble ikke gjort betalte kall, push eller fletting uten Kevins godkjenning.

### Plan
- Grenen `story-2.4-del-b-maaling-og-valg` ble laget fra del A. Etter at PR #14 var flettet (`a75c41f`), ble den spolt fram til `origin/main` (`dcb0020`).
- To story-filer ble laget med `bmad-build`, og hver fikk en implementeringsagent og en gjennomgang med tre agenter:
  - [spec-2-4-del-b-maaling-og-valg.md](../../_bmad-output/implementation-artifacts/spec-2-4-del-b-maaling-og-valg.md) (forberedelsen)
  - [spec-2-4-del-b-prompt-krav-og-belegg.md](../../_bmad-output/implementation-artifacts/spec-2-4-del-b-prompt-krav-og-belegg.md) (prompten)
- Til slutt gikk én agent grundig gjennom alle endringene i del B mot `main`.
- **Kevins beslutninger 2026-11-19:**
  - «1 kr per kjøring» = gap × 4.
  - OpenAI måles med `gpt-4.1-mini`, fordi `gpt-5-mini` ga 404 uten en verifisert organisasjon hos Sondre.
  - Mistral måles med både Medium 3.5 (`mistral-medium-2604`) og Large 4 (`mistral-large-4-0`). Består begge, foretrekkes Large 4.
  - Prompten rettes før målingen (alternativ B). Listetegn fjernes fra belegg i koden, mens like krav bare håndteres i prompten.
  - **Utfall regelen ikke dekker:**
    - Feiler begge leverandørene, rettes prompten, og begge måles på nytt.
    - Holder ikke vilkårene hos OpenAI, stopper vi og diskuterer med Sondre.
    - En leverandør som feiler NFR-4 eller NFR-9, kan ikke velges uten en egen beslutning.
- Fremgangsmåten og malen for målingen: [kjorebok-2-4-del-b.md](../../_bmad-output/implementation-artifacts/kjorebok-2-4-del-b.md), [vurdering-2-4-leverandorvalg.md](../../_bmad-output/implementation-artifacts/vurdering-2-4-leverandorvalg.md), [vilkaar-og-priser-2-4.md](../../_bmad-output/implementation-artifacts/vilkaar-og-priser-2-4.md).

### Resultat
- **Committer på B-grenen (lokale, ikke pushet):**
  - `082386e22592ddbf08800dc5fe28884900357cf0`: forberedelsen.
  - `246e58bcc6e315cba5972b80ef9337c793f95582`: prompten og rettingene etter PR #14 og den grundige gjennomgangen.
- **Rapporten:** viser modellversjonen fra leverandøren (`response.modelId`) i toppteksten og per kjøring. Den markeres når den er lik navnet som ble bedt om, og den escapes i Markdown. Rapporter i `testsett-rapporter/` gjør ikke arbeidstreet «endret».
- **Prompten:** bare kvalifikasjoner og vilkår annonsen uttrykkelig krever, er krav. Oppgaver i jobben og beskrivelser av stillingen er ikke krav. Hvert krav står én gang, belegg skrives uten listetegn først, og stillingen med vanlig skrift. Ingen eksempler er hentet fra testdataene, og en test sikrer det.
- **Pipelinen:** listetegn og innrykk fjernes først i belegg før `kontrollerKrav`, og like belegg fjernes etterpå, så `fjernetBelegg` teller som før. `kontrollerKrav` er uendret.
- **Etter Sondres gjennomgang av PR #14:**
  - `STANDARD_MODELL.openai` er nå `gpt-4.1-mini`. Det er notert i endringsloggen i begge spec-ene.
  - Testsettet gir utgangskode 1 når alle kjøringene feiler.
  - Gjennomsnittlig kostnad står ikke lenger som «minst».
- **Mistral:**
  - **Modelloversikten** (`GET /v1/models`, gratis) ble hentet med Kevins nøkkel uten at nøkkelen ble vist. `mistral-medium-latest` er `mistral-medium-2604`, og `mistral-large-latest` er `mistral-large-4-0`.
  - **Large 4** koster 0,70 USD inn og 2,10 USD ut per million tokens. Det står på Mistrals modellside, lest 2026-11-19.
  - **Medium 3.5** er utfaset 2026-10-31 og avvikles 2027-04-30. Prisen er bare oppgitt av en tredjepart (ca. 1,50 / 7,50 USD).
- **Kontoene:**
  - Kevin har Mistral med 10 USD i kreditt og automatisk påfylling av. Under Admin → API → Privacy er trening på API-kall og Labs models slått av (bekreftet av Kevin).
  - Nøkkelen ligger bare i `.env.local`. Fila er ignorert av git og aldri committet.
  - Sondre har OpenAI-kontoen, og nøkkelen ventes.
- **Kontrollene:** lint, typecheck, `npm test` (750 tester i 47 filer), build og tørrkjøringen (`--mock`, 12 kjøringer) er grønne.
- **Gjennomgangene:** alle funn er rettet eller avvist med begrunnelse i loggene i spec-ene. Den grundige gjennomgangen fant ingen alvorlige feil i koden, og alle ni punktene er rettet.
- **Status:** story 2.4 står som `in-progress`, og begge spec-ene for del B (forberedelsen) står som `done`. Det er ikke gjort noen betalte kall med tekstgenerering i denne økten.

### Åpne punkter
- Del B: kontroll av Mistral-nøkkelen (par 2, én kjøring per modell, ca. 0,2 kr, tak på 1 kr inkl. mva.), deretter full måling og vurdering med malen. Gjelder Large 4, Medium 3.5 og OpenAI `gpt-4.1-mini`.
- Prisen for Mistral Medium 3.5 er ikke bekreftet hos Mistral. Valutakursen (10 kr per USD) er et forsiktig anslag, ikke en kurs fra Norges Bank.
- Like krav fjernes bare i prompten. Kommer det duplikater i målingen, vurderes det å fjerne dem i koden (alternativ C, med flytting av `kravIndeks`).
- OpenAI-nøkkelen fra Sondre trengs i `.env.local` på maskinen som måler, eller så kjører Sondre OpenAI-målingen selv.

## 2026-11-19 kl. 20:33 — Kevin Heggdal

### Oppgave
Vi fortsatte med story 2.4 del B etter pausen. Begge kontrollene med Mistral Large 4 hadde fått tidsavbrudd etter 45 s, så Kevin valgte alternativ B: ett lite diagnosekall mot `mistral-large-4-0` uten JSON-skjema og med høyst 50 output-tokens. Rapporten fra kontroll 2 skulle committes som dokumentasjon. Det skulle ikke gjøres andre betalte kall, ingen push eller fletting og ikke noe arbeid på story 2.6.

### Plan
- Først ble det kontrollert at vi var på grenen `story-2.4-del-b-maaling-og-valg`, at de lokale commitene (`082386e`, `246e58b`, `7cde3c2`, `51d5989`) fortsatt fantes, og at `.env.local` var ignorert (`.gitignore:43`, `.env.*`) og ikke sporet.
- Diagnosekallet gikk direkte mot `POST /v1/chat/completions` med et lite skript i scratchpad-mappa, uten AI SDK og uten skjema. Nøkkelen ble lest fra `.env.local` og ble ikke vist. Kallet ble sendt med `max_tokens: 50`, `temperature: 0.2`, `reasoning_effort: "low"` og et kort spørsmål på norsk.

### Resultat
- **Kontroll 2** (`testsett-rapporter/2026-11-19-1607-mistral-mistral-large-4-0.md`): par 2, én kjøring med `reasoningEffort` `low`. Kjøringen fikk tidsavbrudd (504, `llm_tidsavbrudd`) etter 45 004 ms. Rapporten er committet i `e0ef215`.
- **Diagnosekallet:** HTTP 200 på 3,3 s totalt (2,97 s hos Mistral), `model: mistral-large-4-0`, `finish_reason: stop`. Det brukte 31 input-tokens og 44 output-tokens, og 39 av dem var resonnering. Svaret var «Oslo». Kostnaden var omtrent 0,001 kr.
- **Hva diagnosen viser:**
  - Nøkkelen, modellnavnet og `reasoning_effort: "low"` virker. Resonneringen blir faktisk kortere.
  - Mistral svarer raskt på et lite kall, så tidsavbruddet skyldes ikke at kontoen, nettet eller modellen er treg i seg selv.
  - Tidsavbruddet kommer av selve gap-oppgaven: en lang prompt, et strikt JSON-skjema og et langt svar fra en resonneringsmodell.
  - NFR-4 krever at gap-analysen er ferdig innen 30 s. Large 4 bruker over 45 s og feiler derfor NFR-4 slik den er satt opp nå.
- Det ble ikke gjort noen andre betalte kall.

### Åpne punkter
- Story 2.4 del B: Large 4 feiler NFR-4 (over 45 s mot kravet på 30 s). Vurder kontrollen av Medium 3.5 (`mistral-medium-2604`, resonnering `none`) som neste betalte kall. Den trenger godkjenning fra Kevin.

## 2026-11-19 kl. 20:35 — Kevin Heggdal

### Oppgave
Før en eventuell kontroll av Mistral Medium 3.5 skulle det sjekkes at modellen er tilgjengelig, og om prisen kan bekreftes hos Mistral. I tillegg skulle forventet kostnad og en øvre grense for én kjøring anslås. Det skulle ikke gjøres noen betalte kall, ingen push eller fletting og ikke noe arbeid på story 2.5 eller 2.6.

### Plan
- Gratis kall `GET /v1/models/{id}` for `mistral-medium-2604` og `mistral-medium-latest` med nøkkelen fra `.env.local`. Nøkkelen ble ikke vist.
- Lest Mistrals modellside for Medium 3.5, docs: models, mistral.ai/pricing og docs.mistral.ai/platform/pricing (404), og gjort et nettsøk.
- Kostnaden ble anslått ut fra størrelsen på prompten (`gap.ts`, ca. 4,8k tegn), par 2 (ca. 1,5k tegn) og demosvaret (ca. 2,3k tegn).

### Resultat
- **Tilgjengelig:** `mistral-medium-2604` gir HTTP 200 med `deprecation: null` og `reasoning: true`, og konteksten er 262 144 tokens. `mistral-medium-latest`, `mistral-medium-3-5` og flere andre navn er aliaser for den.
- **Utfasingen:** dokumentasjonen sier fortsatt at modellen er utfaset fra 2026-10-31, med Large 4 som erstatning. API-et viser ingen utfasing.
- **Prisen er ikke bekreftet hos Mistral:** ingen offentlig side fra Mistral viser prisen for Medium 3.5. Tredjeparter oppgir 1,50 / 7,50 USD per million tokens. OpenRouter (vertskap i EU) oppgir 1,65 / 8,25 USD.
- **Kostnaden for én kjøring av par 2:** forventet ca. 0,15 kr og høyst ca. 0,8 kr inkl. mva. Grensen gjelder når output-taket på 8000 tokens nås og kursen er 10 kr per USD. Den holder under 1 kr så lenge den faktiske prisen ikke er mer enn ca. 20 % høyere enn tredjepartsprisen.
- Det ble ikke gjort noen betalte kall.

### Åpne punkter
- Prisen for Medium 3.5 står allerede åpen i issues.md. Den kan bekreftes i Mistral-konsollen eller ved å sammenligne faktisk forbruk etter kontrollen.

## 2026-11-19 kl. 20:37 — Kevin Heggdal

### Oppgave
Kevin godkjente én kontroll av Mistral Medium 3.5 (`mistral-medium-2604`, `reasoningEffort` `none`) på par 2. Rammen var høyst 2 kr samlet for Mistral-testene så langt og denne kontrollen. Kontrollen skulle kjøres én gang uten nye forsøk, og det skulle ikke gjøres andre betalte kall, ingen push eller fletting og ikke noe arbeid på story 2.5 eller 2.6.

### Plan
- Budsjettet ble sjekket før kjøringen. De to Large 4-kontrollene som fikk tidsavbrudd, koster høyst ca. 0,24 kr hver inkl. mva (taket er 8000 output-tokens). Diagnosekallet kostet ca. 0,001 kr, og denne kontrollen høyst ca. 0,8 kr. Til sammen blir det høyst ca. 1,3 kr, som er innenfor 2 kr.
- Kontrollen ble kjørt med `npm run testsett -- --leverandor mistral --modell mistral-medium-2604 --par par-2-it-support --ganger 1 --pris-inn 15 --pris-ut 75`.

### Resultat
- **Rapporten:** `testsett-rapporter/2026-11-19-2037-mistral-mistral-medium-2604.md`, committet i en egen commit med meldingen «docs: kontrollrapporten for Mistral Medium 3.5».
- **Kjøringen:**
  - Status 200 på 4774 ms. NFR-4 (30 s) er oppfylt for dette paret.
  - Rapporten viser «Resonnering (reasoningEffort): none», og modellen leverandøren oppga, er `mistral-medium-2604`.
  - 1673 tokens inn og 783 ut. Det koster 0,0838 kr uten mva (ca. 0,10 kr med) etter tredjepartsprisen (15 / 75 kr per million).
  - Ingen belegg er fjernet og ingen krav nedgradert. Treffprosenten er 31 %.
- **Samlet forbruk på Mistral i dag:** høyst ca. 0,6 kr inkl. mva. Det er et konservativt anslag, fordi tokenene i de to kontrollene med tidsavbrudd er ukjente.
- **Rask vurdering med sjekklisten** (ikke den endelige vurderingen):
  - Ingen forbudte påstander og ingen påfunnet innhold.
  - Førerkort og ITIL står som «Mangler». Rådene er ærlige.
  - «Windows og Microsoft 365» er delt i to: Windows er «Oppfylt» og Microsoft 365 «Mangler».
  - «Kommunikasjonsevner» står som «Mangler», mens fasiten sier «Delvis oppfylt». Det er ett krav under fasiten, som er innenfor FR-8.
  - Én liten feil i norsken: «It-brukerstøtte» skal være «IT-brukerstøtte».

### Åpne punkter
- Story 2.4 del B: full måling av Medium 3.5 (4 par × 3 kjøringer). Den er anslått til ca. 1,2–1,9 kr, med en øvre grense på ca. 10 kr inkl. mva. Den er over rammen på 2 kr og trenger ny godkjenning.
- Vurder om det er riktig at «Windows og Microsoft 365» deles i to krav. Det har betydning for FR-8 og sjekklisten.

## 2026-11-19 kl. 20:45 — Kevin Heggdal

### Oppgave
Planen for resten av story 2.4 og B1, de gratis forberedelsene til målingen i runde 1. Først sjekket vi om story 2.4 også har en del C. Planen dekker resten av del B og del C. Kevin vil fullføre hele 2.4 før story 2.7. B1 omfatter kopien av vurderingsmalen, resultatene fra kontrollene, kursen fra Norges Bank og vilkårene til Mistral og OpenAI med kilder og dato. Det skulle ikke gjøres betalte kall, ingen endringer i Vercel og ingen push eller fletting.

### Plan
- I `epics.md` har story 2.4 tre akseptansekriterier og ingen deler. Inndelingen i A, B og C (testsettskriptet, målingen og valget, produksjonen) kommer fra spec-en for del A (`spec-2-4-velge-leverandor-ved-maaling.md:21`).
- Planen for resten av del B: B1 gratis forberedelser, B2 full måling av Medium 3.5, B3 OpenAI `gpt-4.1-mini`, B4 manuell test i appen, B5 vurdering og valg etter AD-11, B6 etterarbeid og PR. Del C: C1 vilkår, C2 kreditt, C3 Vercel Production, C4 personvernboksen i produksjonen, C5 avslutning. Hvert betalt steg og hver endring i Vercel krever Kevins godkjenning.
- B1 fulgte § 8 i kjøreboka. Kildene ble lest med WebFetch og curl. help.mistral.ai ble lest med curl, fordi WebFetch ble blokkert. openai.com svarer 403 på automatiske oppslag, så OpenAI ble lest på developers.openai.com.

### Resultat
- **Ny fil:** [vurdering-2-4-leverandorvalg-runde-1.md](../../_bmad-output/implementation-artifacts/vurdering-2-4-leverandorvalg-runde-1.md).
  - Avsnitt 0 har modellene, prisene i kroner, kursen (9,6866 kr per USD, Norges Bank 2026-11-19) og en tabell over de fire kontrollene.
  - Large 4 er tatt ut av runde 1 fordi den feiler NFR-4.
  - Det er notert at Medium 3.5 er utfaset i dokumentasjonen.
  - Avsnitt 1 har vilkårene for begge leverandørene med lenke og dato.
  - Avsnitt 6 har raden for runde 1, commiten for prompten (`246e58b`) og observasjonen fra kontrollen (kravet som ble delt i to, «It-brukerstøtte»).
- **Funn om vilkårene:**
  - **Mistral, trening:** for pay-as-you-go *kan* API-data brukes til trening, med reservasjon under Admin → Privacy → «Data usage for improving our services». Bryteren for Vibe er en annen, og reservasjonen gjelder ikke Labs- og Public Preview-modeller.
  - **Mistral, DPA og data:** DPA-en gjelder fra 2026-07-27 og er en del av avtalen. Data ligger i EØS som standard, og appen bruker `api.mistral.ai`.
  - **OpenAI, trening og pris:** ingen trening på API-data som standard, og loggene lagres i opptil 30 dager. Prisen for `gpt-4.1-mini` er bekreftet: 0,40 / 1,60 USD.
  - **OpenAI, DPA og land:** DPA-en er ikke lest direkte (403). Behandling i EU krever godkjenning via salg, så vi regner med USA.
- **Oppdatert:**
  - `kjorebok-2-4-del-b.md` har fått en statusdel med kommandoen for B2 (`--pris-inn 14.53 --pris-ut 72.65`). Forventet kostnad er ca. 1,0–1,4 kr, med en øvre grense på ca. 7,4 kr uten mva.
  - `vilkaar-og-priser-2-4.md` har fått en del med det som ble kontrollert 2026-11-19.
- **Commit:** `bdf3b99` (lokal). Det ble ikke gjort betalte kall eller endringer i Vercel.

### Åpne punkter
- Kevin må bekrefte i Mistral-konsollen:
  - prisen for Medium 3.5
  - at kontoen står på pay-as-you-go
  - at bryteren for trening på API-kall er av (ikke bare den for Vibe)
  - den månedlige grensen for forbruket i organisasjonen og workspacen
  
  Deretter kan B2 godkjennes.
- Sondre må bekrefte OpenAI-vilkårene i nettleser (DPA-en, kreditten og at deling er av) og levere nøkkelen før B3.

## 2026-11-19 kl. 20:55 — Kevin Heggdal

### Oppgave
Kevin har kontrollert Mistral-konsollen og spør om B2 (12 kjøringer med Medium 3.5) trygt kan kjøres innenfor grensen på 2 USD per måned, eller om noe annet bør gjøres først. Det skulle ikke gjøres betalte kall, og ingen push eller fletting.

### Plan
- Kevins bekreftelser ble ført inn i avsnitt 1 i vurderingen for runde 1.
- Det verste tilfellet for B2 ble regnet ut mot grensen og forbruket så langt i dag.

### Resultat
- **Bekreftet av Kevin 2026-11-19:**
  - Pay-as-you-go er aktivt, og kreditten er 10 USD.
  - Automatisk påfylling er av, og organisasjonen har en grense på 2 USD per måned for all bruk.
  - API-trening er av, og Labs-modeller er deaktivert.
  - Konsollen viser ingen pris for Medium 3.5.
- **Commit:** «docs: Kevins kontroll av Mistral-konsollen i runde 1».
- **Forbruket i dag:** høyst ca. 0,05 USD (de to kontrollene av Large 4 med tidsavbrudd, diagnosekallet og kontrollen av Medium 3.5).
- **B2 med tredjepartsprisen:** forventet ca. 0,12 USD og høyst ca. 0,77 USD (12 × 2500 inn og 8000 ut). Til sammen blir det høyst ca. 0,82 USD, godt under 2 USD.
- **Prisen:** grensen holder selv om den faktiske prisen er inntil ca. 2,4 ganger tredjepartsprisen. Den usikre prisen påvirker derfor bare om kriteriet om 1 kr per kjøring er oppfylt, ikke om kjøringen er trygg.

### Åpne punkter
- Prisen for Medium 3.5 kan bekreftes under Usage i konsollen. Kontrollen med 1673 inn og 783 ut skal gi ca. 0,0084 USD med tredjepartsprisen. Ellers kan den bekreftes etter B2 ut fra forbruket.

## 2026-11-19 kl. 21:04 — Kevin Heggdal

### Oppgave
Kevin godkjente B2: full måling av Mistral Medium 3.5 (`mistral-medium-2604`) med 4 par × 3 kjøringer og høyst 12 betalte kall, uten nye forsøk. Målingen skulle bruke prisanslagene og dokumentere at prisen ikke er eksakt bekreftet. Etterpå skulle jeg arbeide selvstendig med story 2.4 innenfor grensene:
- ingen flere betalte kall
- ingen push, fletting eller PR
- ingen endringer i Vercel, produksjonsvariablene eller nøklene
- ikke starte story 2.7
- ikke sette 2.4 til `done`

Før målingen hadde Kevin sjekket Usage: 1 fakturerbart kall og 0,01 USD for `mistral-medium-2604`.

### Plan
- **Forutsetningene i kjøreboka (§ 1):**
  - `git status` var tom.
  - `npm test` ga 776 av 776 tester grønne i 48 filer.
  - Tørrkjøringen med `--mock` ga 12 kjøringer uten feil, og rapporten ble ignorert av git.
- **B2:** `npm run testsett -- --leverandor mistral --modell mistral-medium-2604 --pris-inn 14.53 --pris-ut 72.65`, kjørt én gang.
- **Vurderingen:** hver kjøring ble vurdert mot fasitene og sjekklisten, og resultatene ble ført inn i avsnitt 0, 2, 4, 5, 6 og 7 i vurderingen for runde 1.
- **Forberedelsene til B3 og del C:** ny kjørebok for del C, med utgangspunktet i produksjonen kontrollert med et gratis `GET /api/status`. Koden og prompten ble bevisst ikke endret mellom B2 og B3, så leverandørene kan sammenlignes på samme versjon.

### Resultat
- **B2:** `testsett-rapporter/2026-11-19-2057-mistral-mistral-medium-2604.md`, commit for målingen `7231521`, prompten fra `246e58b`.
  - 12 av 12 kjøringer ga status 200, med 0 feil og ingen nye forsøk.
  - Varigheten var 3900–6617 ms, så NFR-4 er oppfylt.
  - Output-tokens var 692–908, langt under taket på 8000.
  - Kostnaden var 1,0129 kr totalt og 0,0844 kr per gap-kjøring, ca. 0,34 kr per full kjøring (× 4). Det er godt under 1 kr, men prisen er ikke eksakt bekreftet.
  - Ingen belegg ble fjernet, og ingen krav ble nedgradert.
- **Vurderingen av Medium 3.5 i runde 1:**
  - SM-2 og NFR-5 er `J`: ingen forbudte påstander og bare små feil i språket.
  - **SM-3 og SM-1 (gap) er `N`:**
    - Par 1: «Gode digitale ferdigheter» (Office «grunnleggende») og «Nøyaktig og pålitelig» (egenvurdering) er `O` mot `D` i fasiten i alle tre kjøringene.
    - Par 4: «Selvstendig og ansvarsbevisst» er `O` mot `D` i alle tre.
    - Par 3 er bestått (ett krav under fasiten).
    - Par 2 avklares: «Windows og Microsoft 365» ble delt i Windows `O` og Microsoft 365 `M`.
  - **Etter regelen avgjør B3 valget:** består OpenAI, velges OpenAI. Feiler OpenAI på samme punkt, rettes prompten i runde 2.
- **Commits** (lokale):
  - `a8fd990`: rapporten og vurderingen.
  - `6f53219`: kjøreboka for del B (status, kommandoene for B3, forslaget til runde 2) og den nye kjøreboka [kjorebok-2-4-del-c.md](../../_bmad-output/implementation-artifacts/kjorebok-2-4-del-c.md).
- **Produksjonen i dag:** `GET /api/status` gir `demo` med Mistral AI og Frankrike, i regionen `arn1`. Ingenting er endret.
- **issues.md:** fire punkter er lukket (kursen, Large 4, B2 og kontrollen av konsollen), og fire nye er lagt til.

### Åpne punkter
- B3: OpenAI `gpt-4.1-mini` trenger nøkkelen fra Sondre, Sondres bekreftelse av vilkårene og Kevins godkjenning. Forventet kostnad er ca. 0,3 kr.
- Mistral Medium 3.5 feiler SM-3 i runde 1. B3 avgjør valget, eventuelt via runde 2.
- Kevin og Sondre avgjør hvordan et krav som modellen deler i to, leses mot fasiten (par 2).
- Prisen for Medium 3.5 er ikke eksakt bekreftet. Sammenlign Usage etter B2 med ca. 0,10 USD.
- «It-brukerstøtte»: forkortelser i stillingen. Vurder en retting etter runde 1.
- B4 (manuell test i appen) og del C (kjøreboka for del C) gjenstår.

## 2026-11-19 kl. 21:21 — Kevin Heggdal

### Oppgave
Kevin ba om en analyse av hvorfor Mistral Medium 3.5 feilet SM-3 på par 1 og par 4, og hvorfor «Windows og Microsoft 365» ble delt i to krav. Feilene skulle rettes i en egen, dokumentert runde 2 med `bmad-build`, uten å endre fasiten, vurderingsreglene eller akseptansekriteriene. Det skulle ikke gjøres betalte kall, ingen endringer i Vercel og ingen push eller fletting. Runde 1 skulle stå uendret.

### Plan
- Arbeidet fulgte `bmad-build`.
  - **Steg 1:** konteksten for epic 2 var eldre enn planleggingsdokumentene og ble laget på nytt med en subagent.
  - **Steg 2:** årsaksanalyse og den korte ruten («oneshot»), fordi endringen er liten, ingenting er irreversibelt, og Kevin hadde avgjort runde 2.
  - **Gjennomgang:** én gjennomgang med Blind Hunter.
- Spec-en: [spec-2-4-del-b-runde-2-kategori-og-sammensatte-krav.md](../../_bmad-output/implementation-artifacts/spec-2-4-del-b-runde-2-kategori-og-sammensatte-krav.md).
- **Kevins beslutning 2026-11-19:** prompten rettes nå, og begge leverandørene måles i runde 2 på samme prompt. Det erstatter planen om at B3 alene skulle avgjøre valget. Grunnlaget er SM-2.

### Resultat
- **Årsakene:**
  - **Kategoriene:** steg 3 i `GAP_INSTRUKS` gjenga ikke FR-8. Prompten sa «dokumenterer kravet» der FR-8 sier «direkte dekker», og regelen om egenvurdering manglet. Prompten sa heller ingenting om sammensatte krav eller om et lavere nivå enn kravet.
  - **De delte kravene:** «ett krav per punkt» kunne leses som én kvalifikasjon per krav.
  - **«It-brukerstøtte»:** regelen om forkortelser virket ikke når hele overskriften står med store bokstaver.
  - **Ikke årsaker:** koden (pipelinen nedgraderer bare, og 0 belegg ble fjernet), skjemaet og fasiten.
- **Prompten** (`src/lib/llm/prompter/gap.ts`):
  - definisjonene av «oppfylt» og «delvis» fra FR-8
  - «Disse reglene begrenser "oppfylt"»: alle deler av et sammensatt krav må være dokumentert, men for alternativer er ett av dem nok
  - egenvurdering gir høyst «delvis», mens konkret erfaring eller utdanning som viser egenskapen, er dokumentasjon
  - et nivå som CV-teksten selv oppgir som lavere, gir høyst «delvis», mens et nivå som ikke er oppgitt, vurderes ut fra det CV-teksten konkret viser
  - hvert listepunkt er ett krav og deles ikke opp
  - forkortelser i stillingen skrives med store bokstaver
- **Testene** (`gap.test.ts`): et mønster for hver ny regel, en test av rekkefølgen og ord fra kravene som feilet i den negative lista.
- **Gjennomgangen:** 9 funn. Seks er rettet (alternativer, egenvurdering kombinert med erfaring, dokumentasjonen, målingen som godkjenning, overskriften og «nøyaktig og»). Tre er avvist med begrunnelse i spec-en.
- **Kontrollene:** lint, typecheck, `npm test` (797 av 797 i 48 filer), build og tørrkjøringen (12 av 12) er grønne.
- **Dokumentasjonen:**
  - ny [vurdering-2-4-leverandorvalg-runde-2.md](../../_bmad-output/implementation-artifacts/vurdering-2-4-leverandorvalg-runde-2.md)
  - kjøreboka for del B har fått en statusdel for runde 2 med kommandoene
  - runde 1 og rapportene fra B2 er uendret
- **Commit:** `af5f4dd` (lokal). Ingen betalte kall. 2-4 står fortsatt som `in-progress`.

### Åpne punkter
- Målingen i runde 2 krever Kevins godkjenning:
  - Mistral Medium 3.5: 12 kall, ca. 1 kr.
  - OpenAI `gpt-4.1-mini`: 1 kall i kontrollen og 12 i målingen, ca. 0,3 kr. Krever nøkkelen og Sondres bekreftelse av vilkårene.
- Risiko i runde 2: de strengere reglene kan presse et ekstra krav under fasiten, særlig i par 3.

## 2026-11-19 kl. 21:32 — Kevin Heggdal

### Oppgave
Kevin godkjente runde 2 med Mistral Medium 3.5 (`mistral-medium-2604`): høyst 12 betalte kall, prompten fra runde 2, samme kodeversjon gjennom hele målingen og ingen nye forsøk. Før målingen skulle det sjekkes at arbeidstreet var rent, at testene var grønne og at grensen på 2 USD fortsatt gjaldt. Etterpå skulle runde 1 og runde 2 sammenlignes, SM-3, SM-2, NFR-4 og NFR-5 kontrolleres, og det skulle vurderes om krav nå ble vurdert for strengt eller for svakt. Det skulle ikke gjøres andre betalte kall, ingen push eller fletting og ingen endringer i Vercel.

### Plan
- **Forutsetningene:**
  - `git status` var tom på `28da462`.
  - Lint og typecheck var grønne, og `npm test` ga 797 av 797.
  - Tørrkjøringen ga 12 av 12.
  - Grensen kan bare leses i konsollen, så Kevins bekreftelse fra samme kveld ble lagt til grunn. Forbruket i dag var høyst ca. 0,16 USD, og med det verste tilfellet for runde 2 blir det høyst ca. 0,93 USD.
- **Målingen:** `npm run testsett -- --leverandor mistral --modell mistral-medium-2604 --pris-inn 14.53 --pris-ut 72.65`, kjørt én gang.
- **Vurderingen:** hver kjøring ble vurdert mot fasiten og sjekklisten, og resultatene ble ført inn i [vurdering-2-4-leverandorvalg-runde-2.md](../../_bmad-output/implementation-artifacts/vurdering-2-4-leverandorvalg-runde-2.md), med en tabell som sammenligner rundene.

### Resultat
- **Rapporten:** `testsett-rapporter/2026-11-19-2129-mistral-mistral-medium-2604.md`, commit `28da462`.
  - 12 av 12 kjøringer ga status 200, med 0 feil.
  - Varigheten var 4430–6038 ms (NFR-4), og output var 801–978 tokens.
  - Kostnaden var 1,1352 kr (0,0946 kr per gap-kjøring, ca. 0,38 kr per full kjøring) etter tredjepartsprisen.
- **Sammenlignet med runde 1:** tilfellene av krav over fasiten gikk ned fra 9 til 2, og kjøringene som består SM-3, gikk opp fra 3 til 8 av 12 (par 2 K2 og K3 avklares).
  - **Rettet:** «Nøyaktig og pålitelig» (par 1), «Selvstendig og ansvarsbevisst» (par 4), stillingen «IT-brukerstøtte» og det samlede kravet i par 2 K1.
  - **Fortsatt over fasiten:** par 1 «Gode digitale ferdigheter» er `O` i K1 og K3, med belegget Office «grunnleggende».
  - **For strengt:** par 1 «Kundeorientert» er `D` i alle tre (fasiten: `O`), fordi modellen krever erfaring «i en bankkontekst».
  - **Ikke for strengt:** par 4 «Serviceinnstilt» er fortsatt `O`, og par 3 er uendret (ett krav under fasiten).
  - **Fortsatt delt:** par 2 i K2 og K3.
- **Kriteriene:**
  - SM-3 og SM-1 (gap) er `N` (par 1 K1 og K3).
  - SM-2, NFR-4 og NFR-5 er `J`. NFR-5 har små feil: «hun» i stedet for du-form, «lære det opp» og «en introduksjonskurs».
  - Kostnaden er `J`.
- **Commit:** `d5b0988`, med rapporten, vurderingen for runde 2 og kjøreboka. Runde 1 er uendret.

### Åpne punkter
- OpenAI `gpt-4.1-mini` måles i runde 2 på samme commit `28da462` når nøkkelen fra Sondre er kommet. Det krever Kevins godkjenning.
- Mistral feiler SM-3 på par 1 i runde 2. Valget etter AD-11 tas når OpenAI er målt. Består heller ikke OpenAI, vurderes en runde 3 (en regel om at kravet vurderes slik det står, uten krav om samme bransje, og en strengere regel for nivå).

## 2026-11-19 kl. 21:47 — Kevin Heggdal

### Oppgave
Sondre har svart:
- OpenAI-nøkkelen kommer på DM til Kevin. Den skal bare brukes til testsettet i story 2.4, med `gpt-4.1-mini` og fiktive testdata, og ligge i `.env.local`, som aldri committes.
- Sondre bekreftet regelen for sammensatte krav: ett krav, begge delene gir Oppfylt, én del gir Delvis oppfylt med belegg for delen og en forklaring på det som mangler, og ingen deler gir Mangler.

Kevin ba om at regelen legges inn i gap-prompten med `bmad-build`, at fasitene kontrolleres uten å endres for å få modellen til å bestå, og at testene oppdateres. Det skulle ikke gjøres betalte kall, ingen push eller fletting, ingen endringer i Vercel og ikke noe arbeid på story 2.7.

### Plan
- Arbeidet fulgte `bmad-build` med den korte ruten («oneshot»): spec [spec-2-4-del-b-runde-3-sammensatte-krav.md](../../_bmad-output/implementation-artifacts/spec-2-4-del-b-runde-3-sammensatte-krav.md) og én gjennomgang med Blind Hunter. Konteksten for epic 2 var gyldig.
- Alle de sammensatte kravene i de fire fasitene ble kontrollert mot regelen.

### Resultat
- **Fasitene:** konsistente med regelen for par 1 («Nøyaktig og pålitelig»), par 2 («Windows og Microsoft 365», «muntlig og skriftlig») og par 4 (fire sammensatte krav).
  - **Motstrid ved en bokstavelig lesing:** i par 3 har «Erfaring med bokføring og avstemminger» og «Strukturert og nøyaktig» `D` uten at noen del er direkte dokumentert, fordi det finnes beslektet erfaring (FR-8). «Ingen deler = Mangler» ville gitt to krav under fasiten.
  - **Løsning:** FR-8 går foran (beslektet erfaring gir Delvis oppfylt). Fasitene er ikke endret, og Sondre bør bekrefte lesingen.
- **Prompten** (`gap.ts`):
  - Steg 2: kravteksten skal ha alle delene slik de står i punktet.
  - Steg 3: en egen blokk «Sammensatte krav» (alle delene, noen av delene, ingen deler med og uten beslektet erfaring) og alternativer for seg.
  - Steg 5: forklaringen sier hvilken del som mangler.
- **Testene:** mønstre for regelen, en negativ test for den gamle overskriften og en test av rekkefølgen fra steg 2 til steg 3.
- **Gjennomgangen:** 11 funn. Åtte er rettet, og tre er avvist med begrunnelse i spec-en.
- **Kontrollene:** lint, typecheck, `npm test` (806 av 806 i 48 filer), build og tørrkjøringen (12 av 12) er grønne. `.env.local` er ignorert og ikke sporet.
- **Dokumentasjonen:** ny [vurdering-2-4-leverandorvalg-runde-3.md](../../_bmad-output/implementation-artifacts/vurdering-2-4-leverandorvalg-runde-3.md) og en statusdel for runde 3 i kjøreboka.
- **Commit:** `1ad9821` (lokal). Ingen betalte kall.

### Åpne punkter
- Runde 3: begge måles på nytt på samme commit, fordi prompten er endret.
  - Mistral Medium 3.5: 12 kall, ca. 1,1 kr.
  - OpenAI `gpt-4.1-mini`: 1 kall i kontrollen og 12 i målingen, ca. 0,3 kr.
  - Det krever Kevins godkjenning, og nøkkelen fra Sondre må ligge i `.env.local`.
- Sondre bekrefter lesingen «ingen deler, men beslektet erfaring = Delvis oppfylt» (par 3).

## 2026-11-19 kl. 22:26 — Kevin Heggdal

### Oppgave
Kevin la OpenAI-nøkkelen fra Sondre i `.env.local` og godkjente målingene i runde 3:
- én kontroll av OpenAI på par 2, deretter 12 kjøringer med `gpt-4.1-mini`
- deretter 12 kjøringer med Mistral Medium 3.5

Begge skulle måles med nøyaktig samme prompt og kodeversjon og bare med fiktive testdata, uten nye forsøk, uten endringer i prompten og med en samlet anslått kostnad under 2 kr. Resultatene skulle sammenlignes mot SM-1, SM-2, SM-3, NFR-4, NFR-5 og AD-11, med en anbefaling om leverandør. Det skulle ikke gjøres push, fletting, endringer i Vercel eller noe arbeid på del C eller story 2.7.

### Plan
- **Forutsetningene:**
  - `git status` var tom på `4cd4f2f`.
  - Nøkkelen er satt med prefikset `sk-`. Bare lengden og prefikset ble sjekket, nøkkelen ble ikke vist.
  - `.env.local` er ignorert og ikke sporet.
  - `npm test` ga 806 av 806, og tørrkjøringen for OpenAI ga 12 av 12.
- **Kjøringene, på samme commit:** kontrollen av OpenAI, så 12 med OpenAI og så 12 med Mistral. Kostnaden ble sjekket etter hvert steg (0,02, deretter 0,22 og deretter 1,38 kr).
- **Vurderingen:** ført inn for begge leverandørene i [vurdering-2-4-leverandorvalg-runde-3.md](../../_bmad-output/implementation-artifacts/vurdering-2-4-leverandorvalg-runde-3.md), med en tabell som sammenligner alle rundene.

### Resultat
- **OpenAI `gpt-4.1-mini-2025-04-14`:**
  - Kontrollen ga 200 på 9148 ms, med 2129 inn og 597 ut, og kostet 0,0175 kr.
  - Den fulle målingen ga 12 av 12 med 0 feil og kostet 0,2039 kr (0,0170 kr per gap-kjøring). Den lengste kjøringen tok 8857 ms, og det høyeste antallet output-tokens var 605.
  - Kontrollrapporten ble overskrevet av den fulle målingen (samme minutt i filnavnet). Tallene står i vurderingen.
- **Mistral `mistral-medium-2604`:** 12 av 12 med 0 feil, 1,1606 kr (0,0967 kr per gap-kjøring). Den lengste kjøringen tok 6594 ms, og det høyeste antallet output-tokens var 946.
- **Samlet kostnad:** 1,38 kr, under rammen på 2 kr.
- **Vurderingen etter kriteriene:**
  - **SM-3 og SM-1 (gap):** begge `N`, med 2 krav over fasiten hver og 10 av 12 kjøringer bestått.
    - Mistral: par 1 «Gode digitale ferdigheter» er `O` i K2 og K3. «Kundeorientert» er dessuten `D` i alle tre (for strengt, men tillatt alene).
    - OpenAI: par 2 «Erfaring med brukerstøtte eller kundeservice» er `O` i K1 og K2. Veiledning av studenter ble regnet som brukerstøtte.
  - **SM-2:** begge `J`.
  - **NFR-4:** begge `J` (lengste kjøring 6,6 og 9,1 s).
  - **NFR-5:** Mistral `J` med små feil («en introduksjonskurs»). OpenAI `J` med forbehold (særskriving som «Tysk kunnskaper», og «It-brukerstøtte»). OpenAI ga også råd ved «delvis», mot prompten.
  - **Kostnad:** begge `J` (gap × 4 er 0,39 og 0,07 kr).
  - **Sammensatte krav:** samlet som ett krav i alle seks kjøringene av par 2. Sondres regel virket for begge.
- **AD-11:** ingen av leverandørene består. Kevins beslutning er at prompten rettes og begge måles på nytt når begge feiler. Valget er derfor ikke tatt.
- **Commit:** `d9d32d1` (lokal), med rapportene, vurderingen og kjøreboka.

### Åpne punkter
- Valget av leverandør er ikke tatt. Kevin og Sondre velger mellom:
  - (A) runde 4 med en rettet prompt, der begge måles på nytt (ca. 1,4 kr)
  - (B) en egen beslutning om avvik fra AD-11

  Anbefalingen er A først, og deretter Mistral etter PRD §6 hvis resultatet fortsatt er likt.
- Testsettet skriver over en rapport når to kjøringer starter i samme minutt. Filnavnet bør få sekunder, eller et løpenummer når fila finnes.

## 2026-11-19 kl. 22:35 — Kevin Heggdal

### Oppgave
Kevin valgte runde 4. Feilene fra runde 3 skulle gjennomgås med `bmad-build`, og gap-prompten skulle få generelle regler:
- «eller» betyr at ett dokumentert alternativ er nok
- et lavere ferdighetsnivå gir ikke automatisk «Oppfylt»
- kravet vurderes slik det står, uten krav som ikke finnes

Sondres regel for sammensatte krav skulle fortsatt følges. I tillegg skulle feilen i testsettet rettes, der en rapport kunne overskrives når to kjøringer starter i samme minutt, med en regresjonstest. Det skulle ikke gjøres betalte kall, ingen push eller fletting, ingen endringer i Vercel og ikke noe arbeid på del C eller story 2.7.

### Plan
- Arbeidet fulgte `bmad-build` med den korte ruten («oneshot»). Begge målene er med etter Kevins ønske. Spec: [spec-2-4-del-b-runde-4-alternativer-niva-og-rapportnavn.md](../../_bmad-output/implementation-artifacts/spec-2-4-del-b-runde-4-alternativer-niva-og-rapportnavn.md).
- Én gjennomgang med Blind Hunter. Funnene ble vurdert, rettet eller utsatt.

### Resultat
- **Prompten** (steg 3 og 6 i `gap.ts`):
  - Et alternativ må selv være dokumentert, og erfaring som bare ligner, gir «delvis».
  - Nivået i CV-en sammenlignes med kravet, og et lavere nivå gir høyst «delvis».
  - Kravet vurderes slik det står. Det legges ikke til krav om bransje, arbeidsgiver eller stilling.
  - Konkret erfaring dokumenterer en egenskap også når ordet ikke står i CV-en, men det gjør ikke beslektet erfaring til dokumentasjon.
  - `raad` er null for «oppfylt» og «delvis».
  - Sondres regel er uendret, og en test sjekker det.
- **Testsettet** (`scripts/kjor-testsett.ts`):
  - `rapportNavn` har sekunder (`TTMMSS`).
  - `skrivNyRapport` overskriver aldri. Er navnet tatt, får fila `-nrN` før `-mock.md` eller `.md` (så `.gitignore` fortsatt fanger tørrkjøringene), med en øvre grense på 1000.
  - `main` tar imot `na`, så tiden kan styres i testene.
  - Regresjonstestene dekker samme minutt, samme sekund (via `main`, med linjen i konsollen), ENOENT og et modellnavn som slutter på et siffer.
- **Gjennomgangen:** 10 funn. 7 er rettet, blant dem at reglene om kravet slik det står, ikke skal oppheve regelen om alternativer, og at nivået igjen er et tak. 2 er utsatt til `deferred-work.md` (å fjerne `raad` ved «delvis» i koden, og formatet på filnavnet i spec-en for del A). 1 er avvist.
- **Kontrollene:** lint, typecheck, `npm test` (819 av 819 i 48 filer), build og begge tørrkjøringene er grønne.
- **Dokumentasjonen:** ny [vurdering-2-4-leverandorvalg-runde-4.md](../../_bmad-output/implementation-artifacts/vurdering-2-4-leverandorvalg-runde-4.md) og en statusdel for runde 4 i kjøreboka med kommandoene og kostnadsanslaget.
- **Commit:** `5346bee` (lokal). Ingen betalte kall.

### Åpne punkter
- Runde 4: OpenAI (12 kall, ca. 0,21 kr) og Mistral (12 kall, ca. 1,18 kr) måles på samme commit etter Kevins godkjenning. Det blir ca. 1,4 kr til sammen.

## 2026-11-19 kl. 22:42 — Kevin Heggdal

### Oppgave
Kevin godkjente runde 4: 12 betalte kall mot OpenAI `gpt-4.1-mini` og 12 mot Mistral Medium 3.5, på samme commit og med nøyaktig samme prompt, uten kontrollkall. Det skulle ikke gjøres endringer i prompten underveis og ingen nye forsøk. Etterpå skulle de to modellene sammenlignes (SM-3, de andre kravene og kostnadene), med en anbefaling om leverandør. Det skulle ikke gjøres push, fletting eller noe arbeid på del C eller story 2.7.

### Plan
- **Forutsetningene:** `git status` var tom på `be2b0e2`, og `npm test` ga 819 av 819.
- **Kjøringene:** OpenAI og så Mistral i én kjøring i bakgrunnen, uten commit mellom dem.
- **Vurderingen:** hver kjøring ble vurdert mot fasiten og sjekklisten og ført inn i [vurdering-2-4-leverandorvalg-runde-4.md](../../_bmad-output/implementation-artifacts/vurdering-2-4-leverandorvalg-runde-4.md), med en tabell over alle rundene.

### Resultat
- **OpenAI `gpt-4.1-mini-2025-04-14`:** 12 av 12 med 0 feil, 0,2094 kr (0,0175 kr per gap-kjøring, ca. 0,07 kr per full kjøring). Den lengste kjøringen tok 8701 ms, og det høyeste antallet output-tokens var 590.
  - **SM-3 er bestått i 12 av 12:** ingen krav over fasiten, og høyst ett under per kjøring (par 2 K3 kommunikasjon `M`, par 3 K1 og K2 samarbeid `M`).
  - Regelen om alternativer virket: «brukerstøtte eller kundeservice» er `D` i alle tre.
  - Det ble ikke gitt råd ved «delvis».
  - **SM-2 avklares:** i par 2 K1 er forklaringen «Erfaringen er med brukerstøtte i studiet», men CV-en har bare veiledning. Strengt lest er det et brudd.
  - **NFR-5:** `J` med forbehold (særskriving «Tysk kunnskapsnivået», «It-brukerstøtte», «Deltid»).
- **Mistral `mistral-medium-2604`:** 12 av 12 med 0 feil, 1,1822 kr (0,0985 kr per gap-kjøring). Den lengste kjøringen tok 5809 ms.
  - **SM-3 er bare bestått i 6 av 12.** Det er en tilbakegang fra runde 3:
    - Par 4: «Selvstendig og ansvarsbevisst» er `O` i alle tre.
    - Par 1 K1: «Nøyaktig og pålitelig» er `O`.
    - Par 3 K2 og K3: «Excel» `D` og «bokføring» `M` gir to krav under fasiten.
  - **Rettet:** «Gode digitale ferdigheter» er `D` i alle tre, og «Kundeorientert» er `O` i 2 av 3.
- **Kostnaden i runde 4:** 1,39 kr.
- **Kostnaden for alle målingene i dag:**
  - Mistral: ca. 5,0 kr (B2, runde 2, 3 og 4 og kontrollene). Med tredjepartsprisen er det ca. 0,5 USD.
  - OpenAI: ca. 0,43 kr.
- **AD-11:** Mistral består ikke, så regelen gir OpenAI. Forslaget er OpenAI `gpt-4.1-mini`, hvis Kevin og Sondre godtar setningen i par 2 K1 og Sondre bekrefter DPA-en.
- **Commit:** `100ba27` (lokal), med rapportene, vurderingen og kjøreboka.

### Åpne punkter
- Kevin og Sondre avgjør SM-2 for OpenAI i par 2 K1, velger leverandør etter AD-11 og signerer vurderingen for runde 4.
- Sondre bekrefter OpenAI-vilkårene (DPA-en i nettleser, at deling er av, kreditten) før del C.

## 2026-11-19 kl. 22:50 — Kevin Heggdal

### Oppgave
Kevin og Sondre er enige om at OpenAI `gpt-4.1-mini` er den foreløpige favoritten, men at formuleringen om brukerstøtte i runde 4 bryter SM-2 og FR-27, fordi CV-en dokumenterer veiledning. Sondre foreslo en generell regel om at erfaring beskrives med CV-ens egne ord.

Kevin ba om fem ting:
- finne nøyaktig hvor formuleringen stod
- rette gap-prompten med en generell regel uten eksempler fra testsettet
- følge `bmad-build` med gratis tester, gjennomgang og dokumentasjon
- forberede runde 5 med begge leverandørene på samme prompt og commit
- gi et kostnadsestimat

Det skulle ikke gjøres betalte kall, ingen push eller fletting og ikke noe arbeid på del C eller story 2.7.

### Plan
- **Formuleringen:** funnet i rapporten fra runde 4 med `grep`.
- **`bmad-build` med den korte ruten («oneshot»):** spec [spec-2-4-del-b-runde-5-cv-ens-egne-ord.md](../../_bmad-output/implementation-artifacts/spec-2-4-del-b-runde-5-cv-ens-egne-ord.md) og én gjennomgang med Blind Hunter.

### Resultat
- **Hvor formuleringen stod:** i feltet `forklaring`, ikke i kravteksten eller beleggene. Det var OpenAI, par 2, kjøring 1, kravet «Erfaring med brukerstøtte eller kundeservice» (kategori «delvis»), på linje 198 i `testsett-rapporter/2026-11-19-223737-openai-gpt-4.1-mini.md`. Den nøyaktige teksten er «Erfaringen er med brukerstøtte i studiet, men ikke spesifikt i kundeservice.»
- **Samme type feil:** «CV-en dokumenterer god forståelse av Windows» i alle tre kjøringene av par 2 hos OpenAI. CV-en har bare «Operativsystemer: Windows».
- **Prompten:** en ny regel under «Ærlighet» med underpunkter.
  - Det brukeren har, beskrives med CV-tekstens egne ord i `forklaring` og `raad`.
  - Annonsens betegnelser og nivåord brukes ikke om brukeren hvis CV-en ikke bruker dem.
  - Beslektet erfaring beskrives som det CV-en viser.
  - En egenskap kan nevnes sammen med den konkrete erfaringen som viser den.
  - Et nivå som ikke er oppgitt, beskrives som «ikke oppgitt».
  - Det som mangler, kan nevnes med annonsens ord, og CV-er på andre språk kan oversettes.
  - Steg 5 og 6 viser til regelen.
- **Gjennomgangen:** 11 funn, og alle er rettet. Det viktigste var at regelen ikke skal kollidere med regelen i steg 3 om at konkret erfaring kan dokumentere en egenskap.
- **Kontrollene:** lint, typecheck, `npm test` (835 av 835 i 48 filer), build og begge tørrkjøringene er grønne.
- **Dokumentasjonen:**
  - ny [vurdering-2-4-leverandorvalg-runde-5.md](../../_bmad-output/implementation-artifacts/vurdering-2-4-leverandorvalg-runde-5.md), som sier hvordan regelen vurderes: et brudd gir `N` under SM-2, og det gjelder begge leverandørene
  - en statusdel i kjøreboka med kommandoene og kostnadsanslaget
- **Commit:** `271edb4` (lokal). Ingen betalte kall.

### Åpne punkter
- Runde 5: OpenAI (12 kall, ca. 0,22 kr) og Mistral (12 kall, ca. 1,20 kr) måles på samme commit etter Kevins godkjenning. Det blir ca. 1,4 kr til sammen.
