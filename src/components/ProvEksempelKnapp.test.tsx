// @vitest-environment jsdom
import { readFileSync } from "node:fs";

import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import Home from "@/app/page";
import type { GapAnalyse } from "@/lib/kontrakt/gap";
import type { Modus } from "@/lib/kontrakt/status";
import { OktProvider } from "@/lib/okt/OktProvider";
import { startTilstand, type OktTilstand } from "@/lib/okt/tilstand";
import { apiMock, demoSvar, gapKall } from "@/testhjelp/gap";

import { ANALYSER_ID } from "./CvPanel";
import { DEMO_VARSEL_ID } from "./AnalyserKnapp";

const DEMO_CV = readFileSync("testdata/par-1-butikk-bank/cv.txt", "utf8");
const SPORSMAL = "Erstatte teksten din med eksempelet?";

let svar: GapAnalyse;
let mock: ReturnType<typeof apiMock>;

beforeAll(async () => {
  svar = await demoSvar();
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

async function monter(
  utkast = { cvTekst: "", annonse: "" },
  modus: Modus = "demo",
  cvFil: OktTilstand["innhold"]["cvFil"] = null,
) {
  mock = apiMock(async () => Response.json(svar), modus);
  vi.stubGlobal("fetch", mock);
  const start: OktTilstand = {
    ...startTilstand,
    innhold: { ...startTilstand.innhold, utkast, cvFil },
  };
  await act(async () => {
    render(
      <OktProvider startTilstand={start}>
        <Home />
      </OktProvider>,
    );
  });
}

async function vent() {
  await act(async () => {
    await new Promise((ferdig) => setTimeout(ferdig));
  });
}

function eksempelKnapp() {
  return screen.getAllByRole("button", { name: "Prøv med eksempel" })[0];
}

function resultatOverskrift() {
  return screen.queryByRole("heading", { level: 1, name: "Resultat" });
}

describe("Prøv med eksempel", () => {
  it.each(["demo", "ekte"] as const)(
    "FR-25: tomme felt i %s-modus åpner resultatet uten dialog, med fokus på Resultat og én POST",
    async (modus) => {
      await monter(undefined, modus);

      fireEvent.click(eksempelKnapp());
      await vent();

      expect(screen.queryByRole("alertdialog")).toBeNull();
      expect(document.activeElement).toBe(resultatOverskrift());
      expect(gapKall(mock)).toHaveLength(1);
      expect(screen.getByRole("tabpanel").textContent).toContain(
        "Du dekker 3 av 6 krav. 2 er delvis oppfylt.",
      );
    },
  );

  it("FR-25: krever ikke avkrysning for personvern", async () => {
    await monter();
    expect(
      document.getElementById(ANALYSER_ID)?.getAttribute("aria-disabled"),
    ).toBe("true");

    fireEvent.click(eksempelKnapp());
    await vent();

    expect(resultatOverskrift()).not.toBeNull();
  });

  it("UX-DR18: med tekst i et felt vises dialogen med fokus på Avbryt", async () => {
    await monter({ cvTekst: "Kari Nordmann", annonse: "" });

    fireEvent.click(eksempelKnapp());
    await vent();

    const dialog = screen.getByRole("alertdialog");
    expect(screen.getByText(SPORSMAL)).toBeTruthy();
    expect(
      screen.getByText(
        "CV-teksten, annonsen og eventuelle resultater erstattes.",
      ),
    ).toBeTruthy();
    expect(document.activeElement).toBe(
      screen.getByRole("button", { name: "Avbryt" }),
    );
    expect(dialog).toBeTruthy();
    expect(gapKall(mock)).toHaveLength(0);
  });

  it("UX-DR18: en fil som leses, regnes som innhold og gir dialogen", async () => {
    await monter(undefined, "demo", { navn: "cv.pdf", tilstand: "leser" });

    fireEvent.click(eksempelKnapp());
    await vent();

    expect(screen.getByText(SPORSMAL)).toBeTruthy();
    expect(resultatOverskrift()).toBeNull();
    expect(gapKall(mock)).toHaveLength(0);
  });

  it("UX-DR18: bare mellomrom regnes som tomt", async () => {
    await monter({ cvTekst: "  \n ", annonse: " " });

    fireEvent.click(eksempelKnapp());
    await vent();

    expect(screen.queryByRole("alertdialog")).toBeNull();
    expect(resultatOverskrift()).not.toBeNull();
  });

  it("UX-DR18: Avbryt lukker og gir fokus tilbake til knappen", async () => {
    await monter({ cvTekst: "", annonse: "Annonse" });
    const knapp = eksempelKnapp();
    knapp.focus();
    fireEvent.click(knapp);

    fireEvent.click(screen.getByRole("button", { name: "Avbryt" }));
    await vent();

    expect(screen.queryByRole("alertdialog")).toBeNull();
    expect(document.activeElement).toBe(knapp);
    expect(resultatOverskrift()).toBeNull();
    expect(
      (screen.getByLabelText("Annonse") as HTMLTextAreaElement).value,
    ).toBe("Annonse");
  });

  it("FR-25: Bruk eksempelet erstatter teksten og åpner resultatet", async () => {
    await monter({ cvTekst: "Kari Nordmann", annonse: "Annonse" });
    fireEvent.click(eksempelKnapp());

    fireEvent.click(screen.getByRole("button", { name: "Bruk eksempelet" }));
    await vent();

    expect(screen.queryByRole("alertdialog")).toBeNull();
    expect(document.activeElement).toBe(resultatOverskrift());
    expect(gapKall(mock)).toHaveLength(1);
    const body = JSON.parse(String(gapKall(mock)[0][1]?.body));
    expect(body.cvTekst).toBe(DEMO_CV);
    expect(body.demo).toBe(true);
  });

  it("FR-26: knappen i demovarselet viser dialogen og deretter resultatet", async () => {
    await monter({ cvTekst: "Kari Nordmann", annonse: "a".repeat(200) });
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(document.getElementById(ANALYSER_ID)!);
    const varsel = document.getElementById(DEMO_VARSEL_ID)!;

    fireEvent.click(
      screen.getAllByRole("button", { name: "Prøv med eksempel" }).find(
        (knapp) => varsel.contains(knapp),
      )!,
    );
    expect(screen.getByText(SPORSMAL)).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Bruk eksempelet" }));
    await vent();

    expect(resultatOverskrift()).not.toBeNull();
    expect(gapKall(mock)).toHaveLength(1);
  });

  it("FR-24: Analyser med demoteksten åpner resultatet uten dialog", async () => {
    await monter({
      cvTekst: DEMO_CV,
      annonse: readFileSync("testdata/par-1-butikk-bank/annonse.txt", "utf8"),
    });
    fireEvent.click(screen.getByRole("checkbox"));

    fireEvent.click(document.getElementById(ANALYSER_ID)!);
    await vent();

    expect(screen.queryByRole("alertdialog")).toBeNull();
    expect(document.activeElement).toBe(resultatOverskrift());
    expect(gapKall(mock)).toHaveLength(1);
  });
});
