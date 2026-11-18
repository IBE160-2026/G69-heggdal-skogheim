---
title: Sprint Change Proposal – PRD oppdatert etter faglærers tilbakemelding
date: 2026-11-18
author: Sondre Skogheim (med Claude)
status: godkjent av Sondre 2026-11-18, gjennomført
trigger: PRD-commit 49b6b40 (PRD §12, 2026-11-18)
mode: batch
---

# Sprint Change Proposal, 2026-11-18

## 1. Hva som utløste endringen

Faglærer ga formativ tilbakemelding på PRD-en 2026-11-12 (`tilbakemelding-prd.md`). PRD-en ble oppdatert 2026-11-18 (commit 49b6b40, PRD §12):

- **FR-9:** belegg normaliseres også for listetegn, bindestreker, anførselstegn og orddeling. Det kommer nye enhetstester, blant annet med en linje fra par 4.
- **FR-11:** hvert nøkkelord knyttes til ett annonsekrav eller ingen (som `kravIndeks` i AD-14).
- **FR-17:** et nøkkelord foreslås bare når det er knyttet til et annonsekrav med Oppfylt eller Delvis oppfylt. Nøkkelord uten annonsekrav foreslås ikke, og par 3 skal verken få «Tripletex» eller «Visma».
- **FR-2:** formulert som dataminimering.
- **FR-4:** merknad om at verktøyet er laget for norsk. Tekst på engelsk avvises ikke.
- **NFR-3:** forhåndsbetalt kreditt er det harde taket, og telleren i minnet er en myk grense. *Prøv med eksempel* virker når kreditten er brukt opp.
- **SM-2:** feiler én av tre kjøringer, rettes prompten, og alle kjøres på nytt.
- **Ny SM-10:** tre medstudenter tester med egen CV. Testen gjøres før innlevering, helst før søknadsbrevet bygges.
- **Ordlisten:** «annonsekrav» og «PRD-krav».

**Type:** nytt krav fra en interessent (faglærer). Det er ingen teknisk feil. `epics.md` beskriver fortsatt den gamle FR-9, FR-11 og FR-17 og mangler SM-10, så story 2.1, 2.3, 4.2 og 5.1 ville blitt bygget etter de gamle reglene.

## 2. Konsekvensanalyse

### Sjekkliste

| Punkt | Status | Funn |
|---|---|---|
| 1.1 Utløsende story | [x] | Ingen story. Endringen kommer fra PRD-en og påvirker epic 2–5 før de startes |
| 1.2 Problem | [x] | Nytt krav fra en interessent (faglærer) |
| 1.3 Bevis | [x] | `tilbakemelding-prd.md` §4.1–4.5 og §5, PRD §12, memloggen 2026-11-18 |
| 2.1 Pågående epic | [x] | Epic 1 kan fullføres som planlagt. Story 1.6 implementerer `normaliser` etter den gamle FR-9. Det er greit, fordi story 2.1 utvider funksjonen, og `erDemoeksempel` påvirkes ikke på noen måte som betyr noe |
| 2.2 Endringer i epicene | [!] | Epic 2: AC-ene i 2.1, 2.3 og 2.5 endres, og det kommer en ny story 2.8 (SM-10). Epic 4: AC-ene i 4.2 endres. Epic 5: AC-ene i 5.1 endres |
| 2.3 Senere epicer | [x] | Epic 3 påvirkes ikke |
| 2.4 Utdaterte eller nye epicer | [x] | Ingen. Én ny story innenfor epic 2 |
| 2.5 Rekkefølge | [x] | Uendret. Story 2.8 krever 2.3 og 2.4 (ekte analyse) og kommer før epic 3 |
| 3.1 PRD | [x] | Allerede oppdatert (49b6b40). MVP-en er uendret |
| 3.2 Arkitektur | [x] | Ingen konflikt. AD-9 (teller og kreditt), AD-11 (Mistral foretrekkes) og AD-14 (`kravIndeks: number \| null`) stemmer allerede. Normaliseringen er ikke beskrevet i spinen og står i addendum D0 |
| 3.3 UX | [!] | EXPERIENCE.md mangler mikroteksten for merknaden om språk. Den foreslås i AC-en for story 2.3 og bør legges inn i EXPERIENCE.md når den storyen bygges (ikke blokkerende) |
| 3.4 Andre artefakter | [x] | `testdata/sjekkliste.md` er allerede oppdatert for FR-17. `sprint-status.yaml` trenger ny nøkkel for story 2.8 |
| 4.1 Direkte justering | Mulig | Lav innsats, lav risiko |
| 4.2 Tilbakerulling | Ikke mulig | Ingen ferdig story er feil |
| 4.3 Gjennomgang av MVP | Ikke mulig | Omfanget er uendret |

