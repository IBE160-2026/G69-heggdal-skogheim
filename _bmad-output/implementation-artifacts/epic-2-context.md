# Epic 2 Context: Brukeren ser ærlig hva CV-en dekker

<!-- Compiled from planning artifacts. Edit freely. Regenerate with compile-epic-context if planning docs change. -->

## Goal

Brukeren trykker *Analyser* og får gap-analysen. Hvert krav i annonsen får kategorien Oppfylt, Delvis oppfylt eller Mangler. Belegget kontrolleres i kode, Mangler får ærlige råd, og treffprosenten regnes ut deterministisk. Resultatet kan redigeres, kopieres og genereres på nytt. Brukeren kan gå tilbake med *Endre CV-tekst* eller tømme alt med *Ny analyse*. Feil vises på norsk med *Prøv igjen*, uten at data går tapt. *Prøv med eksempel* viser demoeksempelet (testpar 1) uten nøkkel og uten kall til språkmodellen. Leverandøren er valgt ved måling: OpenAI `gpt-4.1-mini` med temperatur 0. Epicen leverer kjernen i produktløftet, at ingenting diktes opp. Den legger også grunnmuren som brev-, CV- og ATS-fanene i epic 3 og 4 bygger på: pipeline, økt-tilstand, feilformat, verktøylinje, dialoger og utdatert-mekanisme.

## Stories

- Story 2.1: Kontrollert gap-analyse for demoeksempelet gjennom API-et
- Story 2.2: *Prøv med eksempel* viser gap-analysen
- Story 2.3: Ekte gap-analyse med språkmodellen
- Story 2.4: Velge leverandør ved måling
- Story 2.5: Forståelige feil uten tap av data
- Story 2.6: Redigere, kopiere og generere gap-analysen på nytt
- Story 2.7: Endre CV-tekst, gå tilbake og starte på nytt
- Story 2.8: Brukertest med medstudenter

## Requirements & Constraints

- **Kategorier og råd:** Alle krav i annonsen hentes ut, både krav og ønsker. Ved tvil velges den svakeste kategorien. Ingen krav vurderes høyere enn fasiten, og Mangler i fasiten er alltid Mangler. Delvis oppfylt har belegg og én setning om hvorfor. Mangler får et ærlig råd (vilje til å lære, beslektet erfaring, legg erfaringen inn via kontrollsteget) og foreslår aldri at brukeren skal påstå kvalifikasjonen.
- **Beleggkontroll i kode:** Belegget må stå ordrett i CV-teksten etter normalisering. Normaliseringen ser bort fra store og små bokstaver, mellomrom, linjeskift, listetegn, bindestreker og tankestreker (også orddeling) og anførselstegn. Belegget må følge ordgrensene og ha minst 4 tegn. Oppfylt eller Delvis oppfylt uten gyldig belegg blir Mangler med `nedgradert: true`, og belegget vises ikke.
- **Nøkkelord og treffprosent:** Hentes i samme generering. Hvert nøkkelord knyttes til ett krav eller ingen (`kravIndeks`), og koblingen påvirker ikke prosenten. Prosenten regnes ut i kode og er veiledende, ikke en ATS-score.
- **Ingen oppdiktning:** Ingen kvalifikasjoner, arbeidsgivere, årstall eller tall som ikke står i CV-teksten, med mindre de er presentert som noe brukeren mangler.
- **Redigering:** Tekstfeltene kan redigeres og står til økten avsluttes. Kategori, belegg, treffprosent og nøkkelord er låst. Nye genereringer bygger alltid på den originale (maskerte) CV-teksten og annonsen, aldri på redigeringer. *Kopier* kopierer `redigert ?? generert`.
- **Ny generering som feiler:** Den endrer ingenting av det som var der. Analysen, redigeringene og «· redigert» står som før, og bare feilmeldingen kommer i tillegg. Under en ny generering vises ikke den forrige analysen, men den ligger fortsatt i tilstanden.
- **Ny kjøring:** Etter *Endre CV-tekst* beholdes CV-teksten og annonsen. *Analyser* erstatter alle resultatdelene, med bekreftelse hvis noe er redigert. *Ny analyse* tømmer alt etter bekreftelse, men avkrysningen for personvern gjelder fortsatt.
- **Feil:** Meldingene er på norsk og sier hva som skjedde og hva brukeren kan gjøre, uten at tekst eller redigeringer går tapt. Hvert tilfelle kan fremkalles i test uten krasj. Ved feil og tidsavbrudd fra språkmodellen, også når kreditten er brukt opp, viser fanen *Prøv med eksempel*, fordi det fortsatt virker. Uten en tidligere analyse står *Prøv igjen* ved siden av. Med en tidligere analyse står bare *Prøv med eksempel*, siden *Generer på nytt* i verktøylinjen gjør det samme som *Prøv igjen*.
- **Ytelse, kostnad og språk:** Gap-analysen er ferdig innen 30 s, og brukeren ser at noe skjer innen 2 s. Målet er 1 kr eller mindre per full kjøring. Det harde taket er en forhåndsbetalt kreditt under 200 kr uten automatisk påfylling. Svarene er på naturlig bokmål.
- **Personvern:** Appen skriver ingenting til database, disk eller nettleserlagring. Bare metadata logges, og ingen IP-adresser. Personvernboksen sier hvilken leverandør og hvilket land teksten sendes til, og at den går ut av EØS når det gjelder. Den sier også at appen ikke lagrer noe, at leverandøren kan beholde teksten i opptil 30 dager for å oppdage misbruk, og hva brukeren bør fjerne. Avkrysningen gjelder resten av økten.
- **Leverandørvalg (avgjort, story 2.4 er ferdig):** OpenAI `gpt-4.1-mini` med temperatur 0 kjører i produksjonen. SM-1, SM-2 og SM-3 er ikke bestått med prompten i produksjonen (8, 11 og 9 av 12). Avvikene er godtatt som kjente svakheter og måles på nytt i story 5.1. Ingen flere justeringer av prompten i epic 2.
- **Brukertest:** Tre medstudenter utenfor gruppen tester med egen CV og annonsen fra par 1, og minst to skal svare ja på «Fant du en erfaring du ikke hadde tenkt på som relevant?». Svarene noteres uten CV-tekst eller navn. Svarer færre enn to ja, vurderer gruppen endringer i prompt eller visning før epic 3.

