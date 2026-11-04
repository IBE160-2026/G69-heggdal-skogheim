import { ESLint } from "eslint";
import { describe, expect, it } from "vitest";

const TIDSGRENSE_MS = 60_000;
const eslint = new ESLint();

async function erBlokkert(importSti: string, filePath: string) {
  const [resultat] = await eslint.lintText(`import "${importSti}";\n`, {
    filePath,
  });

  return resultat.messages.some(
    (melding) => melding.ruleId === "no-restricted-imports",
  );
}

describe("importgrenser", () => {
  it.each([
    ["@/lib/pipeline", "src/components/X.tsx"],
    ["@/lib/pipeline", "src/app/page.tsx"],
    ["@/lib/kjerne/grenser", "src/components/X.tsx"],
    ["@/lib/pipeline", "src/lib/okt/x.ts"],
    ["../pipeline", "src/lib/okt/x.ts"],
    ["@/lib/okt", "src/lib/kjerne/x.ts"],
    ["../okt", "src/lib/kjerne/x.ts"],
    ["@/lib/kjerne", "src/lib/kontrakt/x.ts"],
    ["../kjerne", "src/lib/kontrakt/x.ts"],
  ])(
    "AD-2: %s blokkeres i %s",
    async (importSti, filePath) => {
      await expect(erBlokkert(importSti, filePath)).resolves.toBe(true);
    },
    TIDSGRENSE_MS,
  );

  it.each([
    ["@/lib/pipeline", "src/app/api/x/route.ts"],
    ["@/lib/okt/tilstand", "src/components/X.tsx"],
    ["@/lib/kontrakt/status", "src/components/X.tsx"],
    ["@/lib/kjerne/grenser", "src/lib/okt/x.ts"],
    ["@/lib/kontrakt", "src/lib/kjerne/x.ts"],
    ["../kontrakt", "src/lib/kjerne/x.ts"],
    ["./annen", "src/lib/kontrakt/x.ts"],
  ])(
    "AD-2: %s godtas i %s",
    async (importSti, filePath) => {
      await expect(erBlokkert(importSti, filePath)).resolves.toBe(false);
    },
    TIDSGRENSE_MS,
  );
});
