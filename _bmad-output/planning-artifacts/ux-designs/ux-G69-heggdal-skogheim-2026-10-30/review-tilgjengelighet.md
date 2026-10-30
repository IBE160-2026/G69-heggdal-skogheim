# Tilgjengelighetsgjennomgang av UX-spesifikasjonen

**Gjennomgått:** `DESIGN.md`, `EXPERIENCE.md`, `mockups/key-forberedelse.html`, `mockups/key-resultat-gap.html`, `mockups/key-redigering-brev.html`
**Målestokk:** WCAG 2.1 AA, med WCAG 2.2 AA der det er relevant (2.4.11, 2.5.7, 2.5.8). Krav fra PRD: NFR-8 (tastatur, synlige etiketter, tilgjengelige faner, 360 px, Chrome/Firefox/Edge/Safari).
**Dato:** 2026-10-30. Ingen spesifikasjons- eller skissefiler er endret.

## Samlet vurdering

**Godkjent med forbehold.** Grunnlaget er godt. Alle fargeparene som `DESIGN.md` definerer selv, holder AA, og de oppgitte forholdstallene stemmer (se tabellen under). Kategorien formidles med ord og ikon i tillegg til farge, *Analyser* har synlig årsak når den er deaktivert, dialogene har fokus på *Avbryt*, og det finnes en `aria-live`-region. Svakhetene ligger i det som **arves fra shadcn uten å sjekkes** (fokusring, kantfarger, `destructive`, `muted-foreground`) og i **den dynamiske oppførselen**: fokus som forsvinner når innhold byttes ut, fanene som starter generering når de får fokus med piltast, hva som meldes til skjermleser, og en motsigelse mellom «tekstfelt» og «markerte plassholdere» i brevet. Skissene har også noen mønstre som kan lede utviklerne feil (glyfer i stedet for ord på mobil, `span` i stedet for knapper og faner, `aria-label` som ikke stemmer med den synlige etiketten).

**Antall funn:** 0 kritiske, 8 høye, 21 middels, 16 lave.

## Kontrastberegninger

Utregnet med WCAG-formelen for relativ luminans. Tallene gjelder fargene i `DESIGN.md` og i skissene. For arvede shadcn-farger er både v3 (zinc) og v4 (oklch, nøytral) sjekket, fordi spesifikasjonen ikke sier hvilken versjon som brukes.

