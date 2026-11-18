# Tilbakemelding på PRD

| | |
|---|---|
| **Gruppe** | G69 – G69-heggdal-skogheim |
| **PRD vurdert** | `_bmad-output/planning-artifacts/prds/prd-G69-heggdal-skogheim-2026-10-29/prd.md` (status `final`, sist endret 2026-11-09, commit f42bf1c) |
| **Dato** | 2026-11-12 |
| **Type** | Formativ tilbakemelding, ikke karakter |

## 1. Samlet inntrykk

Dette er en sterk PRD med en tydelig tese: ærlighet og gjennomsiktighet på norsk, der språkmodellen aldri dikter opp kvalifikasjoner og alt kontrolleres i kode. Nesten alle FR-er har testbare konsekvenser, og KI-kontroll, kostnad, demomodus og personvern er behandlet grundigere enn vanlig. Risikoen ligger ikke i substansen, men i at dokumentet har blitt langt og bærer mye endringshistorikk, og i noen få presiseringer som avgjør om kjernefunksjonen (kontroll av belegg) fungerer i praksis.

## 2. Dette fungerer godt

- **Tesen er bygget inn i kravene.** §1 forklarer «Hvorfor ikke bare bruke en generell chatbot?» og peker på FR-9, FR-12, FR-6 og NFR-1. Motmålene SM-C1 («Skal ikke presses opp med nøkkelordstapping») og SM-C2 («Sannhet går foran overbevisning») gjør at målene ikke kan optimaliseres på feil måte.
- **Testbarheten er konkret.** FR-6 lister inndata som skal og ikke skal maskeres, FR-12 har en eksakt matcheregel, og FR-14 har «250–400 ord» og eksempler på fraser som ikke skal brukes. SM-9 knytter hver konsekvens til en verifiseringsmåte.
- **KI-kontroll og kjørbarhet er tatt på alvor.** NFR-6 (mock-klient og lagrede svar), NFR-9 (innplantet instruks i `annonse-med-instruks.txt`), tre kjøringer per testpar i SM-2 fordi svarene varierer, og demomodus i FR-23–26 svarer direkte på det som ble påpekt i briefen.

## 3. Oversikt per dimensjon

| Dimensjon | Vurdering | Kort begrunnelse |
|---|---|---|
| Beslutningsklarhet | sterk | Valg og kostnaden ved dem er synlige, f.eks. IP-adresser forkastet i NFR-1 og tvilsregelen i FR-8. |
| Substans | sterk | Ingen pynte-personas eller boilerplate-NFR-er. Tallene i NFR-3 og NFR-4 er produktspesifikke. |
| Strategisk sammenheng | god | Funksjonene tjener tesen, men suksessmålene måler korrekthet og ikke om brukeren får verdi. |
| Testbarhet | god | Sterk i det meste. FR-9 og FR-17 mangler presisering, og SM-1 hviler på en sjekkliste utenfor PRD-en. |
| Scope og avgrensning | sterk | Ikke-mål i §7.1, kuttrekkefølge i §7.2, vurderte ideer i §7.3 og en risikotabell. 27 FR er mye, men prioriteringen er ærlig. |
| Brukbarhet for neste fase | god | ID-ene er konsistente. «Krav» er brukt i to betydninger, og antakelsesindeksen er blitt en historikk. |
| Formtilpasning | sterk | Tre reiser (to brukere og én sensor) passer en liten webapp. Reisene er konkrete og har kanttilfeller. |

## 4. Viktigste forbedringer

### 4.1 Gjør kontrollen av belegg robust mot tekst fra PDF og DOCX
- **Alvorlighet:** høy
- **Hvor:** FR-9: «Store og små bokstaver, mellomrom og linjeskift regnes ikke med.»
- **Problem og hvorfor det betyr noe:** FR-9 er kjernen i tesen, og et belegg som ikke finnes ordrett gir automatisk **Mangler**. Tekst fra PDF har ofte listetegn (•), orddeling med bindestrek ved linjeskift og typografiske anførselstegn. Språkmodellen siterer gjerne uten disse. Da blir riktige vurderinger nedgradert uten at modellen har gjort noe galt, og SM-3 og toleransen i FR-8 («høyst ett krav») kan feile av tekniske grunner.
- **Forslag:** Utvid normaliseringen og legg til testtilfeller. Eksempel: «Ved sammenligning regnes ikke store/små bokstaver, mellomrom, linjeskift, listetegn (•, –, *) og anførselstegn med, og bindestrek rett før linjeskift fjernes.» Legg til: «En enhetstest bekrefter at et belegg som siterer en linje fra `par-4-tokolonne-hotell/cv.txt` uten listetegn godtas, mens et belegg der ett ord er byttet ut avvises.»

### 4.2 Definer koblingen mellom nøkkelord og krav
- **Alvorlighet:** medium
- **Hvor:** FR-17: «… når det hører til et krav med **Oppfylt** eller **Delvis oppfylt**»
- **Problem og hvorfor det betyr noe:** FR-11 henter nøkkelord som en egen liste, og skjemaet i `addendum.md` (`nokkelord: [string]`) har ingen kobling til `krav`. Uten den kan ikke FR-17 implementeres eller testes, og det blir en tolkning hos den som skriver storyen.
- **Forslag:** Legg til i FR-11: «Hvert nøkkelord er knyttet til minst ett krav fra FR-7. Kobling og nøkkelord kommer fra samme generering.» Legg så til en testbar konsekvens i FR-17: «For par 3 foreslås ingen nøkkelord som hører til et krav med **Mangler**.»

