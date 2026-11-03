---
review: adversary
target: ARCHITECTURE-SPINE.md (draft, 2026-11-03)
context: prd-G69-heggdal-skogheim-2026-10-29/prd.md
date: 2026-11-03
verdict: 'Ikke klar: 4 hull med høy alvorlighet og 4 med middels må lukkes med nye eller strammere AD-er før stories skrives'
---

# Adversarial gjennomgang av arkitekturspinen

## Metode

For hvert hull bygges to enheter et nivå ned (stories eller epics som ulike personer eller agenter lager). Begge følger hver AD bokstavelig, men de passer likevel ikke sammen. Hvert slikt par er et hull som må lukkes med en ny eller strammere AD. Alvorlighet:

- **Høy:** bryter et PRD-krav som er testet (SM-2, SM-3, FR-5, FR-9, FR-15, FR-17, NFR-9), eller gjør at stories ikke kan integreres uten omskriving.
- **Middels:** gir feil oppførsel i kanttilfeller, eller dobbeltarbeid og avvik som oppdages sent.
- **Lav:** kosmetisk, eller fanges opp av en test uansett.

## Dom

**Ikke klar.** Lagdelingen, porten og pipelinen er solide. Hullene ligger nesten bare i **dataene som krysser grensene**: `gap` som går tur–retur via klienten, hvilken CV-tekst som er den kanoniske etter maskering, hva «demoeksempelet» betyr i en sammenligning, og formen på resultatet av beleggkontrollen. Utsettelsen «Nøyaktig zod-skjema per resultatdel: eies av story-en som bygger resultatdelen» er roten til flere av hullene. Skjemaet for gap-analysen konsumeres av tre andre stories, så det kan ikke eies av én av dem alene.

---

## H1 (Høy): `gap` fra klienten er stolt på, ikke avgrenset og ikke kontrollert på nytt

**Par som bygger hver sin vei:**

- *Story «Søknadsbrev» (server):* tar `gap` fra body (AD-5), validerer det mot gap-skjemaet og legger kategoriene inn i prompten som fasit for hva brevet kan presentere som kvalifikasjoner (FR-15). Det følger AD-4 og AD-5.
- *Story «Økt-tilstand» (klient):* sender `generert` for gap slik den ligger i tilstanden (AD-6).

**Hvorfor de kolliderer:**

1. Serveren har ingen måte å vite at `gap` er «den uredigerte gap-analysen fra pipelinen». En klient som er endret, eller en annen bug (for eksempel at `redigert` sendes ved en feil), kan sette **Mangler → Oppfylt**. Brevet påstår da en forbudt påstand (FR-15, SM-2), og beleggkontrollen i brevet fanger det ikke, fordi den bare kontrollerer listen «Bygger på», ikke brevteksten (FR-15 sier selv at brevteksten ikke kontrolleres automatisk).
2. `gap` inneholder tekst fra språkmodellen (forklaringer, råd i FR-10, kravtekster som er sitert fra annonsen). Annonsen er upålitelig inndata (NFR-9). En innplantet instruks som språkmodellen har gjentatt i en kravtekst eller et råd, sendes tilbake og havner i prompten for brev, CV og ATS **uten avgrensning**. AD-3 avgrenser bare «CV-teksten og annonsen».
3. FR-4 og AD-5 setter lengdegrenser bare for `cvTekst` og `annonse`. `gap` har ingen grense, så en request kan sende ~4,5 MB inn i prompten. Det gir kostnad (NFR-3) og omgår formålet med FR-4.

**Fiks (stram AD-5 og AD-4, ny regel):**

> **AD-5a: Grunnlaget for brev, cv og ats.** Body for `brev`, `cv` og `ats` har ikke hele `GapAnalyse`, men en projeksjon `GapGrunnlag = { krav: { tekst, kategori, belegg: string[] }[], nokkelord: { tekst, kravIndeks: number | null, funnet: boolean }[] }` definert i `lib/kontrakt`, med maksgrenser for antall krav, antall belegg og tegn per felt. Pipelinen kjører **beleggkontrollen på nytt** på `GapGrunnlag` mot den kanoniske CV-teksten (se H2) før prompten bygges: et krav med `oppfylt` eller `delvis` uten gyldig belegg blir `mangler`. Klienten kan dermed ikke oppgradere et krav uten et ordrett sitat fra CV-teksten. Hele `GapGrunnlag` står avgrenset i prompten som data, på samme måte som CV-teksten og annonsen (NFR-9). Fritekst (forklaring, råd) sendes aldri tilbake.

