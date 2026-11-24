// @vitest-environment jsdom
import { readFileSync } from "node:fs";

import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
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
import type { Modus } from "@/lib/kontrakt/status";
import { OktProvider } from "@/lib/okt/OktProvider";
import { startTilstand, type OktTilstand } from "@/lib/okt/tilstand";
import { apiMock, demoSvar, gapKall } from "@/testhjelp/gap";

import { AnalyserKnapp, DEMO_VARSEL_ID, ENDRET_TEKST } from "./AnalyserKnapp";
import { ANALYSER_ID, CvPanel } from "./CvPanel";

const VARSEL =
  "Full analyse av din egen CV krever en API-nøkkel. Prøv eksempelet for å se hvordan resultatet ser ut.";
const FJERNET = "[fødselsnummer fjernet]";
const DEMO_CV = readFileSync("testdata/par-1-butikk-bank/cv.txt", "utf8");
const DEMO_ANNONSE = readFileSync(
  "testdata/par-1-butikk-bank/annonse.txt",
  "utf8",
);

function vis(tilstand: OktTilstand) {
  return renderToStaticMarkup(
    <OktProvider startTilstand={tilstand}>
      <AnalyserKnapp />
    </OktProvider>,
  );
}

const KLAR: OktTilstand = {
  okt: { ...startTilstand.okt, bekreftetPersonvern: true },
  innhold: {
    ...startTilstand.innhold,
    utkast: { cvTekst: "CV-tekst", annonse: "a".repeat(200) },
    cvFil: null,
    demoVarsel: null,
  },
  visning: "forberedelse",
  kunngjoring: null,
};

describe("AnalyserKnapp", () => {
  it("FR-4: uten vilkår er knappen aria-disabled, men kan få fokus", () => {
    const html = vis(startTilstand);

    expect(html).toContain('aria-disabled="true"');
    expect(html).toContain('aria-describedby="analyser-arsaker"');
    expect(html).not.toMatch(/\sdisabled(=|>|\s)/);
    expect(html).not.toContain('tabindex="-1"');
  });

  it("FR-4: årsakene står i listen i riktig rekkefølge", () => {
    expect(vis(startTilstand)).toMatch(
      /<ul id="analyser-arsaker"[^>]*><li>Last opp eller lim inn CV-en din\.<\/li><li>Lim inn annonsen\.<\/li><li>Kryss av for personvern\.<\/li><\/ul>/,
    );
  });

  it("FR-4: årsaken om CV står alltid før annonse og avkrysning", () => {
    const html = vis({
      ...startTilstand,
      innhold: {
        ...startTilstand.innhold,
        utkast: { cvTekst: "", annonse: "a".repeat(8001) },
        cvFil: null,
        demoVarsel: null,
      },
    });

    expect(html).toContain(
      "<li>Last opp eller lim inn CV-en din.</li><li>Annonsen kan være maks 8 000 tegn.</li>",
    );
  });

  it("FR-4: med alle vilkår oppfylt er knappen aktiv uten årsaker", () => {
    const html = vis(KLAR);

    expect(html).not.toContain('aria-disabled="');
    expect(html).not.toContain("aria-describedby");
    expect(html).not.toContain("<ul");
  });

  it("UX-DR1: knappen har ikke redusert opasitet og beholder full tekstkontrast", () => {
    const html = vis(startTilstand);

    expect(html).not.toContain("opacity-");
    expect(html).toContain("aria-disabled:bg-primary/50");
    expect(html).toContain("aria-disabled:text-foreground");
  });

  it("FR-26: uten trykk vises ikke varselet", () => {
    expect(vis(KLAR)).not.toContain(DEMO_VARSEL_ID);
  });
});

