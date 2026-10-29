---
title: Input-avstemming av PRD — AI CV & Job Application Assistant
created: 2026-10-29
gjelder: prd.md og addendum.md (utkast 2026-10-29)
---

# Input-avstemming av PRD

Hver kilde er lest opp mot `prd.md` og `addendum.md`. Her står bare **hull**: det kilden sier, men som PRD-en mister, motsier eller svekker. Alvorlighetsgrad: **høy** (sensor eller testsett vil merke det, eller et krav kan ikke spores eller testes), **middels** (en kvalitativ idé eller et kildekrav mangler i FR/SM), **lav** (presisering eller ordbruk).

Ikke tatt med som hull, fordi de er bevisste ikke-mål (§7.1) eller er lagt til UX eller arkitektur:
- Valg av tone på brevet, eksport, kontoer og lagring, annonse som fil, OCR, andre språk (ikke-mål, §7.1).
- Skisser av opplasting, resultatside og redigering, og «rolig» resultatside utover fanene (lagt til `bmad-ux`, §10 punkt 2).
- Valg av leverandør, modell og PDF-bibliotek (arkitektur, §6 og §10 punkt 1).

---

## 1. Produktbrief (`brief.md` + `addendum.md`)

| # | Hull | Alv. | Sted i PRD | Forslag |
|---|---|---|---|---|
| B1 | Briefen sier at **filopplasting, tekstuttrekk, nøkkelordtreff og flyten** testes automatisk med mock-svar. NFR-6 krever bare enhetstester for FR-12, FR-9 og FR-6. Automatisk test av tekstuttrekk (FR-2 for par 1 DOCX og par 4 PDF) og en ende-til-ende-test av flyten med mock står ikke som krav. | middels | NFR-6 | Legg til i NFR-6: automatisk test av uttrekk for `par-1/cv.docx` og `par-4/cv.pdf` mot `cv.txt`, og én flyttest (opplasting → kontrollsteg → alle fire resultatdeler) med mock-klienten. |
| B2 | Briefen sier at testsettet kjøres **ved hver vesentlige endring i prompts**. SM-1 er formulert som et engangsmål, og PRD-en sier ikke når testsettet skal kjøres. | middels | SM-1, NFR-6 | Skriv i SM-1 (eller NFR-6): «Testsettet kjøres mot sjekklisten etter hver vesentlige endring i prompt-modulen, og resultatet logges med commit.» |
| B3 | Brief-addendumet advarer om at **«KI-klingende» tekst svekker en søknad**. PRD-en sier bare i beskrivelsen av 4.3 at brevet skal høres ut som «en ung søker som skriver godt, ikke som en KI». FR-14 har ikke noe kriterium for dette, og det kan ikke testes. | middels | §4.3, FR-14 | Lag et sjekkbart kriterium i FR-14, for eksempel en liste over ord og fraser som ikke skal brukes (klisjeer som «brenner for», «dynamisk», «i en verden der»), og at brevet ikke har punktlister eller overskrifter. Legg samme punkt i sjekklisten. |
| B4 | Briefen nevner en egen **«oversikt over sentrale ferdigheter og nøkkelord»** og «fem genereringer». PRD-en har fire genereringer og ingen egen ferdighetsoversikt. Dette er et bevisst valg (§11), men briefen er ikke oppdatert, så sporet brief → PRD viser et avvik uten forklaring. | lav | §0, §8, §11 | Skriv en setning i §0 eller §8 om at «ferdigheter og nøkkelord» fra briefen dekkes av FR-11 i fanen *Gap-analyse og nøkkelord*, og at fem er blitt fire genereringer (§11). Legg eventuelt en linje i briefens endringslogg. |
| B5 | Briefens mål om at målgruppen skal **forstå hva arbeidsgivere ser etter** står i PRD-en bare som en læringsjobb (§2.1). Ingen FR eller SM realiserer den. CV-forbedringer og ATS-forslag (FR-16, FR-17) må ikke forklare *hvorfor*. | middels | §2.1, FR-16, FR-17 | Krev at hvert forslag i FR-16 og FR-17 har én setning om hvorfor, knyttet til et krav eller nøkkelord fra annonsen. Eller skriv uttrykkelig at læringsjobben bare dekkes av forklaringene i FR-8 og FR-10. |
| B6 | Sporingstabellen i §8 dekker bare briefens ni suksesskriterier. Briefens seksjoner om **personvern og datahåndtering** og **kvalitetssikring** (testsett, prompts ett sted, kostnad) er ikke sporet. | lav | §8 | Utvid tabellen med rader for briefens personvernpunkter (→ FR-5, FR-6, NFR-1, NFR-2) og kvalitetssikringspunkter (→ SM-1, SM-2, NFR-3, NFR-6). |

