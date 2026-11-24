import { describe, expect, it } from "vitest";

import { lagringstekst, overforingstekst } from "./personvern";

describe("overforingstekst", () => {
  it("FR-5: EU-leverandør får ingen setning om EØS", () => {
    expect(
      overforingstekst({
        navn: "Mistral AI",
        land: "Frankrike",
        tredjeland: false,
      }),
    ).toBe("CV-teksten sendes til Mistral AI i Frankrike.");
  });

  it("FR-5: tredjeland får setningen om EØS", () => {
    expect(
      overforingstekst({ navn: "Leverandør", land: "USA", tredjeland: true }),
    ).toBe(
      "CV-teksten sendes til Leverandør i USA. Det betyr at opplysningene overføres ut av EØS.",
    );
  });

  it("FR-5: uten status er teksten generell, uten leverandør og land", () => {
    expect(overforingstekst(null)).toBe(
      "CV-teksten sendes til en ekstern språkmodell.",
    );
  });
});

describe("lagringstekst", () => {
  it("FR-5: leverandøren nevnes ved navn i setningen om misbruk", () => {
    expect(
      lagringstekst({ navn: "OpenAI", land: "USA", tredjeland: true }),
    ).toBe(
      "Appen lagrer ingenting, og alt er borte når du lukker fanen. OpenAI kan likevel beholde teksten i opptil 30 dager for å oppdage misbruk.",
    );
  });

  it("FR-5: uten status står «Språkmodellen» i stedet for navnet", () => {
    expect(lagringstekst(null)).toBe(
      "Appen lagrer ingenting, og alt er borte når du lukker fanen. Språkmodellen kan likevel beholde teksten i opptil 30 dager for å oppdage misbruk.",
    );
  });
});
