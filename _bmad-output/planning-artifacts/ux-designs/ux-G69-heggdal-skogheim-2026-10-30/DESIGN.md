---
name: AI CV & Job Application Assistant
description: Ærlig gap-analyse og søknadshjelp for studenter på norsk. shadcn/ui på Next.js og Tailwind; denne fila beskriver bare avvikene fra shadcn sine standarder.
status: final
created: 2026-10-30
updated: 2026-10-30
colors:
  # Overstyringer oppå shadcn. Alt som ikke står her (foreground, muted,
  # border, card, popover) arves. Tokenene under er satt eksplisitt fordi
  # standardverdiene i shadcn er for svake for tilgjengelighet.
  background: '#FAFAF7'
  foreground: '#1C1917'
  muted-foreground: '#5F6B7A'
  input: '#8A857C'
  ring: '#1F5F5B'
  destructive: '#B91C1C'
  primary: '#1F5F5B'
  primary-foreground: '#FFFFFF'
  primary-soft: '#E6F0EF'
  oppfylt: '#1C6B3C'
  oppfylt-bg: '#E7F4EC'
  delvis: '#7A5200'
  delvis-bg: '#FDF3DC'
  mangler: '#9A3412'
  mangler-bg: '#FDEDE5'
  belegg: '#3F3A33'
  belegg-bg: '#F5F3EE'
typography:
  # Geist Sans fra shadcn for alle roller. Bare rollene under overstyres.
  page-title:
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.25'
  section-title:
    fontSize: 18px
    fontWeight: '600'
    lineHeight: '1.3'
  letter:
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  hit-rate:
    fontSize: 40px
    fontWeight: '600'
    lineHeight: '1'
  label:
    fontSize: 13px
    fontWeight: '500'
    lineHeight: '1.4'
rounded:
  # shadcn sine standarder arves (sm 4px, md 6px, lg 8px).
  full: 9999px
spacing:
  # Tailwind sin 4-skala arves.
  content-max: 960px
  letter-max: 680px
  card-accent: 4px
  target-mobile: 44px
components:
  button-primary:
    background: '{colors.primary}'
    foreground: '{colors.primary-foreground}'
  focus-ring:
    outline: '2px solid {colors.ring}'
    offset: 2px
  text-field:
    background: '#FFFFFF'
    border: '1px solid {colors.input}'
    border-focus: '2px solid {colors.ring}'
    border-invalid: '1px solid {colors.destructive}'
  category-badge-oppfylt:
    background: '{colors.oppfylt-bg}'
    foreground: '{colors.oppfylt}'
    radius: '{rounded.full}'
  category-badge-delvis:
    background: '{colors.delvis-bg}'
    foreground: '{colors.delvis}'
    radius: '{rounded.full}'
  category-badge-mangler:
    background: '{colors.mangler-bg}'
    foreground: '{colors.mangler}'
    radius: '{rounded.full}'
  requirement-card:
    background: '#FFFFFF'
    border: '1px solid border (shadcn)'
    border-left-oppfylt: '{spacing.card-accent} solid {colors.oppfylt}'
    border-left-delvis: '{spacing.card-accent} solid {colors.delvis}'
    border-left-mangler: '{spacing.card-accent} solid {colors.mangler}'
  suggestion-card:
    background: '#FFFFFF'
    border: '1px solid border (shadcn)'
    border-left: '{spacing.card-accent} solid {colors.primary}'
  belegg-quote:
    background: '{colors.belegg-bg}'
    foreground: '{colors.belegg}'
    border-left: '3px solid {colors.primary}'
  keyword-chip-found:
    background: '{colors.primary-soft}'
    foreground: '{colors.primary}'
    radius: '{rounded.full}'
  keyword-chip-missing:
    background: 'transparent'
    foreground: '{colors.muted-foreground}'
    border: '1px dashed {colors.input}'
    radius: '{rounded.full}'
  hit-meter:
    track: '{colors.belegg-bg}'
    fill: '{colors.primary}'
    border: '1px solid {colors.input}'
  upload-zone:
    background: '#FFFFFF'
    border: '2px dashed {colors.input}'
    border-active: '2px dashed {colors.primary}'
  letter-field:
    typography: '{typography.letter}'
    max-width: '{spacing.letter-max}'
  demo-banner:
    background: '{colors.primary-soft}'
    foreground: '{colors.primary}'
---

## Brand & Style

Appen skal føles som en rolig samtale med en studieveileder som har lest CV-en din nøye: konkret, vennlig og ærlig. Det som skiller den fra andre verktøy, er at den viser hva hver vurdering bygger på. Derfor er det visuelle hovedgrepet **belegget**: sitater fra CV-en vises som tydelige utdrag, slik at brukeren alltid ser at teksten er hens egen.

