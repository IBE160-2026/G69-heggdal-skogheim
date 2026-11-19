import { lesDocx } from "@/lib/innlesing/docx";
import { lesPdf } from "@/lib/innlesing/pdf";
import { lesTxt } from "@/lib/innlesing/txt";
import { CV_FIL_MAKS } from "@/lib/kontrakt/grenser";

import { hentGetDocument } from "./pdfjs";

export type CvFilSvar =
  | { type: "lest"; cvTekst: string }
  | { type: "avvist" }
  | { type: "feilet" };

const LESERE: Record<string, (data: ArrayBuffer) => string | Promise<string>> = {
  ".pdf": async (data) => lesPdf(data, await hentGetDocument()),
  ".docx": lesDocx,
  ".txt": lesTxt,
};

function endelse(navn: string): string {
  const punktum = navn.lastIndexOf(".");
  return punktum < 0 ? "" : navn.slice(punktum).toLowerCase();
}

// Avgjør før lesing om filen kan brukes (FR-1). Endelsen avgjør formatet, og
// MIME-typen brukes ikke. Gir true for en fil som avvises. Meldingen står i
// feiltabellen i UI-et (AD-8).
export function avvisCvFil(fil: File): boolean {
  return !LESERE[endelse(fil.name)] || fil.size > CV_FIL_MAKS;
}

// Leser CV-filen i nettleseren (FR-2). Funksjonen kaster aldri: en fil som ikke
// kan leses, gir `feilet` (FR-22).
export async function lesCvFil(fil: File): Promise<CvFilSvar> {
  if (avvisCvFil(fil)) return { type: "avvist" };

  try {
    const les = LESERE[endelse(fil.name)];
    return { type: "lest", cvTekst: await les(await fil.arrayBuffer()) };
  } catch {
    return { type: "feilet" };
  }
}
