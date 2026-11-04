import { describe, expect, it } from "vitest";

import { overforingstekst } from "./personvern";

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
