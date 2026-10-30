---
title: Gjennomgang av UX-spinene (DESIGN.md + EXPERIENCE.md) mot rubrikken
reviewed: 2026-10-30
inputs:
  - DESIGN.md
  - EXPERIENCE.md
  - .memlog.md
  - mockups/key-forberedelse.html
  - mockups/key-resultat-gap.html
  - mockups/key-redigering-brev.html
  - prds/prd-G69-heggdal-skogheim-2026-10-29/prd.md
  - testdata/par-1-butikk-bank/ (cv.txt, annonse.txt, fasit.md), testdata/par-4-tokolonne-hotell/fasit.md
---

# Gjennomgang av UX-spinene

## Samlet vurdering

**Adequate (brukbar kontrakt, men ikke klar for stories uten retting).** Paret er ryddig og har riktig form. Alle tre brukerreisene har flyt med høydepunkt, alle FR-er med grensesnitt (FR-1 til FR-26) har en flate eller tilstand, alle fargetokens har hex, og kontrastpåstandene stemmer når de regnes etter (se Mekaniske notater). Tallene for testpar 1 i skissene stemmer med fasiten (3 av 6 krav, 2 delvis oppfylt, 22 %, 2 av 9 nøkkelord, pålitelig og økonomi funnet), og alle belegg-sitatene står ordrett i `cv.txt`. Skissebrevet har ingen forbudte påstander.

Det er ingen kritiske funn, men fem høye funn bør lukkes før `bmad-create-epics-and-stories`:
1. *Endre CV-tekst* har ingen vei tilbake til resultatet uten en ny kjøring.
2. Det står ikke hva som skjer når en fane som trenger gap-analysen, åpnes før gap-analysen er ferdig eller etter at den feilet.
3. Forslagskortet (to av fire faner) har ingen visuell spesifikasjon og ingen skisse.
4. *Bygger på* viser belegg som ikke ble funnet, gjennomstreket. I skissen er dette en forbudt påstand.
5. Gap-analysen låser tekst som PRD FR-18 sier skal kunne redigeres.

| Kategori | Vurdering |
|---|---|
| 1. Flytdekning | adequate |
| 2. Tokens | adequate |
| 3. Komponenter | thin |
| 4. Tilstander | adequate |
| 5. Skisser | adequate |
| 6. Oppblåsing og overspesifisering | strong |
| 7. Arv fra PRD | adequate |
| 8. Form | strong |
| Ærlighet og innhold mot PRD og fasit | adequate |
| Språk | strong |

Antall funn: 0 kritiske, 5 høye, 18 middels og 26 lave.

## 1. Flytdekning (EXPERIENCE.md)

**Vurdering: adequate.** UJ-1, UJ-2 og UJ-3 har hver en navngitt hovedperson, nummererte steg og et markert høydepunkt. UJ-1 og UJ-2 har feilvei. UJ-3 trenger ingen, fordi FR-26 er en del av selve flyten. Avstemming av FR mot flater: FR-1 til FR-6 → Forberedelse. FR-7 til FR-13 → Gap-analyse. FR-14 og FR-15 → Søknadsbrev. FR-16 og FR-17 → Forslagskort. FR-18 til FR-21 → verktøylinje, dialoger og tilstandene «Redigert» og «Utdatert». FR-22 → seks rader i State Patterns. FR-23 til FR-26 → demobanner, *Prøv med eksempel* og demotilstander. Ingen FR mangler en flate.

