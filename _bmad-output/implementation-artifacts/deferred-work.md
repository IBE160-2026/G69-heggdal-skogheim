- source_spec: `_bmad-output/implementation-artifacts/spec-1-1-del-1-kjorbar-app-lokalt.md`
  summary: Story 1.1 del 2: publiser på Vercel-prosjektet g69-cv-assistent med regionen arn1 i vercel.json, legg https://g69-cv-assistent.vercel.app i README-en, sett nøkkelen bare i Production, og noter om runtime-loggene viser IP-adresser.
  evidence: Sondre valgte å dele story 1.1 i lokal app og publisering, slik at økten kan stoppe mellom delene.
- source_spec: `_bmad-output/implementation-artifacts/spec-1-2-forberedelsessiden.md`
  summary: Story 1.3 must also announce «Annonsen er for lang. Maks 8 000 tegn.» once in the live region when the limit is passed.
  evidence: UX-DR23 and `EXPERIENCE.md` require it, but the criteria for story 1.3 only name masking, so a screen reader user who pastes 9 000 characters hears nothing today.
- source_spec: `_bmad-output/implementation-artifacts/spec-1-2-forberedelsessiden.md`
  summary: Add a browser smoke test of the production build that covers `layout.tsx` and `page.tsx`, including the banner before the `h1`.
  evidence: No test renders them, and removing `<Demomodus />` from the layout keeps CI green. A unit test needs font mocks, and `next build` only catches a missing provider.
- source_spec: `_bmad-output/implementation-artifacts/spec-1-2-forberedelsessiden.md`
  summary: Story 2.6 must give non-default button variants a disabled look without opacity when it uses `aria-disabled` on *Generer på nytt*.
  evidence: This story removed `disabled:opacity-50` and only replaced it for the default variant, because no other variant has a disabled caller yet.
- source_spec: none
  summary: Story 5.2 must run `npm audit` again and take any safe updates for `minimatch` and `deepmerge`, without `--force`.
  evidence: The 21 findings on 2026-11-04 come from these two packages through ESLint and `shadcn`, and `npm audit fix` changes nothing today.
