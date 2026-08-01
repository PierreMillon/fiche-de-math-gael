import { describe, expect, it } from "vitest";
import { build } from "@/lib/quiz";
import { exercises } from "@/data/exercises";

describe("exercises.ts data integrity", () => {
  for (const [slug, bank] of Object.entries(exercises)) {
    for (const tier of [1, 2, 3, 4] as const) {
      it(`${slug} tier ${tier}: every item has exactly 3 distractors distinct from the answer`, () => {
        for (const item of bank[tier]) {
          expect(item.d).toHaveLength(3);
          expect(new Set(item.d).size).toBe(3);
          expect(item.d).not.toContain(item.a);
          expect(item.e.length).toBeGreaterThan(0);
        }
      });
    }
  }
});

describe("ExerciseQuiz build()", () => {
  for (const [slug, bank] of Object.entries(exercises)) {
    for (const tier of [1, 2, 3, 4] as const) {
      it(`${slug} tier ${tier}: always yields exactly 4 distinct choices with a valid answer`, () => {
        for (const item of bank[tier]) {
          for (let i = 0; i < 20; i++) {
            const built = build(item);
            expect(built.choices).toHaveLength(4);
            expect(new Set(built.choices).size).toBe(4);
            expect(built.answer).toBeGreaterThanOrEqual(0);
            expect(built.answer).toBeLessThan(4);
            expect(built.choices[built.answer]).toBe(item.a);
          }
        }
      });
    }
  }

  it("still yields exactly 4 distinct choices when the data has a duplicate distractor", () => {
    const built = build({
      q: "test",
      a: "42",
      d: ["1", "1", "2"],
      e: "test",
    });
    expect(built.choices).toHaveLength(4);
    expect(new Set(built.choices).size).toBe(4);
  });

  it("still yields exactly 4 distinct choices when a distractor equals the answer", () => {
    const built = build({
      q: "test",
      a: "42",
      d: ["42", "1", "2"],
      e: "test",
    });
    expect(built.choices).toHaveLength(4);
    expect(new Set(built.choices).size).toBe(4);
    expect(built.choices[built.answer]).toBe("42");
  });
});