### 4.3 Mål om brukeren faktisk får verdi, og si hva som skjer når sjekklisten feiler
- **Alvorlighet:** medium
- **Hvor:** §8 (SM-1–SM-4) og §10.6: «Ingen intervjuer er gjort ennå.»
- **Problem og hvorfor det betyr noe:** Høydepunktet i UJ-1 er at Ida «skjønner at hun dekker mer enn hun trodde». Ingen suksessmål sjekker det. Det er også uklart hva «alle punktene i sjekklisten er bestått» betyr når en kjøring feiler, siden resultatene varierer.
- **Forslag:** Legg til et lite sekundært mål: «SM-10: Tre medstudenter kjører testpar 1 med egen CV-tekst. Minst to svarer at de fant en erfaring de ikke hadde tenkt på som relevant.» Legg til en regel for SM-2: «Feiler én av tre kjøringer, rettes prompten, og alle tre kjøres på nytt.»

### 4.4 Skill beslutningshistorikk fra kravene
- **Alvorlighet:** medium
- **Hvor:** Bannerteksten øverst, §11 med gjennomstrekninger og taggen `[bekreftet antakelse]` på rundt femten steder
- **Problem og hvorfor det betyr noe:** PRD-en er `final`, men leses som en arbeidslogg. Når nesten alt er merket «bekreftet», sier taggen ikke lenger hva som er usikkert. Lesere (og KI-agenter som lager stories) må lese gjennom forkastede valg for å finne det som gjelder. Antakelsesindeksen stemmer heller ikke helt med teksten: FR-5 og FR-24–26 står i §11 uten tagg i selve kravene.
- **Forslag:** Flytt forkastede valg til en kort endringslogg (fem–åtte linjer) eller til memloggen. Bruk `[ANTAKELSE]` bare på det som ikke er avklart, og la §11 være en ren liste over aktive beslutninger. Rett `updated` i frontmatter, som står på 2026-10-30 selv om FR-6 ble endret 2026-11-09.

### 4.5 Rydd i ordlisten: «Krav», «Analyse» og «fane»
- **Alvorlighet:** lav
- **Hvor:** §3 «**Krav.** Én kvalifikasjon … hentet ut av annonsen» mot §0 «Alle krav har faste ID-er» og §8 «Verifisering per krav»
- **Problem og hvorfor det betyr noe:** Ordlisten sier at ord brukes likt overalt, men «krav» betyr både kravene i annonsen og kravene i PRD-en. «Analyse» er definert som gap-analysen, men brukes også om hele flyten. FR-18 sier «fanene» mens ordlisten har «resultatdel».
- **Forslag:** Bruk «annonsekrav» i ordlisten og FR-ene, og «PRD-krav» eller FR/NFR om PRD-ens egne krav. Legg til «Gap-analyse» og «Tvilsregelen» i ordlisten.

## 5. Mekaniske funn

- ID-ene er sammenhengende (UJ-1–3, FR-1–27, NFR-1–10, SM-1–9, SM-C1–C3), og krysshenvisningene løser seg, inkludert §10.1 og §10.8.
- Ordlisten holdes stort sett konsekvent («språkmodell», aldri «KI-en»). Unntakene står i 4.5.
- Assumptions-indeksen og de innebygde taggene stemmer ikke helt (4.4).
- FR-2 («Innholdet i CV-filen sendes ikke til serveren») er en arkitekturløsning formulert som krav. Kravet er dataminimering, og mekanismen kan stå i arkitekturen.
- Det er ikke sagt hva appen gjør med en engelsk CV eller annonse. Språk er et ikke-mål, men én setning om forventet oppførsel hadde hjulpet.

## 6. Før dere går videre

**Må avklares nå:**
- Presiser normalisering i FR-9 og koblingen i FR-11/FR-17 (4.1 og 4.2). Begge påvirker prompt, svarskjema og stories.
- Leverandør og vilkår for trening (§10.1). Teksten i FR-5 og vurderingen av tredjelandsoverføring i §6 avhenger av dette.
- Hvilket tak som faktisk beskytter nøkkelen (NFR-3). `addendum.md` påpeker at en teller i minnet på Vercel bare er en myk grense, så forbruksgrensen hos leverandøren må regnes som det eneste sikre taket.

**Kan vente:** Datatilsynets veiledning (§10.7), brukertesten i 4.3 (bør likevel gjøres før innlevering) og endringsloggen i 4.4.

**Oppfølging av briefen:** Ja, i hovedsak. Ingen kontoer og ingen lagring er valgt, prioriteringen er satt, det finnes et testsett med fasit og sjekkliste, mock og demomodus er med, og LLM-kall ligger i én modul. Skisser av skjermbildene lå hos UX-fasen (§10.2).

## 7. Refleksjonsspørsmål

1. FR-9 ble først «ett hakk ned», så «rett til Mangler». Hva i vurderingen fikk dere til å snu, og hvordan sjekket dere om KI-forslaget var dårligere enn alternativet?
2. `addendum.md` bygger kontrollen i FR-9 på en preprint (arXiv) med syntetiske CV-er. Hvordan vurderte dere hvor mye den kilden tåler, og hva ville dere gjort hvis testsettet viste noe annet?

_Vurdert mot kvalitetsrubrikken i bmad-prd. Dette er veiledning, ikke sensur._