- **[high]** *Endre CV-tekst* fører til Forberedelse, men ingenting fører tilbake til Resultat uten at brukeren trykker *Analyser* og starter en ny kjøring (EXPERIENCE.md IA linje 25–30, State Patterns «Tilbake fra *Endre CV-tekst*» linje 107). Et feilklikk gjør altså at brukeren mister tilgangen til resultatene og redigeringene, eller at det koster fire nye genereringer (NFR-3). *Fix:* Legg til en knapp *Tilbake til resultatet* på Forberedelse så lenge en kjøring finnes og CV-teksten og annonsen ikke er endret. Si hva som skjer med knappen når tekstene er endret (for eksempel: skjules, eller viser at resultatet er basert på forrige tekst).
- **[high]** Det står ikke hva som skjer når brukeren åpner *Søknadsbrev*, *CV-forbedringer* eller *ATS-forslag* mens gap-analysen fortsatt genereres, eller etter at den feilet. FR-18 sier at disse delene bruker kategoriene fra gap-analysen (State Patterns «Analyserer» og «Genererer fane» linje 100–101, Component Patterns «Faner» linje 79). Dette avgjør køen og avhengighetene i arkitekturen. *Fix:* Bestem og skriv ned at fanen venter med teksten «Venter på gap-analysen …» og starter av seg selv når den er ferdig, og at fanen viser «Gap-analysen må være ferdig først» med *Prøv igjen* på gap-analysen hvis den feilet.
- **[medium]** UJ-2 i spinen dekker ikke PRD-ens ærlighetsbeat for søknadsbrevet og tysk (EXPERIENCE.md linje 172). PRD UJ-2 sier at verken brevet eller CV-forslagene skal si at Mina kan Opera *eller snakker godt tysk*. *Fix:* Utvid steg 5: «Hun åpner *Søknadsbrev* og *CV-forbedringer*. Ingen av dem sier at hun kan Opera eller snakker godt tysk.»
- **[medium]** Det står ikke hvor og i hvilken komponent forklaringen i FR-26 vises (State Patterns «Demomodus» linje 108, UJ-3 steg 5 linje 182). Det kan være en dialog, en `Alert` under knappen eller en toast. *Fix:* Velg én, for eksempel en `Alert` rett over *Analyser* med teksten og knappen *Prøv med eksempel*, og skriv inn ordlyden.
- **[medium]** *Prøv med eksempel* fyller inn demoeksempelet uten at det står hva som skjer med CV-tekst, annonse eller resultater som brukeren allerede har (Component Patterns linje 78). Dette kan gi tap av data, som FR-22 ellers beskytter mot. *Fix:* Bruk samme bekreftelsesdialog som *Ny analyse* når feltene ikke er tomme, eller skriv eksplisitt at innholdet overskrives uten spørsmål og hvorfor.
- **[low]** Varianten i UJ-1 viser ikke FR-3 og FR-10 godt (EXPERIENCE.md linje 164). «Hjelper kunder med betalingsterminalen» dekkes allerede av «tok imot kontanter og kortbetaling» i `cv.txt` og endrer ingen kategori. *Fix:* Bruk en erfaring som løfter et Delvis oppfylt- eller Mangler-krav, for eksempel noe som gjelder «Gode digitale ferdigheter», og si hvilken kategori som endres i den nye kjøringen.

## 2. Tokens (DESIGN.md)

**Vurdering: adequate.** Alle 12 fargetokens har hex. Alle `{…}`-referanser i prosa og komponenter finnes i frontmatter: `colors.primary`, `colors.primary-foreground`, `colors.*-bg`, `rounded.full`, `typography.page-title`, `typography.section-title`, `typography.letter`, `typography.hit-rate`, `spacing.content-max` (også i EXPERIENCE.md linje 137) og `spacing.letter-max`. Kontrasten er oppgitt for primær mot hvitt, for alle kategoriparene og for belegg. Tallene stemmer.

