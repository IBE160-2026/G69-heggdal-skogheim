---
title: 'Story 1.2: Forberedelsessiden med personvern og annonse'
type: 'feature'
created: '2026-11-04'
status: 'done'
baseline_commit: '20989157491249aa35d22d23186f3eb8ead4fec3'
route: 'dispatch'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-1-context.md'
  - '{project-root}/_bmad-output/planning-artifacts/ux-designs/ux-G69-heggdal-skogheim-2026-10-30/DESIGN.md'
  - '{project-root}/_bmad-output/planning-artifacts/ux-designs/ux-G69-heggdal-skogheim-2026-10-30/mockups/key-forberedelse.html'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Den publiserte appen viser bare banneret. Brukeren ser ikke hva som skjer med CV-en, og kan ikke legge inn annonsen.

**Approach:** Bygg forberedelsessiden med designtokenene, personvernboksen, annonsefeltet, avkrysningen og *Analyser* med årsaker, drevet av økt-tilstanden i `lib/okt`. CV-panelet får bare overskrift og en plassholderlinje, fordi innholdet kommer i story 1.3–1.5.

**Beslutninger (Sondre har godkjent på forhånd og delegert valgene):**
- Ved motstrid mellom `EXPERIENCE.md` («avkrysset og låst») og UX-DR7 gjelder UX-DR7 og akseptansekriteriene i `epics.md`: avkrysningen erstattes av tekst med ikon.
- Mens status lastes eller hvis den feiler, sier personvernboksen «CV-teksten sendes til en ekstern språkmodell.» Leverandør og land hardkodes aldri.
- CV-panelet har `h2` «CV» og linjen «Opplasting og innliming av CV-en kommer snart.» Årsaken «Last opp eller lim inn CV-en din.» står derfor alltid under *Analyser*.
- *Prøv med eksempel* (story 2.2) og live-regionen (story 1.3) bygges ikke her.
- Lengder måles etter `trim()`, både i teller og vilkår.

## Boundaries & Constraints

**Always:**
- Ordlyd og rekkefølge: `h1` «Se hva CV-en din dekker i en stillingsannonse», setningen «Last opp CV-en og lim inn annonsen. Du ser krav for krav hva du dekker, og får et utkast til søknadsbrev.», personvernboks, panelene, avkrysning, *Analyser*. Én `h1`, `header` og `main`; `h2` for «Om personvern», «CV» og «Stillingsannonse». DOM-rekkefølgen er lik den visuelle.
- Personvernboks: shadcn `Alert` med `ShieldCheck`, kan ikke lukkes. Tre punkter: «CV-teksten sendes til {navn} i {land}.» pluss «Det betyr at opplysningene overføres ut av EØS.» bare når `tredjeland` er sann; «Ingenting lagres. Alt er borte når du lukker fanen.»; «Du bør fjerne fødselsnummer, adresse, bilde og helseopplysninger før du analyserer.»
- Annonsefelt: etikett «Annonse», hjelpetekst «Lim inn hele annonsen», teller «{n} tegn (200–8 000)». Teksten kuttes aldri. Telleren er ikke live-region.
- Over 8 000 tegn: med en gang `aria-invalid="true"`, `destructive` på teller og kant, og «Annonsen er for lang. Maks 8 000 tegn.» via `aria-describedby`. Under 200 tegn (ikke tom): «Annonsen er for kort. Minst 200 tegn.» på samme måte, først etter at feltet er forlatt. Tomt felt viser ingen feil.
- *Analyser*: alltid fokuserbar, `aria-disabled="true"` og trykk gjør ingenting når vilkår mangler. Årsakene står i en liste via `aria-describedby`, i rekkefølgen CV, annonse, avkrysning: «Last opp eller lim inn CV-en din.», så «Lim inn annonsen.», «Annonsen må være minst 200 tegn.» eller «Annonsen kan være maks 8 000 tegn.», så «Kryss av for personvern.»
- Avkrysning: «Jeg har lest informasjonen om personvern.» erstattes etter avkrysning av «Du har bekreftet at du har lest informasjonen om personvern.» med ikon, og fokus flyttes til den teksten (`tabindex="-1"`). `okt.bekreftetPersonvern` gjelder resten av økten.
- Tokens (UX-DR1): alle farger, typografirollene og `content-max` fra `DESIGN.md` i `@theme`. Fokusring 2 px heltrukken med 2 px avstand, også på shadcn-komponentene. Ingen tekst med redusert opasitet, heller ikke på en deaktivert knapp. Geist Sans.
- Responsivt: panelene side om side fra 1024 px, stablet under. Ingen sidelengs rulling ned til 320 px (`overflow-wrap: anywhere`). Klikkflater minst 44 × 44 px under 1024 px, 24 × 24 px over.
- AD-2: komponenter importerer `lib/okt` og `lib/kontrakt`, aldri `lib/kjerne`. Status hentes bare i `OktProvider`.

