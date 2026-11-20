# Epic 2 Context: Brukeren ser ærlig hva CV-en dekker

<!-- Compiled from planning artifacts. Edit freely. Regenerate with compile-epic-context if planning docs change. -->

## Goal

Brukeren trykker *Analyser* og får gap-analysen. Hvert krav i annonsen får kategorien Oppfylt, Delvis oppfylt eller Mangler, belegget kontrolleres i kode, Mangler får ærlige råd, og treffprosenten regnes deterministisk. Resultatet kan redigeres, kopieres og genereres på nytt. Brukeren kan gå tilbake med *Endre CV-tekst* eller tømme alt med *Ny analyse*, og feil vises på norsk med *Prøv igjen* uten at data går tapt. *Prøv med eksempel* viser demoeksempelet (testpar 1) uten nøkkel og uten kall til språkmodellen, og leverandøren velges ved måling mellom Mistral og OpenAI. Valget er tatt: OpenAI `gpt-4.1-mini` med temperatur 0. Epicen leverer kjernen i produktløftet, at ingenting diktes opp, og grunnmuren (pipeline, økt-tilstand, feilformat, verktøylinje, dialoger, utdatert-mekanisme) som brev-, CV- og ATS-fanene i epic 3 og 4 bygger på.

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

- **Kategorier og råd:** Alle krav i annonsen hentes ut, både krav og ønsker. Ved tvil velges den svakeste kategorien. Ingen krav over fasiten, og Mangler i fasiten er alltid Mangler. Delvis oppfylt har belegg og én setning om hvorfor. Mangler får et ærlig råd (vilje til å lære, beslektet erfaring, legg erfaringen inn via kontrollsteget) og foreslår aldri å påstå kvalifikasjonen.
- **Beleggkontroll i kode:** Belegget må stå ordrett i CV-teksten etter normalisering (store og små bokstaver, mellomrom, linjeskift, listetegn, bindestreker og tankestreker inkludert orddeling, og anførselstegn regnes ikke med). Det må følge ordgrensene og ha minst 4 tegn. Oppfylt eller Delvis oppfylt uten gyldig belegg blir Mangler med `nedgradert: true`, og belegget vises ikke.
- **Nøkkelord og treffprosent:** Hentes i samme generering. Hvert nøkkelord knyttes til ett krav eller ingen (`kravIndeks`), og koblingen påvirker ikke prosenten. Prosenten regnes i kode og er veiledende, ikke en ATS-score.
- **Ingen oppdiktning:** Ingen kvalifikasjoner, arbeidsgivere, årstall eller tall som ikke står i CV-teksten, med mindre de er presentert som noe brukeren mangler.
- **Redigering:** Tekstfeltene kan redigeres og står til økten avsluttes. Kategori, belegg, treffprosent og nøkkelord er låst. Nye genereringer bygger alltid på original (maskert) CV-tekst og annonse, aldri på redigeringer. *Kopier* kopierer `redigert ?? generert`.
- **Ny kjøring:** Etter *Endre CV-tekst* beholdes CV-teksten og annonsen. *Analyser* erstatter alle resultatdeler, med bekreftelse hvis noe er redigert. *Ny analyse* tømmer alt etter bekreftelse, men avkrysningen for personvern gjelder fortsatt.
- **Feil:** Norske meldinger som sier hva som skjedde og hva brukeren kan gjøre, uten tap av tekst eller redigeringer. Hvert tilfelle kan fremkalles i test uten krasj. *Prøv med eksempel* virker også når kreditten er brukt opp.
- **Ytelse, kostnad og språk:** Gap-analysen er ferdig innen 30 s, og brukeren ser at noe skjer innen 2 s. Mål 1 kr eller mindre per full kjøring. Forhåndsbetalt kreditt under 200 kr uten automatisk påfylling er det harde taket. Svarene er på naturlig bokmål.
- **Personvern:** Ingenting skrives til database, disk eller nettleserlagring. Bare metadata logges, og ingen IP-adresser.
- **Leverandørvalg:** Testsettet kjøres tre ganger per testpar mot begge leverandørene. Mistral velges hvis den består gap-delen av sjekklisten, ingen oppdiktning i noen kjøring og bokmålskravet innenfor 1 kr per kjøring. Ellers velges OpenAI. Før valget er ferdig: sjekk vilkårene (ingen trening på API-data, databehandleravtale), sett `LLM_LEVERANDOR`, `LLM_MODELL` og nøkkel i Production på Vercel, og sjekk at personvernboksen viser riktig leverandør og land. Resultat, modell og commit-versjon noteres i sesjonsloggen.
- **Valgt leverandør:** OpenAI `gpt-4.1-mini` med temperatur 0. Mistral besto ikke SM-3, og Mistral Large 4 feilet ytelseskravet. SM-1 ble 12 av 12 på den gamle prompten etter at fasiten for par 3 ble revurdert (2026-11-20). Med prompten fra PR #27 og PR #28 er SM-1 9 av 12, SM-2 10 av 12 og SM-3 11 av 12 (`vurdering-2-4-kontroll-ny-prompt.md`), og Kevin og Sondre avgjør hva det betyr for 2.4. Personvernboksen i produksjonen viser OpenAI i USA (utenfor EØS). Det som gjenstår, er om boksen skal nevne OpenAIs logger mot misbruk (opptil 30 dager) og om de 56 lagrede forespørslene skal slettes.
- **Brukertest:** Tre medstudenter utenfor gruppen tester med egen CV og annonsen fra par 1, og minst to skal svare ja på «Fant du en erfaring du ikke hadde tenkt på som relevant?». Svarene noteres uten CV-tekst eller navn. Ved færre enn to ja vurderer gruppen endringer i prompt eller visning før epic 3.

