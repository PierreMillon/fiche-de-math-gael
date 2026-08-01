import { fiches } from "@/data/fiches";
import { hasExercises } from "@/data/exercises";
import { rows as pemdasRows } from "@/data/pemdas";
import { readStoredPyramid, type Pyramid } from "@/lib/pyramid";

export type Competency = {
  id: string;
  label: string;
  category: string;
  fiche: string; // slug to link back to
  keys: string[]; // localStorage pyramid keys contributing to this competency
};

// Short French labels for each PEMDAS row — one competency per row, since
// each is genuinely a distinct transformation, not a subdivision of one.
const PEMDAS_ROW_LABELS: Record<string, string> = {
  "sum-to-mul": "Somme → produit",
  "mul-to-exp": "Produit → puissance",
  "factor-plus": "Factoriser (+)",
  "factor-minus": "Factoriser (−)",
  "diff-squares": "Différence de carrés",
  "frac-add": "Addition de fractions",
  "frac-mul": "Multiplication de fractions",
  "frac-div": "Division de fractions",
  "frac-simplify": "Simplifier une fraction",
  "pow-mul-same-base": "Produit, même base",
  "pow-mul-same-exp": "Produit, même exposant",
  "pow-div-same-base": "Quotient, même base",
  "pow-div-same-exp": "Quotient, même exposant",
  "pow-of-pow": "Puissance de puissance",
  "square-plus": "(a+b)²",
  "square-minus": "(a−b)²",
};

// Built from what's actually on the site today (fiches + quiz banks), not
// an invented external curriculum — see the "grille de compétences"
// conversation: it grows as fiches are added, instead of showing hundreds
// of permanently-empty cells for content that doesn't exist yet.
export const ALL_COMPETENCIES: Competency[] = (() => {
  const list: Competency[] = [];

  for (const row of pemdasRows) {
    list.push({
      id: `pemdas:${row.id}`,
      label: PEMDAS_ROW_LABELS[row.id] ?? row.id,
      category: "Algèbre",
      fiche: "pemdas",
      keys: [row.id],
    });
  }

  for (const f of fiches) {
    if (f.slug === "pemdas" || f.slug === "tangente") continue; // no per-fiche pyramid
    if (f.slug === "logique-booleenne") {
      list.push({
        id: "logique-booleenne",
        label: f.title,
        category: f.category,
        fiche: f.slug,
        keys: ["logique-circuit"],
      });
      continue;
    }
    if (hasExercises(f.slug)) {
      list.push({
        id: f.slug,
        label: f.title,
        category: f.category,
        fiche: f.slug,
        keys: [`fiche:${f.slug}`],
      });
    }
  }

  return list;
})();

export const CATEGORIES: string[] = Array.from(new Set(ALL_COMPETENCIES.map((c) => c.category)));

// 0-100: 0-85 tracks progress through the 3 tiers (6 correct answers to
// reach "complete", same scale usePyramid already uses internally), 85-100
// tracks the boss round's 6 rays. Never started reads as 0, not null,
// so it drags a category average down — an untouched competency
// isn't "no data", it's "not mastered yet".
export function masteryPercent(p: Pyramid | null): number {
  if (!p) return 0;
  if (p.bossDone) return 100;
  if (p.complete) return 85 + (p.bossRays / 6) * 15;
  const stepsByTier: Record<1 | 2 | 3, number> = { 1: 0, 2: 3, 3: 5 };
  const stepsDone = stepsByTier[p.tier] + p.filled;
  return (stepsDone / 6) * 85;
}

export function readCompetencyPyramids(c: Competency): (Pyramid | null)[] {
  return c.keys.map(readStoredPyramid);
}

export function competencyMastery(c: Competency): number {
  const pyramids = readCompetencyPyramids(c);
  const scores = pyramids.map(masteryPercent);
  return scores.reduce((a, b) => a + b, 0) / scores.length;
}

export function competencyWrongTotal(c: Competency): number {
  return readCompetencyPyramids(c).reduce((sum, p) => sum + (p?.wrongTotal ?? 0), 0);
}

export function categoryAverage(category: string): number {
  const inCat = ALL_COMPETENCIES.filter((c) => c.category === category);
  if (inCat.length === 0) return 0;
  return inCat.reduce((sum, c) => sum + competencyMastery(c), 0) / inCat.length;
}

export function resetAllProgress(): void {
  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith("pyramid:")) keysToRemove.push(key);
  }
  for (const key of keysToRemove) localStorage.removeItem(key);
}
