# Review: currency and reality check of ARCHITECTURE-SPINE.md

- **Lens:** Was every committed decision checked against the web, the registry or the starter, rather than taken from training data?
- **Reviewed:** `ARCHITECTURE-SPINE.md` and `.memlog.md` (both dated 2026-11-03)
- **Date:** 2026-11-03
- **Method:** I queried registry.npmjs.org with curl for dist-tags, peerDependencies and engines of every pinned version. I downloaded and read the tarballs for `create-next-app@16.4.4`, `shadcn@4.23.0`, `pdfjs-dist@6.5.438` and `server-only@0.0.1`. I read the live docs at nextjs.org, ai-sdk.dev, vercel.com and ui.shadcn.com. No Node is installed, so nothing was run.

## Verdict

**Pass with required fixes.** Every version in the Stack table matches npm `latest` on 2026-11-03. The memlog shows that registry check, so the version numbers themselves are current. The registry check did not cover compatibility between packages or the live defaults of the starter. Two of those gaps break setup on day one:

- TypeScript 7.0.2 conflicts with the ESLint toolchain that create-next-app installs.
- create-next-app will not run in the repo root, and its defaults differ from what the spine assumes.

Three more gaps would cause early friction: `server-only` in Vitest, the Base UI default in shadcn, and the pdfjs worker under Turbopack.

## What was confirmed

| Claim in the spine | Status | Evidence |
| --- | --- | --- |
| next 16.4.4, react 19.3.1, tailwindcss 4.3.4, shadcn 4.23.0, ai 7.0.162, @ai-sdk/mistral 4.0.79, @ai-sdk/openai 4.0.108, zod 4.6.7, pdfjs-dist 6.5.438, mammoth 1.13.0, vitest 5.1.0, typescript 7.0.2 | All are `latest` today | registry dist-tags |
| zod 4.x works with ai 7 | Yes | `ai@7.0.162`, `@ai-sdk/mistral@4.0.79` and `@ai-sdk/openai@4.0.108` all declare peer `zod: ^3.25.76 \|\| ^4.1.8`, and 4.6.7 satisfies it |
| Mistral supports structured output with a zod schema | Yes | ai-sdk.dev Mistral provider page: "Mistral chat models support structured outputs using JSON Schema". `structuredOutputs` defaults to `true` and `strictJsonSchema` defaults to `false` |
| Node 24 for ai 7, vitest 5 and pdfjs 6 | Yes | engines: ai `>=22`, vitest `^22.12 \|\| ^24 \|\| >=26`, pdfjs-dist `>=22.13.0 \|\| >=24`, next `>=20.9.0` |
| React 19.3.1 with Next 16.4.4 | Yes | next peer `react ^18.2.0 \|\| ^19.0.0` |
| Next 16 builds with TypeScript 7 | Yes for `next build` | nextjs.org TypeScript docs: Next.js uses the project-local `tsc` CLI by default, so TS 7 works without config. Lint does not work: see F1 |
| `maxDuration` 60 s on Hobby | Yes | Vercel duration docs: with Fluid compute, Hobby has a default and maximum of 300 s, so 60 s is allowed |
| One EU region, `fra1` or `arn1`, on Hobby | Yes | Vercel region docs: Hobby gets a "Single region", and the region list contains both `fra1` and `arn1`. The default for new projects is `iad1` (USA), so `vercel.json` `regions` must be set |
| `server-only` is still the recommended guard | Yes | nextjs.org "Preventing environment poisoning" still recommends it. Installing the package is now optional because Next handles the import internally. The package is still `0.0.1` |
| AI SDK 7 structured-output API | Not named in the spine | ai-sdk.dev documents `generateText({ output: Output.object({ schema }) })`. `generateObject` has been deprecated since v6. The v7 guide removes `experimental_output` and renames `system` to `instructions` |
| pdfjs-dist 6 has a legacy build for Node | Yes | The tarball ships `legacy/build/pdf.mjs` and `legacy/build/pdf.worker.mjs` |
| Vitest 5 with Next | Works | The nextjs.org Vitest guide is current. `@vitejs/plugin-react@6.2.1` has peer `vite ^8.0.0`, vite latest is 8.3.5, and vitest 5 accepts vite 6, 7 or 8 |

## Findings

### F1 [high]: TypeScript 7.0.2 breaks ESLint, and create-next-app does not install it

Three facts were checked:

