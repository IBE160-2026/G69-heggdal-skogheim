import { lesDocx } from "@/lib/innlesing/docx";
import { lesTxt } from "@/lib/innlesing/txt";
import { CV_FIL_MAKS } from "@/lib/kontrakt/grenser";

export type CvFilSvar =
  | { type: "lest"; cvTekst: string }
  | { type: "avvist"; melding: string }
  | { type: "feilet" };

export const FIL_AVVIST =
  "Filen kan ikke brukes. Velg en DOCX- eller TXT-fil på maks 5 MB.";
export const PDF_AVVIST =
  "PDF-filer kan ikke leses ennå. Velg en DOCX- eller TXT-fil, eller lim inn CV-teksten.";

const LESERE: Record<string, (data: ArrayBuffer) => string | Promise<string>> = {
  ".docx": lesDocx,
  ".txt": lesTxt,
};

function endelse(navn: string): string {
  const punktum = navn.lastIndexOf(".");
  return punktum < 0 ? "" : navn.slice(punktum).toLowerCase();
}

// Avgjør før lesing om filen kan brukes (FR-1). Endelsen avgjør formatet, og
// MIME-typen brukes ikke. Gir meldingen for en avvist fil, ellers null.
export function avvisCvFil(fil: File): string | null {
  const type = endelse(fil.name);
  if (type === ".pdf") return PDF_AVVIST;
  if (!LESERE[type] || fil.size > CV_FIL_MAKS) return FIL_AVVIST;

  return null;
}

// Leser CV-filen i nettleseren (FR-2). Funksjonen kaster aldri: en fil som ikke
// kan leses, gir `feilet` (FR-22).
export async function lesCvFil(fil: File): Promise<CvFilSvar> {
  const melding = avvisCvFil(fil);
  if (melding) return { type: "avvist", melding };

  try {
    const les = LESERE[endelse(fil.name)];
    return { type: "lest", cvTekst: await les(await fil.arrayBuffer()) };
  } catch {
    return { type: "feilet" };
  }
}
