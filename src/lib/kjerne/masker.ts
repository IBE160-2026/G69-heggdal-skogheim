export const FODSELSNUMMER_FJERNET = "[fødselsnummer fjernet]";

// 11 sifre uten siffer rett før eller etter. Mellom de seks første og de fem siste kan det stå
// - ingenting eller 1–3 mellomrom, eller
// - én bindestrek eller tankestrek (–), med høyst ett mellomrom på hver side.
// Hardt mellomrom (U+00A0) regnes også som mellomrom, fordi det ofte følger med tekst fra Word og PDF.
// Tabulator og linjeskift godtas ikke, slik at tall i hver sin tabellcelle eller linje ikke slås sammen.
const KANDIDAT =
  /(?<!\d)(\d{2})(\d{2})(\d{2})(?:[ \u00a0]{0,3}|[ \u00a0]?[-\u2013][ \u00a0]?)\d{5}(?!\d)/g;

const DAGER_I_MANED = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

// DDMMÅÅ må være en gyldig dato. Hundreåret er ukjent, så 29.02 godtas når ÅÅ er delelig med 4.
function erGyldigDato(dd: string, mm: string, aa: string): boolean {
  const dag = Number(dd);
  const maned = Number(mm);
  if (maned < 1 || maned > 12 || dag < 1) return false;
  if (maned === 2 && dag === 29) return Number(aa) % 4 === 0;

  return dag <= DAGER_I_MANED[maned - 1];
}

export function maskerMedAntall(tekst: string): { tekst: string; antall: number } {
  let antall = 0;
  const maskert = tekst.replace(KANDIDAT, (treff, dd, mm, aa) => {
    if (!erGyldigDato(dd, mm, aa)) return treff;
    antall += 1;
    return FODSELSNUMMER_FJERNET;
  });

  return { tekst: maskert, antall };
}

export function masker(tekst: string): string {
  return maskerMedAntall(tekst).tekst;
}
