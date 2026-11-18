import type { Krav, KravSvar } from "@/lib/kontrakt/gap";

import { normaliser } from "./demo";

export type KontrollertKrav = { krav: Krav[]; fjernetBelegg: number };

// FR-9, AD-14: et belegg er gyldig når det normaliserte belegget ikke er tomt og står
// ordrett i den normaliserte CV-teksten. Belegg uten treff fjernes og telles. Et krav
// som ikke er `mangler` og står uten gyldig belegg, blir `mangler` med `nedgradert`.
export function kontrollerKrav(
  krav: readonly KravSvar[],
  cvTekst: string,
): KontrollertKrav {
  const cv = normaliser(cvTekst);
  let fjernetBelegg = 0;

  const kontrollert = krav.map((k): Krav => {
    // Et krav som mangler, har ingen belegg. De er ikke ugyldige og telles ikke.
    if (k.kategori === "mangler") return { ...k, belegg: [], nedgradert: false };

    const gyldige = k.belegg.filter((b) => {
      const n = normaliser(b);
      return n.length > 0 && cv.includes(n);
    });
    fjernetBelegg += k.belegg.length - gyldige.length;

    if (gyldige.length === 0) {
      // «Hvorfor delvis» er feil når kravet er nedgradert, så forklaringen fjernes.
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { forklaring, ...resten } = k;
      return { ...resten, kategori: "mangler", belegg: [], nedgradert: true };
    }

    return { ...k, belegg: gyldige, nedgradert: false };
  });

  return { krav: kontrollert, fjernetBelegg };
}
