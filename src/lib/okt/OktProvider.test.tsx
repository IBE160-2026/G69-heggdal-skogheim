// @vitest-environment jsdom
import { act, cleanup, render, screen } from "@testing-library/react";
import { StrictMode } from "react";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import { Demomodus } from "@/components/Demomodus";
import { Personvernbekreftelse } from "@/components/Personvernbekreftelse";
import { Personvernboks } from "@/components/Personvernboks";
import type { GapAnalyse } from "@/lib/kontrakt/gap";
import { apiMock, demoSvar, gapKall } from "@/testhjelp/gap";

import { OktProvider, useOkt } from "./OktProvider";

const DEMO = {
  modus: "demo",
  leverandor: { navn: "Mistral AI", land: "Frankrike", tredjeland: false },
};

async function monter(svar: () => Promise<Response>) {
  vi.stubGlobal("fetch", vi.fn(svar));

  render(
    <OktProvider>
      <Demomodus />
      <Personvernboks />
      <Personvernbekreftelse />
    </OktProvider>,
  );

  // Lar hentingen og tilstandsendringen bli ferdig.
  await act(async () => {
    await new Promise((ferdig) => setTimeout(ferdig));
  });
}

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("OktProvider", () => {
  it("FR-23: montert provider kaller fetch én gang", async () => {
    await monter(async () => Response.json(DEMO));

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith("/api/status", { cache: "no-store" });
  });

  it("FR-23: demosvar viser banneret, leverandør og land", async () => {
    await monter(async () => Response.json(DEMO));

    expect(screen.getByText(/^Demomodus:/)).toBeTruthy();
    expect(
      screen.getByText("CV-teksten sendes til Mistral AI i Frankrike."),
    ).toBeTruthy();
    expect(screen.getByRole("checkbox")).toBeTruthy();
  });

  it.each([
    ["feilstatus", async () => Response.json(DEMO, { status: 500 })],
    [
      "nettverksfeil",
      async () => {
        throw new TypeError("Failed to fetch");
      },
    ],
  ])(
    "FR-23: %s gir ingen banner, generell tekst og ingen avkrysning",
    async (_navn, svar) => {
      await monter(svar);

      expect(screen.queryByText(/^Demomodus:/)).toBeNull();
      expect(
        screen.getByText("CV-teksten sendes til en ekstern språkmodell."),
      ).toBeTruthy();
      expect(screen.queryByRole("checkbox")).toBeNull();
    },
  );
});