(Alternativ: HMAC-signatur på `gap` med en hemmelig miljøvariabel, som er tilstandsløst og passer AD-1. Dette er sterkere, men mer kode og en hemmelighet til. Ny kontroll pluss projeksjon er nok her, fordi det verste en klient kan gjøre da er å peke på sin egen CV-tekst.)

---

## H2 (Høy): Hvilken CV-tekst er kanonisk etter maskering? Belegg, treffprosent og visning bruker ulike tekster

**Par som bygger hver sin vei:**

- *Story «Kontrollsteg» (klient):* FR-6 sier at «maskeringen vises i kontrollsteget». Kartet sier at FR-6 ligger i `lib/kjerne` (klient og server). Story-en viser maskeringen som en markering i feltet, men `cvTekst` i tilstanden er fortsatt den umaskerte teksten (det er tross alt «originalen etter kontrollsteget», AD-6).
- *Story «Pipeline» (server):* følger diagrammet i AD-4. Maskering (F) skjer bare på grenen for ekte modus, og bare teksten som sendes til adapteren maskeres. Beleggkontrollen (I) og treffprosenten (J) får `cvTekst` fra requesten, altså **umaskert**.

**Hvorfor de kolliderer:**

- Språkmodellen ser `[fødselsnummer fjernet]`. Et belegg som siterer linjen med personopplysninger (for eksempel «Fødselsnummer: [fødselsnummer fjernet], Storgata 1»), finnes ikke i den umaskerte teksten → kravet blir nedgradert uten grunn. Det motsatte skjer hvis en annen utvikler sender den maskerte teksten til kontrollen: da stemmer belegg mot tekst som brukeren aldri så i feltet.
- Treffprosenten regnes på umaskert tekst på serveren, mens brukeren ser maskert tekst. Det betyr lite i praksis (sifre er sjelden nøkkelord), men det bryter med «prosenten som vises er lik prosenten koden regner ut» på en teksten brukeren kan se.
- Demogrenen hopper over F. Det er greit for demoeksempelet, men bare hvis demo alltid er demoeksempelet (se H3).
- Om `masker()` kjøres både i klienten og på serveren, må den være idempotent. Det står ingen steder.

**Fiks (ny AD):**

> **AD-13: Kanonisk CV-tekst.** Den kanoniske CV-teksten er `masker(cvTekst)`. Klienten lagrer den maskerte teksten i `cvTekst` når brukeren går videre fra kontrollsteget (feltet viser altså det som sendes, FR-6). Serveren kjører `masker()` på nytt som første steg etter validering (B), **i begge modi**, og *all* videre bruk (adapter, beleggkontroll, treffprosent, ny kontroll av `GapGrunnlag`) bruker den maskerte teksten. `masker(masker(x)) === masker(x)` er en enhetstest (FR-6). Flytt F i diagrammet til rett etter B.

---

## H3 (Høy): «Teksten er demoeksempelet» har ingen sammenligningsregel og ingen felles kilde

**Par som bygger hver sin vei:**

- *Story «Prøv med eksempel» (klient):* importerer `cv.txt` og annonsen fra `testdata/par-1-butikk-bank/` (eller kopierer dem inn i `src/`) og fyller feltene.
- *Story «Demomodus» (server):* AD-5: «Er modusen `demo` og teksten ikke demoeksempelet, svarer ruten `demo_krever_nokkel`.» Den sammenligner med `===` mot filene som mock-adapteren leser fra disk.

**Hvorfor de kolliderer:**