- **[medium]** `keyword-chip-missing` har verdier som ikke kan slås opp: `'muted-foreground (shadcn)'` og `'1px dashed border (shadcn)'` (DESIGN.md linje 73–74). En resolver eller en KI-agent får en løs streng, ikke et token. *Fix:* Legg arvede tokens som referanser med merknad, for eksempel `foreground: '{colors.muted-foreground}'` og en kommentar om at den arves fra shadcn. Eller legg inn hex for `muted-foreground` og `border` i `colors`.
- **[medium]** Kontrasten for `muted-foreground` mot `background` (`#FAFAF7`) er ikke oppgitt, selv om den bærer tekst som er viktig for ærligheten: merket «Nedgradert», «veiledende» ved treffprosenten og årsaken under deaktivert *Analyser* (DESIGN.md Colors linje 89–101 og Components linje 139–140). Med shadcn neutral (`#737373`) blir det 4,53:1, altså så vidt over AA. Skissene bruker `#5F6B7A`, som ikke er definert noe sted. *Fix:* Lås `muted-foreground` med hex og oppgi kontrasten mot `background` og hvitt.
- **[medium]** Flere komponenter med egen utforming har ingen tokens: venstrekanten på kravkortet (4 px i kategorifargen), markeringen av plassholdere i brevet, kanten på opplastingsfeltet ved hover og fremdriftslinjen i treffmåleren (DESIGN.md linje 137, 140 og 142). Plassholdermarkeringen har heller ingen farge i prosaen, og skissen bruker `delvis`-fargene. *Fix:* Legg til `requirement-card-*`, `letter-placeholder`, `upload-zone` og `hit-meter` i `components`. Gi plassholderne en egen farge som ikke er en kategorifarge.
- **[low]** Kontrasten er bare oppgitt mot hvitt for primær. Primær på `background` gir 7,06:1, og primær på `primary-soft` (funne nøkkelord, demobanner) gir 6,35:1. Ingen av dem er oppgitt (DESIGN.md linje 91–92). *Fix:* Legg til begge tallene.
- **[low]** `belegg-quote.border-left` er en sammensatt streng med en referanse inni (`'3px solid {colors.primary}'`). Prosaen sier at primær brukes til «fokusmarkering av belegg», mens tokenet gir en fast kant (DESIGN.md linje 66 og 91). *Fix:* Del opp i `border-left-width` og `border-left-color`, og rett prosaen til «venstrekant på belegg-sitat».
- **[low]** Kommentaren under `typography` sier «Bare brevteksten overstyres», men fire roller er definert (DESIGN.md linje 23). *Fix:* Skriv «Fire roller overstyres. Resten arves.»
- **[low]** Skissene har faste verdier for `--fg #1C1917`, `--muted #5F6B7A` og `--border #E2E0DA`, som ikke finnes i DESIGN.md, der disse sies å arves fra shadcn (alle tre skissene, linje 11). *Fix:* Bruk shadcn-verdiene i skissene, eller lås verdiene i DESIGN.md.
- **[low]** Kanten på kort og tekstfelt (`#E2E0DA` mot hvitt) har 1,32:1. WCAG 1.4.11 krever 3:1 for grensen rundt et skjemafelt når den trengs for å se feltet (DESIGN.md Elevation linje 123, skissene). *Fix:* Bruk `input`-tokenet til shadcn med høyere kontrast på tekstfeltene, eller oppgi at etiketten og bakgrunnen identifiserer feltet.

## 3. Komponenter

**Vurdering: thin.** Komponentene i DESIGN.md og EXPERIENCE.md dekker hverandre bare delvis.

| Komponent | Visuelt (DESIGN) | Oppførsel (EXPERIENCE) |
|---|---|---|
| Personvernboks, Opplastingsfelt, Kravkort, Belegg-sitat | ja | ja |
| Treffmåler / Nøkkelordbrikke | ja | ja (som «Treffmåler og nøkkelordliste») |
| Kategorimerke, Merke «nedgradert» | ja | inne i Oppsummering og Kravkort |
| Demobanner | ja | **nei** (bare i State Patterns) |
| Forslagskort | **nei** | ja |
| Brevfelt, *Bygger på* | **nei** (bare typografi og bredde) | ja |
| Oppsummering, Verktøylinje | **nei** | ja |
| Faner (merket «Redigert», spinner) | **nei** | ja |
| Banner for utdatert fane | **nei** | **nei** (bare i State Patterns) |
| CV-tekstfelt, Annonsefelt, Avkrysning, Bekreftelsesdialog | arvet fra shadcn | ja |

- **[high]** Forslagskortet er hovedkomponenten i *CV-forbedringer* og *ATS-forslag*, to av fire resultatdeler, men har ingen rad i DESIGN.md Components og ingen skisse (EXPERIENCE.md linje 87, .memlog.md linje 25). Det står ikke hvordan «Gjelder», «Forslag» og «Hvorfor» skal se ut, hva som er redigerbart, og hvordan et ATS-forslag uten belegg-sitat («Gjelder» som overskrift) vises. *Fix:* Legg til en rad: shadcn `Card` uten kategorikant, «Gjelder» som `belegg-quote` eller som overskrift i `muted-foreground`, «Forslag» som `Textarea`, «Hvorfor» som redigerbar tekst i liten skrift. Lag gjerne en enkel fjerde skisse.
- **[medium]** Brevfeltet og *Bygger på* har ingen rad i DESIGN.md Components (DESIGN.md linje 109 og 116 dekker bare skrift og bredde). Plassholdermarkeringen og den gjennomstrekede tilstanden har ingen visuell spesifikasjon. *Fix:* Legg til rader for begge. Se også det høye funnet om *Bygger på* under Ærlighet.
- **[medium]** Merket «Redigert» og spinneren i fanetittelen og banneret «Basert på forrige analyse.» har ingen visuell rad, og banneret har heller ingen oppførselsrad (EXPERIENCE.md linje 79, 105–106). *Fix:* Legg til «Fanemerke» og «Banner for utdatert fane» i begge filene, for eksempel shadcn `Alert` i standardvariant med knappen *Generer på nytt*.
- **[low]** Oppsummering og Verktøylinje har bare oppførsel (EXPERIENCE.md linje 80–81). *Fix:* Én linje i DESIGN.md som sier at de er satt sammen av `Card`, kategorimerker og `Button`, og hvilken knapp som er primær.
- **[low]** Demobanneret har ingen oppførselsrad (EXPERIENCE.md linje 108). Det står ikke om det kan lukkes, og om det vises på begge flatene. *Fix:* Legg til en rad: kan ikke lukkes, vises øverst på begge flatene.
- **[low]** Navnene er ikke like: «Treffmåler» (DESIGN) og «Treffmåler og nøkkelordliste» (EXPERIENCE), «Primærknapp» (DESIGN) og «*Analyser*» (EXPERIENCE). *Fix:* Bruk samme radnavn i begge filene.

