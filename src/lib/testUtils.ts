// Flattens a React element tree (as produced by the JSX in src/data/pemdas.tsx
// and src/lib/mathFormat.tsx) down to its visible text, without needing a
// DOM or a renderer — React elements are plain objects with a `props.children`
// tree, so a simple recursive walk is enough.
export function extractText(node: unknown): string {
  if (node === null || node === undefined || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (typeof node === "object" && node !== null && "props" in node) {
    return extractText((node as { props?: { children?: unknown } }).props?.children);
  }
  return "";
}