---

## 2. Tilbakemelding fra faglærer (`tilbakemelding-product-brief.md`)

Hvert punkt er sjekket. Status: **dekket**, **delvis** eller **hull**.

| Punkt i tilbakemeldingen | Status | Sted i PRD |
|---|---|---|
| Bra 1: ærlig, avgrenset, god kildekritikk | dekket | §1, addendum H (markedsføringstall brukes ikke) |
| Bra 2: «aldri dikte opp» som testbart krav | dekket | FR-8–FR-10, FR-15, SM-2 |
| Endring 1: kontoer, lagring og personvern avklares | dekket | §7.1, NFR-1, FR-5, FR-6, §6 |
| Endring 2: relevans gjøres sjekkbar med testsett og sjekkliste | delvis | SM-1. «Ikke generisk» mangler FR, se F1 |
| Endring 3: prioritere rekkefølgen på genereringene | dekket | §4 innledning, §7.2 |
| KI: håndtering av usikre svar | dekket | FR-22 (ugyldig svar), addendum C (skjemavalidering) |
| Filhåndtering: kolonner **og tabeller** | delvis | FR-2 dekker kolonner. Tabeller, se F3 |
| Sikkerhet og personvern begrunnes, også for refleksjonsrapporten | dekket | §6 |
| Tid til hele BMAD-flyten, testing, retting og README | delvis | §7.2 kuttrekkefølge. Ingen risiko for tidsbruk, se F4 |
| «De fire åpne spørsmålene» besvares tidlig i PRD | dekket | §7.1, FR-5, FR-8 |
| Kontroll på KI-ens arbeid: test-CV med kjent innhold | dekket | testdata, SM-2 |
| Testbarhet: mock i automatiske tester, fast testsett manuelt | delvis | NFR-6, SM-1. Se B1 |
| Kjørbar for sensor uten nøkkel | dekket | FR-23–FR-26, NFR-7. Svak validering, se F5 |
| Kostnad: modell med kostnad i tankene, mock-svar | dekket | NFR-3, SM-8, addendum E |
| Del 1, kriterium 1, prosess og KI-styring (30 %): sporbarhet fra brief til kode, vis valg og vurderinger | hull | Se F2 |
| Kriterium 3, kvalitetssikring (15 %) | dekket | SM-1–SM-4 |
| Kriterium 4, design (10 %): skisser | utsatt | §10 punkt 2 (bmad-ux), godkjent utsettelse |
| Kriterium 5, kodekvalitet: prompts i én modul, teknologi ikke mer kompleks enn nødvendig | dekket | NFR-6, addendum A. Se F6 |
| Kriterium 6, README: demomodus og fiktiv eksempel-CV | dekket | FR-24, NFR-7 |
| Kriterium 7, ryddighet: plan for hemmeligheter, testdata **og dokumentasjon** | delvis | NFR-2, §6. Dokumentasjon er ikke plassert, se F7 |
| Neste steg: oppdater briefen så historikken vises | delvis | Briefen er revidert, men sier fortsatt «fem genereringer», se B4 |

