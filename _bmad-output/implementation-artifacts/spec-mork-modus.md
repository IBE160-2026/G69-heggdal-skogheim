---
title: 'Mørk modus som følger maskinen, med en bryter som ikke lagrer noe'
type: 'feature'
created: '2026-11-20'
status: 'done'
route: 'dispatch'
review_loop_iteration: 0
baseline_commit: '55759e9f7698ef33b96e7998f391e935cbb4c9fd'
context:
  - '{project-root}/_bmad-output/planning-artifacts/ux-designs/ux-G69-heggdal-skogheim-2026-10-30/DESIGN.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Appen har bare lyst tema. Sondre vil ha et mørkere og mer profesjonelt uttrykk som valg (beslutning 2026-11-20). Mørk modus står ikke i PRD-en eller epics, så dette er et tillegg til planen.

**Approach:** Appen følger innstillingen på maskinen (`prefers-color-scheme`) fra første tegning. En bryter øverst til høyre bytter mellom lys og mørk for denne fanen. Ingenting lagres, så løftet «Ingenting lagres» (FR-5, NFR-1) holder. Alle farger får mørke verdier som oppfyller WCAG AA.

## Boundaries & Constraints

**Always:**
- Ingen `localStorage`, `sessionStorage`, `indexedDB` eller cookies (testen NFR-1 i `repo-regler.test.ts`). Valget gjelder til fanen lukkes eller lastes på nytt.
- Uten valg følger appen maskinen, også hvis den endres mens fanen er åpen. Etter et valg gjelder valget.
- Ingen hvit blink: klassen `dark` settes på `<html>` av et lite innebygd skript i `<head>` før første tegning. `<html>` får `suppressHydrationWarning`.
- Bryteren er en vanlig `button` med `aria-pressed` (sann i mørk modus), synlig etikett for skjermleser «Mørk modus», ikonet `Moon` i lys og `Sun` i mørk (`aria-hidden`), minst 44 × 44 px under 1024 px. Ingen ny `aria-live`-region og ingen kunngjøring.
- Linjene i `:root` i `globals.css` er uendret. Den mørke paletten står i `.dark` og dekker alle egne tokens (tabellen i Design Notes). Hvert tekstpar ≥ 4,5:1, kanter og fokus ≥ 3:1.
- Toasten følger temaet.
- Testnavn starter med NFR-, UX-DR- eller FR-ID.

**Beslutninger (Sondre, 2026-11-20):** Følge maskinen, bryter som ikke lagrer noe (anbefalt alternativ). Bryteren i egen rad over innholdet, ikke i toppfeltene. Spec-en holdes samlet selv om den er litt over 1 600 tokens.

**Never:**
- Ingen endring i `Forberedelse.tsx` eller toppfeltet i `Resultat.tsx` (Kevin endrer resultatets toppfelt i story 2.7).
- Ingen `next-themes` eller andre nye avhengigheter.
- Ingen endring i kategorienes betydning: Oppfylt grønn, Delvis oppfylt gul, Mangler rustoransje.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Maskin i mørk | `prefers-color-scheme: dark`, første besøk | Siden tegnes mørk fra start, bryteren `aria-pressed="true"` | N/A |
| Maskin i lys | `prefers-color-scheme: light` | Lys som i dag, bryteren `aria-pressed="false"` | N/A |
| Bytter med bryteren | trykk | `dark` på `<html>` slås av eller på, fokus blir på bryteren | N/A |
| Maskinen endres | ingen valg i fanen | Temaet følger maskinen | N/A |
| Maskinen endres | brukeren har valgt | Valget beholdes | N/A |
| Ny fane eller ny lasting | tidligere valg | Følger maskinen igjen, ingenting er husket | N/A |
| Uten JavaScript | skriptet kjører ikke | Lyst tema | N/A |

</frozen-after-approval>

## Code Map

- `src/app/globals.css:5` -- `@custom-variant dark (&:is(.dark *))`, altså klassebasert. `.dark` (l.121–153) er shadcn-standarden og mangler `primary-soft`, `oppfylt`, `oppfylt-bg`, `delvis`, `delvis-bg`, `mangler`, `mangler-bg`, `belegg` og `belegg-bg`. `primary`, `ring`, `input` og `destructive` i `.dark` må byttes.
- `src/app/layout.tsx:29-40` -- `<html>` uten `suppressHydrationWarning`. Skriptet i `<head>` og bryteren monteres her: bryteren i en smal rad `INNHOLD flex justify-end` rett etter `<Demomodus />`, før `{children}`.
- `src/components/ui/sonner.tsx:10` -- `theme="light"` hardkodet. Må følge temaet.
- `src/repo-regler.test.ts:49-57` (NFR-1, forbudt lagring) og `:93-128` (UX-DR1, `toContain` på lyse tokens). Utvid UX-DR1 med de mørke verdiene. `FORBUDT_I_UI` (l.28) gjelder nye klasser i `ui/`.
- `src/app/layout.test.tsx` -- krever nøyaktig én `div aria-live` og to `aria-live` totalt. Bryteren må ikke endre det.
- `src/components/Forberedelse.tsx:10` -- `INNHOLD` gjenbrukes for bredden.
- `lucide-react` 1.68 har `Sun` og `Moon`.

## Tasks & Acceptance

