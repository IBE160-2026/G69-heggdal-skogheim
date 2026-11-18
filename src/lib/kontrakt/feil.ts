import { z } from "zod";

// AD-8: API-feil er HTTP-status pluss `{ feil: { kode } }`.
export const feilkode = z.enum([
  "ugyldig_inndata",
  "for_lang_tekst",
  "for_kort_tekst",
  "grense_naadd",
  "llm_feil",
  "llm_tidsavbrudd",
  "ugyldig_svar",
  "demo_krever_nokkel",
]);

export type Feilkode = z.infer<typeof feilkode>;

export const FEIL_STATUS: Record<Feilkode, number> = {
  ugyldig_inndata: 400,
  for_lang_tekst: 413,
  for_kort_tekst: 400,
  grense_naadd: 429,
  llm_feil: 502,
  llm_tidsavbrudd: 504,
  ugyldig_svar: 502,
  demo_krever_nokkel: 403,
};

export const feilSvar = z.object({ feil: z.object({ kode: feilkode }) });

export type FeilSvar = z.infer<typeof feilSvar>;
