import { readFileSync } from "node:fs";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import { describe, expect, it } from "vitest";

import { pdfUtenTekst } from "@/testhjelp/pdf";

import { lesDocx } from "./docx";
import { lesPdf, ordneSide, type GetDocument, type Tekstbit } from "./pdf";
import { lesTxt } from "./txt";

const PAR = [
  "par-1-butikk-bank",
  "par-2-it-support",
  "par-3-regnskap",
  "par-4-tokolonne-hotell",
];

function arrayBuffer(bytes: Uint8Array): ArrayBuffer {
  return bytes.buffer.slice(
    bytes.byteOffset,
    bytes.byteOffset + bytes.byteLength,
  ) as ArrayBuffer;
}

function testfil(sti: string): ArrayBuffer {
  return arrayBuffer(readFileSync(`testdata/${sti}`));
}

function utenMellomrom(tekst: string): string {
  return tekst.replace(/\s+/g, "");
}

describe("lesTxt", () => {
  it.each(PAR)("FR-2: %s/cv.txt gir teksten i fila", (par) => {
    const forventet = readFileSync(`testdata/${par}/cv.txt`, "utf8");

    expect(utenMellomrom(lesTxt(testfil(`${par}/cv.txt`)))).toBe(
      utenMellomrom(forventet),
    );
  });

  it("FR-2: tom fil gir tom tekst", () => {
    expect(lesTxt(new ArrayBuffer(0))).toBe("");
  });

  it("FR-2: ugyldig UTF-8 (Windows-1252 med æøå) kaster", () => {
    // «Bærum» i Windows-1252: æ er 0xE6, som ikke er gyldig UTF-8 alene.
    const bytes = new Uint8Array([0x42, 0xe6, 0x72, 0x75, 0x6d]);

    expect(() => lesTxt(arrayBuffer(bytes))).toThrow();
  });
});

describe("lesDocx", () => {
  it("FR-2: par-1/cv.docx gir det samme som cv.txt", async () => {
    const forventet = readFileSync("testdata/par-1-butikk-bank/cv.txt", "utf8");
    const tekst = await lesDocx(testfil("par-1-butikk-bank/cv.docx"));

    expect(utenMellomrom(tekst)).toBe(utenMellomrom(forventet));
  });

  it("FR-2: tilfeldige byte kaster", async () => {
    const bytes = new Uint8Array(256).map((_, i) => (i * 37 + 11) % 256);

    await expect(lesDocx(arrayBuffer(bytes))).rejects.toThrow();
  });
});

function bit(
  tekst: string,
  x: number,
  y: number,
  bredde: number,
  storrelse = 10,
): Tekstbit {
  return { tekst, x, y, bredde, storrelse };
}

type Parametre = Parameters<GetDocument>[0];

// En falsk getDocument der hver side er en liste med tekstbiter, eller "feil" for
// en side der getTextContent avvises. Den tar vare på parametrene den får, teller
// kallene til destroy, og sidene har venstre kant `venstreKant`.
function falskGetDocument(
  sider: (Tekstbit[] | "feil")[],
  venstreKant = 0,
): GetDocument & { parametre: Parametre[]; kall: { destroy: number } } {
  const parametre: Parametre[] = [];
  const kall = { destroy: 0 };
  const falsk = (p: Parametre) => {
    parametre.push(p);
    return {
      promise: Promise.resolve({
        numPages: sider.length,
        getPage: async (nummer: number) => ({
          view: [venstreKant, 0, venstreKant + 595, 842],
          getTextContent: async () => {
            const side = sider[nummer - 1];
            if (side === "feil") throw new Error("ødelagt side");
            return {
              items: side.map((b) => ({
                str: b.tekst,
                transform: [b.storrelse, 0, 0, b.storrelse, b.x + venstreKant, b.y],
                width: b.bredde,
              })),
            };
          },
        }),
      }),
      destroy: async () => {
        kall.destroy++;
      },
    };
  };
  return Object.assign(falsk, { parametre, kall });
}

// Sjekker at begge ordene finnes før rekkefølgen sammenlignes, så et ord som
// mangler, ikke gir -1 og en grønn test.
function forventForan(tekst: string, forst: string, sist: string) {
  expect(tekst).toContain(forst);
  expect(tekst).toContain(sist);
  expect(tekst.indexOf(forst)).toBeLessThan(tekst.indexOf(sist));
}

