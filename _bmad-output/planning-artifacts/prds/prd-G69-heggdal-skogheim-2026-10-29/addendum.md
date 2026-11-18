---
title: Addendum til PRD — AI CV & Job Application Assistant
created: 2026-10-29
updated: 2026-11-18
---

# Addendum til PRD

Dette er tekniske forslag og bakgrunn som ikke hører hjemme i PRD-en, men som arkitekturfasen (`bmad-architecture`) bør vurdere. Ingenting her er besluttet i PRD-en. Arkitekturen (`ARCHITECTURE-SPINE.md`) gjelder foran forslagene her.

## A. Forslag til teknologi

**Anbefaling: Next.js (App Router) med TypeScript, publisert på Vercel.**
- Frontend og API-ruter publiseres samlet i ett prosjekt.
- Vercels anbefalte løsning for strømming fra språkmodeller (AI SDK, `streamText`) fungerer i App Router-ruter. Pages Router støtter ikke strømming.
- PDF og DOCX kan leses i nettleseren med JS-biblioteker. Da sendes bare tekst til serveren (FR-2, NFR-4), og vi unngår 4,5 MB-grensen og `413 FUNCTION_PAYLOAD_TOO_LARGE`.
- Én kodebase og ett språk passer to utviklere.

**Alternativ:** Vite/React og Python FastAPI på Vercel. Fordelen er bedre PDF-biblioteker i Python (pdfplumber, PyMuPDF). Ulempene er to språk og at filene må sendes til serveren. PyMuPDF har AGPL-lisens.

## B. Innlesing av tekst (FR-2, FR-3)
- **PDF:** `pdfjs-dist`. `getTextContent()` gir posisjonen til hvert tekstelement (`transform[4]` er x, `transform[5]` er y). Forslag til regel for to kolonner: finn et vertikalt mellomrom uten tekst nær midten av siden, del elementene i venstre og høyre kolonne, og sorter hver kolonne etter y og så x. Uten slikt mellomrom sorteres hele siden etter y og x. Testes på testpar 4.
- **DOCX:** `mammoth` (`extractRawText`).
- **TXT:** lese direkte, som UTF-8.
- **Skannet PDF:** gir under 300 tegn og fører til advarselen i FR-3. Ingen OCR.

## C. Modul for språkmodellen (NFR-6)
- Alle prompter og kall ligger i én modul, for eksempel `lib/llm/`, med én funksjon per resultatdel: `analyseGap`, `skrivSoknadsbrev`, `foreslaCvForbedringer` og `foreslaAts`.
- Modulen har to implementasjoner av samme grensesnitt: en ekte klient og en mock-klient som leser lagrede svar fra `testdata/par-1-butikk-bank/demo-svar/`. Mock-klienten velges automatisk når nøkkelen mangler (demomodus) og i tester.
- **Strukturert svar (JSON):** gap-analysen returnerer for eksempel `{ krav: [{ tekst, kategori, belegg, forklaring, raad }], nokkelord: [{ tekst, kravIndeks }] }`, der `kravIndeks` peker på annonsekravet nøkkelordet hører til, eller er `null` (FR-11, AD-14). Svaret valideres mot et skjema, for eksempel med zod. Ugyldig svar fører til FR-22.
- **Instrukser i prompten:**
  - Bruk bare fakta fra CV-teksten.
  - Hver påstand skal ha et belegg sitert ordrett.
  - Ved tvil velges svakeste kategori.
  - Svar på bokmål.
- **Lav temperatur,** for eksempel 0–0,3.
- **Grunnlag for kontrollen i kode (FR-9):** forskning (arXiv 2607.01457, preprint med syntetiske CV-er) fant at instrukser i prompten alene holder for sterke modeller ved lav temperatur. Med høyere temperatur eller svakere modeller trengs i tillegg deterministiske kontroller. Kontrollen i kode er billig forsikring.

## D0. Normalisering for kontroll av belegg (FR-9)
```
normaliserBelegg(s) =
  Unicode-normalisering (NFC), små bokstaver
  fjern alt mellomrom og alle linjeskift
  fjern listetegn (• ▪ ‣ ◦ *), bindestreker og tankestreker (- ‐ – —)
  fjern anførselstegn og apostrofer (« » " “ ” „ ' ‘ ’)
gyldig(belegg) = normaliserBelegg(belegg) ikke er tom og er en delstreng av normaliserBelegg(CV-tekst)
```

Hvorfor alle bindestreker fjernes og ikke bare den ved linjeskift (`[ANTAKELSE]` i FR-9): et sammensatt ord som «IT-brukerstøtte» kan bli delt etter bindestreken over to linjer i en PDF. Fjernes bare bindestreken før linjeskiftet, blir CV-teksten «itbrukerstøtte» mens belegget blir «it-brukerstøtte», og et riktig belegg avvises. Å fjerne alle bindestreker gjør kontrollen litt løsere («kunde-service» = «kundeservice»), men endrer ikke ordene eller rekkefølgen. Faglærers forslag (2026-11-12) var å fjerne bindestrek bare ved linjeskift.

