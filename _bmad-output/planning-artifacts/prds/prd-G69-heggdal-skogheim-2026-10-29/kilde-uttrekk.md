# Kildeuttrekk (2026-10-29)

Uttrekk fra brief, addendum, brief-memlog, faglærertilbakemelding, research og testdata. Brukes ved input-avstemming i Finalize.

## Motsetninger og uklarheter som PRD-en må løse
1. Brief-memlog sier kontoer/lagring er åpent; revidert brief (27. okt) har besluttet. Briefen har forrang.
2. «Fem genereringer» vs. fire faner (gap-analyse + nøkkelord deler fane). Teller nøkkelord som egen generering?
3. Regenerering per del: briefen sier ja, research har det som åpent spørsmål.
4. Kriterium 4 (Mangler aldri Oppfylt) er svakere enn sjekkliste og fasit (eksakt kategori). Feiler et par ved avvik?
5. Kriterium 5: ingen fasit for treffprosent; matchingsregel for norske bøyninger og sammensatte ord er udefinert.
6. Testsettet: 3 par av lovede 3–5; tokolonne-PDF og DOCX mangler, så kriterium 7 kan ikke testes ennå.
7. Grensen Oppfylt/Delvis: «Kundeorientert» er Oppfylt i par 1; «Nøyaktig/pålitelig» (egenvurdering) er Delvis. Må presiseres.
8. Omfang av demomodus: alle fem resultater eller bare kjerneflyten?
9. Udefinert: skannet PDF, maks lengde, navn/kontaktinfo i brevet, annonse som PDF.

## Faglærertilbakemelding som bare er delvis adressert
- Skisser av opplasting, resultatside og redigering (design teller 10 %). Finnes bare som tekst.
- Testsett: tokolonne-PDF og DOCX gjenstår.
- Prisoverslag for genereringer gjenstår.
- Begrunnelse for valg av leverandør (personvern) gjenstår.
- Valg av KI-modell er fortsatt åpent.

## Kvalitative ting som lett forsvinner i FR-er
Ærlighet og brukerkontroll; rolig resultatside med faner; brevet skal ikke høres KI-generert ut; naturlig norsk bokmål; trygghet og åpenhet før opplasting; læring (verdien av deltidsjobber og verv); tilgivende feilhåndtering der ingenting går tapt.

## Testdata som grunnlag for akseptansekriterier
3 par (Ida/bank, Jonas/IT-support, Sara/regnskap) med cv.txt, annonse.txt og fasit.md: forventet kategori per krav, forventede nøkkelord, forbudte påstander. sjekkliste.md: minst 80 % av forventede nøkkelord, viste prosent = kodens beregning, brev med minst 3 krav og 2 erfaringer, 250–400 ord, tokolonne-PDF, LLM-feil, uleselig fil, demomodus.

## Ikke-mål v1 (brief)
Kontoer, varig lagring, eksport til PDF/DOCX, jobbsporing, automatisk jobbsøk, intervjuforberedelse, LinkedIn/portaler, andre språk enn norsk.

## Bransjetall
21,8 % vs. 13,1 %, ca. 2,5x og 76 % er markedsføringstall og skal ikke stå som fakta i PRD-en.
