import "server-only";

import { createMistral } from "@ai-sdk/mistral";

import { analyseGapMed } from "./felles";
import type { LlmKlient } from "./klient";

// AD-3: Mistral med strikt JSON-skjema.
export function lagMistralKlient(apiKey: string, modell: string): LlmKlient {
  const mistral = createMistral({ apiKey });

  return {
    analyseGap: (inndata) =>
      analyseGapMed(
        mistral(modell),
        { mistral: { strictJsonSchema: true } },
        inndata,
      ),
  };
}
