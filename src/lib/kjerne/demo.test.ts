import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { DEMO_ANNONSE, DEMO_CV } from "@/lib/kontrakt/demo";

import { erDemoeksempel, normaliser } from "./demo";
import { masker } from "./masker";

describe("DEMO_CV og DEMO_ANNONSE", () => {
  it("FR-26: er lik cv.txt og annonse.txt fra testpar 1", () => {
    expect(DEMO_CV).toBe(
      readFileSync("testdata/par-1-butikk-bank/cv.txt", "utf8"),
    );
    expect(DEMO_ANNONSE).toBe(
      readFileSync("testdata/par-1-butikk-bank/annonse.txt", "utf8"),
    );
    expect(DEMO_CV.length).toBeGreaterThan(300);
    expect(DEMO_ANNONSE.length).toBeGreaterThanOrEqual(200);
  });
});

describe("normaliser", () => {
  it("FR-9: ser bort fra store og små bokstaver", () => {
    expect(normaliser("Økonomi ÆØÅ")).toBe(normaliser("økonomi æøå"));
  });

  it("FR-9: fjerner mellomrom, tabulatorer, harde mellomrom og linjeskift", () => {
    expect(normaliser(" a b\tc\r\nd\ne f g ")).toBe("abcdefg");
  });

  it("FR-9: sammensatte og ferdige tegn blir like (NFC)", () => {
    expect(normaliser("Å")).toBe(normaliser("å"));
  });
});

describe("erDemoeksempel", () => {
  it("FR-26: demoteksten er demoeksempelet", () => {
    expect(erDemoeksempel(DEMO_CV, DEMO_ANNONSE)).toBe(true);
  });

  it("FR-26: CRLF, ekstra mellomrom og store bokstaver endrer ikke svaret", () => {
    const cv = `  ${DEMO_CV.replace(/\n/g, "\r\n").replace(/ /g, "  ")}\n\n`;
    const annonse = DEMO_ANNONSE.toUpperCase().replace(/\n/g, "\r\n");

    expect(erDemoeksempel(cv, annonse)).toBe(true);
  });

  it("FR-26: ett ord endret i CV-en gir usann", () => {
    expect(DEMO_CV).toContain("Butikkmedarbeider");
    const cv = DEMO_CV.replace("Butikkmedarbeider", "Lagermedarbeider");

    expect(erDemoeksempel(cv, DEMO_ANNONSE)).toBe(false);
  });

  it("FR-26: ett ord endret i annonsen gir usann", () => {
    const ord = DEMO_ANNONSE.split(/\s+/).find((del) => del.length > 4)!;
    const annonse = DEMO_ANNONSE.replace(ord, `${ord}x`);

    expect(erDemoeksempel(DEMO_CV, annonse)).toBe(false);
  });

  it("FR-26: demo-CV-en med en annen annonse er ikke demoeksempelet", () => {
    const annonse = readFileSync("testdata/par-2-it-support/annonse.txt", "utf8");

    expect(erDemoeksempel(DEMO_CV, annonse)).toBe(false);
    expect(erDemoeksempel("", "")).toBe(false);
  });

  it("AD-13: maskert demotekst er fortsatt demoeksempelet", () => {
    expect(erDemoeksempel(masker(DEMO_CV), masker(DEMO_ANNONSE))).toBe(true);
  });
});
