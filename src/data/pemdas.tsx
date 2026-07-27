import type { ReactNode } from "react";

// ---------- Formula rendering primitives ----------
// Colors (per request): + blue, × red, fraction bar yellow, exponent green.
// Everything else (digits, letters, −, parens, =) stays white.

const W = "text-white";
const PLUS = "text-blue-400";
const MINUS = "text-blue-400";
const TIMES = "text-red-400";
const FRAC = "border-yellow-400";
const EXP = "text-green-400";

export const n = (v: string | number): ReactNode => (
  <span className={W}>{v}</span>
);

export const plus = (...parts: ReactNode[]): ReactNode => (
  <span className="inline-flex items-center">
    {parts.map((p, i) => (
      <span key={i} className="inline-flex items-center">
        {i > 0 && <span className={`${PLUS} mx-0.5`}>+</span>}
        {p}
      </span>
    ))}
  </span>
);

export const minus = (a: ReactNode, b: ReactNode): ReactNode => (
  <span className="inline-flex items-center">
    {a}
    <span className={`${MINUS} mx-0.5`}>−</span>
    {b}
  </span>
);

export const times = (...parts: ReactNode[]): ReactNode => (
  <span className="inline-flex items-center">
    {parts.map((p, i) => (
      <span key={i} className="inline-flex items-center">
        {i > 0 && <span className={`${TIMES} mx-0.5`}>×</span>}
        {p}
      </span>
    ))}
  </span>
);

// Juxtaposition (implicit multiplication like "ka") — no operator symbol.
export const jux = (...parts: ReactNode[]): ReactNode => (
  <span className="inline-flex items-center">{parts}</span>
);

export const paren = (a: ReactNode): ReactNode => (
  <span className="inline-flex items-center">
    <span className={W}>(</span>
    {a}
    <span className={W}>)</span>
  </span>
);

export const frac = (num: ReactNode, den: ReactNode): ReactNode => (
  <span className="inline-flex flex-col items-center align-middle mx-0.5 leading-tight">
    <span className="px-1">{num}</span>
    <span className={`w-full border-t ${FRAC}`}></span>
    <span className="px-1">{den}</span>
  </span>
);

