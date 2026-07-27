import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { rows, COLS, type PemdasRow, type QuizQ } from "@/data/pemdas";

export const Route = createFileRoute("/fiches/pemdas")({
  head: () => ({
    meta: [
      { title: "Bases PEMDAS — Fiche de révision" },
      {
        name: "description",
        content:
          "Somme, multiplication, division, exposant : transformations élémentaires avec QCM interactif.",
      },
      { property: "og:title", content: "Bases PEMDAS — Fiche de révision" },
      {
        property: "og:description",
        content: "Fiche interactive PEMDAS avec quiz par ligne.",
      },
    ],
  }),
  component: PemdasPage,
});

function PemdasPage() {
  const [openRow, setOpenRow] = useState<PemdasRow | null>(null);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto max-w-5xl px-6 py-10">
          <Link
            to="/"
            className="text-sm text-muted-foreground transition hover:text-primary"
          >
            ← Toutes les fiches
          </Link>
          <p className="mt-6 text-xs uppercase tracking-[0.2em] text-primary">
            Algèbre
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Bases PEMDAS
          </h1>
          <p className="mt-3 text-muted-foreground">
            Clique une ligne pour ouvrir un QCM. 3 bonnes réponses d'affilée
            font monter le niveau (niveau 3 = exposants fractionnaires).
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="grid grid-cols-4 gap-2 border-b border-border pb-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          {COLS.map((c) => (
            <div key={c} className="text-center">
              {c}
            </div>
          ))}
        </div>

        <div className="divide-y divide-border">
          {rows.map((row) => (
            <RowView key={row.id} row={row} onOpen={() => setOpenRow(row)} />
          ))}
        </div>
      </main>

      <QuizDialog row={openRow} onClose={() => setOpenRow(null)} />
    </div>
  );
}

function RowView({ row, onOpen }: { row: PemdasRow; onOpen: () => void }) {
  // Same-column non-fused rows: single cell with "left = right" inline.
  // Fused rows: full-width centered "left = right".
  // Different-column rows: left in its col, right in its col, "=" absolutely
  // centered between the two column centers.

  const eq = <span className="mx-3 text-white">=</span>;

  if (row.fused) {
    return (
      <button
        onClick={onOpen}
        className="group flex w-full items-center justify-center py-5 text-lg transition hover:bg-pink-500/30"
      >
        <span className="inline-flex items-center">
          {row.left}
          {eq}
          {row.right}
        </span>
      </button>
    );
  }

  const li = COLS.indexOf(row.leftCol!);
  const ri = COLS.indexOf(row.rightCol!);

  if (li === ri) {
    return (
      <button
        onClick={onOpen}
        className="grid w-full grid-cols-4 items-center py-5 text-lg transition hover:bg-pink-500/30"
      >
        {COLS.map((_, i) => (
          <div key={i} className="flex items-center justify-center">
            {i === li && (
              <span className="inline-flex items-center">
                {row.left}
                {eq}
                {row.right}
              </span>
            )}
          </div>
        ))}
      </button>
    );
  }

  // Different columns: place = at the midpoint of the two column centers.
  const midPct = ((li + ri + 1) / 2) * 25; // center of col i = (i+0.5)*25%

  return (
    <button
      onClick={onOpen}
      className="relative grid w-full grid-cols-4 items-center py-5 text-lg transition hover:bg-pink-500/30"
    >
      {COLS.map((_, i) => (
        <div key={i} className="flex items-center justify-center px-2">
          {i === li && row.left}
          {i === ri && row.right}
        </div>
      ))}
      <span
        className="pointer-events-none absolute top-1/2 -translate-x-1/2 -translate-y-1/2 text-white"
        style={{ left: `${midPct}%` }}
      >
        =
      </span>
    </button>
  );
}

function QuizDialog({
  row,
  onClose,
}: {
  row: PemdasRow | null;
  onClose: () => void;
}) {
  const [streak, setStreak] = useState(0);
  const [level, setLevel] = useState(1);
  const [picked, setPicked] = useState<number | null>(null);
  const [q, setQ] = useState<QuizQ | null>(null);

  // Generate the first question when the dialog opens on a new row.
  // Subsequent questions are generated only when the user clicks "Question suivante".
  useEffect(() => {
    if (row) setQ(row.quiz(1));
  }, [row]);

  if (!row || !q) return null;

  const onPick = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    if (i === q.answer) {
      const s = streak + 1;
      if (s >= 3 && level < 3) {
        setLevel(level + 1);
        setStreak(0);
      } else {
        setStreak(s % 3 === 0 && level >= 3 ? 0 : s);
      }
    } else {
      setStreak(0);
    }
  };

  const next = () => {
    if (picked === null) return;
    setQ(row.quiz(level));
    setPicked(null);
  };

  return (
    <Dialog
      open={!!row}
      onOpenChange={(o) => {
        if (!o) {
          onClose();
          setPicked(null);
          setStreak(0);
          setLevel(1);
          setQ(null);
        }
      }}
    >
      <DialogContent className="bg-background text-foreground">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>QCM</span>
            <span className="text-xs font-normal text-muted-foreground">
              Niveau {level} · Série {streak}/3
            </span>
          </DialogTitle>
          <DialogDescription asChild>
            <div className="pt-2 text-base text-foreground">{q.prompt}</div>
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2 grid grid-cols-2 gap-2">
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
                onClick={() => onPick(i)}
                className={`rounded-md border px-3 py-2 text-left font-mono text-sm transition ${state}`}
              >
                {c}
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={next}
            disabled={picked === null}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-40"
          >
            Question suivante
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}