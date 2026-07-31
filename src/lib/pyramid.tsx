import { useEffect, useState } from "react";

export type Pyramid = {
  tier: 1 | 2 | 3;
  filled: number;
  complete: boolean;
  bossRays: number;
  bossDone: boolean;
};
export const TIER_SIZE: Record<1 | 2 | 3, number> = { 1: 3, 2: 2, 3: 1 };
export const BOSS_TARGET = 6;
export const initialPyramid: Pyramid = {
  tier: 1,
  filled: 0,
  complete: false,
  bossRays: 0,
  bossDone: false,
};

export function usePyramid(storageKey: string) {
  const [p, setP] = useState<Pyramid>(initialPyramid);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("pyramid:" + storageKey);
      if (raw) setP({ ...initialPyramid, ...JSON.parse(raw) });
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
      if (prev.bossDone) return prev;

      // Pyramid already gold: we're in the boss round, correct answers add rays.
      if (prev.complete) {
        const bossRays = Math.min(BOSS_TARGET, prev.bossRays + 1);
        return { ...prev, bossRays, bossDone: bossRays >= BOSS_TARGET };
      }

      const need = TIER_SIZE[prev.tier];
      const filled = prev.filled + 1;
      if (filled >= need) {
        if (prev.tier === 3) return { ...prev, tier: 3, filled: need, complete: true };
        return {
          ...prev,
          tier: (prev.tier + 1) as 2 | 3,
          filled: 0,
          complete: false,
        };
      }
      return { ...prev, filled };
    });

  const onWrong = () =>
    setP((prev) => {
      if (prev.bossDone) return prev;
      // Boss round: any mistake resets the halo to zero.
      if (prev.complete) return { ...prev, bossRays: 0 };
      return { ...prev, filled: Math.max(0, prev.filled - 1) };
    });

  const reset = () => setP(initialPyramid);

  return { pyramid: p, onCorrect, onWrong, reset };
}

// Client-only, one-shot read (no subscription) — for places that just want
// to display a snapshot of progress, e.g. the homepage fiche cards.
export function readStoredPyramid(key: string): Pyramid | null {
  try {
    const raw = localStorage.getItem("pyramid:" + key);
    if (!raw) return null;
    return { ...initialPyramid, ...JSON.parse(raw) };
  } catch {
    return null;
  }
}

export function pyramidLabel(p: Pyramid): string {
  if (p.bossDone) return "Niveau boss réussi ✨";
  if (p.complete) return `Niveau boss · ${p.bossRays}/${BOSS_TARGET} rayons`;
  const need = TIER_SIZE[p.tier];
  return `Palier ${p.tier} · ${p.filled}/${need}`;
}

function BossHalo({ rays, radius }: { rays: number; radius: number }) {
  return (
    <div className="pointer-events-none absolute inset-0">
      {Array.from({ length: rays }).map((_, i) => {
        const angle = (360 / BOSS_TARGET) * i;
        return (
          <div
            key={i}
            className="absolute left-1/2 top-1/2 h-3 w-[3px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow-300 shadow-[0_0_6px_2px_rgba(250,204,21,0.85)]"
            style={{
              transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-${radius}px)`,
            }}
          />
        );
      })}
    </div>
  );
}

export function PyramidView({ p, size = "sm" }: { p: Pyramid; size?: "sm" | "md" }) {
  const cellSize = size === "md" ? "h-3.5 w-3.5 sm:h-4 sm:w-4" : "h-2.5 w-2.5 sm:h-3 sm:w-3";

  if (p.bossDone) {
    const px = size === "md" ? 30 : 24;
    return (
      <div
        className="flex items-center justify-center"
        style={{ width: px, height: px }}
        aria-label="Niveau boss réussi"
      >
        <svg viewBox="0 0 24 24" width={px} height={px}>
          <polygon
            points="12,2 22,22 2,22"
            fill="white"
            className="drop-shadow-[0_0_6px_rgba(255,255,255,0.8)]"
          />
        </svg>
      </div>
    );
  }

  const complete = p.complete;
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
  // Radius must clear the pyramid's diagonal extent (its widest points are the
  // bottom row's corners, not its cardinal edges), plus half the ray's own
  // length, so every ray sits outside the triangle uniformly, like a crown.
  const radius = size === "md" ? 44 : 34;

  return (
    <div className="relative flex flex-col items-center gap-0.5">
      {complete && p.bossRays > 0 && <BossHalo rays={p.bossRays} radius={radius} />}
      <div className="flex gap-0.5">
        {Array.from({ length: 1 }).map((_, i) =>
          cell("border-blue-300 bg-blue-400", i < filledInTier(3), `t3-${i}`),
        )}
      </div>
      <div className="flex gap-0.5">
        {Array.from({ length: 2 }).map((_, i) =>
          cell("border-pink-300 bg-pink-400", i < filledInTier(2), `t2-${i}`),
        )}
      </div>
      <div className="flex gap-0.5">
        {Array.from({ length: 3 }).map((_, i) =>
          cell("border-green-300 bg-green-400", i < filledInTier(1), `t1-${i}`),
        )}
      </div>
    </div>
  );
}
