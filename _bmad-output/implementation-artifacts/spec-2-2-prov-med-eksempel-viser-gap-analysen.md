---
title: 'Story 2.2: Prøv med eksempel viser gap-analysen'
type: 'feature'
created: '2026-11-18'
status: 'done'
baseline_commit: 'e53480d139e94dea8187340f34f34b3df5f1ab53'
route: 'dispatch'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-2-context.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** API-et fra 2.1 gir en kontrollert gap-analyse, men ingenting i appen kan starte den eller vise den. En sensor eller jobbsøker kan ikke se hva appen gjør uten en API-nøkkel.

**Approach:** Økt-tilstanden får `kjoring`, `resultatdeler` og `startGenerering`, med én fetch-innpakning i `lib/okt`. *Prøv med eksempel* fyller inn demoeksempelet og åpner en resultatvisning med fanen *Gap-analyse og nøkkelord*. Fanen viser lasting, oppsummering, kravkort med belegg, treffprosent og nøkkelord, alt etter EXPERIENCE.md og DESIGN.md.

**Beslutninger (Sondre, 2026-11-18):**
- Story-fila holdes samlet (ca. 3 000 tokens).
- Til 2.7 har resultatvisningen en midlertidig knapp «Tilbake» som tømmer `kjoring` og `resultatdeler` og viser forberedelsen med teksten beholdt. Fokus går til *Analyser*. 2.7 erstatter den med *Endre CV-tekst*.
- Test med NVDA og VoiceOver flyttes til story 5.2. Tastatur, 320 px og 200 % tekstzoom testes før fletting.

## Boundaries & Constraints

**Always:**
- Bare `startGenerering(resultatdel)` i `lib/okt` sender requester. Den har vakt mot dobbeltstart (også i StrictMode) og en egen `AbortController`. Svar for en utdatert `kjoring.id` eller `gapVersjon` forkastes (AD-6).
- Fetch-innpakningen gjør om `{ feil: { kode } }`, 504, nettverksfeil og svar som ikke er JSON, til en `feilkode` (AD-8). Et svar som ikke passer `gapAnalyse`, blir `ugyldig_svar`.
- `kjoring.cvTekst` er maskert. Body er `{ cvTekst, annonse, demo: erEksempel }`.
- *Prøv med eksempel* krever ikke avkrysning for personvern, og fungerer i begge modi.
- All tekst fra API-et vises som ren tekst. Mikroteksten er nøyaktig som i EXPERIENCE.md og DESIGN.md.
- Testnavn starter med FR-, NFR-, UX-DR- eller AD-ID.

**Never:**
- Ingen redigering, *Kopier*, *Generer på nytt* eller utdatert-banner (2.6). Ingen *Endre CV-tekst*, *Ny analyse* eller «Valg»-meny (2.7). Ingen *Prøv igjen*-knapp eller full meldingstabell (2.5).
- Ingen ekte generering med egen CV (2.3). *Analyser* starter bare en kjøring når `erDemoeksempel` er sann.
- Ingen faner for brev, CV-forbedringer eller ATS.
- Ingen ny rute og ingen lagring i nettleseren. Endre ikke `lib/kjerne`, `lib/llm`, `lib/pipeline` eller API-et.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Eksempel med tomme felt | begge felt tomme, demo- eller ekte modus | Demoteksten fylles inn, `kjoring` med `erEksempel: true`, resultatvisningen åpnes, fokus på «Resultat», én POST til `/api/generer/gap` | N/A |
| Eksempel med innhold | et felt har tekst | Dialogen «Erstatte teksten din med eksempelet?» med fokus på *Avbryt*. *Avbryt* lukker og gir fokus tilbake til knappen, *Bruk eksempelet* gjør som over | N/A |
| Fra demovarselet | `demoVarsel` vises | Knappen *Prøv med eksempel* i varselet gjør som over (med dialog, siden feltene har innhold) | N/A |
| *Analyser* med demoteksten | felt lik demoeksempelet | Som eksempel med tomme felt, uten dialog | N/A |
| Laster | gap `genererer` | Skjelettkort (`aria-hidden`), «Leser annonsen og sammenligner med CV-en …», `aria-busy="true"` på fanepanelet, live «Analyserer. Dette tar inntil 30 sekunder.» | N/A |
| Ferdig | demosvaret | «Du dekker 3 av 6 krav. 2 er delvis oppfylt.», grupper i rekkefølge, belegg, 22 %, nøkkelord, live «Gap-analysen er klar. 3 av 6 krav er oppfylt.» | N/A |
| Nedgradert krav | `nedgradert: true` | Merket «Nedgradert: fant ikke belegg i CV-en» og det faste rådet, ingen belegg og ikke modellens `raad` | N/A |
| StrictMode | effekter kjøres to ganger | Én fetch | N/A |
| Utdatert svar | svar for gammel `kjoring.id` | Forkastes | N/A |
| Feil | `{ feil: { kode } }`, 504, nettverk, ikke JSON, ugyldig form | gap `feil` med `feilkode`, `Alert role="alert"` i fanen | Melding etter tabellen i Design Notes |

