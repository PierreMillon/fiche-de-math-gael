import type { ReactNode } from "react";
import { fmt } from "@/lib/mathFormat";
import { pickDistinctChoices } from "@/lib/quizChoices";

// ---------- Formula rendering primitives ----------
// Colors (per request): + blue, × red, fraction bar yellow, exponent green.
// Everything else (digits, letters, −, parens, =) stays white.

const W = "text-white";
const PLUS = "text-blue-400";
const MINUS = "text-blue-400";
const TIMES = "text-red-400";
const FRAC = "border-yellow-400";
const EXP = "text-green-400";

export const n = (v: string | number): ReactNode => <span className={W}>{v}</span>;

// plus/minus/times/frac each come in a colored (the operator's own color)
// and a white (plusW/minusW/timesW/fracW, see below) variant — same markup,
// only the operator's color class differs — so the color is a parameter
// here and each pair is just two one-line wrappers around it.
const plusImpl = (color: string, parts: ReactNode[]): ReactNode => (
  <span className="inline-flex items-center">
    {parts.map((p, i) => (
      <span key={i} className="inline-flex items-center">
        {i > 0 && <span className={`${color} mx-0.5`}>+</span>}
        {p}
      </span>
    ))}
  </span>
);
export const plus = (...parts: ReactNode[]): ReactNode => plusImpl(PLUS, parts);

const minusImpl = (color: string, a: ReactNode, b: ReactNode): ReactNode => (
  <span className="inline-flex items-center">
    {a}
    <span className={`${color} mx-0.5`}>−</span>
    {b}
  </span>
);
export const minus = (a: ReactNode, b: ReactNode): ReactNode => minusImpl(MINUS, a, b);

const timesImpl = (color: string, parts: ReactNode[]): ReactNode => (
  <span className="inline-flex items-center">
    {parts.map((p, i) => (
      <span key={i} className="inline-flex items-center">
        {i > 0 && <span className={`${color} mx-0.5`}>×</span>}
        {p}
      </span>
    ))}
  </span>
);
export const times = (...parts: ReactNode[]): ReactNode => timesImpl(TIMES, parts);

// Juxtaposition (implicit multiplication like "ka") — no operator symbol.
export const jux = (...parts: ReactNode[]): ReactNode => (
  <span className="inline-flex items-center">
    {parts.map((p, i) => (
      <span key={i} className="inline-flex items-center">
        {p}
      </span>
    ))}
  </span>
);

export const paren = (a: ReactNode): ReactNode => (
  <span className="inline-flex items-center">
    <span className={W}>(</span>
    {a}
    <span className={W}>)</span>
  </span>
);

const fracImpl = (barColor: string, num: ReactNode, den: ReactNode): ReactNode => (
  <span className="inline-flex flex-col items-center align-middle mx-0.5 leading-tight">
    <span className="px-1">{num}</span>
    <span className={`w-full border-t ${barColor}`}></span>
    <span className="px-1">{den}</span>
  </span>
);
export const frac = (num: ReactNode, den: ReactNode): ReactNode => fracImpl(FRAC, num, den);

export const pow = (base: ReactNode, exp: ReactNode): ReactNode => (
  <span className="inline-flex items-start">
    {base}
    <span className={`${EXP} [&_*]:text-green-400 text-[0.7em] -mt-1 ml-0.5`}>{exp}</span>
  </span>
);

// Variant of pow that does NOT force all descendants to green.
// Used when the exponent must keep its own colors (e.g. show a×b in red).
export const powRaw = (base: ReactNode, exp: ReactNode): ReactNode => (
  <span className="inline-flex items-start">
    {base}
    <span className="text-[0.7em] -mt-1 ml-0.5">{exp}</span>
  </span>
);

// ---------- White (uncolored) variants ----------
// Coloring rule: on each row only the two signs marking the transition
// between the two columns are colored (one on the left member, one on the
// right member). Every other identical sign on the row stays white.

export const plusW = (...parts: ReactNode[]): ReactNode => plusImpl(W, parts);
export const minusW = (a: ReactNode, b: ReactNode): ReactNode => minusImpl(W, a, b);
export const timesW = (...parts: ReactNode[]): ReactNode => timesImpl(W, parts);
export const fracW = (num: ReactNode, den: ReactNode): ReactNode =>
  fracImpl("border-white", num, den);

// Exponent without the green coloring (position kept, color white).
export const powW = (base: ReactNode, exp: ReactNode): ReactNode => (
  <span className="inline-flex items-start">
    {base}
    <span className={`${W} text-[0.7em] -mt-1 ml-0.5`}>{exp}</span>
  </span>
);

export const COL_COLOR: Record<string, string> = {
  Somme: "text-blue-400",
  Multiplication: "text-red-400",
  Division: "text-yellow-400",
  Exposant: "text-green-400",
};

// ---------- Row + quiz definitions ----------

export type Col = "Somme" | "Multiplication" | "Division" | "Exposant";
export const COLS: Col[] = ["Somme", "Multiplication", "Division", "Exposant"];

export type QuizQ = {
  prompt: ReactNode;
  choices: ReactNode[];
  answer: number;
  explanation: string;
};

