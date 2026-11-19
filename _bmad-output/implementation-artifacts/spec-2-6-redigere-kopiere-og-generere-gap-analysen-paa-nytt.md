---
title: 'Story 2.6: Redigere, kopiere og generere gap-analysen på nytt'
type: 'feature'
created: '2026-11-19'
status: 'done'
route: 'dispatch'
review_loop_iteration: 0
baseline_commit: 'dfa88233883e367e9d22a2d01f614bff3d0e4da7'
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-2-context.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Gap-analysen kan bare leses. Brukeren kan ikke rette tekst, kopiere resultatet eller lage analysen på nytt.

**Approach:** Kravtekst, «Hvorfor delvis» og «Råd» blir tekstfelt som lagrer i `redigert` mens brukeren skriver. En verktøylinje i fanen får *Kopier* (ren tekst i formatet fra EXPERIENCE.md, toast «Kopiert») og *Generer på nytt* (dialog hvis fanen er redigert). Fanemerket viser «· redigert».

## Boundaries & Constraints

**Always:**
- `redigert` har samme form som `generert` og settes ved første endring (kopi av `generert` med endringen). Visning og kopiering bruker `redigert ?? generert` (AD-6).
- Kategori, belegg, treffprosent, nøkkelord og `nedgradert` er låst og endres aldri av redigering (FR-18). Det faste rådet for nedgraderte krav er tekst fra koden og kan ikke redigeres.
- Tekstfeltene har synlige etiketter («Krav», «Hvorfor delvis», «Råd»), vokser med innholdet, og Enter sender ingenting. Det finnes ingen *Lagre*-knapp.
- *Generer på nytt* kaller `startGenerering("gap")` for samme `kjoring` (FR-19). Er `redigert !== null`, vises først dialogen fra EXPERIENCE l.100 med `{fanenavn}` = «Gap-analyse og nøkkelord», *Avbryt* (fokus ved åpning) og *Lag ny*. Fokus går tilbake til knappen.
- Under generering har begge knappene `aria-disabled="true"` og beholder fokus. De er ikke `disabled`.
- Toast bare for kopiering (shadcn `sonner`), øverst, uten knapper. Live-regionen sier «Kopiert.» ved vellykket kopiering. Feil vises fortsatt aldri som toast.
- Testnavn starter med FR-, NFR-, UX-DR-, AD- eller SM-ID.

**Beslutninger (Sondre, 2026-11-19):** Story-fila holdes samlet selv om den er over 1 600 tokens. Toast øverst på midten på alle skjermstørrelser. Det faste rådet kan ikke redigeres. Skjelett under ny generering, og ingen verktøylinje i feiltilstand.

**Never:**
- Ingen *Endre CV-tekst*, *Ny analyse* eller utdatert-banner (2.7 og epic 3). Ingen nye API-endringer.
- Redigeringer sendes aldri til serveren, og de lagres ikke i nettleseren.
- Ingen andre faner.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Redigere | skriver i «Krav» på krav 3 | `redigert` er en kopi med ny tekst på krav 3, resten likt. Fanemerket viser «· redigert» | N/A |
| Låste felt | redigert analyse | Kategori, belegg, treffprosent og nøkkelord er som i `generert` | N/A |
| Kopier | ferdig analyse, med eller uten redigering | Utklippstavlen får ren tekst fra `redigert ?? generert`, toast «Kopiert», live «Kopiert.» | N/A |
| Kopiering feiler | `clipboard.writeText` avvises eller mangler | Toast «Kunne ikke kopiere. Merk teksten og kopier selv.», ingen live-melding | N/A |
| Generer på nytt, ikke redigert | `redigert === null` | Ingen dialog, én ny POST med samme body, `gapVersjon` øker | Feil vises som i 2.5 |
| Generer på nytt, redigert | `redigert !== null` | Dialog. *Avbryt* lukker og beholder redigeringen. *Lag ny* gir én ny POST, og svaret erstatter både `generert` og `redigert` | N/A |
| Under generering | gap `genererer` | Begge knappene `aria-disabled="true"`, klikk gjør ingenting | N/A |
| Demomodus | demoeksempelet | *Generer på nytt* viser det lagrede svaret igjen, uten kall til språkmodellen (FR-24) | N/A |

</frozen-after-approval>

## Code Map

