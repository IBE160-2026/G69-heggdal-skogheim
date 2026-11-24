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
import { FAST_RAAD } from "./gapTekst";

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

    const tekster = kort().map(
      (k) => (k.querySelector("textarea") as HTMLTextAreaElement).value,
    );
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

    expect(kort().map((k) => k.querySelector("span.rounded-full")?.textContent)).toEqual([
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
    // Skjermteksten og kopiteksten er den samme.
    expect(nedgradert.querySelector("p.text-sm")?.textContent).toBe(FAST_RAAD);
    expect(nedgradert.textContent).not.toContain("Påstå");
    expect(nedgradert.querySelector("figure")).toBeNull();
  });

  it("FR-18: kravtekst, forklaring og råd er tekstfelt med synlige etiketter", () => {
    visSvar();
    const alle = kort();

    // Synlig tekst uten kravnummeret, som bare er for skjermleser.
    const etiketter = (k: Element) =>
      Array.from(k.querySelectorAll("textarea")).map((felt) => {
        const etikett = document.querySelector(`label[for="${felt.id}"]`)!;
        const kopi = etikett.cloneNode(true) as Element;
        kopi.querySelector(".sr-only")?.remove();
        return kopi.textContent?.trim();
      });
    expect(etiketter(alle[0])).toEqual(["Krav"]);
    expect(etiketter(alle[3])).toEqual(["Krav", "Hvorfor delvis"]);
    expect(etiketter(alle[5])).toEqual(["Krav", "Råd"]);
    expect(
      (screen.getByLabelText("Hvorfor delvis, krav 2") as HTMLTextAreaElement).value,
    ).toBe(svar.krav[1].forklaring);
    expect((screen.getByLabelText("Råd, krav 6") as HTMLTextAreaElement).value).toBe(
      svar.krav[5].raad,
    );
    // Feltet vokser med innholdet, og det finnes ingen Lagre-knapp eller skjema.
    for (const felt of document.querySelectorAll("textarea")) {
      expect(felt.className).toContain("field-sizing-content");
      expect(felt.closest("form")).toBeNull();
    }
    expect(screen.queryByRole("button", { name: /Lagre/ })).toBeNull();
    expect(document.querySelectorAll("input, [contenteditable]")).toHaveLength(0);
  });

  it("UX-DR13: hvert felt har kravnummeret i navnet, så kortene kan skilles med skjermleser", () => {
    visSvar();

    svar.krav.forEach((_, nr) => {
      expect(screen.getByLabelText(`Krav ${nr + 1}`).id).toBe(`krav-${nr}-tekst`);
    });
    expect(screen.getByLabelText("Hvorfor delvis, krav 2").id).toBe(
      "krav-1-forklaring",
    );
    expect(screen.getByLabelText("Råd, krav 6").id).toBe("krav-5-raad");
    expect(
      document.querySelector('label[for="krav-0-tekst"] .sr-only')?.textContent,
    ).toBe("1");
  });

  it("FR-18: endringer i «Hvorfor delvis» og «Råd» treffer sitt eget felt, og kravteksten står", () => {
    visSvar();

    const forklaring = document.getElementById("krav-1-forklaring") as HTMLTextAreaElement;
    const raad = document.getElementById("krav-5-raad") as HTMLTextAreaElement;
    fireEvent.change(forklaring, { target: { value: "Ny forklaring" } });
    fireEvent.change(raad, { target: { value: "Nytt råd" } });

    expect(forklaring.value).toBe("Ny forklaring");
    expect(raad.value).toBe("Nytt råd");
    expect(
      (document.getElementById("krav-1-tekst") as HTMLTextAreaElement).value,
    ).toBe(svar.krav[1].tekst);
    expect(
      (document.getElementById("krav-5-tekst") as HTMLTextAreaElement).value,
    ).toBe(svar.krav[5].tekst);
  });

  it("FR-18: en endring vises med en gang og treffer riktig krav, mens kategori og belegg står", () => {
    visSvar();

    // Krav 3 i annonsen (indeks 3) står i gruppen Oppfylt eller Delvis oppfylt.
    const felt = document.getElementById("krav-3-tekst") as HTMLTextAreaElement;
    fireEvent.change(felt, { target: { value: "Ny tekst" } });

    expect(felt.value).toBe("Ny tekst");
    const endret = felt.closest("li")!;
    expect(endret.querySelector("span.rounded-full")?.textContent).toBe(
      { oppfylt: "Oppfylt", delvis: "Delvis oppfylt", mangler: "Mangler" }[
        svar.krav[3].kategori
      ],
    );
    expect(endret.querySelectorAll("blockquote")).toHaveLength(
      svar.krav[3].belegg.length,
    );
    expect(
      (document.getElementById("krav-0-tekst") as HTMLTextAreaElement).value,
    ).toBe(svar.krav[0].tekst);
    expect(document.body.textContent).toContain(`${svar.treffprosent} %`);
  });

  it("FR-18: det faste rådet for et nedgradert krav er ikke et tekstfelt", () => {
    visSvar({
      ...svar,
      krav: [
        {
          tekst: "Førerkort klasse B",
          kategori: "mangler",
          belegg: [],
          nedgradert: true,
        },
      ],
    });

    expect(screen.queryByLabelText(/^Råd/)).toBeNull();
    expect(kort()[0].querySelectorAll("textarea")).toHaveLength(1);
    expect(kort()[0].textContent).toContain(FAST_RAAD);
  });

  it("FR-18: en tom forklaring står som et tomt felt, så det kan fylles inn", () => {
    visSvar({
      ...svar,
      krav: [{ ...svar.krav[1], forklaring: undefined }],
    });

    expect(
      (screen.getByLabelText("Hvorfor delvis, krav 1") as HTMLTextAreaElement).value,
    ).toBe("");
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

  const SVARTE_IKKE =
    "Språkmodellen svarte ikke. Teksten din er tatt vare på. Prøv igjen.";

  it.each<[Feilkode | null, string, string[]]>([
    ["llm_feil", SVARTE_IKKE, ["Prøv igjen"]],
    ["llm_tidsavbrudd", SVARTE_IKKE, ["Prøv igjen"]],
    // En feil uten kode behandles som llm_feil.
    [null, SVARTE_IKKE, ["Prøv igjen"]],
    [
      "ugyldig_svar",
      "Svaret fra språkmodellen kunne ikke brukes. Prøv igjen.",
      ["Prøv igjen"],
    ],
    [
      "grense_naadd",
      "Appen har nådd grensen for bruk akkurat nå. Prøv igjen senere, eller bruk Prøv med eksempel.",
      ["Prøv med eksempel"],
    ],
    [
      "demo_krever_nokkel",
      "Full analyse av din egen CV krever en API-nøkkel. Prøv eksempelet for å se hvordan resultatet ser ut.",
      ["Prøv med eksempel"],
    ],
    [
      "for_lang_tekst",
      "Teksten er for lang til å analyseres. CV-en kan være maks 15 000 tegn og annonsen maks 8 000. Gå tilbake og kort ned teksten.",
      [],
    ],
    [
      "for_kort_tekst",
      "Teksten er for kort til å analyseres. Annonsen må være minst 200 tegn. Gå tilbake og legg til mer.",
      [],
    ],
    [
      "ugyldig_inndata",
      "Teksten kunne ikke sendes til analyse. Gå tilbake og trykk Analyser på nytt.",
      [],
    ],
  ])(
    "UX-DR20: %s gir Alert med role=alert, meldingen og knappene fra tabellen",
    (feilkode, melding, knapper) => {
      vis({ status: "feil", feilkode });

      const varsel = screen.getByRole("alert");
      const beskrivelse = varsel.querySelector("[data-slot=alert-description]");
      expect(beskrivelse?.textContent).toBe(melding);
      expect(
        screen.queryAllByRole("button").map((knapp) => knapp.textContent),
      ).toEqual(knapper);
      for (const knapp of screen.queryAllByRole("button")) {
        expect(varsel.contains(knapp)).toBe(true);
      }
    },
  );

  it("FR-19: feil med en forrige analyse viser varselet uten Prøv igjen og analysen under", () => {
    const redigert: GapAnalyse = {
      ...svar,
      krav: svar.krav.map((k, nr) => (nr === 0 ? { ...k, tekst: "Endret" } : k)),
    };
    vis({ status: "feil", feilkode: "llm_feil", generert: svar, redigert });

    const varsel = screen.getByRole("alert");
    expect(varsel.querySelector("button")).toBeNull();
    const felt = document.getElementById("krav-0-tekst") as HTMLTextAreaElement;
    expect(felt.value).toBe("Endret");
    expect(
      varsel.compareDocumentPosition(felt) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  it("FR-22: feil med en forrige analyse beholder Prøv med eksempel når koden gir den", () => {
    vis({ status: "feil", feilkode: "grense_naadd", generert: svar });

    const varsel = screen.getByRole("alert");
    expect(
      Array.from(varsel.querySelectorAll("button")).map((k) => k.textContent),
    ).toEqual(["Prøv med eksempel"]);
    expect(document.getElementById("krav-0-tekst")).not.toBeNull();
  });

  it("FR-19: under en ny generering vises skjelettet, ikke den forrige analysen", () => {
    vis({ status: "genererer", generert: svar });

    expect(document.querySelector("[data-slot=skeleton]")).not.toBeNull();
    expect(document.getElementById("krav-0-tekst")).toBeNull();
  });
});
