import type { LeverandorInfo } from "@/lib/kontrakt/status";

export function overforingstekst(leverandor: LeverandorInfo | null): string {
  if (!leverandor) return "CV-teksten sendes til en ekstern språkmodell.";

  const sendes = `CV-teksten sendes til ${leverandor.navn} i ${leverandor.land}.`;

  return leverandor.tredjeland
    ? `${sendes} Det betyr at opplysningene overføres ut av EØS.`
    : sendes;
}