- `src/components/GapAnalyseFane.tsx:225-264, 270-290, 380-401` -- `Tekstdel`, `Kravkort` og `Kravgrupper`. `Kravgrupper` bruker indeksen i gruppen (`key={nr}`). En redigering trenger kravets indeks i `analyse.krav`, så send den med.
- `src/components/Resultat.tsx:83-105` -- `TabsTrigger` (legg til «· redigert», også lest opp) og `TabsContent`. Verktøylinjen hører til fanen.
- `src/lib/okt/tilstand.ts` -- `ResultatdelTilstand`, `reducer` og den private `kunngjor()`. Legg til handlingene `kravRedigert { indeks, felt: "tekst" | "forklaring" | "raad", verdi }` og en for live-meldingen «Kopiert.». `genereringStartet` nullstiller allerede `generert` og `redigert`, så skjelettet vises under ny generering.
- `src/lib/okt/OktProvider.tsx:69-104` -- `startGenerering` har ingen vakt på status og kan kalles når analysen er `ferdig`. Ingen endring trengs.
- `src/components/ProvEksempelKnapp.tsx` -- mønsteret for `AlertDialog` (kontrollert `open`, `onCloseAutoFocus`). Gjenbruk det til dialogen.
- `src/components/ui/textarea.tsx` -- har allerede `field-sizing-content`. Bruk `Label htmlFor`.
- `src/components/ui/` -- legg til `sonner` med `npx shadcn@4.23.0 add sonner`. Klassene i `FORBUDT_I_UI` i `src/repo-regler.test.ts` er ikke lov. `<Toaster position="top-center" />` monteres i `src/app/layout.tsx`.
- `_bmad-output/planning-artifacts/ux-designs/ux-G69-heggdal-skogheim-2026-10-30/EXPERIENCE.md` l.85-92, 97, 100, 139, 186 og DESIGN.md l.179, 183 -- tekster, ikoner (`Copy`, `RefreshCw`) og at *Kopier* er primærknappen.

## Tasks & Acceptance

**Execution:**
- [x] `src/lib/okt/tilstand.ts` + test -- `kravRedigert` og live-meldingen «Kopiert.» -- AD-6, FR-18
- [x] `src/components/gapTekst.ts` + test -- `gapSomTekst(analyse)` gir kopiformatet -- FR-20
- [x] `src/components/ui/sonner.tsx`, `src/app/layout.tsx` -- toasten -- UX-DR11
- [x] `src/components/GapVerktoylinje.tsx` + test -- *Kopier*, *Generer på nytt* og dialogen -- FR-19, FR-20, UX-DR11, UX-DR18
- [x] `src/components/GapAnalyseFane.tsx`, `Resultat.tsx` + tester -- tekstfeltene, verktøylinjen og «· redigert» -- FR-18, UX-DR10
- [x] `src/components/Resultat.test.tsx` -- i demomodus gir *Generer på nytt* demosvaret på nytt, og fetch går bare til vår egen rute -- FR-24

**Acceptance Criteria:**
- Given en redigert analyse, when den kopieres, then står de redigerte tekstene i utklippstavlen, mens kategori, belegg, treffprosent og nøkkelord er de originale.
- Given verktøylinjen, when den vises, then har *Kopier* ikonet `Copy` og er primærknappen, og *Generer på nytt* har `RefreshCw`. Begge brytes over to linjer under 640 px.
- Given `npm run lint`, `npm run typecheck`, `npm test` og `npm run build`, when de kjøres, then er alle grønne.

## Implementation Notes

- `next-themes`, som `shadcn add sonner` la til, er fjernet. Appen har bare lyst tema, så `Toaster` bruker `theme="light"` (ellers ville toasten blitt mørk med mørkt OS-tema). Ikonene i `sonner.tsx` har fått `aria-hidden`.
- Sonner har sin egen `aria-live`-region (`<section aria-label="Varsler">`). `layout.test.tsx` sjekker nå at det finnes nøyaktig én egen live-region (`div`) pluss toast-regionen. En skjermleser kan derfor lese både «Kopiert» (toast) og «Kopiert.» (live-regionen).
- Verktøylinjen vises også under første generering (med `aria-disabled`), siden tilstanden ikke skiller første og ny generering.
- «Hvorfor delvis» og «Råd» vises som felt også når teksten er tom, så feltet ikke forsvinner når brukeren tømmer det.
- Testene må kjøres fra `C:\…` med stor stasjonsbokstav. Fra `c:\…` feiler alle Vitest-filer med «Cannot read properties of undefined (reading 'config')», også på baseline.

## Spec Change Log

## Review Triage Log