**Never:**
- Ingenting til localStorage, sessionStorage, IndexedDB eller cookies. Ingen `fetch` utenfor `lib/okt`.
- Ingen `kjoring` eller `resultatdeler` ennå, ingen `/api/generer`, ingen `masker`.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Tom annonse | `''` eller bare mellomrom | Status `tom`, ingen feil i feltet, årsaken «Lim inn annonsen.» | N/A |
| Grense nede | 199 og 200 tegn | `for_kort`, så `ok` | N/A |
| Grense oppe | 8 000 og 8 001 tegn | `ok`, så `for_lang` | Teksten beholdes uendret |
| Kort, ikke forlatt | 50 tegn, `forlatt` usann | Ingen feilmelding i feltet, årsaken står under *Analyser* | N/A |
| Kort, forlatt | 50 tegn, `forlatt` sann | `aria-invalid`, melding via `aria-describedby` | N/A |
| Avkrysning | Handlingen `personvernBekreftet` | `bekreftetPersonvern` sann, årsaken borte | Kan ikke angres |
| Status demo | `statusHentet` med demo | `modus` og `leverandor` satt, banneret vises | N/A |
| Status feiler | `null` fra `hentStatus` | Ingen banner, generell tekst i personvernboksen | Appen kjører videre |
| EU-leverandør | `tredjeland: false` | Ingen setning om EØS | N/A |
| Tredjeland | `tredjeland: true` | Setningen om EØS vises | N/A |

</frozen-after-approval>

## Code Map

- `src/components/Demomodus.tsx` -- flyttes til `useOkt`; lokal `useState` og fetch fjernes (`deferred-work.md`).
- `src/lib/okt/status.ts` -- `hentStatus`, `erDemomodus` gjenbrukes.
- `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css` -- har banner og midlertidig tema fra story 1.1. `@custom-variant dark` beholdes, ellers slår `dark:`-klassene inn etter systeminnstilling.
- `src/lint-grenser.test.ts` -- importreglene. `src/lib/kjerne` har bare `.gitkeep`.
- `src/components/DemoBanner.test.tsx` -- mønster for tester uten jsdom (`renderToStaticMarkup`).
- `npx shadcn@4.23.0 add alert checkbox textarea label` -- `cn` kommer fra pakken `cn`.

## Tasks & Acceptance

**Execution:**
- [x] `src/lib/kontrakt/grenser.ts` -- `ANNONSE_MIN`, `ANNONSE_MAKS`, `CV_MAKS` -- delt med serveren i Epic 2.
- [x] `src/lib/kjerne/grenser.ts` + test -- `annonseStatus(tekst)`: `tom | for_kort | for_lang | ok`, `tegnAntall` -- FR-4.
- [x] `src/lib/okt/tilstand.ts` + test -- ren `reducer` og `startTilstand` med `okt` og `innhold.utkast`; handlingene `statusHentet`, `personvernBekreftet`, `annonseEndret`; `arsakerTilAnalyse(tilstand)` -- AD-6.
- [x] `src/lib/okt/OktProvider.tsx` -- context, `useOkt`, henter status én gang; `startTilstand` kan overstyres i tester.
- [x] `src/lib/okt/personvern.ts` + test -- `overforingstekst(leverandor | null)` -- FR-5.
- [x] `src/components/Personvernboks.tsx`, `Annonsepanel.tsx`, `CvPanel.tsx`, `Personvernbekreftelse.tsx`, `AnalyserKnapp.tsx`, `Forberedelse.tsx` + `*.test.tsx` -- flaten over, testet med `renderToStaticMarkup` og overstyrt tilstand.
- [x] `src/components/Demomodus.tsx`, `src/app/layout.tsx`, `src/app/page.tsx` -- `OktProvider` rundt alt, `Forberedelse` på siden, tittelen på siden i `metadata` beholdes.
- [x] `src/app/globals.css`, `src/components/ui/*` -- tokens, typografi, fokusring, knapp uten opasitet ved `aria-disabled`.
- [x] `src/repo-regler.test.ts` -- ingen `localStorage`, `sessionStorage`, `indexedDB` eller `document.cookie` i `src` -- NFR-1.

**Acceptance Criteria:**
- Given appen åpnet, when siden vises, then er rekkefølgen banner (i demomodus), tittel og setning, personvernboks, paneler, avkrysning, *Analyser*, med én `h1`.
- Given `/api/status` har svart, when personvernboksen vises, then står riktig leverandør og land fra svaret.
- Given avkrysning med tastatur, when den krysses av, then står bekreftelsesteksten med fokus på seg, og årsaken er borte.
- Given 320 px, 1024 px og 200 % zoom, when siden vises, then er det ingen sidelengs rulling, og panelene stables under 1024 px.
- Given økten, when siden brukes, then skrives ingenting til nettleserlagring eller cookies, og `/api/status` kalles én gang i produksjonsbygget.

## Implementation Notes