describe("AnalyserKnapp i demomodus", () => {
  let fetchMock: ReturnType<typeof vi.fn>;
  let modus: Modus = "demo";

  beforeEach(() => {
    modus = "demo";
    fetchMock = vi.fn(async () =>
      Response.json({
        modus,
        leverandor: { navn: "Mistral AI", land: "Frankrike", tredjeland: false },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  // Statusen hentes fra /api/status som i appen, så modus settes av den.
  async function monter(cvTekst: string, annonse = "a".repeat(200)) {
    const start: OktTilstand = {
      ...startTilstand,
      okt: { ...startTilstand.okt, bekreftetPersonvern: true },
      innhold: { ...startTilstand.innhold, utkast: { cvTekst, annonse } },
    };
    await act(async () => {
      render(
        <OktProvider startTilstand={start}>
          <CvPanel />
          <AnalyserKnapp />
        </OktProvider>,
      );
    });
    expect(fetchMock).toHaveBeenCalledWith("/api/status", expect.anything());
  }

  function analyser() {
    return document.getElementById(ANALYSER_ID) as HTMLButtonElement;
  }

  function varsel() {
    return document.getElementById(DEMO_VARSEL_ID);
  }

  function beskrivelse(alert: HTMLElement | null) {
    return alert?.querySelector("[data-slot=alert-description]")?.textContent;
  }

  function bareStatusKall() {
    for (const [url] of fetchMock.mock.calls) {
      expect(String(url)).not.toContain("/api/generer");
      expect(url).toBe("/api/status");
    }
  }

  it("FR-26: egen CV gir varselet over Analyser, fokus på varselet og ingen request", async () => {
    await monter("Kari Nordmann\nKundeservice i fem år.");
    analyser().focus();

    fireEvent.click(analyser());

    const alert = varsel();
    expect(beskrivelse(alert)).toBe(VARSEL);
    expect(alert?.getAttribute("data-slot")).toBe("alert");
    // Fokus flyttes hit, så varselet skal ikke også være en live-region.
    expect(alert?.hasAttribute("role")).toBe(false);
    expect(alert?.getAttribute("tabindex")).toBe("-1");
    expect(document.activeElement).toBe(alert);
    // Varselet står rett over knappen.
    expect(alert?.nextElementSibling).toBe(analyser());
    expect(screen.getByLabelText("CV-tekst")).toBeTruthy();
    bareStatusKall();
  });

  it("UX-DR24: nytt trykk beholder varselet og flytter fokus dit igjen", async () => {
    await monter("Kari Nordmann");
    fireEvent.click(analyser());
    const forste = varsel();

    analyser().focus();
    expect(document.activeElement).toBe(analyser());
    fireEvent.click(analyser());

    expect(varsel()).toBe(forste);
    expect(document.activeElement).toBe(forste);
    bareStatusKall();
  });

  it("FR-26: varselet forsvinner når CV-teksten endres", async () => {
    await monter("Kari Nordmann");
    fireEvent.click(analyser());
    expect(varsel()).not.toBeNull();

    fireEvent.change(screen.getByLabelText("CV-tekst"), {
      target: { value: "Kari Nordmann, Molde" },
    });

    expect(varsel()).toBeNull();
  });

  it("FR-26: demoeksempelet gir ikke varselet, men én POST til gap", async () => {
    await monter(DEMO_CV.replace(/\n/g, "\r\n"), DEMO_ANNONSE);

    await act(async () => {
      fireEvent.click(analyser());
    });

    expect(varsel()).toBeNull();
    const gap = fetchMock.mock.calls.filter(
      ([url]) => url === "/api/generer/gap",
    );
    expect(gap).toHaveLength(1);
    expect(JSON.parse(String(gap[0][1].body)).demo).toBe(true);
  });

  it("FR-26: varselet har knappen Prøv med eksempel", async () => {
    await monter("Kari Nordmann");

    await act(async () => {
      fireEvent.click(analyser());
    });

    expect(
      varsel()?.querySelector("button")?.textContent,
    ).toBe("Prøv med eksempel");
  });

  it("FR-7: ekte modus gir ikke varselet, men sender gap-analysen med egen CV", async () => {
    modus = "ekte";
    await monter("Kari Nordmann");

    await act(async () => {
      fireEvent.click(analyser());
    });

    expect(varsel()).toBeNull();
    const generer = fetchMock.mock.calls.filter(([url]) => url !== "/api/status");
    expect(generer).toHaveLength(1);
    const [url, init] = generer[0] as [string, RequestInit];
    expect(url).toBe("/api/generer/gap");
    expect(JSON.parse(String(init.body))).toEqual({
      cvTekst: "Kari Nordmann",
      annonse: "a".repeat(200),
      demo: false,
    });
  });

  it("FR-6: nytt fødselsnummer maskeres først, og andre trykk gir varselet", async () => {
    await monter("Kari Nordmann 01019012345");
    const felt = screen.getByLabelText("CV-tekst") as HTMLTextAreaElement;

    fireEvent.click(analyser());
    expect(felt.value).toBe(`Kari Nordmann ${FJERNET}`);
    expect(varsel()).toBeNull();

    fireEvent.click(analyser());
    expect(beskrivelse(varsel())).toBe(VARSEL);
    bareStatusKall();
  });

  it("FR-4: deaktivert Analyser gir ikke varselet", async () => {
    await monter("Kari Nordmann", "for kort");

    expect(analyser().getAttribute("aria-disabled")).toBe("true");
    fireEvent.click(analyser());

    expect(varsel()).toBeNull();
  });
});

describe("AnalyserKnapp etter Endre CV-tekst", () => {
  let mock: ReturnType<typeof apiMock>;
  let svar: GapAnalyse;
  let svarNa: ((svar: Response) => void)[];

  beforeAll(async () => {
    svar = await demoSvar();
  });

  beforeEach(() => {
    // Menyen «Valg» på resultatsiden måler størrelsen sin, og jsdom har ikke
    // ResizeObserver.
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

  // Eksempelet vises, og svarene holdes tilbake til testen gir dem.
  async function apneEksempelet() {
    svarNa = [];
    mock = apiMock(() => new Promise<Response>((ferdig) => svarNa.push(ferdig)));
    vi.stubGlobal("fetch", mock);
    await act(async () => {
      render(
        <OktProvider>
          <Home />
        </OktProvider>,
      );
    });
    fireEvent.click(screen.getByRole("button", { name: "Prøv med eksempel" }));
  }

  async function gi(svarEtter: Response) {
    await act(async () => svarNa[svarNa.length - 1](svarEtter));
    await vent();
  }

  function endreCv() {
    fireEvent.click(screen.getByRole("button", { name: "Endre CV-tekst" }));
  }

  function rediger() {
    fireEvent.change(document.getElementById("krav-0-tekst")!, {
      target: { value: "Endret krav" },
    });
  }

  function analyser() {
    return document.getElementById(ANALYSER_ID) as HTMLButtonElement;
  }

  function tilbake() {
    return screen.queryByRole("button", { name: "Tilbake til resultatet" });
  }

  // Ferdig analyse med en redigering, og så forberedelsen med avkrysningen gitt.
  async function redigertOgTilbake() {
    await apneEksempelet();
    await gi(Response.json(svar));
    rediger();
    endreCv();
    fireEvent.click(screen.getByRole("checkbox"));
  }

  it("FR-3: Tilbake til resultatet vises, og endret tekst skjuler den og viser linjen", async () => {
    await apneEksempelet();
    await gi(Response.json(svar));
    endreCv();

    expect(tilbake()).not.toBeNull();
    expect(screen.queryByText(ENDRET_TEKST)).toBeNull();

    const felt = screen.getByLabelText("CV-tekst") as HTMLTextAreaElement;
    const original = felt.value;
    fireEvent.change(felt, { target: { value: `${original} Ny erfaring` } });

    expect(tilbake()).toBeNull();
    expect(
      screen.getByText(
        "Du har endret teksten. Trykk Analyser for en ny analyse.",
      ),
    ).toBeTruthy();

    fireEvent.change(felt, { target: { value: original } });

    expect(tilbake()).not.toBeNull();
    expect(screen.queryByText(ENDRET_TEKST)).toBeNull();
  });

  it("FR-3: endret annonse skjuler Tilbake til resultatet", async () => {
    await apneEksempelet();
    await gi(Response.json(svar));
    endreCv();

    fireEvent.change(screen.getByLabelText("Annonse"), {
      target: { value: "Ny annonse. ".repeat(20) },
    });

    expect(tilbake()).toBeNull();
    expect(screen.getByText(ENDRET_TEKST)).toBeTruthy();
  });

  it("UX-DR8: linjen om endret tekst beskriver Analyser, også sammen med årsakene", async () => {
    await apneEksempelet();
    await gi(Response.json(svar));
    endreCv();

    function beskrivelse() {
      return (analyser().getAttribute("aria-describedby") ?? "")
        .split(" ")
        .map((id) => document.getElementById(id)?.textContent)
        .join(" ");
    }

    expect(beskrivelse()).not.toContain(ENDRET_TEKST);
    const felt = screen.getByLabelText("CV-tekst") as HTMLTextAreaElement;
    fireEvent.change(felt, { target: { value: `${felt.value} Ny erfaring` } });

    // Uten avkrysning er knappen også deaktivert.
    expect(analyser().getAttribute("aria-disabled")).toBe("true");
    expect(beskrivelse()).toContain(ENDRET_TEKST);
    expect(beskrivelse()).toContain("Kryss av for personvern.");
  });

  it("FR-5: Endre CV-tekst etter Prøv med eksempel krysser ikke av for personvern", async () => {
    await apneEksempelet();
    await gi(Response.json(svar));
    endreCv();

    const avkrysning = screen.getByRole("checkbox");
    expect(avkrysning.getAttribute("aria-checked")).toBe("false");
    expect(
      screen.queryByText(
        "Du har bekreftet at du har lest informasjonen om personvern.",
      ),
    ).toBeNull();

    fireEvent.change(screen.getByLabelText("CV-tekst"), {
      target: { value: "Kari Nordmann\nKundeservice i fem år." },
    });

    expect(analyser().getAttribute("aria-disabled")).toBe("true");
    expect(document.getElementById("analyser-arsaker")?.textContent).toContain(
      "Kryss av for personvern.",
    );
  });

  it("FR-3: Tilbake til resultatet etter en feil uten tidligere analyse viser feilen og gir fokus til «Resultat»", async () => {
    await apneEksempelet();
    await gi(Response.json({ feil: { kode: "llm_feil" } }, { status: 502 }));
    endreCv();

    fireEvent.click(tilbake()!);

    expect(screen.getByRole("alert").textContent).toContain(
      "Språkmodellen svarte ikke.",
    );
    expect(document.activeElement).toBe(
      screen.getByRole("heading", { level: 1, name: "Resultat" }),
    );
    expect(gapKall(mock)).toHaveLength(1);
  });

  it("UX-DR18: Analyser med en redigert fane spør først, med fokus på Avbryt", async () => {
    await redigertOgTilbake();

    fireEvent.click(analyser());

    const dialog = screen.getByRole("alertdialog");
    expect(dialog.textContent).toContain("Starte en ny analyse?");
    expect(dialog.textContent).toContain(
      "Alle resultatdelene erstattes. Redigeringene dine i Gap-analyse og nøkkelord blir overskrevet.",
    );
    expect(document.activeElement).toBe(
      screen.getByRole("button", { name: "Avbryt" }),
    );
    expect(gapKall(mock)).toHaveLength(1);
  });

  it("UX-DR18: Avbryt endrer ingenting og gir fokus til Analyser", async () => {
    await redigertOgTilbake();
    fireEvent.click(analyser());

    fireEvent.click(screen.getByRole("button", { name: "Avbryt" }));
    await vent();

    expect(screen.queryByRole("alertdialog")).toBeNull();
    expect(document.activeElement).toBe(analyser());
    expect(gapKall(mock)).toHaveLength(1);
    fireEvent.click(tilbake()!);
    expect(
      (document.getElementById("krav-0-tekst") as HTMLTextAreaElement).value,
    ).toBe("Endret krav");
  });

  it("UX-DR24: Analyser på nytt starter en ny kjøring, nullstiller resultatdelene og gir fokus til «Resultat»", async () => {
    await redigertOgTilbake();
    fireEvent.click(analyser());

    fireEvent.click(screen.getByRole("button", { name: "Analyser på nytt" }));
    await vent();

    expect(gapKall(mock)).toHaveLength(2);
    expect(document.activeElement).toBe(
      screen.getByRole("heading", { level: 1, name: "Resultat" }),
    );
    expect(screen.getByRole("tab").textContent).toBe(
      "Gap-analyse og nøkkelord, genereres",
    );

    await gi(Response.json(svar));
    expect(
      (document.getElementById("krav-0-tekst") as HTMLTextAreaElement).value,
    ).toBe(svar.krav[0].tekst);
    expect(screen.getByRole("tab").textContent).toBe("Gap-analyse og nøkkelord");
  });

  it("FR-3: Analyser uten redigering starter en ny kjøring uten dialog", async () => {
    await apneEksempelet();
    await gi(Response.json(svar));
    endreCv();
    fireEvent.click(screen.getByRole("checkbox"));

    fireEvent.click(analyser());
    await vent();

    expect(screen.queryByRole("alertdialog")).toBeNull();
    expect(gapKall(mock)).toHaveLength(2);
    expect(
      screen.getByRole("heading", { level: 1, name: "Resultat" }),
    ).toBeTruthy();
  });

  it("UX-DR18: Analyser under en ny generering av en redigert fane spør først", async () => {
    await apneEksempelet();
    await gi(Response.json(svar));
    rediger();
    fireEvent.click(screen.getByRole("button", { name: "Generer på nytt" }));
    fireEvent.click(screen.getByRole("button", { name: "Lag ny" }));
    await vent();
    endreCv();
    fireEvent.click(screen.getByRole("checkbox"));

    fireEvent.click(analyser());

    expect(screen.getByRole("alertdialog").textContent).toContain(
      "Gap-analyse og nøkkelord",
    );
  });

  it("FR-26: Analyser med egen tekst i demomodus gir varselet ved første trykk, uten dialog", async () => {
    await redigertOgTilbake();
    fireEvent.change(screen.getByLabelText("CV-tekst"), {
      target: { value: "Kari Nordmann\nKundeservice i fem år." },
    });

    fireEvent.click(analyser());

    expect(screen.queryByRole("alertdialog")).toBeNull();
    expect(document.getElementById(DEMO_VARSEL_ID)).not.toBeNull();
    expect(gapKall(mock)).toHaveLength(1);
  });

  it("FR-6: et nytt fødselsnummer maskeres ved første trykk, uten dialog", async () => {
    await redigertOgTilbake();
    const felt = screen.getByLabelText("CV-tekst") as HTMLTextAreaElement;
    fireEvent.change(felt, { target: { value: `${felt.value} 01019012345` } });

    fireEvent.click(analyser());

    expect(screen.queryByRole("alertdialog")).toBeNull();
    expect(felt.value).toContain(FJERNET);
    expect(gapKall(mock)).toHaveLength(1);
  });
});
