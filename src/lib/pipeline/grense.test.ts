import { beforeEach, describe, expect, it } from "vitest";

import { nullstill, taPlass } from "./grense";

const MINUTT = 60_000;
const DOGN = 86_400_000;
// 2026-11-18 12:00:30 UTC.
const NA = Date.UTC(2026, 10, 18, 12, 0, 30);

beforeEach(() => {
  nullstill();
});

function tell(antall: number, env = {}, na = NA): boolean[] {
  return Array.from({ length: antall }, () => taPlass(env, na));
}

describe("taPlass", () => {
  it("NFR-3: standardgrensen er 10 per minutt", () => {
    expect(tell(10).every(Boolean)).toBe(true);
    expect(taPlass({}, NA)).toBe(false);
  });

  it("NFR-3: et nytt minutt gir plass igjen", () => {
    tell(10);
    expect(taPlass({}, NA + 29_999)).toBe(false);
    expect(taPlass({}, NA + 30_000)).toBe(true);
  });

  it("NFR-3: standardgrensen er 200 per UTC-døgn", () => {
    const start = Date.UTC(2026, 10, 18);
    for (let i = 0; i < 200; i++) {
      expect(taPlass({}, start + i * MINUTT)).toBe(true);
    }
    expect(taPlass({}, start + 200 * MINUTT)).toBe(false);
    expect(taPlass({}, start + DOGN - 1)).toBe(false);
    expect(taPlass({}, start + DOGN)).toBe(true);
  });

  it("AD-9: en avvist generering telles ikke", () => {
    const env = { GRENSE_PER_MINUTT: "1", GRENSE_PER_DOGN: "2" };
    expect(taPlass(env, NA)).toBe(true);
    expect(taPlass(env, NA)).toBe(false);
    expect(taPlass(env, NA)).toBe(false);
    // Bare én er telt i døgnet, så neste minutt gir plass.
    expect(taPlass(env, NA + MINUTT)).toBe(true);
    expect(taPlass(env, NA + 2 * MINUTT)).toBe(false);
  });

  it("AD-9: GRENSE_PER_MINUTT og GRENSE_PER_DOGN leses fra miljøet", () => {
    expect(tell(3, { GRENSE_PER_MINUTT: " 2 " })).toEqual([true, true, false]);
    nullstill();
    expect(tell(3, { GRENSE_PER_DOGN: "1" })).toEqual([true, false, false]);
  });

  it.each(["", "  ", "abc", "-1", "1.5", "0", "00"])(
    "AD-9: ugyldig grense (%j) gir standardverdien",
    (verdi) => {
      const env = { GRENSE_PER_MINUTT: verdi, GRENSE_PER_DOGN: verdi };
      expect(tell(10, env).every(Boolean)).toBe(true);
      expect(taPlass(env, NA)).toBe(false);
    },
  );

  it("AD-9: nullstill tømmer telleren", () => {
    tell(10);
    nullstill();
    expect(taPlass({}, NA)).toBe(true);
  });
});