| Par | Forhold | Krav | Resultat |
|---|---|---|---|
| Primær `#1F5F5B` på hvit | 7,38:1 | 4,5 | OK (oppgitt 7,4) |
| Primær på bakgrunn `#FAFAF7` | 7,06:1 | 4,5 | OK |
| Primær på primær myk `#E6F0EF` (funne nøkkelord, demobanner) | 6,35:1 | 4,5 | OK |
| Oppfylt `#1C6B3C` på `#E7F4EC` | 5,76:1 | 4,5 | OK (oppgitt 5,8) |
| Delvis `#7A5200` på `#FDF3DC` (også plassholdere i brevet) | 6,27:1 | 4,5 | OK (oppgitt 6,3) |
| Mangler `#9A3412` på `#FDEDE5` | 6,41:1 | 4,5 | OK (oppgitt 6,4) |
| Belegg `#3F3A33` på `#F5F3EE` | 10,16:1 | 4,5 | OK (oppgitt 10,2) |
| Kategorifarger som venstrekant mot hvitt kort | 6,5–7,3:1 | 3 | OK |
| Skissens muted `#5F6B7A` på hvit / `#FAFAF7` | 5,43 / 5,19:1 | 4,5 | OK, men er ikke shadcn sin verdi |
| shadcn v4 `muted-foreground` `#737373` på hvit / `#FAFAF7` | 4,74 / 4,53:1 | 4,5 | Så vidt OK |
| shadcn v4 `muted-foreground` på belegg-bg `#F5F3EE` | 4,28:1 | 4,5 | **Feiler** hvis det brukes der |
| shadcn v3 `muted-foreground` `#71717A` på `#FAFAF7` | 4,62:1 | 4,5 | Så vidt OK |
| Gjennomstreket belegg (opacity 0,7) i *Bygger på* | 4,41:1 | 4,5 | **Feiler** |
| shadcn v3 `destructive` `#EF4444` på hvit | 3,76:1 | 4,5 | **Feiler** som tekst |
| shadcn v4 `destructive` `#E7000B` på hvit | 4,77:1 | 4,5 | OK |
| Kant på tekstfelt (shadcn `input`/`border`, `#E4E4E7`–`#EBEBEB`) på hvit | 1,19–1,27:1 | 3 | **Feiler** |
| Skissens kant `#E2E0DA` på hvit | 1,32:1 | 3 | **Feiler** |
| Stiplet kant på manglende nøkkelord `#BDB9B0` på hvit | 1,96:1 | 3 | Feiler (se vurdering under) |
| Stiplet kant på opplastingsfeltet `#C9C6BF` på hvit | 1,71:1 | 3 | **Feiler** |
| Fokusring shadcn v4 (`ring` `#A1A1A1` med 50 % opasitet) på hvit | 1,54:1 | 3 | **Feiler** |
| Fokuskant shadcn v4 (`border-ring` `#A1A1A1`) på hvit | 2,58:1 | 3 | **Feiler** |
| Fokusring shadcn v3 (`zinc-950`) på hvit | 17,7:1 | 3 | OK |
| Treffmåler: fyll (primær) mot spor `#ECEAE4` | 6,13:1 | 3 | OK |
| Treffmåler: spor mot hvitt kort | 1,20:1 | 3 | Akseptabelt fordi verdien står som tekst |
| Deaktivert *Analyser* (opacity 0,45): hvit tekst på `#9AB7B5` | 2,14:1 | – | Unntatt (inaktiv komponent), men se funn om årsakstekst |

## Funn

### 1. Farge og kontrast

