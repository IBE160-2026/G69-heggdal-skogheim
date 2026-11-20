# Utkast: PR for story 2.4 del C (forberedelsen av produksjonen)

> **Utkast, ikke opprettet.** Tittelen og beskrivelsen under er klare til å kopieres inn når Kevin godkjenner push og PR. Grenen er `story-2.4-del-c-produksjon`, laget fra `main` `0292337`. `origin/main` (`e9a70d8`, bare Sondres sesjonslogg) er flettet inn i grenen uten konflikter (`9388b91`, 2026-11-20). Alle endringene er committet.

**Tittel:** `Story 2.4 del C: vilkår, kreditt og sjekkliste før produksjonen (OpenAI)`

---

## Sammendrag

Del C av story 2.4 (AK 3) setter produksjonen opp med den valgte leverandøren: OpenAI `gpt-4.1-mini` med temperatur 0 (AD-11).

**Avtalt rekkefølge (Sondre og Kevin, 2026-11-20):**
1. PR-en for del C gjøres ferdig (denne).
2. Sondre går gjennom PR-en og fletter den til `main`.
3. Sondre legger inn variablene i Vercel, bare for Production, og tar en Redeploy etter Kevins «gå».
4. Kevin og Sondre tar kontrollene i C4 sammen.

PR-en inneholder derfor bare forberedelsen: dokumentasjonen og én kommentar i koden. **Ingenting er endret i Vercel ennå.**

Flettingen til `main` gir trolig en ny produksjonsdeploy. Det er ikke kontrollert. Produksjonen står likevel i demomodus, fordi variablene ikke er satt. Variablene trenger en egen Redeploy etterpå.

> **Story 2.4 er ikke ferdig.** C3 (variablene og Redeploy), C4 (kontrollene i produksjonen) og C5 står igjen. **SM-1 er fortsatt IKKE bestått (9 av 12 kjøringer, par 3).** Avviket er åpent, og fasiten er ikke endret. 2-4 står som `in-progress` i `sprint-status.yaml`.

## Ferdig i denne PR-en

- **Kode:** bare kommentaren til `MAKS_UTDATA_TOKENS` i `src/lib/llm/felles.ts` (`d055d98`). Verdien er fortsatt 8000, og kommentaren dokumenterer vurderingen 2026-11-20. Høyeste antall output-tokens var 608 i 12 kjøringer, og verdien vurderes på nytt i epic 3.
- **Beslutninger (Kevin, 2026-11-20):** `GRENSE_PER_MINUTT` 10 og `GRENSE_PER_DOGN` 200 gjelder som standardverdier i koden (AD-9). De settes ikke i Vercel.
- **C1, vilkårene for OpenAI** (bekreftet av Sondre 2026-11-20):
  - Trening og deling av data er av.
  - DPA-en gjelder automatisk, med OpenAI Ireland Ltd. som avtalepart.
  - Overføringen til USA er dekket av punkt 4.1 i DPA-en (SCC eller GDPR art. 45, også EU–U.S. Data Privacy Framework). Hvilket av grunnlagene som brukes, og om OpenAI er sertifisert under DPF, er ikke kontrollert.
  - Behandlingen skjer i USA, så personvernteksten «… OpenAI i USA … ut av EØS» og `tredjeland: true` står.
- **C2, kreditten:** 5 USD (6,25 USD inkl. 25 % mva., ca. 60 kr), kjøpt én gang 2026-11-19. Det er ikke fylt på senere, og automatisk påfylling er av. Beløpet er under 200 kr inkl. mva.
- **C3, forberedt:**
  - Sjekklisten for Sondre: `sjekkliste-2-4-c3-sondre.md`.
  - Nøkkelen for produksjonen er laget og lagret utenfor GitHub (punkt 1). Det er et avvik fra sjekklisten, som sier at nøkkelen bare skal ligge i Vercel. Kopien slettes eller legges i en passordbehandler.
