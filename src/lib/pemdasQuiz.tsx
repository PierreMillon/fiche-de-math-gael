import { useRef } from "react";
import { type PemdasRow, type QuizQ } from "@/data/pemdas";
import { PyramidView, pyramidLabel } from "@/lib/pyramid";
import { extractText } from "@/lib/testUtils";
import { useAutoAdvanceQuiz } from "@/lib/useAutoAdvanceQuiz";

// A standalone, non-modal version of the PEMDAS quiz — used by the "Réviser
// mes points faibles" page, which needs to embed a single row's quiz inline
// among other fiches' quizzes rather than behind a click-to-open dialog.
// Shares the same question-picking, hesitation-tracking, and pyramid logic
// as fiches.pemdas.tsx's QuizDialog (see useAutoAdvanceQuiz), just rendered
// without the modal chrome.
export function PemdasRowQuiz({ row }: { row: PemdasRow }) {
  const lastPrompt = useRef<string | null>(null);

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
    return question;
  };

  const { pyramid, q, picked, onPick, next } = useAutoAdvanceQuiz({
    storageKey: row.id,
    pickQuestion,
    resetKey: row.id,
  });

  if (!q) return null;

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

      {picked !== null && picked !== q.answer && (
        <>
          <p className="mt-4 rounded-md border border-border bg-muted px-3 py-2 text-sm text-muted-foreground">
            ❌ {q.explanation}
          </p>
          <div className="mt-4 flex justify-end">
            <button
              onClick={next}
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
            >
              Question suivante
            </button>
          </div>
        </>
      )}
    </div>
  );
}
