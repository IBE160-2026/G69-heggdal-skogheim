# Kjente svakheter ved det valgte oppsettet (story 2.4)

> **Samlet 2026-11-22** av Claude på oppdrag fra Kevin, fra vurderingene og loggene i story 2.4. Lista er en oversikt, ikke en ny vurdering. Hvert punkt har kilden sin.
>
> **Ingenting er endret** i prompten, koden eller testdataene.
>
> **Oppfølgingen** står i beslutningsarket når den trenger Sondre, og i `issues.md` eller `deferred-work.md` ellers. Kvalitetspunktene (avsnitt 1–5) følges opp når testsettet kjøres på nytt, i brukertesten i 2.8 og i story 5.1. Der et punkt har et eget mål, står det ved punktet.
>
> Punktet stammer fra `issues.md` (2026-11-19, `story-2-4-del-b-forberedelse`): «Dokumenter de kjente svakhetene ved det valgte oppsettet».

**Oppsettet:**
- OpenAI `gpt-4.1-mini` (`gpt-4.1-mini-2025-04-14`) med temperatur 0, valgt 2026-11-19 etter AD-11.
- Prompten i produksjonen er den fra PR #27 og PR #28 (`b50e34a`).

## 1. Suksesskriteriene som ikke er bestått med prompten i produksjonen

Fra `vurdering-2-4-kontroll-ny-prompt.md` (testsettet 2026-11-20, 12 kjøringer):

| Kriterium | Resultat | Kjøringene | Kort om feilen |
|---|---|---|---|
| SM-1 | 9 av 12 | par 2 K1 og K3, par 3 K1 | Summen av bruddene under |
| SM-2 | 10 av 12 | par 2 K1 og K3 | «viser erfaring med brukerstøtte som studentassistent» og «viser forståelse av Windows». Ingen av dem står i CV-en |
| SM-3 | 11 av 12 | par 3 K1 | «Gode samarbeidsevner» Delvis oppfylt, mot Mangler i den revurderte fasiten |

- På den gamle prompten (`271edb4`, temperatur 0) var alle tre 12 av 12 med den revurderte fasiten (`vurdering-2-4-kontroll-temperatur-0.md`, avsnitt 6).
- **Årsaken er ikke avklart.** Feilene av samme type forekom også i rundene 3–5 før PR #28. Det står i avsnitt 2a i PR #30 (ikke flettet).
- **Veien videre avgjøres av Kevin og Sondre:** spørsmål 2 i [`beslutningsark-2-4-sondre.md`](beslutningsark-2-4-sondre.md).

## 2. Grensetilfeller som ikke er regnet som brudd

- **«Du har erfaring med fakturaer»** i par 3, i alle tre kjøringene. CV-en har «Besvarte kundehenvendelser om fakturaer og abonnement». Setningen har stått i alle rundene og i kontrollen, men ikke i alle kjøringene. Med den gamle prompten sto den bare i K1. K2 og K3 hadde «erfaring med kundehenvendelser om fakturaer» (`vurdering-2-4-kontroll-ny-prompt.md`, avsnitt 2). Hvis den regnes som brudd, blir SM-1 og SM-2 7 av 12 med den nye prompten, og 11 av 12 med den gamle (spørsmål 3 i beslutningsarket).
- **Par 3 K2, «Strukturert og nøyaktig»,** er Mangler mot Delvis oppfylt i fasiten. Det er innenfor toleransen i FR-8 (høyst ett krav under fasiten).

## 3. For streng i par 3 (den forsiktige retningen)

- **Med den gamle prompten** var «Strukturert og nøyaktig» Mangler mot Delvis oppfylt i fasiten, i alle tre kjøringene. Det er innenfor toleransen etter revurderingen av fasiten (`vurdering-2-4-kontroll-temperatur-0.md`, avsnitt 3 punkt 1).
- Regelen «ingen deler dokumentert, men beslektet erfaring gir Delvis oppfylt» følges ikke alltid. Sondre bekrefter lesingen av regelen (spørsmål 10 i beslutningsarket).

## 4. Stillingen og kravtekstene (kosmetisk)

- **Par 2:** stillingen er «It-brukerstøtte – deltid for student», med liten t, i alle kjøringene med OpenAI. I par 2 K3 med den nye prompten mangler også «– deltid for student».
- **Par 4:** stillingen er «Resepsjonsmedarbeider» uten «– deltid» med den nye prompten. Prompten sier at annonsens ord skal beholdes, så det er en tilbakegang.
- **Kravtekstene** har med «(en fordel)» og «(påkrevd)» fra annonsen.

