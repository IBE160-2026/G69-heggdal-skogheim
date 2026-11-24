"use client";

import { Forberedelse } from "@/components/Forberedelse";
import { Resultat } from "@/components/Resultat";
import { useOkt } from "@/lib/okt/OktProvider";

// Ingen egen rute: resultatet vises når en kjøring finnes og visningen er resultatet
// (FR-3). Ingenting lagres, så en ny innlasting gir forberedelsen.
export default function Home() {
  const { tilstand } = useOkt();
  const { kjoring } = tilstand.innhold;

  return kjoring && tilstand.visning === "resultat" ? (
    <Resultat />
  ) : (
    <Forberedelse />
  );
}
