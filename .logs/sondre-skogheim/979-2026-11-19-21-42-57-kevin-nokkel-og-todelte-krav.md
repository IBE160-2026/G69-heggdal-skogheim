# Kevins OpenAI-nøkkel og krav med to deler

## 2026-11-19 kl. 21:42 — Sondre Skogheim

### Oppgave
Kevin er ferdig med runde 2 av Mistral-testene i story 2.4. Han trenger en OpenAI-nøkkel til testsettet og en avklaring på krav med to deler, for eksempel «Windows og Microsoft 365», når bare én del er oppfylt.

### Plan
- Egen nøkkel til Kevin i samme OpenAI-prosjekt, sendt privat, slik at den kan slettes uten at Sondres nøkkel påvirkes.
- Beslutte regelen for krav med to deler ut fra FR-8 og prompten i `src/lib/llm/prompter/gap.ts`.

### Resultat
- Sondre laget nøkkelen `kevin-maaling-2-4` og sendte den til Kevin på DM, sammen med en melding om bruk: bare fiktive testdata, `.env.local`, `gpt-4.1-mini`.
- **Beslutning (Sondre, 2026-11-19):** et krav med to deler er ett krav. Er bare én del dekket, blir det Delvis oppfylt, med belegg for den dekkede delen og «Hvorfor delvis» som sier hva som mangler. Ingen deler dekket gir Mangler, og begge dekket gir Oppfylt. Det følger FR-8 (den svakeste kategorien ved tvil) og «ett krav per punkt», så tallene i fasitene stemmer fortsatt. Kevin legger regelen inn i gap-prompten og sjekker fasitene i 2.4.

### Åpne punkter
- Slett Kevins OpenAI-nøkkel (`kevin-maaling-2-4`) når målingen i 2.4 er ferdig.
- Story 2.4 (Kevin): regelen for krav med to deler inn i gap-prompten, og fasitene sjekkes for slike krav.