- **[high]** Fokusringen arves fra shadcn sin `ring` uten verdi. I shadcn v4 (standard i nye Next.js-prosjekter) er den `ring-ring/50` med lys grå `#A1A1A1`, som gir 1,54:1 mot hvitt (kanten 2,58:1). Fokus blir nesten usynlig på hvite kort og tekstfelt (EXPERIENCE.md, Accessibility Floor: «Fokusringen arves fra shadcn sin `ring`»; WCAG 1.4.11, 2.4.7). *Fix:* Legg `ring: '{colors.primary}'` i `colors` i DESIGN.md og skriv i Components: «Fokus vises som 2 px heltrukken ring i primærfarge med 2 px avstand (`focus-visible:ring-2 ring-primary ring-offset-2`), uten opasitet. Gir 7,4:1 mot hvitt.» Erstatt setningen i EXPERIENCE.md med en henvisning til dette.
- **[high]** Kanten på tekstfelt (CV-tekst, annonse, brev, redigerbare forklaringer og råd) har 1,2–1,3:1 mot hvitt. Det er særlig alvorlig i kravkortene, der kanten er det eneste visuelle skillet mellom låst tekst og redigerbar tekst (key-resultat-gap.html `.edit`; DESIGN.md arver `input`/`border`; WCAG 1.4.11). *Fix:* Legg `input: '#8A857C'` (eller tilsvarende, minst 3:1 mot både `#FFFFFF` og `#FAFAF7`) i `colors` i DESIGN.md og bruk den på alle redigerbare felt. Behold `border` for kort og skillelinjer, som er dekorative.
- **[medium]** `destructive` arves uten verdi. I shadcn v3 er den `#EF4444` (3,76:1 mot hvitt), som feiler for feilmeldinger og den røde telleren (DESIGN.md Colors «Feil»; EXPERIENCE.md State Patterns «Telleren blir rød»; WCAG 1.4.3). *Fix:* Sett `destructive: '#B91C1C'` (ca. 6,5:1 mot hvitt) i DESIGN.md, eller skriv eksplisitt at shadcn v4-verdien `#E7000B` (4,77:1) skal brukes og ikke lysnes.
- **[medium]** Gjennomstreket belegg i *Bygger på* har `opacity: .7`, som gir 4,41:1 (key-redigering-brev.html `.quote.gone`; WCAG 1.4.3). *Fix:* I DESIGN.md: «Fjernede belegg vises med gjennomstreking og `muted-foreground` på hvit bakgrunn, aldri med redusert opasitet.»
- **[medium]** `muted-foreground` arves, men skissene bruker en annen verdi (`#5F6B7A`, 5,2:1) enn shadcn (`#737373`, 4,53:1 på `#FAFAF7`, 4,28:1 på belegg-bg). Etiketter som «Fra CV-en», «nedgradert»-merket, tellere og årsaken under *Analyser* er 12–13 px og ligger like over grensen (DESIGN.md frontmatter; WCAG 1.4.3). *Fix:* Sett `muted-foreground: '#5F6B7A'` eksplisitt i DESIGN.md, og skriv at den ikke brukes på `belegg-bg` eller andre tonede flater uten ny sjekk.
- **[medium]** Stiplet kant på opplastingsfeltet har 1,71:1. Feltet er en klikkbar komponent, og kanten er det som viser at det er et mål (DESIGN.md Components «Opplastingsfelt»; WCAG 1.4.11). *Fix:* Bruk samme `input`-farge (minst 3:1) på den stiplede kanten, og skriv at hover, fokus og fil-dras-over alle gir kant i `{colors.primary}`, ikke bare hover og drag.
- **[low]** Manglende nøkkelord har stiplet kant på 1,96:1. Siden gruppen har overskriften «Ikke funnet» og brikkene ikke er interaktive, bærer ikke kanten nødvendig informasjon, men det er lite skille mot bakgrunnen (DESIGN.md `keyword-chip-missing`; WCAG 1.4.11, 1.4.1). *Fix:* Skriv i DESIGN.md at nøkkelordbrikker ikke er interaktive, at gruppen alltid har overskrift, og gi kanten `input`-fargen.
- **[low]** DESIGN.md sier «Alle par over oppfyller WCAG 2.1 AA», men nevner ikke paret primær på primær myk (6,35:1) eller ikke-tekst-kontrast. *Fix:* Legg til en kort tabell med alle tekst- og ikke-tekst-par (som i denne rapporten), slik at arvede farger også er dekket.

### 2. Farge eller symbol alene, og glyfer i skissene

- **[high]** På mobil viser oppsummeringen bare `✓ 3`, `◐ 2`, `○ 1` uten ord. Det bryter regelen «Kategorien formidles alltid med ord», og skjermlesere leser glyfene som «hake», «sirkel med venstre halvdel svart» og liknende (key-resultat-gap.html mobilskissen; WCAG 1.4.1, 1.1.1, 1.3.3). *Fix:* I EXPERIENCE.md, Responsive: «Kategorimerkene beholder ordet på alle bredder. Ved behov brytes merkene på flere linjer.» Fjern glyf-only-merkene fra skissen.
- **[medium]** Skissene bruker Unicode-glyfene ✓ ◐ ○ ↻ ⧉ ⋯ som ikoner i teksten. Implementert slik blir de lest opp, og de ser ulike ut i ulike nettlesere og fonter (alle tre skisser; WCAG 1.1.1, 1.3.1). *Fix:* I DESIGN.md Components: «Ikoner er SVG fra lucide-react med `aria-hidden="true"`. Glyfene i skissene er plassholdere.» Skriv i EXPERIENCE.md hvilke lucide-ikoner som brukes (f.eks. `Check`, `CircleDashed`/`CircleHalf`, `Circle`, `RefreshCw`, `Copy`, `MoreHorizontal`).
- **[low]** Plassholdere som `[Ditt navn]` markeres med farge, men hakeparentesene gjør dem tekstlig synlige, så fargen er ikke alene. *Fix:* Skriv i EXPERIENCE.md at hakeparentesene alltid beholdes, og at ordtelleren eller en linje over brevet sier hvor mange plassholdere som gjenstår.

