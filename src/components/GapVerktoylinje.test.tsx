// @vitest-environment jsdom
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { toast } from "sonner";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import type { GapAnalyse } from "@/lib/kontrakt/gap";
import { OktProvider } from "@/lib/okt/OktProvider";
import {
  startTilstand,
  type ResultatdelTilstand,
} from "@/lib/okt/tilstand";
import { apiMock, demoSvar, gapKall } from "@/testhjelp/gap";

import { gapSomTekst } from "./gapTekst";
import { GapVerktoylinje } from "./GapVerktoylinje";
import { Kunngjoring } from "./Kunngjoring";
import { Toaster } from "./ui/sonner";

let svar: GapAnalyse;
let mock: ReturnType<typeof apiMock>;

beforeAll(async () => {
  svar = await demoSvar();
});

afterEach(() => {
  // Sonner spiller av aktive toaster for en ny Toaster, så de fjernes mellom testene.
  toast.dismiss();
  cleanup();
  vi.unstubAllGlobals();
  Reflect.deleteProperty(navigator, "clipboard");
});

async function vent() {
  await act(async () => {
    // Sonner viser toasten i en egen setTimeout.
    await new Promise((ferdig) => setTimeout(ferdig, 10));
  });
}

function utklippstavle(writeText: (tekst: string) => Promise<void>) {
  const skriv = vi.fn(writeText);
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: { writeText: skriv },
  });
  return skriv;
}

function vis(gap: Partial<ResultatdelTilstand<GapAnalyse>>) {
  mock = apiMock(() => new Promise<Response>(() => {}));
  vi.stubGlobal("fetch", mock);
  return render(
    <OktProvider
      startTilstand={{
        ...startTilstand,
        innhold: {
          ...startTilstand.innhold,
          kjoring: { id: 1, cvTekst: "cv", annonse: "annonse", erEksempel: true },
          resultatdeler: {
            gap: {
              status: "ferdig",
              feilkode: null,
              generert: svar,
              redigert: null,
              gapVersjon: 1,
              ...gap,
            },
          },
          gapVersjon: 1,
        },
      }}
    >
      <GapVerktoylinje />
      <Kunngjoring />
      <Toaster position="top-center" />
    </OktProvider>,
  );
}

function kopierKnapp() {
  return screen.getByRole("button", { name: "Kopier" });
}

function generer() {
  return screen.getByRole("button", { name: "Generer på nytt" });
}

function live() {
  return document.querySelector("div[aria-live=polite]")?.textContent;
}

function redigertSvar(): GapAnalyse {
  return {
    ...svar,
    krav: svar.krav.map((k, nr) => (nr === 0 ? { ...k, tekst: "Endret krav" } : k)),
  };
}

describe("GapVerktoylinje, utforming", () => {
  it("UX-DR11: Kopier er primærknappen med Copy, Generer på nytt har RefreshCw", () => {
    vis({});

    expect(kopierKnapp().getAttribute("data-variant")).toBe("default");
    expect(generer().getAttribute("data-variant")).toBe("outline");
    expect(kopierKnapp().querySelector("svg")?.classList).toContain(
      "lucide-copy",
    );
    expect(generer().querySelector("svg")?.classList).toContain(
      "lucide-refresh-cw",
    );
    for (const ikon of document.querySelectorAll("button svg")) {
      expect(ikon.getAttribute("aria-hidden")).toBe("true");
    }
  });

  it("UX-DR11: knappene står under hverandre under 640 px og ved siden av hverandre fra sm", () => {
    vis({});

    const linje = kopierKnapp().parentElement!;
    expect(linje.className).toContain("flex-col");
    expect(linje.className).toContain("sm:flex-row");
  });
});

