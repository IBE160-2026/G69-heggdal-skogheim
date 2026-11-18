import { DEMO_ANNONSE, DEMO_CV } from "@/lib/kontrakt/demo";

import { masker } from "./masker";

// FR-9 (addendum D0): store og små bokstaver, mellomrom, linjeskift, listetegn,
// bindestreker, tankestreker, anførselstegn og apostrofer regnes ikke med.
// [ANTAKELSE] Alle bindestreker fjernes, ikke bare den ved linjeskift.
const IKKE_MED = /[\s•▪‣◦*\-‐–—«»"“”„'‘’]+/gu;

export function normaliser(tekst: string): string {
  return tekst.normalize("NFC").toLowerCase().replace(IKKE_MED, "");
}

const DEMO_CV_NORMALISERT = normaliser(masker(DEMO_CV));
const DEMO_ANNONSE_NORMALISERT = normaliser(masker(DEMO_ANNONSE));

// AD-13: sann bare når både CV-teksten og annonsen er demoeksempelet.
export function erDemoeksempel(cvTekst: string, annonse: string): boolean {
  return (
    normaliser(masker(cvTekst)) === DEMO_CV_NORMALISERT &&
    normaliser(masker(annonse)) === DEMO_ANNONSE_NORMALISERT
  );
}
