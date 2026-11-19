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
