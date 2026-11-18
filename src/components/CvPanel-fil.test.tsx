// @vitest-environment jsdom
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { CV_FIL_MAKS } from "@/lib/kontrakt/grenser";
import { OktProvider } from "@/lib/okt/OktProvider";
import { pdfUtenTekst } from "@/testhjelp/pdf";

// Uten mock prøver jsdom å laste den ekte pdfjs. Legacy-builden kjører i testen,
// med workeren fra node_modules som en file-URL.
vi.mock("@/lib/okt/pdfjs", () => ({
  hentGetDocument: async () => {
    const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
    pdfjs.GlobalWorkerOptions.workerSrc = pathToFileURL(
      resolve("node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs"),
    ).href;
    return pdfjs.getDocument;
  },
}));

import { AnalyserKnapp } from "./AnalyserKnapp";
import { CvPanel } from "./CvPanel";
import { Kunngjoring } from "./Kunngjoring";

const DOCX = new Uint8Array(readFileSync("testdata/par-1-butikk-bank/cv.docx"));
const TXT = readFileSync("testdata/par-1-butikk-bank/cv.txt", "utf8");
const PDF = new Uint8Array(
  readFileSync("testdata/par-4-tokolonne-hotell/cv.pdf"),
);
const FJERNET = "[fødselsnummer fjernet]";
const EN_FJERNET = "1 fødselsnummer er fjernet fra CV-teksten.";
const FIL_AVVIST =
  "Filen kan ikke brukes. Velg en PDF-, DOCX- eller TXT-fil på maks 5 MB.";
const LESEFEIL = "Klarte ikke å lese filen. Lim inn CV-teksten i stedet.";
const KORT =
  "Fant nesten ikke tekst i filen. Den kan være skannet eller tom. Lim inn teksten selv i feltet under.";

let fetchMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
  // Status holdes ventende, så bare handlingene i testen endrer tilstanden.
  fetchMock = vi.fn(() => new Promise(() => {}));
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

function monter() {
  render(
    <OktProvider>
      <CvPanel />
      <AnalyserKnapp />
      <Kunngjoring />
    </OktProvider>,
  );
}

function tilArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  return bytes.buffer.slice(
    bytes.byteOffset,
    bytes.byteOffset + bytes.byteLength,
  ) as ArrayBuffer;
}

// Innholdet gis direkte, så testen ikke avhenger av Blob-lesing i jsdom.
function fil(
  innhold: Uint8Array | string,
  navn: string,
  les?: () => Promise<ArrayBuffer>,
): File {
  const bytes =
    typeof innhold === "string" ? new TextEncoder().encode(innhold) : innhold;
  const ny = new File([bytes as BlobPart], navn);
  ny.arrayBuffer = les ?? (() => Promise.resolve(tilArrayBuffer(bytes)));
  return ny;
}

function storFil(navn: string): File {
  const ny = fil("a", navn);
  Object.defineProperty(ny, "size", { value: CV_FIL_MAKS + 1 });
  return ny;
}

function velgKnapp() {
  return screen.getByRole("button", { name: "Velg CV-fil" });
}

function filvelger() {
  return document.querySelector('input[type="file"]') as HTMLInputElement;
}

function velg(ny: File) {
  fireEvent.change(filvelger(), { target: { files: [ny] } });
}

function slipp(ny: File) {
  const sone = velgKnapp().parentElement as HTMLElement;
  fireEvent.dragOver(sone, {
    dataTransfer: { files: [ny], types: ["Files"], dropEffect: "none" },
  });
  fireEvent.drop(sone, { dataTransfer: { files: [ny], types: ["Files"] } });
}

function liveTekst() {
  return document.querySelector("[aria-live]")?.textContent;
}

async function kontrollFelt() {
  return (await screen.findByLabelText("CV-tekst")) as HTMLTextAreaElement;
}

function utenMellomrom(tekst: string) {
  return tekst.replace(/\s+/g, "");
}

// Et svar som holdes tilbake til testen sender det.
function ventendeLesing() {
  let send: (data: ArrayBuffer) => void = () => {};
  const les = () =>
    new Promise<ArrayBuffer>((ok) => {
      send = ok;
    });
  return { les, send: (tekst: string) => send(tilArrayBuffer(new TextEncoder().encode(tekst))) };
}