</frozen-after-approval>

## Code Map

- `src/lib/okt/tilstand.ts` -- `OktTilstand`, `OktHandling`, `reducer`, `analyser()` (l.123), `kunngjor()`, `maskerCv()`. Utvid `innhold` med `kjoring`, `resultatdeler` og `gapVersjon` etter AD-6. Gjenbruk `kunngjor` til live-meldingene.
- `src/lib/okt/OktProvider.tsx` -- `useReducer` og `useOkt()`. Her hører `startGenerering` hjemme, og effekten som starter gap når `kjoring` er ny.
- `src/lib/okt/status.ts` -- `hentStatus()` er mønsteret for fetch og zod.
- `src/lib/kontrakt/gap.ts`, `feil.ts`, `generer.ts`, `demo.ts` -- `gapAnalyse`, `feilSvar`, `Feilkode`, `DEMO_CV`, `DEMO_ANNONSE`.
- `src/lib/kjerne/demo.ts`, `masker.ts` -- `erDemoeksempel`, `masker`. `lib/okt` kan importere kjerne, komponentene kan ikke (ESLint).
- `src/app/page.tsx` -- viser `<Forberedelse/>`. Bytt til resultatvisningen når `innhold.kjoring` finnes.
- `src/components/Forberedelse.tsx` -- overskriften får *Prøv med eksempel* (EXPERIENCE l.36).
- `src/components/AnalyserKnapp.tsx:34-46` -- demovarselet. Legg *Prøv med eksempel* inn i varselet (EXPERIENCE l.126).
- `src/components/Kunngjoring.tsx` -- den eneste live-regionen. Ikke lag en ny.
- `src/components/ui/` -- har bare alert, button, checkbox, label og textarea. Legg til shadcn `tabs`, `alert-dialog` og `skeleton` med `npx shadcn@4.23.0 add` (stil `radix-nova`, pakken `radix-ui`).
- `src/app/globals.css:39-46, 97-104` -- fargene for oppfylt, delvis, mangler og belegg, `--text-hit-rate`, `--container-content-max`.
- `_bmad-output/planning-artifacts/ux-designs/ux-G69-heggdal-skogheim-2026-10-30/` -- EXPERIENCE.md (l.41-45, 82, 87-91, 102, 114, 139-153, 174-175), DESIGN.md (l.179-190) og `mockups/key-resultat-gap.html` som visuell fasit.
- `src/components/AnalyserKnapp.test.tsx` -- mønster for komponenttester: `// @vitest-environment jsdom`, `OktProvider`, fetch mocket med `vi`.

## Tasks & Acceptance

**Execution:**
- [x] `src/lib/okt/tilstand.ts` + test -- `kjoring`, `resultatdeler.gap`, `gapVersjon`, handlingene `eksempelValgt`, `genereringStartet`, `genereringFerdig` og `genereringFeilet`, og `analyser()` som setter `kjoring` for demoeksempelet -- AD-6
- [x] `src/lib/okt/generer.ts` + test -- fetch-innpakningen `hentGenerering(resultatdel, body, signal)` gir `{ ok: true, data }` eller `{ ok: false, feilkode }`, og avbrudd forkastes -- AD-8
- [x] `src/lib/okt/OktProvider.tsx` + test -- `startGenerering` i `useOkt()`, vakt, `AbortController` og effekten som starter gap -- AD-6
- [x] `src/components/ui/{tabs,alert-dialog,skeleton}.tsx` -- shadcn -- UX-DR10, UX-DR18, UX-DR19
- [x] `src/components/ProvEksempelKnapp.tsx` + test -- knappen og dialogen, brukt i overskriften og i demovarselet -- FR-25, UX-DR18
- [x] `src/components/Resultat.tsx` + test, `src/app/page.tsx` -- topplinje med «Resultat» (`h1`, `tabIndex=-1`, fokus ved åpning), stilling og arbeidsgiver eller skjelett, den midlertidige knappen «Tilbake», `Tabs` med `activationMode="manual"` og én fane -- UX-DR9, UX-DR10, UX-DR24
- [x] `src/components/GapAnalyseFane.tsx` + test -- lasting, feil, oppsummering med kategorimerker, kravgrupper, kravkort, belegg-figur, nedgradert, treffmåler og nøkkelord -- FR-7, FR-8, FR-10, FR-11, FR-12, FR-13, UX-DR12–15, UX-DR19

**Acceptance Criteria:**
- Given demosvaret, when fanen er ferdig, then er kravkortene gruppert Oppfylt, Delvis oppfylt, Mangler i annonsens rekkefølge, tomme grupper er skjult, merkene viser 0 for tomme grupper og lenker ellers til gruppeoverskriften (`tabIndex=-1`), som får fokus.
- Given et krav, when det vises, then har det belegg som `figure` med `figcaption` «Fra CV-en» og teksten i «», forklaringen for Delvis oppfylt eller rådet for Mangler, og ingenting kan redigeres.
- Given treffprosenten, when den vises, then står tallet fra koden, «veiledende treff, ikke en ATS-score», en dekorativ linje med `aria-hidden` og hint-teksten fra mockupen, og nøkkelordene i «Funnet i CV-en» og «Ikke funnet».
- Given `npm run lint`, `npm run typecheck`, `npm test` og `npm run build`, when de kjøres, then er alle grønne.