### Konsekvenser for epics og stories

- **Kravoversikt i `epics.md`:** sammendragene av FR-2, FR-4, FR-9, FR-11, FR-17, FR-18, FR-26 og NFR-3 er utdaterte.
- **Story 2.1:** AC-en for `kontrollerKrav` og `normaliser` må ha den nye normaliseringen og de nye testene. `gap.json` trenger `kravIndeks` per nøkkelord.
- **Story 2.3:** prompten må knytte nøkkelord til annonsekrav. Merknaden om språk mangler.
- **Story 2.5:** må vise at *Prøv med eksempel* virker når kreditten er brukt opp.
- **Story 4.2:** trenger testen for `kravIndeks: null` og kravet om par 3 i testsettet.
- **Story 5.1:** trenger regelen for ny kjøring i SM-2.
- **Ny story 2.8:** brukertest med medstudenter (SM-10).

### Konsekvenser for kode

Ingen ferdig kode må endres nå. `normaliser` i `src/lib/kjerne/demo.ts` (Kevins gren for story 1.6) utvides i story 2.1.

## 3. Anbefalt vei videre

**Direkte justering:** AC-ene i eksisterende stories endres, og det kommer én ny story (2.8).

- **Begrunnelse:** Endringene presiserer regler for stories som ikke er startet, og arkitekturen stemmer allerede. Det er ingen grunn til å rulle tilbake eller kutte omfang.
- **Innsats:** lav, cirka én økt for dokumentene.
- **Risiko:** lav.
- **Tidsplan:** story 2.8 legger til én brukertest med tre medstudenter før epic 3.
- **Vurderte alternativer:**
  - *Legge SM-10 i story 5.3 (medstudenttest).* Forkastet: PRD-en vil ha testen før søknadsbrevet bygges, så resultatet kan påvirke det.
  - *Legge merknaden om språk i story 1.2.* Forkastet: 1.2 er ferdig, og 2.3 er der ekte analyse av andre språk først blir mulig.

## 4. Konkrete endringsforslag

### 4.1 `epics.md` – Oversikt

**GAMMELT:**
> Ordene i PRD §3 brukes uten synonymer.

**NYTT:**
> Ordene i PRD §3 brukes uten synonymer. «Krav» i stories betyr annonsekrav (PRD §3), og koden bruker `krav`. Mikrotekst i grensesnittet, som «Du dekker X av Y krav», er uendret.

*Grunn:* ordlisten i PRD-en bruker nå «annonsekrav». Å skrive om hver forekomst i stories og UI-tekst gir mye støy og ingen gevinst.

### 4.2 `epics.md` – Kravoversikt (sammendragene)

**FR-2 (siste setning), GAMMELT:**
> Bare CV-teksten sendes til serveren, og først når brukeren trykker *Analyser*.

**NYTT:**
> Dataminimering: ingenting fra CV-en forlater brukerens enhet før *Analyser*, og da bare CV-teksten fra kontrollsteget. Selve filen, bilder og metadata sendes ikke.

**FR-4, tillegg:**
> Ved feltene står det at verktøyet er laget for CV-er og annonser på norsk. Tekst på andre språk avvises ikke, og resultatene er alltid på bokmål.

**FR-9, GAMMELT:**
> Hvert belegg kontrolleres ordrett mot CV-teksten (store og små bokstaver, mellomrom og linjeskift regnes ikke med). … Enhetstester: belegg som finnes, belegg som er omskrevet (avvises), belegg med andre linjeskift (godtas), og Oppfylt og Delvis oppfylt uten belegg blir Mangler.

