# Revidere product brief

## 2026-10-27 kl. 12:56 — Sondre Skogheim

### Oppgave
Innarbeide tilbakemeldingen fra faglærer på product brief (`tilbakemelding-product-brief.md`, datert 2026-10-06) før PRD-arbeidet starter.

### Plan
- Hente nyeste versjon av repoet med `git pull` (hentet tilbakemeldingen, `CLAUDE.md` og `sesjonslogg`-skillen).
- Gå gjennom tilbakemeldingens «viktigste endringer» og «neste steg» og oppdatere `brief.md` punkt for punkt.
- Lage et fast testsett med fiktive CV-er, annonser, fasit og sjekkliste i `testdata/`.

### Resultat
Oppdatert `_bmad-output/planning-artifacts/briefs/brief-G69-heggdal-skogheim-2026-09-17/brief.md`:
- Besluttet ingen kontoer og ingen varig lagring i v1 (anbefalt av faglærer).
- Ny seksjon «Personvern og datahåndtering» (minnebasert økt, informasjon om ekstern språkmodell, ingen logging av CV-innhold, `.env`, bare fiktive testdata).
- Gap-analysen har tre kategorier (Oppfylt / Delvis oppfylt / Mangler); «Oppfylt» og «Delvis» må begrunnes med tekst fra CV-en.
- Suksesskriteriene er gjort testbare mot testsettet, og kriteriene om to-kolonne-PDF, feilmeldinger og demomodus er lagt til.
- Prioritert rekkefølge: grunnmur → gap-analyse og nøkkelord → søknadsbrev → CV-forbedringer og ATS.
- Nøkkelordtreff beregnes i kode. Demomodus med forhåndslagrede svar uten API-nøkkel.
- «Løsningen» beskriver brukeropplevelsen (faner, redigering, kontroll av innlest tekst). Eksempel lagt til i «Problemet».
- Ny seksjon «Kvalitetssikring av KI-innholdet» og en endringslogg.
- Eksport til PDF/DOCX er lagt under «utenfor v1» (brukeren kopierer teksten).

Ny mappe `testdata/` med README, `sjekkliste.md` og tre fiktive par (CV, annonse og fasit med forbudte påstander): butikk → bank, IT-student → IT-brukerstøtte, nyutdannet økonom → regnskap.

### Åpne punkter
- Kevin må gå gjennom og godkjenne beslutningene i briefen (kontoer/lagring, gap-kategorier, eksport utenfor v1).
- Testsettet mangler en to-kolonne-CV i PDF og en DOCX-CV.
- Valg av AI-modell/plattform gjenstår til arkitekturfasen.
- Neste steg: PRD med BMAD.
