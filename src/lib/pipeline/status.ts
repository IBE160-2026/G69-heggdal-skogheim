import "server-only";

import type { StatusSvar } from "@/lib/kontrakt/status";
import { type Leverandor, nokkel, velgLeverandor } from "@/lib/llm/leverandor";

const LEVERANDORER: Record<Leverandor, StatusSvar["leverandor"]> = {
  mistral: { navn: "Mistral AI", land: "Frankrike", tredjeland: false },
  openai: { navn: "OpenAI", land: "USA", tredjeland: true },
};

export function lagStatus(env: Record<string, string | undefined>): StatusSvar {
  const leverandor = velgLeverandor(env);

  return {
    modus: nokkel(env, leverandor) ? "ekte" : "demo",
    leverandor: LEVERANDORER[leverandor],
  };
}
