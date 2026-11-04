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
- Rettinger etter kodegjennomgang: avkrysningen vises først når leverandøren er kjent, `forlatt` settes bare ved for kort tekst, telleren er knyttet til feltet, `autoComplete="off"`, `letter-max` lagt inn, strengere vakt mot `ring-` i `ui/*`, U+00A0 i tallene, og `cn` er konfigurert med typografirollene (`ui/*` importerer den fra `lib/utils`). Nye dev-avhengigheter: `jsdom` 30.1.3 og `@testing-library/react` 16.3.3, med tester av handlinger, fokus og henting.
- Full kontroll etter rettingene, i en ren kopi uten nøkkel: `npm ci`, lint, typesjekk, 141 av 141 tester og `npm run build` består. DOM-en og skjermbilde i 1280 px er sjekket i Edge mot produksjonsbygget. Fokus, tastatur og smal bredde er ikke sjekket i nettleser på nytt etter rettingene. Fokus og handlinger dekkes nå av jsdom-tester.
- Committet som `9956150` på grenen `story-1-2-forberedelsessiden` og pushet med [PR #2](https://github.com/IBE160-2026/G69-heggdal-skogheim/pull/2). CI og Vercel-forhåndsvisningen består.
- Sikkerhetskontrollen i Claude Code stoppet `gh pr merge`, så Sondre flettet PR #2 selv. Siden er publisert i produksjon.
- Sondre testet i produksjon: tastatur med Tab, 200 % zoom, annonsefeltet og 320 px bredde virker. Story 1.2 er satt til `done`. NVDA og VoiceOver tas i story 2.2 og 5.2.
- Under testingen lukket byggingen Edge-vinduer med tittelen `about:blank`.

### Åpne punkter
- Ingen.