- `typescript@7.0.2` is the native Go compiler. Its package `exports["."]` is only `./lib/version.cjs`, with no classic compiler API, just `./unstable/*`.
- `eslint-config-next@16.4.4`, which create-next-app installs with `--eslint` (the spine's starter), depends on `typescript-eslint ^8.56.0`. The latest `typescript-eslint@8.72.1` declares peer `typescript: ">=4.8.4 <6.1.0"`.
- typescript-eslint issue #12518 and several Renovate PRs report `npm ci` failing with ERESOLVE on TS 7. Forcing the install with `--legacy-peer-deps` makes ESLint crash in `@typescript-eslint/typescript-estree`.

`create-next-app@16.4.4` writes `typescript: "^5"` into `package.json`, which resolves to 5.9.3. The starter therefore never installs 7.0.2. The spine's version came from `latest` in the registry, not from what the starter installs.

The memlog shows no compatibility check. `next build` itself works with TS 7 (the nextjs.org docs say the `tsc` CLI is the default), but the lint step does not.

**Fix:** In the Stack table, change TypeScript to `5.9.x`, which is the create-next-app default. `6.0.3` would also work, because it is inside typescript-eslint's `<6.1.0` range. Add one line under Utsatt: "TypeScript 7 when typescript-eslint widens its peer range."

### F2 [high]: create-next-app refuses to run in the repo root, and its live defaults differ from the spine

From the `create-next-app@16.4.4` source:

- **Repo root.** `isFolderEmpty()` accepts only `.claude`, `.git`, `.gitignore`, `docs`, `LICENSE` and a few others. The repo root also contains `CLAUDE.md`, `README.md`, `_bmad/`, `_bmad-output/`, `testdata/` and `.logs/`, so the CLI exits with "contains files that could conflict".
- **Recommended defaults.** Pressing Enter gives `srcDir: false`, `cacheComponents: true`, `agentsMd: true` and `reactCompiler: false`.
  - The spine requires `src/`. It never mentions Cache Components or AGENTS.md.
  - With Cache Components on, a `GET` route handler that reads no request data is prerendered at build time (nextjs.org Route Handlers, "With Cache Components"). `GET /api/status` reads only `process.env`, so `modus` would be baked in at build. It is right per environment only by coincidence, and it goes stale if the key changes without a redeploy.
  - With `agentsMd`, the CLI writes an `AGENTS.md` with a `nextjs-agent-rules` block, which "is written and re-added by `next dev`". That collides with the repo's `CLAUDE.md` and the bmad-project-context AGENTS.md block.

**Fix:** Pin the exact command in the spine, run it in a temporary folder, and move the result into the repo root:

```
npx create-next-app@16.4.4 app-tmp --ts --app --src-dir --tailwind --eslint \
  --import-alias "@/*" --use-npm --disable-git --no-react-compiler \
  --no-cache-components --agents-md
```

Then add one rule to AD-1: "`/api/status` calls `await connection()`, or Cache Components is off." Decide explicitly whether to keep the generated AGENTS.md block next to CLAUDE.md. Either `--agents-md` or `--no-agents-md` is fine, but choose one.

### F3 [medium]: `import 'server-only'` throws in Vitest, so the NFR-6 pipeline tests fail

`server-only@0.0.1` maps `default` to `index.js`, which is `throw new Error("This module cannot be imported from a Client Component module...")`. Only the `react-server` condition maps to `empty.js`.

AD-2 puts `import 'server-only'` at the top of `lib/llm` and `lib/pipeline`. The spine's Vitest tests import the pipeline with the mock adapter. Under Vitest's normal Node resolution, every such test crashes on import.

**Fix:** Add a line to the Tester convention: "`vitest.config.mts` aliases `server-only` to `node_modules/server-only/empty.js`." `vi.mock('server-only', () => ({}))` in a setup file also works.

### F4 [medium]: shadcn 4 defaults to Base UI, but the UX spec assumes Radix

The `shadcn@4.23.0` CLI has `-b, --base <base>` with the choices `base`, `radix` and `aria`. `-d, --defaults` means `--template=next --preset=base-nova`, which is Base UI.

The UX memlog and the accessibility review rely on Radix behaviour (for example `AlertDialogDescription`, and NFR-8 coming "almost for free" from Radix).

The spine only says "followed by `shadcn init`", so whoever runs it may pick Base UI and get a different component API than the UX spec.

**Fix:** In the Starter line, write `npx shadcn@4.23.0 init -t next -b radix`, and name the preset if DESIGN.md depends on one.

### F5 [medium]: The pdfjs-dist 6 setup for browser, Turbopack and Node is not specified

AD-7 says PDF is read with pdfjs-dist and that the functions are pure and testable in Node. It says nothing about how the worker is loaded.

- Next 16 uses Turbopack for both dev and build.
- The `new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url)` pattern had a Turbopack regression in 16.2.x that was later fixed (Next commit cb96548), and pdfjs's `webpackIgnore` comments are not understood by Turbopack.
- In Node and Vitest, pdfjs recommends the `legacy/build/pdf.mjs` entry. The legacy build is still in 6.5.438.

None of this was checked in the memlog.

**Fix:** Add a rule to AD-7:

- The browser sets `GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString()` in one client-only module.
- The pure function takes the `getDocument` function as a parameter, so tests can pass `pdfjs-dist/legacy/build/pdf.mjs`.
- The first innlesing story must prove `next build` plus a PDF upload on 16.4.4.

### F6 [low]: Smaller currency gaps

- **Node rationale is stale.** The memlog says Vercel documents "only 24.x (standard), 22.x, 20.x". The live page lists **26.x (default)**, 24.x and 22.x, and Node 20 was deprecated on Vercel on 2026-10-01. The decision for Node 24 still holds, and `engines.node: "24.x"` is now needed to override the 26.x default. **Fix:** correct the memlog line. Optionally note that 26 is an option.
- **AI SDK call shape is not named.** AD-3 says "AI SDK with structured output (zod)" without naming the API. **Fix:**
  - Name `generateText` + `Output.object({ schema })`, not the deprecated `generateObject`.
  - Use `instructions` for the system prompt (renamed in v7).
  - Log `usage.inputTokens` and `usage.outputTokens` for AD-10.
  - Set Mistral `providerOptions.mistral.strictJsonSchema: true`, because it defaults to `false`. zod still validates in the pipeline.
- **`@types/node` mismatch.** create-next-app writes `@types/node: "^20"`, but the spine says Node 24. **Fix:** bump to `^24` after scaffolding. vitest 5 accepts `^22 || >=24`.
- **Vitest setup.** The Next Vitest guide still uses `vite-tsconfig-paths`. Vite 8 can resolve tsconfig paths natively. This is optional and not blocking.

## Sources

- npm registry, queried with curl on 2026-11-03: https://registry.npmjs.org/typescript, https://registry.npmjs.org/typescript-eslint, https://registry.npmjs.org/eslint-config-next/16.4.4, https://registry.npmjs.org/ai/7.0.162, https://registry.npmjs.org/@ai-sdk/mistral/4.0.79, https://registry.npmjs.org/vitest/5.1.0, https://registry.npmjs.org/@vitejs/plugin-react/6.2.1, https://registry.npmjs.org/pdfjs-dist/-/pdfjs-dist-6.5.438.tgz, https://registry.npmjs.org/create-next-app/-/create-next-app-16.4.4.tgz, https://registry.npmjs.org/shadcn/-/shadcn-4.23.0.tgz, https://registry.npmjs.org/server-only/-/server-only-0.0.1.tgz
- https://nextjs.org/docs/app/api-reference/config/typescript (Using TypeScript 7)
- https://nextjs.org/docs/app/getting-started/route-handlers (With Cache Components)
- https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents
- https://nextjs.org/docs/app/getting-started/server-and-client-components (Preventing environment poisoning)
- https://nextjs.org/docs/app/guides/testing/vitest
- https://github.com/typescript-eslint/typescript-eslint/issues/12518
- https://github.com/vercel/next.js/pull/96110
- https://ai-sdk.dev/docs/migration-guides/migration-guide-7-0
- https://ai-sdk.dev/docs/ai-sdk-core/generating-structured-data
- https://ai-sdk.dev/providers/ai-sdk-providers/mistral
- https://ai-sdk.dev/docs/migration-guides/migration-guide-6-0
- https://vercel.com/docs/functions/configuring-functions/duration
- https://vercel.com/docs/functions/configuring-functions/region
- https://vercel.com/docs/regions
- https://vercel.com/docs/functions/runtimes/node-js/node-js-versions
- https://ui.shadcn.com/docs/installation/next
- https://app.semanticdiff.com/gh/vercel/next.js/commit/cb96548418cb856cf91d2bdda2083f5bd1e9611b (Turbopack worker URL fix)
