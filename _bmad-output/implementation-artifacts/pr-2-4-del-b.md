# Utkast: PR for story 2.4 del B (måling og leverandørvalg)

> **Utkast, ikke opprettet.** Tittelen og beskrivelsen under er klare til å kopieres inn når Kevin godkjenner push og PR. **Før PR-en kan flettes**, må grenen oppdateres med `main` (23 commits bak). En tørrkjøring (`git merge-tree`) viser konflikter i to dokumentfiler: `_bmad-output/implementation-artifacts/deferred-work.md` og `epic-2-context.md`. Etter flettingen må alle testene kjøres på nytt, fordi `main` har fått story 2.5 og 2.6.

**Tittel:** `Story 2.4 del B: måling og leverandørvalg (OpenAI gpt-4.1-mini, temperatur 0)`

---

## Sammendrag

Del B av story 2.4 (AK 2, AD-11) måler Mistral og OpenAI med testsettet og velger leverandør etter en fast regel.

**Valg (Kevin og Sondre, 2026-11-19):** OpenAI `gpt-4.1-mini` med temperatur 0.
- AD-11: Mistral velges hvis den består SM-1 (gap), SM-2, SM-3 og NFR-5 innenfor 1 kr per kjøring, og ellers OpenAI.
- Mistral består ikke. Large 4 feilet NFR-4 (tidsavbrudd etter 45 s), og Medium 3.5 feilet SM-3 i alle fem rundene.

> **SM-1 er IKKE bestått (9 av 12 kjøringer).** I par 3 vurderer modellen «Strukturert og nøyaktig» og «Gode samarbeidsevner» som Mangler, mens fasiten har Delvis oppfylt. Det er to krav under fasiten, og FR-8 tillater ett. Avviket er åpent. Kevin og Sondre vurderer fasiten for «Gode samarbeidsevner» på nytt (`_bmad-output/implementation-artifacts/beslutningsgrunnlag-2-4-fasit-par-3.md`). Fasiten er ikke endret.

## Endringer

- **Prompten** (`src/lib/llm/prompter/gap.ts`), fem runder. Hver har en spec, en gjennomgang og egne tester:
  - Runde 1 (`246e58b`): bare kvalifikasjoner er krav, ingen duplikater, ingen listetegn i belegg, og stillingen med vanlig skrift.
  - Runde 2 (`af5f4dd`): kategoriene følger FR-8 (direkte dekket, egenvurdering, lavere nivå), og hvert listepunkt er ett krav.
  - Runde 3 (`1ad9821`): Sondres regel for sammensatte krav (alle delene, noen av delene, ingen deler med og uten beslektet erfaring).
  - Runde 4 (`5346bee`): alternativer («eller») må selv være dokumentert, kravet vurderes slik det står, og det gis bare råd ved Mangler.
  - Runde 5 (`271edb4`): erfaring beskrives med CV-ens egne ord, ikke med annonsens begreper (SM-2, FR-27).
- **Mistral-adapteren** (`51d5989`): lav resonnering (`none` for Medium 3.5, `low` for Large 4).
- **Pipelinen** (`246e58b`): listetegn og innrykk fjernes først i belegg før beleggkontrollen. Like belegg fjernes.
- **Testsettet:**
  - Rapporten viser modellversjonen fra leverandøren og resonneringen, og utgangskoden er 1 når alle kjøringene feiler.
  - Rapportnavnene har sekunder, og en rapport overskrives aldri (`-nrN`, `5346bee`).
- **Valgt oppsett:** `TEMPERATUR = 0` (`ee49c2b`) og `STANDARD_MODELL.openai = gpt-4.1-mini`, låst med tester (`374495d`). `LLM_LEVERANDOR` har fortsatt Mistral som standard i koden (AD-3). Produksjonen settes i del C.
- **Dokumentasjonen:**
  - kjøreboka for del B og del C
  - vurderingene for rundene 1–5 og kontrollen med temperatur 0
  - oversikten over vilkår og priser
  - beslutningsgrunnlaget for par 3
  - PRD §10.1 merket som valgt
  - alle testsettrapportene

## Testresultater