## 4. Tilstander

**Vurdering: adequate.** Forberedelse har tilstandene tom, leser fil, kort CV-tekst, feil format eller størrelse, fil kan ikke leses, utenfor lengdegrensene, tilbake fra *Endre CV-tekst*, demomodus og grense nådd. Resultat har analyserer, genererer fane, feil eller tidsavbrudd, ugyldig svar, grense nådd, redigert, utdatert og demomodus. Alle seks feiltilfellene i FR-22 er med. Hullene gjelder tomme tilstander og innholdet i noen tilstander.

- **[medium]** Det står ikke hva som vises når en kategorigruppe er tom, for eksempel null Oppfylt (sannsynlig for testpar 3, Sara) (Component Patterns «Kravkort» og «Oppsummering» linje 81–82). *Fix:* Skjul gruppen og vis 0 i oppsummeringen, eller vis en linje som «Ingen krav er oppfylt ut fra CV-teksten.» Velg én.
- **[medium]** Innholdet i kortet for et nedgradert krav er ikke spesifisert (EXPERIENCE.md linje 82). FR-9 sier at belegget ikke vises, og FR-10 krever et råd for hvert Mangler-krav, men språkmodellen har laget en forklaring eller ingenting, ikke et råd. *Fix:* Bestem en fast tekst fra koden for nedgraderte krav, for eksempel «Fant ikke belegg i CV-teksten. Har du denne erfaringen, trykk *Endre CV-tekst* og legg den inn.», og si at forklaringen fra språkmodellen ikke vises.
- **[medium]** Det står ikke hva *Kopier* kopierer i *Gap-analyse og nøkkelord*, *CV-forbedringer* og *ATS-forslag*, som er strukturerte data og ikke én tekst (Component Patterns «Verktøylinje» linje 80). *Fix:* Gi formatet for ren tekst per fane, for eksempel «Krav — Kategori — belegg — forklaring eller råd» per linje, og si om treffprosent og nøkkelord tas med.
- **[medium]** Dialogen om overskriving ved *Analyser* etter *Endre CV-tekst* gjelder alle resultatdeler, men ordlyden er bare gitt for én fane (EXPERIENCE.md linje 107 og 164, key-redigering-brev.html linje 86–88). *Fix:* Skriv ordlyden for begge tilfellene: én fane (FR-19) og ny kjøring, som lister de redigerte fanene og sier at alle resultatdelene erstattes (FR-3).
- **[medium]** Det står ikke når fødselsnummeret maskeres: ved innlesing, mens brukeren skriver eller når *Analyser* trykkes. Det gjelder også et nummer som limes inn etter innlesing (Component Patterns «CV-tekstfelt» linje 74). FR-6 krever både at maskeringen vises i kontrollsteget og at den skjer før sending. *Fix:* Bestem at maskering skjer ved innlesing og ved innliming eller endring i feltet, og at koden i tillegg maskerer ved *Analyser*.
- **[medium]** Toppfeltet viser stilling og arbeidsgiver fra annonsen, men det står ikke hvor de kommer fra eller hva som vises før gap-analysen er ferdig, eller når den feiler (EXPERIENCE.md linje 40). Hvis de kommer fra språkmodellen, må de inn i svarskjemaet. *Fix:* Si at de er felt i svaret fra gap-analysen, og at toppfeltet viser «Resultat» eller et skjelett til de finnes.
- **[low]** Tomme tilstander mangler for *CV-forbedringer* og *ATS-forslag* med null forslag (SM-C3 sier at få forslag er greit) og for *Bygger på* når alle beleggene ble fjernet. *Fix:* Én rad hver i State Patterns.
- **[low]** Det står ikke om *Kopier* og *Generer på nytt* er deaktivert mens fanen genereres eller etter feil, eller hva som skjer hvis utklippstavlen ikke er tilgjengelig. *Fix:* Deaktivert under generering. Toast «Kunne ikke kopiere. Merk teksten og kopier selv.» ved feil.
- **[low]** Ordlyden i dialogen for *Ny analyse* er ikke gitt (IA linje 28). *Fix:* For eksempel «Tømme alt? CV-teksten, annonsen og alle resultatdelene blir slettet.» med *Avbryt* og *Tøm og start på nytt*.
- **[low]** Det står ikke hvilken årsak som vises under deaktivert *Analyser* når flere grenser er brutt samtidig (linje 77). *Fix:* Vis den første i leserekkefølgen: CV-tekst, annonse, avkrysning.

