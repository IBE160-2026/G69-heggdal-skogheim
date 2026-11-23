# Beslutningsark: det som gjenstår i story 2.4 (til Sondre)

> **Laget 2026-11-22** av Claude på oppdrag fra Kevin, på grenen `story-2.4-c5-dokumentasjon`. Arket samler de åpne spørsmålene i story 2.4 som trenger Sondre, eller Kevin og Sondre sammen.
>
> **Oppdatert 2026-11-23:** Sondre har ført inn svarene på spørsmål 1–11 og sitt syn på C2, med navn og dato i feltet «Svar». Anbefalingene i arket er Claudes forslag, svarene er Sondres. Ingen har signert ennå (spørsmål 12).
>
> **Oppdatert 2026-11-22 (Claude, på oppdrag fra Kevin, grenen `story-2.4-c5-oppfolging`):**
> - Sondre har flettet PR #31 (dette arket og C5-dokumentasjonen, `c7c4a68`) og PR #30 (avviksanalysen, `f36568e`) til `main` 2026-11-22 kl. 16:16.
> - **Svarfeltene er fortsatt tomme.** Flettingen er ført inn som et faktum under spørsmål 1, men den er ikke et svar fra Sondre på noen av spørsmålene. Ingen har signert.
> - Kevins foreløpige beslutninger fra 2026-11-22 står nederst, under Kevins egne beslutninger.
>
> **Grunnlaget:**
> - PR #30 med avviksanalysen (grenen `story-2.4-b4-resultat`, flettet 2026-11-22 som `f36568e`, avsnitt 2a i `vurdering-2-4-kontroll-ny-prompt.md`)
> - `kjorebok-2-4-del-c.md`
> - `vurdering-2-4-kontroll-temperatur-0.md`
> - de kjente svakhetene i [`kjente-svakheter-2-4.md`](kjente-svakheter-2-4.md)

## Kort status

- **AK 1–3 i `epics.md` er oppfylt.**
  - AK 1: testsettskriptet.
  - AK 2: valget etter AD-11. OpenAI `gpt-4.1-mini` med temperatur 0 ble valgt 2026-11-19.
  - AK 3: vilkårene, Vercel, kreditten og personvernboksen. Ett åpent punkt er Kevins (C2).
- **Gruppas egen regel i C5** er at 2-4 settes til `done` først når SM-1 er avgjort.
  - SM-1 var 12 av 12 med den revurderte fasiten på den gamle prompten (`271edb4`).
  - Med den nye prompten fra PR #27 og PR #28 er resultatene:
    - **SM-1:** 9 av 12
    - **SM-2:** 10 av 12
    - **SM-3:** 11 av 12
- **Årsaken til avvikene er ikke avklart.** Endringene fra PR #27 og PR #28 er ikke målt hver for seg.

## Rekkefølgen

Spørsmål 1 og 2 avgjør det meste av resten. Spørsmål 3–5 avhenger av svaret på 2. Spørsmål 6–11 kan besvares når som helst. Spørsmål 12 (signaturene) kommer sist.

---

### 1. Gjennomgangen av PR #30 (avviksanalysen)

Gir avsnitt 2a et riktig og tilstrekkelig bilde av kravene som feilet, og av forekomstene før PR #28?

- **Alternativer:** a) godkjenne og flette b) be om rettinger
- **Anbefaling:** a), hvis sitatene stemmer når du leser dem. De er sjekket med skript mot rapportene.
- **Fakta (2026-11-22):** PR #30 er flettet til `main` av Sondre 2026-11-22 kl. 16:16 (`f36568e`). Dette er ikke Sondres svar. Han fører selv inn om flettingen betyr at avsnitt 2a er godkjent, eller om noe skal rettes.
- **Svar:** **a) godkjent.** Sitatene stemmer med rapportene, og avsnitt 2a gir et tilstrekkelig bilde. (Sondre, 2026-11-23)

### 2. Veien videre for SM-1–SM-3 med den nye prompten

