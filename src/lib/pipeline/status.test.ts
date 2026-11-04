import { describe, expect, it } from "vitest";

import { lagStatus } from "./status";

const MISTRAL = { navn: "Mistral AI", land: "Frankrike", tredjeland: false };
const OPENAI = { navn: "OpenAI", land: "USA", tredjeland: true };

describe("lagStatus", () => {
  it("FR-23: uten miljøvariabler gir demomodus med Mistral", () => {
    expect(lagStatus({})).toEqual({ modus: "demo", leverandor: MISTRAL });
  });

  it("FR-23: nøkkel for valgt leverandør gir ekte modus", () => {
    expect(lagStatus({ MISTRAL_API_KEY: "x" })).toEqual({
      modus: "ekte",
      leverandor: MISTRAL,
    });
    expect(lagStatus({ LLM_LEVERANDOR: "openai", OPENAI_API_KEY: "x" })).toEqual(
      { modus: "ekte", leverandor: OPENAI },
    );
  });

  it("FR-23: nøkkel for en annen leverandør gir demomodus", () => {
    expect(
      lagStatus({ LLM_LEVERANDOR: "openai", MISTRAL_API_KEY: "x" }),
    ).toEqual({ modus: "demo", leverandor: OPENAI });
  });

  it.each(["", "   "])(
    "FR-23: tom nøkkel (%j) behandles som manglende",
    (nokkel) => {
      expect(lagStatus({ MISTRAL_API_KEY: nokkel }).modus).toBe("demo");
    },
  );

  it.each(["foo", "", "constructor", "__proto__"])(
    "FR-23: ugyldig leverandør (%j) gir standardverdien mistral",
    (LLM_LEVERANDOR) => {
      expect(lagStatus({ LLM_LEVERANDOR })).toEqual({
        modus: "demo",
        leverandor: MISTRAL,
      });
    },
  );

  it.each([" openai ", "OpenAI"])(
    "FR-23: leverandørnavnet %j tolkes uten mellomrom og store bokstaver",
    (LLM_LEVERANDOR) => {
      expect(lagStatus({ LLM_LEVERANDOR, OPENAI_API_KEY: "x" })).toEqual({
        modus: "ekte",
        leverandor: OPENAI,
      });
    },
  );

  it("FR-23: svaret inneholder aldri nøkkelen", () => {
    const hemmelig = "hemmelig-nokkel";

    expect(JSON.stringify(lagStatus({ MISTRAL_API_KEY: hemmelig }))).not.toContain(
      hemmelig,
    );
  });
});