describe("lesPdf", () => {
  it("FR-2: par-4/cv.pdf med to kolonner gir alle linjene uten blandede kolonner", async () => {
    const forventet = readFileSync("testdata/par-4-tokolonne-hotell/cv.txt", "utf8");
    const tekst = await lesPdf(testfil("par-4-tokolonne-hotell/cv.pdf"), getDocument);
    const fasitLinjer = forventet.split("\n").map(utenMellomrom).filter(Boolean);
    const linjer = tekst.split("\n").map(utenMellomrom).filter(Boolean);

    for (const linje of fasitLinjer) {
      expect(utenMellomrom(tekst)).toContain(linje);
    }
    // Hver linje i uttrekket er en del av én enkelt linje i cv.txt.
    for (const linje of linjer) {
      expect(fasitLinjer.some((fasit) => fasit.includes(linje)), linje).toBe(true);
    }
    expect(utenMellomrom(tekst)).toBe(utenMellomrom(forventet));
    forventForan(tekst, "SPRÅK", "PROFIL");
    forventForan(tekst, "KURS", "PROFIL");
  });

  it("FR-2: flere sider kommer i rekkefølge med en tom linje mellom", async () => {
    const tekst = await lesPdf(
      new ArrayBuffer(1),
      falskGetDocument([
        [bit("Side en", 40, 800, 40)],
        [bit("Side to", 40, 800, 40)],
      ]),
    );

    expect(tekst).toBe("Side en\n\nSide to");
  });

  it("FR-2: tomme sider hoppes over", async () => {
    const tekst = await lesPdf(
      new ArrayBuffer(1),
      falskGetDocument([
        [],
        [bit("Side to", 40, 800, 40)],
        [bit(" ", 40, 800, 40)],
        [bit("Side fire", 40, 800, 40)],
        [],
      ]),
    );

    expect(tekst).toBe("Side to\n\nSide fire");
  });

  it("FR-3: bare tomme sider gir tom tekst", async () => {
    await expect(
      lesPdf(new ArrayBuffer(1), falskGetDocument([[], [bit(" ", 40, 800, 40)], []])),
    ).resolves.toBe("");
  });

  it("FR-2: x regnes fra venstre kant av siden", async () => {
    // Med view [100, 0, 695, 842] ligger grensen ved 480–540 i fila, men ved
    // 380–440 fra venstre kant. Uten at venstre kant trekkes fra, havner den
    // utenfor søket (20–80 % av 595) og kolonnene flettes.
    const tekst = await lesPdf(
      new ArrayBuffer(1),
      falskGetDocument(
        [
          [
            bit("V1", 40, 800, 340),
            bit("H1", 440, 800, 115),
            bit("V2", 40, 780, 340),
            bit("H2", 440, 780, 115),
          ],
        ],
        100,
      ),
    );

    expect(tekst).toBe("V1\nV2\nH1\nH2");
  });

  it("FR-2: getDocument får en kopi av bufferen, isEvalSupported: false og ingen adresser", async () => {
    const data = new Uint8Array([1, 2, 3]).buffer;
    const falsk = falskGetDocument([[bit("Tekst", 40, 800, 40)]]);

    await lesPdf(data, falsk);

    expect(falsk.parametre).toHaveLength(1);
    const [parametre] = falsk.parametre;
    expect(parametre.isEvalSupported).toBe(false);
    expect(Object.keys(parametre).filter((navn) => /url$/i.test(navn))).toEqual([]);
    expect(Object.keys(parametre).sort()).toEqual(["data", "isEvalSupported"]);
    expect(parametre.data.buffer).not.toBe(data);
    expect([...parametre.data]).toEqual([1, 2, 3]);
  });

  it("FR-2: destroy kalles én gang etter en vellykket lesing", async () => {
    const falsk = falskGetDocument([[bit("Tekst", 40, 800, 40)]]);

    await expect(lesPdf(new ArrayBuffer(1), falsk)).resolves.toBe("Tekst");
    expect(falsk.kall.destroy).toBe(1);
  });

  it("FR-22: destroy kalles én gang når en side ikke kan leses", async () => {
    const falsk = falskGetDocument([[bit("Tekst", 40, 800, 40)], "feil"]);

    await expect(lesPdf(new ArrayBuffer(1), falsk)).rejects.toThrow("ødelagt side");
    expect(falsk.kall.destroy).toBe(1);
  });

  it("FR-3: en PDF uten tekstlag gir tom tekst", async () => {
    await expect(lesPdf(arrayBuffer(pdfUtenTekst()), getDocument)).resolves.toBe("");
  });

  it("FR-22: tilfeldige byte kaster", async () => {
    const bytes = new Uint8Array(256).map((_, i) => (i * 37 + 11) % 256);

    await expect(lesPdf(arrayBuffer(bytes), getDocument)).rejects.toThrow();
  });
});