Kilder: `vurdering-2-4-kontroll-temperatur-0.md` avsnitt 3 punkt 2–3, og `vurdering-2-4-kontroll-ny-prompt.md` avsnitt 4.

## 5. Språket i forklaringene (NFR-5 er bestått med små feil)

Fra `vurdering-2-4-kontroll-ny-prompt.md`, avsnitt 4:
- **Par 1 K2 og K3:** «nivået … er ikke spesifisert i annonsen». Annonsen sier «gode», så setningen er feil om annonsen.
- **Par 2 K1 og K3:** «viser muntlig kommunikasjonsevner», der det skal være «muntlige».
- **Par 2 K2:** rådet «Du bør skaffe eller dokumentere førerkort klasse B hvis du har det» henger ikke sammen.
- **Par 3 K1:** «kundebehandling» er verken CV-ens eller annonsens ord.
- **Par 4 K2 og K3:** tredje person («Bruker har …», «Brukeren har …»), mens prompten ber om du-form.
- **Fra før** (`vurdering-2-4-kontroll-temperatur-0.md`, avsnitt 3 punkt 4): setninger uten subjekt («Har erfaring som studentassistent …»), og i tidligere runder særskriving («Tysk kunnskapsnivået»).

## 6. Nøkkelordene (SM-4, hører til story 5.1)

- 67 %, 67 %, 69 % og 92 % av de forventede nøkkelordene er hentet ut for par 1–4, 74 % til sammen. Målet er 80 %.
- De som mangler, er stort sett arbeidsoppgaver (periodeavslutning, fakturering, årsoppgjør, førstelinje).
- Målt på den gamle prompten, og ikke vurdert på nytt med den nye.
- Kilde: `vurdering-2-4-kontroll-temperatur-0.md` avsnitt 8, og `deferred-work.md`.

## 7. Robusthet og brukeropplevelse

- **En annonse uten krav** gir `ugyldig_svar` med Prøv igjen (`.min(1)` fra PR #27). Med temperatur 0 hjelper det trolig ikke å prøve igjen, og hvert forsøk telles og koster. Det er Kevins beslutning om den skal få en egen melding (`issues.md`).
- **En tom analyse som kommer fram på en annen vei,** vises fortsatt uten melding i fanen (`issues.md`).
- **Oppbrukt kreditt** gir `llm_feil` med Prøv igjen, uten henvisning til Prøv med eksempel (`deferred-work.md`, fra story 2.5).
- **Like krav** fjernes bare av prompten, ikke i koden (`issues.md`, del B).
- **B4 del 2 (NFR-9), en annonse med en innplantet instruks:**
  - Bestått i produksjonen etter PR #28 (`b50e34a`).
  - De to tidligere forsøkene (16:01 med 0 krav, og 16:36 med `ugyldig_svar`) feilet, og årsaken er uavklart. Ett av dem brukte README-innholdet som annonse (§ 7a i `kjorebok-2-4-del-b.md`, spørsmål 6 i beslutningsarket).
  - Eksempelblokken fra PR #28 er en del av rettingen for B4. Fjernes den (alternativ b i spørsmål 2), må B4 testes på nytt.

## 8. Testsettskriptet (fra gjennomgangen av del A, PR #14)

- **Når kjøringer feiler,** lagres ikke årsaken (feilklasse og HTTP-status) per kjøring. Rapporten har bare feilkoden. Skriptet advarer og gir utgangskode 1 når alle kjøringene feiler (`scripts/kjor-testsett.ts:244-248`).
- **Rapporten flagger ikke** ekstra eller like krav («N krav (fasiten har M)»). Antall og like krav må telles for hånd.
- **Rettingen for stasjonsbokstaver på Windows** i skriptvakten testes ikke i CI (`deferred-work.md`).

Status per funn står i Review Findings i `spec-2-4-velge-leverandor-ved-maaling.md`.

## 9. Personvern

- **Behandlingen skjer i USA** (tredjeland). Grunnlaget er punkt 4.1 i DPA-en: SCC eller art. 45 med DPF. Hvilket av dem som brukes, er ikke kontrollert. Det skal med i refleksjonsrapporten (PRD §6).
- **Loggene for misbruk** hos OpenAI lagres i opptil 30 dager, og personvernboksen nevner dem ikke (spørsmål 9 i beslutningsarket).
- **56 forespørsler** ble lagret hos OpenAI før `store: false` (spørsmål 8 i beslutningsarket).
