import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { formatTransactionAmount } from '../../utils/money';

function TypeBadge({ type }) {
  const isIncome = type === 'income';

  return (
    <div
      className={[
        'grid size-10 place-items-center rounded-full',
        isIncome
          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300'
          : 'bg-orange-100 text-orange-700 dark:bg-orange-950/30 dark:text-orange-300',
      ].join(' ')}
    >
      {isIncome ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
    </div>
  );
}

export default function RecentTransactions({ transactions }) {
  return (
    <section className="rounded-[26px] border border-white/60 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/90 sm:rounded-[30px] sm:p-5 lg:rounded-[32px] lg:p-6">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 sm:text-2xl">Actividad reciente</h3>
        <span className="hidden text-sm font-medium text-blue-600 dark:text-sky-300 sm:block">Ultimos movimientos</span>
      </div>

      <div className="space-y-4">
        {transactions.length === 0 ? (
          <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-300">
            Aun no hay movimientos registrados.
          </div>
        ) : null}

        {transactions.map((transaction) => (
          <article
            key={transaction.id}
            className="flex flex-col gap-3 rounded-2xl px-2 py-3 transition hover:bg-slate-50 dark:hover:bg-slate-800/70 md:flex-row md:items-center md:justify-between"
          >
            <div className="flex items-center gap-3">
              <TypeBadge type={transaction.type} />
              <div>
                <p className="font-semibold text-slate-900 dark:text-slate-100">
                  {transaction.categories?.name ?? 'Sin categoria'}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {transaction.description || 'Movimiento registrado'} · {transaction.date}
                </p>
              </div>
            </div>

            <p className={`text-base font-bold sm:text-lg ${transaction.type === 'income' ? 'text-emerald-600 dark:text-emerald-300' : 'text-slate-900 dark:text-slate-100'}`}>
              {transaction.type === 'income' ? '+' : '-'}
              {formatTransactionAmount(transaction)}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
