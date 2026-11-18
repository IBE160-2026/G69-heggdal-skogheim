## Kodegjennomgang av story 1.6 (BMAD `bmad-code-review`, 2026-11-18)

@Heggdal03: her er funnene fra gjennomgangen. Fire uavhengige gjennomgangsagenter gikk gjennom diffen fra tuppen av story 1.5 til story 1.6 og sjekket den mot `spec-1-6`, AD-6, AD-13 og AC-ene i `epics.md`.

**Resultat:** ingen funn som trengte beslutning, 1 rettelse, 3 utsatt og 14 avvist. Alle AC-er er implementert og testet.

### Rettelse
- [ ] I `src/lib/okt/demovarsel-tilstand.test.ts` er bare tilfellet der `statusHentet` med `modus: "ekte"` fjerner `demoVarsel`, testet. Det mangler en test for at et varsel gitt mens modus var ukjent (`null`), blir stående når `statusHentet` kommer med `modus: "demo"`. Fjernes betingelsen i `statusHentet` (`tilstand.ts`), er alle testene fortsatt grønne. **Ikke med i #8, står åpen og kan tas i story 2.1 eller som en egen liten PR.**

### Utsatt
- Turbopack-regelen for `?raw` (`next.config.ts`), som gjør `DEMO_CV` og `DEMO_ANNONSE` om til tekst, kontrolleres ikke automatisk i bygget. Virker den ikke, får sensor alltid varselet om API-nøkkel, og i verste fall krasjer appen ved import. Står allerede i `deferred-work.md`. Sondre sjekker det for hånd: demoteksten fra par 1 limt inn etter `next build` skal ikke gi varsel.
- I Safari får ikke knapper fokus ved klikk, så `relatedTarget` er `null`. CV-feltets blur kan da maskere fødselsnummeret før klikket, og det første trykket viser varselet med en gang i stedet for bare å maskere. Personvernet holder, men i epic 2 kan analysen starte før brukeren har sett maskeringen. Dette avgjøres ved testen i Safari som står åpen.
- AD-6 og `epics.md` stemte ikke med beslutningen om at `kjoring` venter til epic 2. Rettet på `main` i 57255e3: AD-6 har fått `demoVarsel`, og story 1.6 i epics er oppdatert.

### Status ved fletting (#8, 2026-11-18)
- [x] `main` er flettet inn i grenen (767b2d7), og CI er grønn på `main` etter flettingen.
- [ ] Manuell test etter `next build` (Sondre): egen CV gir varsel, demoteksten fra par 1 gir ikke varsel, og fødselsnummer gir to trykk (gjerne i Safari).

Avvist (14): uoverensstemmelser i spec, logger og issues.md, fokus som kan forsvinne ved trykk før `/api/status` svarer (sjelden), avledning av `nyttNummer` fra teksten (riktig i dag), `cvForlatt` mens varselet vises (kan ikke nås), varselteksten i komponenten, NBSP skrevet som tegn i en test, og en dobbel sjekk i `bareStatusKall()`.
