# Story 1.2: forberedelsessiden

## 2026-11-04 kl. 16:23 — Sondre Skogheim

### Oppgave
Bygge forberedelsessiden etter spesifikasjonen: designtokener, personvernboks, annonsefelt, avkrysning og *Analyser* med årsaker, drevet av økt-tilstanden i `lib/okt`. CV-panelet får bare overskrift og plassholderlinje.

### Plan
- Spesifikasjon: [spec-1-2-forberedelsessiden.md](../../_bmad-output/implementation-artifacts/spec-1-2-forberedelsessiden.md)
- Bygge lag for lag (`kontrakt`, `kjerne`, `okt`, komponenter), legge inn tokens og fokusring, og kontrollere produksjonsbygget i headless Edge.

### Resultat
- Nye filer: `lib/kontrakt/grenser.ts`, `lib/kjerne/grenser.ts`, `lib/okt/tilstand.ts`, `lib/okt/OktProvider.tsx`, `lib/okt/personvern.ts`, seks komponenter med tester, og shadcn `alert`, `checkbox`, `textarea` og `label`.
- Endret: `globals.css` (tokens, typografi, `content-max`, fokusring, `overflow-wrap`), `components/ui/*` (uten `outline-none`, ring og opasitet), `layout.tsx`, `page.tsx`, `Demomodus.tsx` (bruker nå `useOkt`), `status.ts`, `lint-grenser.test.ts` og `repo-regler.test.ts`. `lib/kjerne/.gitkeep` er fjernet.
- Punktet om å flytte `modus` og `leverandor` inn i `lib/okt` er løst, også i `deferred-work.md` og `issues.md`.
- `npm run lint`, `typecheck`, `test` (122 tester) og `build` består uten nøkkel.
- Headless Edge mot `next start`: DOM-rekkefølge, `lang="nb"`, tokens, fokusring, tastaturflyt med fokus på bekreftelsesteksten, feil for kort og for lang annonse, klikkflater, ingen sidelengs rulling i 1280, 1024, 1023, 640 og 320 px, ingenting i nettleserlagring eller cookies, `/api/status` kalt én gang, og blokkert status gir generell tekst uten banner.
- Koden er ikke committet.

### Åpne punkter
- Sondre må teste selv med tastatur, i 320 px og med 200 % zoom (headless Edge etterlignet 200 % med 640 px bredde).
- `letter-max` står i UX-DR1, men ikke i spesifikasjonen for story 1.2, og er ikke lagt inn. Må inn når søknadsbrevet bygges.