## Technical Decisions

- **Lag:** `lib/kontrakt` (zod-skjemaer og feilkoder), `lib/kjerne` (ren logikk), `lib/llm` og `lib/pipeline` (`server-only`), og `lib/okt` (klienttilstand og fetch-innpakning). Belegg, treffprosent og maskering finnes bare i `lib/kjerne`. UI når kjernen bare via `lib/okt`. ESLint håndhever grensene. Ingen Server Actions.
- **Pipeline:** fast rekkefølge for alle resultatdeler, demo og ekte modus gjennom de samme kontrollene: inndata → maskering → `erDemoeksempel` → rate-limit → (`kontrollerKrav` på `GapGrunnlag` for brev/cv/ats) → adapter → skjema → beleggkontroll → treffprosent (gap) → logg. Svar strømmes ikke.
- **Port:** `LlmKlient` med `analyseGap`, `skrivSoknadsbrev`, `foreslaCvForbedringer`, `foreslaAts`. Mock-adapteren bruker lagrede demosvar, så ny generering i demomodus viser det lagrede svaret igjen.
- **Feil:** HTTP-status + `{ feil: { kode } }`, én meldingstabell i UI-et. *Prøv igjen* bare for `llm_feil`, `llm_tidsavbrudd` og `ugyldig_svar`. `grense_naadd` viser til *Prøv med eksempel*.
- **Økt-tilstand:** én `useReducer`-context. `okt` varer hele økten (blant annet `bekreftetPersonvern`), `innhold` (`utkast`, `kjoring`, `resultatdeler`, `gapVersjon`) tømmes av *Ny analyse*. `redigert` har samme form som `generert`. Bare `startGenerering(resultatdel)` sender requester, med vakt mot dobbeltstart og `AbortController`. Ny kjøring eller *Ny analyse* avbryter requesten, og svar for en `kjoring.id` eller `gapVersjon` som ikke lenger gjelder, forkastes. Ny generering av gap øker `gapVersjon` og merker andre faner som utdaterte. Ingen nettleserlagring.
- **Testsett:** `scripts/kjor-testsett.ts` (`npm run testsett`) krever nøkkel, kjører alle fire testparene tre ganger og rapporterer kategorier, nøkkelord, treffprosent, tokens og kostnad. Ikke med i `npm test` eller CI.
- **Konvensjoner:** Vitest ved siden av koden med FR-ID i testnavnet, testene kjører uten nøkkel. Domeneord på norsk uten æøå. Aldri `dangerouslySetInnerHTML`, innhold vises som ren tekst.

## UX & Interaction Patterns