## 5. Skisser

**Vurdering: adequate.** Alle tre filene i `mockups/` er lenket i EXPERIENCE.md (IA linje 45). At spinene vinner ved konflikt, står én gang i EXPERIENCE.md (linje 12) og i kommentaren øverst i hver skisse. Fanenavn, knappenavn, tall og fargene for primær, kategorier og belegg stemmer med spinene. Avvikene er disse:

- **[medium]** Kategorimerkene i oppsummeringen på mobil viser bare ikon og tall («✓ 3», «◐ 2», «○ 1») uten ord (key-resultat-gap.html linje 144). Dette bryter med DESIGN.md Do's (linje 150) og EXPERIENCE.md Accessibility («Kategorien formidles alltid med ord», linje 125). *Fix:* Bruk «Oppfylt 3» og så videre, også på mobil. Bryt linjen ved behov.
- **[medium]** Kategorifargene brukes utenfor kategorier: advarselen om kort CV-tekst bruker `delvis`/`delvis-bg` (key-forberedelse.html linje 46), og plassholderne i brevet bruker de samme fargene (key-redigering-brev.html linje 33). DESIGN.md sier at kategorifargene «brukes bare på kategorimerker og venstrekanten på kravkort, aldri som pynt» (linje 94). *Fix:* Bruk shadcn `Alert` for advarselen og en egen nøytral markering for plassholdere, eller endre regelen i DESIGN.md.
- **[low]** Notatet i kontrollsteget bruker `primary-soft` (key-forberedelse.html linje 35), mens DESIGN.md sier at `primary-soft` bare brukes på funne nøkkelord og demobanneret (linje 92). *Fix:* Utvid regelen eller bruk `muted`.
- **[low]** Annonsepanelet har tittelen «Stillingsannonse» (key-forberedelse.html linje 100). Ordlisten sier **Annonse** og forbyr synonymer. *Fix:* «Annonse».
- **[low]** Kravkortene i skissen har ikke kategorimerke på kortet, bare i gruppeoverskriften (key-resultat-gap.html linje 84–121), mens DESIGN.md linje 137 sier «Øverst kravteksten og kategorimerket». *Fix:* Velg én løsning og skriv den inn i DESIGN.md. Merke i gruppeoverskriften holder hvis kortene alltid står i gruppen.
- **[low]** Mangler-kravet heter «Autorisasjon som finansiell rådgiver (AFR)» i skissen (key-resultat-gap.html linje 119), men «AFR-autorisasjon» i flyten (EXPERIENCE.md linje 158) og i fasiten. *Fix:* Bruk samme ordlyd.
- **[low]** Ikonknappene på mobil er 40 × 40 px (key-resultat-gap.html linje 58). Spinen krever minst 44 × 44 px (EXPERIENCE.md linje 131). *Fix:* 44 px i skissen.
- **[low]** CV-teksten i kontrollsteget er forkortet. Tellerne stemmer ikke: «1 214» tegn mot 642 i feltet, og «812» mot 602 (key-forberedelse.html linje 97 og 119). Sitater i de andre skissene («Microsoft Office (Word, Excel, PowerPoint) – grunnleggende», «Førte oversikt over medlemskontingent i et regneark») står ikke i den viste CV-teksten. *Fix:* Bruk hele `cv.txt` og `annonse.txt`, eller merk feltet som forkortet.
- **[low]** Kommentaren i brevskissen sier at den viser tilstanden «utdatert fane», men den vises ikke (key-redigering-brev.html linje 8). *Fix:* Fjern det fra kommentaren eller vis banneret.