Uttrykket er nøkternt. Ingen gnister, gradienter, robotikoner eller annet «KI-glitter». Det skal ikke se ut som magi, for det er det ikke.

shadcn/ui arves nesten uendret. Denne fila beskriver bare avvikene: én primærfarge, tre kategorifarger, belegg-sitatet, sterkere kanter og fokusring, og noen få komponenter som er særegne for appen.

## Colors

- **Primær grønnblå (`#1F5F5B`)** brukes på primærknapper, aktiv fane, lenker, fokusring og kanten på belegg og forslagskort. Den er rolig og tillitvekkende uten å ligne en bank. Kontrast 7,4:1 mot hvitt.
- **Primær myk (`#E6F0EF`)** er bakgrunnen for funne nøkkelord og demobanneret.
- **Bakgrunn (`#FAFAF7`)** er en varm off-white som gjør hvite kort og tekstfelt tydelige.
- **Dempet tekst (`#5F6B7A`)** brukes til etiketter, tellere, merket «Nedgradert» og årsaken under deaktivert *Analyser*. Kontrast 5,2:1 mot bakgrunnen og 4,9:1 mot belegg-bakgrunnen. Den skal ikke lysnes.
- **Feltkant (`#8A857C`)** er kanten på alle tekstfelt, opplastingsfeltet og stiplede nøkkelordbrikker. Kontrast 3,5:1 mot bakgrunnen og 3,7:1 mot hvitt (WCAG 1.4.11). Kanten er det som skiller redigerbar tekst fra låst tekst.
- **Fokusring (`#1F5F5B`)** er 2 px heltrukken med 2 px avstand. shadcn sin halvgjennomsiktige standardring brukes ikke.
- **Kategorifargene** brukes bare på kategorimerker og venstrekanten på kravkort, aldri som pynt eller advarsel:
  - **Oppfylt** `#1C6B3C` på `#E7F4EC` (5,8:1)
  - **Delvis oppfylt** `#7A5200` på `#FDF3DC` (6,3:1)
  - **Mangler** `#9A3412` på `#FDEDE5` (6,4:1). Rustrød, ikke feilrød: at noe mangler, er ærlig informasjon, ikke en feil.
- **Belegg** `#3F3A33` på `#F5F3EE` (10,2:1) brukes bare til sitater fra CV-teksten.
- **Feil (`#B91C1C`)** er forbeholdt feilmeldinger, ugyldige felt og tellere over grensen. Kontrast 6,5:1 mot hvitt. Den brukes aldri på kategorien Mangler.

Alle tekstpar oppfyller WCAG 2.1 AA (4,5:1). Kanter og fokusring oppfyller 3:1. Ingen tekst vises med redusert opasitet.

## Typography

Geist Sans fra shadcn brukes for alt. Rollene:

- `{typography.page-title}`: sidetittel og stilling i resultatsidens toppfelt.
- `{typography.section-title}`: overskrifter for kategorigrupper og seksjoner.
- `{typography.letter}`: søknadsbrevet, slik at det leses som et brev og ikke som et skjema.
- `{typography.hit-rate}`: tallet for treffprosent, det eneste store tallet i appen.
- `{typography.label}`: etiketter som «Fra CV-en», «Hvorfor» og tellere.

Brødtekst og hjelpetekst arver shadcn sin skala (14–16 px). Lange norske ord brytes (`overflow-wrap: anywhere`), slik at ingenting gir sidelengs rulling.

## Layout & Spacing

Tailwind sin 4-skala arves. Innholdet ligger sentrert med maks bredde `{spacing.content-max}`. Søknadsbrevet har smalere maks bredde, `{spacing.letter-max}`, for god linjelengde.

- **PC (≥ 1024 px):** forberedelsessiden har CV-panelet og annonsepanelet side om side. Resultatsiden har én kolonne.
- **Nettbrett og mobil (< 1024 px):** panelene stables, CV først. Ned til 320 px uten sidelengs rulling.
- Klikkflater er minst `{spacing.target-mobile}` høye på mobil og minst 24 × 24 px på PC.

## Elevation & Depth

shadcn sine skygger arves. Kort har tynn kant, ikke skygge. Dialoger har shadcn sin skygge. Dybde brukes ikke til å rangere innhold.

## Shapes

shadcn sine hjørner arves. Bare kategorimerker og nøkkelordbrikker er pilleformet (`{rounded.full}`), slik at de skiller seg fra knapper.

## Components

