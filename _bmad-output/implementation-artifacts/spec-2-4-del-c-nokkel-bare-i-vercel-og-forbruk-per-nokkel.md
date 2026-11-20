---
title: 'Story 2.4 del C: the production key is only in Vercel, and OpenAI usage can be filtered per API key'
type: 'chore'
created: '2026-11-20'
status: 'done'
route: 'oneshot'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/implementation-artifacts/kjorebok-2-4-del-c.md'
  - '{project-root}/_bmad-output/implementation-artifacts/sjekkliste-2-4-c3-sondre.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The documents on `main` say that Sondre keeps the production key in a password manager (recorded on 2026-11-20 as Kevin's decision). They also say that the usage in production cannot be read on its own. Sondre has since confirmed two things, passed on by Kevin on 2026-11-20:
- The production key (`produksjon-vercel-2`) is stored **only in Vercel**.
- OpenAI usage **can be filtered per API key**, so no separate project is needed.

**Approach:** Correct the runbook, the C3 checklist, the C3/C4 PR draft and `issues.md`:
- The key is only in Vercel, which replaces the password-manager wording.
- Usage can be filtered per key.
- Close the open item about reading production usage on its own before 2.8, because a separate project is not needed.
- Keep it noted that the C4 usage confirmation was done at week level, with the deviation accepted by Kevin.

**Rules:**
- No code.
- No Vercel, key or usage changes.
- No paid calls.

</frozen-after-approval>

## Implementation Notes

- Historical session logs are not rewritten. The current session log records the correction.
- **Files:**
  - `kjorebok-2-4-del-c.md` (C3 step 1, the incident, C4 status, the deviation text and the lesson)
  - `sjekkliste-2-4-c3-sondre.md` (the storage banner, steps 1, 5 and 7)
  - correction banners in `pr-2-4-del-c.md` and `pr-2-4-del-c-kontroll.md`
  - `.logs/kevin-heggdal/issues.md`
- **Verification:** grep for «passordbehandler», «per nøkkel» and «eget prosjekt» outside historical logs, plus the checks listed in the SM-1 spec. The review is shared with `spec-2-4-sm-1-fasit-par-3-samarbeid.md`.
