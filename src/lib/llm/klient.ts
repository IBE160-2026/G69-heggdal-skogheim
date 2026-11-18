import "server-only";

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
};

export interface LlmKlient {
  analyseGap(inndata: GapInndata): Promise<LlmSvar>;
}

// Plassholder til de ekte adapterne kommer i story 2.3. Pipelinen gjør feilen om
// til `llm_feil`.
export const ekteKlient: LlmKlient = {
  async analyseGap() {
    throw new Error("Ekte adapter er ikke bygget ennå (story 2.3).");
  },
};
