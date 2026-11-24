# Testopplegg: brukertest med medstudenter (story 2.8)

> **Merknad (2026-11-24):** T1 (2026-11-20) var med en kjenning, ikke en medstudent, og ble kjørt på en eldre prompt. T1 teller ikke i SM-10 og står bare som tilleggsobservasjon i [resultatfilen](brukertest-2-8-resultater.md). De gyldige testene er **T2, T3 og T4**. Erstatninger får T5 og videre. Opplegget er rettet etter [spec-en for 2.8](spec-2-8-brukertest-med-medstudenter.md), og spec-en gjelder ved tvil.

**Mål (SM-10):** Tre medstudenter utenfor gruppen bruker appen med sin egen CV-tekst og annonsen fra testpar 1. Etterpå svarer de på spørsmålet «Fant du en erfaring du ikke hadde tenkt på som relevant?». Testen er bestått når minst to svarer ja.

**Varighet:** 10–15 minutter per person, fysisk eller på Teams med skjermdeling. Passer ingen av delene, se punkt 7 for testen hjemmefra.

**Frist:** testene er ferdige innen 2026-12-01. En invitasjon som sendes etter 2026-11-27, rekker ikke regelen om fire dager før fristen. Går fristen ut uten tre gyldige tester, føres det i konklusjonen i resultatfilen, og Kevin og Sondre avgjør om epic 3 kan flettes.

**Analyser:** 3–6 analyser i produksjonen er godkjent av Kevin, bare for de faktiske testene. Én analyse er hvert betalt kall til språkmodellen (*Analyser*, *Prøv igjen* og *Generer på nytt*). *Prøv med eksempel* er gratis og telles ikke. Den som leder, fører antall analyser per person og en løpende sum i resultatfilen. Før hver ny invitasjon, ikke bare for erstatninger: kan summen pluss den neste testen bli mer enn 6, godkjenner Kevin først.

**Personvern:** navn, kontaktinformasjon, CV-tekst, sitater fra CV-en og API-nøkler skal aldri stå i repoet, i sesjonsloggene, i commit-meldinger, på GitHub eller i chatten med agenten. Rå svar limes aldri inn i agenten. Den som leder, fører bare typer og kategorier for hånd og sletter meldingene etterpå. Ingen liste kobler T-numre til personer.

## 1. Før testen

- [ ] **Versjonen er ført.** Kevin eller Sondre fører versjonen og svaret fra `GET /api/status` i resultatfilen før den første gyldige testen (V1). Versjonen består av:
  - (a) commit-SHA-en til den aktive produksjonsutrullingen i Vercel
  - (b) verdiene i `LLM_*` i Vercel (bare verdiene, aldri nøkler)
  - (c) den siste commiten på `main` som endret `src`, `package.json`, `package-lock.json`, `next.config.ts`, `vercel.json` eller `tsconfig.json`
- [ ] **Sondre har testet produksjonen med *Prøv med eksempel*** for å bekrefte at story 2.7 virker. Det er gratis, uten kall til språkmodellen. Resultatet er ført i resultatfilen. Feiler testen med eksempelet, eller sier `/api/status` ikke `ekte`, starter ikke testperioden før feilen er rettet og rettingen er ført i resultatfilen.
- [ ] **Kevin har gitt Sondre beskjed om at testperioden starter**, og beskjeden er ført i resultatfilen. Fra da og til versjonssjekken etter den siste testen er bestått, gjelder frysen:
  - Frysen gjelder koden og innstillingene i Vercel og OpenAI, ikke dokumentasjonen. Ingen PR som endrer stiene i (c), flettes til `main`. Logger og dokumentasjon kan flettes så lenge de ikke påvirker hvordan appen virker.
  - Ingen tilbakerulling eller *Promote* i Vercel. Miljøvariablene i Vercel og innstillingene i OpenAI-prosjektet endres ikke.
  - Ordet «Mangler» endres ikke under testen. Det vurderes etter testene.
  - **Unntak:** en kritisk feil, det vil si en feil som hindrer en testperson i å bruke appen, kan rettes. Rettingen gir en ny versjon (V2 osv.) som føres i resultatfilen. Kevin og Sondre vurderer og fører om tidligere tester må tas på nytt.
