import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { rows, COLS, COL_COLOR, type PemdasRow, type QuizQ } from "@/data/pemdas";
import { PyramidView, pyramidLabel, usePyramid } from "@/lib/pyramid";

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
          <Link to="/" className="text-sm text-muted-foreground transition hover:text-primary">
            ← Toutes les fiches
          </Link>
          <p className="mt-6 text-xs uppercase tracking-[0.2em] text-primary">Algèbre</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Bases PEMDAS</h1>
          <p className="mt-3 text-muted-foreground">
            Clique une ligne pour ouvrir un QCM. Remplis les 3 paliers de la pyramide, puis affronte
            le niveau boss (6 bonnes réponses sans faute).
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="grid grid-cols-2 gap-x-2 gap-y-1 border-b border-border pb-3 text-[10px] font-semibold uppercase tracking-[0.15em] sm:grid-cols-4 sm:text-xs sm:tracking-[0.2em]">
          {COLS.map((c) => (
            <div key={c} className={`text-center ${COL_COLOR[c]}`}>
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
  const { pyramid } = usePyramid(row.id);

  const eq = <span className="mx-2 text-white sm:mx-3">=</span>;

  const pyramidDesktop = (
    <div className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 sm:block">
      <PyramidView p={pyramid} />
    </div>
  );
  const pyramidMobile = (
    <div className="pointer-events-none mt-2 sm:hidden">
      <PyramidView p={pyramid} />
    </div>
  );

  // Mobile: a single centered, wrapping line — never overlaps.
  const mobileLine = (
    <span className="flex flex-wrap items-center justify-center gap-x-1 text-center text-base leading-relaxed sm:hidden">
      {row.left}
      {eq}
      {row.right}
    </span>
  );

  if (row.fused) {
    return (
      <button
        onClick={onOpen}
        className="group relative flex w-full flex-col items-center gap-1 px-4 py-4 transition hover:bg-pink-500/30 sm:py-5 sm:pr-16"
      >
        {mobileLine}
        <span className="hidden items-center sm:inline-flex sm:text-lg">
          {row.left}
          {eq}
          {row.right}
        </span>
        {pyramidMobile}
        {pyramidDesktop}
      </button>
    );
  }

  const li = COLS.indexOf(row.leftCol!);
  const ri = COLS.indexOf(row.rightCol!);

  if (li === ri) {
    return (
      <button
        onClick={onOpen}
        className="relative flex w-full flex-col items-center gap-1 px-4 py-4 transition hover:bg-pink-500/30 sm:grid sm:grid-cols-4 sm:items-center sm:py-5 sm:pr-16"
      >
        {mobileLine}
        {COLS.map((_, i) => (
          <div key={i} className="hidden items-center justify-center sm:flex">
            {i === li && (
              <span className="inline-flex items-center sm:text-lg">
                {row.left}
                {eq}
                {row.right}
              </span>
            )}
          </div>
        ))}
        {pyramidMobile}
        {pyramidDesktop}
      </button>
    );
  }

  // Different columns: place = at the midpoint of the two column centers.
  const midPct = ((li + ri + 1) / 2) * 25; // center of col i = (i+0.5)*25%

  return (
    <button
      onClick={onOpen}
      className="relative flex w-full flex-col items-center gap-1 px-4 py-4 transition hover:bg-pink-500/30 sm:grid sm:grid-cols-4 sm:items-center sm:py-5 sm:pr-16"
    >
      {mobileLine}
      {COLS.map((_, i) => (
        <div key={i} className="hidden items-center justify-center px-2 sm:flex">
          {i === li && row.left}
          {i === ri && row.right}
        </div>
      ))}
      <span
        className="pointer-events-none absolute top-1/2 hidden -translate-x-1/2 -translate-y-1/2 text-white sm:block"
        style={{ left: `${midPct}%` }}
      >
        =
      </span>
      {pyramidMobile}
      {pyramidDesktop}
    </button>
  );
}

function QuizDialog({ row, onClose }: { row: PemdasRow | null; onClose: () => void }) {
  // usePyramid is always called (row is only null when the dialog is closed —
  // we still need a stable hook order). Use a placeholder key when null.
  const { pyramid, onCorrect, onWrong } = usePyramid(row?.id ?? "__none__");
  const [picked, setPicked] = useState<number | null>(null);
  const [q, setQ] = useState<QuizQ | null>(null);
  const lastPrompt = useRef<string | null>(null);

  const pickQuestion = (tier: 1 | 2 | 3): QuizQ | null => {
    if (!row) return null;
    let question = row.quiz(tier);
    let tries = 0;
    // Avoid asking the exact same prompt twice in a row.
    while (
      lastPrompt.current !== null &&
      String(question.prompt) === lastPrompt.current &&
      tries < 5
    ) {
      question = row.quiz(tier);
      tries++;
    }
    lastPrompt.current = String(question.prompt);
    return question;
  };

  // Generate the first question when the dialog opens on a new row.
  // Subsequent questions are generated only when the user clicks
  // "Question suivante", so the feedback always matches the shown question.
  useEffect(() => {
    lastPrompt.current = null;
    if (row) setQ(pickQuestion(1));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [row]);

  if (!row || !q) return null;

  const onPick = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    if (i === q.answer) onCorrect();
    else onWrong();
  };

  const next = () => {
    if (picked === null) return;
    setQ(pickQuestion(pyramid.tier));
    setPicked(null);
  };

  return (
    <Dialog
      open={!!row}
      onOpenChange={(o) => {
        if (!o) {
          onClose();
          setPicked(null);
          setQ(null);
        }
      }}
    >
      <DialogContent className="bg-background text-foreground">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>QCM</span>
            <span className="flex items-center gap-3 text-xs font-normal text-muted-foreground">
              <span>{pyramidLabel(pyramid)}</span>
              <PyramidView p={pyramid} size="md" />
            </span>
          </DialogTitle>
          <DialogDescription asChild>
            <div className="pt-2 text-base text-foreground">{q.prompt}</div>
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
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

        {picked !== null && (
          <p className="rounded-md border border-border bg-muted px-3 py-2 text-sm text-muted-foreground">
            {picked === q.answer ? "✅ " : "❌ "}
            {q.explanation}
          </p>
        )}

        <div className="mt-2 flex justify-end">
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
