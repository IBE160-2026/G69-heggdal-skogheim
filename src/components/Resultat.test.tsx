// @vitest-environment jsdom
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
import { OktProvider } from "@/lib/okt/OktProvider";
import { apiMock, demoSvar, gapKall } from "@/testhjelp/gap";

import { ANALYSER_ID } from "./CvPanel";
import { Kunngjoring } from "./Kunngjoring";

let svar: GapAnalyse;
let mock: ReturnType<typeof apiMock>;
let svarNa: (svar: Response) => void;

beforeAll(async () => {
  svar = await demoSvar();
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
    () => new Promise<Response>((ferdig) => (svarNa = ferdig)),
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

  it("UX-DR24: Tilbake under generering viser forberedelsen med teksten beholdt og fokus på Analyser", async () => {
    await apneEksempelet();
    expect(panel().getAttribute("aria-busy")).toBe("true");

    fireEvent.click(screen.getByRole("button", { name: "Tilbake" }));
    await svar200();

    expect(screen.queryByRole("heading", { name: "Resultat" })).toBeNull();
    expect(document.activeElement).toBe(document.getElementById(ANALYSER_ID));
    expect(
      (screen.getByLabelText("Annonse") as HTMLTextAreaElement).value,
    ).toContain("Sparebanken Testvik");
    expect(live()).toBe("");
  });

  it("UX-DR24: Tilbake viser forberedelsen med teksten beholdt og fokus på Analyser", async () => {
    await apneEksempelet();
    await svar200();

    fireEvent.click(screen.getByRole("button", { name: "Tilbake" }));

    expect(screen.queryByRole("heading", { name: "Resultat" })).toBeNull();
    expect(document.activeElement).toBe(document.getElementById(ANALYSER_ID));
    expect(
      (screen.getByLabelText("Annonse") as HTMLTextAreaElement).value,
    ).toContain("Sparebanken Testvik");
  });
});
