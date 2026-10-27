---
title: Research og brainstorming før PRD
created: 2026-10-27
authors: Sondre Skogheim, Kevin Heggdal
status: utkast
---

# Research og brainstorming før PRD

Forberedelse til PRD-arbeidet for AI CV & Job Application Assistant. Bygger på den reviderte product brief-en (`../briefs/brief-G69-heggdal-skogheim-2026-09-17/brief.md`) og tilbakemeldingen fra faglærer.

**Om dokumentet:** Første utkast er laget med KI-støtte (Claude) som en liste over temaer og ideer. Gruppen går gjennom, stryker og legger til før torsdag. Punktene er spørsmål og forslag, ikke beslutninger. Kryss av eller skriv svaret direkte under hvert punkt når det er undersøkt.

---

## 1. Hva vi bør undersøke nærmere

### 1.1 Tekstuttrekk fra CV-er
Tilbakemeldingen peker på at CV-er med kolonner og tabeller ofte gir upålitelig tekstuttrekk.

- [ ] Test noen biblioteker for PDF-lesing med en to-kolonne-CV. Kandidater: `pdfplumber` og `PyMuPDF` (Python) eller `pdf-parse` / `pdfjs-dist` (JavaScript).
- [ ] Test DOCX-lesing: `python-docx` (Python) eller `mammoth` (JavaScript).
- [ ] Hva skjer med en skannet PDF (bilde, ikke tekst)? Skal appen avvise den med en forståelig melding?
- [ ] Lag en to-kolonne-CV i PDF og en DOCX-CV til `testdata/` (gjenstår fra forrige økt).

**Svar/notater:**

### 1.2 Norsk språk i språkmodeller
- [ ] Hvilke modeller skriver godt og naturlig norsk bokmål? Test samme prompt med 2–3 modeller og et par fra `testdata/`.
- [ ] Bruker modellen svenske/danske ord eller direkte oversatte engelske uttrykk?
- [ ] Hvor godt følger modellen instruksen om ikke å dikte opp kvalifikasjoner? Kjør par 2 (IT-support) og se om førerkort eller ITIL dukker opp.

**Svar/notater:**

### 1.3 Kostnad
Fem genereringer per kjøring gir mange API-kall.

- [ ] Finn gjeldende priser for 2–3 aktuelle modeller (pris per million input- og output-tokens).
- [ ] Gjør et grovt overslag: én CV (~600 ord) + én annonse (~300 ord) + fem genereringer. Hva koster én kjøring? Hva koster utvikling og testing totalt?
- [ ] Finnes det studentrabatter eller gratiskvoter?
- [ ] Kan flere genereringer slås sammen i ett kall for å spare kostnad, eller blir kvaliteten dårligere?

**Svar/notater:**

### 1.4 Personvern og vilkår
- [ ] Hva sier vilkårene til de aktuelle leverandørene om data sendt via API: brukes det til trening, og hvor lenge lagres det?
- [ ] Hvor behandles dataene (EU/EØS eller USA)? Har det betydning for oss under GDPR?
- [ ] Hva bør informasjonsteksten til brukeren før opplasting si?

**Svar/notater:**

---

## 2. Spørsmål som fortsatt er uklare

- [ ] **Teknologi:** Python (f.eks. FastAPI/Flask/Streamlit) eller JavaScript/TypeScript (f.eks. Next.js)? `.gitignore` er satt opp for begge. Hva kan vi best fra før?
- [ ] **AI-modell:** Hvilken leverandør og modell? (Avgjøres i arkitekturen, men research i 1.2–1.4 gir grunnlaget.)
- [ ] **Regenerering:** Skal brukeren kunne generere én del på nytt (f.eks. bare søknadsbrevet), eller hele analysen?
- [ ] **Søknadsbrev:** Standard lengde og tone? Skal det inneholde navn og kontaktinfo fra CV-en automatisk?
- [ ] **Nøkkelord på norsk:** Hvordan håndterer koden bøyninger og sammensatte ord («kundeservice», «kundeservicen», «kundeservicemedarbeider») når treffet beregnes?
- [ ] **Annonse-input:** Bare innliming av tekst, eller også opplasting av annonse som PDF? (Brief sier innliming.)
- [ ] **Lange dokumenter:** Hva er maks lengde på CV og annonse? Hva skjer hvis de er for lange?
- [ ] **Demomodus:** Skal demomodus vise alle fem resultatene for par 1, eller bare kjerneflyten?

**Svar/notater:**

---

## 3. Ideer og funksjoner som bør diskuteres

Ingen av disse er besluttet. Vurder hver mot omfanget i brief-en: passer den i v1, senere, eller aldri?

