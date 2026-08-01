import { describe, expect, it } from "vitest";
import { WORDLIST, codeToPyramid, decodeCodes, encodeCodes, pyramidToCode } from "@/lib/wordCode";
import { initialPyramid, type Pyramid } from "@/lib/pyramid";

describe("WORDLIST", () => {
  it("has exactly 256 unique, accent-free, lowercase words", () => {
    expect(WORDLIST.length).toBe(256);
    expect(new Set(WORDLIST).size).toBe(256);
    for (const w of WORDLIST) {
      expect(w).toMatch(/^[a-z]+$/);
    }
  });
});

describe("encodeCodes / decodeCodes round-trip", () => {
  it("recovers the exact codes and header for various lengths", () => {
    for (const n of [1, 2, 3, 34, 35, 100]) {
      const codes = Array.from({ length: n }, (_, i) => i % 13);
      const phrase = encodeCodes(codes, n);
      const decoded = decodeCodes(phrase);
      expect(decoded).not.toBeNull();
      expect(decoded!.header).toBe(n % 256);
      // Trailing all-zero bytes are trimmed off by encodeCodes, and a
      // position past the end of decoded.codes means "untouched" (0) —
      // pad before comparing to model how importProgressPhrase reads it.
      const padded = decoded!.codes.slice();
      while (padded.length < n) padded.push(0);
      expect(padded.slice(0, n)).toEqual(codes);
    }
  });

  it("trims an all-untouched export down to just the header word", () => {
    const phrase = encodeCodes(new Array(34).fill(0), 34);
    expect(phrase.split("-")).toHaveLength(1);
    const decoded = decodeCodes(phrase);
    expect(decoded).toEqual({ header: 34, codes: [] });
  });

  it("rejects a phrase containing a word outside the list", () => {
    expect(decodeCodes("chat-nonexistentword-chien")).toBeNull();
  });

  it("rejects only an empty phrase — a single header-only word is valid", () => {
    expect(decodeCodes("")).toBeNull();
    expect(decodeCodes("chat")).toEqual({ header: 0, codes: [] });
  });
});

describe("pyramidToCode / codeToPyramid round-trip", () => {
  const cases: Pyramid[] = [
    { ...initialPyramid },
    { ...initialPyramid, tier: 1, filled: 1 },
    { ...initialPyramid, tier: 1, filled: 2 },
    { ...initialPyramid, tier: 2, filled: 0 },
    { ...initialPyramid, tier: 2, filled: 1 },
    { ...initialPyramid, tier: 3, filled: 0 },
    { ...initialPyramid, tier: 3, filled: 1, complete: true, bossRays: 0 },
    { ...initialPyramid, tier: 3, filled: 1, complete: true, bossRays: 3 },
    {
      ...initialPyramid,
      tier: 3,
      filled: 1,
      complete: true,
      bossRays: 6,
      bossDone: true,
    },
  ];

  it("maps every representative pyramid state to a nibble and back losslessly (except wrongTotal)", () => {
    for (const p of cases) {
      const code = pyramidToCode(p);
      expect(code).toBeGreaterThanOrEqual(0);
      expect(code).toBeLessThanOrEqual(12);
      const restored = codeToPyramid(code, 0);
      expect(restored.tier).toBe(p.tier);
      expect(restored.filled).toBe(p.filled);
      expect(restored.complete).toBe(p.complete);
      expect(restored.bossRays).toBe(p.bossRays);
      expect(restored.bossDone).toBe(p.bossDone);
    }
  });

  it("preserves the wrongTotal passed in at decode time, not the original's", () => {
    const restored = codeToPyramid(pyramidToCode({ ...initialPyramid, wrongTotal: 99 }), 5);
    expect(restored.wrongTotal).toBe(5);
  });

  it("null pyramid encodes to the same code as an untouched initialPyramid", () => {
    expect(pyramidToCode(null)).toBe(pyramidToCode(initialPyramid));
  });
});
