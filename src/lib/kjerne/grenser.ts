import { ANNONSE_MAKS, ANNONSE_MIN, CV_MAKS } from "@/lib/kontrakt/grenser";

export type AnnonseStatus = "tom" | "for_kort" | "for_lang" | "ok";

// CV-teksten har ingen nedre grense. Under 300 tegn gir bare et varsel (FR-3).
export type CvStatus = "tom" | "for_lang" | "ok";

export function tegnAntall(tekst: string): number {
  return tekst.trim().length;
}

export function annonseStatus(tekst: string): AnnonseStatus {
  const antall = tegnAntall(tekst);

  if (antall === 0) return "tom";
  if (antall < ANNONSE_MIN) return "for_kort";
  if (antall > ANNONSE_MAKS) return "for_lang";
  return "ok";
}

export function cvStatus(tekst: string): CvStatus {
  const antall = tegnAntall(tekst);

  if (antall === 0) return "tom";
  if (antall > CV_MAKS) return "for_lang";
  return "ok";
}
