import { beforeEach, describe, expect, it, vi } from "vitest";

// pdfjs-dist byttes ut med en falsk modul. `workerSrc` teller hvor mange ganger
// den settes, slik at testen ser om oppsettet kjøres én gang.
function falskPdfjs(kastVedOppsett = false) {
  const modul = {
    getDocument: () => {},
    satt: [] as string[],
    GlobalWorkerOptions: {
      get workerSrc() {
        return modul.satt.at(-1) ?? "";
      },
      set workerSrc(verdi: string) {
        if (kastVedOppsett) throw new Error("oppsett feilet");
        modul.satt.push(verdi);
      },
    },
  };
  return modul;
}

beforeEach(() => {
  vi.resetModules();
});

describe("hentGetDocument", () => {
  it("FR-2: setter workerSrc til workeren i appen og gir getDocument", async () => {
    const pdfjs = falskPdfjs();
    vi.doMock("pdfjs-dist", () => pdfjs);
    const { hentGetDocument } = await import("./pdfjs");

    const getDocument = await hentGetDocument();

    expect(getDocument).toBe(pdfjs.getDocument);
    expect(pdfjs.GlobalWorkerOptions.workerSrc).toMatch(/pdf\.worker\.min\.mjs$/);
    expect(pdfjs.GlobalWorkerOptions.workerSrc).toContain(
      "pdfjs-dist/build/pdf.worker.min.mjs",
    );
  });

  it("FR-2: flere kall importerer og setter workeren én gang", async () => {
    let importer = 0;
    const pdfjs = falskPdfjs();
    vi.doMock("pdfjs-dist", () => {
      importer++;
      return pdfjs;
    });
    const { hentGetDocument } = await import("./pdfjs");

    const [forste, andre] = await Promise.all([hentGetDocument(), hentGetDocument()]);
    await hentGetDocument();

    expect(forste).toBe(andre);
    expect(importer).toBe(1);
    expect(pdfjs.satt).toHaveLength(1);
  });

  it("FR-22: etter en import som feiler, prøver neste kall igjen", async () => {
    vi.doMock("pdfjs-dist", () => {
      throw new Error("chunken kunne ikke lastes");
    });
    const { hentGetDocument } = await import("./pdfjs");

    await expect(hentGetDocument()).rejects.toThrow();

    const pdfjs = falskPdfjs();
    vi.doMock("pdfjs-dist", () => pdfjs);
    await expect(hentGetDocument()).resolves.toBe(pdfjs.getDocument);
  });

  it("FR-22: en feil i oppsettet etter importen glemmes også", async () => {
    vi.doMock("pdfjs-dist", () => falskPdfjs(true));
    const { hentGetDocument } = await import("./pdfjs");

    await expect(hentGetDocument()).rejects.toThrow("oppsett feilet");

    const pdfjs = falskPdfjs();
    vi.doMock("pdfjs-dist", () => pdfjs);
    await expect(hentGetDocument()).resolves.toBe(pdfjs.getDocument);
  });
});
