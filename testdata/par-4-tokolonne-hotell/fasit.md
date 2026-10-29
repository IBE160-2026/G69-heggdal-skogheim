# Fasit – par 4: reiselivsstudent → hotellresepsjon (CV i to kolonner)

CV-en finnes som `cv.pdf` med to kolonner: en smal venstrekolonne (kontakt, ferdigheter, språk, kurs) og en bred høyrekolonne (profil, utdanning, erfaring, verv), under et navnefelt over hele bredden. `cv.txt` er **forventet uttrekk**: navnefeltet, så hele venstrekolonnen ovenfra og ned, så hele høyrekolonnen (FR-2 i PRD).

PDF-en er laget med vilje slik at tekstbitene ligger i innholdsstrømmen i **rad-rekkefølge på tvers av kolonnene** (slik mange designverktøy lagrer dem). Et uttrekk som bare følger innholdsstrømmen, vil derfor flette kolonnene, for eksempel «KONTAKT PROFIL» på samme linje.

## Innlesing (FR-2, SM-5)
- Alle linjer i `cv.txt` finnes i uttrekket fra `cv.pdf`. Mellomrom og linjeskift regnes ikke med.
- Ingen linje i uttrekket blander tekst fra begge kolonnene. Eksempel på feil: «- Kassasystem og dagsoppgjør 2025–2028 Bachelor …».
- «SPRÅK» og «KURS» kommer før «PROFIL» i uttrekket.

## Det CV-en faktisk inneholder
- Pågående bachelor i reiselivsledelse (2. år), Testvik høgskole: vertskap og service, reiselivsmarkedsføring
- Servitør deltid siden 2024: bestillinger og hjelp til gjester, kassasystem og dagsoppgjør, stenger alene på kveldsvakter
- Sesongarbeider på camping sommeren 2023: svarte turister på norsk og engelsk
- Fadder for nye studenter
- Kassasystem og dagsoppgjør, grunnleggende Microsoft Office, sosiale medier for bedrift
- Norsk (morsmål), engelsk (godt), tysk (grunnleggende)
- Førstehjelpskurs (2024)

## Forventet gap-analyse
| Krav | Forventet kategori | Grunnlag i CV |
|---|---|---|
| Serviceinnstilt med erfaring fra kundeservice | Oppfylt | Servitør: tok imot bestillinger og hjalp gjester; sesongarbeider: svarte turister |
| Gode språkkunnskaper i engelsk og tysk | Delvis oppfylt | Engelsk godt, men tysk bare grunnleggende |
| Erfaring med kassasystem og oppgjør | Oppfylt | Betjente kassasystem og tok dagsoppgjør ved stenging |
| Selvstendig og ansvarsbevisst | Delvis oppfylt | Stengte kafeen alene på kveldsvakter; ellers egenvurdering i profilen |
| Studerer reiseliv, hotellfag eller tilsvarende | Oppfylt | Bachelor i reiselivsledelse (pågår) |
| Erfaring med bookingsystemer, gjerne Opera | Mangler | – |

## Forventede nøkkelord
resepsjon, serviceinnstilt, kundeservice, engelsk, tysk, kassasystem, oppgjør, selvstendig, ansvarsbevisst, reiseliv, booking, Opera

## Forventet treffprosent
**33 %** (4 av 12 nøkkelord funnet i `cv.txt`; 4/12 = 33.33 %, rundet til nærmeste hele prosent).

Beregnet med matcheregelen i PRD FR-12: små bokstaver, tegnsetting (også bindestrek) erstattes med mellomrom, og et nøkkelord er funnet når hvert av ordene i det er begynnelsen på et ord i CV-teksten. Enhetstesten for treffprosent skal bruke nøkkelordlisten over og gi nøyaktig dette tallet.

| Nøkkelord | Funnet | CV-ord som gir treff |
|---|---|---|
| resepsjon | Nei | – |
| serviceinnstilt | Nei | – |
| kundeservice | Nei | – |
| engelsk | Ja | engelsk |
| tysk | Ja | tysk |
| kassasystem | Ja | kassasystem |
| oppgjør | Nei | – |
| selvstendig | Nei | – |
| ansvarsbevisst | Nei | – |
| reiseliv | Ja | reiselivsledelse |
| booking | Nei | – |
| Opera | Nei | – |

## Forbudte påstander (skal aldri forekomme)
- At Mina har brukt Opera eller andre booking- eller hotellsystemer
- At Mina har jobbet på hotell eller i resepsjon
- At Mina snakker tysk flytende eller godt
- At Mina har fullført bachelorgraden
- Tall eller resultater som ikke står i CV-en (f.eks. «betjente 100 gjester per kveld»)