- `Alert` får `role="region"` i personvernboksen. shadcn sin `role="alert"` ville lest opp fast innhold som et varsel.
- Fokusringen er én regel i `@layer base` (`:focus-visible`). `outline-none`, `ring-*` og `opacity-*` er fjernet fra `components/ui/*`, og `repo-regler.test.ts` feiler om de kommer tilbake med nye shadcn-komponenter.
- `cn` i `lib/utils.ts` er laget med `createCn`, med typografirollene registrert som `font-size`. `components/ui/*` importerer den derfra. Nye shadcn-komponenter importerer `cn` fra pakken og må endres på samme måte.
- `annonseFeil` og `annonseVurdering` ligger i `lib/okt`, slik at komponentene ikke importerer `lib/kjerne`. `forlatt` er lokal tilstand i `Annonsepanel`.
- `forlatt` settes bare når feltet forlates med for kort tekst, og nullstilles når ny tekst ikke er for kort.
- Avkrysningen vises først når `leverandor` er kjent, så samtykket gjelder teksten med leverandør og land.
- Tallene bruker U+00A0 (`8 000`), så de ikke brytes over to linjer.
- Tester av handlinger, fokus og henting bruker `jsdom` og `@testing-library/react`, valgt per fil.
- *Analyser* har ingen handling ennå, heller ikke når vilkårene er oppfylt. Det kan ikke skje før story 1.3 gir CV-tekst.
- Typografi og `content-max` er i rem (24 px = 1.5rem), slik at de følger nettleserens skriftstørrelse.

## Spec Change Log

- Etter gjennomgangen, ikke loopback: avkrysningen for personvern vises først når leverandøren er kjent. Funn: brukeren kunne bekrefte informasjonen mens bare den generelle teksten sto der, og senere få opp setningen om EØS uten ny bekreftelse. Sondre har delegert slike valg. Beholdt: generell tekst i personvernboksen og ingen banner når status feiler.

## Review Triage Log

| Finding | Verdict | Evidence | Route |
|---------|---------|----------|-------|
| Consent possible before provider is known (blind, edge) | medium | Checkbox renders with `leverandor` null, so the EØS sentence can arrive after consent; FR-5 requires provider and country | patch, delegated decision |
| Handlers, focus and provider fetch never exercised (blind, gap) | medium | `renderToStaticMarkup` runs no effects or handlers; removing `onBlur`, `dispatch` or the effect keeps tests green | patch, adds jsdom |
| «For kort» can appear while typing (blind) | medium | Blur with `ok` sets `forlatt`; deleting down to 150 then shows the error with focus in the field, against the AC | patch |
| Counter not linked with `aria-describedby` (blind) | medium | `EXPERIENCE.md` Accessibility Floor requires it | patch, confirmed by grep |
| `letter-max` missing (blind) | low | UX-DR1 lists it; a direct addition | patch |
| Theme guard narrower than its note (blind, gap, edge) | low | Regex misses `aria-invalid:ring-3`; direct regex correction | patch |
| Browser restore gives text in an empty state (edge) | low | Firefox restores textareas on reload; `autoComplete="off"` is a direct fix | patch |
| `8 000` can wrap across lines (edge) | low | Ordinary space at 320 px; U+00A0 is a direct fix | patch |
| `cn` drops custom text sizes (blind) | low | Implementer confirmed for `text-label`; the next stories meet it | patch if `cn` can be configured, else defer |
| Layout and page composition untested (gap, blind) | medium | No test renders `layout.tsx`; a unit test needs font mocks, and it fits a first browser smoke test | defer |
| Too-long announcement has no owner (blind) | medium | UX-DR23 lists it; story 1.3 owns the live region, but its criteria only name masking | defer to story 1.3 |
| Demo mode names a provider though nothing is sent (blind) | low | Recorded architecture decision (memlog: demo shows the configured provider), and the banner explains the mode | rejected |
| Hardcoded limits in messages (blind) | low | FR-4 fixes the numbers, so divergence is unlikely; the fix adds helpers | rejected |
| Typography tokens tested by name only (blind) | low | Values match `DESIGN.md`; unlikely to drift, and the fix adds test code | rejected |
| Tracking files disagree; *Analyser* inert after 1.3 (blind) | low | Status is workflow state during review, and stories 1.6 and 2.3 add the action | rejected |
| `fetch` without timeout (edge) | low | Route answers at once; the browser ends a stuck request; the new line tells the user to reload | rejected |
| Empty `navn` or `land` (edge) | false | `lagStatus` only returns the fixed table | rejected |
| Emoji and zero-width counting (edge) | low | Negligible for pasted job ads; the fix adds complexity | rejected |
| Non-default disabled buttons look active (edge) | low | No caller today; story 2.6 is the first, recorded in `deferred-work.md` | rejected |

## Design Notes

Spec-en er på norsk av samme grunn som `spec-1-1-del-1`. Testene kjører uten jsdom, så tilstand og tekst ligger i rene funksjoner. Fokusflytting og fetch sjekkes i nettleser.

## Verification

**Commands:**
- `npm run lint && npm run typecheck && npm test && npm run build` -- alt består uten nøkkel.

**Manual checks (if no CLI):**
- `npm run start` og headless Edge: skjermbilder i 1280 px og smal bredde, og DOM-en har rekkefølgen, aria-attributtene og `lang="nb"`.
- Sondre tester med tastatur, i 320 px og med 200 % zoom. NVDA og VoiceOver tas i story 2.2 og 5.2.