- På Windows gir `core.autocrlf` CRLF i arbeidskopien. Klientbunten og serverfilen kan da ha ulike linjeskift, og en `<textarea>` normaliserer til LF. Demoen feiler for sensor på Windows (UJ-3, SM-6).
- UJ-3 sier at Marit kan redigere. Retter hun en bokstav i demo-CV-en i kontrollsteget, er teksten ikke lenger demoeksempelet. Én utvikler godtar det (normaliserer), en annen avviser det. Med H2 maskeres teksten, men demoeksempelet har ikke fødselsnummer, så det er greit bare hvis maskeringen skjer før sammenligningen.
- I **ekte** modus kan `demo: true` sendes med en vilkårlig CV (AD-5 sier bare at mock-adapteren brukes). Da får brukeren lagrede svar for Ida mot sin egen CV. Beleggkontrollen nedgraderer alt, og resultatet er tull uten feilmelding.
- `demo: true` omgår rate-limit (riktig, fordi ingenting koster), men det er ikke sagt at mock-adapteren aldri kan nå en ekte adapter.

**Fiks (stram AD-5):**

> **AD-5b: Demoeksempelet.** `DEMO_CV` og `DEMO_ANNONSE` eksporteres fra én modul i `lib/kontrakt` (generert fra eller lest fra `testdata/par-1-butikk-bank/` ved bygging) og importeres av både klienten og mock-adapteren. «Teksten er demoeksempelet» betyr `normaliser(masker(cvTekst)) === normaliser(DEMO_CV)` og det samme for annonsen, der `normaliser` er den samme funksjonen som i FR-9 (store og små bokstaver, mellomrom og linjeskift regnes ikke med). Regelen gjelder i **begge** modi: en demorequest som ikke er demoeksempelet, gir `demo_krever_nokkel` i demomodus og `ugyldig_inndata` i ekte modus. `testdata/** text eol=lf` i `.gitattributes`.

---

## H4 (Høy): Gap-skjemaet eies av én story, men tre andre stories trenger felt det kanskje ikke har

**Par som bygger hver sin vei:**

- *Story «Gap-analyse» (FR-7–FR-13):* eier skjemaet («Utsatt»). Den lager `{ krav: [...], nokkelord: string[] }` og et treffresultat med `funnet` per nøkkelord. Det oppfyller FR-11 og FR-12.
- *Story «ATS-forslag» (FR-17):* «Et nøkkelord som ikke er funnet, foreslås bare når … det hører til et krav med Oppfylt eller Delvis oppfylt.» Den trenger en kobling **nøkkelord → krav**. Gap-skjemaet har ingen slik kobling, så ATS-story-en ber enten språkmodellen gjette den (ikke deterministisk) eller bygger sin egen kobling med tekstmatching.

**Det samme gjelder formen på nedgraderingsmerket:**

- Gap-story-en merker `krav.nedgradert = true`.
- Brev-story-en må «fjerne og merke» belegg (FR-15). Det er uklart hva som merkes når belegget er fjernet: en teller, en liste med fjernede belegg (som da *vises*, i strid med FR-9 «belegget som ikke ble funnet, vises ikke»), eller et flagg på forslaget? CV- og ATS-story-ene velger hver sin variant, og UI-komponenten for «Bygger på» blir tre komponenter.
- Kanttilfeller som ingen AD avgjør: krav med `oppfylt` og en **tom** beleggliste, krav med `mangler` og belegg, krav med to belegg der bare ett finnes (beholdes kategorien? AD-4 sier bare at belegget som ikke ble funnet, fjernes), og et CV-forslag uten gyldig belegg (fjernes hele forslaget, eller bare belegget?).

**Fiks (ny AD, og fjern punktet fra «Utsatt»):**

> **AD-14: Felles former for belegg og kontroll.** `lib/kontrakt` definerer, før den første resultatdelen bygges:
> - `Krav = { tekst, kategori, belegg: string[], forklaring?, rad?, nedgradert: boolean }`
> - `Nokkelord = { tekst, kravIndeks: number | null }`. Språkmodellen oppgir koblingen, og pipelinen legger til `funnet: boolean`.
> - `Kontrollert<T> = T & { fjernetBelegg: number }` for hvert element med belegg i brev, cv og ats. Fjernede belegg returneres aldri.
>
> `lib/kjerne` har én funksjon per regel: `finnesBelegg(cvTekst, belegg): boolean` og `kontrollerKrav(krav, cvTekst): Krav`. Regelen for krav: belegg som ikke finnes, fjernes. Er `kategori !== 'mangler'` og det ikke er igjen noe belegg (også når listen var tom fra før), blir kravet `mangler` med `nedgradert: true`. For CV- og ATS-forslag: et forslag uten gyldig belegg fjernes helt og telles i `fjernetForslag` på resultatdelen. Merketeksten («nedgradert: fant ikke belegg i CV-en») står i UI-tabellen, ett sted. Bare *de andre* feltene i hver resultatdel kan utsettes til story-en.