- **Dokumenter:**
  - `kjorebok-2-4-del-c.md`
  - `vurdering-2-4-kontroll-temperatur-0.md`, avsnitt 7
  - `vilkaar-og-priser-2-4.md`
  - tre spec-er: `spec-2-4-del-c-maks-utdata-tokens.md`, `spec-2-4-del-c-vilkaar-og-kreditt-bekreftet.md` og `spec-2-4-del-c-overforingsgrunnlag-og-rekkefolge.md`
  - sesjonsloggen og `.logs/kevin-heggdal/issues.md`
  - dette utkastet (`pr-2-4-del-c.md`)

## Testresultater

Kjørt 2026-11-20 på grenen etter flettingen med `main` (`9388b91`):
- `git diff --check` mot `main`: rent
- `npm run lint` og `npm run typecheck`: grønne
- `npm test`: 896 av 896 (52 filer)
- `npm run build`: grønn
- Søk etter hemmeligheter i de nye linjene mot `main` (`sk-`, `sk-proj-`, Bearer, private nøkler og andre kjente mønstre): ingen treff. `.env.local` er ignorert, og `.env.example` har bare tomme verdier.

Ingen betalte kall i del C. `/api/status` i produksjonen ble kontrollert gratis 2026-11-20 og ga `demo`, Mistral AI og `arn1`.

## Det som gjenstår etter flettingen (ikke en del av denne PR-en)

Ingen av punktene under er markert som ferdige. Story 2.4 står som `in-progress`.

1. **C3** (Sondre, etter Kevins «gå»), punkt 2–4 i sjekklisten:
   - `LLM_LEVERANDOR=openai`, `LLM_MODELL=gpt-4.1-mini` og `OPENAI_API_KEY` (Sensitive), bare i Production
   - en kontroll av at Preview og Development ikke har noen nøkkel
   - Redeploy
2. **C4:** gratis kontroller av `/api/status`, personvernboksen og Preview. Deretter én betalt analyse med par 2 (krever godkjenning) og en kontroll av forbruket.
3. **Nøklene:**
   - Nøklene fra del B roteres eller slettes. De trekker trolig fra samme kreditt.
   - Kevin og Sondre avgjør om kopien av nøkkelen for produksjonen utenfor Vercel slettes, eller ligger bare i en passordbehandler.
4. **B4** (par 2 innen 30 s, og par 1 med annonsen med innplantet instruks) kan tas i produksjonen sammen med den betalte kontrollen i C4. Det avgjør Kevin.
5. **Kevins beslutning i C2:** om OpenAI-prosjektet også skal ha en egen grense for forbruket.
6. **C5:**
   - avsnitt 5 og 7 i vurderingen signeres
   - PRD §10.1 merkes som løst
   - sesjonsloggen
   - 2-4 settes til `done` først når AK 1–3 er oppfylt og SM-1 er avgjort
7. **SM-1, åpent avvik:** fasiten for «Gode samarbeidsevner» i par 3 (løsning 2, `beslutningsgrunnlag-2-4-fasit-par-3.md`).
8. **Refleksjonsrapporten** (PRD §6): tredjelandsoverføringen og grunnlaget for den.

## Personvern og hemmeligheter

- Ingen nøkler i koden, i dokumentene eller i git.
- Ingen `NEXT_PUBLIC_`-variabler i `src`.
- Nøkkelen for produksjonen settes bare i Vercel, bare i Production (AD-12).

## Slik kan endringen kontrolleres

- `git diff main...story-2.4-del-c-produksjon -- src` viser bare kommentaren i `felles.ts`.
- `npm run lint`, `npm run typecheck` og `npm test` skal være grønne.
- Les C1–C3 i `kjorebok-2-4-del-c.md` og punkt 0 og 1 i `sjekkliste-2-4-c3-sondre.md` mot bekreftelsene fra Sondre.