- [ ] Åpne `https://g69-cv-assistent.vercel.app` og sjekk at demobanneret ikke vises. Bruk alltid denne lenken, aldri en forhåndsvisning.
- [ ] Ha annonsen fra testpar 1 (`testdata/par-1-butikk-bank/annonse.txt`) klar til å sende som tekst. Annonsen er fiktiv: sommervikar i kundesenteret til Sparebanken Testvik.
- [ ] Avtal tid med tre medstudenter som ikke er med i gruppen. **Bekreft før testen at personen er medstudent utenfor gruppen.** En kjenning eller noen i gruppen teller ikke. Be dem ha CV-en sin tilgjengelig som PDF, DOCX eller tekst.
- [ ] Kevin leder T2 og T3 hjemmefra etter punkt 7. Kevin og Sondre skaffer T4 sammen og avtaler hvem som leder den.
- [ ] Ved test med observasjon: avtal hvem som leder og hvem som noterer. Er dere to, gjør én hver ting.

## 2. Melding til dem du spør

> Hei! Vi (Kevin og Sondre) lager en app i IBE160 som sammenligner CV-en din med en stillingsannonse og viser krav for krav hva du dekker. Har du 15 minutter til å teste den med din egen CV?
>
> Du bruker CV-en du har, og en annonse vi gir deg. Bruk din egen CV, ikke *Prøv med eksempel*. Det holder å analysere én gang.
>
> CV-teksten sendes til språkmodellen til OpenAI i USA, altså ut av EØS. Appen lagrer ingenting, og vi noterer verken navnet ditt eller noe fra CV-en. OpenAI kan likevel beholde teksten i opptil 30 dager for å oppdage misbruk. Fødselsnummeret fjernes automatisk. Fjern selv adresse, bilde og helseopplysninger først.
>
> Nei er like nyttig for oss som ja. Ikke snakk med andre testpersoner om resultatet før du har svart.
>
> Passer det [dag/tid]?

Setningen om at leverandøren kan beholde teksten i opptil 30 dager ble lagt til 2026-11-24, samme innhold som personvernboksen (spørsmål 9 i `beslutningsark-2-4-sondre.md`). Samme dag ble meldingen rettet etter personvernboksen i appen (`Personvernboks.tsx`, `lib/okt/personvern.ts`) og maskeringen av fødselsnummer (`lib/kjerne/masker.ts`).

## 3. Gjennomføring

**Les dette høyt før start:**

> Vi tester appen, ikke deg. Det finnes ingen feil svar. Tenk gjerne høyt mens du bruker den. Vi hjelper ikke underveis, for vi vil se hvordan appen fungerer uten forklaring. Du kan stoppe når som helst.

**Oppgaven:**

1. Gi personen nettadressen `https://g69-cv-assistent.vercel.app` og annonseteksten.
2. Si: «Se hva CV-en din dekker i denne annonsen.»
3. La personen bruke appen på egen hånd: personvernboksen, opplasting eller innliming, kontroll av CV-teksten, *Analyser* og resultatet.
4. Ikke hjelp. Står personen fast i over ett minutt, noter hvor, og hjelp bare så mye at testen kan fortsette.
5. Når personen har lest gjennom resultatet, still spørsmålene i punkt 4.

**Se etter og noter:**

- Hvor personen nøler, leser på nytt eller sier noe overrasket.
- Om personen forstår de tre kategoriene (Oppfylt, Delvis oppfylt, Mangler) og belegget «Fra CV-en».
- Om noe i resultatet er feil eller oppdiktet, for eksempel et belegg som ikke står i CV-en eller et krav som ikke står i annonsen.
- Om personen redigerer, kopierer eller trykker *Generer på nytt*.
- Om personen bruker *Endre CV-tekst*, *Tilbake til resultatet* eller *Ny analyse* (under 640 px ligger *Endre CV-tekst* og *Ny analyse* i menyen «Valg»). Gjelder bare tester med observasjon.
- Feilmeldinger og hvor lang tid analysen tok.

## 4. Spørsmål etter testen

**Hovedspørsmålet, still det nøyaktig slik:**

> Fant du en erfaring du ikke hadde tenkt på som relevant?

Noter **ja**, **nei** eller **uklart**. Er svaret ja, spør: «Hvilken type erfaring var det?» Noter bare typen, for eksempel «frivillig verv» eller «deltidsjobb i butikk», aldri detaljer fra CV-en.

**Nye oppfølginger (2026-11-24).** De valgfrie spørsmålene under er med fra det opprinnelige opplegget og er fortsatt tillatt. Utover dem er bare disse lagt til:

- **Ved et uklart svar** («vet ikke», «litt», «begge»): spør «Ville du sagt ja eller nei?». Gir personen fortsatt ikke et tydelig ja eller nei, noter **uklart**. Uklart teller ikke som ja.
- **Etter ja:**
  - «Hva sa appen om den: Oppfylt, Delvis oppfylt eller Mangler?»
  - «Står den i CV-en din? (ja/nei)»
  - Har appen sagt «Mangler», teller svaret som ja etter hovedspørsmålet. Det merkes, telles for seg og vurderes sammen med de andre resultatene.
