import type { ReactNode } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

// Formula strings across the app use a small ASCII markup: "^" for an
// exponent, "_" for a subscript, each followed either by a single token
// (letters/digits) or a "(...)"/"{...}" group for multi-character content
// (e.g. "x^(1/2)", "P_B(A)"). Everything else in the string is plain text —
// French prose and formulas are mixed in the same strings (question text,
// explanations), so only the "^"/"_" spans get real math typesetting; the
// surrounding words are left untouched rather than fed to a LaTeX engine
// that assumes its whole input is a formula.

// A few Unicode math symbols that can appear inside an exponent/subscript
// group and need an explicit LaTeX command to render correctly in KaTeX.
const SYMBOL_MAP: Record<string, string> = {
  "×": "\\times ",
  "÷": "\\div ",
  "−": "-",
  "≤": "\\le ",
  "≥": "\\ge ",
  "≠": "\\ne ",
  "≈": "\\approx ",
  "∈": "\\in ",
  "∩": "\\cap ",
  "∪": "\\cup ",
  "→": "\\to ",
  "⇒": "\\Rightarrow ",
  "⇔": "\\Leftrightarrow ",
  "∞": "\\infty ",
  π: "\\pi ",
  θ: "\\theta ",
  α: "\\alpha ",
  φ: "\\varphi ",
  μ: "\\mu ",
  σ: "\\sigma ",
  ρ: "\\rho ",
  Δ: "\\Delta ",
  Σ: "\\Sigma ",
  ℝ: "\\mathbb{R} ",
};

// Finds the "base" a trailing "^"/"_" attaches to, so the whole base+script
// gets typeset as one glued KaTeX unit instead of a plain-text base sitting
// next to a separately-rendered script fragment — which looks visibly
// disconnected (different font, no shared kerning) even when the spacing
// is technically correct. A balanced trailing "(...)" group is taken whole
// (e.g. "(2x+1)" in "(2x+1)^2"); otherwise a trailing run of letters/digits
// (e.g. "x" in "f(x) = x^3" — stops at the space, so surrounding prose is
// never pulled in). No match (buf is empty, or ends in a space/operator)
// falls back to an empty base, exactly like the previous behavior.
function extractTrailingBase(buf: string): { base: string; rest: string } {
  if (buf.endsWith(")")) {
    let depth = 1;
    let j = buf.length - 2;
    while (j >= 0 && depth > 0) {
      if (buf[j] === ")") depth++;
      else if (buf[j] === "(") depth--;
      j--;
    }
    if (depth === 0) {
      return { base: buf.slice(j + 1), rest: buf.slice(0, j + 1) };
    }
  }
  const m = buf.match(/[0-9a-zA-Zα-ωΑ-Ω]+$/);
  if (m) {
    return { base: m[0], rest: buf.slice(0, buf.length - m[0].length) };
  }
  return { base: "", rest: buf };
}

// Reads the exponent/subscript content right after a "^" or "_" at index i,
// matching a balanced "(...)"/"{...}" group, a "-123" negative number, or a
// bare run of letters/digits — same grammar the old sup-only parser used.
function readMarkupGroup(s: string, i: number): { raw: string; next: number } {
  let raw = "";
  if (s[i] === "(" || s[i] === "{") {
    const open = s[i];
    const close = open === "(" ? ")" : "}";
    let depth = 1;
    i++;
    while (i < s.length && depth > 0) {
      if (s[i] === open) {
        depth++;
        raw += s[i];
      } else if (s[i] === close) {
        depth--;
        if (depth === 0) {
          i++;
          break;
        }
        raw += s[i];
      } else {
        raw += s[i];
      }
      i++;
    }
  } else if (s[i] === "-" || s[i] === "−") {
    raw += s[i];
    i++;
    while (i < s.length && /[0-9]/.test(s[i])) {
      raw += s[i];
      i++;
    }
  } else {
    while (i < s.length && /[0-9a-zA-Zα-ωΑ-Ω]/.test(s[i])) {
      raw += s[i];
      i++;
    }
  }
  return { raw, next: i };
}

// Matches a simple numeric fraction like "3/4" or "-3/4" — deliberately
// conservative (digits only, no algebraic numerator/denominator like
// "x/(x^2+1)") so it can't misparse an arbitrary expression's fraction
// boundaries. Catches exactly the "a/c" notation pemdas.tsx's fraction
// rows and exercises.ts's answers/distractors use, including nested
// inside an exponent/subscript (e.g. "x^(1/2)").
const PLAIN_FRACTION_RE = /(-|−)?\d+\/\d+/;