| # | Source | Location | Finding | Verdict | Evidence | Route |
|---|--------|----------|---------|---------|----------|-------|
| 1 | verification-gap | GapAnalyseFane.test.tsx | Edits to «Hvorfor delvis» / «Råd» never exercised through the UI | medium | Pre-verified: only `krav-N-tekst` gets a change event in component tests; wiring to the wrong `felt` would pass | patch |
| 2 | blind | GapVerktoylinje.tsx kopier | Success announced twice (toast + live region) | low | Real, but both channels are required by the frozen intent; fix edits the spec. Check in NVDA/VoiceOver (5.2) | reject |
| 3 | blind | GapVerktoylinje.tsx kopier | Failure toast uses plain `toast()`, looks identical to success | low | Confirmed; `toast.error` is a direct correction and uses the error icon already in `ui/sonner.tsx` | patch |
| 4 | blind | tilstand.ts genereringStartet | Failed regeneration discards the previous analysis | medium | Real: `genereringStartet` (pre-existing, story 2.2) nulls `generert`/`redigert`; on error only *Prøv igjen* remains. CV and ad are kept. Pre-existing reducer design | defer |
| 5 | blind+edge | tilstand.ts medRedigering | «· redigert» stays after typing the original text back | low | Real, rare in practice; fix adds a deep comparison branch | reject |
| 6 | blind | GapAnalyseFane.tsx Kravkort | Every card's fields share the names «Krav» / «Hvorfor delvis» / «Råd» | medium | Confirmed: labels have no requirement context, screen-reader users hear «Krav, Krav, Krav». Visually hidden number in the label is a trivial fix | patch |
| 7 | blind+edge | gapTekst.ts / GapAnalyseFane.tsx / test | Fixed advice text duplicated in three places | low | Confirmed; screen and copy text can drift. Test can import `FAST_RAAD` and compare with rendered `FastRaad` | patch |
| 8 | blind | GapVerktoylinje.tsx dialog title | «Lage nytt Gap-analyse og nøkkelord?» ungrammatical | low | Text is the EXPERIENCE l.100 template the frozen intent mandates; fix edits the spec | reject |
| 9 | blind+edge | gapTekst.ts kravSomTekst | Untrimmed values copied; empty krav gives « — Oppfylt» | low | Confirmed; trimming is a direct correction. Empty-text placeholder rejected (adds branch, rare) | patch |
| 10 | blind | gapTekst.ts | Copy text has no job title heading | false | Spec's copy format has no heading by design | reject |
| 11 | blind | package.json | `sonner` uses a caret | false | `lucide-react`, `radix-ui`, `class-variance-authority` also use carets; no single pinning rule | reject |
| 12 | blind | ui/sonner.tsx | Unused `cn-toast` class, style nits | low | Generated shadcn file; cosmetic | reject |
| 13 | blind+edge | GapVerktoylinje.test.tsx | Busy test covers only `genererer` | low | `opptatt` is one expression; extra case adds little | reject |
| 14 | blind | Resultat.tsx | `FANENAVN_GAP` lives in toolbar module | false | No named harm; a string import | reject |
| 15 | edge | tilstand.ts medRedigering | forklaring/raad accepted for non-matching category | false | UI renders those fields only for the matching category; unreachable | reject |
| 16 | edge | GapVerktoylinje.tsx kopier | Clipboard resolves after a new generation started | low | Requires regenerate during a pending clipboard write; very rare, fix adds a ref guard | reject |
| 17 | edge | GapVerktoylinje.tsx kopier | Repeated clicks overlap writeText | low | Harmless duplicate toasts; fix adds state | reject |
| 18 | edge | GapVerktoylinje.tsx dialog | Status leaves `ferdig` while dialog open | false | Modal dialog blocks all other triggers of `startGenerering("gap")` | reject |

## Design Notes

- **Kopiformat** (ren tekst, krav i annonsens rekkefølge, en tom linje mellom kravene):
  ```
  Kundeorientert og trives med å hjelpe andre — Oppfylt
  Fra CV-en: «Hjalp kunder med å finne varer og svarte på spørsmål»

  Gode digitale ferdigheter — Delvis oppfylt
  Fra CV-en: «…»
  Hvorfor delvis: Du bruker Office …

  Treff: 22 % (veiledende)
  Funnet i CV-en: pålitelig, økonomi
  Ikke funnet: kundeorientert, …
  ```
  - For Mangler står «Råd: …». For et nedgradert krav står det faste rådet som ren tekst, uten markering.
  - En tom forklaring eller et tomt råd tas ikke med.
- **Toast:** `top-center` på alle skjermstørrelser. EXPERIENCE.md krever øverst på mobil og sier ingenting om skrivebord, og én plassering er enklest.
- **Under ny generering:** skjelettet vises som ved første generering, siden `genereringStartet` tømmer analysen. Verktøylinjen står over skjelettet med begge knappene `aria-disabled`.
- **Feiltilstand:** verktøylinjen vises ikke. `Alert` fra 2.5 har *Prøv igjen*.

## Verification

**Commands:**
- `npm run lint`, `npm run typecheck`, `npm test`, `npm run build` -- expected: alle grønne

**Manual checks (if no CLI):**
- I nettleseren: rediger et krav, trykk *Kopier* og lim inn i en tekstfil. Sjekk at *Generer på nytt* viser dialogen, og at alt virker med tastatur alene.
