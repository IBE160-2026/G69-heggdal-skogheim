import "server-only";

import { createOpenAI } from "@ai-sdk/openai";

import { analyseGapMed } from "./felles";
import type { LlmKlient } from "./klient";

// AD-3: OpenAI med strikt JSON-skjema (standard i adapteren, satt her for å være
// tydelig). NFR-1: `store: false`, så OpenAI ikke lagrer forespørselen og svaret
// (Responses API-et lagrer dem ellers som standard). Fant Sondre 2026-11-20.
// Logger for å oppdage misbruk kan OpenAI likevel beholde i opptil 30 dager.
// Med en resonneringsmodell i `LLM_MODELL` ber SDK-en da også om kryptert
// resonnering, som teller mot `MAKS_UTDATA_TOKENS`.
export const OPENAI_VALG = { openai: { strictJsonSchema: true, store: false } } as const;

export function lagOpenAiKlient(apiKey: string, modell: string): LlmKlient {
  const openai = createOpenAI({ apiKey });

  return {
    analyseGap: (inndata) => analyseGapMed(openai(modell), OPENAI_VALG, inndata),
  };
}
