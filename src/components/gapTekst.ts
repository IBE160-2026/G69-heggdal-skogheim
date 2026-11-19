import type { GapAnalyse, Kategori, Krav } from "@/lib/kontrakt/gap";

export const KATEGORINAVN: Record<Kategori, string> = {
  oppfylt: "Oppfylt",
  delvis: "Delvis oppfylt",
  mangler: "Mangler",
};

// FR-10: det faste rådet for et nedgradert krav, som ren tekst.
export const FAST_RAAD =
  "Fant ikke belegg for dette i CV-teksten. Har du denne erfaringen, trykk Endre CV-tekst og legg den inn.";

function kravSomTekst(krav: Krav): string[] {
  // Redigerte tekster kan ha mellomrom og linjeskift i endene. De tas bort i kopien.
  const linjer = [`${krav.tekst.trim()} — ${KATEGORINAVN[krav.kategori]}`];

  // FR-9: belegget til et nedgradert krav vises ikke, og kopieres heller ikke.
  if (!krav.nedgradert) {
    for (const sitat of krav.belegg) linjer.push(`Fra CV-en: «${sitat}»`);
  }
  const forklaring = krav.forklaring?.trim();
  if (krav.kategori === "delvis" && forklaring) {
    linjer.push(`Hvorfor delvis: ${forklaring}`);
  }
  if (krav.kategori === "mangler") {
    const raad = krav.nedgradert ? FAST_RAAD : krav.raad?.trim();
    if (raad) linjer.push(`Råd: ${raad}`);
  }

  return linjer;
}

// FR-20: gap-analysen som ren tekst til *Kopier*. Kravene står i annonsens rekkefølge
// med en tom linje mellom, og til slutt treffprosenten og nøkkelordene.
export function gapSomTekst(analyse: GapAnalyse): string {
  const funnet = analyse.nokkelord.filter((n) => n.funnet).map((n) => n.tekst);
  const ikkeFunnet = analyse.nokkelord
    .filter((n) => !n.funnet)
    .map((n) => n.tekst);

  const treff = [`Treff: ${analyse.treffprosent} % (veiledende)`];
  if (funnet.length > 0) treff.push(`Funnet i CV-en: ${funnet.join(", ")}`);
  if (ikkeFunnet.length > 0) treff.push(`Ikke funnet: ${ikkeFunnet.join(", ")}`);

  return [...analyse.krav.map(kravSomTekst), treff]
    .map((linjer) => linjer.join("\n"))
    .join("\n\n");
}
