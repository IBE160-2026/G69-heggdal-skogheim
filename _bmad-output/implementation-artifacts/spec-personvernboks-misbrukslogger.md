---
title: 'Personvernboksen sier at leverandøren kan beholde teksten i opptil 30 dager for å oppdage misbruk'
type: 'feature'
created: '2026-11-24'
status: 'done'
route: 'dispatch'
review_loop_iteration: 0
baseline_commit: '49c677d24df9b539ec2277cce0296d8ffc435946'
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Personvernboksen sier «Ingenting lagres». Appen lagrer ingenting, og `store: false` hindrer at OpenAI lagrer svarene (PR #28). Men OpenAI kan beholde teksten i opptil 30 dager i logger for å oppdage misbruk, og det sier boksen ikke. Sondre har bestemt at brukeren skal få vite det (spørsmål 9 i `beslutningsark-2-4-sondre.md`, svar a, 2026-11-23).

**Approach:** Én kort setning i personvernboksen, og punktet om lagring skrives slik at det gjelder appen. Dokumentene som siterer teksten (PRD FR-5, EXPERIENCE.md og meldingene i testopplegget for brukertesten) oppdateres likt.

## Boundaries & Constraints

**Always:**
- Boksen har fortsatt tre punkter, og overskriften, ikonet og rollen er uendret (testene for FR-5 i `Personvernboks.test.tsx`).
- Teksten er naturlig bokmål (NFR-5) og like kort som de andre punktene.
- Testnavn starter med FR-5.

**Never:**
- Ingen endring i avkrysningen (`Personvernbekreftelse.tsx`), i `/api/status` eller i kontrakten `LeverandorInfo`.
- Ingen påstander om leverandøren utover lagringen for misbruk (for eksempel om trening av modeller).
- Ingen endring i `Forberedelse.tsx` utover det boksen selv viser.

**Beslutninger (Sondre, 2026-11-24):**
- Punkt 2 blir «Appen lagrer ingenting, og alt er borte når du lukker fanen. {Leverandør} kan likevel beholde teksten i opptil 30 dager for å oppdage misbruk.» Uten status (leverandøren er `null`) står «Språkmodellen» i stedet for navnet.
- Setningen gjelder alle leverandører, med leverandørens navn fra `/api/status`. Mistral beholder også API-trafikk i 30 dager for misbruk.

</frozen-after-approval>

## Code Map

- `src/components/Personvernboks.tsx:22-29` -- de tre punktene. Punkt 1 kommer fra `overforingstekst`, punkt 2 er fast tekst.
- `src/lib/okt/personvern.ts` -- `overforingstekst(leverandor)`. Her legges en ny ren funksjon for lagringspunktet, med `null` som gir den generelle teksten.
- `src/components/Personvernboks.test.tsx:28-40` -- testen låser punktene med `toContain` på hele `<li>`. `src/lib/okt/personvern.test.ts` -- enhetstestene for teksten.
- `_bmad-output/planning-artifacts/prds/prd-G69-heggdal-skogheim-2026-10-29/prd.md:145` -- FR-5, «Ingenting lagres etter økten».
- `_bmad-output/planning-artifacts/ux-designs/ux-G69-heggdal-skogheim-2026-10-30/EXPERIENCE.md:76` -- teksten i boksen ordrett.
- `_bmad-output/implementation-artifacts/brukertest-2-8-testopplegg.md:18` og `:101` -- «ingenting lagres» i meldingene til testpersonene.

## Tasks & Acceptance

**Execution:**
- [x] `src/lib/okt/personvern.ts` + `personvern.test.ts` -- ren funksjon for lagringspunktet, testet med leverandør og med `null` -- FR-5
- [x] `src/components/Personvernboks.tsx` + `Personvernboks.test.tsx` -- punkt 2 bruker funksjonen. Testene oppdateres til den nye teksten -- FR-5
- [x] PRD FR-5, `EXPERIENCE.md` l.76 og testopplegget -- samme ordlyd, med dato og henvisning til beslutningsarket -- sporbarhet

**Acceptance Criteria:**
- Given produksjonen med OpenAI, when forsiden vises, then sier personvernboksen at appen ikke lagrer noe, og at OpenAI kan beholde teksten i opptil 30 dager for å oppdage misbruk.
- Given `npm run lint`, `npm run typecheck`, `npm test` og `npm run build`, when de kjøres, then er alle grønne.

## Implementation Notes

- `lagringstekst(leverandor)` i `src/lib/okt/personvern.ts`, brukt i punkt 2 i `Personvernboks.tsx`. Testet med OpenAI, Mistral AI og `null`.
- Etter gjennomgangen er også `epics.md` (FR-5 og akseptansen for UX-DR3), `prd.md:34` og de åpne punktene i `kjorebok-2-4-del-b.md` oppdatert.
- Lint, typecheck, 923 tester (57 filer) og build er grønne, kjørt fra `C:\`.
- Den manuelle sjekken i forhåndsvisningen på Vercel (lys og mørk modus, mobilbredde) gjøres av Sondre før fletting.

## Spec Change Log

## Review Triage Log

| # | Source | Location | Finding | Verdict | Evidence | Route |
|---|--------|----------|---------|---------|----------|-------|
| 1 | blind + verification-gap + edge | epics.md:29, :228 | FR-5 and UX-DR3 acceptance still say «ingenting lagres» | low | Confirmed; direct text correction | patch |
| 2 | blind + edge | prd.md:34 | «ingenting lagres (NFR-1)» unqualified | low | Confirmed; direct correction to «appen lagrer ingenting» | patch |
| 3 | blind | testopplegg:22 | Note says «samme ordlyd» but messages say «Leverandøren av språkmodellen» | low | Confirmed; changed to «samme innhold» | patch |
| 4 | blind | kjorebok-2-4-del-b.md:456, :552 | Open items on provider retention not closed | low | Confirmed; note with decision added | patch |
| 5 | blind + edge | Personvernboks.tsx:24 | Demo mode names a provider that never receives text | low | Real, but bullet 1 already says «sendes til {leverandør}» in demo mode; pre-existing for the box as a whole | defer |
| 6 | blind | personvern.ts | Mistral 30-day retention unsourced | maybe-false | Settle by checking Mistral's terms or DPA for abuse-monitoring retention. Production uses OpenAI | defer |
| 7 | blind | personvern.ts | «Språkmodellen kan beholde» is imprecise (the provider keeps it) | low | Wording is a frozen decision; fix edits the spec | reject |
| 8 | blind | personvern.ts | 30 days hardcoded for all providers | low | Adds a per-provider field the spec rules out; both providers state 30 days | reject |
| 9 | blind + edge | personvern.ts:16 | Bullet longer than the others despite «like kort» | false | The frozen decision sets the exact text, which takes precedence | reject |
| 10 | edge | personvern.ts:14 | Empty `navn` gives no subject | false | `navn` comes from the fixed `LEVERANDORER` table in `pipeline/status.ts` | reject |
| 11 | blind | mockups/key-forberedelse.html:70, spec-1-2:34 | Old text in mockup and done spec | low | Historical artifacts, not the source for the box | reject |
| 12 | blind | prd.md FR-5 | «Opptil 30 dager» ignores legal holds | low | Standard wording from OpenAI; box stays short | reject |
| 13 | blind | spec | Done without evidence | false | Evidence recorded in Implementation Notes at step 5 | reject |
| 14 | blind | tests | Full sentence repeated in six assertions | low | Exact-text assertions are the project's FR-5 pattern | reject |
| 15 | blind | prd.md, EXPERIENCE.md | Inline change notes in requirement text | low | Same pattern as the PRD §7.3 dark-mode row | reject |

## Verification

**Commands:**
- `npm run lint`, `npm run typecheck`, `npm test`, `npm run build` -- expected: alle grønne

**Manual checks:**
- I forhåndsvisningen på Vercel: boksen viser den nye teksten på forsiden, i lys og mørk modus, uten at teksten brytes stygt på mobilbredde.
