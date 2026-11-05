import { describe, expect, it } from "vitest";

import { CV_KORT, CV_MAKS } from "@/lib/kontrakt/grenser";

import { annonseStatus, cvStatus, tegnAntall } from "./grenser";

describe("annonseStatus", () => {
  it.each([
    [0, "tom"],
    [1, "for_kort"],
    [199, "for_kort"],
    [200, "ok"],
    [8000, "ok"],
    [8001, "for_lang"],
  ])("FR-4: %i tegn gir riktig status", (lengde, forventet) => {
    expect(annonseStatus("a".repeat(lengde))).toBe(forventet);
  });

  it("FR-4: bare mellomrom er tomt", () => {
    expect(annonseStatus("   \n\t ")).toBe("tom");
  });

  it("FR-4: mellomrom rundt teksten teller ikke", () => {
    expect(annonseStatus(`  ${"a".repeat(199)}  `)).toBe("for_kort");
    expect(annonseStatus(`  ${"a".repeat(8000)}  `)).toBe("ok");
  });
});

describe("tegnAntall", () => {
  it("FR-4: måler etter trim", () => {
    expect(tegnAntall("  abc \n")).toBe(3);
    expect(tegnAntall("a b")).toBe(3);
    expect(tegnAntall("   ")).toBe(0);
  });
});

describe("cvStatus", () => {
  it.each([
    [0, "tom"],
    [1, "ok"],
    [299, "ok"],
    [15000, "ok"],
    [15001, "for_lang"],
  ])("FR-4: %i tegn gir riktig status", (lengde, forventet) => {
    expect(cvStatus("a".repeat(lengde))).toBe(forventet);
  });

  it("FR-4: bare mellomrom er tomt", () => {
    expect(cvStatus("  \n\t ")).toBe("tom");
  });

  it("FR-4: mellomrom rundt teksten teller ikke", () => {
    expect(cvStatus(`  ${"a".repeat(15000)}  \n`)).toBe("ok");
  });
});

describe("CV-grensene", () => {
  it("FR-3, FR-4: maks 15 000 tegn og varsel under 300 tegn", () => {
    expect(CV_MAKS).toBe(15000);
    expect(CV_KORT).toBe(300);
  });
});
