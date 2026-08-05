import { describe, expect, it } from "vitest";
import { fmt } from "@/lib/mathFormat";
import { extractText } from "@/lib/testUtils";

// Walks the JSX tree fmt() returns and concatenates every KaTeX fragment's
// rendered HTML (dangerouslySetInnerHTML.__html) — lets a test assert on
// the actual LaTeX output (e.g. "was a real \frac used?") without a DOM.
function renderedHtml(node: unknown): string {
  if (node === null || node === undefined || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return "";
  if (Array.isArray(node)) return node.map(renderedHtml).join("");
  if (typeof node === "object" && "props" in node) {
    const props = (
      node as { props?: { children?: unknown; dangerouslySetInnerHTML?: { __html: string } } }
    ).props;
    if (props?.dangerouslySetInnerHTML) return props.dangerouslySetInnerHTML.__html;
    return renderedHtml(props?.children);
  }
  return "";
}

describe("fmt — plain numeric fractions", () => {
  it("leaves text with no ^, _, or fraction unchanged", () => {
    expect(fmt("Calcule la limite.")).toBe("Calcule la limite.");
  });

  it("typesets a bare fraction as a real KaTeX \\frac (glued bar, not a slash)", () => {
    const out = fmt("2/4");
    expect(renderedHtml(out)).toContain("frac-line");
    expect(extractText(out)).toBe("2/4");
  });

  it("typesets a fraction embedded in surrounding prose", () => {
    const out = fmt("1+1/4");
    expect(renderedHtml(out)).toContain("frac-line");
    expect(extractText(out)).toBe("1+1/4");
  });

  it("handles a negative numerator", () => {
    const out = fmt("-3/4");
    expect(renderedHtml(out)).toContain("frac-line");
    expect(extractText(out)).toBe("-3/4");
  });

  it("does not touch an algebraic (non-numeric) slash expression", () => {
    // Deliberately conservative — "x/(y+1)" isn't a simple digit/digit
    // fraction, so it's left as plain text rather than misparsed.
    const out = fmt("x/(y+1) est une fraction rationnelle.");
    expect(out).toBe("x/(y+1) est une fraction rationnelle.");
  });

  it("typesets a fraction nested inside an exponent (e.g. x^(1/2))", () => {
    const out = fmt("x^(1/2)");
    expect(renderedHtml(out)).toContain("frac-line");
    // extractText drops the "^"/"_" operator itself (pre-existing behavior,
    // see katexFragment's data-text = base + raw) — "x" + "1/2".
    expect(extractText(out)).toBe("x1/2");
  });

  it("still typesets a plain exponent with no fraction involved", () => {
    const out = fmt("x^2");
    expect(extractText(out)).toBe("x2");
  });
});
