import { useRef, useState } from "react";
import { fmt } from "@/lib/mathFormat";
import {
  PyramidView,
  pyramidLabel,
  usePyramid,
  readStoredPyramid,
  isHesitant,
} from "@/lib/pyramid";
import { exercises, type QItem } from "@/data/exercises";

const shuffle = <T,>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

type Built = { item: QItem; choices: string[]; answer: number };

// Always returns exactly 4 distinct choices, even if the data has
// duplicate distractors or a distractor equal to the answer.
// Exported for src/lib/quiz.test.ts.
export const build = (item: QItem): Built => {
  const uniqueD: string[] = [];
  for (const d of item.d) {
    if (d !== item.a && !uniqueD.includes(d)) uniqueD.push(d);
  }
  let filler = 1;
  while (uniqueD.length < 3) {
    const candidate = `${item.a} (${filler})`;
    if (candidate !== item.a && !uniqueD.includes(candidate)) uniqueD.push(candidate);
    filler++;
  }
  const all = shuffle([item.a, ...uniqueD.slice(0, 3)]);
  return { item, choices: all, answer: all.indexOf(item.a) };
};

export function ExerciseQuiz({ slug }: { slug: string }) {
  const bank = exercises[slug];
  const { pyramid, onCorrect, onWrong, reset } = usePyramid(`fiche:${slug}`);
  const lastQ = useRef<string | null>(null);
  // Tracks when the current question appeared and at what level, so a
  // correct answer can be judged "hesitant" (see isHesitant) relative to
  // how long that level should reasonably take.
  const shownAt = useRef<number>(Date.now());
  const questionLevel = useRef<1 | 2 | 3 | 4>(1);

  const pick = (tier: 1 | 2 | 3 | 4): Built | null => {
    if (!bank) return null;
    const pool = bank[tier];
    let item = pool[Math.floor(Math.random() * pool.length)];
    if (pool.length > 1) {
      let tries = 0;
      while (item.q === lastQ.current && tries < 10) {
        item = pool[Math.floor(Math.random() * pool.length)];
        tries++;
      }
    }
    lastQ.current = item.q;
    shownAt.current = Date.now();
    questionLevel.current = tier;
    return build(item);
  };

  // The initial level is read straight from localStorage instead of
  // `pyramid.tier`/`pyramid.complete` — usePyramid's own hydration effect
  // hasn't necessarily applied yet on this first render (see the identical
  // fix in fiches.pemdas.tsx), so using the live pyramid state here would
  // race and show a tier-1 question even when this fiche is already at
  // boss level.
  const [q, setQ] = useState<Built | null>(() => {
    const stored = readStoredPyramid(`fiche:${slug}`);
    const level = stored?.complete ? 4 : (stored?.tier ?? 1);
    return pick(level);
  });
  const [picked, setPicked] = useState<number | null>(null);

  if (!bank || !q) return null;

  const answer = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    if (i === q.answer) onCorrect(isHesitant(Date.now() - shownAt.current, questionLevel.current));
    else onWrong();
  };

  const next = () => {
    if (picked === null) return;
    setQ(pick(pyramid.complete ? 4 : pyramid.tier));
    setPicked(null);
  };

  return (
    <section className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-card-foreground">Exercices</h2>
          <p className="mt-1 text-xs text-muted-foreground">{pyramidLabel(pyramid)}</p>
        </div>
        <PyramidView p={pyramid} size="md" />
      </div>

      <p className="mt-4 text-base text-foreground">{fmt(q.item.q)}</p>

      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {q.choices.map((c, i) => {
          const isRight = i === q.answer;
          const isPicked = i === picked;
          const state =
            picked === null
              ? "border-border hover:border-primary"
              : isRight
                ? "border-green-500 bg-green-500/10"
                : isPicked
                  ? "border-red-500 bg-red-500/10"
                  : "border-border opacity-60";
          return (
            <button
              key={i}
              onClick={() => answer(i)}
              className={`flex items-center gap-2 rounded-md border px-3 py-2 text-left text-sm transition ${state}`}
            >
              {picked !== null && (
                <span aria-hidden="true">{isRight ? "✓" : isPicked ? "✗" : ""}</span>
              )}
              {fmt(c)}
            </button>
          );
        })}
      </div>

      {picked !== null && (
        <p className="mt-3 rounded-md border border-border bg-muted px-3 py-2 text-sm text-muted-foreground">
          {picked === q.answer ? "✅ " : "❌ "}
          {fmt(q.item.e)}
        </p>
      )}

      <div className="mt-4 flex items-center justify-between">
        <button
          onClick={() => {
            reset();
            lastQ.current = null;
            setQ(pick(1));
            setPicked(null);
          }}
          className="text-xs text-muted-foreground underline-offset-4 hover:underline"
        >
          Réinitialiser la pyramide
        </button>
        <button
          onClick={next}
          disabled={picked === null}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-40"
        >
          Question suivante
        </button>
      </div>
    </section>
  );
}