### 3. Fokushåndtering

- **[high]** Når CV-filen er lest inn, byttes opplastingsfeltet ut med tekstfeltet. Elementet som hadde fokus forsvinner, og fokus faller til `body`. Det samme skjer når «Eller lim inn CV-teksten», *Bytt fil*, «Fil kan ikke leses», *Prøv igjen* (Alert erstattes av innhold) og *Ny analyse* bytter ut innhold (EXPERIENCE.md, Component Patterns og State Patterns; WCAG 2.4.3). *Fix:* Legg til en tabell «Fokus etter handling» i EXPERIENCE.md, Interaction Primitives: filen lest inn → overskriften «Kontroller CV-teksten» (med `tabindex="-1"`) og melding i live-regionen «CV-en er lest inn. 1 214 tegn.»; «Eller lim inn» → CV-tekstfeltet; *Bytt fil* → filvelgeren; *Prøv igjen* → overskriften eller statusteksten i fanen; *Ny analyse* bekreftet → sidetittelen på forberedelsen; *Endre CV-tekst* → CV-tekstfeltet; dialog lukket med *Avbryt* eller `Esc` → knappen som åpnet den.
- **[medium]** Etter *Analyser* flyttes fokus til overskriften på resultatsiden, men overskriften er stilling og arbeidsgiver fra annonsen. Er de ikke klare innen fokus flyttes (skjelett), får fokus en tom eller skjelett-overskrift (EXPERIENCE.md Interaction Primitives og State «Analyserer»; WCAG 2.4.3, 2.4.6). *Fix:* Skriv at resultatsiden har en fast `h1` «Resultat» (eventuelt visuelt skjult) som får fokus, og at stillingen vises under. Bytt også `document.title` per flate, f.eks. «Resultat – CV-assistent» (WCAG 2.4.2).
- **[medium]** Det er ikke beskrevet hva som skjer med fokus på *Generer på nytt* mens fanen genererer. Blir knappen `disabled`, mister brukeren fokus i Firefox og Safari (EXPERIENCE.md Verktøylinje; WCAG 2.4.3). *Fix:* «Under generering har *Generer på nytt* og *Kopier* `aria-disabled="true"` og forblir fokuserbare. Fokus flyttes ikke.»
- **[medium]** Klikk på et kategorimerke «ruller til gruppen», men fokus er ikke nevnt. Ruller bare visningen, står tastaturfokus igjen øverst (EXPERIENCE.md Oppsummering; WCAG 2.4.3, 2.1.1). *Fix:* «Merkene er lenker til gruppeoverskriften (`href="#mangler"`). Overskriften har `tabindex="-1"` og får fokus.» Da blir de også fokuserbare og får synlig fokus.
- **[low]** Dialogene: skissen har `role="alertdialog"` og `aria-labelledby`, men ikke `aria-describedby`. Radix gjør dette riktig hvis `AlertDialogDescription` brukes (key-redigering-brev.html; WCAG 4.1.2). *Fix:* I EXPERIENCE.md: «Dialogteksten ligger i `AlertDialogDescription`. Fokus går tilbake til knappen som åpnet dialogen.»
- **[low]** Toasts (sonner) kan dekke fokuserte elementer nederst på mobil (WCAG 2.4.11, 2.2). *Fix:* «Toast plasseres øverst på mobil, og brukes bare til korte statusmeldinger uten knapper.»

### 4. Statusmeldinger og `aria-live`

