// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { OktProvider } from "@/lib/okt/OktProvider";
import { startTilstand, type OktTilstand } from "@/lib/okt/tilstand";

import { AnalyserKnapp } from "./AnalyserKnapp";
import { ANALYSER_ID, CvPanel } from "./CvPanel";
import { Kunngjoring } from "./Kunngjoring";

const NBSP = "\u00a0";
const FJERNET = "[fødselsnummer fjernet]";
const EN_FJERNET = "1 fødselsnummer er fjernet fra CV-teksten.";
const KORT =
  "Fant nesten ikke tekst i filen. Den kan være skannet eller tom. Lim inn teksten selv i feltet under.";
const LANG = `CV-teksten er for lang. Maks 15${NBSP}000 tegn.`;

function medCv(cvTekst: string): OktTilstand {
  return {
    ...startTilstand,
    innhold: { utkast: { ...startTilstand.innhold.utkast, cvTekst }, cvFil: null },
  };
}

function vis(cvTekst = "") {
  return renderToStaticMarkup(
    <OktProvider startTilstand={medCv(cvTekst)}>
      <CvPanel />
    </OktProvider>,
  );
}

// Annonse og avkrysning i orden, så bare CV-teksten avgjør om *Analyser* er aktiv.
function klar(cvTekst: string): OktTilstand {
  return {
    ...startTilstand,
    okt: { ...startTilstand.okt, bekreftetPersonvern: true },
    innhold: { utkast: { cvTekst, annonse: "a".repeat(200) }, cvFil: null },
  };
}

function monter(cvTekst: string | OktTilstand = "") {
  render(
    <OktProvider
      startTilstand={typeof cvTekst === "string" ? medCv(cvTekst) : cvTekst}
    >
      <CvPanel />
      <AnalyserKnapp />
      <Kunngjoring />
    </OktProvider>,
  );
}

function analyser() {
  return document.getElementById(ANALYSER_ID) as HTMLButtonElement;
}

function aapneKontroll() {
  fireEvent.click(screen.getByRole("button", { name: "Lim inn CV-teksten" }));
  return screen.getByLabelText("CV-tekst") as HTMLTextAreaElement;
}

function liveTekst() {
  return document.querySelector("[aria-live]")?.textContent;
}

