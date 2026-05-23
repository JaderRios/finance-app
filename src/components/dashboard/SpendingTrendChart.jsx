import { formatMoneyByCurrency } from '../../utils/money';

function buildPath(points, width, height, maxValue) {
  if (points.length === 0) {
    return '';
  }

  return points
    .map((point, index) => {
      const x = (index / Math.max(points.length - 1, 1)) * width;
      const y = height - (point.value / Math.max(maxValue, 1)) * height;
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');
}

export default function SpendingTrendChart({ points, currency }) {
  const width = 620;
  const height = 220;
  const maxValue = Math.max(...points.map((point) => point.value), 1);
  const linePath = buildPath(points, width, height, maxValue);
  const areaPath = `${linePath} L ${width} ${height} L 0 ${height} Z`;

  return (
    <section className="rounded-[32px] border border-white/60 bg-[linear-gradient(180deg,#ffffff,#f7faff)] p-6 shadow-sm dark:border-slate-800 dark:bg-[linear-gradient(180deg,rgba(15,23,42,0.96),rgba(15,23,42,0.82))]">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Gasto de los ultimos 7 dias</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Te ayuda a detectar si tus gastos van subiendo o bajando.
          </p>
        </div>
      </div>

      <div className="relative h-72 overflow-hidden rounded-[28px] bg-[linear-gradient(180deg,#eff5ff_0%,#f8fbff_100%)] dark:bg-[linear-gradient(180deg,rgba(30,41,59,0.65),rgba(15,23,42,0.95))]">
        <svg viewBox={`0 0 ${width} ${height}`} className="absolute inset-0 h-full w-full">
          {[0.25, 0.5, 0.75].map((line) => (
            <line
              key={line}
              x1="0"
              x2={width}
              y1={height * line}
              y2={height * line}
              stroke="rgba(148,163,184,0.2)"
              strokeDasharray="6 10"
            />
          ))}
          <path d={areaPath} fill="rgba(37,99,235,0.12)" />
          <path d={linePath} fill="none" stroke="#2563eb" strokeWidth="4" strokeLinecap="round" />
          {points.map((point, index) => {
            const x = (index / Math.max(points.length - 1, 1)) * width;
            const y = height - (point.value / Math.max(maxValue, 1)) * height;

            return (
              <circle
                key={point.label}
                cx={x}
                cy={y}
                r={index === points.length - 1 ? '6' : '4'}
                fill="white"
                stroke="#2563eb"
                strokeWidth="3"
              />
            );
          })}
        </svg>

        <div className="absolute inset-x-4 bottom-4 grid grid-cols-7 gap-2">
          {points.map((point) => (
            <div key={point.label} className="text-center">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{point.label}</p>
              <p className="mt-1 text-xs text-slate-700 dark:text-slate-200">
                {formatMoneyByCurrency(point.value, currency)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
