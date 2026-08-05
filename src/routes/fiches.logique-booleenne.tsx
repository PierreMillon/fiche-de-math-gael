import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  PyramidView,
  pyramidLabel,
  usePyramid,
  readStoredPyramid,
  isHesitant,
} from "@/lib/pyramid";
import { PageHeader } from "@/lib/PageHeader";

// How long a correct answer stays highlighted before auto-advancing — see
// the identical constant in fiches.pemdas.tsx.
const AUTO_ADVANCE_MS = 500;

export const Route = createFileRoute("/fiches/logique-booleenne")({
  head: () => ({
    meta: [
      { title: "Logique booléenne — circuits" },
      {
        name: "description",
        content:
          "Portes logiques (ET, OU, NON, NON-ET, NON-OU, XOR) et circuits interactifs : choisis les entrées, devine la sortie.",
      },
      {
        property: "og:title",
        content: "Logique booléenne — circuits",
      },
      {
        property: "og:description",
        content: "Rappel des portes logiques et exercice interactif de circuits.",
      },
    ],
  }),
  component: LogiquePage,
});

// ---------------- Gates ----------------

type GateType = "AND" | "OR" | "NOT" | "NAND" | "NOR" | "XOR";

const GATE_LABEL: Record<GateType, string> = {
  AND: "ET",
  OR: "OU",
  NOT: "NON",
  NAND: "NON-ET",
  NOR: "NON-OU",
  XOR: "XOR",
};

function evalGate(g: GateType, a: 0 | 1, b: 0 | 1 = 0): 0 | 1 {
  switch (g) {
    case "AND":
      return (a && b) as 0 | 1;
    case "OR":
      return (a || b) as 0 | 1;
    case "NOT":
      return (a ? 0 : 1) as 0 | 1;
    case "NAND":
      return (a && b ? 0 : 1) as 0 | 1;
    case "NOR":
      return (a || b ? 0 : 1) as 0 | 1;
    case "XOR":
      return (a ^ b) as 0 | 1 as 0 | 1;
  }
}

// The paths/circles for a gate's symbol, in a shared 70×50 local coordinate
// space — used both by the standalone GateSymbol (its own <svg viewBox="0 0
// 70 50">, for the "cours" cards) and by CircuitView's diagram (each gate
// wrapped in its own <g transform="translate(...) scale(...)">, see below),
// so the reference icons and the circuit diagram render the same gates.
function gatePaths(type: GateType) {
  const common = "stroke-white fill-none";
  const strokeW = 1.6;
  switch (type) {
    case "AND":
    case "NAND":
      return (
        <>
          <path className={common} strokeWidth={strokeW} d="M8 8 H35 A17 17 0 0 1 35 42 H8 Z" />
          {type === "NAND" && (
            <circle className={common} strokeWidth={strokeW} cx="57" cy="25" r="3" />
          )}
        </>
      );
    case "OR":
    case "NOR":
      return (
        <>
          <path
            className={common}
            strokeWidth={strokeW}
            d="M6 8 Q22 25 6 42 Q30 42 55 25 Q30 8 6 8 Z"
          />
          {type === "NOR" && (
            <circle className={common} strokeWidth={strokeW} cx="60" cy="25" r="3" />
          )}
        </>
      );
    case "NOT":
      return (
        <>
          <path className={common} strokeWidth={strokeW} d="M8 8 L50 25 L8 42 Z" />
          <circle className={common} strokeWidth={strokeW} cx="55" cy="25" r="3" />
        </>
      );
    case "XOR":
      return (
        <>
          <path className={common} strokeWidth={strokeW} d="M2 8 Q18 25 2 42" />
          <path
            className={common}
            strokeWidth={strokeW}
            d="M8 8 Q24 25 8 42 Q30 42 55 25 Q30 8 8 8 Z"
          />
        </>
      );
  }
}

// A tiny inline SVG for each gate (schematic-ish) — used standalone in the
// "cours" reference cards. CircuitView (below) embeds gatePaths() directly
// instead, positioned on its own coordinate grid.
function GateSymbol({ type, size = 44 }: { type: GateType; size?: number }) {
  const w = size * 1.4;
  const h = size;
  return (
    <svg width={w} height={h} viewBox="0 0 70 50">
      {gatePaths(type)}
    </svg>
  );
}