- **[high]** Bare ett eksempel på melding er beskrevet («Gap-analysen er klar. 6 krav.»). Det er ikke sagt hva som meldes når en fane i bakgrunnen blir ferdig, når den feiler, når analysen starter, eller når en fane blir utdatert. En feil i en fane brukeren ikke ser på, blir helt usynlig for skjermleserbrukere (EXPERIENCE.md Accessibility Floor; WCAG 4.1.3). *Fix:* Legg en tabell med meldinger i Accessibility Floor: start («Leser annonsen og sammenligner med CV-en.»), ferdig per fane («Søknadsbrevet er klart.»), feil per fane («Søknadsbrevet kunne ikke lages. Åpne fanen for å prøve igjen.»), utdatert («Søknadsbrev og CV-forbedringer er basert på forrige analyse.»), CV lest inn, fil avvist. Skriv at live-regionen er én felles, alltid til stede i DOM fra sidelast, og at feil i aktiv fane bruker `Alert` med `role="alert"`.
- **[medium]** Tellerne (tegn og ord) er knyttet til feltet med `aria-describedby`, men det er ikke sagt om de oppdateres i en live-region. Leses de ved hvert tastetrykk, blir det støy; leses de aldri, får brukeren ikke vite når grensen passeres (EXPERIENCE.md Accessibility Floor; WCAG 4.1.3). *Fix:* «Tellerne er ikke live. Når en grense passeres (under 200, over 8 000, over 15 000), meldes det én gang i live-regionen.»
- **[medium]** Skjelettkortene har ingen tekstlig ekvivalent eller `aria-busy` (EXPERIENCE.md State «Genererer fane»; WCAG 1.3.1, 4.1.3). *Fix:* «Fanepanelet har `aria-busy="true"` under generering. Skjelettene har `aria-hidden="true"`. Statusteksten («Skriver søknadsbrevet …») er synlig tekst i panelet.»
- **[low]** Toast «Kopiert» bruker sonner sin innebygde live-region, som er greit. Kopiering kan feile (clipboard-tillatelse i Safari/Firefox). *Fix:* Legg til tilstanden «Kopiering feilet» med melding «Kunne ikke kopiere. Merk teksten og kopier selv.» i State Patterns.

### 5. Faner

- **[high]** Radix `Tabs` aktiverer en fane når den får fokus med piltast (`activationMode="automatic"`). Siden en fane genereres første gang den åpnes, vil en tastaturbruker som piler seg gjennom fanelisten starte generering av alle fire delene, med kostnad og bruksgrense (NFR-3). Mus-brukere har ikke denne ulempen (EXPERIENCE.md Faner og Interaction Primitives; WCAG 3.2.1, 2.1.1). *Fix:* I EXPERIENCE.md: «Fanene bruker `activationMode="manual"`: piltaster flytter fokus, `Enter` eller mellomrom åpner fanen og starter eventuell generering.»
- **[medium]** Spinneren og merket «Redigert» i fanetittelen er ikke beskrevet for skjermleser. Med skissens markup blir navnet «SøknadsbrevRedigert», og spinneren gir ingen tekst (key-redigering-brev.html `.tab em`; EXPERIENCE.md Faner og State «Redigert fane»; WCAG 4.1.2, 1.3.1). *Fix:* «Spinneren har `aria-hidden="true"`, og fanen får visuelt skjult tekst ‹, genereres›. ‹Redigert› skilles fra navnet med visuelt skjult komma, slik at navnet blir ‹Søknadsbrev, redigert›. Tilsvarende ‹, feil› og ‹, utdatert› når det gjelder.»
- **[medium]** Skissene bygger fanene som `span` uten `role="tab"`, `aria-selected` eller `aria-controls`. Én har `role="tablist"`, de andre ingenting (alle tre skisser; WCAG 4.1.2). *Fix:* Skriv i skissekommentaren og EXPERIENCE.md at fanene er `Tabs` fra shadcn, aldri egne `span`, og at skissen bare viser utseendet.
- **[medium]** På mobil rulles fanelisten sidelengs, og i skissen er *ATS-forslag* skjult uten tegn på at det finnes flere faner (key-resultat-gap.html mobil; EXPERIENCE.md Responsive; WCAG 1.4.10, 1.3.2). *Fix:* Velg én av to i EXPERIENCE.md: fanene brytes på to linjer under 640 px, eller fanelisten har synlig tone/pil i kanten og den fokuserte fanen rulles inn med `scrollIntoView`. Det første er enklest og tryggest.