| Alternativ | Hva det betyr | Kostnad |
|---|---|---|
| **a) Godta avvikene** som kjente svakheter | Prompten beholdes. SM-1–SM-3 står som ikke bestått i dokumentasjonen og i rapporten, og måles på nytt i story 5.1 | Ingen kall |
| **b) Én isolerende måling:** fjerne eksempelblokken fra PR #28 og beholde reglene fra PR #27 | Viser om eksempelblokken er årsaken. Krever ny B4-test (NFR-9) i produksjonen etterpå, fordi eksempelblokken var en del av rettingen for B4 | Høyst 12 kall (ca. 0,25 kr) + 1 kall for B4 |
| **c) Rette prompten mer målrettet,** for eksempel at «kan tyde på» uten beslektet erfaring ikke gir Delvis oppfylt, og CV-ens egne ord ved Windows og brukerstøtte | Kan rette feilene, men det er gjort før uten varig effekt (runde 3–5) | Høyst 12 kall + 1 for B4, kanskje flere runder |
| **d) Gå tilbake til prompten fra `271edb4`** | Ga 12 av 12 på SM-1–SM-3. B4 del 2 (NFR-9) ga 0 krav i produksjonen før PR #27, men årsaken er uavklart, fordi ett av forsøkene brukte README-innholdet (spørsmål 6) | B4 må testes på nytt med den gamle prompten (1 kall) |

- **Anbefaling:** b). Den gir mest kunnskap for minst penger, og den skiller PR #27 fra PR #28. Gir den 12 av 12, er eksempelblokken årsaken. Da står valget mellom NFR-9 og SM-1–SM-3, og B4 avgjør det. Gir den ikke 12 av 12, er a) det ærlige valget, og mer prompting har liten verdi før story 5.1.
- **Allerede avtalt** (`issues.md` i PR #30, 2026-11-21): Kevin og Sondre går gjennom avsnitt 2a først, og avgjør deretter om eksempelblokken skal fjernes, i samme PR som den egentlige rettingen. Testsettet (høyst 12 kall) er godkjent av Sondre. Testsettet og B4 i produksjonen kjøres først etter gjennomgangen.
- **Det som mangler:** valget mellom a)–d), og Kevins godkjenning av de konkrete kallene, når prompten for b), c) eller d) er klar. Endringen i prompten krever egen spec og egen gren.
- **Svar:** **b) først, deretter a).** Eksempelblokken fra PR #28 fjernes (den ble lagt inn for B4, som bare feilet fordi feil fil var limt inn). Reglene fra PR #27 og `store: false` beholdes. Testsettet kjøres én gang (12 kall) og B4 én gang i produksjonen. Gir det 12 av 12 på SM-1–SM-3, er SM-1 avgjort. Gir det ikke det, godtar vi avvikene som kjente svakheter (a), dokumenterer dem og måler på nytt i story 5.1. Ingen flere runder med prompt-justering: runde 3–5 viste at det ikke gir varig effekt, og avsnitt 2a viser at de samme feilene forekommer med flere prompter. (Sondre, 2026-11-23)

### 3. Grensetilfellet «erfaring med fakturaer» i par 3 (SM-2)

CV-en har «Besvarte kundehenvendelser om fakturaer og abonnement». Modellen skriver «Du har erfaring med fakturaer, men …».

- **Alternativer:**
  - a) ikke brudd (som i alle de tidligere rundene og i kontrollen)
  - b) brudd. Da blir SM-1 og SM-2 7 av 12 med den nye prompten, og 11 av 12 med den gamle
- **Anbefaling:** a). Setningen er en forkortelse av noe CV-en faktisk sier. Den har vært vurdert likt i alle målingene, og en ny regel nå ville gjøre tallene vanskelige å sammenligne. Regelen bør skrives inn i fasiten for par 3 hvis den godtas.
- **Svar:** **a) ikke brudd.** «Fakturaer» er CV-ens eget ord, og setningen er vurdert likt i alle målingene. Regelen skrives inn i fasiten for par 3. (Sondre, 2026-11-23)

### 4. Når kan 2-4 settes til `done`?

Regelen i C5 krever at SM-1 er «avgjort».

- **Alternativer:**
  - a) SM-1 er avgjort når svaret på spørsmål 2 er gjennomført og dokumentert, også hvis svaret er å godta avvikene
  - b) SM-1 må være 12 av 12 med prompten som er i produksjonen
- **Anbefaling:** a). AK-ene i `epics.md` krever ikke at OpenAI består SM-1–SM-3, og story 5.1 måler dem på nytt på den endelige versjonen. Avvikene må da stå i refleksjonsrapporten.
- **Det som taler mot a):** story 2.4 i `epics.md` har «**Realiserer:** … SM-1, SM-2, SM-3», og PRD-en definerer dem som suksesskriterier. SM-2 sier i tillegg at prompten skal rettes og alle tre kjøringene kjøres på nytt når én av dem feiler. Med a) avsluttes altså storyen uten at de tre kriteriene den skal realisere, er oppfylt.
- **Svar:** **a).** 2-4 settes til `done` når svaret på spørsmål 2 er gjennomført og dokumentert. Hvis avvikene godtas, står de ærlig i refleksjonsrapporten sammen med motargumentet over. (Sondre, 2026-11-23)