describe("ordneSide", () => {
  it("FR-2: én kolonne sorteres etter y og så x, også med biter i omvendt rekkefølge", () => {
    const tekst = ordneSide(
      [
        bit("Nederst", 40, 600, 40),
        bit("høyre", 350, 700, 30),
        bit("venstre", 40, 700, 300),
        bit("Øverst over hele bredden", 40, 800, 500),
      ],
      595,
    );

    expect(tekst).toBe("Øverst over hele bredden\nvenstre høyre\nNederst");
  });

  it("FR-2: biter med y innenfor 2 pt er én linje", () => {
    expect(
      ordneSide([bit("b", 60, 701.5, 10), bit("a", 40, 700, 10)], 595),
    ).toBe("a b");
  });

  it("FR-2: y-avstand på 2,0 pt er én linje, 2,1 pt er to", () => {
    expect(ordneSide([bit("b", 60, 702, 10), bit("a", 40, 700, 10)], 595)).toBe(
      "a b",
    );
    expect(ordneSide([bit("b", 60, 702.1, 10), bit("a", 40, 700, 10)], 595)).toBe(
      "b\na",
    );
  });

  it("FR-2: et tomt felt på nøyaktig 12 pt deler i kolonner, 11,9 pt gjør det ikke", () => {
    const side = (hoyreX: number) =>
      ordneSide(
        [
          bit("V1", 40, 800, 200),
          bit("H1", hoyreX, 800, 100),
          bit("V2", 40, 780, 200),
          bit("H2", hoyreX, 780, 100),
        ],
        595,
      );

    expect(side(252)).toBe("V1\nV2\nH1\nH2");
    expect(side(251.9)).toBe("V1 H1\nV2 H2");
  });

  it("FR-2: to kolonner gir hele venstre kolonne før hele høyre", () => {
    const tekst = ordneSide(
      [
        bit("V1", 40, 800, 100),
        bit(" ", 140, 800, 85),
        bit("H1", 225, 800, 200),
        bit("V2", 40, 780, 100),
        bit("H2", 225, 780, 200),
      ],
      595,
    );

    expect(tekst).toBe("V1\nV2\nH1\nH2");
  });

  it("FR-2: topptekst og bunntekst over hele bredden kommer først og sist, kolonnene hver for seg", () => {
    // Eksempelet i spec-en: sentrert navn, kontaktlinje over hele bredden, ni rader
    // med to kolonner og en bunnlinje. 12 linjer, så høyst tre kan fjernes.
    const rader = Array.from({ length: 9 }, (_, i) => i + 1);
    const tekst = ordneSide(
      [
        bit("Referanser oppgis på forespørsel", 40, 60, 515),
        ...rader.flatMap((i) => [
          bit(`Venstre ${i}`, 40, 760 - i * 20, 140),
          bit(`Høyre ${i}`, 225, 760 - i * 20, 330),
        ]),
        bit("kari@example.no · 400 00 000 · Bergen", 40, 780, 515),
        bit("KARI NORDMANN", 220, 800, 155),
      ],
      595,
    );

    expect(tekst.split("\n")).toEqual([
      "KARI NORDMANN",
      "kari@example.no · 400 00 000 · Bergen",
      ...rader.map((i) => `Venstre ${i}`),
      ...rader.map((i) => `Høyre ${i}`),
      "Referanser oppgis på forespørsel",
    ]);
  });

  it("FR-2: bare bunntekst over hele bredden skrives sist", () => {
    const tekst = ordneSide(
      [
        bit("V1", 40, 800, 100),
        bit("H1", 225, 800, 200),
        bit("V2", 40, 780, 100),
        bit("H2", 225, 780, 200),
        bit("V3", 40, 760, 100),
        bit("H3", 225, 760, 200),
        bit("V4", 40, 740, 100),
        bit("H4", 225, 740, 200),
        bit("Side 1 av 1", 40, 60, 515),
      ],
      595,
    );

    expect(tekst).toBe("V1\nV2\nV3\nV4\nH1\nH2\nH3\nH4\nSide 1 av 1");
  });

  it("FR-2: ved lik sum fjernes den øverste linjen før den nederste", () => {
    // Tre spalter med to mulige grenser. Toppen dekker bare grensen 150–200 og
    // bunnen bare 330–400, så begge kan fjernes alene, men de gir ulik tekst.
    const rader = [1, 2, 3];
    const tekst = ordneSide(
      [
        bit("Topp", 140, 820, 70),
        ...rader.flatMap((i) => [
          bit(`L${i}`, 40, 820 - i * 20, 110),
          bit(`M${i}`, 200, 820 - i * 20, 130),
          bit(`R${i}`, 400, 820 - i * 20, 155),
        ]),
        bit("Bunn", 320, 700, 90),
      ],
      595,
    );

    expect(tekst).toBe("Topp\nL1\nL2\nL3\nM1 R1\nM2 R2\nM3 R3\nBunn");
  });

  it("FR-2: bare linjer som krysser grensen, blir topptekst, så ingen linje blander kolonnene", () => {
    // Linje 1–2 er vanlige rader med to kolonner, linje 3 en skillelinje over hele
    // bredden og linje 4–12 nye rader. Bare skillelinjen er topptekst.
    const rad = (i: number, y: number) => [
      bit(`V${i}`, 40, y, 140),
      bit(`H${i}`, 225, y, 330),
    ];
    const tekst = ordneSide(
      [
        ...rad(1, 800),
        ...rad(2, 780),
        bit("————————", 40, 760, 515),
        ...Array.from({ length: 9 }, (_, i) => rad(i + 3, 740 - i * 20)).flat(),
      ],
      595,
    );
    const linjer = tekst.split("\n");

    expect(linjer).toHaveLength(23);
    for (const linje of linjer) {
      expect(/V\d/.test(linje) && /H\d/.test(linje), linje).toBe(false);
    }
    expect(linjer).toEqual([
      "————————",
      ...Array.from({ length: 11 }, (_, i) => `V${i + 1}`),
      ...Array.from({ length: 11 }, (_, i) => `H${i + 1}`),
    ]);
  });

  it("FR-2: høyst en fjerdedel av linjene kan være topp- og bunntekst", () => {
    // Tre linjer gir null linjer å fjerne, så siden leses som én kolonne.
    const tekst = ordneSide(
      [
        bit("Topp over hele bredden", 40, 820, 515),
        bit("V1", 40, 800, 100),
        bit("H1", 225, 800, 200),
        bit("V2", 40, 780, 100),
        bit("H2", 225, 780, 200),
      ],
      595,
    );

    expect(tekst).toBe("Topp over hele bredden\nV1 H1\nV2 H2");
  });

  it("FR-2: et tomt felt under 12 pt gir én kolonne", () => {
    const tekst = ordneSide(
      [
        bit("V1", 40, 800, 250),
        bit("H1", 300, 800, 200),
        bit("V2", 40, 780, 250),
      ],
      595,
    );

    expect(tekst).toBe("V1 H1\nV2");
  });

  it("FR-2: ord i flere biter skjøtes uten mellomrom, og avstand gir mellomrom", () => {
    const tekst = ordneSide(
      [
        bit("Reiselivs", 40, 800, 40, 9),
        bit("student", 80, 800, 32, 9),
        bit("2024–nå", 40, 780, 35, 9),
        bit("Servitør", 85, 780, 40, 9),
      ],
      595,
    );

    expect(tekst).toBe("Reiselivsstudent\n2024–nå Servitør");
  });

  it("FR-2: mellomrom bare når avstanden er større enn 0,15 × tekststørrelsen", () => {
    expect(ordneSide([bit("a", 40, 800, 10), bit("b", 51.5, 800, 10)], 595)).toBe(
      "ab",
    );
    expect(ordneSide([bit("a", 40, 800, 10), bit("b", 51.6, 800, 10)], 595)).toBe(
      "a b",
    );
  });

  it("FR-3: en side med bare mellomrom gir tom tekst", () => {
    expect(ordneSide([bit(" ", 40, 800, 100)], 595)).toBe("");
  });
});
