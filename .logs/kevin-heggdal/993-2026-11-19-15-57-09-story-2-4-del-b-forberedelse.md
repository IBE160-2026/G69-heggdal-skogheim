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
