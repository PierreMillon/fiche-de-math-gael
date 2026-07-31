import { describe, expect, it } from "vitest";
import { rows } from "@/data/pemdas";
import { fmt } from "@/lib/mathFormat";
import { extractText } from "@/lib/testUtils";

const TRIALS = 80;

describe("pemdas quiz generators", () => {
  for (const row of rows) {
    for (const tier of [1, 2, 3] as const) {
      it(`${row.id} (tier ${tier}) always yields exactly 4 distinct choices with a valid answer`, () => {
        for (let i = 0; i < TRIALS; i++) {
          const q = row.quiz(tier);
          expect(q.choices).toHaveLength(4);

          const texts = q.choices.map(extractText);
          expect(new Set(texts).size).toBe(4);

          expect(q.answer).toBeGreaterThanOrEqual(0);
          expect(q.answer).toBeLessThan(4);
          expect(texts[q.answer].length).toBeGreaterThan(0);

          expect(q.explanation.length).toBeGreaterThan(0);
        }
      });
    }
  }
});

describe("pemdas quiz correctness (spot checks)", () => {
  it("sum-to-mul: the marked answer matches the repeated addition shown in the prompt", () => {
    const row = rows.find((r) => r.id === "sum-to-mul")!;
    for (let i = 0; i < TRIALS; i++) {
      const q = row.quiz(2);
      const promptText = extractText(q.prompt);
      const terms = promptText.match(/Écris ([\d+]+) sous/)![1].split("+");
      const k = Number(terms[0]);
      const t = terms.length;
      expect(terms.every((term) => Number(term) === k)).toBe(true);

      const expected = extractText(fmt(`${k}×${t}`));
      expect(extractText(q.choices[q.answer])).toBe(expected);
    }
  });

  it("mul-to-exp: the marked answer matches the repeated multiplication shown in the prompt", () => {
    const row = rows.find((r) => r.id === "mul-to-exp")!;
    for (let i = 0; i < TRIALS; i++) {
      const q = row.quiz(2);
      const promptText = extractText(q.prompt);
      const factors = promptText.match(/Écris ([\d×]+) sous/)![1].split("×");
      const b = Number(factors[0]);
      const e = factors.length;
      expect(factors.every((f) => Number(f) === b)).toBe(true);

      const expected = extractText(fmt(`${b}^${e}`));
      expect(extractText(q.choices[q.answer])).toBe(expected);
    }
  });

  it("frac-add: the marked answer sums the numerators over the shared denominator", () => {
    const row = rows.find((r) => r.id === "frac-add")!;
    for (let i = 0; i < TRIALS; i++) {
      const q = row.quiz(2);
      const promptText = extractText(q.prompt);
      const m = promptText.match(/Calcule : (\d+)\/(\d+) \+ (\d+)\/(\d+)/)!;
      const [a, c1, b, c2] = m.slice(1).map(Number);
      expect(c1).toBe(c2);

      const expected = extractText(fmt(`${a + b}/${c1}`));
      expect(extractText(q.choices[q.answer])).toBe(expected);
    }
  });

  it("factor-plus: the marked answer factors out the shared coefficient", () => {
    const row = rows.find((r) => r.id === "factor-plus")!;
    for (let i = 0; i < TRIALS; i++) {
      const q = row.quiz(2);
      const promptText = extractText(q.prompt);
      const m = promptText.match(/Factorise : (\d+)a \+ (\d+)b/)!;
      const [k1, k2] = m.slice(1).map(Number);
      expect(k1).toBe(k2);

      const expected = extractText(fmt(`${k1}(a+b)`));
      expect(extractText(q.choices[q.answer])).toBe(expected);
    }
  });
});
