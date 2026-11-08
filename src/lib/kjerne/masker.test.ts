import { describe, expect, it } from "vitest";

import { FODSELSNUMMER_FJERNET, masker, maskerMedAntall } from "./masker";

describe("masker", () => {
  it.each([
    ["uten skilletegn", "01019012345"],
    ["ett mellomrom", "010190 12345"],
    ["ett hardt mellomrom", "010190\u00a012345"],
    ["to mellomrom", "010190  12345"],
    ["tre mellomrom", "010190   12345"],
    ["to harde mellomrom", "010190\u00a0\u00a012345"],
    ["vanlig og hardt mellomrom", "010190 \u00a012345"],
    ["bindestrek", "010190-12345"],
    ["bindestrek med mellomrom på begge sider", "010190 - 12345"],
    ["mellomrom før bindestrek", "010190 -12345"],
    ["mellomrom etter bindestrek", "010190- 12345"],
    ["tankestrek", "010190\u201312345"],
    ["tankestrek med harde mellomrom", "010190\u00a0\u2013\u00a012345"],
  ])("FR-6: fødselsnummer med %s maskeres", (_, nummer) => {
    expect(masker(nummer)).toBe(FODSELSNUMMER_FJERNET);
  });

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
    "010190-123456",
    "1010190-12345",
    "010190-1234",
  ])("FR-6: «%s» maskeres ikke (siffer rundt eller feil antall)", (tekst) => {
    expect(masker(tekst)).toBe(tekst);
  });

  it.each([
    ["fire mellomrom", "010190    12345"],
    ["to bindestreker", "010190--12345"],
    ["bindestrek og tankestrek", "010190-–12345"],
    ["to mellomrom før bindestrek", "010190  -12345"],
    ["to mellomrom etter bindestrek", "010190-  12345"],
    ["tabulator", "010190\t12345"],
    ["linjeskift", "010190\n12345"],
    ["linjeskift med CRLF", "010190\r\n12345"],
    ["bindestrek og linjeskift", "010190-\n12345"],
    ["punktum", "010190.12345"],
    ["skråstrek", "010190/12345"],
    ["understrek", "010190_12345"],
  ])("FR-6: 6 + 5 sifre med %s maskeres ikke", (_, tekst) => {
    expect(masker(tekst)).toBe(tekst);
  });

  it.each([
    "310290-12345",
    "320190-12345",
    "011390 - 12345",
    "000190-12345",
    "410190-12345",
    "123456-12345",
    "999999 - 99999",
    "290291–12345",
  ])("FR-6: «%s» uten gyldig dato maskeres ikke", (tekst) => {
    expect(masker(tekst)).toBe(tekst);
  });

  it.each([
    ["mobilnummer", "+47 400 00 001"],
    ["mobilnummer uten mellomrom", "40000001"],
    ["fasttelefon i par", "22 33 44 55"],
    ["kontonummer med mellomrom", "1234 56 78903"],
    ["kontonummer med bindestrek", "1234-56-78903"],
    ["organisasjonsnummer", "NO 923 456 789 MVA"],
    ["organisasjonsnummer uten mellomrom", "923456789"],
    ["IBAN", "NO93 8601 1117 947"],
    ["kortnummer", "4111 1111 1111 1111"],
    ["ISBN", "978-82-02-12345-6"],
    ["periode med bindestrek", "2015-2020"],
    ["periode med tankestrek og mellomrom", "2015 – 2020"],
    ["periode med måneder", "01.2015-12.2020"],
    ["ISO-dato", "1990-01-01"],
    ["datoer med punktum", "01.01.1990-31.12.1995"],
    ["postnummer og sted", "0150 Oslo"],
    ["klokkeslett", "08:00-16:00"],
    ["beløp", "kr 450 000-550 000"],
  ])("FR-6: %s maskeres ikke", (_, tekst) => {
    expect(masker(tekst)).toBe(tekst);
  });

  it("FR-6: bare fødselsnummeret maskeres i en CV-linje med mange tall", () => {
    const tekst =
      "2015-2020: Butikksjef, Oslo 0150. Tlf. 400 00 001, konto 1234 56 78903, fnr. 010190-12345.";

    expect(masker(tekst)).toBe(
      `2015-2020: Butikksjef, Oslo 0150. Tlf. 400 00 001, konto 1234 56 78903, fnr. ${FODSELSNUMMER_FJERNET}.`,
    );
  });

  it("FR-6: tall i hver sin tabellcelle slås ikke sammen", () => {
    const tekst = "Ansattnr\t010190\t12345\n010190\n12345";

    expect(masker(tekst)).toBe(tekst);
  });

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
    const tekst =
      "A 01019012345 B 010190 12345 C 12345678903 D 010190-12345 E 010190   12345";
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

  it("FR-6: teller fødselsnumre med bindestrek og flere mellomrom", () => {
    const { tekst, antall } = maskerMedAntall(
      "010190-12345, 020290 – 12345 og 030390  12345, men ikke 2015-2020",
    );

    expect(antall).toBe(3);
    expect(tekst).toBe(
      `${FODSELSNUMMER_FJERNET}, ${FODSELSNUMMER_FJERNET} og ${FODSELSNUMMER_FJERNET}, men ikke 2015-2020`,
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
