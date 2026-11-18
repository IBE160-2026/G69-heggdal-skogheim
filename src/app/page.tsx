"use client";

import { Forberedelse } from "@/components/Forberedelse";
import { Resultat } from "@/components/Resultat";
import { useOkt } from "@/lib/okt/OktProvider";

// Ingen egen rute: resultatet vises når en kjøring finnes. Ingenting lagres, så en ny
// innlasting gir forberedelsen.
export default function Home() {
  const { kjoring } = useOkt().tilstand.innhold;

  return kjoring ? <Resultat /> : <Forberedelse />;
}
