# Testopplegg: brukertest med medstudenter (story 2.8)

**Mål (SM-10):** Tre medstudenter utenfor gruppen bruker appen med sin egen CV-tekst og annonsen fra testpar 1. Etterpå svarer de på spørsmålet «Fant du en erfaring du ikke hadde tenkt på som relevant?». Testen er bestått når minst to svarer ja.

**Varighet:** 10–15 minutter per person, fysisk eller på Teams med skjermdeling.

## 1. Før testen

- [ ] Story 2.4 er flettet, og produksjonen kjører med den valgte leverandøren (ikke demomodus). Åpne appen og sjekk at demobanneret ikke vises.
- [ ] Ha annonsen fra testpar 1 (`testdata/par-1-butikk-bank/annonse.txt`) klar til å sende som tekst. Annonsen er fiktiv: sommervikar i kundesenteret til Sparebanken Testvik.
- [ ] Avtal tid med tre medstudenter som ikke er med i gruppen. Be dem ha CV-en sin tilgjengelig som PDF, DOCX eller tekst.
- [ ] Avtal hvem som leder og hvem som noterer. Er dere to, gjør én hver ting.

## 2. Melding til dem du spør

> Hei! Kevin og jeg lager en app i IBE160 som sammenligner CV-en din med en stillingsannonse og viser krav for krav hva du dekker. Har du 15 minutter til å teste den med din egen CV?
>
> Du bruker CV-en du har, og en annonse vi gir deg. CV-teksten sendes til en språkmodell for analyse, men ingenting lagres, og vi noterer verken navnet ditt eller noe fra CV-en. Fjern gjerne fødselsnummer, adresse og bilde først. Appen viser deg hvordan.
>
> Passer det [dag/tid]?

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