- **Alltid:** «Brukte du din egen CV?» Har personen brukt *Prøv med eksempel*, også etter en feil, teller ikke testen.

**Oppfølging (valgfritt, fra det opprinnelige opplegget):**

- Var det noe i resultatet du var uenig i?
- Var det noe du ikke forsto?
- Ville du brukt dette når du søker jobb? Hvorfor eller hvorfor ikke?

## 5. Notatmal

Notatmalen er tabellen i [resultatfilen](brukertest-2-8-resultater.md). Den som leder, fører raden der og ikke andre steder. Ingen navn og ingen CV-tekst. Bruk T2, T3 og T4, og T5 og videre for erstatninger.

Radene er de samme som før (dato, hovedspørsmål, type erfaring, uenig i, forsto ikke, står fast / nøler, feil eller oppdiktet i resultatet, tid for analysen, annet), og i tillegg: leder, invitasjon sendt (dato), form (hjemmefra, Teams eller fysisk), versjon (V1, V2 osv.), medstudent bekreftet, egen CV, kategori og «står i CV-en» etter ja, antall analyser, om personen har sett appen før, og enhet.

## 6. Etterpå

- **Storyen er ferdig** når tre gyldige tester er ført og versjonssjekken er bestått.
  - En test er gyldig når personen er medstudent utenfor gruppen (bekreftet før testen), har brukt sin egen CV og ikke *Prøv med eksempel*, har fått et ekte resultat, og testen er kjørt på den faste versjonen.
  - Versjonssjekken: Kevin eller Sondre fører versjonen og `GET /api/status` etter den siste gyldige testen. Sjekken er bestått når alt er likt før og etter, eller når hver endring er en dokumentert retting av en kritisk feil med en ført vurdering.
- **Minst to ja:** SM-10 er oppfylt.
- **Færre enn to ja:** Kevin og Sondre vurderer sammen om prompten eller visningen skal endres. Vurderingen føres i resultatfilen og i begge sesjonsloggene før epic 3 flettes.
- Story 2.8 settes til `done` etterpå, i en egen PR for avslutningen. Ved færre enn to ja settes 2-8 til `done` først når vurderingen til Kevin og Sondre er ført i resultatfilen og i begge sesjonsloggene.
- Den som leder en test, fører raden i resultatfilen og skriver i sin egen sesjonslogg: svaret og typen, uten personopplysninger, og en lenke til raden i resultatfilen.
- **Personvern:** navn, kontaktinformasjon, CV-tekst, sitater fra CV-en og API-nøkler skal aldri stå i repoet, i sesjonsloggene, i commit-meldinger, på GitHub eller i chatten med agenten. Før PR-en for avslutningen kjører den som leder `git grep -i -f -` fra roten av repoet, slik at hele repoet søkes, også `.logs/`. Testpersonenes navn, e-post og telefonnummer skrives inn på standard inn, ett per linje, og avsluttes med Ctrl+Z og Enter i PowerShell eller Ctrl+D i Git Bash. Da havner de ikke i historikken til skallet. Søkeordene skrives aldri på kommandolinjen og lagres ikke noe sted. Resultatet skal være tomt.
- Funn om feil i resultatet (oppdiktet belegg eller feil kategori) føres under «Funn for SM-1» i resultatfilen og som et åpent punkt i `issues.md`.

## 7. Variant: testen hjemmefra

Brukes når testen ikke kan gjøres fysisk eller på Teams. Personen bruker appen på sin egen maskin og svarer på melding etterpå. Gruppen ser aldri CV-en.

**Slik gjør dere det:**

1. Bekreft at personen er medstudent utenfor gruppen før du sender meldingen.
2. Send meldingen under, med lenken til appen og annonseteksten fra testpar 1.
3. Vent på svarene. Purr én gang etter to dager hvis du ikke har hørt noe. Har du ikke fått svar fire dager etter invitasjonen, før testen som «Ikke svart» og finn en ny testperson. En invitasjon som sendes etter 2026-11-27, rekker ikke regelen om fire dager før fristen 2026-12-01. Går fristen ut uten tre gyldige tester, føres det i konklusjonen, og Kevin og Sondre avgjør om epic 3 kan flettes.
4. Er svaret på spørsmål 1 uklart, spør «Ville du sagt ja eller nei?». Er svaret ja, still oppfølgingen etter ja fra punkt 4. Kommer det ikke svar på oppfølgingen innen to dager, står et uklart svar som «uklart». Etter ja teller hovedsvaret som gitt, og feltene for oppfølgingen føres som «ikke svart».
5. Før svarene inn i raden i resultatfilen for hånd, bare som typer og kategorier. Skriv «hjemmefra» i raden «Annet», og la «Står fast / nøler» bygge på svaret på spørsmål 3. Slett meldingene etterpå. Lim aldri inn rå svar i agenten.

