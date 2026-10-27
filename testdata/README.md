# Testdata

Fast testsett for kvalitetssikring av KI-innholdet i AI CV & Job Application Assistant. Se seksjonene *Suksesskriterier* og *Kvalitetssikring av KI-innholdet* i product brief.

**Alt innhold her er fiktivt.** Navn, kontaktinfo, arbeidsgivere og annonser er oppdiktet. Ekte CV-er skal aldri legges i repoet.

## Innhold

| Mappe | Situasjon | Hva paret tester særlig |
|---|---|---|
| `par-1-butikk-bank/` | Student med kort CV søker sommerjobb i bank | «Delvis oppfylt»: butikk- og kassererfaring mot krav om kundeservice og kontanthåndtering. Brukes også som eksempel i demomodus. |
| `par-2-it-support/` | IT-student søker deltidsjobb i IT-brukerstøtte | Krav CV-en mangler (førerkort, ITIL) skal havne i «Mangler» og ikke bli diktet inn. |
| `par-3-regnskap/` | Nyutdannet økonom søker første faste jobb | Svake kvalifikasjoner: Excel fra studiet mot krav om erfaring med regnskapssystemer. |

Hver mappe inneholder:

- `cv.txt` — fiktiv CV
- `annonse.txt` — fiktiv stillingsannonse
- `fasit.md` — det CV-en faktisk inneholder, forventet kategori for hvert krav i gap-analysen, forventede nøkkelord og en liste over **forbudte påstander** som aldri skal dukke opp i generert innhold

`sjekkliste.md` brukes til manuell vurdering av generert innhold for hvert par.

## Slik brukes testsettet

1. Kjør appen med hvert par (CV + annonse) etter hver vesentlige endring i prompts.
2. Vurder resultatet mot `sjekkliste.md` og fasiten for paret.
3. Noter resultatet (bestått/ikke bestått per punkt) i sesjonsloggen.

## Gjenstår

- En CV i PDF med to kolonner for å teste suksesskriteriet om innlesing uten teksttap.
- Én DOCX-versjon av en av CV-ene for å teste DOCX-opplasting.
