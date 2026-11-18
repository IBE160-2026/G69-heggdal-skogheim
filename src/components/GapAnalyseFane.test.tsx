// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import type { Feilkode } from "@/lib/kontrakt/feil";
import type { GapAnalyse } from "@/lib/kontrakt/gap";
import { OktProvider } from "@/lib/okt/OktProvider";
import {
  startTilstand,
  type ResultatdelTilstand,
} from "@/lib/okt/tilstand";
import { apiMock, demoSvar } from "@/testhjelp/gap";

import { GapAnalyseFane } from "./GapAnalyseFane";

const FAST_RAAD =
  "Fant ikke belegg for dette i CV-teksten. Har du denne erfaringen, trykk Endre CV-tekst og legg den inn.";

let svar: GapAnalyse;

beforeAll(async () => {
  svar = await demoSvar();
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

function vis(gap: Partial<ResultatdelTilstand<GapAnalyse>>) {
  vi.stubGlobal("fetch", apiMock(async () => Response.json(svar)));
  return render(
    <OktProvider
      startTilstand={{
        ...startTilstand,
        innhold: {
          ...startTilstand.innhold,
          kjoring: { id: 1, cvTekst: "", annonse: "", erEksempel: true },
          resultatdeler: {
            gap: {
              status: "ferdig",
              feilkode: null,
              generert: null,
              redigert: null,
              gapVersjon: 1,
              ...gap,
            },
          },
          gapVersjon: 1,
        },
      }}
    >
      <GapAnalyseFane />
    </OktProvider>,
  );
}

function visSvar(analyse: GapAnalyse = svar) {
  return vis({ generert: analyse });
}

function kort() {
  return Array.from(document.querySelectorAll("section li.border-l-4"));
}

describe("GapAnalyseFane, ferdig", () => {
  it("FR-11: oppsummeringen teller kravene", () => {
    visSvar();

    expect(document.body.textContent).toContain(
      "Du dekker 3 av 6 krav. 2 er delvis oppfylt.",
    );
  });

  it("FR-8: gruppene står i rekkefølgen Oppfylt, Delvis oppfylt, Mangler", () => {
    visSvar();

    const overskrifter = screen
      .getAllByRole("heading", { level: 3 })
      .map((h) => [h.textContent, h.id, h.getAttribute("tabindex")]);
    expect(overskrifter).toEqual([
      ["Oppfylt", "gruppe-oppfylt", "-1"],
      ["Delvis oppfylt", "gruppe-delvis", "-1"],
      ["Mangler", "gruppe-mangler", "-1"],
    ]);
  });

  it("FR-8: kravene står i annonsens rekkefølge innen gruppen", () => {
    visSvar();

    const tekster = kort().map((k) => k.querySelector("p")?.textContent);
    expect(tekster).toEqual([
      "Kundeorientert og trives med å hjelpe andre",
      "Erfaring med kontanthåndtering",
      "Studerer økonomi eller tilsvarende",
      "Gode digitale ferdigheter",
      "Nøyaktig og pålitelig",
      "Autorisasjon som finansiell rådgiver (AFR)",
    ]);
  });

  it("UX-DR12: merkene lenker til gruppeoverskriften, som får fokus", () => {
    visSvar();

    const lenke = screen.getByRole("link", { name: "Mangler 1" });
    expect(lenke.getAttribute("href")).toBe("#gruppe-mangler");
    fireEvent.click(lenke);

    expect(document.activeElement?.id).toBe("gruppe-mangler");
    expect(screen.getByRole("link", { name: "Oppfylt 3" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Delvis oppfylt 2" })).toBeTruthy();
  });

  it("UX-DR12: en tom gruppe skjules, og merket viser 0 uten lenke", () => {
    visSvar({
      ...svar,
      krav: svar.krav.filter((k) => k.kategori !== "mangler"),
    });

    expect(screen.queryByRole("heading", { name: "Mangler" })).toBeNull();
    expect(screen.queryByRole("link", { name: /Mangler/ })).toBeNull();
    expect(document.body.textContent).toContain("Mangler 0");
  });

  it("UX-DR13: belegg er figure med figcaption «Fra CV-en» og teksten i «»", () => {
    visSvar();

    const forste = kort()[0];
    const figur = forste.querySelector("figure");
    expect(figur?.querySelector("figcaption")?.textContent).toBe("Fra CV-en");
    expect(figur?.querySelector("blockquote")?.textContent).toBe(
      "«Hjalp kunder med å finne varer og svarte på spørsmål»",
    );
  });

  it("UX-DR13: hvert krav har kategorien med ord", () => {
    visSvar();

    expect(kort().map((k) => k.querySelector("span")?.textContent)).toEqual([
      "Oppfylt",
      "Oppfylt",
      "Oppfylt",
      "Delvis oppfylt",
      "Delvis oppfylt",
      "Mangler",
    ]);
  });

  it("FR-10: Delvis oppfylt har forklaringen og Mangler rådet", () => {
    visSvar();
    const alle = kort();

    expect(alle[3].textContent).toContain("Hvorfor delvis");
    expect(alle[3].textContent).toContain(svar.krav[1].forklaring);
    expect(alle[5].textContent).toContain("Råd");
    expect(alle[5].textContent).toContain(svar.krav[5].raad);
    expect(alle[5].querySelector("figure")).toBeNull();
  });

  it("FR-9: nedgradert krav har merket og det faste rådet, uten belegg og modellens råd", () => {
    visSvar({
      ...svar,
      krav: [
        {
          tekst: "Førerkort klasse B",
          kategori: "mangler",
          belegg: ["Har førerkort"],
          raad: "Påstå at du har førerkort.",
          nedgradert: true,
        },
      ],
    });

    const [nedgradert] = kort();
    expect(nedgradert.textContent).toContain(
      "Nedgradert: fant ikke belegg i CV-en",
    );
    expect(nedgradert.textContent).toContain(FAST_RAAD);
    expect(nedgradert.textContent).not.toContain("Påstå");
    expect(nedgradert.querySelector("figure")).toBeNull();
  });

  it("FR-18: ingenting i fanen kan redigeres", () => {
    visSvar();

    expect(
      document.querySelectorAll("textarea, input, [contenteditable]"),
    ).toHaveLength(0);
  });

  it("NFR-9: tekst fra API-et vises som ren tekst", () => {
    visSvar({
      ...svar,
      krav: [{ ...svar.krav[0], tekst: "<b>fet</b>" }],
    });

    expect(document.querySelector("b")).toBeNull();
    expect(document.body.textContent).toContain("<b>fet</b>");
  });

  it("FR-12: treffprosenten fra koden og teksten ved tallet", () => {
    visSvar();

    expect(document.body.textContent).toContain(
      "22 %veiledende treff, ikke en ATS-score",
    );
  });

  it("FR-13: linjen er dekorativ, og hint-teksten følger mockupen", () => {
    visSvar();

    const linje = document.querySelector(".bg-primary")?.parentElement;
    expect(linje?.getAttribute("aria-hidden")).toBe("true");
    expect(document.body.textContent).toContain(
      "2 av 9 nøkkelord fra annonsen finnes i CV-teksten. Legg bare til nøkkelord som CV-en har dekning for.",
    );
  });

  it("FR-13: nøkkelordene står i «Funnet i CV-en» og «Ikke funnet»", () => {
    visSvar();

    const funnet = screen.getByRole("list", { name: "Funnet i CV-en" });
    const ikke = screen.getByRole("list", { name: "Ikke funnet" });
    expect(
      Array.from(funnet.querySelectorAll("li")).map((li) => li.textContent),
    ).toEqual(["pålitelig", "økonomi"]);
    expect(ikke.querySelectorAll("li")).toHaveLength(7);
    expect(funnet.querySelector("svg")?.getAttribute("aria-hidden")).toBe(
      "true",
    );
  });

  it("UX-DR12: alle ikoner er skjult for skjermleser", () => {
    visSvar();

    for (const ikon of document.querySelectorAll("svg")) {
      expect(ikon.getAttribute("aria-hidden")).toBe("true");
    }
  });
});

describe("GapAnalyseFane, laster og feil", () => {
  it.each(["venter", "genererer"] as const)(
    "UX-DR19: %s viser teksten og skjelett med aria-hidden",
    (status) => {
      vis({ status });

      expect(
        screen.getByText("Leser annonsen og sammenligner med CV-en …"),
      ).toBeTruthy();
      const skjelett = document.querySelectorAll("[data-slot=skeleton]");
      expect(skjelett.length).toBeGreaterThan(0);
      for (const del of skjelett) {
        expect(del.closest("[aria-hidden=true]")).not.toBeNull();
      }
      expect(document.querySelector("[data-slot=skeleton]")?.className).toContain(
        "motion-reduce:animate-none",
      );
    },
  );

  it.each<[Feilkode | null, string]>([
    ["llm_feil", "Språkmodellen svarte ikke. Teksten din er tatt vare på. Prøv igjen."],
    ["llm_tidsavbrudd", "Språkmodellen svarte ikke. Teksten din er tatt vare på. Prøv igjen."],
    ["demo_krever_nokkel", "Språkmodellen svarte ikke. Teksten din er tatt vare på. Prøv igjen."],
    ["ugyldig_svar", "Svaret fra språkmodellen kunne ikke brukes. Prøv igjen."],
    [
      "grense_naadd",
      "Appen har nådd grensen for bruk akkurat nå. Prøv igjen senere, eller bruk Prøv med eksempel.",
    ],
  ])("AD-8: %s gir Alert med role=alert", (feilkode, melding) => {
    vis({ status: "feil", feilkode });

    expect(screen.getByRole("alert").textContent).toBe(melding);
    expect(screen.queryByRole("button")).toBeNull();
  });
});
