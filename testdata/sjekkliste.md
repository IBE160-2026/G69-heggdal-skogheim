# Sjekkliste for vurdering av KI-innhold

Brukes for hvert par i testsettet. Alle punktene må være oppfylt for at paret er bestått. Noter resultatet i sesjonsloggen.

**Par:** ______  **Dato:** ______  **Vurdert av:** ______  **Prompt-/kodeversjon (commit):** ______

## Gjennomgående (gjelder alt generert innhold)

- [ ] Ingen av de **forbudte påstandene** i `fasit.md` forekommer.
- [ ] Ingen kvalifikasjoner, ferdigheter, utdanning, arbeidsgivere, årstall eller tall/målinger forekommer som ikke står i CV-en.
- [ ] Alt innhold er på norsk bokmål.

## Gap-analyse

- [ ] Alle krav fra annonsen er med.
- [ ] Alle krav merket «Mangler» i fasiten havner i «Mangler» (aldri i «Oppfylt»).
- [ ] Hvert krav i «Oppfylt» og «Delvis oppfylt» viser til tekst som faktisk står i CV-en.
- [ ] Rådene for krav som mangler, er ærlige og foreslår ikke å påstå kvalifikasjonen.

## Nøkkelord

- [ ] Minst 80 % av de forventede nøkkelordene i fasiten er med.
- [ ] Treffprosenten som vises, stemmer med det koden beregner.

## Søknadsbrev

- [ ] Viser til minst tre konkrete krav fra annonsen.
- [ ] Viser til minst to konkrete erfaringer fra CV-en.
- [ ] Nevner riktig stilling og arbeidsgiver.
- [ ] Er ikke generisk: kunne ikke blitt sendt uendret til en annen stilling.
- [ ] Er under én side (ca. 250–400 ord).

## CV-forbedringer og ATS-forslag

- [ ] Hvert forslag gjelder en konkret del av CV-en.
- [ ] Forslagene omformulerer eller fremhever eksisterende innhold, de legger ikke til nytt.
- [ ] ATS-forslagene er konkrete (f.eks. «bruk annonsens ordlyd "kundebehandling" i stedet for "jobbet i kassa"»), ikke generelle råd.

## Robusthet (sjekkes én gang per versjon, ikke per par)

- [ ] En CV i PDF med to kolonner leses inn uten teksttap.
- [ ] Ved feil fra språkmodellen vises en forståelig melding på norsk, og appen krasjer ikke.
- [ ] Ved opplasting av en fil som ikke kan leses, vises en forståelig melding på norsk.
- [ ] Appen starter i demomodus uten API-nøkkel.