**Ikke gjør dette:** be om å få CV-en tilsendt eller kjøre testen for personen. Da tester dere analysen, ikke om appen hjelper personen, og gruppen sitter med personopplysninger den ikke trenger.

**Melding til personen:**

> Hei! Takk for at du vil teste appen vår. Vi (Kevin og Sondre) lager den i IBE160. Det tar 10–15 minutter.
>
> 1. Åpne https://g69-cv-assistent.vercel.app.
> 2. Bruk din egen CV, enten som fil eller innlimt tekst, ikke *Prøv med eksempel*. Fødselsnummeret fjernes automatisk. Fjern selv adresse, bilde og helseopplysninger først.
> 3. Lim inn annonsen under, trykk *Analyser* og les gjennom resultatet. Det holder å analysere én gang.
> 4. Svar på spørsmålene nederst. Ikke send oss CV-en eller noe fra den.
>
> CV-teksten sendes til språkmodellen til OpenAI i USA, altså ut av EØS. Appen lagrer ingenting, og alt er borte når du lukker fanen. OpenAI kan likevel beholde teksten i opptil 30 dager for å oppdage misbruk.
>
> Nei er like nyttig for oss som ja. Ikke snakk med andre testpersoner om resultatet før du har svart.
>
> **Annonsen:**
> [lim inn teksten fra testdata/par-1-butikk-bank/annonse.txt]
>
> **Spørsmål:**
> 1. Fant du en erfaring du ikke hadde tenkt på som relevant? (ja/nei) Hvis ja, hvilken type erfaring var det? Skriv bare typen, for eksempel «frivillig verv».
> 2. Var det noe i resultatet du var uenig i, eller som var feil?
> 3. Var det noe du stod fast på eller ikke forsto?
> 4. Ville du brukt dette når du søker jobb? Hvorfor eller hvorfor ikke?
> 5. Omtrent hvor lang tid tok analysen?
>
> Hvis du svarte ja på spørsmål 1:
> - Hva sa appen om den: Oppfylt, Delvis oppfylt eller Mangler?
> - Står den i CV-en din? (ja/nei)
>
> Til slutt: Brukte du din egen CV?

**Tilfeller og hva dere gjør (fra matrisen i spec-en):**

| Tilfelle | Slik føres det | Hva dere gjør |
|---|---|---|
| Ikke medstudent (en kjenning eller noen i gruppen) | Teller ikke. Kan føres som tilleggsobservasjon | Ny testperson |
| Personen brukte *Prøv med eksempel*, også etter en feil | Teller ikke. Føres i «Annet» | Ny testperson |
| Ikke noe ekte resultat (kreditten er brukt opp, grensen er nådd, eller analysen feilet uten at et nytt forsøk lyktes) | Teller ikke. Feilen føres | Ny testperson. Er kreditten brukt opp, avgjør Kevin |
| Filen kan ikke leses (skannet PDF eller lesefeil, og personen limer ikke inn teksten) | «Ikke fullført». Feilen føres | Ny testperson |
| CV-en er på engelsk | Teller. Føres i «Annet» som funn for FR-4 | — |
| Ingen svar fire dager etter invitasjonen (purring etter dag 2) | «Ikke svart» | Ny testperson |
| Uklart svar etter «Ville du sagt ja eller nei?» | «Uklart». Teller ikke som ja | — |
| Ja fra «Mangler» | Teller som ja, merkes og telles for seg | Vurderes sammen med de andre resultatene |
| Personen sender CV-en eller et utdrag | Ingenting fra den føres. Meldingen slettes | «Annet»: «sendte CV, slettet» |
| Navn, arbeidsgiver eller sitat i svaret | Bare typen føres | Detaljene utelates |
| Oppdiktet belegg eller feil kategori | Svaret føres som gitt. Feilen føres under «Funn for SM-1» | Åpent punkt i `issues.md` |
| En del av versjonen er endret mellom testene uten en kritisk feil | Testene før endringen teller ikke | Testene kjøres på nytt. Flere analyser avklares med Kevin |
| Kritisk feil (hindrer en testperson i å bruke appen) | Feilen rettes, og den nye versjonen føres. Hver rad viser versjonen personen brukte | Kevin og Sondre fører om tidligere tester må tas på nytt |
| Erstatninger ville gi mer enn 6 analyser | Ingen ny invitasjon | Kevin avklarer først |
| Fristen 2026-12-01 går ut uten tre gyldige tester | Føres i konklusjonen i resultatfilen | Kevin og Sondre avgjør om epic 3 kan flettes |