**NYTT:**
> Hvert belegg kontrolleres ordrett mot CV-teksten etter normalisering. Disse forskjellene regnes ikke med: store og små bokstaver, mellomrom, linjeskift, listetegn, bindestreker og tankestreker (også orddeling), og anførselstegn og apostrofer (addendum D0; at alle bindestreker fjernes, er `[ANTAKELSE]`). Mangler belegget, blir kravet **Mangler** og merkes «nedgradert: fant ikke belegg i CV-en», og belegget vises ikke. Enhetstestene dekker:
> - belegg som finnes (godtas)
> - belegg som er omskrevet (avvises)
> - andre linjeskift, orddeling og andre anførselstegn (godtas)
> - en linje fra par 4 uten listetegn (godtas), og den samme linjen med ett ord byttet (avvises)
> - Oppfylt og Delvis oppfylt uten belegg (blir Mangler)

**FR-11, NYTT:**
> Systemet henter ut nøkkelordene fra annonsen og knytter hvert nøkkelord til ett krav eller ingen (`kravIndeks`), i samme generering. Minst 80 % av de forventede nøkkelordene i fasiten er med. Koblingen påvirker ikke treffprosenten.

**FR-17, NYTT:**
> ATS-forslag om format, overskrifter og ordvalg. Et nøkkelord som ikke er funnet, foreslås bare når det er knyttet til et krav med Oppfylt eller Delvis oppfylt etter FR-9. Nøkkelord uten krav foreslås ikke. For par 3 foreslås verken «Tripletex» eller «Visma». Hvert forslag er konkret og har én setning om hvorfor.

**FR-18, tillegg i siste setning:**
> … bruker i tillegg den uredigerte gap-analysen, med kategoriene og koblingen mellom nøkkelord og krav.

**FR-26:** «full analyse krever nøkkel» endres til «analyse av egen CV krever nøkkel». UI-teksten i story 1.6 beholdes.

**NFR-3, NYTT:**
> En full kjøring er fire genereringer, og nye genereringer telles. Mål: 1 kr eller mindre per kjøring. Det harde taket er forhåndsbetalt kreditt hos leverandøren, uten automatisk påfylling og under 200 kr. Telleren i minnet (AD-9) er en myk grense, fordi den ikke deles mellom serverinstanser. Den bruker ingen IP-adresser. Når en grense er nådd, gjelder FR-22. *Prøv med eksempel* virker også når kreditten er brukt opp.

### 4.3 Story 2.1 – Kontrollert gap-analyse for demoeksempelet

**Realiserer:** legg til «addendum D0».

**AC for `kontrollerKrav`, GAMMELT:**
> **Så** godtas et belegg som finnes, også med andre linjeskift og store eller små bokstaver, et belegg som er litt omskrevet avvises, og …

**NYTT:**
> **Gitt** `normaliser` og `kontrollerKrav` i `lib/kjerne`
> **Når** enhetstestene kjører
> **Så** utvides `normaliser` fra story 1.6 med normaliseringen i addendum D0: listetegn, bindestreker og tankestreker, og anførselstegn og apostrofer fjernes i tillegg til mellomrom og linjeskift. Testene for `erDemoeksempel` er fortsatt grønne
> **Og** et belegg som finnes, godtas, også med andre linjeskift, store eller små bokstaver, orddeling med bindestrek over linjeskift og andre anførselstegn. Et belegg som er litt omskrevet, avvises
> **Og** «Kassasystem og dagsoppgjør» fra `testdata/par-4-tokolonne-hotell/cv.txt` (der linjen starter med «- ») godtas, mens det samme belegget med ett ord byttet avvises
> **Og** et Oppfylt- eller Delvis oppfylt-krav uten gyldig belegg (også med tom liste) blir `mangler` med `nedgradert: true`. Belegg som ikke ble funnet, er fjernet (FR-9). Testnavnene starter med `FR-9:`

**AC for `gap.json`, tillegg:**
> … og de ni nøkkelordene, hvert med `kravIndeks` til kravet det hører til eller `null` (FR-11) …

### 4.4 Story 2.3 – Ekte gap-analyse med språkmodellen

**Realiserer:** legg til FR-4 (merknad om språk).

**AC for prompten, tillegg:**
> … og at hvert nøkkelord knyttes til kravet det hører til, eller til ingen (`kravIndeks`) …

**Ny AC:**
> **Gitt** forberedelsessiden
> **Når** CV-panelet og annonsepanelet vises
> **Så** står det under overskriften i begge panelene: «Laget for CV-er og annonser på norsk. Resultatet er alltid på bokmål.» Tekst på andre språk avvises ikke (FR-4)
> **Og** mikroteksten legges også inn i EXPERIENCE.md