| # | Hull | Alv. | Sted i PRD | Forslag |
|---|---|---|---|---|
| F1 | Sjekklistepunktet **«Er ikke generisk: kunne ikke blitt sendt uendret til en annen stilling»** var faglærers hovedpoeng (endring 2), men det finnes ikke i FR-14 eller noen SM. Det dekkes bare indirekte gjennom SM-1. | høy | FR-14 | Legg til i FR-14: «Brevet er ikke generisk: det nevner arbeidsgiveren og minst ett forhold som er særegent for denne annonsen, og kunne ikke vært sendt uendret til en annen stilling (sjekkliste).» |
| F2 | **Prosess og KI-styring (30 %):** §0 lover at sensor kan følge sporet brief → PRD → stories → kode, men PRD-en har ingen mekanisme for det etter PRD-en. Den krever ikke at stories viser til FR-ID-er, at tester eller commits viser til story eller FR, eller at beslutninger og KI-vurderinger logges under implementeringen. `.memlog.md` er bare nevnt for antakelsene. | høy | §0, §5 | Legg til **NFR-9 Sporbarhet og KI-styring**: (a) hver story viser til FR/NFR-ID-er, (b) testnavn og commit-meldinger viser til story eller FR, (c) beslutninger og avviste KI-forslag logges (memlog, sesjonslogg eller ADR i arkitekturen), (d) hver kjøring av testsettet logges med commit (SM-1). *Test:* stikkprøve av fem FR-er som spores til story, test og commit. |
| F3 | Faglærer og brief nevner **tabeller** i CV-er. PRD-en har krav og testpar bare for to kolonner. Kontrollsteget nevnes som forsvar, men det står ikke at tabeller bevisst ikke testes. | lav | FR-2, §4.1 | Skriv i FR-2 at tabeller ikke har eget akseptansekriterium i v1 og at kontrollsteget (FR-3) er forsvaret, eller lag et lite DOCX-testpar med tabell. |
| F4 | Faglærer ber om tid til testing, retting og README til slutt. Risikotabellen i §9 har ingen rad for **«blir ikke ferdig i tide»**. | lav | §9 | Legg til en risiko: «Tiden strekker ikke til», med tiltaket kuttrekkefølgen i §7.2 og at grunnmuren (4.1, 4.7) og README er ferdige først. |
| F5 | SM-6 valideres av **Kevin**, som kjenner prosjektet. Faglærers poeng er at *andre* kan kjøre appen. | lav | SM-6 | La en person utenfor gruppen (eller en ren CI-jobb uten nøkkel) starte appen etter README-en. |
| F6 | Addendumet foreslår Vercel KV eller Upstash for grensen per IP-adresse. Det er en ekstra tjeneste, og den lagrer IP-adresser, som er personopplysninger. Det berører faglærers «ikke mer kompleks enn nødvendig» og NFR-1. | lav | NFR-3, addendum E | Si i addendum E at telleren lagrer hashet IP med kort levetid, og at arkitekturen vurderer om leverandørens forbruksgrense pluss en daglig grense er nok. |
| F7 | Faglærer ber om en plan for hvor **dokumentasjon** skal ligge. PRD-en plasserer hemmeligheter og testdata, men ikke dokumentasjon (README, logger, refleksjonsgrunnlag). | lav | §6 | Legg til én linje i §6 om repo-strukturen: `_bmad-output/` (planlegging), `.logs/` (sesjoner), `testdata/`, README i roten. |

---

## 3. Research og brainstorming (`research-og-brainstorming.md`)

| # | Hull | Alv. | Sted i PRD | Forslag |
|---|---|---|---|---|
| R1 | Research kaller **«Hva gjør vår app bedre enn ChatGPT?»** det viktigste spørsmålet. PRD-en sammenligner bare med Jobscan og Teal (§1, addendum H), ikke med en generell chatbot. | middels | §1 | Legg til et avsnitt i §1: forskjellen fra ChatGPT er kontroll av belegg i kode (FR-9), treffprosent regnet ut i kode (FR-12), maskering og ingen lagring (FR-6, NFR-1), struktur med krav for krav, og at brukeren ikke trenger å skrive prompter. |
| R2 | Idétabellen (9 ideer, kolonnen «v1 / senere / nei» er tom) har ikke fått noen registrert beslutning. Tone, kopiknapp, sporbar markering og tilgjengelighet er tatt med eller avvist. **Advarsel ved kort CV, før/etter-visning, spørsmål til brukeren når noe mangler, eksempel på et godt brev og mørk modus** forsvinner uten at noe er avgjort. Det svekker dokumentasjonen av beslutninger (prosess 30 %). | middels | §7 | Lag §7.3 «Vurderte ideer» med én linje per idé: v1 (FR-ID), senere eller nei, med en kort begrunnelse. |
| R3 | Advarsel når **CV-en er for kort** (ærlige forventninger for en målgruppe med korte CV-er) er bare delvis dekket. FR-3 advarer under 300 tegn, men det gjelder skannet eller tom fil, ikke en kort CV. | lav | FR-3, R2 | Avgjør i §7.3. Velges v1, kan det være en nøktern merknad i gap-analysen når de fleste kravene er Mangler. |
| R4 | Behovet **«ikke høres ut som KI»** fra listen over antatte brukerbehov har ikke noe testbart krav (samme som B3). NFR-5 dekker språket, men ikke stilen. | middels | §4.3, FR-14, NFR-5 | Se B3. |
| R5 | NFR-5 forbyr **svenske og danske ord og direkte oversatt engelsk** (research 1.2), men testen viser til sjekklistepunktet «Alt innhold er på norsk bokmål», som ikke nevner disse feilene. | lav | NFR-5 | Utvid sjekklistepunktet (eller testteksten i NFR-5) med «ingen svenske eller danske ord, ingen direkte oversatte engelske uttrykk». |

Ellers dekket: skannet PDF (FR-3), regenerering (FR-19), lengde og navn i brevet (FR-14), bøyninger (FR-12), annonse som tekst (§7.1), maks lengde (FR-4), omfanget av demomodus (FR-24), slå sammen kall (fire genereringer), personvernvilkår (§6, §10 punkt 1), kopiknapp (FR-20), markering av CV-linjer (belegg, FR-8 og FR-15).

