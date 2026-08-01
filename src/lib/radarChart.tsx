// A minimal SVG radar/spider chart — no charting library, just trig. Axes
// are laid out clockwise starting from the top, values are 0-100 mapped to
// radius, with a few concentric rings as a scale reference.
export function RadarChart({
  axes,
  size = 280,
}: {
  axes: { label: string; value: number }[];
  size?: number;
}) {
  const n = axes.length;
  if (n < 3) return null;

  // Extra horizontal room beyond the plot itself, so long labels like
  // "Programmation" on the left/right axes don't clip against the viewBox
  // edge (the top/bottom axes have short labels and need less).
  const padX = 60;
  const padY = 24;
  const width = size + padX * 2;
  const height = size + padY * 2;
  const cx = width / 2;
  const cy = height / 2;
  const maxRadius = size / 2 - 20;
  const rings = [0.25, 0.5, 0.75, 1];

  const angleFor = (i: number) => -Math.PI / 2 + (i * 2 * Math.PI) / n;
  const pointFor = (i: number, frac: number) => {
    const a = angleFor(i);
    return { x: cx + maxRadius * frac * Math.cos(a), y: cy + maxRadius * frac * Math.sin(a) };
  };

  const dataPoints = axes.map((ax, i) => pointFor(i, Math.max(0, Math.min(100, ax.value)) / 100));
  const dataPath = dataPoints.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="mx-auto w-full max-w-sm"
      role="img"
      aria-label="Radar de progression par catégorie"
    >
      {rings.map((frac) => {
        const ringPoints = axes.map((_, i) => pointFor(i, frac));
        return (
          <polygon
            key={frac}
            points={ringPoints.map((p) => `${p.x},${p.y}`).join(" ")}
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.15"
            strokeWidth="1"
          />
        );
      })}

      {axes.map((_, i) => {
        const edge = pointFor(i, 1);
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={edge.x}
            y2={edge.y}
            stroke="currentColor"
            strokeOpacity="0.15"
            strokeWidth="1"
          />
        );
      })}

      <polygon
        points={dataPath}
        fill="#5eead4"
        fillOpacity="0.25"
        stroke="#5eead4"
        strokeWidth="2"
      />
      {dataPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3" fill="#5eead4" />
      ))}

      {axes.map((ax, i) => {
        const labelPoint = pointFor(i, 1.22);
        return (
          <text
            key={ax.label}
            x={labelPoint.x}
            y={labelPoint.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="11"
            fill="currentColor"
            className="fill-foreground"
          >
            {ax.label}
          </text>
        );
      })}
    </svg>
  );
}
