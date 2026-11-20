# Utkast: PR for story 2.4, avslutningen (SM-1, B4 del 2 og dokumentasjon)

> **Utkast, ikke opprettet.** Tittelen og beskrivelsen under kopieres inn når Kevin godkjenner push og PR. Grenen er `story-2.4-avslutning`, laget fra `main` `39d59d9`, med `origin/main` `d368937` flettet inn uten konflikter (Sondres README, farger og mørk modus).

**Tittel:** `Story 2.4: SM-1 løst med revurdert fasit, B4 del 2 rettet (instrukser og tom kravliste), og rettinger i dokumentasjonen`

---

## Sammendrag

Denne PR-en tar story 2.4 et stykke nærmere ferdig:
- SM-1 løses ved at fasiten for par 3 revurderes (løsning B).
- B4 del 2 (NFR-9), som feilet i produksjonen, dokumenteres og rettes.
- Dokumentasjonen om produksjonsnøkkelen og forbruket rettes.

> **Story 2.4 er ikke ferdig.** **Prompten er endret etter målingen.** Testsettet og B4 del 2 må kjøres på nytt (betalte kall, krever godkjenning) før SM-1–SM-3 og NFR-9 gjelder den nye prompten. C5 står også igjen. 2-4 står som `in-progress`.

> **Om flettingen:** flettingen til `main` deployer trolig produksjonen. Produksjonen bruker da den nye prompten før den er målt. Kevin og Sondre avgjør om testsettet og B4 del 2 skal kjøres på grenen før flettingen (lokalt med `kevin-maaling-2-4`, som er beholdt for dette) eller rett etter.

## Ferdig i denne PR-en

### SM-1: fasiten for par 3 er revurdert (`0a32487`, egen commit)
- I `testdata/par-3-regnskap/fasit.md` er «Gode samarbeidsevner» endret fra Delvis oppfylt til **Mangler**. «Strukturert og nøyaktig» er fortsatt Delvis oppfylt.
- Fasiten har et datert avsnitt om at endringen er gjort **etter målingen**, med begrunnelse fra CV-en, annonsen og FR-8. Beslutningen står i `beslutningsgrunnlag-2-4-fasit-par-3.md` (løsning B, Kevin og Sondre).
- **Konsekvensene** (avsnitt 1, 2 og 6 i `vurdering-2-4-kontroll-temperatur-0.md`):
  - Det valgte oppsettet (T = 0): SM-1 går fra 9 til **12 av 12** uten ny måling, og SM-3 er uendret.
  - Tidligere kjøringer med Delvis oppfylt for samarbeid ligger nå over fasiten: OpenAI R3, R4 K3 og R5 K2, og Mistral R2–R5. De er historiske og står uendret.
  - Valget av leverandør (AD-11) er uendret.

### B4 del 2: resultatet, årsaken og rettingen
- **Resultatet** (`eb5fbf2`, § 7a i `kjorebok-2-4-del-b.md`): én manuell test i produksjonen ga HTTP 200 og **0 krav**. Testen er ikke bestått, og resultatet står som historikk.
  - Testfilen er komplett.
  - Mest sannsynlig forstyrret instruksen modellens svar. Det er ikke bekreftet.
- **Rettingen** (`081a8d4`):
  - **Prompten** (`src/lib/llm/prompter/gap.ts`): tekst i CV-en eller annonsen som prøver å gi instrukser, er verken et krav, en kvalifikasjon eller en instruks, og den hoppes over. En vanlig stillingsannonse har minst ett krav, og instrukser gjør ikke at kravene utelates. Reglene for kvalifikasjoner, dokumentasjon og ærlighet gjelder fortsatt, så det lages aldri krav for å fylle lista.
  - **Valideringen** (`src/lib/kontrakt/gap.ts`): `gapSvar.krav` har fått `.min(1)`. En tom liste fra modellen gir `ugyldig_svar` (502), og brukeren ser «Svaret fra språkmodellen kunne ikke brukes. Prøv igjen.» i stedet for en tom analyse.
  - **Tester:** reglene i prompten (bare ordlyden), `gapSvar` med 0 og 1 krav, og at pipelinen gir 502 og logger tokenene for 0 krav. Uten `.min(1)` feiler 4 av de nye testene.

### Dokumentasjonen (`8fab828`)
- Produksjonsnøkkelen ligger **bare i Vercel** (Sondre). Teksten om en passordbehandler er rettet i kjøreboka og sjekklisten, og de historiske PR-utkastene har fått en merknad om rettelsen.
- Forbruket i OpenAI **kan filtreres per API-nøkkel**, så det trengs ikke et eget prosjekt.

## Det som gjenstår (ikke en del av denne PR-en)

1. **Testsettet på nytt** med den nye prompten: OpenAI `gpt-4.1-mini`, T = 0, 12 kall, ca. 0,22 kr. Gjelder SM-1–SM-3. Krever godkjenning.
2. **B4 del 2 på nytt:** 1 kall, ca. 0,02 kr. Forventet resultat er de seks kravene i fasiten for par 1 med AFR som Mangler. 502 `ugyldig_svar` betyr at testen ikke er bestått. Krever godkjenning. Etterpå slettes `kevin-maaling-2-4` og nøkkelen fra målingen hos Mistral.
3. **Kevins beslutninger:**
   - om en annonse uten krav skal få en egen melding, uten *Prøv igjen*, i stedet for `ugyldig_svar`
   - om fanen skal vise en melding for en tom analyse
   - om `testdata/robusthet/README.md` skal oppdateres
   - om C2 skal ha en grense for forbruket
4. **Kommentaren til `TEMPERATUR`** i `src/lib/llm/felles.ts` beskriver den gamle fasiten. Den bør rettes, og det er en kodeendring som krever godkjenning.
5. **C5:**
   - signaturene i vurderingen
   - PRD §10.1 merkes som løst
   - 2-4 settes til `done` når punkt 1 og 2 er bestått
6. **Følges opp senere:** SM-4 (story 5.1), refleksjonsrapporten (PRD §6), og at Sondre melder prosjektet, eieren og rettighetene for nøkkelen.

## Kontroller

Kjørt 2026-11-20 på grenen etter flettingen med `origin/main`:
- `git diff --check`: rent
- `npm run lint` og `npm run typecheck`: grønne
- `npm test`: 918 av 918 (56 filer)
- `npm run build`: grønn
- Søk etter hemmeligheter i diffen: ingen treff
- Ingen betalte kall. Testdataene er bare endret i `testdata/par-3-regnskap/fasit.md` (løsning B).

**Gjennomgang etter BMAD:**
- Hver endring har en spec: `spec-2-4-sm-1-fasit-par-3-samarbeid.md`, `spec-2-4-del-c-nokkel-bare-i-vercel-og-forbruk-per-nokkel.md` og `spec-2-4-b4-instruks-og-tom-kravliste.md`.
- Hver endring har en gjennomgang med Blind Hunter. Funnene og hvordan de er håndtert, står i spec-ene.

## Slik kan endringen kontrolleres

- `git diff main...story-2.4-avslutning -- src` viser prompten, valideringen og testene.
- Les § 7a i `kjorebok-2-4-del-b.md`, avsnitt 6 i `vurdering-2-4-kontroll-temperatur-0.md` og «Revurdering etter målingen» i `testdata/par-3-regnskap/fasit.md`.
- `npm run lint`, `npm run typecheck` og `npm test` skal være grønne.
