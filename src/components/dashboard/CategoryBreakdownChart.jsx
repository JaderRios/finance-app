import { formatMoneyByCurrency } from '../../utils/money';

export default function CategoryBreakdownChart({ categories, totalExpense, currency }) {
  return (
    <section className="rounded-[26px] border border-white/60 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/90 sm:rounded-[30px] sm:p-5 lg:rounded-[32px] lg:p-6">
      <div className="mb-5">
        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 sm:text-2xl">En que gastas mas</h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Las categorias que mas peso tienen dentro de tus gastos.
        </p>
      </div>

      <div className="space-y-4">
        {categories.length === 0 ? (
          <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-300">
            Aun no hay suficientes gastos para construir este resumen.
          </div>
        ) : null}

        {categories.map((category, index) => {
          const share = totalExpense > 0 ? (category.total / totalExpense) * 100 : 0;
          const color = ['#2563eb', '#4f46e5', '#0ea5e9', '#14b8a6', '#f97316'][index % 5];

          return (
            <article key={category.name} className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">{category.name}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{share.toFixed(1)}% del total</p>
                </div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                  {formatMoneyByCurrency(category.total, currency)}
                </p>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${Math.max(share, 6)}%`, backgroundColor: color }}
                />
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
