import { z } from "zod";

import { gapGrunnlag } from "./gap";

// AD-5: `POST /api/generer/[resultatdel]`.
export const resultatdel = z.enum(["gap", "brev", "cv", "ats"]);

export const genererBody = z.object({
  cvTekst: z.string(),
  annonse: z.string(),
  demo: z.boolean().optional(),
  gap: gapGrunnlag.optional(),
});

export type Resultatdel = z.infer<typeof resultatdel>;
export type GenererBody = z.infer<typeof genererBody>;