## 6. Oppblåsing og overspesifisering

**Vurdering: strong.** Begge filene er korte og arver shadcn i stedet for å gjenta det. Der PRD-en gjentas, er det grenser og tekster som grensesnittet trenger (5 MB, 200–8 000 og 15 000 tegn, innholdet i FR-5), og det er nyttig for den som skal bygge.

- **[low]** Foundation gjentar NFR-1, og UJ-3 steg 3 («treffprosenten regnes i kode») beskriver ikke noe brukeren ser (EXPERIENCE.md linje 18 og 180). *Fix:* Vis til NFR-1. Erstatt steget med det Marit ser, for eksempel at 22 % står ved nøkkelordene.

## 7. Arv fra PRD

**Vurdering: adequate.** Fanenavnene er nøyaktig som i PRD §3 og står i riktig rekkefølge. Kategoriene, kontrollsteg, CV-tekst, belegg, kjøring, demomodus, demoeksempel og språkmodell brukes som i ordlisten. EXPERIENCE.md sier dette eksplisitt (linje 12).

- **[high]** Gap-analysen låser kravtekst, kategori, belegg og hele Oppfylt-kortet, slik at bare forklaring og råd kan redigeres (EXPERIENCE.md linje 82 og 187). PRD FR-18 er ferdig og avklart av gruppen 2026-10-30, og sier «All tekst i resultatdelene vises i redigerbare felt». Briefens suksesskriterium 6 er «Alt kan redigeres». Avviket er merket `[ANTAKELSE]`, men utsatt til stories. Da får en KI-agent to kilder som sier ulike ting om et krav som skal verifiseres. *Fix:* Avgjør det nå. Enten oppdaterer gruppen FR-18 i PRD-en (med begrunnelsen: kategori og belegg er kontrollert i kode), eller så gjør spinen hele kortet redigerbart og lar treffprosenten og kontrollen av belegg bygge på den genererte versjonen.
- **[medium]** Stemmeregelen sier at appen ikke kaller seg «vi», med henvisning til PRD §3 (EXPERIENCE.md linje 55). PRD §3 sier ikke noe om «vi», og spinen bruker selv «Vi fant nesten ikke tekst …» og «Vi klarte ikke å lese filen …» (linje 96 og 98, også i key-forberedelse.html linje 146). *Fix:* Skill tydelig mellom regelen fra PRD («språkmodellen», ikke «KI-en») og en egen regel for appen. Skriv deretter tekstene om: «Fant nesten ikke tekst i filen …», «Filen kunne ikke leses …».
- **[low]** FR-9 skriver merket med liten forbokstav («nedgradert: fant ikke belegg i CV-en»), spinene med stor. *Fix:* Bruk stor forbokstav som i spinen og si at ordlyden ellers er lik FR-9, eller følg PRD-en ordrett.

## 8. Form

**Vurdering: strong.** DESIGN.md har seksjonene i kanonisk rekkefølge: Brand & Style, Colors, Typography, Layout & Spacing, Elevation & Depth, Shapes, Components og Do's and Don'ts. EXPERIENCE.md har alle seksjonene fra eksempelet (Foundation til Key Flows) og i tillegg «Åpne punkter», som er nyttig.

- **[low]** Frontmatter i DESIGN.md har nøklene `status`, `created` og `updated`, som ikke står i spesifikasjonen. EXPERIENCE.md bruker `title`, ikke `name` som i eksempelet. Begge har `status: draft`. *Fix:* Ufarlig. Sett `status: final` når de høye funnene er lukket.

## Ærlighet og innhold mot PRD og fasit

**Vurdering: adequate.**

Verifisert og i orden:
- Oppsummeringen «Du dekker 3 av 6 krav. 2 er delvis oppfylt.», kategoriene per krav, 22 %, «2 av 9 nøkkelord» og funnet/ikke funnet per nøkkelord stemmer med `par-1-butikk-bank/fasit.md`.
- Alle seks belegg-sitatene i gap-skissen og de fire gyldige i *Bygger på* står ordrett i `cv.txt`.
- Rådet for AFR foreslår ikke å påstå autorisasjonen og sier ikke at Ida «holder på med den». Forklaringene for Delvis oppfylt er ærlige.
- Skissebrevet bryter ingen av de forbudte påstandene: ingen AFR, ingen bankerfaring, bachelor «går andre året», Office «grunnleggende» og ingen oppdiktede tall. Mangler-kravet nevnes bare som interesse (FR-15).
- UJ-2 stemmer med fasiten for par 4: bookingsystemer/Opera er Mangler, engelsk og tysk er Delvis oppfylt, og rådet peker på kassasystem.