describe("CvPanel, opplasting", () => {
  it("UX-DR4: Velg CV-fil er en knapp som åpner en skjult filvelger", () => {
    monter();
    const klikk = vi.spyOn(filvelger(), "click");

    fireEvent.click(velgKnapp());

    expect(velgKnapp().tagName).toBe("BUTTON");
    expect(filvelger().hidden).toBe(true);
    expect(filvelger().accept).toBe(".pdf,.docx,.txt");
    expect(klikk).toHaveBeenCalledOnce();
  });

  it("FR-1: cv.docx med knappen gir «Leser CV-en …», så kontrollsteget med fokus", async () => {
    monter();

    velg(fil(DOCX, "cv.docx"));

    expect(screen.getByText("Leser CV-en …", { selector: "section p" })).toBeTruthy();
    expect(liveTekst()).toBe("Leser CV-en …");
    const felt = await kontrollFelt();
    expect(utenMellomrom(felt.value)).toBe(utenMellomrom(TXT));
    expect(screen.getByText("cv.docx")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Bytt fil" })).toBeTruthy();
    expect(document.activeElement).toBe(felt);
  });

  it("FR-1: CV.DOCX med dra og slipp gir kontrollsteget", async () => {
    monter();

    slipp(fil(DOCX, "CV.DOCX"));

    const felt = await kontrollFelt();
    expect(utenMellomrom(felt.value)).toBe(utenMellomrom(TXT));
    expect(screen.getByText("CV.DOCX")).toBeTruthy();
    expect(document.activeElement).toBe(felt);
  });

  it("FR-1: cv.pdf med to kolonner gir «Leser CV-en …», så kontrollsteget med fokus", async () => {
    monter();

    velg(fil(PDF, "cv.pdf"));

    expect(screen.getByText("Leser CV-en …", { selector: "section p" })).toBeTruthy();
    const felt = await kontrollFelt();
    expect(felt.value).toContain("SPRÅK");
    expect(felt.value).toContain("PROFIL");
    expect(felt.value.indexOf("SPRÅK")).toBeLessThan(felt.value.indexOf("PROFIL"));
    expect(felt.value).toContain("Reiselivsstudent som trives");
    expect(screen.getByText("cv.pdf")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Bytt fil" })).toBeTruthy();
    expect(document.activeElement).toBe(felt);
  });

  it("FR-1: CV.PDF med dra og slipp gir kontrollsteget", async () => {
    monter();

    slipp(fil(PDF, "CV.PDF"));

    expect(screen.getByText("Leser CV-en …", { selector: "section p" })).toBeTruthy();
    const felt = await kontrollFelt();
    expect(felt.value).toContain("MINA FIKTIVSEN");
    expect(felt.value).toContain("SPRÅK");
    expect(felt.value).toContain("PROFIL");
    expect(felt.value.indexOf("SPRÅK")).toBeLessThan(felt.value.indexOf("PROFIL"));
    expect(screen.getByText("CV.PDF")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Bytt fil" })).toBeTruthy();
    expect(document.activeElement).toBe(felt);
  });

  it("FR-6: fødselsnummer i en TXT-fil maskeres, med linje og live-melding", async () => {
    monter();

    velg(fil(`${"a".repeat(300)} 01019012345`, "cv.txt"));

    const felt = await kontrollFelt();
    expect(felt.value).toBe(`${"a".repeat(300)} ${FJERNET}`);
    expect(document.getElementById("cv-fjernet")?.textContent).toBe(EN_FJERNET);
    expect(liveTekst()).toBe(EN_FJERNET);
  });

  it("FR-4: over 15 000 tegn kuttes ikke og får grensetilstanden", async () => {
    monter();

    velg(fil("a".repeat(15001), "cv.txt"));

    const felt = await kontrollFelt();
    expect(felt.value).toHaveLength(15001);
    expect(felt.getAttribute("aria-invalid")).toBe("true");
  });

  it("FR-2: filinnholdet sendes ikke over nettverket", async () => {
    monter();

    velg(fil("Hemmelig CV", "cv.txt"));
    await kontrollFelt();

    for (const [, init] of fetchMock.mock.calls as [unknown, RequestInit?][]) {
      expect(init?.body).toBeUndefined();
    }
    expect(JSON.stringify(fetchMock.mock.calls)).not.toContain("Hemmelig");
  });
});

describe("CvPanel, avviste filer", () => {
  it.each([
    ["for stor", () => storFil("cv.txt"), FIL_AVVIST],
    ["PDF for stor", () => storFil("cv.pdf"), FIL_AVVIST],
    ["odt", () => fil("x", "cv.odt"), FIL_AVVIST],
    ["doc", () => fil("x", "cv.doc"), FIL_AVVIST],
    ["uten endelse", () => fil("x", "cv"), FIL_AVVIST],
  ])("FR-1: %s avvises med meldingen under feltet", (_, lag, melding) => {
    monter();
    const ny = lag();
    const les = vi.spyOn(ny, "arrayBuffer");

    velg(ny);

    const varsel = screen.getByRole("alert");
    expect(varsel.textContent).toBe(melding);
    expect(velgKnapp().getAttribute("aria-describedby")).toContain(varsel.id);
    expect(document.activeElement).toBe(velgKnapp());
    expect(les).not.toHaveBeenCalled();
    expect(screen.queryByLabelText("CV-tekst")).toBeNull();
  });

  it("FR-1: en avvist fil som slippes, gir fokus på knappen", () => {
    monter();

    slipp(fil("x", "cv.odt"));

    expect(screen.getByRole("alert").textContent).toBe(FIL_AVVIST);
    expect(document.activeElement).toBe(velgKnapp());
  });

  it("FR-1: en avvist fil mens en annen leses, fjerner «Leser CV-en …»", () => {
    monter();
    velg(fil("Gammel", "treg.txt", ventendeLesing().les));

    velg(fil("x", "cv.odt"));

    expect(screen.queryByText("Leser CV-en …", { selector: "section p" })).toBeNull();
    expect(screen.getByRole("alert").textContent).toBe(FIL_AVVIST);
    expect(document.activeElement).toBe(velgKnapp());
  });

  it("FR-1: samme avvisning to ganger monterer et nytt varsel", () => {
    monter();
    velg(fil("x", "cv.odt"));
    const forste = screen.getByRole("alert");

    velg(fil("x", "cv.odt"));

    const andre = screen.getByRole("alert");
    expect(andre.textContent).toBe(FIL_AVVIST);
    expect(andre).not.toBe(forste);
  });

  it("FR-1: en ny godkjent fil fjerner meldingen", async () => {
    monter();
    velg(fil("x", "cv.odt"));

    velg(fil("Ola", "cv.txt"));

    await kontrollFelt();
    expect(screen.queryByRole("alert")).toBeNull();
  });
});

describe("CvPanel, slipp utenfor feltet", () => {
  function slippPaVindu(type: string, typer: string[]) {
    const hendelse = new Event(type, { bubbles: true, cancelable: true });
    Object.defineProperty(hendelse, "dataTransfer", { value: { types: typer } });
    window.dispatchEvent(hendelse);
    return hendelse.defaultPrevented;
  }

  it.each(["dragover", "drop"])("FR-2: %s med en fil på vinduet hindres", (type) => {
    monter();

    expect(slippPaVindu(type, ["Files"])).toBe(true);
  });

  it.each(["dragover", "drop"])("FR-2: %s med bare tekst hindres ikke", (type) => {
    monter();

    expect(slippPaVindu(type, ["text/plain"])).toBe(false);
  });

  it("FR-2: lytterne fjernes når panelet avmonteres", () => {
    monter();
    cleanup();

    expect(slippPaVindu("drop", ["Files"])).toBe(false);
  });
});

describe("CvPanel, filer som ikke kan leses", () => {
  it("FR-22: lesefeilen forsvinner når brukeren skriver inn tekst", async () => {
    monter();
    velg(fil(new Uint8Array([0x42, 0xe6, 0x72]), "cv.txt"));
    const felt = await kontrollFelt();
    expect(screen.getByText(LESEFEIL)).toBeTruthy();

    fireEvent.change(felt, { target: { value: "Ola Nordmann" } });

    expect(screen.queryByText(LESEFEIL)).toBeNull();
    expect(felt.getAttribute("aria-describedby")).not.toContain("cv-lesefeil");
  });

  it.each([
    ["ødelagt DOCX", () => fil(new Uint8Array(256).fill(7), "cv.docx")],
    ["ødelagt PDF", () => fil(new Uint8Array(256).fill(7), "cv.pdf")],
    ["TXT i Windows-1252", () => fil(new Uint8Array([0x42, 0xe6, 0x72]), "cv.txt")],
    [
      "lesefeil i nettleseren",
      () => fil("Ola", "cv.txt", () => Promise.reject(new Error("NotReadableError"))),
    ],
  ])("FR-22: %s gir tomt felt med fokus og meldingen", async (_, lag) => {
    monter();

    velg(lag());

    const felt = await kontrollFelt();
    const melding = screen.getByText(LESEFEIL);
    expect(felt.value).toBe("");
    expect(document.activeElement).toBe(felt);
    expect(felt.getAttribute("aria-describedby")).toContain(melding.id);
    expect(screen.getByRole("button", { name: "Bytt fil" })).toBeTruthy();
  });

  it.each([
    ["0 byte", ""],
    ["bare mellomrom", "  \n\t "],
  ])("FR-3: tom fil (%s) gir tomt felt, filnavn og varsel", async (_, innhold) => {
    monter();

    velg(fil(innhold, "tom.txt"));

    const felt = await kontrollFelt();
    expect(felt.value).toBe(innhold);
    expect(screen.getByText("tom.txt")).toBeTruthy();
    expect(screen.getByText(KORT)).toBeTruthy();
    expect(screen.queryByText(LESEFEIL)).toBeNull();
    expect(document.activeElement).toBe(felt);
  });

  it("FR-3: en skannet PDF uten tekstlag gir tomt felt med fokus og varsel, og tekst kan skrives inn", async () => {
    monter();

    velg(fil(pdfUtenTekst(), "cv.pdf"));

    const felt = await kontrollFelt();
    expect(felt.value).toBe("");
    expect(screen.getByText("cv.pdf")).toBeTruthy();
    expect(screen.getByText(KORT)).toBeTruthy();
    expect(screen.queryByText(LESEFEIL)).toBeNull();
    expect(document.activeElement).toBe(felt);

    fireEvent.change(felt, { target: { value: "Ola Nordmann" } });

    expect(felt.value).toBe("Ola Nordmann");
  });
});

describe("CvPanel, Bytt fil", () => {
  it("UX-DR24: Bytt fil gir tilstand 1 uten tekst og filnavn, med fokus på Velg CV-fil", async () => {
    monter();
    velg(fil("Ola Nordmann", "cv.txt"));
    await kontrollFelt();

    fireEvent.click(screen.getByRole("button", { name: "Bytt fil" }));

    expect(screen.queryByLabelText("CV-tekst")).toBeNull();
    expect(screen.queryByText("cv.txt")).toBeNull();
    expect(screen.getByRole("heading", { name: "CV" })).toBeTruthy();
    expect(document.activeElement).toBe(velgKnapp());
  });

  it("FR-1: etter Bytt fil kan en ny fil leses", async () => {
    monter();
    velg(fil("Ola", "en.txt"));
    await kontrollFelt();
    fireEvent.click(screen.getByRole("button", { name: "Bytt fil" }));

    velg(fil("Kari", "to.txt"));

    expect((await kontrollFelt()).value).toBe("Kari");
    expect(screen.getByText("to.txt")).toBeTruthy();
  });

  it("FR-1: innlimt tekst uten fil har ikke Bytt fil", () => {
    monter();
    fireEvent.click(screen.getByRole("button", { name: "Lim inn CV-teksten" }));

    expect(screen.queryByRole("button", { name: "Bytt fil" })).toBeNull();
  });

  it("FR-1: et svar som kommer etter en ny fil, ignoreres", async () => {
    monter();
    const treg = ventendeLesing();

    velg(fil("Gammel", "treg.txt", treg.les));
    velg(fil("Ny", "ny.txt"));
    const felt = await kontrollFelt();
    await act(async () => treg.send("Gammel"));

    expect(felt.value).toBe("Ny");
    expect(screen.getByText("ny.txt")).toBeTruthy();
  });

  it("FR-1: svaret fra en eldre fil ignoreres mens den nye fortsatt leses", async () => {
    monter();
    const a = ventendeLesing();
    const b = ventendeLesing();

    velg(fil("A", "a.txt", a.les));
    velg(fil("B", "b.txt", b.les));
    await act(async () => a.send("Tekst fra A"));

    expect(screen.queryByLabelText("CV-tekst")).toBeNull();
    expect(screen.getByText("Leser CV-en …", { selector: "section p" })).toBeTruthy();

    await act(async () => b.send("Tekst fra B"));

    const felt = await kontrollFelt();
    expect(felt.value).toBe("Tekst fra B");
    expect(screen.getByText("b.txt")).toBeTruthy();
    expect(document.body.textContent).not.toContain("Tekst fra A");
  });

  it("FR-1: Lim inn CV-teksten mens en fil leses, slipper filen", async () => {
    monter();
    const treg = ventendeLesing();
    velg(fil("Gammel", "treg.txt", treg.les));

    fireEvent.click(screen.getByRole("button", { name: "Lim inn CV-teksten" }));
    const felt = await kontrollFelt();
    await act(async () => treg.send("Gammel"));

    expect(felt.value).toBe("");
    expect(screen.queryByText("treg.txt")).toBeNull();
  });
});
