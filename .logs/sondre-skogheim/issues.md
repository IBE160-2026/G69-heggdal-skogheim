# Åpne punkter

## Åpne

- [ ] 2026-10-29 [prd-finalize](995-2026-10-29-15-15-11-prd-finalize.md) — Valgfritt: full språkvask med bmad-review (structure, prose) på prd.md og addendum.md
- [ ] 2026-11-03 [arkitektur](993-2026-11-03-13-03-39-arkitektur.md) — Installer Node.js 24 LTS (Sondre og Kevin) før koding
- [ ] 2026-11-04 [story-1-1-lokal-app](990-2026-11-04-15-35-17-story-1-1-lokal-app.md) — Story 1.1 del 2: sett arn1 i vercel.json, publiser, legg adressen i README-en, og sjekk om runtime-loggene viser IP-adresser
- [ ] 2026-11-04 [story-1-1-lokal-app](990-2026-11-04-15-35-17-story-1-1-lokal-app.md) — CI-jobben er aldri kjørt på GitHub, og må bestå ved første push av grenen story-1-1-lokal-app
- [ ] 2026-11-04 [story-1-1-lokal-app](990-2026-11-04-15-35-17-story-1-1-lokal-app.md) — Åpne appen i nettleseren og se at demobanneret vises i full bredde øverst
- [ ] 2026-11-04 [story-1-1-lokal-app](990-2026-11-04-15-35-17-story-1-1-lokal-app.md) — npm audit rapporterte 21 sårbarheter (2 lave, 19 moderate) som ikke er vurdert
- [ ] 2026-11-04 [story-1-1-lokal-app](990-2026-11-04-15-35-17-story-1-1-lokal-app.md) — _bmad/config.user.toml må lages på Sondres egen PC og hos Kevin, ellers stopper /bmad-build
- [ ] 2026-11-04 [story-1-1-lokal-app](990-2026-11-04-15-35-17-story-1-1-lokal-app.md) — Story 1.2 må flytte modus og leverandor inn i konteksten i lib/okt

## Løst

