import { generateText, NoObjectGeneratedError, NoOutputGeneratedError } from "ai";
import { afterEach, describe, expect, it, vi } from "vitest";

import { gapSvar } from "@/lib/kontrakt/gap";

import { gapModellSkjema, MAKS_UTDATA_TOKENS, TEMPERATUR } from "./felles";
import { lagEkteKlient } from "./klient";
import { STANDARD_MODELL } from "./leverandor";
import { RESONNERING_MODELLER, resonnering } from "./mistral";
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

function svarMed(output: unknown, modelId = "mistral-medium-2508") {
  generer.mockResolvedValue({
    output,
    usage: { inputTokens: 1200, outputTokens: 300 },
    response: { id: "1", timestamp: new Date(), modelId },
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
    expect(valg.temperature).toBe(TEMPERATUR);
    expect(TEMPERATUR).toBeGreaterThanOrEqual(0);
    expect(TEMPERATUR).toBeLessThanOrEqual(0.3);
    expect(valg.maxOutputTokens).toBe(8000);
    expect(MAKS_UTDATA_TOKENS).toBe(8000);
    expect(valg.abortSignal).toBe(signal);
    // Standardmodellen er Medium 3.5 (alias), så resonneringen er "none".
    expect(valg.providerOptions).toEqual({
      mistral: { strictJsonSchema: true, reasoningEffort: "none" },
    });
    expect(valg.model).toMatchObject({
      provider: expect.stringContaining("mistral"),
      modelId: "mistral-medium-latest",
    });
  });

  it.each([
    ["mistral-medium-2604", "none"],
    ["mistral-medium-3-5", "none"],
    ["mistral-medium-latest", "none"],
    ["mistral-large-4-0", "low"],
    ["mistral-large-4", "low"],
    [" Mistral-Large-4-0 ", "low"],
  ])("AD-8: %s sendes med reasoningEffort %s", async (modell, innsats) => {
    svarMed(SVAR);
    await kall({ MISTRAL_API_KEY: "x", LLM_MODELL: modell });

    expect(generer.mock.calls[0][0].providerOptions).toEqual({
      mistral: { strictJsonSchema: true, reasoningEffort: innsats },
    });
  });

  it.each(["mistral-small-latest", "mistral-large-2512", "mistral-large-latest", "open-mistral-nemo"])(
    "AD-8: andre Mistral-modeller (%s) får ingen reasoningEffort",
    async (modell) => {
      svarMed(SVAR);
      await kall({ MISTRAL_API_KEY: "x", LLM_MODELL: modell });

      expect(generer.mock.calls[0][0].providerOptions).toEqual({
        mistral: { strictJsonSchema: true },
      });
    },
  );

  it("AD-8: ingen Large-modell i tabellen får \"none\", som Large 4 ikke tar imot", () => {
    const large = RESONNERING_MODELLER.filter((m) => m.startsWith("mistral-large"));
    expect(large.length).toBeGreaterThan(0);
    for (const m of large) expect(resonnering(m)).toBe("low");
  });

  it("AD-3: LLM_LEVERANDOR=openai gir OpenAI med standardmodellen", async () => {
    svarMed(SVAR);
    await kall({ LLM_LEVERANDOR: " OpenAI ", OPENAI_API_KEY: "x" });

    const valg = generer.mock.calls[0][0];
    expect(valg.model).toMatchObject({
      provider: expect.stringContaining("openai"),
      modelId: "gpt-4.1-mini",
    });
    expect(valg.providerOptions).toEqual({ openai: { strictJsonSchema: true } });
    expect(valg.temperature).toBe(0);
    expect(valg.maxRetries).toBe(0);
    expect(valg.maxOutputTokens).toBe(MAKS_UTDATA_TOKENS);
    expect(valg.instructions).toBe(GAP_INSTRUKS);
  });

  // Låser oppsettet som ble valgt i story 2.4 (vurdering-2-4-kontroll-temperatur-0.md), så en
  // endring må gjøres bevisst.
  it("AD-11: det valgte oppsettet er gpt-4.1-mini med temperatur 0", () => {
    expect(STANDARD_MODELL.openai).toBe("gpt-4.1-mini");
    expect(TEMPERATUR).toBe(0);
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

  it("AD-4: svar utenfor skjemaet gir svar: undefined med tokenene og modellversjonen", async () => {
    generer.mockRejectedValue(
      new NoObjectGeneratedError({
        message: "ugyldig",
        text: "{}",
        response: { id: "1", timestamp: new Date(), modelId: "m" },
        usage: { inputTokens: 50, outputTokens: 5 },
        finishReason: "stop",
      } as unknown as ConstructorParameters<typeof NoObjectGeneratedError>[0]),
    );

    const svar = await kall({ MISTRAL_API_KEY: "x" });
    expect(svar).toEqual({
      svar: undefined,
      inputTokens: 50,
      outputTokens: 5,
      modellversjon: "m",
    });
  });

  it("NFR-10: svar utenfor skjemaet uten response gir ingen modellversjon", async () => {
    generer.mockRejectedValue(
      new NoObjectGeneratedError({
        message: "ugyldig",
        usage: { inputTokens: 50, outputTokens: 5 },
      } as unknown as ConstructorParameters<typeof NoObjectGeneratedError>[0]),
    );

    const svar = await kall({ MISTRAL_API_KEY: "x" });
    expect("modellversjon" in svar).toBe(false);
  });

  it("NFR-10: modellversjonen er den leverandøren svarte med, ikke aliaset", async () => {
    svarMed(SVAR, "mistral-medium-2508");
    const svar = await kall({ MISTRAL_API_KEY: "x" });

    expect(generer.mock.calls[0][0].model).toMatchObject({ modelId: "mistral-medium-latest" });
    expect(svar.modellversjon).toBe("mistral-medium-2508");
  });

  it("NFR-10: svar uten modelId gir ingen modellversjon", async () => {
    svarMed(SVAR, "");
    const svar = await kall({ MISTRAL_API_KEY: "x" });

    expect("modellversjon" in svar).toBe(false);
  });

  it("AD-4: ingen utdata gir svar: undefined uten tokener", async () => {
    generer.mockRejectedValue(new NoOutputGeneratedError());

    const svar = await kall({ MISTRAL_API_KEY: "x" });
    expect(svar).toEqual({ svar: undefined, inputTokens: 0, outputTokens: 0 });
    expect("modellversjon" in svar).toBe(false);
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