describe("GapVerktoylinje, Kopier", () => {
  it("FR-20: kopierer redigert ?? generert som ren tekst, med toast og live-melding", async () => {
    const skriv = utklippstavle(async () => {});
    vis({ redigert: redigertSvar() });

    fireEvent.click(kopierKnapp());
    await vent();

    expect(skriv).toHaveBeenCalledWith(gapSomTekst(redigertSvar()));
    expect(skriv.mock.calls[0][0]).toContain("Endret krav — Oppfylt");
    expect(skriv.mock.calls[0][0]).toContain(
      `Treff: ${svar.treffprosent} % (veiledende)`,
    );
    expect(screen.getByText("Kopiert")).toBeTruthy();
    expect(live()).toBe("Kopiert.");
  });

  it("FR-20: uten redigering kopieres generert", async () => {
    const skriv = utklippstavle(async () => {});
    vis({});

    fireEvent.click(kopierKnapp());
    await vent();

    expect(skriv).toHaveBeenCalledWith(gapSomTekst(svar));
  });

  it("UX-DR11: toasten har ingen knapper", async () => {
    utklippstavle(async () => {});
    vis({});

    fireEvent.click(kopierKnapp());
    await vent();

    const toast = screen.getByText("Kopiert").closest("li")!;
    expect(toast.querySelectorAll("button")).toHaveLength(0);
  });

  it.each<[string, () => void]>([
    ["avvises", () => utklippstavle(async () => Promise.reject(new Error("nei")))],
    ["mangler", () => {}],
  ])(
    "FR-20: utklippstavlen %s gir feiltoasten og ingen live-melding",
    async (_navn, forbered) => {
      forbered();
      vis({});

      fireEvent.click(kopierKnapp());
      await vent();

      expect(
        screen.getByText("Kunne ikke kopiere. Merk teksten og kopier selv."),
      ).toBeTruthy();
      expect(screen.queryByText("Kopiert")).toBeNull();
      expect(live()).toBe("");
    },
  );
});

describe("GapVerktoylinje, Generer på nytt", () => {
  it("FR-19: uten redigering sendes én ny POST for samme kjøring uten dialog", () => {
    vis({});

    fireEvent.click(generer());

    expect(screen.queryByRole("alertdialog")).toBeNull();
    const kall = gapKall(mock);
    expect(kall).toHaveLength(1);
    expect(JSON.parse(String(kall[0][1]?.body))).toEqual({
      cvTekst: "cv",
      annonse: "annonse",
      demo: true,
    });
  });

  it("UX-DR18: med redigering åpner dialogen med teksten og fokus på Avbryt", () => {
    vis({ redigert: redigertSvar() });

    fireEvent.click(generer());

    const dialog = screen.getByRole("alertdialog");
    expect(dialog.textContent).toContain("Lage ny gap-analyse?");
    expect(dialog.textContent).toContain(
      "Redigeringene dine i Gap-analyse og nøkkelord blir overskrevet. Det nye bygger på CV-teksten og annonsen, ikke på endringene dine. Andre faner endres ikke.",
    );
    expect(document.activeElement).toBe(
      screen.getByRole("button", { name: "Avbryt" }),
    );
    expect(gapKall(mock)).toHaveLength(0);
  });

  it("UX-DR18: Avbryt lukker, beholder redigeringen og gir fokus tilbake til knappen", async () => {
    vis({ redigert: redigertSvar() });

    fireEvent.click(generer());
    fireEvent.click(screen.getByRole("button", { name: "Avbryt" }));
    await vent();

    expect(screen.queryByRole("alertdialog")).toBeNull();
    expect(gapKall(mock)).toHaveLength(0);
    expect(document.activeElement).toBe(generer());
  });

  it("FR-19: Lag ny sender én ny POST, og knappen får fokus tilbake", async () => {
    vis({ redigert: redigertSvar() });

    fireEvent.click(generer());
    fireEvent.click(screen.getByRole("button", { name: "Lag ny" }));
    await vent();

    expect(screen.queryByRole("alertdialog")).toBeNull();
    expect(gapKall(mock)).toHaveLength(1);
    expect(document.activeElement).toBe(generer());
    expect(generer().getAttribute("aria-disabled")).toBe("true");
  });

  it.each(["genererer"] as const)(
    "UX-DR11: under %s har begge knappene aria-disabled, er ikke disabled og gjør ingenting",
    async (status) => {
      const skriv = utklippstavle(async () => {});
      vis({ status, generert: null });

      for (const knapp of [kopierKnapp(), generer()]) {
        expect(knapp.getAttribute("aria-disabled")).toBe("true");
        expect(knapp.hasAttribute("disabled")).toBe(false);
      }
      generer().focus();
      fireEvent.click(generer());
      fireEvent.click(kopierKnapp());
      await vent();

      expect(screen.queryByRole("alertdialog")).toBeNull();
      expect(gapKall(mock)).toHaveLength(0);
      expect(skriv).not.toHaveBeenCalled();
      expect(document.activeElement).toBe(generer());
    },
  );
});
