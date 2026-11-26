# Resultater: brukertest med medstudenter (story 2.8)

Dette er den ene samlede resultatfilen for SM-10. Opplegget står i [testopplegget](brukertest-2-8-testopplegg.md), og reglene i [spec-en](spec-2-8-brukertest-med-medstudenter.md).

**Personvern:** ingen navn, kontaktinformasjon, CV-tekst, sitater fra CV-en eller API-nøkler i denne filen. Bare typer og kategorier føres, for hånd. Rå svar limes aldri inn i agenten, og meldingene slettes etterpå. Ingen liste kobler T-numre til personer.

**Frist:** 2026-12-01. En invitasjon som sendes etter 2026-11-27, rekker ikke regelen om fire dager før fristen. Går fristen ut uten tre gyldige tester, føres det i konklusjonen (punkt 7), og Kevin og Sondre avgjør om epic 3 kan flettes.

**Godkjente analyser:** 3–6 i produksjonen (Kevin). Én analyse er hvert betalt kall til språkmodellen (*Analyser*, *Prøv igjen* og *Generer på nytt*). *Prøv med eksempel* er gratis og telles ikke. Den som leder, fører antallet per person og den løpende summen. Før hver ny invitasjon: kan summen pluss den neste testen bli mer enn 6, godkjenner Kevin først.

## 1. Versjonen

Versjonen består av (a) commit-SHA-en til den aktive produksjonsutrullingen i Vercel, (b) verdiene i `LLM_*` i Vercel (bare verdiene, aldri nøkler) og (c) den siste commiten på `main` som endret `src`, `package.json`, `package-lock.json`, `next.config.ts`, `vercel.json` eller `tsconfig.json`. Kevin eller Sondre fører den før den første gyldige testen, etter den siste, og etter hver retting av en kritisk feil.

