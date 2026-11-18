import "server-only";

import {
  generateText,
  type LanguageModel,
  NoObjectGeneratedError,
  NoOutputGeneratedError,
  Output,
} from "ai";
import { z } from "zod";

import { kategori, nokkelordSvar } from "@/lib/kontrakt/gap";

import type { GapInndata, LlmSvar } from "./klient";
import { GAP_INSTRUKS, gapBrukermelding } from "./prompter/gap";

// AD-3: lav temperatur, så svaret blir stabilt. Grensen er 0–0,3.
export const TEMPERATUR = 0.2;

// Skjemaet modellen får. Strikt JSON-skjema krever at alle felt finnes, så
// `forklaring` og `raad` er `nullable` her og blir gjort om til `undefined` før
// pipelinen validerer svaret mot `gapSvar`. Grensene sjekkes i pipelinen (AD-4).
export const gapModellSkjema = z.object({
  stilling: z.string(),
  arbeidsgiver: z.string(),
  krav: z.array(
    z.object({
      tekst: z.string(),
      kategori,
      belegg: z.array(z.string()),
      forklaring: z.string().nullable(),
      raad: z.string().nullable(),
    }),
  ),
  nokkelord: z.array(nokkelordSvar),
});

type GapModellSvar = z.infer<typeof gapModellSkjema>;

function utenNull(svar: GapModellSvar) {
  return {
    ...svar,
    krav: svar.krav.map(({ forklaring, raad, ...krav }) => ({
      ...krav,
      ...(forklaring !== null && { forklaring }),
      ...(raad !== null && { raad }),
    })),
  };
}

type ProviderOptions = Parameters<typeof generateText>[0]["providerOptions"];

// Felles kall for begge adapterne. Et svar utenfor skjemaet gir `svar: undefined`,
// så pipelinen svarer `ugyldig_svar` og logger tokenene. Andre feil kastes videre.
export async function analyseGapMed(
  model: LanguageModel,
  providerOptions: ProviderOptions,
  { cvTekst, annonse, signal }: GapInndata,
): Promise<LlmSvar> {
  try {
    const resultat = await generateText({
      model,
      instructions: GAP_INSTRUKS,
      prompt: gapBrukermelding(cvTekst, annonse),
      output: Output.object({ schema: gapModellSkjema, name: "gap_analyse" }),
      temperature: TEMPERATUR,
      maxRetries: 0,
      abortSignal: signal,
      providerOptions,
    });

    return {
      svar: utenNull(resultat.output),
      inputTokens: resultat.usage.inputTokens ?? 0,
      outputTokens: resultat.usage.outputTokens ?? 0,
    };
  } catch (feil) {
    if (NoObjectGeneratedError.isInstance(feil)) {
      return {
        svar: undefined,
        inputTokens: feil.usage?.inputTokens ?? 0,
        outputTokens: feil.usage?.outputTokens ?? 0,
      };
    }
    // Uten utdata fordi kallet ble avbrutt, er det et tidsavbrudd, ikke et ugyldig svar.
    if (NoOutputGeneratedError.isInstance(feil) && !signal?.aborted) {
      return { svar: undefined, inputTokens: 0, outputTokens: 0 };
    }
    throw feil;
  }
}
