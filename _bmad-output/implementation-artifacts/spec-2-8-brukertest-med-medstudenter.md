---
title: 'Story 2.8: Brukertest med medstudenter'
type: 'chore'
created: '2026-11-24'
status: 'in-progress'
route: 'dispatch'
review_loop_iteration: 0
baseline_commit: '31e207b614418235b500cd7b73f64fbc94c93e66'
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-2-context.md'
  - '{project-root}/_bmad-output/implementation-artifacts/brukertest-2-8-testopplegg.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** SM-10 er ikke vist. Den eneste testen, T1 (2026-11-20), var med en kjenning og ikke en medstudent, og den ble kjørt på en eldre prompt. Gruppen vet derfor ikke om høydepunktet i UJ-1 holder før søknadsbrevet bygges i epic 3.

**Approach:**
- Testopplegget rettes.
- Tre medstudenter utenfor gruppen tester på én fast versjon av produksjonen.
- Svarene samles i én resultatfil uten personopplysninger.
- Storyen er ferdig når tre gyldige tester er ført og versjonssjekken er bestått. Svarte færre enn to ja, må også vurderingen være ført.

## Boundaries & Constraints

**Always:**
- **Personopplysninger:** navn, kontaktinformasjon, CV-tekst, sitater fra CV-en og API-nøkler skal aldri stå i repoet, i sesjonsloggene, i commit-meldinger, på GitHub eller i chatten med agenten.
  - Rå svar limes aldri inn i agenten. Den som leder testen, fører bare typer og kategorier for hånd og sletter meldingene etterpå.
  - Ingen liste kobler T-numre til personer.
- **Gyldig test:** alle disse må være oppfylt:
  - Personen er medstudent utenfor gruppen, og den som leder testen, har bekreftet det før testen.
  - Personen har brukt sin egen CV og ikke *Prøv med eksempel*.
  - Personen har fått et ekte resultat.
  - Testen er kjørt på den faste versjonen.
- **Nummerering:** de gyldige testene er T2, T3 og T4. Erstatninger får T5 og videre.
- **Hovedspørsmålet** stilles ordrett: «Fant du en erfaring du ikke hadde tenkt på som relevant?». Svaret føres som ja, nei eller uklart. Uklart betyr at personen ikke gir et tydelig ja eller nei etter oppfølgingen «Ville du sagt ja eller nei?». Uklart teller ikke som ja.
- **Oppfølging etter ja:**
  - «Hva sa appen om den: Oppfylt, Delvis oppfylt eller Mangler?»
  - «Står den i CV-en din? (ja/nei)»
  - Har appen sagt «Mangler», teller svaret som ja etter hovedspørsmålet. Det merkes, telles for seg og vurderes sammen med de andre resultatene.
- **Versjonen** består av tre deler:
  - (a) commit-SHA-en til den aktive produksjonsutrullingen i Vercel
  - (b) verdiene i `LLM_*` i Vercel (bare verdiene, aldri nøkler)
  - (c) den siste commiten på `main` som endret `src`, `package.json`, `package-lock.json`, `next.config.ts`, `vercel.json` eller `tsconfig.json`
  - Kevin eller Sondre fører versjonen og `GET /api/status` i resultatfilen før den første gyldige testen og etter den siste, og etter hver retting av en kritisk feil. Hver testrad viser hvilken versjon personen brukte (V1, V2 osv.).
  - Sjekken er bestått når alt er likt før og etter, eller når hver endring er en dokumentert retting av en kritisk feil med en ført vurdering.
- **Frysen** gjelder koden og innstillingene i Vercel og OpenAI (avtalt med Sondre). Kevin gir Sondre beskjed når testperioden starter og slutter, og beskjeden føres i resultatfilen. Til versjonssjekken etter den siste testen er bestått, gjelder dette:
  - Ingen PR som endrer stiene i (c), flettes til `main`. Logger og dokumentasjon kan flettes så lenge de ikke påvirker hvordan appen virker.
  - Ingen tilbakerulling eller *Promote* i Vercel. Miljøvariablene i Vercel og innstillingene i OpenAI-prosjektet endres ikke.
  - Unntak: en kritisk feil, det vil si en feil som hindrer en testperson i å bruke appen, kan rettes. Rettingen gir en ny versjon som føres. Kevin og Sondre vurderer og fører om tidligere tester må tas på nytt for at resultatene skal kunne sammenlignes.
  - Epic 3 kan utvikles på egne grener. Funnene fra testene, for eksempel hvordan «Mangler» vises, kan føre til at arbeidet i epic 3 må justeres.