## Technical Decisions

- **Lag:** `lib/kontrakt` (zod-skjemaer og feilkoder), `lib/kjerne` (ren logikk), `lib/llm` og `lib/pipeline` (`server-only`), og `lib/okt` (klienttilstand og fetch-innpakning). Belegg, treffprosent og maskering finnes bare i `lib/kjerne`. UI-et når kjernen bare gjennom `lib/okt`. ESLint håndhever grensene. Ingen Server Actions.
- **Pipeline:** Fast rekkefølge for alle resultatdeler, og demo og ekte modus går gjennom de samme kontrollene: inndata → maskering → `erDemoeksempel` → rate-limit → (`kontrollerKrav` på `GapGrunnlag` for brev/cv/ats) → adapter → skjema → beleggkontroll → treffprosent (gap) → logg. Svar strømmes ikke.
- **Port:** `LlmKlient` med `analyseGap`, `skrivSoknadsbrev`, `foreslaCvForbedringer` og `foreslaAts`. Mock-adapteren bruker lagrede demosvar, så en ny generering i demomodus viser det lagrede svaret igjen.
- **Feil:** HTTP-status + `{ feil: { kode } }`, og én meldingstabell i UI-et. *Prøv igjen* bare for `llm_feil`, `llm_tidsavbrudd` og `ugyldig_svar`. `grense_naadd` viser til *Prøv med eksempel*.
- **Økt-tilstand:** én `useReducer`-context.
  - `okt` varer hele økten, blant annet `bekreftetPersonvern`.
  - `innhold` (`utkast`, `kjoring`, `resultatdeler`) tømmes av *Ny analyse*. `gapVersjon` nullstilles aldri, fordi id-ene til kjøringene bygger på den. Det er et avvik fra AD-6, og det står i `deferred-work.md`.
  - `redigert` har samme form som `generert`, og en resultatdel er redigert når `redigert !== null`.
  - Bare `startGenerering(resultatdel)` sender requester, med vakt mot dobbeltstart og `AbortController`.
  - En ny kjøring eller *Ny analyse* avbryter requesten, og svar for en `kjoring.id` eller `gapVersjon` som ikke lenger gjelder, forkastes.
  - En ny generering av gap øker `gapVersjon` og merker andre faner som utdaterte.
  - Ingen nettleserlagring.
- **Testsett:** `scripts/kjor-testsett.ts` (`npm run testsett`) krever nøkkel og koster penger. Det kjører alle fire testparene tre ganger og rapporterer kategorier, nøkkelord, treffprosent, tokens og kostnad. Ikke med i `npm test` eller CI.
- **Konvensjoner:** Vitest ved siden av koden, med FR-ID i testnavnet, og testene kjører uten nøkkel. Domeneord på norsk uten æøå. Aldri `dangerouslySetInnerHTML`, og innhold vises som ren tekst.

## UX & Interaction Patterns

