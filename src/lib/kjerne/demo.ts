import { DEMO_ANNONSE, DEMO_CV } from "@/lib/kontrakt/demo";

import { masker } from "./masker";

// FR-9: store og små bokstaver, mellomrom og linjeskift regnes ikke med.
export function normaliser(tekst: string): string {
  return tekst.normalize("NFC").toLowerCase().replace(/\s+/gu, "");
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