---

## H5 (Middels): FR-5 kan ikke vise leverandøren i nettleseren, og *Ny analyse* kan nullstille avkrysningen

**Par som bygger hver sin vei:**

- *Story «Personvern» (klient):* AD-11: «Leverandør og land i FR-5 hentes fra én konstant i `lib/kontrakt` som følger `LLM_LEVERANDOR`.» Den importerer konstanten. I nettleseren er `process.env.LLM_LEVERANDOR` `undefined` (AD-12 forbyr `NEXT_PUBLIC_`), så konstanten faller tilbake til standardverdien. Teksten kan da si «Mistral (EU)» mens produksjonen bruker OpenAI (USA). Det er nettopp det AD-11 skulle hindre, og det bryter med §6 om tredjelandsoverføring.
- *Story «Ny analyse» (FR-21):* skriver reduceren som `case 'NY_ANALYSE': return startTilstand`. Det følger AD-6 og nullstiller `bekreftetPersonvern`, i strid med FR-21 («avkrysningen i FR-5 gjelder fortsatt»).

**Fiks:**

> **Stram AD-5:** `GET /api/status` svarer `{ modus, leverandor: { navn, land } | null }`. Klienten viser FR-5-teksten fra dette svaret, aldri fra en konstant den importerer selv. Konstanten i `lib/kontrakt` er en *tabell* fra leverandørkode til `{ navn, land }`, og serveren slår opp i den.
> **Stram AD-6:** Tilstanden er delt i `okt` (`bekreftetPersonvern`, `modus`, `leverandor`), som varer hele økten, og `innhold` (alt annet). `NY_ANALYSE` og `ANALYSER` nullstiller bare `innhold`. Reduceren har en enhetstest for dette (FR-21).

---

## H6 (Middels): Svar som kommer for sent, og dobbel utløsing, ødelegger tilstanden og rate-limiten

**Par som bygger hver sin vei:**

- *Story «Søknadsbrev-fane» (UI):* genererer når fanen åpnes for første gang (§3 Kjøring), i en `useEffect` i `SoknadsbrevFane`, og sender `SETT_GENERERT` når svaret kommer.
- *Story «Endre CV-tekst / Ny analyse» (FR-3, FR-21):* lager en ny `kjoringId` og tømmer resultatdelene.

**Hvorfor de kolliderer:**

- Brukeren trykker *Ny analyse* mens brevet lastes. Svaret kommer og havner i den tomme tilstanden, med et brev for en annen CV. Ingen AD sier at et svar må bære med seg id-en det ble bygget fra.
- React StrictMode kjører effekter to ganger i utvikling → to genereringer per fane. Hver telles mot rate-limiten, og hvert kall koster. To utviklere som skriver hver sin fane, løser dette ulikt (ref-vakt eller ikke).
- `kjoringId` og `gapKjoringId` blandes: Gjelder det en ny kjøring også når gap-analysen genereres på nytt (FR-19)? Hvis ja, ligner «basert på forrige analyse» (FR-19) og «alle resultatdelene erstattes» (FR-3) hverandre, og én story tømmer der en annen merker.

**Fiks (stram AD-6):**

> Tilstanden har `kjoringId` (ny ved *Analyser* og *Ny analyse*, og da tømmes alle resultatdelene) og `gapVersjon` (ny ved hver gap-generering, også FR-19). Hver resultatdel lagrer `gapVersjon` den ble bygget på, og avviker den fra den nyeste, vises «basert på forrige analyse». Alle genereringer startes av én funksjon i `lib/okt` (`startGenerering(resultatdel)`), aldri direkte fra en komponent. Den gjør ingenting når resultatdelen har status `laster` eller allerede har et resultat for gjeldende `kjoringId`, og den legger `{ kjoringId, gapVersjon }` ved handlingen. Reduceren forkaster svar der `kjoringId` ikke er den gjeldende.

