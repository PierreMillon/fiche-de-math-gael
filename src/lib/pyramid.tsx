import { useEffect, useRef, useState } from "react";

export type Pyramid = {
  tier: 1 | 2 | 3;
  filled: number;
  complete: boolean;
  bossRays: number;
  bossDone: boolean;
  // Lifetime count of wrong answers — unlike the other fields, never
  // decreases, so it can be used to rank the weakest competencies (see
  // src/routes/progression.tsx) even after the pyramid itself is reset by
  // a wrong answer or a manual reset of tier/filled.
  wrongTotal: number;
  // Lifetime count of answers that were CORRECT but took unusually long
  // (see isHesitant below) — an implicit "not really sure" signal that
  // doesn't cost the learner an extra tap, unlike a self-rated confidence
  // button would. Feeds into the same weak-points ranking as wrongTotal,
  // just weighted lower since hesitating isn't the same as being wrong.
  hesitations: number;
};
export const TIER_SIZE: Record<1 | 2 | 3, number> = { 1: 3, 2: 2, 3: 1 };
export const BOSS_TARGET = 6;
export const initialPyramid: Pyramid = {
  tier: 1,
  filled: 0,
  complete: false,
  bossRays: 0,
  bossDone: false,
  wrongTotal: 0,
  hesitations: 0,
};

// How long a correct answer can take before it counts as a "hesitation"
// rather than a confident answer — looser for harder levels, since a boss
// question genuinely takes longer to work out even when known cold.
const HESITATION_THRESHOLD_MS: Record<1 | 2 | 3 | 4, number> = {
  1: 10_000,
  2: 15_000,
  3: 20_000,
  4: 25_000,
};

export function isHesitant(elapsedMs: number, level: 1 | 2 | 3 | 4): boolean {
  return elapsedMs > HESITATION_THRESHOLD_MS[level];
}

export function usePyramid(storageKey: string) {
  const [p, setP] = useState<Pyramid>(initialPyramid);
  // On mount (and whenever storageKey changes) the read effect below hasn't
  // applied its setP yet by the time the write effect first runs in the same
  // commit — that write effect would otherwise still see the pre-hydration
  // `p` (initialPyramid, or the previous key's leftover value) and persist
  // it, clobbering whatever was already stored for the new key. Skipping
  // exactly one write right after a key change avoids that stale write; the
  // render triggered by the read effect's setP fires the write effect again
  // with the real value.
  const skipNextWrite = useRef(true);

  useEffect(() => {
    skipNextWrite.current = true;
    try {
      const raw = localStorage.getItem("pyramid:" + storageKey);
      if (raw) setP({ ...initialPyramid, ...JSON.parse(raw) });
      else setP(initialPyramid);
    } catch {
      /* noop */
    }
  }, [storageKey]);

  useEffect(() => {
    if (skipNextWrite.current) {
      skipNextWrite.current = false;
      return;
    }
    try {
      localStorage.setItem("pyramid:" + storageKey, JSON.stringify(p));
    } catch {
      /* noop */
    }
  }, [storageKey, p]);

  const onCorrect = (hesitant = false) =>
    setP((prev) => {
      const hesitations = hesitant ? prev.hesitations + 1 : prev.hesitations;
      if (prev.bossDone) return { ...prev, hesitations };

      // Pyramid already gold: we're in the boss round, correct answers add rays.
      if (prev.complete) {
        const bossRays = Math.min(BOSS_TARGET, prev.bossRays + 1);
        return { ...prev, bossRays, bossDone: bossRays >= BOSS_TARGET, hesitations };
      }

      const need = TIER_SIZE[prev.tier];
      const filled = prev.filled + 1;
      if (filled >= need) {
        if (prev.tier === 3) return { ...prev, tier: 3, filled: need, complete: true, hesitations };
        return {
          ...prev,
          tier: (prev.tier + 1) as 2 | 3,
          filled: 0,
          complete: false,
          hesitations,
        };
      }
      return { ...prev, filled, hesitations };
    });

  const onWrong = () =>
    setP((prev) => {
      const wrongTotal = prev.wrongTotal + 1;
      if (prev.bossDone) return { ...prev, wrongTotal };
      // Boss round: any mistake resets the halo to zero.
      if (prev.complete) return { ...prev, bossRays: 0, wrongTotal };
      return { ...prev, filled: Math.max(0, prev.filled - 1), wrongTotal };
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

// The pyramid's bounding box is square, but the shape inside it isn't: the
// bottom row (3 cells) outweighs the top row (1 cell), so its visual center
// of gravity sits below the box's geometric center. Anchoring the ray ring
// there — instead of at 50% — is what makes it read as centered on the
// triangle rather than on its invisible bounding square.
const HALO_CENTER_Y = "61.6%";

function BossHalo({ rays, radius }: { rays: number; radius: number }) {
  return (
    <div className="pointer-events-none absolute inset-0">
      {Array.from({ length: rays }).map((_, i) => {
        const angle = (360 / BOSS_TARGET) * i;
        return (
          <div
            key={i}
            className="absolute left-1/2 h-3 w-[3px] rounded-full bg-yellow-300 shadow-[0_0_6px_2px_rgba(250,204,21,0.85)]"
            style={{
              top: HALO_CENTER_Y,
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
  const radius = size === "md" ? 44 : 36;

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