`normaliser` i `lib/kjerne` (story 1.6) fjerner i dag bare mellomrom og gjør om til små bokstaver. Den må utvides når kontrollen av belegg bygges (story 2.1). `erDemoeksempel` bruker samme funksjon og blir ikke påvirket på noen måte som betyr noe.

## D. Algoritme for treffprosent (FR-12)
```
normaliser(s) = små bokstaver, erstatt tegnsetting (også bindestrek) med mellomrom (behold æøå), del på mellomrom
funnet(nøkkelord) =
  ordene i nøkkelordet = normaliser(nøkkelord)
  alle ordene w i nøkkelordet: finnes et ord c i normaliser(CV-tekst) der c begynner med w
treffprosent = floor(100 * antall funnet / antall nøkkelord + 0,5)   # rund av halve opp
```

Dette er regelen i FR-12, slik Sondre og Kevin har godkjent den. Treffprosentene i `testdata/*/fasit.md` er regnet ut med den.

Kjente svakheter, som dokumenteres i enhetstester:
- Prefiks gir ikke treff når nøkkelordet er siste ledd i et sammensatt ord. *oppgjør* treffer for eksempel ikke *dagsoppgjør* (par 4).
- Korte småord i nøkkelord med flere ord kan gi falske delvise treff. *av* i «oppsett av PC» treffer *avisbud* (par 2).
- Svært korte nøkkelord, som «IT», kan gi falske treff. *Ikke valgt:* et forslag om at nøkkelord på to tegn eller færre må treffe et helt ord. Tas det inn senere, må FR-12 og alle fasitene oppdateres.

Begge svakhetene dokumenteres i enhetstester.

## E. Kostnadsoverslag (NFR-3)
Grovt overslag per full kjøring med fire genereringer: cirka 12 000 input-tokens og 3 000 output-tokens. Hver generering sender CV-tekst, annonse og instrukser, og brev og forslag ligger på 500–900 tokens hver. Med en rimelig modell gir det noen få øre til noen titalls øre per kjøring. 1 kr per kjøring er dermed en romslig grense. Overslaget må regnes på nytt med prisene til leverandøren vi velger, og kostnaden måles (SM-8).

**Grep som holder kostnaden nede:**
- Genereringer først når fanen åpnes.
- Mock under utvikling.
- Forbruksgrense hos leverandøren.
- Enkel rate-limit i minnet og/eller et dagstak på antall genereringer, uten IP-adresser (NFR-1, NFR-3). Forslaget om grense per IP med Vercel KV eller Upstash er forkastet av gruppen 2026-10-30, fordi IP-adresser og hash av dem er personopplysninger.
- Minnet i en serverløs funksjon på Vercel deles ikke mellom instanser og nullstilles ved kald start. En teller i minnet er derfor bare en myk grense, og forhåndsbetalt kreditt uten automatisk påfylling er det eneste sikre taket. Slik står det nå i NFR-3 og AD-9 (avklart av Sondre 2026-11-18).
- Vurdert og forkastet 2026-11-18: en global dagsteller i Upstash eller Vercel KV (ekstra tjeneste, skurrer mot «ingen lagring»), en tilgangskode for ekte analyse (friksjon for sensor og medstudenter) og bare leverandørens grense uten teller (ingen fartsdemper).
- Sjekk i arkitekturfasen om Vercel selv logger IP-adresser i plattformloggene, og om informasjonsteksten i FR-5 må nevne det.

## F. Vercel
- **Fluid compute på Hobby-planen:** maks 300 s kjøretid. Sett `maxDuration` eksplisitt og strøm svarene.
- **Begrensninger:** request og response maks 4,5 MB.
- **Nøkkel:** miljøvariabel uten prefikset `NEXT_PUBLIC_`.
- **Region:** standard er `iad1` (USA). Vurder en EU-region for funksjonene. Data går uansett til leverandøren.
- **Logging:** ikke logg request bodies. Sjekk at Vercels standardlogger ikke tar med innhold.

## G. Personvern, bakgrunn
- En CV er personopplysninger og kan ha særlige kategorier, som helse.
- En leverandør i USA betyr tredjelandsoverføring. EU–US Data Privacy Framework dekker bare sertifiserte mottakere.
- Offentlige veiledere (KS og Digdir) anbefaler databehandleravtale og advarer mot at data kan brukes til trening.
- Hvordan leverandøren lagrer data, for eksempel Zero Data Retention, og vilkårene for trening må sjekkes i leverandørens egne vilkår. Ikke bruk tjenester som lagrer filer, som Files API.

## H. Bakgrunn om lignende verktøy
- Jobscan, Teal, Rezi og Kickresume gir match-score og lister over nøkkelord. Kritikken er at scorene varierer mye mellom verktøyene og oppmuntrer til nøkkelordstapping. Én kilde påstår at Teal av og til dikter opp detaljer.
- Vi fant ikke noe norsk KI-verktøy fra NAV.
- Vi konkurrerer ikke på funksjoner, men på å være norsk, rettet mot studenter og ærlig. Det begrunner FR-9, FR-13 og motmålene.
- Bransjetall som «21,8 % mot 13,1 %» er markedsføringstall og brukes ikke som fakta.