### 6. Etiketter, redigerbare og låste felt

- **[high]** Brevet skal være «ett stort tekstfelt» der plassholdere er «markert». En vanlig `textarea` kan ikke markere deler av teksten. Skissen viser en `div` med `aria-label`, som ikke er redigerbar. Utviklerne vil trolig ty til `contenteditable`, som krever mye ekstra for å bli tilgjengelig (EXPERIENCE.md Brevfelt; key-redigering-brev.html `.letter`; WCAG 4.1.2, 2.1.1). *Fix:* Bestem i EXPERIENCE.md: «Brevet er en vanlig `textarea` med synlig etikett ‹Søknadsbrev›. Plassholderne markeres ikke inne i feltet. Over feltet står en linje ‹3 plassholdere må fylles inn: [Ditt navn], [E-post], [Telefon]›.» Alternativt: kun `contenteditable` med `role="textbox" aria-multiline="true"` og tastaturtest i alle fire nettlesere.
- **[medium]** Tekstfeltene i skissene har `aria-label` som ikke stemmer med den synlige teksten: «CV-tekst» mot overskriften «Kontroller CV-teksten», og «Annonse» mot «Lim inn hele annonsen». NFR-8 krever synlige etiketter, og talestyring bruker den synlige teksten (key-forberedelse.html; WCAG 2.5.3, 3.3.2, 1.3.1). *Fix:* I EXPERIENCE.md: «Hvert tekstfelt har en `<label>` med synlig tekst: ‹CV-tekst› og ‹Stillingsannonse›. Overskriften kan stå over. `aria-label` brukes ikke på felt som har synlig etikett.»
- **[medium]** De redigerbare forklaringene og rådene i kravkortene er `div` i skissen, med etiketten «Hvorfor delvis (kan redigeres)» som løs tekst. Det må være klart for skjermleser hvilke felt som kan redigeres og hvilket krav de hører til (key-resultat-gap.html `.edit`; EXPERIENCE.md Kravkort; WCAG 1.3.1, 4.1.2). *Fix:* «Forklaring og råd er `textarea` med `<label>` ‹Hvorfor delvis› / ‹Råd›, og `aria-describedby` som peker på kravteksten. Kravtekst, kategori og belegg er vanlig tekst, ikke `readonly`-felt.» Kravteksten bør være en overskrift (`h4`) slik at kortene kan navigeres.
- **[low]** Låste belegg-sitater er riktig som vanlig tekst. Etiketten «Fra CV-en» bør knyttes til sitatet (`<figure>`/`<figcaption>` eller `blockquote` med etikett), og anførselstegnene «» bør stå i teksten, ikke i CSS (EXPERIENCE.md Belegg-sitat; WCAG 1.3.1). *Fix:* Skriv dette i DESIGN.md Components.
- **[low]** Avkrysningen for personvern blir «avkrysset og låst» etter første gang. En `disabled` avkrysning blir hoppet over av tastatur og forklarer ikke hvorfor (EXPERIENCE.md Avkrysning; WCAG 3.3.2). *Fix:* «Etter første avkrysning erstattes den av teksten ‹Du har bekreftet at du har lest informasjonen om personvern.› med ikon.» Skissen viser `span.cb`; skriv at det er shadcn `Checkbox`.

### 7. Feil og validering

