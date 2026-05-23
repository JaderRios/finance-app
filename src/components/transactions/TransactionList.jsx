import { formatTransactionAmount } from '../../utils/money';

export default function TransactionList({ transactions, loading, error }) {
  return (
    <section className="rounded-[32px] border border-white/60 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/90">
      <div className="mb-5">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Historial de movimientos</h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Revisa con detalle cada ingreso y cada gasto de tu cuenta.
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
        <div className="overflow-x-auto rounded-3xl border border-slate-100 dark:border-slate-800">
          <table className="min-w-full divide-y divide-slate-100 text-sm dark:divide-slate-800">
            <thead className="bg-slate-50 text-left text-slate-500 dark:bg-slate-800/70 dark:text-slate-400">
              <tr>
                <th className="px-4 py-3 font-semibold">Fecha</th>
                <th className="px-4 py-3 font-semibold">Tipo</th>
                <th className="px-4 py-3 font-semibold">Categoria</th>
                <th className="px-4 py-3 font-semibold">Descripcion</th>
                <th className="px-4 py-3 text-right font-semibold">Monto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white dark:divide-slate-800 dark:bg-slate-900/60">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-4 py-6 text-center text-slate-500 dark:text-slate-400">
                    No se encontraron movimientos.
                  </td>
                </tr>
              ) : null}

              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="px-4 py-4 text-slate-700 dark:text-slate-200">{transaction.date}</td>
                  <td className="px-4 py-4">
                    <span
                      className={[
                        'rounded-full px-3 py-1 text-xs font-semibold',
                        transaction.type === 'income'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300'
                          : 'bg-orange-50 text-orange-700 dark:bg-orange-950/30 dark:text-orange-300',
                      ].join(' ')}
                    >
                      {transaction.type === 'income' ? 'Ingreso' : 'Gasto'}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-slate-700 dark:text-slate-200">
                    {transaction.categories?.name ?? 'Sin categoria'}
                  </td>
                  <td className="px-4 py-4 text-slate-600 dark:text-slate-400">
                    {transaction.description || 'Sin descripcion'}
                  </td>
                  <td className="px-4 py-4 text-right font-semibold text-slate-900 dark:text-slate-100">
                    {formatTransactionAmount(transaction)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </section>
  );
}
