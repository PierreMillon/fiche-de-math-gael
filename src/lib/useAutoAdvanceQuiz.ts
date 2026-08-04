import { useEffect, useRef, useState } from "react";
import { readStoredPyramid, usePyramid, isHesitant } from "@/lib/pyramid";

// How long a correct answer stays highlighted before auto-advancing to the
// next question — long enough to register as positive feedback, short
// enough that it doesn't feel like a forced pause. Wrong answers never
// auto-advance: they stop and wait for a manual "Question suivante" instead.
const AUTO_ADVANCE_MS = 500;

type Level = 1 | 2 | 3 | 4;

// The auto-advance/pyramid-tracking engine shared by every quiz-like UI on
// the site (the PEMDAS dialog, its standalone /revision variant, and the
// generic ExerciseQuiz) — each independently grew the identical
// setTimeout/readStoredPyramid/advanceTimer-ref dance this session, which is
// exactly the kind of duplication where a real bug fix (or behavior change,
// like the auto-advance feature itself) has to be repeated by hand in every
// copy instead of fixed once. Only the state machine is shared: how a
// question is picked (`pickQuestion`, e.g. PEMDAS row-quiz vs. exercise-bank
// lookup, each with their own anti-repeat logic) and how it's rendered stay
// with the caller — those genuinely differ per quiz type.
export function useAutoAdvanceQuiz<Q extends { answer: number }>({
  storageKey,
  pickQuestion,
  resetKey,
}: {
  storageKey: string;
  pickQuestion: (level: Level) => Q | null;
  // Identifies "this is a new quiz session" — e.g. a PEMDAS row's id, or a
  // fiche's slug. Changing it re-triggers the initial-question effect below.
  resetKey: unknown;
}) {
  const { pyramid, onCorrect, onWrong, reset: resetProgress } = usePyramid(storageKey);
  const [q, setQ] = useState<Q | null>(null);
  const [picked, setPicked] = useState<number | null>(null);
  // Tracks when the current question appeared and at what level, so a
  // correct answer can be judged "hesitant" (see isHesitant) relative to how
  // long that level should reasonably take.
  const shownAt = useRef<number>(Date.now());
  const questionLevel = useRef<Level>(1);
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const freshLevel = (): Level => {
    const stored = readStoredPyramid(storageKey);
    return stored?.complete ? 4 : (stored?.tier ?? 1);
  };

  const advance = (level: Level) => {
    questionLevel.current = level;
    shownAt.current = Date.now();
    setQ(pickQuestion(level));
    setPicked(null);
  };

  // Generate the first question whenever resetKey changes (new row/fiche) —
  // reading the level straight from localStorage instead of `pyramid.tier`/
  // `pyramid.complete`: usePyramid's own hydration effect hasn't necessarily
  // applied yet in this same pass (it starts from initialPyramid and patches
  // in the stored value asynchronously), so using the live pyramid state
  // here would race and show a tier-1 question even when already at boss
  // level. Also cancels any pending auto-advance on cleanup, so switching
  // away mid-flash never fires a setQ on an abandoned session.
  useEffect(() => {
    advance(freshLevel());
    return () => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey]);

  const onPick = (i: number) => {
    if (picked !== null || !q) return;
    setPicked(i);
    if (i === q.answer) {
      onCorrect(isHesitant(Date.now() - shownAt.current, questionLevel.current));
      // Read the level fresh from localStorage instead of the `pyramid`
      // closure — this answer may have just completed a palier, and that
      // update won't have reached this render's `pyramid` by the time the
      // timeout fires.
      advanceTimer.current = setTimeout(() => advance(freshLevel()), AUTO_ADVANCE_MS);
    } else {
      onWrong();
    }
  };

  const next = () => {
    if (picked === null) return;
    advance(pyramid.complete ? 4 : pyramid.tier);
  };

  return { pyramid, q, picked, onPick, next, advance, resetProgress };
}