function TruthTable({ type }: { type: GateType }) {
  const unary = type === "NOT";
  const rows: Array<[0 | 1, 0 | 1, 0 | 1]> = unary
    ? [
        [0, 0, evalGate(type, 0)],
        [1, 0, evalGate(type, 1)],
      ]
    : (
        [
          [0, 0],
          [0, 1],
          [1, 0],
          [1, 1],
        ] as Array<[0 | 1, 0 | 1]>
      ).map(([a, b]) => [a, b, evalGate(type, a, b)] as [0 | 1, 0 | 1, 0 | 1]);
  return (
    <table className="mt-3 border-collapse text-xs">
      <thead>
        <tr className="text-muted-foreground">
          <th className="border border-border px-2 py-1">a</th>
          {!unary && <th className="border border-border px-2 py-1">b</th>}
          <th className="border border-border px-2 py-1">S</th>
        </tr>
      </thead>
      <tbody className="font-mono">
        {rows.map(([a, b, s], i) => (
          <tr key={i}>
            <td className="border border-border px-2 py-1 text-center">{a}</td>
            {!unary && <td className="border border-border px-2 py-1 text-center">{b}</td>}
            <td className="border border-border px-2 py-1 text-center text-primary">{s}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// ---------------- Circuit model ----------------

type Node = { kind: "in"; id: string } | { kind: "gate"; type: GateType; a: Node; b?: Node };

function evalNode(n: Node, inputs: Record<string, 0 | 1>): 0 | 1 {
  if (n.kind === "in") return inputs[n.id] ?? 0;
  const a = evalNode(n.a, inputs);
  if (n.type === "NOT") return evalGate("NOT", a);
  const b = evalNode(n.b!, inputs);
  return evalGate(n.type, a, b);
}

function collectInputs(n: Node, acc: Set<string> = new Set()): string[] {
  if (n.kind === "in") acc.add(n.id);
  else {
    collectInputs(n.a, acc);
    if (n.b) collectInputs(n.b, acc);
  }
  return Array.from(acc).sort();
}

const rndPick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

function makeCircuit(tier: 1 | 2 | 3): Node {
  const A: Node = { kind: "in", id: "A" };
  const B: Node = { kind: "in", id: "B" };
  const C: Node = { kind: "in", id: "C" };
  const binary: GateType[] = ["AND", "OR", "XOR", "NAND", "NOR"];
  if (tier === 1) {
    // 1 gate: NOT(A) or A ⊕ B
    if (Math.random() < 0.5) {
      return { kind: "gate", type: "NOT", a: A };
    }
    return { kind: "gate", type: rndPick(binary), a: A, b: B };
  }
  if (tier === 2) {
    // 3 gates chain: g2( g1(A,B), NOT(C) )  or  g2( g1(A,B), C )
    const g1: Node = { kind: "gate", type: rndPick(binary), a: A, b: B };
    const rightBranch: Node = Math.random() < 0.5 ? { kind: "gate", type: "NOT", a: C } : C;
    return { kind: "gate", type: rndPick(binary), a: g1, b: rightBranch };
  }
  // tier 3: 4 gates
  const g1: Node = { kind: "gate", type: rndPick(binary), a: A, b: B };
  const g2: Node = { kind: "gate", type: "NOT", a: C };
  const g3: Node = { kind: "gate", type: rndPick(binary), a: g1, b: g2 };
  return { kind: "gate", type: rndPick(binary), a: g3, b: B };
}

// ---------------- Circuit diagram (SVG) ----------------
// Renders the circuit tree as one SVG with exact pixel coordinates, so
// wires are drawn as orthogonal (horizontal/vertical only, never diagonal)
// paths that terminate exactly on a gate's input pin or a leaf's edge —
// no CSS-flexbox gaps for a wire to visibly "float" across (the previous
// version drew each wire as an independent flex sibling, with flex `gap`
// leaving a blank space on both ends of every wire).

const LEAF_W = 13; // ~one monospace glyph's width — the wire starts right after
const GATE_W = 52;
const GATE_ICON_H = 32;
const ROW_H = 40; // uniform vertical slot for both a leaf and a gate row — no
// label row to reserve space for anymore (see gatePaths-only gates below)
const ROW_GAP = 10; // vertical gap between two stacked sibling branches
const COL_GAP = 32; // horizontal gap between a subtree and the gate it feeds
const EXIT_STUB = 20; // trailing wire past the root gate, before the value badge
const PIN_OFFSET = GATE_ICON_H * 0.32; // top/bottom input pin distance from a gate's own center

type Measured = { w: number; h: number; cy: number };

// Bottom-up pass: how much space (and where its own vertical center falls)
// each subtree needs. A binary gate's center is the midpoint between its
// two children's centers; its own box height is however tall that makes
// the stack (never less than one row, in case both children are shallow).
function measure(node: Node): Measured {
  if (node.kind === "in") return { w: LEAF_W, h: ROW_H, cy: ROW_H / 2 };
  const a = measure(node.a);
  const w = (childW: number) => childW + COL_GAP + GATE_W;
  if (node.type === "NOT") {
    return { w: w(a.w), h: Math.max(a.h, ROW_H), cy: Math.max(a.cy, ROW_H / 2) };
  }
  const b = measure(node.b!);
  const bTop = a.h + ROW_GAP;
  const h = Math.max(bTop + b.h, ROW_H);
  const cy = Math.min(Math.max((a.cy + bTop + b.cy) / 2, ROW_H / 2), h - ROW_H / 2);
  return { w: w(Math.max(a.w, b.w)), h, cy };
}

// Depth-first render: places `node`'s own box at (x, y..y+m.h), with
// `allocW` ≥ measure(node).w — the slack (allocW - naturalWidth) happens
// when a sibling subtree is deeper, and becomes extra straight wire before
// the parent gate rather than a gap. Pushes SVG elements into `out` and
// returns this node's own output point, for the parent to route a wire
// into its actual input pin (never assumed to already line up).
function placeNode(
  node: Node,
  x: number,
  y: number,
  allocW: number,
  inputs: Record<string, 0 | 1>,
  reveal: boolean,
  out: ReactNode[],
  key: string,
): { outX: number; outY: number } {
  const m = measure(node);
  const cyAbs = y + m.cy;

  if (node.kind === "in") {
    // The actual 0/1 value, not the letter — it's already visible on the
    // switch that controls it, so showing it again here (instead of a
    // letter the learner has to go match up) is the more direct read. No
    // box either — the wire starts right at the digit's edge.
    const v = inputs[node.id] ?? 0;
    out.push(
      <text
        key={key}
        x={x}
        y={cyAbs}
        dominantBaseline="central"
        className={`font-mono text-[12px] font-semibold ${v ? "fill-green-400" : "fill-muted-foreground"}`}
      >
        {v}
      </text>,
    );
    const wireStartX = x + LEAF_W;
    const outX = x + allocW;
    if (outX > wireStartX) {
      const wireClass = reveal && evalNode(node, inputs) ? "stroke-green-400" : "stroke-white/30";
      out.push(
        <line
          key={`${key}-w`}
          x1={wireStartX}
          y1={cyAbs}
          x2={outX}
          y2={cyAbs}
          className={`transition-colors duration-300 ${wireClass}`}
          strokeWidth={1.5}
        />,
      );
    }
    return { outX, outY: cyAbs };
  }

  const a = measure(node.a);
  const childSlotW = node.type === "NOT" ? a.w : Math.max(a.w, measure(node.b!).w);
  const gateX = x + childSlotW + COL_GAP;
  const gateY = cyAbs - GATE_ICON_H / 2;

  // A child's wire runs straight to the gate's x, then jogs vertically
  // (still along the gate's left edge) to the exact pin height — an "L"
  // shape, purely orthogonal, that always ends touching the gate.
  const routeChild = (child: Node, childX: number, childY: number, pinY: number, k: string) => {
    const res = placeNode(child, childX, childY, childSlotW, inputs, reveal, out, k);
    const wireClass = reveal && evalNode(child, inputs) ? "stroke-green-400" : "stroke-white/30";
    out.push(
      <path
        key={`${k}-w`}
        d={`M ${res.outX} ${res.outY} H ${gateX} V ${pinY}`}
        className={`fill-none transition-colors duration-300 ${wireClass}`}
        strokeWidth={1.5}
      />,
    );
  };

  if (node.type === "NOT") {
    routeChild(node.a, x, y, gateY + GATE_ICON_H / 2, `${key}-a`);
  } else {
    routeChild(node.a, x, y, gateY + GATE_ICON_H / 2 - PIN_OFFSET, `${key}-a`);
    routeChild(node.b!, x, y + a.h + ROW_GAP, gateY + GATE_ICON_H / 2 + PIN_OFFSET, `${key}-b`);
  }

  const val = evalNode(node, inputs);
  // Épuré: no label under the gate, no intermediate value badge (both
  // removed — the symbol + wire color already carry that information, and
  // the final answer lives solely in the "Sortie S" picker below). The
  // gate itself gets a soft glow once its own output is revealed as 1, so
  // "lighting up" reads the same way a lit wire does.
  out.push(
    <g
      key={`${key}-gate`}
      transform={`translate(${gateX} ${gateY}) scale(${GATE_W / 70} ${GATE_ICON_H / 50})`}
      className="transition-[filter] duration-300"
      style={{
        filter: reveal && val ? "drop-shadow(0 0 3px rgb(74 222 128 / 0.8))" : "none",
      }}
    >
      {gatePaths(node.type)}
    </g>,
  );

  const selfRightX = gateX + GATE_W;
  const outX = x + allocW;
  const wireClass = reveal && val ? "stroke-green-400" : "stroke-white/30";
  out.push(
    <line
      key={`${key}-out`}
      x1={selfRightX}
      y1={cyAbs}
      x2={outX}
      y2={cyAbs}
      className={`transition-colors duration-300 ${wireClass}`}
      strokeWidth={1.5}
    />,
  );

  return { outX, outY: cyAbs };
}

function CircuitView({
  node,
  inputs,
  reveal,
}: {
  node: Node;
  inputs: Record<string, 0 | 1>;
  reveal: boolean;
}) {
  const root = measure(node);
  const width = root.w + EXIT_STUB;
  const height = root.h;
  const elements: ReactNode[] = [];
  placeNode(node, 0, 0, root.w + EXIT_STUB, inputs, reveal, elements, "n");

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {elements}
    </svg>
  );
}

function LogiquePage() {
  const gates: GateType[] = ["AND", "OR", "NOT", "NAND", "NOR", "XOR"];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <PageHeader
        eyebrow="Logique"
        title="Logique booléenne — circuits"
        description="Rappel des portes logiques puis exercice interactif : choisis les entrées et devine la sortie du circuit."
        maxWidth="5xl"
      />

      {/* Extra bottom clearance: the exercise's own S=0/1 row sits bottom-right,
          same corner as the fixed "back to top" button (see __root.tsx) —
          without it, on a short viewport the two visually collide. */}
      <main className="mx-auto max-w-5xl px-6 pt-10 pb-28">
        <section>
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Cours — portes logiques
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {gates.map((g) => (
              <div key={g} className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold">{GATE_LABEL[g]}</div>
                    <div className="text-xs text-muted-foreground">{g}</div>
                  </div>
                  <GateSymbol type={g} />
                </div>
                <TruthTable type={g} />
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Exercice — circuit interactif
          </h2>
          <CircuitExercise />
        </section>
      </main>
    </div>
  );
}

// A sliding on/off switch for one boolean input — replaces the previous
// text button ("A = 0"/"A = 1"). No letter shown (the letter is dropped
// site-wide from this exercise — see the diagram's leaves too): the digit
// is marked directly on the thumb, sliding left (0) or right (1), so
// there's nothing to read except the value itself. The full pill is the
// tap target, not just the thumb, comfortably large on a phone. `id` is
// kept for the accessible name only (`aria-label`) — with several inputs,
// a screen reader still needs to say which is which even though sighted
// users no longer see a letter.
function InputSwitch({
  id,
  value,
  disabled,
  onToggle,
}: {
  id: string;
  value: 0 | 1;
  disabled: boolean;
  onToggle: () => void;
}) {
  const on = value === 1;
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={`Entrée ${id} : ${value}`}
      onClick={onToggle}
      disabled={disabled}
      className={`relative h-11 w-20 shrink-0 rounded-full border transition disabled:opacity-60 ${
        on ? "border-green-400 bg-green-500/20" : "border-border bg-white/5 hover:border-primary"
      }`}
    >
      <span
        className={`absolute top-0.5 flex h-10 w-10 items-center justify-center rounded-full font-mono text-base font-bold shadow transition-transform duration-200 ${
          on ? "translate-x-[38px] bg-green-400 text-black" : "translate-x-0.5 bg-white text-black"
        }`}
      >
        {value}
      </span>
    </button>
  );
}

export function CircuitExercise() {
  const { pyramid, onCorrect, onWrong } = usePyramid("logique-circuit");
  const tier = pyramid.complete ? 3 : pyramid.tier;

  // The circuit is only regenerated when the learner explicitly clicks
  // "Nouveau circuit" — never reactively from `tier`. A correct answer can
  // bump `pyramid.tier` mid-round (e.g. finishing palier 1's last question),
  // and deriving the circuit straight from `tier` via useMemo used to
  // regenerate it — silently re-randomizing the inputs and wiping the
  // just-picked answer's ✓/✗ feedback — the instant that happened, before
  // the learner ever saw whether they'd gotten it right.
  const [node, setNode] = useState<Node>(() => makeCircuit(tier));
  const inputIds = useMemo(() => collectInputs(node), [node]);

  const [inputs, setInputs] = useState<Record<string, 0 | 1>>({});
  const [picked, setPicked] = useState<0 | 1 | null>(null);
  // Marks when the current circuit's inputs were (re-)randomized, so a
  // correct answer can be judged "hesitant" (see isHesitant) relative to
  // how long that tier should reasonably take.
  const shownAt = useRef<number>(Date.now());
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cancel any pending auto-advance on unmount — see the identical cleanup
  // in fiches.pemdas.tsx.
  useEffect(() => {
    return () => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
    };
  }, []);

  useEffect(() => {
    const init: Record<string, 0 | 1> = {};
    for (const id of inputIds) init[id] = Math.random() < 0.5 ? 1 : 0;
    setInputs(init);
    setPicked(null);
    shownAt.current = Date.now();
  }, [inputIds]);

  const expected = evalNode(node, inputs);
  const picking = picked !== null;

  const pick = (v: 0 | 1) => {
    if (picking) return;
    setPicked(v);
    if (v === expected) {
      onCorrect(isHesitant(Date.now() - shownAt.current, tier));
      // Read the level fresh from localStorage instead of the `tier`
      // closure — see the identical fix in fiches.pemdas.tsx.
      advanceTimer.current = setTimeout(() => {
        const stored = readStoredPyramid("logique-circuit");
        const level = stored?.complete ? 3 : (stored?.tier ?? 1);
        setNode(makeCircuit(level));
      }, AUTO_ADVANCE_MS);
    } else {
      onWrong();
    }
  };

  const next = () => setNode(makeCircuit(tier));

  const toggle = (id: string) => {
    if (picking) return;
    setInputs((prev) => ({ ...prev, [id]: prev[id] ? 0 : 1 }));
  };

  // Keyboard shortcuts, for going faster on a computer: the input letters
  // toggle their switch, 0/1 or ←/→ answer directly, Enter/Space repeats
  // "Nouveau circuit" once a wrong answer is showing. Ignored while some
  // other field on the page has focus (not the case here today, but cheap
  // insurance against stealing keystrokes from a text input).
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && /^(input|textarea|select)$/i.test(target.tagName)) return;
      const key = e.key.toLowerCase();
      if (key === "arrowleft" || key === "0") {
        e.preventDefault();
        pick(0);
      } else if (key === "arrowright" || key === "1") {
        e.preventDefault();
        pick(1);
      } else if ((key === "enter" || key === " ") && picked !== null && picked !== expected) {
        e.preventDefault();
        next();
      } else {
        const id = inputIds.find((i) => i.toLowerCase() === key);
        if (id) toggle(id);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          {pyramidLabel(pyramid)}
        </div>
        <PyramidView p={pyramid} size="md" />
      </div>

      <div className="mb-4 flex flex-wrap gap-3">
        {inputIds.map((id) => (
          <InputSwitch
            key={id}
            id={id}
            value={inputs[id] ?? 0}
            disabled={picking}
            onToggle={() => toggle(id)}
          />
        ))}
      </div>

      <div className="overflow-x-auto rounded-md border border-border bg-background p-4">
        <CircuitView node={node} inputs={inputs} reveal={picking} />
      </div>

      <div className="mt-5">
        <div className="mb-2 text-sm text-muted-foreground">Sortie S =</div>
        <div className="grid grid-cols-2 gap-3">
          {([0, 1] as const).map((v) => {
            const state =
              picked === null
                ? "border-border hover:border-primary"
                : v === expected
                  ? "border-green-500 bg-green-500/10 text-green-300"
                  : v === picked
                    ? "border-red-500 bg-red-500/10 text-red-300"
                    : "border-border opacity-60";
            const isRight = v === expected;
            const isPicked = v === picked;
            return (
              <button
                key={v}
                onClick={() => pick(v)}
                disabled={picking}
                className={`flex min-h-16 items-center justify-center gap-2 rounded-xl border font-mono text-2xl font-semibold transition ${state}`}
              >
                {picked !== null && (
                  <span aria-hidden="true">{isRight ? "✓" : isPicked ? "✗" : ""}</span>
                )}
                {v}
              </button>
            );
          })}
        </div>
        {picked !== null && picked !== expected && (
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs text-red-300">Faux — la bonne réponse était {expected}.</span>
            <button
              onClick={next}
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
            >
              Nouveau circuit
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
