import type { ReactNode } from "react";

// Turn a plain math string containing caret exponents (e.g. "x^2", "3^(a+b)",
// "x^(1/2)") into JSX with real <sup> superscripts. Anything without "^" is
// returned unchanged.
export function fmt(s: string): ReactNode {
  if (!s.includes("^")) return s;
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
    if (c === "^") {
      flush();
      i++;
      let exp = "";
      if (s[i] === "(" || s[i] === "{") {
        const open = s[i];
        const close = open === "(" ? ")" : "}";
        let depth = 1;
        i++;
        while (i < s.length && depth > 0) {
          if (s[i] === open) {
            depth++;
            exp += s[i];
          } else if (s[i] === close) {
            depth--;
            if (depth === 0) {
              i++;
              break;
            }
            exp += s[i];
          } else {
            exp += s[i];
          }
          i++;
        }
      } else if (s[i] === "-" || s[i] === "−") {
        exp += s[i];
        i++;
        while (i < s.length && /[0-9]/.test(s[i])) {
          exp += s[i];
          i++;
        }
      } else {
        while (i < s.length && /[0-9a-zA-Zα-ωΑ-Ω]/.test(s[i])) {
          exp += s[i];
          i++;
        }
      }
      parts.push(
        <sup key={`s${parts.length}`} className="relative -top-1 text-[0.7em] font-normal">
          {fmt(exp)}
        </sup>,
      );
    } else {
      buf += c;
      i++;
    }
  }
  flush();
  return <>{parts}</>;
}