### 5. Nøkkelen fra målingen (`kevin-maaling-2-4` hos OpenAI)

- **Bekreft:** er rapporten fra testsettet med den nye prompten tilstrekkelig (Kevins vilkår for å slette nøkkelen)?
- **Alternativer:**
  - a) slette den nå (Sondre hos OpenAI, Kevin sletter Mistral-nøkkelen fra målingen)
  - b) beholde den til en eventuell ny måling (alternativ b eller c i spørsmål 2) er gjort
- **Anbefaling:** b) hvis spørsmål 2 blir b), c) eller d). Ellers a).
- **Risiko ved b):** ifølge C2 i `kjorebok-2-4-del-c.md` trekker nøkkelen fra målingen trolig fra den samme kreditten på 5 USD som produksjonen, og den «bør roteres eller slettes før eller like etter C3». Et alternativ er å slette den nå og lage en ny nøkkel for målingen når den skal kjøres. Det er Sondres og Kevins valg, og ingen nøkler er endret.
- **Svar:** **b).** Nøkkelen beholdes til målingen i spørsmål 2 er kjørt, og Sondre sletter den hos OpenAI rett etterpå. Kevin sletter Mistral-nøkkelen og fjerner begge fra `.env.local`. (Sondre, 2026-11-23)

### 6. De to tomme svarene i B4 (16:01 og 16:36)

Kevin har bekreftet at README-innholdet i `testdata/robusthet/` ved en feil ble limt inn som annonse i ett av forsøkene.

- **Bekreft eller rett:** forklarer det begge forsøkene, eller bare ett av dem?
- **Svar:** Kevin svarer på hvilke forsøk som brukte README-innholdet. Det har ingen betydning for B4 lenger: B4 er bestått med riktig fil i 3 kall (1 i produksjonen, 2 lokalt). (Sondre, 2026-11-23)

### 7. `produksjon-vercel-2`

- **Meld det som står igjen fra avsnitt 7 i `sjekkliste-2-4-c3-sondre.md`:** prosjektet nøkkelen ligger i, og hvilke rettigheter du valgte (*Restricted* eller *All*).
- **Allerede besvart** (C3 i `kjorebok-2-4-del-c.md`): navnet (`produksjon-vercel-2`), at variablene bare ligger i Production, at Preview og Development ikke har noen nøkkel, og at nøkkelen bare ligger i Vercel.
- **Ikke sett bekreftet:** at `OPENAI_API_KEY` er merket *Sensitive*. Kjøreboka sier «(Secret)».
- **Datoen for DPA-en** står i loggen din (gjelder fra 2026-01-01).
- **Nøkkelen fra målingen** er spørsmål 5.
- **Anbefaling:** *Restricted*, med så få rettigheter som appen trenger, hvis OpenAI tilbyr det for nøkkelen. Det er ikke kontrollert hvilke valg som finnes.
- **Svar:** Nøkkelen ligger i *Default project* hos OpenAI og har rettighetene *All*. Den beholdes slik, fordi en overgang til *Restricted* kan stoppe produksjonen og nøkkelen bare ligger i Vercel. Om `OPENAI_API_KEY` er merket *Sensitive* i Vercel, sjekker Sondre. (Sondre, 2026-11-23)

### 8. De 56 lagrede forespørslene hos OpenAI (fra før `store: false`)

- **Alternativer:**
  - a) slette dem i dashbordet
  - b) beholde dem
- **Anbefaling:** a). Det er dataminimering etter FR-2. Ifølge `kjorebok-2-4-del-b.md` (linje 468) fant du «56 lagrede forespørsler med fiktive CV-tekster», så det haster ikke av personvernhensyn. Men de trengs ikke lenger.
- **Svar:** **b) beholde.** Dataene er fiktive, og OpenAI sletter lagrede svar automatisk etter 30 dager (rundt 19.–20. desember 2026). (Sondre, 2026-11-23)

### 9. Personvernboksen og loggene for misbruk hos OpenAI (opptil 30 dager)

- **Alternativer:**
  - a) nevne dem i personvernboksen. Det er en kodeendring i en egen story eller PR.
  - b) nevne dem bare i personvernerklæringen eller rapporten