---

## H7 (Middels): Hva teller mot rate-limiten, og i hvilken rekkefølge?

**Par:** Story-en for pipelinen teller ved steg D (før kallet). Story-en for *Prøv igjen* antar at feilede kall ikke telles («brukeren fikk jo ikke noe»). Story-en for feilhåndtering velger HTTP 429 for `grense_naadd` og 502 for `ugyldig_svar`, mens en annen velger 400 for begge. AD-8 sier «HTTP-status pluss kode», men gir ingen tabell.

I tillegg: med Fluid compute og flere instanser er «200 per døgn» per instans, ikke totalt. Det er akseptert i AD-9, men SM-8 og budsjettet bygger på det totale tallet, og ingen story vet det.

**Fiks (stram AD-9 og AD-8):**

> En generering telles i det øyeblikket den passerer steg D, også om kallet senere feiler, får tidsavbrudd eller gir et ugyldig svar (det koster tokens). Nye genereringer (FR-19) og *Prøv igjen* telles. Requester som avvises i B, eller som er demo, telles ikke. AD-8 får en tabell fra kode til HTTP-status: `ugyldig_inndata`, `for_lang_tekst`, `for_kort_tekst` → 400, `demo_krever_nokkel` → 403, `grense_naadd` → 429, `llm_feil`, `ugyldig_svar` → 502, `llm_tidsavbrudd` → 504. Klienten bruker bare `kode`. AD-9 sier eksplisitt at grensene gjelder per instans, og at det totale taket bare er forbruksgrensen hos leverandøren.

---

## H8 (Lav): Hvem regner treffprosenten, og på hvilken tekst?

AD-4 sier at treffprosenten regnes i pipelinen og «aldri i UI-et», men kartet sier `lib/kjerne` (klient og server), og UI-et har lov til å importere `lib/kjerne`. En UI-story kan regne treffprosenten på nytt når `redigert` endres (fristende for å vise «live» treff), i strid med FR-18 («Treffprosenten endres ikke av redigering»). Med H2 må den uansett regnes på den maskerte teksten.

**Fiks:** Legg til i AD-2: UI-et kan importere bare `grenser` og `masker` fra `lib/kjerne`, ikke `treffprosent` eller `belegg`. Det håndheves med en ESLint-regel (`no-restricted-imports`). Treffprosenten er et felt i svaret fra gap og vises som det er.

---

## Oppsummering av fiksene

| Hull | Alvorlighet | Fiks |
| --- | --- | --- |
| H1 `gap` tur–retur | Høy | AD-5a: `GapGrunnlag`-projeksjon med grenser, ny beleggkontroll på serveren, avgrenset i prompten |
| H2 Kanonisk CV-tekst | Høy | AD-13: kanonisk = `masker(cvTekst)`, maskering i begge modi rett etter B, idempotent |
| H3 Demoeksempelet | Høy | AD-5b: felles `DEMO_CV`/`DEMO_ANNONSE`, normalisert sammenligning, gjelder begge modi, `.gitattributes` |
| H4 Felles skjema og merke | Høy | AD-14: `Krav`, `Nokkelord.kravIndeks`, `fjernetBelegg`, regler for tom liste og forslag uten belegg; fjern punktet fra «Utsatt» |
| H5 FR-5-leverandør og avkrysning | Middels | `/api/status` returnerer leverandøren; tilstanden deles i `okt` og `innhold` |
| H6 Svar som kommer for sent / dobbel utløsing | Middels | `kjoringId` + `gapVersjon`, `startGenerering` i `lib/okt`, foreldede svar forkastes |
| H7 Telling og HTTP-status | Middels | Teller ved D uansett utfall; tabell fra kode til status; grense per instans |
| H8 Treffprosent i UI | Lav | Begrens hva UI-et kan importere fra `lib/kjerne` |
