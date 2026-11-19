# G69 — Sondre og Kevin

Gruppeprosjekt i **IBE160 Programmering med KI** ved Høgskolen i Molde, høsten 2026 (15 studiepoeng).

Repoet inneholder gruppens applikasjon og dokumentasjon av utvikling, testing og kvalitetssikring med KI.

## Medlemmer

- Kevin Heggdal
- Sondre Skogheim

## Publisert app

https://g69-cv-assistent.vercel.app

## Kjøre appen lokalt

Krav: Node 24.

```bash
npm ci
npm run dev
```

Åpne http://localhost:3000. Uten API-nøkkel kjører appen i demomodus, og det trengs ingen `.env`-fil. Alle variablene står i `.env.example`.

Får du feilen «running scripts is disabled on this system» i PowerShell på Windows, bruker du `npm.cmd` i stedet for `npm`: `npm.cmd ci` og `npm.cmd run dev`.

## Testsettet (leverandørvalg)

`npm run testsett` kjører gap-analysen for alle fire testparene i `testdata/` tre ganger gjennom den samme pipelinen som appen, og skriver en rapport til `testsett-rapporter/` med kategorier, belegg, nøkkelord, treffprosent, tokens, varighet og kostnad. Rapporten brukes sammen med `testdata/sjekkliste.md` for å velge leverandør (AD-11). Skriptet kjøres ikke i CI.

```bash
# Tørrkjøring uten nøkkel og uten nettverk (demosvaret for alle parene)
npm run testsett -- --leverandor mistral --mock

# Ekte måling. Nøkkelen (MISTRAL_API_KEY eller OPENAI_API_KEY) leses fra .env.local.
npm run testsett -- --leverandor openai --pris-inn <kr> --pris-ut <kr>
```

- `--leverandor mistral|openai` er påkrevd.
- `--pris-inn` og `--pris-ut` er kroner per million input- og output-tokens. De er påkrevd ved ekte kjøring og står ikke i koden. Hent dem fra prislisten til leverandøren.
- `--modell <navn>` (standard `mistral-medium-latest` eller `gpt-5-mini`), `--ganger <antall>` (standard 3) og `--par <mappe>` (for eksempel `par-2-it-support`) er valgfrie.

Rapporter fra ekte målinger committes. Tørrkjøringer får `-mock` i filnavnet og ignoreres av git. Nøkkelen skrives aldri til rapporten eller konsollen.