export type PemdasRow = {
  id: string;
  left: ReactNode;
  right: ReactNode;
  leftCol?: Col; // undefined when fused
  rightCol?: Col;
  fused?: boolean;
  quiz: (level: number) => QuizQ;
};

// ---------- helpers ----------

const rnd = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

const makeQ = (
  prompt: ReactNode,
  correct: string,
  distractors: string[],
  explanation: string,
): QuizQ => {
  const all = pickDistinctChoices(correct, distractors);
  return {
    prompt,
    choices: all.map((s) => fmt(s)),
    answer: all.indexOf(correct),
    explanation,
  };
};

const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b));
const simp = (num: number, den: number) => {
  const g = gcd(num, den) || 1;
  return `${num / g}/${den / g}`;
};

// ---------- Tier-3 exponent helpers (fractional 1/2, 1/3 and negative) ----------

const fracDen = (): 2 | 3 => (Math.random() < 0.5 ? 2 : 3);

// Simplifies num/den to its lowest terms; returns a plain integer string
// ("3", "-2") when the fraction reduces to a whole number.
const expStr = (num: number, den = 1): string => {
  if (den === 1) return String(num);
  const g = gcd(num, den) || 1;
  const n = num / g;
  const d = den / g;
  return d === 1 ? String(n) : `${n}/${d}`;
};

// Renders base^exponent as plain text, dropping the exponent entirely when
// it's 0 or 1, and wrapping negative/fractional exponents in parens.
const powTerm = (base: string, e: string): string => {
  if (e === "0") return "1";
  if (e === "1") return base;
  const needsParen = e.includes("/") || e.startsWith("-");
  return needsParen ? `${base}^(${e})` : `${base}^${e}`;
};

// ---------- Rows ----------