beforeEach(() => {
  // Status holdes ventende, så bare handlingene i testen endrer tilstanden.
  vi.stubGlobal("fetch", vi.fn(() => new Promise(() => {})));
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("CvPanel, tilstand 1", () => {
  it("FR-1: har overskrift og opplastingsfelt", () => {
    const html = vis();

    expect(html).toContain(">CV</h2>");
    expect(html).not.toContain("Opplasting av CV-fil kommer snart.");
    expect(html).toContain(">Velg CV-fil</button>");
    expect(html).toContain('accept=".pdf,.docx,.txt"');
    expect(html).toContain("eller dra filen hit. PDF, DOCX eller TXT, maks 5 MB");
    expect(html).toContain(">Lim inn CV-teksten</button>");
    expect(html).not.toContain("<textarea");
  });

  it("UX-DR24: Lim inn CV-teksten gir tilstand 2 med tomt felt og fokus i feltet", () => {
    monter();
    const felt = aapneKontroll();

    expect(
      screen.getByRole("heading", { name: "Kontroller CV-teksten" }),
    ).toBeTruthy();
    expect(felt.value).toBe("");
    expect(document.activeElement).toBe(felt);
    expect(document.getElementById("cv-teller")?.textContent).toBe(
      `0 av maks 15${NBSP}000 tegn`,
    );
  });
});

describe("CvPanel, tilstand 2", () => {
  it("UX-DR5: tekst i økten gir kontrollsteget med etikett og teller", () => {
    const html = vis("Ola Nordmann");

    expect(html).toContain('id="cv-tittel"');
    expect(html).toContain(">Kontroller CV-teksten</h2>");
    expect(html).toContain('<label data-slot="label"');
    expect(html).toContain(">CV-tekst</label>");
    expect(html).toContain("12 av maks 15");
    expect(html).toContain('aria-describedby="cv-varsel cv-teller"');
  });

  it("FR-3: tomt felt etter tømming beholder tilstand 2", () => {
    monter("Ola");
    const felt = screen.getByLabelText("CV-tekst");

    fireEvent.change(felt, { target: { value: "" } });

    expect(screen.getByLabelText("CV-tekst")).toBeTruthy();
  });
});

describe("CvPanel, maskering", () => {
  it("FR-6: innliming maskerer, viser linjen og melder i live-regionen", () => {
    monter();
    const felt = aapneKontroll();

    fireEvent.paste(felt);
    fireEvent.change(felt, { target: { value: "Nr 01019012345" } });

    expect(felt.value).toBe(`Nr ${FJERNET}`);
    expect(screen.getByText(EN_FJERNET, { selector: "#cv-fjernet" })).toBeTruthy();
    expect(felt.getAttribute("aria-describedby")).toContain("cv-fjernet");
    expect(liveTekst()).toBe(EN_FJERNET);
  });

  it("FR-6: skriving maskerer ikke før feltet forlates", () => {
    monter();
    const felt = aapneKontroll();

    fireEvent.change(felt, { target: { value: "Nr 01019012345" } });
    expect(felt.value).toBe("Nr 01019012345");
    expect(liveTekst()).toBe("");

    fireEvent.blur(felt);
    expect(felt.value).toBe(`Nr ${FJERNET}`);
    expect(liveTekst()).toBe(EN_FJERNET);
  });

  it("FR-6: tast etter innliming maskerer ikke det som skrives", () => {
    monter();
    const felt = aapneKontroll();

    fireEvent.paste(felt);
    fireEvent.keyDown(felt, { key: "a" });
    fireEvent.change(felt, { target: { value: "01019012345" } });

    expect(felt.value).toBe("01019012345");
  });

  it("FR-6: forlates feltet til en aktiv Analyser, maskerer ikke feltet selv", () => {
    monter(klar("Nr"));
    const felt = screen.getByLabelText("CV-tekst") as HTMLTextAreaElement;

    fireEvent.change(felt, { target: { value: "Nr 01019012345" } });
    fireEvent.blur(felt, { relatedTarget: analyser() });

    expect(felt.value).toBe("Nr 01019012345");
  });

  it("FR-6: forlates feltet til en deaktivert Analyser, maskerer feltet", () => {
    monter();
    const felt = aapneKontroll();

    fireEvent.change(felt, { target: { value: "Nr 01019012345" } });
    expect(analyser().getAttribute("aria-disabled")).toBe("true");
    fireEvent.blur(felt, { relatedTarget: analyser() });

    expect(felt.value).toBe(`Nr ${FJERNET}`);
  });
});

describe("CvPanel med Analyser", () => {
  it("FR-6: Analyser maskerer et nytt nummer, oppdaterer linjen og gjør ikke noe annet", () => {
    monter(klar(`Nr ${FJERNET}`));
    const felt = screen.getByLabelText("CV-tekst") as HTMLTextAreaElement;

    fireEvent.change(felt, { target: { value: `Nr ${FJERNET} 010190 12345` } });
    fireEvent.blur(felt, { relatedTarget: analyser() });
    fireEvent.click(analyser());

    expect(felt.value).toBe(`Nr ${FJERNET} ${FJERNET}`);
    expect(document.getElementById("cv-fjernet")?.textContent).toBe(
      "2 fødselsnumre er fjernet fra CV-teksten.",
    );
    expect(liveTekst()).toBe(EN_FJERNET);
    expect(screen.getByLabelText("CV-tekst")).toBe(felt);
    expect(analyser().getAttribute("aria-disabled")).toBeNull();
  });

  it("FR-6: andre trykk uten nytt nummer endrer ingenting", () => {
    monter(klar("Nr 01019012345"));
    fireEvent.click(analyser());
    const etterForste = liveTekst();
    const span = document.querySelector("[aria-live] span");

    fireEvent.click(analyser());

    expect(etterForste).toBe(EN_FJERNET);
    expect(document.querySelector("[aria-live] span")).toBe(span);
  });

  it("FR-6: får Analyser fokus uten trykk, maskeres det når knappen mister fokus", () => {
    monter(klar("Nr"));
    const felt = screen.getByLabelText("CV-tekst") as HTMLTextAreaElement;

    fireEvent.change(felt, { target: { value: "Nr 01019012345" } });
    fireEvent.blur(felt, { relatedTarget: analyser() });
    expect(felt.value).toBe("Nr 01019012345");
    fireEvent.blur(analyser());

    expect(felt.value).toBe(`Nr ${FJERNET}`);
    expect(liveTekst()).toBe(EN_FJERNET);
  });

  it("FR-6: tekst som dras inn, maskeres som innliming", () => {
    monter();
    const felt = aapneKontroll();

    fireEvent.drop(felt);
    fireEvent.change(felt, { target: { value: "Nr 01019012345" } });

    expect(felt.value).toBe(`Nr ${FJERNET}`);
  });

  it("FR-4: deaktivert Analyser gjør ingenting ved trykk", () => {
    monter("Nr 01019012345");

    expect(analyser().getAttribute("aria-disabled")).toBe("true");
    fireEvent.click(analyser());

    expect(
      (screen.getByLabelText("CV-tekst") as HTMLTextAreaElement).value,
    ).toBe("Nr 01019012345");
    expect(liveTekst()).toBe("");
  });

  it("FR-6: Analyser har id-en som CV-feltet ser etter", () => {
    monter();

    expect(analyser()?.textContent).toBe("Analyser");
  });
});

describe("CvPanel, grenser og varsel", () => {
  it.each([
    [1, true],
    [299, true],
    [300, false],
  ])("FR-3: %i tegn gir varsel=%s", (lengde, varsel) => {
    const html = vis("a".repeat(lengde));

    expect(html.includes(KORT)).toBe(varsel);
  });

  it("FR-3: tomt felt i tilstand 2 gir ikke varsel", () => {
    monter();
    aapneKontroll();

    expect(screen.queryByText(KORT)).toBeNull();
  });

  it("FR-3: varselet har ikon og ikke role=alert", () => {
    const html = vis("Kort");

    expect(html).toContain('id="cv-varsel"');
    expect(html).toContain('aria-hidden="true"');
    expect(html).not.toContain('role="alert"');
  });

  it("FR-4: over 15 000 tegn får feltet grensetilstanden med en gang", () => {
    const html = vis("a".repeat(15001));

    expect(html).toContain('aria-invalid="true"');
    expect(html).toContain('aria-describedby="cv-teller cv-feil"');
    expect(html).toContain(LANG);
    expect(html).toContain("text-destructive");
  });

  it("FR-4: på 15 000 tegn er det ingen feil", () => {
    const html = vis("a".repeat(15000));

    expect(html).not.toContain('aria-invalid="true"');
    expect(html).not.toContain(LANG);
  });

  it("FR-4: CV-tekst over grensen gir årsaken under Analyser og én live-melding", () => {
    monter("a");
    const felt = screen.getByLabelText("CV-tekst");

    fireEvent.change(felt, { target: { value: "a".repeat(15001) } });

    expect(
      screen.getAllByRole("listitem").map((li) => li.textContent),
    ).toContain(`CV-teksten kan være maks 15${NBSP}000 tegn.`);
    expect(liveTekst()).toBe(LANG);
    expect((felt as HTMLTextAreaElement).value).toHaveLength(15001);
  });
});
