import { describe, expect, it } from "vitest";
import { isHesitant } from "@/lib/pyramid";

describe("isHesitant", () => {
  it("is not hesitant when well under the threshold for every level", () => {
    expect(isHesitant(2_000, 1)).toBe(false);
    expect(isHesitant(2_000, 2)).toBe(false);
    expect(isHesitant(2_000, 3)).toBe(false);
    expect(isHesitant(2_000, 4)).toBe(false);
  });

  it("is hesitant once past a level's threshold", () => {
    expect(isHesitant(11_000, 1)).toBe(true);
    expect(isHesitant(16_000, 2)).toBe(true);
    expect(isHesitant(21_000, 3)).toBe(true);
    expect(isHesitant(26_000, 4)).toBe(true);
  });

  it("thresholds get looser at higher levels, since harder questions take longer even when known", () => {
    // The same elapsed time should be less likely to count as hesitant at a
    // higher level.
    expect(isHesitant(18_000, 1)).toBe(true);
    expect(isHesitant(18_000, 4)).toBe(false);
  });
});