- **Før testperioden** tester Sondre produksjonen med *Prøv med eksempel* for å bekrefte at story 2.7 virker. Det er gratis, uten kall til språkmodellen. Resultatet føres i resultatfilen.
- **Opplegget:** Kevin leder T2 og T3 hjemmefra etter punkt 7 i testopplegget. Kevin og Sondre skaffer T4 sammen og avtaler hvem som leder den. Den som leder en test, fører raden i resultatfilen og skriver i sin egen sesjonslogg.
- **Ferdig:** tre gyldige tester er ført, og versjonssjekken er bestått.
  - Minst to ja: SM-10 er oppfylt.
  - Færre enn to ja: Kevin og Sondre vurderer sammen om prompten eller visningen skal endres. Vurderingen føres i resultatfilen og i begge sesjonsloggene før epic 3 flettes.
  - I begge tilfeller settes 2-8 til `done` etterpå.

**Never:**
- Endre noe av versjonen mens testen pågår, utenom rettingen av en kritisk feil. Det gjelder også ordet «Mangler», som vurderes etter testene.
- Be om å få CV-en, eller kjøre testen for personen.
- Endre Sondres sesjonslogger eller Sondres `issues.md`.
- Gjøre betalte kall fra agenten. Agenten kontrollerer bare med `GET /api/status` og `git`.

**Beslutninger (Kevin og Sondre, 2026-11-24):**
- T1 var en kjenning og teller ikke. Svarene beholdes som en tilleggsobservasjon.
- Alle gyldige tester kjøres på samme versjon.
- Resultatene står i én samlet resultatfil, og hver av oss dokumenterer i sin egen sesjonslogg.
- Endringer av «Mangler» venter til etter testene.
- Forbruksgrensen (C2) blir stående på 100 USD, med en kreditt på 5 USD uten påfylling.
- **Betalte kall (Kevin):** 3–6 analyser i produksjonen er godkjent. Godkjenningen gjelder bare de faktiske testene, og først når forberedelsene er ferdige og PR-en er flettet. Den som leder, fører antall analyser per person i resultatfilen. Trengs det flere, avklares det med Kevin før neste invitasjon.
- **Frist:** testene er ferdige innen 2026-12-01 (godkjent av Sondre). Holdes den ikke, avgjør Kevin og Sondre om epic 3 kan flettes.
- **Sondres avklaringer (2026-11-24):** frysen gjelder koden og innstillingene i Vercel og OpenAI, mens logger og dokumentasjon kan flettes. En kritisk feil kan rettes, med versjonen ført per testperson og en vurdering av om testene må tas på nytt. Epic 3 lages på egne grener og kan justeres etter funnene. Sondre tester produksjonen med eksempelet før perioden. Kevin gir beskjed når perioden starter.
- Spec-en holdes samlet (Kevin).

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Gyldig test | Medstudent, egen CV, ekte resultat, fast versjon | En rad med bare typer og kategorier | N/A |
| Ikke medstudent | En kjenning eller noen i gruppen | Teller ikke. Kan føres som tilleggsobservasjon | Ny testperson |
| Eksempelet | Personen brukte *Prøv med eksempel*, også etter en feil | Teller ikke. Føres i «Annet» | Ny testperson |
| Ikke noe ekte resultat | Kreditten er brukt opp, grensen er nådd, eller analysen feilet uten at et nytt forsøk lyktes | Teller ikke. Feilen føres | Ny testperson. Er kreditten brukt opp, avgjør Kevin |
| Filen kan ikke leses | Skannet PDF eller lesefeil, og personen limer ikke inn teksten | «Ikke fullført». Feilen føres | Ny testperson |
| Engelsk CV | CV-en er på engelsk | Teller. Føres i «Annet» som funn for FR-4 | N/A |
| Ingen svar | Ingen svar fire dager etter invitasjonen (purring etter dag 2) | «Ikke svart» | Ny testperson |
| Uklart svar | Ikke et tydelig ja eller nei etter oppfølgingen | Føres som «uklart». Teller ikke som ja | N/A |
| Ja fra «Mangler» | Appen sa «Mangler» om erfaringen | Teller som ja, merkes og telles for seg | Vurderes sammen med de andre resultatene |
| Personen sender CV-en | CV-en eller et utdrag | Ingenting fra den føres. Meldingen slettes | «Annet»: «sendte CV, slettet» |
| Detaljer i svaret | Navn, arbeidsgiver eller sitat | Bare typen føres | Detaljene utelates |
| Feil i resultatet | Oppdiktet belegg eller feil kategori | Svaret føres som gitt. Feilen føres under «Funn for SM-1» | Åpent punkt i `issues.md` |
| Versjonen endres uten grunn | En del av versjonen er endret mellom testene, uten at det var en kritisk feil | Testene før endringen teller ikke | Testene kjøres på nytt. Flere analyser avklares med Kevin |
| Kritisk feil | En feil hindrer en testperson i å bruke appen | Feilen rettes, og den nye versjonen føres. Hver rad viser hvilken versjon personen brukte | Kevin og Sondre fører om tidligere tester må tas på nytt |
| For mange analyser | Erstatninger ville gi mer enn 6 analyser | Ingen ny invitasjon | Kevin avklarer først |