- **Anbefaling:** a), med én kort setning. Brukeren bør vite at teksten kan lagres i opptil 30 dager.
- **Svar:** **a).** Én kort setning i personvernboksen om at OpenAI kan beholde teksten i opptil 30 dager for å oppdage misbruk. Egen liten PR med spec. (Sondre, 2026-11-23)

### 10. Regelen for sammensatte krav (fra del B)

Når ingen del av et sammensatt krav er dokumentert, men det finnes beslektet erfaring, blir kravet Delvis oppfylt etter FR-8. Gjelder for eksempel par 3: bokføring og avstemminger, og strukturert og nøyaktig.

- **Bekreft** at dette er riktig lest.
- **Svar:** **Bekreftet.** Det er riktig lest etter FR-8: beslektet erfaring gir Delvis oppfylt. (Sondre, 2026-11-23)

### 11. Grunnlaget for overføringen til USA

Punkt 4.1 i DPA-en dekker overføringen med SCC eller GDPR art. 45 (EU–U.S. Data Privacy Framework). Det er ikke kontrollert hvilket av dem som brukes, eller om OpenAI er sertifisert under DPF. Det skal med i refleksjonsrapporten (PRD §6 og §10.1).

- **Avgjør:** hvem som kontrollerer det, og når. Det kan for eksempel gjøres i DPF-lista (dataprivacyframework.gov) før refleksjonsrapporten skrives.
- **Anbefaling:** Sondre, siden kontoen og DPA-en er hans.
- **Svar:** Sondre kontrollerer DPF-lista (dataprivacyframework.gov) før refleksjonsrapporten skrives. (Sondre, 2026-11-23)

### 12. Signaturene

Signer først når svarene over er ført inn:
- avsnitt 7 i `vurdering-2-4-kontroll-temperatur-0.md` («Godkjent av»)
- avsnitt 5 i `vurdering-2-4-kontroll-ny-prompt.md` («Godkjent av»), etter at PR #30 er flettet (flettet 2026-11-22)

**Svar:** Signeres når målingen i spørsmål 2 er gjort og resultatet er ført inn. (Sondre, 2026-11-23)

---

## Til orientering: Kevins egne beslutninger

Disse trenger ikke Sondre, men de påvirker avslutningen:
- **C2:** om OpenAI-prosjektet skal ha en egen grense for forbruket. «Spend limit» står på 100 USD. Det harde taket er kreditten på 5 USD uten påfylling.
  - **Foreløpig beslutning fra Kevin (2026-11-22):** dette avklares med Sondre før noe endres. Ingenting er endret i OpenAI.
  - **Sondres syn:** La «Spend limit» stå. Det reelle taket er kreditten på 5 USD uten automatisk påfyll. (Sondre, 2026-11-23)
- **De to åpne funnene fra del A** (`spec-2-4-velge-leverandor-ved-maaling.md`, Review Findings): årsaken per kjøring som feiler, og «N krav (fasiten har M)» og like krav.
  - **Foreløpig beslutning fra Kevin (2026-11-22):** de utsettes til neste relevante kode- og testrunde, og de står åpne til de faktisk er rettet.
  - Den manuelle kontrollen av rapporten fra 2026-11-20 viser ingen feilede kjøringer, ingen ekstra krav og ingen krav med samme tekst i den målingen (§ 8 i `kjente-svakheter-2-4.md`). Det sier ingenting om SM-1–SM-3, som fortsatt ikke er bestått.
- **Annonse uten krav:** om den skal ha en egen melding i stedet for `ugyldig_svar`, og om fanen skal vise en melding for en tom analyse. Begge er kodeendringer.
- **`testdata/robusthet/README.md`:** om den skal ha en merknad om at den ikke er testinndata. Det er en endring i testdata.
- **`TEMPERATUR`-kommentaren** i `src/lib/llm/felles.ts` (linje 17–22) sier «ingen krav kom over fasiten. SM-1 er likevel ikke bestått, fordi par 3 har to krav under fasiten». Begge delene er utdatert: med den nye prompten er SM-3 11 av 12, og med løsning B var SM-1 12 av 12 på den gamle. Kommentaren rettes når spørsmål 2 er avgjort. Det er en kodeendring, og den står i `issues.md` (2026-11-20).
- **Oppbrukt kreditt:** gir `llm_feil` med Prøv igjen uten henvisning til Prøv med eksempel (`deferred-work.md`, story 2.5). Avgjør om det løses nå eller i epic 3.
