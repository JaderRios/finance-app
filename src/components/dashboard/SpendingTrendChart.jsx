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
    <section className="rounded-[26px] border border-white/60 bg-[linear-gradient(180deg,#ffffff,#f7faff)] p-4 shadow-sm dark:border-slate-800 dark:bg-[linear-gradient(180deg,rgba(15,23,42,0.96),rgba(15,23,42,0.82))] sm:rounded-[30px] sm:p-5 lg:rounded-[32px] lg:p-6">
      <div className="mb-4 flex items-center justify-between lg:mb-5">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 sm:text-2xl">Gasto de los ultimos 7 dias</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Te ayuda a detectar si tus gastos van subiendo o bajando.
          </p>
        </div>
      </div>

      <div className="relative h-60 overflow-hidden rounded-[24px] bg-[linear-gradient(180deg,#eff5ff_0%,#f8fbff_100%)] dark:bg-[linear-gradient(180deg,rgba(30,41,59,0.65),rgba(15,23,42,0.95))] sm:h-72 sm:rounded-[28px]">
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

        <div className="absolute inset-x-2 bottom-3 grid grid-cols-7 gap-1 sm:inset-x-4 sm:bottom-4 sm:gap-2">
          {points.map((point) => (
            <div key={point.label} className="text-center">
              <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 sm:text-xs">{point.label}</p>
              <p className="mt-1 hidden text-xs text-slate-700 dark:text-slate-200 sm:block">
                {formatMoneyByCurrency(point.value, currency)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
