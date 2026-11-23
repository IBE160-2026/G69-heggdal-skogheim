# Utkast: avsluttende PR for story 2.4 (C5)

> **Utkast, ikke opprettet** (2026-11-22). Grenen er `story-2.4-c5-dokumentasjon`, laget fra `main` `50a7e36`. Push og PR krever Kevins godkjenning.
>
> **To mulige bruksmåter:**
> 1. **Nå:** som en ren dokumentasjons-PR med beslutningsarket og C5-dokumentasjonen. Da gjelder bare delen «Ferdig nå», og tittel A brukes.
> 2. **Senere:** som den avsluttende PR-en, når Sondres svar er ført inn. Da fylles feltene merket **[AVGJØRES]** ut, de avsluttende stegene legges til, og tittel B brukes.
>
> PR #30 med avviksanalysen (fra `story-2.4-b4-resultat`) bør flettes først. Den og denne grenen endrer ikke de samme filene.
>
> **Oppdatert 2026-11-22:** bruksmåte 1 er brukt. Grenen ble flettet som PR #31 (`c7c4a68`) med tittel A, og PR #30 er flettet (`f36568e`). Utkastet står videre som mal for den avsluttende PR-en med tittel B. Den er ikke opprettet. Avsnittene «Ferdig nå» og «Kontroll» beskriver PR #31 slik den var. Når malen brukes for tittel B, gjelder ikke kontrollpunktet om filene i PR #30 lenger, fordi `.logs/kevin-heggdal/issues.md` endres etter flettingen.

**Tittel A (nå):** `docs(2.4): beslutningsark for Sondre, PRD §10.1, kjørebok C og kjente svakheter (C5)`

**Tittel B (avslutningen):** `Story 2.4: C5 fullført, [AVGJØRES: SM-1 avgjort / avvikene godtatt], og 2-4 satt til done`

> **2026-11-23:** SM-1 er avgjort ved at avvikene uten eksempelblokken er godtatt som kjente svakheter (Sondre og Kevin). Tittelen fylles ut når de andre punktene i «Avslutningspunktene» i C5 i `kjorebok-2-4-del-c.md` er gjort. Grenen `story-2.4-avslutning-maaling` har dokumentasjonen av målingen og er ikke den avsluttende PR-en.

---

## Formål

Story 2.4 (velge leverandør ved måling) avsluttes med C5 i `kjorebok-2-4-del-c.md`. Valget er tatt: OpenAI `gpt-4.1-mini` med temperatur 0, etter AD-11. AK 1–3 i `epics.md` er oppfylt. Det som står igjen, er gruppas egen regel om at SM-1 må være avgjort, og dokumentasjonen.

**Status for suksesskriteriene med prompten i produksjonen** (fra PR #27 og PR #28, testsettet 2026-11-20):

| Kriterium | Resultat |
|---|---|
| SM-1 | 9 av 12, ikke bestått |
| SM-2 | 10 av 12, ikke bestått |
| SM-3 | 11 av 12, ikke bestått |

Årsaken er ikke avklart. Med prompten fra `271edb4` var alle tre 12 av 12 med den revurderte fasiten.

## Ferdig nå (bare dokumentasjon)

- **Nytt `beslutningsark-2-4-sondre.md`:** de tolv åpne spørsmålene som trenger Sondre, med alternativer og Claudes anbefalinger. Ingenting er avgjort, og ingen har signert.
- **Nytt `kjente-svakheter-2-4.md`:** de kjente svakhetene ved oppsettet, samlet med kilder. Det lukker punktet fra 2026-11-19 i `issues.md`.
- **PRD §10.1:** valget av leverandør er avgjort. Resultatene for begge promptene står der, og at ingen av SM-1–SM-3 er bestått med prompten i produksjonen. Den utdaterte setningen «SM-1 er ikke bestått ennå (par 3, 9 av 12)» er erstattet.
- **`kjorebok-2-4-del-c.md`:** ny statusboks og PR-liste (PR #29 er flettet, og avviksanalysen er til gjennomgang i PR #30).
  - Krysset av med kilde: at AK 2 står i sesjonsloggen (linje 594 i `993-…`).
  - Ikke krysset av: signaturene, PRD-punktet og `issues.md`, med begrunnelse.
- **`spec-2-4-velge-leverandor-ved-maaling.md`:** funnene fra gjennomgangen av del A er kontrollert mot koden.
  - To er rettet: standardmodellen og «minst».
  - Ett er delvis rettet: utgangskoden er 1 når alle kjøringene feiler, men årsaken per kjøring lagres ikke.
  - Ett er ikke gjort: antall krav mot fasiten og like krav.
- **`deferred-work.md`:** status på punktet om PRD-en.
- **`spec-2-4-c5-dokumentasjon-og-beslutningsark.md`:** spec-en for arbeidet.

**Ikke endret:** prompten, koden, testdataene, Vercel og API-nøklene. Ingen betalte kall. 2-4 står som `in-progress`.

## Legges til før avslutningen [AVGJØRES]

Når Sondre har svart på beslutningsarket:
- [ ] **Svarene** er ført inn i `beslutningsark-2-4-sondre.md` med navn og dato.
- [ ] **Veien for SM-1–SM-3** (spørsmål 2) er gjennomført:
  - **[AVGJØRES: a) godtatt som kjent svakhet / b) isolerende måling / c) retting av prompten / d) tilbake til `271edb4`]**
  - Ved b), c) eller d): egen spec og egen PR, betalte kall godkjent av Kevin, ny vurdering og ny B4-test.
- [ ] **PRD §10.1** er oppdatert med den endelige statusen for SM-1. C5-punktet om PRD-en er krysset av.
- [ ] **`TEMPERATUR`-kommentaren** i `src/lib/llm/felles.ts` er rettet. Det er en kodeendring som krever Kevins godkjenning.
- [ ] **Signert av Kevin og Sondre:**
  - avsnitt 7 i `vurdering-2-4-kontroll-temperatur-0.md`
  - avsnitt 5 i `vurdering-2-4-kontroll-ny-prompt.md`
- [ ] **Nøklene fra målingen** er slettet (Sondre hos OpenAI, Kevin hos Mistral) etter spørsmål 5. Det er krysset av i C5.
- [ ] **`issues.md` og sesjonsloggen** er oppdatert etter at PR #30 er flettet. *(2026-11-22: oppdatert etter flettingen på `story-2.4-c5-oppfolging`. Må oppdateres på nytt ved avslutningen.)*
- [ ] **`sprint-status.yaml`:** `2-4-velge-leverandor-ved-maaling` er satt til `done`. Det skjer først når alt over er gjort.

## Kontroll

- Bare filer under `_bmad-output/` er endret (`git diff --stat origin/main`). `src/`, `scripts/` og `testdata/` er uendret.
- Ingen av filene i PR #30 er endret:
  - `vurdering-2-4-kontroll-ny-prompt.md`
  - `pr-2-4-b4-resultat.md`
  - `spec-2-4-avvik-for-sondres-gjennomgang.md`
  - `.logs/kevin-heggdal/992-…`
  - `.logs/kevin-heggdal/issues.md`
- Påstandene om koden er sjekket mot `main` `50a7e36` (filer og linjer står i spec-en).
- Ingen hemmeligheter.

## Til Sondre

Les `beslutningsark-2-4-sondre.md`, og svar gjerne på spørsmål 1 og 2 først. De avgjør det meste av resten.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