- **Resultatflaten:** «Resultat» som `h1` (`tabindex="-1"`), stilling og arbeidsgiver, og *Endre CV-tekst* og *Ny analyse* (under 640 px i `DropdownMenu` bak «Valg»). shadcn `Tabs` med `activationMode="manual"`. Faner som ikke er bygget ennå, vises ikke. Fanemerket viser spinner med skjult tekst «, genereres», og «· redigert» etter redigering.
- **Farger og tema:** Primærfargen er blå (`#1E4E8C`) på kjølig bakgrunn. Appen har mørk modus som følger maskinen, med en bryter som ikke lagrer noe. Kategori-, belegg- og primærfarger må derfor komme fra temategnene, så gap-fanen fungerer i begge temaer. Kategorifargene brukes bare på kategorimerker og venstrekanten på kravkort, og Mangler bruker aldri feilfargen.
- **Gap-fanen:** redigerbare felt «Krav», «Hvorfor delvis» og «Råd» med etiketter. Belegg-sitat (`figure`, «Fra CV-en») og kategori er låst.
- **Verktøylinje:** *Kopier* (primær) og *Generer på nytt*, begge `aria-disabled="true"` under generering og beholder fokus. Kopiformat for gap: per krav «Krav — Kategori», «Fra CV-en: «…»» og forklaring eller råd, til slutt «Treff: 22 % (veiledende)» og nøkkelordene funnet og ikke funnet. Toast «Kopiert» (øverst på mobil, ingen knapper). Feil: «Kunne ikke kopiere. Merk teksten og kopier selv.». Feil i generering vises aldri som toast.
- **Dialoger (`AlertDialog`, fokus på *Avbryt*, fokus tilbake til knappen som åpnet):**
  - Generer på nytt i redigert fane: «{tittel} Redigeringene dine i {fanenavn} blir overskrevet. Det nye bygger på CV-teksten og annonsen, ikke på endringene dine. Andre faner endres ikke.» (*Avbryt*, *Lag ny*). Tittelen står per fane med riktig kjønn og liten forbokstav: «Lage ny gap-analyse?», «Lage nytt søknadsbrev?», «Lage nye CV-forbedringer?», «Lage nye ATS-forslag?».
  - *Analyser* med redigerte faner: «Starte en ny analyse? Alle resultatdelene erstattes. Redigeringene dine i {faner} blir overskrevet.» (*Avbryt*, *Analyser på nytt*)
  - *Ny analyse*: «Tømme alt? CV-teksten, annonsen og alle resultatdelene fjernes.» (*Avbryt*, *Tøm alt*)
- **Tilbake fra resultatet:** *Tilbake til resultatet* vises bare når det finnes resultater og teksten er uendret, og går tilbake uten ny kjøring. Ellers står «Du har endret teksten. Trykk *Analyser* for en ny analyse.». Avkrysningen vises som bekreftet.
- **Utdatert fane:** `Alert` «Basert på forrige analyse.» med *Generer på nytt*. Live-region: «{Fanenavn} er basert på forrige analyse.»
- **Fokus etter handling:** *Analyser* og *Tilbake til resultatet* → «Resultat». *Endre CV-tekst* → CV-tekstfeltet. Bekreftet *Ny analyse* → opplastingsknappen. *Prøv igjen* → fanepanelet. Ferdig fane flytter ikke fokus.
- **Live-region (én `aria-live="polite"`):** blant annet «Kopiert.», «Gap-analysen er klar. X av Y krav er oppfylt.» og meldingen om utdatert fane.
- **Mikrotekst og testing:** du-form, ingen utropstegn, ingen «vi» eller «jeg», kategorinavnene nøyaktig, «språkmodellen». Stories med brukerflate testes med tastatur, NVDA, VoiceOver, 320 px bredde og 200 % tekstzoom.

## Cross-Story Dependencies

- 2.1 (kontrakt, kjerne, port, mock, pipeline, API) og 2.2 (økt-tilstand og resultatflate) er grunnmuren som 2.3, 2.5, 2.6 og 2.7 utvider.
- 2.4 krever ekte adaptere fra 2.3. 2.8 krever 2.3 og 2.4 med valgt leverandør (OpenAI) satt opp i produksjon, inkludert ferdig personverntekst, og skal gjøres før epic 3.
- 2.6 innfører redigering, kopiering, ny generering og `gapVersjon`-økning. 2.7 bruker dialogen for redigerte faner og forkastingen av sene svar.
- Bygger på epic 1: forberedelsessiden, kontrollsteget, `masker`, grenser, `normaliser` og `erDemoeksempel`.
- Epic 3 og 4 gjenbruker pipelinen, `GapGrunnlag`, feiltabellen, verktøylinjen, dialogene og utdatert-mekanismen herfra.
