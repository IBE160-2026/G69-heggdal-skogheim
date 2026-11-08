import { describe, expect, it } from "vitest";

import { FODSELSNUMMER_FJERNET, masker, maskerMedAntall } from "./masker";

describe("masker", () => {
  it.each(["01019012345", "010190 12345", "010190\u00a012345"])(
    "FR-6: «%s» maskeres",
    (nummer) => {
      expect(masker(nummer)).toBe(FODSELSNUMMER_FJERNET);
    },
  );

  it.each([
    "400 00 001",
    "1990",
    "1234.56.78903",
    "12345678903",
    "310290 12345",
    "320190 12345",
    "011390 12345",
    "290291 12345",
  ])("FR-6: «%s» maskeres ikke", (tekst) => {
    expect(masker(tekst)).toBe(tekst);
  });

  it.each([
    "101019012345",
    "010190123456",
    "010190 123456",
    "010190  12345",
    "010190-12345",
  ])(
    "FR-6: «%s» maskeres ikke (siffer rundt, to mellomrom eller bindestrek)",
    (tekst) => {
      expect(masker(tekst)).toBe(tekst);
    },
  );

  it("FR-6: 29.02 godtas når ÅÅ er delelig med 4", () => {
    expect(masker("29029212345")).toBe(FODSELSNUMMER_FJERNET);
  });

  it("FR-6: maskerer inne i tekst og beholder resten", () => {
    expect(masker("Fødselsnr: 01019012345, tlf. 400 00 001.")).toBe(
      `Fødselsnr: ${FODSELSNUMMER_FJERNET}, tlf. 400 00 001.`,
    );
  });

  it("FR-6: D-nummer (dag + 40) maskeres ikke", () => {
    expect(masker("41019012345")).toBe("41019012345");
  });

  it("FR-6: masker(masker(x)) er lik masker(x)", () => {
    const tekst = "A 01019012345 B 010190 12345 C 12345678903";
    const en = masker(tekst);

    expect(masker(en)).toBe(en);
  });

  it("FR-6: tom tekst er uendret", () => {
    expect(masker("")).toBe("");
  });
});

describe("maskerMedAntall", () => {
  it("FR-6: teller fødselsnumrene som ble fjernet", () => {
    const { tekst, antall } = maskerMedAntall(
      "01019012345 og 010190 12345, men ikke 12345678903",
    );

    expect(antall).toBe(2);
    expect(tekst).toBe(
      `${FODSELSNUMMER_FJERNET} og ${FODSELSNUMMER_FJERNET}, men ikke 12345678903`,
    );
  });

  it("FR-6: maskert tekst gir antall 0 andre gang", () => {
    const forste = maskerMedAntall("01019012345");

    expect(maskerMedAntall(forste.tekst)).toEqual({
      tekst: forste.tekst,
      antall: 0,
    });
  });
});
