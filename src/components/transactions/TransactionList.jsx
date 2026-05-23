import { PencilLine } from 'lucide-react';
import { formatTransactionAmount } from '../../utils/money';

function TypeBadge({ type }) {
  return (
    <span
      className={[
        'rounded-full px-3 py-1 text-xs font-semibold',
        type === 'income'
          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300'
          : 'bg-orange-50 text-orange-700 dark:bg-orange-950/30 dark:text-orange-300',
      ].join(' ')}
    >
      {type === 'income' ? 'Ingreso' : 'Gasto'}
    </span>
  );
}

export default function TransactionList({ transactions, loading, error, onEdit }) {
  return (
    <section className="rounded-[32px] border border-white/60 bg-white/95 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/90 sm:p-6">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Historial de movimientos</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Revisa, corrige y organiza tus ingresos y gastos sin perder contexto.
          </p>
        </div>
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
          {transactions.length} {transactions.length === 1 ? 'movimiento' : 'movimientos'}
        </p>
      </div>

      {loading ? (
        <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-300">
          Cargando movimientos...
        </div>
      ) : null}
      {error ? (
        <div className="rounded-2xl bg-rose-50 p-4 text-sm text-rose-700 dark:bg-rose-950/30 dark:text-rose-300">
          {error}
        </div>
      ) : null}

      {!loading && !error ? (
        <>
          <div className="space-y-3 lg:hidden">
            {transactions.length === 0 ? (
              <div className="rounded-[28px] border border-dashed border-slate-200 bg-slate-50/90 p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-400">
                No se encontraron movimientos.
              </div>
            ) : null}

            {transactions.map((transaction) => (
              <article
                key={transaction.id}
                className="rounded-[28px] border border-slate-100 bg-[linear-gradient(180deg,#ffffff,#f8fbff)] p-4 shadow-sm dark:border-slate-800 dark:bg-[linear-gradient(180deg,rgba(30,41,59,0.82),rgba(15,23,42,0.9))]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                      {transaction.date}
                    </p>
                    <p className="mt-2 text-base font-semibold text-slate-900 dark:text-slate-100">
                      {transaction.description || 'Sin descripcion'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onEdit?.(transaction)}
                    className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                  >
                    <PencilLine size={15} />
                    Editar
                  </button>
                </div>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <TypeBadge type={transaction.type} />
                  <p className="text-lg font-black tracking-tight text-slate-900 dark:text-slate-100">
                    {formatTransactionAmount(transaction)}
                  </p>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-2xl bg-slate-50/90 px-3 py-3 dark:bg-slate-800/70">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
                      Categoria
                    </p>
                    <p className="mt-1 text-slate-700 dark:text-slate-200">
                      {transaction.categories?.name ?? 'Sin categoria'}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-slate-50/90 px-3 py-3 dark:bg-slate-800/70">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
                      Cuenta
                    </p>
                    <p className="mt-1 text-slate-700 dark:text-slate-200">
                      {transaction.accounts?.name ?? 'Sin cuenta'}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="hidden overflow-hidden rounded-3xl border border-slate-100 dark:border-slate-800 lg:block">
            <table className="min-w-full divide-y divide-slate-100 text-sm dark:divide-slate-800">
              <thead className="bg-slate-50 text-left text-slate-500 dark:bg-slate-800/70 dark:text-slate-400">
                <tr>
                  <th className="px-4 py-3 font-semibold">Fecha</th>
                  <th className="px-4 py-3 font-semibold">Tipo</th>
                  <th className="px-4 py-3 font-semibold">Categoria</th>
                  <th className="px-4 py-3 font-semibold">Descripcion</th>
                  <th className="px-4 py-3 font-semibold">Cuenta</th>
                  <th className="px-4 py-3 text-right font-semibold">Monto</th>
                  <th className="px-4 py-3 text-right font-semibold">Accion</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white dark:divide-slate-800 dark:bg-slate-900/60">
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-4 py-6 text-center text-slate-500 dark:text-slate-400">
                      No se encontraron movimientos.
                    </td>
                  </tr>
                ) : null}

                {transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="px-4 py-4 text-slate-700 dark:text-slate-200">{transaction.date}</td>
                    <td className="px-4 py-4">
                      <TypeBadge type={transaction.type} />
                    </td>
                    <td className="px-4 py-4 text-slate-700 dark:text-slate-200">
                      {transaction.categories?.name ?? 'Sin categoria'}
                    </td>
                    <td className="px-4 py-4 text-slate-600 dark:text-slate-400">
                      {transaction.description || 'Sin descripcion'}
                    </td>
                    <td className="px-4 py-4 text-slate-600 dark:text-slate-400">
                      {transaction.accounts?.name ?? 'Sin cuenta'}
                    </td>
                    <td className="px-4 py-4 text-right font-semibold text-slate-900 dark:text-slate-100">
                      {formatTransactionAmount(transaction)}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => onEdit?.(transaction)}
                        className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
                      >
                        <PencilLine size={15} />
                        Editar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : null}
    </section>
  );
}
