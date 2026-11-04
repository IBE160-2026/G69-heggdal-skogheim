- source_spec: `_bmad-output/implementation-artifacts/spec-1-1-del-1-kjorbar-app-lokalt.md`
  summary: Story 1.1 del 2: publiser på Vercel-prosjektet g69-cv-assistent med regionen arn1 i vercel.json, legg https://g69-cv-assistent.vercel.app i README-en, sett nøkkelen bare i Production, og noter om runtime-loggene viser IP-adresser.
  evidence: Sondre valgte å dele story 1.1 i lokal app og publisering, slik at økten kan stoppe mellom delene.
- source_spec: `_bmad-output/implementation-artifacts/spec-1-1-del-1-kjorbar-app-lokalt.md`
  summary: Story 1.2 must move `modus` and `leverandor` from local state in `Demomodus` into the `lib/okt` context, so status is fetched once.
  evidence: AD-6 gives session state one owner, but this spec excludes the context, so `Demomodus` keeps its own `useState` and fetch for now.
