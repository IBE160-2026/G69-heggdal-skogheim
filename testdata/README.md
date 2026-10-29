# Testdata

Fast testsett for kvalitetssikring av KI-innholdet i AI CV & Job Application Assistant. Se seksjonene *Suksesskriterier* og *Kvalitetssikring av KI-innholdet* i product brief, og FR-2, FR-12 og SM-1 til SM-5 i PRD-en (`_bmad-output/planning-artifacts/prds/prd-G69-heggdal-skogheim-2026-10-29/prd.md`).

**Alt innhold her er fiktivt.** Navn, kontaktinfo, arbeidsgivere og annonser er oppdiktet. Ekte CV-er skal aldri legges i repoet.

## Innhold

| Mappe | Situasjon | Hva paret tester særlig | Forventet treffprosent |
|---|---|---|---|
| `par-1-butikk-bank/` | Student med kort CV søker sommerjobb i bank | «Delvis oppfylt»: butikk- og kassererfaring mot krav om kundeservice og kontanthåndtering. Brukes også som eksempel i demomodus. Har DOCX-versjon av CV-en. | 22 % |
| `par-2-it-support/` | IT-student søker deltidsjobb i IT-brukerstøtte | Krav CV-en mangler (førerkort, ITIL) skal havne i «Mangler» og ikke bli diktet inn. | 11 % |
| `par-3-regnskap/` | Nyutdannet økonom søker første faste jobb | Svake kvalifikasjoner: Excel fra studiet mot krav om erfaring med regnskapssystemer. | 8 % |
| `par-4-tokolonne-hotell/` | Reiselivsstudent søker deltidsjobb i hotellresepsjon | Innlesing av en PDF-CV med to kolonner uten teksttap eller fletting (FR-2, SM-5), og «Mangler» for bookingsystem/Opera. | 33 % |

Hver mappe inneholder:

- `cv.txt`: fiktiv CV
- `annonse.txt`: fiktiv stillingsannonse
- `fasit.md`: det CV-en faktisk inneholder, forventet kategori for hvert krav i gap-analysen, forventede nøkkelord, **forventet treffprosent** med utregning, og en liste over **forbudte påstander** som aldri skal dukke opp i generert innhold

I tillegg:

- `par-1-butikk-bank/cv.docx`: samme CV som `cv.txt`, som Word-fil. Tekstuttrekket skal være likt `cv.txt` når mellomrom og linjeskift ikke regnes med (FR-2).
- `par-4-tokolonne-hotell/cv.pdf`: CV-en med to kolonner under et navnefelt. Her er `cv.txt` **forventet uttrekk**: navnefeltet, så hele venstrekolonnen, så hele høyrekolonnen. PDF-en er bevisst laget slik at tekstbitene ligger rad for rad på tvers av kolonnene i filen. Et uttrekk som bare følger rekkefølgen i filen, fletter derfor kolonnene («KONTAKT», «PROFIL», «E-post …» …), mens et uttrekk som leser kolonne for kolonne, gir `cv.txt`. Se kriteriene under «Innlesing» i `fasit.md`.

`sjekkliste.md` brukes til manuell vurdering av generert innhold for hvert par.

## Om treffprosenten

Treffprosenten i hver `fasit.md` er regnet ut med matcheregelen i PRD FR-12, på nøkkelordlisten i fasiten og `cv.txt`. Den er fasit for enhetstesten av treffprosent, ikke et mål på hvor god CV-en er. Tallene er lave fordi regelen er streng: synonymer og bøyninger som ikke begynner med nøkkelordet, gir ikke treff (for eksempel *kontanter* mot *kontanthåndtering*, og *dagsoppgjør* mot *oppgjør*). Kjente svakheter som enhetstestene bør dokumentere:

- Nøkkelord som er siste ledd i et sammensatt ord, gir ikke treff (*oppgjør* i *dagsoppgjør*, par 4).
- Korte småord i nøkkelord med flere ord kan gi falske delvise treff (*av* i «oppsett av PC» treffer *avisbud*, par 2; nøkkelordet som helhet er likevel ikke funnet).

Endres matcheregelen i PRD-en, må treffprosentene i fasitene regnes ut på nytt.

## Slik brukes testsettet

1. Kjør appen med hvert par (CV + annonse) etter hver vesentlige endring i prompts. For par 1 testes både `cv.txt` og `cv.docx`, og for par 4 brukes `cv.pdf`.
2. Vurder resultatet mot `sjekkliste.md` og fasiten for paret.
3. Noter resultatet (bestått/ikke bestått per punkt) i sesjonsloggen.

## Gjenstår

Ingenting. PDF med to kolonner (par 4) og DOCX-versjon (par 1) ble lagt til 2026-10-29.