export const pow = (base: ReactNode, exp: ReactNode): ReactNode => (
  <span className="inline-flex items-start">
    {base}
    <span
      className={`${EXP} [&_*]:text-green-400 text-[0.7em] -mt-1 ml-0.5`}
    >
      {exp}
    </span>
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

// ---------- Row + quiz definitions ----------

export type Col = "Somme" | "Multiplication" | "Division" | "Exposant";
export const COLS: Col[] = ["Somme", "Multiplication", "Division", "Exposant"];

export type QuizQ = {
  prompt: ReactNode;
  choices: string[];
  answer: number;
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

const rnd = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const shuffle = <T,>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const makeQ = (prompt: ReactNode, correct: string, distractors: string[]): QuizQ => {
  const all = shuffle([correct, ...distractors.filter((d) => d !== correct)]).slice(0, 4);
  if (!all.includes(correct)) all[0] = correct;
  return { prompt, choices: all, answer: all.indexOf(correct) };
};

const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b));
const simp = (num: number, den: number) => {
  const g = gcd(num, den) || 1;
  return `${num / g}/${den / g}`;
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
      const k = rnd(2, lvl >= 2 ? 12 : 6);
      const t = rnd(3, lvl >= 2 ? 7 : 5);
      return makeQ(
        <>Écris {Array(t).fill(k).join("+")} sous forme d'un produit.</>,
        `${k}×${t}`,
        [`${k}+${t}`, `${k}×${t + 1}`, `${k}${t}`],
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
      const b = rnd(2, lvl >= 2 ? 9 : 5);
      const e = rnd(2, lvl >= 2 ? 5 : 4);
      return makeQ(
        <>Écris {Array(e).fill(b).join("×")} sous forme d'une puissance.</>,
        `${b}^${e}`,
        [`${b}×${e}`, `${b}^${e + 1}`, `${e}^${b}`],
      );
    },
  },
  {
    id: "factor-plus",
    left: plus(jux(n("k"), n("a")), jux(n("k"), n("b"))),
    right: times(n("k"), paren(plus(n("a"), n("b")))),
    leftCol: "Somme",
    rightCol: "Multiplication",
    quiz: (lvl) => {
      const k = rnd(2, lvl >= 2 ? 12 : 7);
      return makeQ(
        <>Factorise : {k}a + {k}b</>,
        `${k}(a+b)`,
        [`${k}(a−b)`, `${2 * k}(a+b)`, `${k}ab`],
      );
    },
  },
  {
    id: "factor-minus",
    left: minus(jux(n("k"), n("a")), jux(n("k"), n("b"))),
    right: times(n("k"), paren(minus(n("a"), n("b")))),
    leftCol: "Somme",
    rightCol: "Multiplication",
    quiz: (lvl) => {
      const k = rnd(2, lvl >= 2 ? 12 : 7);
      return makeQ(
        <>Factorise : {k}a − {k}b</>,
        `${k}(a−b)`,
        [`${k}(a+b)`, `${2 * k}(a−b)`, `${k}(b−a)`],
      );
    },
  },
  {
    id: "diff-squares",
    left: minus(pow(n("a"), n(2)), pow(n("b"), n(2))),
    right: times(paren(plus(n("a"), n("b"))), paren(minus(n("a"), n("b")))),
    leftCol: "Somme",
    rightCol: "Multiplication",
    quiz: (lvl) => {
      const a = rnd(2, lvl >= 2 ? 12 : 8);
      const b = rnd(1, a - 1);
      return makeQ(
        <>Factorise : {a}² − {b}²</>,
        `(${a}+${b})(${a}−${b})`,
        [`(${a}−${b})²`, `${a}² − ${b}²`, `${a * a - b * b}`],
      );
    },
  },
  {
    id: "frac-add",
    left: plus(frac(n("a"), n("c")), frac(n("b"), n("c"))),
    right: frac(plus(n("a"), n("b")), n("c")),
    leftCol: "Somme",
    rightCol: "Division",
    quiz: (lvl) => {
      const c = rnd(3, lvl >= 2 ? 15 : 9);
      const a = rnd(1, c - 1);
      const b = rnd(1, c - 1);
      return makeQ(
        <>Calcule : {a}/{c} + {b}/{c}</>,
        `${a + b}/${c}`,
        [`${a + b}/${2 * c}`, `${a * b}/${c}`, `${a}+${b}/${c}`],
      );
    },
  },
  {
    id: "frac-mul",
    left: times(frac(n("a"), n("b")), frac(n("c"), n("d"))),
    right: frac(times(n("a"), n("c")), times(n("b"), n("d"))),
    leftCol: "Multiplication",
    rightCol: "Division",
    quiz: (lvl) => {
      const a = rnd(1, lvl >= 2 ? 9 : 5);
      const b = rnd(2, lvl >= 2 ? 9 : 5);
      const c = rnd(1, lvl >= 2 ? 9 : 5);
      const d = rnd(2, lvl >= 2 ? 9 : 5);
      return makeQ(
        <>Calcule : ({a}/{b}) × ({c}/{d})</>,
        `${a * c}/${b * d}`,
        [`${a + c}/${b + d}`, `${a * b}/${c * d}`, `${a * d}/${b * c}`],
      );
    },
  },
  {
    id: "frac-div",
    left: frac(frac(n("a"), n("b")), frac(n("c"), n("d"))),
    right: times(frac(n("a"), n("b")), frac(n("d"), n("c"))),
    leftCol: "Division",
    rightCol: "Multiplication",
    quiz: (lvl) => {
      const a = rnd(1, lvl >= 2 ? 9 : 5);
      const b = rnd(2, lvl >= 2 ? 9 : 5);
      const c = rnd(1, lvl >= 2 ? 9 : 5);
      const d = rnd(2, lvl >= 2 ? 9 : 5);
      return makeQ(
        <>Calcule : ({a}/{b}) ÷ ({c}/{d})</>,
        `${a * d}/${b * c}`,
        [`${a * c}/${b * d}`, `${b * c}/${a * d}`, `${a + d}/${b + c}`],
      );
    },
  },
  {
    id: "frac-simplify",
    left: frac(times(n("a"), n("c")), times(n("b"), n("c"))),
    right: frac(n("a"), n("b")),
    leftCol: "Division",
    rightCol: "Division",
    quiz: (lvl) => {
      const a = rnd(2, lvl >= 2 ? 9 : 5);
      const b = rnd(2, lvl >= 2 ? 9 : 5);
      const c = rnd(2, lvl >= 2 ? 9 : 5);
      return makeQ(
        <>Simplifie : {a * c}/{b * c}</>,
        simp(a, b),
        [`${a}/${b * c}`, `${a * c}/${b}`, `${c}/${b}`],
      );
    },
  },
  {
    id: "pow-mul-same-base",
    left: times(pow(n("x"), n("a")), pow(n("x"), n("b"))),
    right: pow(n("x"), plus(n("a"), n("b"))),
    leftCol: "Multiplication",
    rightCol: "Exposant",
    quiz: (lvl) => {
      if (lvl >= 3) {
        return makeQ(
          <>Simplifie : x^(1/2) × x^(1/2)</>,
          "x",
          ["x^(1/4)", "x²", "2x"],
        );
      }
      const x = rnd(2, 5);
      const a = rnd(2, 4);
      const b = rnd(2, 4);
      return makeQ(
        <>Simplifie : {x}^{a} × {x}^{b}</>,
        `${x}^${a + b}`,
        [`${x}^${a * b}`, `${x * x}^${a + b}`, `${x}^${a - b}`],
      );
    },
  },
  {
    id: "pow-mul-same-exp",
    left: times(pow(n("x"), n("a")), pow(n("y"), n("a"))),
    right: pow(paren(times(n("x"), n("y"))), n("a")),
    leftCol: "Multiplication",
    rightCol: "Exposant",
    quiz: (lvl) => {
      const x = rnd(2, 6);
      const y = rnd(2, 6);
      const a = rnd(2, lvl >= 2 ? 5 : 3);
      return makeQ(
        <>Simplifie : {x}^{a} × {y}^{a}</>,
        `${x * y}^${a}`,
        [`${x + y}^${a}`, `${x * y}^${2 * a}`, `${x}^${a} + ${y}^${a}`],
      );
    },
  },
  {
    id: "pow-div-same-base",
    left: frac(pow(n("x"), n("a")), pow(n("x"), n("b"))),
    right: pow(n("x"), minus(n("a"), n("b"))),
    leftCol: "Division",
    rightCol: "Exposant",
    quiz: (lvl) => {
      if (lvl >= 3) {
        return makeQ(
          <>Simplifie : x^(3/2) / x^(1/2)</>,
          "x",
          ["x²", "x^(1/2)", "x^3"],
        );
      }
      const x = rnd(2, 5);
      const a = rnd(4, 8);
      const b = rnd(1, 3);
      return makeQ(
        <>Simplifie : {x}^{a} / {x}^{b}</>,
        `${x}^${a - b}`,
        [`${x}^${a + b}`, `1^${a - b}`, `${x}^${a * b}`],
      );
    },
  },
  {
    id: "pow-div-same-exp",
    left: frac(pow(n("x"), n("a")), pow(n("y"), n("a"))),
    right: pow(paren(frac(n("x"), n("y"))), n("a")),
    leftCol: "Division",
    rightCol: "Exposant",
    quiz: (lvl) => {
      const y = rnd(2, 4);
      const k = rnd(2, 4);
      const x = y * k;
      const a = rnd(2, lvl >= 2 ? 4 : 3);
      return makeQ(
        <>Simplifie : {x}^{a} / {y}^{a}</>,
        `${k}^${a}`,
        [`${x - y}^${a}`, `${k}^${2 * a}`, `${x}^${a} − ${y}^${a}`],
      );
    },
  },
  {
    id: "pow-of-pow",
    left: powRaw(n("x"), times(n("a"), n("b"))),
    right: pow(paren(pow(n("x"), n("a"))), n("b")),
    leftCol: "Exposant",
    rightCol: "Exposant",
    quiz: (lvl) => {
      if (lvl >= 3) {
        return makeQ(
          <>Simplifie : (x^(1/2))²</>,
          "x",
          ["x^(1/4)", "x²", "x^4"],
        );
      }
      const x = rnd(2, 5);
      const a = rnd(2, 4);
      const b = rnd(2, 4);
      return makeQ(
        <>Simplifie : ({x}^{a})^{b}</>,
        `${x}^${a * b}`,
        [`${x}^${a + b}`, `${x}^${a - b}`, `${x * a}^${b}`],
      );
    },
  },
  {
    id: "square-plus",
    left: plus(pow(n("a"), n(2)), jux(n(2), n("a"), n("b")), pow(n("b"), n(2))),
    right: pow(paren(plus(n("a"), n("b"))), n(2)),
    leftCol: "Somme",
    rightCol: "Exposant",
    quiz: (lvl) => {
      const k = rnd(2, lvl >= 2 ? 9 : 5);
      return makeQ(
        <>Développe : (x + {k})²</>,
        `x²+${2 * k}x+${k * k}`,
        [`x²+${k * k}`, `x²−${2 * k}x+${k * k}`, `x²+${k}x+${k * k}`],
      );
    },
  },
  {
    id: "square-minus",
    left: plus(pow(n("a"), n(2)), jux(n("−2"), n("a"), n("b")), pow(n("b"), n(2))),
    right: pow(paren(minus(n("a"), n("b"))), n(2)),
    leftCol: "Somme",
    rightCol: "Exposant",
    quiz: (lvl) => {
      const k = rnd(2, lvl >= 2 ? 9 : 5);
      return makeQ(
        <>Développe : (x − {k})²</>,
        `x²−${2 * k}x+${k * k}`,
        [`x²+${2 * k}x+${k * k}`, `x²−${k * k}`, `x²−${k}x+${k * k}`],
      );
    },
  },
];