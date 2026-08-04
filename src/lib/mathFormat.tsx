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

// Translates a captured exponent/subscript's raw content into LaTeX source,
// recursing into any nested "^"/"_" and mapping known Unicode symbols.
function toLatexFragment(s: string): string {
  let out = "";
  let i = 0;
  while (i < s.length) {
    const c = s[i];
    if (c === "^" || c === "_") {
      const { raw, next } = readMarkupGroup(s, i + 1);
      out += `${c}{${toLatexFragment(raw)}}`;
      i = next;
    } else if (c in SYMBOL_MAP) {
      out += SYMBOL_MAP[c];
      i++;
    } else if (c === "%" || c === "&" || c === "#" || c === "$") {
      out += `\\${c}`;
      i++;
    } else {
      out += c;
      i++;
    }
  }
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

// Turns a plain math string containing "^" exponents and/or "_" subscripts
// (e.g. "x^2", "3^(a+b)", "P_B(A)") into JSX with real LaTeX typesetting for
// those spans, via KaTeX. Strings without either are returned unchanged.
export function fmt(s: string): ReactNode {
  if (!s.includes("^") && !s.includes("_")) return s;
  const parts: ReactNode[] = [];
  let buf = "";
  let i = 0;
  const flush = () => {
    if (buf) {
      parts.push(<span key={`t${parts.length}`}>{buf}</span>);
      buf = "";
    }
  };
  while (i < s.length) {
    const c = s[i];
    if (c === "^" || c === "_") {
      flush();
      const { raw, next } = readMarkupGroup(s, i + 1);
      const latex = `{}${c}{${toLatexFragment(raw)}}`;
      parts.push(katexFragment(`k${parts.length}`, latex, raw));
      i = next;
    } else {
      buf += c;
      i++;
    }
  }
  flush();
  return <>{parts}</>;
}