// Walks `text`, calling `onPlain` for the runs between fraction matches and
// onFraction(sign, num, den) for each match — shared by toLatexFragment
// (builds a LaTeX string) and pushPlainText (builds JSX), so both typeset
// "3/4" as a real \frac instead of a bare "/" character.
function scanFractions(
  text: string,
  onPlain: (chunk: string) => void,
  onFraction: (sign: string, num: string, den: string) => void,
) {
  const re = new RegExp(PLAIN_FRACTION_RE, "g");
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) onPlain(text.slice(last, m.index));
    const whole = m[0];
    const slash = whole.indexOf("/");
    const sign = whole[0] === "-" || whole[0] === "−" ? "-" : "";
    onFraction(sign, whole.slice(sign ? 1 : 0, slash), whole.slice(slash + 1));
    last = m.index + whole.length;
  }
  if (last < text.length) onPlain(text.slice(last));
}

// Translates a captured exponent/subscript's raw content into LaTeX source,
// recursing into any nested "^"/"_" and mapping known Unicode symbols and
// plain numeric fractions.
function toLatexFragment(s: string): string {
  let out = "";
  let buf = "";
  let i = 0;
  const flush = () => {
    if (!buf) return;
    scanFractions(
      buf,
      (chunk) => (out += chunk),
      (sign, num, den) => (out += `${sign}\\frac{${num}}{${den}}`),
    );
    buf = "";
  };
  while (i < s.length) {
    const c = s[i];
    if (c === "^" || c === "_") {
      flush();
      const { raw, next } = readMarkupGroup(s, i + 1);
      out += `${c}{${toLatexFragment(raw)}}`;
      i = next;
    } else if (c in SYMBOL_MAP) {
      flush();
      out += SYMBOL_MAP[c];
      i++;
    } else if (c === "%" || c === "&" || c === "#" || c === "$") {
      flush();
      out += `\\${c}`;
      i++;
    } else {
      buf += c;
      i++;
    }
  }
  flush();
  return out;
}

function renderKatex(latex: string): string {
  return katex.renderToString(latex, { throwOnError: false, strict: false, output: "html" });
}

// Builds a KaTeX-rendered exponent/subscript fragment. `text` carries the
// original (untranslated) source so extractText (src/lib/testUtils.ts) can
// still recover a comparable plain-text form — dangerouslySetInnerHTML
// replaces `children`, so without this the fragment's content would be
// invisible to the quiz generators' "are these 4 choices actually distinct"
// tests. Built as a plain host <span> (not a function component) because
// extractText walks the raw element tree without rendering — a custom
// component's output wouldn't be visible to it, only its unresolved props.
function katexFragment(key: string, latex: string, text: string): ReactNode {
  return (
    <span
      key={key}
      className="[&_.katex]:text-[0.95em]"
      data-text={text}
      dangerouslySetInnerHTML={{ __html: renderKatex(latex) }}
    />
  );
}

// Splits plain text on PLAIN_FRACTION_RE matches (see scanFractions above),
// pushing each match as a glued KaTeX \frac fragment (real horizontal bar)
// instead of a bare "/" — same rationale as extractTrailingBase: a slash
// rendered as plain text next to a KaTeX fragment looks visibly
// disconnected from real math.
function pushPlainText(parts: ReactNode[], text: string) {
  scanFractions(
    text,
    (chunk) => parts.push(<span key={`t${parts.length}`}>{chunk}</span>),
    (sign, num, den) => {
      const whole = `${sign}${num}/${den}`;
      parts.push(katexFragment(`f${parts.length}`, `${sign}\\frac{${num}}{${den}}`, whole));
    },
  );
}

// Turns a plain math string containing "^" exponents, "_" subscripts,
// and/or plain numeric fractions ("3/4") into JSX with real LaTeX
// typesetting for those spans, via KaTeX. Strings with none of these are
// returned unchanged.
export function fmt(s: string): ReactNode {
  if (!s.includes("^") && !s.includes("_") && !PLAIN_FRACTION_RE.test(s)) return s;
  const parts: ReactNode[] = [];
  let buf = "";
  let i = 0;
  const flush = () => {
    if (buf) {
      pushPlainText(parts, buf);
      buf = "";
    }
  };
  while (i < s.length) {
    const c = s[i];
    if (c === "^" || c === "_") {
      const { base, rest } = extractTrailingBase(buf);
      buf = rest;
      flush();
      const { raw, next } = readMarkupGroup(s, i + 1);
      const baseLatex = base ? toLatexFragment(base) : "{}";
      const latex = `${baseLatex}${c}{${toLatexFragment(raw)}}`;
      parts.push(katexFragment(`k${parts.length}`, latex, base + raw));
      i = next;
    } else {
      buf += c;
      i++;
    }
  }
  flush();
  return <>{parts}</>;
}