- **Resultatflaten:** «Resultat» som `h1` (`tabindex="-1"`), stilling og arbeidsgiver, og *Endre CV-tekst* og *Ny analyse* (under 640 px i en `DropdownMenu` bak «Valg»). shadcn `Tabs` med `activationMode="manual"`. Faner som ikke er bygget ennå, vises ikke. Fanemerket viser en spinner med den skjulte teksten «, genereres», og «· redigert» etter redigering.
- **Farger og tema:** Primærfargen er blå (`#1E4E8C`) på en kjølig bakgrunn. Appen har mørk modus som følger maskinen, med en bryter som ikke lagrer noe. Kategori-, belegg- og primærfargene kommer fra temategnene. Kategorifargene brukes bare på kategorimerker og venstrekanten på kravkort, og Mangler bruker aldri feilfargen.
- **Gap-fanen:** redigerbare felt «Krav», «Hvorfor delvis» og «Råd» med etiketter. Belegg-sitatet (`figure`, «Fra CV-en») og kategorien er låst.
- **Verktøylinje:** *Kopier* (primær) og *Generer på nytt*. Begge har `aria-disabled="true"` under generering og beholder fokus.
  - Kopiformatet for gap er per krav «Krav — Kategori», «Fra CV-en: «…»» og forklaring eller råd. Til slutt kommer «Treff: 22 % (veiledende)» og nøkkelordene som er funnet og ikke funnet.
  - Toasten «Kopiert» står øverst på mobil og har ingen knapper. Feilen ved kopiering er «Kunne ikke kopiere. Merk teksten og kopier selv.».
  - Feil i generering vises aldri som toast.
- **Dialoger (`AlertDialog`, fokus på *Avbryt*, fokus tilbake til knappen som åpnet):**
  - Generer på nytt i en redigert fane: «{tittel} Redigeringene dine i {fanenavn} blir overskrevet. Det nye bygger på CV-teksten og annonsen, ikke på endringene dine. Andre faner endres ikke.» (*Avbryt*, *Lag ny*). Tittelen står per fane, med riktig kjønn og liten forbokstav: «Lage ny gap-analyse?», «Lage nytt søknadsbrev?», «Lage nye CV-forbedringer?», «Lage nye ATS-forslag?».
  - *Analyser* med redigerte faner: «Starte en ny analyse? Alle resultatdelene erstattes. Redigeringene dine i {faner} blir overskrevet.» (*Avbryt*, *Analyser på nytt*)
  - *Ny analyse*: «Tømme alt? CV-teksten, annonsen og alle resultatdelene fjernes.» (*Avbryt*, *Tøm alt*)
- **Tilbake fra resultatet:** *Tilbake til resultatet* vises når det finnes en kjøring og teksten er uendret, også mens analysen genereres og etter en feil. Den går tilbake uten ny kjøring, og requesten fortsetter. Ellers står «Du har endret teksten. Trykk *Analyser* for en ny analyse.». EXPERIENCE.md sier «bare når det finnes resultater». Avviket er avgjort i story 2.7 og står i `deferred-work.md`.
- **Avkrysningen** vises som bekreftet bare hvis brukeren har krysset av. Appen setter aldri samtykket selv, heller ikke etter *Prøv med eksempel* (FR-5, FR-25).
- **Feil i fanen:** `Alert` med meldingen. *Prøv igjen* står der når det ikke finnes noen tidligere analyse. *Prøv med eksempel* står der ved feil og tidsavbrudd fra språkmodellen. Etter en ny generering som feiler, står den forrige analysen under varselet.
- **Utdatert fane:** `Alert` «Basert på forrige analyse.» med *Generer på nytt*. Live-regionen sier «{Fanenavn} er basert på forrige analyse.».
- **Fokus etter handling:**
  - *Analyser* og *Tilbake til resultatet* → «Resultat»
  - *Endre CV-tekst* → CV-tekstfeltet
  - Bekreftet *Ny analyse* → opplastingsknappen
  - *Prøv igjen* → fanepanelet
  - En fane som blir ferdig, flytter ikke fokus.
- **Live-region (én `aria-live="polite"`):** blant annet «Kopiert.», «Gap-analysen er klar. X av Y krav er oppfylt.» og meldingen om utdatert fane.
- **Mikrotekst og testing:** du-form, ingen utropstegn, ingen «vi» eller «jeg», kategorinavnene nøyaktig og «språkmodellen». Stories med brukerflate testes med tastatur, NVDA, VoiceOver, 320 px bredde og 200 % tekstzoom.

## Cross-Story Dependencies

- 2.1 (kontrakt, kjerne, port, mock, pipeline, API) og 2.2 (økt-tilstand og resultatflate) er grunnmuren som 2.3, 2.5, 2.6 og 2.7 utvider.
- 2.4 er ferdig: OpenAI kjører i produksjonen med personvernteksten på plass. 2.8 krever det, og skal gjøres før epic 3.
- 2.6 innførte redigering, kopiering, ny generering og økningen av `gapVersjon`. Rettingen etter 2.6 gjør at en ny generering som feiler, beholder den forrige analysen og redigeringene.
- 2.7 bygger på denne rettingen: dialogen ved *Analyser* og listen over redigerte faner kan stole på `redigert !== null`, også etter en feil. 2.7 bruker dialogmønsteret og forkastingen av sene svar fra 2.6.
- *Prøv med eksempel* finnes både i forberedelsen og i feilvarselet på resultatsiden, og den starter en ny kjøring med demoeksempelet.
- Epicen bygger på epic 1: forberedelsessiden, kontrollsteget, `masker`, grenser, `normaliser` og `erDemoeksempel`.
- Epic 3 og 4 gjenbruker pipelinen, `GapGrunnlag`, feiltabellen, verktøylinjen, dialogene og utdatert-mekanismen herfra.
