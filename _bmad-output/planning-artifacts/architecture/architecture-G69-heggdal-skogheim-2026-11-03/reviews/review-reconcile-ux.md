---
type: review
lens: reconcile-ux
target: ARCHITECTURE-SPINE.md
against:
  - _bmad-output/planning-artifacts/ux-designs/ux-G69-heggdal-skogheim-2026-10-30/DESIGN.md
  - _bmad-output/planning-artifacts/ux-designs/ux-G69-heggdal-skogheim-2026-10-30/EXPERIENCE.md
date: 2026-11-03
verdict: 'Trenger endringer før stories (AD-6 må utvides; to direkte konflikter)'
---

# Avstemming: arkitekturspine mot UX

**Spørsmål:** Hvilke beslutninger om oppførsel, tilstand og flyt i EXPERIENCE.md og DESIGN.md støttes ikke av spinen, eller er i konflikt med den, slik at enheter som bygges hver for seg kan sprike?

**Dom:** Spinen bærer det meste av UX-en (to flater, demomodus, feilformat, ingen lagring, belegg låst i kode). Men AD-6 beskriver bare *data*, ikke *livssyklusen* til en generering. UX-en krever status per fane, automatisk start, venting på gap-analysen, utkast mot innsendt tekst og bakgrunnsgenerering som overlever fanebytte. Uten regler for dette vil hver fane-story finne opp sin egen løsning. I tillegg er det to direkte konflikter (*Prøv igjen* for `ugyldig_svar`, og hvor FR-26-varselet vises).

Mockupene er sjekket. De tilfører ingen tilstander utover EXPERIENCE.md.

## Funn

### F1 (Høy): AD-6 mangler status per resultatdel og hvem som starter genereringer

**UX:** En resultatdel genereres første gang fanen åpnes. Fanemerket viser spinner under generering. Fanene viser skjelett, «Venter på gap-analysen …» (og starter av seg selv når den er klar), «Gap-analysen feilet …», eller en `Alert` med feilkode og *Prøv igjen*. Brukeren kan bytte fane mens en annen genereres. Skjermleseren får melding når en fane i bakgrunnen blir ferdig eller feiler. Verktøylinjen er `aria-disabled` under generering.

**Spinen:** Per resultatdel bare `generert`, `redigert` og `gapKjoringId`. Ingenting om `laster`, `feil`, `venter` eller hvem som sender requesten.

**Risiko:** shadcn `Tabs` avmonterer innholdet i inaktive faner. Starter hver fane-komponent sin egen `fetch` i en `useEffect`, går svaret tapt eller sendes dobbelt når brukeren bytter fane. Det koster penger (NFR-3) og bryter «kan bytte fane». Fire fane-stories vil modellere feil og laster ulikt, og fanemerket og live-regionen kan ikke lese en felles status.

**Forslag:** Utvid AD-6 med:
- per resultatdel `status: 'ikke_startet' | 'venter_pa_gap' | 'genererer' | 'klar' | 'feil'` og `feilkode?: FeilKode` (enumen fra AD-8).
- Regel: Genereringer startes og avsluttes bare i `lib/okt` (en funksjon eller effekt i provideren, f.eks. `startGenerering(resultatdel)`), aldri i fane-komponenter. Å åpne en fane sender handlingen `faneApnet`. Provideren starter gap hvis den ikke er startet, og setter `brev`/`cv`/`ats` til `venter_pa_gap` og starter dem når gap blir `klar`. Feiler gap, går de ventende fanene til en egen tilstand (`gap_feilet`, eller `feil` med en markør) uten å sende request.
- Kunngjøringene (én `aria-live`-region) utløses av statusoverganger i `lib/okt`, ikke av fanene.

### F2 (Høy): Svar som kommer for sent, og utkast mot kjøring, er ikke definert

**UX:** *Endre CV-tekst* går tilbake til forberedelsen med resultatene intakt. *Tilbake til resultatet* vises bare så lenge CV-teksten og annonsen er uendret, og ellers vises «Du har endret teksten …». *Analyser* på nytt eller *Ny analyse* erstatter alt.

**Spinen:** Ett felt `cvTekst` («originalen etter kontrollsteget») og ett felt `annonse`, og requester bygges fra dem. `kjoringId` finnes, men ingen regel sier at svar skal sjekkes mot den.

