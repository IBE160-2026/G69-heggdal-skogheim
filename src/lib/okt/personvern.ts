import type { LeverandorInfo } from "@/lib/kontrakt/status";

export function overforingstekst(leverandor: LeverandorInfo | null): string {
  if (!leverandor) return "CV-teksten sendes til en ekstern språkmodell.";

  const sendes = `CV-teksten sendes til ${leverandor.navn} i ${leverandor.land}.`;

  return leverandor.tredjeland
    ? `${sendes} Det betyr at opplysningene overføres ut av EØS.`
    : sendes;
}

export function lagringstekst(leverandor: LeverandorInfo | null): string {
  const hvem = leverandor ? leverandor.navn : "Språkmodellen";

  return `Appen lagrer ingenting, og alt er borte når du lukker fanen. ${hvem} kan likevel beholde teksten i opptil 30 dager for å oppdage misbruk.`;
}
