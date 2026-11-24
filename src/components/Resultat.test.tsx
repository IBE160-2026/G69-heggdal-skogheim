// @vitest-environment jsdom
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import Home from "@/app/page";
import type { GapAnalyse } from "@/lib/kontrakt/gap";
import { OktProvider } from "@/lib/okt/OktProvider";
import { apiMock, demoSvar, gapKall } from "@/testhjelp/gap";

import { ANALYSER_ID, CV_FELT_ID, VELG_CV_ID } from "./CvPanel";
import { Kunngjoring } from "./Kunngjoring";

let svar: GapAnalyse;
let mock: ReturnType<typeof apiMock>;
let svarNa: (svar: Response) => void;
let svarAvvist: (feil: Error) => void;

beforeAll(async () => {
  svar = await demoSvar();
});

beforeEach(() => {
  // Menyen «Valg» måler størrelsen sin, og jsdom har ikke ResizeObserver.
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

async function vent() {
  await act(async () => {
    await new Promise((ferdig) => setTimeout(ferdig));
  });
}

// Starter eksempelet og holder svaret tilbake til testen kaller `svarNa`.
async function apneEksempelet() {
  mock = apiMock(
    () =>
      new Promise<Response>((ferdig, feil) => {
        svarNa = ferdig;
        svarAvvist = feil;
      }),
  );
  vi.stubGlobal("fetch", mock);
  await act(async () => {
    render(
      <OktProvider>
        <Home />
        <Kunngjoring />
      </OktProvider>,
    );
  });
  fireEvent.click(screen.getByRole("button", { name: "Prøv med eksempel" }));
}

async function svar200() {
  await act(async () => svarNa(Response.json(svar)));
  await vent();
}

async function svarFeil(feil: Response) {
  await act(async () => svarNa(feil));
  await vent();
}

function live() {
  return document.querySelector("[aria-live=polite]")?.textContent;
}

function panel() {
  return screen.getByRole("tabpanel");
}

describe("Resultat", () => {
  it("UX-DR24: «Resultat» er h1 med tabindex -1 og får fokus", async () => {
    await apneEksempelet();

    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1.textContent).toBe("Resultat");
    expect(h1.getAttribute("tabindex")).toBe("-1");
    expect(document.activeElement).toBe(h1);
    expect(document.querySelectorAll("h1")).toHaveLength(1);
  });

  it("UX-DR10: én fane, Gap-analyse og nøkkelord, i en tabliste", async () => {
    await apneEksempelet();

    const faner = screen.getAllByRole("tab");
    expect(faner).toHaveLength(1);
    expect(faner[0].textContent).toContain("Gap-analyse og nøkkelord");
    expect(faner[0].getAttribute("aria-selected")).toBe("true");
    expect(screen.getByRole("tablist")).toBeTruthy();
  });

  it("UX-DR19: under lasting er panelet aria-busy, fanen har «, genereres» og live-regionen melder start", async () => {
    await apneEksempelet();

    expect(panel().getAttribute("aria-busy")).toBe("true");
    expect(screen.getByRole("tab").textContent).toBe(
      "Gap-analyse og nøkkelord, genereres",
    );
    expect(live()).toBe("Analyserer. Dette tar inntil 30 sekunder.");
    // Stilling og arbeidsgiver er skjelett til de finnes.
    expect(screen.queryByRole("heading", { level: 2 })).toBeNull();
    expect(
      document.querySelector("header [data-slot=skeleton]")?.closest(
        "[aria-hidden=true]",
      ),
    ).not.toBeNull();
  });

  it("FR-7: ferdig viser stilling og arbeidsgiver, og live-regionen melder at analysen er klar", async () => {
    await apneEksempelet();
    await svar200();

    expect(screen.getByRole("heading", { level: 2 }).textContent).toBe(
      "Sommervikar – kundebehandler",
    );
    expect(screen.getByText("Sparebanken Testvik")).toBeTruthy();
    expect(panel().hasAttribute("aria-busy")).toBe(false);
    expect(screen.getByRole("tab").textContent).toBe(
      "Gap-analyse og nøkkelord",
    );
    expect(live()).toBe("Gap-analysen er klar. 3 av 6 krav er oppfylt.");
    expect(gapKall(mock)).toHaveLength(1);
    // Fokus flyttes ikke når fanen er ferdig.
    expect(document.activeElement).toBe(
      screen.getByRole("heading", { level: 1 }),
    );
  });

  it("AD-8: feil viser bare «Resultat» og Alert i fanen", async () => {
    await apneEksempelet();
    await act(async () =>
      svarNa(Response.json({ feil: { kode: "llm_feil" } }, { status: 502 })),
    );
    await vent();

    expect(document.querySelector("header [data-slot=skeleton]")).toBeNull();
    expect(screen.queryByRole("heading", { level: 2 })).toBeNull();
    expect(panel().querySelector("[role=alert]")).not.toBeNull();
  });

  it("UX-DR20: Prøv igjen sender én ny POST for samme kjøring, gir fokus til panelet, viser skjelett og så resultatet", async () => {
    await apneEksempelet();
    await svarFeil(Response.json({ feil: { kode: "llm_feil" } }, { status: 502 }));
    expect(panel().getAttribute("tabindex")).toBe("-1");
    // Fanen peker fortsatt på panelet.
    expect(screen.getByRole("tab").getAttribute("aria-controls")).toBe(panel().id);

    fireEvent.click(screen.getByRole("button", { name: "Prøv igjen" }));

    const kall = gapKall(mock);
    expect(kall).toHaveLength(2);
    expect(kall[1][1]?.body).toBe(kall[0][1]?.body);
    expect(document.activeElement).toBe(panel());
    expect(panel().getAttribute("aria-busy")).toBe("true");
    expect(panel().querySelector("[data-slot=skeleton]")).not.toBeNull();
    expect(screen.queryByRole("alert")).toBeNull();

    await svar200();

    expect(screen.getByRole("heading", { level: 2 }).textContent).toBe(
      "Sommervikar – kundebehandler",
    );
    expect(gapKall(mock)).toHaveLength(2);
  });

  it("SM-7: en ny feil etter Prøv igjen vises på nytt", async () => {
    await apneEksempelet();
    await svarFeil(Response.json({ feil: { kode: "llm_feil" } }, { status: 502 }));
    fireEvent.click(screen.getByRole("button", { name: "Prøv igjen" }));

    await svarFeil(new Response("<html>", { status: 504 }));

    expect(screen.getByRole("alert").textContent).toContain(
      "Språkmodellen svarte ikke. Teksten din er tatt vare på. Prøv igjen, eller bruk Prøv med eksempel.",
    );
    expect(screen.getByRole("button", { name: "Prøv igjen" })).toBeTruthy();
  });

  it.each<[string, () => Response, string]>([
    [
      "504 uten JSON",
      () => new Response("Gateway Timeout", { status: 504 }),
      "Språkmodellen svarte ikke. Teksten din er tatt vare på. Prøv igjen, eller bruk Prøv med eksempel.",
    ],
    [
      "svar som ikke er JSON",
      () => new Response("<html>", { status: 500 }),
      "Språkmodellen svarte ikke. Teksten din er tatt vare på. Prøv igjen, eller bruk Prøv med eksempel.",
    ],
    [
      "ugyldig_svar",
      () => Response.json({ feil: { kode: "ugyldig_svar" } }, { status: 502 }),
      "Svaret fra språkmodellen kunne ikke brukes. Prøv igjen.",
    ],
  ])(
    "SM-7: %s gir meldingen og Prøv igjen, teksten er urørt og live-regionen gjentar ikke feilen",
    async (_navn, lag, melding) => {
      await apneEksempelet();
      await svarFeil(lag());

      expect(screen.getByRole("alert").textContent).toContain(melding);
      expect(screen.getByRole("button", { name: "Prøv igjen" })).toBeTruthy();
      expect(live()).toBe("");

      fireEvent.click(screen.getByRole("button", { name: "Endre CV-tekst" }));
      expect(
        (screen.getByLabelText("Annonse") as HTMLTextAreaElement).value,
      ).toContain("Sparebanken Testvik");
      expect(
        (screen.getByLabelText("CV-tekst") as HTMLTextAreaElement).value,
      ).not.toBe("");
    },
  );

  it("SM-7: nettverksfeil gir llm_feil med Prøv igjen", async () => {
    await apneEksempelet();
    await act(async () => svarAvvist(new TypeError("Failed to fetch")));
    await vent();

    expect(screen.getByRole("alert").textContent).toContain(
      "Språkmodellen svarte ikke. Teksten din er tatt vare på. Prøv igjen, eller bruk Prøv med eksempel.",
    );
    expect(screen.getByRole("button", { name: "Prøv igjen" })).toBeTruthy();
  });

  it("NFR-3: grense_naadd har ingen Prøv igjen, og Prøv med eksempel i varselet viser eksempelet", async () => {
    await apneEksempelet();
    await svarFeil(
      Response.json({ feil: { kode: "grense_naadd" } }, { status: 429 }),
    );

    expect(screen.queryByRole("button", { name: "Prøv igjen" })).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Prøv med eksempel" }));
    fireEvent.click(screen.getByRole("button", { name: "Bruk eksempelet" }));
    expect(gapKall(mock)).toHaveLength(2);
    await svar200();

    expect(screen.queryByRole("alert")).toBeNull();
    expect(screen.getByRole("heading", { level: 2 }).textContent).toBe(
      "Sommervikar – kundebehandler",
    );
  });

  it("NFR-3: llm_feil på egen tekst (for eksempel oppbrukt kreditt) har både Prøv igjen og Prøv med eksempel, og Prøv med eksempel viser eksempelet", async () => {
    mock = apiMock(
      () =>
        new Promise<Response>((ferdig) => {
          svarNa = ferdig;
        }),
      "ekte",
    );
    vi.stubGlobal("fetch", mock);
    await act(async () => {
      render(
        <OktProvider>
          <Home />
          <Kunngjoring />
        </OktProvider>,
      );
    });
    fireEvent.click(screen.getByRole("button", { name: "Lim inn CV-teksten" }));
    fireEvent.change(screen.getByLabelText("CV-tekst"), {
      target: { value: "Kari Nordmann\nButikkmedarbeider i fem år." },
    });
    fireEvent.change(screen.getByLabelText("Annonse"), {
      target: { value: "Vi søker en kundebehandler. ".repeat(10) },
    });
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(document.getElementById(ANALYSER_ID)!);
    await vent();
    expect(JSON.parse(String(gapKall(mock)[0][1]?.body)).demo).not.toBe(true);

    await svarFeil(Response.json({ feil: { kode: "llm_feil" } }, { status: 502 }));

    const varsel = screen.getByRole("alert");
    expect(
      Array.from(varsel.querySelectorAll("button")).map((k) => k.textContent),
    ).toEqual(["Prøv igjen", "Prøv med eksempel"]);
    fireEvent.click(
      Array.from(varsel.querySelectorAll("button")).find(
        (k) => k.textContent === "Prøv med eksempel",
      )!,
    );
    fireEvent.click(screen.getByRole("button", { name: "Bruk eksempelet" }));
    expect(gapKall(mock)).toHaveLength(2);
    await svar200();

    expect(screen.queryByRole("alert")).toBeNull();
    expect(screen.getByRole("heading", { level: 2 }).textContent).toBe(
      "Sommervikar – kundebehandler",
    );
  });

  it("UX-DR10: etter redigering viser fanen «· redigert», som er en del av navnet", async () => {
    await apneEksempelet();
    await svar200();

    fireEvent.change(document.getElementById("krav-0-tekst")!, {
      target: { value: "Endret krav" },
    });

    expect(
      screen.getByRole("tab", {
        name: "Gap-analyse og nøkkelord · redigert",
      }),
    ).toBeTruthy();
    expect(screen.getByRole("tab").textContent).toBe(
      "Gap-analyse og nøkkelord · redigert",
    );
  });

  it("UX-DR11: verktøylinjen står over skjelettet under generering og vises ikke ved feil", async () => {
    await apneEksempelet();

    const kopier = screen.getByRole("button", { name: "Kopier" });
    expect(kopier.getAttribute("aria-disabled")).toBe("true");
    expect(panel().firstElementChild?.contains(kopier)).toBe(true);
    expect(panel().querySelector("[data-slot=skeleton]")).not.toBeNull();

    await svarFeil(Response.json({ feil: { kode: "llm_feil" } }, { status: 502 }));

    expect(screen.queryByRole("button", { name: "Kopier" })).toBeNull();
    expect(screen.queryByRole("button", { name: "Generer på nytt" })).toBeNull();
  });

  it("FR-19: når Generer på nytt feiler, står den redigerte analysen igjen under varselet", async () => {
    await apneEksempelet();
    await svar200();
    fireEvent.change(document.getElementById("krav-0-tekst")!, {
      target: { value: "Endret krav" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Generer på nytt" }));
    fireEvent.click(screen.getByRole("button", { name: "Lag ny" }));
    await vent();

    // Under genereringen ser alt ut som før: skjelett, spinner og ikke «· redigert».
    expect(panel().querySelector("[data-slot=skeleton]")).not.toBeNull();
    expect(document.getElementById("krav-0-tekst")).toBeNull();
    expect(screen.queryByRole("heading", { level: 2 })).toBeNull();
    expect(screen.getByRole("tab").textContent).toBe(
      "Gap-analyse og nøkkelord, genereres",
    );

    await svarFeil(Response.json({ feil: { kode: "llm_feil" } }, { status: 502 }));

    const varsel = screen.getByRole("alert");
    expect(varsel.textContent).toContain("Språkmodellen svarte ikke.");
    expect(
      Array.from(varsel.querySelectorAll("button")).map((k) => k.textContent),
    ).toEqual(["Prøv med eksempel"]);
    expect(
      (document.getElementById("krav-0-tekst") as HTMLTextAreaElement).value,
    ).toBe("Endret krav");
    expect(
      varsel.compareDocumentPosition(document.getElementById("krav-0-tekst")!) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(screen.getByRole("heading", { level: 2 }).textContent).toBe(
      svar.stilling,
    );
    expect(screen.getByRole("tab").textContent).toBe(
      "Gap-analyse og nøkkelord · redigert",
    );
    expect(panel().getAttribute("aria-busy")).toBeNull();
    expect(live()).not.toContain("svarte ikke");
    const generer = screen.getByRole("button", { name: "Generer på nytt" });
    expect(generer.getAttribute("aria-disabled")).toBeNull();
    expect(
      screen.getByRole("button", { name: "Kopier" }).getAttribute("aria-disabled"),
    ).toBeNull();

    // Ny generering herfra går gjennom dialogen, og et svar erstatter analysen.
    fireEvent.click(generer);
    fireEvent.click(screen.getByRole("button", { name: "Lag ny" }));
    await vent();
    await svar200();

    expect(screen.queryByRole("alert")).toBeNull();
    expect(
      (document.getElementById("krav-0-tekst") as HTMLTextAreaElement).value,
    ).toBe(svar.krav[0].tekst);
    expect(screen.getByRole("tab").textContent).toBe("Gap-analyse og nøkkelord");
  });

  it("FR-24: i demomodus gir Generer på nytt demosvaret igjen, og fetch går bare til egne ruter", async () => {
    await apneEksempelet();
    await svar200();
    fireEvent.change(document.getElementById("krav-0-tekst")!, {
      target: { value: "Endret krav" },
    });

    const knapp = screen.getByRole("button", { name: "Generer på nytt" });
    fireEvent.click(knapp);
    fireEvent.click(screen.getByRole("button", { name: "Lag ny" }));
    await vent();

    const kall = gapKall(mock);
    expect(kall).toHaveLength(2);
    expect(kall[1][1]?.body).toBe(kall[0][1]?.body);
    expect(JSON.parse(String(kall[1][1]?.body)).demo).toBe(true);
    // Skjelettet vises under ny generering, og knappen beholder fokus.
    expect(panel().querySelector("[data-slot=skeleton]")).not.toBeNull();
    expect(document.activeElement).toBe(knapp);
    expect(knapp.getAttribute("aria-disabled")).toBe("true");

    await svar200();

    expect(
      (document.getElementById("krav-0-tekst") as HTMLTextAreaElement).value,
    ).toBe(svar.krav[0].tekst);
    expect(screen.getByRole("tab").textContent).toBe("Gap-analyse og nøkkelord");
    expect(live()).toBe("Gap-analysen er klar. 3 av 6 krav er oppfylt.");
    for (const [url] of mock.mock.calls) {
      expect(["/api/status", "/api/generer/gap"]).toContain(String(url));
    }
  });

  it("UX-DR24: Endre CV-tekst under generering viser forberedelsen med teksten beholdt og fokus i CV-feltet, og avbryter ikke", async () => {
    await apneEksempelet();
    expect(panel().getAttribute("aria-busy")).toBe("true");
    const [, init] = gapKall(mock)[0];

    fireEvent.click(screen.getByRole("button", { name: "Endre CV-tekst" }));

    expect(screen.queryByRole("heading", { name: "Resultat" })).toBeNull();
    expect(document.activeElement).toBe(document.getElementById(CV_FELT_ID));
    expect(
      (screen.getByLabelText("Annonse") as HTMLTextAreaElement).value,
    ).toContain("Sparebanken Testvik");
    expect(init?.signal?.aborted).toBe(false);
    expect(live()).toBe("Analyserer. Dette tar inntil 30 sekunder.");
  });

  it("FR-3: Endre CV-tekst og Tilbake til resultatet gir resultatet uten ny request, med redigeringen og «· redigert»", async () => {
    await apneEksempelet();
    await svar200();
    fireEvent.change(document.getElementById("krav-0-tekst")!, {
      target: { value: "Endret krav" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Endre CV-tekst" }));
    expect(document.activeElement).toBe(document.getElementById(CV_FELT_ID));
    fireEvent.click(
      screen.getByRole("button", { name: "Tilbake til resultatet" }),
    );

    expect(document.activeElement).toBe(
      screen.getByRole("heading", { level: 1 }),
    );
    expect(gapKall(mock)).toHaveLength(1);
    expect(
      (document.getElementById("krav-0-tekst") as HTMLTextAreaElement).value,
    ).toBe("Endret krav");
    expect(screen.getByRole("tab").textContent).toBe(
      "Gap-analyse og nøkkelord · redigert",
    );
  });

  it("FR-3: Tilbake til resultatet under generering viser spinneren, og svaret vises når det kommer", async () => {
    await apneEksempelet();
    fireEvent.click(screen.getByRole("button", { name: "Endre CV-tekst" }));

    fireEvent.click(
      screen.getByRole("button", { name: "Tilbake til resultatet" }),
    );

    expect(screen.getByRole("tab").textContent).toBe(
      "Gap-analyse og nøkkelord, genereres",
    );
    await svar200();
    expect(screen.getByRole("heading", { level: 2 }).textContent).toBe(
      svar.stilling,
    );
    expect(gapKall(mock)).toHaveLength(1);
  });

  it("FR-3: svaret som kommer mens forberedelsen vises, står etter Tilbake til resultatet", async () => {
    await apneEksempelet();
    fireEvent.click(screen.getByRole("button", { name: "Endre CV-tekst" }));

    await svar200();
    fireEvent.click(
      screen.getByRole("button", { name: "Tilbake til resultatet" }),
    );

    expect(screen.getByRole("heading", { level: 2 }).textContent).toBe(
      svar.stilling,
    );
    expect(gapKall(mock)).toHaveLength(1);
  });

  it("FR-21: Ny analyse spør først, og Avbryt endrer ingenting og gir fokus tilbake til knappen", async () => {
    await apneEksempelet();
    await svar200();
    const knapp = screen.getByRole("button", { name: "Ny analyse" });

    fireEvent.click(knapp);
    const dialog = screen.getByRole("alertdialog");
    expect(dialog.textContent).toContain("Tømme alt?");
    expect(dialog.textContent).toContain(
      "CV-teksten, annonsen og alle resultatdelene fjernes.",
    );
    expect(document.activeElement).toBe(
      screen.getByRole("button", { name: "Avbryt" }),
    );

    fireEvent.click(screen.getByRole("button", { name: "Avbryt" }));
    await vent();

    expect(screen.queryByRole("alertdialog")).toBeNull();
    expect(document.activeElement).toBe(knapp);
    expect(screen.getByRole("heading", { level: 2 }).textContent).toBe(
      svar.stilling,
    );
  });

  it("FR-21: Tøm alt gir tom forberedelse med fokus på Velg CV-fil, og live-meldingen fjernes", async () => {
    await apneEksempelet();
    await svar200();

    fireEvent.click(screen.getByRole("button", { name: "Ny analyse" }));
    fireEvent.click(screen.getByRole("button", { name: "Tøm alt" }));
    await vent();

    expect(screen.queryByRole("heading", { name: "Resultat" })).toBeNull();
    expect(document.activeElement).toBe(document.getElementById(VELG_CV_ID));
    expect(
      (screen.getByLabelText("Annonse") as HTMLTextAreaElement).value,
    ).toBe("");
    expect(screen.queryByLabelText("CV-tekst")).toBeNull();
    expect(
      screen.queryByRole("button", { name: "Tilbake til resultatet" }),
    ).toBeNull();
    expect(live()).toBe("");
  });

  it("AD-6: Tøm alt under generering avbryter requesten, og svaret vises ikke", async () => {
    await apneEksempelet();
    const [, init] = gapKall(mock)[0];

    fireEvent.click(screen.getByRole("button", { name: "Ny analyse" }));
    fireEvent.click(screen.getByRole("button", { name: "Tøm alt" }));

    expect(init?.signal?.aborted).toBe(true);
    await svar200();
    expect(screen.queryByRole("heading", { name: "Resultat" })).toBeNull();
  });

  describe("menyen «Valg» under 640 px", () => {
    function apneMeny() {
      const valg = screen.getByRole("button", { name: "Valg" });
      valg.focus();
      fireEvent.keyDown(valg, { key: "Enter" });
      return valg;
    }

    function menyvalg(navn: string) {
      return screen.getByRole("menuitem", { name: navn });
    }

    it("UX-DR9: menyen har Endre CV-tekst og Ny analyse", async () => {
      await apneEksempelet();
      await svar200();

      apneMeny();

      expect(
        screen.getAllByRole("menuitem").map((valg) => valg.textContent),
      ).toEqual(["Endre CV-tekst", "Ny analyse"]);
    });

    it("UX-DR24: Endre CV-tekst i menyen gir fokus i CV-feltet", async () => {
      await apneEksempelet();
      await svar200();

      apneMeny();
      fireEvent.click(menyvalg("Endre CV-tekst"));
      await vent();

      expect(screen.queryByRole("heading", { name: "Resultat" })).toBeNull();
      expect(document.activeElement).toBe(document.getElementById(CV_FELT_ID));
    });

    it("UX-DR18: Ny analyse i menyen åpner dialogen, og Avbryt gir fokus til «Valg»", async () => {
      await apneEksempelet();
      await svar200();

      const valg = apneMeny();
      fireEvent.click(menyvalg("Ny analyse"));
      await vent();

      expect(screen.queryByRole("menu")).toBeNull();
      expect(screen.getByRole("alertdialog").textContent).toContain(
        "Tømme alt?",
      );
      expect(document.activeElement).toBe(
        screen.getByRole("button", { name: "Avbryt" }),
      );

      fireEvent.click(screen.getByRole("button", { name: "Avbryt" }));
      await vent();

      expect(document.activeElement).toBe(valg);
      expect(screen.getByRole("heading", { level: 1 })).toBeTruthy();
    });

    it("UX-DR24: Tøm alt fra menyen gir fokus på Velg CV-fil", async () => {
      await apneEksempelet();
      await svar200();

      apneMeny();
      fireEvent.click(menyvalg("Ny analyse"));
      await vent();
      fireEvent.click(screen.getByRole("button", { name: "Tøm alt" }));
      await vent();

      expect(document.activeElement).toBe(document.getElementById(VELG_CV_ID));
    });
  });

  it("FR-19: Endre CV-tekst, Tilbake til resultatet og Generer på nytt som feiler, beholder redigeringen og varselet som før (PR #41, PR #42)", async () => {
    await apneEksempelet();
    await svar200();
    fireEvent.change(document.getElementById("krav-0-tekst")!, {
      target: { value: "Endret krav" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Endre CV-tekst" }));
    fireEvent.click(
      screen.getByRole("button", { name: "Tilbake til resultatet" }),
    );

    fireEvent.click(screen.getByRole("button", { name: "Generer på nytt" }));
    fireEvent.click(screen.getByRole("button", { name: "Lag ny" }));
    await vent();
    await svarFeil(Response.json({ feil: { kode: "llm_feil" } }, { status: 502 }));

    const varsel = screen.getByRole("alert");
    expect(varsel.textContent).toContain("Språkmodellen svarte ikke.");
    // Med en forrige analyse har varselet ikke Prøv igjen (PR #41): Generer på nytt
    // gjør det samme.
    expect(
      Array.from(varsel.querySelectorAll("button")).map((k) => k.textContent),
    ).toEqual(["Prøv med eksempel"]);
    expect(
      (document.getElementById("krav-0-tekst") as HTMLTextAreaElement).value,
    ).toBe("Endret krav");
    expect(screen.getByRole("tab").textContent).toBe(
      "Gap-analyse og nøkkelord · redigert",
    );
  });

  it("NFR-3: Endre CV-tekst og Tilbake til resultatet etter en feil uten analyse gir Prøv igjen og Prøv med eksempel, og Prøv med eksempel viser eksempelet", async () => {
    await apneEksempelet();
    await svarFeil(Response.json({ feil: { kode: "llm_feil" } }, { status: 502 }));
    fireEvent.click(screen.getByRole("button", { name: "Endre CV-tekst" }));
    fireEvent.click(
      screen.getByRole("button", { name: "Tilbake til resultatet" }),
    );

    const varsel = screen.getByRole("alert");
    const knapper = Array.from(varsel.querySelectorAll("button"));
    expect(knapper.map((k) => k.textContent)).toEqual([
      "Prøv igjen",
      "Prøv med eksempel",
    ]);

    fireEvent.click(knapper[1]);
    fireEvent.click(screen.getByRole("button", { name: "Bruk eksempelet" }));
    expect(gapKall(mock)).toHaveLength(2);
    await svar200();

    expect(screen.queryByRole("alert")).toBeNull();
    expect(screen.getByRole("heading", { level: 2 }).textContent).toBe(
      svar.stilling,
    );
  });
});
