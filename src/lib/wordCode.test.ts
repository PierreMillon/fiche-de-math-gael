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
      // decodeCodes always yields an even-length array (2 nibbles/byte);
      // the tail may be padding zeros beyond what was actually encoded.
      expect(decoded!.codes.slice(0, n)).toEqual(codes);
    }
  });

  it("rejects a phrase containing a word outside the list", () => {
    expect(decodeCodes("chat-nonexistentword-chien")).toBeNull();
  });

  it("rejects an empty or single-word phrase (no room for a header + data byte)", () => {
    expect(decodeCodes("")).toBeNull();
    expect(decodeCodes("chat")).toBeNull();
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
