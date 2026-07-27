import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/fiches/tangente")({
  head: () => ({
    meta: [
      { title: "La tangente, visuellement — Fiche de révision" },
      {
        name: "description",
        content:
          "Visualise la tangente à une courbe et sa pente f'(x) en déplaçant un point le long de fonctions usuelles.",
      },
      {
        property: "og:title",
        content: "La tangente, visuellement — Fiche de révision",
      },
      {
        property: "og:description",
        content:
          "Animation interactive de la dérivée : déplace le point, la tangente suit en temps réel.",
      },
    ],
  }),
  component: TangentePage,
});

type Fn = {
  key: string;
  label: string;
  f: (x: number) => number;
  df: (x: number) => number;
  domain: [number, number];
  // default slider position
  x0: number;
  // y viewport
  yRange: [number, number];
  // guard: valid x?
  valid?: (x: number) => boolean;
};

const FUNCTIONS: Fn[] = [
  {
    key: "x2",
    label: "x²",
    f: (x) => x * x,
    df: (x) => 2 * x,
    domain: [-3, 3],
    x0: 1,
    yRange: [-2, 9],
  },
  {
    key: "x3",
    label: "x³",
    f: (x) => x * x * x,
    df: (x) => 3 * x * x,
    domain: [-2.2, 2.2],
    x0: 1,
    yRange: [-8, 8],
  },
  {
    key: "sqrt",
    label: "√x",
    f: (x) => Math.sqrt(x),
    df: (x) => 1 / (2 * Math.sqrt(x)),
    domain: [0.01, 6],
    x0: 1,
    yRange: [-1, 3],
    valid: (x) => x > 0,
  },
  {
    key: "inv",
    label: "1/x",
    f: (x) => 1 / x,
    df: (x) => -1 / (x * x),
    domain: [-4, 4],
    x0: 1,
    yRange: [-4, 4],
    valid: (x) => Math.abs(x) > 0.05,
  },
  {
    key: "sin",
    label: "sin(x)",
    f: (x) => Math.sin(x),
    df: (x) => Math.cos(x),
    domain: [-2 * Math.PI, 2 * Math.PI],
    x0: 0.5,
    yRange: [-1.6, 1.6],
  },
  {
    key: "cos",
    label: "cos(x)",
    f: (x) => Math.cos(x),
    df: (x) => -Math.sin(x),
    domain: [-2 * Math.PI, 2 * Math.PI],
    x0: 0.5,
    yRange: [-1.6, 1.6],
  },
  {
    key: "exp",
    label: "eˣ",
    f: (x) => Math.exp(x),
    df: (x) => Math.exp(x),
    domain: [-3, 2],
    x0: 0,
    yRange: [-1, 8],
  },
  {
    key: "ln",
    label: "ln(x)",
    f: (x) => Math.log(x),
    df: (x) => 1 / x,
    domain: [0.05, 6],
    x0: 1,
    yRange: [-3, 2.5],
    valid: (x) => x > 0,
  },
];

const fmt = (n: number) => {
  if (!Number.isFinite(n)) return "—";
  const a = Math.abs(n);
  if (a >= 1000 || (a > 0 && a < 0.01)) return n.toExponential(2);
  return n.toFixed(2);
};