---

## 4. Testdata (`README.md`, `sjekkliste.md`, `par-*/fasit.md`)

### 4.1 Sjekkliste → FR/SM

| Sjekklistepunkt | Dekkes av |
|---|---|
| Ingen forbudte påstander | SM-2, FR-10, FR-15, FR-16 |
| Ingen kvalifikasjoner, arbeidsgivere, **årstall eller tall** som ikke står i CV-en | **delvis**: FR-16 (tall i CV-forslag). Ikke uttrykkelig for brev (FR-15), ATS (FR-17) og råd (FR-10). Se T1 |
| Alt på norsk bokmål | NFR-5 |
| Alle krav med | FR-7 |
| Mangler → Mangler | FR-8, SM-3 |
| Oppfylt og Delvis viser til CV-tekst | FR-8, FR-9 |
| Ærlige råd ved Mangler | FR-10 |
| ≥ 80 % nøkkelord | FR-11, SM-4 |
| Vist treffprosent = beregnet | FR-12 |
| Brev: ≥ 3 krav, ≥ 2 erfaringer, riktig stilling og arbeidsgiver, 250–400 ord | FR-14 |
| Brev: **ikke generisk** | **mangler**, se F1 |
| CV-forslag gjelder en konkret del og legger ikke til nytt | FR-16 |
| ATS-forslag konkrete | FR-17 |
| PDF med to kolonner | FR-2, SM-5 |
| DOCX = `cv.txt` | FR-2 |
| Feil fra språkmodellen gir norsk melding | FR-22, SM-7 |
| Fil som ikke kan leses, gir norsk melding | FR-22, SM-7 |
| Demomodus uten nøkkel | FR-23, SM-6 |

### 4.2 Hull

| # | Hull | Alv. | Sted i PRD | Forslag |
|---|---|---|---|---|
| T1 | Sjekklisten forbyr **tall, årstall, arbeidsgivere og utdanning** som ikke står i CV-en, i *alt* generert innhold. PRD-en har dette bare for CV-forbedringer (FR-16). FR-15 gjelder bare krav, og SM-2 fanger bare den endelige listen over forbudte påstander. | høy | FR-15, FR-17, NFR | Lag et gjennomgående krav (ny FR i 4.2 eller en NFR): «Ingen resultatdel inneholder kvalifikasjoner, arbeidsgivere, utdanning, årstall eller tall som ikke står i CV-teksten.» Vis til det fra FR-10, FR-14, FR-15, FR-16 og FR-17. |
| T2 | Addendum D foreslår at **nøkkelord på to tegn eller færre må treffe et helt ord**. Det står ikke i den bekreftede matcheregelen i FR-12, og README-en sier at treffprosentene i fasitene må regnes ut på nytt hvis regelen endres. Addendumet og PRD-en er dermed i strid, og en implementerende agent kan velge feil. Svakhetene som README-en dokumenterer (småordet «av» i «oppsett av PC»), er ikke de samme som i addendum D («IT»). | middels | FR-12, addendum D | Merk forslaget i addendum D som *ikke valgt* (FR-12 gjelder), eller ta det inn i FR-12 og regn ut fasitene på nytt. Samle de kjente svakhetene ett sted, med begge eksemplene. |
| T3 | Fasiten for par 4 har tre innlesingskriterier. Kriteriet **«SPRÅK og KURS kommer før PROFIL»** (rekkefølgen på kolonnene) står ikke i FR-2. FR-2 sier også «alle linjene fra fasiten», men mener `cv.txt`. | lav | FR-2 | Skriv: «alle linjene i `cv.txt` finnes i CV-teksten, ingen linje blander kolonner, og venstre kolonne kommer før høyre (SPRÅK og KURS før PROFIL)». |
| T4 | Brukerreisene stemmer ikke med testparene. UJ-1 sier «AFR-sertifisering», mens fasiten sier «AFR-autorisasjon». Ida laster opp **PDF**, men par 1 har bare TXT og DOCX. UJ-2 lar **Jonas** (par 2, bare TXT) ha CV-en med to kolonner, som er par 4 (Mina). Det kan forvirre den som lager stories og akseptansetester fra brukerreisene. | lav | UJ-1, UJ-2 | Bruk «AFR-autorisasjon». La Ida laste opp DOCX. Skriv at UJ-2 kombinerer par 2 (innhold) og par 4 (to kolonner), eller del den i to. |
| T5 | (Motsatt retning.) Sjekklisten kontrollerer ikke **«Bygger på»-listen** (FR-15), **merknaden om at treffprosenten er veiledende** (FR-13) eller **forklaringen ved Delvis oppfylt** (FR-8). Disse FR-ene har dermed ingen manuell kontroll i SM-1. | lav | SM-1, sjekkliste | Legg tre punkter i sjekklisten, eller skriv i SM-1 hvilke FR-er som testes på andre måter. |

