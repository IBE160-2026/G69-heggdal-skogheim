import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import { CV_FIL_MAKS } from "@/lib/kontrakt/grenser";

import { avvisCvFil, FIL_AVVIST, lesCvFil, PDF_AVVIST } from "./cvFil";

const DOCX = readFileSync("testdata/par-1-butikk-bank/cv.docx");
const TXT = readFileSync("testdata/par-1-butikk-bank/cv.txt", "utf8");

function fil(innhold: BlobPart, navn: string, type = "") {
  return new File([innhold], navn, { type });
}

function utenMellomrom(tekst: string): string {
  return tekst.replace(/\s+/g, "");
}

describe("lesCvFil", () => {
  it("FR-1: cv.docx leses", async () => {
    const svar = await lesCvFil(fil(DOCX, "cv.docx"));

    expect(svar.type).toBe("lest");
    if (svar.type === "lest") {
      expect(utenMellomrom(svar.cvTekst)).toBe(utenMellomrom(TXT));
    }
  });

  it("FR-1: cv.txt leses", async () => {
    await expect(lesCvFil(fil(TXT, "cv.txt"))).resolves.toEqual({
      type: "lest",
      cvTekst: TXT,
    });
  });

  it.each(["CV.DOCX", "Cv.Docx"])("FR-1: %s godtas", async (navn) => {
    await expect(lesCvFil(fil(DOCX, navn))).resolves.toMatchObject({
      type: "lest",
    });
  });

  it("FR-1: MIME-typen avgjør ikke formatet", async () => {
    await expect(
      lesCvFil(fil("Ola", "cv.txt", "application/octet-stream")),
    ).resolves.toEqual({ type: "lest", cvTekst: "Ola" });
    await expect(lesCvFil(fil("Ola", "cv", "text/plain"))).resolves.toEqual({
      type: "avvist",
      melding: FIL_AVVIST,
    });
  });

  it("FR-1: nøyaktig 5 MB godtas", async () => {
    const svar = await lesCvFil(fil(new Uint8Array(CV_FIL_MAKS).fill(97), "cv.txt"));

    expect(svar.type).toBe("lest");
  });

  it("FR-1: 5 MB + 1 byte avvises før lesing", async () => {
    const stor = fil(new Uint8Array(CV_FIL_MAKS + 1), "cv.txt");
    stor.arrayBuffer = () => {
      throw new Error("skal ikke leses");
    };

    await expect(lesCvFil(stor)).resolves.toEqual({
      type: "avvist",
      melding: FIL_AVVIST,
    });
  });

  it.each(["cv.odt", "cv.doc", "cv", "cv.txt.exe"])(
    "FR-1: %s avvises med formatmeldingen",
    async (navn) => {
      await expect(lesCvFil(fil("Ola", navn))).resolves.toEqual({
        type: "avvist",
        melding: FIL_AVVIST,
      });
    },
  );

  it.each(["cv.pdf", "CV.PDF"])("FR-1: %s avvises med PDF-meldingen", async (navn) => {
    await expect(lesCvFil(fil("%PDF-1.7", navn))).resolves.toEqual({
      type: "avvist",
      melding: PDF_AVVIST,
    });
  });

  it("FR-22: ødelagt DOCX gir feilet", async () => {
    const bytes = new Uint8Array(256).map((_, i) => (i * 37 + 11) % 256);

    await expect(lesCvFil(fil(bytes, "cv.docx"))).resolves.toEqual({
      type: "feilet",
    });
  });

  it("FR-22: TXT som ikke er UTF-8, gir feilet", async () => {
    const bytes = new Uint8Array([0x42, 0xe6, 0x72, 0x75, 0x6d]);

    await expect(lesCvFil(fil(bytes, "cv.txt"))).resolves.toEqual({
      type: "feilet",
    });
  });

  it("FR-22: feil ved lesing av filen gir feilet", async () => {
    const ulest = fil("Ola", "cv.txt");
    ulest.arrayBuffer = () => Promise.reject(new Error("NotReadableError"));

    await expect(lesCvFil(ulest)).resolves.toEqual({ type: "feilet" });
  });

  it("FR-1: avvisCvFil avgjør uten å lese filen", () => {
    expect(avvisCvFil(fil("x", "cv.txt"))).toBeNull();
    expect(avvisCvFil(fil("x", "cv.pdf"))).toBe(PDF_AVVIST);
    expect(avvisCvFil(fil("x", "cv.odt"))).toBe(FIL_AVVIST);
  });

  it("FR-1: tom fil leses som tom tekst", async () => {
    await expect(lesCvFil(fil("", "cv.txt"))).resolves.toEqual({
      type: "lest",
      cvTekst: "",
    });
  });
});