describe("startGenerering", () => {
  let svar: GapAnalyse;
  let okt: ReturnType<typeof useOkt>;

  beforeAll(async () => {
    svar = await demoSvar();
  });

  function Lytter() {
    okt = useOkt();
    return null;
  }

  async function vent() {
    await act(async () => {
      await new Promise((ferdig) => setTimeout(ferdig));
    });
  }

  function monterMed(mock: ReturnType<typeof apiMock>, streng = false) {
    vi.stubGlobal("fetch", mock);
    const tre = (
      <OktProvider>
        <Lytter />
      </OktProvider>
    );
    render(streng ? <StrictMode>{tre}</StrictMode> : tre);
  }

  it("AD-6: StrictMode gir én fetch til gap", async () => {
    const mock = apiMock(async () => Response.json(svar));
    monterMed(mock, true);

    act(() => okt.dispatch({ type: "eksempelValgt" }));
    await vent();

    expect(gapKall(mock)).toHaveLength(1);
    expect(okt.tilstand.innhold.resultatdeler.gap?.status).toBe("ferdig");
    expect(okt.tilstand.innhold.resultatdeler.gap?.generert).toEqual(svar);
  });

  it("AD-6: body er den maskerte kjøringen med demo: erEksempel", async () => {
    const mock = apiMock(async () => Response.json(svar));
    monterMed(mock);

    act(() => okt.dispatch({ type: "eksempelValgt" }));
    await vent();

    const [, init] = gapKall(mock)[0];
    const { kjoring } = okt.tilstand.innhold;
    expect(JSON.parse(String(init?.body))).toEqual({
      cvTekst: kjoring?.cvTekst,
      annonse: kjoring?.annonse,
      demo: true,
    });
  });

  it("AD-6: startGenerering mens gap genereres, sender ikke på nytt", async () => {
    let svarNa: (svar: Response) => void = () => {};
    const mock = apiMock(
      () => new Promise<Response>((ferdig) => (svarNa = ferdig)),
    );
    monterMed(mock);

    act(() => okt.dispatch({ type: "eksempelValgt" }));
    act(() => okt.startGenerering("gap"));
    expect(gapKall(mock)).toHaveLength(1);

    await act(async () => svarNa(Response.json(svar)));
    await vent();
    expect(okt.tilstand.innhold.resultatdeler.gap?.status).toBe("ferdig");
  });

  it("AD-6: Ny analyse avbryter, og svaret forkastes", async () => {
    let svarNa: (svar: Response) => void = () => {};
    const mock = apiMock(
      () => new Promise<Response>((ferdig) => (svarNa = ferdig)),
    );
    monterMed(mock);

    act(() => okt.dispatch({ type: "eksempelValgt" }));
    const [, init] = gapKall(mock)[0];
    act(() => okt.dispatch({ type: "nyAnalyseBekreftet" }));

    expect(init?.signal?.aborted).toBe(true);
    await act(async () => svarNa(Response.json(svar)));
    await vent();
    expect(okt.tilstand.innhold.resultatdeler.gap).toBeNull();
    expect(okt.tilstand.innhold.kjoring).toBeNull();
  });

  it("AD-6: Analyser på nytt avbryter den gamle requesten, og bare det nye svaret vises", async () => {
    const svarNa: ((svar: Response) => void)[] = [];
    const mock = apiMock(
      () => new Promise<Response>((ferdig) => svarNa.push(ferdig)),
    );
    monterMed(mock);

    act(() => okt.dispatch({ type: "eksempelValgt" }));
    const [, forste] = gapKall(mock)[0];
    act(() => okt.dispatch({ type: "personvernBekreftet" }));
    act(() => okt.dispatch({ type: "endreCvTrykket" }));
    act(() => okt.dispatch({ type: "analyserTrykket" }));

    expect(forste?.signal?.aborted).toBe(true);
    expect(gapKall(mock)).toHaveLength(2);
    await act(async () =>
      svarNa[0](Response.json({ ...svar, stilling: "Sent svar" })),
    );
    await vent();
    expect(okt.tilstand.innhold.resultatdeler.gap?.status).toBe("genererer");

    await act(async () => svarNa[1](Response.json(svar)));
    await vent();
    expect(okt.tilstand.innhold.resultatdeler.gap?.generert).toEqual(svar);
    expect(okt.tilstand.innhold.kjoring?.id).toBe(2);
  });

  it("AD-6: Endre CV-tekst under generering avbryter ikke, og svaret står etter Tilbake til resultatet", async () => {
    let svarNa: (svar: Response) => void = () => {};
    const mock = apiMock(
      () => new Promise<Response>((ferdig) => (svarNa = ferdig)),
    );
    monterMed(mock);

    act(() => okt.dispatch({ type: "eksempelValgt" }));
    const [, init] = gapKall(mock)[0];
    act(() => okt.dispatch({ type: "endreCvTrykket" }));

    expect(init?.signal?.aborted).toBe(false);
    await act(async () => svarNa(Response.json(svar)));
    await vent();
    act(() => okt.dispatch({ type: "tilbakeTilResultatet" }));

    expect(gapKall(mock)).toHaveLength(1);
    expect(okt.tilstand.visning).toBe("resultat");
    expect(okt.tilstand.innhold.resultatdeler.gap?.status).toBe("ferdig");
    expect(okt.tilstand.innhold.resultatdeler.gap?.generert).toEqual(svar);
  });

  it("AD-6: ny kjøring etter Ny analyse sender en ny request", async () => {
    const mock = apiMock(async () => Response.json(svar));
    monterMed(mock);

    act(() => okt.dispatch({ type: "eksempelValgt" }));
    await vent();
    act(() => okt.dispatch({ type: "nyAnalyseBekreftet" }));
    act(() => okt.dispatch({ type: "eksempelValgt" }));
    await vent();

    expect(gapKall(mock)).toHaveLength(2);
    expect(okt.tilstand.innhold.resultatdeler.gap?.status).toBe("ferdig");
  });

  it("AD-8: feil fra API-et gir gap feil med feilkoden", async () => {
    const mock = apiMock(async () =>
      Response.json({ feil: { kode: "llm_feil" } }, { status: 502 }),
    );
    monterMed(mock);

    act(() => okt.dispatch({ type: "eksempelValgt" }));
    await vent();

    expect(okt.tilstand.innhold.resultatdeler.gap).toMatchObject({
      status: "feil",
      feilkode: "llm_feil",
    });
  });

  it("AD-6: Prøv igjen etter feil sender én ny POST for samme kjøring og forkaster ikke svaret", async () => {
    let feiler = true;
    const mock = apiMock(async () =>
      feiler
        ? Response.json({ feil: { kode: "llm_tidsavbrudd" } }, { status: 504 })
        : Response.json(svar),
    );
    monterMed(mock, true);

    act(() => okt.dispatch({ type: "eksempelValgt" }));
    await vent();
    const { kjoring, utkast } = okt.tilstand.innhold;
    expect(okt.tilstand.innhold.resultatdeler.gap?.status).toBe("feil");

    feiler = false;
    act(() => okt.startGenerering("gap"));
    expect(okt.tilstand.innhold.resultatdeler.gap?.status).toBe("genererer");
    await vent();

    const kall = gapKall(mock);
    expect(kall).toHaveLength(2);
    expect(kall[1][1]?.body).toBe(kall[0][1]?.body);
    expect(okt.tilstand.innhold.kjoring).toBe(kjoring);
    expect(okt.tilstand.innhold.utkast).toEqual(utkast);
    expect(okt.tilstand.innhold.resultatdeler.gap).toMatchObject({
      status: "ferdig",
      feilkode: null,
      generert: svar,
    });
  });
});
