import "server-only";

import { modell, nokkel, velgLeverandor } from "./leverandor";
import { lagMistralKlient } from "./mistral";
import { lagOpenAiKlient } from "./openai";

// AD-3: porten mot språkmodellen. Svaret er rått og ikke kontrollert. Pipelinen
// validerer det mot skjemaet og kontrollerer beleggene.
export type LlmSvar = {
  svar: unknown;
  inputTokens: number;
  outputTokens: number;
};

export type GapInndata = {
  // Den kanoniske (maskerte) CV-teksten (AD-13).
  cvTekst: string;
  annonse: string;
  // Avbryter kallet når requesten avbrytes eller tidsgrensen er nådd (AD-8).
  signal: AbortSignal;
};

export interface LlmKlient {
  analyseGap(inndata: GapInndata): Promise<LlmSvar>;
}

type Env = Record<string, string | undefined>;

// AD-3: `LLM_LEVERANDOR` (standard mistral) og `LLM_MODELL` velger adapteren. Valget
// er det samme som i `lagStatus`. Nøkkelen leses bare her og sendes aldri videre.
export function lagEkteKlient(env: Env): LlmKlient {
  const leverandor = velgLeverandor(env);
  const lag = leverandor === "openai" ? lagOpenAiKlient : lagMistralKlient;

  return lag(nokkel(env, leverandor), modell(env, leverandor));
}
