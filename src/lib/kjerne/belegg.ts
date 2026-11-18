import type { Krav, KravSvar } from "@/lib/kontrakt/gap";

import { ER_IKKE_MED, normaliser } from "./demo";

export type KontrollertKrav = { krav: Krav[]; fjernetBelegg: number };

// FR-9: et belegg må ha minst så mange tegn etter normalisering, så ord som «og»
// og «er» ikke kan dokumentere et krav.
export const BELEGG_MIN_TEGN = 4;

const ORDTEGN = /[\p{L}\p{N}]/u;

type IndeksertCv = {
  // CV-teksten normalisert som i `normaliser`.
  tekst: string;
  // For hvert tegn i `tekst`: om det står en ordgrense rett før og rett etter.
  grenseFor: boolean[];
  grenseEtter: boolean[];
};

// Normaliserer CV-teksten tegn for tegn og husker hvor ordene begynner og slutter.
// Det er en ordgrense mellom to tegn når normaliseringen fjernet noe mellom dem
// (mellomrom, linjeskift, bindestrek …), eller når ett av dem ikke er en bokstav
// eller et tall.
function indekser(cvTekst: string): IndeksertCv {
  const s = cvTekst.normalize("NFC").toLowerCase();
  const tegn: string[] = [];
  const pos: number[] = [];
  for (let i = 0; i < s.length; i++) {
    if (!ER_IKKE_MED.test(s[i])) {
      tegn.push(s[i]);
      pos.push(i);
    }
  }

  const grense = (a: number, b: number) =>
    pos[b] - pos[a] > 1 || !ORDTEGN.test(tegn[a]) || !ORDTEGN.test(tegn[b]);
  const grenseFor = tegn.map((_, k) => k === 0 || grense(k - 1, k));
  const grenseEtter = tegn.map((_, k) => k === tegn.length - 1 || grense(k, k + 1));

  return { tekst: tegn.join(""), grenseFor, grenseEtter };
}

// FR-9 (addendum D0): belegget står ordrett i CV-teksten etter normalisering,
// begynner og slutter på en ordgrense der, og har minst BELEGG_MIN_TEGN tegn.
function erGyldig(belegg: string, cv: IndeksertCv): boolean {
  const n = normaliser(belegg);
  if (n.length < BELEGG_MIN_TEGN) return false;

  for (let i = cv.tekst.indexOf(n); i !== -1; i = cv.tekst.indexOf(n, i + 1)) {
    if (cv.grenseFor[i] && cv.grenseEtter[i + n.length - 1]) return true;
  }
  return false;
}

// FR-9, AD-14: belegg uten treff fjernes og telles. Et krav som ikke er `mangler` og
// står uten gyldig belegg, blir `mangler` med `nedgradert`.
export function kontrollerKrav(
  krav: readonly KravSvar[],
  cvTekst: string,
): KontrollertKrav {
  const cv = indekser(cvTekst);
  let fjernetBelegg = 0;

  const kontrollert = krav.map((k): Krav => {
    // Et krav som mangler, har ingen belegg. De er ikke ugyldige og telles ikke.
    if (k.kategori === "mangler") return { ...k, belegg: [], nedgradert: false };

    const gyldige = k.belegg.filter((b) => erGyldig(b, cv));
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