function TangentePage() {
  const [key, setKey] = useState<string>("x2");
  const fn = useMemo(() => FUNCTIONS.find((f) => f.key === key)!, [key]);
  const [x, setX] = useState<number>(fn.x0);

  // Reset x when function changes
  const [prevKey, setPrevKey] = useState(key);
  if (prevKey !== key) {
    setPrevKey(key);
    setX(fn.x0);
  }

  const [xMin, xMax] = fn.domain;
  const [yMin, yMax] = fn.yRange;

  // SVG viewport
  const W = 600;
  const H = 420;
  const pad = 24;

  const sx = (xv: number) =>
    pad + ((xv - xMin) / (xMax - xMin)) * (W - 2 * pad);
  const sy = (yv: number) =>
    pad + (1 - (yv - yMin) / (yMax - yMin)) * (H - 2 * pad);

  // Build curve path, splitting on invalid points (e.g. 1/x at 0)
  const path = useMemo(() => {
    const N = 400;
    let d = "";
    let pen = false;
    for (let i = 0; i <= N; i++) {
      const xv = xMin + (i / N) * (xMax - xMin);
      if (fn.valid && !fn.valid(xv)) {
        pen = false;
        continue;
      }
      const yv = fn.f(xv);
      if (!Number.isFinite(yv) || yv < yMin - 5 || yv > yMax + 5) {
        pen = false;
        continue;
      }
      const X = sx(xv);
      const Y = sy(yv);
      d += `${pen ? "L" : "M"}${X.toFixed(2)} ${Y.toFixed(2)} `;
      pen = true;
    }
    return d.trim();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fn]);

  const validX = !fn.valid || fn.valid(x);
  const fx = validX ? fn.f(x) : NaN;
  const dfx = validX ? fn.df(x) : NaN;

  // Tangent line endpoints: extend across visible x range
  const tangent = useMemo(() => {
    if (!validX || !Number.isFinite(fx) || !Number.isFinite(dfx)) return null;
    const x1 = xMin;
    const x2 = xMax;
    const y1 = fx + dfx * (x1 - x);
    const y2 = fx + dfx * (x2 - x);
    return { x1, y1, x2, y2 };
  }, [x, fx, dfx, validX, xMin, xMax]);

  // Axes ticks
  const xTicks = useMemo(() => {
    const step = niceStep(xMax - xMin);
    const arr: number[] = [];
    for (let t = Math.ceil(xMin / step) * step; t <= xMax; t += step) {
      if (Math.abs(t) < step / 2) t = 0;
      arr.push(Number(t.toFixed(6)));
    }
    return arr;
  }, [xMin, xMax]);
  const yTicks = useMemo(() => {
    const step = niceStep(yMax - yMin);
    const arr: number[] = [];
    for (let t = Math.ceil(yMin / step) * step; t <= yMax; t += step) {
      if (Math.abs(t) < step / 2) t = 0;
      arr.push(Number(t.toFixed(6)));
    }
    return arr;
  }, [yMin, yMax]);

  const axisY0 = sy(0);
  const axisX0 = sx(0);
  const showXAxis = 0 >= yMin && 0 <= yMax;
  const showYAxis = 0 >= xMin && 0 <= xMax;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto max-w-3xl px-6 py-10">
          <Link
            to="/"
            className="text-sm text-muted-foreground transition hover:text-primary"
          >
            ← Toutes les fiches
          </Link>
          <p className="mt-6 text-xs uppercase tracking-[0.2em] text-primary">
            Analyse
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            La tangente, visuellement
          </h1>
          <p className="mt-3 text-muted-foreground">
            Déplace le point jaune sur la courbe : la droite rose est la
            tangente, sa pente est f'(x).
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-8">
        <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
          <div className="flex flex-wrap items-center gap-3">
            <label
              htmlFor="fn-select"
              className="text-sm text-muted-foreground"
            >
              Fonction :
            </label>
            <select
              id="fn-select"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="rounded-md border border-border bg-background px-3 py-1.5 text-sm text-foreground focus:border-primary focus:outline-none"
            >
              {FUNCTIONS.map((f) => (
                <option key={f.key} value={f.key}>
                  f(x) = {f.label}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4 overflow-hidden rounded-lg border border-border bg-black">
            <svg
              viewBox={`0 0 ${W} ${H}`}
              className="block h-auto w-full"
              role="img"
              aria-label={`Courbe de ${fn.label} avec sa tangente`}
            >
              {/* grid ticks */}
              {xTicks.map((t) => (
                <line
                  key={`gx${t}`}
                  x1={sx(t)}
                  x2={sx(t)}
                  y1={pad}
                  y2={H - pad}
                  stroke="#1f2937"
                  strokeWidth={1}
                />
              ))}
              {yTicks.map((t) => (
                <line
                  key={`gy${t}`}
                  x1={pad}
                  x2={W - pad}
                  y1={sy(t)}
                  y2={sy(t)}
                  stroke="#1f2937"
                  strokeWidth={1}
                />
              ))}

              {/* axes */}
              {showXAxis && (
                <line
                  x1={pad}
                  x2={W - pad}
                  y1={axisY0}
                  y2={axisY0}
                  stroke="#9ca3af"
                  strokeWidth={1.2}
                />
              )}
              {showYAxis && (
                <line
                  x1={axisX0}
                  x2={axisX0}
                  y1={pad}
                  y2={H - pad}
                  stroke="#9ca3af"
                  strokeWidth={1.2}
                />
              )}

              {/* tick labels */}
              {showXAxis &&
                xTicks.map((t) =>
                  t === 0 ? null : (
                    <text
                      key={`tx${t}`}
                      x={sx(t)}
                      y={Math.min(H - pad + 14, axisY0 + 14)}
                      textAnchor="middle"
                      fontSize={10}
                      fill="#9ca3af"
                    >
                      {formatTick(t)}
                    </text>
                  ),
                )}
              {showYAxis &&
                yTicks.map((t) =>
                  t === 0 ? null : (
                    <text
                      key={`ty${t}`}
                      x={axisX0 - 6}
                      y={sy(t) + 3}
                      textAnchor="end"
                      fontSize={10}
                      fill="#9ca3af"
                    >
                      {formatTick(t)}
                    </text>
                  ),
                )}

              {/* curve */}
              <path
                d={path}
                fill="none"
                stroke="#e5e7eb"
                strokeWidth={2}
                strokeLinejoin="round"
                strokeLinecap="round"
              />

              {/* tangent */}
              {tangent && (
                <line
                  x1={sx(tangent.x1)}
                  y1={sy(tangent.y1)}
                  x2={sx(tangent.x2)}
                  y2={sy(tangent.y2)}
                  stroke="#ec4899"
                  strokeWidth={2}
                  strokeDasharray="6 5"
                  strokeLinecap="round"
                />
              )}

              {/* moving point */}
              {validX && Number.isFinite(fx) && (
                <>
                  <circle
                    cx={sx(x)}
                    cy={sy(fx)}
                    r={7}
                    fill="#facc15"
                    stroke="#000"
                    strokeWidth={1.5}
                  />
                </>
              )}
            </svg>
          </div>

          <div className="mt-5">
            <label
              htmlFor="x-slider"
              className="flex items-center justify-between text-xs text-muted-foreground"
            >
              <span>x</span>
              <span className="font-mono text-foreground">{fmt(x)}</span>
            </label>
            <input
              id="x-slider"
              type="range"
              min={xMin}
              max={xMax}
              step={(xMax - xMin) / 500}
              value={x}
              onChange={(e) => setX(parseFloat(e.target.value))}
              className="mt-2 w-full accent-pink-500"
            />
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3 text-center">
            <Readout label="x" value={fmt(x)} />
            <Readout label="f(x)" value={fmt(fx)} />
            <Readout label="f'(x)" value={fmt(dfx)} accent />
          </div>
        </div>
      </main>
    </div>
  );
}

function Readout({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-lg border border-border bg-background px-3 py-3">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
      <div
        className={
          "mt-1 font-mono text-base " +
          (accent ? "text-pink-400" : "text-foreground")
        }
      >
        {value}
      </div>
    </div>
  );
}

function niceStep(range: number) {
  const rough = range / 8;
  const pow = Math.pow(10, Math.floor(Math.log10(rough)));
  const n = rough / pow;
  const step = n < 1.5 ? 1 : n < 3 ? 2 : n < 7 ? 5 : 10;
  return step * pow;
}

function formatTick(t: number) {
  if (Math.abs(t) < 1e-9) return "0";
  if (Math.abs(t - Math.PI) < 0.01) return "π";
  if (Math.abs(t + Math.PI) < 0.01) return "−π";
  if (Math.abs(t - 2 * Math.PI) < 0.01) return "2π";
  if (Math.abs(t + 2 * Math.PI) < 0.01) return "−2π";
  if (Math.abs(t - Math.PI / 2) < 0.01) return "π/2";
  if (Math.abs(t + Math.PI / 2) < 0.01) return "−π/2";
  const s = Number.isInteger(t) ? t.toString() : t.toFixed(1);
  return s.replace("-", "−");
}