</frozen-after-approval>

## Code Map

- `_bmad-output/implementation-artifacts/brukertest-2-8-testopplegg.md`: Sondres opplegg (PR #19 og #20, personvern 2026-11-24). Hovedspørsmålet og de fem spørsmålene i punkt 7 beholdes ordrett. Meldingene rettes etter Tasks.
- `src/components/Personvernboks.tsx:26`: appen sier «Du bør fjerne fødselsnummer, adresse, bilde og helseopplysninger». Fødselsnummeret fjernes automatisk (`lib/kjerne/masker.ts`). Overføringsteksten nevner leverandøren og at teksten sendes ut av EØS. Meldingene må stemme med dette.
- `src/lib/pipeline/status.ts`: `/api/status` gir bare `modus` og `leverandor`, ikke modellen. Derfor leses `LLM_*` av i Vercel.
- `src/lib/pipeline/grense.ts`: én felles teller per serverinstans, ikke per IP. Grensen er 10 per minutt og 200 per UTC-døgn.
- `src/components/feilmeldinger.tsx`: `llm_feil`, `llm_tidsavbrudd` og `grense_naadd` viser vei til *Prøv med eksempel*. Eksempelresultatet er ikke merket i ekte modus (`OktProvider.tsx:90`). Derfor trengs spørsmålet om egen CV.
- `.logs/sondre-skogheim/972-2026-11-20-20-38-53-brukertest-2-8.md`: T1. Leses, men endres ikke. Opptellingen der («1 av 3») gjelder ikke lenger.
- `testdata/par-1-butikk-bank/annonse.txt`: annonsen. Uendret.

## Tasks & Acceptance

**Fase 1, i denne PR-en (bare dokumentasjon):**
- [x] `_bmad-output/implementation-artifacts/brukertest-2-8-testopplegg.md`: opplegget skal stemme med appen og beslutningene.
  - Øverst: en merknad om T1 og T2–T4.
  - Punkt 1: versjonen, Sondres test med eksempelet og beskjeden om frysen erstatter «2.4 er flettet». Frysen gjelder koden og innstillingene i Vercel og OpenAI, ikke dokumentasjonen, og har et unntak for kritiske feil. Legg til bekreftelsen av at personen er medstudent. Lenken er `https://g69-cv-assistent.vercel.app`, aldri en forhåndsvisning.
  - Punkt 2 og 7, meldingene:
    - «Vi (Kevin og Sondre)»
    - teksten sendes til OpenAI i USA, ut av EØS
    - fødselsnummeret fjernes automatisk, og personen fjerner selv adresse, bilde og helseopplysninger
    - «Nei er like nyttig for oss som ja.»
    - «Bruk din egen CV, ikke *Prøv med eksempel*.»
    - «Det holder å analysere én gang.»
    - «Ikke snakk med andre testpersoner om resultatet før du har svart.»
  - Punkt 3, «Se etter»: *Endre CV-tekst*, *Tilbake til resultatet* og *Ny analyse* («Valg» under 640 px). Gjelder bare tester med observasjon.
  - Punkt 4 og 7: oppfølgingen etter ja, oppfølgingen ved uklart svar, og «Brukte du din egen CV?».
  - Punkt 5: notatmalen viser til resultatfilen.
  - Punkt 6: regelen for når storyen er ferdig, og personvernregelen i stedet for «(NFR-10)».
  - Punkt 7: tilfellene fra matrisen.
- [x] `_bmad-output/implementation-artifacts/brukertest-2-8-resultater.md`: ny fil, den ene samlede resultatfilen. Den skal ha:
  - versjonen før og etter, og etter hver retting av en kritisk feil: (a), (b), (c), `/api/status` og dato (V1, V2 osv.)
  - Sondres test med eksempelet før perioden
  - beskjeden om frysen, og en logg over kritiske feil med vurderingen av om testene må tas på nytt
  - en tabell for T2–T4 og erstatninger, med radene fra notatmalen og i tillegg:
    - leder
    - versjon (V1, V2 osv.)
    - medstudent bekreftet
    - egen CV
    - kategori og «står i CV-en» etter ja
    - antall analyser
    - om personen har sett appen før
    - enhet
  - opptellingen, med ja fra «Mangler» og uklare svar talt for seg
  - funn for SM-1
  - konklusjonen, og vurderingen hvis det kom færre enn to ja
  - T1 som tilleggsobservasjon, uten navn og med lenke til loggen. Det står at opptellingen i T1-loggen ikke gjelder.
- [x] `_bmad-output/implementation-artifacts/sprint-status.yaml`: 2-8 settes til `in-progress`.
- [x] `.logs/kevin-heggdal/`: sesjonslogg og `issues.md`. Fristen, frysen og T4 føres som åpne punkter.

**Fase 2, etter flettingen (testene og avslutningen):**
- [ ] Sondre tester produksjonen med eksempelet. Kevin gir Sondre beskjed om at perioden starter. Kevin eller Sondre fører versjonen før T2 i resultatfilen.
- [ ] For hver test: den som leder, sender invitasjonen etter punkt 7, fører raden og skriver i sin egen sesjonslogg.
- [ ] Etter den siste gyldige testen føres versjonen etter testene og opptellingen. Kom det færre enn to ja, føres også vurderingen fra Kevin og Sondre.
- [ ] Egen PR for avslutningen: resultatfilen, spec-en og 2-8 settes til `done`, og sesjonsloggen oppdateres.

**Acceptance Criteria:**
- Gitt det rettede opplegget, når en testperson følger punkt 7 eller punkt 3–4, så stilles hovedspørsmålet ordrett og de fem spørsmålene er uendret. Bare de tillatte oppfølgingene kommer i tillegg.
- Gitt en gjennomført test, når den som leder avslutter, så har lederens sesjonslogg svaret og typen, uten personopplysninger, og en lenke til raden i resultatfilen.
- Gitt alle radene, når PR-en for avslutningen lages, så er `git grep -i` over hele repoet, også `.logs/`, tom for testpersonenes navn, e-post og telefonnummer. Den som leder, skriver dem direkte i terminalen og lagrer dem ikke noe sted.
- Gitt tre gyldige rader og en bestått versjonssjekk, når opptellingen gir minst to ja, så er SM-10 oppfylt og 2-8 settes til `done`.
- Gitt tre gyldige rader og en bestått versjonssjekk, når det kom færre enn to ja og vurderingen er ført i resultatfilen og i begge sesjonsloggene, så settes 2-8 til `done`.

## Implementation Notes

- **Steg 3 (2026-11-24):** en underagent uten tidligere kontekst gjorde fase 1 ut fra spec-en. Diffen er lest og kontrollert mot Tasks og matrisen, uavhengig av rapporten fra underagenten. Alle de 14 radene i matrisen står i tabellen i punkt 7 i testopplegget, og regelen for en gyldig test står i punkt 6. Hovedspørsmålet og de fem spørsmålene i punkt 7 er ordrett uendret, bare de tillatte oppfølgingene er lagt til. Det finnes ingen kodetester, siden fase 1 bare er dokumentasjon. `GET /api/status` (gratis) svarte `ekte`/OpenAI.
- **Stien til maskeringen** er `src/lib/kjerne/masker.ts`, ikke `lib/cv/masker.ts`. Code Map er rettet, og testopplegget bruker den riktige stien.
- **Radene «har sett appen før» og «enhet»** står i resultatfilen, men ingen spør om dem, fordi spec-en bare tillater bestemte oppfølginger. Den som leder testen, fyller dem ut hvis det er kjent, og skriver ellers «ukjent».

## Spec Change Log

- **2026-11-24, før låsing (Kevin, etter Sondres svar):** Sondres avklaringer er ført inn i den låste delen før spec-en ble satt til `ready-for-dev`. Det er ikke en loopback fra steg 4. Endringene: fristen er godkjent, frysen gjelder koden og innstillingene i Vercel og OpenAI, logger og dokumentasjon kan flettes, kritiske feil har et unntak med versjon per testperson og en vurdering av om testene må tas på nytt, epic 3 er på egne grener og kan justeres, og Sondre tester med eksempelet før perioden. Tilstanden som unngås: at en feil som stopper testpersonene, ikke kan rettes, eller at en retting gjør resultatene usammenlignbare uten at det er ført. KEEP: definisjonen av versjonen, kravet om tre gyldige tester og personvernreglene.

## Review Triage Log

Gjennomgang før godkjenning (sjekkpunkt 1, «Review spec», 2026-11-24). Tre uavhengige underagenter gikk gjennom spec-en og testopplegget:
- S: om spec-en er klar
- K: kanttilfeller
- P: testmetode og personvern

Påstandene om `status.ts`, `grense.ts`, `Personvernboks.tsx` og eksempelet i ekte modus er kontrollert mot koden. Kevin har tatt beslutningene. A1–A6, B, C og D er godkjent med presiseringer.

| # | Funn | Vurdering | Tiltak |
|---|------|-----------|--------|
| S1 | Ingen AC for at sesjonsloggen er ført | high | Ny AC. Vurderingen føres i resultatfilen og i begge loggene |
| S2 | Fase 2 manglet oppgaver | high | Ny liste for fase 2 |
| S3 | `done` krevde ikke tre gyldige tester | high | Always og AC krever tre gyldige og bestått versjonssjekk (A3) |
| S4 | Versjonen fanget ikke miljøvariabler, tilbakerulling eller konfigurasjon | high | Versjonen er (a), (b) og (c), med forbud mot tilbakerulling og endring av miljøvariabler (A1) |
| S5 | Versjonen var definert på tre ulike måter | medium | Én definisjon i Always som de andre viser til |
| S6 | Ingen frist og ingen plan for epic 3 | medium | Frist 2026-12-01 (foreløpig), frys og egen gren for epic 3 (A2, A6) |
| S7 | Ingen ansvarlig for T4 | medium | Kevin og Sondre skaffer T4 sammen (Kevin). Åpent punkt i `issues.md` |
| S8 | AC1 dekket bare punkt 7 | medium | AC1 gjelder punkt 7 eller punkt 3–4 |
| S9 | `git grep` i AC2 kunne ikke testes | medium | Navn, e-post og telefon over hele repoet, også `.logs/`, skrevet direkte |
| S10 | Godkjenningen på 3–6 kall mot erstatninger | medium | Antallet føres, og flere avklares først med Kevin (rad i matrisen) |
| S11 | «Ingen svar» var tvetydig | low | Fire dager, med purring etter dag 2 |
| S12 | Uklart hvilken `issues.md` som menes | low | «Sondres `issues.md`» |
| S13 | Verifiseringen gjaldt bare fase 1 og sjekket ikke modellen | low | Diff per fase. Versjonen (b) dekker modellen |
| S14 | Uklart hvor funn for SM-1 føres | low | Resultatfilen og `issues.md` |
| S15 | Språk og statusfelt | low | Rettet. Statusen til spec-en og i sprint-status er skilt i Tasks |
| K1 | Eksempelet er ikke merket i ekte modus | high | Rad i matrisen, «Brukte du din egen CV?» og ny linje i meldingen (B) |
| K2 | Antall kall kan ikke styres | high | Godkjent 3–6, antallet føres, og «Det holder å analysere én gang» (Kevin) |
| K3 | Tilbakerulling og *Promote* i Vercel | high | Versjonen (a) og forbudet (A1) |
| K4 | `LLM_MODELL` vises ikke i `/api/status` | high | Versjonen (b) (A1) |
| K5 | En PR med bare dokumentasjon ruller ut endrede miljøvariabler | medium | Miljøvariablene endres ikke under testen (A1) |
| K6 | `next.config.ts`, `vercel.json` og `tsconfig.json` var ikke med | medium | Lagt til i (c) (A1) |
| K7 | Ingen beskjed om frysen | medium | Skriftlig beskjed til Sondre, ført i resultatfilen (A2) |
| K8 | Kollisjon med epic 3 | medium | Egen gren for epic 3 og fristen (A2, A6) |
| K9 | Grensen er global, ikke per IP | medium | Code Map rettet. Rad i matrisen «Ikke noe ekte resultat» |
| K10 | CV på engelsk | medium | Rad i matrisen: teller, og føres som funn for FR-4 (A4) |
| K11 | Skannet eller uleselig fil | medium | Rad i matrisen «Filen kan ikke leses» (A4) |
| K12 | «Vet ikke», «litt» eller «begge» | low | «Uklart», teller ikke som ja (Kevins presisering) |
| K13 | Har sett appen før, eller tester på mobil | low | Kolonnene «sett appen før» og «enhet» (D) |
| K14 | Testpersonene snakker sammen | low | Ny linje i meldingen (C) |
| K15 | Navnene i terminalen ved `git grep` | low | Skrives direkte og lagres ikke (C) |
| P1 | Ja fra «Mangler» kan være falskt positivt | high | Oppfølgingen etter ja. Teller som ja, merkes og telles for seg (Kevin) |
| P2 | Sosialt ønskede svar | high | «Nei er like nyttig for oss som ja.» (C) |
| P3 | Ingen sjekk av at personen er medstudent og brukte egen CV | high | Bekreftelse i punkt 1 og 7, og spørsmålet om egen CV (B, C) |
| P4 | «Appen viser hvordan» stemmer ikke | medium | Rettet etter `Personvernboks.tsx` og `masker.ts` (C) |
| P5 | Samtykket er svakere beskrevet i meldingen enn i appen | medium | OpenAI i USA, ut av EØS (C) |
| P6 | Rå svar havner i chatten | medium | Ikke lim inn rå svar, slett meldingene, ingen navneliste (Always) |
| P7 | «Kevin og jeg» | medium | «Vi (Kevin og Sondre)» (C) |
| P8 | Punkt 6 stemte ikke med spec-en, og NFR-10 var feil | medium | Punkt 6 skrives om, og personvernregelen erstatter NFR-10 (C) |
| P9 | T1–T3, og opptellingen i T1-loggen | medium | T2–T4 og T5 og videre. Resultatfilen sier at T1-loggen ikke gjelder (D) |
| P10 | Knappene fra 2.7 kan ikke observeres hjemmefra | medium | Delvis: under «Se etter» bare for tester med observasjon. Spørsmål 3 endres ikke (se P10b) |
| P11 | Feil i resultatet kan ikke avgjøres uten CV-en | medium | Oppfølgingen «Står den i CV-en din?» (B) |
| P12 | Tiden personen oppgir, er upålitelig | low | Avvist (Kevin). Å hente tiden fra Vercel-loggen gir lite og krever ekstra håndtering. Anslaget beholdes |
| P13 | Tilfellene i punkt 7 må stemme med matrisen | low | Med i oppgaven for punkt 7 |
| P14 | Lenken må gå til produksjonen | low | Punkt 1 og 7 (C) |
| P10b | Spørsmål 3 utvides med knappene fra 2.7 | — | Avvist (Kevin). Det ville endre de fem spørsmålene |

**Steg 4 (2026-11-24):** tre lag, alle uten kontekst og med samme modell: Blind Hunter (BH), Edge Case Hunter (EH) og Verification Gap (VG). Hvert funn er kontrollert mot filene. Ingen funn ga `intent_gap` eller `bad_spec`. Alle rettingene er patcher, og implementeringsagenten fra steg 3 gjorde dem.

| # | Funn | Vurdering | Tiltak |
|---|------|-----------|--------|
| VG | Ingen hull i verifiseringen. Bare Markdown og én statusverdi er endret | — | Ingen |
| BH1 / EH11 | Kontrollen i sesjonsloggen nevnte ikke `issues.md` | low | Patch: linjen er rettet |
| BH2 | Spec-en mangler i diffen | false | Spec-en ble holdt utenfor diffen med vilje (steg 4: den skal ikke vises til de andre lagene). Den er usporet og skal med i committen |
| BH3 / EH7 | Navnene som skrives inn i `git grep`, havner i historikken i skallet | medium | Patch: `git grep -i -f -` med søkeordene på stdin, aldri på kommandolinjen |
| BH4 / EH8 | Fristen gir lite rom for erstatninger, det mangler en rad for invitasjonsdato, og det finnes ikke noe tilfelle for at fristen går ut | medium | Patch: én setning om at det må inviteres senest 2026-11-27, raden «Invitasjon sendt», et tilfelle i punkt 7 og en avkrysning i konklusjonen |
| BH5 | Ingen rad for formen på testen | low | Patch: raden «Form (hjemmefra/Teams/fysisk)» |
| BH6 / EH5 | «Analyse» var ikke definert, og budsjettet ble bare sjekket ved erstatninger | medium | Patch: én analyse er hvert betalt kall (*Analyser*, *Prøv igjen*, *Generer på nytt*), og summen føres løpende. Kevin godkjenner før en ny invitasjon kan føre til mer enn 6. *Prøv med eksempel* er gratis |
| BH7 | Funnet om «Mangler» fra T1 står ikke som åpent punkt | false | Det står i Sondres `issues.md` (linje 17), og resultatfilen viser til det |
| BH8 / EH1 / EH2 / EH3 | Versjonssjekken: ingen `fetch`, fast (c) etter en retting, bare (c) sjekkes, og raden «etter» mangler navn | medium | Patch: `git fetch origin`, (c) fra siste Vn, (a) og (b) sammenlignes rad for rad, og radene heter «V1 (før T2)» og «Slutt». Avvik som ikke er ført, betyr at sjekken ikke er bestått |
| BH9 / EH9 | «Bare disse kommer i tillegg» står mot de valgfrie spørsmålene | low | Patch: overskriften sier at de valgfrie spørsmålene er fra det opprinnelige opplegget og fortsatt er tillatt |
| EH4 | Ingen regel for hva som skjer hvis Sondres test med eksempelet feiler eller `/api/status` ikke viser `ekte` | medium | Patch: testperioden starter ikke før feilen er rettet og ført |
| EH6 | Ingen regel for hva som skjer hvis personen ikke svarer på oppfølgingen | low | Patch: etter to dager blir et uklart svar stående som «uklart», og etter et ja føres oppfølgingen som «ikke svart» |
| EH10 | «Ferdig» i punkt 6 nevnte ikke vurderingen ved færre enn to ja | medium | Patch: storyen settes til `done` først når vurderingen er ført i resultatfilen og i begge loggene. Dette er den eneste lesningen som stemmer med Intent og AC 5 |

Etter patchene er diffen lest på nytt. `git diff --stat main` viser bare `issues.md`, testopplegget og `sprint-status.yaml`, i tillegg til de usporede filene (resultatfilen, spec-en og loggen). Ingenting fra (c) er endret. De fem spørsmålene i punkt 7 er like som på `main` (kontrollert med `diff`), og hovedspørsmålet står ordrett. Det er søkt etter nøkler, e-postadresser og 8- og 11-sifrede tall i alle de nye filene, uten treff.

## Design Notes

- **Versjonen har tre deler.** Git viser ikke tilbakerulling eller endringer i miljøvariablene i Vercel, og `/api/status` viser ikke modellen. En PR med bare dokumentasjon ruller ut produksjonen på nytt, men gir samme app. Derfor kan resultatfilen oppdateres mens testen pågår.
- **Hovedspørsmålet er uendret, med oppfølginger.** Oppfølgingene skiller et ja fra «Mangler» (funnet fra T1) fra høydepunktet i UJ-1, uten at selve spørsmålet endres.

## Verification

**Commands:**
- Fase 1, `git diff --stat main`. Forventet: bare testopplegget, resultatfilen, `sprint-status.yaml` og `.logs/kevin-heggdal/`. Ingenting fra (c).
- Fase 2, `git log <versjon c>..origin/main -- src package.json package-lock.json next.config.ts vercel.json tsconfig.json`. Forventet: tom etter den siste gyldige testen.
- `curl -s https://g69-cv-assistent.vercel.app/api/status`. Forventet: `ekte` med OpenAI, likt før og etter.

**Manual checks:**
- (a) og (b) i Vercel-dashbordet er like før og etter.
- Les opplegget og resultatfilen mot Always og matrisen. Ingen personopplysninger eller nøkler.