| Versjon | Når | Dato | Ført av | (a) Utrulling i Vercel | (b) `LLM_*` (bare verdier) | (c) Siste commit på `main` for stiene | `GET /api/status` |
|---|---|---|---|---|---|---|---|
| V1 (før T2) | Før den første gyldige testen | 2026-11-26 | Kevin, med verdiene fra Sondres kontroll i Vercel samme dag | `2a375ab` (PR #46), *Ready* og *Current* da Sondre kontrollerte. Koden er lik `31e207b` (PR #45, story 2.7). Sondres logg ble flettet etterpå som `fc51cd1` (kl. 12:09), og Vercel rullet ut på nytt med status vellykket. `2a375ab..fc51cd1` endrer bare loggen hans, så appen er den samme | `LLM_LEVERANDOR` = `openai`, `LLM_MODELL` = `gpt-4.1-mini`. Begge gjelder bare Production, ble lagt til 2026-11-20 og er ikke endret siden. `GRENSE_PER_MINUTT` og `GRENSE_PER_DOGN` er ikke satt, så standardverdiene 10 per minutt og 200 per døgn gjelder | `8685c52` (2026-11-24, 2.7). `git log 8685c52..origin/main` for stiene er tom (`origin/main` = `fc51cd1`) | 2026-11-26: HTTP 200, `ekte`, OpenAI, USA, tredjeland |
| Slutt (etter siste gyldige test) | Etter den siste gyldige testen | | | | | | |

Legg til en rad (V2, V3 …) mellom V1 og Slutt etter hver retting av en kritisk feil.

**Versjonssjekken:** ☐ bestått / ☐ ikke bestått. Sjekken er bestått når alt er likt før og etter, eller når hver endring er en dokumentert retting av en kritisk feil med en ført vurdering (se punkt 3).

Kontroll:
- `git fetch origin`, deretter `git log <c fra siste førte Vn>..origin/main -- src package.json package-lock.json next.config.ts vercel.json tsconfig.json`. Sammenlign med (c) i den siste førte Vn-raden før Slutt. Commits fra kritiske rettinger som er ført i punkt 3, er tillatt. Alt annet skal mangle, og listen skal være tom etter den siste gyldige testen.
- Den som fører Slutt-raden, sammenligner (a) og (b) rad for rad med radene over. En forskjell som ikke er ført i punkt 3, betyr at sjekken ikke er bestått.

## 2. Før testperioden

**Sondres test med *Prøv med eksempel*** (gratis, uten kall til språkmodellen), for å bekrefte at story 2.7 virker i produksjonen:

| Dato | Resultat | Merknad |
|---|---|---|
| 2026-11-24 kl. 18:20 (Sondre) | Alt virker: *Endre CV-tekst* og ny analyse, *Tilbake til resultatet*, *Ny analyse* med bekreftelse, mørk modus, og personvernboksen med teksten om 30 dager | Gjort på `https://g69-cv-assistent.vercel.app` uten kall til OpenAI. Produksjonen kjørte koden fra 2.7 (PR #45, `31e207b`). Testen ble gjort før PR #46 ble flettet, men den siste commiten som endret stiene i (c), er fortsatt `8685c52`, så appen er den samme. `GET /api/status` 2026-11-24: `ekte`, OpenAI, USA. Logg: [972-2026-11-20-20-38-53-brukertest-2-8.md](../../.logs/sondre-skogheim/972-2026-11-20-20-38-53-brukertest-2-8.md) (Sondre, 2026-11-24 kl. 18:20) |

**Beskjed om frysen** (Kevin til Sondre):

| Beskjed | Dato | Kanal | Merknad |
|---|---|---|---|
| Testperioden starter | 2026-11-26 | Discord | Sondre har gitt klarsignal. Ingen innstillinger i Vercel eller OpenAI er endret (Sondre, 2026-11-26). V1 er ført i punkt 1 |
| Testperioden slutter | | | |

Frysen gjelder koden og innstillingene i Vercel og OpenAI til versjonssjekken etter den siste testen er bestått. Ingen PR som endrer stiene i (c), flettes til `main`. Ingen tilbakerulling eller *Promote* i Vercel. Miljøvariablene i Vercel og innstillingene i OpenAI-prosjektet endres ikke. Logger og dokumentasjon kan flettes så lenge de ikke påvirker hvordan appen virker.

**Grensene for analyser** (vurdert av Kevin 2026-11-25): dagens grenser beholdes under testen, altså 10 per minutt og 200 per UTC-døgn. Det er standardverdiene i `src/lib/pipeline/grense.ts` (AD-9), og `GRENSE_PER_MINUTT` og `GRENSE_PER_DOGN` settes ikke i Vercel (avgjort 2026-11-20, C3 i `kjorebok-2-4-del-c.md`). Begrunnelsen er at det bare ventes 3–6 analyser, langt under begge grensene. Ingenting endres i koden eller i Vercel. Grensene og `MAKS_UTDATA_TOKENS` vurderes på nytt i epic 3.

## 3. Logg over kritiske feil

En kritisk feil er en feil som hindrer en testperson i å bruke appen. Den kan rettes, og rettingen gir en ny versjon.

| Dato | Feil (uten personopplysninger) | Retting (PR/commit) | Ny versjon | Må tidligere tester tas på nytt? Vurdering (Kevin og Sondre) |
|---|---|---|---|---|
| | | | | |

## 4. Testene

T2, T3 og T4 er de gyldige testene. Erstatninger får T5 og videre. Den som leder en test, fører raden her og skriver i sin egen sesjonslogg med en lenke hit.

| | T2 | T3 | T4 |
|---|---|---|---|
| Dato | | | |
| Leder | Kevin | Kevin | Kevin |
| Invitasjon sendt (dato) | 2026-11-26 | 2026-11-26 | 2026-11-26 |
| Form (hjemmefra/Teams/fysisk) | hjemmefra | hjemmefra | hjemmefra |
| Versjon (V1, V2 …) | | | |
| Medstudent utenfor gruppen bekreftet før testen | | | |
| Egen CV (ikke *Prøv med eksempel*) | | | |
| Ekte resultat | | | |
| Gyldig test | | | |
| Hovedspørsmål (ja/nei/uklart) | | | |
| Type erfaring (hvis ja) | | | |
| Kategori i appen (hvis ja: Oppfylt, Delvis oppfylt, Mangler) | | | |
| Står i CV-en (hvis ja: ja/nei) | | | |
| Uenig i | | | |
| Forsto ikke | | | |
| Står fast / nøler | | | |
| Feil eller oppdiktet i resultatet | | | |
| Tid for analysen | | | |
| Antall analyser (betalte kall: *Analyser*, *Prøv igjen*, *Generer på nytt*) | | | |
| Løpende sum av analyser | | | |
| Har sett appen før | | | |
| Enhet | | | |
| Annet | | | |

**Erstatninger:** legg til kolonner T5, T6 … med de samme radene. En test som ikke teller (ikke medstudent, *Prøv med eksempel*, ikke noe ekte resultat, «Ikke fullført», «Ikke svart»), står med årsaken i «Annet».

## 5. Opptelling

| | Antall |
|---|---|
| Gyldige tester | |
| Ja | |
| – av dem ja fra «Mangler» (telles for seg) | |
| Nei | |
| Uklart (teller ikke som ja) | |
| Analyser i produksjonen til sammen (betalte kall, godkjent 3–6, *Prøv med eksempel* telles ikke) | |

## 6. Funn for SM-1

Oppdiktet belegg eller feil kategori. Svaret føres som gitt, feilen her, og et åpent punkt i `issues.md`.

| Test | Funn (bare typen, ingen sitater) | Åpent punkt |
|---|---|---|
| | | |

## 7. Konklusjon

- **SM-10:** ☐ oppfylt (minst to ja) / ☐ ikke oppfylt (færre enn to ja)
- **Vurdering ved færre enn to ja** (Kevin og Sondre, skal også føres i begge sesjonsloggene før epic 3 flettes): skal prompten eller visningen endres?

  _Ikke ført._

- **Fristen:** ☐ holdt / ☐ gått ut uten tre gyldige tester. Gikk den ut: Kevins og Sondres avgjørelse om epic 3 kan flettes:

  _Ikke ført._

- Etterpå settes 2-8 til `done` i en egen PR for avslutningen. Ved færre enn to ja settes 2-8 til `done` først når vurderingen til Kevin og Sondre er ført her og i begge sesjonsloggene.

## 8. Tilleggsobservasjon: T1

T1 (2026-11-20) var med en kjenning og ikke en medstudent, og ble kjørt på en eldre prompt. T1 teller ikke i SM-10. Svarene beholdes som en tilleggsobservasjon. **Opptellingen i T1-loggen («1 av 3») gjelder ikke lenger.**

- Logg: [972-2026-11-20-20-38-53-brukertest-2-8.md](../../.logs/sondre-skogheim/972-2026-11-20-20-38-53-brukertest-2-8.md) (Sondre)
- Hovedspørsmål: ja. Type erfaring: kontanthåndtering.
- Appen sa «Mangler». Personen bekreftet at det ikke står i CV-en, så kategorien var riktig.
- Funn: «Mangler» ble lest som «du mangler erfaringen», ikke som «CV-en nevner det ikke». Visningen vurderes etter testene, ikke under.