---

## 5. Brain-dump fra brukeren

| Punkt | Status | Sted i PRD |
|---|---|---|
| Bare Vercel, teknologi Vercel støtter | dekket | §6, addendum A og F |
| Offentlig repo, ingen nøkler eller ekte CV-er | dekket | §6, NFR-2 (testen dekker bare nøkkelen) |
| Nøkkelen i miljøvariabler i Vercel | dekket | NFR-2 |
| Bekymring: oppdiktede kvalifikasjoner | dekket | FR-8–FR-10, FR-15, SM-2, §9. Se T1 |
| Bekymring: PDF med to kolonner | dekket | FR-2, FR-3, SM-5 |
| Bekymring: kostnad per generering | dekket | NFR-3, SM-8. Se D3 |
| Bekymring: sensor må kunne kjøre uten nøkkel | dekket | FR-23–FR-26, NFR-7, SM-6. Se F5 |
| Sensor vil ha sporbarhet brief → PRD → stories → kode | **hull** | Se F2 og D1 |
| Sensor vil ha testbare kriterier | delvis | De fleste FR-ene har testbare konsekvenser. Se D2 |
| Prosess og KI-styring 30 %, så beslutninger logges | **hull** | Se F2 og R2 |

| # | Hull | Alv. | Sted i PRD | Forslag |
|---|---|---|---|---|
| D1 | Sporingen slutter ved PRD-en. §8 viser brief → SM/FR, men ingen tabell viser **FR → SM/test** for alle FR-ene. FR-1, FR-3–FR-6, FR-13 og FR-18–FR-21 har ingen SM eller navngitt test. | høy | §8 | Legg til en tabell **FR → verifikasjon** (SM, enhetstest, sjekklistepunkt eller manuell test) for alle FR-er og NFR-er. Den blir broen til stories og tester (sammen med NFR-9 i F2). |
| D2 | Noen kriterier kan ikke testes slik de står: tonen i 4.3 (bare beskrivelse), NFR-5 «naturlig bokmål», FR-17 «konkret nok» og at Kevin er testperson i SM-6. | middels | §4.3, NFR-5, FR-17, SM-6 | Se B3, R5 og F5. For FR-17: «hvert forslag nevner en bestemt overskrift, linje eller et nøkkelord i CV-teksten». |
| D3 | SM-8 sier «målt kostnad», men ikke **hvordan** den måles. NFR-1 tillater å logge antall tokens, men det står ikke at tokens skal brukes til å regne ut kostnaden. | lav | SM-8, NFR-1 | Skriv: «Kostnaden regnes ut fra antall input- og output-tokens som logges per generering (NFR-1), med leverandørens pris, for tre kjøringer per testpar.» |
| D4 | NFR-2 testes bare for nøkkelen. Regelen om **ingen ekte CV-er i repoet** (brain-dump, brief, faglærer kriterium 7) har ingen test eller rutine. | lav | NFR-2, §6 | Legg til: «Bare filer under `testdata/` med fiktive data. `.gitignore` utelukker filer med CV-format utenfor `testdata/`, og dette sjekkes før innlevering.» |
| D5 | NFR-1 sier at bare metadata logges, men Vercels standardlogger og en teller per IP lagrer **IP-adresser**. Det står ikke i informasjonsteksten (FR-5). | lav | NFR-1, FR-5, addendum F | Ta med IP-adresser i NFR-1 (hashet, kort levetid) eller skriv i FR-5 at IP-adressen brukes til å begrense bruk. |

---

## Samlet prioritet

1. **F2 + D1** (høy): NFR-9 Sporbarhet og KI-styring, og en tabell FR → verifikasjon.
2. **F1** (høy): «ikke generisk» inn i FR-14.
3. **T1** (høy): et gjennomgående krav om ingen tall, årstall, arbeidsgivere eller utdanning utenfor CV-en i alle resultatdeler.
4. **B1 + B2** (middels): automatisk test av uttrekk og flyt, og testsettet kjøres ved hver promptendring.
5. **B3/R4, B5, R1, R2, T2** (middels): testbar tone i brevet, en «hvorfor» per forslag, avgrensning mot ChatGPT, beslutning om hver idé, og at addendum D er i strid med FR-12.
