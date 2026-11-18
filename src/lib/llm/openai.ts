import "server-only";

import { createOpenAI } from "@ai-sdk/openai";

import { analyseGapMed } from "./felles";
import type { LlmKlient } from "./klient";

// AD-3: OpenAI med strikt JSON-skjema (standard i adapteren, satt her for å være
// tydelig).
export function lagOpenAiKlient(apiKey: string, modell: string): LlmKlient {
  const openai = createOpenAI({ apiKey });

  return {
    analyseGap: (inndata) =>
      analyseGapMed(openai(modell), { openai: { strictJsonSchema: true } }, inndata),
  };
}
