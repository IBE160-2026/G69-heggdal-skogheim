export const FODSELSNUMMER_FJERNET = "[fødselsnummer fjernet]";

// 11 sifre, eventuelt med ett mellomrom etter de seks første, uten siffer rett før eller etter.
// Hardt mellomrom (U+00A0) regnes også som mellomrom, fordi det ofte følger med tekst fra Word og PDF.
const KANDIDAT = /(?<!\d)(\d{2})(\d{2})(\d{2})[ \u00a0]?\d{5}(?!\d)/g;

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