- **[medium]** *Analyser* er deaktivert med årsak under, men native `disabled` fjerner knappen fra tab-rekkefølgen, og årsaken er ikke knyttet til knappen. En tastaturbruker finner aldri knappen eller årsaken. Det er heller ikke sagt hva som vises når flere vilkår mangler (EXPERIENCE.md *Analyser*; WCAG 3.3.1, 4.1.2, 1.3.1). *Fix:* «*Analyser* bruker `aria-disabled="true"` (ikke `disabled`), er fokuserbar, og har `aria-describedby` til årsaksteksten. Årsaken lister alle vilkår som mangler. Trykk på deaktivert knapp flytter fokus til første felt som mangler.»
- **[medium]** Feil i tekstfeltene er beskrevet som «telleren blir rød, en melding står under feltet». Det mangler `aria-invalid`, når feilen vises (under skriving eller ved blur), og om lim inn over 15 000 tegn kuttes (EXPERIENCE.md State «Utenfor lengdegrensene»; WCAG 3.3.1, 3.3.3). *Fix:* «Feltet får `aria-invalid="true"` og meldingen er i `aria-describedby`. ‹For kort› vises først etter at feltet forlates, ‹for lang› med en gang. Teksten kuttes aldri; meldingen sier hvor mange tegn som må fjernes.»
- **[low]** Feil filformat eller for stor fil: meldingen står under feltet, men det er ikke sagt at den meldes (EXPERIENCE.md State; WCAG 3.3.1, 4.1.3). *Fix:* «Meldingen har `role="alert"` og er knyttet til opplastingsknappen med `aria-describedby`. Fokus blir stående på opplastingsknappen.»

### 8. Mobil, målstørrelse og reflow

- **[high]** På mobil er verktøylinjen bare ikoner, og toppfeltets knapper ligger i en «⋯»-meny. I skissen er alle tre `span` med `aria-label`, som ikke er fokuserbare og hvis navn ignoreres av mange skjermlesere. Menyens navn («Meny: Endre CV-tekst, Ny analyse») lister innholdet. Ikonene ↻ og ⧉ er ikke selvforklarende for seende brukere (key-resultat-gap.html `.icon-btn`; EXPERIENCE.md Responsive; WCAG 4.1.2, 2.1.1, 2.4.6, 3.3.2). *Fix:* I EXPERIENCE.md: «Ikonknappene er `Button size="icon"` med `aria-label` ‹Kopier› / ‹Generer på nytt› og `Tooltip` med samme tekst. ‹⋯› er shadcn `DropdownMenu` med navnet ‹Flere valg›, og punktene er menyelementer.» Vurder å beholde *Kopier* med tekst på mobil, siden det er primærhandlingen (det er plass ved 360 px).
- **[medium]** Spesifikasjonen sier 44 × 44 px på mobil, men skissens ikonknapper er 40 × 40 px. Kategorimerkene (ca. 24 px høye) blir klikkbare i oppsummeringen og har bare 8 px mellomrom (key-resultat-gap.html; EXPERIENCE.md Accessibility Floor; WCAG 2.5.8, 2.5.5). *Fix:* Rett skissen til 44 px, og skriv at klikkbare kategorimerker har minst 44 px høy klikkflate på mobil og 24 × 24 px på PC.
- **[medium]** Kravet er 360 px, men WCAG 1.4.10 måles ved 320 CSS-px (1280 px med 400 % zoom). Lange ord i norsk («kontanthåndtering», «Gap-analyse og nøkkelord») og nøkkelordbrikker med `white-space: nowrap` kan gi horisontal rulling (EXPERIENCE.md Responsive; WCAG 1.4.10, 1.4.12). *Fix:* Legg 320–359 px i responsive-tabellen med samme oppførsel som 360 px, og skriv at tekst og brikker bryter (`overflow-wrap: anywhere`), og at ingen komponent har fast høyde.
- **[low]** Toppfeltet har stilling som overskrift og menyknapp ved siden av; skissen viser at h2 er 19 px på mobil, mens `page-title` er 24 px (DESIGN.md Typography). *Fix:* Angi mobilstørrelse for `page-title` i DESIGN.md.

### 9. Dra og slipp, bevegelse og tid

