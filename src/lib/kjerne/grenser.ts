import { ANNONSE_MAKS, ANNONSE_MIN } from "@/lib/kontrakt/grenser";

export type AnnonseStatus = "tom" | "for_kort" | "for_lang" | "ok";

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