| Runde | Leverandør | Krav over fasiten | Kjøringer som består sjekklisten (SM-1, gap) | SM-2 | Kostnad per gap-kjøring |
|---|---|---|---|---|---|
| 1 | Mistral Medium 3.5 | 9 | 3 (+3 avklares) | J | 0,084 kr |
| 2 | Mistral | 2 | 8 (+2) | J | 0,095 kr |
| 3 | Mistral / OpenAI | 2 / 2 | 10 / 10 | J / J | 0,097 / 0,017 kr |
| 4 | Mistral / OpenAI | 4 / 0 | 6 / 11 | J / N (1 setning) | 0,099 / 0,018 kr |
| 5 | Mistral / OpenAI | 3 / 1 | 8 / 10 | J / J | 0,102 / 0,019 kr |
| **Kontroll, T = 0** | **OpenAI** | **0** | **9** (par 3) | **J** | **0,019 kr** |

**Det valgte oppsettet:**
- SM-2: J
- SM-3 etter PRD-en (ingen krav over fasiten, Mangler alltid Mangler): J, 12 av 12
- **SM-1: N, 9 av 12**
- NFR-4: J (lengste 8,4 s)
- NFR-5: J
- Kostnad: ca. 0,07 kr per full kjøring
- Kategoriene er identiske i alle tre kjøringene.

**Kostnaden for alle målingene:** OpenAI ca. 0,88 kr. Mistral ca. 5,8–6,2 kr, med tredjepartspris som ikke er eksakt bekreftet.

**Automatiserte tester:** `npm run lint`, `npm run typecheck`, `npm test` (836 av 836 i 48 filer), `npm run build` og `npm run testsett -- --leverandor openai --mock` er grønne uten nøkkel.

## Kjente avvik

1. **SM-1 i par 3** (over). Åpent, og må løses før innleveringen.
2. **Stillingen** skrives «It-brukerstøtte» (ikke «IT-») i alle kjøringene med OpenAI.
3. **Kravtekstene** tar med «(en fordel)» og «(påkrevd)» fra annonsen (kosmetisk).
4. **Små språkfeil** i forklaringene (setninger uten subjekt, særskriving i tidligere runder).
5. **Kontrollrapporten** for OpenAI i runde 3 ble overskrevet (feilen i filnavnet). Tallene står i vurderingen, og feilen er rettet.
6. **Utsatt** (`deferred-work.md`): å fjerne `raad` ved Delvis i koden, og formatet på filnavnet i spec-en for del A.

## Det som gjenstår

**Del B:**
- Beslutning om fasiten i par 3, og at SM-1 løses
- Kevins og Sondres signatur på vurderingen
- B4, manuell test i appen med OpenAI (2 betalte kall)
- Rotering av nøklene fra målingen
- Sondres bekreftelse av OpenAI-vilkårene: deling av data er av, databehandleravtalen er på plass, kreditten er under 200 kr uten påfylling

**Del C** (`kjorebok-2-4-del-c.md`):
- En egen nøkkel for produksjonen, og `LLM_LEVERANDOR=openai`, `LLM_MODELL=gpt-4.1-mini` og `OPENAI_API_KEY` bare i Production på Vercel
- Kreditt og grense for forbruket
- Kontroll av `/api/status` (`tredjeland: true`) og personvernteksten (USA, utenfor EØS)

Story 2.4 står som `in-progress` i `sprint-status.yaml` til dette er gjort.

## Personvern og hemmeligheter

- Det er bare brukt fiktive testdata.
- Ingen nøkler er sporet: `.env.local` er ignorert, og bare `.env.example` med tomme verdier er sporet. Grenens historikk og rapportene er søkt gjennom etter nøkkelmønstre.
- OpenAI brukes ikke til trening på API-data uten aktivt samtykke ([developers.openai.com](https://developers.openai.com/api/docs/guides/your-data)). Data behandles utenfor EØS.

## Slik kan endringen kontrolleres

```bash
npm ci
npm run lint && npm run typecheck && npm test && npm run build
npm run testsett -- --leverandor openai --mock
```

Les `_bmad-output/implementation-artifacts/vurdering-2-4-kontroll-temperatur-0.md` (valget, SM-1 og vilkårene) og `beslutningsgrunnlag-2-4-fasit-par-3.md`.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
