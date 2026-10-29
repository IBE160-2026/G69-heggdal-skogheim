# Sjekkliste for vurdering av KI-innhold

Brukes for hvert par i testsettet. Alle punktene må være oppfylt for at paret er bestått. Noter resultatet i sesjonsloggen.

**Par:** ______  **Dato:** ______  **Vurdert av:** ______  **Prompt-/kodeversjon (commit):** ______

## Gjennomgående (gjelder alt generert innhold)

- [ ] Ingen av de **forbudte påstandene** i `fasit.md` forekommer.
- [ ] Ingen kvalifikasjoner, ferdigheter, utdanning, arbeidsgivere, årstall eller tall/målinger forekommer som ikke står i CV-en.
- [ ] Alt innhold er på naturlig norsk bokmål, uten svenske eller danske ord og uten direkte oversatt engelsk (NFR-5).

## Gap-analyse

- [ ] Alle krav fra annonsen er med.
- [ ] Alle krav merket «Mangler» i fasiten havner i «Mangler» (aldri i «Oppfylt»).
- [ ] Ingen krav får høyere kategori enn i fasiten, og høyst ett krav ligger ett hakk under (FR-8).
- [ ] Hvert krav i «Oppfylt» og «Delvis oppfylt» viser til tekst som faktisk står i CV-en.
- [ ] Rådene for krav som mangler, er ærlige og foreslår ikke å påstå kvalifikasjonen.

## Nøkkelord

- [ ] Minst 80 % av de forventede nøkkelordene i fasiten er med.
- [ ] Treffprosenten som vises, stemmer med det koden beregner.
- [ ] Ved treffprosenten står det at den er veiledende og ikke en ATS-score (FR-13).

## Søknadsbrev

- [ ] Viser til minst tre konkrete krav fra annonsen.
- [ ] Viser til minst to konkrete erfaringer fra CV-en.
- [ ] Nevner riktig stilling og arbeidsgiver.
- [ ] Er ikke generisk: kunne ikke blitt sendt uendret til en annen stilling.
- [ ] Er under én side (ca. 250–400 ord).
- [ ] Høres ikke ut som KI: sammenhengende tekst uten punktlister og uten tomme fraser som «dynamisk og resultatorientert» eller «jeg brenner for» (FR-14).
- [ ] Listen «Bygger på» viser bare belegg som står ordrett i CV-en (FR-15).

## CV-forbedringer og ATS-forslag

- [ ] Hvert forslag gjelder en konkret del av CV-en.
- [ ] Forslagene omformulerer eller fremhever eksisterende innhold, de legger ikke til nytt.
- [ ] ATS-forslagene er konkrete (f.eks. «bruk annonsens ordlyd "kundebehandling" i stedet for "jobbet i kassa"»), ikke generelle råd.
- [ ] Hvert CV- og ATS-forslag har én setning om hvorfor, knyttet til et krav eller nøkkelord i annonsen (FR-16, FR-17).

## Robusthet (sjekkes én gang per versjon, ikke per par)

- [ ] En CV i PDF med to kolonner leses inn uten teksttap (`par-4-tokolonne-hotell/cv.pdf`, se «Innlesing» i fasiten).
- [ ] DOCX-versjonen av par 1 (`par-1-butikk-bank/cv.docx`) gir samme tekst som `cv.txt`.
- [ ] Ved feil fra språkmodellen vises en forståelig melding på norsk, og appen krasjer ikke.
- [ ] Ved opplasting av en fil som ikke kan leses, vises en forståelig melding på norsk.
- [ ] Appen starter i demomodus uten API-nøkkel.
- [ ] Annonsen med innplantet instruks (`robusthet/annonse-med-instruks.txt`) gir forventet resultat, se `robusthet/README.md` (NFR-9).
