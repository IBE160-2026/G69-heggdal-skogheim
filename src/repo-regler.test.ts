import { spawnSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { describe, expect, it } from "vitest";

function erBlokkert(sti: string) {
  const { status } = spawnSync("git", ["check-ignore", "--no-index", "-q", sti]);

  return status === 0;
}

function kodefiler(mappe: string): string[] {
  return readdirSync(mappe, { recursive: true, encoding: "utf8" })
    .filter((fil) => /\.(ts|tsx|css)$/.test(fil))
    .map((fil) => join(mappe, fil));
}

function filerMed(monster: RegExp, filer: string[]) {
  return filer
    .filter((fil) => monster.test(readFileSync(fil, "utf8")))
    .map((fil) => relative("src", fil).split(sep).join("/"));
}

const SRC = kodefiler("src").filter(
  (fil) => relative("src", fil) !== "repo-regler.test.ts",
);

const FORBUDT_I_UI =
  /opacity-|outline-none|focus-visible:ring|(?<![\w-])ring-|text-destructive\/\d/;

describe("gitignore for CV-filer", () => {
  it.each(["x.pdf", "x.docx", "X.PDF"])(
    "NFR-2: %s i rotmappa er blokkert",
    (sti) => {
      expect(erBlokkert(sti)).toBe(true);
    },
  );

  it.each([
    "testdata/par-4-tokolonne-hotell/cv.pdf",
    "testdata/par-1-butikk-bank/cv.docx",
    "testdata/ny/ny.pdf",
  ])("NFR-2: %s er tillatt", (sti) => {
    expect(erBlokkert(sti)).toBe(false);
  });
});

describe("lagring i nettleseren", () => {
  it.each(["localStorage", "sessionStorage", "indexedDB", "document.cookie"])(
    "NFR-1: %s brukes ikke i src",
    (navn) => {
      const monster = new RegExp(navn.replace(".", "\\."));

      expect(filerMed(monster, SRC)).toEqual([]);
    },
  );
});

describe("nettverk", () => {
  it("AD-6: fetch brukes bare i lib/okt", () => {
    const utenforOkt = SRC.filter(
      (fil) => !relative("src", fil).split(sep).join("/").startsWith("lib/okt/"),
    );

    expect(filerMed(/\bfetch\(/, utenforOkt)).toEqual([]);
  });
});

describe("tema", () => {
  it("UX-DR1: shadcn-komponentene har ikke opasitet eller egen fokusring", () => {
    expect(
      filerMed(
        FORBUDT_I_UI,
        kodefiler("src/components/ui"),
      ),
    ).toEqual([]);
  });

  it.each(["aria-invalid:ring-3", "ring-ring/50", "focus-visible:ring"])(
    "UX-DR1: vakten stopper %s",
    (klasse) => {
      expect(FORBUDT_I_UI.test(klasse)).toBe(true);
    },
  );

  it.each(["string-verdi", "during-x", "sidebar-ring-farge", "ring"])(
    "UX-DR1: vakten godtar %s",
    (ord) => {
      expect(FORBUDT_I_UI.test(ord)).toBe(false);
    },
  );

  it("UX-DR1: tokenene og fokusringen står i globals.css", () => {
    const css = readFileSync("src/app/globals.css", "utf8");

    for (const token of [
      "--background: #fafaf7",
      "--foreground: #1c1917",
      "--muted-foreground: #5f6b7a",
      "--input: #8a857c",
      "--ring: #1f5f5b",
      "--destructive: #b91c1c",
      "--primary: #1f5f5b",
      "--primary-foreground: #ffffff",
      "--primary-soft: #e6f0ef",
      "--oppfylt: #1c6b3c",
      "--oppfylt-bg: #e7f4ec",
      "--delvis: #7a5200",
      "--delvis-bg: #fdf3dc",
      "--mangler: #9a3412",
      "--mangler-bg: #fdede5",
      "--belegg: #3f3a33",
      "--belegg-bg: #f5f3ee",
      "--text-page-title:",
      "--text-section-title:",
      "--text-letter:",
      "--text-hit-rate:",
      "--text-label:",
      "--container-content-max:",
      "--container-letter-max: 680px",
      "outline: 2px solid var(--ring)",
      "outline-offset: 2px",
      "overflow-wrap: anywhere",
      "@custom-variant dark",
    ]) {
      expect(css).toContain(token);
    }
    expect(css).not.toContain("outline-ring/50");
  });
});
