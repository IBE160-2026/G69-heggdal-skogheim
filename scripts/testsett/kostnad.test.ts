import { describe, expect, it } from "vitest";

import { kostnad, kroner, kronerMedUkjente, snittKostnad } from "./kostnad";

describe("kostnad", () => {
  it("SM-8: tokens / 1 000 000 × pris for input og output", () => {
    // 2000 × 4 / 1e6 + 500 × 20 / 1e6 = 0,008 + 0,01
    expect(kostnad(2000, 500, 4, 20)).toBeCloseTo(0.018, 10);
    expect(kostnad(1_000_000, 0, 4, 20)).toBe(4);
    expect(kostnad(0, 10, 4, 20)).toBeCloseTo(0.0002, 10);
  });

  it("SM-8: ukjente tokens, også 0 inn og 0 ut, gir ukjent kostnad", () => {
    expect(kostnad(null, null, 4, 20)).toBeNull();
    expect(kostnad(0, 0, 4, 20)).toBeNull();
    expect(kroner(null)).toBe("ukjent");
  });

  it("SM-8: gjennomsnittet per par hopper over ukjente kostnader", () => {
    expect(snittKostnad([0.01, null, 0.03])).toBeCloseTo(0.02, 10);
    expect(snittKostnad([null])).toBeNull();
    expect(snittKostnad([])).toBeNull();
  });

  it("SM-8: kroner med fire desimaler og komma", () => {
    expect(kroner(0.018)).toBe("0,0180 kr");
    expect(kroner(1.23456)).toBe("1,2346 kr");
  });

  it("SM-8: med ukjente kostnader er beløpet en nedre grense", () => {
    expect(kronerMedUkjente(0.018, [0.018])).toBe("0,0180 kr");
    expect(kronerMedUkjente(0.018, [0.018, null])).toBe("minst 0,0180 kr (1 kjøring med ukjent kostnad)");
    expect(kronerMedUkjente(null, [null, null])).toBe("minst 0,0000 kr (2 kjøringer med ukjent kostnad)");
  });
});