Funn:
- **[high]** *Bygger på* viser belegg som ikke ble funnet, gjennomstreket. I skissen står «Erfaren med kundeservice i bank», som er en forbudt påstand for par 1 («At Ida har jobbet i bank, finans eller kundesenter») (key-redigering-brev.html linje 79–80, EXPERIENCE.md linje 86). Teksten står på skjermen, kan bli med når brukeren kopierer, og går imot prinsippet i FR-9 om at «Belegget som ikke ble funnet, vises ikke». FR-15 sier «fjernes fra listen og merkes». *Fix:* Vis ikke teksten. Vis i stedet en samlelinje under listen: «1 belegg ble fjernet fordi det ikke står i CV-teksten.» Endre EXPERIENCE.md linje 86 og skissen.
- **[medium]** Personvernboksen nevner ikke at en leverandør i USA betyr overføring ut av EØS (PRD §6, «skal stå tydelig i informasjonsteksten»). Skissen skriver «Fjern gjerne …», som er svakere enn «bør fjerne» i FR-5 (EXPERIENCE.md linje 72, key-forberedelse.html linje 68–70). *Fix:* Legg en mal i Component Patterns med plass til `{leverandør}`, `{land}` og en setning om tredjelandsoverføring når det gjelder. Skriv «Du bør fjerne …».
- **[low]** «… og til å møte folk på en hyggelig måte» i skissebrevet er en liten utvidelse av «liker å jobbe med mennesker» (key-redigering-brev.html linje 67). Det er ikke en forbudt påstand, men skissen blir et forbilde for prompten. *Fix:* «… og jeg liker å jobbe med mennesker.»
- **[low]** Ordtelleren sier 173 ord. Brevet har 179 ord, eller 173 uten plassholdere (key-redigering-brev.html linje 59). *Fix:* Si i Component Patterns om plassholdere telles med.

## Språk

**Vurdering: strong.** Bokmålet er naturlig, kort og konsekvent i du-form. Stemmetabellen er god, og tekstene for feil følger regelen «hva skjedde, hva kan du gjøre».

- **[low]** Noen anglisismer og uklare ord: «spinene» (kommentarene i skissene), «toast «Kopiert»» (EXPERIENCE.md linje 80) og «rettesider i skrivekurs» (linje 143). *Fix:* «spesifikasjonene» eller «DESIGN.md og EXPERIENCE.md», «kort melding (toast)» og «retting av tekster i skrivekurs».

## Mekaniske notater

- **Kontrast regnet etter (WCAG):** `#1F5F5B` mot `#FFFFFF` 7,38:1 (oppgitt 7,4 ✓), mot `#FAFAF7` 7,06:1, mot `#E6F0EF` 6,35:1. Oppfylt 5,76:1 (oppgitt 5,8 ✓). Delvis oppfylt 6,27:1 (oppgitt 6,3 ✓). Mangler 6,41:1 (oppgitt 6,4 ✓). Belegg 10,16:1 (oppgitt 10,2 ✓). `#737373` mot `#FAFAF7` 4,53:1 og `#71717A` mot `#FAFAF7` 4,62:1 (ikke oppgitt). Kant `#E2E0DA` mot hvitt 1,32:1.
- **Tokenreferanser:** 0 som ikke kan slås opp blant `{…}`-referansene. 2 løse strenger i `keyword-chip-missing`.
- **Fasit, par 1:** 6 krav (3 Oppfylt, 2 Delvis oppfylt, 1 Mangler). 9 nøkkelord, 2 funnet. 22 %. Alt stemmer i skissen og i flyten.
- **Skisseteksten:** CV-feltet har 642 tegn, annonsefeltet 602. `cv.txt` har 1 130 tegn og `annonse.txt` 733.
- **Antall funn:** 0 kritiske, 5 høye, 18 middels og 26 lave.
- DESIGN.md, EXPERIENCE.md og skissene er ikke endret av denne gjennomgangen.