### 4.5 Story 2.5 – Forståelige feil uten tap av data

**Ny AC:**
> **Gitt** at den forhåndsbetalte kreditten hos leverandøren er brukt opp
> **Når** brukeren analyserer en egen CV
> **Så** gir feilen fra leverandøren `llm_feil` med meldingen fra tabellen, uten krasj og uten tap av tekst
> **Og** *Prøv med eksempel* virker fortsatt, fordi den ikke kaller språkmodellen (NFR-3)

### 4.6 Ny story 2.8 – Brukertest med medstudenter

> ### Story 2.8: Brukertest med medstudenter
>
> Som gruppe,
> vil vi se at medstudenter faktisk får verdi av gap-analysen med sin egen CV,
> slik at vi vet om høydepunktet i UJ-1 holder før søknadsbrevet bygges.
>
> **Realiserer:** SM-10, UJ-1, NFR-10
>
> **Akseptansekriterier:**
>
> **Gitt** story 2.3 og 2.4 (ekte gap-analyse med den valgte leverandøren i produksjon)
> **Når** tre medstudenter utenfor gruppen bruker appen med egen CV-tekst og annonsen fra testpar 1
> **Så** svarer de på spørsmålet «Fant du en erfaring du ikke hadde tenkt på som relevant?», og minst to svarer ja (SM-10)
> **Og** svarene og eventuelle observasjoner noteres i sesjonsloggen uten CV-tekst eller navn
>
> **Gitt** færre enn to ja-svar
> **Når** resultatet er notert
> **Så** vurderer gruppen endringer i prompten eller i visningen før epic 3, og vurderingen noteres i sesjonsloggen

**Epic 2, «FR som dekkes»:** legg til «SM-10 (story 2.8)».

### 4.7 Story 4.2 – ATS-forslag

**AC for ruten, tillegg:**
> **Og** en enhetstest viser at et nøkkelord knyttet til et krav med Mangler, og et nøkkelord med `kravIndeks: null`, aldri foreslås (FR-17)

**AC for testsettet, tillegg:**
> **Og** for testpar 3 foreslås verken «Tripletex» eller «Visma» i noen av kjøringene (FR-17)

### 4.8 Story 5.1 – Testsettet på den endelige versjonen

**Realiserer:** uendret (SM-2 er med).

**Ny AC:**
> **Gitt** at én av de tre kjøringene for et testpar feiler
> **Når** feilen er funnet
> **Så** rettes prompten, alle tre kjøringene for testparet kjøres på nytt, og resten av testsettet kjøres på nytt fordi prompten er endret (SM-2, SM-1)

### 4.9 Epic 5, oversikt

**GAMMELT:** «Verifiserer FR-1 til FR-27 og NFR-1 til NFR-10 (SM-1 til SM-9).»
**NYTT:** «Verifiserer FR-1 til FR-27 og NFR-1 til NFR-10 (SM-1 til SM-9). SM-10 verifiseres i story 2.8.»

### 4.10 `sprint-status.yaml`

Legg til `2-8-brukertest-med-medstudenter: backlog` etter `2-7-…` i epic 2 (nøkkel uten æøå, etter CLAUDE.md).

### 4.11 Arkitektur og UX

- **Arkitekturen:** ingen endring. AD-9, AD-11 og AD-14 stemmer allerede med PRD-en.
- **EXPERIENCE.md:** får merknaden om språk når story 2.3 bygges (står i AC-en).

## 5. Overlevering

- **Omfang:** moderat, men lite. AC-ene endres, og det kommer én ny story i backlog. Det er ingen ny planlegging.
- **Utføres av:** Claude oppdaterer `epics.md` og `sprint-status.yaml` når forslaget er godkjent. Utviklerne (Sondre og Kevin) bygger etter de nye AC-ene fra story 2.1.
- **Kevin:** går gjennom endringene og bekrefter `[ANTAKELSE]` om bindestreker i FR-9 før story 2.1 starter.
- **Suksesskriterier:**
  - Ingen sammendrag i `epics.md` motsier PRD-en fra 2026-11-18. Det sjekkes med grep etter den gamle FR-9-teksten og «hører til et krav».
  - Story 2.8 finnes i `epics.md` og i `sprint-status.yaml`.
