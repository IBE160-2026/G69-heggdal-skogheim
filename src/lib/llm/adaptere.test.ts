import { generateText, NoObjectGeneratedError, NoOutputGeneratedError } from "ai";
import { afterEach, describe, expect, it, vi } from "vitest";

import { gapSvar } from "@/lib/kontrakt/gap";

import { gapModellSkjema, MAKS_UTDATA_TOKENS } from "./felles";
import { lagEkteKlient } from "./klient";
import { GAP_INSTRUKS } from "./prompter/gap";

// Ingen test kaller et ekte API: `generateText` er mocket.
vi.mock("ai", async (original) => ({
  ...(await original<typeof import("ai")>()),
  generateText: vi.fn(),
}));

const generer = vi.mocked(generateText);

const SVAR = {
  stilling: "Kundebehandler",
  arbeidsgiver: "Sparebanken Testvik",
  krav: [
    {
      tekst: "Kundeservice",
      kategori: "delvis",
      belegg: ["Kassearbeid"],
      forklaring: "Butikk, ikke bank.",
      raad: null,
    },
    { tekst: "AFR", kategori: "mangler", belegg: [], forklaring: null, raad: "Vis vilje." },
  ],
  nokkelord: [{ tekst: "AFR", kravIndeks: 1 }],
};

function svarMed(output: unknown) {
  generer.mockResolvedValue({
    output,
    usage: { inputTokens: 1200, outputTokens: 300 },
  } as unknown as Awaited<ReturnType<typeof generateText>>);
}

async function kall(env: Record<string, string>, signal = new AbortController().signal) {
  return lagEkteKlient(env).analyseGap({ cvTekst: "CV", annonse: "Annonse", signal });
}

afterEach(() => {
  generer.mockReset();
});

describe("adapterne", () => {
  it("AD-3: Mistral er standard, med generateText, Output.object, maxRetries 0, temperatur, maxOutputTokens og strikt skjema", async () => {
    svarMed(SVAR);
    const signal = new AbortController().signal;
    await kall({ MISTRAL_API_KEY: "x" }, signal);

    expect(generer).toHaveBeenCalledTimes(1);
    const valg = generer.mock.calls[0][0];
    expect(valg.instructions).toBe(GAP_INSTRUKS);
    expect(valg.prompt).toContain("CV");
    expect(valg.prompt).toContain("Annonse");
    expect(valg.output).toBeDefined();
    expect(valg.maxRetries).toBe(0);
    expect(valg.temperature).toBeGreaterThanOrEqual(0);
    expect(valg.temperature).toBeLessThanOrEqual(0.3);
    expect(valg.maxOutputTokens).toBe(8000);
    expect(MAKS_UTDATA_TOKENS).toBe(8000);
    expect(valg.abortSignal).toBe(signal);
    expect(valg.providerOptions).toEqual({ mistral: { strictJsonSchema: true } });
    expect(valg.model).toMatchObject({
      provider: expect.stringContaining("mistral"),
      modelId: "mistral-medium-latest",
    });
  });

  it("AD-3: LLM_LEVERANDOR=openai gir OpenAI med standardmodellen", async () => {
    svarMed(SVAR);
    await kall({ LLM_LEVERANDOR: " OpenAI ", OPENAI_API_KEY: "x" });

    const valg = generer.mock.calls[0][0];
    expect(valg.model).toMatchObject({
      provider: expect.stringContaining("openai"),
      modelId: "gpt-5-mini",
    });
    expect(valg.providerOptions).toEqual({ openai: { strictJsonSchema: true } });
    expect(valg.maxRetries).toBe(0);
    expect(valg.maxOutputTokens).toBe(MAKS_UTDATA_TOKENS);
    expect(valg.instructions).toBe(GAP_INSTRUKS);
  });

  it("AD-3: LLM_MODELL velger modellen", async () => {
    svarMed(SVAR);
    await kall({ MISTRAL_API_KEY: "x", LLM_MODELL: " mistral-small-latest " });

    expect(generer.mock.calls[0][0].model).toMatchObject({ modelId: "mistral-small-latest" });
  });

  it("AD-3: ukjent LLM_LEVERANDOR gir Mistral, som i lagStatus", async () => {
    svarMed(SVAR);
    await kall({ LLM_LEVERANDOR: "foo", MISTRAL_API_KEY: "x" });

    expect(generer.mock.calls[0][0].model).toMatchObject({
      provider: expect.stringContaining("mistral"),
    });
  });

  it("AD-3: null i forklaring og raad blir undefined, og svaret passer gapSvar", async () => {
    svarMed(SVAR);
    const { svar, inputTokens, outputTokens } = await kall({ MISTRAL_API_KEY: "x" });

    const parsed = gapSvar.parse(svar);
    expect(parsed.krav[0].forklaring).toBe("Butikk, ikke bank.");
    expect(parsed.krav[0].raad).toBeUndefined();
    expect(parsed.krav[1].forklaring).toBeUndefined();
    expect(parsed.krav[1].raad).toBe("Vis vilje.");
    expect("raad" in parsed.krav[0]).toBe(false);
    expect({ inputTokens, outputTokens }).toEqual({ inputTokens: 1200, outputTokens: 300 });
  });

  it("AD-3: skjemaet til modellen krever forklaring og raad som nullable", () => {
    const utenForklaring = { tekst: "x", kategori: "oppfylt", belegg: [], raad: null };
    expect(gapModellSkjema.safeParse(SVAR).success).toBe(true);
    expect(
      gapModellSkjema.safeParse({ ...SVAR, krav: [utenForklaring] }).success,
    ).toBe(false);
  });

  it("AD-4: svar utenfor skjemaet gir svar: undefined med tokenene", async () => {
    generer.mockRejectedValue(
      new NoObjectGeneratedError({
        message: "ugyldig",
        text: "{}",
        response: { id: "1", timestamp: new Date(), modelId: "m" },
        usage: { inputTokens: 50, outputTokens: 5 },
        finishReason: "stop",
      } as unknown as ConstructorParameters<typeof NoObjectGeneratedError>[0]),
    );

    await expect(kall({ MISTRAL_API_KEY: "x" })).resolves.toEqual({
      svar: undefined,
      inputTokens: 50,
      outputTokens: 5,
    });
  });

  it("AD-4: ingen utdata gir svar: undefined uten tokener", async () => {
    generer.mockRejectedValue(new NoOutputGeneratedError());

    await expect(kall({ MISTRAL_API_KEY: "x" })).resolves.toEqual({
      svar: undefined,
      inputTokens: 0,
      outputTokens: 0,
    });
  });

  it("AD-8: ingen utdata fordi signalet er avbrutt, kastes videre", async () => {
    const feil = new NoOutputGeneratedError();
    generer.mockRejectedValue(feil);
    const kontroller = new AbortController();
    kontroller.abort();

    await expect(kall({ MISTRAL_API_KEY: "x" }, kontroller.signal)).rejects.toBe(feil);
  });

  it("AD-8: andre feil, som tidsavbrudd, kastes videre", async () => {
    const feil = new DOMException("tidsavbrudd", "TimeoutError");
    generer.mockRejectedValue(feil);

    await expect(kall({ MISTRAL_API_KEY: "x" })).rejects.toBe(feil);
  });
});
