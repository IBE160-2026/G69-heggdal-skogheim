# Utkast: PR for story 2.4 del C, resultatet fra produksjonen (C3 og C4)

> **Utkast.** Tittelen og beskrivelsen under kopieres inn når PR-en opprettes. Grenen er `story-2.4-del-c-kontroll`, laget fra `main` `f5747f5`, med `main` `3e70acc` flettet inn (`f04f941`). Den er ikke bak `origin/main`.

**Tittel:** `Story 2.4 del C: resultatet fra produksjonen (C3 og C4) og en manuell vurdering av SM-4`

---

## Sammendrag

Denne PR-en dokumenterer at produksjonen er satt opp med OpenAI `gpt-4.1-mini` (C3) og kontrollert (C4), 2026-11-20, sammen med Sondre. Den inneholder **bare dokumentasjon**. Ingen kode, prompt eller fasit er endret.

> **Story 2.4 er ikke ferdig.** C5 står igjen. **SM-1 er IKKE bestått (9 av 12, par 3), og SM-4 er IKKE oppfylt.** Begge er åpne avvik. 2-4 står som `in-progress` i `sprint-status.yaml`.

## Fullført i denne PR-en

- **C3, Vercel** (Sondre, 2026-11-20):
  - `LLM_LEVERANDOR=openai`, `LLM_MODELL=gpt-4.1-mini` og `OPENAI_API_KEY` (Secret), bare i Production. Preview og Development har ingen variabler.
  - Redeploy er tatt.
  - Nøkkelen heter `produksjon-vercel-2` og oppbevares i en passordbehandler (Kevins beslutning).
- **Hendelse:** den første nøkkelen var lagt inn feil.
  - De to første forsøkene ga 502 på under 1 s. Sondre laget en ny nøkkel, slettet den gamle og tok en ny Redeploy.
  - Årsaken er ikke kontrollert i loggen i Vercel.
  - **Lærdom:** `/api/status` viser bare at en nøkkel finnes, ikke at den virker.
- **C4, gratis kontroller, bestått:**
  - `/api/status` gir `ekte`, OpenAI, USA, `tredjeland: true` og `arn1`.
  - Personvernboksen viser teksten om USA og EØS, og demobanneret er borte.
  - Siden genererer ingenting automatisk.
  - Preview står i `demo`.
- **C4, betalt kontroll, bestått:** par 2 ga HTTP 200 på 8,4 s, alle seks kategoriene stemmer med fasiten (1 O, 3 D, 2 M), og svaret var på bokmål (bekreftet av Kevin).
- **C4, forbruket, fullført med forbehold** (Sondre bekreftet, og Kevin godtok avviket):
  - Usage viser 54 kall, ca. 154 000 tokens og 0,09 USD for uka, **samlet for alle nøklene**.
  - Analysen kostet anslagsvis 0,002 USD.
  - Forbruket per nøkkel og per dag kan ikke leses i Usage. Tallene er forenlige innenfor avrundingen.
- **C2:** saldoen er ca. 4,91 USD. «Spend limit» på 100 USD er notert. Det harde taket er kreditten uten påfylling (NFR-3).
- **Vurderingen, avsnitt 7:** DPA-en gjelder fra 2026-01-01, og SCC-ene er fra 4. juni 2021 (Sondres logg).
- **SM-4, manuell vurdering (gratis), avsnitt 8 i vurderingen:**
  - Hentet ut: 67, 67, 69 og 92 % av de forventede nøkkelordene for par 1–4, og **74 %** til sammen. Målet er 80 %.
  - Treffprosenten i par 2 (25 % mot 11 % i fasiten) er forklart: fasitens tall er regnet fra fasitlisten, og beregningen er ikke feil.
  - SM-4 hører til story 5.1, og avviket er ført i `deferred-work.md`.
- **B4 del 1** (par 2 innen 30 s) er dekket av den betalte kontrollen i produksjonen.

## Det som gjenstår (ikke en del av denne PR-en)

Ingen av punktene under er markert som ferdige.

1. **SM-1, åpent avvik:** fasiten for «Gode samarbeidsevner» i par 3 (løsning 2, `beslutningsgrunnlag-2-4-fasit-par-3.md`). Kevin og Sondre avgjør.
2. **SM-4, åpent avvik til story 5.1 og epic 3 (ATS):** om prompten eller fasitlistene skal endres.
3. **B4 del 2:** par 1 med `testdata/robusthet/annonse-med-instruks.txt` (NFR-9). Krever ett betalt kall etter godkjenning. `kevin-maaling-2-4` beholdes til den er gjort, og slettes etterpå sammen med nøkkelen fra målingen hos Mistral.
4. **Før brukertesten i 2.8:** forbruket i produksjonen skal kunne leses for seg, for eksempel med et eget prosjekt i OpenAI. Sondre melder prosjektet, eieren og rettighetene for nøkkelen.
5. **C2:** Kevins beslutning om en egen grense for forbruket hos OpenAI.
6. **C5:**
   - avsnitt 5 og 7 i vurderingen signeres
   - PRD §10.1 merkes som løst
   - 2-4 settes til `done` først når AK 1–3 er oppfylt og SM-1 er avgjort
7. **Refleksjonsrapporten** (PRD §6): tredjelandsoverføringen og grunnlaget for den.

## Endrede filer

- `_bmad-output/implementation-artifacts/kjorebok-2-4-del-c.md`
- `_bmad-output/implementation-artifacts/sjekkliste-2-4-c3-sondre.md`
- `_bmad-output/implementation-artifacts/vurdering-2-4-kontroll-temperatur-0.md`: avsnitt 7, og nytt avsnitt 8
- `_bmad-output/implementation-artifacts/deferred-work.md`
- to spec-er: `spec-2-4-del-c-resultat-c3-c4-og-sm-4.md` og `spec-2-4-del-c-c4-forbruk-og-bokmaal.md`
- dette utkastet (`pr-2-4-del-c-kontroll.md`)
- sesjonsloggen og `.logs/kevin-heggdal/issues.md`

## Kontroller

Kjørt 2026-11-20 på grenen:
- `git diff --check`: rent
- `npm run lint` og `npm run typecheck`: grønne
- `npm test`: 896 av 896 (52 filer)
- Søk etter hemmeligheter i diffen: ingen treff. Ingen nøkler i dokumentene, bare navnene på dem.
- `git diff main...story-2.4-del-c-kontroll -- src` er tomt: ingen kodeendringer.

Gjennomgang etter BMAD: hver endring har en spec og en gjennomgang med Blind Hunter. Funnene og hvordan de er håndtert, står i spec-ene. Tallene for SM-4 er regnet ut på nytt av den som gikk gjennom.

## Slik kan endringen kontrolleres

- Les C3 og C4 i `kjorebok-2-4-del-c.md`.
- Les avsnitt 8 i `vurdering-2-4-kontroll-temperatur-0.md` mot `testsett-rapporter/2026-11-19-225914-openai-gpt-4.1-mini.md` og `testdata/par-*/fasit.md`.
- `npm run lint`, `npm run typecheck` og `npm test` skal være grønne.
