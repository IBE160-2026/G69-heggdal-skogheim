import { z } from "zod";

export const modus = z.enum(["ekte", "demo"]);

export const leverandorInfo = z.object({
  navn: z.string(),
  land: z.string(),
  tredjeland: z.boolean(),
});

export const statusSvar = z.object({
  modus,
  leverandor: leverandorInfo,
});

export type Modus = z.infer<typeof modus>;
export type LeverandorInfo = z.infer<typeof leverandorInfo>;
export type StatusSvar = z.infer<typeof statusSvar>;
