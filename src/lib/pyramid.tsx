import { useEffect, useState } from "react";

export type Pyramid = { tier: 1 | 2 | 3; filled: number; complete: boolean };
export const TIER_SIZE: Record<1 | 2 | 3, number> = { 1: 3, 2: 2, 3: 1 };
export const initialPyramid: Pyramid = { tier: 1, filled: 0, complete: false };

export function usePyramid(storageKey: string) {
  const [p, setP] = useState<Pyramid>(initialPyramid);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("pyramid:" + storageKey);
      if (raw) setP(JSON.parse(raw));
      else setP(initialPyramid);
    } catch {
      /* noop */
    }
  }, [storageKey]);

  useEffect(() => {
    try {
      localStorage.setItem("pyramid:" + storageKey, JSON.stringify(p));
    } catch {
      /* noop */
    }
  }, [storageKey, p]);

  const onCorrect = () =>
    setP((prev) => {
      if (prev.complete) return prev;
      const need = TIER_SIZE[prev.tier];
      const filled = prev.filled + 1;
      if (filled >= need) {
        if (prev.tier === 3)
          return { tier: 3, filled: need, complete: true };
        return {
          tier: (prev.tier + 1) as 2 | 3,
          filled: 0,
          complete: false,
        };
      }
      return { ...prev, filled };
    });

  const onWrong = () =>
    setP((prev) => {
      if (prev.complete) return prev;
      return { ...prev, filled: Math.max(0, prev.filled - 1) };
    });

  const reset = () => setP(initialPyramid);

  return { pyramid: p, onCorrect, onWrong, reset };
}

export function PyramidView({
  p,
  size = "sm",
}: {
  p: Pyramid;
  size?: "sm" | "md";
}) {
  const complete = p.complete;
  const cellSize =
    size === "md" ? "h-3.5 w-3.5 sm:h-4 sm:w-4" : "h-2.5 w-2.5 sm:h-3 sm:w-3";
  const filledInTier = (t: 1 | 2 | 3) => {
    if (complete) return TIER_SIZE[t];
    if (p.tier > t) return TIER_SIZE[t];
    if (p.tier === t) return p.filled;
    return 0;
  };
  const cell = (colorOn: string, on: boolean, key: string) => (
    <div
      key={key}
      className={`${cellSize} rounded-sm border ${
        complete
          ? "border-yellow-200 bg-yellow-400 shadow-[0_0_8px_2px_rgba(250,204,21,0.8)]"
          : on
            ? colorOn
            : "border-white/30 bg-transparent"
      }`}
    />
  );
  return (
    <div className="flex flex-col items-center gap-0.5">
      <div className="flex gap-0.5">
        {Array.from({ length: 1 }).map((_, i) =>
          cell(
            "border-blue-300 bg-blue-400",
            i < filledInTier(3),
            `t3-${i}`,
          ),
        )}
      </div>
      <div className="flex gap-0.5">
        {Array.from({ length: 2 }).map((_, i) =>
          cell(
            "border-pink-300 bg-pink-400",
            i < filledInTier(2),
            `t2-${i}`,
          ),
        )}
      </div>
      <div className="flex gap-0.5">
        {Array.from({ length: 3 }).map((_, i) =>
          cell(
            "border-green-300 bg-green-400",
            i < filledInTier(1),
            `t1-${i}`,
          ),
        )}
      </div>
    </div>
  );
}
