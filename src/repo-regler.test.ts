import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";

function erBlokkert(sti: string) {
  const { status } = spawnSync("git", ["check-ignore", "--no-index", "-q", sti]);

  return status === 0;
}

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
