# Story 2.2 – Prøv med eksempel viser gap-analysen

## 2026-11-18 kl. 20:06 — Sondre Skogheim

### Oppgave
Bygge story 2.2 med bmad-build: *Prøv med eksempel* skal fylle inn demoeksempelet og vise en ferdig gap-analyse i appen, slik at sensor og jobbsøkere ser hva appen gjør uten API-nøkkel.

### Plan
- Story-fila er [spec-2-2-prov-med-eksempel-viser-gap-analysen.md](../../_bmad-output/implementation-artifacts/spec-2-2-prov-med-eksempel-viser-gap-analysen.md). Sondre godkjente den og tok tre valg:
  - Story-fila holdes samlet.
  - Resultatsiden får en midlertidig knapp «Tilbake» til story 2.7.
  - Testen med NVDA og VoiceOver flyttes til story 5.2.
- Sammendraget av epic 2 ble bygget på nytt etter FR-9-endringen.
- En agent gikk gjennom koden og UX-dokumentene.
- En agent implementerte.
- Tre agenter gikk gjennom koden: blind, kanttilfeller og testdekning.
- Før dette ble FR-9 strammet inn i PR #11: belegg må følge ordgrenser og ha minst 4 tegn. Sondre bestemte det, og Kevin får beskjed.

### Resultat
- Commit `93d9e14` på grenen `story-2.2-prov-med-eksempel-viser-gap-analysen`.
- **Tilstanden og hentingen (`lib/okt`):**
  - `kjoring`, `resultatdeler` og `startGenerering`, med vakt mot dobbeltstart og `AbortController`.
  - Fetch-innpakningen `hentGenerering`.
- **Ny knapp:** *Prøv med eksempel* ligger i overskriften og i demovarselet, med en dialog når feltene har innhold.
- **Resultatvisningen:** «Resultat», stilling og arbeidsgiver, «Tilbake», og fanen *Gap-analyse og nøkkelord*. Fanen har lasting, oppsummering, kravkort med belegg, nedgradert krav med fast råd, treffprosent og nøkkelord.
- **shadcn:** komponentene `tabs`, `alert-dialog` og `skeleton` er lagt til.
- **Kontrollene:** lint, typecheck, 588 tester og build er grønne.
- **Gjennomgangen:** 16 funn. 5 er rettet og 11 avvist, og ingenting er utsatt. Alle står i Review Triage Log i story-fila.
- **Sprint-status:** 2-2 står som `review`.

### Åpne punkter
- Test 2.2 i nettleseren før fletting: tastatur alene, 320 px bredde og 200 % tekstzoom. Testen med NVDA og VoiceOver er flyttet til 5.2.
