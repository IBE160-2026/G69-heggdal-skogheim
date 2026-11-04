# G69 — Sondre og Kevin

Gruppeprosjekt i **IBE160 Programmering med KI** ved Høgskolen i Molde, høsten 2026 (15 studiepoeng).

Repoet inneholder gruppens applikasjon og dokumentasjon av utvikling, testing og kvalitetssikring med KI.

## Medlemmer

- Kevin Heggdal
- Sondre Skogheim

## Kjøre appen lokalt

Krav: Node 24.

```bash
npm ci
npm run dev
```

Åpne http://localhost:3000. Uten API-nøkkel kjører appen i demomodus, og det trengs ingen `.env`-fil. Alle variablene står i `.env.example`.

Får du feilen «running scripts is disabled on this system» i PowerShell på Windows, bruker du `npm.cmd` i stedet for `npm`: `npm.cmd ci` og `npm.cmd run dev`.
