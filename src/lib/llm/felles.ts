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

// AD-3: lav temperatur, så svaret blir stabilt. Grensen er 0–0,3. Valgt 0 sammen med
// OpenAI gpt-4.1-mini (AD-11, 2026-11-19). Med 0 var kategoriene like i alle kjøringene,
// og ingen krav kom over fasiten. SM-1 er likevel ikke bestått, fordi par 3 har to krav
// under fasiten (vurdering-2-4-kontroll-temperatur-0.md). Verdien gjelder begge
// leverandørene. Mistral er bare målt med 0,2 (målerundene 1–5). Testene i
// adaptere.test.ts låser verdien.
export const TEMPERATUR = 0;

// Taket på utdata, så et svar som løper løpsk, ikke faktureres til tidsgrensen.
// Resonneringsmodeller teller resonnering som utdata, og et avkuttet svar gir
// `ugyldig_svar`. Vurdert 2026-11-20 etter målingene i story 2.4 og beholdt: med OpenAI
// gpt-4.1-mini og temperatur 0 var høyeste `outputTokens` 608 i 12 kjøringer på de fire
// testparene (vurdering-2-4-kontroll-temperatur-0.md). Testparene er mye kortere enn
// `ANNONSE_MAKS` (8000 tegn), og et lavere tak kan kutte svaret for en lang annonse med
// mange krav. Et svar som bruker hele taket, koster ca. 0,12 kr for utdata (15,50 kr per
// million tokens). Vurderes på nytt i epic 3, når brev, CV og ATS kommer.
export const MAKS_UTDATA_TOKENS = 8000;

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

// NFR-10: modellen leverandøren svarte med. Feltet tas bare med når den finnes.
function medVersjon(modelId: string | undefined): Pick<LlmSvar, "modellversjon"> {
  return modelId ? { modellversjon: modelId } : {};
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
      maxOutputTokens: MAKS_UTDATA_TOKENS,
      maxRetries: 0,
      abortSignal: signal,
      providerOptions,
    });

    return {
      svar: utenNull(resultat.output),
      inputTokens: resultat.usage.inputTokens ?? 0,
      outputTokens: resultat.usage.outputTokens ?? 0,
      ...medVersjon(resultat.response?.modelId),
    };
  } catch (feil) {
    if (NoObjectGeneratedError.isInstance(feil)) {
      return {
        svar: undefined,
        inputTokens: feil.usage?.inputTokens ?? 0,
        outputTokens: feil.usage?.outputTokens ?? 0,
        ...medVersjon(feil.response?.modelId),
      };
    }
    // Uten utdata fordi kallet ble avbrutt, er det et tidsavbrudd, ikke et ugyldig svar.
    if (NoOutputGeneratedError.isInstance(feil) && !signal?.aborted) {
      return { svar: undefined, inputTokens: 0, outputTokens: 0 };
    }
    throw feil;
  }
}
