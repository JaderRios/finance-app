import { Trash2, Wallet } from 'lucide-react';
import Pagination from '../ui/Pagination';
import { formatMoneyByCurrency } from '../../utils/money';

export default function AccountList({
  accounts,
  loading,
  deletingId,
  onDelete,
  currentPage,
  pageSize,
  totalItems,
  onPageChange,
}) {
  return (
    <section className="rounded-[32px] border border-white/60 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/90">
      <div className="mb-5">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Tus cuentas</h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Usa una cuenta por moneda o por origen del dinero.
        </p>
      </div>

      {loading ? (
        <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-300">
          Cargando cuentas...
        </div>
      ) : null}

      {!loading ? (
        <>
        <div className="grid gap-4 md:grid-cols-2">
          {accounts.length === 0 ? (
            <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-300">
              Aun no tienes cuentas registradas.
            </div>
          ) : null}

          {accounts.map((account) => (
            <article
              key={account.id}
              className="rounded-[28px] border border-slate-100 bg-[linear-gradient(180deg,#ffffff,#f8fbff)] p-5 shadow-sm dark:border-slate-800 dark:bg-[linear-gradient(180deg,rgba(30,41,59,0.7),rgba(15,23,42,0.7))]"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="grid size-11 place-items-center rounded-full bg-blue-100 text-blue-700 dark:bg-sky-500/20 dark:text-sky-300">
                    <Wallet size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">{account.name}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {account.currency} · {account.type}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onDelete(account)}
                  disabled={deletingId === account.id}
                  className="inline-flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-70 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300"
                >
                  <Trash2 size={15} />
                  {deletingId === account.id ? 'Ocultando...' : 'Ocultar'}
                </button>
              </div>

              <div className="mt-5">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">Saldo inicial</p>
                <p className="mt-2 text-2xl font-black text-slate-900 dark:text-slate-100">
                  {formatMoneyByCurrency(account.initial_balance, account.currency)}
                </p>
              </div>
            </article>
          ))}
        </div>
        <Pagination
          currentPage={currentPage}
          pageSize={pageSize}
          totalItems={totalItems ?? accounts.length}
          onPageChange={onPageChange}
          itemLabel="cuentas"
        />
        </>
      ) : null}
    </section>
  );
}