export const rows: PemdasRow[] = [
  {
    id: "sum-to-mul",
    left: plus(n(3), n(3), n(3), n(3)),
    right: times(n(3), n(4)),
    leftCol: "Somme",
    rightCol: "Multiplication",
    quiz: (lvl) => {
      if (lvl >= 4) {
        const k = rnd(2, 9);
        const t = rnd(6, 9);
        const wrongT = t + (Math.random() < 0.5 ? 1 : -1);
        return makeQ(
          <>
            Quelle somme correspond à {k}×{t} ?
          </>,
          Array(t).fill(k).join("+"),
          [
            Array(Math.max(1, wrongT)).fill(k).join("+"),
            Array(t)
              .fill(k + 1)
              .join("+"),
            `${k * t}`,
          ],
          `${k}×${t} = additionner ${k} un total de ${t} fois : ${Array(t).fill(k).join("+")}.`,
        );
      }
      if (lvl >= 3) {
        const k = rnd(4, 12);
        const t = rnd(5, 8);
        return makeQ(
          <>Écris {Array(t).fill(k).join("+")} sous forme d'un produit.</>,
          `${k}×${t}`,
          [`${k}+${t}`, `${k}×${t + 1}`, `${k}${t}`],
          `Additionner ${k} un total de ${t} fois revient à calculer ${k}×${t}.`,
        );
      }
      const k = rnd(2, lvl >= 2 ? 9 : 6);
      const t = rnd(3, lvl >= 2 ? 6 : 5);
      return makeQ(
        <>Écris {Array(t).fill(k).join("+")} sous forme d'un produit.</>,
        `${k}×${t}`,
        [`${k}+${t}`, `${k}×${t + 1}`, `${k}${t}`],
        `Additionner ${k} un total de ${t} fois revient à calculer ${k}×${t}.`,
      );
    },
  },
  {
    id: "mul-to-exp",
    left: times(n(2), n(2), n(2)),
    right: pow(n(2), n(3)),
    leftCol: "Multiplication",
    rightCol: "Exposant",
    quiz: (lvl) => {
      if (lvl >= 4) {
        const b = rnd(2, 8);
        const e = rnd(5, 8);
        const wrongE = e + (Math.random() < 0.5 ? 1 : -1);
        return makeQ(
          <>Quelle multiplication correspond à {fmt(`${b}^${e}`)} ?</>,
          Array(e).fill(b).join("×"),
          [
            Array(Math.max(1, wrongE)).fill(b).join("×"),
            Array(e)
              .fill(b + 1)
              .join("×"),
            `${b}×${e}`,
          ],
          `${b}^${e} = multiplier ${b} par lui-même ${e} fois : ${Array(e).fill(b).join("×")}.`,
        );
      }
      if (lvl >= 3) {
        const b = rnd(3, 9);
        const e = rnd(4, 6);
        return makeQ(
          <>Écris {Array(e).fill(b).join("×")} sous forme d'une puissance.</>,
          `${b}^${e}`,
          [`${b}×${e}`, `${b}^${e + 1}`, `${e}^${b}`],
          `Multiplier ${b} par lui-même ${e} fois revient à calculer ${b}^${e}.`,
        );
      }
      const b = rnd(2, lvl >= 2 ? 7 : 5);
      const e = rnd(2, lvl >= 2 ? 4 : 4);
      return makeQ(
        <>Écris {Array(e).fill(b).join("×")} sous forme d'une puissance.</>,
        `${b}^${e}`,
        [`${b}×${e}`, `${b}^${e + 1}`, `${e}^${b}`],
        `Multiplier ${b} par lui-même ${e} fois revient à calculer ${b}^${e}.`,
      );
    },
  },
  {
    id: "factor-plus",
    left: plus(jux(n("k"), n("a")), jux(n("k"), n("b"))),
    right: times(n("k"), paren(plusW(n("a"), n("b")))),
    leftCol: "Somme",
    rightCol: "Multiplication",
    quiz: (lvl) => {
      if (lvl >= 4) {
        const g = rnd(3, 9);
        const m = rnd(2, 6);
        let n = rnd(2, 6);
        while (gcd(m, n) !== 1) n = rnd(2, 6);
        const c1 = g * m;
        const c2 = g * n;
        return makeQ(
          <>
            Factorise : {c1}a + {c2}b
          </>,
          `${g}(${m}a+${n}b)`,
          [`${g}(${m}a−${n}b)`, `${c1}(a+${n}b)`, `${g}(${n}a+${m}b)`],
          `Le plus grand facteur commun de ${c1} et ${c2} est ${g} : ${c1}a+${c2}b = ${g}(${m}a+${n}b).`,
        );
      }
      if (lvl >= 3) {
        const k = rnd(8, 18);
        return makeQ(
          <>
            Factorise : {k}a + {k}b
          </>,
          `${k}(a+b)`,
          [`${k}(a−b)`, `${2 * k}(a+b)`, `${k}ab`],
          `${k} est un facteur commun : ${k}a+${k}b = ${k}(a+b).`,
        );
      }
      const k = rnd(2, lvl >= 2 ? 9 : 7);
      return makeQ(
        <>
          Factorise : {k}a + {k}b
        </>,
        `${k}(a+b)`,
        [`${k}(a−b)`, `${2 * k}(a+b)`, `${k}ab`],
        `${k} est un facteur commun : ${k}a+${k}b = ${k}(a+b).`,
      );
    },
  },
  {
    id: "factor-minus",
    left: minus(jux(n("k"), n("a")), jux(n("k"), n("b"))),
    right: times(n("k"), paren(minusW(n("a"), n("b")))),
    leftCol: "Somme",
    rightCol: "Multiplication",
    quiz: (lvl) => {
      if (lvl >= 4) {
        const g = rnd(3, 9);
        const m = rnd(2, 6);
        let n = rnd(2, 6);
        while (gcd(m, n) !== 1) n = rnd(2, 6);
        const c1 = g * m;
        const c2 = g * n;
        return makeQ(
          <>
            Factorise : {c1}a − {c2}b
          </>,
          `${g}(${m}a−${n}b)`,
          [`${g}(${m}a+${n}b)`, `${c1}(a−${n}b)`, `${g}(${n}a−${m}b)`],
          `Le plus grand facteur commun de ${c1} et ${c2} est ${g} : ${c1}a−${c2}b = ${g}(${m}a−${n}b).`,
        );
      }
      if (lvl >= 3) {
        const k = rnd(8, 18);
        return makeQ(
          <>
            Factorise : {k}a − {k}b
          </>,
          `${k}(a−b)`,
          [`${k}(a+b)`, `${2 * k}(a−b)`, `${k}(b−a)`],
          `${k} est un facteur commun : ${k}a−${k}b = ${k}(a−b).`,
        );
      }
      const k = rnd(2, lvl >= 2 ? 9 : 7);
      return makeQ(
        <>
          Factorise : {k}a − {k}b
        </>,
        `${k}(a−b)`,
        [`${k}(a+b)`, `${2 * k}(a−b)`, `${k}(b−a)`],
        `${k} est un facteur commun : ${k}a−${k}b = ${k}(a−b).`,
      );
    },
  },
  {
    id: "diff-squares",
    left: minus(powW(n("a"), n(2)), powW(n("b"), n(2))),
    right: times(paren(plusW(n("a"), n("b"))), paren(minusW(n("a"), n("b")))),
    leftCol: "Somme",
    rightCol: "Multiplication",
    quiz: (lvl) => {
      if (lvl >= 4) {
        const a = rnd(10, 20);
        const b = rnd(1, a - 1);
        if (Math.random() < 0.5) {
          return makeQ(
            <>
              Factorise : {fmt(`${a}^2`)} − {fmt(`${b}^2`)}
            </>,
            `(${a}+${b})(${a}−${b})`,
            [`(${a}−${b})^2`, `${a}^2 − ${b}^2`, `${a * a - b * b}`],
            `Identité remarquable : a²−b² = (a+b)(a−b), avec a=${a}, b=${b}.`,
          );
        }
        return makeQ(
          <>
            {a}² − {b}² vaut aussi :
          </>,
          `${a + b}×${a - b}`,
          [`${a - b}×${a - b}`, `${a}×${b}`, `${a + b}+${a - b}`],
          `a²−b² = (a+b)(a−b) = ${a + b}×${a - b}.`,
        );
      }
      if (lvl >= 3) {
        const a = rnd(9, 16);
        const b = rnd(1, a - 1);
        return makeQ(
          <>
            Factorise : {fmt(`${a}^2`)} − {fmt(`${b}^2`)}
          </>,
          `(${a}+${b})(${a}−${b})`,
          [`(${a}−${b})^2`, `${a}^2 − ${b}^2`, `${a * a - b * b}`],
          `Identité remarquable : a²−b² = (a+b)(a−b), avec a=${a}, b=${b}.`,
        );
      }
      const a = rnd(2, lvl >= 2 ? 8 : 5);
      const b = rnd(1, a - 1);
      return makeQ(
        <>
          Factorise : {fmt(`${a}^2`)} − {fmt(`${b}^2`)}
        </>,
        `(${a}+${b})(${a}−${b})`,
        [`(${a}−${b})^2`, `${a}^2 − ${b}^2`, `${a * a - b * b}`],
        `Identité remarquable : a²−b² = (a+b)(a−b), avec a=${a}, b=${b}.`,
      );
    },
  },
  {
    id: "frac-add",
    left: plus(fracW(n("a"), n("c")), fracW(n("b"), n("c"))),
    right: frac(plusW(n("a"), n("b")), n("c")),
    leftCol: "Somme",
    rightCol: "Division",
    quiz: (lvl) => {
      if (lvl >= 4) {
        const c1 = rnd(2, 6);
        let c2 = rnd(2, 6);
        while (c2 === c1) c2 = rnd(2, 6);
        const a = rnd(1, c1 - 1);
        const b = rnd(1, c2 - 1);
        const num = a * c2 + b * c1;
        const den = c1 * c2;
        return makeQ(
          fmt(`Calcule : ${a}/${c1} + ${b}/${c2}`),
          `${num}/${den}`,
          [`${a + b}/${c1 + c2}`, `${a * c2}/${den}`, `${num}/${c1}`],
          `Dénominateur commun ${c1}×${c2}=${den} : ${a}/${c1}=${a * c2}/${den}, ${b}/${c2}=${b * c1}/${den}, somme = ${num}/${den}.`,
        );
      }
      if (lvl >= 3) {
        const c = rnd(10, 20);
        const a = rnd(1, c - 1);
        const b = rnd(1, c - 1);
        return makeQ(
          fmt(`Calcule : ${a}/${c} + ${b}/${c}`),
          `${a + b}/${c}`,
          [`${a + b}/${2 * c}`, `${a * b}/${c}`, `${a}+${b}/${c}`],
          `Même dénominateur : on additionne seulement les numérateurs, ${a}+${b}=${a + b}.`,
        );
      }
      const c = rnd(3, lvl >= 2 ? 10 : 9);
      const a = rnd(1, c - 1);
      const b = rnd(1, c - 1);
      return makeQ(
        fmt(`Calcule : ${a}/${c} + ${b}/${c}`),
        `${a + b}/${c}`,
        [`${a + b}/${2 * c}`, `${a * b}/${c}`, `${a}+${b}/${c}`],
        `Même dénominateur : on additionne seulement les numérateurs, ${a}+${b}=${a + b}.`,
      );
    },
  },
  {
    id: "frac-mul",
    left: times(fracW(n("a"), n("b")), fracW(n("c"), n("d"))),
    right: frac(timesW(n("a"), n("c")), timesW(n("b"), n("d"))),
    leftCol: "Multiplication",
    rightCol: "Division",
    quiz: (lvl) => {
      if (lvl >= 4) {
        const a = rnd(5, 15);
        const b = rnd(6, 16);
        const c = rnd(5, 15);
        const d = rnd(6, 16);
        return makeQ(
          fmt(`Calcule : (${a}/${b}) × (${c}/${d})`),
          `${a * c}/${b * d}`,
          [`${a + c}/${b + d}`, `${a * b}/${c * d}`, `${a * d}/${b * c}`],
          `On multiplie les numérateurs entre eux (${a}×${c}=${a * c}), et les dénominateurs entre eux (${b}×${d}=${b * d}).`,
        );
      }
      if (lvl >= 3) {
        const a = rnd(3, 12);
        const b = rnd(4, 13);
        const c = rnd(3, 12);
        const d = rnd(4, 13);
        return makeQ(
          fmt(`Calcule : (${a}/${b}) × (${c}/${d})`),
          `${a * c}/${b * d}`,
          [`${a + c}/${b + d}`, `${a * b}/${c * d}`, `${a * d}/${b * c}`],
          `On multiplie les numérateurs entre eux (${a}×${c}=${a * c}), et les dénominateurs entre eux (${b}×${d}=${b * d}).`,
        );
      }
      const a = rnd(1, lvl >= 2 ? 7 : 5);
      const b = rnd(2, lvl >= 2 ? 7 : 5);
      const c = rnd(1, lvl >= 2 ? 7 : 5);
      const d = rnd(2, lvl >= 2 ? 7 : 5);
      return makeQ(
        fmt(`Calcule : (${a}/${b}) × (${c}/${d})`),
        `${a * c}/${b * d}`,
        [`${a + c}/${b + d}`, `${a * b}/${c * d}`, `${a * d}/${b * c}`],
        `On multiplie les numérateurs entre eux (${a}×${c}=${a * c}), et les dénominateurs entre eux (${b}×${d}=${b * d}).`,
      );
    },
  },
  {
    id: "frac-div",
    left: frac(fracW(n("a"), n("b")), fracW(n("c"), n("d"))),
    right: times(fracW(n("a"), n("b")), fracW(n("d"), n("c"))),
    leftCol: "Division",
    rightCol: "Multiplication",
    quiz: (lvl) => {
      if (lvl >= 4) {
        const a = rnd(5, 15);
        const b = rnd(6, 16);
        const c = rnd(5, 15);
        const d = rnd(6, 16);
        return makeQ(
          fmt(`Calcule : (${a}/${b}) ÷ (${c}/${d})`),
          `${a * d}/${b * c}`,
          [`${a * c}/${b * d}`, `${b * c}/${a * d}`, `${a + d}/${b + c}`],
          `Diviser par une fraction revient à multiplier par son inverse : (${a}/${b}) × (${d}/${c}) = ${a * d}/${b * c}.`,
        );
      }
      if (lvl >= 3) {
        const a = rnd(3, 12);
        const b = rnd(4, 13);
        const c = rnd(3, 12);
        const d = rnd(4, 13);
        return makeQ(
          fmt(`Calcule : (${a}/${b}) ÷ (${c}/${d})`),
          `${a * d}/${b * c}`,
          [`${a * c}/${b * d}`, `${b * c}/${a * d}`, `${a + d}/${b + c}`],
          `Diviser par une fraction revient à multiplier par son inverse : (${a}/${b}) × (${d}/${c}) = ${a * d}/${b * c}.`,
        );
      }
      const a = rnd(1, lvl >= 2 ? 7 : 5);
      const b = rnd(2, lvl >= 2 ? 7 : 5);
      const c = rnd(1, lvl >= 2 ? 7 : 5);
      const d = rnd(2, lvl >= 2 ? 7 : 5);
      return makeQ(
        fmt(`Calcule : (${a}/${b}) ÷ (${c}/${d})`),
        `${a * d}/${b * c}`,
        [`${a * c}/${b * d}`, `${b * c}/${a * d}`, `${a + d}/${b + c}`],
        `Diviser par une fraction revient à multiplier par son inverse : (${a}/${b}) × (${d}/${c}) = ${a * d}/${b * c}.`,
      );
    },
  },
  {
    id: "frac-simplify",
    left: frac(timesW(n("a"), n("c")), timesW(n("b"), n("c"))),
    right: frac(n("a"), n("b")),
    leftCol: "Division",
    rightCol: "Division",
    quiz: (lvl) => {
      if (lvl >= 4) {
        const a = rnd(2, 15);
        const b = rnd(2, 15);
        const c = rnd(2, 9);
        return makeQ(
          fmt(`Simplifie : ${a * c}/${b * c}`),
          simp(a, b),
          [`${a}/${b * c}`, `${a * c}/${b}`, `${c}/${b}`],
          `Le facteur commun ${c} se simplifie au numérateur et au dénominateur.`,
        );
      }
      if (lvl >= 3) {
        const a = rnd(4, 12);
        const b = rnd(4, 12);
        const c = rnd(6, 13);
        return makeQ(
          fmt(`Simplifie : ${a * c}/${b * c}`),
          simp(a, b),
          [`${a}/${b * c}`, `${a * c}/${b}`, `${c}/${b}`],
          `Le facteur commun ${c} se simplifie au numérateur et au dénominateur.`,
        );
      }
      const a = rnd(2, lvl >= 2 ? 7 : 5);
      const b = rnd(2, lvl >= 2 ? 7 : 5);
      const c = rnd(2, lvl >= 2 ? 7 : 5);
      return makeQ(
        fmt(`Simplifie : ${a * c}/${b * c}`),
        simp(a, b),
        [`${a}/${b * c}`, `${a * c}/${b}`, `${c}/${b}`],
        `Le facteur commun ${c} se simplifie au numérateur et au dénominateur.`,
      );
    },
  },
  {
    id: "pow-mul-same-base",
    left: times(powW(n("x"), n("a")), powW(n("x"), n("b"))),
    right: pow(n("x"), plus(n("a"), n("b"))),
    leftCol: "Multiplication",
    rightCol: "Exposant",
    quiz: (lvl) => {
      if (lvl >= 4) {
        const d = fracDen();
        let p = rnd(1, 2 * d - 1);
        if (p % d === 0) p++;
        const a = -p;
        const b = rnd(1, d - 1);
        const sum = expStr(a + b, d);
        return makeQ(
          <>
            Simplifie : {fmt(`x^(${a}/${d})`)} × {fmt(`x^(${b}/${d})`)}
          </>,
          powTerm("x", sum),
          [
            powTerm("x", expStr(a * b, d)),
            powTerm("x", expStr(a + b, d * 2)),
            powTerm("x", expStr(Math.abs(a - b), d)),
          ],
          `Même base : on additionne les exposants, ${a}/${d}+${b}/${d}=${sum}.`,
        );
      }
      if (lvl >= 3) {
        if (Math.random() < 0.5) {
          const d = fracDen();
          const p = rnd(1, d - 1);
          const q = rnd(1, d - 1);
          const sum = expStr(p + q, d);
          return makeQ(
            <>
              Simplifie : {fmt(`x^(${p}/${d})`)} × {fmt(`x^(${q}/${d})`)}
            </>,
            powTerm("x", sum),
            [
              powTerm("x", expStr(p * q, d)),
              powTerm("x", expStr(p + q, d * 2)),
              powTerm("x", expStr(Math.abs(p - q), d)),
            ],
            `Même base : on additionne les exposants, ${p}/${d}+${q}/${d}=${sum}.`,
          );
        }
        const a = rnd(2, 6);
        const b = -rnd(2, 5);
        const sum = expStr(a + b);
        return makeQ(
          <>
            Simplifie : {fmt(`x^${a}`)} × {fmt(`x^${b}`)}
          </>,
          powTerm("x", sum),
          [
            powTerm("x", expStr(a - b)),
            powTerm("x", expStr(a * b)),
            powTerm("x", expStr(-(a + b))),
          ],
          `Même base : on additionne les exposants, ${a}+(${b})=${sum}.`,
        );
      }
      const x = rnd(2, 5);
      const a = rnd(2, lvl >= 2 ? 7 : 4);
      const b = rnd(2, lvl >= 2 ? 7 : 4);
      return makeQ(
        <>
          Simplifie : {fmt(`${x}^${a}`)} × {fmt(`${x}^${b}`)}
        </>,
        `${x}^${a + b}`,
        [`${x}^${a * b}`, `${x * x}^${a + b}`, `${x}^${a - b}`],
        `Même base : on additionne les exposants (${a}+${b}).`,
      );
    },
  },
  {
    id: "pow-mul-same-exp",
    left: times(powW(n("x"), n("a")), powW(n("y"), n("a"))),
    right: pow(paren(timesW(n("x"), n("y"))), n("a")),
    leftCol: "Multiplication",
    rightCol: "Exposant",
    quiz: (lvl) => {
      if (lvl >= 4) {
        const d = fracDen();
        let p = rnd(1, 2 * d - 1);
        if (p % d === 0) p++;
        const a = -p;
        const e = expStr(a, d);
        return makeQ(
          <>
            Simplifie : {fmt(`x^(${e})`)} × {fmt(`y^(${e})`)}
          </>,
          `(xy)^(${e})`,
          [`(xy)^${d}`, `x^(${e})+y^(${e})`, `(x+y)^(${e})`],
          `Même exposant : on multiplie les bases, l'exposant ${e} reste inchangé.`,
        );
      }
      if (lvl >= 3) {
        if (Math.random() < 0.5) {
          const d = fracDen();
          const p = rnd(1, d - 1);
          const e = expStr(p, d);
          return makeQ(
            <>
              Simplifie : {fmt(`x^(${e})`)} × {fmt(`y^(${e})`)}
            </>,
            `(xy)^(${e})`,
            [`(xy)^${d}`, `x^(${e})+y^(${e})`, `(x+y)^(${e})`],
            `Même exposant : on multiplie les bases, l'exposant ${e} reste inchangé.`,
          );
        }
        const a = -rnd(2, 4);
        return makeQ(
          <>
            Simplifie : {fmt(`x^${a}`)} × {fmt(`y^${a}`)}
          </>,
          `(xy)^(${a})`,
          [`(xy)^${-a}`, `x^${a}+y^${a}`, `(x+y)^${a}`],
          `Même exposant : on multiplie les bases, l'exposant ${a} reste inchangé.`,
        );
      }
      const x = rnd(2, 6);
      const y = rnd(2, 6);
      const a = rnd(2, lvl >= 2 ? 7 : 3);
      return makeQ(
        <>
          Simplifie : {fmt(`${x}^${a}`)} × {fmt(`${y}^${a}`)}
        </>,
        `${x * y}^${a}`,
        [`${x + y}^${a}`, `${x * y}^${2 * a}`, `${x}^${a} + ${y}^${a}`],
        `Même exposant : on multiplie les bases (${x}×${y}).`,
      );
    },
  },
  {
    id: "pow-div-same-base",
    left: frac(powW(n("x"), n("a")), powW(n("x"), n("b"))),
    right: pow(n("x"), minus(n("a"), n("b"))),
    leftCol: "Division",
    rightCol: "Exposant",
    quiz: (lvl) => {
      if (lvl >= 4) {
        const d = fracDen();
        let p = rnd(1, 2 * d - 1);
        if (p % d === 0) p++;
        const a = -p;
        const q = rnd(1, d - 1);
        const diff = expStr(a - q, d);
        return makeQ(
          <>
            Simplifie : {fmt(`x^(${a}/${d})`)} / {fmt(`x^(${q}/${d})`)}
          </>,
          powTerm("x", diff),
          [
            powTerm("x", expStr(a + q, d)),
            powTerm("x", expStr(q - a, d)),
            powTerm("x", expStr(a * q, d)),
          ],
          `Même base : on soustrait les exposants, ${a}/${d}−${q}/${d}=${diff}.`,
        );
      }
      if (lvl >= 3) {
        if (Math.random() < 0.5) {
          const d = fracDen();
          const p = rnd(1, 2 * d);
          const q = rnd(1, 2 * d);
          const diff = expStr(p - q, d);
          return makeQ(
            <>
              Simplifie : {fmt(`x^(${p}/${d})`)} / {fmt(`x^(${q}/${d})`)}
            </>,
            powTerm("x", diff),
            [
              powTerm("x", expStr(p + q, d)),
              powTerm("x", expStr(q - p, d)),
              powTerm("x", expStr(p * q, d)),
            ],
            `Même base : on soustrait les exposants, ${p}/${d}−${q}/${d}=${diff}.`,
          );
        }
        const a = rnd(1, 4);
        const b = -rnd(2, 5);
        const diff = expStr(a - b);
        return makeQ(
          <>
            Simplifie : {fmt(`x^${a}`)} / {fmt(`x^${b}`)}
          </>,
          powTerm("x", diff),
          [powTerm("x", expStr(a + b)), powTerm("x", expStr(b - a)), powTerm("x", expStr(a * b))],
          `Même base : on soustrait les exposants, ${a}−(${b})=${diff}.`,
        );
      }
      const x = rnd(2, 5);
      const a = rnd(4, lvl >= 2 ? 9 : 8);
      const b = rnd(1, 3);
      return makeQ(
        <>
          Simplifie : {fmt(`${x}^${a}`)} / {fmt(`${x}^${b}`)}
        </>,
        `${x}^${a - b}`,
        [`${x}^${a + b}`, `1^${a - b}`, `${x}^${a * b}`],
        `Même base : on soustrait les exposants (${a}−${b}).`,
      );
    },
  },
  {
    id: "pow-div-same-exp",
    left: frac(powW(n("x"), n("a")), powW(n("y"), n("a"))),
    right: pow(paren(fracW(n("x"), n("y"))), n("a")),
    leftCol: "Division",
    rightCol: "Exposant",
    quiz: (lvl) => {
      if (lvl >= 4) {
        const d = fracDen();
        let p = rnd(1, 2 * d - 1);
        if (p % d === 0) p++;
        const a = -p;
        const e = expStr(a, d);
        return makeQ(
          <>
            Simplifie : {fmt(`x^(${e})`)} / {fmt(`y^(${e})`)}
          </>,
          `(x/y)^(${e})`,
          [`(x/y)^${d}`, `(x−y)^(${e})`, `x^(${e})−y^(${e})`],
          `Même exposant : on divise les bases, l'exposant ${e} reste inchangé.`,
        );
      }
      if (lvl >= 3) {
        if (Math.random() < 0.5) {
          const d = fracDen();
          const p = rnd(1, d - 1);
          const e = expStr(p, d);
          return makeQ(
            <>
              Simplifie : {fmt(`x^(${e})`)} / {fmt(`y^(${e})`)}
            </>,
            `(x/y)^(${e})`,
            [`(x/y)^${d}`, `(x−y)^(${e})`, `x^(${e})−y^(${e})`],
            `Même exposant : on divise les bases, l'exposant ${e} reste inchangé.`,
          );
        }
        const a = -rnd(2, 4);
        return makeQ(
          <>
            Simplifie : {fmt(`x^${a}`)} / {fmt(`y^${a}`)}
          </>,
          `(x/y)^(${a})`,
          [`(x/y)^${-a}`, `(x−y)^(${a})`, `x^${a}−y^${a}`],
          `Même exposant : on divise les bases, l'exposant ${a} reste inchangé.`,
        );
      }
      const y = rnd(2, 4);
      const k = rnd(2, 4);
      const x = y * k;
      const a = rnd(2, lvl >= 2 ? 6 : 3);
      return makeQ(
        <>
          Simplifie : {fmt(`${x}^${a}`)} / {fmt(`${y}^${a}`)}
        </>,
        `${k}^${a}`,
        [`${x - y}^${a}`, `${k}^${2 * a}`, `${x}^${a} − ${y}^${a}`],
        `Même exposant : on divise les bases (${x}÷${y}=${k}).`,
      );
    },
  },
  {
    id: "pow-of-pow",
    left: powRaw(n("x"), timesW(n("a"), n("b"))),
    right: pow(paren(powW(n("x"), n("a"))), n("b")),
    leftCol: "Exposant",
    rightCol: "Exposant",
    quiz: (lvl) => {
      if (lvl >= 4) {
        const d = fracDen();
        let p = rnd(1, 2 * d - 1);
        if (p % d === 0) p++;
        const a = -p;
        const b = rnd(2, 4);
        const prodExp = expStr(a * b, d);
        return makeQ(
          <>Simplifie : {fmt(`(x^(${a}/${d}))^${b}`)}</>,
          powTerm("x", prodExp),
          [powTerm("x", expStr(a + b, d)), powTerm("x", expStr(a, d)), powTerm("x", String(b))],
          `Puissance de puissance : on multiplie les exposants, ${a}/${d}×${b}=${prodExp}.`,
        );
      }
      if (lvl >= 3) {
        if (Math.random() < 0.5) {
          const d = fracDen();
          const p = rnd(1, d - 1);
          const b = rnd(2, 4);
          const prodExp = expStr(p * b, d);
          return makeQ(
            <>Simplifie : {fmt(`(x^(${p}/${d}))^${b}`)}</>,
            powTerm("x", prodExp),
            [powTerm("x", expStr(p + b, d)), powTerm("x", expStr(p, d)), powTerm("x", String(b))],
            `Puissance de puissance : on multiplie les exposants, ${p}/${d}×${b}=${prodExp}.`,
          );
        }
        const a = rnd(2, 4);
        const b = -rnd(2, 3);
        const prodExp = expStr(a * b);
        return makeQ(
          <>Simplifie : {fmt(`(x^${a})^${b}`)}</>,
          powTerm("x", prodExp),
          [
            powTerm("x", expStr(a + b)),
            powTerm("x", expStr(a - b)),
            powTerm("x", expStr(-(a * b))),
          ],
          `Puissance de puissance : on multiplie les exposants, ${a}×(${b})=${prodExp}.`,
        );
      }
      const x = rnd(2, 5);
      const a = rnd(2, lvl >= 2 ? 6 : 4);
      const b = rnd(2, lvl >= 2 ? 6 : 4);
      return makeQ(
        <>Simplifie : {fmt(`(${x}^${a})^${b}`)}</>,
        `${x}^${a * b}`,
        [`${x}^${a + b}`, `${x}^${a - b}`, `${x * a}^${b}`],
        `Puissance de puissance : on multiplie les exposants (${a}×${b}).`,
      );
    },
  },
  {
    id: "square-plus",
    left: plus(powW(n("a"), n(2)), jux(n(2), n("a"), n("b")), powW(n("b"), n(2))),
    right: pow(paren(plusW(n("a"), n("b"))), n(2)),
    leftCol: "Somme",
    rightCol: "Exposant",
    quiz: (lvl) => {
      if (lvl >= 4) {
        const k = rnd(4, 12);
        return makeQ(
          <>Factorise : {fmt(`x^2+${2 * k}x+${k * k}`)}</>,
          `(x+${k})^2`,
          [`(x−${k})^2`, `(x+${2 * k})^2`, `x^2+${k}`],
          `x²+${2 * k}x+${k * k} est le développement de (x+${k})² : a²+2ab+b² avec a=x, b=${k}.`,
        );
      }
      if (lvl >= 3) {
        const useFraction = Math.random() < 0.5;
        const den = useFraction ? fracDen() : 1;
        const num = useFraction ? 1 : -rnd(2, 3);
        const e = expStr(num, den);
        const e2 = expStr(2 * num, den);
        const aTerm = powTerm("x", e);
        const a2Term = powTerm("x", e2);
        return makeQ(
          <>Développe : {fmt(`(x^(${e}) + 1)^2`)}</>,
          `${a2Term}+2${aTerm}+1`,
          [`${aTerm}+1`, `x+1`, `${a2Term}+${aTerm}+1`],
          `(a+b)² = a²+2ab+b² avec a=x^(${e}), b=1 : a²=${a2Term}.`,
        );
      }
      const k = rnd(2, lvl >= 2 ? 9 : 5);
      return makeQ(
        <>Développe : {fmt(`(x + ${k})^2`)}</>,
        `x²+${2 * k}x+${k * k}`,
        [`x²+${k * k}`, `x²−${2 * k}x+${k * k}`, `x²+${k}x+${k * k}`],
        `Identité remarquable : (x+${k})² = x²+2×${k}×x+${k}².`,
      );
    },
  },
  {
    id: "square-minus",
    left: (
      <span className="inline-flex items-center">
        {powW(n("a"), n(2))}
        <span className="text-blue-400 mx-0.5">−</span>
        {jux(n(2), n("a"), n("b"))}
        <span className="text-blue-400 mx-0.5">+</span>
        {powW(n("b"), n(2))}
      </span>
    ),
    right: pow(paren(minusW(n("a"), n("b"))), n(2)),
    leftCol: "Somme",
    rightCol: "Exposant",
    quiz: (lvl) => {
      if (lvl >= 4) {
        const k = rnd(4, 12);
        return makeQ(
          <>Factorise : {fmt(`x^2−${2 * k}x+${k * k}`)}</>,
          `(x−${k})^2`,
          [`(x+${k})^2`, `(x−${2 * k})^2`, `x^2−${k}`],
          `x²−${2 * k}x+${k * k} est le développement de (x−${k})² : a²−2ab+b² avec a=x, b=${k}.`,
        );
      }
      if (lvl >= 3) {
        const useFraction = Math.random() < 0.5;
        const den = useFraction ? fracDen() : 1;
        const num = useFraction ? 1 : -rnd(2, 3);
        const e = expStr(num, den);
        const e2 = expStr(2 * num, den);
        const aTerm = powTerm("x", e);
        const a2Term = powTerm("x", e2);
        return makeQ(
          <>Développe : {fmt(`(x^(${e}) − 1)^2`)}</>,
          `${a2Term}−2${aTerm}+1`,
          [`${aTerm}−1`, `x−1`, `${a2Term}−${aTerm}+1`],
          `(a−b)² = a²−2ab+b² avec a=x^(${e}), b=1 : a²=${a2Term}.`,
        );
      }
      const k = rnd(2, lvl >= 2 ? 9 : 5);
      return makeQ(
        <>Développe : {fmt(`(x − ${k})^2`)}</>,
        `x²−${2 * k}x+${k * k}`,
        [`x²+${2 * k}x+${k * k}`, `x²−${k * k}`, `x²−${k}x+${k * k}`],
        `Identité remarquable : (x−${k})² = x²−2×${k}×x+${k}².`,
      );
    },
  },
];