- **[low]** Opplastingsfeltet har klikk som alternativ til dra og slipp, som oppfyller 2.5.7. Skissen er en `div`, og «Eller lim inn CV-teksten» er en `span` med lenkestil (key-forberedelse.html `.drop`, `.link`; WCAG 2.1.1, 4.1.2). *Fix:* «Opplastingsfeltet er en `<button>` som åpner en skjult `<input type="file" accept=".pdf,.docx,.txt">`. ‹Eller lim inn CV-teksten› og *Bytt fil* er knapper (`variant="link"`), ikke lenker, siden de ikke navigerer.»
- **[low]** Spinnere, skjelettenes pulsering og rulling til kategorigruppe er ikke koblet til `prefers-reduced-motion` (EXPERIENCE.md State Patterns, Oppsummering; WCAG 2.3.3 (AAA), god praksis). *Fix:* «Ved `prefers-reduced-motion: reduce` pulserer ikke skjelettene, og rulling skjer uten animasjon.»
- **[low]** Tidsavbrudd fra språkmodellen er ikke en tidsgrense for brukeren og beholder tekstene, som er riktig (WCAG 2.2.1 ikke relevant). Sonner sin toast forsvinner etter ca. 4 s. *Fix:* Skriv at toasts aldri inneholder knapper eller informasjon som ikke finnes andre steder, og at feil alltid vises som `Alert` i fanen, ikke som toast.

### 10. Struktur, språk og leserekkefølge

- **[medium]** Next.js-malen setter `<html lang="en">`. Skissene har `lang="nb"`, men spesifikasjonen sier det ikke (EXPERIENCE.md Foundation; WCAG 3.1.1). *Fix:* I EXPERIENCE.md Accessibility Floor: «`<html lang="nb">` i `app/layout.tsx`.»
- **[low]** Overskriftsnivåer og landemerker er ikke beskrevet. Skissene bruker `h1` som bildetekst, `h2` som sidetittel, «Om personvern» som `strong`, og gruppeoverskriftene inneholder bare et merke med glyf (alle skisser; WCAG 1.3.1, 2.4.6). *Fix:* Legg til i EXPERIENCE.md: én `h1` per flate (sidetittel), `h2` for personvern, CV-panel, annonsepanel, kategorigrupper, treffmåler og *Bygger på*; `h3` for kravtekst. `header`, `main` og fanepanelet som `region`.
- **[low]** Leserekkefølgen er logisk i alle skisser (oppsummering → krav → treffmåler; CV før annonse på mobil). Årsaksteksten under *Analyser* er høyrejustert og står etter knappen i DOM, som er greit når den er koblet med `aria-describedby`. *Fix:* Skriv i EXPERIENCE.md at DOM-rekkefølgen skal være lik den visuelle på alle bredder, og at `order`/`flex-direction: row-reverse` ikke brukes.
- **[low]** Treffmåleren er en dekorativ linje ved siden av tallet. Merkes den som `progressbar` blir den feil semantisk (det er ikke fremdrift) (DESIGN.md Treffmåler; WCAG 1.3.1). *Fix:* «Linjen har `aria-hidden="true"`; tallet og ‹veiledende treff, ikke en ATS-score› står som tekst.»

### 11. Testing

- **[medium]** NFR-8 nevner fire nettlesere, men spesifikasjonen sier ikke hvordan tilgjengeligheten testes, og PRD sier bare «manuell test med tastatur og i 360 px» (PRD §8 NFR-8). Skjermleser er ikke nevnt, selv om NFR-8 krever at fanene er tilgjengelige for skjermlesere. *Fix:* I EXPERIENCE.md Accessibility Floor: «Hver story testes med tastatur alene, med NVDA + Firefox eller Chrome, VoiceOver + Safari (macOS eller iOS), og med axe DevTools. Mobil testes ved 320 og 360 px.»

## Det som er bra

- Egne fargepar holder AA med god margin, og forholdstallene i DESIGN.md stemmer med utregningen.
- Kategori formidles med ord, ikon og farge, og Mangler er bevisst skilt fra feilrødt.
- Deaktivert *Analyser* har synlig årsak, ikke bare tooltip.
- *Enter* sender ikke skjemaet, og det finnes ingen hurtigtaster som kan kollidere med hjelpemidler.
- Dialogene har *Avbryt* som standardfokus, og `Esc` lukker.
- Fokus flyttes ikke når en fane blir ferdig, men meldes. Det er riktig valg.
- Dra og slipp har klikk som alternativ.
- Tidsavbrudd sletter aldri brukerens tekst.
