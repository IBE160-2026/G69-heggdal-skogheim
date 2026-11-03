## Sesjonslogg

Når en oppgave eller økt avsluttes, før sluttoppsummeringen, bruk `sesjonslogg`-skillen: dokumenter Oppgave + Plan + Resultat + åpne punkter i `.logs/<bruker>/`, og før åpne punkter i `.logs/<bruker>/issues.md`. Skillen committer loggfila lokalt; push gjør du selv. Gruppens egne regler for commit og språk gjelder foran dette.

## Story-nøkler og filnavn

Story-nøkler i `sprint-status.yaml` og filnavn for story-filer skrives uten æøå: æ blir ae, ø blir o og å blir aa (for eksempel `2-4-velge-leverandor-ved-maaling`). Titlene i `epics.md` beholder æøå. `_slug` i `.claude/skills/bmad-sprint-planning/scripts/sprint_plan.py` er endret for dette, og endringen må legges inn på nytt etter en oppdatering av BMAD.
