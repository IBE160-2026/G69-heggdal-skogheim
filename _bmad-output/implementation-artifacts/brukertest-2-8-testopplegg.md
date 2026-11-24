# Testopplegg: brukertest med medstudenter (story 2.8)

**Mål (SM-10):** Tre medstudenter utenfor gruppen bruker appen med sin egen CV-tekst og annonsen fra testpar 1. Etterpå svarer de på spørsmålet «Fant du en erfaring du ikke hadde tenkt på som relevant?». Testen er bestått når minst to svarer ja.

**Varighet:** 10–15 minutter per person, fysisk eller på Teams med skjermdeling. Passer ingen av delene, se punkt 7 for testen hjemmefra.

## 1. Før testen

- [ ] Story 2.4 er flettet, og produksjonen kjører med den valgte leverandøren (ikke demomodus). Åpne appen og sjekk at demobanneret ikke vises.
- [ ] Ha annonsen fra testpar 1 (`testdata/par-1-butikk-bank/annonse.txt`) klar til å sende som tekst. Annonsen er fiktiv: sommervikar i kundesenteret til Sparebanken Testvik.
- [ ] Avtal tid med tre medstudenter som ikke er med i gruppen. Be dem ha CV-en sin tilgjengelig som PDF, DOCX eller tekst.
- [ ] Avtal hvem som leder og hvem som noterer. Er dere to, gjør én hver ting.

## 2. Melding til dem du spør

> Hei! Kevin og jeg lager en app i IBE160 som sammenligner CV-en din med en stillingsannonse og viser krav for krav hva du dekker. Har du 15 minutter til å teste den med din egen CV?
>
> Du bruker CV-en du har, og en annonse vi gir deg. CV-teksten sendes til en språkmodell for analyse. Appen lagrer ingenting, og vi noterer verken navnet ditt eller noe fra CV-en. Leverandøren av språkmodellen kan likevel beholde teksten i opptil 30 dager for å oppdage misbruk. Fjern gjerne fødselsnummer, adresse og bilde først. Appen viser deg hvordan.
>
> Passer det [dag/tid]?

Setningen om at leverandøren kan beholde teksten i opptil 30 dager ble lagt til 2026-11-24, samme innhold som personvernboksen (spørsmål 9 i `beslutningsark-2-4-sondre.md`).

## 3. Gjennomføring

**Les dette høyt før start:**

> Vi tester appen, ikke deg. Det finnes ingen feil svar. Tenk gjerne høyt mens du bruker den. Vi hjelper ikke underveis, for vi vil se hvordan appen fungerer uten forklaring. Du kan stoppe når som helst.

**Oppgaven:**

1. Gi personen nettadressen og annonseteksten.
2. Si: «Se hva CV-en din dekker i denne annonsen.»
3. La personen bruke appen på egen hånd: personvernboksen, opplasting eller innliming, kontroll av CV-teksten, *Analyser* og resultatet.
4. Ikke hjelp. Står personen fast i over ett minutt, noter hvor, og hjelp bare så mye at testen kan fortsette.
5. Når personen har lest gjennom resultatet, still spørsmålene i punkt 4.

**Se etter og noter:**

- Hvor personen nøler, leser på nytt eller sier noe overrasket.
- Om personen forstår de tre kategoriene (Oppfylt, Delvis oppfylt, Mangler) og belegget «Fra CV-en».
- Om noe i resultatet er feil eller oppdiktet, for eksempel et belegg som ikke står i CV-en eller et krav som ikke står i annonsen.
- Om personen redigerer, kopierer eller trykker *Generer på nytt*.
- Feilmeldinger og hvor lang tid analysen tok.

## 4. Spørsmål etter testen

**Hovedspørsmålet, still det nøyaktig slik:**

> Fant du en erfaring du ikke hadde tenkt på som relevant?

Noter **ja** eller **nei**. Er svaret ja, spør: «Hvilken type erfaring var det?» Noter bare typen, for eksempel «frivillig verv» eller «deltidsjobb i butikk», aldri detaljer fra CV-en.

**Oppfølging (valgfritt):**

- Var det noe i resultatet du var uenig i?
- Var det noe du ikke forsto?
- Ville du brukt dette når du søker jobb? Hvorfor eller hvorfor ikke?

## 5. Notatmal

Ingen navn og ingen CV-tekst. Bruk T1, T2 og T3.

| | T1 | T2 | T3 |
|---|---|---|---|
| Dato | | | |
| Hovedspørsmål (ja/nei) | | | |
| Type erfaring (hvis ja) | | | |
| Uenig i | | | |
| Forsto ikke | | | |
| Står fast / nøler | | | |
| Feil eller oppdiktet i resultatet | | | |
| Tid for analysen | | | |
| Annet | | | |

## 6. Etterpå

- **Minst to ja:** SM-10 er oppfylt. Noter resultatet i sesjonsloggen og sett story 2.8 til `done`.
- **Færre enn to ja:** Gruppen vurderer endringer i prompten eller visningen før epic 3. Noter vurderingen i sesjonsloggen.
- I begge tilfeller: legg utfylt notatmal og observasjoner inn i sesjonsloggen (NFR-10). Lagre aldri navn eller CV-tekst i repoet.

## 7. Variant: testen hjemmefra

Brukes når testen ikke kan gjøres fysisk eller på Teams. Personen bruker appen på sin egen maskin og svarer på melding etterpå. Gruppen ser aldri CV-en.

**Slik gjør dere det:**

1. Send meldingen under, med lenken til appen og annonseteksten fra testpar 1.
2. Vent på svarene. Purr én gang etter to dager hvis du ikke har hørt noe.
3. Før svarene inn i notatmalen i punkt 5. Skriv «hjemmefra» i raden «Annet», og la «Står fast / nøler» bygge på svaret på spørsmål 3.

**Ikke gjør dette:** be om å få CV-en tilsendt for å kjøre testen selv. Da tester dere analysen, ikke om appen hjelper personen, og gruppen sitter med personopplysninger den ikke trenger.

**Melding til personen:**

> Hei! Takk for at du vil teste appen vår. Det tar 10–15 minutter.
>
> 1. Åpne [lenke til appen].
> 2. Bruk din egen CV, enten som fil eller innlimt tekst. Fjern gjerne fødselsnummer, adresse og bilde først. Appen viser hvordan.
> 3. Lim inn annonsen under, trykk *Analyser* og les gjennom resultatet.
> 4. Svar på spørsmålene nederst. Ikke send oss CV-en eller noe fra den.
>
> CV-teksten sendes til en språkmodell for analysen. Appen lagrer ingenting, og alt er borte når du lukker fanen. Leverandøren av språkmodellen kan likevel beholde teksten i opptil 30 dager for å oppdage misbruk.
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
