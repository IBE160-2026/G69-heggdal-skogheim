import type { Nokkelord, NokkelordSvar } from "@/lib/kontrakt/gap";

// FR-12 (addendum D): små bokstaver, tegnsetting og bindestrek blir mellomrom
// (æøå beholdes), og teksten deles i ord.
export function ord(tekst: string): string[] {
  return tekst
    .normalize("NFC")
    .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .filter(Boolean);
}

// Et nøkkelord er funnet når hvert av ordene er starten på et ord i CV-teksten.
export function finnNokkelord(
  nokkelord: readonly NokkelordSvar[],
  cvTekst: string,
): Nokkelord[] {
  const cvOrd = ord(cvTekst);

  return nokkelord.map(({ tekst, kravIndeks }) => {
    const deler = ord(tekst);
    const funnet =
      deler.length > 0 &&
      deler.every((del) => cvOrd.some((c) => c.startsWith(del)));

    return { tekst, kravIndeks, funnet };
  });
}

// Andelen funne nøkkelord i prosent, rundet med halve opp. Uten nøkkelord er den 0.
export function treffprosent(nokkelord: readonly Pick<Nokkelord, "funnet">[]): number {
  if (nokkelord.length === 0) return 0;
  const funnet = nokkelord.filter((n) => n.funnet).length;

  return Math.floor((100 * funnet) / nokkelord.length + 0.5);
}
