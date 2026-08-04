// Flattens a React element tree (as produced by the JSX in src/data/pemdas.tsx
// and src/lib/mathFormat.tsx) down to its visible text, without needing a
// DOM or a renderer — React elements are plain objects with a `props.children`
// tree, so a simple recursive walk is enough.
export function extractText(node: unknown): string {
  if (node === null || node === undefined || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (typeof node === "object" && node !== null && "props" in node) {
    const props = (node as { props?: { children?: unknown; "data-text"?: unknown } }).props;
    // KaTeX fragments (mathFormat.tsx) render via dangerouslySetInnerHTML,
    // which leaves no `children` to recurse into — they carry their
    // original source text in `data-text` instead.
    if (props && typeof props["data-text"] === "string") return props["data-text"];
    return extractText(props?.children);
  }
  return "";
}