Disse shadcn-komponentene brukes uendret, bortsett fra fargetokenene over: `Button` (sekundær, outline, ghost), `Card`, `Tabs`, `Textarea`, `Checkbox`, `Alert`, `AlertDialog`, `DropdownMenu`, `Skeleton`, `Toast` (sonner), `Tooltip`, `Separator`.

**Ikoner** er SVG fra lucide-react med `aria-hidden="true"`, alltid sammen med synlig tekst. Glyfene ✓ ◐ ○ i skissene er bare plassholdere. Ikonene er: Oppfylt `CircleCheck`, Delvis oppfylt `CircleDashed`, Mangler `Circle`, nedgradert `Info`, kopier `Copy`, generer på nytt `RefreshCw`, personvern `ShieldCheck`, opplasting `Upload`.

Komponenter med egen utforming:

- **Primærknapp:** `{colors.primary}` med `{colors.primary-foreground}`. Høyst én primærknapp per flate (*Analyser* eller *Kopier*). Som deaktivert har den 50 % fyllfarge, men teksten beholder full kontrast.
- **Tekstfelt:** `text-field`. Kant i `{colors.input}`, ved fokus 2 px i `{colors.ring}`, og ved ugyldig verdi `{colors.destructive}`. Etiketten står alltid synlig over feltet.
- **Kategorimerke:** pilleform med ikon og ord på alle skjermbredder. Fargene er `category-badge-*`.
- **Kravkort:** `requirement-card`, med venstrekant i kategorifargen. Øverst kravteksten og kategorimerket, så belegg, forklaring eller råd.
- **Belegg-sitat:** `belegg-quote`, med etiketten «Fra CV-en» over. Teksten står i anførselstegn «».
- **Merke «Nedgradert»:** `{typography.label}` i `{colors.muted-foreground}` med `Info`-ikon.
- **Forslagskort:** `suggestion-card`. Tre deler under hverandre: «Gjelder» med belegg-sitat (CV-forbedringer) eller overskrift eller nøkkelord i fet tekst (ATS-forslag), så «Forslag» i et tekstfelt og «Hvorfor» i et tekstfelt. Etikettene står i `{typography.label}`.
- **Treffmåler:** tallet i `{typography.hit-rate}`, ved siden av «veiledende treff, ikke en ATS-score», og under en fremdriftslinje `hit-meter` som er 8 px høy.
- **Nøkkelordbrikke:** funnet er `keyword-chip-found` med `Check`-ikon. Ikke funnet er `keyword-chip-missing`. Brikkene brytes over flere linjer.
- **Opplastingsfelt:** `upload-zone`. Kanten blir `{colors.primary}` ved hover, fokus og når en fil dras over.
- **Brevfelt:** `letter-field`. Et vanlig tekstfelt med brevskrift. Over feltet står en linje som lister plassholderne som må fylles inn.
- **Bygger på:** en liste av belegg-sitater under brevet. Et belegg som ble fjernet, vises ikke. Listen avsluttes med én linje i `{colors.muted-foreground}`: «1 belegg ble fjernet fordi det ikke fantes i CV-en.»
- **Fanemerke:** tekst i `{typography.label}` etter fanenavnet, for eksempel «· redigert» eller en liten spinner (`Loader2`) under generering.
- **Banner for utdatert fane:** shadcn `Alert` (standardvariant) øverst i fanen, med knappen *Generer på nytt*.
- **Demobanner:** `demo-banner`, full bredde øverst, med `Info`-ikon.
- **Personvernboks:** shadcn `Alert` (standardvariant) med `ShieldCheck`-ikon.
- **Advarsel om kort CV-tekst:** shadcn `Alert` (standardvariant) med `TriangleAlert`-ikon, ikke kategorifarger.

## Do's and Don'ts

| Gjør | Ikke gjør |
|---|---|
| Vis kategori med ikon og ord i tillegg til farge, også på mobil | La farge eller glyf alene bære kategorien |
| Bruk rustrødt for Mangler og `destructive` bare for feil | Få Mangler til å se ut som en feilmelding |
| Vis belegg som sitat med «Fra CV-en» | Blande belegg med tekst fra språkmodellen uten skille |
| Bruk `{colors.input}` på alle feltkanter | Bruke shadcn sin lyse standardkant på felt |
| Arv shadcn for alt som ikke står her | Lage egne varianter av knapper og dialoger |
| Én primærknapp per flate | Flere fargede knapper som konkurrerer |
| Nøkternt uttrykk | Gnister, gradienter, robotikoner eller «magisk» animasjon |
| Ett stort tall: treffprosenten | Store tall eller «score» andre steder (PRD §7.1) |
| Full kontrast på all tekst | Tekst med redusert opasitet |
