import { useCallback, useEffect, useState } from "react";
import { fmt } from "@/lib/mathFormat";
import { PyramidView, usePyramid } from "@/lib/pyramid";
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

const build = (item: QItem): Built => {
  const all = shuffle([item.a, ...item.d]);
  return { item, choices: all, answer: all.indexOf(item.a) };
};

export function ExerciseQuiz({ slug }: { slug: string }) {
  const bank = exercises[slug];
  const { pyramid, onCorrect, onWrong, reset } = usePyramid(`fiche:${slug}`);
  const [q, setQ] = useState<Built | null>(null);
  const [picked, setPicked] = useState<number | null>(null);

  const pick = useCallback(
    (tier: 1 | 2 | 3) => {
      if (!bank) return null;
      const pool = bank[tier];
      return build(pool[Math.floor(Math.random() * pool.length)]);
    },
    [bank],
  );

  // First question on mount only; later questions come from "Question suivante".
  useEffect(() => {
    setQ(pick(1));
    setPicked(null);
  }, [pick]);

  if (!bank || !q) return null;

  const answer = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    if (i === q.answer) onCorrect();
    else onWrong();
  };

  const next = () => {
    if (picked === null) return;
    setQ(pick(pyramid.tier));
    setPicked(null);
  };

  const need = pyramid.tier === 1 ? 3 : pyramid.tier === 2 ? 2 : 1;
  const tierLabel = pyramid.complete
    ? "Pyramide complète ✨"
    : `Palier ${pyramid.tier} · ${pyramid.filled}/${need}`;

  return (
    <section className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-card-foreground">
            Exercices
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">{tierLabel}</p>
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
              className={`rounded-md border px-3 py-2 text-left text-sm transition ${state}`}
            >
              {fmt(c)}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <button
          onClick={() => {
            reset();
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