import "server-only";

// AD-3: valget av leverandør. Status og adapter bruker samme valg, så banneret og
// personvernboksen alltid viser leverandøren som faktisk får teksten.
export type Leverandor = "mistral" | "openai";

export const NOKKEL_VARIABEL: Record<Leverandor, string> = {
  mistral: "MISTRAL_API_KEY",
  openai: "OPENAI_API_KEY",
};

// Standardmodellene når `LLM_MODELL` mangler. Story 2.4 valgte OpenAI gpt-4.1-mini (AD-11,
// 2026-11-19). Produksjonen setter `LLM_LEVERANDOR=openai` og `LLM_MODELL` i Vercel (del C).
// Mistral er fortsatt standard når `LLM_LEVERANDOR` mangler (AD-3).
export const STANDARD_MODELL: Record<Leverandor, string> = {
  mistral: "mistral-medium-latest",
  openai: "gpt-4.1-mini",
};

type Env = Record<string, string | undefined>;

// Ukjent eller tom `LLM_LEVERANDOR` gir Mistral.
export function velgLeverandor(env: Env): Leverandor {
  const navn = env.LLM_LEVERANDOR?.trim().toLowerCase();
  return navn === "openai" ? "openai" : "mistral";
}

export function nokkel(env: Env, leverandor: Leverandor): string {
  return env[NOKKEL_VARIABEL[leverandor]]?.trim() ?? "";
}

export function modell(env: Env, leverandor: Leverandor): string {
  return env.LLM_MODELL?.trim() || STANDARD_MODELL[leverandor];
}
