import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import { lesDocx } from "./docx";
import { lesTxt } from "./txt";

const PAR = [
  "par-1-butikk-bank",
  "par-2-it-support",
  "par-3-regnskap",
  "par-4-tokolonne-hotell",
];

function arrayBuffer(bytes: Uint8Array): ArrayBuffer {
  return bytes.buffer.slice(
    bytes.byteOffset,
    bytes.byteOffset + bytes.byteLength,
  ) as ArrayBuffer;
}

function testfil(sti: string): ArrayBuffer {
  return arrayBuffer(readFileSync(`testdata/${sti}`));
}

function utenMellomrom(tekst: string): string {
  return tekst.replace(/\s+/g, "");
}

describe("lesTxt", () => {
  it.each(PAR)("FR-2: %s/cv.txt gir teksten i fila", (par) => {
    const forventet = readFileSync(`testdata/${par}/cv.txt`, "utf8");

    expect(utenMellomrom(lesTxt(testfil(`${par}/cv.txt`)))).toBe(
      utenMellomrom(forventet),
    );
  });

  it("FR-2: tom fil gir tom tekst", () => {
    expect(lesTxt(new ArrayBuffer(0))).toBe("");
  });

  it("FR-2: ugyldig UTF-8 (Windows-1252 med æøå) kaster", () => {
    // «Bærum» i Windows-1252: æ er 0xE6, som ikke er gyldig UTF-8 alene.
    const bytes = new Uint8Array([0x42, 0xe6, 0x72, 0x75, 0x6d]);

    expect(() => lesTxt(arrayBuffer(bytes))).toThrow();
  });
});

describe("lesDocx", () => {
  it("FR-2: par-1/cv.docx gir det samme som cv.txt", async () => {
    const forventet = readFileSync("testdata/par-1-butikk-bank/cv.txt", "utf8");
    const tekst = await lesDocx(testfil("par-1-butikk-bank/cv.docx"));

    expect(utenMellomrom(tekst)).toBe(utenMellomrom(forventet));
  });

  it("FR-2: tilfeldige byte kaster", async () => {
    const bytes = new Uint8Array(256).map((_, i) => (i * 37 + 11) % 256);

    await expect(lesDocx(arrayBuffer(bytes))).rejects.toThrow();
  });
});