## Implementation Notes

## Spec Change Log

## Review Triage Log

| # | Layer | Finding | Verdict | Route | Evidence |
|---|-------|---------|---------|-------|----------|
| 1 | verification-gap | *Analyser* with demo text in ekte modus starts a kjøring, untested | low | patch | All demo-text *Analyser* tests run in demo modus; reordering the checks in 2.3 would pass silently. |
| 2 | blind | Diff omits story artifacts | false | reject | Diff deliberately limited to `src`. |
| 3 | blind | Run id derived from `gapVersjon` can repeat | false | reject | A repeated id only happens when the earlier run never sent a request; `gjelder()` also checks `gapVersjon`. |
| 4 | blind | No client-side timeout | low | reject | `maxDuration = 60` gives a platform 504, which maps to `llm_tidsavbrudd`; a hang with no response is unlikely, and the fix adds a timer path. Revisit in 2.5. |
| 5 | blind, edge | `demo_krever_nokkel` and input-error codes show the llm_feil text | false | reject | Design Notes route unknown codes to that text until 2.5; the client only sends the demo text, so these codes are unreachable in 2.2. |
| 6 | blind, edge | Live region keeps «Analyserer …» after error or *Tilbake* | low | patch | `kunngjor(…, [null])` keeps the previous announcement; direct fix. |
| 7 | blind | No dialog while a CV file is being read | low | patch | `harInnhold` ignores `cvFil`, so an upload in progress is dropped without a question. |
| 8 | blind, edge | Empty `krav`/`nokkelord`, or `ferdig` with no data, has no fallback | low | reject | `ferdig` always carries data; empty lists only come from the real model (2.3). |
| 9 | blind | `sist` ref updated in an effect | false | reject | Generations start from the provider effect after commit; calling right after `dispatch` would see old state with any approach. |
| 10 | blind, edge | No abort on provider unmount | false | reject | The provider sits in the root layout and never unmounts; documented in the code. |
| 11 | blind | *Tilbake* only UI-tested after success | low | patch | Focus and kept text on the loading path are unchecked. |
| 12 | blind | Tests click without awaiting the fetch | low | patch | Pending fetch may resolve after cleanup; direct fix. |
| 13 | blind | Index keys on lists | false | reject | Lists are static in 2.2; editing arrives in 2.6. |
| 14 | blind | `INNHOLD` exported from a page component | low | reject | Cosmetic coupling; no behaviour impact. |
| 15 | blind | Hit bar trusts `treffprosent` | false | reject | `gapAnalyse` limits it to 0–100 and the client validates the response. |
| 16 | blind | Missing heading level in the tab panel | false | reject | Outline is h1 «Resultat» → h2 stilling → h3 groups; no h3 renders without the h2. |

## Design Notes

- **Visning uten ny rute:** `page.tsx` viser resultatet når `innhold.kjoring` finnes. Ingenting lagres, så en ny innlasting gir forberedelsen.
- **Det faste rådet (FR-10, UX-DR13):** «Fant ikke belegg for dette i CV-teksten. Har du denne erfaringen, trykk *Endre CV-tekst* og legg den inn.» Konstant i komponenten, ikke i kontrakten.
- **Feilmeldinger til 2.5:** `llm_feil`, `llm_tidsavbrudd` og ukjente koder gir «Språkmodellen svarte ikke. Teksten din er tatt vare på. Prøv igjen.», `ugyldig_svar` gir «Svaret fra språkmodellen kunne ikke brukes. Prøv igjen.», og `grense_naadd` gir teksten fra EXPERIENCE l.120. 2.5 lager hele tabellen og *Prøv igjen*.
- **Hint ved treffprosenten (FR-13):** «X av Y nøkkelord fra annonsen finnes i CV-teksten. Legg bare til nøkkelord som CV-en har dekning for.»
- **Dialogen:** vises når et felt har tekst etter `trim`, eller når `kjoring` finnes. *Bruk eksempelet* fjerner også `cvFil` og `demoVarsel`.
- **Ikoner:** Oppfylt `CircleCheck`, Delvis `CircleDashed`, Mangler `Circle`, nedgradert `Info`, funnet nøkkelord `Check` (lucide). Ingen puls i skjelettet ved `prefers-reduced-motion`.

## Verification

**Commands:**
- `npm run lint`, `npm run typecheck`, `npm test`, `npm run build` -- expected: alle grønne

**Manual checks (if no CLI):**
- `npm run build` og `npm start`: *Prøv med eksempel* viser gap-analysen med 22 %. Tastatur alene, 320 px og 200 % tekstzoom fungerer.