**Risiko:**
1. Redigerer brukeren CV-teksten direkte i `cvTekst` mens resultatene finnes, og åpner så en fane som ikke er generert, bygges brevet av *ny* CV-tekst og *gammel* gap-analyse. Da sjekkes belegg mot en annen tekst enn den gap-analysen brukte (FR-9, FR-18).
2. «Uendret» for *Tilbake til resultatet* kan ikke avgjøres uten en kopi av teksten som ble analysert.
3. Et svar som er underveis når brukeren trykker *Analyser* på nytt, *Ny analyse* eller *Prøv med eksempel*, kan skrive over den nye kjøringen.

**Forslag:** Skill i AD-6 mellom `utkast: { cvTekst, annonse }` (feltene i forberedelsen) og `kjoring: { id, cvTekst, annonse, erEksempel }` (det *Analyser* sendte inn). Requester bygges bare fra `kjoring`. *Tilbake til resultatet* vises når `utkast` er lik `kjoring`. Legg til regelen: «Et svar lagres bare hvis `kjoring.id` (og for gap: genereringens id) fortsatt er den gjeldende. Ellers forkastes det.» Bruk gjerne `AbortController` ved bytte av kjøring.

### F3 (Middels-høy): `gapKjoringId` kan ikke gi banneret «Basert på forrige analyse»

**UX (FR-19):** Banneret vises når *gap-analysen er generert på nytt* (fanens *Generer på nytt*) etter at fanen ble laget. *Analyser* på nytt erstatter derimot alle resultatdelene.

**Spinen:** «En resultatdel med en `gapKjoringId` som ikke er den nyeste» er utdatert. Men `kjoringId` endres ved *Analyser*, ikke når gap-analysen genereres på nytt. Leses det bokstavelig, vises banneret aldri i det tilfellet UX-en beskriver, eller så må noen finne på å øke `kjoringId` ved hver ny generering av gap-analysen (og da brytes F2).

**Forslag:** Gi hver generering av gap-analysen sin egen `gapGenereringId` (teller). Lagre den på `brev`, `cv` og `ats` når de genereres, og vis banneret når den er ulik `gap.gapGenereringId`. Skriv også at *Analyser* tømmer alle resultatdelene (status `ikke_startet`), slik at banneret ikke vises etter en ny kjøring.

### F4 (Middels): `redigert` som «brukerens tekst» passer ikke de strukturerte resultatdelene

**UX:** Gap-analysen har redigerbare felt per krav («Krav», «Hvorfor delvis», «Råd»), mens kategori, belegg, treffprosent og nøkkelord er låst. CV- og ATS-forslag har redigerbare «Forslag» og «Hvorfor» per kort, og «Gjelder» er låst. Bare brevet er én tekst. *Kopier* bruker teksten etter redigering i et fast format, og «· redigert» vises når noe er endret. Dialogen for *Analyser* lister de redigerte fanene.

**Spinen:** `redigert` (brukerens tekst). Ingen form og ingen regel for når en fane regnes som redigert.

**Risiko:** Hver story velger sin egen form (fritekst, delvis objekt, kopi av hele `generert`). *Kopier*, fanemerket og dialogen vil oppføre seg ulikt, og noen kan komme til å la låste felt bli redigerbare.

**Forslag:** Skriv i AD-6 at `redigert` er `null` eller et objekt med samme form som `generert`, der bare de redigerbare feltene kan endres (et overlegg per krav- eller forslags-id). Fanen er redigert når `redigert !== null`. *Generer på nytt* og *Analyser* setter `redigert` til `null`. Visning og *Kopier* bruker `redigert ?? generert`. Legg kopiformatet som rene funksjoner (f.eks. `lib/kjerne/kopi.ts` eller en funksjon i UI), én per resultatdel.

### F5 (Middels): Direkte konflikt om *Prøv igjen* for `ugyldig_svar`

**UX:** «Ugyldig svar fra språkmodellen … Som over: «Svaret fra språkmodellen kunne ikke brukes. Prøv igjen.»». Raden over har `Alert` med *Prøv igjen*.

**Spinen (AD-8):** *Prøv igjen* bare for `llm_feil` og `llm_tidsavbrudd`.

