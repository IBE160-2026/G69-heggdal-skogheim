# PR-utkast: fjerne eksempelblokken fra gap-prompten (story 2.4)

> **Utkast, ikke opprettet.** Tittelen og beskrivelsen under kopieres inn når Kevin godkjenner commit, push og PR. Grenen er `story-2.4-fjerne-eksempelblokk`, laget fra `main` `7a029cb` og spolt fram til `7eb7300` (flettingen av PR #33).

**Tittel:** fix(gap): fjern eksempelblokken fra PR #28, behold reglene fra PR #27 og store: false (story 2.4)

## Beskrivelse

Sondres beslutning (spørsmål 2 i beslutningsarket, PR #33): eksempelblokken fra PR #28 fjernes, og reglene fra PR #27 og `store: false` beholdes. Testsettet og B4 kjøres én gang hver etter flettingen.

**Endret i `src`:**
- `src/lib/llm/prompter/gap.ts`: eksempelblokken (Nordlager AS) er fjernet. Det er 4 tekstlinjer og 1 tom linje, linje 22–26 i den gamle fila.
- `src/lib/llm/prompter/gap.test.ts`: de 7 testene som bare sjekket eksempelet, er fjernet.

**Ikke endret:**
- de to reglene fra PR #27 i prompten
- `.min(1)` i `src/lib/kontrakt/gap.ts`
- `store: false` i `src/lib/llm/openai.ts`, med testene i `openai.test.ts` og `adaptere.test.ts`
- testdata, fasiten, nøklene og personvernboksen

**Kontroll:**
- `git diff aeb3aca -- src/lib/llm/prompter/gap.ts src/lib/llm/prompter/gap.test.ts` er tom. Prompten og testene er identiske med PR #27 i git. På disken kan linjeskiftene være CRLF på grunn av `core.autocrlf`.
- `git diff --stat origin/main -- src` viser bare de to filene.
- Lint, typecheck, `npm test` (920 av 920, før 927) og `npm run build` er grønne.

**Dokumentasjon:**
- spec `spec-2-4-fjerne-eksempelblokken.md`
- § 7a i `kjorebok-2-4-del-b.md` og statusboksen i `kjorebok-2-4-del-c.md`
- `issues.md`, med oppdateringer etter Sondres svar på spørsmål 2, 3, 4, 5, 6, 8 og 9. Spørsmål 7 og 11 er Sondres egne punkter i `.logs/sondre-skogheim/issues.md` (PR #33).
- `kjente-svakheter-2-4.md`, oppsettet og B4
- epic-konteksten, kompilert på nytt etter PRD-endringen i PR #31

**Etter flettingen (krever godkjenning, ikke gjort):**
1. Sondre bekrefter at produksjonen kjører flettecommiten.
2. Testsettet én gang (høyst 12 kall) med `kevin-maaling-2-4` på flettecommiten, med ren arbeidskopi. Rapporten viser commiten.
3. Deretter B4 del 2 én gang i produksjonen med `par-1-butikk-bank/cv.txt` og `robusthet/annonse-med-instruks.txt`. Sjekk at den første linjen er «SOMMERVIKAR – KUNDEBEHANDLER» før du limer inn.
   - Kriteriene er de samme som i § 7a: alle seks kravene, AFR Mangler, ingen krav over fasiten, ingen påstand om AFR eller bankerfaring, instruksen ignorert og ordrette belegg.
   - `ugyldig_svar` betyr ikke bestått.
4. Sondre bekrefter at det ikke er kommet nye rader under Logs hos OpenAI (`store: false`).
5. Statuslinjene som sier «ikke flettet» eller «ikke gjort», oppdateres med resultatet: § 7a, boksen i del C, `kjente-svakheter-2-4.md` og `issues.md`.

**Én måling er ikke et bevis:** par 3 varierer mellom kjøringene, også med temperatur 0. Én kjøring med 12 kall kan derfor ikke alene skille effekten av eksempelblokken fra variasjonen mellom kjøringene.

**Avhengighet:** beslutningen står i PR #33 (`2b66889`), som Sondre flettet til `main` 2026-11-23 (`7eb7300`). Begrunnelsen ligger altså på `main`.

**Åpne spørsmål til Sondre, helst før flettingen (flettingen deployer prompten):**
- Hva gjør vi hvis B4 del 2 feiler uten eksempelet?
- Hvilken prompt blir i produksjonen hvis SM-1–SM-3 ikke blir 12 av 12, men B4 består?
- Spørsmål 6: Sondre skrev at README-forvekslingen ikke betyr noe for B4 lenger, fordi B4 er bestått i 3 kall. Alle de tre kallene brukte prompten med eksempelblokken. Holder svaret når eksempelet er fjernet?

**Tilbakerulling:** hent bare `gap.ts` og `gap.test.ts` tilbake fra `b50e34a` i en egen liten PR, godkjent av Kevin og Sondre. Det deployer prompten med eksempelet igjen. En revert av hele flettingen (`git revert -m 1`) ville også fjernet dokumentasjonen.

**Ikke med i denne PR-en:** `TEMPERATUR`-kommentaren i `src/lib/llm/felles.ts` (linje 17–22) er utdatert. Ifølge beslutningsarket skal den rettes når spørsmål 2 er avgjort. Det er en kodeendring som krever egen godkjenning.

**Testene for NFR-9 som er igjen:** avgrenserne og regelen om å ignorere instrukser (linje 28–62 i `gap.test.ts`), og de to reglene fra PR #27 (i tabellen over reglene). Det finnes ingen test som sjekker at eksempelet ikke kommer tilbake. Det er et bevisst valg, så testene forblir identiske med PR #27.

Story 2.4 står fortsatt som `in-progress`.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