- [x] 2026-11-03 [sprint-planning](991-2026-11-03-14-28-16-sprint-planning.md) — Story-nøklene har æøå (f.eks. 2-4-velge-leverandør-ved-måling): bekreft at filnavnene fungerer på Windows og macOS, ellers gi titlene nye navn før story-filene lages (løst 2026-11-03: nøklene translittereres, æ→ae, ø→o, å→aa, se CLAUDE.md)
- [x] 2026-11-03 [epics-og-stories](992-2026-11-03-14-19-26-epics-og-stories.md) — Story 1.1 er stor: del i lokal app med CI og publisering på Vercel hvis den blir for stor for én økt (løst 2026-11-03: avgjøres når story 1.1 bygges)
- [x] 2026-11-03 [arkitektur](993-2026-11-03-13-03-39-arkitektur.md) — Lag demosvarene (src/lib/llm/demo-svar/, én JSON per resultatdel) i grunnmuren (løst 2026-11-03: flyttet til stories 2.1, 3.1, 4.1 og 4.2)
- [x] 2026-11-03 [arkitektur](993-2026-11-03-13-03-39-arkitektur.md) — Første Vercel-publisering: velg EU-region (fra1/arn1) og sjekk om plattformloggene viser IP-adresser (FR-5) (løst 2026-11-03: flyttet til story 1.1)
- [x] 2026-11-03 [arkitektur](993-2026-11-03-13-03-39-arkitektur.md) — Velg leverandør ved måling (AD-11): testsettet med Mistral og OpenAI, sjekk vilkår, sett forhåndsbetalt kreditt under 200 kr (løst 2026-11-03: flyttet til story 2.4 i sprint-status.yaml)
- [x] 2026-11-03 [arkitektur](993-2026-11-03-13-03-39-arkitektur.md) — Sondre og Kevin leser spinen og ARKITEKTUR-OVERSIKT.md og bekrefter eller overstyrer Claudes delegerte valg (løst 2026-11-03: godkjent av Sondre og Kevin, notert i arkitekturens .memlog.md)
- [x] 2026-10-30 [ux-design](994-2026-10-30-14-44-03-ux-design.md) — Gå gjennom lave funn i UX-gjennomgangene (review-rubric.md, review-tilgjengelighet.md) når stories lages (løst 2026-11-03: tatt inn som UX-DR i epics.md, se [epics-og-stories](992-2026-11-03-14-19-26-epics-og-stories.md))
- [x] 2026-10-30 [ux-design](994-2026-10-30-14-44-03-ux-design.md) — Bekreft shadcn/ui og Tailwind i bmad-architecture (løst 2026-11-03: shadcn 4.23 med Radix og Tailwind 4, se [arkitektur](993-2026-11-03-13-03-39-arkitektur.md))
- [x] 2026-10-30 [prd-finalize](995-2026-10-29-15-15-11-prd-finalize.md) — Arkitektur: velg mekanisme og tall for rate-limit i minnet og/eller dagstak (NFR-3), og sjekk om Vercel logger IP-adresser (løst 2026-11-03: AD-9; IP-sjekken i Vercel er flyttet til eget punkt, se [arkitektur](993-2026-11-03-13-03-39-arkitektur.md))
- [x] 2026-10-30 [prd-finalize](995-2026-10-29-15-15-11-prd-finalize.md) — PRD §10.8: bestem i bmad-ux hvordan brukeren kommer tilbake til kontrollsteget med teksten beholdt etter en analyse (løst 2026-10-30: knappen Endre CV-tekst i FR-3)
- [x] 2026-10-30 [prd-finalize](995-2026-10-29-15-15-11-prd-finalize.md) — Gruppen bekrefter Claudes løsninger på konfliktene: FR-8-toleransen uten «ett hakk», og FR-18 med uredigert gap-analyse som grunnlag i tillegg til CV og annonse (løst 2026-10-30)
- [x] 2026-10-29 [prd-finalize](995-2026-10-29-15-15-11-prd-finalize.md) — Gruppen går gjennom valgene under «Avklart under Finalize» i PRD §11 før stories lages (løst 2026-10-30: FR-9, IP og FR-18 endret, resten gjelder)
- [x] 2026-10-29 [testpar-4-docx-treffprosent](996-2026-10-29-14-56-10-testpar-4-docx-treffprosent.md) — Vurder matcheregelen i FR-12 (siste ledd i sammensatte ord, småord); ved endring må treffprosentene i fasitene regnes ut på nytt (løst 2026-10-29: godkjent uendret av Sondre og Kevin)
- [x] 2026-10-29 [prd-utkast](997-2026-10-29-14-49-56-prd-utkast.md) — Kjør Finalize i bmad-prd (memlog, avstemming, reviewer, triage, polish, status final) (løst 2026-10-29, se [prd-finalize](995-2026-10-29-15-15-11-prd-finalize.md))
- [x] 2026-10-29 [prd-utkast](997-2026-10-29-14-49-56-prd-utkast.md) — Legg forventet treffprosent inn i hver testdata/*/fasit.md (løst 2026-10-29: 22 %, 11 %, 8 %, 33 %)
- [x] 2026-10-29 [prd-utkast](997-2026-10-29-14-49-56-prd-utkast.md) — Lag skisser av opplasting, resultatside og redigering i bmad-ux før epics (løst 2026-10-30, se [ux-design](994-2026-10-30-14-44-03-ux-design.md))
- [x] 2026-10-29 [prd-utkast](997-2026-10-29-14-49-56-prd-utkast.md) — Bekreft eller endre alle [ANTAKELSE] i PRD §11 (Sondre og Kevin) (løst 2026-10-29: alle bekreftet)
- [x] 2026-10-27 [research-for-prd](998-2026-10-27-13-22-00-research-for-prd.md) — Gå gjennom research-utkastet og gjør researchen før torsdag (medstudent-samtaler, test av lignende verktøy) (løst 2026-10-30, bekreftet av Sondre)
- [x] 2026-10-27 [revidere-product-brief](999-2026-10-27-12-56-59-revidere-product-brief.md) — Lag PRD med BMAD (løst 2026-10-29: utkast laget, ferdigstilling er eget punkt)
- [x] 2026-10-27 [revidere-product-brief](999-2026-10-27-12-56-59-revidere-product-brief.md) — Velg AI-modell/plattform i arkitekturfasen (løst 2026-11-03: plattform og stack valgt, leverandør avgjøres ved måling etter AD-11, se [arkitektur](993-2026-11-03-13-03-39-arkitektur.md))
- [x] 2026-10-27 [revidere-product-brief](999-2026-10-27-12-56-59-revidere-product-brief.md) — Testsettet mangler to-kolonne-CV i PDF og en DOCX-CV (løst 2026-10-29: par 4 med cv.pdf og par 1 cv.docx, se [testpar-4-docx-treffprosent](996-2026-10-29-14-56-10-testpar-4-docx-treffprosent.md))
- [x] 2026-10-27 [revidere-product-brief](999-2026-10-27-12-56-59-revidere-product-brief.md) — Kevin må gå gjennom og godkjenne beslutningene i revidert brief (løst 2026-10-29: Kevin har lest og godkjent)