**Forslag:** Ta med `ugyldig_svar` i regelen for *Prøv igjen* i AD-8. Det er en forbigående feil, og NFR-3 begrenses uansett av AD-9. Behold unntaket for `grense_naadd` (ingen knapp).

### F6 (Middels): FR-26-varselet: hvem avgjør det, og hvor vises det

**UX:** *Analyser* med egen CV i demomodus blir værende på **forberedelsen**. Det viser en `Alert` over *Analyser*, og fokus flyttes til varselet. Ellers går *Analyser* «med en gang» til resultatsiden.

**Spinen (AD-5):** Serveren svarer `demo_krever_nokkel` når teksten ikke er demoeksempelet. Følger klienten den vanlige flyten (gå til resultatet og start gap), havner feilen i fanen på resultatsiden. Det strider mot UX-en.

**Forslag:** Legg til i AD-5/AD-6: Klienten henter `modus` fra `/api/status` én gang til økt-tilstanden (det trengs også for demobanneret). *Analyser* sjekker `modus === 'demo' && !kjoring.erEksempel` *før* navigering og viser varselet. `demo_krever_nokkel` fra serveren er bare en ekstra sikring. Skriv også hvor demoeksempelets CV-tekst og annonse kommer fra for klienten, f.eks. en import fra `testdata/par-1-butikk-bank/` inn i `lib/kontrakt` eller en egen modul. Server og klient må sammenligne mot nøyaktig samme tekst.

### F7 (Middels): Feil som ikke følger AD-8-formatet

**UX:** Alle feil fra språkmodellen gir en `Alert` i fanen med riktig melding.

**Spinen:** `maxDuration` 60 s. Når Vercel stopper funksjonen, eller nettverket feiler, kommer det et svar uten `{ feil: { kode } }` (504 med HTML, eller `fetch` som kaster). Spinen sier ikke hvordan klienten skal tolke det.

**Forslag:** Legg til i AD-8: Klienten tolker svar som ikke følger feilformatet, slik: 504 eller tidsavbrudd blir `llm_tidsavbrudd`, og andre nettverks- og HTTP-feil blir `llm_feil`. Dette ligger i én funksjon i `lib/okt` som alle genereringer bruker.

### F8 (Lav-middels): Felt i svarformatet som UX-en forutsetter, er ikke nevnt

Den nøyaktige zod-formen er utsatt til story-ene, men disse feltene brukes på tvers av fanene og bør nevnes i AD-4 eller i kontrakten:
- gap: `stilling` og `arbeidsgiver` (toppfeltet), `nedgradert` per krav og treffprosent, og nøkkelord funnet og ikke funnet.
- brev: plassholderne som faktisk finnes (FR-14), og antall belegg som ble fjernet (*Bygger på*: «1 belegg ble fjernet …»).
- cv/ats: et merke per forslag som er fjernet eller merket.
- Den faste rådteksten for nedgraderte krav (FR-10): avgjør om pipelinen eller UI-et setter den. Ellers kan begge gjøre det, eller ingen av dem.

**Forslag:** Én linje i AD-4: «Pipelinen setter `nedgradert`, fjernet-antall og fast råd. UI-et viser dem bare.» List også feltene over som obligatoriske i kontrakten.

### F9 (Lav): Hvilken flate som vises, og avkrysningen for personvern ved tømming

Hvilken flate som vises (forberedelse eller resultat), står ikke i AD-6. *Ny analyse* må tømme utkast, kjøring og resultatdeler, men **ikke** `bekreftetPersonvern` (FR-21). Uten en regel kan reducer-handlingen nullstille alt.

**Forslag:** Ta med `flate: 'forberedelse' | 'resultat'` i AD-6, og skriv at `nyAnalyse` beholder `bekreftetPersonvern` og `modus`.

## Ikke flagget (lokal UI-tilstand, ingen fare for avvik)

Dialogene og fokus etter handling (lokalt i komponentene, shadcn `AlertDialog`), tegntellere, at «for kort» vises når brukeren forlater feltet, telling av maskerte fødselsnumre, responsive brudd, toast «Kopiert», `aria-disabled` på *Analyser* med årsaksliste. Ordlyden i dialogene og feiltabellen er allerede samlet i UX-en og i UI-tabellen i AD-8.
