import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const relativImport = (navn) =>
  `^(\.\./)+(lib/)?(${navn.join("|")})(/|$)`;

const forbudteImporter = (patterns) => ({
  "no-restricted-imports": [
    "error",
    {
      patterns: patterns.map((regex) => ({
        regex,
        message: "Importen bryter avhengighetsretningen (AD-2).",
      })),
    },
  ],
});

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // AD-2: UI-et når serverlagene, kjernen og pdfjs-dist bare via lib/okt og
    // API-rutene.
    files: ["src/components/**", "src/app/**"],
    ignores: ["src/app/api/**"],
    rules: forbudteImporter([
      "(^|/)lib/(llm|pipeline|kjerne|innlesing)(/|$)",
      "^pdfjs-dist(/|$)",
    ]),
  },
  {
    files: ["src/lib/okt/**"],
    rules: forbudteImporter([
      "^@/lib/(llm|pipeline)(/|$)",
      relativImport(["llm", "pipeline"]),
    ]),
  },
  {
    // Kjernen kan bare importere kontrakt fra appen.
    files: ["src/lib/kjerne/**"],
    rules: forbudteImporter([
      "^@/(?!lib/(kjerne|kontrakt)(/|$))",
      relativImport([
        "okt",
        "innlesing",
        "llm",
        "pipeline",
        "utils",
        "components",
        "app",
      ]),
    ]),
  },
  {
    // Kontrakten importerer ingenting annet fra appen.
    files: ["src/lib/kontrakt/**"],
    rules: forbudteImporter([
      "^@/(?!lib/kontrakt(/|$))",
      relativImport([
        "kjerne",
        "okt",
        "innlesing",
        "llm",
        "pipeline",
        "utils",
        "components",
        "app",
      ]),
    ]),
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Prosjektfiler som ikke er appkode:
    ".claude/**",
    "_bmad/**",
    "_bmad-output/**",
  ]),
]);

export default eslintConfig;