| Idé | Hvorfor den kan være nyttig | Mot | v1 / senere / nei |
|---|---|---|---|
| Velg tone på søknadsbrevet (formell / personlig) | Ulike bransjer forventer ulik tone | Én innstilling til å teste | |
| Advarsel når CV-en er for kort | Målgruppen har ofte kort CV; gir ærlig forventning | Må definere hva «for kort» er | |
| «Hvorfor?»-forklaring per forslag | Brukeren lærer hva arbeidsgivere ser etter, og stoler mer på forslagene | Mer tekst på resultatsiden | |
| Markering av hvilke CV-linjer som dekker hvilke krav | Gjør gap-analysen visuell og sporbar | Mer kompleks UI | |
| Sammenligne før/etter for CV-forbedringer | Lett å se hva som er endret | Mer UI-arbeid | |
| Spørsmål til brukeren når noe mangler («Har du erfaring med X som ikke står i CV-en?») | Bedre resultat uten å dikte opp | Gjør flyten lengre; brukeren kan svare usant | |
| Kopier-knapp per fane | Enkel måte å få ut teksten på siden eksport ikke er med | Lite | |
| Eksempel på godt norsk søknadsbrev som referanse | Hjelper studenter som aldri har skrevet søknad | Må lages og vedlikeholdes | |
| Mørk modus / tilgjengelighet | God UX og universell utforming | Ikke kjerneverdi | |

**Notater fra diskusjonen:**

---

## 4. Hvilke behov brukerne kan ha

Snakk med 2–3 medstudenter før torsdag (5–10 min hver). Bruk gjerne disse spørsmålene:

1. Når søkte du jobb sist? Hva var vanskeligst?
2. Tilpasser du søknaden til hver stilling, eller bruker du samme? Hvorfor?
3. Har du brukt ChatGPT eller lignende til å skrive søknad? Hva var bra og dårlig?
4. Ville du stolt på et søknadsbrev skrevet av KI, eller ville du skrevet om det?
5. Vil du helst ha ferdig tekst eller forslag og tips du bruker selv?
6. Hvor komfortabel er du med å laste opp CV-en til en nettside som bruker KI?
7. Hva ville fått deg til å bruke verktøyet igjen?

**Antatte behov vi vil sjekke:**
- Forstå hva annonsen egentlig ber om
- Se hvilke av egne erfaringer som er relevante (særlig deltidsjobber og verv)
- Spare tid uten at søknaden blir generisk
- Ikke høres ut som KI
- Trygghet for at CV-en ikke lagres eller misbrukes

**Funn fra samtalene:**

| Person (anonymt) | Studie / situasjon | Viktigste funn |
|---|---|---|
| | | |
| | | |
| | | |

---

## 5. Lignende løsninger vi kan lære av

Addendumet beskriver Teal, Rezi, Jobscan, Kickresume og Enhancv. Neste steg er å *prøve* noen av dem, ikke bare lese om dem.

- [ ] Prøv Jobscan (gratisversjon) med par 1 fra `testdata/`. Hvordan vises treffprosenten og manglende nøkkelord?
- [ ] Prøv Teal eller Kickresume. Hvordan er resultatsiden bygd opp? Hva er forvirrende?
- [ ] Prøv ChatGPT eller en annen generell chatbot med samme CV og annonse. Hva gjør vår app bedre enn det? Dette er det viktigste spørsmålet å kunne svare på.
- [ ] Finnes det norske alternativer (f.eks. hos karrieresentre, NAV eller jobbportaler)?

**Hva vi vil kopiere / unngå:**

---

## 6. Hvor vi trenger mer informasjon før beslutninger

| Beslutning | Hva vi trenger å vite | Hvor vi finner det | Status |
|---|---|---|---|
| Teknologi | Hva vi begge kan, hva Claude Code håndterer godt | Diskusjon i gruppa | |
| AI-modell | Norsk kvalitet, pris, vilkår | Research 1.2–1.4 | |
| PDF-bibliotek | Hvor godt to-kolonne-CV-er leses | Test i 1.1 | |
| Nøkkelordmetode | Hvordan håndtere norske bøyninger | Test med `testdata/` | |
| Antall API-kall per kjøring | Kvalitet vs. kostnad ved å slå sammen kall | Test i 1.3 | |

---

## 7. Brainstorming-temaer til torsdag

- Hvordan ser den ideelle resultatsiden ut? Skisser på papir hver for oss, og sammenlign.
- Hva er «godt nok» for v1? Hvilket minimum må til for at vi er fornøyde?
- Hvordan kan vi vise sensor at KI-en ikke dikter opp noe? (Testsettet er en start.)
- Hvordan fordeler vi arbeidet mellom oss to?
- Hva er den største risikoen for at prosjektet ikke blir ferdig, og hva gjør vi med den?
