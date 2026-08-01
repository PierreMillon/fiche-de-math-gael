import { useEffect, useRef, useState } from "react";
import { type PemdasRow, type QuizQ } from "@/data/pemdas";
import {
  PyramidView,
  pyramidLabel,
  usePyramid,
  readStoredPyramid,
  isHesitant,
} from "@/lib/pyramid";
import { extractText } from "@/lib/testUtils";

// A standalone, non-modal version of the PEMDAS quiz — used by the "Réviser
// mes points faibles" page, which needs to embed a single row's quiz inline
// among other fiches' quizzes rather than behind a click-to-open dialog.
// Shares the same question-picking, hesitation-tracking, and pyramid logic
// as fiches.pemdas.tsx's QuizDialog, just rendered without the modal chrome.
export function PemdasRowQuiz({ row }: { row: PemdasRow }) {
  const { pyramid, onCorrect, onWrong } = usePyramid(row.id);
  const [picked, setPicked] = useState<number | null>(null);
  const [q, setQ] = useState<QuizQ | null>(null);
  const lastPrompt = useRef<string | null>(null);
  const shownAt = useRef<number>(Date.now());
  const questionLevel = useRef<1 | 2 | 3 | 4>(1);

  const pickQuestion = (tier: 1 | 2 | 3 | 4): QuizQ => {
    let question = row.quiz(tier);
    let tries = 0;
    while (
      lastPrompt.current !== null &&
      extractText(question.prompt) === lastPrompt.current &&
      tries < 5
    ) {
      question = row.quiz(tier);
      tries++;
    }
    lastPrompt.current = extractText(question.prompt);
    shownAt.current = Date.now();
    questionLevel.current = tier;
    return question;
  };

  useEffect(() => {
    lastPrompt.current = null;
    const stored = readStoredPyramid(row.id);
    const level = stored?.complete ? 4 : (stored?.tier ?? 1);
    setQ(pickQuestion(level));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [row.id]);

  if (!q) return null;

  const onPick = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    if (i === q.answer) onCorrect(isHesitant(Date.now() - shownAt.current, questionLevel.current));
    else onWrong();
  };

  const next = () => {
    if (picked === null) return;
    setQ(pickQuestion(pyramid.complete ? 4 : pyramid.tier));
    setPicked(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <span className="text-xs text-muted-foreground">{pyramidLabel(pyramid)}</span>
        <PyramidView p={pyramid} size="md" />
      </div>
      <div className="pt-2 text-base text-foreground">{q.prompt}</div>

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
              onClick={() => onPick(i)}
              className={`flex items-center gap-2 rounded-md border px-3 py-2 text-left font-mono text-sm transition ${state}`}
            >
              {picked !== null && (
                <span aria-hidden="true">{isRight ? "✓" : isPicked ? "✗" : ""}</span>
              )}
              {c}
            </button>
          );
        })}
      </div>

      {picked !== null && (
        <p className="mt-4 rounded-md border border-border bg-muted px-3 py-2 text-sm text-muted-foreground">
          {picked === q.answer ? "✅ " : "❌ "}
          {q.explanation}
        </p>
      )}

      <div className="mt-4 flex justify-end">
        <button
          onClick={next}
          disabled={picked === null}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-40"
        >
          Question suivante
        </button>
      </div>
    </div>
  );
}