**Execution:**
- [x] `src/app/globals.css` + `src/repo-regler.test.ts` -- den mørke paletten i `.dark`, og testen låser den -- UX-DR1
- [x] `src/components/TemaBryter.tsx` + test -- bryteren og tilstanden (`matchMedia`, `classList`, ingen lagring) -- NFR-1, UX-DR
- [x] `src/app/layout.tsx` + `layout.test.tsx` -- skriptet i `<head>`, `suppressHydrationWarning`, raden med bryteren -- NFR-1
- [x] `src/components/ui/sonner.tsx` -- toasten følger temaet -- UX-DR11
- [x] `DESIGN.md` (ny seksjon «Mørk modus» med tabellen og kontrastene) og `.memlog.md` (beslutningen) -- sporbarhet

**Acceptance Criteria:**
- Given mørk modus, when resultatsiden med eksempelet vises, then er alle kort, kategorimerker, belegg, nøkkelord, demobanner, dialoger og toasten mørke og lesbare.
- Given `npm run lint`, `npm run typecheck`, `npm test` og `npm run build`, when de kjøres, then er alle grønne.

## Implementation Notes

## Spec Change Log

## Review Triage Log

| # | Source | Location | Finding | Verdict | Evidence | Route |
|---|--------|----------|---------|---------|----------|-------|
| 1 | verification-gap + blind | ui/sonner.tsx | Toaster theme switch untested | medium | Pre-verified: no test renders Toaster with `dark` on <html> | patch |
| 2 | verification-gap | layout.tsx TEMA_SKRIPT | Head script only checked as text, never executed | medium | Pre-verified: inverted condition or wrong element would pass | patch |
| 3 | blind | globals.css | No `color-scheme`, so scrollbars and native controls stay light in dark | medium | Confirmed: no `color-scheme` anywhere in src | patch |
| 4 | blind | TemaBryter.tsx | Toggle shows Moon/aria-pressed=false for one frame on a dark machine (server snapshot `false`) | low | Confirmed; met on every load on a dark machine. Icon via CSS `dark:` classes is a direct fix | patch |
| 5 | blind | TemaBryter.tsx | Icon-only toggle without visible hint | low | Confirmed; `title` is a direct addition | patch |
| 6 | blind | layout.test.tsx | Test name promises no live region in the toggle row but does not assert it | low | Confirmed; assertion is a direct addition | patch |
| 7 | implementer | PRD §7.3 | PRD said «Mørk modus: Senere» | low | Fixed directly by orchestrator: §7.3 row notes the addition with date and spec | fixed |
| 8 | blind | repo-regler.test.ts | Contrast claims not computed in tests; border/card 1,4:1 | false | Card borders are decorative, not component boundaries (1.4.11). All text and input pairs computed in Design Notes | reject |
| 9 | blind | ui/tabs, textarea, button | shadcn `dark:` variants (input/30, active tab text) | low | Checked in headless Edge screenshots: fields and active tab readable; active tab keeps the primary underline | reject |
| 10 | blind | globals.css | chart/sidebar tokens in `.dark` stale | false | Not used by any component in src | reject |
| 11 | blind | TemaBryter.test.tsx | «valget huskes ikke» test is weak | low | NFR-1 storage scan in repo-regler.test.ts is the real guard | reject |
| 12 | blind | TemaBryter.tsx | No test without matchMedia | low | Code guards with `?.` and early return; jsdom default | reject |
| 13 | blind | diff | DESIGN.md not in reviewed diff | false | Docs exist in the working tree; diff was scoped to src | reject |
| 14 | edge | TemaBryter.tsx | MediaQueryList.addEventListener missing in Safari < 14 | false | Next.js 16 does not support Safari < 14 | reject |

## Design Notes

**Mørk palett** (regnet etter WCAG, alle par består):

| Token | Verdi | Kontrast |
|---|---|---|
| `background` / `foreground` | `#0F172A` / `#F1F5F9` | 16,3:1 |
| `card`, `popover` / `*-foreground` | `#1E293B` / `#F1F5F9` | 13,4:1 |
| `primary` / `primary-foreground` | `#93C5FD` / `#0F172A` | 9,9:1. Primær på kort 8,1:1 |
| `primary-soft` | `#1E3A5F` | primær på den 6,4:1 |
| `secondary`, `muted`, `accent` / `*-foreground` | `#273449` / `#F1F5F9` | |
| `muted-foreground` | `#94A3B8` | 7,0:1 på bakgrunn, 5,7:1 på kort, 4,9:1 på `#273449` |
| `border` | `#334155` | |
| `input` | `#64748B` | 3,1:1 på kort, 3,8:1 på bakgrunn |
| `ring` | `#93C5FD` | 9,9:1 |
| `destructive` | `#FCA5A5` | 7,7:1 på kort |
| `oppfylt` / `-bg` | `#86EFAC` / `#14321F` | 9,9:1 |
| `delvis` / `-bg` | `#FCD34D` / `#3A2C06` | 9,4:1 |
| `mangler` / `-bg` | `#FDBA74` / `#43200C` | 8,6:1 |
| `belegg` / `-bg` | `#E2E8F0` / `#273449` | 10,2:1 |

**Plassering:** bryteren ligger i en egen rad over innholdet, høyre side, på begge sidene. Den rører ikke toppfeltene, så den ikke kolliderer med 2.7.

**Skriptet** (i `<head>`, før stilene tas i bruk): `matchMedia('(prefers-color-scheme: dark)').matches` gir `document.documentElement.classList.add('dark')`. Det leser bare maskinens innstilling og lagrer ingenting.

## Verification

**Commands:**
- `npm run lint`, `npm run typecheck`, `npm test`, `npm run build` -- expected: alle grønne

**Manual checks:**
- I Edge med mørk modus i Windows: siden tegnes mørk uten hvit blink. Bryteren bytter tema med tastatur. Forsiden, eksempelet, dialogen og toasten er lesbare. Ny lasting følger maskinen igjen.
