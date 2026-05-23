import { formatMoneyByCurrency } from '../../utils/money';

export default function InsightCards({ topCategory, averageExpense, savingsRate, currency }) {
  const cards = [
    {
      title: 'Categoria principal',
      value: topCategory ? topCategory.name : 'Sin datos',
      helper: topCategory ? formatMoneyByCurrency(topCategory.total, currency) : 'Registra mas movimientos',
    },
    {
      title: 'Gasto diario promedio',
      value: formatMoneyByCurrency(averageExpense, currency),
      helper: 'Promedio de tus gastos recientes',
    },
    {
      title: 'Capacidad de ahorro',
      value: `${savingsRate.toFixed(0)}%`,
      helper: 'Porcentaje que logras conservar',
    },
  ];

  return (
    <section className="grid gap-4 md:grid-cols-3">
      {cards.map((card) => (
        <article
          key={card.title}
          className="rounded-[28px] border border-white/60 bg-white/90 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/90"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
            {card.title}
          </p>
          <p className="mt-3 text-2xl font-black text-slate-900 dark:text-slate-100">{card.value}</p>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{card.helper}</p>
        </article>
      ))}
    </section>
  );
}
