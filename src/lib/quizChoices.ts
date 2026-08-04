export const shuffle = <T>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// Finds the last run of digits in a formula string and nudges it up or
// down, so a fallback distractor (see pickDistinctChoices below) still
// reads as a plausible — if wrong — answer instead of an obvious internal
// placeholder. Works uniformly across every format used across the quiz
// generators (plain integers, fractions, factored forms, exponents,
// polynomials) without needing per-format logic, since they all end in a
// number.
const perturbLastNumber = (s: string, bump: number): string => {
  const match = s.match(/(\d+)(?!.*\d)/);
  if (!match || match.index === undefined) return `${s}′`;
  const delta = bump % 2 === 0 ? -(bump / 2) : (bump + 1) / 2;
  const bumped = Math.max(0, Number.parseInt(match[1], 10) + delta);
  return s.slice(0, match.index) + bumped + s.slice(match.index + match[1].length);
};

// Builds a shuffled list of exactly 4 distinct choices: `correct` plus up
// to 3 unique values from `distractors`. If a question's own distractor
// logic produces fewer than 3 distinct wrong answers (duplicates, or one
// matching `correct` — rare per-question, but happens often enough across
// hundreds of generated questions), perturbLastNumber synthesizes
// plausible-looking fallbacks instead of leaving fewer than 4 choices or a
// placeholder like "(?1)" — the fix for a real bug reported in production.
// Shared by src/data/pemdas.tsx's makeQ and src/lib/quiz.tsx's build,
// which independently reimplemented (and re-broke) the same logic.
export function pickDistinctChoices(correct: string, distractors: string[]): string[] {
  const uniqueD: string[] = [];
  for (const d of distractors) {
    if (d !== correct && !uniqueD.includes(d)) uniqueD.push(d);
  }
  let bump = 1;
  while (uniqueD.length < 3) {
    const candidate = perturbLastNumber(correct, bump);
    if (candidate !== correct && !uniqueD.includes(candidate)) uniqueD.push(candidate);
    bump++;
  }
  return shuffle([correct, ...uniqueD.slice(0, 3)]);
}
