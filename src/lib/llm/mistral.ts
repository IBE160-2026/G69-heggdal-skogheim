import "server-only";

import { createMistral } from "@ai-sdk/mistral";

import { analyseGapMed } from "./felles";
import type { LlmKlient } from "./klient";

export type Resonnering = "none" | "low";

// AD-8, NFR-4: Medium 3.5 og Large 4 er resonneringsmodeller. Uten innstilling
// resonnerer Large 4 med "high" og bruker over 45 s (kontrollen 2026-11-19).
// Laveste innsats hver modell tar imot (docs.mistral.ai, reasoning, lest 2026-11-19):
// Medium 3.5 tar imot "none", Large 4 bare "low", "medium" og "high".
// Aliasene er de `GET /v1/models` viste for modellene 2026-11-19 (Medium 3.5 =
// mistral-medium-2604, Large 4 = mistral-large-4-0). `mistral-large-latest` er ikke
// med: AI SDK 4.0.79 regner den som en modell uten resonnering og dropper
// innstillingen. Aliasene kan flytte seg til nye modeller, så tabellen må sjekkes
// når Mistral lanserer nye versjoner. Testsettet bruker de datobestemte navnene.
const RESONNERING: Record<string, Resonnering> = {
  "mistral-medium-2604": "none",
  "mistral-medium-3-5": "none",
  "mistral-medium-3.5": "none",
  "mistral-medium-3": "none",
  "mistral-medium-latest": "none",
  "mistral-medium": "none",
  "mistral-large-4-0": "low",
  "mistral-large-4": "low",
};

// Modellene som får en resonnering. Brukes av testene.
export const RESONNERING_MODELLER = Object.keys(RESONNERING);

// Resonneringen adapteren sender for modellen, eller `undefined` for andre modeller.
export function resonnering(modell: string): Resonnering | undefined {
  return RESONNERING[modell.trim().toLowerCase()];
}

// AD-3: Mistral med strikt JSON-skjema, og lav resonnering der modellen har det.
export function lagMistralKlient(apiKey: string, modell: string): LlmKlient {
  const mistral = createMistral({ apiKey });
  const innsats = resonnering(modell);

  return {
    analyseGap: (inndata) =>
      analyseGapMed(
        mistral(modell),
        {
          mistral: {
            strictJsonSchema: true,
            ...(innsats !== undefined && { reasoningEffort: innsats }),
          },
        },
        inndata,
      ),
  };
}
