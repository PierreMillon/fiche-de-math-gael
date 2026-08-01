import { useState, type ReactNode } from "react";

export type BranchColor = "green" | "red" | "gray";

export type TreeNode =
  | {
      type: "question";
      text: string;
      branches: { label: string; color: BranchColor; node: TreeNode }[];
    }
  | { type: "leaf"; text: string; detail?: ReactNode };

const BRANCH_STYLE: Record<BranchColor, string> = {
  green: "border-green-500 text-green-400 hover:bg-green-500/10",
  red: "border-red-500 text-red-400 hover:bg-red-500/10",
  gray: "border-border text-muted-foreground hover:bg-muted",
};

const PATH_COLOR: Record<BranchColor, string> = {
  green: "text-green-400",
  red: "text-red-400",
  gray: "text-muted-foreground",
};

// Interactive step-through of a yes/no(/indéterminé) decision tree: pick a
// branch at each question, land on a leaf with the compact justification,
// "Recommencer" resets to the root. Walking the path back to a node on every
// render (instead of storing node refs) keeps the component's own state
// trivially serializable.
export function DecisionTree({ root, title }: { root: TreeNode; title: string }) {
  const [path, setPath] = useState<{ label: string; color: BranchColor }[]>([]);

  let node: TreeNode = root;
  for (const step of path) {
    if (node.type !== "question") break;
    const branch = node.branches.find((b) => b.label === step.label);
    if (!branch) break;
    node = branch.node;
  }

  const reset = () => setPath([]);

  return (
    <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-primary">{title}</h3>
        {path.length > 0 && (
          <button
            onClick={reset}
            className="text-xs text-muted-foreground underline-offset-4 hover:underline"
          >
            Recommencer
          </button>
        )}
      </div>

      {path.length > 0 && (
        <p className="mt-3 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs">
          {path.map((step, i) => (
            <span key={i} className="flex items-center gap-1.5">
              {i > 0 && <span className="text-muted-foreground/50">→</span>}
              <span className={PATH_COLOR[step.color]}>{step.label}</span>
            </span>
          ))}
        </p>
      )}

      <div className="mt-4">
        {node.type === "question" ? (
          <>
            <p className="text-base font-medium text-foreground">{node.text}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {node.branches.map((b) => (
                <button
                  key={b.label}
                  onClick={() => setPath((p) => [...p, { label: b.label, color: b.color }])}
                  className={`rounded-md border px-4 py-2 text-sm font-medium transition ${BRANCH_STYLE[b.color]}`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="rounded-md border border-primary/40 bg-primary/10 px-4 py-3">
            <p className="text-base font-semibold text-primary">{node.text}</p>
            {node.detail && <div className="mt-2 text-sm text-muted-foreground">{node.detail}</div>}
          </div>
        )}
      </div>
    </div>
  );
}
