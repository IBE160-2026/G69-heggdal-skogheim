import "server-only";

import type { StatusSvar } from "@/lib/kontrakt/status";

const LEVERANDORER = new Map([
  [
    "mistral",
    {
      nokkelVariabel: "MISTRAL_API_KEY",
      info: { navn: "Mistral AI", land: "Frankrike", tredjeland: false },
    },
  ],
  [
    "openai",
    {
      nokkelVariabel: "OPENAI_API_KEY",
      info: { navn: "OpenAI", land: "USA", tredjeland: true },
    },
  ],
]);

const STANDARD_LEVERANDOR = LEVERANDORER.get("mistral")!;

export function lagStatus(env: Record<string, string | undefined>): StatusSvar {
  const leverandor =
    LEVERANDORER.get(env.LLM_LEVERANDOR?.trim().toLowerCase() ?? "") ?? STANDARD_LEVERANDOR;
  const harNokkel = Boolean(env[leverandor.nokkelVariabel]?.trim());

  return {
    modus: harNokkel ? "ekte" : "demo",
    leverandor: leverandor.info,
  };
}
