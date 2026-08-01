import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ALL_COMPETENCIES, competencyWeakness, type Competency } from "@/lib/competencies";
import { rows as pemdasRows } from "@/data/pemdas";
import { PemdasRowQuiz } from "@/lib/pemdasQuiz";
import { ExerciseQuiz } from "@/lib/quiz";
import { CircuitExercise } from "@/routes/fiches.logique-booleenne";

export const Route = createFileRoute("/revision")({
  head: () => ({
    meta: [
      { title: "Réviser mes points faibles — Fiches Maths" },
      {
        name: "description",
        content: "Une session de révision ciblée sur les compétences les plus fragiles.",
      },
    ],
  }),
  component: RevisionPage,
});

const shuffle = <T,>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

function renderSlide(c: Competency) {
  if (c.id === "logique-booleenne") return <CircuitExercise />;
  const row = pemdasRows.find((r) => r.id === c.keys[0]);
  if (row) return <PemdasRowQuiz row={row} />;
  return <ExerciseQuiz slug={c.fiche} />;
}

function RevisionPage() {
  const [ready, setReady] = useState(false);
  const [queue, setQueue] = useState<Competency[]>([]);
  const [index, setIndex] = useState(0);

  // localStorage-derived, so this has to wait until mount (see the same
  // pattern in progression.tsx) — SSR has no localStorage. The order is
  // shuffled once on load so weak points from different fiches interleave
  // instead of grinding through one topic at a time.
  useEffect(() => {
    const weakest = ALL_COMPETENCIES.map((c) => ({ c, weakness: competencyWeakness(c) }))
      .filter((x) => x.weakness > 0)
      .sort((a, b) => b.weakness - a.weakness)
      .slice(0, 10)
      .map((x) => x.c);
    setQueue(shuffle(weakest));
    setReady(true);
  }, []);

  if (!ready) return <div className="min-h-screen bg-background" />;

  const current = queue[index];
  const isLast = index >= queue.length - 1;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto max-w-3xl px-6 py-10">
          <Link
            to="/progression"
            className="text-sm text-muted-foreground transition hover:text-primary"
          >
            ← Ma progression
          </Link>
          <p className="mt-6 text-xs uppercase tracking-[0.2em] text-primary">Révision ciblée</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Mes points faibles</h1>
          <p className="mt-3 text-muted-foreground">
            {queue.length === 0
              ? "Rien à revoir pour l'instant — continue comme ça !"
              : `Compétence ${index + 1} / ${queue.length} : ${current.label}`}
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10">
        {queue.length === 0 ? (
          <Link
            to="/progression"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Retour à ma progression
          </Link>
        ) : (
          <>
            <div key={current.id} className="rounded-xl border border-border bg-card p-6">
              {renderSlide(current)}
            </div>
            <div className="mt-6 flex justify-end">
              {isLast ? (
                <Link
                  to="/progression"
                  className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                >
                  Terminé — retour à ma progression
                </Link>
              ) : (
                <button
                  onClick={() => setIndex((i) => Math.min(i + 1, queue.length - 1))}
                  className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground transition hover:border-primary"
                >
                  Compétence suivante →
                </button>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
